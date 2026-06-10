package aseca.acmn.austral.stock_tracker_api.domain.price

import java.math.BigDecimal
import java.time.Instant

data class StockPrice(
    val ticker: String,
    val price: BigDecimal,
    val fetchedAt: Instant,
)
