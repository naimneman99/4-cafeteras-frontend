import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { App } from '../../src/App';
import { armarPedidoDeEjemplo } from '../helpers/pasos';
import { crearPedidoEnLaApi, pedidoDeLaApi } from '../msw/pedidos';
import { servidor, usarServidorMsw } from '../msw/servidor';

usarServidorMsw();

const cuerpoDeEjemplo = {
  mesaId: 4,
  items: [
    { productoId: 5, cantidad: 2 },
    { productoId: 19, cantidad: 1 },
  ],
};

beforeEach(() => {
  window.history.replaceState({}, '', '/?mesa=4');
  servidor.use(crearPedidoEnLaApi().handler);
});

async function confirmarYVerRecibo() {
  const user = userEvent.setup();
  render(<App />);
  await armarPedidoDeEjemplo(user);
  await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }));
  const recibo = await screen.findByRole('region', { name: 'Pedido N° 1' });
  return { user, recibo };
}

describe('Seguir el pedido con GET /pedidos/:id', () => {
  test('desde el recibo consulta el estado y lo actualiza sin recargar la página', async () => {
    const consultados: string[] = [];
    servidor.use(
      http.get('/pedidos/:id', ({ params }) => {
        consultados.push(String(params.id));
        return HttpResponse.json(pedidoDeLaApi(1, cuerpoDeEjemplo, 'en preparación'));
      })
    );
    const { user, recibo } = await confirmarYVerRecibo();

    await user.click(screen.getByRole('button', { name: 'Actualizar estado' }));

    expect(await within(recibo).findByText('en preparación')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Estado actualizado · antes: pendiente');
    expect(consultados).toEqual(['1']);
  });

  test('si el estado no cambió lo avisa', async () => {
    servidor.use(http.get('/pedidos/:id', () => HttpResponse.json(pedidoDeLaApi(1, cuerpoDeEjemplo))));
    const { user, recibo } = await confirmarYVerRecibo();

    await user.click(screen.getByRole('button', { name: 'Actualizar estado' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Sin cambios: el pedido sigue pendiente');
    expect(recibo).toHaveTextContent('Estadopendiente');
  });

  test('si la consulta falla muestra el mensaje de la API y conserva el recibo', async () => {
    servidor.use(
      http.get('/pedidos/:id', () => HttpResponse.json({ error: 'Pedido no encontrado' }, { status: 404 }))
    );
    const { user } = await confirmarYVerRecibo();

    await user.click(screen.getByRole('button', { name: 'Actualizar estado' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Pedido no encontrado');
    expect(screen.getByRole('region', { name: 'Pedido N° 1' })).toBeInTheDocument();
  });
});
