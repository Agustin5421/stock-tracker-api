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
