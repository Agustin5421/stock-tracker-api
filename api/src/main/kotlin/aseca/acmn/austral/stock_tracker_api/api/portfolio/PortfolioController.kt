package aseca.acmn.austral.stock_tracker_api.api.portfolio

import aseca.acmn.austral.stock_tracker_api.application.auth.AuthenticatedUser
import aseca.acmn.austral.stock_tracker_api.application.portfolio.BuyStockUseCase
import aseca.acmn.austral.stock_tracker_api.application.portfolio.GetOperationHistoryUseCase
import aseca.acmn.austral.stock_tracker_api.application.portfolio.GetPortfolioUseCase
import aseca.acmn.austral.stock_tracker_api.application.portfolio.SellStockUseCase
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/portfolio")
class PortfolioController(
    private val buyStockUseCase: BuyStockUseCase,
    private val getPortfolioUseCase: GetPortfolioUseCase,
    private val getOperationHistoryUseCase: GetOperationHistoryUseCase,
    private val sellStockUseCase: SellStockUseCase,
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

    @PostMapping("/sales")
    fun sell(
        @AuthenticationPrincipal principal: AuthenticatedUser,
        @RequestBody @Valid request: SaleRequest,
    ): ResponseEntity<SaleResponse> {
        val result = sellStockUseCase.sell(principal.id, request.ticker, request.quantity)
        return ResponseEntity.ok(
            SaleResponse(request.ticker, result.position?.quantity ?: 0, result.priceUsed),
        )
    }

    @GetMapping
    fun getPortfolio(
        @AuthenticationPrincipal principal: AuthenticatedUser,
    ): ResponseEntity<PortfolioResponse> {
        val view = getPortfolioUseCase.getPortfolio(principal.id)
        val positions =
            view.positions.map {
                PositionViewResponse(it.ticker, it.quantity, it.latestPrice, it.currentValue)
            }
        return ResponseEntity.ok(PortfolioResponse(positions, view.totalValue, view.pricesUpdatedAt))
    }

    @GetMapping("/operations")
    fun getOperationHistory(
        @AuthenticationPrincipal principal: AuthenticatedUser,
    ): ResponseEntity<List<OperationResponse>> {
        val operations =
            getOperationHistoryUseCase.getOperationHistory(principal.id).map {
                OperationResponse(it.type, it.ticker, it.quantity, it.price, it.executedAt)
            }
        return ResponseEntity.ok(operations)
    }
}
