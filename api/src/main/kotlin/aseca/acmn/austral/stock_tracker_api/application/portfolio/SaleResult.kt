package aseca.acmn.austral.stock_tracker_api.application.portfolio

import aseca.acmn.austral.stock_tracker_api.domain.portfolio.Position
import java.math.BigDecimal

data class SaleResult(
    val position: Position?,
    val priceUsed: BigDecimal,
)
