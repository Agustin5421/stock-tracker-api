package aseca.acmn.austral.stock_tracker_api.application.portfolio

import aseca.acmn.austral.stock_tracker_api.application.price.StockPriceRepository
import java.math.BigDecimal
import java.util.UUID

class GetPortfolioService(
    private val portfolioRepository: PortfolioRepository,
    private val stockPriceRepository: StockPriceRepository,
) : GetPortfolioUseCase {
    override fun getPortfolio(userId: UUID): PortfolioView {
        val pricesUpdatedAt = stockPriceRepository.findLatestFetchedAt()
        val portfolio =
            portfolioRepository.findByUserId(userId)
                ?: return PortfolioView(emptyList(), BigDecimal.ZERO, pricesUpdatedAt)
        val positions =
            portfolio.positions.map { position ->
                val latestPrice = stockPriceRepository.findLatestByTicker(position.ticker)?.price
                val currentValue = latestPrice?.multiply(BigDecimal(position.quantity))
                PositionView(position.ticker, position.quantity, latestPrice, currentValue)
            }
        val totalValue =
            positions.fold(BigDecimal.ZERO) { acc, position ->
                acc + (position.currentValue ?: BigDecimal.ZERO)
            }
        return PortfolioView(positions, totalValue, pricesUpdatedAt)
    }
}
