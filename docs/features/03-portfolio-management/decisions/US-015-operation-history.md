# US-015 — Consultar historial de operaciones — Decisiones de implementación

> Orden de implementación: **1 de 3** (primero). Es independiente, no toca el
> read-path del portfolio y es el de menor riesgo. Establece el read-path de
> operaciones que US-017 (P&L) reutiliza conceptualmente.

## Estado de partida

Las operaciones ya se persisten y ya se cargan en el agregado de dominio:

- Tabla `operations` (migración `V4__portfolio.sql`): `id, portfolio_id, type, ticker, quantity, price, executed_at`.
- `OperationEntity` ↔ `Operation(id, type, ticker, quantity, price, executedAt)`.
- `JpaPortfolioRepository.findByUserId` ya hidrata `Portfolio.operations`.

No hace falta migración ni cambios de dominio: es puramente exponer datos existentes.

## Decisiones

- **Endpoint:** `GET /api/portfolio/operations`.
- **Orden:** por `executedAt` descendente (más reciente primero).
- **Propiedad / aislamiento:** automático. El usuario autenticado (`principal.id`)
  solo carga su propio `Portfolio`, así que solo ve sus operaciones. No se filtra
  por nada más.
- **Paginación:** ninguna para el TP (lista completa).
- **Capa de aplicación:** nuevo `GetOperationHistoryUseCase` + `GetOperationHistoryService`
  que toma `portfolio.operations`, las ordena desc y las mapea a DTO.
- **DTO de respuesta:** `OperationResponse(type, ticker, quantity, price, executedAt)`.
- **Web:** `getOperationHistory()` en `lib/api.ts` + tabla de historial en el dashboard.

## Tests

- **Unit:** orden descendente y aislamiento por usuario, contra un repo fake.
- **Integration (H2):** el endpoint devuelve las operaciones del usuario ordenadas.
- Una sola aserción por test (convención del proyecto).
