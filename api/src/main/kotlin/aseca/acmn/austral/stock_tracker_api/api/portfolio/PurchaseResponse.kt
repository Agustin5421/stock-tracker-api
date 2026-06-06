package aseca.acmn.austral.stock_tracker_api.api.portfolio

import java.math.BigDecimal

data class PurchaseResponse(
    val ticker: String,
    val quantity: Int,
    val priceUsed: BigDecimal,
)
