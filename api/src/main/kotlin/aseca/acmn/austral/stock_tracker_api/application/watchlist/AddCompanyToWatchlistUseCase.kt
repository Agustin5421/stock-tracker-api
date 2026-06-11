package aseca.acmn.austral.stock_tracker_api.application.watchlist

import aseca.acmn.austral.stock_tracker_api.domain.watchlist.WatchlistItem
import java.util.UUID

interface AddCompanyToWatchlistUseCase {
    fun add(userId: UUID, ticker: String, name: String, cik: String): WatchlistItem
}
