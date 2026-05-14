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
docs/      # Feature specs, user stories, and Gherkin scenarios
```

Before implementing a feature, check `docs/` for its spec and acceptance criteria.

## Monorepo Structure

| Path   | Stack                                      | Port |
|--------|--------------------------------------------|------|
| `api/` | Spring Boot 4, Kotlin, Java 21, MySQL 8.4  | 8080 |
| `web/` | Next.js 16, React 19, TypeScript, Tailwind | 3000 |

## Running the Stack

**API** (from `api/`):
```bash
docker compose up --build -d    # starts MySQL on 3307 and API on 8080
```

**Web** (from `web/`):
```bash
npm run dev                     # dev server at http://localhost:3000
```

## Key Design Decisions

- P&L calculated using **average cost basis**.
- Stock prices updated via a **batch job** (Spring Batch), not real-time.
- SEC EDGAR rate limit: **10 req/s** — must be respected in all integrations.
- API is **client-agnostic** — web and mobile share the same endpoints.
- Hash routing used in the web app for Capacitor compatibility.
