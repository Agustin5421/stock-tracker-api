package aseca.acmn.austral.stock_tracker_api.application.price

import aseca.acmn.austral.stock_tracker_api.domain.price.StockPrice

interface AvailablePricesRepository {
    fun findLatestPerTicker(): List<StockPrice>
}
