package aseca.acmn.austral.stock_tracker_api.infrastructure.edgar

import aseca.acmn.austral.stock_tracker_api.application.company.EdgarPort
import aseca.acmn.austral.stock_tracker_api.application.company.GetCompanyMetricsService
import aseca.acmn.austral.stock_tracker_api.application.company.GetCompanyMetricsUseCase
import aseca.acmn.austral.stock_tracker_api.application.company.GetHistoricalMetricsService
import aseca.acmn.austral.stock_tracker_api.application.company.GetHistoricalMetricsUseCase
import aseca.acmn.austral.stock_tracker_api.application.company.GetRecentFilingsService
import aseca.acmn.austral.stock_tracker_api.application.company.GetRecentFilingsUseCase
import aseca.acmn.austral.stock_tracker_api.application.company.SearchCompaniesService
import aseca.acmn.austral.stock_tracker_api.application.company.SearchCompaniesUseCase
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.web.client.RestClient

@Configuration
class CompanyConfig {
    @Bean
    @Profile("!e2e")
    fun edgarPort(builder: RestClient.Builder): EdgarPort =
        EdgarClient(
            builder
                .defaultHeader("User-Agent", "stock-tracker-api, stock@gmail.com")
                .build(),
        )

    @Bean
    @Profile("e2e")
    fun stubEdgarPort(): EdgarPort = StubEdgarPort()

    @Bean
    fun searchCompaniesUseCase(edgarPort: EdgarPort): SearchCompaniesUseCase = SearchCompaniesService(edgarPort)

    @Bean
    fun getCompanyMetricsUseCase(edgarPort: EdgarPort): GetCompanyMetricsUseCase = GetCompanyMetricsService(edgarPort)

    @Bean
    fun getRecentFilingsUseCase(edgarPort: EdgarPort): GetRecentFilingsUseCase = GetRecentFilingsService(edgarPort)

    @Bean
    fun getHistoricalMetricsUseCase(edgarPort: EdgarPort): GetHistoricalMetricsUseCase = GetHistoricalMetricsService(edgarPort)
}
