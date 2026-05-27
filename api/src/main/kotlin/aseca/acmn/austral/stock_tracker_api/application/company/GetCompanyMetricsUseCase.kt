package aseca.acmn.austral.stock_tracker_api.application.company

import aseca.acmn.austral.stock_tracker_api.domain.company.CompanyMetrics

interface GetCompanyMetricsUseCase {
    fun getMetrics(cik: String): CompanyMetrics
}
