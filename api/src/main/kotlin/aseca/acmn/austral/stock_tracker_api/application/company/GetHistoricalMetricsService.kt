package aseca.acmn.austral.stock_tracker_api.application.company

import aseca.acmn.austral.stock_tracker_api.domain.company.MetricDataPoint
import aseca.acmn.austral.stock_tracker_api.domain.company.MetricType

class GetHistoricalMetricsService(
    private val edgar: EdgarPort,
) : GetHistoricalMetricsUseCase {
    override fun getHistory(
        cik: String,
        metric: MetricType,
    ): List<MetricDataPoint> = edgar.getHistoricalMetrics(cik, metric)
}
