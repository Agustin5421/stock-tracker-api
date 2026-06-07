package aseca.acmn.austral.stock_tracker_api.application.portfolio

import java.util.UUID

interface GetPortfolioUseCase {
    fun getPortfolio(userId: UUID): PortfolioView
}
