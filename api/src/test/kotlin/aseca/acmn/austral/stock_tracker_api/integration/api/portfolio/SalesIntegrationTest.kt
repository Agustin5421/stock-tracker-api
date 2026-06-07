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
class SalesIntegrationTest {
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
    fun sellWithoutTokenReturns401() {
        mockMvc
            .perform(
                post("/api/portfolio/sales")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"ticker":"AAPL","quantity":5}"""),
            ).andExpect(status().isUnauthorized)
    }

    @Test
    fun sellWithZeroQuantityReturns400() {
        val token = obtainToken("sell400@example.com", "ValidP@ss1")
        mockMvc
            .perform(
                post("/api/portfolio/sales")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer $token")
                    .content("""{"ticker":"AAPL","quantity":0}"""),
            ).andExpect(status().isBadRequest)
    }

    @Test
    fun sellWithNoPriceReturns422() {
        val token = obtainToken("sell422noprice@example.com", "ValidP@ss1")
        mockMvc
            .perform(
                post("/api/portfolio/sales")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer $token")
                    .content("""{"ticker":"NOPRICESEL","quantity":5}"""),
            ).andExpect(status().`is`(422))
    }

    @Test
    fun sellMoreThanHeldReturns422() {
        seedPrice("SELLTOOMCH", "120.00")
        val token = obtainToken("sell422insufficient@example.com", "ValidP@ss1")
        buy(token, "SELLTOOMCH", 3)
        mockMvc
            .perform(
                post("/api/portfolio/sales")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer $token")
                    .content("""{"ticker":"SELLTOOMCH","quantity":10}"""),
            ).andExpect(status().`is`(422))
    }

    @Test
    fun sellWithValidDataReturns200() {
        seedPrice("SELLOK", "200.00")
        val token = obtainToken("sell200@example.com", "ValidP@ss1")
        buy(token, "SELLOK", 10)
        mockMvc
            .perform(
                post("/api/portfolio/sales")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer $token")
                    .content("""{"ticker":"SELLOK","quantity":4}"""),
            ).andExpect(status().isOk)
    }

    @Test
    fun sellReturnsRemainingQuantity() {
        seedPrice("SELLREMAIN", "200.00")
        val token = obtainToken("sellremain@example.com", "ValidP@ss1")
        buy(token, "SELLREMAIN", 10)
        mockMvc
            .perform(
                post("/api/portfolio/sales")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer $token")
                    .content("""{"ticker":"SELLREMAIN","quantity":4}"""),
            ).andExpect(jsonPath("$.quantity").value(6))
    }
}
