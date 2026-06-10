package aseca.acmn.austral.stock_tracker_api.unit.application.company

import aseca.acmn.austral.stock_tracker_api.application.company.CompanyNotFoundException
import aseca.acmn.austral.stock_tracker_api.application.company.GetHistoricalMetricsService
import aseca.acmn.austral.stock_tracker_api.domain.company.MetricDataPoint
import aseca.acmn.austral.stock_tracker_api.domain.company.MetricType
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.math.BigDecimal
import kotlin.test.assertEquals

class GetHistoricalMetricsServiceTest {
    private val sampleHistory =
        listOf(
            MetricDataPoint("2023-09-30", BigDecimal("89498000000")),
            MetricDataPoint("2023-12-31", BigDecimal("119575000000")),
            MetricDataPoint("2024-03-31", BigDecimal("90753000000")),
            MetricDataPoint("2024-06-29", BigDecimal("85777000000")),
        )

    private fun service(fake: FakeEdgarPort = FakeEdgarPort()) = GetHistoricalMetricsService(fake)

    @Test
    fun returnsDataPointsWhenEdgarReturnsHistory() {
        val fake = FakeEdgarPort().apply { historicalResult = sampleHistory }
        val result = service(fake).getHistory("320193", MetricType.REVENUE)
        assertEquals(sampleHistory, result)
    }

    @Test
    fun returnsEmptyListWhenEdgarReturnsNoData() {
        val result = service().getHistory("320193", MetricType.REVENUE)
        assertEquals(emptyList(), result)
    }

    @Test
    fun throwsCompanyNotFoundExceptionWhenEdgarThrowsIt() {
        val fake = FakeEdgarPort().apply { historicalThrowsNotFound = true }
        assertThrows<CompanyNotFoundException> { service(fake).getHistory("999999", MetricType.REVENUE) }
    }
}
