package aseca.acmn.austral.stock_tracker_api.unit.application.watchlist

import aseca.acmn.austral.stock_tracker_api.application.watchlist.AddCompanyToWatchlistService
import aseca.acmn.austral.stock_tracker_api.application.watchlist.RemoveCompanyFromWatchlistService
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import java.util.UUID

class RemoveCompanyFromWatchlistServiceTest {
    private val repository = InMemoryWatchlistRepository()
    private val addService = AddCompanyToWatchlistService(repository)
    private val removeService = RemoveCompanyFromWatchlistService(repository)

    @Test
    fun `remove succeeds for an existing watchlist item`() {
        val userId = UUID.randomUUID()
        repository.save(
            aseca.acmn.austral.stock_tracker_api.domain.watchlist.WatchlistItem(
                id = UUID.randomUUID(),
                userId = userId,
                ticker = "AAPL",
                name = "Apple Inc.",
                cik = "0000320193",
            ),
        )

        assertTrue(repository.existsByUserIdAndTicker(userId, "AAPL"))
        removeService.remove(userId, "AAPL")
        assertFalse(repository.existsByUserIdAndTicker(userId, "AAPL"))
    }

    @Test
    fun `remove is noop for non-existent ticker`() {
        val userId = UUID.randomUUID()

        // Should complete without exceptions
        removeService.remove(userId, "MSFT")
        assertFalse(repository.existsByUserIdAndTicker(userId, "MSFT"))
    }
}
