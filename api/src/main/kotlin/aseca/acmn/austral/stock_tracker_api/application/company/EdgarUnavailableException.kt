package aseca.acmn.austral.stock_tracker_api.application.company

class EdgarUnavailableException(
    message: String,
    cause: Throwable? = null,
) : RuntimeException(message, cause)
