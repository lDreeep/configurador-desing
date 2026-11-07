// Base de la galería de componentes: cada categoría (campo de texto, interruptor, barra inferior…)
// tiene diseños como datos con su CSS. Sumar un diseño = sumar una entrada; el panel, la vista
// previa y el export (DESIGN.md §21) lo toman solos.
//
// En el CSS de una categoría, `&` es la raíz del componente (.cm-<categoria>).
// En el CSS de un diseño, `&` es .cm-<categoria>.cm-<categoria>-<diseño>.
// Usar solo tokens: --color-*, --radio-*, --fuente-*, --duracion-*, --curva-*, --boton-*.

import { createContext, type ComponentType } from 'react';
import type { Config } from '../tipos';

export type CategoriaId =
  | 'boton_sec'
  | 'boton_icono'
  | 'campo'
  | 'selector'
  | 'interruptor'
  | 'casilla'
  | 'deslizador'
  | 'nav_movil'
  | 'nav_web'
  | 'etiqueta'
  | 'aviso'
  | 'cargando'
  | 'progreso'
  | 'acordeon'
  | 'avatar'
  | 'tooltip'
  | 'modal'
  | 'metrica'
  | 'grafico'
  | 'tabla'
  | 'desplegable'
  | 'buscador'
  | 'paginacion'
  | 'migas'
  | 'pasos'
  | 'vacio'
  | 'calendario'
  | 'carrusel'
  | 'pie'
  | 'formulario'
  | 'subir';

/** La config actual, para muestras que combinan con otras elecciones (por ejemplo, el botón principal). */
export const GaleriaContexto = createContext<Config | null>(null);

export interface DisenoComp {
  nombre: string;
  descripcion: string;
  css: string;
}

export interface Categoria {
  id: CategoriaId;
  nombre: string;
  /** Para frases como «Elegí tu …». */
  singular: string;
  descripcion: string;
  /** Estructura HTML de referencia, para que la IA la reproduzca. */
  estructura: string;
  /** Ancho mínimo de cada celda en el panel. */
  anchoCelda: number;
  base: string;
  disenos: Record<string, DisenoComp>;
  Muestra: ComponentType<{ clase: string; id: string }>;
}

export const claseDe = (cat: CategoriaId, diseno: string) => `cm-${cat} cm-${cat}-${diseno}`;

export const cssBaseDe = (c: Categoria, raiz = `.cm-${c.id}`) => c.base.replace(/&/g, raiz);
export const cssDisenoDe = (c: Categoria, diseno: string, raiz = `.cm-${c.id}.cm-${c.id}-${diseno}`) => c.disenos[diseno].css.replace(/&/g, raiz);

/** Reinicia una animación de clase en un elemento (para «al escribir», «al tocar»…). */
export function reanimar(el: Element | null, clase: string) {
  if (!el) return;
  el.classList.remove(clase);
  void (el as HTMLElement).offsetWidth;
  el.classList.add(clase);
}
