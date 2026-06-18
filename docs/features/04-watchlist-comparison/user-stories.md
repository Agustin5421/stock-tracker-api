# US-019 — Agregar empresa a watchlist

**Como** inversor,  
**quiero** agregar una empresa a mi watchlist,  
**para** seguirla sin registrarla como posición de mi portfolio.

## Criterios de aceptación
- El usuario puede agregar una empresa desde un resultado de búsqueda o detalle.
- La empresa agregada aparece en la watchlist.
- Agregar una empresa a watchlist no modifica el portfolio.
- No se permite duplicar la misma empresa en la watchlist del usuario.

# US-020 — Eliminar empresa de watchlist

**Como** inversor,  
**quiero** eliminar una empresa de mi watchlist,  
**para** dejar de seguir compañías que ya no me interesan.

## Criterios de aceptación
- El usuario puede seleccionar una empresa de su watchlist.
- El sistema permite eliminarla.
- La empresa eliminada deja de aparecer en la watchlist.
- La eliminación no modifica el portfolio.

# US-021 — Visualizar empresas en seguimiento

**Como** inversor,  
**quiero** ver las empresas que agregué a mi watchlist,  
**para** tener acceso rápido a las compañías que estoy evaluando.

## Criterios de aceptación
- El usuario puede ver su watchlist.
- Cada empresa muestra nombre y ticker.
- La watchlist solo muestra empresas del usuario autenticado.
- Si la watchlist está vacía, el sistema lo informa.

# US-022 — Comparar métricas entre empresas de la watchlist

**Como** inversor,  
**quiero** comparar métricas financieras entre empresas de mi watchlist,  
**para** evaluar oportunidades de inversión.

## Criterios de aceptación
- El usuario puede seleccionar dos o más empresas de la watchlist.
- El sistema muestra métricas financieras comparables.
- La comparación incluye métricas clave disponibles.
- Si una empresa no tiene una métrica disponible, el sistema lo informa sin romper la comparación.

# US-023 — Actualizar precios de tickers de watchlist

**Como** sistema,  
**quiero** actualizar los precios de los tickers presentes en watchlists,  
**para** mantener información de seguimiento consistente con el resto del sistema.

## Criterios de aceptación
- El proceso identifica los tickers presentes en watchlists.
- El proceso consulta Yahoo Finance para obtener el precio más reciente.
- El precio obtenido se persiste en la base de datos.
- Se registra el timestamp de actualización.
- Si falla la actualización de un ticker, el error se registra y el proceso continúa.
