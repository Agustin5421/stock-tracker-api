package aseca.acmn.austral.stock_tracker_api.integration.api.company

import aseca.acmn.austral.stock_tracker_api.domain.company.MetricDataPoint
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.context.annotation.Import
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.math.BigDecimal

@SpringBootTest
@AutoConfigureMockMvc
@Import(FakeEdgarPortConfig::class)
class CompanyHistoricalMetricsIntegrationTest {
    @Autowired private lateinit var mockMvc: MockMvc

    @Autowired private lateinit var fakeEdgar: FakeEdgarPort

    private val sampleHistory =
        listOf(
            MetricDataPoint("2023-09-30", BigDecimal("89498000000")),
            MetricDataPoint("2024-06-29", BigDecimal("85777000000")),
        )

    @BeforeEach
    fun reset() {
        fakeEdgar.historicalResult = emptyList()
        fakeEdgar.historicalThrowsNotFound = false
        fakeEdgar.historicalThrowsUnavailable = false
    }

    @Test
    fun getHistoricalMetricsReturns200() {
        fakeEdgar.historicalResult = sampleHistory

        mockMvc
            .perform(get("/api/companies/320193/metrics/historical").param("metric", "revenue"))
            .andExpect(status().isOk)
    }

    @Test
    fun responseContainsPeriodField() {
        fakeEdgar.historicalResult = sampleHistory

        mockMvc
            .perform(get("/api/companies/320193/metrics/historical").param("metric", "revenue"))
            .andExpect(jsonPath("$[0].period").value("2023-09-30"))
    }

    @Test
    fun responseContainsValueField() {
        fakeEdgar.historicalResult = sampleHistory

        mockMvc
            .perform(get("/api/companies/320193/metrics/historical").param("metric", "revenue"))
            .andExpect(jsonPath("$[0].value").value(89498000000L))
    }

    @Test
    fun returns400ForUnknownMetric() {
        mockMvc
            .perform(get("/api/companies/320193/metrics/historical").param("metric", "unknownMetric"))
            .andExpect(status().isBadRequest)
    }

    @Test
    fun returns404WhenCompanyNotFound() {
        fakeEdgar.historicalThrowsNotFound = true

        mockMvc
            .perform(get("/api/companies/999999/metrics/historical").param("metric", "revenue"))
            .andExpect(status().isNotFound)
    }

    @Test
    fun returns503WhenEdgarUnavailable() {
        fakeEdgar.historicalThrowsUnavailable = true

        mockMvc
            .perform(get("/api/companies/320193/metrics/historical").param("metric", "revenue"))
            .andExpect(status().isServiceUnavailable)
    }

    @Test
    fun emptyArrayWhenNoHistoricalData() {
        mockMvc
            .perform(get("/api/companies/320193/metrics/historical").param("metric", "revenue"))
            .andExpect(jsonPath("$").isArray)
            .andExpect(jsonPath("$").isEmpty)
    }
}
