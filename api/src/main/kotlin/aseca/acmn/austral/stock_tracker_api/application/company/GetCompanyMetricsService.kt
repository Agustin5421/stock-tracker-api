package aseca.acmn.austral.stock_tracker_api.application.company

import aseca.acmn.austral.stock_tracker_api.domain.company.CompanyMetrics

class GetCompanyMetricsService(
    private val edgar: EdgarPort,
) : GetCompanyMetricsUseCase {
    override fun getMetrics(cik: String): CompanyMetrics = edgar.getMetrics(cik)
}
