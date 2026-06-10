# Kiwii Portfolio Tracker — Estado del Proyecto

**Materia:** ASECA — Q1 2026  
**Deadline:** 18 de junio de 2026  
**Stack:** Spring Boot 4 · Kotlin · Java 21 · MySQL 8.4 · Next.js 16 · React 19 · TypeScript · Tailwind

---

## Descripción General

Aplicación web (y futura móvil) para que un inversor consulte información financiera de empresas estadounidenses. El backend expone una REST API única que consume datos de SEC EDGAR (la base de datos pública de la SEC). El frontend Next.js consume esa API. El mismo build web se empaquetará con Capacitor (Ionic) para la versión móvil.

---

## Funcionalidades Implementadas

### User Stories entregadas

| ID | Historia | Estado |
|----|----------|--------|
| US-001 | Crear cuenta con mail y contraseña | ✅ Completo |
| US-002 | Iniciar sesión | ✅ Completo |
| US-003 | Cerrar sesión | ✅ Completo |
| US-004 | Buscar empresa por nombre o ticker | ✅ Completo |
| US-005 | Consultar métricas financieras clave (snapshot) | ✅ Completo |
| US-006 | Consultar filings recientes (10-K / 10-Q) | ✅ Completo |
| US-007 | Evolución histórica de métricas por quarter | ✅ Completo |

### API REST — Endpoints disponibles

```
POST   /auth/register                              Registrar usuario
POST   /auth/login                                 Iniciar sesión → JWT
GET    /api/companies/search?q=                    Buscar empresas
GET    /api/companies/{cik}/metrics                Métricas snapshot (último 10-K)
GET    /api/companies/{cik}/metrics/historical?metric=  Historial de una métrica (hasta 8 quarters)
GET    /api/companies/{cik}/filings                Filings recientes (10-K y 10-Q)
GET    /user/me                                    Perfil del usuario autenticado
```

Para `metric` se acepta: `revenue`, `netIncome`, `eps`, `totalAssets`, `totalLiabilities`.

### Frontend (web/)

- **Dashboard** con búsqueda de empresas en tiempo real (debounce 300ms, paginación cliente-side)
- **Panel de detalle** con tres pestañas por empresa:
  - *Métricas Financieras* — snapshot de la última presentación anual (10-K)
  - *Filings Recientes* — lista los últimos 10-K y 10-Q
  - *Histórico* — gráfico de barras con hasta 8 quarters de una métrica seleccionable
- **Autenticación** completa: registro, login, logout, guard de rutas
- **Hash routing** (`#/login`, `#/register`, `#/home`) para compatibilidad futura con Capacitor

---

## Arquitectura del Backend

El backend implementa **arquitectura hexagonal** (ports & adapters) con cuatro capas claramente separadas:

```
┌─────────────────────────────────────────────────────────┐
│  API (Driving Adapters)                                  │
│  Controllers + DTOs · Solo delegan, sin lógica          │
├─────────────────────────────────────────────────────────┤
│  Application (Use Cases)                                 │
│  Interfaces de puerto + implementaciones de servicios   │
│  Orquesta lógica de dominio                             │
├─────────────────────────────────────────────────────────┤
│  Domain                                                  │
│  Entidades, Value Objects, servicios de dominio         │
│  Sin dependencias de frameworks                         │
├─────────────────────────────────────────────────────────┤
│  Infrastructure (Driven Adapters)                        │
│  JPA · EdgarClient (HTTP) · JWT · BCrypt · Flyway       │
└─────────────────────────────────────────────────────────┘
```

**Flujo de ejemplo — búsqueda histórica de métricas:**

```
HTTP GET /api/companies/320193/metrics/historical?metric=revenue
  → CompanyMetricsController
    → GetHistoricalMetricsService (application)
      → EdgarPort.getHistoricalMetrics() (interface)
        → EdgarClient (infrastructure) — llama a SEC EDGAR
          → https://data.sec.gov/api/xbrl/companyfacts/CIK0000320193.json
          → filtra 10-K + 10-Q, deduplica por fecha, toma los 8 más recientes
        → List<MetricDataPoint> hacia arriba
  → [{ period: "2024-09-28", value: 94930000000 }, ...]
```

### Decisiones de diseño clave

- **P&L por average cost basis** (preparado para portfolio tracking)
- **Rate limiting a SEC EDGAR**: máximo 10 req/s implementado en `EdgarClient` con sliding window
- **Flyway** para migraciones de base de datos (nunca se modifica una migración existente)
- **JWT** para autenticación stateless; token almacenado en `localStorage` del frontend bajo clave `pt_token`
- **Hash routing** en frontend para que el mismo build sirva en web y en Capacitor (sin server-side routing)

