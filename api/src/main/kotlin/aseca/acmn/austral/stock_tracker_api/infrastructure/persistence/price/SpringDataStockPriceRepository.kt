package aseca.acmn.austral.stock_tracker_api.infrastructure.persistence.price

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.time.LocalDateTime

interface SpringDataStockPriceRepository : JpaRepository<StockPriceEntity, Long> {
    fun findFirstByTickerOrderByFetchedAtDesc(ticker: String): StockPriceEntity?

    @Query("SELECT MAX(s.fetchedAt) FROM StockPriceEntity s")
    fun findMaxFetchedAt(): LocalDateTime?

    @Query(
        "SELECT s FROM StockPriceEntity s " +
            "WHERE s.fetchedAt = (SELECT MAX(s2.fetchedAt) FROM StockPriceEntity s2 WHERE s2.ticker = s.ticker) " +
            "ORDER BY s.ticker ASC",
    )
    fun findLatestPerTicker(): List<StockPriceEntity>
}
