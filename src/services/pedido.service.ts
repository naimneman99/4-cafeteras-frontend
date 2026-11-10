import { Pedido } from '../models/pedido';
import { ItemPedido } from '../models/ItemPedido';
import { getById } from './producto.service';

// Lo que llega en el body del POST /pedidos
export interface ItemPedidoInput {
  productoId: number;
  cantidad: number;
}

let pedidos: Pedido[] = [];
let siguienteId = 1;

// La mesa llega del body tal cual: puede faltar (retiro en barra) o venir con cualquier valor
const validarMesa = (mesaId: unknown): number | null => {
  if (mesaId === undefined || mesaId === null) {
    return null;
  }
  if (typeof mesaId !== 'number' || !Number.isInteger(mesaId) || mesaId <= 0) {
    throw new Error('La mesa debe ser un número entero positivo.');
  }
  return mesaId;
};

export const crearPedido = (items: ItemPedidoInput[], mesaId?: unknown): Pedido => {
  const mesa = validarMesa(mesaId);

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('El pedido debe tener al menos un item.');
  }

  // Primero validamos y armamos todos los items; si alguno falla,
  // se lanza el error antes de guardar nada.
  const itemsPedido = items.map((item) => {
    if (typeof item !== 'object' || item === null) {
      throw new Error('Cada item necesita productoId y cantidad.');
    }
    const { productoId, cantidad } = item;
    const producto = getById(productoId);
    if (!producto) {
      throw new Error(`El producto ${productoId} no existe.`);
    }
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      throw new Error(`Cantidad inválida para el producto ${productoId}.`);
    }
    return new ItemPedido(producto, cantidad);
  });

  const pedido = new Pedido(siguienteId++, itemsPedido, 'pendiente', mesa);
  pedidos.push(pedido);
  return pedido;
};

export const getAllPedidos = (): Pedido[] => pedidos;

export const getPedidoById = (id: number): Pedido | undefined =>
  pedidos.find((p) => p.id === id);

// Solo para tests: deja el "almacenamiento" vacío entre caso y caso.
export const resetPedidos = (): void => {
  pedidos = [];
  siguienteId = 1;
};
