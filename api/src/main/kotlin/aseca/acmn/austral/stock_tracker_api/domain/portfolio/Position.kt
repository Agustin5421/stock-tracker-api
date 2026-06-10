package aseca.acmn.austral.stock_tracker_api.domain.portfolio

import java.util.UUID

data class Position(
    val id: UUID,
    val ticker: String,
    val quantity: Int,
)
