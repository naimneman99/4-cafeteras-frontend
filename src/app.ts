import express from 'express';
import cors from 'cors';
import productoRoutes from './routes/producto.routes';
import pedidoRoutes from './routes/pedido.routes';
import reportesRoutes from './routes/reportes.routes';
import testRoutes from './routes/test.routes';
import { manejarErrores, rutaNoEncontrada } from './middlewares/errores';

// La app se arma y se exporta acá, sin levantar el servidor:
// así Supertest la puede importar en los tests.
export const app = express();

// El front corre en otro puerto (Vite): sin CORS el navegador bloquea los pedidos
app.use(cors());

// Para que Express entienda el body en formato JSON (necesario para el POST)
app.use(express.json());

// Cada router define sus rutas relativas a este prefijo
app.use('/productos', productoRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/reportes', reportesRoutes);

// Reset y seed para los E2E (solo responden con NODE_ENV=test)
app.use('/__test__', testRoutes);

// Van al final: atrapan lo que no resolvió ninguna ruta
app.use(rutaNoEncontrada);
app.use(manejarErrores);