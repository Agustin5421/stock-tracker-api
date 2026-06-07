package aseca.acmn.austral.stock_tracker_api.application.portfolio

import java.math.BigDecimal

data class PositionView(
    val ticker: String,
    val quantity: Int,
    val latestPrice: BigDecimal?,
    val currentValue: BigDecimal?,
)

data class PortfolioView(
    val positions: List<PositionView>,
    val totalValue: BigDecimal,
)
