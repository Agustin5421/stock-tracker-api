package aseca.acmn.austral.stock_tracker_api.application.portfolio

import aseca.acmn.austral.stock_tracker_api.application.price.StockPriceRepository
import java.math.BigDecimal
import java.math.RoundingMode
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
                val avgCost = portfolio.averageCostOf(position.ticker)
                val unrealizedPnl =
                    if (latestPrice != null && avgCost != null) {
                        latestPrice
                            .subtract(avgCost)
                            .multiply(BigDecimal(position.quantity))
                            .setScale(4, RoundingMode.HALF_UP)
                    } else {
                        null
                    }
                val unrealizedPnlPercent =
                    if (latestPrice != null && avgCost != null && avgCost.signum() != 0) {
                        latestPrice
                            .subtract(avgCost)
                            .divide(avgCost, 4, RoundingMode.HALF_UP)
                            .multiply(BigDecimal(100))
                            .setScale(2, RoundingMode.HALF_UP)
                    } else {
                        null
                    }
                PositionView(
                    position.ticker,
                    position.quantity,
                    latestPrice,
                    currentValue,
                    avgCost,
                    unrealizedPnl,
                    unrealizedPnlPercent,
                )
            }
        val totalValue =
            positions.fold(BigDecimal.ZERO) { acc, position ->
                acc + (position.currentValue ?: BigDecimal.ZERO)
            }
        return PortfolioView(positions, totalValue, pricesUpdatedAt)
    }
}
