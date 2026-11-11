// Qué admite cada layout en el recorrido corto (PLAN.md §10, I1). Es DATOS y no entra en la carga
// inicial: solo lo usa `pasosDe` (pasos.ts). `rondas.test.ts` verifica que `fondo` coincida con lo
// que dibuja la página (una zona `.pg-media` o `.pg-fondo-area`).
//
// - fondo: tiene una zona visual donde va un fondo con textura o animado.
// - scroll: es una página que se recorre bajando y los efectos de scroll se lucen. Las plantillas de
//   autor traen su propio movimiento; las pantallas de app y las de un solo fin no se bajan.
// - secciones: después de su composición lleva más página (beneficios, precios…). Coincide con
//   `llevaArgumento`: donde va el argumento de landing pueden ir las secciones.

import type { LayoutId } from '../tipos';

export interface Admite {
  fondo: boolean;
  scroll: boolean;
  secciones: boolean;
}

const t = true;
const f = false;
const A = (fondo: boolean, scroll: boolean, secciones: boolean): Admite => ({ fondo, scroll, secciones });
const AUTOR = A(f, f, f);

export const ADMITE_LAYOUT: Record<LayoutId, Admite> = {
  hero_partido: A(t, t, t),
  bento: A(t, t, t),
  revista: A(f, t, t),
  tipografico: A(t, t, t),
  cinta: A(f, t, t),
  apiladas: A(f, t, t),
  indice: A(f, t, t),
  panel_fijo: A(f, t, t),
  mosaico: A(t, t, t),
  minimo: A(t, t, t),
  app_lateral: A(t, f, f),
  horizontal: A(t, f, t),
  galeria: A(t, t, t),
  precios: A(f, t, t),
  portada_video: A(t, t, t),
  blog_lateral: A(t, t, t),
  equipo: A(t, t, t),
  fondo_protagonista: A(t, t, t),
  tarjeta_sobre_fondo: A(t, t, t),
  editorial_fondo: A(t, t, t),
  widgets_fondo: A(t, t, t),
  autor_panaderia: AUTOR,
  autor_finanzas: AUTOR,
  autor_portfolio: AUTOR,
  autor_festival: AUTOR,
  autor_correr: AUTOR,
  autor_cafeteria: AUTOR,
  autor_floreria: AUTOR,
  autor_refugio: AUTOR,
  autor_concesionario: AUTOR,
  autor_turnos: AUTOR,
  autor_curso: AUTOR,
  autor_restaurante: AUTOR,
  autor_gimnasio: AUTOR,
  linea_tiempo: A(f, t, t),
  antes_despues: A(t, t, t),
  mapa_lista: A(f, f, f),
  carta: A(t, t, t),
  agenda_semanal: A(f, f, f),
  tablero: A(f, f, f),
  muro: A(t, t, t),
  documentacion: A(f, f, f),
  link_bio: A(t, f, f),
  compra_unica: A(t, f, f),
  portada_buscador: A(t, t, t),
  // Ya trae su propio recorrido al bajar: sumarle efectos lo pisaría.
  partida_scroll: A(t, f, t),
};
