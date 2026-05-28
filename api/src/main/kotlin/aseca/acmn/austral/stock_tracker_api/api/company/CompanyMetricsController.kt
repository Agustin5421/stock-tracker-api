package aseca.acmn.austral.stock_tracker_api.api.company

import aseca.acmn.austral.stock_tracker_api.application.company.GetCompanyMetricsUseCase
import aseca.acmn.austral.stock_tracker_api.application.company.GetHistoricalMetricsUseCase
import aseca.acmn.austral.stock_tracker_api.domain.company.MetricType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/companies")
class CompanyMetricsController(
    private val useCase: GetCompanyMetricsUseCase,
    private val historicalUseCase: GetHistoricalMetricsUseCase,
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

    @GetMapping("/{cik}/metrics/historical")
    fun getHistoricalMetrics(
        @PathVariable cik: String,
        @RequestParam metric: String,
    ): ResponseEntity<*> {
        val metricType =
            try {
                MetricType.valueOf(metric.replace(Regex("([A-Z])"), "_$1").uppercase())
            } catch (e: IllegalArgumentException) {
                return ResponseEntity.badRequest().body(mapOf("error" to "Unknown metric: $metric"))
            }
        val history = historicalUseCase.getHistory(cik, metricType)
        return ResponseEntity.ok(history.map { MetricDataPointResponse(it.period, it.value) })
    }
}
