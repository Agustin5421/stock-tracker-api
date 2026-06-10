"""Seed stored prices for a curated set of well-known tickers.

Local/dev convenience. The price batch normally fetches tickers from
``positions`` (and, later, watchlists), but a ticker can't be bought until it
has a stored price — so the very first purchase has nothing to buy. This script
seeds a handful of large-cap tickers so you can make a first purchase without
hand-setting ``OVERRIDE_TICKERS``.

Usage (inside the batch container):
    docker compose run --rm batch python3 seed_top_companies.py
    docker compose run --rm batch python3 seed_top_companies.py TSLA META
"""

import sys

import mysql.connector

# Works both inside the batch container (working dir = batch/) and when imported
# from the repository root (tests, where the package is ``batch.update_prices``).
try:
    import update_prices
except ModuleNotFoundError:  # pragma: no cover
    from batch import update_prices

# Top US large-caps by market cap — liquid defaults with reliable Yahoo data.
TOP_TICKERS = ["AAPL", "MSFT", "GOOG", "AMZN", "NVDA"]


def main(argv: list[str] | None = None) -> int:
    args = sys.argv[1:] if argv is None else argv
    tickers = [t.strip().upper() for t in args if t.strip()] or TOP_TICKERS

    update_prices.logger.info("Seeding prices for: %s", ", ".join(tickers))
    try:
        update_prices.run(tickers)
        return 0
    except update_prices.FatalConfigError as exc:
        update_prices.logger.error("Fatal config error: %s", exc)
        return 1
    except mysql.connector.Error as exc:
        update_prices.logger.error("Database connection failure: %s", exc)
        return 1


if __name__ == "__main__":
    sys.exit(main())
