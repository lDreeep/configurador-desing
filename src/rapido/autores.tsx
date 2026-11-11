// Layouts cargados a pedido: las plantillas de autor, los genéricos de layouts1.tsx y los 12 de la
// tanda D3 (layouts2.tsx). En la carga inicial solo van los tres genéricos de Pagina.tsx.
// Cada archivo (con su CSS) baja recién cuando se muestra uno de sus layouts, o antes con
// `precargarLayouts()`. Si ya está cargado, se dibuja de una, sin pasar por el «cargando»
// (así la portada no parpadea al rotar).

import type { ComponentType } from 'react';
import type { Config, LayoutId } from '../tipos';
import type { Contenido } from './Pagina';

type PropsAutor = { c: Config; marca?: string };
/** Props de los layouts de layouts1.tsx y layouts2.tsx (los mismos que reciben los genéricos de Pagina.tsx). */
export type PropsLayout = { c: Config; k: Contenido; cc: string };
type Modulo = Record<string, unknown>;

const ARCHIVOS = {
  autor: () => import('./autor'),
  autor2: () => import('./autor2'),
  autor3: () => import('./autor3'),
  concesionario: () => import('./concesionario'),
  layouts1: () => import('./layouts1'),
  layouts2: () => import('./layouts2'),
} satisfies Record<string, () => Promise<Modulo>>;
type Archivo = keyof typeof ARCHIVOS;

/** Qué componente de qué archivo dibuja cada plantilla de autor. */
export const PLANTILLAS_AUTOR: Partial<Record<LayoutId, [Archivo, string]>> = {
  autor_panaderia: ['autor', 'Panaderia'],
  autor_finanzas: ['autor', 'Finanzas'],
  autor_portfolio: ['autor', 'Portfolio'],
  autor_festival: ['autor2', 'Festival'],
  autor_correr: ['autor2', 'Correr'],
  autor_cafeteria: ['autor2', 'Cafeteria'],
  autor_floreria: ['autor2', 'Floreria'],
  autor_refugio: ['autor2', 'Refugio'],
  autor_turnos: ['autor3', 'Turnos'],
  autor_curso: ['autor3', 'Curso'],
  autor_restaurante: ['autor3', 'Restaurante'],
  autor_gimnasio: ['autor3', 'Gimnasio'],
  autor_concesionario: ['concesionario', 'Concesionario'],
};

const deArchivo = (archivo: Archivo, componente: string, ids: LayoutId[]) =>
  Object.fromEntries(ids.map((id) => [id, [archivo, componente]])) as Partial<Record<LayoutId, [Archivo, string]>>;

/** Los layouts genéricos que bajan aparte: los de layouts1.tsx (`LayoutGenerico`) y los de layouts2.tsx (`LayoutNuevo`). */
export const LAYOUTS_APARTE: Partial<Record<LayoutId, [Archivo, string]>> = {
  ...deArchivo('layouts1', 'LayoutGenerico', [
    'revista',
    'tipografico',
    'cinta',
    'apiladas',
    'indice',
    'panel_fijo',
    'galeria',
    'precios',
    'portada_video',
    'blog_lateral',
    'equipo',
    'fondo_protagonista',
    'tarjeta_sobre_fondo',
    'editorial_fondo',
    'widgets_fondo',
    'mosaico',
    'app_lateral',
    'horizontal',
  ]),
  ...deArchivo('layouts2', 'LayoutNuevo', [
    'linea_tiempo',
    'antes_despues',
    'mapa_lista',
    'carta',
    'agenda_semanal',
    'tablero',
    'muro',
    'documentacion',
    'link_bio',
    'compra_unica',
    'portada_buscador',
    'partida_scroll',
  ]),
};

const archivoDe = (layout: LayoutId) => (PLANTILLAS_AUTOR[layout] ?? LAYOUTS_APARTE[layout])?.[0];

const cargados = new Map<Archivo, Modulo>();
const enCurso = new Map<Archivo, Promise<void>>();

function cargar(a: Archivo): Promise<void> {
  if (cargados.has(a)) return Promise.resolve();
  let p = enCurso.get(a);
  if (!p) {
    p = ARCHIVOS[a]().then((m) => void cargados.set(a, m as Modulo));
    enCurso.set(a, p);
  }
  return p;
}

/** Baja el archivo de un layout (si es de los que bajan aparte). */
export function precargarLayout(layout: LayoutId): Promise<void> {
  const a = archivoDe(layout);
  return a ? cargar(a) : Promise.resolve();
}
/** Baja todos los archivos de layouts aparte. */
export const precargarLayouts = () => Promise.all((Object.keys(ARCHIVOS) as Archivo[]).map(cargar)).then(() => undefined);
/** true si el layout se puede dibujar ya (no baja aparte, o su archivo ya llegó). */
export const layoutListo = (layout: LayoutId) => {
  const a = archivoDe(layout);
  return !a || cargados.has(a);
};

function componente<P>(d: [Archivo, string] | undefined): ComponentType<P> | null {
  if (!d) return null;
  const m = cargados.get(d[0]);
  if (!m) throw cargar(d[0]);
  return m[d[1]] as ComponentType<P>;
}

/** Dibuja la plantilla de autor. Si su archivo no llegó, suspende (va dentro de un <Suspense>). */
export function PlantillaAutor({ layout, ...props }: PropsAutor & { layout: LayoutId }) {
  const C = componente<PropsAutor>(PLANTILLAS_AUTOR[layout]);
  return C && <C {...props} />;
}

/** Dibuja un layout de layouts1.tsx o layouts2.tsx. Si su archivo no llegó, suspende (va dentro de un <Suspense>). */
export function LayoutAparte(props: PropsLayout) {
  const C = componente<PropsLayout>(LAYOUTS_APARTE[props.c.visual.layout]);
  return C && <C {...props} />;
}
