# Web — Stock Tracker

Next.js 16 frontend for the Portfolio Tracker. Talks to the Spring Boot API in `api/`.
Built as a static export so it can be wrapped by Capacitor (mobile).

## Requirements

- Node.js 22+
- pnpm (`npm install -g pnpm`)

## Dev

```bash
pnpm install   # first time only
pnpm dev       # http://localhost:3000
```

API base URL defaults to `http://localhost:8080`. Override with:

```bash
NEXT_PUBLIC_API_URL=http://other-host:8080 pnpm dev
```

## Docker (production-like)

Requires the API stack running (`docker compose up` from `api/`).

```bash
docker compose up --build   # http://localhost:3000
```

To point at a different API:

```bash
NEXT_PUBLIC_API_URL=http://api.example.com docker compose up --build
```
