// Drives US-012 (buy), US-013 (view) and US-014 (sell) through the real UI.
// Requires the API to run with the `e2e` Spring profile so POST /test/prices
// (the deterministic price seed) is available. CI sets SPRING_PROFILES_ACTIVE=e2e;
// locally start the API the same way before running this spec.

describe('Gestión del portfolio', () => {
  const password = 'Password123!'

  function login(email: string) {
    cy.request('POST', `${Cypress.env('apiUrl')}/auth/register`, { email, password })
    cy.visit('/#/login')
    cy.get('input[type="email"]').type(email)
    cy.get('input[type="password"]').type(password)
    cy.contains('button[type="submit"]', 'Iniciar sesion').click()
    cy.location('hash').should('eq', '#/home')
  }

  function seedPrice(ticker: string, price: number) {
    cy.request('POST', `${Cypress.env('apiUrl')}/test/prices`, { ticker, price })
  }

  function buy(ticker: string, quantity: number) {
    cy.get('#buy-ticker').click()
    cy.get('[cmdk-item]', { timeout: 20000 }).contains(ticker).click()
    cy.get('#buy-quantity').clear().type(`${quantity}`)
    cy.contains('button', 'Comprar').click()
  }

  it('Portfolio vacío muestra el estado inicial', () => {
    login(`pf_empty_${Date.now()}@example.com`)
    cy.get('[data-testid="portfolio-empty"]').should('be.visible')
  })

  it('Comprar una acción la muestra en el portfolio', () => {
    seedPrice('AAPL', 189.42)
    login(`pf_buy_${Date.now()}@example.com`)

    buy('AAPL', 10)

    cy.contains('Compraste 10 acciones de AAPL').should('be.visible')
    cy.get('[data-testid="portfolio-content"]').should('be.visible')
    cy.get('[data-testid="portfolio-position"]').should('contain', 'AAPL').and('contain', '10')
  })

  it('Vender parte de una posición reduce la cantidad', () => {
    seedPrice('MSFT', 300)
    login(`pf_sell_${Date.now()}@example.com`)

    buy('MSFT', 10)
    cy.contains('Compraste 10 acciones de MSFT').should('be.visible')

    cy.get('[data-testid="sell-ticker-trigger"]').click()
    cy.get('[data-testid="sell-position-option"]').contains('MSFT').click()
    cy.get('[data-testid="sell-quantity-input"]').clear().type('4')
    cy.get('[data-testid="sell-submit-button"]').click()

    cy.get('[data-testid="sell-success"]').should('contain', 'Vendiste 4').and('contain', 'MSFT')
    cy.get('[data-testid="portfolio-position"]').should('contain', 'MSFT').and('contain', '6')
  })

  it('No permite vender más acciones de las disponibles', () => {
    seedPrice('NVDA', 120)
    login(`pf_oversell_${Date.now()}@example.com`)

    buy('NVDA', 2)
    cy.contains('Compraste 2 acciones de NVDA').should('be.visible')

    cy.get('[data-testid="sell-ticker-trigger"]').click()
    cy.get('[data-testid="sell-position-option"]').contains('NVDA').click()
    cy.get('[data-testid="sell-quantity-input"]').clear().type('5')
    cy.get('[data-testid="sell-submit-button"]').click()

    // Over-selling is rejected (native max on the quantity input + guards): no
    // sale is registered, so the position stays at 2.
    cy.get('[data-testid="sell-success"]').should('not.exist')
    cy.get('[data-testid="portfolio-position"]').should('contain', 'NVDA').and('contain', '2')
  })
})
