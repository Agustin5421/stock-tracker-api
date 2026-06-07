package aseca.acmn.austral.stock_tracker_api.unit.application.portfolio

import aseca.acmn.austral.stock_tracker_api.application.portfolio.GetPortfolioService
import aseca.acmn.austral.stock_tracker_api.domain.portfolio.Operation
import aseca.acmn.austral.stock_tracker_api.domain.portfolio.OperationType
import aseca.acmn.austral.stock_tracker_api.domain.portfolio.Portfolio
import aseca.acmn.austral.stock_tracker_api.domain.portfolio.Position
import org.junit.jupiter.api.Test
import java.math.BigDecimal
import java.time.Instant
import java.util.UUID
import kotlin.test.assertEquals
import kotlin.test.assertNull

class GetPortfolioPnlServiceTest {
    private val userId = UUID.randomUUID()

    private fun buyOperation(
        ticker: String,
        quantity: Int,
        price: String,
    ): Operation =
        Operation(
            id = UUID.randomUUID(),
            type = OperationType.BUY,
            ticker = ticker,
            quantity = quantity,
            price = BigDecimal(price),
            executedAt = Instant.parse("2026-01-01T00:00:00Z"),
        )

    private fun repositoryWith(
        position: Position,
        operation: Operation,
    ): InMemoryPortfolioRepository =
        InMemoryPortfolioRepository().apply {
            save(
                Portfolio(
                    id = UUID.randomUUID(),
                    userId = userId,
                    initialPositions = listOf(position),
                    initialOperations = listOf(operation),
                ),
            )
        }

    private fun position(
        ticker: String,
        quantity: Int,
    ): Position = Position(id = UUID.randomUUID(), ticker = ticker, quantity = quantity)

    @Test
    fun pricedPositionExposesAvgCost() {
        val repo = repositoryWith(position("AAPL", 10), buyOperation("AAPL", 10, "100.00"))
        val priceRepo = InMemoryStockPriceRepository().apply { seed("AAPL", BigDecimal("150.00")) }
        val view = GetPortfolioService(repo, priceRepo).getPortfolio(userId)
        assertEquals(BigDecimal("100.0000"), view.positions.first().avgCost)
    }

    @Test
    fun pricedPositionExposesUnrealizedPnl() {
        val repo = repositoryWith(position("AAPL", 10), buyOperation("AAPL", 10, "100.00"))
        val priceRepo = InMemoryStockPriceRepository().apply { seed("AAPL", BigDecimal("150.00")) }
        val view = GetPortfolioService(repo, priceRepo).getPortfolio(userId)
        assertEquals(BigDecimal("500.0000"), view.positions.first().unrealizedPnl)
    }

    @Test
    fun pricedPositionExposesUnrealizedPnlPercent() {
        val repo = repositoryWith(position("AAPL", 10), buyOperation("AAPL", 10, "100.00"))
        val priceRepo = InMemoryStockPriceRepository().apply { seed("AAPL", BigDecimal("150.00")) }
        val view = GetPortfolioService(repo, priceRepo).getPortfolio(userId)
        assertEquals(BigDecimal("50.00"), view.positions.first().unrealizedPnlPercent)
    }

    @Test
    fun unpricedPositionStillExposesAvgCost() {
        val repo = repositoryWith(position("TSLA", 5), buyOperation("TSLA", 5, "200.00"))
        val view = GetPortfolioService(repo, InMemoryStockPriceRepository()).getPortfolio(userId)
        assertEquals(BigDecimal("200.0000"), view.positions.first().avgCost)
    }

    @Test
    fun unpricedPositionHasNullUnrealizedPnl() {
        val repo = repositoryWith(position("TSLA", 5), buyOperation("TSLA", 5, "200.00"))
        val view = GetPortfolioService(repo, InMemoryStockPriceRepository()).getPortfolio(userId)
        assertNull(view.positions.first().unrealizedPnl)
    }

    @Test
    fun unpricedPositionHasNullUnrealizedPnlPercent() {
        val repo = repositoryWith(position("TSLA", 5), buyOperation("TSLA", 5, "200.00"))
        val view = GetPortfolioService(repo, InMemoryStockPriceRepository()).getPortfolio(userId)
        assertNull(view.positions.first().unrealizedPnlPercent)
    }
}
