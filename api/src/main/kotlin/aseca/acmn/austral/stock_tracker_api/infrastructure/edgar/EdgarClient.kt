package aseca.acmn.austral.stock_tracker_api.infrastructure.edgar

import aseca.acmn.austral.stock_tracker_api.application.company.CompanyNotFoundException
import aseca.acmn.austral.stock_tracker_api.application.company.EdgarException
import aseca.acmn.austral.stock_tracker_api.application.company.EdgarPort
import aseca.acmn.austral.stock_tracker_api.application.company.EdgarUnavailableException
import aseca.acmn.austral.stock_tracker_api.domain.company.CompanyMetrics
import aseca.acmn.austral.stock_tracker_api.domain.company.CompanySearchResult
import aseca.acmn.austral.stock_tracker_api.domain.company.Filing
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty
import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.HttpStatusCode
import org.springframework.web.client.RestClient
import java.math.BigDecimal
import java.util.concurrent.atomic.AtomicReference

class EdgarClient(
    private val client: RestClient,
) : EdgarPort {
    private val tickerCache = AtomicReference<Map<Long, TickerEntry>?>(null)
    private val requestTimestamps = ArrayDeque<Long>()
    private val lock = Any()

    override fun searchAll(): List<CompanySearchResult> {
        val cache = loadTickers() ?: return emptyList()
        return cache.values
            .sortedBy { it.ticker }
            .take(500)
            .map { CompanySearchResult(it.ticker, it.title, it.cikStr.toString()) }
    }

    override fun searchByTicker(query: String): List<CompanySearchResult> {
        val cache = loadTickers() ?: return emptyList()
        return cache.values
            .filter { it.ticker.contains(query, ignoreCase = true) }
            .sortedBy { it.ticker }
            .map { CompanySearchResult(it.ticker, it.title, it.cikStr.toString()) }
    }

    override fun searchByName(name: String): List<CompanySearchResult> {
        val cache = loadTickers() ?: return emptyList()
        throttle()
        return try {
            val response =
                client
                    .get()
                    .uri("https://efts.sec.gov/LATEST/search-index?q={q}&forms=10-K", name)
                    .retrieve()
                    .body(object : ParameterizedTypeReference<EftsResponse>() {})
                    ?: return emptyList()

            response.hits.hits
                .mapNotNull { hit ->
                    val cikLong =
                        hit.source.entityId
                            .trimStart('0')
                            .toLongOrNull() ?: return@mapNotNull null
                    val entry = cache[cikLong]
                    CompanySearchResult(
                        ticker = entry?.ticker ?: "",
                        name = hit.source.entityName,
                        cik = cikLong.toString(),
                    )
                }.distinctBy { it.cik }
                .take(20)
        } catch (e: Exception) {
            // log-worthy
            emptyList()
        }
    }

    override fun getMetrics(cik: String): CompanyMetrics {
        val paddedCik = cik.padStart(10, '0')
        throttle()
        val facts =
            try {
                var notFound = false
                val response =
                    client
                        .get()
                        .uri("https://data.sec.gov/api/xbrl/companyfacts/CIK$paddedCik.json")
                        .retrieve()
                        .onStatus(HttpStatusCode::is4xxClientError) { _, _ -> notFound = true }
                        .body(CompanyFactsResponse::class.java)
                if (notFound) throw CompanyNotFoundException(cik)
                response ?: throw EdgarException("Empty response body for CIK $cik")
            } catch (e: CompanyNotFoundException) {
                throw e
            } catch (e: Exception) {
                throw EdgarException("Failed to fetch metrics for CIK $cik", e)
            }

        val usGaap = facts.facts["us-gaap"] ?: emptyMap()

        return CompanyMetrics(
            revenue =
                extractLong(usGaap, "RevenueFromContractWithCustomerExcludingAssessedTax")
                    ?: extractLong(usGaap, "Revenues"),
            netIncome = extractLong(usGaap, "NetIncomeLoss"),
            eps = extractBigDecimal(usGaap, "EarningsPerShareBasic"),
            totalAssets = extractLong(usGaap, "Assets"),
            totalLiabilities = extractLong(usGaap, "Liabilities"),
        )
    }

    override fun getRecentFilings(cik: String): List<Filing> {
        val paddedCik = cik.padStart(10, '0')
        throttle()
        return try {
            var notFound = false
            val response =
                client
                    .get()
                    .uri("https://data.sec.gov/submissions/CIK$paddedCik.json")
                    .retrieve()
                    .onStatus(HttpStatusCode::is4xxClientError) { _, _ -> notFound = true }
                    .body(SubmissionsResponse::class.java)
            if (notFound) throw CompanyNotFoundException(cik)
            val recent = response?.filings?.recent ?: return emptyList()
            val forms = recent.form
            val dates = recent.filingDate
            val accessions = recent.accessionNumber
            forms.indices.map { i ->
                Filing(
                    type = forms[i],
                    filingDate = dates[i],
                    accessionNumber = accessions[i],
                )
            }
        } catch (e: CompanyNotFoundException) {
            throw e
        } catch (e: Exception) {
            throw EdgarUnavailableException("Failed to fetch filings for CIK $cik", e)
        }
    }

    private fun extractLong(
        usGaap: Map<String, ConceptEntry>,
        concept: String,
    ): Long? {
        val units = usGaap[concept]?.units ?: return null
        val entries = units.values.flatten()
        return entries
            .filter { it.form == "10-K" }
            .maxByOrNull { it.end }
            ?.value
            ?.toLong()
    }

    private fun extractBigDecimal(
        usGaap: Map<String, ConceptEntry>,
        concept: String,
    ): BigDecimal? {
        val units = usGaap[concept]?.units ?: return null
        val entries = units.values.flatten()
        return entries
            .filter { it.form == "10-K" }
            .maxByOrNull { it.end }
            ?.value
    }

    private fun loadTickers(): Map<Long, TickerEntry>? {
        tickerCache.get()?.let { return it }
        synchronized(lock) {
            tickerCache.get()?.let { return it }
            throttle()
            return try {
                val response =
                    client
                        .get()
                        .uri("https://www.sec.gov/files/company_tickers.json")
                        .retrieve()
                        .body(object : ParameterizedTypeReference<Map<String, TickerEntry>>() {})
                        ?: return null
                val indexed = response.values.associateBy { it.cikStr }
                tickerCache.set(indexed)
                indexed
            } catch (e: Exception) {
                // log-worthy
                null
            }
        }
    }

    private fun throttle() {
        synchronized(lock) {
            val now = System.currentTimeMillis()
            while (requestTimestamps.isNotEmpty() && now - requestTimestamps.first() >= 1000) {
                requestTimestamps.removeFirst()
            }
            if (requestTimestamps.size >= 10) {
                val waitMs = 1000 - (now - requestTimestamps.first()) + 1
                if (waitMs > 0) Thread.sleep(waitMs)
                requestTimestamps.removeFirst()
            }
            requestTimestamps.addLast(System.currentTimeMillis())
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    data class TickerEntry(
        @JsonProperty("cik_str") val cikStr: Long,
        @JsonProperty("ticker") val ticker: String,
        @JsonProperty("title") val title: String,
    )

    @JsonIgnoreProperties(ignoreUnknown = true)
    data class EftsResponse(
        val hits: EftsHits = EftsHits(),
    )

    @JsonIgnoreProperties(ignoreUnknown = true)
    data class EftsHits(
        val hits: List<EftsHit> = emptyList(),
    )

    @JsonIgnoreProperties(ignoreUnknown = true)
    data class EftsHit(
        @JsonProperty("_source") val source: EftsSource = EftsSource(),
    )

    @JsonIgnoreProperties(ignoreUnknown = true)
    data class EftsSource(
        @JsonProperty("entity_name") val entityName: String = "",
        @JsonProperty("entity_id") val entityId: String = "",
    )

    @JsonIgnoreProperties(ignoreUnknown = true)
    data class CompanyFactsResponse(
        val facts: Map<String, Map<String, ConceptEntry>> = emptyMap(),
    )

    @JsonIgnoreProperties(ignoreUnknown = true)
    data class ConceptEntry(
        val units: Map<String, List<FactEntry>> = emptyMap(),
    )

    @JsonIgnoreProperties(ignoreUnknown = true)
    data class FactEntry(
        val end: String = "",
        val `val`: BigDecimal = BigDecimal.ZERO,
        val form: String = "",
    ) {
        val value: BigDecimal get() = `val`
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    data class SubmissionsResponse(
        val filings: RecentFilingsWrapper = RecentFilingsWrapper(),
    )

    @JsonIgnoreProperties(ignoreUnknown = true)
    data class RecentFilingsWrapper(
        val recent: RecentFilingsArrays = RecentFilingsArrays(),
    )

    @JsonIgnoreProperties(ignoreUnknown = true)
    data class RecentFilingsArrays(
        val form: List<String> = emptyList(),
        val filingDate: List<String> = emptyList(),
        val accessionNumber: List<String> = emptyList(),
    )
}
