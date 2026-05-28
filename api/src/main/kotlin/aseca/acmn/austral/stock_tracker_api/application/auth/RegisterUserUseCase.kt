package aseca.acmn.austral.stock_tracker_api.application.auth

import java.util.UUID

/** Port in — driving side contract for user registration. */
interface RegisterUserUseCase {
    /** Returns the newly created user's ID. Throws [IllegalArgumentException] if email is taken. */
    fun register(
        email: String,
        plainPassword: String,
    ): UUID
}
