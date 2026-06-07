package aseca.acmn.austral.stock_tracker_api.infrastructure.edgar

import aseca.acmn.austral.stock_tracker_api.application.company.CompanyNotFoundException
import aseca.acmn.austral.stock_tracker_api.application.company.EdgarPort
import aseca.acmn.austral.stock_tracker_api.domain.company.CompanyMetrics
import aseca.acmn.austral.stock_tracker_api.domain.company.CompanySearchResult
import aseca.acmn.austral.stock_tracker_api.domain.company.Filing
import aseca.acmn.austral.stock_tracker_api.domain.company.MetricDataPoint
import aseca.acmn.austral.stock_tracker_api.domain.company.MetricType
import java.math.BigDecimal

class StubEdgarPort : EdgarPort {
    private val companies =
        listOf(
            CompanySearchResult("AAPL", "APPLE INC", "320193"),
            CompanySearchResult("MSFT", "MICROSOFT CORP", "789019"),
            CompanySearchResult("GOOG", "ALPHABET INC", "1652044"),
            CompanySearchResult("AMZN", "AMAZON COM INC", "1018724"),
            CompanySearchResult("NVDA", "NVIDIA CORP", "1045810"),
        )

    private val filings =
        listOf(
            Filing("10-K", "2024-11-01", "0000320193-24-000123"),
            Filing("10-Q", "2024-08-02", "0000320193-24-000098"),
            Filing("10-Q", "2024-05-03", "0000320193-24-000067"),
        )

    private val metrics =
        CompanyMetrics(
            revenue = 391_035_000_000L,
            netIncome = 93_736_000_000L,
            eps = BigDecimal("6.13"),
            totalAssets = 364_980_000_000L,
            totalLiabilities = 308_030_000_000L,
        )

    private val historicalPoints =
        listOf(
            MetricDataPoint("2021-09-25", BigDecimal("365_817_000_000")),
            MetricDataPoint("2022-09-24", BigDecimal("394_328_000_000")),
            MetricDataPoint("2023-09-30", BigDecimal("383_285_000_000")),
            MetricDataPoint("2024-09-28", BigDecimal("391_035_000_000")),
        )

    override fun searchAll(): List<CompanySearchResult> = companies

    override fun searchByTicker(query: String): List<CompanySearchResult> =
        companies.filter { it.ticker.contains(query, ignoreCase = true) }

    override fun searchByName(name: String): List<CompanySearchResult> = companies.filter { it.name.contains(name, ignoreCase = true) }

    override fun getMetrics(cik: String): CompanyMetrics {
        companies.firstOrNull { it.cik == cik } ?: throw CompanyNotFoundException(cik)
        return metrics
    }

    override fun getRecentFilings(cik: String): List<Filing> {
        companies.firstOrNull { it.cik == cik } ?: throw CompanyNotFoundException(cik)
        return filings
    }

    override fun getHistoricalMetrics(
        cik: String,
        metric: MetricType,
    ): List<MetricDataPoint> {
        companies.firstOrNull { it.cik == cik } ?: throw CompanyNotFoundException(cik)
        return historicalPoints
    }
}
