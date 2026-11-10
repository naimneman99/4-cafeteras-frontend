import { useId, useState } from 'react';
import type { Bebida, Producto } from '../api/esquemas';
import { buscarCafe, opcionesCafe } from '../utils/menu';
import { formatearPrecio } from '../utils/precio';

const ETIQUETA_BEBIDA: Record<Bebida, string> = {
  expreso: 'Expreso',
  filtrado: 'Filtrado',
};

interface Props {
  productos: Producto[];
  onAgregar: (producto: Producto) => void;
}

export function SelectorCafe({ productos, onAgregar }: Props) {
  const id = useId();
  const [bebida, setBebida] = useState<Bebida | null>(null);
  const [tamanio, setTamanio] = useState<string | null>(null);
  const [origen, setOrigen] = useState<string | null>(null);

  const { bebidas, tamanios, origenes } = opcionesCafe(productos);
  const elegido = buscarCafe(productos, { bebida, tamanio, origen });

  return (
    <section aria-labelledby={`${id}-titulo`} className="mb-4">
      <h2 id={`${id}-titulo`} className="sec-title">
        Café
      </h2>

      <fieldset className="mb-3">
        <legend className="field-legend">Bebida</legend>
        {bebidas.map((b) => (
          <div key={b} className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name={`${id}-bebida`}
              id={`${id}-bebida-${b}`}
              checked={bebida === b}
              onChange={() => setBebida(b)}
            />
            <label className="form-check-label" htmlFor={`${id}-bebida-${b}`}>
              {ETIQUETA_BEBIDA[b]}
            </label>
          </div>
        ))}
      </fieldset>

      <fieldset className="mb-3">
        <legend className="field-legend">Tamaño</legend>
        {tamanios.map((t, i) => (
          <div key={t} className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name={`${id}-tamanio`}
              id={`${id}-tamanio-${i}`}
              checked={tamanio === t}
              onChange={() => setTamanio(t)}
            />
            <label className="form-check-label" htmlFor={`${id}-tamanio-${i}`}>
              {t}
            </label>
          </div>
        ))}
      </fieldset>

      <fieldset className="mb-3">
        <legend className="field-legend">Origen</legend>
        {(bebida === null || tamanio === null) && (
          <p className="form-text mt-0 mb-2">Elegí bebida y tamaño para ver los precios.</p>
        )}
        <div className="list-group">
          {origenes.map((o, i) => {
            const inputId = `${id}-origen-${i}`;
            // Con bebida y tamaño elegidos, cada origen muestra el precio que devolvió la API
            const cafe = buscarCafe(productos, { bebida, tamanio, origen: o.nombre });
            return (
              <div key={o.nombre} className="list-group-item">
                <div className="form-check mb-0">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`${id}-origen`}
                    id={inputId}
                    aria-describedby={`${inputId}-desc`}
                    checked={origen === o.nombre}
                    onChange={() => setOrigen(o.nombre)}
                  />
                  <label className="form-check-label d-flex justify-content-between" htmlFor={inputId}>
                    <span className="fw-semibold">{o.nombre}</span>{' '}
                    {cafe ? (
                      <span className="price">{formatearPrecio(cafe.precio)}</span>
                    ) : (
                      <span className="price text-body-secondary" aria-hidden="true">
                        —
                      </span>
                    )}
                  </label>
                </div>
                <small id={`${inputId}-desc`} className="d-block origin-desc text-body-secondary">
                  {o.descripcion}
                </small>
              </div>
            );
          })}
        </div>
      </fieldset>

      <button
        type="button"
        className="btn btn-primary w-100"
        disabled={!elegido}
        aria-describedby={elegido ? undefined : `${id}-pista`}
        onClick={() => elegido && onAgregar(elegido)}
      >
        Agregar café
      </button>
      {!elegido && (
        <p id={`${id}-pista`} className="form-text mb-0">
          Completá bebida, tamaño y origen.
        </p>
      )}
    </section>
  );
}
