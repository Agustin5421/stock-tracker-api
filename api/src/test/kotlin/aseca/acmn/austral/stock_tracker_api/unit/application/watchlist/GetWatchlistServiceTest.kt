package aseca.acmn.austral.stock_tracker_api.unit.application.watchlist

import aseca.acmn.austral.stock_tracker_api.application.watchlist.GetWatchlistService
import aseca.acmn.austral.stock_tracker_api.domain.watchlist.WatchlistItem
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import java.util.UUID

class GetWatchlistServiceTest {
    private val repository = InMemoryWatchlistRepository()
    private val service = GetWatchlistService(repository)

    @Test
    fun `getWatchlist returns all items for a user`() {
        val userId = UUID.randomUUID()
        repository.save(WatchlistItem(UUID.randomUUID(), userId, "AAPL", "Apple Inc.", "0000320193"))
        repository.save(WatchlistItem(UUID.randomUUID(), userId, "MSFT", "Microsoft", "0000789019"))

        val list = service.getWatchlist(userId)

        assertEquals(2, list.size)
        assertTrue(list.any { it.ticker == "AAPL" })
        assertTrue(list.any { it.ticker == "MSFT" })
    }

    @Test
    fun `getWatchlist returns empty list when no items exist`() {
        val userId = UUID.randomUUID()
        val list = service.getWatchlist(userId)

        assertTrue(list.isEmpty())
    }

    @Test
    fun `getWatchlist only returns items for the requested user`() {
        val user1 = UUID.randomUUID()
        val user2 = UUID.randomUUID()

        repository.save(WatchlistItem(UUID.randomUUID(), user1, "AAPL", "Apple Inc.", "0000320193"))
        repository.save(WatchlistItem(UUID.randomUUID(), user2, "MSFT", "Microsoft", "0000789019"))

        val listUser1 = service.getWatchlist(user1)
        val listUser2 = service.getWatchlist(user2)

        assertEquals(1, listUser1.size)
        assertEquals("AAPL", listUser1[0].ticker)

        assertEquals(1, listUser2.size)
        assertEquals("MSFT", listUser2[0].ticker)
    }
}
