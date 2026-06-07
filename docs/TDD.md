# How TDD Was Done — Stock Price Feature

This document explains how the **stock price** feature (US-008: latest price endpoint
+ Yahoo Finance batch job) was built test-first, following the red → green → refactor loop.

The feature spans two codebases, each with its own test stack:

| Component | Stack | Test layer | Location |
|-----------|-------|-----------|----------|
| Price API | Spring Boot 4 · Kotlin | JUnit 5 (unit + integration) | `api/src/test/.../price/` |
| Price batch | Python · yfinance | pytest | `batch/tests/` |

---

## The Loop

For every behavior the cycle was the same:

1. **Red** — write a failing test that names one observable behavior. Run it, watch it fail
   (compile error or assertion failure) for the *expected* reason.
2. **Green** — write the minimum production code to make that test pass. Nothing more.
3. **Refactor** — clean up names, extract helpers, remove duplication while the bar stays green.

No production line was written before a test demanded it.

---

## Project Testing Constraints

The `api/CLAUDE.md` rules shaped *how* the tests were written:

- **No mock frameworks.** Collaborators are hand-written simulator classes injected via
  the constructor — never Mockito.
- **One assert per test.** More than one behavior → split into more tests.
- **Unit tests** (`src/test/.../unit/`) exercise domain/application logic in isolation
  with simulators.
- **Integration tests** (`src/test/.../integration/`) hit a real Spring context on an
  in-memory H2 database (`MODE=MySQL`) — the persistence layer is never mocked.

These constraints are visible directly in the test code below.

---

## 1. Domain + Application — Unit Tests First

### Red

The first test described the core read behavior with no implementation in sight
(`StockPriceServiceTest.kt`):

```kotlin
@Test
fun getLatestPriceReturnsMostRecentEntry() {
    val repository = InMemoryStockPriceRepository()
    repository.save(StockPrice("AAPL", BigDecimal("100.0000"), Instant.parse("2026-05-27T10:00:00Z")))
    repository.save(StockPrice("AAPL", BigDecimal("189.4200"), Instant.parse("2026-05-28T14:32:00Z")))

    val latest = service(repository).getLatestPrice("AAPL")

    assertEquals(BigDecimal("189.4200"), latest.price)
}
```

At this point `StockPrice`, `StockPriceService`, `StockPriceRepository` and
`InMemoryStockPriceRepository` did not exist — the test would not even compile. That
**compile failure is the first red.** The test dictated the shape of the API: a service
constructed from a repository, exposing `getLatestPrice(ticker)`.

A second test pinned the failure path — one assert, one behavior:

```kotlin
@Test
fun getLatestPriceThrowsWhenNoDataExists() {
    val service = service(InMemoryStockPriceRepository())

    assertThrows<PriceNotFoundException> {
        service.getLatestPrice("AAPL")
    }
}
```

### Green

The minimum to satisfy both tests, no extras:

- `domain/price/StockPrice.kt` — value object (`ticker`, `price`, `fetchedAt`).
- `application/price/StockPriceRepository.kt` — port: `findLatestByTicker(ticker): StockPrice?`.
- `application/price/StockPriceService.kt` — returns the price or throws `PriceNotFoundException`.
- `application/price/PriceNotFoundException.kt`.

### The simulator (no mocks)

The "most recent wins" rule lives in the **test double**, written by hand instead of mocked
(`InMemoryStockPriceRepository.kt`):

```kotlin
class InMemoryStockPriceRepository : StockPriceRepository {
    private val prices = mutableListOf<StockPrice>()
    fun save(price: StockPrice) { prices.add(price) }
    override fun findLatestByTicker(ticker: String): StockPrice? =
        prices.filter { it.ticker == ticker }.maxByOrNull { it.fetchedAt }
}
```

The unit suite never touches a database — the port is satisfied by an in-memory list. This
keeps the domain/application layer pure, exactly as the hexagonal architecture intends.

---

## 2. HTTP + Persistence — Integration Tests

Once the use case was green in isolation, integration tests drove the **adapters** (controller,
JPA repository, JSON contract) against a real Spring context + H2 (`StockPriceIntegrationTest.kt`).

### Red

Each test asserts exactly one fact about the endpoint, seeding the DB through `JdbcTemplate`
in `@BeforeEach` — the persistence layer is exercised, not mocked:

