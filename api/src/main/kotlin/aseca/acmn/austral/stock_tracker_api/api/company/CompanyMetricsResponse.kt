package aseca.acmn.austral.stock_tracker_api.api.company

import java.math.BigDecimal

data class CompanyMetricsResponse(
    val revenue: Long?,
    val netIncome: Long?,
    val eps: BigDecimal?,
    val totalAssets: Long?,
    val totalLiabilities: Long?,
)
