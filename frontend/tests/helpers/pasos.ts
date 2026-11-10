import { screen } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';

// El pedido de ejemplo del enunciado: dos expresos medianos de Colombia y un muffin
export async function armarPedidoDeEjemplo(user: UserEvent) {
  await user.click(await screen.findByRole('radio', { name: 'Expreso' }));
  await user.click(screen.getByRole('radio', { name: 'Mediano' }));
  await user.click(screen.getByRole('radio', { name: /Colombia/ }));
  await user.click(screen.getByRole('button', { name: 'Agregar café' }));
  await user.click(screen.getByRole('button', { name: 'Sumar uno de Expreso Mediano · Colombia' }));
  await user.click(screen.getByRole('button', { name: 'Agregar Muffin de chocolate' }));
}
