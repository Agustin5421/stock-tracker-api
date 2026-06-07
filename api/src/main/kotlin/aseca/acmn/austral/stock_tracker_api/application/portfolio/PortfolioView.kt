package aseca.acmn.austral.stock_tracker_api.application.portfolio

import java.math.BigDecimal
import java.time.Instant

data class PositionView(
    val ticker: String,
    val quantity: Int,
    val latestPrice: BigDecimal?,
    val currentValue: BigDecimal?,
    val avgCost: BigDecimal? = null,
    val unrealizedPnl: BigDecimal? = null,
    val unrealizedPnlPercent: BigDecimal? = null,
)

data class PortfolioView(
    val positions: List<PositionView>,
    val totalValue: BigDecimal,
    val pricesUpdatedAt: Instant? = null,
)
