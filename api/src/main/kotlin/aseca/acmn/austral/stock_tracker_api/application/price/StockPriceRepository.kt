package aseca.acmn.austral.stock_tracker_api.application.price

import aseca.acmn.austral.stock_tracker_api.domain.price.StockPrice
import java.time.Instant

interface StockPriceRepository {
    fun findLatestByTicker(ticker: String): StockPrice?

    // System-wide timestamp of the most recent price update (US-016).
    // Defaults to null so existing fakes need no changes; the JPA adapter overrides it.
    fun findLatestFetchedAt(): Instant? = null
}
