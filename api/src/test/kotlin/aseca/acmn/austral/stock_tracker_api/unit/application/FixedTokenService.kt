package aseca.acmn.austral.stock_tracker_api.unit.application

import aseca.acmn.austral.stock_tracker_api.application.InvalidTokenException
import aseca.acmn.austral.stock_tracker_api.application.TokenClaims
import aseca.acmn.austral.stock_tracker_api.application.TokenService
import java.util.UUID

/** Returns a deterministic token for unit tests — not a real JWT. */
class FixedTokenService : TokenService {
    override fun generate(
        userId: UUID,
        email: String,
    ): String = "token:$userId:$email"

    override fun verify(token: String): TokenClaims {
        val parts = token.split(":")
        if (parts.size != 3 || parts[0] != "token") {
            throw InvalidTokenException("Invalid token")
        }
        return try {
            TokenClaims(UUID.fromString(parts[1]), parts[2])
        } catch (e: IllegalArgumentException) {
            throw InvalidTokenException("Invalid token", e)
        }
    }
}
