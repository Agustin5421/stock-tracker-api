package aseca.acmn.austral.stock_tracker_api.domain

class Password private constructor(val hash: String) {

    companion object {
        fun validateStrength(plain: String) {
            require(plain.length >= 8) { "Password must be at least 8 characters" }
            require(plain.any { it.isUpperCase() }) { "Password must contain an uppercase letter" }
            require(plain.any { it.isLowerCase() }) { "Password must contain a lowercase letter" }
            require(plain.any { it.isDigit() }) { "Password must contain a digit" }
            require(plain.any { !it.isLetterOrDigit() }) { "Password must contain a special character" }
        }

        fun fromHash(hash: String): Password = Password(hash)
    }

    override fun equals(other: Any?): Boolean = other is Password && hash == other.hash
    override fun hashCode(): Int = hash.hashCode()
}
