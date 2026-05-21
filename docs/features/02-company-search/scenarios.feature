Funcionalidad: Consulta de Empresas
  Como inversor
  Quiero buscar empresas y consultar información financiera
  Para analizar posibles inversiones

  Escenario: Búsqueda de empresas por ticker
    Dado que un inversor se encuentra en la pantalla de búsqueda
    Cuando ingresa un ticker en el campo de búsqueda
    Entonces el sistema muestra las empresas cuyo ticker coincide

  Escenario: Búsqueda de empresas por nombre
    Dado que un inversor se encuentra en la pantalla de búsqueda
    Cuando ingresa el nombre de una empresa en el campo de búsqueda
    Entonces el sistema muestra las empresas cuyo nombre coincide

  Escenario: Consulta de datos reales desde SEC EDGAR
    Dado que un inversor selecciona una empresa de los resultados
    Cuando solicita ver su información
    Entonces el sistema obtiene los datos desde SEC EDGAR

  Escenario: Visualización de métricas financieras clave
    Dado que un inversor consulta una empresa específica
    Cuando accede a su detalle
    Entonces el sistema muestra las métricas financieras clave

  Escenario: Visualización de filings recientes
    Dado que un inversor consulta una empresa específica
    Cuando accede a la sección de filings
    Entonces el sistema muestra los filings recientes 10-K y 10-Q

  Escenario: Visualización de evolución histórica de métricas
    Dado que un inversor consulta una empresa específica
    Cuando accede a la evolución de sus métricas
    Entonces el sistema muestra la serie histórica de cada métrica

  Escenario: Manejo de errores de EDGAR
    Dado que un inversor consulta información de una empresa
    Cuando EDGAR no responde o devuelve un error
    Entonces el sistema informa al usuario que la información no está disponible

  Escenario: Respeto del rate limit de EDGAR
    Dado que el sistema realiza consultas a EDGAR
    Cuando se procesan múltiples solicitudes
    Entonces el sistema respeta el rate limit establecido por EDGAR
