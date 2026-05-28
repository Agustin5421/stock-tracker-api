package aseca.acmn.austral.stock_tracker_api.integration.api.company

import aseca.acmn.austral.stock_tracker_api.application.company.CompanyNotFoundException
import aseca.acmn.austral.stock_tracker_api.application.company.EdgarException
import aseca.acmn.austral.stock_tracker_api.application.company.EdgarPort
import aseca.acmn.austral.stock_tracker_api.application.company.EdgarUnavailableException
import aseca.acmn.austral.stock_tracker_api.domain.company.CompanyMetrics
import aseca.acmn.austral.stock_tracker_api.domain.company.CompanySearchResult
import aseca.acmn.austral.stock_tracker_api.domain.company.Filing
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Primary

@TestConfiguration
class FakeEdgarPortConfig {
    @Bean
    @Primary
    fun fakeEdgarPort(): FakeEdgarPort = FakeEdgarPort()
}

class FakeEdgarPort : EdgarPort {
    var allResults: List<CompanySearchResult> = emptyList()
    var tickerResults: Map<String, List<CompanySearchResult>> = emptyMap()
    var nameResults: Map<String, List<CompanySearchResult>> = emptyMap()
    var shouldThrow: Boolean = false
    var metricsResult: CompanyMetrics? = null
    var metricsThrowsNotFound: Boolean = false
    var filingsResult: List<Filing> = emptyList()
    var filingsThrowsNotFound: Boolean = false
    var filingsThrowsUnavailable: Boolean = false

    override fun searchAll(): List<CompanySearchResult> {
        if (shouldThrow) throw RuntimeException("EDGAR unavailable")
        return allResults
    }

    override fun searchByTicker(query: String): List<CompanySearchResult> {
        if (shouldThrow) throw RuntimeException("EDGAR unavailable")
        return tickerResults[query] ?: emptyList()
    }

    override fun searchByName(name: String): List<CompanySearchResult> {
        if (shouldThrow) throw RuntimeException("EDGAR unavailable")
        return nameResults[name] ?: emptyList()
    }

    override fun getMetrics(cik: String): CompanyMetrics =
        when {
            metricsThrowsNotFound -> throw CompanyNotFoundException(cik)
            metricsResult != null -> metricsResult!!
            else -> throw EdgarException("No metrics configured")
        }

    override fun getRecentFilings(cik: String): List<Filing> =
        when {
            filingsThrowsNotFound -> throw CompanyNotFoundException(cik)
            filingsThrowsUnavailable -> throw EdgarUnavailableException("EDGAR unavailable")
            else -> filingsResult
        }
}
