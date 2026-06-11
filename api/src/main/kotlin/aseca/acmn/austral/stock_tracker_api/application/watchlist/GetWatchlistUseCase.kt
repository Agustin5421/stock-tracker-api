package aseca.acmn.austral.stock_tracker_api.application.watchlist

import aseca.acmn.austral.stock_tracker_api.domain.watchlist.WatchlistItem
import java.util.UUID

interface GetWatchlistUseCase {
    fun getWatchlist(userId: UUID): List<WatchlistItem>
}
