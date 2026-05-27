package aseca.acmn.austral.stock_tracker_api.unit.application.company

import aseca.acmn.austral.stock_tracker_api.application.company.CompanyNotFoundException
import aseca.acmn.austral.stock_tracker_api.application.company.GetCompanyMetricsService
import aseca.acmn.austral.stock_tracker_api.domain.company.CompanyMetrics
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.math.BigDecimal
import kotlin.test.assertEquals

class GetCompanyMetricsServiceTest {
    private val sampleMetrics =
        CompanyMetrics(
            revenue = 383285000000L,
            netIncome = 96995000000L,
            eps = BigDecimal("6.13"),
            totalAssets = 352583000000L,
            totalLiabilities = 290437000000L,
        )

    private fun service(fake: FakeEdgarPort = FakeEdgarPort()) = GetCompanyMetricsService(fake)

    @Test
    fun returnsMetricsWhenEdgarReturnsMetrics() {
        val fake = FakeEdgarPort().apply { metricsResult = sampleMetrics }
        val result = service(fake).getMetrics("320193")
        assertEquals(sampleMetrics, result)
    }

    @Test
    fun throwsCompanyNotFoundExceptionWhenEdgarThrowsIt() {
        val fake = FakeEdgarPort().apply { metricsThrowsNotFound = true }
        assertThrows<CompanyNotFoundException> { service(fake).getMetrics("320193") }
    }
}
