package aseca.acmn.austral.stock_tracker_api.unit.application

import aseca.acmn.austral.stock_tracker_api.application.RegisterUserService
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import kotlin.test.assertNotNull

class RegisterUserServiceTest {
    private fun service() = RegisterUserService(InMemoryUserRepository(), FakePasswordHasher())

    @Test
    fun registerReturnsNonNullUUID() {
        val id = service().register("user@example.com", "ValidP@ss1")
        assertNotNull(id)
    }

    @Test
    fun registerWithDuplicateEmailThrows() {
        val svc = service()
        svc.register("user@example.com", "ValidP@ss1")
        assertThrows<IllegalArgumentException> {
            svc.register("user@example.com", "AnotherP@ss1")
        }
    }

    @Test
    fun registerWithInvalidEmailThrows() {
        assertThrows<IllegalArgumentException> {
            service().register("not-an-email", "ValidP@ss1")
        }
    }

    @Test
    fun registerWithWeakPasswordThrows() {
        assertThrows<IllegalArgumentException> {
            service().register("user@example.com", "weak")
        }
    }
}
