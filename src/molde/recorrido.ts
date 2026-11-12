// El recorrido de Molde sin interfaz: qué rondas ya se eligieron, cuál sigue y cómo se guarda.
// La config vive en `estado.ts` (localStorage); acá solo se guarda qué rondas ya tienen respuesta,
// para que las fichas y la página sobrevivan a recargar.

import { useEffect, useState } from 'react';
import { faltanObligatorias, pasosDe, rondasDe, type ClaveRonda, type Ronda } from '../rondas';
import type { Config, PasoId } from '../tipos';

export const CLAVE_ELEGIDAS = 'molde:elegidas';
/** Pasos de Molde que no son rondas. */
export const INICIO_MOLDE = 'inicio';
export const LISTO_MOLDE = 'listo';
/** Opciones por vuelta (PLAN.md §4, decisión 3). */
export const POR_VEZ = 6;

type Almacen = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
const almacenDelNavegador = (): Almacen | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
};

export function leerElegidas(almacen: Almacen | null = almacenDelNavegador()): Set<ClaveRonda> {
  try {
    const crudo = almacen?.getItem(CLAVE_ELEGIDAS);
    const lista = crudo ? (JSON.parse(crudo) as unknown) : [];
    return new Set(Array.isArray(lista) ? (lista.filter((x) => typeof x === 'string') as ClaveRonda[]) : []);
  } catch {
    return new Set();
  }
}

export function guardarElegidas(elegidas: ReadonlySet<ClaveRonda>, almacen: Almacen | null = almacenDelNavegador()) {
  try {
    if (elegidas.size) almacen?.setItem(CLAVE_ELEGIDAS, JSON.stringify([...elegidas]));
    else almacen?.removeItem(CLAVE_ELEGIDAS);
  } catch {
    // sin almacenamiento: lo elegido dura la sesión
  }
}

/** Las rondas ya elegidas, guardadas en localStorage. */
export function useElegidas() {
  const [elegidas, setElegidas] = useState<ReadonlySet<ClaveRonda>>(() => leerElegidas());
  useEffect(() => guardarElegidas(elegidas), [elegidas]);
  return [elegidas, setElegidas] as const;
}

/** Las rondas del recorrido corto (PLAN.md §10), en orden: las de cada paso de `pasosDe`, una tras otra. */
export const rondasDelRecorrido = (c: Config): Ronda[] => pasosDe(c).flatMap((p) => p.rondas);

/** La primera ronda del recorrido sin elegir, o `listo` si no queda ninguna. Las de «Ajustar» no se piden. */
export function siguiente(c: Config, elegidas: ReadonlySet<ClaveRonda>): string {
  return rondasDelRecorrido(c).find((r) => !elegidas.has(r.clave))?.clave ?? LISTO_MOLDE;
}

/** La ronda que viene después de `clave` en el recorrido, o `listo` tras la última. Una de «Ajustar» se queda donde está. */
export function despuesDe(c: Config, clave: ClaveRonda): string {
  const rondas = rondasDelRecorrido(c);
  const i = rondas.findIndex((r) => r.clave === clave);
  return i < 0 ? clave : (rondas[i + 1]?.clave ?? LISTO_MOLDE);
}

/** Qué se muestra para un paso de la URL: una ronda, el inicio o el final. Un paso que no corresponde se corrige. */
export function resolverPaso(c: Config, elegidas: ReadonlySet<ClaveRonda>, paso: string): { ronda: Ronda | null; paso: string } {
  const ronda = rondasDe(c).find((r) => r.clave === paso) ?? null;
  if (ronda) {
    // Sin proyecto no hay página: la primera ronda siempre es Proyecto.
    if (ronda.clave !== 'proyecto' && !elegidas.has('proyecto')) return resolverPaso(c, elegidas, 'proyecto');
    return { ronda, paso };
  }
  if (paso === INICIO_MOLDE && elegidas.size === 0) return { ronda: null, paso };
  if (paso === LISTO_MOLDE && faltanObligatorias(c, elegidas).length === 0) return { ronda: null, paso };
  if (elegidas.size === 0) return { ronda: null, paso: INICIO_MOLDE };
  const sig = siguiente(c, elegidas);
  return sig === LISTO_MOLDE ? { ronda: null, paso: sig } : resolverPaso(c, elegidas, sig);
}

/**
 * Elegir una opción: aplica la ronda, la marca como elegida y dice qué ronda sigue (la misma, si es de «Ajustar»).
 * Cambiar de proyecto conserva color, estilo, piezas y letra; las rondas de la rama anterior se vuelven a elegir.
 */
export function elegir(c: Config, elegidas: ReadonlySet<ClaveRonda>, ronda: Ronda, id: string) {
  const config = ronda.aplicar(c, id, { elegidas });
  const disponibles = new Set(rondasDe(config).map((r) => r.clave));
  const nuevas = new Set([...elegidas, ronda.clave].filter((k) => disponibles.has(k)));
  if (!config.proyecto.rubro) nuevas.delete('rubro');
  return { config, elegidas: nuevas as ReadonlySet<ClaveRonda>, siguiente: despuesDe(config, ronda.clave) };
}

/** El nombre de lo elegido en una ronda, para su ficha. */
export function valorDeFicha(c: Config, ronda: Ronda): string {
  const ops = ronda.opciones(c);
  // Rondas de elegir varias: todas las marcadas, en el orden en que se eligieron.
  if (ronda.marcadas) return ronda.marcadas(c).map((id) => ops.find((o) => o.id === id)?.nombre ?? id).join(' + ') || 'A tu medida';
  const id = ronda.elegida(c);
  return (id && ops.find((o) => o.id === id)?.nombre) || 'A tu medida';
}

/**
 * Dónde se acomoda cada idea alrededor del centro (px desde el centro).
 * En pantallas anchas, en óvalo; en angostas, de a dos por fila arriba y abajo del botón.
 */
export function posiciones(n: number, ancho: number, alto: number): [number, number][] {
  if (ancho < 760) {
    return Array.from({ length: n }, (_, i) => {
      const fila = Math.floor(i / 2);
      const arriba = fila % 2 === 0;
      const k = Math.floor(fila / 2);
      const solo = n % 2 === 1 && i === n - 1;
      return [solo ? 0 : (i % 2 ? 1 : -1) * ancho * 0.24, (arriba ? -1 : 1) * (108 + k * 62)];
    });
  }
  const rx = Math.min(ancho * 0.33, 470);
  const ry = Math.min((alto - 150) * 0.36, 270);
  return Array.from({ length: n }, (_, i) => {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2 + (n % 2 ? 0 : Math.PI / n);
    return [Math.cos(a) * rx, Math.sin(a) * ry];
  });
}

/**
 * Ajustes finos de cada ficha (PLAN.md C4): qué pasos del modo avanzado (`PASOS`) se abren desde cada ronda.
 * Entre todas cubren todos los pasos: lo verifica `recorrido.test.ts`. Las rondas de galería no tienen ajustes.
 * `direccion` y `exportar` se muestran en una versión para Molde (ver `Ajustes.tsx`).
 */
export const AJUSTES: Partial<Record<ClaveRonda, PasoId[]>> = {
  proyecto: ['proyecto', 'funciones', 'exportar'],
  color: ['color'],
  layout: ['estructura'],
  estilo: ['direccion', 'forma'],
  piezas: ['botones'],
  letra: ['tipografia'],
  entrada: ['movimiento'],
};
