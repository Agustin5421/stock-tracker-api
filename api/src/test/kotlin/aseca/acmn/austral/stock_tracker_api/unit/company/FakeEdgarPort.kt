package aseca.acmn.austral.stock_tracker_api.unit.company

import aseca.acmn.austral.stock_tracker_api.application.company.EdgarPort
import aseca.acmn.austral.stock_tracker_api.domain.company.CompanySearchResult

class FakeEdgarPort : EdgarPort {
    var allResults: List<CompanySearchResult> = emptyList()
    var tickerResults: Map<String, List<CompanySearchResult>> = emptyMap()
    var nameResults: Map<String, List<CompanySearchResult>> = emptyMap()
    var shouldThrow: Boolean = false

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
}
