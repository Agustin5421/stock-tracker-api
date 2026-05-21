package aseca.acmn.austral.stock_tracker_api.integration

import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@SpringBootTest
@AutoConfigureMockMvc
class UserIntegrationTest {
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
    fun meWithoutTokenReturns401() {
        mockMvc
            .perform(get("/users/current"))
            .andExpect(status().isUnauthorized)
    }

    @Test
    fun meWithValidTokenReturns200() {
        val token = obtainToken("me1@example.com", "ValidP@ss1")
        mockMvc
            .perform(get("/users/current").header("Authorization", "Bearer $token"))
            .andExpect(status().isOk)
    }

    @Test
    fun meWithValidTokenReturnsUserEmail() {
        val email = "me2@example.com"
        val token = obtainToken(email, "ValidP@ss1")
        mockMvc
            .perform(get("/users/current").header("Authorization", "Bearer $token"))
            .andExpect(jsonPath("$.email").value(email))
    }

    @Test
    fun meWithMalformedTokenReturns401() {
        mockMvc
            .perform(get("/users/current").header("Authorization", "Bearer not-a-jwt"))
            .andExpect(status().isUnauthorized)
    }
}
