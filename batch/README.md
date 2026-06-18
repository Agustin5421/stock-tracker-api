# Batch — Price Updater

Fetches stock prices from Yahoo Finance and stores them in the DB.
Requires the API stack running (`docker compose up` from `api/`).
All commands run from this directory (`batch/`).

## Important — run from the host, not Docker

Yahoo Finance blocks Docker IP ranges (172.x.x.x) at the network level.
All commands below must be run directly on the host machine.

**First-time setup** (one time only):

```bash
python3 -m venv batch/.venv
batch/.venv/bin/pip install -r batch/requirements.txt
```

## Seed prices (before load tests)

Loads prices for the 14 tickers used in the Locust test pool:

```bash
./batch/seed.sh
```

To seed a custom set of tickers:

```bash
./batch/seed.sh AAPL TSLA MSFT
```

## Update prices (production-like run)

Fetches prices for all tickers currently held in portfolios:

```bash
./batch/update.sh
```

## Notes

- The batch is intentionally excluded from `api/docker-compose.yaml` to avoid hitting Yahoo Finance on every `docker compose up`.
- Yahoo Finance rate-limits aggressively — avoid running this repeatedly in a short window.
