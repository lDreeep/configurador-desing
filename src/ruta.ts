const BASE = (import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? './';

/** Ruta a un archivo de `public/` que funciona bajo cualquier subcarpeta (p. ej. GitHub Pages: /repo/). Con `base: './'` queda relativa a la página. */
export const rutaPublica = (ruta: string) => BASE + ruta.replace(/^\/+/, '');
