// Fondos con textura para que los diseños no se vean planos: fieltro, vidrio acanalado, térmico,
// agua, grafito, paisaje de un tono, plano técnico, semitono, grano, pasto, tramado, papel,
// curvas de nivel, cielo, mosaico de píxeles, lente, punteado, grilla de cuadraditos,
// foto desenfocada, iridiscente e impresionista.
//
// Todo es CSS: gradientes y SVG generados por código (sin fotos ni archivos). Los que pueden usan
// los colores de la paleta (--color-acento, --color-texto…); los que tienen un color propio
// (cielo, pasto, plano…) lo dicen en su descripción. En el CSS, `&` es la capa de fondo:
// un elemento vacío, decorativo (aria-hidden), detrás del contenido. Nunca va texto encima sin
// un velo o una tarjeta que asegure el contraste.

export type FondoId =
  | 'fieltro'
  | 'vidrio_acanalado'
  | 'termico'
  | 'agua'
  | 'grafito'
  | 'paisaje'
  | 'plano'
  | 'semitono'
  | 'grano'
  | 'pasto'
  | 'tramado'
  | 'papel'
  | 'curvas_nivel'
  | 'cielo'
  | 'pixeles'
  | 'lente'
  | 'punteado'
  | 'grilla_cuadrados'
  | 'desenfocado'
  | 'iridiscente'
  | 'impresionista';

export interface Fondo {
  nombre: string;
  descripcion: string;
  /** true si usa los colores de la paleta; false si tiene un color propio. */
  dePaleta: boolean;
  /** Si es oscuro, el texto encima va claro (y al revés). */
  oscuro: boolean;
  css: string;
}

/** Un SVG como url() para CSS. */
const svg = (contenido: string, w = 240, h = 240, extra = '') =>
  `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' ${extra}>${contenido}</svg>`)}")`;

/** Ruido de grano: puntitos negros (o blancos) con la opacidad dada. */
const ruido = (frecuencia: number | string, octavas: number, alfa: number, blanco = false, tam = 240) =>
  svg(
    `<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${frecuencia}' numOctaves='${octavas}' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 ${blanco ? 1 : 0} 0 0 0 0 ${blanco ? 1 : 0} 0 0 0 0 ${blanco ? 1 : 0} 0 0 0 ${alfa} 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/>`,
    tam,
    tam,
  );

/** Puntitos aislados (umbral alto sobre el ruido): para grafito, punteado y estrellas. */
const motas = (frecuencia: number, blanco: boolean, densidad = 9, corte = -6.6, tam = 240) =>
  svg(
    `<filter id='m'><feTurbulence type='fractalNoise' baseFrequency='${frecuencia}' numOctaves='1' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 ${blanco ? 1 : 0} 0 0 0 0 ${blanco ? 1 : 0} 0 0 0 0 ${blanco ? 1 : 0} 0 0 0 ${densidad} ${corte}'/></filter><rect width='100%' height='100%' filter='url(#m)'/>`,
    tam,
    tam,
  );

// Pinceladas: manchas de color deformadas por ruido (efecto pintura).
const manchas = (colores: string[], escala: number, frecuencia: number, semilla: number) => {
  let x = semilla;
  const azar = () => ((x = (x * 9301 + 49297) % 233280) / 233280);
  const circulos = Array.from({ length: 70 }, (_, i) => `<circle cx='${Math.round(azar() * 400)}' cy='${Math.round(azar() * 260)}' r='${Math.round(14 + azar() * 46)}' fill='${colores[i % colores.length]}' fill-opacity='${(0.55 + azar() * 0.45).toFixed(2)}'/>`).join('');
  return svg(
    `<filter id='p' x='-10%' y='-10%' width='120%' height='120%'><feTurbulence type='fractalNoise' baseFrequency='${frecuencia}' numOctaves='3' seed='${semilla}'/><feDisplacementMap in='SourceGraphic' scale='${escala}'/></filter><rect width='400' height='260' fill='${colores[0]}'/><g filter='url(#p)'>${circulos}</g>`,
    400,
    260,
    "viewBox='0 0 400 260' preserveAspectRatio='xMidYMid slice'",
  );
};

const CURVAS = svg(
  `<filter id='c'><feTurbulence type='fractalNoise' baseFrequency='0.012' numOctaves='2' seed='4'/><feDisplacementMap in='SourceGraphic' scale='90'/></filter><g filter='url(#c)' fill='none' stroke='black' stroke-opacity='.32' stroke-width='1.2'>${Array.from({ length: 26 }, (_, i) => `<circle cx='180' cy='150' r='${8 + i * 13}'/><circle cx='420' cy='40' r='${6 + i * 11}'/>`).join('')}</g>`,
  480,
  320,
  "viewBox='0 0 480 320' preserveAspectRatio='xMidYMid slice'",
);

