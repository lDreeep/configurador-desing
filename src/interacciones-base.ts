import type { Config, HoverId, CursorId, TipoProyecto } from './tipos';

/** Evita que las elecciones guardadas se apliquen a tipos que no tienen estas rondas. */
export const admiteInteracciones = (tipo: TipoProyecto) => ['landing', 'tienda', 'portfolio'].includes(tipo);
export const claseHoverTarjetas = (id: HoverId) => `tarjetas-hover-${id}`;
export const claseCursor = (id: CursorId) => `cursor-${id}`;
export function clasesInteracciones(c: Config): string[] {
  if (!admiteInteracciones(c.proyecto.tipo)) return [];
  return [c.visual.hoverTarjetas ? claseHoverTarjetas(c.visual.hoverTarjetas) : '', c.visual.cursor ? claseCursor(c.visual.cursor) : ''].filter(Boolean);
}
