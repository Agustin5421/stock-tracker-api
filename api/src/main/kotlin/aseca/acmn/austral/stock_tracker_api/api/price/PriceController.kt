package aseca.acmn.austral.stock_tracker_api.api.price

import aseca.acmn.austral.stock_tracker_api.application.price.GetLatestPriceUseCase
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/prices")
class PriceController(
    private val getLatestPriceUseCase: GetLatestPriceUseCase,
) {
    @GetMapping("/{ticker}/latest")
    fun getLatest(
        @PathVariable ticker: String,
    ): ResponseEntity<LatestPriceResponse> {
        val price = getLatestPriceUseCase.getLatestPrice(ticker)
        return ResponseEntity.ok(
            LatestPriceResponse(
                ticker = price.ticker,
                price = price.price,
                fetchedAt = price.fetchedAt,
            ),
        )
    }
}
