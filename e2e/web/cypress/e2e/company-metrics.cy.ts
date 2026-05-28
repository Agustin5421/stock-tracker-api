describe('Métricas financieras de empresa', () => {
  beforeEach(() => {
    const email = `metrics_${Date.now()}@example.com`
    const password = 'Password123!'

    cy.request('POST', `${Cypress.env('apiUrl')}/auth/register`, { email, password })
    cy.visit('/#/login')
    cy.get('input[type="email"]').type(email)
    cy.get('input[type="password"]').type(password)
    cy.contains('button[type="submit"]', 'Iniciar sesion').click()
    cy.location('hash').should('eq', '#/home')
  })

  it('Seleccionar empresa muestra el panel de métricas', () => {
    cy.get('[data-testid="company-search-input"]').type('AAPL')
    cy.get('[data-testid="company-result-320193"]', { timeout: 10000 }).should('be.visible').click()
    cy.get('[data-testid="company-metrics-panel"]').should('be.visible')
  })

  it('Panel de métricas muestra las etiquetas correctas', () => {
    cy.get('[data-testid="company-search-input"]').type('AAPL')
    cy.get('[data-testid="company-result-320193"]', { timeout: 10000 }).should('be.visible').click()
    cy.get('[data-testid="company-metrics-content"]', { timeout: 20000 }).should('be.visible')
    cy.get('[data-testid="company-metrics-panel"]').within(() => {
      cy.contains('Ingresos').should('be.visible')
      cy.contains('Utilidad Neta').should('be.visible')
      cy.contains('Ganancias por Acción').should('be.visible')
      cy.contains('Activos Totales').should('be.visible')
      cy.contains('Pasivos Totales').should('be.visible')
    })
  })

  it('Métricas de Apple muestran valores numéricos', () => {
    cy.get('[data-testid="company-search-input"]').type('AAPL')
    cy.get('[data-testid="company-result-320193"]', { timeout: 10000 }).should('be.visible').click()
    cy.get('[data-testid="company-metrics-content"]', { timeout: 20000 }).should('be.visible')
    cy.get('[data-testid="company-metrics-content"]').contains(/\$[0-9]/)
  })

  it('Deseleccionar empresa oculta el panel de métricas', () => {
    cy.get('[data-testid="company-search-input"]').type('AAPL')
    cy.get('[data-testid="company-result-320193"]', { timeout: 10000 }).should('be.visible').click()
    cy.get('[data-testid="company-metrics-panel"]').should('be.visible')
    cy.get('[data-testid="company-result-320193"]').click()
    cy.get('[data-testid="company-metrics-panel"]').should('not.exist')
  })

  it('Cambiar empresa actualiza las métricas', () => {
    cy.get('[data-testid="company-search-input"]').type('AAPL')
    cy.get('[data-testid="company-result-320193"]', { timeout: 10000 }).should('be.visible').click()
    cy.get('[data-testid="company-metrics-content"]', { timeout: 20000 }).should('be.visible')

    cy.get('[data-testid="company-search-input"]').clear().type('MSFT')
    cy.get('[data-testid="company-search-results"]', { timeout: 10000 }).contains('MSFT').click()
    cy.get('[data-testid="company-metrics-panel"]', { timeout: 20000 }).should('be.visible')
  })
})
