package aseca.acmn.austral.stock_tracker_api.application.portfolio

import aseca.acmn.austral.stock_tracker_api.domain.portfolio.Portfolio
import java.util.UUID

interface PortfolioRepository {
    fun findByUserId(userId: UUID): Portfolio?

    fun save(portfolio: Portfolio): Portfolio
}
