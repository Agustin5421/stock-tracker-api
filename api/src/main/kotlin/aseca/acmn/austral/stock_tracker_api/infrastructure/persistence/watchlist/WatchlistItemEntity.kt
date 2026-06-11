package aseca.acmn.austral.stock_tracker_api.infrastructure.persistence.watchlist

import aseca.acmn.austral.stock_tracker_api.domain.watchlist.WatchlistItem
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.util.UUID

@Entity
@Table(name = "watchlist_items")
class WatchlistItemEntity(
    @Id
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(name = "id", length = 36, nullable = false, updatable = false)
    val id: UUID,
    
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(name = "user_id", length = 36, nullable = false)
    val userId: UUID,
    
    @Column(name = "ticker", nullable = false, length = 10)
    val ticker: String,
    
    @Column(name = "name", nullable = false, length = 255)
    val name: String,
    
    @Column(name = "cik", nullable = false, length = 20)
    val cik: String,
) {
    fun toDomain(): WatchlistItem = WatchlistItem(
        id = id,
        userId = userId,
        ticker = ticker,
        name = name,
        cik = cik
    )

    companion object {
        fun fromDomain(item: WatchlistItem): WatchlistItemEntity =
            WatchlistItemEntity(
                id = item.id,
                userId = item.userId,
                ticker = item.ticker,
                name = item.name,
                cik = item.cik
            )
    }
}
