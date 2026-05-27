package aseca.acmn.austral.stock_tracker_api.application.company

import aseca.acmn.austral.stock_tracker_api.domain.company.CompanyMetrics
import aseca.acmn.austral.stock_tracker_api.domain.company.CompanySearchResult

interface EdgarPort {
    fun searchAll(): List<CompanySearchResult>

    fun searchByTicker(query: String): List<CompanySearchResult>

    fun searchByName(name: String): List<CompanySearchResult>

    fun getMetrics(cik: String): CompanyMetrics
}
