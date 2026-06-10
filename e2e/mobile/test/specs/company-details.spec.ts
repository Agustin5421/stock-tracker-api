import { expect } from '@wdio/globals'

describe('Consulta de Empresas (US-004 / US-005 / US-006)', () => {
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

    const uniqueEmail = `search_test_${Date.now()}@kiwii.com`
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

    // 4. Confirmar que estamos en Home (vemos el botón de cerrar sesión)
    const logoutButton = await $('button=Cerrar sesion')
    await logoutButton.waitForDisplayed({ timeout: 15000 })
  })

  it('US-004: Debería listar empresas por defecto y permitir buscar por ticker (AAPL)', async () => {
    // Validar que el input de búsqueda sea visible
    const searchInput = await $('[data-testid="company-search-input"]')
    await searchInput.waitForDisplayed({ timeout: 5000 })

    // Validar que se listen empresas por defecto
    const firstResult = await $('[data-testid^="company-result-"]')
    await firstResult.waitForDisplayed({ timeout: 10000 })
    expect(await firstResult.isDisplayed()).toBe(true)

    // Buscar "AAPL"
    await searchInput.setValue('AAPL')

    // Esperar a que el resultado de Apple esté visible (CIK de Apple es 320193)
    const appleResult = await $('[data-testid="company-result-320193"]')
    await appleResult.waitForDisplayed({ timeout: 15000 })
    expect(await appleResult.isDisplayed()).toBe(true)
  })

  it('US-005: Debería permitir seleccionar la empresa y ver sus métricas financieras clave', async () => {
    // Hacer clic en el resultado de Apple
    const appleResult = await $('[data-testid="company-result-320193"]')
    await appleResult.click()

    // Esperar a que el panel de métricas sea visible
    const metricsPanel = await $('[data-testid="company-metrics-panel"]')
    await metricsPanel.waitForDisplayed({ timeout: 15000 })

    // Validar que se muestran las etiquetas de las métricas clave
    const metricsContent = await $('[data-testid="company-metrics-content"]')
    await metricsContent.waitForDisplayed({ timeout: 15000 })
    expect(await metricsContent.isDisplayed()).toBe(true)

    const revenueLabel = await metricsPanel.$('span=Ingresos')
    expect(await revenueLabel.isDisplayed()).toBe(true)

    const netIncomeLabel = await metricsPanel.$('span=Utilidad Neta')
    expect(await netIncomeLabel.isDisplayed()).toBe(true)

    const epsLabel = await metricsPanel.$('span=Ganancias por Acción')
    expect(await epsLabel.isDisplayed()).toBe(true)
  })

  it('US-006: Debería permitir navegar a la pestaña de filings y ver los reportes 10-K/10-Q', async () => {
    // Hacer clic en la pestaña "Filings Recientes"
    const filingsTabTrigger = await $('button=Filings Recientes')
    await filingsTabTrigger.click()

    // Validar que el panel de filings sea visible
    const filingsPanel = await $('[data-testid="company-filings-panel"]')
    await filingsPanel.waitForDisplayed({ timeout: 15000 })

    // Validar que se listen filings con su tipo de reporte
    const filingsContent = await $('[data-testid="company-filings-content"]')
    await filingsContent.waitForDisplayed({ timeout: 15000 })
    expect(await filingsContent.isDisplayed()).toBe(true)

    // Buscar elementos que contengan texto de formulario 10-K
    const filingBadge = await filingsPanel.$('span=10-K')
    await filingBadge.waitForDisplayed({ timeout: 10000 })
    expect(await filingBadge.isDisplayed()).toBe(true)
  })
})
