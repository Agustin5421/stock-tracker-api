package aseca.acmn.austral.stock_tracker_api.infrastructure.persistence.watchlist

import aseca.acmn.austral.stock_tracker_api.application.watchlist.WatchlistRepository
import aseca.acmn.austral.stock_tracker_api.domain.watchlist.WatchlistItem
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Repository
class JpaWatchlistRepository(
    private val springDataRepository: SpringDataWatchlistRepository,
) : WatchlistRepository {

    @Transactional
    override fun save(item: WatchlistItem): WatchlistItem {
        val entity = WatchlistItemEntity.fromDomain(item)
        return springDataRepository.save(entity).toDomain()
    }

    @Transactional
    override fun delete(userId: UUID, ticker: String) {
        springDataRepository.deleteByUserIdAndTicker(userId, ticker)
    }

    override fun findByUserId(userId: UUID): List<WatchlistItem> {
        return springDataRepository.findByUserId(userId).map { it.toDomain() }
    }

    override fun existsByUserIdAndTicker(userId: UUID, ticker: String): Boolean {
        return springDataRepository.existsByUserIdAndTicker(userId, ticker)
    }
}
