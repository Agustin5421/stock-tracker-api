package aseca.acmn.austral.stock_tracker_api.unit.application.portfolio

import aseca.acmn.austral.stock_tracker_api.application.portfolio.PortfolioRepository
import aseca.acmn.austral.stock_tracker_api.domain.portfolio.Portfolio
import java.util.UUID

class InMemoryPortfolioRepository : PortfolioRepository {
    private val store = mutableMapOf<UUID, Portfolio>()

    override fun findByUserId(userId: UUID): Portfolio? = store[userId]

    override fun save(portfolio: Portfolio): Portfolio {
        store[portfolio.userId] = portfolio
        return portfolio
    }
}
