package aseca.acmn.austral.stock_tracker_api.unit.application.portfolio

import aseca.acmn.austral.stock_tracker_api.application.portfolio.InsufficientSharesException
import aseca.acmn.austral.stock_tracker_api.application.portfolio.NoPriceAvailableException
import aseca.acmn.austral.stock_tracker_api.application.portfolio.PortfolioRepository
import aseca.acmn.austral.stock_tracker_api.application.portfolio.SellStockService
import aseca.acmn.austral.stock_tracker_api.application.price.StockPriceRepository
import aseca.acmn.austral.stock_tracker_api.domain.portfolio.Portfolio
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.math.BigDecimal
import java.util.UUID
import kotlin.test.assertEquals

class SellStockServiceTest {
    private val userId = UUID.randomUUID()
    private val price = BigDecimal("150.00")

    private fun portfolioRepoWithHolding(
        ticker: String,
        quantity: Int,
    ): PortfolioRepository =
        InMemoryPortfolioRepository().apply {
            val portfolio = Portfolio.create(userId)
            portfolio.buy(ticker, quantity, price)
            save(portfolio)
        }

    private fun priceRepo(ticker: String): StockPriceRepository = InMemoryStockPriceRepository().apply { seed(ticker, price) }

    @Test
    fun sellThrowsWhenNoPriceAvailable() {
        assertThrows<NoPriceAvailableException> {
            SellStockService(portfolioRepoWithHolding("AAPL", 10), InMemoryStockPriceRepository())
                .sell(userId, "AAPL", 5)
        }
    }

    @Test
    fun sellThrowsWhenInsufficientShares() {
        assertThrows<InsufficientSharesException> {
            SellStockService(portfolioRepoWithHolding("AAPL", 3), priceRepo("AAPL"))
                .sell(userId, "AAPL", 5)
        }
    }

    @Test
    fun sellThrowsWhenNoPositionForTicker() {
        assertThrows<InsufficientSharesException> {
            SellStockService(InMemoryPortfolioRepository(), priceRepo("AAPL"))
                .sell(userId, "AAPL", 1)
        }
    }

    @Test
    fun sellReturnsSaleResultWithCorrectPriceUsed() {
        val result =
            SellStockService(portfolioRepoWithHolding("AAPL", 10), priceRepo("AAPL"))
                .sell(userId, "AAPL", 4)
        assertEquals(price, result.priceUsed)
    }

    @Test
    fun sellReturnsRemainingQuantityAfterPartialSale() {
        val result =
            SellStockService(portfolioRepoWithHolding("AAPL", 10), priceRepo("AAPL"))
                .sell(userId, "AAPL", 4)
        assertEquals(6, result.position!!.quantity)
    }

    @Test
    fun sellAllReturnsNullPosition() {
        val result =
            SellStockService(portfolioRepoWithHolding("AAPL", 10), priceRepo("AAPL"))
                .sell(userId, "AAPL", 10)
        assertEquals(null, result.position)
    }
}
