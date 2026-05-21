describe('Busqueda de empresas', () => {
  beforeEach(() => {
    const email = `search_${Date.now()}@example.com`
    const password = 'Password123!'

    cy.request('POST', `${Cypress.env('apiUrl')}/auth/register`, { email, password })
    cy.visit('/#/login')
    cy.get('input[type="email"]').type(email)
    cy.get('input[type="password"]').type(password)
    cy.contains('button[type="submit"]', 'Iniciar sesion').click()
    cy.location('hash').should('eq', '#/home')
  })

  it('Muestra el campo de busqueda en el dashboard', () => {
    cy.get('[data-testid="company-search-input"]').should('be.visible')
  })

  it('Lista empresas por defecto al cargar', () => {
    cy.get('[data-testid="company-search-results"]', { timeout: 10000 }).should('be.visible')
    cy.get('[data-testid="company-search-results"] li').should('have.length.greaterThan', 0)
  })

  it('Busqueda por ticker retorna resultados', () => {
    cy.get('[data-testid="company-search-input"]').type('AAPL')
    cy.get('[data-testid="company-search-results"]', { timeout: 10000 }).contains('AAPL')
  })

  it('Busqueda por ticker retorna multiples coincidencias', () => {
    cy.get('[data-testid="company-search-input"]').type('APP')
    cy.get('[data-testid="company-search-results"] li', { timeout: 10000 }).should(
      'have.length.greaterThan',
      1,
    )
  })

  it('Busqueda por nombre retorna resultados', () => {
    cy.get('[data-testid="company-search-input"]').type('Apple')
    cy.get('[data-testid="company-search-results"] li', { timeout: 10000 }).should(
      'have.length.greaterThan',
      0,
    )
  })

  it('Limpiar busqueda restaura listado completo', () => {
    cy.get('[data-testid="company-search-input"]').type('AAPL')
    cy.get('[data-testid="company-search-input"]').clear()
    cy.get('[data-testid="company-search-results"] li', { timeout: 10000 }).should(
      'have.length.greaterThan',
      0,
    )
  })

  it('Busqueda sin resultados muestra mensaje de estado vacio', () => {
    cy.get('[data-testid="company-search-input"]').type('ZZZNOTEXIST99')
    cy.contains('No se encontraron resultados.', { timeout: 10000 }).should('be.visible')
  })
})
