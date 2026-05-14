package aseca.acmn.austral.stock_tracker_api.application

/** Port out — password hashing and verification contract. */
interface PasswordHasher {
    fun hash(plain: String): String
    fun matches(plain: String, hash: String): Boolean
}
