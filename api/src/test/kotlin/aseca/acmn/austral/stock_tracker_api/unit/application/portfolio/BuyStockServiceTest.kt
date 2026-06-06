package aseca.acmn.austral.stock_tracker_api.unit.application.portfolio

import aseca.acmn.austral.stock_tracker_api.application.portfolio.BuyStockService
import aseca.acmn.austral.stock_tracker_api.application.portfolio.NoPriceAvailableException
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.math.BigDecimal
import java.util.UUID
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

class BuyStockServiceTest {
    private val userId = UUID.randomUUID()
    private val price = BigDecimal("150.00")

    @Test
    fun buyThrowsWhenNoPriceAvailable() {
        assertThrows<NoPriceAvailableException> {
            BuyStockService(InMemoryPortfolioRepository(), InMemoryStockPriceRepository()).buy(userId, "AAPL", 10)
        }
    }

    @Test
    fun buyCreatesPortfolioLazilyOnFirstPurchase() {
        val priceRepo = InMemoryStockPriceRepository().apply { seed("AAPL", price) }
        val portfolioRepo = InMemoryPortfolioRepository()
        BuyStockService(portfolioRepo, priceRepo).buy(userId, "AAPL", 10)
        assertNotNull(portfolioRepo.findByUserId(userId))
    }

    @Test
    fun buySavesUpdatedQuantityToPortfolio() {
        val priceRepo = InMemoryStockPriceRepository().apply { seed("AAPL", price) }
        val portfolioRepo = InMemoryPortfolioRepository()
        BuyStockService(portfolioRepo, priceRepo).buy(userId, "AAPL", 10)
        assertEquals(
            10,
            portfolioRepo
                .findByUserId(userId)!!
                .positions
                .first()
                .quantity,
        )
    }

    @Test
    fun buyReturnsPurchaseResultWithCorrectPriceUsed() {
        val priceRepo = InMemoryStockPriceRepository().apply { seed("AAPL", price) }
        val result = BuyStockService(InMemoryPortfolioRepository(), priceRepo).buy(userId, "AAPL", 10)
        assertEquals(price, result.priceUsed)
    }
}
