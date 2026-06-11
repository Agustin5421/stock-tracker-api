package aseca.acmn.austral.stock_tracker_api.infrastructure.watchlist

import aseca.acmn.austral.stock_tracker_api.application.watchlist.AddCompanyToWatchlistService
import aseca.acmn.austral.stock_tracker_api.application.watchlist.AddCompanyToWatchlistUseCase
import aseca.acmn.austral.stock_tracker_api.application.watchlist.GetWatchlistService
import aseca.acmn.austral.stock_tracker_api.application.watchlist.GetWatchlistUseCase
import aseca.acmn.austral.stock_tracker_api.application.watchlist.RemoveCompanyFromWatchlistService
import aseca.acmn.austral.stock_tracker_api.application.watchlist.RemoveCompanyFromWatchlistUseCase
import aseca.acmn.austral.stock_tracker_api.application.watchlist.WatchlistRepository
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class WatchlistConfig {
    @Bean
    fun addCompanyToWatchlistUseCase(watchlistRepository: WatchlistRepository): AddCompanyToWatchlistUseCase =
        AddCompanyToWatchlistService(watchlistRepository)

    @Bean
    fun removeCompanyFromWatchlistUseCase(watchlistRepository: WatchlistRepository): RemoveCompanyFromWatchlistUseCase =
        RemoveCompanyFromWatchlistService(watchlistRepository)

    @Bean
    fun getWatchlistUseCase(watchlistRepository: WatchlistRepository): GetWatchlistUseCase = GetWatchlistService(watchlistRepository)
}
