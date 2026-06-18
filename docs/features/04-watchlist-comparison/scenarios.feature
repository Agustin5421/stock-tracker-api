Funcionalidad: Watchlist y Comparación
  Como inversor
  Quiero agregar empresas a mi lista de seguimiento y comparar sus métricas
  Para analizar y evaluar alternativas de inversión sin comprometer capital

  # US-019 — Agregar empresa a watchlist

  Escenario: Agregar una empresa a la watchlist la incorpora a la lista
    Dado que busco la empresa "MSFT"
    Cuando la agrego a mi watchlist
    Entonces "MSFT" figura en mi lista de seguimiento
    Y mi portfolio de inversiones no se ve modificado

  Escenario: No se permiten duplicados en la watchlist
    Dado que ya tengo a "AAPL" en mi watchlist
    Cuando intento agregar "AAPL" nuevamente
    Entonces el sistema no realiza cambios
    Y se mantiene una única ocurrencia de "AAPL" en la watchlist

  # US-020 — Eliminar empresa de watchlist

  Escenario: Eliminar una empresa de la watchlist la remueve
    Dado que tengo a "MSFT" en mi watchlist
    Cuando elimino "MSFT" de la watchlist
    Entonces "MSFT" deja de figurar en mi lista de seguimiento
    Y mi portfolio de inversiones no se ve modificado

  # US-021 — Visualizar empresas en seguimiento

  Escenario: Ver empresas con sus tickers y nombres
    Dado que agregué "Apple Inc." con ticker "AAPL" y "Microsoft Corp." con ticker "MSFT" a mi watchlist
    Cuando consulto mi watchlist
    Entonces veo a "Apple Inc. (AAPL)" y a "Microsoft Corp. (MSFT)"
    Y solo veo elementos de mi propia lista de seguimiento

  Escenario: Watchlist vacía informa la situación
    Dado que no he agregado ninguna empresa a mi watchlist
    Cuando consulto mi watchlist
    Entonces el sistema informa que la lista de seguimiento está vacía

  # US-022 — Comparar métricas entre empresas de la watchlist

  Escenario: Comparar métricas disponibles de varias empresas
    Dado que tengo a "AAPL" y "MSFT" en mi watchlist
    Cuando selecciono "AAPL" y "MSFT" para comparar
    Entonces el sistema muestra una tabla comparativa con Revenue, Net Income, EPS, Total Assets y Total Liabilities de ambas empresas

  Escenario: Comparar cuando falta alguna métrica no rompe la comparación
    Dado que tengo a "AAPL" y una startup "XYZ" en mi watchlist
    Y "XYZ" no tiene publicado el dato de EPS en SEC EDGAR
    Cuando selecciono "AAPL" y "XYZ" para comparar
    Entonces el sistema muestra los datos de "AAPL"
    Y para "XYZ" muestra que la métrica EPS no está disponible
    Sin interrumpir la visualización de las otras métricas

  # US-023 — Actualizar precios de tickers de watchlist

  Escenario: El proceso de actualización incluye tickers en watchlists
    Dado que no tengo posiciones de portfolio pero tengo a "TSLA" en mi watchlist
    Cuando se ejecuta el proceso de actualización de precios
    Entonces se consulta Yahoo Finance por "TSLA"
    Y se guarda el precio de cierre y el timestamp de actualización
