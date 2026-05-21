package aseca.acmn.austral.stock_tracker_api.unit.application

import aseca.acmn.austral.stock_tracker_api.application.UserRepository
import aseca.acmn.austral.stock_tracker_api.domain.Email
import aseca.acmn.austral.stock_tracker_api.domain.User

class InMemoryUserRepository : UserRepository {
    private val store = mutableMapOf<String, User>()

    override fun save(user: User): User {
        store[user.email.value] = user
        return user
    }

    override fun findByEmail(email: Email): User? = store[email.value]

    override fun existsByEmail(email: Email): Boolean = store.containsKey(email.value)
}
