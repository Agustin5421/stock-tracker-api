package aseca.acmn.austral.stock_tracker_api.application.watchlist

import aseca.acmn.austral.stock_tracker_api.domain.watchlist.WatchlistItem
import java.util.UUID

interface WatchlistRepository {
    fun save(item: WatchlistItem): WatchlistItem

    fun delete(
        userId: UUID,
        ticker: String,
    )

    fun findByUserId(userId: UUID): List<WatchlistItem>

    fun existsByUserIdAndTicker(
        userId: UUID,
        ticker: String,
    ): Boolean
}
