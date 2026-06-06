package aseca.acmn.austral.stock_tracker_api.infrastructure.persistence.portfolio

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface SpringDataPortfolioRepository : JpaRepository<PortfolioEntity, UUID> {
    fun findByUserId(userId: UUID): PortfolioEntity?
}
