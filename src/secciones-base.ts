// Lo mínimo de las secciones de la página (D12) que necesitan la portada y el estado: los ids, a qué
// sección pertenece cada diseño y cómo se limpia una lista guardada. El catálogo entero (nombres,
// descripciones y la estructura para el export) está en secciones.ts, que baja aparte y reexporta esto.

import type { TipoProyecto } from './tipos';

export type SeccionId = 'beneficios' | 'pasos' | 'precios' | 'testimonios' | 'preguntas' | 'equipo' | 'numeros' | 'contacto';

export type SeccionDisenoId =
  | 'beneficios_renglones'
  | 'beneficios_destacado'
  | 'pasos_fila'
  | 'pasos_escalera'
  | 'precios_planes'
  | 'precios_tabla'
  | 'testimonios_cita'
  | 'testimonios_tres'
  | 'preguntas_acordeon'
  | 'preguntas_abiertas'
  | 'equipo_retratos'
  | 'equipo_lista'
  | 'numeros_fila'
  | 'numeros_protagonista'
  | 'contacto_formulario'
  | 'contacto_datos';

/** A qué sección pertenece cada diseño (un test verifica que coincide con `DISENOS_SECCION`). */
export const SECCION_DE_DISENO: Record<SeccionDisenoId, SeccionId> = {
  beneficios_renglones: 'beneficios',
  beneficios_destacado: 'beneficios',
  pasos_fila: 'pasos',
  pasos_escalera: 'pasos',
  precios_planes: 'precios',
  precios_tabla: 'precios',
  testimonios_cita: 'testimonios',
  testimonios_tres: 'testimonios',
  preguntas_acordeon: 'preguntas',
  preguntas_abiertas: 'preguntas',
  equipo_retratos: 'equipo',
  equipo_lista: 'equipo',
  numeros_fila: 'numeros',
  numeros_protagonista: 'numeros',
  contacto_formulario: 'contacto',
  contacto_datos: 'contacto',
};

/** Tipos de proyecto que arman su página con secciones (PLAN.md §7.9). */
export const TIPOS_CON_SECCIONES = ['landing', 'sitio', 'portfolio'] as const satisfies readonly TipoProyecto[];
export type TipoConSecciones = (typeof TIPOS_CON_SECCIONES)[number];
export const llevaSecciones = (tipo: TipoProyecto): tipo is TipoConSecciones => (TIPOS_CON_SECCIONES as readonly string[]).includes(tipo);

export const esDisenoSeccion = (id: unknown): id is SeccionDisenoId => typeof id === 'string' && id in SECCION_DE_DISENO;
export const seccionDe = (id: SeccionDisenoId): SeccionId => SECCION_DE_DISENO[id];

/** Deja una lista guardada en una lista válida: ids que existen y una sola vez cada sección (gana la última, en el lugar de la primera). */
export function limpiarSecciones(ids: readonly unknown[] | undefined): SeccionDisenoId[] {
  const salida: SeccionDisenoId[] = [];
  for (const id of ids ?? []) {
    if (!esDisenoSeccion(id)) continue;
    const i = salida.findIndex((x) => seccionDe(x) === seccionDe(id));
    if (i >= 0) salida[i] = id;
    else salida.push(id);
  }
  return salida;
}

/**
 * Elegir un diseño: si ya estaba, la sección sale; si la sección estaba con el otro diseño, cambia
 * de diseño sin moverse; si no estaba, entra al final. El orden de la lista es el de la página.
 */
export function combinarSecciones(actual: readonly SeccionDisenoId[], id: SeccionDisenoId): SeccionDisenoId[] {
  const limpio = limpiarSecciones(actual);
  if (limpio.includes(id)) return limpio.filter((x) => x !== id);
  return limpiarSecciones([...limpio, id]);
}
