package aseca.acmn.austral.stock_tracker_api.api.watchlist

data class WatchlistItemResponse(
    val ticker: String,
    val name: String,
    val cik: String,
)
