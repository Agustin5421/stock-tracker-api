package aseca.acmn.austral.stock_tracker_api.unit.application.watchlist

import aseca.acmn.austral.stock_tracker_api.application.watchlist.AddCompanyToWatchlistService
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.util.UUID

class AddCompanyToWatchlistServiceTest {

    private val repository = InMemoryWatchlistRepository()
    private val service = AddCompanyToWatchlistService(repository)

    @Test
    fun `add succeeds for a valid company`() {
        val userId = UUID.randomUUID()
        val item = service.add(userId, "AAPL", "Apple Inc.", "0000320193")

        assertNotNull(item.id)
        assertEquals(userId, item.userId)
        assertEquals("AAPL", item.ticker)
        assertEquals("Apple Inc.", item.name)
        assertEquals("0000320193", item.cik)
        assertTrue(repository.existsByUserIdAndTicker(userId, "AAPL"))
    }

    @Test
    fun `add duplicate ticker for same user throws exception`() {
        val userId = UUID.randomUUID()
        service.add(userId, "AAPL", "Apple Inc.", "0000320193")

        assertThrows<IllegalArgumentException> {
            service.add(userId, "AAPL", "Apple Inc.", "0000320193")
        }
    }

    @Test
    fun `add same ticker for different users succeeds`() {
        val user1 = UUID.randomUUID()
        val user2 = UUID.randomUUID()

        val item1 = service.add(user1, "AAPL", "Apple Inc.", "0000320193")
        val item2 = service.add(user2, "AAPL", "Apple Inc.", "0000320193")

        assertNotNull(item1.id)
        assertNotNull(item2.id)
        assertTrue(repository.existsByUserIdAndTicker(user1, "AAPL"))
        assertTrue(repository.existsByUserIdAndTicker(user2, "AAPL"))
    }

    @Test
    fun `add with invalid ticker format throws exception`() {
        val userId = UUID.randomUUID()

        // Empty ticker
        assertThrows<IllegalArgumentException> {
            service.add(userId, "", "Empty", "000000")
        }

        // Ticker too long
        assertThrows<IllegalArgumentException> {
            service.add(userId, "VERYLONGTICKER", "Too Long", "000000")
        }

        // Ticker with spaces
        assertThrows<IllegalArgumentException> {
            service.add(userId, "AA PL", "With Spaces", "000000")
        }

        // Ticker with special characters
        assertThrows<IllegalArgumentException> {
            service.add(userId, "AAP$", "Special Characters", "000000")
        }
    }
}
