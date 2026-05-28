package aseca.acmn.austral.stock_tracker_api.integration.api.company

import aseca.acmn.austral.stock_tracker_api.domain.company.Filing
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

@SpringBootTest
@AutoConfigureMockMvc
@Import(FakeEdgarPortConfig::class)
class CompanyFilingsIntegrationTest {
    @Autowired private lateinit var mockMvc: MockMvc

    @Autowired private lateinit var fakeEdgar: FakeEdgarPort

    private val sampleFiling =
        Filing(
            type = "10-K",
            filingDate = "2024-11-01",
            accessionNumber = "0000320193-24-000123",
        )

    @BeforeEach
    fun setup() {
        fakeEdgar.filingsResult = emptyList()
        fakeEdgar.filingsThrowsNotFound = false
        fakeEdgar.filingsThrowsUnavailable = false
    }

    @Test
    fun returns200WithArrayForValidCik() {
        fakeEdgar.filingsResult = listOf(sampleFiling)

        mockMvc
            .perform(get("/api/companies/320193/filings"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$").isArray)
    }

    @Test
    fun responseElementContainsType() {
        fakeEdgar.filingsResult = listOf(sampleFiling)

        mockMvc
            .perform(get("/api/companies/320193/filings"))
            .andExpect(jsonPath("$[0].type").value("10-K"))
    }

    @Test
    fun responseElementContainsFilingDate() {
        fakeEdgar.filingsResult = listOf(sampleFiling)

        mockMvc
            .perform(get("/api/companies/320193/filings"))
            .andExpect(jsonPath("$[0].filingDate").value("2024-11-01"))
    }

    @Test
    fun responseElementContainsAccessionNumber() {
        fakeEdgar.filingsResult = listOf(sampleFiling)

        mockMvc
            .perform(get("/api/companies/320193/filings"))
            .andExpect(jsonPath("$[0].accessionNumber").value("0000320193-24-000123"))
    }

    @Test
    fun returns404ForUnknownCik() {
        fakeEdgar.filingsThrowsNotFound = true

        mockMvc
            .perform(get("/api/companies/000000/filings"))
            .andExpect(status().isNotFound)
    }

    @Test
    fun returns503WhenEdgarIsUnavailable() {
        fakeEdgar.filingsThrowsUnavailable = true

        mockMvc
            .perform(get("/api/companies/320193/filings"))
            .andExpect(status().isServiceUnavailable)
    }
}
