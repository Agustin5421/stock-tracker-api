import os
import uuid
import random
from locust import HttpUser, task, between, LoadTestShape


CIK_POOL = [
    {"ticker": "AAPL", "cik": "320193", "name": "Apple Inc."},
    {"ticker": "MSFT", "cik": "789019", "name": "Microsoft Corp"},
    {"ticker": "AMZN", "cik": "1018724", "name": "Amazon.com Inc"},
    {"ticker": "GOOGL", "cik": "1652044", "name": "Alphabet Inc"},
    {"ticker": "TSLA", "cik": "1318605", "name": "Tesla Inc"},
    {"ticker": "META", "cik": "1326801", "name": "Meta Platforms Inc"},
    {"ticker": "NVDA", "cik": "1045810", "name": "NVIDIA Corp"},
    {"ticker": "JPM", "cik": "19617", "name": "JPMorgan Chase"},
    {"ticker": "JNJ", "cik": "200406", "name": "Johnson & Johnson"},
    {"ticker": "V", "cik": "1403161", "name": "Visa Inc"},
    {"ticker": "WMT", "cik": "104169", "name": "Walmart Inc"},
    {"ticker": "KO", "cik": "21344", "name": "Coca-Cola Co"},
    {"ticker": "NFLX", "cik": "1065280", "name": "Netflix Inc"},
    {"ticker": "INTC", "cik": "50863", "name": "Intel Corp"},
]

SEARCH_QUERIES = ["AAPL", "Apple", "MSFT", "Microsoft", "Tesla", "AMZN", "Google"]


def _register_and_login(client):
    email = f"load_{uuid.uuid4().hex[:8]}@loadtest.com"
    password = "Password123!"
    credentials = {"email": email, "password": password}
    client.post("/auth/register", json=credentials)
    r = client.post("/auth/login", json=credentials)
    if r.status_code == 200:
        token = r.json().get("token", "")
        return {"Authorization": f"Bearer {token}"}
    return {}


class PassiveInvestorUser(HttpUser):
    """Researches companies and monitors their portfolio; rarely trades. 70% of virtual users."""
    weight = 7
    wait_time = between(3, 7)

    def on_start(self):
        self.headers = _register_and_login(self.client)

    @task(5)
    def ver_portfolio(self):
        self.client.get("/api/portfolio", headers=self.headers, name="Ver portfolio")

    @task(5)
    def buscar_empresa(self):
        q = random.choice(SEARCH_QUERIES)
        self.client.get(f"/api/companies/search?q={q}", name="Buscar empresa")

    @task(4)
    def consultar_metricas(self):
        company = random.choice(CIK_POOL)
        self.client.get(f"/api/companies/{company['cik']}/metrics", name="Métricas empresa")

    @task(4)
    def consultar_filings(self):
        company = random.choice(CIK_POOL)
        self.client.get(f"/api/companies/{company['cik']}/filings", name="Filings empresa")

    @task(3)
    def ver_watchlist(self):
        self.client.get("/api/watchlist", headers=self.headers, name="Ver watchlist")

    @task(2)
    def gestionar_watchlist(self):
        company = random.choice(CIK_POOL)
        self.client.post(
            "/api/watchlist",
            json={"ticker": company["ticker"], "name": company["name"], "cik": company["cik"]},
            headers=self.headers,
            name="Agregar watchlist",
        )
        self.client.delete(
            f"/api/watchlist/{company['ticker']}",
            headers=self.headers,
            name="Eliminar watchlist",
        )

    @task(1)
    def comprar_accion(self):
        company = random.choice(CIK_POOL)
        self.client.post(
            "/api/portfolio/purchases",
            json={"ticker": company["ticker"], "quantity": 1},
            headers=self.headers,
            name="Comprar acción",
        )


class ActiveTraderUser(HttpUser):
    """Trades frequently and monitors operation history constantly. 30% of virtual users."""
    weight = 3
    wait_time = between(4, 8)

    def on_start(self):
        self.headers = _register_and_login(self.client)
        self.owned_tickers = []

    @task(5)
    def comprar_accion(self):
        company = random.choice(CIK_POOL)
        r = self.client.post(
            "/api/portfolio/purchases",
            json={"ticker": company["ticker"], "quantity": random.randint(1, 5)},
            headers=self.headers,
            name="Comprar acción",
        )
        if r.status_code == 201 and company["ticker"] not in self.owned_tickers:
            self.owned_tickers.append(company["ticker"])

    @task(4)
    def vender_accion(self):
        if not self.owned_tickers:
            return
        ticker = random.choice(self.owned_tickers)
        r = self.client.post(
            "/api/portfolio/sales",
            json={"ticker": ticker, "quantity": 1},
            headers=self.headers,
            name="Vender acción",
        )
        if r.status_code == 200 and r.json().get("quantity", 1) == 0:
            self.owned_tickers.remove(ticker)

    @task(4)
    def ver_portfolio(self):
        self.client.get("/api/portfolio", headers=self.headers, name="Ver portfolio")

    @task(3)
    def ver_historial(self):
        self.client.get("/api/portfolio/operations", headers=self.headers, name="Historial operaciones")

    @task(2)
    def buscar_empresa(self):
        q = random.choice(SEARCH_QUERIES)
        self.client.get(f"/api/companies/search?q={q}", name="Buscar empresa")

    @task(1)
    def consultar_metricas(self):
        company = random.choice(CIK_POOL)
        self.client.get(f"/api/companies/{company['cik']}/metrics", name="Métricas empresa")


class PortfolioLoadShape(LoadTestShape):
    """
    TEST_TYPE=load          (default): ramp to 50 users at 5/s, hold for 5 minutes.
    TEST_TYPE=stress        : step +10 users every 15s up to 200 (~36 req/s), ~5 minutes.
    TEST_TYPE=stress_extreme: step +25 users every 15s up to 500 (~90 req/s), ~5 minutes.
    """
    TEST_TYPE = os.environ.get("TEST_TYPE", "load")

    LOAD_USERS = 50
    LOAD_SPAWN_RATE = 5
    LOAD_DURATION = 300  # 10s ramp + 290s plateau

    STRESS_STEP_USERS = 10
    STRESS_STEP_DURATION = 15
    STRESS_SPAWN_RATE = 10
    STRESS_MAX_USERS = 200

    EXTREME_STEP_USERS = 25
    EXTREME_STEP_DURATION = 15
    EXTREME_SPAWN_RATE = 25
    EXTREME_MAX_USERS = 500

    def tick(self):
        run_time = self.get_run_time()
        if self.TEST_TYPE == "load":
            if run_time > self.LOAD_DURATION:
                return None
            return (self.LOAD_USERS, self.LOAD_SPAWN_RATE)
        elif self.TEST_TYPE == "stress":
            step = int(run_time / self.STRESS_STEP_DURATION)
            users = (step + 1) * self.STRESS_STEP_USERS
            if users > self.STRESS_MAX_USERS:
                return None
            return (users, self.STRESS_SPAWN_RATE)
        else:  # stress_extreme
            step = int(run_time / self.EXTREME_STEP_DURATION)
            users = (step + 1) * self.EXTREME_STEP_USERS
            if users > self.EXTREME_MAX_USERS:
                return None
            return (users, self.EXTREME_SPAWN_RATE)
