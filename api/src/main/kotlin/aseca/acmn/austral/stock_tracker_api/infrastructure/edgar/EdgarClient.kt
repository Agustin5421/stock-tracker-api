package aseca.acmn.austral.stock_tracker_api.infrastructure.edgar

import aseca.acmn.austral.stock_tracker_api.application.company.EdgarPort
import aseca.acmn.austral.stock_tracker_api.domain.company.CompanySearchResult
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty
import org.springframework.core.ParameterizedTypeReference
import org.springframework.web.client.RestClient
import java.util.concurrent.atomic.AtomicReference

class EdgarClient(
    private val client: RestClient,
) : EdgarPort {
    private val tickerCache = AtomicReference<Map<Long, TickerEntry>?>(null)
    private val requestTimestamps = ArrayDeque<Long>()
    private val lock = Any()

    override fun searchByTicker(ticker: String): List<CompanySearchResult> {
        val cache = loadTickers() ?: return emptyList()
        val entry =
            cache.values.firstOrNull { it.ticker.equals(ticker, ignoreCase = true) }
                ?: return emptyList()
        return listOf(CompanySearchResult(entry.ticker, entry.title, entry.cikStr.toString()))
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
            emptyList()
        }
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
}
