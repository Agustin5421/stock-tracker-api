package aseca.acmn.austral.stock_tracker_api.unit.application.watchlist

import aseca.acmn.austral.stock_tracker_api.application.watchlist.WatchlistRepository
import aseca.acmn.austral.stock_tracker_api.domain.watchlist.WatchlistItem
import java.util.UUID

class InMemoryWatchlistRepository : WatchlistRepository {
    private val store = mutableListOf<WatchlistItem>()

    override fun save(item: WatchlistItem): WatchlistItem {
        store.removeIf { it.userId == item.userId && it.ticker == item.ticker }
        store.add(item)
        return item
    }

    override fun delete(
        userId: UUID,
        ticker: String,
    ) {
        store.removeIf { it.userId == userId && it.ticker == ticker }
    }

    override fun findByUserId(userId: UUID): List<WatchlistItem> = store.filter { it.userId == userId }

    override fun existsByUserIdAndTicker(
        userId: UUID,
        ticker: String,
    ): Boolean = store.any { it.userId == userId && it.ticker == ticker }
}
