package aseca.acmn.austral.stock_tracker_api.application

import aseca.acmn.austral.stock_tracker_api.domain.Email
import aseca.acmn.austral.stock_tracker_api.domain.User

/** Port out — persistence contract for User aggregates. */
interface UserRepository {
    fun save(user: User): User
    fun findByEmail(email: Email): User?
    fun existsByEmail(email: Email): Boolean
}
