package aseca.acmn.austral.stock_tracker_api.application.portfolio

import aseca.acmn.austral.stock_tracker_api.application.price.StockPriceRepository
import aseca.acmn.austral.stock_tracker_api.domain.portfolio.Portfolio
import java.util.UUID

class BuyStockService(
    private val portfolioRepository: PortfolioRepository,
    private val stockPriceRepository: StockPriceRepository,
) : BuyStockUseCase {
    override fun buy(
        userId: UUID,
        ticker: String,
        quantity: Int,
    ): PurchaseResult {
        val price = stockPriceRepository.findLatestByTicker(ticker)?.price ?: throw NoPriceAvailableException(ticker)
        val portfolio = portfolioRepository.findByUserId(userId) ?: Portfolio.create(userId)
        val position = portfolio.buy(ticker, quantity, price)
        portfolioRepository.save(portfolio)
        return PurchaseResult(position, price)
    }
}
