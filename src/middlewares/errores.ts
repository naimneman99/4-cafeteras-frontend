import { NextFunction, Request, Response } from 'express';

// Una ruta que no existe responde con el mismo formato de error que el resto de la API
export const rutaNoEncontrada = (req: Request, res: Response) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.path}` });
};

// Errores que no atrapó ningún controlador: el front siempre recibe { error } y nunca un HTML
export const manejarErrores = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  const esJsonInvalido =
    typeof err === 'object' && err !== null && 'type' in err && err.type === 'entity.parse.failed';

  if (esJsonInvalido) {
    res.status(400).json({ error: 'El cuerpo de la solicitud no es un JSON válido.' });
    return;
  }

  res.status(500).json({ error: 'Error interno del servidor.' });
};
