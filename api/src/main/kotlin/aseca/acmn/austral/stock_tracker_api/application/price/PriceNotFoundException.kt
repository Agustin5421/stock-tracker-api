package aseca.acmn.austral.stock_tracker_api.application.price

class PriceNotFoundException(
    val ticker: String,
) : RuntimeException("No price found for ticker: $ticker")
