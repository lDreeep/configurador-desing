// Efectos de scroll combinables (PLAN.md tarea D7, §7.4). Es DATOS: qué hace cada efecto al bajar,
// en qué zona de la página actúa y su CSS.
//
// Reglas del motor:
// - Cada efecto vive en una zona (portada, texto, galería, página). Se combinan hasta 3, uno por zona:
//   `scrollValido` rechaza dos de la misma zona y `combinarScroll` reemplaza el de esa zona.
// - Todo es CSS scroll-driven animations (decisión D72), sin librerías. El CSS de cada efecto va dentro
//   de @supports (animation-timeline: view()) y @media (prefers-reduced-motion: no-preference): sin
//   soporte o con movimiento reducido, la página queda en su versión quieta (la que describe `quieto`).
// - Solo animan `opacity`, `translate`, `scale`, `filter` y `clip-path`, como propiedades sueltas: no
//   pisan el `transform` ni el `animation` que pone cada estilo o la entrada elegida.
// - En el CSS, `&` es la raíz de la página (`.pg` en la vista previa). Usa solo tokens `--color-*`.
// - Las animaciones usan la línea de tiempo del contenedor que scrollea más cerca (la ventana en la
//   página real, la capa del lienzo en Molde): ningún ancestro del elemento animado puede tener
//   `overflow: hidden` (usar `clip`).

export type ZonaScroll = 'portada' | 'texto' | 'galeria' | 'pagina';

/** Los efectos que ya existen. Los de `SCROLL_PENDIENTES` se suman al final, sin cambiar estos ids. */
export type ScrollId = 'se_aleja' | 'se_enciende' | 'de_costado' | 'barra_progreso';

export interface EfectoScroll {
  nombre: string;
  zona: ZonaScroll;
  descripcion: string;
  /** Qué se ve sin movimiento (sin soporte o con prefers-reduced-motion). */
  quieto: string;
  /** Qué elementos de la página anima (para el export y para quien construya la página). */
  objetivo: string;
  /** Elemento extra que el efecto necesita en la página, si lo necesita (Pagina lo dibuja solo si está elegido). */
  elemento?: 'barra';
  /** CSS del efecto; `&` es la raíz de la página. Sin @supports ni @media: los pone `cssDeScroll`. */
  css: string;
}

export const ZONAS_SCROLL: Record<ZonaScroll, { nombre: string; descripcion: string }> = {
  portada: { nombre: 'Portada', descripcion: 'Lo primero que se ve, mientras se va' },
  texto: { nombre: 'Texto', descripcion: 'Las frases y los títulos de más abajo' },
  galeria: { nombre: 'Galería', descripcion: 'Las filas de tarjetas o imágenes' },
  pagina: { nombre: 'Página', descripcion: 'Toda la página a la vez' },
};

/** Cuántos efectos se pueden combinar (PLAN.md decisión 8). */
export const MAX_SCROLL = 3;

export const EFECTOS_SCROLL: Record<ScrollId, EfectoScroll> = {
  se_aleja: {
    nombre: 'Se aleja',
    zona: 'portada',
    descripcion: 'Al bajar, la portada se achica, se apaga y queda atrás, como si se alejara.',
    quieto: 'La portada queda fija en su lugar.',
    objetivo: 'La primera sección (hero), mientras sale de la pantalla.',
    css: `
& .pg-hero { transform-origin: 50% 0%; animation: scroll-se-aleja linear both; animation-timeline: view(); animation-range: exit 0% exit 100%; }
@keyframes scroll-se-aleja { to { scale: .88; translate: 0 8%; opacity: .25; filter: blur(2px); } }`,
  },
  se_enciende: {
    nombre: 'Frase que se enciende',
    zona: 'texto',
    descripcion: 'Las frases grandes y el cierre arrancan apagados y se encienden a medida que llegan al centro.',
    quieto: 'Las frases se ven encendidas desde el principio.',
    objetivo: 'Frases destacadas, testimonios y el texto del cierre.',
    css: `
& :is(.pg-arg-frase, .pg-arg-testimonio blockquote, .pg-cierre-texto) { animation: scroll-se-enciende linear both; animation-timeline: view(); animation-range: entry 20% cover 45%; }
@keyframes scroll-se-enciende { from { opacity: .14; filter: blur(3px); } to { opacity: 1; filter: none; } }`,
  },
  de_costado: {
    nombre: 'Corre de costado',
    zona: 'galeria',
    descripcion: 'Las filas de tarjetas se deslizan de derecha a izquierda mientras se baja.',
    quieto: 'Las filas quedan quietas en su lugar.',
    objetivo: 'Las filas de tarjetas (la fila no se sale del ancho: la página recorta con overflow: clip).',
    css: `
& .pg-fila { animation: scroll-de-costado linear both; animation-timeline: view(); animation-range: cover 0% cover 100%; }
@keyframes scroll-de-costado { from { translate: 14% 0; } to { translate: -14% 0; } }`,
  },
  barra_progreso: {
    nombre: 'Barra de progreso',
    zona: 'pagina',
    descripcion: 'Una línea del color de acento arriba de todo que se llena a medida que se lee la página.',
    quieto: 'Sin barra: no hay nada que llenar.',
    objetivo: 'Un elemento vacío y decorativo (aria-hidden), primero dentro de la página, fijo arriba con position: sticky.',
    elemento: 'barra',
    css: `
& .scroll-barra { display: block; position: sticky; top: 0; z-index: 30; height: 4px; margin-bottom: -4px; background: var(--color-acento); transform-origin: 0 50%; scale: 0 1; animation: scroll-barra linear both; animation-timeline: scroll(nearest block); }
@keyframes scroll-barra { to { scale: 1 1; } }`,
  },
};

