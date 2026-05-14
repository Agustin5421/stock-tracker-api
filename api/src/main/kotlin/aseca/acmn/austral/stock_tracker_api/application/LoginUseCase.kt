package aseca.acmn.austral.stock_tracker_api.application

/** Port in — driving side contract for authentication. */
interface LoginUseCase {
    /**
     * Validates credentials and returns a signed JWT.
     * Throws [IllegalArgumentException] when credentials are invalid.
     */
    fun login(email: String, plainPassword: String): String
}
