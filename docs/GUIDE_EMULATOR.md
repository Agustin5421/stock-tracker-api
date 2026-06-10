# Guía de Ejecución en Emulador Android y Manual de Appium 🚀

Esta guía resume todo el trabajo realizado en el desarrollo del soporte móvil e incluye los pasos detallados para ejecutar y expandir las pruebas automatizadas de Appium en el emulador de la nueva computadora.

---

## 🛠️ Resumen de lo que trabajamos
Durante nuestras sesiones, adaptamos la aplicación web para funcionar como una aplicación móvil híbrida e implementamos un marco de pruebas automatizadas:

1. **Configuración de Capacitor:**
   - Configuramos Next.js para realizar una exportación estática (`output: 'export'` en `web/next.config.mjs`).
   - Inicializamos Capacitor en la carpeta `web/` y creamos el proyecto nativo de Android en `web/android/`.
   - Añadimos scripts de conveniencia en `web/package.json` (`static:build`, `cap:sync`, `mobile:run`).

2. **Personalización del Logotipo (Branding):**
   - Creamos una herramienta Java personalizada para escalar tu imagen del Kiwi en todos los buckets de densidad de pantalla requeridos por Android (`hdpi`, `mdpi`, `xhdpi`, `xxhdpi`, `xxxhdpi`).
   - Reemplazamos los íconos launcher nativos (`ic_launcher.png`, `ic_launcher_round.png`, `ic_launcher_foreground.png`), logrando que la app se instale con tu diseño personalizado.

3. **Ajustes de Linter y Prettier:**
   - Evitamos conflictos de formato agregando exclusiones para las carpetas generadas `/android/` y `/out/` en `.prettierignore` y `eslint.config.mjs`.

4. **Habilitación de Red Móvil y CORS:**
   - Modificamos [AndroidManifest.xml](file:///C:/Users/usuario/Projects/5to/aseca/stock-tracker-api/web/android/app/src/main/AndroidManifest.xml) agregando `android:usesCleartextTraffic="true"` para que Android WebView permita conexiones HTTP (útil para desarrollo local).
   - Actualizamos [SecurityConfig.kt](file:///C:/Users/usuario/Projects/5to/aseca/stock-tracker-api/api/src/main/kotlin/aseca/acmn/austral/stock_tracker_api/infrastructure/security/SecurityConfig.kt) en el backend de Spring Boot para aceptar peticiones CORS provenientes del origen de Capacitor en Android (`http://localhost`).

5. **Infraestructura de Automatización Móvil (Appium + WebdriverIO):**
   - Creamos la carpeta `e2e/mobile/` estructurada con TypeScript, configurando las capabilities del emulador en `wdio.conf.ts` y definiendo el controlador `UiAutomator2`.
   - Escribimos el primer test de Appium en `specs/user-access.spec.ts` enfocado en la historia **US-001 (Registrar usuario)**, el cual maneja de forma dinámica la transición entre el contexto nativo (`NATIVE_APP`) y el contexto híbrido web (`WEBVIEW_com.kiwii.app`).

---

## 📋 Pasos para mañaña en la nueva computadora

### Paso 1: Levantar la API en Docker 🐳
Dado que en la otra compu funciona Docker, no necesitas usar H2. Simplemente inicia la base de datos MySQL por defecto del proyecto:
1. Inicia **Docker Desktop**.
2. Abre una terminal en la raíz del proyecto y ejecuta:
   ```bash
   docker-compose up -d
   ```
3. Ejecuta la API en Spring Boot:
   ```bash
   cd api
   ./gradlew bootRun
   ```
   *(La API iniciará en el puerto `8080` conectada a MySQL)*.

---

### Paso 2: Compilar y Ejecutar en el Emulador 📲

En el emulador de Android, **`localhost` se refiere al propio emulador**. Para poder comunicarte con la API que está corriendo en la computadora del host, Android provee una IP puente especial: **`10.0.2.2`**. 

1. **Inicia el Emulador de Android** desde Android Studio (Device Manager).
2. En la carpeta `web/` de tu proyecto, crea un archivo `.env` que apunte al puente especial de la computadora:
   ```env
   NEXT_PUBLIC_API_URL=http://10.0.2.2:8080
   ```
3. Compila, sincroniza y despliega la app en el emulador:
   ```bash
   cd web
   pnpm static:build
   pnpm cap:sync
   npx cap run android
   ```
   *(Selecciona tu emulador en la lista y la aplicación se abrirá sola con el ícono de Kiwi. Al registrarte o iniciar sesión, se comunicará de forma directa con la API de la computadora a través de la IP `10.0.2.2`)*.

---

### Paso 3: Correr los Tests Automáticos de Appium 🤖

Dado que la nueva computadora tiene Android Studio instalado, las variables de entorno de Android ya estarán correctamente configuradas en el sistema.

1. **Abre una terminal** e inicia el servidor de Appium global:
   ```bash
   npx appium
   ```
2. **Abre otra terminal** en la carpeta `e2e/mobile/` y ejecuta las pruebas automatizadas:
   ```bash
   cd e2e/mobile
   pnpm test
   ```
   *(Appium detectará tu emulador de forma automática, levantará la app limpia, cambiará el contexto al WebView de Chromium y realizará las validaciones del test de registro de punta a punta de la historia **US-001** en tiempo real)*.

---

## 🚀 Próximos pasos en Appium
Para expandir los escenarios de automatización (ej. Login, búsqueda de métricas, etc.):

1. **Estructura del Test Híbrido:**
   Recuerda que para interactuar con botones o inputs dentro de Capacitor, primero debes hacer el cambio de contexto (`switchContext`) tal como está estructurado en el hook `before` de [user-access.spec.ts](file:///C:/Users/usuario/Projects/5to/aseca/stock-tracker-api/e2e/mobile/test/specs/user-access.spec.ts).

2. **Selectores:**
   Al estar en el contexto WebView, puedes usar selectores CSS estándar de la web, por ejemplo:
   - `const input = await $('input[type="email"]')`
   - `const submitBtn = await $('button[type="submit"]')`
   - Para textos de botones: `const btn = await $('button=Texto del Botón')`

3. **Evitar colisiones de datos (Clean State):**
   Dado que estamos automatizando el flujo de Registro de Cuentas, el test utiliza un email dinámico generado con marcas de tiempo (`user_${Date.now()}@kiwii.com`) para evitar fallar por registros duplicados en tu base de datos persistida.
