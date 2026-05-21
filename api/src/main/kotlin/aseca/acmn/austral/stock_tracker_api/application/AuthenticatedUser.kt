package aseca.acmn.austral.stock_tracker_api.application

import java.util.UUID

data class AuthenticatedUser(
    val id: UUID,
    val email: String,
)
