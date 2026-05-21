package aseca.acmn.austral.stock_tracker_api.application.company

import aseca.acmn.austral.stock_tracker_api.domain.company.CompanySearchResult

interface EdgarPort {
    fun searchByTicker(ticker: String): List<CompanySearchResult>

    fun searchByName(name: String): List<CompanySearchResult>
}
