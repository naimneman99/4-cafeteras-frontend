interface Props {
  mesa: number | null;
}

export function Encabezado({ mesa }: Props) {
  return (
    <header className="app-header">
      <h1>Origen</h1>
      {mesa === null ? (
        <span className="mesa-badge is-barra">Retiro en barra</span>
      ) : (
        <span className="mesa-badge">Mesa {mesa}</span>
      )}
    </header>
  );
}
