package aseca.acmn.austral.stock_tracker_api.infrastructure.persistence.portfolio

import aseca.acmn.austral.stock_tracker_api.domain.portfolio.Portfolio
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.util.UUID

@Entity
@Table(name = "portfolios")
class PortfolioEntity(
    @Id
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(name = "id", length = 36, nullable = false, updatable = false)
    val id: UUID,
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(name = "user_id", length = 36, nullable = false)
    val userId: UUID,
) {
    fun toDomain(
        positions: List<PositionEntity>,
        operations: List<OperationEntity>,
    ): Portfolio =
        Portfolio(
            id = id,
            userId = userId,
            initialPositions = positions.map { it.toDomain() },
            initialOperations = operations.map { it.toDomain() },
        )
}
