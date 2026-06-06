package aseca.acmn.austral.stock_tracker_api.application.portfolio

import java.util.UUID

interface BuyStockUseCase {
    fun buy(
        userId: UUID,
        ticker: String,
        quantity: Int,
    ): PurchaseResult
}
