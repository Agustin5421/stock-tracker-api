package aseca.acmn.austral.stock_tracker_api.unit.application.portfolio

import aseca.acmn.austral.stock_tracker_api.application.portfolio.StockPriceRepository
import java.math.BigDecimal

class InMemoryStockPriceRepository : StockPriceRepository {
    private val prices = mutableMapOf<String, BigDecimal>()

    fun seed(
        ticker: String,
        price: BigDecimal,
    ) {
        prices[ticker] = price
    }

    override fun findLatestByTicker(ticker: String): BigDecimal? = prices[ticker]
}
