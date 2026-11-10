import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { App } from '../../src/App';
import { servidor, usarServidorMsw } from '../msw/servidor';

usarServidorMsw();

beforeEach(() => {
  window.history.replaceState({}, '', '/?mesa=4');
});

describe('Carga del menú desde GET /productos', () => {
  test('mientras carga se ve un indicador y después el menú', async () => {
    render(<App />);

    expect(screen.getByRole('status')).toHaveTextContent('Cargando menú…');
    expect(await screen.findByRole('heading', { name: 'Café' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Pastelería' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Tu pedido · Mesa 4' })).toBeInTheDocument();
    expect(screen.queryByText('Cargando menú…')).not.toBeInTheDocument();
  });

  test('los precios salen de la API', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(await screen.findByRole('radio', { name: 'Expreso' }));
    await user.click(screen.getByRole('radio', { name: 'Mediano' }));

    expect(screen.getByRole('radio', { name: 'Colombia $7.360' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Agregar Muffin de chocolate' }).parentElement).toHaveTextContent('$2.500');
  });

  test('el encabezado muestra la mesa del QR', async () => {
    render(<App />);
    expect(screen.getByRole('banner')).toHaveTextContent('Mesa 4');
    await screen.findByRole('heading', { name: 'Café' });
  });

  test('sin ?mesa el pedido es para retirar en la barra', async () => {
    window.history.replaceState({}, '', '/');
    render(<App />);

    expect(screen.getByRole('banner')).toHaveTextContent('Retiro en barra');
    expect(await screen.findByRole('heading', { name: 'Tu pedido · Retiro en barra' })).toBeInTheDocument();
  });

  test('si la API responde 500 muestra su mensaje y al reintentar carga el menú', async () => {
    const user = userEvent.setup();
    servidor.use(
      http.get('/productos', () => HttpResponse.json({ error: 'Se rompió la cafetera' }, { status: 500 }), {
        once: true,
      })
    );
    render(<App />);

    const alerta = await screen.findByRole('alert');
    expect(alerta).toHaveTextContent('No pudimos cargar el menú.');
    expect(alerta).toHaveTextContent('Se rompió la cafetera');

    await user.click(within(alerta).getByRole('button', { name: 'Reintentar' }));

    expect(await screen.findByRole('heading', { name: 'Café' })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('si la API está caída avisa que no se pudo conectar', async () => {
    servidor.use(http.get('/productos', () => HttpResponse.error()));
    render(<App />);

    const alerta = await screen.findByRole('alert');
    expect(alerta).toHaveTextContent('No pudimos conectarnos con la cafetería.');
    expect(within(alerta).getByRole('button', { name: 'Reintentar' })).toBeInTheDocument();
  });

  test('si la respuesta no cumple el contrato muestra un error en vez del menú', async () => {
    servidor.use(http.get('/productos', () => HttpResponse.json([{ id: 'cinco', nombre: 'Expreso' }])));
    render(<App />);

    const alerta = await screen.findByRole('alert');
    expect(alerta).toHaveTextContent('La respuesta del servidor no tiene el formato esperado.');
    expect(screen.queryByRole('heading', { name: 'Café' })).not.toBeInTheDocument();
  });
});