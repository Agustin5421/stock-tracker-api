package aseca.acmn.austral.stock_tracker_api.unit.application.price

import aseca.acmn.austral.stock_tracker_api.application.price.PriceNotFoundException
import aseca.acmn.austral.stock_tracker_api.application.price.StockPriceService
import aseca.acmn.austral.stock_tracker_api.domain.price.StockPrice
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.math.BigDecimal
import java.time.Instant
import kotlin.test.assertEquals

class StockPriceServiceTest {
    private fun service(repository: InMemoryStockPriceRepository) = StockPriceService(repository)

    @Test
    fun getLatestPriceReturnsMostRecentEntry() {
        val repository = InMemoryStockPriceRepository()
        repository.save(StockPrice("AAPL", BigDecimal("100.0000"), Instant.parse("2026-05-27T10:00:00Z")))
        repository.save(StockPrice("AAPL", BigDecimal("189.4200"), Instant.parse("2026-05-28T14:32:00Z")))

        val latest = service(repository).getLatestPrice("AAPL")

        assertEquals(BigDecimal("189.4200"), latest.price)
    }

    @Test
    fun getLatestPriceThrowsWhenNoDataExists() {
        val service = service(InMemoryStockPriceRepository())

        assertThrows<PriceNotFoundException> {
            service.getLatestPrice("AAPL")
        }
    }
}
