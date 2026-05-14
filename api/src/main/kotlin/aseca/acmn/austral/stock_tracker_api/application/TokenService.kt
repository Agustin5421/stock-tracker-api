package aseca.acmn.austral.stock_tracker_api.application

import java.util.UUID

/** Port out — token generation contract. */
interface TokenService {
    fun generate(userId: UUID, email: String): String
}