const PAISAJE = svg(
  `<circle cx='300' cy='70' r='34' fill='white' fill-opacity='.55'/><path d='M0 150 L60 110 L110 135 L170 90 L230 128 L290 96 L350 120 L400 100 L400 260 L0 260Z' fill='black' fill-opacity='.10'/><path d='M0 175 L50 150 L120 168 L190 132 L260 162 L330 140 L400 160 L400 260 L0 260Z' fill='black' fill-opacity='.18'/><path d='M0 205 L80 180 L150 196 L230 172 L310 194 L400 182 L400 260 L0 260Z' fill='black' fill-opacity='.28'/><path d='M0 232 L100 214 L200 228 L300 210 L400 226 L400 260 L0 260Z' fill='black' fill-opacity='.40'/>`,
  400,
  260,
  "viewBox='0 0 400 260' preserveAspectRatio='xMidYMid slice'",
);

const PIXELES = (() => {
  let x = 7;
  const azar = () => ((x = (x * 9301 + 49297) % 233280) / 233280);
  const celdas: string[] = [];
  for (let f = 0; f < 10; f++)
    for (let c = 0; c < 16; c++) {
      const v = azar();
      if (v > 0.35) celdas.push(`<rect x='${c * 10}' y='${f * 10}' width='10' height='10' fill='black' fill-opacity='${(v * 0.55).toFixed(2)}'/>`);
    }
  return svg(celdas.join(''), 160, 100, "viewBox='0 0 160 100' preserveAspectRatio='none' shape-rendering='crispEdges'");
})();

const AGUA = svg(
  `<filter id='a'><feTurbulence type='turbulence' baseFrequency='0.0125 0.025' numOctaves='2' seed='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 -3 1.25'/></filter><rect width='100%' height='100%' filter='url(#a)'/>`,
  320,
  320,
);

const PASTO = svg(
  `<filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.55 0.0625' numOctaves='3' seed='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0.55 0 0 0 0.22 0 0 0 0 0.05 0 0 0 0 1'/></filter><rect width='100%' height='100%' filter='url(#g)'/>`,
  240,
  240,
);

const NUBES = svg(
  `<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.008' numOctaves='5' seed='9'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 3.2 -1.35'/><feGaussianBlur stdDeviation='1.2'/></filter><rect width='100%' height='100%' filter='url(#n)'/>`,
  600,
  400,
);

const TRAMA = (tam: number, color: string) => `repeating-conic-gradient(${color} 0 25%, transparent 0 50%) 0 0 / ${tam}px ${tam}px`;

