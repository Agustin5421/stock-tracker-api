package aseca.acmn.austral.stock_tracker_api.infrastructure.persistence.price

import org.springframework.data.jpa.repository.JpaRepository

interface SpringDataStockPriceRepository : JpaRepository<StockPriceEntity, Long> {
    fun findFirstByTickerOrderByFetchedAtDesc(ticker: String): StockPriceEntity?
}
