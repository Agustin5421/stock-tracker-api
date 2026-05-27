package aseca.acmn.austral.stock_tracker_api.integration.api.company

import aseca.acmn.austral.stock_tracker_api.domain.company.CompanyMetrics
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
class CompanyMetricsIntegrationTest {
    @Autowired private lateinit var mockMvc: MockMvc

    @Autowired private lateinit var fakeEdgar: FakeEdgarPort

    private val sampleMetrics =
        CompanyMetrics(
            revenue = 383285000000L,
            netIncome = 96995000000L,
            eps = BigDecimal("6.13"),
            totalAssets = 352583000000L,
            totalLiabilities = 290437000000L,
        )

    @BeforeEach
    fun reset() {
        fakeEdgar.metricsResult = null
        fakeEdgar.metricsThrowsNotFound = false
    }

    @Test
    fun getMetricsReturns200() {
        fakeEdgar.metricsResult = sampleMetrics

        mockMvc
            .perform(get("/api/companies/320193/metrics"))
            .andExpect(status().isOk)
    }

    @Test
    fun responseContainsRevenue() {
        fakeEdgar.metricsResult = sampleMetrics

        mockMvc
            .perform(get("/api/companies/320193/metrics"))
            .andExpect(jsonPath("$.revenue").value(383285000000L))
    }

    @Test
    fun responseContainsNetIncome() {
        fakeEdgar.metricsResult = sampleMetrics

        mockMvc
            .perform(get("/api/companies/320193/metrics"))
            .andExpect(jsonPath("$.netIncome").value(96995000000L))
    }

    @Test
    fun responseContainsEps() {
        fakeEdgar.metricsResult = sampleMetrics

        mockMvc
            .perform(get("/api/companies/320193/metrics"))
            .andExpect(jsonPath("$.eps").value(6.13))
    }

    @Test
    fun responseContainsTotalAssets() {
        fakeEdgar.metricsResult = sampleMetrics

        mockMvc
            .perform(get("/api/companies/320193/metrics"))
            .andExpect(jsonPath("$.totalAssets").value(352583000000L))
    }

    @Test
    fun responseContainsTotalLiabilities() {
        fakeEdgar.metricsResult = sampleMetrics

        mockMvc
            .perform(get("/api/companies/320193/metrics"))
            .andExpect(jsonPath("$.totalLiabilities").value(290437000000L))
    }

    @Test
    fun returns404WhenCompanyNotFound() {
        fakeEdgar.metricsThrowsNotFound = true

        mockMvc
            .perform(get("/api/companies/999999/metrics"))
            .andExpect(status().isNotFound)
    }

    @Test
    fun returns500WhenEdgarFails() {
        mockMvc
            .perform(get("/api/companies/320193/metrics"))
            .andExpect(status().isInternalServerError)
    }

    @Test
    fun nullMetricsFieldsAreSerializedAsJsonNull() {
        fakeEdgar.metricsResult =
            CompanyMetrics(
                revenue = null,
                netIncome = null,
                eps = null,
                totalAssets = null,
                totalLiabilities = null,
            )

        mockMvc
            .perform(get("/api/companies/320193/metrics"))
            .andExpect(jsonPath("$.revenue").doesNotExist())
    }
}
