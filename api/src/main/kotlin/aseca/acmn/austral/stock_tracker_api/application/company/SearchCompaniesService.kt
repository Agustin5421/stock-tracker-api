package aseca.acmn.austral.stock_tracker_api.application.company

import aseca.acmn.austral.stock_tracker_api.domain.company.CompanySearchResult

class SearchCompaniesService(
    private val edgar: EdgarPort,
) : SearchCompaniesUseCase {
    override fun search(query: String): List<CompanySearchResult> =
        try {
            if (query.isBlank()) {
                edgar.searchAll()
            } else {
                val q = query.trim()
                val tickerMatches = edgar.searchByTicker(q)
                val nameMatches = edgar.searchByName(q)
                val seen = mutableSetOf<String>()
                (tickerMatches + nameMatches).filter { seen.add(it.cik) }
            }
        } catch (e: Exception) {
            emptyList()
        }
}
