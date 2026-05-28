package aseca.acmn.austral.stock_tracker_api.infrastructure.security

import aseca.acmn.austral.stock_tracker_api.application.auth.LoginService
import aseca.acmn.austral.stock_tracker_api.application.auth.LoginUseCase
import aseca.acmn.austral.stock_tracker_api.application.auth.PasswordHasher
import aseca.acmn.austral.stock_tracker_api.application.auth.RegisterUserService
import aseca.acmn.austral.stock_tracker_api.application.auth.RegisterUserUseCase
import aseca.acmn.austral.stock_tracker_api.application.auth.TokenService
import aseca.acmn.austral.stock_tracker_api.application.user.UserRepository
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class AuthConfig {
    @Bean
    fun registerUserUseCase(
        userRepository: UserRepository,
        passwordHasher: PasswordHasher,
    ): RegisterUserUseCase = RegisterUserService(userRepository, passwordHasher)

    @Bean
    fun loginUseCase(
        userRepository: UserRepository,
        tokenService: TokenService,
        passwordHasher: PasswordHasher,
    ): LoginUseCase = LoginService(userRepository, tokenService, passwordHasher)
}
