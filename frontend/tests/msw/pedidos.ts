import { http, HttpResponse } from 'msw';
import { productoPorId } from '../fixtures/productos';

export interface CuerpoPedido {
  mesaId?: number;
  items: { productoId: number; cantidad: number }[];
}

// Arma el pedido como lo devuelve la API: mesa, estado, ítems con su producto y subtotal, y total
export function pedidoDeLaApi(id: number, cuerpo: CuerpoPedido, estado = 'pendiente') {
  const items = cuerpo.items.map(({ productoId, cantidad }) => {
    const producto = productoPorId(productoId);
    return { producto, cantidad, subtotal: producto.precio * cantidad };
  });
  return {
    id,
    mesaId: cuerpo.mesaId ?? null,
    estado,
    items,
    total: items.reduce((total, item) => total + item.subtotal, 0),
  };
}

// POST /pedidos que responde 201 y guarda cada cuerpo recibido para que el test lo revise
export function crearPedidoEnLaApi() {
  const recibidos: CuerpoPedido[] = [];
  const handler = http.post('/pedidos', async ({ request }) => {
    const cuerpo = (await request.json()) as CuerpoPedido;
    recibidos.push(cuerpo);
    return HttpResponse.json(pedidoDeLaApi(recibidos.length, cuerpo), { status: 201 });
  });
  return { handler, recibidos };
}
