import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { App } from '../../src/App';
import { armarPedidoDeEjemplo } from '../helpers/pasos';
import { crearPedidoEnLaApi } from '../msw/pedidos';
import { servidor, usarServidorMsw } from '../msw/servidor';

usarServidorMsw();

beforeEach(() => {
  window.history.replaceState({}, '', '/?mesa=4');
});

async function intentarConfirmar() {
  const user = userEvent.setup();
  render(<App />);
  await armarPedidoDeEjemplo(user);
  await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }));
  return user;
}

function expectCarritoIntacto() {
  expect(screen.getByLabelText('Cantidad de Expreso Mediano · Colombia')).toHaveTextContent('2');
  expect(screen.getByLabelText('Cantidad de Muffin de chocolate')).toHaveTextContent('1');
  expect(screen.getByRole('button', { name: 'Confirmar pedido' })).toBeEnabled();
}

describe('Si la API rechaza el pedido', () => {
  test('un 400 muestra el mensaje de la API tal cual y el carrito no se pierde', async () => {
    servidor.use(
      http.post('/pedidos', () => HttpResponse.json({ error: 'El producto 19 no existe.' }, { status: 400 }))
    );

    await intentarConfirmar();

    expect(await screen.findByRole('alert')).toHaveTextContent('No se envió el pedido: El producto 19 no existe.');
    expectCarritoIntacto();
  });

  test('un 404 también muestra su mensaje', async () => {
    servidor.use(
      http.post('/pedidos', () => HttpResponse.json({ error: 'Ruta no encontrada: POST /pedidos' }, { status: 404 }))
    );

    await intentarConfirmar();

    expect(await screen.findByRole('alert')).toHaveTextContent('Ruta no encontrada: POST /pedidos');
    expectCarritoIntacto();
  });

  test('si la API está caída avisa y el carrito no se pierde', async () => {
    servidor.use(http.post('/pedidos', () => HttpResponse.error()));

    await intentarConfirmar();

    expect(await screen.findByRole('alert')).toHaveTextContent('No pudimos conectarnos con la cafetería.');
    expectCarritoIntacto();
  });

  test('al reintentar con éxito desaparece el error y se ve el recibo', async () => {
    servidor.use(
      http.post('/pedidos', () => HttpResponse.json({ error: 'El producto 19 no existe.' }, { status: 400 }), {
        once: true,
      }),
      crearPedidoEnLaApi().handler
    );

    const user = await intentarConfirmar();
    await screen.findByRole('alert');
    await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }));

    expect(await screen.findByRole('region', { name: 'Pedido N° 1' })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
