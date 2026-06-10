package aseca.acmn.austral.stock_tracker_api.application.price

import aseca.acmn.austral.stock_tracker_api.domain.price.StockPrice

class ListAvailablePricesService(
    private val availablePricesRepository: AvailablePricesRepository,
) : ListAvailablePricesUseCase {
    override fun listAvailablePrices(): List<StockPrice> = availablePricesRepository.findLatestPerTicker()
}
