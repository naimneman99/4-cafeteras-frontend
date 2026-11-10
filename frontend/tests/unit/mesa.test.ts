import { describe, test, expect } from 'vitest';
import { leerMesa } from '../../src/utils/mesa';

describe('leerMesa: la mesa sale del QR (?mesa=N)', () => {
  test.each([
    ['?mesa=4', 4],
    ['?mesa=12', 12],
    ['?idioma=es&mesa=7', 7],
  ])('%s es la mesa %i', (search, mesa) => {
    expect(leerMesa(search)).toBe(mesa);
  });

  test.each(['', '?mesa=', '?mesa=0', '?mesa=-3', '?mesa=2.5', '?mesa=abc', '?mesa=4abc', '?mesa=%204'])(
    '%j no es una mesa válida: el pedido es para retirar en la barra',
    (search) => {
      expect(leerMesa(search)).toBeNull();
    }
  );
});
