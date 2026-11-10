import type { Producto } from '../api/esquemas';

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

export interface EstadoCarrito {
  items: ItemCarrito[];
}

export type AccionCarrito =
  | { tipo: 'agregar'; producto: Producto }
  | { tipo: 'sumar'; productoId: number }
  | { tipo: 'restar'; productoId: number }
  | { tipo: 'quitar'; productoId: number }
  | { tipo: 'vaciar' };

export const carritoVacio: EstadoCarrito = { items: [] };

const cambiarCantidad = (items: ItemCarrito[], productoId: number, delta: number): ItemCarrito[] =>
  items.map((item) =>
    item.producto.id === productoId ? { ...item, cantidad: Math.max(1, item.cantidad + delta) } : item
  );

// Reducer puro: devuelve siempre un estado nuevo y nunca toca el anterior
export function carritoReducer(estado: EstadoCarrito, accion: AccionCarrito): EstadoCarrito {
  switch (accion.tipo) {
    case 'agregar': {
      const yaEsta = estado.items.some((item) => item.producto.id === accion.producto.id);
      return {
        items: yaEsta
          ? cambiarCantidad(estado.items, accion.producto.id, 1)
          : [...estado.items, { producto: accion.producto, cantidad: 1 }],
      };
    }
    case 'sumar':
      return { items: cambiarCantidad(estado.items, accion.productoId, 1) };
    case 'restar':
      return { items: cambiarCantidad(estado.items, accion.productoId, -1) };
    case 'quitar':
      return { items: estado.items.filter((item) => item.producto.id !== accion.productoId) };
    case 'vaciar':
      return carritoVacio;
  }
}

// Solo orientativos: el total del pedido lo devuelve la API
export const subtotalLinea = ({ producto, cantidad }: ItemCarrito): number => producto.precio * cantidad;

export const subtotalOrientativo = (items: ItemCarrito[]): number =>
  items.reduce((total, item) => total + subtotalLinea(item), 0);
