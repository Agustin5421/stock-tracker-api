package aseca.acmn.austral.stock_tracker_api.integration.api.price

import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.math.BigDecimal
import java.sql.Timestamp

@SpringBootTest
@AutoConfigureMockMvc
class AvailablePricesIntegrationTest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var jdbcTemplate: JdbcTemplate

    private fun insertPrice(
        ticker: String,
        price: String,
        fetchedAt: String,
    ) {
        jdbcTemplate.update(
            "INSERT INTO stock_prices (ticker, price, fetched_at) VALUES (?, ?, ?)",
            ticker,
            BigDecimal(price),
            Timestamp.valueOf(fetchedAt),
        )
    }

    @BeforeEach
    fun seed() {
        jdbcTemplate.update("DELETE FROM stock_prices")
        insertPrice("AAPL", "180.0000", "2026-05-20 14:00:00.000")
        insertPrice("AAPL", "190.0000", "2026-05-28 14:00:00.000")
        insertPrice("MSFT", "300.0000", "2026-05-27 14:00:00.000")
    }

    @Test
    fun listReturns200() {
        mockMvc
            .perform(get("/api/prices"))
            .andExpect(status().isOk)
    }

    @Test
    fun listReturnsOneEntryPerDistinctTicker() {
        mockMvc
            .perform(get("/api/prices"))
            .andExpect(jsonPath("$.length()").value(2))
    }

    @Test
    fun listReturnsLatestPricePerTicker() {
        mockMvc
            .perform(get("/api/prices"))
            .andExpect(jsonPath("$[0].price").value(190.0))
    }

    @Test
    fun listIsOrderedByTicker() {
        mockMvc
            .perform(get("/api/prices"))
            .andExpect(jsonPath("$[1].ticker").value("MSFT"))
    }

    @Test
    fun listIsEmptyWhenNoPrices() {
        jdbcTemplate.update("DELETE FROM stock_prices")
        mockMvc
            .perform(get("/api/prices"))
            .andExpect(jsonPath("$.length()").value(0))
    }
}
