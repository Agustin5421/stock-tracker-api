package aseca.acmn.austral.stock_tracker_api.api.portfolio

import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank

data class BuyRequest(
    @field:NotBlank val ticker: String,
    @field:Min(1) val quantity: Int,
)
