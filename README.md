# Portfolio Tracker

US stock portfolio tracker for web and mobile. A single Spring Boot API serves all clients; the web app is built with Next.js and the mobile app will wrap it via Capacitor (Ionic).

University coursework — ASECA, Q1 2026.

## Repository Layout

```
api/       # Spring Boot backend (Kotlin, Java 21, MySQL 8.4)
web/       # Next.js frontend (React 19, TypeScript, Tailwind)
e2e/web/   # Cypress end-to-end tests
e2e/load/  # Locust load tests
docs/      # Feature specs, user stories, Gherkin scenarios
```

## Running the Stack

### API (`api/`)
```bash
docker compose up --build -d    # MySQL on 3307, API on 8080
```
Requires a `.env` file — copy from `.env.example`.

### Web (`web/`)
```bash
npm install
npm run dev                     # http://localhost:3000
```

### E2E tests — Cypress (`e2e/web/`)
Requires the web app and API to be running.

```bash
npm install
npm run cy:open                 # interactive Cypress GUI
npm run cy:run                  # headless (Electron by default)
npx cypress run --browser chrome --headless   # headless Chrome
```

### Load tests — Locust (`e2e/load/`)
Requires the API to be running. Targets the API via `host.docker.internal:8080`.

```bash
docker compose up               # web UI at http://localhost:8089
docker compose run --rm locust --headless -u 50 -r 5 -t 1m   # headless run
```

Flags: `-u` users, `-r` spawn rate per second, `-t` total run time.
