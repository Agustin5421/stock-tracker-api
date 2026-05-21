package aseca.acmn.austral.stock_tracker_api.domain

import java.util.UUID

data class User(
    val id: UUID,
    val email: Email,
    val password: Password,
)