/**
 * Los 10 que faltan de PLAN.md §7.4 (los suma otra sesión con Sonnet, siguiendo los de arriba).
 * Cuando uno existe, sale de esta lista y entra en `ScrollId` y `EFECTOS_SCROLL`.
 */
export const SCROLL_PENDIENTES: { nombre: string; zona: ZonaScroll }[] = [
  { nombre: 'Se queda fija y cambia', zona: 'portada' },
  { nombre: 'Capas a distinta velocidad', zona: 'portada' },
  { nombre: 'El título se parte en dos', zona: 'portada' },
  { nombre: 'Palabras que suben', zona: 'texto' },
  { nombre: 'Número que cuenta', zona: 'texto' },
  { nombre: 'Subrayado que se dibuja', zona: 'texto' },
  { nombre: 'Tarjetas que se apilan', zona: 'galeria' },
  { nombre: 'Zoom a una imagen', zona: 'galeria' },
  { nombre: 'Aparecen de a una', zona: 'galeria' },
  { nombre: 'El fondo cambia de color por sección', zona: 'pagina' },
];

export const esScrollId = (id: string): id is ScrollId => id in EFECTOS_SCROLL;

/** null si la combinación vale; si no, por qué no. */
export function problemaScroll(ids: readonly string[]): string | null {
  if (ids.length > MAX_SCROLL) return `Se combinan hasta ${MAX_SCROLL} efectos.`;
  const zonas = new Set<ZonaScroll>();
  for (const id of ids) {
    if (!esScrollId(id)) return `No existe el efecto «${id}».`;
    const z = EFECTOS_SCROLL[id].zona;
    if (zonas.has(z)) return `Dos efectos en la zona ${ZONAS_SCROLL[z].nombre}: va uno por zona.`;
    zonas.add(z);
  }
  return null;
}

export const scrollValido = (ids: readonly string[]): ids is ScrollId[] => problemaScroll(ids) === null;

/**
 * Elegir un efecto: si ya estaba, se saca; si no, entra y reemplaza al de su zona. Si con él pasan
 * de `MAX_SCROLL`, sale el más viejo. El último elegido queda al final. Siempre devuelve una combinación válida.
 */
export function combinarScroll(actual: readonly ScrollId[], id: ScrollId): ScrollId[] {
  const limpio = limpiarScroll(actual);
  if (limpio.includes(id)) return limpio.filter((x) => x !== id);
  const sinZona = limpio.filter((x) => EFECTOS_SCROLL[x].zona !== EFECTOS_SCROLL[id].zona);
  return [...sinZona, id].slice(-MAX_SCROLL);
}

/** Deja una lista guardada (quizás de otra versión) en una combinación válida: ids que existen, uno por zona, hasta 3. */
export function limpiarScroll(ids: readonly unknown[] | undefined): ScrollId[] {
  const salida: ScrollId[] = [];
  for (const id of ids ?? []) {
    if (typeof id !== 'string' || !esScrollId(id)) continue;
    const i = salida.findIndex((x) => EFECTOS_SCROLL[x].zona === EFECTOS_SCROLL[id].zona);
    if (i >= 0) salida.splice(i, 1);
    salida.push(id);
  }
  return salida.slice(-MAX_SCROLL);
}

/** El CSS de un efecto para una raíz dada, dentro de @supports y prefers-reduced-motion (sin eso, queda quieto). */
export function cssDeScroll(id: ScrollId, raiz: string): string {
  const css = EFECTOS_SCROLL[id].css.trim().replace(/&/g, raiz);
  // Los @keyframes no pueden quedar con la raíz adentro: no la tienen, así que el reemplazo no los toca.
  return `@supports (animation-timeline: view()) {\n@media (prefers-reduced-motion: no-preference) {\n${css}\n}\n}`;
}

/** Clase que lleva la raíz de la página por cada efecto elegido. */
export const claseScroll = (id: ScrollId) => `scroll-${id}`;
