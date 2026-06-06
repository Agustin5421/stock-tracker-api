package aseca.acmn.austral.stock_tracker_api.infrastructure.persistence.portfolio

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.math.BigDecimal
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "stock_prices")
class StockPriceEntity(
    @Id
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(name = "id", length = 36, nullable = false, updatable = false)
    val id: UUID,
    @Column(name = "ticker", nullable = false, length = 10)
    val ticker: String,
    @Column(name = "price", nullable = false, precision = 19, scale = 4)
    val price: BigDecimal,
    @Column(name = "fetched_at", nullable = false)
    val fetchedAt: Instant,
)
