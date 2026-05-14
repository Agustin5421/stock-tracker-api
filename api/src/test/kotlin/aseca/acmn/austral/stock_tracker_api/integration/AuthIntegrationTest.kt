package aseca.acmn.austral.stock_tracker_api.integration

import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@SpringBootTest
@AutoConfigureMockMvc
class AuthIntegrationTest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    private fun registerJson(email: String, password: String) =
        """{"email":"$email","password":"$password"}"""

    @Test
    fun registerReturns201() {
        mockMvc.perform(
            post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerJson("newuser@example.com", "ValidP@ss1")),
        ).andExpect(status().isCreated)
    }

    @Test
    fun registerReturnsUserIdInBody() {
        mockMvc.perform(
            post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerJson("newuser2@example.com", "ValidP@ss1")),
        ).andExpect(jsonPath("$.id").isNotEmpty)
    }

    @Test
    fun duplicateEmailRegistrationReturns400() {
        val body = registerJson("dupe@example.com", "ValidP@ss1")
        mockMvc.perform(post("/auth/register").contentType(MediaType.APPLICATION_JSON).content(body))
        mockMvc.perform(
            post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body),
        ).andExpect(status().isBadRequest)
    }

    @Test
    fun duplicateEmailRegistrationReturnsErrorBody() {
        val body = registerJson("dupe2@example.com", "ValidP@ss1")
        mockMvc.perform(post("/auth/register").contentType(MediaType.APPLICATION_JSON).content(body))
        mockMvc.perform(
            post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body),
        ).andExpect(jsonPath("$.error").isNotEmpty)
    }

    @Test
    fun weakPasswordRegistrationReturns400() {
        mockMvc.perform(
            post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerJson("weakpw@example.com", "weak")),
        ).andExpect(status().isBadRequest)
    }

    @Test
    fun weakPasswordRegistrationReturnsErrorBody() {
        mockMvc.perform(
            post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerJson("weakpw2@example.com", "weak")),
        ).andExpect(jsonPath("$.error").isNotEmpty)
    }

    @Test
    fun loginAfterRegisterReturns200() {
        val email = "logintest@example.com"
        mockMvc.perform(
            post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerJson(email, "ValidP@ss1")),
        )
        mockMvc.perform(
            post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerJson(email, "ValidP@ss1")),
        ).andExpect(status().isOk)
    }

    @Test
    fun loginAfterRegisterReturnsNonBlankToken() {
        val email = "tokentest@example.com"
        mockMvc.perform(
            post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerJson(email, "ValidP@ss1")),
        )
        mockMvc.perform(
            post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerJson(email, "ValidP@ss1")),
        ).andExpect(jsonPath("$.token").isNotEmpty)
    }

    @Test
    fun loginWithWrongPasswordReturns401() {
        val email = "wrongpw@example.com"
        mockMvc.perform(
            post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerJson(email, "ValidP@ss1")),
        )
        mockMvc.perform(
            post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerJson(email, "WrongP@ss1")),
        ).andExpect(status().isUnauthorized)
    }

    @Test
    fun loginWithWrongPasswordReturnsErrorBody() {
        val email = "wrongpw2@example.com"
        mockMvc.perform(
            post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerJson(email, "ValidP@ss1")),
        )
        mockMvc.perform(
            post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerJson(email, "WrongP@ss1")),
        ).andExpect(jsonPath("$.error").isNotEmpty)
    }

    @Test
    fun loginWithUnknownEmailReturns401() {
        mockMvc.perform(
            post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerJson("nobody@example.com", "ValidP@ss1")),
        ).andExpect(status().isUnauthorized)
    }

    @Test
    fun loginWithUnknownEmailReturnsErrorBody() {
        mockMvc.perform(
            post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerJson("ghost@example.com", "ValidP@ss1")),
        ).andExpect(jsonPath("$.error").isNotEmpty)
    }
}
