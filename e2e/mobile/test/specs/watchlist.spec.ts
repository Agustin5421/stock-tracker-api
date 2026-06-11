import { expect } from '@wdio/globals'

describe('Watchlist y Comparacion Mobile (Feature 4)', () => {
  before(async () => {
    // 1. Esperar a que el contexto WebView de la app esté listo
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

    const contexts = await browser.getContexts()
    const webviewContext = contexts.find((c) => typeof c === 'string' && c.includes('WEBVIEW'))
    
    if (webviewContext) {
      await browser.switchContext(webviewContext)
      console.log(`Conectado exitosamente al contexto WebView: ${webviewContext}`)
    } else {
      throw new Error('No se encontró ningún contexto WebView disponible.')
    }

    // 2. Registrar un usuario de prueba rápido para acceder al Home
    const registerNavButton = await $('button=Crea una')
    await registerNavButton.waitForDisplayed({ timeout: 15000 })
    await registerNavButton.click()

    const uniqueEmail = `watchlist_mobile_${Date.now()}@kiwii.com`
    const emailInput = await $('input[type="email"]')
    const passwordInput = await $('input[type="password"]')
    
    await emailInput.setValue(uniqueEmail)
    await passwordInput.setValue('ClaveSegura123!')

    const submitButton = await $('button[type="submit"]')
    await submitButton.click()

    // 3. Iniciar sesión con ese usuario
    const loginEmailInput = await $('input[type="email"]')
    const loginPasswordInput = await $('input[type="password"]')
    
    await loginEmailInput.setValue(uniqueEmail)
    await loginPasswordInput.setValue('ClaveSegura123!')

    const loginButton = await $('button[type="submit"]')
    await loginButton.click()

    // 4. Confirmar que estamos en Home
    const logoutButton = await $('button=Cerrar sesion')
    await logoutButton.waitForDisplayed({ timeout: 15000 })
  })

  it('US-021: Debería mostrar mensaje de lista vacía en móvil', async () => {
    const watchlistView = await $('[data-testid="watchlist-view"]')
    await watchlistView.waitForDisplayed({ timeout: 5000 })

    const emptyMessage = await $('[data-testid="watchlist-empty-message"]')
    await emptyMessage.waitForDisplayed({ timeout: 5000 })
    expect(await emptyMessage.getText()).toContain('No tienes empresas en seguimiento')
  })

  it('US-019 / US-020: Debería agregar una empresa a la watchlist y removerla en móvil', async () => {
    // Buscar "AAPL"
    const searchInput = await $('[data-testid="company-search-input"]')
    await searchInput.setValue('AAPL')

    // Esperar a que aparezca Apple (CIK: 320193) y hacer clic
    const appleResult = await $('[data-testid="company-result-320193"]')
    await appleResult.waitForDisplayed({ timeout: 15000 })
    await appleResult.click()

    // Clickear en el botón de agregar a la watchlist
    const toggleButton = await $('[data-testid="watchlist-toggle"]')
    await toggleButton.waitForDisplayed({ timeout: 5000 })
    await toggleButton.click()

    // Validar que se liste en la watchlist móvil
    const watchlistItem = await $('[data-testid="watchlist-item-AAPL"]')
    await watchlistItem.waitForDisplayed({ timeout: 5000 })
    expect(await watchlistItem.isDisplayed()).toBe(true)

    // Remover desde la watchlist móvil
    const removeButton = await $('[data-testid="watchlist-item-AAPL-remove"]')
    await removeButton.waitForDisplayed({ timeout: 5000 })
    await removeButton.click()

    // Validar que ya no figure
    const emptyMessage = await $('[data-testid="watchlist-empty-message"]')
    await emptyMessage.waitForDisplayed({ timeout: 5000 })
    expect(await emptyMessage.isDisplayed()).toBe(true)
  })
})
