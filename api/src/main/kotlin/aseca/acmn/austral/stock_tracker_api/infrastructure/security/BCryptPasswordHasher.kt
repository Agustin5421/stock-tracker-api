package aseca.acmn.austral.stock_tracker_api.infrastructure.security

import aseca.acmn.austral.stock_tracker_api.application.auth.PasswordHasher
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Component

@Component
class BCryptPasswordHasher : PasswordHasher {
    private val encoder = BCryptPasswordEncoder()

    override fun hash(plain: String): String = encoder.encode(plain) ?: error("BCrypt returned null")

    override fun matches(
        plain: String,
        hash: String,
    ): Boolean = encoder.matches(plain, hash)
}
