import { useId } from 'react';
import type { Producto } from '../api/esquemas';
import { formatearPrecio } from '../utils/precio';

interface Props {
  productos: Producto[];
  onAgregar: (producto: Producto) => void;
}

export function Pasteleria({ productos, onAgregar }: Props) {
  const id = useId();
  const pasteleria = productos.filter((p) => p.tipo === 'pasteleria');

  return (
    <section aria-labelledby={`${id}-titulo`} className="mb-4">
      <h2 id={`${id}-titulo`} className="sec-title">
        Pastelería
      </h2>
      <ul className="list-group">
        {pasteleria.map((producto) => (
          <li
            key={producto.id}
            className="list-group-item d-flex justify-content-between align-items-center gap-2"
          >
            <span>{producto.nombre}</span>
            <span className="d-flex align-items-center gap-2">
              <span className="price">{formatearPrecio(producto.precio)}</span>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                aria-label={`Agregar ${producto.nombre}`}
                onClick={() => onAgregar(producto)}
              >
                Agregar
              </button>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
