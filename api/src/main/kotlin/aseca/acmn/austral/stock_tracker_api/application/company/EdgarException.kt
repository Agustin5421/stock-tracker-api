package aseca.acmn.austral.stock_tracker_api.application.company

class EdgarException(
    message: String,
    cause: Throwable? = null,
) : RuntimeException(message, cause)
