package aseca.acmn.austral.stock_tracker_api.application.auth

import aseca.acmn.austral.stock_tracker_api.application.user.UserRepository
import aseca.acmn.austral.stock_tracker_api.domain.user.Email
import aseca.acmn.austral.stock_tracker_api.domain.user.Password
import aseca.acmn.austral.stock_tracker_api.domain.user.User
import java.util.UUID

class RegisterUserService(
    private val userRepository: UserRepository,
    private val passwordHasher: PasswordHasher,
) : RegisterUserUseCase {
    override fun register(
        email: String,
        plainPassword: String,
    ): UUID {
        Password.validateStrength(plainPassword)
        val domainEmail = Email(email)
        require(!userRepository.existsByEmail(domainEmail)) { "Email already registered: $email" }
        val user =
            User(
                id = UUID.randomUUID(),
                email = domainEmail,
                password = Password.fromHash(passwordHasher.hash(plainPassword)),
            )
        return userRepository.save(user).id
    }
}
