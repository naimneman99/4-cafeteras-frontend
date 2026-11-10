import { describe, test, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';

// El producto de referencia del enunciado del TP3
const expresoMedianoColombia = {
  id: 5,
  tipo: 'expreso',
  nombre: 'Expreso Mediano',
  tamanio: 'Mediano',
  gramosCafe: 27,
  variedad: {
    nombre: 'Colombia',
    descripcion: 'Acidez media, cuerpo equilibrado y notas cítricas y florales',
  },
  precio: 7360,
};

describe('GET /productos devuelve precio y tipo', () => {
  test('cada producto trae su tipo: 9 expresos, 9 filtrados y 2 de pastelería', async () => {
    const res = await request(app).get('/productos');
    const tipos: string[] = res.body.map((p: { tipo: string }) => p.tipo);

    expect(res.status).toBe(200);
    expect(tipos.filter((t) => t === 'expreso')).toHaveLength(9);
    expect(tipos.filter((t) => t === 'filtrado')).toHaveLength(9);
    expect(tipos.filter((t) => t === 'pasteleria')).toHaveLength(2);
  });

  test('el expreso mediano de Colombia viene como en el contrato', async () => {
    const res = await request(app).get('/productos');
    expect(res.body).toContainEqual(expresoMedianoColombia);
  });

  test('un filtrado trae sus gramos, su origen y el precio calculado por la API', async () => {
    const res = await request(app).get('/productos');
    expect(res.body).toContainEqual({
      id: 18,
      tipo: 'filtrado',
      nombre: 'Filtrado Taza grande',
      tamanio: 'Taza grande',
      gramosCafe: 25,
      variedad: {
        nombre: 'Etiopía',
        descripcion: 'Acidez muy viva, cuerpo ligero y notas frutales',
      },
      precio: 9200,
    });
  });

  test('cada origen trae su descripción', async () => {
    const res = await request(app).get('/productos');
    expect(res.body).toContainEqual(
      expect.objectContaining({
        variedad: { nombre: 'Brasil', descripcion: 'Acidez baja, cuerpo denso y notas de avellana' },
      })
    );
  });

  test('la pastelería trae su nombre y su precio', async () => {
    const res = await request(app).get('/productos');
    expect(res.body).toContainEqual({ id: 19, tipo: 'pasteleria', nombre: 'Muffin de chocolate', precio: 2500 });
    expect(res.body).toContainEqual({ id: 20, tipo: 'pasteleria', nombre: 'Porción de torta selva negra', precio: 4200 });
  });
});

describe('GET /productos/:id devuelve precio y tipo', () => {
  test('devuelve el producto con el mismo formato que la lista', async () => {
    const res = await request(app).get('/productos/5');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(expresoMedianoColombia);
  });
});
