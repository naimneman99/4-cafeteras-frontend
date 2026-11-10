import { variedad } from './types';

export interface InfoVariedad {
  nombre: string;
  descripcion: string;
}

// Nombre para mostrar y descripción de cada origen, tal como los ve el cliente en el menú
export const INFO_VARIEDAD: Record<variedad, InfoVariedad> = {
  COLOMBIA: {
    nombre: 'Colombia',
    descripcion: 'Acidez media, cuerpo equilibrado y notas cítricas y florales',
  },
  ETIOPIA: {
    nombre: 'Etiopía',
    descripcion: 'Acidez muy viva, cuerpo ligero y notas frutales',
  },
  BRASIL: {
    nombre: 'Brasil',
    descripcion: 'Acidez baja, cuerpo denso y notas de avellana',
  },
};
