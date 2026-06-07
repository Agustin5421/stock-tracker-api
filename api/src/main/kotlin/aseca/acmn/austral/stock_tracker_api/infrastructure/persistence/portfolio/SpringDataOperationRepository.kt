package aseca.acmn.austral.stock_tracker_api.infrastructure.persistence.portfolio

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface SpringDataOperationRepository : JpaRepository<OperationEntity, UUID> {
    fun findByPortfolioId(portfolioId: UUID): List<OperationEntity>
}
