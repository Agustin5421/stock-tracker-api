# US-017 — Consultar ganancia o pérdida por posición — Decisiones de implementación

> Orden de implementación: **3 de 3** (último). Es el de mayor riesgo, y para
> cuando se implemente el read-path del portfolio ya está ejercitado por US-016.
> Reutiliza las operaciones que US-015 ya expone.

## Estado de partida

- `Position(id, ticker, quantity)` — **no** guarda cost basis.
- `Operation` lleva `price` y ya está cargada en el agregado `Portfolio`.
- `GetPortfolioService` ya hidrata el `Portfolio` completo y arma `PositionView`.

## Decisión raíz: cost basis derivado, no persistido

El cost basis se **deriva replayeando las operaciones en read time** — no se persiste
en `Position`.

- Operaciones = única fuente de verdad. P&L es un valor derivado.
- Evita duplicar `Operation.price`, evita migración y evita tocar el write-path de
  buy/sell (y sus tests existentes).

## Estrategia: costo promedio ponderado (weighted average cost)

Replay cronológico por ticker:

```
qty = 0; totalCost = 0
for op in ops-del-ticker ordenadas por executedAt asc:
    BUY:  qty += op.qty;  totalCost += op.qty * op.price
    SELL: totalCost -= op.qty * avgCostActual   // saca acciones al promedio vigente
          qty       -= op.qty
avgCost = qty > 0 ? totalCost / qty : undefined
```

- **BUY** aumenta cantidad y costo total.
- **SELL** reduce la cantidad pero **deja el costo promedio sin cambios** para las
  acciones restantes.

### Reglas de borde (confirmadas)

1. **Vendida del todo y recomprada:** al llegar `qty` a 0, `totalCost` vuelve a 0,
   así que un BUY posterior arranca un promedio nuevo (se resetea el basis).
2. **Solo P&L no realizada:** `currentQty × (latestPrice − avgCost)`. No se expone
   P&L realizada de ventas pasadas en esta historia.
3. **Posición cerrada (`qty == 0`):** no aparece en la respuesta de P&L (la fila de
   `positions` se borra al vender todo). Las cerradas viven en el historial (US-015).

## Ubicación de la lógica

- **Dominio:** método puro en `Portfolio`, p. ej. `fun averageCostOf(ticker): BigDecimal?`,
  que hace el fold sobre `operations`. Testeable como unit test puro, sin DB ni simuladores.
- **Aplicación:** `GetPortfolioService` lo llama por posición para enriquecer `PositionView`.

## Exposición (enriquecer `GET /api/portfolio`, no endpoint aparte)

US-013 / US-016 / US-017 son todos "mostrame mi portfolio ahora" → una sola respuesta.
Se agregan campos nullable a `PositionViewResponse` (no rompiente):

- `avgCost: BigDecimal?` — **siempre poblado para posiciones abiertas** (derivable aun
  sin precio de mercado; permite mostrar el costo histórico aunque Yahoo no haya
  actualizado).
- `unrealizedPnl: BigDecimal?` — `(latestPrice − avgCost) × qty`. **Null si falta `latestPrice`**
  (dispara el mensaje "no hay precio suficiente").
- `unrealizedPnlPercent: BigDecimal?` — `(latestPrice − avgCost) / avgCost × 100`. Null si falta `latestPrice`.

## Redondeo

- `avgCost`: escala **4, HALF_UP** (igual que la columna `DECIMAL(19,4)` de precios).
  Evita `ArithmeticException` en divisiones no terminantes.
- `unrealizedPnl`: escala **4** (misma precisión monetaria que precios); la UI decide
  cuántos decimales mostrar.
- `unrealizedPnlPercent`: escala **2, HALF_UP**.
- La P&L se computa con el `avgCost` **ya redondeado**, para que los números que ve el
  usuario reconcilien entre sí.

## Web

- Columnas de `avgCost` / P&L / P&L% en la tabla de posiciones, con signo y color
  (verde ganancia / rojo pérdida).

## Tests

- **Unit (dominio, puros):** solo-compras; mezcla buy/sell; vendida-del-todo-y-recomprada
  (reset del basis); precio faltante ⇒ P&L null pero `avgCost` poblado.
- **Integration (H2):** la respuesta del portfolio trae los tres campos calculados.
- Una sola aserción por test.
