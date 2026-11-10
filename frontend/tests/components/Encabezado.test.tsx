import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Encabezado } from '../../src/components/Encabezado';

describe('Encabezado', () => {
  test('muestra el nombre de la cafetería', () => {
    render(<Encabezado mesa={4} />);
    expect(screen.getByRole('heading', { name: 'Origen' })).toBeInTheDocument();
  });

  test('muestra la mesa que vino en el QR', () => {
    render(<Encabezado mesa={4} />);
    expect(screen.getByRole('banner')).toHaveTextContent('Mesa 4');
  });

  test('sin mesa avisa que el pedido es para retirar en la barra', () => {
    render(<Encabezado mesa={null} />);
    expect(screen.getByRole('banner')).toHaveTextContent('Retiro en barra');
  });
});
