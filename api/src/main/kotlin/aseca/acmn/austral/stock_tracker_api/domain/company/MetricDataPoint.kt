package aseca.acmn.austral.stock_tracker_api.domain.company

import java.math.BigDecimal

data class MetricDataPoint(
    val period: String,
    val value: BigDecimal,
)