```kotlin
@BeforeEach
fun seed() {
    jdbcTemplate.update("DELETE FROM stock_prices")
    jdbcTemplate.update(
        "INSERT INTO stock_prices (ticker, price, fetched_at) VALUES (?, ?, ?)",
        "AAPL", BigDecimal("189.4200"), Timestamp.valueOf("2026-05-28 14:32:00.000"),
    )
}
```

The behaviors, one assert each:

| Test | Asserts |
|------|---------|
| `latestPriceReturns200` | `GET /api/prices/AAPL/latest` → 200 |
| `latestPriceReturnsTicker` | body `$.ticker == "AAPL"` |
| `latestPriceReturnsPrice` | body `$.price == 189.42` |
| `latestPriceReturnsFetchedAt` | body `$.fetchedAt` not empty |
| `unknownTickerReturns404` | unknown ticker → 404 |

These were red until the wiring existed.

### Green

The adapters that made them pass:

- `api/price/PriceController.kt` + `LatestPriceResponse.kt` — route and JSON DTO
  (DTO is a pure data carrier, no logic — per the code rules).
- `infrastructure/persistence/price/` — `StockPriceEntity`, `SpringDataStockPriceRepository`
  (Spring Data), and `JpaStockPriceRepository` adapting it to the application port.
- `db/migration/V3__create_stock_prices_and_errors.sql` — the `stock_prices` table +
  `(ticker, fetched_at DESC)` index that makes "latest" cheap. A **new** migration; existing
  ones were never edited.
- The 404 came free from `PriceNotFoundException` thrown by the already-tested service,
  mapped by the global exception handler.

---

## 3. The Batch Job — pytest, Test-First

The Yahoo Finance updater (`batch/update_prices.py`) was driven by
`batch/tests/test_update_prices.py`.

### Isolating external dependencies

`yfinance`, `mysql-connector-python` and `python-dotenv` are heavy/network-bound, so they are
**stubbed in `sys.modules` before the module under test is imported** — the suite runs with no
real dependencies installed and never hits the network or a database:

```python
_yf_stub = types.ModuleType("yfinance")
_yf_stub.download = mock.MagicMock()
_yf_stub.Ticker = mock.MagicMock()
sys.modules["yfinance"] = _yf_stub
# ... same pattern for mysql.connector and dotenv
from batch import update_prices as up
```

The database is a hand-written fake (`FakeConn` / `FakeCursor`) that records every SQL
statement — the same "real simulator, not a mock framework" philosophy as the Kotlin side.
Assertions inspect what got recorded:

```python
def _inserts_into(conn, table):
    return [sql for sql, _ in conn.statements if table in sql]
```

### Red → Green, behavior by behavior

Each test named one batch behavior and was written before the code path existed:

| Test | Behavior driven |
|------|-----------------|
| `test_successful_fetch_inserts_price` | a fetched price → one `INSERT` into `stock_prices` |
| `test_no_price_records_error_and_continues` | missing `lastPrice` → row in `price_update_errors`, run continues |
| `test_yfinance_exception_records_error` | yfinance raising → error recorded, not propagated |
| `test_empty_ticker_list_skips_yfinance` | empty ticker list → yfinance never called |

These tests forced the resilient design in `run()`: per-ticker `try/except` so one bad ticker
never aborts the batch, a bulk fetch with a `fast_info` single-ticker fallback, and failures
written to `price_update_errors`. The `price_update_errors` table in the V3 migration exists
**because a test asked for it.**

`conftest.py` at the repo root puts the project root on `sys.path` so
`import batch.update_prices` resolves when running `pytest batch/tests/`.

---

## Why This Order

The progression mirrors the hexagonal layers, inside-out:

```
domain / application  →  unit tests with simulators      (fast, no I/O)
adapters (HTTP, JPA)  →  integration tests on H2          (real wiring)
batch (external I/O)  →  pytest with stubbed deps + fakes (no network/DB)
```

The pure core was proven first with the cheapest tests; the expensive integration and
external-I/O tests came only once the behavior they wire up was already specified. Every
production file listed above traces back to a test that failed first.

---

## Running the Suites

```bash
# API — unit only (also runs in the pre-push hook)
cd api && ./gradlew unitTest

# API — unit + integration (runs in CI)
cd api && ./gradlew test

# Batch — from repo root
pytest batch/tests/
```
