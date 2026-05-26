import { defineConfig } from 'cypress'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '../../web/.env') })

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
