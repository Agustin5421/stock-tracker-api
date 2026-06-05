package aseca.acmn.austral.stock_tracker_api.infrastructure.price

import aseca.acmn.austral.stock_tracker_api.application.price.TriggerPriceUpdateUseCase
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.io.File

@Component
class ProcessPriceUpdateRunner(
    @Value("\${batch.python-bin:}") private val configuredPython: String,
) : TriggerPriceUpdateUseCase {
    private val logger = LoggerFactory.getLogger(ProcessPriceUpdateRunner::class.java)

    override fun trigger() {
        val script = resolveScript()
        if (script == null) {
            logger.error("Cannot locate batch/update_prices.py from {}", System.getProperty("user.dir"))
            return
        }
        val python = resolvePython()
        logger.info("Triggering price update batch: {} {}", python, script.path)
        val process =
            ProcessBuilder(python, script.path)
                .directory(script.parentFile.parentFile)
                .redirectErrorStream(true)
                .start()
        Thread {
            process.inputStream.bufferedReader().useLines { lines ->
                lines.forEach { logger.info("[price-batch] {}", it) }
            }
            logger.info("Price update batch exited with code {}", process.waitFor())
        }.apply {
            isDaemon = true
            name = "price-update-batch"
        }.start()
    }

    /** Walks up from the working dir to find batch/update_prices.py (repo layout: <root>/batch, <root>/api). */
    private fun resolveScript(): File? {
        var dir: File? = File(System.getProperty("user.dir")).absoluteFile
        repeat(MAX_PARENT_LEVELS) {
            val candidate = dir?.resolve("batch/update_prices.py")
            if (candidate != null && candidate.isFile) return candidate
            dir = dir?.parentFile
        }
        return null
    }

    /** Resolves a usable python executable, since the JVM PATH may not include Homebrew/usr paths. */
    private fun resolvePython(): String {
        if (configuredPython.isNotBlank()) return configuredPython
        return PYTHON_CANDIDATES.firstOrNull { File(it).canExecute() } ?: "python3"
    }

    private companion object {
        const val MAX_PARENT_LEVELS = 5
        val PYTHON_CANDIDATES =
            listOf(
                "/opt/homebrew/bin/python3",
                "/usr/local/bin/python3",
                "/usr/bin/python3",
            )
    }
}
