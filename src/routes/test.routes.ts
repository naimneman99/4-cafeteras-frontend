import { NextFunction, Request, Response, Router } from 'express';
import { getAllPedidos, resetPedidos } from '../services/pedido.service';
import { getAll } from '../services/producto.service';

const router = Router();

// Montado en /__test__ (ver app.ts). Solo existe con NODE_ENV=test:
// en cualquier otro entorno se saltea el router y responde la ruta no encontrada.
router.use((req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV !== 'test') {
    next('router');
    return;
  }
  next();
});

// POST /__test__/reset -> Vacía los pedidos y reinicia los ids
router.post('/reset', (req: Request, res: Response) => {
  resetPedidos();
  res.status(204).end();
});

// POST /__test__/seed -> Deja los datos iniciales. El catálogo está fijo en el código,
// así que alcanza con vaciar los pedidos para que cada E2E arranque igual.
router.post('/seed', (req: Request, res: Response) => {
  resetPedidos();
  res.json({ productos: getAll().length, pedidos: getAllPedidos().length });
});

export default router;