import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: false,
    env: {
      apiUrl: process.env.NEXT_PUBLIC_API_URL,
    },
  },
})
