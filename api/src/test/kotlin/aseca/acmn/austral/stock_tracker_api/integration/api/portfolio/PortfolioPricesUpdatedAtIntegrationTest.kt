package aseca.acmn.austral.stock_tracker_api.integration.api.portfolio

import org.hamcrest.Matchers.startsWith
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath

@SpringBootTest
@AutoConfigureMockMvc
class PortfolioPricesUpdatedAtIntegrationTest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var jdbcTemplate: JdbcTemplate

    private fun obtainToken(
        email: String,
        password: String,
    ): String {
        val credentials = """{"email":"$email","password":"$password"}"""
        mockMvc.perform(
            post("/auth/register").contentType(MediaType.APPLICATION_JSON).content(credentials),
        )
        val response =
            mockMvc
                .perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON).content(credentials))
                .andReturn()
                .response.contentAsString
        return Regex("\"token\"\\s*:\\s*\"([^\"]+)\"").find(response)!!.groupValues[1]
    }

    // Seed a far-future fetched_at so the system-wide MAX is deterministic
    // regardless of other tests seeding prices with NOW().
    private fun seedPriceAt(
        ticker: String,
        fetchedAt: String,
    ) {
        jdbcTemplate.update(
            "INSERT INTO stock_prices (ticker, price, fetched_at) VALUES (?, 1.00, ?)",
            ticker,
            fetchedAt,
        )
    }

    @Test
    fun getPortfolioExposesLatestPriceUpdateTimestamp() {
        seedPriceAt("PUAT", "2999-01-01 00:00:00")
        val token = obtainToken("pricesupdatedat@example.com", "ValidP@ss1")
        mockMvc
            .perform(get("/api/portfolio").header("Authorization", "Bearer $token"))
            .andExpect(jsonPath("$.pricesUpdatedAt").value(startsWith("2999")))
    }
}
