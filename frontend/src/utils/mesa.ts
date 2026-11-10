// Lee la mesa del QR (?mesa=N). Sin mesa, o con un valor que no es un entero positivo,
// devuelve null: el pedido es para retirar en la barra.
export function leerMesa(search: string): number | null {
  const valor = new URLSearchParams(search).get('mesa');
  if (valor === null || !/^\d+$/.test(valor)) {
    return null;
  }

  const mesa = Number(valor);
  return mesa > 0 ? mesa : null;
}
