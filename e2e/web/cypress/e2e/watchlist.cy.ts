describe('Watchlist y Comparacion (Feature 4)', () => {
  beforeEach(() => {
    const email = `watchlist_cy_${Date.now()}@example.com`
    const password = 'Password123!'

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
    cy.intercept('GET', '**/watchlist**').as('getWatchlist')

    cy.get('[data-testid="company-search-input"]').type('AAPL')
    cy.get('[data-testid="company-result-320193"]', { timeout: 10000 }).should('be.visible')
    cy.wait(500)
    cy.get('[data-testid="company-result-320193"]').click()

    cy.get('[data-testid="watchlist-toggle"]').should('be.visible').click()
    cy.wait('@getWatchlist')

    cy.get('[data-testid="watchlist-view"]').should('be.visible')
    cy.get('[data-testid="watchlist-item-AAPL"]').should('be.visible')
        .and('contain', 'AAPL')

    cy.get('[data-testid="watchlist-toggle"]').should('have.attr', 'data-saved', 'true')

    cy.get('[data-testid="watchlist-item-AAPL-remove"]').click()
    cy.wait('@getWatchlist')

    cy.get('[data-testid="watchlist-item-AAPL"]').should('not.exist')
    cy.get('[data-testid="watchlist-empty-message"]').should('be.visible')
  })

  it('US-022: Deberia permitir seleccionar varias empresas y comparar sus metricas', () => {
    cy.intercept('GET', '**/watchlist**').as('getWatchlist')

    // 1. Agregar AAPL
    cy.get('[data-testid="company-search-input"]').type('AAPL')
    cy.get('[data-testid="company-result-320193"]', { timeout: 10000 }).should('be.visible')
    cy.wait(500)
    cy.get('[data-testid="company-result-320193"]').click()
    cy.get('[data-testid="watchlist-toggle"]').click()
    cy.wait('@getWatchlist')

    cy.get('[data-testid="company-search-input"]').clear()

    // 2. Agregar MSFT
    cy.get('[data-testid="company-search-input"]').type('MSFT')
    cy.get('[data-testid="company-result-789019"]', { timeout: 10000 }).should('be.visible')
    cy.wait(500)
    cy.get('[data-testid="company-result-789019"]').click()
    cy.get('[data-testid="watchlist-toggle"]').click()
    cy.wait('@getWatchlist')

    // 3. Ver que ambas están en la watchlist
    cy.get('[data-testid="watchlist-item-AAPL"]').should('be.visible')
    cy.get('[data-testid="watchlist-item-MSFT"]').should('be.visible')

    // 4. Seleccionar ambas para comparación
    cy.get('[data-testid="watchlist-item-AAPL-checkbox"]').click()
    cy.get('[data-testid="watchlist-item-MSFT-checkbox"]').click()

    // 5. Clickear botón de comparar
    cy.get('[data-testid="watchlist-compare-button"]').should('not.be.disabled').click()

    // 6. Validar tabla comparativa
    cy.get('[data-testid="watchlist-comparison-panel"]', { timeout: 15000 }).should('be.visible')
    cy.get('[data-testid="comparison-header-AAPL"]').should('be.visible')
    cy.get('[data-testid="comparison-header-MSFT"]').should('be.visible')

    cy.get('[data-testid="comparison-row-revenue"]').should('be.visible')
    cy.get('[data-testid="comparison-row-netIncome"]').should('be.visible')
  })
})