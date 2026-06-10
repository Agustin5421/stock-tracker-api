package aseca.acmn.austral.stock_tracker_api.infrastructure.persistence.price

import aseca.acmn.austral.stock_tracker_api.domain.price.StockPrice
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.math.BigDecimal
import java.time.LocalDateTime
import java.time.ZoneOffset

@Entity
@Table(name = "stock_prices")
class StockPriceEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    val id: Long? = null,
    @Column(name = "ticker", nullable = false, length = 20)
    val ticker: String,
    @Column(name = "price", nullable = false, precision = 19, scale = 4)
    val price: BigDecimal,
    @Column(name = "fetched_at", nullable = false)
    val fetchedAt: LocalDateTime,
) {
    fun toDomain(): StockPrice =
        StockPrice(
            ticker = ticker,
            price = price,
            fetchedAt = fetchedAt.toInstant(ZoneOffset.UTC),
        )
}