---

## Estrategia de Testing

El proyecto tiene **tres capas de tests independientes** que cubren distintos niveles de la aplicación.

### Números

| Capa | Cantidad de tests |
|------|-------------------|
| Unit tests (API) | ~55 |
| Integration tests (API) | ~41 |
| E2E Cypress (full stack) | 27 |
| **Total** | **~123** |

---

### Capa 1 — Unit Tests

**Ubicación:** `api/src/test/.../unit/`  
**Ejecutar:** `./gradlew unitTest`

Los unit tests verifican la **lógica de negocio** de los servicios y los value objects del dominio, completamente aislados de frameworks, base de datos y HTTP.

#### ¿Cómo se aísla la lógica?

No se usa ningún framework de mocking (Mockito, MockK, etc.). En su lugar, se escriben **fakes a mano** que implementan los mismos puertos (interfaces) que usa la aplicación real:

```kotlin
// Fake del repositorio — implementación en memoria para tests
class InMemoryUserRepository : UserRepository {
    private val store = mutableMapOf<String, User>()

    override fun save(user: User): User { store[user.email.value] = user; return user }
    override fun findByEmail(email: Email): User? = store[email.value]
    override fun existsByEmail(email: Email): Boolean = store.containsKey(email.value)
}

// Fake del hasher — devuelve un string predecible para tests
class FakePasswordHasher : PasswordHasher {
    override fun hash(plain: String): String = "hashed:$plain"
    override fun matches(plain: String, hash: String): Boolean = hash == "hashed:$plain"
}
```

El servicio se construye inyectando los fakes directamente en el constructor — igual que en producción, pero con implementaciones controladas:

```kotlin
class RegisterUserServiceTest {
    private fun service() = RegisterUserService(InMemoryUserRepository(), FakePasswordHasher())

    @Test
    fun registerReturnsNonNullUUID() {
        val id = service().register("user@example.com", "ValidP@ss1")
        assertNotNull(id)
    }

    @Test
    fun registerWithDuplicateEmailThrows() {
        val svc = service()
        svc.register("user@example.com", "ValidP@ss1")
        assertThrows<IllegalArgumentException> {
            svc.register("user@example.com", "AnotherP@ss1")
        }
    }
}
```

#### Fakes disponibles

| Fake | Reemplaza a | Usa en |
|------|-------------|--------|
| `InMemoryUserRepository` | `JpaUserRepository` | Tests de auth |
| `FakePasswordHasher` | `BCryptPasswordHasher` | Tests de auth |
| `FixedTokenService` | `JwtTokenService` | Tests de auth |
| `FakeEdgarPort` | `EdgarClient` | Tests de company |

El `FakeEdgarPort` es especialmente rico: tiene campos configurables por test para controlar exactamente qué retorna o qué excepción lanza:

```kotlin
class FakeEdgarPort : EdgarPort {
    var metricsResult: CompanyMetrics? = null
    var metricsThrowsNotFound: Boolean = false
    var historicalResult: List<MetricDataPoint> = emptyList()
    var historicalThrowsNotFound: Boolean = false
    var historicalThrowsUnavailable: Boolean = false
    // ...

    override fun getHistoricalMetrics(cik: String, metric: MetricType): List<MetricDataPoint> =
        when {
            historicalThrowsNotFound -> throw CompanyNotFoundException(cik)
            historicalThrowsUnavailable -> throw EdgarUnavailableException("EDGAR unavailable")
            else -> historicalResult
        }
}
```

#### Reglas de los unit tests

- **Un assert por test** — si hay que verificar más de una cosa, se divide en tests separados
- **Tests de dominio puro:** `EmailTest`, `PasswordTest` — verifican las invariantes de los value objects (formato de email, complejidad de contraseña) sin ningún framework

```kotlin
// EmailTest.kt — verifica el value object Email del dominio
@Test
fun emailIsStoredLowercased() {
    val email = Email("User@Example.COM")
    assertEquals("user@example.com", email.value)
}

@Test
fun emailWithoutAtSignThrows() {
    assertThrows<IllegalArgumentException> { Email("userexample.com") }
}
```

---

### Capa 2 — Integration Tests

**Ubicación:** `api/src/test/.../integration/`  
**Ejecutar:** `./gradlew test` (incluye unit + integration)

Los integration tests verifican el **contrato HTTP completo** de cada endpoint: status codes, estructura del JSON de respuesta, manejo de errores. Levantan el contexto completo de Spring pero reemplazan los adaptadores externos por fakes.

#### Infraestructura de base de datos

Los tests de integración levantan un **contenedor Docker real de MySQL 8.4** usando **Testcontainers**. No se usa H2 ni base de datos en memoria — el mismo motor que producción:

