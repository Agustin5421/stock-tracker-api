describe('Métricas históricas de empresa', () => {
  beforeEach(() => {
    const email = `historical_${Date.now()}@example.com`
    const password = 'Password123!'

    cy.request('POST', `${Cypress.env('apiUrl')}/auth/register`, { email, password })
    cy.visit('/#/login')
    cy.get('input[type="email"]').type(email)
    cy.get('input[type="password"]').type(password)
    cy.contains('button[type="submit"]', 'Iniciar sesion').click()
    cy.location('hash').should('eq', '#/home')
  })

  it('Seleccionar empresa muestra el tab Histórico', () => {
    cy.get('[data-testid="company-search-input"]').type('AAPL')
    cy.get('[data-testid="company-result-320193"]', { timeout: 10000 }).should('be.visible').click()
    cy.contains('Histórico').should('be.visible')
  })

  it('Tab Histórico muestra el panel de métricas históricas', () => {
    cy.get('[data-testid="company-search-input"]').type('AAPL')
    cy.get('[data-testid="company-result-320193"]', { timeout: 10000 }).should('be.visible').click()
    cy.contains('Histórico').click()
    cy.get('[data-testid="company-historical-metrics-panel"]').should('be.visible')
  })

  it('Gráfico de evolución se muestra con datos de Apple', () => {
    cy.get('[data-testid="company-search-input"]').type('AAPL')
    cy.get('[data-testid="company-result-320193"]', { timeout: 10000 }).should('be.visible').click()
    cy.contains('Histórico').click()
    cy.get('[data-testid="company-historical-metrics-content"]', { timeout: 20000 }).should(
      'be.visible',
    )
  })

  it('Cambiar métrica actualiza el gráfico', () => {
    cy.get('[data-testid="company-search-input"]').type('AAPL')
    cy.get('[data-testid="company-result-320193"]', { timeout: 10000 }).should('be.visible').click()
    cy.contains('Histórico').click()
    cy.get('[data-testid="company-historical-metrics-content"]', { timeout: 20000 }).should(
      'be.visible',
    )
    cy.get('[data-testid="company-historical-metrics-selector"]').click()
    cy.contains('Utilidad Neta').click()
    cy.get('[data-testid="company-historical-metrics-content"]', { timeout: 20000 }).should(
      'be.visible',
    )
  })

  it('Panel desaparece al deseleccionar empresa', () => {
    cy.get('[data-testid="company-search-input"]').type('AAPL')
    cy.get('[data-testid="company-result-320193"]', { timeout: 10000 }).should('be.visible').click()
    cy.contains('Histórico').click()
    cy.get('[data-testid="company-historical-metrics-panel"]').should('be.visible')
    cy.get('[data-testid="company-result-320193"]').click()
    cy.get('[data-testid="company-historical-metrics-panel"]').should('not.exist')
  })
})
