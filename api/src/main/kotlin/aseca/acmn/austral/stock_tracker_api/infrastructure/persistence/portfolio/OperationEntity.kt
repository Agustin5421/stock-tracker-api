package aseca.acmn.austral.stock_tracker_api.infrastructure.persistence.portfolio

import aseca.acmn.austral.stock_tracker_api.domain.portfolio.Operation
import aseca.acmn.austral.stock_tracker_api.domain.portfolio.OperationType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.math.BigDecimal
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "operations")
class OperationEntity(
    @Id
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(name = "id", length = 36, nullable = false, updatable = false)
    val id: UUID,
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(name = "portfolio_id", length = 36, nullable = false)
    val portfolioId: UUID,
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 4)
    val type: OperationType,
    @Column(name = "ticker", nullable = false, length = 10)
    val ticker: String,
    @Column(name = "quantity", nullable = false)
    val quantity: Int,
    @Column(name = "price", nullable = false, precision = 19, scale = 4)
    val price: BigDecimal,
    @Column(name = "executed_at", nullable = false)
    val executedAt: Instant,
) {
    fun toDomain(): Operation =
        Operation(
            id = id,
            type = type,
            ticker = ticker,
            quantity = quantity,
            price = price,
            executedAt = executedAt,
        )

    companion object {
        fun fromDomain(
            operation: Operation,
            portfolioId: UUID,
        ): OperationEntity =
            OperationEntity(
                id = operation.id,
                portfolioId = portfolioId,
                type = operation.type,
                ticker = operation.ticker,
                quantity = operation.quantity,
                price = operation.price,
                executedAt = operation.executedAt,
            )
    }
}
