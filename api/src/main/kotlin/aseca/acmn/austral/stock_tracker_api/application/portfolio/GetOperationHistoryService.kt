package aseca.acmn.austral.stock_tracker_api.application.portfolio

import aseca.acmn.austral.stock_tracker_api.domain.portfolio.Operation
import java.util.UUID

class GetOperationHistoryService(
    private val portfolioRepository: PortfolioRepository,
) : GetOperationHistoryUseCase {
    override fun getOperationHistory(userId: UUID): List<Operation> {
        val portfolio = portfolioRepository.findByUserId(userId) ?: return emptyList()
        return portfolio.operations.sortedByDescending { it.executedAt }
    }
}
