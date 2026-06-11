package aseca.acmn.austral.stock_tracker_api.infrastructure.persistence.watchlist

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface SpringDataWatchlistRepository : JpaRepository<WatchlistItemEntity, UUID> {
    fun findByUserId(userId: UUID): List<WatchlistItemEntity>

    fun existsByUserIdAndTicker(
        userId: UUID,
        ticker: String,
    ): Boolean

    fun deleteByUserIdAndTicker(
        userId: UUID,
        ticker: String,
    )
}
