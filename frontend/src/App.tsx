import { useState } from 'react';
import { Encabezado } from './components/Encabezado';
import { leerMesa } from './utils/mesa';

export function App() {
  // La mesa se lee una sola vez, al abrir el menú desde el QR
  const [mesa] = useState(() => leerMesa(window.location.search));

  return <Encabezado mesa={mesa} />;
}
