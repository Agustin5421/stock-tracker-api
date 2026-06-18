# Load & Stress Tests — Locust

Requires the API running on port 8080 before starting any test.

## Prerequisites — seed stock prices

Buy and sell operations return 422 if the DB has no prices. Run this once from `batch/` before any test:

```bash
docker compose --env-file ../api/.env run --rm seed
```

This loads prices for all 14 tickers used in the test (AAPL, MSFT, AMZN, GOOGL, TSLA, META, NVDA, JPM, JNJ, V, WMT, KO, NFLX, INTC).

---

## Test types

| `TEST_TYPE` | Shape | Users | Duration |
|-------------|-------|-------|----------|
| `load` (default) | Fixed plateau | 50 (ramp 5/s) | ~5 min |
| `stress` | Step ramp +10 users / 30s | up to 200 | ~10 min |

### User profiles

- **PassiveInvestorUser** (70%) — searches companies, reads metrics/filings/watchlist, rarely buys.
- **ActiveTraderUser** (30%) — buys and sells frequently, monitors portfolio and operation history.

---

## Running with the visual UI

```bash
# Load test
docker compose up
# Stress test
TEST_TYPE=stress docker compose up
```

Open **http://localhost:8089** → click **"Start swarming"**.

The UI shows real-time charts for RPS, response times (p50/p95/p99), and error rate.
The test stops automatically when the shape ends.

---

## Running headless and saving reports

Reports are saved to `output/` as standalone HTML files (charts included).
Each run overwrites files with the same name — use distinct names to keep multiple results.

```bash
# Load test
docker compose run --rm -e TEST_TYPE=load portfolio-tracker-locust \
  --headless \
  --html /mnt/output/load_report.html \
  --csv /mnt/output/load

# Stress test
docker compose run --rm -e TEST_TYPE=stress portfolio-tracker-locust \
  --headless \
  --html /mnt/output/stress_report.html \
  --csv /mnt/output/stress

# With timestamp to preserve multiple runs
docker compose run --rm -e TEST_TYPE=stress portfolio-tracker-locust \
  --headless \
  --html /mnt/output/stress_$(date +%Y%m%d_%H%M%S).html \
  --csv /mnt/output/stress_$(date +%Y%m%d_%H%M%S)
```

---

## Dimensioning — running with resource limits

Override files cap the API container's CPU and RAM to find the breaking point.
All commands run from this directory (`e2e/load/`).

```bash
# Run A — comfortable (4 CPU / 8 GB)
docker compose -f ../../api/docker-compose.yaml -f docker-compose.stress-comfortable.yml up --build -d

# Run B — degraded (1 CPU / 1 GB)
docker compose -f ../../api/docker-compose.yaml -f docker-compose.stress-degraded.yml up --build -d
```

Then fire the stress test while each config is running:

```bash
TEST_TYPE=stress docker compose run --rm -e TEST_TYPE=stress portfolio-tracker-locust \
  --headless -t 10m \
  --html /mnt/output/stress_comfortable.html \
  --csv /mnt/output/stress_comfortable
```

Compare the two HTML reports to show at which resource level the system degrades.
