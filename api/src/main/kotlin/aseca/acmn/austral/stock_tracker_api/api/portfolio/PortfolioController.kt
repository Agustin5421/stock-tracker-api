package aseca.acmn.austral.stock_tracker_api.api.portfolio

import aseca.acmn.austral.stock_tracker_api.application.auth.AuthenticatedUser
import aseca.acmn.austral.stock_tracker_api.application.portfolio.BuyStockUseCase
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/portfolio")
class PortfolioController(
    private val buyStockUseCase: BuyStockUseCase,
) {
    @PostMapping("/purchases")
    fun buy(
        @AuthenticationPrincipal principal: AuthenticatedUser,
        @RequestBody @Valid request: BuyRequest,
    ): ResponseEntity<PurchaseResponse> {
        val result = buyStockUseCase.buy(principal.id, request.ticker, request.quantity)
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(PurchaseResponse(result.position.ticker, result.position.quantity, result.priceUsed))
    }
}
