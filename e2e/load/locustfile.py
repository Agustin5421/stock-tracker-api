import uuid
from locust import HttpUser, task, between


class UsuarioInversor(HttpUser):
    wait_time = between(1, 3)
    host = "http://localhost:8080"

    def on_start(self):
        email = f"loadtest_{uuid.uuid4().hex[:8]}@example.com"
        password = "Password123!"
        self.credentials = {"email": email, "password": password}

        self.client.post("/auth/register", json=self.credentials)

        response = self.client.post("/auth/login", json=self.credentials)
        if response.status_code == 200:
            token = response.json().get("token", "")
            self.headers = {"Authorization": f"Bearer {token}"}
        else:
            self.headers = {}

    @task(3)
    def iniciar_sesion(self):
        self.client.post("/auth/login", json=self.credentials, name="Inicio de sesión")

    @task(1)
    def registrar_usuario(self):
        email = f"loadtest_{uuid.uuid4().hex[:8]}@example.com"
        self.client.post(
            "/auth/register",
            json={"email": email, "password": "Password123!"},
            name="Registro de usuario",
        )

    @task(5)
    def buscar_empresa_por_ticker(self):
        self.client.get("/api/companies/search?q=AAPL", name="Búsqueda por ticker")

    @task(3)
    def buscar_empresa_por_nombre(self):
        self.client.get("/api/companies/search?q=Apple", name="Búsqueda por nombre")

    @task(4)
    def consultar_metricas_financieras(self):
        self.client.get("/api/companies/320193/metrics", name="Métricas financieras")

    @task(4)
    def consultar_filings_recientes(self):
        self.client.get("/api/companies/320193/filings", name="Filings recientes")
