# CLAUDE.md

## Project Overview

US stock portfolio tracker for web and mobile. University coursework (ASECA, Q1 2026).
Deadline: June 18, 2026.

A single API serves all clients. The web app is in `web/`, the backend in `api/`.
The mobile app will be built with Capacitor (Ionic), wrapping the web app.

## Repository Layout

```
api/       # Spring Boot backend
web/       # Next.js frontend
e2e/web/   # Cypress end-to-end tests
e2e/load/  # Locust load tests
docs/      # Feature specs, user stories, and Gherkin scenarios
```

Before implementing a feature, check `docs/` for its spec and acceptance criteria.

## Monorepo Structure

| Path   | Stack                                      | Port |
|--------|--------------------------------------------|------|
| `api/` | Spring Boot 4, Kotlin, Java 21, MySQL 8.4  | 8080 |
| `web/` | Next.js 16, React 19, TypeScript, Tailwind | 3000 |

## Running the Stack

**API** (from `api/`) — full stack in docker:
```bash
docker compose up --build -d    # starts MySQL on 3307 and API on 8080
```

**API** (from `api/`) — db in docker, app on host:
```bash
docker compose up -d db         # MySQL on 3307
./gradlew bootRun               # API on 8080, connects to localhost:3307
```

**Web** (from `web/`):
```bash
pnpm install                    # first time only
pnpm dev                        # dev server at http://localhost:3000
```

**E2E tests — Cypress** (from `e2e/web/`, requires web + API running):
```bash
npm install
npm run cy:open                 # interactive Cypress GUI
npm run cy:run                  # headless (Electron by default)
npx cypress run --browser chrome --headless   # headless Chrome
```

**Load tests — Locust** (from `e2e/load/`, requires API running):
```bash
docker compose up               # UI at http://localhost:8089
docker compose run --rm locust --headless -u 50 -r 5 -t 1m   # headless run
```

## Key Design Decisions

- P&L calculated using **average cost basis**.
- Stock prices updated via a **batch job** (Spring Batch), not real-time.
- SEC EDGAR rate limit: **10 req/s** — must be respected in all integrations.
- API is **client-agnostic** — web and mobile share the same endpoints.
- Hash routing used in the web app for Capacitor compatibility.
