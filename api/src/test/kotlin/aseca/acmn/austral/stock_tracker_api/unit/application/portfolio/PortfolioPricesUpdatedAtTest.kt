package aseca.acmn.austral.stock_tracker_api.unit.application.portfolio

import aseca.acmn.austral.stock_tracker_api.application.portfolio.GetPortfolioService
import aseca.acmn.austral.stock_tracker_api.application.price.StockPriceRepository
import aseca.acmn.austral.stock_tracker_api.domain.price.StockPrice
import org.junit.jupiter.api.Test
import java.time.Instant
import java.util.UUID
import kotlin.test.assertEquals
import kotlin.test.assertNull

class PortfolioPricesUpdatedAtTest {
    private val userId = UUID.randomUUID()

    private class StubPriceUpdateRepository(
        private val fetchedAt: Instant?,
    ) : StockPriceRepository {
        override fun findLatestByTicker(ticker: String): StockPrice? = null

        override fun findLatestFetchedAt(): Instant? = fetchedAt
    }

    @Test
    fun pricesUpdatedAtIsNullWhenNoPricesExist() {
        val view = GetPortfolioService(InMemoryPortfolioRepository(), StubPriceUpdateRepository(null)).getPortfolio(userId)
        assertNull(view.pricesUpdatedAt)
    }

    @Test
    fun pricesUpdatedAtReflectsLatestPriceUpdate() {
        val instant = Instant.parse("2030-01-02T03:04:05Z")
        val view = GetPortfolioService(InMemoryPortfolioRepository(), StubPriceUpdateRepository(instant)).getPortfolio(userId)
        assertEquals(instant, view.pricesUpdatedAt)
    }
}
