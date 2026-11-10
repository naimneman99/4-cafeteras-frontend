import { Request, Response } from 'express';
import { crearPedido, getAllPedidos, getPedidoById } from '../services/pedido.service';
import { serializarProducto } from '../services/producto.service';
import { Pedido } from '../models/pedido';

// Todas las respuestas de pedidos incluyen la mesa, los ítems con su subtotal y el total calculado
const serializarPedido = (pedido: Pedido) => ({
  id: pedido.id,
  mesaId: pedido.mesaId,
  estado: pedido.estado,
  items: pedido.items.map((item) => ({
    producto: serializarProducto(item.producto),
    cantidad: item.cantidad,
    subtotal: item.calcularSubtotal(),
  })),
  total: pedido.calcularTotal(),
});

// POST /pedidos -> Devuelve el pedido con su total calculado
export const postPedido = (req: Request, res: Response) => {
  try {
    const nuevoPedido = crearPedido(req.body?.items, req.body?.mesaId);
    res.status(201).json(serializarPedido(nuevoPedido));
  } catch (error) {
    // El service lanza error si los datos son inválidos: eso es un 400
    res.status(400).json({ error: (error as Error).message });
  }
};

// GET /pedidos -> Lista de pedidos de todas las mesas
export const getPedidos = (req: Request, res: Response) => {
  res.json(getAllPedidos().map(serializarPedido));
};

// GET /pedidos/:id -> Pedido de tal mesa
export const getPedido = (req: Request, res: Response) => {
  const pedido = getPedidoById(Number(req.params.id));

  if (!pedido) {
    res.status(404).json({ error: 'Pedido no encontrado' });
    return;
  }

  res.json(serializarPedido(pedido));
};

