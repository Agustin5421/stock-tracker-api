package aseca.acmn.austral.stock_tracker_api.api.company

data class FilingResponse(
    val type: String,
    val filingDate: String,
    val accessionNumber: String,
)
