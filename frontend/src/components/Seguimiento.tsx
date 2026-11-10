import { useState } from 'react';
import { obtenerPedido } from '../api/cliente';
import type { Pedido } from '../api/esquemas';
import { Recibo } from './Recibo';

interface Props {
  pedidoInicial: Pedido;
}

// Desde el recibo, el cliente consulta el estado con GET /pedidos/:id sin recargar la página
export function Seguimiento({ pedidoInicial }: Props) {
  const [pedido, setPedido] = useState(pedidoInicial);
  const [consultando, setConsultando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function actualizar() {
    setConsultando(true);
    setError(null);
    try {
      const actual = await obtenerPedido(pedido.id);
      setAviso(
        actual.estado === pedido.estado
          ? `Sin cambios: el pedido sigue ${actual.estado}`
          : `Estado actualizado · antes: ${pedido.estado}`
      );
      setPedido(actual);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setConsultando(false);
    }
  }

  return (
    <>
      <Recibo pedido={pedido} />
      <button
        type="button"
        className="btn btn-outline-primary w-100 mt-3"
        disabled={consultando}
        onClick={() => void actualizar()}
      >
        {consultando ? 'Consultando…' : 'Actualizar estado'}
      </button>
      {aviso && (
        <p role="status" className="small text-body-secondary text-center mt-2 mb-0">
          {aviso}
        </p>
      )}
      {error && (
        <div role="alert" className="alert alert-danger py-2 small mt-3 mb-0">
          {error}
        </div>
      )}
    </>
  );
}
