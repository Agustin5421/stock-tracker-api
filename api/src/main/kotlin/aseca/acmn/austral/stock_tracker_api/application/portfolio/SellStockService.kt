package aseca.acmn.austral.stock_tracker_api.application.portfolio

import aseca.acmn.austral.stock_tracker_api.application.price.StockPriceRepository
import java.util.UUID

class SellStockService(
    private val portfolioRepository: PortfolioRepository,
    private val stockPriceRepository: StockPriceRepository,
) : SellStockUseCase {
    override fun sell(
        userId: UUID,
        ticker: String,
        quantity: Int,
    ): SaleResult {
        val price = stockPriceRepository.findLatestByTicker(ticker)?.price ?: throw NoPriceAvailableException(ticker)
        val portfolio = portfolioRepository.findByUserId(userId) ?: throw InsufficientSharesException(ticker)
        val available = portfolio.positions.find { it.ticker == ticker }?.quantity ?: 0
        if (quantity > available) throw InsufficientSharesException(ticker)
        val position = portfolio.sell(ticker, quantity, price)
        portfolioRepository.save(portfolio)
        return SaleResult(position, price)
    }
}
