TP Final - Aseguramiento de la Calidad de Software

## 1er Cuatrimestre 2026

# Objetivo

Se debe realizar una app web y mobile de portfolio tracker de acciones cotizadas en mercados de EEUU, integrando dos fuentes de datos externas reales: datos financieros de la SEC (Securities and Exchange Commission) a través de su API pública EDGAR, y precios de mercado a través de Yahoo Finance.  
<br/>La misma debe contar con una API que cumpla la función de servir a la app mobile y la app web. Considerando:

## Gestión de Portfolio

- Crear cuenta de usuario asociada a un mail y password
- Agregar acciones al portfolio especificando ticker, cantidad y fecha de operación
- Eliminar o modificar posiciones del portfolio
- Consultar el valor actual del portfolio y la ganancia/pérdida de cada posición respecto al precio de compra, calculados sobre el último precio almacenado en el sistema
- Registrar operaciones (historial de transacciones):
- Compra de acciones al precio vigente según la última actualización de precios
- Venta de acciones al precio vigente según la última actualización de precios
- Que el balance del portfolio refleje cada operación

## Consulta de Datos Financieros desde SEC EDGAR

Integración real con la API pública de EDGAR (<https://data.sec.gov>):

- Buscar empresas por nombre o ticker usando EDGAR Full-Text Search
- Consultar métricas financieras de una empresa (Revenue, Net Income, EPS, Total Assets, Total Liabilities) desde la XBRL Company Facts API
- Ver los filings más recientes de una empresa (10-K, 10-Q) desde la EDGAR Submissions API
- Ver evolución histórica de métricas financieras de una empresa (últimos 4 a 8 quarters reportados)

## Proceso de Actualización de Precios (Yahoo Finance)

El sistema debe incluir un proceso batch independiente que se ejecuta una única vez por invocación. Su responsabilidad es consultar Yahoo Finance para obtener el precio de cierre más reciente de cada ticker presente en el sistema (portfolios y watchlists), y persistir esos precios en la base de datos. Toda la lógica de valorización del portfolio y P&L se calcula únicamente contra los precios almacenados, sin consultar Yahoo Finance en tiempo real durante el uso normal de la aplicación.

- El proceso debe poder ejecutarse manualmente (por línea de comando o endpoint dedicado) y desde el pipeline de CI como paso opcional
- Debe registrar en la base de datos el timestamp de la última actualización y el precio obtenido por ticker
- Si Yahoo Finance no devuelve precio para un ticker, el proceso debe registrar el error y continuar con el resto sin interrumpirse
- La app debe mostrar al usuario la fecha y hora de la última actualización de precios

## Watchlist

- Agregar y eliminar empresas a una lista de seguimiento sin registrar posición
- Comparar métricas financieras clave entre empresas de la watchlist

# Sobre las APIs Externas

## SEC EDGAR

La SEC pone a disposición de forma pública y sin autenticación la API de EDGAR. Los endpoints principales a utilizar son:

- **Company Submissions:** <https://data.sec.gov/submissions/CIK{CIK}.json> - filings y metadata de una empresa (incluye ticker y nombre)
- **Company Facts:** <https://data.sec.gov/api/xbrl/companyfacts/CIK{CIK}.json> - todos los datos financieros XBRL reportados por la empresa
- **Company Concept:** <https://data.sec.gov/api/xbrl/companyconcept/CIK{CIK}/us-gaap/{concept}.json> - un concepto financiero específico (ej: Revenues, EarningsPerShareBasic)
- **Full-Text Search:** <https://efts.sec.gov/LATEST/search-index?q={query}&forms=10-K> - búsqueda de empresas y filings por texto libre
- **Company Tickers:** <https://www.sec.gov/files/company_tickers.json> - mapa completo de ticker → CIK para todas las empresas registradas

La API tiene un rate limit de 10 requests por segundo y requiere un header User-Agent descriptivo con nombre del proyecto y mail de contacto. No requiere API key ni registro.

## Yahoo Finance

Yahoo Finance es la fuente de precios de mercado. Se debe utilizar la librería yfinance (Python) para consumirla. No requiere API key ni registro. El uso recomendado es:

- Instalar con: pip install yfinance
- Obtener precio de cierre más reciente: yf.Ticker("AAPL").fast_info\["lastPrice"\]
- Obtener múltiples tickers en una sola llamada: yf.download(\["AAPL", "MSFT"\], period="1d")
- Yahoo Finance no garantiza SLA ni disponibilidad formal - el proceso batch debe manejar errores y timeouts de forma explícita

# Requisitos Técnicos

- Las apps web y mobile deben ser minimalistas de modo de hacer lo mínimo indispensable para poder probar el sistema
- Para las APIs o web apps se debe implementar proyectos con un lenguaje de programación a elección entre C#, Java, Kotlin, Python, Ruby, Javascript, Typescript
- Se deben realizar tests unitarios con frameworks xUnit o Specs. También deben existir tests de integración full stack, contra persistencia y APIs internas o externas (incluyendo integración real contra la API de EDGAR y contra el proceso de actualización de precios de Yahoo Finance)
- Se deben realizar tests end2end con Cypress y Appium sobre la app real. Se debe testear contra un chrome headless
- Se deben realizar tests de stress con Locust en Python sobre el API. Se deben diferenciar los esquemas de Stress y Load testing, presentando una clara estrategia y justificación de los workflows elegidos y dimensionamiento. Se debe contemplar el rate limiting de EDGAR (10 req/s) en la estrategia de stress testing dado que el proceso batch de precios corre una única vez y no genera carga continua sobre Yahoo Finance
- Se debe versionar en github el avance utilizando SemVer
- Se debe integrar a algún servicio SaaS (github, gitlab, bitbucket), usando mecanismos de pipelines versionados en el propio repo, para llevar adelante las tareas de CI (compilación, tests unitarios y delivery vía herramienta basada en docker)
- Debe utilizarse docker compose para todo el stack, con volúmenes persistentes
- Realizar una presentación final al resto de la clase
