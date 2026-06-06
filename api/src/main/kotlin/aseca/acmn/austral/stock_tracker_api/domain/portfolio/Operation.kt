package aseca.acmn.austral.stock_tracker_api.domain.portfolio

import java.math.BigDecimal
import java.time.Instant
import java.util.UUID

data class Operation(
    val id: UUID,
    val type: OperationType,
    val ticker: String,
    val quantity: Int,
    val price: BigDecimal,
    val executedAt: Instant,
)
