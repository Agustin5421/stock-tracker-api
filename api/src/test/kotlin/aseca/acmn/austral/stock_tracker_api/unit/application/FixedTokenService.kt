package aseca.acmn.austral.stock_tracker_api.unit.application

import aseca.acmn.austral.stock_tracker_api.application.TokenService

import java.util.UUID

/** Returns a deterministic token for unit tests — not a real JWT. */
class FixedTokenService : TokenService {
    override fun generate(userId: UUID, email: String): String = "token:$userId:$email"
}
