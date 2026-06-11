package aseca.acmn.austral.stock_tracker_api.api.watchlist

import jakarta.validation.constraints.NotBlank

data class AddWatchlistRequest(
    @field:NotBlank val ticker: String,
    @field:NotBlank val name: String,
    @field:NotBlank val cik: String,
)
