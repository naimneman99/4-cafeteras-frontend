# Cafetería Origen · API y menú de mesa (TP3)

La API del Parcial I (Express + TypeScript) y el menú de mesa en `frontend/` (Vite + React + TypeScript). El cliente escanea el QR de su mesa, arma el pedido en el celular y lo envía directo a la API.

Requisitos: Node 22 o más nuevo y pnpm 12, el mismo que usa el repo del parcial.

## Cómo levantar todo

```bash
pnpm install                   # API (en la raíz)
pnpm --dir frontend install    # front
```

En dos terminales:

```bash
pnpm dev                 # API en http://localhost:3000
pnpm --dir frontend dev  # front en http://localhost:5173
```

- `http://localhost:5173/?mesa=4` abre el menú de la mesa 4, como si se escaneara su QR.
- `http://localhost:5173/` (sin `?mesa`, o con un valor inválido) arma un pedido para retirar en la barra.

En desarrollo el front le habla a la API a través del proxy de Vite (`frontend/vite.config.ts`). La API además tiene CORS habilitado.

## Cómo correr los tests

| Nivel | Dónde | Comando | Necesita la API levantada |
|---|---|---|---|
| API: unitarios e integración (Supertest) | raíz | `pnpm test` | No |
| Front: unitarios, componentes e integración (MSW 2) | `frontend/` | `pnpm test` (o `npm test`) | No |
| Front: E2E (Playwright, 375 px) | `frontend/` | `pnpm test:e2e` (o `npm run test:e2e`) | No: Playwright levanta la API con `NODE_ENV=test` y el front |

La primera vez que corran los E2E hay que bajar el navegador: `pnpm --dir frontend exec playwright install chromium`.

## Contrato de la API que usa el front

Todas las respuestas se validan en el front con Zod (`frontend/src/api/esquemas.ts`). Si una respuesta no cumple el contrato, el front muestra un error en vez de usarla.

### `GET /productos` y `GET /productos/:id`

Cada producto trae su `tipo` (`expreso`, `filtrado` o `pasteleria`) y su `precio`, que es el resultado de `calcularPrecio()`. El front no recalcula precios.

```json
{
  "id": 5,
  "tipo": "expreso",
  "nombre": "Expreso Mediano",
  "tamanio": "Mediano",
  "gramosCafe": 27,
  "variedad": {
    "nombre": "Colombia",
    "descripcion": "Acidez media, cuerpo equilibrado y notas cítricas y florales"
  },
  "precio": 7360
}
```

```json
{ "id": 19, "tipo": "pasteleria", "nombre": "Muffin de chocolate", "precio": 2500 }
```

Un producto que no existe responde `404 { "error": "Producto no encontrado" }`.

### `POST /pedidos`

`mesaId` es opcional: si no viene, el pedido es para retirar en la barra.

```json
{
  "mesaId": 4,
  "items": [
    { "productoId": 5, "cantidad": 2 },
    { "productoId": 19, "cantidad": 1 }
  ]
}
```

Responde `201` con el pedido:

```json
{
  "id": 1,
  "mesaId": 4,
  "estado": "pendiente",
  "items": [
    {
      "producto": {
        "id": 5,
        "tipo": "expreso",
        "nombre": "Expreso Mediano",
        "tamanio": "Mediano",
        "gramosCafe": 27,
        "variedad": {
          "nombre": "Colombia",
          "descripcion": "Acidez media, cuerpo equilibrado y notas cítricas y florales"
        },
        "precio": 7360
      },
      "cantidad": 2,
      "subtotal": 14720
    },
    {
      "producto": { "id": 19, "tipo": "pasteleria", "nombre": "Muffin de chocolate", "precio": 2500 },
      "cantidad": 1,
      "subtotal": 2500
    }
  ],
  "total": 17220
}
```

Errores (`400`):

- `mesaId` que no es un entero positivo: `{ "error": "La mesa debe ser un número entero positivo." }`
- producto inexistente: `{ "error": "El producto 999 no existe." }`
- sin ítems, cantidad inválida o ítem mal armado: un `{ "error": "..." }` con el motivo.

### `GET /pedidos/:id`

Devuelve el pedido con el mismo formato que `POST /pedidos` (estado, ítems y total). El front lo usa para seguir el pedido sin recargar la página. Si no existe: `404 { "error": "Pedido no encontrado" }`.

### Errores

Todos los errores responden `{ "error": "mensaje" }`, también una ruta inexistente (`404`) y un JSON mal formado (`400`). Nunca un `500` por una mesa o un producto inexistente. El front muestra el mensaje tal cual.

### Rutas para los E2E (solo con `NODE_ENV=test`)

- `POST /__test__/reset`: vacía los pedidos y reinicia los ids. Responde `204`.
- `POST /__test__/seed`: deja los datos iniciales. El catálogo de 20 productos está fijo en el código, así que el seed deja ese catálogo y ningún pedido. Responde `{ "productos": 20, "pedidos": 0 }`.

Fuera de `NODE_ENV=test` estas rutas no existen (`404`).
