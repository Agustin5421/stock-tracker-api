package aseca.acmn.austral.stock_tracker_api.infrastructure.edgar

import aseca.acmn.austral.stock_tracker_api.application.company.EdgarPort
import aseca.acmn.austral.stock_tracker_api.application.company.SearchCompaniesService
import aseca.acmn.austral.stock_tracker_api.application.company.SearchCompaniesUseCase
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.client.RestClient

@Configuration
class CompanyConfig {
    @Bean
    fun edgarPort(builder: RestClient.Builder): EdgarPort =
        EdgarClient(
            builder
                .defaultHeader("User-Agent", "stock-tracker-api, stock@gmail.com")
                .build(),
        )

    @Bean
    fun searchCompaniesUseCase(edgarPort: EdgarPort): SearchCompaniesUseCase = SearchCompaniesService(edgarPort)
}
