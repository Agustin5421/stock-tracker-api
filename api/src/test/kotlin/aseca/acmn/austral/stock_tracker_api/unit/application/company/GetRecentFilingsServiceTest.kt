package aseca.acmn.austral.stock_tracker_api.unit.application.company

import aseca.acmn.austral.stock_tracker_api.application.company.CompanyNotFoundException
import aseca.acmn.austral.stock_tracker_api.application.company.EdgarUnavailableException
import aseca.acmn.austral.stock_tracker_api.application.company.GetRecentFilingsService
import aseca.acmn.austral.stock_tracker_api.domain.company.Filing
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import kotlin.test.assertEquals

class GetRecentFilingsServiceTest {
    private fun service(fake: FakeEdgarPort = FakeEdgarPort()) = GetRecentFilingsService(fake)

    private fun filing(
        type: String,
        date: String = "2024-01-01",
        accession: String = "0000000000-00-000000",
    ) = Filing(type = type, filingDate = date, accessionNumber = accession)

    @Test
    fun returnsOnlyTenKFilings() {
        val fake =
            FakeEdgarPort().apply {
                filingsResult = listOf(filing("10-K"), filing("8-K"), filing("10-Q"))
            }
        val result = service(fake).getRecentFilings("320193")
        assertEquals(listOf(filing("10-K"), filing("10-Q")), result)
    }

    @Test
    fun returnsOnlyTenQFilings() {
        val fake =
            FakeEdgarPort().apply {
                filingsResult = listOf(filing("10-Q"), filing("S-1"), filing("10-Q"))
            }
        val result = service(fake).getRecentFilings("320193")
        assertEquals(listOf(filing("10-Q"), filing("10-Q")), result)
    }

    @Test
    fun filtersOutNonTenKAndTenQForms() {
        val fake =
            FakeEdgarPort().apply {
                filingsResult = listOf(filing("8-K"), filing("S-1"), filing("DEF 14A"))
            }
        val result = service(fake).getRecentFilings("320193")
        assertEquals(emptyList(), result)
    }

    @Test
    fun limitsResultsToTen() {
        val fake =
            FakeEdgarPort().apply {
                filingsResult = (1..15).map { filing("10-K", "2024-01-${"$it".padStart(2, '0')}") }
            }
        val result = service(fake).getRecentFilings("320193")
        assertEquals(10, result.size)
    }

    @Test
    fun propagatesCompanyNotFoundException() {
        val fake = FakeEdgarPort().apply { filingsThrowsNotFound = true }
        assertThrows<CompanyNotFoundException> { service(fake).getRecentFilings("000000") }
    }

    @Test
    fun propagatesEdgarUnavailableException() {
        val fake = FakeEdgarPort().apply { filingsThrowsUnavailable = true }
        assertThrows<EdgarUnavailableException> { service(fake).getRecentFilings("320193") }
    }
}
