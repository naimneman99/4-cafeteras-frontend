import type { Producto } from '../../src/api/esquemas';

// Copia de lo que responde GET /productos de la API del grupo: los tests y los handlers de MSW usan estos datos
export const productos: Producto[] = [
  {
    id: 1,
    tipo: 'expreso',
    nombre: 'Expreso Pocillo',
    tamanio: 'Pocillo',
    gramosCafe: 18,
    variedad: {
      nombre: 'Brasil',
      descripcion: 'Acidez baja, cuerpo denso y notas de avellana',
    },
    precio: 5020,
  },
  {
    id: 2,
    tipo: 'expreso',
    nombre: 'Expreso Pocillo',
    tamanio: 'Pocillo',
    gramosCafe: 18,
    variedad: {
      nombre: 'Colombia',
      descripcion: 'Acidez media, cuerpo equilibrado y notas cítricas y florales',
    },
    precio: 5740,
  },
  {
    id: 3,
    tipo: 'expreso',
    nombre: 'Expreso Pocillo',
    tamanio: 'Pocillo',
    gramosCafe: 18,
    variedad: {
      nombre: 'Etiopía',
      descripcion: 'Acidez muy viva, cuerpo ligero y notas frutales',
    },
    precio: 6820,
  },
  {
    id: 4,
    tipo: 'expreso',
    nombre: 'Expreso Mediano',
    tamanio: 'Mediano',
    gramosCafe: 27,
    variedad: {
      nombre: 'Brasil',
      descripcion: 'Acidez baja, cuerpo denso y notas de avellana',
    },
    precio: 6280,
  },
  {
    id: 5,
    tipo: 'expreso',
    nombre: 'Expreso Mediano',
    tamanio: 'Mediano',
    gramosCafe: 27,
    variedad: {
      nombre: 'Colombia',
      descripcion: 'Acidez media, cuerpo equilibrado y notas cítricas y florales',
    },
    precio: 7360,
  },
  {
    id: 6,
    tipo: 'expreso',
    nombre: 'Expreso Mediano',
    tamanio: 'Mediano',
    gramosCafe: 27,
    variedad: {
      nombre: 'Etiopía',
      descripcion: 'Acidez muy viva, cuerpo ligero y notas frutales',
    },
    precio: 8980,
  },
  {
    id: 7,
    tipo: 'expreso',
    nombre: 'Expreso Taza grande',
    tamanio: 'Taza grande',
    gramosCafe: 36,
    variedad: {
      nombre: 'Brasil',
      descripcion: 'Acidez baja, cuerpo denso y notas de avellana',
    },
    precio: 7540,
  },
  {
    id: 8,
    tipo: 'expreso',
    nombre: 'Expreso Taza grande',
    tamanio: 'Taza grande',
    gramosCafe: 36,
    variedad: {
      nombre: 'Colombia',
      descripcion: 'Acidez media, cuerpo equilibrado y notas cítricas y florales',
    },
    precio: 8980,
  },
  {
    id: 9,
    tipo: 'expreso',
    nombre: 'Expreso Taza grande',
    tamanio: 'Taza grande',
    gramosCafe: 36,
    variedad: {
      nombre: 'Etiopía',
      descripcion: 'Acidez muy viva, cuerpo ligero y notas frutales',
    },
    precio: 11140,
  },
  {
    id: 10,
    tipo: 'filtrado',
    nombre: 'Filtrado Pocillo',
    tamanio: 'Pocillo',
    gramosCafe: 6,
    variedad: {
      nombre: 'Brasil',
      descripcion: 'Acidez baja, cuerpo denso y notas de avellana',
    },
    precio: 4040,
  },
  {
    id: 11,
    tipo: 'filtrado',
    nombre: 'Filtrado Pocillo',
    tamanio: 'Pocillo',
    gramosCafe: 6,
    variedad: {
      nombre: 'Colombia',
      descripcion: 'Acidez media, cuerpo equilibrado y notas cítricas y florales',
    },
    precio: 4280,
  },
  {
    id: 12,
    tipo: 'filtrado',
    nombre: 'Filtrado Pocillo',
    tamanio: 'Pocillo',
    gramosCafe: 6,
    variedad: {
      nombre: 'Etiopía',
      descripcion: 'Acidez muy viva, cuerpo ligero y notas frutales',
    },
    precio: 4640,
  },
  {
    id: 13,
    tipo: 'filtrado',
    nombre: 'Filtrado Mediano',
    tamanio: 'Mediano',
    gramosCafe: 15,
    variedad: {
      nombre: 'Brasil',
      descripcion: 'Acidez baja, cuerpo denso y notas de avellana',
    },
    precio: 5300,
  },
  {
    id: 14,
    tipo: 'filtrado',
    nombre: 'Filtrado Mediano',
    tamanio: 'Mediano',
    gramosCafe: 15,
    variedad: {
      nombre: 'Colombia',
      descripcion: 'Acidez media, cuerpo equilibrado y notas cítricas y florales',
    },
    precio: 5900,
  },
  {
    id: 15,
    tipo: 'filtrado',
    nombre: 'Filtrado Mediano',
    tamanio: 'Mediano',
    gramosCafe: 15,
    variedad: {
      nombre: 'Etiopía',
      descripcion: 'Acidez muy viva, cuerpo ligero y notas frutales',
    },
    precio: 6800,
  },
  {
    id: 16,
    tipo: 'filtrado',
    nombre: 'Filtrado Taza grande',
    tamanio: 'Taza grande',
    gramosCafe: 25,
    variedad: {
      nombre: 'Brasil',
      descripcion: 'Acidez baja, cuerpo denso y notas de avellana',
    },
    precio: 6700,
  },
  {
    id: 17,
    tipo: 'filtrado',
    nombre: 'Filtrado Taza grande',
    tamanio: 'Taza grande',
    gramosCafe: 25,
    variedad: {
      nombre: 'Colombia',
      descripcion: 'Acidez media, cuerpo equilibrado y notas cítricas y florales',
    },
    precio: 7700,
  },
  {
    id: 18,
    tipo: 'filtrado',
    nombre: 'Filtrado Taza grande',
    tamanio: 'Taza grande',
    gramosCafe: 25,
    variedad: {
      nombre: 'Etiopía',
      descripcion: 'Acidez muy viva, cuerpo ligero y notas frutales',
    },
    precio: 9200,
  },
  {
    id: 19,
    tipo: 'pasteleria',
    nombre: 'Muffin de chocolate',
    precio: 2500,
  },
  {
    id: 20,
    tipo: 'pasteleria',
    nombre: 'Porción de torta selva negra',
    precio: 4200,
  },
];

export const productoPorId = (id: number): Producto => {
  const producto = productos.find((p) => p.id === id);
  if (!producto) {
    throw new Error(`No hay producto ${id} en el catálogo de prueba`);
  }
  return producto;
};
