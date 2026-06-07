package aseca.acmn.austral.stock_tracker_api.integration.api.portfolio

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
class PortfolioPnlIntegrationTest {
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

    private fun buy(
        token: String,
        ticker: String,
        quantity: Int,
    ) {
        mockMvc.perform(
            post("/api/portfolio/purchases")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer $token")
                .content("""{"ticker":"$ticker","quantity":$quantity}"""),
        )
    }

    @Test
    fun getPortfolioReturnsAvgCost() {
        seedPrice("PNLA", "100.00")
        val token = obtainToken("pnlavgcost@example.com", "ValidP@ss1")
        buy(token, "PNLA", 4)
        seedPrice("PNLA", "150.00")
        mockMvc
            .perform(get("/api/portfolio").header("Authorization", "Bearer $token"))
            .andExpect(jsonPath("$.positions[0].avgCost").value(100.0000))
    }

    @Test
    fun getPortfolioReturnsUnrealizedPnl() {
        seedPrice("PNLB", "100.00")
        val token = obtainToken("pnlunrealized@example.com", "ValidP@ss1")
        buy(token, "PNLB", 4)
        seedPrice("PNLB", "150.00")
        mockMvc
            .perform(get("/api/portfolio").header("Authorization", "Bearer $token"))
            .andExpect(jsonPath("$.positions[0].unrealizedPnl").value(200.0000))
    }

    @Test
    fun getPortfolioReturnsUnrealizedPnlPercent() {
        seedPrice("PNLC", "100.00")
        val token = obtainToken("pnlpercent@example.com", "ValidP@ss1")
        buy(token, "PNLC", 4)
        seedPrice("PNLC", "150.00")
        mockMvc
            .perform(get("/api/portfolio").header("Authorization", "Bearer $token"))
            .andExpect(jsonPath("$.positions[0].unrealizedPnlPercent").value(50.00))
    }
}
