package aseca.acmn.austral.stock_tracker_api.application.company

import aseca.acmn.austral.stock_tracker_api.domain.company.Filing

interface GetRecentFilingsUseCase {
    fun getRecentFilings(cik: String): List<Filing>
}
