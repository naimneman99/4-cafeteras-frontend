import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';
import { resetPedidos } from '../../src/services/pedido.service';

beforeEach(() => resetPedidos());

describe('Todos los errores responden { error: "mensaje" }', () => {
  test('producto inexistente: 404', async () => {
    const res = await request(app).get('/productos/9999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Producto no encontrado' });
  });

  test('id de producto que no es un número: 404, nunca 500', async () => {
    const res = await request(app).get('/productos/abc');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Producto no encontrado' });
  });

  test('pedido inexistente: 404', async () => {
    const res = await request(app).get('/pedidos/9999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Pedido no encontrado' });
  });

  test('pedido con un producto inexistente: 400', async () => {
    const res = await request(app).post('/pedidos').send({ items: [{ productoId: 9999, cantidad: 1 }] });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'El producto 9999 no existe.' });
  });

  test('pedido sin items: 400', async () => {
    const res = await request(app).post('/pedidos').send({});
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'El pedido debe tener al menos un item.' });
  });

  test('cantidad inválida: 400', async () => {
    const res = await request(app).post('/pedidos').send({ items: [{ productoId: 1, cantidad: 0 }] });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Cantidad inválida para el producto 1.' });
  });

  test('item mal armado: 400 con un mensaje claro', async () => {
    const res = await request(app).post('/pedidos').send({ items: [null] });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Cada item necesita productoId y cantidad.' });
  });

  test('reporte sin ventas: 404', async () => {
    const res = await request(app).get('/reportes/mas-vendido');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Todavía no hay ventas' });
  });

  test('JSON mal formado: 400', async () => {
    const res = await request(app)
      .post('/pedidos')
      .set('Content-Type', 'application/json')
      .send('{"items": [');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'El cuerpo de la solicitud no es un JSON válido.' });
  });

  test('ruta inexistente: 404', async () => {
    const res = await request(app).get('/no-existe');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Ruta no encontrada: GET /no-existe' });
  });
});