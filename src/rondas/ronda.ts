// Modelo de las rondas de Molde (PLAN.md §4 y tarea C1). Es DATOS: qué se pregunta, qué opciones hay
// según lo ya elegido y cómo cada opción cambia la `Config`. La interfaz (C2) solo las recorre.

import type { CategoriaId } from '../galeria/base';
import { ordenar } from '../recomendados';
import type { Config } from '../tipos';

/** Las rondas comunes a todos los tipos, en el orden en que aparecen. */
export type ClaveComun = 'proyecto' | 'rubro' | 'color' | 'layout' | 'estilo' | 'piezas' | 'letra' | 'entrada';
/** Rondas propias de una rama: una categoría de la galería o una ronda que todavía no existe. */
export type ClaveRama = `galeria:${CategoriaId}` | 'fondo_animado' | 'scroll' | 'secciones' | 'densidad' | 'lectura';
export type ClaveRonda = ClaveComun | ClaveRama;

export interface OpcionRonda {
  id: string;
  nombre: string;
  descripcion?: string;
  /** Va primero y lleva el sello «Recomendado» (sale de `recomendados.ts` o de las reglas del estilo). */
  recomendada: boolean;
  /** Colores para dibujar la muestra, si los tiene (paletas, estilos). */
  muestras?: string[];
}

/** Lo que la interfaz sabe del recorrido, para que una ronda no pise lo que la persona ya eligió. */
export interface ContextoRonda {
  elegidas: ReadonlySet<ClaveRonda>;
}

export interface Ronda {
  clave: ClaveRonda;
  /** Nombre corto de la ficha que queda abajo («Color», «Letra»…). */
  ficha: string;
  /** Lo que se le pregunta a la persona. */
  pregunta: string;
  /** Las cinco primeras son obligatorias; el resto, ideas opcionales. */
  obligatoria: boolean;
  /** Opciones según lo ya elegido: las recomendadas primero, después el resto. Nunca esconde nada. */
  opciones: (c: Config) => OpcionRonda[];
  /** Aplica una opción. Devuelve una config nueva. */
  aplicar: (c: Config, id: string, ctx?: ContextoRonda) => Config;
  /** La opción que la config tiene hoy (para marcarla y para la ficha), o null si no corresponde a ninguna. */
  elegida: (c: Config) => string | null;
}

/** Una ronda que el plan pide pero todavía no tiene catálogo: queda anotada y `rondasDe` no la devuelve. */
export interface RondaPendiente {
  clave: ClaveRonda;
  ficha: string;
  pregunta: string;
  /** La tarea de PLAN.md que la hace posible. */
  tarea: string;
}

/** Ordena ids con `ordenar` de recomendados.ts (recomendados primero, en su orden) y marca cuáles lo son. */
export function primeroRecomendados<T extends string>(todos: readonly T[], recomendados: readonly string[]): { id: T; recomendada: boolean }[] {
  const { recomendados: rec, resto } = ordenar([...todos], [...new Set(recomendados)]);
  return [...rec.map((id) => ({ id, recomendada: true })), ...resto.map((id) => ({ id, recomendada: false }))];
}
