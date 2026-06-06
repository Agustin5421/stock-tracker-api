package aseca.acmn.austral.stock_tracker_api.infrastructure.persistence.portfolio

import aseca.acmn.austral.stock_tracker_api.application.portfolio.PortfolioRepository
import aseca.acmn.austral.stock_tracker_api.domain.portfolio.Portfolio
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Repository
class JpaPortfolioRepository(
    private val portfolioRepo: SpringDataPortfolioRepository,
    private val positionRepo: SpringDataPositionRepository,
    private val operationRepo: SpringDataOperationRepository,
) : PortfolioRepository {
    override fun findByUserId(userId: UUID): Portfolio? {
        val entity = portfolioRepo.findByUserId(userId) ?: return null
        val positions = positionRepo.findByPortfolioId(entity.id)
        val operations = operationRepo.findByPortfolioId(entity.id)
        return entity.toDomain(positions, operations)
    }

    @Transactional
    override fun save(portfolio: Portfolio): Portfolio {
        portfolioRepo.save(PortfolioEntity(id = portfolio.id, userId = portfolio.userId))
        positionRepo.saveAll(portfolio.positions.map { PositionEntity.fromDomain(it, portfolio.id) })
        operationRepo.saveAll(portfolio.operations.map { OperationEntity.fromDomain(it, portfolio.id) })
        return portfolio
    }
}
