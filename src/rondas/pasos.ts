// Recorrido corto (PLAN.md §10, I1): los pasos de Molde, cada uno agrupa una o más rondas. Es DATOS.
// Máximo 5 pasos: Qué es · Estructura · Estilo · Color · Lo propio (solo si hay algo para mostrar).
// Letra, Piezas, Iconos, Tono, Entrada y Densidad dejan de ser pasos: siguen en `rondasDe` para las
// fichas de «Ajustar».

import type { Config } from '../tipos';
import { ADMITE_LAYOUT } from './admite-layout';
import { RAMAS } from './ramas';
import { rondasDe } from './index';
import type { ClaveRonda, Ronda } from './ronda';

export type PasoId = 'que_es' | 'estructura' | 'estilo' | 'color' | 'propio';

export interface Paso {
  id: PasoId;
  /** Nombre corto («paso 2 de 4 · Estructura»). */
  nombre: string;
  /** Las rondas del paso, en orden, todas en una sola pantalla. Siempre al menos una. */
  rondas: Ronda[];
}

export const MAX_PASOS = 5;

/** Rondas que dependen de lo que admite el layout. */
const SEGUN_LAYOUT: Partial<Record<ClaveRonda, keyof (typeof ADMITE_LAYOUT)[keyof typeof ADMITE_LAYOUT]>> = {
  fondo_animado: 'fondo',
  scroll: 'scroll',
  secciones: 'secciones',
};

/** Si el layout de la config admite esta ronda (las que no dependen del layout, siempre). */
export function admiteRonda(c: Config, clave: ClaveRonda): boolean {
  const que = SEGUN_LAYOUT[clave];
  return !que || ADMITE_LAYOUT[c.visual.layout][que];
}

/**
 * Las claves de «Lo propio» para esta config, incluidas las que todavía esperan catálogo (fondo animado):
 * la rama del tipo, sin lo que el layout no admite. Secciones va en Estructura, no acá.
 */
export function clavesPropias(c: Config): ClaveRonda[] {
  return RAMAS[c.proyecto.tipo]
    .map((e): ClaveRonda => ('galeria' in e ? `galeria:${e.galeria}` : 'ronda' in e ? e.ronda.clave : e.pendiente))
    .filter((k) => k !== 'secciones' && admiteRonda(c, k));
}

const GRUPOS: { id: PasoId; nombre: string; claves: (c: Config) => ClaveRonda[] }[] = [
  { id: 'que_es', nombre: 'Qué es', claves: () => ['proyecto', 'rubro'] },
  { id: 'estructura', nombre: 'Estructura', claves: () => ['layout', 'secciones'] },
  { id: 'estilo', nombre: 'Estilo', claves: () => ['estilo'] },
  { id: 'color', nombre: 'Color', claves: () => ['color'] },
  { id: 'propio', nombre: 'Lo propio', claves: clavesPropias },
];

/** Los pasos que ve esta config, en orden: solo los que tienen alguna ronda disponible. */
export function pasosDe(c: Config): Paso[] {
  const disponibles = new Map(rondasDe(c).map((r) => [r.clave, r]));
  return GRUPOS.flatMap(({ id, nombre, claves }) => {
    const rondas = claves(c)
      .filter((k) => admiteRonda(c, k))
      .flatMap((k) => disponibles.get(k) ?? []);
    return rondas.length ? [{ id, nombre, rondas }] : [];
  });
}

/** Las rondas que no son parte de ningún paso: quedan como fichas bajo «Ajustar». */
export function rondasDeAjustar(c: Config): Ronda[] {
  const enPasos = new Set(pasosDe(c).flatMap((p) => p.rondas.map((r) => r.clave)));
  return rondasDe(c).filter((r) => !enPasos.has(r.clave));
}

/** El paso que contiene una ronda (para que `#/letra` y compañía sepan dónde abrirse), o null. */
export const pasoDeRonda = (c: Config, clave: ClaveRonda) => pasosDe(c).find((p) => p.rondas.some((r) => r.clave === clave)) ?? null;
