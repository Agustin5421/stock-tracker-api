package aseca.acmn.austral.stock_tracker_api.domain.company

import java.math.BigDecimal

data class CompanyMetrics(
    val revenue: Long?,
    val netIncome: Long?,
    val eps: BigDecimal?,
    val totalAssets: Long?,
    val totalLiabilities: Long?,
)
