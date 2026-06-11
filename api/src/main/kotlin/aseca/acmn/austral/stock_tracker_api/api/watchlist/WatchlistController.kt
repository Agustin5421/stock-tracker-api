package aseca.acmn.austral.stock_tracker_api.api.watchlist

import aseca.acmn.austral.stock_tracker_api.application.auth.AuthenticatedUser
import aseca.acmn.austral.stock_tracker_api.application.watchlist.AddCompanyToWatchlistUseCase
import aseca.acmn.austral.stock_tracker_api.application.watchlist.GetWatchlistUseCase
import aseca.acmn.austral.stock_tracker_api.application.watchlist.RemoveCompanyFromWatchlistUseCase
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/watchlist")
class WatchlistController(
    private val addCompanyToWatchlistUseCase: AddCompanyToWatchlistUseCase,
    private val removeCompanyFromWatchlistUseCase: RemoveCompanyFromWatchlistUseCase,
    private val getWatchlistUseCase: GetWatchlistUseCase,
) {
    @PostMapping
    fun add(
        @AuthenticationPrincipal principal: AuthenticatedUser,
        @RequestBody @Valid request: AddWatchlistRequest,
    ): ResponseEntity<WatchlistItemResponse> {
        val item =
            addCompanyToWatchlistUseCase.add(
                userId = principal.id,
                ticker = request.ticker,
                name = request.name,
                cik = request.cik,
            )
        return ResponseEntity.status(HttpStatus.CREATED).body(
            WatchlistItemResponse(item.ticker, item.name, item.cik),
        )
    }

    @GetMapping
    fun getWatchlist(
        @AuthenticationPrincipal principal: AuthenticatedUser,
    ): ResponseEntity<List<WatchlistItemResponse>> {
        val list =
            getWatchlistUseCase.getWatchlist(principal.id).map {
                WatchlistItemResponse(it.ticker, it.name, it.cik)
            }
        return ResponseEntity.ok(list)
    }

    @DeleteMapping("/{ticker}")
    fun delete(
        @AuthenticationPrincipal principal: AuthenticatedUser,
        @PathVariable ticker: String,
    ): ResponseEntity<Unit> {
        removeCompanyFromWatchlistUseCase.remove(principal.id, ticker)
        return ResponseEntity.ok().build()
    }
}
