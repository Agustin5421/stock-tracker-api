package aseca.acmn.austral.stock_tracker_api.infrastructure.persistence.portfolio

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.math.BigDecimal
import java.util.UUID

interface SpringDataStockPriceRepository : JpaRepository<StockPriceEntity, UUID> {
    @Query("SELECT s.price FROM StockPriceEntity s WHERE s.ticker = :ticker ORDER BY s.fetchedAt DESC LIMIT 1")
    fun findLatestPriceByTicker(ticker: String): BigDecimal?
}
