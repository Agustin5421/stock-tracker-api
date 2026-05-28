package aseca.acmn.austral.stock_tracker_api.infrastructure.persistence.user

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface SpringDataUserRepository : JpaRepository<UserEntity, UUID> {
    fun findByEmail(email: String): UserEntity?

    fun existsByEmail(email: String): Boolean
}
