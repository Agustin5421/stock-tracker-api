package aseca.acmn.austral.stock_tracker_api.infrastructure.price

import aseca.acmn.austral.stock_tracker_api.application.price.AvailablePricesRepository
import aseca.acmn.austral.stock_tracker_api.application.price.GetLatestPriceUseCase
import aseca.acmn.austral.stock_tracker_api.application.price.ListAvailablePricesService
import aseca.acmn.austral.stock_tracker_api.application.price.ListAvailablePricesUseCase
import aseca.acmn.austral.stock_tracker_api.application.price.StockPriceRepository
import aseca.acmn.austral.stock_tracker_api.application.price.StockPriceService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class PriceConfig {
    @Bean
    fun getLatestPriceUseCase(stockPriceRepository: StockPriceRepository): GetLatestPriceUseCase = StockPriceService(stockPriceRepository)

    @Bean
    fun listAvailablePricesUseCase(availablePricesRepository: AvailablePricesRepository): ListAvailablePricesUseCase =
        ListAvailablePricesService(availablePricesRepository)
}
