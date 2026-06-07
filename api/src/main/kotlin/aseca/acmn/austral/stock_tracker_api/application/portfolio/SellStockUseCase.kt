package aseca.acmn.austral.stock_tracker_api.application.portfolio

import java.util.UUID

interface SellStockUseCase {
    fun sell(
        userId: UUID,
        ticker: String,
        quantity: Int,
    ): SaleResult
}
