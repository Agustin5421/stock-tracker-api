package aseca.acmn.austral.stock_tracker_api.domain.company

data class Filing(
    val type: String,
    val filingDate: String,
    val accessionNumber: String,
)
