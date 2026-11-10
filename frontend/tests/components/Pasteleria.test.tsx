import { describe, test, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pasteleria } from '../../src/components/Pasteleria';
import { productoPorId, productos } from '../fixtures/productos';

describe('Pasteleria', () => {
  test('lista el muffin de chocolate y la porción de torta selva negra, cada uno con su precio', () => {
    render(<Pasteleria productos={productos} onAgregar={vi.fn()} />);

    const items = within(screen.getByRole('list')).getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('Muffin de chocolate');
    expect(items[0]).toHaveTextContent('$2.500');
    expect(items[1]).toHaveTextContent('Porción de torta selva negra');
    expect(items[1]).toHaveTextContent('$4.200');
  });

  test('no muestra los cafés', () => {
    render(<Pasteleria productos={productos} onAgregar={vi.fn()} />);
    expect(screen.queryByText(/Expreso|Filtrado/)).not.toBeInTheDocument();
  });

  test('cada producto tiene un botón para agregarlo', async () => {
    const user = userEvent.setup();
    const onAgregar = vi.fn();
    render(<Pasteleria productos={productos} onAgregar={onAgregar} />);

    await user.click(screen.getByRole('button', { name: 'Agregar Porción de torta selva negra' }));

    expect(onAgregar).toHaveBeenCalledWith(productoPorId(20));
  });
});
