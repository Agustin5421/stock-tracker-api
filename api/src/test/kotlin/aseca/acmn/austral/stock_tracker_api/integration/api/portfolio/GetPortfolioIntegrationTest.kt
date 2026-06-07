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
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@SpringBootTest
@AutoConfigureMockMvc
class GetPortfolioIntegrationTest {
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
    fun getPortfolioWithoutTokenReturns401() {
        mockMvc
            .perform(get("/api/portfolio"))
            .andExpect(status().isUnauthorized)
    }

    @Test
    fun getPortfolioWithNoPositionsReturns200() {
        val token = obtainToken("getempty200@example.com", "ValidP@ss1")
        mockMvc
            .perform(get("/api/portfolio").header("Authorization", "Bearer $token"))
            .andExpect(status().isOk)
    }

    @Test
    fun getPortfolioWithNoPositionsReturnsEmptyList() {
        val token = obtainToken("getemptylist@example.com", "ValidP@ss1")
        mockMvc
            .perform(get("/api/portfolio").header("Authorization", "Bearer $token"))
            .andExpect(jsonPath("$.positions").isEmpty)
    }

    @Test
    fun getPortfolioWithNoPositionsReturnsZeroTotal() {
        val token = obtainToken("getemptytotal@example.com", "ValidP@ss1")
        mockMvc
            .perform(get("/api/portfolio").header("Authorization", "Bearer $token"))
            .andExpect(jsonPath("$.totalValue").value(0))
    }

    @Test
    fun getPortfolioReturnsPositionTicker() {
        seedPrice("AAPL", "189.42")
        val token = obtainToken("getticker@example.com", "ValidP@ss1")
        buy(token, "AAPL", 10)
        mockMvc
            .perform(get("/api/portfolio").header("Authorization", "Bearer $token"))
            .andExpect(jsonPath("$.positions[0].ticker").value("AAPL"))
    }

    @Test
    fun getPortfolioReturnsPositionQuantity() {
        seedPrice("MSFT", "300.00")
        val token = obtainToken("getquantity@example.com", "ValidP@ss1")
        buy(token, "MSFT", 7)
        mockMvc
            .perform(get("/api/portfolio").header("Authorization", "Bearer $token"))
            .andExpect(jsonPath("$.positions[0].quantity").value(7))
    }

    @Test
    fun getPortfolioReturnsLatestPrice() {
        seedPrice("GOOG", "175.00")
        val token = obtainToken("getlatestprice@example.com", "ValidP@ss1")
        buy(token, "GOOG", 3)
        mockMvc
            .perform(get("/api/portfolio").header("Authorization", "Bearer $token"))
            .andExpect(jsonPath("$.positions[0].latestPrice").value(175.00))
    }

    @Test
    fun getPortfolioReturnsCurrentValue() {
        seedPrice("NVDA", "100.00")
        val token = obtainToken("getcurrentvalue@example.com", "ValidP@ss1")
        buy(token, "NVDA", 4)
        mockMvc
            .perform(get("/api/portfolio").header("Authorization", "Bearer $token"))
            .andExpect(jsonPath("$.positions[0].currentValue").value(400.00))
    }

    @Test
    fun getPortfolioReturnsTotalValue() {
        seedPrice("AMD", "50.00")
        val token = obtainToken("gettotalvalue@example.com", "ValidP@ss1")
        buy(token, "AMD", 6)
        mockMvc
            .perform(get("/api/portfolio").header("Authorization", "Bearer $token"))
            .andExpect(jsonPath("$.totalValue").value(300.00))
    }
}
