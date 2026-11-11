// Las rondas de Molde para una config: las comunes y las de la rama de su tipo de proyecto.
// Orden (PLAN.md §4): Proyecto → Rubro → Color → Layout → Estilo · Piezas · Letra · Entrada · rondas de la rama.
// «Ajustar» y «Descargar» no son rondas de elegir: las arman C4 y F3.

import type { Config } from '../tipos';
import { COLOR, DENSIDAD, ENTRADA, ESTILO, ICONOS_RONDA, LAYOUT, LETRA, PIEZAS, PROYECTO, RUBRO, TONO } from './comunes';
import { pendientesDeRama, rondasDeRama } from './ramas';
import type { ClaveRonda, Ronda, RondaPendiente } from './ronda';

export type { ClaveRonda, ContextoRonda, OpcionRonda, Ronda, RondaPendiente } from './ronda';
export { RAMAS, RONDA_SCROLL, RONDA_SECCIONES, rondaDeGaleria, SIN_SCROLL, SIN_SECCIONES } from './ramas';

/** Rondas comunes, en orden. Rubro va entre Proyecto y Color (D13). La densidad (D11) va al final de la rama. */
export const COMUNES: Ronda[] = [PROYECTO, RUBRO, COLOR, LAYOUT, ESTILO, PIEZAS, LETRA, ENTRADA, ICONOS_RONDA, TONO];

/** Las rondas que ve esta config, en orden. Cambia con el tipo de proyecto. */
export function rondasDe(c: Config): Ronda[] {
  const rama = rondasDeRama(c.proyecto.tipo);
  // La densidad es para todos; si la rama ya la trae (dashboard), no se repite.
  return [...COMUNES, ...rama, ...(rama.some((r) => r.clave === DENSIDAD.clave) ? [] : [DENSIDAD])];
}

/** Las rondas que el plan pide para esta config y todavía no tienen catálogo (con la tarea que las trae). */
export function rondasPendientes(c: Config): RondaPendiente[] {
  return pendientesDeRama(c.proyecto.tipo);
}

export const rondaPorClave = (c: Config, clave: ClaveRonda) => rondasDe(c).find((r) => r.clave === clave);

/** Las obligatorias que faltan elegir: hasta que no queda ninguna no se puede descargar. */
export const faltanObligatorias = (c: Config, elegidas: ReadonlySet<ClaveRonda>) => rondasDe(c).filter((r) => r.obligatoria && !elegidas.has(r.clave));
