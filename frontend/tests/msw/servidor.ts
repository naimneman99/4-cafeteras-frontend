import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { productos } from '../fixtures/productos';

// Imita la API del grupo: mismas rutas, mismos códigos y mismo formato de error { error }.
// Cada test pisa los handlers que necesita con servidor.use(...).
export const servidor = setupServer(http.get('/productos', () => HttpResponse.json(productos)));

export function usarServidorMsw() {
  beforeAll(() => servidor.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => servidor.resetHandlers());
  afterAll(() => servidor.close());
}