export const FONDOS: Record<FondoId, Fondo> = {
  fieltro: {
    nombre: 'Fieltro',
    descripcion: 'Tela suave con pelusa, del tono del acento',
    dePaleta: true,
    oscuro: true,
    css: `& { background: ${ruido(0.95, 4, 0.55)}, ${ruido(0.18, 2, 0.18)}, linear-gradient(160deg, color-mix(in srgb, var(--color-acento) 70%, #3A3A3A), color-mix(in srgb, var(--color-acento) 45%, #111111)); }`,
  },
  vidrio_acanalado: {
    nombre: 'Vidrio acanalado',
    descripcion: 'Como mirar a través de un vidrio de canaletas',
    dePaleta: true,
    oscuro: true,
    css: `& { background: repeating-linear-gradient(90deg, rgba(255,255,255,.16) 0 2px, rgba(255,255,255,0) 7px, rgba(0,0,0,.22) 20px, rgba(255,255,255,.08) 23px), linear-gradient(115deg, #0B0B0C 10%, color-mix(in srgb, var(--color-acento) 85%, #000000) 55%, color-mix(in srgb, var(--color-acento) 55%, #E8FF7A) 80%, #0B0B0C); }`,
  },
  termico: {
    nombre: 'Térmico',
    descripcion: 'Manchas de calor, como una cámara infrarroja (colores propios)',
    dePaleta: false,
    oscuro: true,
    css: `& { background: radial-gradient(ellipse 18% 24% at 62% 42%, #FFF6C2 0, #FFC24A 30%, #FF5A3C 60%, transparent 100%), radial-gradient(ellipse 34% 40% at 62% 42%, rgba(232,48,140,.95) 0, rgba(232,48,140,.6) 45%, transparent 80%), radial-gradient(circle 70px at 28% 78%, #FFB347 0, #E8308C 55%, transparent 80%), radial-gradient(circle 46px at 82% 20%, #FF7A45 0, transparent 85%), linear-gradient(140deg, #3B0D7A, #22074F); }`,
  },
  agua: {
    nombre: 'Agua',
    descripcion: 'Reflejos de luz en el fondo de una pileta (colores propios)',
    dePaleta: false,
    oscuro: false,
    css: `& { background: ${AGUA}, linear-gradient(180deg, #6FD3E6, #2A9FC0); background-size: 320px 320px, cover; }`,
  },
  grafito: {
    nombre: 'Grafito moteado',
    descripcion: 'Gris casi negro con motas, como piedra',
    dePaleta: false,
    oscuro: true,
    css: `& { background: ${motas(0.9, true)}, ${ruido(0.85, 3, 0.35)}, radial-gradient(ellipse at 70% 0%, #4A4A4F, transparent 60%), #1B1B1E; }`,
  },
  paisaje: {
    nombre: 'Paisaje de un tono',
    descripcion: 'Montañas en capas, todas del color de acento',
    dePaleta: true,
    oscuro: false,
    css: `& { background: ${PAISAJE}, linear-gradient(180deg, color-mix(in srgb, var(--color-acento) 25%, #FFFFFF), color-mix(in srgb, var(--color-acento) 70%, #FFFFFF)); background-size: cover; background-position: center bottom; }`,
  },
  plano: {
    nombre: 'Plano técnico',
    descripcion: 'Grilla blanca sobre azul, como un plano (colores propios)',
    dePaleta: false,
    oscuro: true,
    css: `& { background: linear-gradient(rgba(255,255,255,.28) 1px, transparent 1px) 0 0 / 80px 80px, linear-gradient(90deg, rgba(255,255,255,.28) 1px, transparent 1px) 0 0 / 80px 80px, linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px) 0 0 / 16px 16px, linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px) 0 0 / 16px 16px, #1E4FB4; }`,
  },
  semitono: {
    nombre: 'Semitono',
    descripcion: 'Puntos de imprenta que se desvanecen',
    dePaleta: true,
    oscuro: false,
    css: `& { background: radial-gradient(circle, color-mix(in srgb, var(--color-acento) 85%, #000000) 0 38%, transparent 40%) 0 0 / 9px 9px, radial-gradient(circle, rgba(219,39,119,.55) 0 30%, transparent 33%) 4px 3px / 9px 9px, var(--color-fondo); -webkit-mask: linear-gradient(110deg, #000 15%, rgba(0,0,0,.55) 55%, rgba(0,0,0,.08)); mask: linear-gradient(110deg, #000 15%, rgba(0,0,0,.55) 55%, rgba(0,0,0,.08)); }`,
  },
  grano: {
    nombre: 'Degradado con grano',
    descripcion: 'Degradé de colores con textura de película',
    dePaleta: true,
    oscuro: true,
    css: `& { background: ${ruido(0.8, 3, 0.5)}, radial-gradient(ellipse at 20% 30%, var(--color-acento), transparent 60%), radial-gradient(ellipse at 85% 75%, #FF7A3D, transparent 55%), radial-gradient(ellipse at 60% 10%, #1E6B5C, transparent 50%), color-mix(in srgb, var(--color-acento) 30%, #141428); }`,
  },
  pasto: {
    nombre: 'Pasto',
    descripcion: 'Césped visto desde arriba, con florcitas (colores propios)',
    dePaleta: false,
    oscuro: true,
    css: `& { background: radial-gradient(circle, #FFFFFF 0 1.5px, transparent 2px) 13px 21px / 97px 83px, radial-gradient(circle, #FFF7C2 0 1.5px, transparent 2px) 57px 9px / 131px 113px, ${PASTO}, #2E7D32; }`,
  },
  tramado: {
    nombre: 'Tramado',
    descripcion: 'Tramas de puntos como una imagen de computadora vieja',
    dePaleta: true,
    oscuro: true,
    css: `& { background: ${TRAMA(4, 'color-mix(in srgb, var(--color-acento) 70%, transparent)')}, ${TRAMA(8, 'rgba(255,255,255,.12)')}, linear-gradient(170deg, #0D1020 30%, color-mix(in srgb, var(--color-acento) 45%, #0D1020) 60%, #E8743B 72%, #0D1020 80%); }`,
  },
  papel: {
    nombre: 'Papel',
    descripcion: 'Papel viejo con fibras y manchitas',
    dePaleta: false,
    oscuro: false,
    css: `& { background: ${ruido(0.7, 4, 0.16)}, ${ruido(0.02, 3, 0.1)}, radial-gradient(ellipse at 50% 40%, transparent 50%, rgba(120,90,40,.16)), #F1E7D2; }`,
  },
  curvas_nivel: {
    nombre: 'Curvas de nivel',
    descripcion: 'Líneas de mapa topográfico sobre el acento',
    dePaleta: true,
    oscuro: true,
    css: `& { background: ${CURVAS}, linear-gradient(150deg, color-mix(in srgb, var(--color-acento) 75%, #0A3D3A), color-mix(in srgb, var(--color-acento) 40%, #032A2E)); background-size: cover; }`,
  },
  cielo: {
    nombre: 'Cielo con nubes',
    descripcion: 'Cielo celeste con nubes blancas (colores propios)',
    dePaleta: false,
    oscuro: false,
    css: `& { background: ${NUBES}, linear-gradient(180deg, #2F6FB3, #7DB7E6 60%, #CFE6F7); background-size: cover; }`,
  },
  pixeles: {
    nombre: 'Mosaico de píxeles',
    descripcion: 'Cuadrados grandes de distintos tonos del acento',
    dePaleta: true,
    oscuro: false,
    css: `& { background: ${PIXELES}, color-mix(in srgb, var(--color-acento) 30%, #FFFFFF); background-size: 100% 100%; image-rendering: pixelated; }`,
  },
  lente: {
    nombre: 'Lente distorsionada',
    descripcion: 'Anillos y bordes de color, como mirar por una lupa',
    dePaleta: true,
    oscuro: true,
    css: `& { background: radial-gradient(circle at 50% 50%, transparent 0 30%, rgba(0,0,0,.45) 78%), radial-gradient(circle at 48% 50%, transparent 0 36%, rgba(255,40,80,.35) 38%, transparent 41%), radial-gradient(circle at 52% 50%, transparent 0 36%, rgba(40,160,255,.35) 38%, transparent 41%), repeating-radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--color-acento) 65%, #FFFFFF) 0 10px, color-mix(in srgb, var(--color-acento) 70%, #000000) 26px); }`,
  },
  punteado: {
    nombre: 'Degradado punteado',
    descripcion: 'Puntitos que se van juntando, como dibujado a mano',
    dePaleta: true,
    oscuro: false,
    css: `& { background: ${motas(0.95, false, 7, -4.2)} right / 70% 100% no-repeat, ${motas(0.95, false, 9, -6.8)}, linear-gradient(90deg, #F2B33D, color-mix(in srgb, var(--color-acento) 70%, #F2B33D)); }`,
  },
  grilla_cuadrados: {
    nombre: 'Grilla de cuadraditos',
    descripcion: 'Cuadraditos que se oscurecen hacia abajo',
    dePaleta: true,
    oscuro: false,
    css: `& { background: linear-gradient(90deg, var(--color-fondo) 3px, transparent 3px) 0 0 / 8px 8px, linear-gradient(var(--color-fondo) 3px, transparent 3px) 0 0 / 8px 8px, linear-gradient(to top, color-mix(in srgb, var(--color-texto) 55%, var(--color-fondo)), color-mix(in srgb, var(--color-texto) 6%, var(--color-fondo)) 80%); }`,
  },
  desenfocado: {
    nombre: 'Foto desenfocada',
    descripcion: 'Manchas suaves, como una foto fuera de foco',
    dePaleta: true,
    oscuro: false,
    css: `& { background: radial-gradient(circle at 30% 38%, rgba(255,154,181,.95) 0, transparent 34%), radial-gradient(circle at 46% 62%, rgba(232,80,130,.75) 0, transparent 26%), radial-gradient(circle at 72% 30%, color-mix(in srgb, var(--color-acento) 60%, transparent) 0, transparent 38%), radial-gradient(circle at 85% 80%, rgba(255,214,140,.9) 0, transparent 30%), linear-gradient(180deg, #BFE3FF, #EAF6FF); }`,
  },
  iridiscente: {
    nombre: 'Forma iridiscente',
    descripcion: 'Un aro tornasolado sobre gris claro',
    dePaleta: false,
    oscuro: false,
    css: `& { background: radial-gradient(circle at 62% 50%, #ECECEF 0 22%, transparent 23% 40%, #ECECEF 41%), conic-gradient(from 210deg at 62% 50%, #FF8AD8, #7FD4FF, #B5FF9E, #FFE38A, #FFB38A, #FF8AD8); }`,
  },
  impresionista: {
    nombre: 'Impresionista',
    descripcion: 'Pinceladas de agua y nenúfares, como un cuadro (colores propios)',
    dePaleta: false,
    oscuro: false,
    css: `& { background: ${manchas(['#4A6FA5', '#6E9F6B', '#B9A3D6', '#E9D48A', '#2F4F7F', '#9CC5A1', '#D98CA0'], 46, 0.035, 5)}; background-size: cover; }`,
  },
};

/** CSS de un fondo para un selector dado. */
export const cssDeFondo = (id: FondoId, selector: string) => FONDOS[id].css.replace(/&/g, selector);

/** El selector que pintan los fondos dentro de la página: los visuales y las áreas de fondo. */
export const SELECTOR_FONDO = (id: FondoId) => `.pg.pg.fondo-${id} :is(.pg-media, .pg-fondo-area)`;
