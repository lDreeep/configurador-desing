// Plantillas de autor cargadas a pedido: cada archivo (con su CSS) baja recién cuando se muestra
// una de sus plantillas, o antes con `precargarAutores()`. Si ya está cargada, se dibuja de una,
// sin pasar por el «cargando» (así la portada no parpadea al rotar).

import type { ComponentType } from 'react';
import type { Config, LayoutId } from '../tipos';

type PropsAutor = { c: Config; marca?: string };
type Modulo = Record<string, unknown>;

const ARCHIVOS = {
  autor: () => import('./autor'),
  autor2: () => import('./autor2'),
  autor3: () => import('./autor3'),
  concesionario: () => import('./concesionario'),
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

/** Baja el archivo de una plantilla (o de todas, sin argumento). */
export function precargarAutor(layout: LayoutId): Promise<void> {
  const d = PLANTILLAS_AUTOR[layout];
  return d ? cargar(d[0]) : Promise.resolve();
}
export const precargarAutores = () => Promise.all((Object.keys(ARCHIVOS) as Archivo[]).map(cargar)).then(() => undefined);
export const autorListo = (layout: LayoutId) => {
  const d = PLANTILLAS_AUTOR[layout];
  return !d || cargados.has(d[0]);
};

/** Dibuja la plantilla de autor. Si su archivo no llegó, suspende (va dentro de un <Suspense>). */
export function PlantillaAutor({ layout, ...props }: PropsAutor & { layout: LayoutId }) {
  const d = PLANTILLAS_AUTOR[layout];
  if (!d) return null;
  const m = cargados.get(d[0]);
  if (!m) throw cargar(d[0]);
  const C = m[d[1]] as ComponentType<PropsAutor>;
  return <C {...props} />;
}
