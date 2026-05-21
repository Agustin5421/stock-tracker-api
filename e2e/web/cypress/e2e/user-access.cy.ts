const API_URL = 'http://localhost:8080'

describe('Acceso de usuarios', () => {
  it('Registro de nuevo usuario con correo y contraseña', () => {
    const email = `test_${Date.now()}@example.com`
    const password = 'Password123!'

    cy.visit('/#/register')
    cy.contains('Crear cuenta').should('be.visible')

    cy.get('input[type="email"]').type(email)
    cy.get('input[type="password"]').type(password)
    cy.contains('button[type="submit"]', 'Crear cuenta').click()

    cy.contains('Cuenta creada exitosamente. Ya podes iniciar sesion.').should('be.visible')
    cy.location('hash').should('eq', '#/login')
  })

  it('Inicio de sesión con credenciales válidas', () => {
    const email = `test_${Date.now()}@example.com`
    const password = 'Password123!'

    cy.request('POST', `${API_URL}/auth/register`, { email, password })

    cy.visit('/#/login')

    cy.get('input[type="email"]').type(email)
    cy.get('input[type="password"]').type(password)
    cy.contains('button[type="submit"]', 'Iniciar sesion').click()

    cy.location('hash').should('eq', '#/home')
    cy.contains('h1', 'Bienvenido!').should('be.visible')
  })

  it('Rechazo de credenciales inválidas', () => {
    const email = `nonexistent_${Date.now()}@example.com`
    const password = 'WrongPassword!'

    cy.visit('/#/login')

    cy.get('input[type="email"]').type(email)
    cy.get('input[type="password"]').type(password)
    cy.contains('button[type="submit"]', 'Iniciar sesion').click()

    cy.location('hash').should('eq', '#/login')
    cy.get('.bg-red-50').should('be.visible').and('not.be.empty')
  })

  it('Cierre de sesión', () => {
    const email = `test_${Date.now()}@example.com`
    const password = 'Password123!'

    cy.request('POST', `${API_URL}/auth/register`, { email, password })

    cy.visit('/#/login')
    cy.get('input[type="email"]').type(email)
    cy.get('input[type="password"]').type(password)
    cy.contains('button[type="submit"]', 'Iniciar sesion').click()
    cy.location('hash').should('eq', '#/home')

    cy.contains('button', 'Cerrar sesion').click()
    cy.location('hash').should('eq', '#/login')

    cy.visit('/#/home')
    cy.location('hash').should('eq', '#/login')
  })

  it('Persistencia de información entre sesiones', () => {
    const email = `test_${Date.now()}@example.com`
    const password = 'Password123!'

    cy.request('POST', `${API_URL}/auth/register`, { email, password })

    cy.visit('/#/login')
    cy.get('input[type="email"]').type(email)
    cy.get('input[type="password"]').type(password)
    cy.contains('button[type="submit"]', 'Iniciar sesion').click()

    cy.location('hash').should('eq', '#/home')
    cy.contains('h1', 'Bienvenido!').should('be.visible')

    cy.contains('button', 'Cerrar sesion').click()
    cy.location('hash').should('eq', '#/login')

    cy.get('input[type="email"]').type(email)
    cy.get('input[type="password"]').type(password)
    cy.contains('button[type="submit"]', 'Iniciar sesion').click()

    cy.location('hash').should('eq', '#/home')
    cy.contains('h1', 'Bienvenido!').should('be.visible')
  })
})
