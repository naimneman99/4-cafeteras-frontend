import { describe, test, expect } from 'vitest';
import { formatearPrecio } from '../../src/utils/precio';

describe('formatearPrecio', () => {
  test.each([
    [7360, '$7.360'],
    [17220, '$17.220'],
    [2500, '$2.500'],
    [950, '$950'],
    [1234567, '$1.234.567'],
    [0, '$0'],
  ])('%i se muestra como %s', (monto, esperado) => {
    expect(formatearPrecio(monto)).toBe(esperado);
  });
});
