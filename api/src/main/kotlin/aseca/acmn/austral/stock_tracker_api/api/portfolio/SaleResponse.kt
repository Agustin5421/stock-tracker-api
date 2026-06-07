package aseca.acmn.austral.stock_tracker_api.api.portfolio

import java.math.BigDecimal

data class SaleResponse(
    val ticker: String,
    val quantity: Int,
    val priceUsed: BigDecimal,
)
