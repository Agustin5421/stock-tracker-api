package aseca.acmn.austral.stock_tracker_api.unit.infrastructure.security

import aseca.acmn.austral.stock_tracker_api.application.AuthenticatedUser
import aseca.acmn.austral.stock_tracker_api.application.TokenClaims
import aseca.acmn.austral.stock_tracker_api.infrastructure.security.JwtAuthenticationFilter
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Test
import org.springframework.mock.web.MockFilterChain
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse
import org.springframework.security.core.context.SecurityContextHolder
import java.util.UUID
import kotlin.test.assertEquals
import kotlin.test.assertNull

class JwtAuthenticationFilterTest {

    private val userId = UUID.randomUUID()
    private val email = "user@example.com"
    private val validToken = "valid-token"
    private val claims = TokenClaims(userId, email)

    private fun newFilter(): JwtAuthenticationFilter =
        JwtAuthenticationFilter(FakeTokenService(validToken, claims))

    @AfterEach
    fun clearContext() {
        SecurityContextHolder.clearContext()
    }

    @Test
    fun filterPopulatesContextWhenTokenIsValid() {
        val request = MockHttpServletRequest().apply {
            addHeader("Authorization", "Bearer $validToken")
        }
        newFilter().doFilter(request, MockHttpServletResponse(), MockFilterChain())
        val principal = SecurityContextHolder.getContext().authentication?.principal as? AuthenticatedUser
        assertEquals(AuthenticatedUser(userId, email), principal)
    }

    @Test
    fun filterDoesNotPopulateContextWhenHeaderMissing() {
        newFilter().doFilter(MockHttpServletRequest(), MockHttpServletResponse(), MockFilterChain())
        assertNull(SecurityContextHolder.getContext().authentication)
    }

    @Test
    fun filterDoesNotPopulateContextWhenVerifyThrows() {
        val request = MockHttpServletRequest().apply {
            addHeader("Authorization", "Bearer not-the-valid-token")
        }
        newFilter().doFilter(request, MockHttpServletResponse(), MockFilterChain())
        assertNull(SecurityContextHolder.getContext().authentication)
    }
}
