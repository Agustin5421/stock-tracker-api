package aseca.acmn.austral.stock_tracker_api.infrastructure.persistence.price

import aseca.acmn.austral.stock_tracker_api.application.price.AvailablePricesRepository
import aseca.acmn.austral.stock_tracker_api.application.price.StockPriceRepository
import aseca.acmn.austral.stock_tracker_api.domain.price.StockPrice
import org.springframework.stereotype.Repository

@Repository
class JpaStockPriceRepository(
    private val springData: SpringDataStockPriceRepository,
) : StockPriceRepository,
    AvailablePricesRepository {
    override fun findLatestByTicker(ticker: String): StockPrice? = springData.findFirstByTickerOrderByFetchedAtDesc(ticker)?.toDomain()

    override fun findLatestPerTicker(): List<StockPrice> = springData.findLatestPerTicker().map { it.toDomain() }
}
