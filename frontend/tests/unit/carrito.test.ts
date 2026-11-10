import { describe, test, expect } from 'vitest';
import {
  carritoReducer,
  carritoVacio,
  subtotalLinea,
  subtotalOrientativo,
  type EstadoCarrito,
} from '../../src/carrito/carrito';
import { productoPorId } from '../fixtures/productos';

const expreso = productoPorId(5); // $7.360
const muffin = productoPorId(19); // $2.500

const conItems = (...items: EstadoCarrito['items']): EstadoCarrito => ({ items });

describe('carritoReducer', () => {
  test('arranca vacío', () => {
    expect(carritoVacio).toEqual({ items: [] });
  });

  test('agregar un producto nuevo lo suma con cantidad 1', () => {
    const estado = carritoReducer(carritoVacio, { tipo: 'agregar', producto: muffin });
    expect(estado.items).toEqual([{ producto: muffin, cantidad: 1 }]);
  });

  test('agregar un producto que ya está aumenta su cantidad', () => {
    const estado = carritoReducer(conItems({ producto: muffin, cantidad: 1 }), { tipo: 'agregar', producto: muffin });
    expect(estado.items).toEqual([{ producto: muffin, cantidad: 2 }]);
  });

  test('sumar aumenta en uno la cantidad de ese producto', () => {
    const antes = conItems({ producto: expreso, cantidad: 1 }, { producto: muffin, cantidad: 1 });
    const estado = carritoReducer(antes, { tipo: 'sumar', productoId: expreso.id });
    expect(estado.items).toEqual([
      { producto: expreso, cantidad: 2 },
      { producto: muffin, cantidad: 1 },
    ]);
  });

  test('restar disminuye en uno la cantidad', () => {
    const estado = carritoReducer(conItems({ producto: expreso, cantidad: 3 }), { tipo: 'restar', productoId: expreso.id });
    expect(estado.items).toEqual([{ producto: expreso, cantidad: 2 }]);
  });

  test('restar nunca baja de 1: para sacar el producto está quitar', () => {
    const estado = carritoReducer(conItems({ producto: expreso, cantidad: 1 }), { tipo: 'restar', productoId: expreso.id });
    expect(estado.items).toEqual([{ producto: expreso, cantidad: 1 }]);
  });

  test('quitar saca el producto del carrito', () => {
    const antes = conItems({ producto: expreso, cantidad: 2 }, { producto: muffin, cantidad: 1 });
    const estado = carritoReducer(antes, { tipo: 'quitar', productoId: expreso.id });
    expect(estado.items).toEqual([{ producto: muffin, cantidad: 1 }]);
  });

  test('vaciar deja el carrito vacío', () => {
    const estado = carritoReducer(conItems({ producto: expreso, cantidad: 2 }), { tipo: 'vaciar' });
    expect(estado).toEqual(carritoVacio);
  });

  test('es puro: no modifica el estado anterior', () => {
    const antes = Object.freeze(conItems(Object.freeze({ producto: expreso, cantidad: 1 })));
    const despues = carritoReducer(antes, { tipo: 'sumar', productoId: expreso.id });
    expect(antes.items[0].cantidad).toBe(1);
    expect(despues).not.toBe(antes);
  });
});

describe('subtotales orientativos (el total real lo calcula la API)', () => {
  test('el subtotal de una línea es precio × cantidad', () => {
    expect(subtotalLinea({ producto: expreso, cantidad: 2 })).toBe(14720);
  });

  test('el subtotal general suma todas las líneas', () => {
    const items = conItems({ producto: expreso, cantidad: 2 }, { producto: muffin, cantidad: 1 }).items;
    expect(subtotalOrientativo(items)).toBe(17220);
  });

  test('con el carrito vacío es 0', () => {
    expect(subtotalOrientativo([])).toBe(0);
  });
});
