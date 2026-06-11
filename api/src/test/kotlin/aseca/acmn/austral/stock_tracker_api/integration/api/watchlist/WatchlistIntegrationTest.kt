package aseca.acmn.austral.stock_tracker_api.integration.api.watchlist

import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@SpringBootTest
@AutoConfigureMockMvc
class WatchlistIntegrationTest {
    @Autowired
    private lateinit var mockMvc: MockMvc

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

    @Test
    fun watchlistWithoutTokenReturns401() {
        mockMvc
            .perform(
                get("/api/watchlist"),
            ).andExpect(status().isUnauthorized)

        mockMvc
            .perform(
                post("/api/watchlist")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"ticker":"AAPL","name":"Apple Inc.","cik":"0000320193"}"""),
            ).andExpect(status().isUnauthorized)

        mockMvc
            .perform(
                delete("/api/watchlist/AAPL"),
            ).andExpect(status().isUnauthorized)
    }

    @Test
    fun addCompanyToWatchlistSucceeds() {
        val token = obtainToken("watchlist201@example.com", "ValidP@ss1")
        mockMvc
            .perform(
                post("/api/watchlist")
                    .header("Authorization", "Bearer $token")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"ticker":"AAPL","name":"Apple Inc.","cik":"0000320193"}"""),
            ).andExpect(status().isCreated)
            .andExpect(jsonPath("$.ticker").value("AAPL"))
            .andExpect(jsonPath("$.name").value("Apple Inc."))
            .andExpect(jsonPath("$.cik").value("0000320193"))
    }

    @Test
    fun addDuplicateCompanyToWatchlistReturns400() {
        val token = obtainToken("watchlistdup@example.com", "ValidP@ss1")
        mockMvc
            .perform(
                post("/api/watchlist")
                    .header("Authorization", "Bearer $token")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"ticker":"AAPL","name":"Apple Inc.","cik":"0000320193"}"""),
            ).andExpect(status().isCreated)

        // Try duplicate
        mockMvc
            .perform(
                post("/api/watchlist")
                    .header("Authorization", "Bearer $token")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"ticker":"AAPL","name":"Apple Inc.","cik":"0000320193"}"""),
            ).andExpect(status().isBadRequest)
    }

    @Test
    fun getWatchlistReturnsItems() {
        val token = obtainToken("watchlistget@example.com", "ValidP@ss1")
        mockMvc
            .perform(
                post("/api/watchlist")
                    .header("Authorization", "Bearer $token")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"ticker":"AAPL","name":"Apple Inc.","cik":"0000320193"}"""),
            ).andExpect(status().isCreated)

        mockMvc
            .perform(
                post("/api/watchlist")
                    .header("Authorization", "Bearer $token")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"ticker":"MSFT","name":"Microsoft","cik":"0000789019"}"""),
            ).andExpect(status().isCreated)

        mockMvc
            .perform(
                get("/api/watchlist")
                    .header("Authorization", "Bearer $token"),
            ).andExpect(status().isOk)
            .andExpect(jsonPath("$.length()").value(2))
            .andExpect(jsonPath("$[0].ticker").value("AAPL"))
            .andExpect(jsonPath("$[1].ticker").value("MSFT"))
    }

    @Test
    fun getWatchlistEmptyReturnsEmptyList() {
        val token = obtainToken("watchlistempty@example.com", "ValidP@ss1")
        mockMvc
            .perform(
                get("/api/watchlist")
                    .header("Authorization", "Bearer $token"),
            ).andExpect(status().isOk)
            .andExpect(jsonPath("$.length()").value(0))
    }

    @Test
    fun watchlistAisolationByUsers() {
        val token1 = obtainToken("user1@example.com", "ValidP@ss1")
        val token2 = obtainToken("user2@example.com", "ValidP@ss1")

        mockMvc
            .perform(
                post("/api/watchlist")
                    .header("Authorization", "Bearer $token1")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"ticker":"AAPL","name":"Apple Inc.","cik":"0000320193"}"""),
            ).andExpect(status().isCreated)

        mockMvc
            .perform(
                post("/api/watchlist")
                    .header("Authorization", "Bearer $token2")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"ticker":"MSFT","name":"Microsoft","cik":"0000789019"}"""),
            ).andExpect(status().isCreated)

        // User 1 only gets AAPL
        mockMvc
            .perform(
                get("/api/watchlist")
                    .header("Authorization", "Bearer $token1"),
            ).andExpect(status().isOk)
            .andExpect(jsonPath("$.length()").value(1))
            .andExpect(jsonPath("$[0].ticker").value("AAPL"))

        // User 2 only gets MSFT
        mockMvc
            .perform(
                get("/api/watchlist")
                    .header("Authorization", "Bearer $token2"),
            ).andExpect(status().isOk)
            .andExpect(jsonPath("$.length()").value(1))
            .andExpect(jsonPath("$[0].ticker").value("MSFT"))
    }

    @Test
    fun deleteFromWatchlistRemovesItem() {
        val token = obtainToken("watchlistdel@example.com", "ValidP@ss1")
        mockMvc
            .perform(
                post("/api/watchlist")
                    .header("Authorization", "Bearer $token")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""{"ticker":"AAPL","name":"Apple Inc.","cik":"0000320193"}"""),
            ).andExpect(status().isCreated)

        mockMvc
            .perform(
                delete("/api/watchlist/AAPL")
                    .header("Authorization", "Bearer $token"),
            ).andExpect(status().isOk)

        // Verifying it was removed
        mockMvc
            .perform(
                get("/api/watchlist")
                    .header("Authorization", "Bearer $token"),
            ).andExpect(status().isOk)
            .andExpect(jsonPath("$.length()").value(0))
    }
}
