package aseca.acmn.austral.stock_tracker_api.infrastructure.security

import aseca.acmn.austral.stock_tracker_api.application.LoginService
import aseca.acmn.austral.stock_tracker_api.application.LoginUseCase
import aseca.acmn.austral.stock_tracker_api.application.PasswordHasher
import aseca.acmn.austral.stock_tracker_api.application.RegisterUserService
import aseca.acmn.austral.stock_tracker_api.application.RegisterUserUseCase
import aseca.acmn.austral.stock_tracker_api.application.TokenService
import aseca.acmn.austral.stock_tracker_api.application.UserRepository
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class AuthConfig {

    @Bean
    fun registerUserUseCase(userRepository: UserRepository, passwordHasher: PasswordHasher): RegisterUserUseCase =
        RegisterUserService(userRepository, passwordHasher)

    @Bean
    fun loginUseCase(
        userRepository: UserRepository,
        tokenService: TokenService,
        passwordHasher: PasswordHasher,
    ): LoginUseCase = LoginService(userRepository, tokenService, passwordHasher)
}
