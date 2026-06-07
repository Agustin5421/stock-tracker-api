package aseca.acmn.austral.stock_tracker_api.api.portfolio

import java.math.BigDecimal

data class PortfolioResponse(
    val positions: List<PositionViewResponse>,
    val totalValue: BigDecimal,
)