```kotlin
@TestConfiguration(proxyBeanMethods = false)
class TestcontainersConfiguration {
    @Bean
    @ServiceConnection
    fun mysqlContainer(): MySQLContainer =
        MySQLContainer(DockerImageName.parse("mysql:8.4"))
}
```

`@ServiceConnection` inyecta automáticamente las credenciales del contenedor en el datasource de Spring. Flyway corre las migraciones reales sobre ese contenedor en cada ejecución.

#### Reemplazo del cliente de EDGAR

Los tests de integración no llaman a SEC EDGAR — se inyecta un `FakeEdgarPort` via `@TestConfiguration`:

```kotlin
@TestConfiguration
class FakeEdgarPortConfig {
    @Bean @Primary
    fun fakeEdgarPort(): FakeEdgarPort = FakeEdgarPort()
}
```

Cada test configura el fake en el `@BeforeEach` y lo resetea después:

```kotlin
@SpringBootTest
@AutoConfigureMockMvc
@Import(FakeEdgarPortConfig::class)
class CompanyHistoricalMetricsIntegrationTest {
    @Autowired private lateinit var mockMvc: MockMvc
    @Autowired private lateinit var fakeEdgar: FakeEdgarPort

    @BeforeEach
    fun reset() {
        fakeEdgar.historicalResult = emptyList()
        fakeEdgar.historicalThrowsNotFound = false
        fakeEdgar.historicalThrowsUnavailable = false
    }

    @Test
    fun getHistoricalMetricsReturns200() {
        fakeEdgar.historicalResult = listOf(
            MetricDataPoint("2023-09-30", BigDecimal("89498000000"))
        )
        mockMvc.perform(get("/api/companies/320193/metrics/historical").param("metric", "revenue"))
               .andExpect(status().isOk)
    }

    @Test
    fun returns400ForUnknownMetric() {
        mockMvc.perform(get("/api/companies/320193/metrics/historical").param("metric", "unknownMetric"))
               .andExpect(status().isBadRequest)
    }

    @Test
    fun returns404WhenCompanyNotFound() {
        fakeEdgar.historicalThrowsNotFound = true
        mockMvc.perform(get("/api/companies/999999/metrics/historical").param("metric", "revenue"))
               .andExpect(status().isNotFound)
    }
}
```

Los tests de auth (`AuthIntegrationTest`) no usan ningún fake — ejercen el stack completo incluyendo BCrypt, JWT y MySQL:

```kotlin
@Test
fun loginAfterRegisterReturnsNonBlankToken() {
    val email = "tokentest@example.com"
    mockMvc.perform(post("/auth/register").contentType(APPLICATION_JSON).content(registerJson(email, "ValidP@ss1")))
    mockMvc.perform(post("/auth/login").contentType(APPLICATION_JSON).content(registerJson(email, "ValidP@ss1")))
           .andExpect(jsonPath("$.token").isNotEmpty)
}
```

#### Archivos de integration test

| Archivo | Tests | Cubre |
|---------|-------|-------|
| `AuthIntegrationTest` | 12 | Registro, login, errores de credenciales |
| `CompanySearchIntegrationTest` | 8 | Búsqueda por ticker/nombre, respuesta vacía |
| `CompanyMetricsIntegrationTest` | 9 | Métricas snapshot, nulos, 404, 500 |
| `CompanyFilingsIntegrationTest` | 6 | Filings, 404, 503 |
| `CompanyHistoricalMetricsIntegrationTest` | 7 | Histórico, 400/404/503, array vacío |
| `UserIntegrationTest` | 4 | Endpoint /user/me con JWT |

---

### Capa 3 — End-to-End (Cypress)

**Ubicación:** `e2e/web/cypress/e2e/`  
**Ejecutar:** `npm run cy:run` (desde `e2e/web/`, requiere web + API corriendo)

Los tests E2E ejercen la **aplicación completa** — frontend real en un browser (Electron/Chrome), llamando a la API real, que llama a SEC EDGAR real. No hay mocks ni stubs en esta capa.

#### Patrón de autenticación

Cada suite crea un usuario único por ejecución para evitar colisiones entre tests:

```typescript
beforeEach(() => {
  const email = `historical_${Date.now()}@example.com`
  const password = 'Password123!'

  // Registro directo vía API (no por UI) — más rápido y determinista
  cy.request('POST', `${Cypress.env('apiUrl')}/auth/register`, { email, password })

  // Login por UI (verifica el flujo real del usuario)
  cy.visit('/#/login')
  cy.get('input[type="email"]').type(email)
  cy.get('input[type="password"]').type(password)
  cy.contains('button[type="submit"]', 'Iniciar sesion').click()
  cy.location('hash').should('eq', '#/home')
})
```

