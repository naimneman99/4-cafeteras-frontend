import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // En desarrollo el front le habla a la API (puerto 3000) a través de este proxy
    proxy: {
      '/productos': 'http://localhost:3000',
      '/pedidos': 'http://localhost:3000',
    },
  },
  css: {
    preprocessorOptions: {
      // Bootstrap 5.3 todavía usa @import: se silencian sus avisos de deprecación
      scss: { quietDeps: true, silenceDeprecations: ['import'] },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    passWithNoTests: true,
  },
});
