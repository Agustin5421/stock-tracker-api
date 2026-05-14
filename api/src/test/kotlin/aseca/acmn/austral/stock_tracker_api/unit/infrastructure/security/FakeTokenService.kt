package aseca.acmn.austral.stock_tracker_api.unit.infrastructure.security

import aseca.acmn.austral.stock_tracker_api.application.InvalidTokenException
import aseca.acmn.austral.stock_tracker_api.application.TokenClaims
import aseca.acmn.austral.stock_tracker_api.application.TokenService
import java.util.UUID

/** Verifies a single hard-coded valid token; everything else is rejected. */
class FakeTokenService(
    private val validToken: String,
    private val claims: TokenClaims,
) : TokenService {
    override fun generate(userId: UUID, email: String): String = validToken

    override fun verify(token: String): TokenClaims {
        if (token != validToken) throw InvalidTokenException("Invalid token")
        return claims
    }
}
