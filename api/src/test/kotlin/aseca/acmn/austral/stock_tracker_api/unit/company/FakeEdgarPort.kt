package aseca.acmn.austral.stock_tracker_api.unit.company

import aseca.acmn.austral.stock_tracker_api.application.company.EdgarPort
import aseca.acmn.austral.stock_tracker_api.domain.company.CompanySearchResult

class FakeEdgarPort : EdgarPort {
    var tickerResults: Map<String, List<CompanySearchResult>> = emptyMap()
    var nameResults: Map<String, List<CompanySearchResult>> = emptyMap()
    var shouldThrow: Boolean = false

    override fun searchByTicker(ticker: String): List<CompanySearchResult> {
        if (shouldThrow) throw RuntimeException("EDGAR unavailable")
        return tickerResults[ticker] ?: emptyList()
    }

    override fun searchByName(name: String): List<CompanySearchResult> {
        if (shouldThrow) throw RuntimeException("EDGAR unavailable")
        return nameResults[name] ?: emptyList()
    }
}
