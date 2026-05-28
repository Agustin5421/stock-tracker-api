describe('Filings recientes de empresa', () => {
  beforeEach(() => {
    const email = `filings_${Date.now()}@example.com`
    const password = 'Password123!'

    cy.request('POST', `${Cypress.env('apiUrl')}/auth/register`, { email, password })
    cy.visit('/#/login')
    cy.get('input[type="email"]').type(email)
    cy.get('input[type="password"]').type(password)
    cy.contains('button[type="submit"]', 'Iniciar sesion').click()
    cy.location('hash').should('eq', '#/home')
  })

  it('Panel de filings muestra contenido para Apple', () => {
    cy.get('[data-testid="company-search-input"]').type('AAPL')
    cy.get('[data-testid="company-result-320193"]', { timeout: 10000 }).should('be.visible').click()
    cy.contains('Filings Recientes').click()
    cy.get('[data-testid="company-filings-content"]', { timeout: 20000 }).should('be.visible')
  })

  it('Cada filing muestra un tipo de reporte', () => {
    cy.get('[data-testid="company-search-input"]').type('AAPL')
    cy.get('[data-testid="company-result-320193"]', { timeout: 10000 }).should('be.visible').click()
    cy.contains('Filings Recientes').click()
    cy.get('[data-testid="company-filings-content"]', { timeout: 20000 }).should('be.visible')
    cy.get('[data-testid="company-filings-panel"]').contains(/10-K|10-Q/).should('be.visible')
  })

  it('Cada filing muestra una fecha', () => {
    cy.get('[data-testid="company-search-input"]').type('AAPL')
    cy.get('[data-testid="company-result-320193"]', { timeout: 10000 }).should('be.visible').click()
    cy.contains('Filings Recientes').click()
    cy.get('[data-testid="company-filings-content"]', { timeout: 20000 }).should('be.visible')
    cy.get('[data-testid="company-filings-panel"]').contains(/\d{4}/).should('be.visible')
  })

  it('Deseleccionar empresa oculta el panel de filings', () => {
    cy.get('[data-testid="company-search-input"]').type('AAPL')
    cy.get('[data-testid="company-result-320193"]', { timeout: 10000 }).should('be.visible').click()
    cy.contains('Filings Recientes').click()
    cy.get('[data-testid="company-filings-panel"]').should('be.visible')
    cy.get('[data-testid="company-result-320193"]').click()
    cy.get('[data-testid="company-filings-panel"]').should('not.exist')
  })

  it('Cambiar de tab vuelve a métricas', () => {
    cy.get('[data-testid="company-search-input"]').type('AAPL')
    cy.get('[data-testid="company-result-320193"]', { timeout: 10000 }).should('be.visible').click()
    cy.contains('Filings Recientes').click()
    cy.get('[data-testid="company-filings-panel"]').should('be.visible')
    cy.contains('Métricas Financieras').click()
    cy.get('[data-testid="company-metrics-panel"]').should('be.visible')
  })
})
