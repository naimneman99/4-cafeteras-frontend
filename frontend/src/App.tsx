import { useCallback, useEffect, useState } from 'react';
import { obtenerProductos } from './api/cliente';
import type { Producto } from './api/esquemas';
import { CarritoProvider, useCarrito } from './carrito/CarritoContext';
import { Encabezado } from './components/Encabezado';
import { Pasteleria } from './components/Pasteleria';
import { SelectorCafe } from './components/SelectorCafe';
import { Ticket } from './components/Ticket';
import { leerMesa } from './utils/mesa';

// La carga del menú es una unión discriminada: no puede estar cargando y con error a la vez
type EstadoMenu =
  | { estado: 'cargando' }
  | { estado: 'error'; mensaje: string }
  | { estado: 'listo'; productos: Producto[] };

const mensajeDe = (error: unknown) => (error instanceof Error ? error.message : String(error));

export function App() {
  // La mesa se lee una sola vez, al abrir el menú desde el QR
  const [mesa] = useState(() => leerMesa(window.location.search));
  const [menu, setMenu] = useState<EstadoMenu>({ estado: 'cargando' });

  const cargarMenu = useCallback(() => {
    setMenu({ estado: 'cargando' });
    obtenerProductos()
      .then((productos) => setMenu({ estado: 'listo', productos }))
      .catch((error: unknown) => setMenu({ estado: 'error', mensaje: mensajeDe(error) }));
  }, []);

  useEffect(() => {
    cargarMenu();
  }, [cargarMenu]);

  return (
    <CarritoProvider>
      <Encabezado mesa={mesa} />
      <main className="menu p-3">
        {menu.estado === 'cargando' && (
          <p role="status" className="d-flex align-items-center gap-2 mb-0">
            <span className="spinner-border spinner-border-sm text-primary" aria-hidden="true"></span>
            Cargando menú…
          </p>
        )}
        {menu.estado === 'error' && (
          <div className="alert alert-danger" role="alert">
            <p className="mb-2">
              <strong>No pudimos cargar el menú.</strong> {menu.mensaje}
            </p>
            <button type="button" className="btn btn-danger btn-sm" onClick={cargarMenu}>
              Reintentar
            </button>
          </div>
        )}
        {menu.estado === 'listo' && <Menu productos={menu.productos} mesa={mesa} />}
      </main>
    </CarritoProvider>
  );
}

interface MenuProps {
  productos: Producto[];
  mesa: number | null;
}

function Menu({ productos, mesa }: MenuProps) {
  const { agregar } = useCarrito();

  return (
    <>
      <SelectorCafe productos={productos} onAgregar={agregar} />
      <Pasteleria productos={productos} onAgregar={agregar} />
      <Ticket
        mesa={mesa}
        onConfirmar={() => {
          // TODO: confirmar el pedido con POST /pedidos (rama feat/front-confirmar-pedido)
        }}
      />
    </>
  );
}
