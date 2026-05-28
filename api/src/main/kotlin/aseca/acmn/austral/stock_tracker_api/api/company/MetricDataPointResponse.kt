package aseca.acmn.austral.stock_tracker_api.api.company

import java.math.BigDecimal

data class MetricDataPointResponse(
    val period: String,
    val value: BigDecimal,
)
