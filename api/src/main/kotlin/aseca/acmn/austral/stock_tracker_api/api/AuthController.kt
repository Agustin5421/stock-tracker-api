package aseca.acmn.austral.stock_tracker_api.api

import aseca.acmn.austral.stock_tracker_api.application.LoginUseCase
import aseca.acmn.austral.stock_tracker_api.application.RegisterUserUseCase
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/auth")
class AuthController(
    private val registerUserUseCase: RegisterUserUseCase,
    private val loginUseCase: LoginUseCase,
) {
    @PostMapping("/register")
    fun register(
        @RequestBody request: RegisterRequest,
    ): ResponseEntity<*> =
        try {
            val id = registerUserUseCase.register(request.email, request.password)
            ResponseEntity.status(HttpStatus.CREATED).body(RegisterResponse(id.toString()))
        } catch (e: IllegalArgumentException) {
            ResponseEntity.badRequest().body(ErrorResponse(e.message ?: "Invalid request"))
        }

    @PostMapping("/login")
    fun login(
        @RequestBody request: LoginRequest,
    ): ResponseEntity<*> =
        try {
            val token = loginUseCase.login(request.email, request.password)
            ResponseEntity.ok(AuthResponse(token))
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ErrorResponse(e.message ?: "Invalid credentials"))
        }
}
