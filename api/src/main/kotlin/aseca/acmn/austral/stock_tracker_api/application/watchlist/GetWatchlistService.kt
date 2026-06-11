package aseca.acmn.austral.stock_tracker_api.application.watchlist

import aseca.acmn.austral.stock_tracker_api.domain.watchlist.WatchlistItem
import java.util.UUID

class GetWatchlistService(
    private val watchlistRepository: WatchlistRepository,
) : GetWatchlistUseCase {
    override fun getWatchlist(userId: UUID): List<WatchlistItem> = watchlistRepository.findByUserId(userId)
}
