package aseca.acmn.austral.stock_tracker_api.application.company

import aseca.acmn.austral.stock_tracker_api.domain.company.CompanySearchResult

class SearchCompaniesService(
    private val edgar: EdgarPort,
) : SearchCompaniesUseCase {
    override fun search(query: String): List<CompanySearchResult> {
        if (query.isBlank()) return emptyList()
        return try {
            if (isTicker(query)) {
                edgar.searchByTicker(query.trim().uppercase())
            } else {
                edgar.searchByName(query.trim())
            }
        } catch (e: Exception) {
            emptyList()
        }
    }

    private fun isTicker(query: String) = query.trim().matches(Regex("[A-Za-z]{1,5}"))
}
