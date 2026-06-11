describe('Watchlist y Comparacion (Feature 4)', () => {
  beforeEach(() => {
    const email = `watchlist_cy_${Date.now()}@example.com`
    const password = 'Password123!'

    // Register user via API for fast testing
    cy.request('POST', `${Cypress.env('apiUrl')}/auth/register`, { email, password })
    cy.visit('/#/login')
    cy.wait(500)
    cy.get('input[type="email"]').type(email)
    cy.get('input[type="password"]').type(password)
    cy.contains('button[type="submit"]', 'Iniciar sesion').click()
    cy.location('hash').should('eq', '#/home')
  })

  it('US-021: Deberia mostrar un mensaje informando si la watchlist esta vacia', () => {
    cy.get('[data-testid="watchlist-view"]').should('be.visible')
    cy.get('[data-testid="watchlist-empty-message"]').should('be.visible')
      .and('contain', 'No tienes empresas en seguimiento')
  })

  it('US-019 / US-020: Deberia agregar y eliminar una empresa de la watchlist', () => {
    // 1. Buscar AAPL
    cy.get('[data-testid="company-search-input"]').type('AAPL')
    cy.get('[data-testid="company-result-320193"]', { timeout: 10000 }).should('be.visible')
    
    // 2. Agregar desde el resultado o detalle. Hacemos click en Apple
    cy.get('[data-testid="company-result-320193"]').click()
    
    // 3. Debería ver el botón de toggle watchlist y clickearlo
    cy.get('[data-testid="watchlist-toggle"]').should('be.visible').click()
    
    // 4. Debería aparecer en la watchlist
    cy.get('[data-testid="watchlist-view"]').should('be.visible')
    cy.get('[data-testid="watchlist-item-AAPL"]').should('be.visible')
      .and('contain', 'AAPL')
      .and('contain', 'Apple Inc.')
      
    // 5. El botón de toggle debería cambiar de estado (p. ej. marcarse como guardado)
    cy.get('[data-testid="watchlist-toggle"]').should('have.attr', 'data-saved', 'true')
    
    // 6. Eliminarla desde el botón de la watchlist
    cy.get('[data-testid="watchlist-item-AAPL-remove"]').click()
    
    // 7. Ya no debería aparecer en la watchlist
    cy.get('[data-testid="watchlist-item-AAPL"]').should('not.exist')
    cy.get('[data-testid="watchlist-empty-message"]').should('be.visible')
  })

  it('US-022: Deberia permitir seleccionar varias empresas y comparar sus metricas', () => {
    // 1. Agregar AAPL
    cy.get('[data-testid="company-search-input"]').type('AAPL')
    cy.get('[data-testid="company-result-320193"]', { timeout: 10000 }).click()
    cy.get('[data-testid="watchlist-toggle"]').click()
    
    // Limpiar busqueda para buscar otra
    cy.get('[data-testid="company-search-input"]').clear()
    
    // 2. Agregar MSFT (CIK 789019)
    cy.get('[data-testid="company-search-input"]').type('MSFT')
    cy.get('[data-testid="company-result-789019"]', { timeout: 10000 }).click()
    cy.get('[data-testid="watchlist-toggle"]').click()
    
    // 3. Ver que ambas están en la watchlist
    cy.get('[data-testid="watchlist-item-AAPL"]').should('be.visible')
    cy.get('[data-testid="watchlist-item-MSFT"]').should('be.visible')
    
    // 4. Seleccionar ambas para comparación
    cy.get('[data-testid="watchlist-item-AAPL-checkbox"]').click()
    cy.get('[data-testid="watchlist-item-MSFT-checkbox"]').click()
    
    // 5. Clickear botón de comparar
    cy.get('[data-testid="watchlist-compare-button"]').should('be.visible').click()
    
    // 6. Validar que la tabla comparativa aparece con las columnas de ambas empresas
    cy.get('[data-testid="watchlist-comparison-panel"]', { timeout: 15000 }).should('be.visible')
    cy.get('[data-testid="comparison-header-AAPL"]').should('be.visible')
    cy.get('[data-testid="comparison-header-MSFT"]').should('be.visible')
    
    // Validar que se muestran métricas clave (p. ej. Ingresos y Utilidad Neta)
    cy.get('[data-testid="comparison-row-revenue"]').should('be.visible')
    cy.get('[data-testid="comparison-row-netIncome"]').should('be.visible')
  })
})
