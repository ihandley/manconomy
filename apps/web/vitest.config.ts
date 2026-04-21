import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    include: ['lib/**/*.test.ts', 'lib/**/*.test.tsx'],
    exclude: ['tests/e2e/**', 'node_modules/**'],
  },
})