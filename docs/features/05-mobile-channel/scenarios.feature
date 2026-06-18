Funcionalidad: Canal Mobile
  Como inversor
  Quiero acceder a mis inversiones desde la aplicación mobile
  Para monitorear y gestionar mi portfolio de acciones en tiempo real desde mi teléfono celular

  # US-024 — Iniciar sesión desde mobile

  Escenario: Inicio de sesión exitoso desde dispositivo móvil
    Dado que abro la aplicación móvil de Kiwii
    Y tengo credenciales válidas registradas "user@example.com" y "Password123!"
    Cuando intento iniciar sesión con esas credenciales
    Entonces el sistema me permite el acceso
    Y visualizo la pantalla de inicio móvil (Home)

  Escenario: Inicio de sesión fallido por credenciales incorrectas
    Dado que abro la aplicación móvil de Kiwii
    Cuando intento iniciar sesión con credenciales inválidas
    Entonces la aplicación móvil rechaza el acceso
    Y muestra una alerta de error en pantalla

  # US-025 — Consultar portfolio desde mobile

  Escenario: Visualizar la composición y estado del portfolio en mobile
    Dado que inicié sesión desde la aplicación móvil
    Y tengo una posición de 5 acciones de "AAPL" a un precio actual de 180.00 con ganancia acumulada
    Cuando navego a la pestaña de Portfolio en el celular
    Entonces veo el valor total de mi cartera de inversiones
    Y visualizo la posición "AAPL" con su cantidad 5, valor actual 900.00 y la ganancia correspondiente
    Y se muestra el timestamp de la última actualización de precios del sistema

  # US-026 — Registrar operaciones desde mobile

  Escenario: Registrar una compra de acciones desde mobile
    Dado que inicié sesión desde la aplicación móvil
    Y existe un precio almacenado para "AAPL"
    Cuando registro la compra de 10 acciones de "AAPL" desde el formulario móvil
    Entonces la cantidad de mi posición en "AAPL" se incrementa por 10
    Y el balance de mi portfolio se actualiza en consecuencia

  Escenario: Rechazo de venta por cantidad insuficiente en mobile
    Dado que inicié sesión desde la aplicación móvil
    Y mi portfolio contiene 3 acciones de "MSFT"
    Cuando intento registrar la venta de 5 acciones de "MSFT" desde el formulario móvil
    Entonces el sistema móvil rechaza la transacción
    Y muestra un mensaje informando que no poseo cantidad suficiente de acciones

  # US-027 — Buscar empresas desde mobile

  Escenario: Buscar una compañía por ticker y ver su detalle en mobile
    Dado que inicié sesión desde la aplicación móvil
    Cuando ingreso "AAPL" en el buscador móvil de empresas
    Entonces se muestran los resultados coincidentes
    Cuando selecciono "Apple Inc." de la lista
    Entonces la aplicación muestra el detalle financiero simplificado de la empresa en el celular

  # US-028 — Consultar watchlist desde mobile

  Escenario: Gestionar la lista de seguimiento en mobile
    Dado que inicié sesión desde la aplicación móvil
    Y tengo las empresas "AAPL" y "MSFT" en mi watchlist
    Cuando navego a la sección de Watchlist en el celular
    Entonces veo la lista con "AAPL" y "MSFT"
    Cuando selecciono eliminar "MSFT" desde la interfaz móvil
    Entonces "MSFT" se remueve de mi watchlist móvil
