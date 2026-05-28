package aseca.acmn.austral.stock_tracker_api.application.user

import aseca.acmn.austral.stock_tracker_api.domain.user.Email
import aseca.acmn.austral.stock_tracker_api.domain.user.User

/** Port out — persistence contract for User aggregates. */
interface UserRepository {
    fun save(user: User): User

    fun findByEmail(email: Email): User?

    fun existsByEmail(email: Email): Boolean
}
