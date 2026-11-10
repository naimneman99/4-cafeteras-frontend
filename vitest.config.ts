import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true, // habilita expect, describe, it, vi para los tests
  },
});
