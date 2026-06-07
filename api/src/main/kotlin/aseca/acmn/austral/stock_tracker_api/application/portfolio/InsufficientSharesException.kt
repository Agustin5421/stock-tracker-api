package aseca.acmn.austral.stock_tracker_api.application.portfolio

class InsufficientSharesException(
    ticker: String,
) : RuntimeException("Insufficient shares for ticker: $ticker")
