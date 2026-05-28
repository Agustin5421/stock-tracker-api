package aseca.acmn.austral.stock_tracker_api.domain.user

private val EMAIL_REGEX = Regex("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")

class Email(
    raw: String,
) {
    val value: String

    init {
        val trimmed = raw.trim().lowercase()
        require(trimmed.isNotBlank()) { "Email must not be blank" }
        require(EMAIL_REGEX.matches(trimmed)) { "Invalid email format: $raw" }
        value = trimmed
    }

    override fun equals(other: Any?): Boolean = other is Email && value == other.value

    override fun hashCode(): Int = value.hashCode()

    override fun toString(): String = value
}
