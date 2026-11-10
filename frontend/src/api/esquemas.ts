import { z } from 'zod';

// Contrato con la API: un esquema por respuesta. Los tipos salen de acá con z.infer.

export const ProductoCafeSchema = z.object({
  id: z.number().int().positive(),
  tipo: z.enum(['expreso', 'filtrado']),
  nombre: z.string(),
  tamanio: z.string(),
  gramosCafe: z.number().positive(),
  variedad: z.object({
    nombre: z.string(),
    descripcion: z.string(),
  }),
  precio: z.number().positive(),
});

export const ProductoPasteleriaSchema = z.object({
  id: z.number().int().positive(),
  tipo: z.literal('pasteleria'),
  nombre: z.string(),
  precio: z.number().positive(),
});

export const ProductoSchema = z.discriminatedUnion('tipo', [ProductoCafeSchema, ProductoPasteleriaSchema]);

export type Producto = z.infer<typeof ProductoSchema>;
export type ProductoCafe = z.infer<typeof ProductoCafeSchema>;
export type Bebida = ProductoCafe['tipo'];

export const ProductosSchema = z.array(ProductoSchema);

// Formato de todos los errores de la API
export const ErrorApiSchema = z.object({
  error: z.string(),
});

export const PedidoSchema = z.object({
  id: z.number().int().positive(),
  mesaId: z.number().int().positive().nullable(),
  estado: z.string(),
  items: z.array(
    z.object({
      producto: ProductoSchema,
      cantidad: z.number().int().positive(),
      subtotal: z.number(),
    })
  ),
  total: z.number(),
});

export type Pedido = z.infer<typeof PedidoSchema>;

// Lo que el front manda en POST /pedidos (sin mesaId, el pedido es para retirar en la barra)
export interface NuevoPedido {
  mesaId?: number;
  items: { productoId: number; cantidad: number }[];
}
