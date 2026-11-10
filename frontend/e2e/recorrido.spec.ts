import { test, expect, type Page } from '@playwright/test';

// La API real, levantada con NODE_ENV=test para tener reset y seed
const API = 'http://localhost:3000';

test.beforeEach(async ({ request }) => {
  expect((await request.post(`${API}/__test__/reset`)).ok()).toBe(true);
  expect((await request.post(`${API}/__test__/seed`)).ok()).toBe(true);
});

async function armarPedidoDeEjemplo(page: Page) {
  await page.getByRole('radio', { name: 'Expreso', exact: true }).check();
  await page.getByRole('radio', { name: 'Mediano', exact: true }).check();
  await page.getByRole('radio', { name: 'Colombia $7.360', exact: true }).check();
  await page.getByRole('button', { name: 'Agregar café' }).click();
  await page.getByRole('button', { name: 'Sumar uno de Expreso Mediano · Colombia' }).click();
  await page.getByRole('button', { name: 'Agregar Muffin de chocolate' }).click();
}

test('la mesa 4 pide dos expresos y un muffin, confirma y sigue el pedido', async ({ page }) => {
  await page.goto('/?mesa=4');
  await expect(page.getByRole('banner')).toContainText('Mesa 4');

  await armarPedidoDeEjemplo(page);
  await expect(page.getByLabel('Cantidad de Expreso Mediano · Colombia')).toHaveText('2');

  await page.getByRole('button', { name: 'Confirmar pedido' }).click();

  const recibo = page.getByRole('region', { name: 'Pedido N° 1' });
  await expect(recibo).toContainText('pendiente');
  await expect(recibo).toContainText('$17.220');

  await page.getByRole('button', { name: 'Actualizar estado' }).click();
  await expect(page.getByRole('status')).toHaveText('Sin cambios: el pedido sigue pendiente');
});

test('en un celular de 375 px no hay scroll horizontal', async ({ page }) => {
  await page.goto('/?mesa=4');
  await armarPedidoDeEjemplo(page);

  const anchoDelDocumento = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(anchoDelDocumento).toBeLessThanOrEqual(375);
});
