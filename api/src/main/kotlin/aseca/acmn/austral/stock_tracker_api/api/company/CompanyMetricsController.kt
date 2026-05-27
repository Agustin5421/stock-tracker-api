package aseca.acmn.austral.stock_tracker_api.api.company

import aseca.acmn.austral.stock_tracker_api.application.company.GetCompanyMetricsUseCase
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/companies")
class CompanyMetricsController(
    private val useCase: GetCompanyMetricsUseCase,
) {
    @GetMapping("/{cik}/metrics")
    fun getMetrics(
        @PathVariable cik: String,
    ): ResponseEntity<CompanyMetricsResponse> {
        val metrics = useCase.getMetrics(cik)
        return ResponseEntity.ok(
            CompanyMetricsResponse(
                revenue = metrics.revenue,
                netIncome = metrics.netIncome,
                eps = metrics.eps,
                totalAssets = metrics.totalAssets,
                totalLiabilities = metrics.totalLiabilities,
            ),
        )
    }
}
