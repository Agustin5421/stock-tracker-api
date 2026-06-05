package aseca.acmn.austral.stock_tracker_api.unit.application.price

import aseca.acmn.austral.stock_tracker_api.application.price.StockPriceRepository
import aseca.acmn.austral.stock_tracker_api.domain.price.StockPrice

class InMemoryStockPriceRepository : StockPriceRepository {
    private val prices = mutableListOf<StockPrice>()

    fun save(price: StockPrice) {
        prices.add(price)
    }

    override fun findLatestByTicker(ticker: String): StockPrice? = prices.filter { it.ticker == ticker }.maxByOrNull { it.fetchedAt }
}
