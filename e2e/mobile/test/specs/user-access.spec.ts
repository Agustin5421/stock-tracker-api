import { expect } from '@wdio/globals'

describe('Acceso de Usuarios (US-001 / US-002)', () => {
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
    const registerTitle = await $('h3=Crear cuenta')
    await registerTitle.waitForDisplayed({ timeout: 5000 })

    // Completar el formulario con un mail único aleatorio para no colisionar en la base de datos
    const uniqueEmail = `user_${Date.now()}@kiwii.com`
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
})
