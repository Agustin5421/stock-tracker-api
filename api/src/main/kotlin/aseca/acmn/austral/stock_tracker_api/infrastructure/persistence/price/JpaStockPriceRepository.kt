package aseca.acmn.austral.stock_tracker_api.infrastructure.persistence.price

import aseca.acmn.austral.stock_tracker_api.application.price.StockPriceRepository
import aseca.acmn.austral.stock_tracker_api.domain.price.StockPrice
import org.springframework.stereotype.Repository

@Repository
class JpaStockPriceRepository(
    private val springData: SpringDataStockPriceRepository,
) : StockPriceRepository {
    override fun findLatestByTicker(ticker: String): StockPrice? = springData.findFirstByTickerOrderByFetchedAtDesc(ticker)?.toDomain()
}
