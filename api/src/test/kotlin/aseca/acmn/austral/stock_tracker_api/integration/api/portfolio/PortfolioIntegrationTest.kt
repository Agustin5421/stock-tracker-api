package aseca.acmn.austral.stock_tracker_api.integration.api.portfolio

import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@SpringBootTest
@AutoConfigureMockMvc
class PortfolioIntegrationTest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var jdbcTemplate: JdbcTemplate

    private fun credentialsJson(
        email: String,
        password: String,
    ) = """{"email":"$email","password":"$password"}"""

    private fun obtainToken(
        email: String,
        password: String,
    ): String {
        mockMvc.perform(
            post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(credentialsJson(email, password)),
        )
        val response =
            mockMvc
                .perform(
                    post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(credentialsJson(email, password)),
                ).andReturn()
                .response.contentAsString
        return Regex("\"token\"\\s*:\\s*\"([^\"]+)\"").find(response)!!.groupValues[1]
    }

    private fun seedPrice(
        ticker: String,
        price: String,
    ) {
        jdbcTemplate.update(
            "INSERT INTO stock_prices (ticker, price, fetched_at) VALUES (?, ?, NOW())",
            ticker,
            price,
        )
    }

    @Test
    fun buyWithoutTokenReturns401() {
        mockMvc
            .perform(
                post("/api/portfolio/purchases")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"ticker":"AAPL","quantity":10}"""),
            ).andExpect(status().isUnauthorized)
    }

    @Test
    fun buyWithNoPriceReturns422() {
        val token = obtainToken("buy422@example.com", "ValidP@ss1")
        mockMvc
            .perform(
                post("/api/portfolio/purchases")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer $token")
                    .content("""{"ticker":"NOPRICE","quantity":5}"""),
            ).andExpect(status().`is`(422))
    }

    @Test
    fun buyWithZeroQuantityReturns400() {
        val token = obtainToken("buy400@example.com", "ValidP@ss1")
        mockMvc
            .perform(
                post("/api/portfolio/purchases")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer $token")
                    .content("""{"ticker":"AAPL","quantity":0}"""),
            ).andExpect(status().isBadRequest)
    }

    @Test
    fun buyWithValidDataReturns201() {
        seedPrice("MSFT", "300.00")
        val token = obtainToken("buy201@example.com", "ValidP@ss1")
        mockMvc
            .perform(
                post("/api/portfolio/purchases")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer $token")
                    .content("""{"ticker":"MSFT","quantity":5}"""),
            ).andExpect(status().isCreated)
    }

    @Test
    fun buyReturnsCorrectTicker() {
        seedPrice("GOOG", "175.00")
        val token = obtainToken("buyticker@example.com", "ValidP@ss1")
        mockMvc
            .perform(
                post("/api/portfolio/purchases")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer $token")
                    .content("""{"ticker":"GOOG","quantity":3}"""),
            ).andExpect(jsonPath("$.ticker").value("GOOG"))
    }
}
