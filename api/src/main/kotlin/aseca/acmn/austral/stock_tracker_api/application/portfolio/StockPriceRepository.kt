package aseca.acmn.austral.stock_tracker_api.application.portfolio

import java.math.BigDecimal

interface StockPriceRepository {
    fun findLatestByTicker(ticker: String): BigDecimal?
}
