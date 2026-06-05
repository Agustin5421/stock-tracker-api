package aseca.acmn.austral.stock_tracker_api.application.price

import aseca.acmn.austral.stock_tracker_api.domain.price.StockPrice

class StockPriceService(
    private val stockPriceRepository: StockPriceRepository,
) : GetLatestPriceUseCase {
    override fun getLatestPrice(ticker: String): StockPrice =
        stockPriceRepository.findLatestByTicker(ticker.uppercase())
            ?: throw PriceNotFoundException(ticker)
}
