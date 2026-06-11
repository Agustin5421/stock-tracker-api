package aseca.acmn.austral.stock_tracker_api.application.watchlist

import java.util.UUID

class RemoveCompanyFromWatchlistService(
    private val watchlistRepository: WatchlistRepository,
) : RemoveCompanyFromWatchlistUseCase {
    override fun remove(userId: UUID, ticker: String) {
        val trimmedTicker = ticker.trim().uppercase()
        watchlistRepository.delete(userId, trimmedTicker)
    }
}
