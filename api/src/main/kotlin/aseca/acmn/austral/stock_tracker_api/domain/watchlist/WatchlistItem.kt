package aseca.acmn.austral.stock_tracker_api.domain.watchlist

import java.util.UUID

data class WatchlistItem(
    val id: UUID,
    val userId: UUID,
    val ticker: String,
    val name: String,
    val cik: String,
)
