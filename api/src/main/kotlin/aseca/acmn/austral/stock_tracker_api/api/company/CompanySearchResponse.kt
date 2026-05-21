package aseca.acmn.austral.stock_tracker_api.api.company

data class CompanySearchResponse(
    val ticker: String,
    val name: String,
    val cik: String,
)
