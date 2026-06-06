package aseca.acmn.austral.stock_tracker_api.infrastructure.persistence.portfolio

import aseca.acmn.austral.stock_tracker_api.application.portfolio.StockPriceRepository
import org.springframework.stereotype.Repository
import java.math.BigDecimal

@Repository
class JpaStockPriceRepository(
    private val springData: SpringDataStockPriceRepository,
) : StockPriceRepository {
    override fun findLatestByTicker(ticker: String): BigDecimal? = springData.findLatestPriceByTicker(ticker)
}
