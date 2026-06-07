package aseca.acmn.austral.stock_tracker_api.api.test

import aseca.acmn.austral.stock_tracker_api.infrastructure.persistence.price.SpringDataStockPriceRepository
import aseca.acmn.austral.stock_tracker_api.infrastructure.persistence.price.StockPriceEntity
import org.springframework.context.annotation.Profile
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.math.BigDecimal
import java.time.LocalDateTime

// Test-only price seeding for end-to-end tests. Registered only under the "e2e"
// Spring profile, so it never exists in a normal/prod run. Lets Cypress create a
// stored price (otherwise only the Yahoo batch writes prices) so the buy/sell
// flow is deterministic. Served under the already-public "/test" namespace.
@Profile("e2e")
@RestController
@RequestMapping("/test/prices")
class TestPriceSeedController(
    private val stockPrices: SpringDataStockPriceRepository,
) {
    @PostMapping
    fun seed(
        @RequestBody request: SeedPriceRequest,
    ): ResponseEntity<Unit> {
        stockPrices.save(
            StockPriceEntity(
                ticker = request.ticker.uppercase(),
                price = request.price,
                fetchedAt = LocalDateTime.now(),
            ),
        )
        return ResponseEntity.status(HttpStatus.CREATED).build()
    }
}

data class SeedPriceRequest(
    val ticker: String,
    val price: BigDecimal,
)
