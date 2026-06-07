# US-016 — Visualizar última actualización de precios — Decisiones de implementación

> Orden de implementación: **2 de 3**. Es pequeño y es el primer cambio sobre la
> respuesta del portfolio: establece el patrón de "campo aditivo no rompiente"
> antes de que US-017 (P&L) agregue lógica de dominio sobre la misma respuesta.

## Estado de partida

- `StockPrice(ticker, price, fetchedAt)` ya persiste el timestamp.
- Tabla `stock_prices` con índice `idx_stock_prices_ticker_fetched (ticker, fetched_at DESC)`.
- `GET /api/portfolio` ya devuelve `PortfolioResponse(positions, totalValue)`.

No hace falta migración.

## Decisiones

- **Alcance: máximo global del sistema.** `SELECT MAX(fetched_at) FROM stock_prices`,
  sobre todos los tickers — "cuándo corrió por última vez el batch de precios".
  - Se descartó el alcance acotado a los tickers del usuario: el batch (US-018)
    actualiza todos los tickers en una sola corrida, así que global y acotado casi
    siempre coinciden, y el global evita el join a las posiciones del usuario.
  - La frescura por posición ya es visible vía el `fetchedAt` de cada `latestPrice`
    si alguna vez hiciera falta.
- **Repositorio:** nuevo método `findLatestFetchedAt(): Instant?` (un `SELECT MAX(fetchedAt)`).
- **Exposición:** campo nullable `pricesUpdatedAt: Instant?` en `PortfolioView` →
  `PortfolioResponse`, junto a `totalValue` ("junto a la valuación").
- **Semántica de null:** `null` ⇒ nunca se actualizaron precios. La UI muestra
  "no hay actualización disponible".
- **Web:** etiqueta "as of {timestamp}" al lado del valor total; estado vacío cuando es null.
- **No rompiente:** agregar un campo nullable al JSON no rompe los tests existentes
  de `GET /api/portfolio` (las claves extra se ignoran al deserializar).

## Tests

- **Unit:** `pricesUpdatedAt` null cuando no hay precios vs poblado cuando los hay.
- **Integration (H2):** la respuesta del portfolio incluye el campo con el MAX correcto.
- Una sola aserción por test.
