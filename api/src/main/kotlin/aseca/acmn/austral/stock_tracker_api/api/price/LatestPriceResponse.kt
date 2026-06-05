package aseca.acmn.austral.stock_tracker_api.api.price

import java.math.BigDecimal
import java.time.Instant

data class LatestPriceResponse(
    val ticker: String,
    val price: BigDecimal,
    val fetchedAt: Instant,
)
