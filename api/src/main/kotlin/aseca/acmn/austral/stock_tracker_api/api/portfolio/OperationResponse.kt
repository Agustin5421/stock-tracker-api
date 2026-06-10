package aseca.acmn.austral.stock_tracker_api.api.portfolio

import aseca.acmn.austral.stock_tracker_api.domain.portfolio.OperationType
import java.math.BigDecimal
import java.time.Instant

data class OperationResponse(
    val type: OperationType,
    val ticker: String,
    val quantity: Int,
    val price: BigDecimal,
    val executedAt: Instant,
)
