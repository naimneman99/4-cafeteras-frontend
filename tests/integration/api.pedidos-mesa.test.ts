import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';
import { resetPedidos } from '../../src/services/pedido.service';

beforeEach(() => resetPedidos());

// El pedido de ejemplo del enunciado: mesa 4, dos expresos medianos de Colombia y un muffin
const pedidoMesa4 = {
  mesaId: 4,
  items: [
    { productoId: 5, cantidad: 2 },
    { productoId: 19, cantidad: 1 },
  ],
};

describe('POST /pedidos acepta mesaId opcional', () => {
  test('el pedido de la mesa 4: 201, pendiente, con su mesa y total 17220', async () => {
    const res = await request(app).post('/pedidos').send(pedidoMesa4);

    expect(res.status).toBe(201);
    expect(typeof res.body.id).toBe('number');
    expect(res.body).toMatchObject({ mesaId: 4, estado: 'pendiente', total: 17220 });
  });

  test('sin mesaId el pedido es para retirar en la barra', async () => {
    const res = await request(app).post('/pedidos').send({ items: pedidoMesa4.items });

    expect(res.status).toBe(201);
    expect(res.body.mesaId).toBeNull();
  });

  test.each([0, -3, 2.5, '4', 'mesa'])('mesaId %j es inválido: 400 con { error }', async (mesaId) => {
    const res = await request(app).post('/pedidos').send({ ...pedidoMesa4, mesaId });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'La mesa debe ser un número entero positivo.' });
  });

  test('un pedido con mesa inválida no queda guardado', async () => {
    await request(app).post('/pedidos').send({ ...pedidoMesa4, mesaId: -1 });

    const res = await request(app).get('/pedidos');
    expect(res.body).toEqual([]);
  });
});

describe('GET /pedidos/:id para seguir el pedido', () => {
  test('devuelve la mesa, el estado, los ítems con su producto y subtotal, y el total', async () => {
    const creado = await request(app).post('/pedidos').send(pedidoMesa4);

    const res = await request(app).get(`/pedidos/${creado.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: creado.body.id,
      mesaId: 4,
      estado: 'pendiente',
      items: [
        {
          producto: expect.objectContaining({ id: 5, tipo: 'expreso', nombre: 'Expreso Mediano', precio: 7360 }),
          cantidad: 2,
          subtotal: 14720,
        },
        {
          producto: { id: 19, tipo: 'pasteleria', nombre: 'Muffin de chocolate', precio: 2500 },
          cantidad: 1,
          subtotal: 2500,
        },
      ],
      total: 17220,
    });
  });
});
