package aseca.acmn.austral.stock_tracker_api.api.auth

data class RegisterRequest(
    val email: String,
    val password: String,
)

data class LoginRequest(
    val email: String,
    val password: String,
)

data class RegisterResponse(
    val id: String,
)

data class AuthResponse(
    val token: String,
)

data class ErrorResponse(
    val error: String,
)
