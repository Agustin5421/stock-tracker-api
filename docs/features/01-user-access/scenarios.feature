Funcionalidad: Acceso de Usuarios
  Como inversor
  Quiero acceder a una cuenta personal
  Para mantener mi información persistente y privada dentro del sistema

  Escenario: Registro de nuevo usuario con correo y contraseña
    Dado que un inversor ingresa un correo electrónico válido y una contraseña segura
    Cuando envía el formulario de registro
    Entonces se crea la cuenta de usuario
    Y recibe una confirmación de registro exitoso

  Escenario: Inicio de sesión con credenciales válidas
    Dado que existe un usuario registrado con correo y contraseña válidos
    Cuando intenta iniciar sesión con esas credenciales
    Entonces el sistema le permite acceder a su cuenta

  Escenario: Rechazo de credenciales inválidas
    Dado que un usuario ingresa credenciales incorrectas
    Cuando intenta iniciar sesión
    Entonces el sistema rechaza el acceso
    Y muestra un mensaje de error de autenticación

  Escenario: Persistencia de información entre sesiones
    Dado que un usuario ha iniciado sesión y tiene datos guardados
    Cuando cierra la sesión y vuelve a iniciar sesión luego
    Entonces su información de usuario sigue disponible

  Escenario: Cierre de sesión
    Dado que un usuario ha iniciado sesión
    Cuando cierra la sesión
    Entonces el sistema lo redirige a la pantalla de inicio de sesión
    Y no puede acceder a pantallas protegidas sin volver a autenticarse
