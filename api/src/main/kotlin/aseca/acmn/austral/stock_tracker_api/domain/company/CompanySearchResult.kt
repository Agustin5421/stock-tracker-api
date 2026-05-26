package aseca.acmn.austral.stock_tracker_api.domain.company

data class CompanySearchResult(
    val ticker: String,
    val name: String,
    val cik: String,
)
