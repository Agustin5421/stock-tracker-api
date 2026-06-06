package aseca.acmn.austral.stock_tracker_api.domain.portfolio

import java.math.BigDecimal
import java.time.Instant
import java.util.UUID

class Portfolio(
    val id: UUID,
    val userId: UUID,
    initialPositions: List<Position> = emptyList(),
    initialOperations: List<Operation> = emptyList(),
) {
    private val _positions: MutableList<Position> = initialPositions.toMutableList()
    private val _operations: MutableList<Operation> = initialOperations.toMutableList()

    val positions: List<Position> get() = _positions.toList()
    val operations: List<Operation> get() = _operations.toList()

    fun buy(
        ticker: String,
        quantity: Int,
        price: BigDecimal,
    ): Position {
        require(quantity > 0) { "Quantity must be positive" }
        val existing = _positions.find { it.ticker == ticker }
        val updated =
            if (existing != null) {
                existing.copy(quantity = existing.quantity + quantity)
            } else {
                Position(id = UUID.randomUUID(), ticker = ticker, quantity = quantity)
            }
        _positions.removeIf { it.ticker == ticker }
        _positions.add(updated)
        _operations.add(
            Operation(
                id = UUID.randomUUID(),
                type = OperationType.BUY,
                ticker = ticker,
                quantity = quantity,
                price = price,
                executedAt = Instant.now(),
            ),
        )
        return updated
    }

    fun sell(
        ticker: String,
        quantity: Int,
        price: BigDecimal,
    ): Position? {
        require(quantity > 0) { "Quantity must be positive" }
        val existing = _positions.find { it.ticker == ticker }
        require(existing != null && existing.quantity >= quantity) { "Insufficient shares for ticker: $ticker" }
        _positions.removeIf { it.ticker == ticker }
        val remaining = existing.quantity - quantity
        val updated =
            if (remaining > 0) {
                existing.copy(quantity = remaining).also { _positions.add(it) }
            } else {
                null
            }
        _operations.add(
            Operation(
                id = UUID.randomUUID(),
                type = OperationType.SELL,
                ticker = ticker,
                quantity = quantity,
                price = price,
                executedAt = Instant.now(),
            ),
        )
        return updated
    }

    companion object {
        fun create(userId: UUID): Portfolio = Portfolio(id = UUID.randomUUID(), userId = userId)
    }
}
