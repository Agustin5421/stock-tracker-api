package aseca.acmn.austral.stock_tracker_api.infrastructure.persistence

import aseca.acmn.austral.stock_tracker_api.application.UserRepository
import aseca.acmn.austral.stock_tracker_api.domain.Email
import aseca.acmn.austral.stock_tracker_api.domain.User
import org.springframework.stereotype.Repository

@Repository
class JpaUserRepository(
    private val springData: SpringDataUserRepository,
) : UserRepository {
    override fun save(user: User): User = springData.save(UserEntity.fromDomain(user)).toDomain()

    override fun findByEmail(email: Email): User? = springData.findByEmail(email.value)?.toDomain()

    override fun existsByEmail(email: Email): Boolean = springData.existsByEmail(email.value)
}
