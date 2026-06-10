package aseca.acmn.austral.stock_tracker_api.unit.application.portfolio

import aseca.acmn.austral.stock_tracker_api.application.portfolio.GetOperationHistoryService
import aseca.acmn.austral.stock_tracker_api.domain.portfolio.Operation
import aseca.acmn.austral.stock_tracker_api.domain.portfolio.OperationType
import aseca.acmn.austral.stock_tracker_api.domain.portfolio.Portfolio
import org.junit.jupiter.api.Test
import java.math.BigDecimal
import java.time.Instant
import java.util.UUID
import kotlin.test.assertEquals

class GetOperationHistoryServiceTest {
    private val userId = UUID.randomUUID()

    private fun operation(
        ticker: String,
        executedAt: Instant,
    ): Operation =
        Operation(
            id = UUID.randomUUID(),
            type = OperationType.BUY,
            ticker = ticker,
            quantity = 1,
            price = BigDecimal("10.00"),
            executedAt = executedAt,
        )

    @Test
    fun returnsOperationsSortedByExecutedAtDescending() {
        val older = operation("AAPL", Instant.parse("2026-01-01T00:00:00Z"))
        val newer = operation("MSFT", Instant.parse("2026-02-01T00:00:00Z"))
        val repo =
            InMemoryPortfolioRepository().apply {
                save(Portfolio(id = UUID.randomUUID(), userId = userId, initialOperations = listOf(older, newer)))
            }
        val history = GetOperationHistoryService(repo).getOperationHistory(userId)
        assertEquals(listOf(newer, older), history)
    }

    @Test
    fun returnsEmptyListWhenUserHasNoPortfolio() {
        val history = GetOperationHistoryService(InMemoryPortfolioRepository()).getOperationHistory(userId)
        assertEquals(emptyList(), history)
    }
}
