package aseca.acmn.austral.stock_tracker_api.application.price

import aseca.acmn.austral.stock_tracker_api.domain.price.StockPrice

interface StockPriceRepository {
    fun findLatestByTicker(ticker: String): StockPrice?
}
