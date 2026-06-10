import { expect } from '@wdio/globals'

describe('Acceso de Usuarios (US-001 / US-002)', () => {
  let uniqueEmail: string

  before(async () => {
    // 1. Esperar a que los contextos de la app (Nativo y WebView) estén disponibles
    await browser.waitUntil(
      async () => {
        const contexts = await browser.getContexts()
        return contexts.length > 1
      },
      {
        timeout: 30000,
        timeoutMsg: 'No se encontró el contexto WEBVIEW de la app híbrida'
      }
    )

    // 2. Buscar el contexto WebView de la app Capacitor (com.kiwii.app)
    const contexts = await browser.getContexts() // Retorna e.g. ['NATIVE_APP', 'WEBVIEW_com.kiwii.app']
    const webviewContext = contexts.find((c) => typeof c === 'string' && c.includes('WEBVIEW'))
    
    if (webviewContext) {
      await browser.switchContext(webviewContext)
      console.log(`Conectado exitosamente al contexto WebView: ${webviewContext}`)
    } else {
      throw new Error('No se encontró ningún contexto WebView disponible.')
    }
  })

  it('US-001: Debería permitir registrar un nuevo usuario exitosamente', async () => {
    // Esperar a que el botón de navegación a registro esté disponible en la vista de Login
    const registerNavButton = await $('button=Crea una')
    await registerNavButton.waitForDisplayed({ timeout: 15000 })
    
    // Navegar a la pantalla de Registro
    await registerNavButton.click()

    // Validar que se muestre el título de "Crear cuenta"
    const registerTitle = await $('div=Crear cuenta')
    await registerTitle.waitForDisplayed({ timeout: 5000 })

    // Completar el formulario con un mail único aleatorio para no colisionar en la base de datos
    uniqueEmail = `user_${Date.now()}@kiwii.com`
    const emailInput = await $('input[type="email"]')
    const passwordInput = await $('input[type="password"]')
    
    await emailInput.setValue(uniqueEmail)
    await passwordInput.setValue('ClaveSegura123!')

    // Hacer clic en el botón de enviar
    const submitButton = await $('button[type="submit"]')
    await submitButton.click()

    // El sistema debe redirigir al login y mostrar el cartel flotante de éxito
    const successAlert = await $('p=Cuenta creada exitosamente. Ya podes iniciar sesion.')
    await successAlert.waitForDisplayed({ timeout: 10000 })
    
    expect(await successAlert.isDisplayed()).toBe(true)
  })

  it('US-002: Debería rechazar el acceso si las credenciales son inválidas', async () => {
    // 1. Ingresar credenciales incorrectas
    const emailInput = await $('input[type="email"]')
    const passwordInput = await $('input[type="password"]')
    
    await emailInput.setValue('wrong@kiwii.com')
    await passwordInput.setValue('WrongPassword123!')

    // 2. Hacer clic en el botón de submit (Iniciar sesión)
    const submitButton = await $('button[type="submit"]')
    await submitButton.click()

    // 3. Validar que se muestre el cartel flotante de error "Invalid credentials"
    const errorAlert = await $('p=Invalid credentials')
    await errorAlert.waitForDisplayed({ timeout: 5000 })
    
    expect(await errorAlert.isDisplayed()).toBe(true)
  })

  it('US-002: Debería permitir iniciar sesión con el usuario creado y ver la pantalla de Home', async () => {
    // 1. Ingresar credenciales en la pantalla de Login
    const emailInput = await $('input[type="email"]')
    const passwordInput = await $('input[type="password"]')
    
    await emailInput.setValue(uniqueEmail)
    await passwordInput.setValue('ClaveSegura123!')

    // 2. Hacer clic en el botón de submit (Iniciar sesión)
    const submitButton = await $('button[type="submit"]')
    await submitButton.click()

    // 3. Debería redirigir a Home. Validamos que aparezca el botón de "Cerrar sesion"
    const logoutButton = await $('button=Cerrar sesion')
    await logoutButton.waitForDisplayed({ timeout: 10000 })
    
    expect(await logoutButton.isDisplayed()).toBe(true)
  })

  it('US-003: Debería permitir cerrar sesión y redirigir a la pantalla de Login', async () => {
    // 1. Hacer clic en el botón de Cerrar sesión
    const logoutButton = await $('button=Cerrar sesion')
    await logoutButton.click()

    // 2. Validar que redirija a la pantalla de Login mostrando el título "Iniciar sesion"
    const loginTitle = await $('div=Iniciar sesion')
    await loginTitle.waitForDisplayed({ timeout: 5000 })
    
    expect(await loginTitle.isDisplayed()).toBe(true)
  })

  it('US-003: Debería denegar el acceso a la pantalla de Home si no está autenticado', async () => {
    // 1. Intentar acceder directamente al Home modificando el hash de la ruta
    await browser.execute(() => {
      window.location.hash = '#/home'
    })

    // 2. Esperar un momento y verificar que la guarda de ruta redirija al login
    const loginTitle = await $('div=Iniciar sesion')
    await loginTitle.waitForDisplayed({ timeout: 5000 })

    // Validar que el botón de cerrar sesión no esté en pantalla
    const logoutButton = await $('button=Cerrar sesion')
    expect(await logoutButton.isDisplayed()).toBe(false)
  })
})
