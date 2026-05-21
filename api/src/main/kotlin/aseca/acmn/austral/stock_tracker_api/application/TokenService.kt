package aseca.acmn.austral.stock_tracker_api.application

import java.util.UUID

/** Port out — token generation and verification contract. */
interface TokenService {
    fun generate(
        userId: UUID,
        email: String,
    ): String

    fun verify(token: String): TokenClaims
}

data class TokenClaims(
    val userId: UUID,
    val email: String,
)

class InvalidTokenException(
    message: String,
    cause: Throwable? = null,
) : RuntimeException(message, cause)
