package aseca.acmn.austral.stock_tracker_api.unit.application.company

import aseca.acmn.austral.stock_tracker_api.application.company.CompanyNotFoundException
import aseca.acmn.austral.stock_tracker_api.application.company.EdgarException
import aseca.acmn.austral.stock_tracker_api.application.company.EdgarPort
import aseca.acmn.austral.stock_tracker_api.domain.company.CompanyMetrics
import aseca.acmn.austral.stock_tracker_api.domain.company.CompanySearchResult

class FakeEdgarPort : EdgarPort {
    var allResults: List<CompanySearchResult> = emptyList()
    var tickerResults: Map<String, List<CompanySearchResult>> = emptyMap()
    var nameResults: Map<String, List<CompanySearchResult>> = emptyMap()
    var shouldThrow: Boolean = false
    var metricsResult: CompanyMetrics? = null
    var metricsThrowsNotFound: Boolean = false

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
}
