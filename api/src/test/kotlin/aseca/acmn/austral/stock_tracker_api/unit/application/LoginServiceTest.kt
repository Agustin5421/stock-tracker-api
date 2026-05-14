package aseca.acmn.austral.stock_tracker_api.unit.application

import aseca.acmn.austral.stock_tracker_api.application.LoginService
import aseca.acmn.austral.stock_tracker_api.application.RegisterUserService

import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

class LoginServiceTest {

    private fun setup(): LoginService {
        val repo = InMemoryUserRepository()
        val hasher = FakePasswordHasher()
        RegisterUserService(repo, hasher).register("user@example.com", "ValidP@ss1")
        return LoginService(repo, FixedTokenService(), hasher)
    }

    @Test
    fun loginWithCorrectCredentialsReturnsToken() {
        val token = setup().login("user@example.com", "ValidP@ss1")
        assertNotNull(token)
    }

    @Test
    fun loginTokenIsNonBlank() {
        val token = setup().login("user@example.com", "ValidP@ss1")
        assertTrue(token.isNotBlank())
    }

    @Test
    fun loginWithWrongPasswordThrows() {
        assertThrows<IllegalArgumentException> {
            setup().login("user@example.com", "WrongP@ss1")
        }
    }

    @Test
    fun loginWithUnknownEmailThrows() {
        assertThrows<IllegalArgumentException> {
            setup().login("nobody@example.com", "ValidP@ss1")
        }
    }

    @Test
    fun loginWithCaseDifferentEmailSucceeds() {
        val token = setup().login("USER@EXAMPLE.COM", "ValidP@ss1")
        assertNotNull(token)
    }
}
