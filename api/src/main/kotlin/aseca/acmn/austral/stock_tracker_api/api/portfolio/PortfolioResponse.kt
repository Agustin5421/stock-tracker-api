package aseca.acmn.austral.stock_tracker_api.api.portfolio

import java.math.BigDecimal
import java.time.Instant

data class PortfolioResponse(
    val positions: List<PositionViewResponse>,
    val totalValue: BigDecimal,
    val pricesUpdatedAt: Instant?,
)
