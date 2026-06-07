package aseca.acmn.austral.stock_tracker_api.unit.domain.portfolio

import aseca.acmn.austral.stock_tracker_api.domain.portfolio.OperationType
import aseca.acmn.austral.stock_tracker_api.domain.portfolio.Portfolio
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.math.BigDecimal
import java.util.UUID
import kotlin.test.assertEquals

class PortfolioTest {
    private val userId = UUID.randomUUID()
    private val price = BigDecimal("150.00")

    @Test
    fun buyCreatesNewPositionWhenTickerAbsent() {
        val portfolio = Portfolio.create(userId)
        portfolio.buy("AAPL", 10, price)
        assertEquals(1, portfolio.positions.size)
    }

    @Test
    fun buyIncrementsQuantityWhenTickerAlreadyHeld() {
        val portfolio = Portfolio.create(userId)
        portfolio.buy("AAPL", 10, price)
        portfolio.buy("AAPL", 5, price)
        assertEquals(15, portfolio.positions.first().quantity)
    }

    @Test
    fun buyRecordsBuyOperation() {
        val portfolio = Portfolio.create(userId)
        portfolio.buy("AAPL", 10, price)
        assertEquals(OperationType.BUY, portfolio.operations.first().type)
    }

    @Test
    fun buyWithZeroQuantityThrows() {
        val portfolio = Portfolio.create(userId)
        assertThrows<IllegalArgumentException> {
            portfolio.buy("AAPL", 0, price)
        }
    }
}
