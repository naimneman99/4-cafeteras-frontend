import { useId } from 'react';
import { subtotalLinea, subtotalOrientativo } from '../carrito/carrito';
import { useCarrito } from '../carrito/CarritoContext';
import { nombreVisible } from '../utils/menu';
import { formatearPrecio } from '../utils/precio';

interface Props {
  mesa: number | null;
  onConfirmar: () => void;
}

export function Ticket({ mesa, onConfirmar }: Props) {
  const id = useId();
  const { items, sumar, restar, quitar } = useCarrito();
  const destino = mesa === null ? 'Retiro en barra' : `Mesa ${mesa}`;

  return (
    <section className="ticket" aria-labelledby={`${id}-titulo`}>
      <h2 id={`${id}-titulo`} className="ticket-title">
        Tu pedido · {destino}
      </h2>

      {items.length === 0 ? (
        <p className="text-center text-body-secondary small my-3">Todavía no agregaste nada.</p>
      ) : (
        <>
          <ul className="list-unstyled ticket-lines mb-0">
            {items.map((item) => {
              const { producto, cantidad } = item;
              const nombre = nombreVisible(producto);
              return (
                <li key={producto.id}>
                  <div className="d-flex justify-content-between gap-2">
                    <span>{nombre}</span>
                    <span className="price">{formatearPrecio(subtotalLinea(item))}</span>
                  </div>
                  <div className="d-flex align-items-center mt-1">
                    <div className="input-group input-group-sm qty">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        aria-label={`Restar uno de ${nombre}`}
                        disabled={cantidad === 1}
                        onClick={() => restar(producto.id)}
                      >
                        −
                      </button>
                      <output className="form-control text-center" aria-label={`Cantidad de ${nombre}`}>
                        {cantidad}
                      </output>
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        aria-label={`Sumar uno de ${nombre}`}
                        onClick={() => sumar(producto.id)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="btn btn-link btn-sm link-danger ms-auto"
                      aria-label={`Quitar ${nombre}`}
                      onClick={() => quitar(producto.id)}
                    >
                      Quitar
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="ticket-total">
            <span>Subtotal orientativo</span>
            <span className="price">{formatearPrecio(subtotalOrientativo(items))}</span>
          </div>
        </>
      )}

      <button
        type="button"
        className="btn btn-primary w-100 mt-3"
        disabled={items.length === 0}
        onClick={onConfirmar}
      >
        Confirmar pedido
      </button>
    </section>
  );
}
