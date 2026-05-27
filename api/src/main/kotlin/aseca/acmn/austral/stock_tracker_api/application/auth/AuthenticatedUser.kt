package aseca.acmn.austral.stock_tracker_api.application.auth

import java.util.UUID

data class AuthenticatedUser(
    val id: UUID,
    val email: String,
)
