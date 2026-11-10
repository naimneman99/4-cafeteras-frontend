import { defineConfig } from '@playwright/test';

// Los E2E corren en un celular de 375 px de ancho, como pide el TP,
// contra la API y el front reales (los levanta Playwright si no están corriendo)
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: 'http://localhost:5173',
    browserName: 'chromium',
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true,
    trace: 'retain-on-failure',
  },
  webServer: [
    {
      // La API del parcial con NODE_ENV=test, así existen /__test__/reset y /__test__/seed
      command: 'pnpm --dir .. start',
      url: 'http://localhost:3000/productos',
      env: { NODE_ENV: 'test' },
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'pnpm dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
    },
  ],
});
