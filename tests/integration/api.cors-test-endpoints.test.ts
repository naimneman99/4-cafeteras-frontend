import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';
import { resetPedidos } from '../../src/services/pedido.service';

beforeEach(() => resetPedidos());

const unPedido = { items: [{ productoId: 19, cantidad: 1 }] };

describe('CORS habilitado para el front', () => {
  test('el front en otro puerto puede leer las respuestas', async () => {
    const res = await request(app).get('/productos').set('Origin', 'http://localhost:5173');
    expect(res.headers['access-control-allow-origin']).toBe('*');
  });

  test('responde el preflight del POST /pedidos', async () => {
    const res = await request(app)
      .options('/pedidos')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'content-type');

    expect(res.status).toBe(204);
    expect(res.headers['access-control-allow-methods']).toContain('POST');
  });
});

describe('Rutas /__test__ para los E2E (solo con NODE_ENV=test)', () => {
  afterEach(() => {
    process.env.NODE_ENV = 'test';
  });

  test('POST /__test__/reset vacía los pedidos y reinicia los ids', async () => {
    await request(app).post('/pedidos').send(unPedido);
    await request(app).post('/pedidos').send(unPedido);

    const res = await request(app).post('/__test__/reset');
    expect(res.status).toBe(204);

    const pedidos = await request(app).get('/pedidos');
    expect(pedidos.body).toEqual([]);

    const nuevo = await request(app).post('/pedidos').send(unPedido);
    expect(nuevo.body.id).toBe(1);
  });

  test('POST /__test__/seed deja los datos iniciales: el catálogo completo y ningún pedido', async () => {
    await request(app).post('/pedidos').send(unPedido);

    const res = await request(app).post('/__test__/seed');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ productos: 20, pedidos: 0 });

    const pedidos = await request(app).get('/pedidos');
    expect(pedidos.body).toEqual([]);
  });

  test('fuera del entorno de test las rutas no existen', async () => {
    process.env.NODE_ENV = 'production';

    const res = await request(app).post('/__test__/reset');
    expect(res.status).toBe(404);
  });
});