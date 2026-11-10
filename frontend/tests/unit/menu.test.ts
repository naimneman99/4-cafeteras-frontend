import { describe, test, expect } from 'vitest';
import { buscarCafe, nombreVisible, opcionesCafe } from '../../src/utils/menu';
import { productoPorId, productos } from '../fixtures/productos';

describe('opcionesCafe: las opciones de los tres pasos salen del catálogo', () => {
  test('bebidas, tamaños y orígenes sin repetir, en el orden del catálogo', () => {
    expect(opcionesCafe(productos)).toEqual({
      bebidas: ['expreso', 'filtrado'],
      tamanios: ['Pocillo', 'Mediano', 'Taza grande'],
      origenes: [
        { nombre: 'Brasil', descripcion: 'Acidez baja, cuerpo denso y notas de avellana' },
        { nombre: 'Colombia', descripcion: 'Acidez media, cuerpo equilibrado y notas cítricas y florales' },
        { nombre: 'Etiopía', descripcion: 'Acidez muy viva, cuerpo ligero y notas frutales' },
      ],
    });
  });

  test('sin cafés en el catálogo no hay opciones', () => {
    expect(opcionesCafe([productoPorId(19)])).toEqual({ bebidas: [], tamanios: [], origenes: [] });
  });
});

describe('buscarCafe: el café que corresponde a la elección', () => {
  test('expreso mediano de Colombia es el producto 5, a $7.360', () => {
    const cafe = buscarCafe(productos, { bebida: 'expreso', tamanio: 'Mediano', origen: 'Colombia' });
    expect(cafe).toEqual(productoPorId(5));
    expect(cafe?.precio).toBe(7360);
  });

  test('filtrado taza grande de Etiopía es el producto 18', () => {
    const cafe = buscarCafe(productos, { bebida: 'filtrado', tamanio: 'Taza grande', origen: 'Etiopía' });
    expect(cafe?.id).toBe(18);
  });

  test.each([
    { bebida: null, tamanio: 'Mediano', origen: 'Colombia' },
    { bebida: 'expreso' as const, tamanio: null, origen: 'Colombia' },
    { bebida: 'expreso' as const, tamanio: 'Mediano', origen: null },
  ])('mientras falte una elección no hay café: %j', (eleccion) => {
    expect(buscarCafe(productos, eleccion)).toBeUndefined();
  });
});

describe('nombreVisible: cómo se ve un producto en el pedido', () => {
  test('un café lleva su origen', () => {
    expect(nombreVisible(productoPorId(5))).toBe('Expreso Mediano · Colombia');
  });

  test('la pastelería usa su nombre', () => {
    expect(nombreVisible(productoPorId(19))).toBe('Muffin de chocolate');
  });
});
