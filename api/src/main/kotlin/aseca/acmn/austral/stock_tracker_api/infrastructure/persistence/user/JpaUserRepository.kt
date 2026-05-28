package aseca.acmn.austral.stock_tracker_api.infrastructure.persistence.user

import aseca.acmn.austral.stock_tracker_api.application.user.UserRepository
import aseca.acmn.austral.stock_tracker_api.domain.user.Email
import aseca.acmn.austral.stock_tracker_api.domain.user.User
import org.springframework.stereotype.Repository

@Repository
class JpaUserRepository(
    private val springData: SpringDataUserRepository,
) : UserRepository {
    override fun save(user: User): User = springData.save(UserEntity.fromDomain(user)).toDomain()

    override fun findByEmail(email: Email): User? = springData.findByEmail(email.value)?.toDomain()

    override fun existsByEmail(email: Email): Boolean = springData.existsByEmail(email.value)
}
