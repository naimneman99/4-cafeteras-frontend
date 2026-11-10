import { defineConfig } from 'vitest/config';

// Los tests de la API viven en tests/. El front tiene su propio Vitest en frontend/
export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'jsdom',
    globals: true,
  },
});
