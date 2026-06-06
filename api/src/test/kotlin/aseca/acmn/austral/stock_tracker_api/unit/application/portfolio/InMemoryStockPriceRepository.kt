package aseca.acmn.austral.stock_tracker_api.unit.application.portfolio

import aseca.acmn.austral.stock_tracker_api.application.price.StockPriceRepository
import aseca.acmn.austral.stock_tracker_api.domain.price.StockPrice
import java.math.BigDecimal
import java.time.Instant

class InMemoryStockPriceRepository : StockPriceRepository {
    private val prices = mutableMapOf<String, StockPrice>()

    fun seed(
        ticker: String,
        price: BigDecimal,
    ) {
        prices[ticker] = StockPrice(ticker = ticker, price = price, fetchedAt = Instant.now())
    }

    override fun findLatestByTicker(ticker: String): StockPrice? = prices[ticker]
}
