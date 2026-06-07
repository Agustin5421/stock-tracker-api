package aseca.acmn.austral.stock_tracker_api.application.portfolio

class NoPriceAvailableException(
    ticker: String,
) : RuntimeException("No price available for ticker: $ticker")
