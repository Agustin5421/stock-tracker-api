package aseca.acmn.austral.stock_tracker_api.infrastructure.persistence

import aseca.acmn.austral.stock_tracker_api.domain.Email
import aseca.acmn.austral.stock_tracker_api.domain.Password
import aseca.acmn.austral.stock_tracker_api.domain.User
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.util.UUID

@Entity
@Table(name = "users")
class UserEntity(

    @Id
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(name = "id", length = 36, nullable = false, updatable = false)
    val id: UUID,

    @Column(name = "email", nullable = false, unique = true, length = 255)
    val email: String,

    @Column(name = "password_hash", nullable = false, length = 255)
    val passwordHash: String,
) {
    fun toDomain(): User = User(
        id = id,
        email = Email(email),
        password = Password.fromHash(passwordHash),
    )

    companion object {
        fun fromDomain(user: User): UserEntity = UserEntity(
            id = user.id,
            email = user.email.value,
            passwordHash = user.password.hash,
        )
    }
}
