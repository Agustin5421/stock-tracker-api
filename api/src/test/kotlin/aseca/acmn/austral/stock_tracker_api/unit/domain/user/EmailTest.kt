package aseca.acmn.austral.stock_tracker_api.unit.domain.user

import aseca.acmn.austral.stock_tracker_api.domain.user.Email
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import kotlin.test.assertEquals

class EmailTest {
    @Test
    fun validEmailIsAccepted() {
        val email = Email("user@example.com")
        assertEquals("user@example.com", email.value)
    }

    @Test
    fun emailWithoutAtSignThrows() {
        assertThrows<IllegalArgumentException> { Email("userexample.com") }
    }

    @Test
    fun emailWithoutDomainThrows() {
        assertThrows<IllegalArgumentException> { Email("user@") }
    }

    @Test
    fun emailWithoutLocalPartThrows() {
        assertThrows<IllegalArgumentException> { Email("@example.com") }
    }

    @Test
    fun blankEmailThrows() {
        assertThrows<IllegalArgumentException> { Email("   ") }
    }

    @Test
    fun emailIsStoredLowercased() {
        val email = Email("User@Example.COM")
        assertEquals("user@example.com", email.value)
    }

    @Test
    fun twoEmailsWithSameValueAreEqual() {
        assertEquals(Email("a@b.com"), Email("a@b.com"))
    }
}
