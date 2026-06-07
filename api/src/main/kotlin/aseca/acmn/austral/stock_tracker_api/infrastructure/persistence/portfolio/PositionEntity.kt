package aseca.acmn.austral.stock_tracker_api.infrastructure.persistence.portfolio

import aseca.acmn.austral.stock_tracker_api.domain.portfolio.Position
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.util.UUID

@Entity
@Table(name = "positions")
class PositionEntity(
    @Id
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(name = "id", length = 36, nullable = false, updatable = false)
    val id: UUID,
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(name = "portfolio_id", length = 36, nullable = false)
    val portfolioId: UUID,
    @Column(name = "ticker", nullable = false, length = 10)
    val ticker: String,
    @Column(name = "quantity", nullable = false)
    val quantity: Int,
) {
    fun toDomain(): Position = Position(id = id, ticker = ticker, quantity = quantity)

    companion object {
        fun fromDomain(
            position: Position,
            portfolioId: UUID,
        ): PositionEntity =
            PositionEntity(
                id = position.id,
                portfolioId = portfolioId,
                ticker = position.ticker,
                quantity = position.quantity,
            )
    }
}
