package aseca.acmn.austral.stock_tracker_api.unit.domain

import aseca.acmn.austral.stock_tracker_api.domain.Password

import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import kotlin.test.assertEquals
import kotlin.test.assertNotEquals

class PasswordTest {

    @Test
    fun passwordShorterThan8CharactersThrows() {
        assertThrows<IllegalArgumentException> { Password.validate("Ab1!567") }
    }

    @Test
    fun passwordWithoutUppercaseThrows() {
        assertThrows<IllegalArgumentException> { Password.validate("ab1!5678") }
    }

    @Test
    fun passwordWithoutLowercaseThrows() {
        assertThrows<IllegalArgumentException> { Password.validate("AB1!5678") }
    }

    @Test
    fun passwordWithoutDigitThrows() {
        assertThrows<IllegalArgumentException> { Password.validate("Abcd!efg") }
    }

    @Test
    fun passwordWithoutSpecialCharacterThrows() {
        assertThrows<IllegalArgumentException> { Password.validate("Abcd1234") }
    }

    @Test
    fun validPasswordDoesNotThrow() {
        Password.validate("ValidP@ss1")
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
