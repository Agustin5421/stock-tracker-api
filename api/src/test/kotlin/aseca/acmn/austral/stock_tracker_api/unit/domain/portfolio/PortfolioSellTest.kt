package aseca.acmn.austral.stock_tracker_api.unit.domain.portfolio

import aseca.acmn.austral.stock_tracker_api.domain.portfolio.OperationType
import aseca.acmn.austral.stock_tracker_api.domain.portfolio.Portfolio
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.math.BigDecimal
import java.util.UUID
import kotlin.test.assertEquals
import kotlin.test.assertNull

class PortfolioSellTest {
    private val userId = UUID.randomUUID()
    private val price = BigDecimal("150.00")

    @Test
    fun sellReducesQuantityWhenPartialAmountSold() {
        val portfolio = Portfolio.create(userId)
        portfolio.buy("AAPL", 10, price)
        portfolio.sell("AAPL", 4, price)
        assertEquals(6, portfolio.positions.first().quantity)
    }

    @Test
    fun sellAllRemovesPosition() {
        val portfolio = Portfolio.create(userId)
        portfolio.buy("AAPL", 10, price)
        portfolio.sell("AAPL", 10, price)
        assertEquals(0, portfolio.positions.size)
    }

    @Test
    fun sellAllReturnsNullPosition() {
        val portfolio = Portfolio.create(userId)
        portfolio.buy("AAPL", 10, price)
        assertNull(portfolio.sell("AAPL", 10, price))
    }

    @Test
    fun sellMoreThanAvailableThrows() {
        val portfolio = Portfolio.create(userId)
        portfolio.buy("AAPL", 10, price)
        assertThrows<IllegalArgumentException> {
            portfolio.sell("AAPL", 11, price)
        }
    }

    @Test
    fun sellWithNoPositionThrows() {
        val portfolio = Portfolio.create(userId)
        assertThrows<IllegalArgumentException> {
            portfolio.sell("AAPL", 1, price)
        }
    }

    @Test
    fun sellRecordsSellOperation() {
        val portfolio = Portfolio.create(userId)
        portfolio.buy("AAPL", 10, price)
        portfolio.sell("AAPL", 4, price)
        assertEquals(OperationType.SELL, portfolio.operations.last().type)
    }

    @Test
    fun sellWithZeroQuantityThrows() {
        val portfolio = Portfolio.create(userId)
        portfolio.buy("AAPL", 10, price)
        assertThrows<IllegalArgumentException> {
            portfolio.sell("AAPL", 0, price)
        }
    }
}
