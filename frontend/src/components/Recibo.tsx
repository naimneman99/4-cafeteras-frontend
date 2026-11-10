import { useId } from 'react';
import type { Pedido } from '../api/esquemas';
import { nombreVisible } from '../utils/menu';
import { formatearPrecio } from '../utils/precio';

interface Props {
  pedido: Pedido;
}

// Número, estado y total son exactamente los que devolvió la API
export function Recibo({ pedido }: Props) {
  const id = useId();

  return (
    <section className="ticket ticket--receipt" aria-labelledby={`${id}-titulo`}>
      <h2 id={`${id}-titulo`} className="ticket-title">
        Pedido N° {pedido.id}
      </h2>
      <dl className="ticket-facts">
        <dt>Mesa</dt>
        <dd>{pedido.mesaId ?? 'Retiro en barra'}</dd>
        <dt>Estado</dt>
        <dd className="fw-bold">{pedido.estado}</dd>
      </dl>
      <ul className="list-unstyled ticket-lines mb-0">
        {pedido.items.map(({ producto, cantidad }) => (
          <li key={producto.id}>
            {cantidad} × {nombreVisible(producto)}
          </li>
        ))}
      </ul>
      <div className="ticket-total">
        <span>Total</span>
        <span className="price">{formatearPrecio(pedido.total)}</span>
      </div>
    </section>
  );
}
