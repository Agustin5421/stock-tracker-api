# CLAUDE.md

## Overview

Spring Boot 4 REST API — Kotlin, Java 21, MySQL 8.4.
Serves the web app and the Capacitor mobile app.

## Commands

```bash
docker compose up --build -d    # start MySQL (3307) + API (8080)
docker compose up -d db         # start MySQL only (for host-based bootRun)
docker compose down             # stop containers
./gradlew test                  # run tests
./gradlew bootRun               # run on host (defaults to localhost:3307)
```

The docker setup requires a `.env` file — copy from `.env.example`.
`bootRun` works without env vars; defaults are baked into `application.yaml` and docker overrides them via env vars.

## Architecture

Hexagonal architecture (ports and adapters) with four layers:

```
api/                  # Driving adapters — REST controllers, request/response DTOs
                      # Delegates to application ports, no business logic here

application/          # Use case interfaces (ports in) and implementations
                      # Orchestrates domain logic, defines what the system can do

domain/               # Pure business logic — entities, value objects, domain services
                      # No framework dependencies

infrastructure/       # Driven adapters — JPA persistence, external HTTP clients
                      # (SEC EDGAR, Yahoo Finance), Spring config, Flyway migrations
```

## Code Rules

- **No business logic in DTOs** — they are data carriers only.
- **Logic belongs in services** (application/domain), not in controllers.
- **Never modify an existing Flyway migration** — always add a new one.

## Testing

- **No mock frameworks** — use hand-written simulator classes (fakes/stubs) injected via constructor.
- **Unit tests**: test domain/application logic in isolation using simulators.
- **Integration tests**: use an **in-memory database** — never mock the persistence layer.
- **One assert per test** — split if more are needed.
