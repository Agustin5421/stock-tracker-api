package aseca.acmn.austral.stock_tracker_api.infrastructure.security

import aseca.acmn.austral.stock_tracker_api.application.auth.InvalidTokenException
import aseca.acmn.austral.stock_tracker_api.application.auth.TokenClaims
import aseca.acmn.austral.stock_tracker_api.application.auth.TokenService
import io.jsonwebtoken.JwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.util.Date
import java.util.UUID

@Service
class JwtTokenService(
    @Value("\${jwt.secret}") private val secret: String,
    @Value("\${jwt.expiration-ms:86400000}") private val expirationMs: Long,
) : TokenService {
    private val signingKey by lazy {
        Keys.hmacShaKeyFor(secret.toByteArray(Charsets.UTF_8))
    }

    override fun generate(
        userId: UUID,
        email: String,
    ): String {
        val now = Date()
        return Jwts
            .builder()
            .subject(userId.toString())
            .claim("email", email)
            .issuedAt(now)
            .expiration(Date(now.time + expirationMs))
            .signWith(signingKey)
            .compact()
    }

    override fun verify(token: String): TokenClaims {
        try {
            val claims =
                Jwts
                    .parser()
                    .verifyWith(signingKey)
                    .build()
                    .parseSignedClaims(token)
                    .payload
            val userId = UUID.fromString(claims.subject)
            val email =
                claims["email"] as? String
                    ?: throw InvalidTokenException("Token missing email claim")
            return TokenClaims(userId, email)
        } catch (e: JwtException) {
            throw InvalidTokenException("Invalid token", e)
        } catch (e: IllegalArgumentException) {
            throw InvalidTokenException("Invalid token", e)
        }
    }
}
