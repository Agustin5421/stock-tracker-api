package aseca.acmn.austral.stock_tracker_api.unit.domain.portfolio

import aseca.acmn.austral.stock_tracker_api.domain.portfolio.Operation
import aseca.acmn.austral.stock_tracker_api.domain.portfolio.OperationType
import aseca.acmn.austral.stock_tracker_api.domain.portfolio.Portfolio
import org.junit.jupiter.api.Test
import java.math.BigDecimal
import java.time.Instant
import java.util.UUID
import kotlin.test.assertEquals
import kotlin.test.assertNull

class PortfolioAverageCostTest {
    private val userId = UUID.randomUUID()
    private val epoch = Instant.parse("2026-01-01T00:00:00Z")

    private fun operation(
        type: OperationType,
        ticker: String,
        quantity: Int,
        price: String,
        secondsOffset: Long,
    ): Operation =
        Operation(
            id = UUID.randomUUID(),
            type = type,
            ticker = ticker,
            quantity = quantity,
            price = BigDecimal(price),
            executedAt = epoch.plusSeconds(secondsOffset),
        )

    private fun portfolioWith(vararg operations: Operation): Portfolio =
        Portfolio(id = UUID.randomUUID(), userId = userId, initialOperations = operations.toList())

    @Test
    fun buyOnlyAveragesWeightedByQuantity() {
        val portfolio =
            portfolioWith(
                operation(OperationType.BUY, "AAPL", 10, "100.00", 0),
                operation(OperationType.BUY, "AAPL", 30, "200.00", 1),
            )
        assertEquals(BigDecimal("175.0000"), portfolio.averageCostOf("AAPL"))
    }

    @Test
    fun sellLeavesAverageUnchangedOnRemainingShares() {
        val portfolio =
            portfolioWith(
                operation(OperationType.BUY, "AAPL", 10, "100.00", 0),
                operation(OperationType.BUY, "AAPL", 30, "200.00", 1),
                operation(OperationType.SELL, "AAPL", 20, "500.00", 2),
            )
        assertEquals(BigDecimal("175.0000"), portfolio.averageCostOf("AAPL"))
    }

    @Test
    fun soldFullyThenReboughtResetsBasis() {
        val portfolio =
            portfolioWith(
                operation(OperationType.BUY, "AAPL", 10, "100.00", 0),
                operation(OperationType.SELL, "AAPL", 10, "150.00", 1),
                operation(OperationType.BUY, "AAPL", 5, "300.00", 2),
            )
        assertEquals(BigDecimal("300.0000"), portfolio.averageCostOf("AAPL"))
    }

    @Test
    fun averageOfNonHeldTickerIsNull() {
        val portfolio = portfolioWith(operation(OperationType.BUY, "AAPL", 10, "100.00", 0))
        assertNull(portfolio.averageCostOf("TSLA"))
    }
}
