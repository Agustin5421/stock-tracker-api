package aseca.acmn.austral.stock_tracker_api.infrastructure.portfolio

import aseca.acmn.austral.stock_tracker_api.application.portfolio.BuyStockService
import aseca.acmn.austral.stock_tracker_api.application.portfolio.BuyStockUseCase
import aseca.acmn.austral.stock_tracker_api.application.portfolio.GetPortfolioService
import aseca.acmn.austral.stock_tracker_api.application.portfolio.GetPortfolioUseCase
import aseca.acmn.austral.stock_tracker_api.application.portfolio.PortfolioRepository
import aseca.acmn.austral.stock_tracker_api.application.price.StockPriceRepository
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class PortfolioConfig {
    @Bean
    fun buyStockUseCase(
        portfolioRepository: PortfolioRepository,
        stockPriceRepository: StockPriceRepository,
    ): BuyStockUseCase = BuyStockService(portfolioRepository, stockPriceRepository)

    @Bean
    fun getPortfolioUseCase(
        portfolioRepository: PortfolioRepository,
        stockPriceRepository: StockPriceRepository,
    ): GetPortfolioUseCase = GetPortfolioService(portfolioRepository, stockPriceRepository)
}
