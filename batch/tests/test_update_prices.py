"""Unit tests for the price update batch.

yfinance, mysql-connector-python and python-dotenv are stubbed in sys.modules
before importing the module under test, so the suite runs without installing the
heavy real dependencies. Each test patches the stubbed yfinance entry points.
"""

import sys
import types
from unittest import mock

# --- Stub external dependencies before importing the module under test --------
_yf_stub = types.ModuleType("yfinance")
_yf_stub.download = mock.MagicMock()
_yf_stub.Ticker = mock.MagicMock()
sys.modules["yfinance"] = _yf_stub

_mysql_stub = types.ModuleType("mysql")
_connector_stub = types.ModuleType("mysql.connector")


class _Error(Exception):
    pass


_connector_stub.Error = _Error
_connector_stub.connect = mock.MagicMock()
_mysql_stub.connector = _connector_stub
sys.modules["mysql"] = _mysql_stub
sys.modules["mysql.connector"] = _connector_stub

_dotenv_stub = types.ModuleType("dotenv")
_dotenv_stub.load_dotenv = lambda *a, **k: None
sys.modules["dotenv"] = _dotenv_stub

from batch import update_prices as up  # noqa: E402


class FakeCursor:
    def __init__(self, statements):
        self._statements = statements

    def execute(self, sql, params=None):
        self._statements.append((sql, params))

    def fetchall(self):
        return []

    def close(self):
        pass


class FakeConn:
    def __init__(self):
        self.statements = []
        self.committed = False

    def cursor(self):
        return FakeCursor(self.statements)

    def commit(self):
        self.committed = True

    def close(self):
        pass


def _inserts_into(conn, table):
    return [sql for sql, _ in conn.statements if table in sql]


def test_successful_fetch_inserts_price():
    conn = FakeConn()
    ticker_obj = mock.Mock()
    ticker_obj.fast_info = {"lastPrice": 189.42}
    with mock.patch.object(up, "connect", return_value=conn), mock.patch.object(
        up.yf, "download", return_value=mock.MagicMock()
    ), mock.patch.object(up.yf, "Ticker", return_value=ticker_obj):
        up.run(["AAPL"])

    assert len(_inserts_into(conn, "stock_prices")) == 1


def test_no_price_records_error_and_continues():
    conn = FakeConn()
    ticker_obj = mock.Mock()
    ticker_obj.fast_info = {}  # ["lastPrice"] raises KeyError
    with mock.patch.object(up, "connect", return_value=conn), mock.patch.object(
        up.yf, "download", return_value=mock.MagicMock()
    ), mock.patch.object(up.yf, "Ticker", return_value=ticker_obj):
        up.run(["AAPL"])

    assert len(_inserts_into(conn, "price_update_errors")) == 1


def test_yfinance_exception_records_error():
    conn = FakeConn()
    with mock.patch.object(up, "connect", return_value=conn), mock.patch.object(
        up.yf, "download", return_value=mock.MagicMock()
    ), mock.patch.object(up.yf, "Ticker", side_effect=RuntimeError("boom")):
        up.run(["AAPL"])

    assert len(_inserts_into(conn, "price_update_errors")) == 1


def test_empty_ticker_list_skips_yfinance():
    conn = FakeConn()
    with mock.patch.object(up, "connect", return_value=conn), mock.patch.object(
        up.yf, "download"
    ) as download:
        up.run([])

    assert download.call_count == 0
