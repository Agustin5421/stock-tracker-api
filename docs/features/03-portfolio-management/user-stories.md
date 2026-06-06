# Feature 3 — Gestión del Portfolio

## US-012 — Registrar compra de acciones

**Como inversor,**
quiero registrar una compra de acciones usando el último precio almacenado,
para incrementar una posición de mi portfolio con un precio de referencia del sistema.

**Criterios de aceptación**
- El usuario puede ingresar ticker y cantidad a comprar.
- La cantidad debe ser mayor a cero.
- El sistema utiliza el último precio almacenado para ese ticker.
- Si el ticker no existe en el portfolio, se crea una nueva posición.
- Si el ticker ya existe en el portfolio, se incrementa la cantidad disponible.
- La compra queda registrada en el historial de operaciones.
- El balance del portfolio refleja la compra.

## US-013 — Registrar venta de acciones

**Como inversor,**
quiero registrar una venta de acciones usando el último precio almacenado,
para reducir una posición de mi portfolio y mantener actualizado mi balance.

**Criterios de aceptación**
- El usuario puede seleccionar una posición existente.
- El usuario puede ingresar la cantidad a vender.
- La cantidad debe ser mayor a cero.
- El sistema utiliza el último precio almacenado para ese ticker.
- El sistema no permite vender más acciones que las disponibles.
- La venta reduce la cantidad de la posición correspondiente.
- La venta queda registrada en el historial de operaciones.
- El balance del portfolio refleja la venta.

## US-014 — Consultar estado actual del portfolio

**Como inversor,**
quiero consultar el estado actual de mi portfolio,
para visualizar las acciones que lo componen y su valor actual.

**Criterios de aceptación**
- El usuario puede ver todas sus posiciones vigentes.
- Cada posición muestra ticker y cantidad.
- Cada posición muestra el último precio almacenado disponible.
- Cada posición muestra su valor actual.
- El sistema muestra el valor total del portfolio.
- Si una posición no tiene precio actualizado, el sistema informa la situación sin romper la visualización.

## US-015 — Consultar ganancia o pérdida por posición

**Como inversor,**
quiero ver la ganancia o pérdida de cada posición,
para evaluar el rendimiento de mis inversiones.

**Criterios de aceptación**
- El sistema muestra ganancia o pérdida por posición.
- El cálculo compara el precio de compra o referencia contra el último precio almacenado.
- El sistema muestra el resultado de forma clara para el usuario.
- Si no hay precio almacenado suficiente para calcular el rendimiento, el sistema informa la situación.

## US-016 — Consultar historial de operaciones

**Como inversor,**
quiero consultar el historial de compras y ventas,
para revisar los movimientos que afectaron mi portfolio.

**Criterios de aceptación**
- El usuario puede ver las operaciones registradas.
- Cada operación muestra tipo de operación, ticker, cantidad, precio utilizado y fecha.
- El historial se muestra ordenado por fecha.
- El usuario solo visualiza operaciones propias.

## US-017 — Visualizar última actualización de precios

**Como inversor,**
quiero ver cuándo se actualizaron por última vez los precios del sistema,
para saber qué tan recientes son los valores usados en mi portfolio.

**Criterios de aceptación**
- El sistema muestra fecha y hora de última actualización de precios.
- La fecha se muestra junto a la valuación del portfolio.
- Si nunca se actualizaron precios, el sistema informa que no hay actualización disponible.

## US-018 — Actualizar precios de tickers del portfolio

**Como sistema,**
quiero actualizar los precios de los tickers presentes en portfolios,
para calcular valuaciones y rendimiento con precios almacenados.

**Criterios de aceptación**
- El proceso identifica los tickers presentes en portfolios.
- El proceso consulta Yahoo Finance para obtener el precio más reciente.
- El precio obtenido se persiste en la base de datos.
- Se registra el timestamp de actualización.
- Si falla la actualización de un ticker, el error se registra.
- La falla de un ticker no interrumpe la actualización del resto.
