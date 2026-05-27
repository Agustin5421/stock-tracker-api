package aseca.acmn.austral.stock_tracker_api.application.auth

import aseca.acmn.austral.stock_tracker_api.application.user.UserRepository
import aseca.acmn.austral.stock_tracker_api.domain.user.Email

class LoginService(
    private val userRepository: UserRepository,
    private val tokenService: TokenService,
    private val passwordHasher: PasswordHasher,
) : LoginUseCase {
    override fun login(
        email: String,
        plainPassword: String,
    ): String {
        val domainEmail = Email(email)
        val user =
            userRepository.findByEmail(domainEmail)
                ?: throw IllegalArgumentException("Invalid credentials")
        require(passwordHasher.matches(plainPassword, user.password.hash)) { "Invalid credentials" }
        return tokenService.generate(user.id, user.email.value)
    }
}
