import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';
import type { Producto } from '../api/esquemas';
import { carritoReducer, carritoVacio, type ItemCarrito } from './carrito';

interface ValorCarrito {
  items: ItemCarrito[];
  agregar: (producto: Producto) => void;
  sumar: (productoId: number) => void;
  restar: (productoId: number) => void;
  quitar: (productoId: number) => void;
  vaciar: () => void;
}

const CarritoContext = createContext<ValorCarrito | null>(null);

// Como el TodoContext del apunte: el estado vive en un reducer puro y el Context lo comparte
export function CarritoProvider({ children }: { children: ReactNode }) {
  const [estado, dispatch] = useReducer(carritoReducer, carritoVacio);

  const valor = useMemo<ValorCarrito>(
    () => ({
      items: estado.items,
      agregar: (producto) => dispatch({ tipo: 'agregar', producto }),
      sumar: (productoId) => dispatch({ tipo: 'sumar', productoId }),
      restar: (productoId) => dispatch({ tipo: 'restar', productoId }),
      quitar: (productoId) => dispatch({ tipo: 'quitar', productoId }),
      vaciar: () => dispatch({ tipo: 'vaciar' }),
    }),
    [estado.items]
  );

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
}

export function useCarrito(): ValorCarrito {
  const valor = useContext(CarritoContext);
  if (!valor) {
    throw new Error('useCarrito se usa dentro de <CarritoProvider>');
  }
  return valor;
}
