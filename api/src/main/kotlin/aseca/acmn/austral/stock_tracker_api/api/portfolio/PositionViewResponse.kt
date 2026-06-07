package aseca.acmn.austral.stock_tracker_api.api.portfolio

import java.math.BigDecimal

data class PositionViewResponse(
    val ticker: String,
    val quantity: Int,
    val latestPrice: BigDecimal?,
    val currentValue: BigDecimal?,
    val avgCost: BigDecimal? = null,
    val unrealizedPnl: BigDecimal? = null,
    val unrealizedPnlPercent: BigDecimal? = null,
)
