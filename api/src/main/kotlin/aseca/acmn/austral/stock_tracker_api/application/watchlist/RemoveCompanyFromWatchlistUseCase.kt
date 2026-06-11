package aseca.acmn.austral.stock_tracker_api.application.watchlist

import java.util.UUID

interface RemoveCompanyFromWatchlistUseCase {
    fun remove(userId: UUID, ticker: String)
}
