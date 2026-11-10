import type { z } from 'zod';
import {
  ErrorApiSchema,
  PedidoSchema,
  ProductosSchema,
  type NuevoPedido,
  type Pedido,
  type Producto,
} from './esquemas';

// Único módulo que habla con la API: ningún componente hace fetch directo.
// Toda respuesta se valida con su esquema antes de usarse.

const SIN_CONEXION = 'No pudimos conectarnos con la cafetería. Revisá tu conexión.';
const FUERA_DE_CONTRATO = 'La respuesta del servidor no tiene el formato esperado.';

async function pedir<T>(ruta: string, esquema: z.ZodType<T>, init?: RequestInit): Promise<T> {
  let respuesta: Response;
  try {
    respuesta = await fetch(ruta, init);
  } catch {
    throw new Error(SIN_CONEXION);
  }

  const cuerpo: unknown = await respuesta.json().catch(() => undefined);

  if (!respuesta.ok) {
    // La API responde { error: "mensaje" }: el front lo muestra tal cual
    const error = ErrorApiSchema.safeParse(cuerpo);
    throw new Error(error.success ? error.data.error : `La API respondió con el código ${respuesta.status}.`);
  }

  const datos = esquema.safeParse(cuerpo);
  if (!datos.success) {
    throw new Error(FUERA_DE_CONTRATO);
  }
  return datos.data;
}

export function obtenerProductos(): Promise<Producto[]> {
  return pedir('/productos', ProductosSchema);
}

export function crearPedido(nuevo: NuevoPedido): Promise<Pedido> {
  return pedir('/pedidos', PedidoSchema, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevo),
  });
}

export function obtenerPedido(id: number): Promise<Pedido> {
  return pedir(`/pedidos/${id}`, PedidoSchema);
}
