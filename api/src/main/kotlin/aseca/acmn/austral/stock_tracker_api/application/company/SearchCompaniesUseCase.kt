package aseca.acmn.austral.stock_tracker_api.application.company

import aseca.acmn.austral.stock_tracker_api.domain.company.CompanySearchResult

interface SearchCompaniesUseCase {
    fun search(query: String): List<CompanySearchResult>
}
