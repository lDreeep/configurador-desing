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

/** Los 14 efectos de PLAN.md §7.4. Los nuevos se suman al final, sin cambiar estos ids. */
export type ScrollId =
  | 'se_aleja'
  | 'se_enciende'
  | 'de_costado'
  | 'barra_progreso'
  | 'queda_fija'
  | 'capas'
  | 'titulo_partido'
  | 'palabras_suben'
  | 'numero_cuenta'
  | 'subrayado'
  | 'apilan'
  | 'zoom_imagen'
  | 'de_a_una'
  | 'fondo_cambia';

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
  queda_fija: {
    nombre: 'Se queda fija y cambia',
    zona: 'portada',
    descripcion: 'La portada queda clavada arriba mientras el resto de la página pasa por encima, y se va apagando.',
    quieto: 'La portada es una sección más: se va con el scroll.',
    objetivo: 'La primera sección (hero), clavada con position: sticky; lo que sigue la tapa con el color de fondo.',
    css: `
& .pg-hero { position: sticky; top: 0; z-index: 0; animation: scroll-queda-fija linear both; animation-timeline: scroll(nearest block); animation-range: 0 90vh; }
& .pg-contenido > :not(:first-child):not(.pg-hero) { position: relative; z-index: 1; background: var(--color-fondo); }
@keyframes scroll-queda-fija { to { opacity: .2; filter: blur(3px); scale: .96; } }`,
  },
  capas: {
    nombre: 'Capas a distinta velocidad',
    zona: 'portada',
    descripcion: 'En la portada, la imagen baja más lento que el texto: da profundidad, como capas a distinta distancia.',
    quieto: 'Imagen y texto quedan alineados.',
    objetivo: 'La imagen y el título de la portada (hero), mientras sale de la pantalla.',
    css: `
& .pg-hero .pg-media { animation: scroll-capas-fondo linear both; animation-timeline: view(); animation-range: exit 0% exit 100%; }
& .pg-hero .pg-titulo { animation: scroll-capas-frente linear both; animation-timeline: view(); animation-range: exit 0% exit 100%; }
@keyframes scroll-capas-fondo { to { translate: 0 18%; } }
@keyframes scroll-capas-frente { to { translate: 0 -22%; } }`,
  },
  titulo_partido: {
    nombre: 'El título se parte en dos',
    zona: 'portada',
    descripcion: 'El título sube y la bajada con los botones bajan: la portada se abre en dos mientras se va.',
    quieto: 'El título, la bajada y los botones quedan juntos.',
    objetivo: 'El título de la portada (sube) y su bajada (baja), mientras sale de la pantalla.',
    css: `
& .pg-hero .pg-split-texto > .pg-titulo, & .pg-hero > .pg-titulo { animation: scroll-parte-arriba linear both; animation-timeline: view(); animation-range: exit 0% exit 80%; }
& .pg-hero .pg-bajada { animation: scroll-parte-abajo linear both; animation-timeline: view(); animation-range: exit 0% exit 80%; }
@keyframes scroll-parte-arriba { to { translate: 0 -60%; opacity: 0; } }
@keyframes scroll-parte-abajo { to { translate: 0 60%; opacity: 0; } }`,
  },
  palabras_suben: {
    nombre: 'Palabras que suben',
    zona: 'texto',
    descripcion: 'Los títulos y textos de las tarjetas suben desde abajo y aparecen al entrar en pantalla.',
    quieto: 'Los textos están en su lugar desde el principio.',
    objetivo: 'El título y el texto de cada tarjeta, y el título de «Cómo funciona».',
    css: `
& :is(.pg-card-titulo, .pg-card-texto, .pg-rc-intro) { animation: scroll-palabras-suben linear both; animation-timeline: view(); animation-range: entry 0% entry 70%; }
@keyframes scroll-palabras-suben { from { translate: 0 1.4em; opacity: 0; } to { translate: 0 0; opacity: 1; } }`,
  },
  numero_cuenta: {
    nombre: 'Número que cuenta',
    zona: 'texto',
    descripcion: 'El número de cada paso de «Cómo funciona» cuenta desde cero hasta su valor al llegar a la pantalla.',
    quieto: 'Cada paso muestra su número final.',
    objetivo: 'La etiqueta «Paso N» de cada paso: se reemplaza por un contador (@property entero) que sube hasta N.',
    css: `
@property --scroll-n { syntax: '<integer>'; inherits: true; initial-value: 0; }
& .pg-rc-paso { --fin: 1; animation: scroll-numero-cuenta linear both; animation-timeline: view(); animation-range: entry 10% cover 40%; counter-set: scroll-n var(--scroll-n); }
& .pg-rc-paso:nth-of-type(2) { --fin: 2; }
& .pg-rc-paso:nth-of-type(3) { --fin: 3; }
& .pg-rc-paso:nth-of-type(4) { --fin: 4; }
& .pg-rc-num { font-size: 0; }
& .pg-rc-num::after { content: 'Paso ' counter(scroll-n); font-size: var(--texto-chico, .8rem); }
@keyframes scroll-numero-cuenta { from { --scroll-n: 0; } to { --scroll-n: var(--fin); } }`,
  },
  subrayado: {
    nombre: 'Subrayado que se dibuja',
    zona: 'texto',
    descripcion: 'Una línea del color de acento se dibuja bajo los títulos a medida que llegan al centro de la pantalla.',
    quieto: 'Los títulos van con la línea ya dibujada.',
    objetivo: 'El título de «Cómo funciona» y el de cada tarjeta, con un subrayado hecho con background-size.',
    css: `
& :is(.pg-rc-intro, .pg-card-titulo) { background: linear-gradient(var(--color-acento), var(--color-acento)) 0 100% / 100% .12em no-repeat; animation: scroll-subrayado linear both; animation-timeline: view(); animation-range: entry 30% cover 50%; }
@keyframes scroll-subrayado { from { background-size: 0 .12em; } to { background-size: 100% .12em; } }`,
  },
  apilan: {
    nombre: 'Tarjetas que se apilan',
    zona: 'galeria',
    descripcion: 'Las tarjetas llegan inclinadas y encimadas, y se acomodan en su lugar una al lado de la otra.',
    quieto: 'Las tarjetas están acomodadas desde el principio.',
    objetivo: 'Cada tarjeta de las filas (pg-card dentro de pg-fila).',
    css: `
& .pg-fila > .pg-card { animation: scroll-apilan linear both; animation-timeline: view(); animation-range: entry 0% entry 90%; }
& .pg-fila > .pg-card:nth-child(odd) { --giro: -4deg; }
& .pg-fila > .pg-card:nth-child(even) { --giro: 4deg; }
@keyframes scroll-apilan { from { rotate: var(--giro, 3deg); translate: 0 20%; scale: .92; opacity: .3; } to { rotate: 0deg; translate: 0 0; scale: 1; opacity: 1; } }`,
  },
  zoom_imagen: {
    nombre: 'Zoom a una imagen',
    zona: 'galeria',
    descripcion: 'Las imágenes de la galería arrancan chicas y crecen hasta llenar su lugar al llegar al centro.',
    quieto: 'Las imágenes ocupan todo su lugar.',
    objetivo: 'Las imágenes de los mosaicos y las galerías (pg-mosaico y pg-galeria).',
    css: `
& :is(.pg-mosaico, .pg-galeria) > * { animation: scroll-zoom-imagen linear both; animation-timeline: view(); animation-range: entry 0% cover 40%; }
@keyframes scroll-zoom-imagen { from { scale: .72; opacity: .4; } to { scale: 1; opacity: 1; } }`,
  },
  de_a_una: {
    nombre: 'Aparecen de a una',
    zona: 'galeria',
    descripcion: 'Las tarjetas aparecen una por una, cada una un poco después de la anterior, mientras se baja.',
    quieto: 'Todas las tarjetas se ven desde el principio.',
    objetivo: 'Las tarjetas de las filas, escalonadas con animation-range.',
    css: `
& .pg-fila > .pg-card { animation: scroll-de-a-una linear both; animation-timeline: view(); animation-range: entry 0% entry 55%; }
& .pg-fila > .pg-card:nth-child(2) { animation-range: entry 15% entry 70%; }
& .pg-fila > .pg-card:nth-child(3) { animation-range: entry 30% entry 85%; }
& .pg-fila > .pg-card:nth-child(n+4) { animation-range: entry 45% entry 100%; }
@keyframes scroll-de-a-una { from { opacity: 0; translate: 0 32px; } to { opacity: 1; translate: 0 0; } }`,
  },
  fondo_cambia: {
    nombre: 'El fondo cambia de color por sección',
    zona: 'pagina',
    descripcion: 'El fondo de la página va pasando del color de fondo a una mezcla con el acento a medida que se baja.',
    quieto: 'El fondo mantiene un solo color.',
    objetivo: 'El fondo de toda la página (background-color), con la mezcla hecha con color-mix de los tokens.',
    css: `
& { animation: scroll-fondo-cambia linear both; animation-timeline: scroll(nearest block); }
@keyframes scroll-fondo-cambia { 0% { background-color: var(--color-fondo); } 35% { background-color: color-mix(in srgb, var(--color-fondo) 90%, var(--color-acento)); } 70% { background-color: color-mix(in srgb, var(--color-fondo) 86%, var(--color-superficie, var(--color-acento))); } 100% { background-color: color-mix(in srgb, var(--color-fondo) 92%, var(--color-acento)); } }`,
  },
};

/** Los efectos de PLAN.md §7.4 que todavía no existen (ya están los 14: queda vacía). */
export const SCROLL_PENDIENTES: { nombre: string; zona: ZonaScroll }[] = [];

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
