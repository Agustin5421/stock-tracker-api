package aseca.acmn.austral.stock_tracker_api.application.company

import aseca.acmn.austral.stock_tracker_api.domain.company.Filing

class GetRecentFilingsService(
    private val edgar: EdgarPort,
) : GetRecentFilingsUseCase {
    private val allowedForms = setOf("10-K", "10-Q")

    override fun getRecentFilings(cik: String): List<Filing> =
        edgar
            .getRecentFilings(cik)
            .filter { it.type in allowedForms }
            .take(10)
}
