// Lo mínimo de los efectos de scroll (D7) que necesitan la portada y el estado: los ids, la zona de
// cada uno y las reglas para combinarlos. El catálogo entero (descripciones y CSS) está en scroll.ts,
// que baja aparte y reexporta esto.

export type ZonaScroll = 'portada' | 'texto' | 'galeria' | 'pagina';

/** Los 14 efectos de PLAN.md §7.4. Los nuevos se suman al final, sin cambiar estos ids. */
export type ScrollId =
  | 'se_aleja'
  | 'se_enciende'
  | 'de_costado'
  | 'barra_progreso'
  | 'queda_fija'
  | 'capas'
  | 'titulo_partido'
  | 'palabras_suben'
  | 'numero_cuenta'
  | 'subrayado'
  | 'apilan'
  | 'zoom_imagen'
  | 'de_a_una'
  | 'fondo_cambia';

/** La zona de cada efecto (un test verifica que coincide con `EFECTOS_SCROLL`). */
export const ZONA_DE_SCROLL: Record<ScrollId, ZonaScroll> = {
  se_aleja: 'portada',
  se_enciende: 'texto',
  de_costado: 'galeria',
  barra_progreso: 'pagina',
  queda_fija: 'portada',
  capas: 'portada',
  titulo_partido: 'portada',
  palabras_suben: 'texto',
  numero_cuenta: 'texto',
  subrayado: 'texto',
  apilan: 'galeria',
  zoom_imagen: 'galeria',
  de_a_una: 'galeria',
  fondo_cambia: 'pagina',
};

/** Elemento extra que un efecto necesita en la página (Pagina lo dibuja solo si está elegido). */
export const ELEMENTO_SCROLL: Partial<Record<ScrollId, 'barra'>> = {
  barra_progreso: 'barra',
};

/** Cuántos efectos se pueden combinar (PLAN.md decisión 8). */
export const MAX_SCROLL = 3;

export const esScrollId = (id: string): id is ScrollId => id in ZONA_DE_SCROLL;

/**
 * Elegir un efecto: si ya estaba, se saca; si no, entra y reemplaza al de su zona. Si con él pasan
 * de `MAX_SCROLL`, sale el más viejo. El último elegido queda al final. Siempre devuelve una combinación válida.
 */
export function combinarScroll(actual: readonly ScrollId[], id: ScrollId): ScrollId[] {
  const limpio = limpiarScroll(actual);
  if (limpio.includes(id)) return limpio.filter((x) => x !== id);
  const sinZona = limpio.filter((x) => ZONA_DE_SCROLL[x] !== ZONA_DE_SCROLL[id]);
  return [...sinZona, id].slice(-MAX_SCROLL);
}

/** Deja una lista guardada (quizás de otra versión) en una combinación válida: ids que existen, uno por zona, hasta 3. */
export function limpiarScroll(ids: readonly unknown[] | undefined): ScrollId[] {
  const salida: ScrollId[] = [];
  for (const id of ids ?? []) {
    if (typeof id !== 'string' || !esScrollId(id)) continue;
    const i = salida.findIndex((x) => ZONA_DE_SCROLL[x] === ZONA_DE_SCROLL[id]);
    if (i >= 0) salida.splice(i, 1);
    salida.push(id);
  }
  return salida.slice(-MAX_SCROLL);
}

/** Clase que lleva la raíz de la página por cada efecto elegido. */
export const claseScroll = (id: ScrollId) => `scroll-${id}`;
