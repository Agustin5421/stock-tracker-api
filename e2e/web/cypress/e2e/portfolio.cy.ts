// Drives the whole portfolio feature through the real UI:
//   US-012 (buy), US-013 (view), US-014 (sell),
//   US-015 (operation history), US-016 (last price update), US-017 (P&L per position).
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

  function sell(ticker: string, quantity: number) {
    cy.get('[data-testid="sell-ticker-trigger"]').click()
    cy.get('[data-testid="sell-position-option"]').contains(ticker).click()
    cy.get('[data-testid="sell-quantity-input"]').clear().type(`${quantity}`)
    cy.get('[data-testid="sell-submit-button"]').click()
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

  // ---- US-015 — Consultar historial de operaciones ----

  it('Sin operaciones, el historial muestra el estado vacío', () => {
    login(`pf_hist_empty_${Date.now()}@example.com`)
    cy.get('[data-testid="operations-empty"]').should('be.visible')
  })

  it('Comprar registra la operación en el historial', () => {
    seedPrice('AAPL', 189.42)
    login(`pf_hist_buy_${Date.now()}@example.com`)

    buy('AAPL', 10)
    cy.contains('Compraste 10 acciones de AAPL').should('be.visible')

    cy.get('[data-testid="operations-content"]').should('be.visible')
    cy.get('[data-testid="operation-row"]')
      .should('have.length', 1)
      .first()
      .should('contain', 'Compra')
      .and('contain', 'AAPL')
      .and('contain', '10')
  })

  it('El historial ordena las operaciones por fecha, la más reciente primero', () => {
    seedPrice('MSFT', 300)
    login(`pf_hist_order_${Date.now()}@example.com`)

    buy('MSFT', 10)
    cy.contains('Compraste 10 acciones de MSFT').should('be.visible')
    // operations.executed_at has second precision (DATETIME), so the buy and the
    // sell must land in different seconds for the desc ordering to be deterministic.
    cy.wait(1100)
    sell('MSFT', 4)
    cy.get('[data-testid="sell-success"]').should('contain', 'Vendiste 4')

    cy.get('[data-testid="operation-row"]').should('have.length', 2)
    // The sale is the most recent operation, so it appears first.
    cy.get('[data-testid="operation-row"]')
      .first()
      .should('contain', 'Venta')
      .and('contain', 'MSFT')
  })

  // ---- US-016 — Visualizar última actualización de precios ----

  it('La valuación muestra cuándo se actualizaron los precios', () => {
    seedPrice('AAPL', 189.42)
    login(`pf_priceupd_${Date.now()}@example.com`)

    buy('AAPL', 1)
    cy.get('[data-testid="portfolio-content"]').should('be.visible')
    cy.get('[data-testid="portfolio-prices-updated-at"]').should('contain', 'Precios actualizados:')
  })

  // ---- US-017 — Consultar ganancia o pérdida por posición ----

  it('Muestra ganancia por posición usando costo promedio ponderado', () => {
    seedPrice('AAPL', 100)
    login(`pf_pnl_gain_${Date.now()}@example.com`)

    buy('AAPL', 2)
    cy.contains('Compraste 2 acciones de AAPL').should('be.visible')

    // A newer, higher stored price; the second buy re-fetches the portfolio.
    seedPrice('AAPL', 200)
    buy('AAPL', 2)

    cy.get('[data-testid="portfolio-position"]').should('contain', 'AAPL').and('contain', '4')
    // Weighted average cost: (2*100 + 2*200) / 4 = 150.
    cy.get('[data-testid="position-avg-cost"]').should('contain', '150,00')
    // Unrealized P&L: (200 - 150) * 4 = +200 (+33,33%).
    cy.get('[data-testid="position-pnl"]')
      .should('contain', '+$200,00')
      .and('have.class', 'text-green-600')
    cy.get('[data-testid="position-pnl-percent"]').should('contain', '+33,33%')
  })

  it('Muestra pérdida por posición cuando el precio cae', () => {
    seedPrice('TSLA', 200)
    login(`pf_pnl_loss_${Date.now()}@example.com`)

    buy('TSLA', 2)
    cy.contains('Compraste 2 acciones de TSLA').should('be.visible')

    // A newer, lower stored price; the second buy re-fetches the portfolio.
    seedPrice('TSLA', 100)
    buy('TSLA', 2)

    cy.get('[data-testid="portfolio-position"]').should('contain', 'TSLA').and('contain', '4')
    // Weighted average cost: (2*200 + 2*100) / 4 = 150.
    cy.get('[data-testid="position-avg-cost"]').should('contain', '150,00')
    // Unrealized P&L: (100 - 150) * 4 = -200 (-33,33%).
    cy.get('[data-testid="position-pnl"]')
      .should('contain', '-$200,00')
      .and('have.class', 'text-red-600')
    cy.get('[data-testid="position-pnl-percent"]').should('contain', '-33,33%')
  })
})