#### Selectores — data-testid

Todos los selectores usan atributos `data-testid` para desacoplar los tests de los estilos y el markup:

```typescript
cy.get('[data-testid="company-search-input"]').type('AAPL')
cy.get('[data-testid="company-result-320193"]', { timeout: 10000 }).should('be.visible').click()
cy.get('[data-testid="company-historical-metrics-content"]', { timeout: 20000 }).should('be.visible')
```

Los timeouts son explícitos:
- **10 segundos** para búsquedas (filtrando la lista cacheada)
- **20 segundos** para datos de EDGAR (llamada HTTP externa real)

#### Specs disponibles

| Archivo | Tests | Cubre |
|---------|-------|-------|
| `user-access.cy.ts` | 5 | Registro, login, logout, guard de rutas, persistencia |
| `company-search.cy.ts` | 7 | Búsqueda por ticker/nombre, vacío, paginación |
| `company-metrics.cy.ts` | 5 | Panel de métricas, etiquetas, valores numéricos, deselección |
| `company-filings.cy.ts` | 5 | Panel de filings, tipos, deselección |
| `company-historical-metrics.cy.ts` | 5 | Tab histórico, gráfico, cambio de métrica, deselección |

#### Ejemplo completo de test E2E

```typescript
// company-historical-metrics.cy.ts
it('Cambiar métrica actualiza el gráfico', () => {
  cy.get('[data-testid="company-search-input"]').type('AAPL')
  cy.get('[data-testid="company-result-320193"]', { timeout: 10000 }).should('be.visible').click()
  cy.contains('Histórico').click()
  cy.get('[data-testid="company-historical-metrics-content"]', { timeout: 20000 }).should('be.visible')

  // Cambiar de "Ingresos" a "Utilidad Neta"
  cy.get('[data-testid="company-historical-metrics-selector"]').click()
  cy.contains('Utilidad Neta').click()

  // El gráfico debe actualizarse con los nuevos datos
  cy.get('[data-testid="company-historical-metrics-content"]', { timeout: 20000 }).should('be.visible')
})
```

---

## Flujo Completo de TDD Aplicado

Para US-007, el desarrollo siguió el ciclo **red → green → refactor** de forma estricta, una prueba a la vez (no se escribieron todos los tests de golpe):

```
1. RED:   GetHistoricalMetricsServiceTest.returnsDataPointsWhenEdgarReturnsHistory
          → No compila: GetHistoricalMetricsService no existe

2. GREEN: Se crea GetHistoricalMetricsService, GetHistoricalMetricsUseCase, EdgarPort.getHistoricalMetrics()
          → Test pasa

3. RED:   GetHistoricalMetricsServiceTest.returnsEmptyListWhenEdgarReturnsNoData
          → Falla: el caso "sin datos" no estaba cubierto

4. GREEN: El servicio delega directamente al port, que retorna lista vacía
          → Test pasa

5. RED:   CompanyHistoricalMetricsIntegrationTest.getHistoricalMetricsReturns200
          → Falla: el controlador no existe

6. GREEN: Se agrega el endpoint a CompanyMetricsController
          → Test pasa

7. (continúa para los 7 tests de integración...)

8. REFACTOR: Se extrajo loadCompanyFacts() como helper compartido entre
             getMetrics() y getHistoricalMetrics() en EdgarClient
             → Todos los tests siguen en verde
```

---

## Cómo Correr Todo

```bash
# API — todos los tests
cd api && ./gradlew test

# API — solo unit tests (sin Docker)
cd api && ./gradlew unitTest

# API — un test específico
cd api && ./gradlew test --tests "*.GetHistoricalMetricsServiceTest"

# Frontend — build (verifica tipos TypeScript)
cd web && pnpm build

# E2E — requiere API en :8080 y web en :3000
cd e2e/web && npm run cy:run
cd e2e/web && npx cypress run --spec "cypress/e2e/company-historical-metrics.cy.ts"
```

---

## CI / CD

GitHub Actions (`.github/workflows/ci.yml`) corre en cada PR y push a `main`/`dev`:

| Job | Qué corre |
|-----|-----------|
| `api-lint` | `./gradlew ktlintCheck` |
| `api-tests` | `./gradlew test` (unit + integration con Testcontainers) |
| `web-lint` | `pnpm lint` + `pnpm format:check` |
| `web-build` | `pnpm build` (type check incluido) |
| `e2e-cypress` | Tests E2E con Chrome headless |

Los git hooks locales (`.githooks/`) previenen pushes rotos: `pre-commit` corre lint+format, `pre-push` corre `unitTest` en la API y `pnpm build` en el frontend.


