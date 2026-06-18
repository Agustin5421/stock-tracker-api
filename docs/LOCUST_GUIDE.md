# Guía de diseño para pruebas de carga con Locust

Esta guía resume los criterios principales que deberían guiar la definición y ejecución de las pruebas de carga y estrés del sistema.

## 1. Diferenciar claramente entre carga y estrés

El trabajo práctico requiere evaluar al menos dos tipos de escenarios:

- **Load testing**: verifica el comportamiento del sistema bajo una carga esperada o realista.
- **Stress testing**: busca identificar el punto en el que el sistema comienza a degradarse o falla cuando la carga supera el volumen normal.

Es importante justificar qué patrón de uso se está simulando y por qué ese escenario resulta representativo para el sistema.

## 2. Considerar el límite de EDGAR como un cuello de botella

Una de las restricciones más importantes del diseño es la limitación de la API de EDGAR:

- Límite oficial: **10 requests por segundo**.
- Si la carga se aplica directamente sobre esa dependencia externa, las respuestas pueden rechazarse por limitación del proveedor.
- Esto puede hacer que el rendimiento del sistema se evalúe de forma incorrecta, ya que el fallo no estaría ocurriendo en la aplicación sino en la integración externa.

Para evitar este problema, conviene diseñar la arquitectura para que la API implemente estrategias de caché, de modo que las respuestas repetidas de EDGAR no saturen el servicio externo.

## 3. No incluir el proceso batch de Yahoo Finance dentro del estrés continuo

La obtención de precios desde Yahoo Finance funciona como un proceso por lotes independiente, no como un flujo continuo de demanda durante la prueba.

Por lo tanto:

- no debería modelarse como una fuente constante de tráfico durante el test de estrés;
- su impacto debe analizarse por separado, considerando que se ejecuta de forma distinta al tráfico transaccional del sistema.

## 4. Justificar el dimensionamiento mediante recursos del contenedor

Una parte importante del análisis consiste en evaluar cómo cambia el comportamiento del sistema al variar los recursos asignados a la API.

En práctica, esto puede hacerse modificando los límites de CPU y memoria en el archivo de configuración de Docker. Por ejemplo:

- ejecutar la misma prueba con 4 CPU y 8 GB de RAM;
- repetir la prueba con 2 CPU y 4 GB de RAM.

Este tipo de comparación permite observar cómo se degrada o se estabiliza el sistema según la capacidad disponible, y ayuda a fundamentar la infraestructura necesaria para sostener la carga esperada.

## 5. Simular comportamientos de usuario realistas

La prueba no debería consistir únicamente en solicitudes aleatorias. Conviene modelar distintos perfiles de usuarios, por ejemplo:

- usuarios que consultan información con frecuencia;
- usuarios que realizan operaciones de compra o venta;
- usuarios que combinan lectura e interacción con la plataforma.

Para representar esto en Locust, es recomendable usar clases de usuarios y pesos distintos, así como tareas con diferentes prioridades o frecuencias. Por ejemplo:

- `@task(5)` para acciones más frecuentes;
- `@task(1)` para acciones menos comunes.

De esta forma, el escenario se aproxima mejor al comportamiento real del sistema.