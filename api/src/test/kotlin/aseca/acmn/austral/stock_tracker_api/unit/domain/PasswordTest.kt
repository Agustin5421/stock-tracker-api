package aseca.acmn.austral.stock_tracker_api.unit.domain

import aseca.acmn.austral.stock_tracker_api.domain.Password
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import kotlin.test.assertEquals
import kotlin.test.assertNotEquals

class PasswordTest {
    @Test
    fun passwordShorterThan8CharactersThrows() {
        assertThrows<IllegalArgumentException> { Password.validateStrength("Ab1!567") }
    }

    @Test
    fun passwordWithoutUppercaseThrows() {
        assertThrows<IllegalArgumentException> { Password.validateStrength("ab1!5678") }
    }

    @Test
    fun passwordWithoutLowercaseThrows() {
        assertThrows<IllegalArgumentException> { Password.validateStrength("AB1!5678") }
    }

    @Test
    fun passwordWithoutDigitThrows() {
        assertThrows<IllegalArgumentException> { Password.validateStrength("Abcd!efg") }
    }

    @Test
    fun passwordWithoutSpecialCharacterThrows() {
        assertThrows<IllegalArgumentException> { Password.validateStrength("Abcd1234") }
    }

    @Test
    fun validPasswordDoesNotThrow() {
        Password.validateStrength("ValidP@ss1")
    }

    @Test
    fun fromHashStoresTheHash() {
        val password = Password.fromHash("somehash")
        assertEquals("somehash", password.hash)
    }

    @Test
    fun twoPasswordsWithSameHashAreEqual() {
        assertEquals(Password.fromHash("h"), Password.fromHash("h"))
    }

    @Test
    fun twoPasswordsWithDifferentHashesAreNotEqual() {
        assertNotEquals(Password.fromHash("h1"), Password.fromHash("h2"))
    }
}
