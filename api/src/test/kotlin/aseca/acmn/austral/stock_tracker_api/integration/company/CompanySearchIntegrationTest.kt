package aseca.acmn.austral.stock_tracker_api.integration.company

import aseca.acmn.austral.stock_tracker_api.domain.company.CompanySearchResult
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
class CompanySearchIntegrationTest {
    @Autowired private lateinit var mockMvc: MockMvc

    @Autowired private lateinit var fakeEdgar: FakeEdgarPort

    @BeforeEach
    fun reset() {
        fakeEdgar.tickerResults = emptyMap()
        fakeEdgar.nameResults = emptyMap()
        fakeEdgar.shouldThrow = false
    }

    @Test
    fun searchReturns200() {
        mockMvc
            .perform(get("/api/companies/search").param("q", "AAPL"))
            .andExpect(status().isOk)
    }

    @Test
    fun searchReturnsJsonArray() {
        mockMvc
            .perform(get("/api/companies/search").param("q", "AAPL"))
            .andExpect(jsonPath("$").isArray)
    }

    @Test
    fun searchByTickerReturnsResult() {
        fakeEdgar.tickerResults = mapOf("AAPL" to listOf(CompanySearchResult("AAPL", "Apple Inc.", "320193")))

        mockMvc
            .perform(get("/api/companies/search").param("q", "AAPL"))
            .andExpect(jsonPath("$[0].ticker").value("AAPL"))
    }

    @Test
    fun searchResultContainsName() {
        fakeEdgar.tickerResults = mapOf("AAPL" to listOf(CompanySearchResult("AAPL", "Apple Inc.", "320193")))

        mockMvc
            .perform(get("/api/companies/search").param("q", "AAPL"))
            .andExpect(jsonPath("$[0].name").value("Apple Inc."))
    }

    @Test
    fun searchResultContainsCik() {
        fakeEdgar.tickerResults = mapOf("AAPL" to listOf(CompanySearchResult("AAPL", "Apple Inc.", "320193")))

        mockMvc
            .perform(get("/api/companies/search").param("q", "AAPL"))
            .andExpect(jsonPath("$[0].cik").value("320193"))
    }

    @Test
    fun edgarFailureReturns200WithEmptyArray() {
        fakeEdgar.shouldThrow = true

        mockMvc
            .perform(get("/api/companies/search").param("q", "AAPL"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$").isArray)
    }

    @Test
    fun blankQueryReturns200WithArray() {
        mockMvc
            .perform(get("/api/companies/search").param("q", ""))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$").isArray)
    }

    @Test
    fun blankQueryReturnsAllConfiguredResults() {
        fakeEdgar.allResults = listOf(CompanySearchResult("AAPL", "Apple Inc.", "320193"))

        mockMvc
            .perform(get("/api/companies/search").param("q", ""))
            .andExpect(jsonPath("$[0].ticker").value("AAPL"))
    }
}
