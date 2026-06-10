Funcionalidad: Gestión del Portfolio
  Como inversor
  Quiero registrar compras de acciones y mantener los precios actualizados
  Para seguir la composición y valuación de mi portfolio

  # US-012 — Registrar compra de acciones

  Escenario: Comprar un ticker nuevo crea una posición
    Dado que existe un precio almacenado para "AAPL"
    Y mi portfolio no tiene una posición en "AAPL"
    Cuando registro la compra de 10 acciones de "AAPL"
    Entonces se crea una posición de "AAPL" con cantidad 10
    Y la operación queda registrada en el historial como una compra

  Escenario: Comprar un ticker ya tenido incrementa la cantidad
    Dado que existe un precio almacenado para "AAPL"
    Y mi portfolio ya tiene una posición de 10 acciones de "AAPL"
    Cuando registro la compra de 5 acciones de "AAPL"
    Entonces la posición de "AAPL" pasa a tener una cantidad de 15

  Escenario: La compra usa el último precio almacenado
    Dado que el último precio almacenado para "AAPL" es 189.42
    Cuando registro la compra de 3 acciones de "AAPL"
    Entonces la compra se registra con un precio de referencia de 189.42

  Escenario: Rechazo de compra con cantidad menor o igual a cero
    Dado que existe un precio almacenado para "AAPL"
    Cuando intento registrar la compra de 0 acciones de "AAPL"
    Entonces el sistema rechaza la operación
    Y la posición de "AAPL" no se modifica

  Escenario: Rechazo de compra cuando no hay precio almacenado
    Dado que no existe un precio almacenado para "NOPE"
    Cuando intento registrar la compra de 5 acciones de "NOPE"
    Entonces el sistema informa que no hay precio disponible
    Y no se registra ninguna operación

  Escenario: Solo se pueden comprar tickers con precio disponible
    Dado que únicamente "AAPL" y "MSFT" tienen precio almacenado
    Cuando consulto los tickers disponibles para comprar
    Entonces solo se ofrecen "AAPL" y "MSFT"

  # US-013 — Consultar estado actual del portfolio

  Escenario: El portfolio muestra cada posición con su precio y valor actual
    Dado que tengo 10 acciones de "AAPL" y el último precio almacenado es 189.42
    Cuando consulto el estado de mi portfolio
    Entonces veo la posición de "AAPL" con cantidad 10, último precio 189.42 y valor actual 1894.20

  Escenario: El portfolio muestra el valor total
    Dado que tengo posiciones con precio almacenado
    Cuando consulto el estado de mi portfolio
    Entonces veo el valor total del portfolio

  Escenario: Una posición sin precio actualizado no rompe la visualización
    Dado que tengo una posición en "AAPL" sin precio almacenado
    Cuando consulto el estado de mi portfolio
    Entonces la posición se muestra informando que no tiene precio actualizado
    Y el resto del portfolio se visualiza con normalidad

  # US-014 — Registrar venta de acciones

  Escenario: Vender parte de una posición reduce su cantidad
    Dado que tengo 10 acciones de "MSFT" y existe un precio almacenado para "MSFT"
    Cuando registro la venta de 4 acciones de "MSFT"
    Entonces la posición de "MSFT" pasa a tener una cantidad de 6
    Y la operación queda registrada en el historial como una venta

  Escenario: Vender la totalidad de una posición la elimina del portfolio
    Dado que tengo 5 acciones de "MSFT" y existe un precio almacenado para "MSFT"
    Cuando registro la venta de 5 acciones de "MSFT"
    Entonces "MSFT" deja de figurar entre mis posiciones

  Escenario: La venta usa el último precio almacenado
    Dado que el último precio almacenado para "MSFT" es 300.00
    Y tengo 10 acciones de "MSFT"
    Cuando registro la venta de 2 acciones de "MSFT"
    Entonces la venta se registra con un precio de referencia de 300.00

  Escenario: Rechazo de venta con cantidad menor o igual a cero
    Dado que tengo 10 acciones de "MSFT"
    Cuando intento registrar la venta de 0 acciones de "MSFT"
    Entonces el sistema rechaza la operación
    Y la posición de "MSFT" no se modifica

  Escenario: No se pueden vender más acciones de las disponibles
    Dado que tengo 2 acciones de "NVDA"
    Cuando intento registrar la venta de 5 acciones de "NVDA"
    Entonces el sistema rechaza la operación
    Y la posición de "NVDA" mantiene su cantidad de 2

  # US-015 — Consultar historial de operaciones

  Escenario: El historial registra las compras y las ventas
    Dado que registré una compra y una venta de "AAPL"
    Cuando consulto el historial de operaciones
    Entonces cada operación muestra su tipo, ticker, cantidad, precio utilizado y fecha

  Escenario: El historial se ordena por fecha, la más reciente primero
    Dado que registré una compra de "AAPL" y más tarde una venta de "AAPL"
    Cuando consulto el historial de operaciones
    Entonces la venta aparece antes que la compra

  Escenario: El usuario solo ve sus propias operaciones
    Dado que otro usuario tiene operaciones registradas
    Cuando consulto el historial de operaciones
    Entonces no veo las operaciones del otro usuario

  # US-016 — Visualizar última actualización de precios

  Escenario: Se muestra la última actualización junto a la valuación
    Dado que el sistema actualizó los precios al menos una vez
    Cuando consulto el estado de mi portfolio
    Entonces veo la fecha y hora de la última actualización de precios junto a la valuación

  Escenario: Sin actualizaciones previas se informa que no hay datos
    Dado que el sistema nunca actualizó los precios
    Cuando consulto el estado de mi portfolio
    Entonces el sistema informa que no hay actualización de precios disponible

  # US-017 — Consultar ganancia o pérdida por posición

  Escenario: Ganancia cuando el último precio supera el costo promedio
    Dado que tengo 4 acciones de "AAPL" con un costo promedio de 150
    Y el último precio almacenado para "AAPL" es 200
    Cuando consulto el estado de mi portfolio
    Entonces la posición de "AAPL" muestra una ganancia de 200 (+33,33%)

  Escenario: Pérdida cuando el último precio es menor al costo promedio
    Dado que tengo 4 acciones de "AAPL" con un costo promedio de 150
    Y el último precio almacenado para "AAPL" es 100
    Cuando consulto el estado de mi portfolio
    Entonces la posición de "AAPL" muestra una pérdida de 200 (-33,33%)

  Escenario: El costo promedio se calcula ponderado por cantidad
    Dado que compré 2 acciones de "AAPL" a 100 y 2 acciones de "AAPL" a 200
    Cuando consulto el estado de mi portfolio
    Entonces el costo promedio de "AAPL" es 150

  Escenario: Sin precio almacenado no se puede calcular el rendimiento
    Dado que tengo una posición en "AAPL" sin precio almacenado
    Cuando consulto el estado de mi portfolio
    Entonces el sistema informa que no hay precio suficiente para calcular el rendimiento
    Y de todos modos muestra el costo promedio de la posición

  # US-018 — Actualizar precios de los tickers del portfolio

  Escenario: El proceso actualiza los precios de los tickers presentes en portfolios
    Dado que mi portfolio tiene posiciones en "AAPL" y "MSFT"
    Cuando se ejecuta el proceso de actualización de precios
    Entonces se consulta Yahoo Finance por "AAPL" y "MSFT"
    Y se almacena el precio obtenido junto con su fecha y hora

  Escenario: La falla de un ticker no interrumpe la actualización del resto
    Dado que mi portfolio tiene posiciones en "AAPL" y "ZZZZ"
    Y Yahoo Finance no devuelve precio para "ZZZZ"
    Cuando se ejecuta el proceso de actualización de precios
    Entonces se almacena el precio de "AAPL"
    Y se registra el error de "ZZZZ" sin interrumpir el proceso
