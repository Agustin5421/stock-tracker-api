package aseca.acmn.austral.stock_tracker_api.api.price

import aseca.acmn.austral.stock_tracker_api.application.price.GetLatestPriceUseCase
import aseca.acmn.austral.stock_tracker_api.application.price.ListAvailablePricesUseCase
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/prices")
class PriceController(
    private val getLatestPriceUseCase: GetLatestPriceUseCase,
    private val listAvailablePricesUseCase: ListAvailablePricesUseCase,
) {
    @GetMapping
    fun listAvailable(): ResponseEntity<List<LatestPriceResponse>> =
        ResponseEntity.ok(
            listAvailablePricesUseCase.listAvailablePrices().map {
                LatestPriceResponse(ticker = it.ticker, price = it.price, fetchedAt = it.fetchedAt)
            },
        )

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
