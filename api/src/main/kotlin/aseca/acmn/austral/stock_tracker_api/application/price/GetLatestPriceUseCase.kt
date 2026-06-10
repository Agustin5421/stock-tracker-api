package aseca.acmn.austral.stock_tracker_api.application.price

import aseca.acmn.austral.stock_tracker_api.domain.price.StockPrice

interface GetLatestPriceUseCase {
    fun getLatestPrice(ticker: String): StockPrice
}
