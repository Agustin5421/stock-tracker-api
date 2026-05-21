package aseca.acmn.austral.stock_tracker_api.api.company

import aseca.acmn.austral.stock_tracker_api.application.company.SearchCompaniesUseCase
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/companies")
class CompanySearchController(
    private val useCase: SearchCompaniesUseCase,
) {
    @GetMapping("/search")
    fun search(
        @RequestParam(defaultValue = "") q: String,
    ): ResponseEntity<List<CompanySearchResponse>> {
        val results = useCase.search(q)
        return ResponseEntity.ok(results.map { CompanySearchResponse(it.ticker, it.name, it.cik) })
    }
}
