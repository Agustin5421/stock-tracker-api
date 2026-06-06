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
