# CLAUDE.md

## Overview

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4. UI primitives from shadcn/ui (Radix under the hood). Talks to the Spring Boot API in `api/`.

Will be wrapped by Capacitor (Ionic) for the mobile app — design constraints flow from that.

## Commands

```bash
pnpm install        # first time only (also wires up git hooks via `prepare`)
pnpm dev            # http://localhost:3000
pnpm build          # production build
pnpm start          # serve the build
pnpm lint           # eslint (flat config, extends next/core-web-vitals + prettier)
pnpm format         # prettier --write .
pnpm format:check   # prettier --check . (used by hooks/CI)
```

Linting uses ESLint with `eslint-config-next` as flat config. Formatting is prettier (`.prettierrc.json`); `eslint-config-prettier` is loaded so the two don't fight. The pre-commit hook runs both `pnpm lint` and `pnpm format:check`.

API base URL is `http://localhost:8080` by default; override with `NEXT_PUBLIC_API_URL`.

## Layout

```
app/                  # Next.js App Router entry — only one page (see Routing below)
components/
  auth/               # login, register, auth shell
  home/               # home view
  ui/                 # shadcn primitives (do not edit by hand — re-generate)
hooks/                # shared React hooks
lib/
  api.ts              # fetch client + DTOs + token helpers
  routing.ts          # hash-based route helpers
  auth-schema.ts      # zod schemas for forms
  utils.ts            # cn() and friends
styles/               # global Tailwind layer
```

## Conventions

- **Hash routing, not Next.js routing.** `app/page.tsx` is the only page; it reads `window.location.hash` and renders the matching view (`#/login`, `#/register`, `#/home`). This exists so the same build runs inside Capacitor, which can't do server-side routing. Don't add files under `app/` for new routes — add a view in `components/<feature>/` and register it in `app/page.tsx`.
- **API client lives in `lib/api.ts`.** All HTTP calls go through `request<T>()`; errors are normalized to `Error(message)` using the API's `{ error }` payload. Don't `fetch()` directly from components.
- **Auth token** is stored in `localStorage` under `pt_token` via `saveToken/getToken/clearToken`. The home route guards itself in `app/page.tsx` by checking `getToken()`.
- **Forms** use `react-hook-form` + `zod` (schemas in `lib/auth-schema.ts`).
- **UI copy is in Spanish** — match existing tone when adding strings (Cypress assertions also expect Spanish copy).
- **shadcn components** live in `components/ui/` and are generated, not handwritten. Customize via props/classNames; if a component needs structural changes, re-add it with `pnpm dlx shadcn@latest add <name>` and re-apply.

## Testing

No unit/component tests yet. The pre-push hook runs `pnpm build` as a smoke test (catches type errors and broken pages). End-to-end coverage lives in `e2e/web/` (Cypress).
