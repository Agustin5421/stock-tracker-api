package aseca.acmn.austral.stock_tracker_api.application.company

class CompanyNotFoundException(
    val cik: String,
) : RuntimeException("Company not found for CIK: $cik")
