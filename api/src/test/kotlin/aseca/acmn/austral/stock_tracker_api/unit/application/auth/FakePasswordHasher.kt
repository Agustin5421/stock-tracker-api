package aseca.acmn.austral.stock_tracker_api.unit.application.auth

import aseca.acmn.austral.stock_tracker_api.application.auth.PasswordHasher

class FakePasswordHasher : PasswordHasher {
    override fun hash(plain: String): String = "hashed:$plain"

    override fun matches(
        plain: String,
        hash: String,
    ): Boolean = hash == "hashed:$plain"
}
