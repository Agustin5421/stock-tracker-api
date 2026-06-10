package aseca.acmn.austral.stock_tracker_api.infrastructure.price

import aseca.acmn.austral.stock_tracker_api.application.price.TriggerPriceUpdateUseCase
import org.slf4j.LoggerFactory
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.stereotype.Component

/**
 * Triggers the price update batch once on application startup.
 * Disabled by default; enable on the host with `batch.run-on-startup=true`
 * (env `BATCH_RUN_ON_STARTUP`). Left off in tests/CI and in Docker, where the
 * dedicated `batch` container handles startup runs instead.
 */
@Component
@ConditionalOnProperty(name = ["batch.run-on-startup"], havingValue = "true")
class PriceUpdateStartupRunner(
    private val triggerPriceUpdateUseCase: TriggerPriceUpdateUseCase,
) : ApplicationRunner {
    private val logger = LoggerFactory.getLogger(PriceUpdateStartupRunner::class.java)

    override fun run(args: ApplicationArguments) {
        logger.info("Running price update batch on startup")
        triggerPriceUpdateUseCase.trigger()
    }
}
