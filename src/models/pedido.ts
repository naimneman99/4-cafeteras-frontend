
import { ItemPedido } from './ItemPedido';

export class Pedido {
  constructor(
    public id: number,
    public items: ItemPedido[] = [],
    public estado: string = 'pendiente',
    // null: el pedido es para retirar en la barra
    public mesaId: number | null = null
  ) {}

  calcularTotal(): number {
    return this.items.reduce((acumulador, actual) => acumulador + actual.calcularSubtotal(), 0);
  }
}
