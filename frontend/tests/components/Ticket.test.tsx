import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Producto } from '../../src/api/esquemas';
import { CarritoProvider, useCarrito } from '../../src/carrito/CarritoContext';
import { Ticket } from '../../src/components/Ticket';
import { productoPorId } from '../fixtures/productos';

const expreso = productoPorId(5);
const muffin = productoPorId(19);

// Hace de menú: agrega productos al carrito como lo harían el selector y la pastelería
function Cargar({ producto }: { producto: Producto }) {
  const { agregar } = useCarrito();
  return <button onClick={() => agregar(producto)}>Cargar {producto.nombre}</button>;
}

function renderTicket(mesa: number | null = 4) {
  const onConfirmar = vi.fn();
  render(
    <CarritoProvider>
      <Cargar producto={expreso} />
      <Cargar producto={muffin} />
      <Ticket mesa={mesa} onConfirmar={onConfirmar} />
    </CarritoProvider>
  );
  return { onConfirmar, user: userEvent.setup() };
}

async function cargarPedidoDeEjemplo(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Cargar Expreso Mediano' }));
  await user.click(screen.getByRole('button', { name: 'Cargar Expreso Mediano' }));
  await user.click(screen.getByRole('button', { name: 'Cargar Muffin de chocolate' }));
}

describe('Ticket: el carrito', () => {
  test('dice para quién es el pedido', () => {
    renderTicket(4);
    expect(screen.getByRole('heading', { name: 'Tu pedido · Mesa 4' })).toBeInTheDocument();
  });

  test('sin mesa el pedido es para retirar en la barra', () => {
    renderTicket(null);
    expect(screen.getByRole('heading', { name: 'Tu pedido · Retiro en barra' })).toBeInTheDocument();
  });

  test('vacío avisa que no hay nada y no se puede confirmar', () => {
    renderTicket();
    expect(screen.getByText('Todavía no agregaste nada.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirmar pedido' })).toBeDisabled();
  });

  test('muestra cada producto con su cantidad, su subtotal y el subtotal general', async () => {
    const { user } = renderTicket();
    await cargarPedidoDeEjemplo(user);

    const [lineaCafe, lineaMuffin] = screen.getAllByRole('listitem');
    expect(lineaCafe).toHaveTextContent('Expreso Mediano · Colombia');
    expect(lineaCafe).toHaveTextContent('$14.720');
    expect(screen.getByLabelText('Cantidad de Expreso Mediano · Colombia')).toHaveTextContent('2');
    expect(lineaMuffin).toHaveTextContent('$2.500');
    expect(screen.getByLabelText('Cantidad de Muffin de chocolate')).toHaveTextContent('1');
    expect(screen.getByText('Subtotal orientativo').parentElement).toHaveTextContent('$17.220');
  });

  test('sumar y restar cambian la cantidad', async () => {
    const { user } = renderTicket();
    await cargarPedidoDeEjemplo(user);
    const cantidad = screen.getByLabelText('Cantidad de Muffin de chocolate');

    await user.click(screen.getByRole('button', { name: 'Sumar uno de Muffin de chocolate' }));
    expect(cantidad).toHaveTextContent('2');

    await user.click(screen.getByRole('button', { name: 'Restar uno de Muffin de chocolate' }));
    expect(cantidad).toHaveTextContent('1');
  });

  test('con cantidad 1 no se puede restar: para sacarlo está quitar', async () => {
    const { user } = renderTicket();
    await cargarPedidoDeEjemplo(user);

    expect(screen.getByRole('button', { name: 'Restar uno de Muffin de chocolate' })).toBeDisabled();
  });

  test('quitar saca el producto; si el carrito queda vacío ya no se puede confirmar', async () => {
    const { user } = renderTicket();
    await user.click(screen.getByRole('button', { name: 'Cargar Muffin de chocolate' }));

    await user.click(screen.getByRole('button', { name: 'Quitar Muffin de chocolate' }));

    expect(screen.queryByText('Muffin de chocolate')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirmar pedido' })).toBeDisabled();
  });

  test('con productos se puede confirmar', async () => {
    const { user, onConfirmar } = renderTicket();
    await cargarPedidoDeEjemplo(user);

    await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }));

    expect(onConfirmar).toHaveBeenCalledTimes(1);
  });
});
