# Price Update Batch — Implementation Status

Feature: Yahoo Finance price update batch + latest-price read endpoint.
Branch: `feat/portfolio-management`. Last updated: 2026-06-05.

## Status legend

- ✅ **Done & tested** — implemented, automated test passing.
- 🟢 **Done** — implemented, manually verified, no dedicated test.
- 🟡 **WIP / partial** — works but with known gaps.
- ⛔ **Blocked / not built** — depends on missing feature.

---

## 1. Database (Flyway)

| Item | Status | Notes |
|------|--------|-------|
| `V3__create_stock_prices_and_errors.sql` | ✅ | Creates `stock_prices` + `price_update_errors`. Applies on MySQL 8.4 and H2 (MySQL mode). Verified via `./gradlew test` (ddl-auto: validate passes). |
| `stock_prices` table | ✅ | `id`, `ticker(20)`, `price DECIMAL(19,4)`, `fetched_at DATETIME(3)`, index `(ticker, fetched_at DESC)`. |
| `price_update_errors` table | ✅ | `id`, `ticker(20)`, `error_message TEXT`, `occurred_at DATETIME(3)`. |

## 2. Kotlin — latest-price read feature (hexagonal)

| Layer | File | Status |
|-------|------|--------|
| Domain | `domain/price/StockPrice.kt` | 🟢 |
| Port | `application/price/StockPriceRepository.kt` | 🟢 |
| UseCase iface | `application/price/GetLatestPriceUseCase.kt` | 🟢 |
| Service | `application/price/StockPriceService.kt` | ✅ unit-tested |
| Exception | `application/price/PriceNotFoundException.kt` | 🟢 |
| Entity | `infrastructure/persistence/price/StockPriceEntity.kt` | ✅ ddl-validate passes |
| SpringData repo | `infrastructure/persistence/price/SpringDataStockPriceRepository.kt` | 🟢 |
| Jpa adapter | `infrastructure/persistence/price/JpaStockPriceRepository.kt` | 🟢 |
| Controller | `api/price/PriceController.kt` — `GET /api/prices/{ticker}/latest` | ✅ integration-tested |
| DTO | `api/price/LatestPriceResponse.kt` | 🟢 |
| Bean wiring | `infrastructure/price/PriceConfig.kt` | 🟢 |
| 404 mapping | `GlobalExceptionHandler` — `PriceNotFoundException` → 404 | 🟢 |
| Security | `SecurityConfig` — `/api/prices/**` public | 🟢 |

`GET /api/prices/{ticker}/latest` → 200 `LatestPriceResponse` or 404 if no price. Public (no JWT).

## 3. Trigger endpoint (fire-and-forget subprocess)

| Item | File | Status |
|------|------|--------|
| UseCase iface | `application/price/TriggerPriceUpdateUseCase.kt` | 🟢 |
| Runner | `infrastructure/price/ProcessPriceUpdateRunner.kt` | 🟡 host-only |
| Controller | `api/price/PriceUpdateController.kt` — `POST /admin/prices/update` | 🟢 |
| Security | `SecurityConfig` — `/admin/prices/**` **public** (no JWT) | 🟢 ⚠️ |
| Startup runner | `infrastructure/price/PriceUpdateStartupRunner.kt` | 🟢 gated by `batch.run-on-startup` |

`POST /admin/prices/update` → 202 `{"status":"triggered"}`. Spawns Python subprocess, drains stdout to app log, non-blocking.

**⚠️ Notes:**
- Endpoint is **public** (user decision). Spawns a process — abuse/resource vector. Re-protect with JWT before prod.
- Runner is **host-only** (`bootRun`): walks up dirs to find `batch/update_prices.py`, picks a python from candidate paths. In Docker the slim JRE API image has no python/batch dir — the dedicated `batch` container handles Docker runs instead.

## 4. Python batch

| Item | File | Status |
|------|------|--------|
| Batch script | `batch/update_prices.py` | ✅ unit-tested |
| Requirements | `batch/requirements.txt` (`yfinance==1.4.0`, `mysql-connector-python==9.7.0`, `python-dotenv==1.2.2`) | 🟢 |
| Package init | `batch/__init__.py`, `batch/tests/__init__.py`, root `conftest.py` | 🟢 |

Flow: connect → `fetch_tickers` (`SELECT DISTINCT ticker FROM portfolio_positions UNION ... watchlist_items`; `[]` if tables missing) → bulk `yf.download` w/ `fast_info[lastPrice]` fallback → per-ticker `record_success`/`record_error` → summary → exit 0 (exit 1 only on DB/config fatal). `OVERRIDE_TICKERS` env bypasses DB ticker lookup.

## 5. Tests

| Suite | File | Status |
|-------|------|--------|
| Kotlin unit | `unit/application/price/StockPriceServiceTest.kt` + `InMemoryStockPriceRepository` | ✅ pass |
| Kotlin integration | `integration/api/price/StockPriceIntegrationTest.kt` | ✅ pass |
| Python | `batch/tests/test_update_prices.py` (4 tests) | ✅ pass |

Kotlin: one-assert-per-test, plain-Kotlin fakes (no Mockito). Python: `sys.modules` stubs yfinance/mysql/dotenv; FakeConn/FakeCursor capture SQL.

## 6. Infra / CI

| Item | Status | Notes |
|------|--------|-------|
| `docker-compose.yaml` `batch` service | 🟢 | Runs on `docker compose up` (no profile). `restart: "no"`, runs once after DB healthy. |
| `application.yaml` `batch.run-on-startup` | 🟢 | `${BATCH_RUN_ON_STARTUP:false}`. |
| CI job `price-update-batch` | 🟢 | `needs: api-tests`, `continue-on-error: true`. MySQL service + Flyway migrate + pytest + Yahoo smoke (`b.run(['AAPL'])`). Not yet run on CI. |

---

## Known gaps / blockers

- ⛔ **No prices saved by default.** Batch fetches tickers from `portfolio_positions`/`watchlist_items` — **neither table exists yet** (portfolio/watchlist features not built). Zero tickers → nothing saved. By design (spec: exit clean if tables missing). Force a run with `OVERRIDE_TICKERS=AAPL`.
- ⛔ **P&L not possible yet.** Needs portfolio feature (cost basis) + stored prices. Price-storage half done; portfolio half not built.
- ⚠️ **`/admin/prices/update` public.** Re-add JWT before prod.
- 🟡 **Trigger endpoint host-only.** Docker API container can't spawn python; use `batch` container for Docker.

## How to run

```bash
# Force a price save (proves pipeline end-to-end)
cd api && OVERRIDE_TICKERS=AAPL docker compose up --build -d
docker compose logs batch          # → "AAPL -> 189.x", row written
# then GET /api/prices/AAPL/latest → 200

# Tests
cd api && ./gradlew ktlintCheck unitTest test
cd batch && pip install -r requirements.txt pytest && pytest tests/
```

## Next step

Build minimal `portfolio_positions` table + buy endpoint so full buy → price → P&L flow runs end-to-end.
