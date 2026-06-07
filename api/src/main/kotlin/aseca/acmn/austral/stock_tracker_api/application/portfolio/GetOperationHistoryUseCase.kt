package aseca.acmn.austral.stock_tracker_api.application.portfolio

import aseca.acmn.austral.stock_tracker_api.domain.portfolio.Operation
import java.util.UUID

interface GetOperationHistoryUseCase {
    fun getOperationHistory(userId: UUID): List<Operation>
}
