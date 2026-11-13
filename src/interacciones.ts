// CSS compartido por la página y §12. No entra en la carga inicial: lo pide hoja-pagina.
import type { HoverId, CursorId } from './tipos';
import { claseCursor, claseHoverTarjetas } from './interacciones-base';

export const SELECTOR_TARJETAS = ':is(.pg-card, .cm-producto)';
const EFECTOS: Record<HoverId, string> = {
  nada: '',
  oscurecer: 'filter: brightness(.9);',
  brillo: 'filter: brightness(1.12) saturate(1.1);',
  elevar: 'translate: 0 -2px; box-shadow: var(--sombra-3);',
  escalar: 'scale: 1.06;',
  sombra: 'box-shadow: var(--sombra-2);',
  desplazar: 'translate: -2px -2px;',
};
const SOLO_MOUSE = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

/** La elección explícita gana sobre el hover del preset de caja; no toca botones ni foco. */
export function cssHoverTarjetas(id: HoverId): string {
  const objetivo = `.pg.pg.pg.pg.pg.${claseHoverTarjetas(id)} ${SELECTOR_TARJETAS}`;
  return `/* Tarjetas: clase ${claseHoverTarjetas(id)} en la raíz .pg. La elección gana sobre el hover de §20. */
@media ${SOLO_MOUSE} {
  ${objetivo} { transition: translate var(--duracion-media) var(--curva-entrada), scale var(--duracion-media) var(--curva-entrada), filter var(--duracion-media) var(--curva-entrada), box-shadow var(--duracion-media) var(--curva-entrada); }
  ${objetivo}:hover { ${EFECTOS[id]} }
}
@media (prefers-reduced-motion: reduce) { ${objetivo} { transition: none; } }`;
}

// Borde blanco y trazo negro fijos: el cursor mantiene contraste sobre cualquier paleta.
// Son formas vectoriales de cursor (no contenido de la página). Sin JS ni cursor:none.
const FORMAS: Record<Exclude<CursorId, 'normal'>, string> = {
  punto: '<circle cx="12" cy="12" r="4" fill="black" stroke="white" stroke-width="2"/>',
  anillo: '<circle cx="12" cy="12" r="8" fill="none" stroke="white" stroke-width="4"/><circle cx="12" cy="12" r="8" fill="none" stroke="black" stroke-width="2"/>',
  cruz: '<path d="M12 3v18M3 12h18" stroke="white" stroke-width="4"/><path d="M12 3v18M3 12h18" stroke="black" stroke-width="2"/>',
};
export function cssCursor(id: CursorId): string {
  // Normal no fuerza auto en los hijos: conserva pointer/text/resize/not-allowed del navegador.
  if (id === 'normal') return '.pg.cursor-normal { cursor: auto; } /* Los controles conservan su cursor nativo. */';
  const svg = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">${FORMAS[id]}</svg>`);
  return `/* Cursor: clase ${claseCursor(id)} en .pg; los controles conservan su señal nativa. */
@media ${SOLO_MOUSE} {
  .pg.${claseCursor(id)} { cursor: url("data:image/svg+xml,${svg}") 12 12, auto; }
  .pg.${claseCursor(id)} :is(a, button, summary, [role="button"]) { cursor: pointer; }
  .pg.${claseCursor(id)} :is(input, textarea, [contenteditable="true"]) { cursor: auto; }
  .pg.${claseCursor(id)} :is(button, input):disabled { cursor: not-allowed; }
}`;
}
