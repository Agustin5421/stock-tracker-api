package aseca.acmn.austral.stock_tracker_api.unit.company

import aseca.acmn.austral.stock_tracker_api.application.company.SearchCompaniesService
import aseca.acmn.austral.stock_tracker_api.domain.company.CompanySearchResult
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class SearchCompaniesServiceTest {
    private val apple = CompanySearchResult("AAPL", "Apple Inc.", "320193")

    private fun service(fake: FakeEdgarPort = FakeEdgarPort()) = SearchCompaniesService(fake)

    @Test
    fun blankQueryReturnsEmptyList() {
        val result = service().search("   ")
        assertTrue(result.isEmpty())
    }

    @Test
    fun tickerQueryDelegatesToSearchByTicker() {
        val fake = FakeEdgarPort().apply { tickerResults = mapOf("AAPL" to listOf(apple)) }
        val result = service(fake).search("AAPL")
        assertEquals(listOf(apple), result)
    }

    @Test
    fun tickerQueryIsNormalizedToUppercase() {
        val fake = FakeEdgarPort().apply { tickerResults = mapOf("AAPL" to listOf(apple)) }
        val result = service(fake).search("aapl")
        assertEquals(listOf(apple), result)
    }

    @Test
    fun nameQueryDelegatesToSearchByName() {
        val fake = FakeEdgarPort().apply { nameResults = mapOf("Apple Inc" to listOf(apple)) }
        val result = service(fake).search("Apple Inc")
        assertEquals(listOf(apple), result)
    }

    @Test
    fun longQueryWithSpaceIsRoutedToNameSearch() {
        val fake = FakeEdgarPort().apply { nameResults = mapOf("Apple Inc" to listOf(apple)) }
        val result = service(fake).search("Apple Inc")
        assertEquals(listOf(apple), result)
    }

    @Test
    fun edgarFailureReturnsEmptyList() {
        val fake = FakeEdgarPort().apply { shouldThrow = true }
        val result = service(fake).search("AAPL")
        assertTrue(result.isEmpty())
    }

    @Test
    fun sixLetterQueryIsRoutedToNameSearch() {
        val fake = FakeEdgarPort().apply { nameResults = mapOf("GOOGL1" to listOf(apple)) }
        val result = service(fake).search("GOOGL1")
        assertEquals(listOf(apple), result)
    }
}
