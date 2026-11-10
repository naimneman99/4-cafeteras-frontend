// Formatea un precio en pesos con punto de miles: 7360 -> "$7.360"
export function formatearPrecio(monto: number): string {
  const conMiles = Math.round(monto)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `$${conMiles}`;
}
