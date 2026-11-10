// El cliente de la API siempre lanza Error con un mensaje listo para mostrar
export const mensajeDe = (error: unknown): string => (error instanceof Error ? error.message : String(error));
