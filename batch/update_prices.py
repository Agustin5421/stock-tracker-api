"""Yahoo Finance price update batch.

Fetches the distinct tickers tracked by the portfolio/watchlist features,
pulls their latest price from Yahoo Finance, and stores the results in MySQL.
Per-ticker failures are recorded in ``price_update_errors`` and never abort the
full run. The script is safe to run before the portfolio/watchlist tables exist.

Run standalone:
    DB_HOST=localhost DB_PORT=3306 DB_NAME=... DB_USER=... DB_PASSWORD=... \\
        python3 batch/update_prices.py
"""

import logging
import os
import sys
from datetime import datetime, timezone

import mysql.connector
import yfinance as yf
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
)
logger = logging.getLogger("update_prices")

TICKER_QUERY = (
    "SELECT DISTINCT ticker FROM portfolio_positions "
    "UNION SELECT DISTINCT ticker FROM watchlist_items"
)


class FatalConfigError(RuntimeError):
    """Raised for unrecoverable configuration problems (→ exit code 1)."""


def db_config() -> dict:
    """Build the MySQL connection config from environment variables."""
    host = os.environ.get("DB_HOST")
    name = os.environ.get("DB_NAME")
    user = os.environ.get("DB_USER")
    if not host or not name or not user:
        raise FatalConfigError(
            "Missing required DB config: DB_HOST, DB_NAME and DB_USER must be set"
        )
    return {
        "host": host,
        "port": int(os.environ.get("DB_PORT", "3306")),
        "database": name,
        "user": user,
        "password": os.environ.get("DB_PASSWORD", ""),
    }


def connect():
    """Open a MySQL connection. Raises on failure (→ exit code 1)."""
    return mysql.connector.connect(**db_config())


def override_tickers() -> list[str] | None:
    """Return tickers from OVERRIDE_TICKERS env var, or None if unset."""
    raw = os.environ.get("OVERRIDE_TICKERS")
    if not raw:
        return None
    return [t.strip().upper() for t in raw.split(",") if t.strip()]


def fetch_tickers(conn) -> list[str]:
    """Return distinct tracked tickers.

    Honors OVERRIDE_TICKERS. Returns an empty list (logged) when the
    portfolio/watchlist tables do not exist yet.
    """
    override = override_tickers()
    if override is not None:
        logger.info("Using OVERRIDE_TICKERS: %s", override)
        return override

    cursor = conn.cursor()
    try:
        cursor.execute(TICKER_QUERY)
        return [row[0] for row in cursor.fetchall()]
    except mysql.connector.Error as exc:
        # 1146 = ER_NO_SUCH_TABLE — portfolio/watchlist features not built yet.
        logger.info(
            "Ticker source tables not available (%s); nothing to update.", exc
        )
        return []
    finally:
        cursor.close()


def _bulk_prices(tickers: list[str]) -> dict[str, float]:
    """Fetch prices for all tickers in a single yfinance call."""
    if not tickers:
        return {}
    data = yf.download(tickers, period="1d", auto_adjust=True)
    prices: dict[str, float] = {}
    if data is None or getattr(data, "empty", True):
        return prices

    close = data["Close"]
    for ticker in tickers:
        try:
            if len(tickers) == 1:
                series = close
            else:
                series = close[ticker]
            value = series.dropna()
            if not value.empty:
                prices[ticker] = float(value.iloc[-1])
        except (KeyError, IndexError, ValueError):
            continue
    return prices


def _single_price(ticker: str) -> float:
    """Fallback: fetch one ticker's last price via fast_info."""
    return float(yf.Ticker(ticker).fast_info["lastPrice"])


def record_success(conn, ticker: str, price: float) -> None:
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO stock_prices (ticker, price, fetched_at) VALUES (%s, %s, %s)",
            (ticker, price, datetime.now(timezone.utc)),
        )
    finally:
        cursor.close()


def record_error(conn, ticker: str, message: str) -> None:
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO price_update_errors (ticker, error_message, occurred_at) "
            "VALUES (%s, %s, %s)",
            (ticker, message, datetime.now(timezone.utc)),
        )
    finally:
        cursor.close()


def run(tickers: list[str] | None = None) -> None:
    """Run the batch. ``tickers`` overrides the DB lookup when provided."""
    conn = connect()
    try:
        if tickers is None:
            tickers = fetch_tickers(conn)

        if not tickers:
            logger.info("No tickers to update; exiting cleanly.")
            return

        bulk = _bulk_prices(tickers)
        succeeded = 0
        failed = 0

        for ticker in tickers:
            try:
                price = bulk.get(ticker)
                if price is None:
                    price = _single_price(ticker)
                if price is None:
                    raise ValueError("no price returned")
                record_success(conn, ticker, price)
                succeeded += 1
                logger.info("%s -> %s", ticker, price)
            except Exception as exc:  # noqa: BLE001 — per-ticker isolation
                failed += 1
                logger.warning("Failed to update %s: %s", ticker, exc)
                try:
                    record_error(conn, ticker, str(exc))
                except mysql.connector.Error as db_exc:
                    logger.error("Could not record error for %s: %s", ticker, db_exc)

        conn.commit()
        logger.info(
            "Summary: attempted=%d succeeded=%d failed=%d",
            len(tickers),
            succeeded,
            failed,
        )
    finally:
        conn.close()


def main() -> int:
    try:
        run()
        return 0
    except FatalConfigError as exc:
        logger.error("Fatal config error: %s", exc)
        return 1
    except mysql.connector.Error as exc:
        logger.error("Database connection failure: %s", exc)
        return 1


if __name__ == "__main__":
    sys.exit(main())
