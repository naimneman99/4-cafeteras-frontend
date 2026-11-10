import type { Bebida, Producto, ProductoCafe } from '../api/esquemas';

export interface Eleccion {
  bebida: Bebida | null;
  tamanio: string | null;
  origen: string | null;
}

export const esCafe = (producto: Producto): producto is ProductoCafe => producto.tipo !== 'pasteleria';

// Las opciones de cada paso salen del catálogo de la API, sin repetir y en su orden
export function opcionesCafe(productos: Producto[]) {
  const cafes = productos.filter(esCafe);
  return {
    bebidas: [...new Set(cafes.map((c) => c.tipo))],
    tamanios: [...new Set(cafes.map((c) => c.tamanio))],
    origenes: [...new Map(cafes.map((c) => [c.variedad.nombre, c.variedad])).values()],
  };
}

export function buscarCafe(productos: Producto[], { bebida, tamanio, origen }: Eleccion): ProductoCafe | undefined {
  return productos
    .filter(esCafe)
    .find((c) => c.tipo === bebida && c.tamanio === tamanio && c.variedad.nombre === origen);
}

export function nombreVisible(producto: Producto): string {
  return esCafe(producto) ? `${producto.nombre} · ${producto.variedad.nombre}` : producto.nombre;
}
