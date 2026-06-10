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
import java.sql.Timestamp

@SpringBootTest
@AutoConfigureMockMvc
class StockPriceIntegrationTest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var jdbcTemplate: JdbcTemplate

    @BeforeEach
    fun seed() {
        jdbcTemplate.update("DELETE FROM stock_prices")
        jdbcTemplate.update(
            "INSERT INTO stock_prices (ticker, price, fetched_at) VALUES (?, ?, ?)",
            "AAPL",
            java.math.BigDecimal("189.4200"),
            Timestamp.valueOf("2026-05-28 14:32:00.000"),
        )
    }

    @Test
    fun latestPriceReturns200() {
        mockMvc
            .perform(get("/api/prices/AAPL/latest"))
            .andExpect(status().isOk)
    }

    @Test
    fun latestPriceReturnsTicker() {
        mockMvc
            .perform(get("/api/prices/AAPL/latest"))
            .andExpect(jsonPath("$.ticker").value("AAPL"))
    }

    @Test
    fun latestPriceReturnsPrice() {
        mockMvc
            .perform(get("/api/prices/AAPL/latest"))
            .andExpect(jsonPath("$.price").value(189.42))
    }

    @Test
    fun latestPriceReturnsFetchedAt() {
        mockMvc
            .perform(get("/api/prices/AAPL/latest"))
            .andExpect(jsonPath("$.fetchedAt").isNotEmpty)
    }

    @Test
    fun unknownTickerReturns404() {
        mockMvc
            .perform(get("/api/prices/NOPE/latest"))
            .andExpect(status().isNotFound)
    }
}
