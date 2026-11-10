import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { delay, http, HttpResponse } from 'msw';
import { App } from '../../src/App';
import { armarPedidoDeEjemplo } from '../helpers/pasos';
import { crearPedidoEnLaApi, pedidoDeLaApi, type CuerpoPedido } from '../msw/pedidos';
import { servidor, usarServidorMsw } from '../msw/servidor';

usarServidorMsw();

beforeEach(() => {
  window.history.replaceState({}, '', '/?mesa=4');
});

async function confirmarPedidoDeEjemplo() {
  const user = userEvent.setup();
  render(<App />);
  await armarPedidoDeEjemplo(user);
  await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }));
}

describe('Confirmar el pedido con POST /pedidos', () => {
  test('envía la mesa y los ítems del carrito', async () => {
    const api = crearPedidoEnLaApi();
    servidor.use(api.handler);

    await confirmarPedidoDeEjemplo();
    await screen.findByRole('region', { name: 'Pedido N° 1' });

    expect(api.recibidos).toEqual([
      {
        mesaId: 4,
        items: [
          { productoId: 5, cantidad: 2 },
          { productoId: 19, cantidad: 1 },
        ],
      },
    ]);
  });

  test('muestra el número de pedido, el estado y el total que devolvió la API', async () => {
    servidor.use(crearPedidoEnLaApi().handler);

    await confirmarPedidoDeEjemplo();

    const recibo = await screen.findByRole('region', { name: 'Pedido N° 1' });
    expect(recibo).toHaveTextContent('Estadopendiente');
    expect(recibo).toHaveTextContent('Mesa4');
    expect(recibo).toHaveTextContent('2 × Expreso Mediano · Colombia');
    expect(recibo).toHaveTextContent('1 × Muffin de chocolate');
    expect(recibo).toHaveTextContent('Total$17.220');
  });

  test('el total es el de la API, no el subtotal orientativo del carrito', async () => {
    servidor.use(
      http.post('/pedidos', async ({ request }) => {
        const cuerpo = (await request.json()) as CuerpoPedido;
        return HttpResponse.json({ ...pedidoDeLaApi(7, cuerpo), total: 16500 }, { status: 201 });
      })
    );

    await confirmarPedidoDeEjemplo();

    const recibo = await screen.findByRole('region', { name: 'Pedido N° 7' });
    expect(recibo).toHaveTextContent('Total$16.500');
  });

  test('sin mesa el pedido sale sin mesaId: es para retirar en la barra', async () => {
    window.history.replaceState({}, '', '/');
    const api = crearPedidoEnLaApi();
    servidor.use(api.handler);

    await confirmarPedidoDeEjemplo();

    const recibo = await screen.findByRole('region', { name: 'Pedido N° 1' });
    expect(api.recibidos[0]).not.toHaveProperty('mesaId');
    expect(recibo).toHaveTextContent('MesaRetiro en barra');
  });

  test('el recibo reemplaza al menú', async () => {
    servidor.use(crearPedidoEnLaApi().handler);

    await confirmarPedidoDeEjemplo();
    await screen.findByRole('region', { name: 'Pedido N° 1' });

    expect(screen.queryByRole('heading', { name: 'Café' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Confirmar pedido' })).not.toBeInTheDocument();
  });

  test('mientras se envía no se puede confirmar dos veces', async () => {
    servidor.use(
      http.post('/pedidos', async ({ request }) => {
        const cuerpo = (await request.json()) as CuerpoPedido;
        await delay(100);
        return HttpResponse.json(pedidoDeLaApi(1, cuerpo), { status: 201 });
      })
    );

    await confirmarPedidoDeEjemplo();

    expect(screen.getByRole('button', { name: 'Enviando…' })).toBeDisabled();
    await screen.findByRole('region', { name: 'Pedido N° 1' });
  });
});
