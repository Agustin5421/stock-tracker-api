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
import java.util.UUID

@SpringBootTest
@AutoConfigureMockMvc
class OperationHistoryIntegrationTest {
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

    private fun portfolioIdFor(email: String): String =
        jdbcTemplate.queryForObject(
            "SELECT p.id FROM portfolios p JOIN users u ON u.id = p.user_id WHERE u.email = ?",
            String::class.java,
            email,
        )!!

    private fun insertOperation(
        portfolioId: String,
        ticker: String,
        executedAt: String,
    ) {
        jdbcTemplate.update(
            "INSERT INTO operations (id, portfolio_id, type, ticker, quantity, price, executed_at) " +
                "VALUES (?, ?, 'BUY', ?, 1, 10.00, ?)",
            UUID.randomUUID().toString(),
            portfolioId,
            ticker,
            executedAt,
        )
    }

    @Test
    fun getOperationsWithoutTokenReturns401() {
        mockMvc
            .perform(get("/api/portfolio/operations"))
            .andExpect(status().isUnauthorized)
    }

    @Test
    fun getOperationsReturnsMostRecentFirst() {
        val email = "ophistoryorder@example.com"
        seedPrice("AAPL", "100.00")
        val token = obtainToken(email, "ValidP@ss1")
        buy(token, "AAPL", 1)
        val portfolioId = portfolioIdFor(email)
        insertOperation(portfolioId, "OLD", "2020-01-01 00:00:00")
        insertOperation(portfolioId, "NEW", "2030-01-01 00:00:00")
        mockMvc
            .perform(get("/api/portfolio/operations").header("Authorization", "Bearer $token"))
            .andExpect(jsonPath("$[0].ticker").value("NEW"))
    }

    @Test
    fun getOperationsDoesNotIncludeAnotherUsersOperations() {
        seedPrice("TSLA", "300.00")
        seedPrice("NVDA", "400.00")
        val otherToken = obtainToken("ophistoryother@example.com", "ValidP@ss1")
        buy(otherToken, "TSLA", 1)
        val token = obtainToken("ophistorymine@example.com", "ValidP@ss1")
        buy(token, "NVDA", 1)
        mockMvc
            .perform(get("/api/portfolio/operations").header("Authorization", "Bearer $token"))
            .andExpect(jsonPath("$[?(@.ticker == 'TSLA')]").isEmpty)
    }
}
