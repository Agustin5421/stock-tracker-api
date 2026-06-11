package aseca.acmn.austral.stock_tracker_api.application.watchlist

import aseca.acmn.austral.stock_tracker_api.domain.watchlist.WatchlistItem
import java.util.UUID

class AddCompanyToWatchlistService(
    private val watchlistRepository: WatchlistRepository,
) : AddCompanyToWatchlistUseCase {
    override fun add(
        userId: UUID,
        ticker: String,
        name: String,
        cik: String,
    ): WatchlistItem {
        val trimmedTicker = ticker.trim().uppercase()

        // 1. Ticker format validation (1-10 alphanumeric characters)
        if (trimmedTicker.isEmpty() || trimmedTicker.length > 10 || !trimmedTicker.all { it.isLetterOrDigit() }) {
            throw IllegalArgumentException("Formato de ticker inválido")
        }

        // 2. Duplicate validation
        if (watchlistRepository.existsByUserIdAndTicker(userId, trimmedTicker)) {
            throw IllegalArgumentException("La empresa ya se encuentra en tu watchlist")
        }

        // 3. Save
        val newItem =
            WatchlistItem(
                id = UUID.randomUUID(),
                userId = userId,
                ticker = trimmedTicker,
                name = name,
                cik = cik,
            )
        return watchlistRepository.save(newItem)
    }
}
