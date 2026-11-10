import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SelectorCafe } from '../../src/components/SelectorCafe';
import { productoPorId, productos } from '../fixtures/productos';

function renderSelector() {
  const onAgregar = vi.fn();
  render(<SelectorCafe productos={productos} onAgregar={onAgregar} />);
  return { onAgregar, user: userEvent.setup() };
}

describe('SelectorCafe: café en tres pasos', () => {
  test('el botón para agregar queda deshabilitado hasta completar las tres elecciones', async () => {
    const { user } = renderSelector();
    const agregar = screen.getByRole('button', { name: 'Agregar café' });

    expect(agregar).toBeDisabled();
    await user.click(screen.getByRole('radio', { name: 'Expreso' }));
    expect(agregar).toBeDisabled();
    await user.click(screen.getByRole('radio', { name: 'Mediano' }));
    expect(agregar).toBeDisabled();
    await user.click(screen.getByRole('radio', { name: /Colombia/ }));
    expect(agregar).toBeEnabled();
  });

  test('cada origen muestra su descripción', () => {
    renderSelector();

    expect(screen.getByRole('radio', { name: /Colombia/ })).toHaveAccessibleDescription(
      'Acidez media, cuerpo equilibrado y notas cítricas y florales'
    );
    expect(screen.getByRole('radio', { name: /Etiopía/ })).toHaveAccessibleDescription(
      'Acidez muy viva, cuerpo ligero y notas frutales'
    );
    expect(screen.getByRole('radio', { name: /Brasil/ })).toHaveAccessibleDescription(
      'Acidez baja, cuerpo denso y notas de avellana'
    );
  });

  test('sin bebida y tamaño los orígenes todavía no muestran precio', () => {
    renderSelector();

    expect(screen.getByText('Elegí bebida y tamaño para ver los precios.')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Colombia' })).toBeInTheDocument();
  });

  test('con bebida y tamaño elegidos cada origen muestra su precio', async () => {
    const { user } = renderSelector();

    await user.click(screen.getByRole('radio', { name: 'Expreso' }));
    await user.click(screen.getByRole('radio', { name: 'Mediano' }));

    expect(screen.getByRole('radio', { name: 'Colombia $7.360' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Etiopía $8.980' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Brasil $6.280' })).toBeInTheDocument();
    expect(screen.queryByText('Elegí bebida y tamaño para ver los precios.')).not.toBeInTheDocument();
  });

  test('al agregar entrega el café que corresponde a las tres elecciones', async () => {
    const { user, onAgregar } = renderSelector();

    await user.click(screen.getByRole('radio', { name: 'Filtrado' }));
    await user.click(screen.getByRole('radio', { name: 'Taza grande' }));
    await user.click(screen.getByRole('radio', { name: /Etiopía/ }));
    await user.click(screen.getByRole('button', { name: 'Agregar café' }));

    expect(onAgregar).toHaveBeenCalledWith(productoPorId(18));
  });
});
