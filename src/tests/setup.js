// Configuración global para las pruebas
import { vi } from 'vitest'

// Mock global para console.error para evitar ruido en las pruebas
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
}

// Mock para import.meta.env
Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: {
        VITE_API_URL: 'http://localhost:5162'
      }
    }
  }
})


beforeEach(() => {

  vi.clearAllMocks()
})
