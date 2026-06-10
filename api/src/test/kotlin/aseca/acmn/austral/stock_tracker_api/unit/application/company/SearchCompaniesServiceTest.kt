package aseca.acmn.austral.stock_tracker_api.unit.application.company

import aseca.acmn.austral.stock_tracker_api.application.company.SearchCompaniesService
import aseca.acmn.austral.stock_tracker_api.domain.company.CompanySearchResult
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class SearchCompaniesServiceTest {
    private val apple = CompanySearchResult("AAPL", "Apple Inc.", "320193")
    private val appliedMaterials = CompanySearchResult("AMAT", "Applied Materials", "796343")

    private fun service(fake: FakeEdgarPort = FakeEdgarPort()) = SearchCompaniesService(fake)

    @Test
    fun blankQueryDelegatesToSearchAll() {
        val fake = FakeEdgarPort().apply { allResults = listOf(apple) }
        val result = service(fake).search("   ")
        assertEquals(listOf(apple), result)
    }

    @Test
    fun emptyQueryDelegatesToSearchAll() {
        val fake = FakeEdgarPort().apply { allResults = listOf(apple, appliedMaterials) }
        val result = service(fake).search("")
        assertEquals(listOf(apple, appliedMaterials), result)
    }

    @Test
    fun tickerQuerySearchesByTickerAndName() {
        val fake = FakeEdgarPort().apply { tickerResults = mapOf("AAPL" to listOf(apple)) }
        val result = service(fake).search("AAPL")
        assertEquals(listOf(apple), result)
    }

    @Test
    fun lowercaseQuerySearchesByName() {
        val fake = FakeEdgarPort().apply { nameResults = mapOf("aapl" to listOf(apple)) }
        val result = service(fake).search("aapl")
        assertEquals(listOf(apple), result)
    }

    @Test
    fun tickerQueryCanReturnMultipleMatches() {
        val fake =
            FakeEdgarPort().apply {
                tickerResults = mapOf("AAPL" to listOf(apple, appliedMaterials))
            }
        val result = service(fake).search("AAPL")
        assertEquals(2, result.size)
    }

    @Test
    fun nameQuerySearchesByName() {
        val fake = FakeEdgarPort().apply { nameResults = mapOf("Apple Inc" to listOf(apple)) }
        val result = service(fake).search("Apple Inc")
        assertEquals(listOf(apple), result)
    }

    @Test
    fun lowercaseNameWordSearchesByName() {
        val alcoa = CompanySearchResult("AA", "Alcoa Corp", "4281")
        val fake = FakeEdgarPort().apply { nameResults = mapOf("corp" to listOf(alcoa)) }
        val result = service(fake).search("corp")
        assertEquals(listOf(alcoa), result)
    }

    @Test
    fun sixLetterQuerySearchesByName() {
        val fake = FakeEdgarPort().apply { nameResults = mapOf("GOOGL1" to listOf(apple)) }
        val result = service(fake).search("GOOGL1")
        assertEquals(listOf(apple), result)
    }

    @Test
    fun tickerAndNameResultsMergedWithTickerFirst() {
        val fake =
            FakeEdgarPort().apply {
                tickerResults = mapOf("ATA" to listOf(appliedMaterials))
                nameResults = mapOf("ATA" to listOf(apple, appliedMaterials))
            }
        val result = service(fake).search("ATA")
        assertEquals(listOf(appliedMaterials, apple), result)
    }

    @Test
    fun edgarFailureReturnsEmptyList() {
        val fake = FakeEdgarPort().apply { shouldThrow = true }
        val result = service(fake).search("AAPL")
        assertTrue(result.isEmpty())
    }

    @Test
    fun edgarFailureOnBlankQueryReturnsEmptyList() {
        val fake = FakeEdgarPort().apply { shouldThrow = true }
        val result = service(fake).search("")
        assertTrue(result.isEmpty())
    }
}
