package aseca.acmn.austral.stock_tracker_api.unit.application.portfolio

import aseca.acmn.austral.stock_tracker_api.application.portfolio.GetPortfolioService
import aseca.acmn.austral.stock_tracker_api.domain.portfolio.Portfolio
import aseca.acmn.austral.stock_tracker_api.domain.portfolio.Position
import org.junit.jupiter.api.Test
import java.math.BigDecimal
import java.util.UUID
import kotlin.test.assertEquals
import kotlin.test.assertNull

class GetPortfolioServiceTest {
    private val userId = UUID.randomUUID()

    private fun portfolioWith(vararg positions: Position): InMemoryPortfolioRepository =
        InMemoryPortfolioRepository().apply {
            save(Portfolio(id = UUID.randomUUID(), userId = userId, initialPositions = positions.toList()))
        }

    private fun position(
        ticker: String,
        quantity: Int,
    ): Position = Position(id = UUID.randomUUID(), ticker = ticker, quantity = quantity)

    @Test
    fun positionWithPriceComputesCurrentValue() {
        val portfolioRepo = portfolioWith(position("AAPL", 10))
        val priceRepo = InMemoryStockPriceRepository().apply { seed("AAPL", BigDecimal("189.42")) }
        val view = GetPortfolioService(portfolioRepo, priceRepo).getPortfolio(userId)
        assertEquals(BigDecimal("1894.20"), view.positions.first().currentValue)
    }

    @Test
    fun positionWithPriceExposesLatestPrice() {
        val portfolioRepo = portfolioWith(position("AAPL", 10))
        val priceRepo = InMemoryStockPriceRepository().apply { seed("AAPL", BigDecimal("189.42")) }
        val view = GetPortfolioService(portfolioRepo, priceRepo).getPortfolio(userId)
        assertEquals(BigDecimal("189.42"), view.positions.first().latestPrice)
    }

    @Test
    fun positionWithoutPriceHasNullPrice() {
        val portfolioRepo = portfolioWith(position("TSLA", 5))
        val view = GetPortfolioService(portfolioRepo, InMemoryStockPriceRepository()).getPortfolio(userId)
        assertNull(view.positions.first().latestPrice)
    }

    @Test
    fun positionWithoutPriceHasNullCurrentValue() {
        val portfolioRepo = portfolioWith(position("TSLA", 5))
        val view = GetPortfolioService(portfolioRepo, InMemoryStockPriceRepository()).getPortfolio(userId)
        assertNull(view.positions.first().currentValue)
    }

    @Test
    fun totalValueSumsOnlyPricedPositions() {
        val portfolioRepo = portfolioWith(position("AAPL", 10), position("TSLA", 5))
        val priceRepo = InMemoryStockPriceRepository().apply { seed("AAPL", BigDecimal("189.42")) }
        val view = GetPortfolioService(portfolioRepo, priceRepo).getPortfolio(userId)
        assertEquals(BigDecimal("1894.20"), view.totalValue)
    }

    @Test
    fun emptyPortfolioReturnsNoPositions() {
        val view =
            GetPortfolioService(InMemoryPortfolioRepository(), InMemoryStockPriceRepository()).getPortfolio(userId)
        assertEquals(emptyList(), view.positions)
    }

    @Test
    fun emptyPortfolioReturnsZeroTotal() {
        val view =
            GetPortfolioService(InMemoryPortfolioRepository(), InMemoryStockPriceRepository()).getPortfolio(userId)
        assertEquals(BigDecimal.ZERO, view.totalValue)
    }
}
