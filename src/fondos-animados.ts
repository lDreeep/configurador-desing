// Fondos animados (PLAN.md §7.7): 16 fondos que se mueven solos detrás de la página. Los seis
// primeros vienen de `maqueta/molde-2.html` (aurora, puntos que corren, franjas, burbujas, piso
// en perspectiva, brillo que pasa); los otros diez son nuevos.
//
// Reglas (las verifica `fondos-animados.test.ts`):
// - Solo CSS, salvo «luz que sigue al cursor», que necesita `seguirCursor` (o `JS_LUZ_CURSOR`
//   en el export) para saber dónde está el mouse. Sin JS, la luz queda quieta en el centro.
// - Solo colores de la paleta: `--color-*` mezclados con `color-mix` y `transparent`. Nada de
//   colores propios, así el fondo sirve en claro y en oscuro.
// - Para que corran a 60 cuadros por segundo, lo que se mueve son los pseudo-elementos
//   `::before` y `::after`, y solo con `transform` y `opacity` (los maneja la placa de video sin
//   volver a pintar). Ningún fondo anima `background-position`, tamaños ni `filter`.
// - Cada uno tiene versión quieta: con `prefers-reduced-motion: reduce` se cortan las
//   animaciones y queda un cuadro fijo que se ve bien (`quieto` ajusta el cuadro si hace falta).
// - Nunca va texto directo sobre el fondo: el contenido va sobre un velo o una tarjeta sólida,
//   igual que con los fondos con textura (`src/fondos.ts`).
//
// En el CSS, `&` es la capa del fondo: un elemento vacío y decorativo (`aria-hidden`), con
// `position: absolute; inset: 0` dentro de un contenedor con `position: relative`. La capa es
// un contenedor (`container-type: size`): las medidas en `cq*` siguen a la capa, no a la ventana.

import type { FondoAnimadoId } from './fondos-animados-base';
export type { FondoAnimadoId } from './fondos-animados-base';

export interface FondoAnimado {
  nombre: string;
  descripcion: string;
  /** true si está en `maqueta/molde-2.html`. */
  deLaMaqueta: boolean;
  /** true si necesita JS para moverse (solo la luz que sigue al cursor). */
  js: boolean;
  /** Reglas del fondo; `&` es la capa. */
  css: string;
  /** `@keyframes` del fondo, todos con nombre `fa-<id>…`. */
  keyframes: string;
  /** Ajustes del cuadro fijo con `prefers-reduced-motion` (las animaciones ya se cortan solas). */
  quieto?: string;
}

/** Mezcla un token de color con transparente: `tinte('acento', 30)`. */
const tinte = (token: string, por: number) => `color-mix(in srgb, var(--color-${token}) ${por}%, transparent)`;

/** Un SVG como url() para CSS (sin colores: se usa como máscara o con `currentColor` no hace falta). */
const svg = (contenido: string, w: number, h: number) =>
  `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>${contenido}</svg>`)}")`;

/** Ruido fino en blanco y negro, para usar como máscara del grano. */
const RUIDO = svg(
  `<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1.6 -0.35'/></filter><rect width='100%' height='100%' filter='url(#n)'/>`,
  200,
  200,
);

/** Una constelación que se repite: puntos y las líneas que los unen (es máscara: el color lo da la paleta). */
const CONSTELACION = (() => {
  const p = [
    [20, 30], [95, 12], [170, 60], [230, 25], [60, 110], [140, 135], [210, 120], [30, 200], [110, 215], [190, 190], [250, 230],
  ];
  const unir = [[0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [5, 2], [5, 6], [6, 3], [4, 7], [7, 8], [8, 5], [8, 9], [9, 6], [9, 10]];
  const lineas = unir.map(([a, b]) => `<line x1='${p[a][0]}' y1='${p[a][1]}' x2='${p[b][0]}' y2='${p[b][1]}'/>`).join('');
  const puntos = p.map(([x, y]) => `<circle cx='${x}' cy='${y}' r='2.6'/>`).join('');
  return svg(`<g stroke='black' stroke-opacity='.45' stroke-width='1'>${lineas}</g><g fill='black'>${puntos}</g>`, 260, 260);
})();

/** Estructura común de la capa y sus dos pseudo-elementos. */
export const CSS_CAPA = `& { position: absolute; inset: 0; overflow: hidden; pointer-events: none; isolation: isolate; container-type: size; background: var(--color-fondo); }
&::before, &::after { content: ""; position: absolute; pointer-events: none; will-change: transform; }`;

export const FONDOS_ANIMADOS: Record<FondoAnimadoId, FondoAnimado> = {
  aurora: {
    nombre: 'Aurora',
    descripcion: 'Dos nubes de luz del acento que van y vienen despacio',
    deLaMaqueta: true,
    js: false,
    css: `&::before { inset: -20%; background: radial-gradient(40% 35% at 75% 20%, ${tinte('acento', 55)}, transparent 70%), radial-gradient(38% 34% at 20% 85%, ${tinte('acento', 35)}, transparent 70%); animation: fa-aurora 9s ease-in-out infinite alternate; }
&::after { inset: -20%; background: radial-gradient(30% 28% at 50% 50%, ${tinte('acento-suave', 60)}, transparent 70%); animation: fa-aurora-2 13s ease-in-out infinite alternate; }`,
    keyframes: `@keyframes fa-aurora { to { transform: translate(-6%, 6%) scale(1.15); } }
@keyframes fa-aurora-2 { from { transform: translate(-10%, 8%); opacity: .5; } to { transform: translate(12%, -6%) scale(1.2); opacity: 1; } }`,
  },
  puntos_corren: {
    nombre: 'Puntos que corren',
    descripcion: 'Una trama de puntitos que avanza en diagonal y se desvanece hacia un lado',
    deLaMaqueta: true,
    js: false,
    css: `& { -webkit-mask: linear-gradient(120deg, transparent 15%, black); mask: linear-gradient(120deg, transparent 15%, black); }
&::before { inset: -28px 0 0 -28px; background: radial-gradient(${tinte('texto', 30)} 2px, transparent 2.5px) 0 0 / 28px 28px; animation: fa-puntos 6s linear infinite; }`,
    keyframes: `@keyframes fa-puntos { to { transform: translate(28px, 28px); } }`,
  },
  franjas: {
    nombre: 'Franjas',
    descripcion: 'Franjas anchas inclinadas del acento que se deslizan',
    deLaMaqueta: true,
    js: false,
    // 96px de período a lo largo de la franja: a 115° el corrimiento horizontal que la repite es 96 / sin(65°).
    css: `&::before { inset: 0 -110px 0 0; background: repeating-linear-gradient(115deg, transparent 0 48px, ${tinte('acento', 20)} 48px 96px); animation: fa-franjas 12s linear infinite; }`,
    keyframes: `@keyframes fa-franjas { to { transform: translateX(-105.925px); } }`,
  },
  burbujas: {
    nombre: 'Burbujas',
    descripcion: 'Círculos suaves que suben sin parar, en dos tamaños',
    deLaMaqueta: true,
    js: false,
    css: `&::before { inset: 0 0 -240px; background: radial-gradient(circle, ${tinte('acento', 38)} 0 30%, transparent 46%) 0 0 / 270px 240px; animation: fa-burbujas 16s linear infinite; }
&::after { inset: 0 0 -240px; background: radial-gradient(circle, ${tinte('texto', 12)} 0 22%, transparent 40%) 90px 60px / 180px 120px; animation: fa-burbujas 11s linear infinite; }`,
    keyframes: `@keyframes fa-burbujas { to { transform: translateY(-240px); } }`,
  },
  piso_perspectiva: {
    nombre: 'Piso en perspectiva',
    descripcion: 'Una grilla del acento acostada que corre hacia adelante, como un piso infinito',
    deLaMaqueta: true,
    js: false,
    css: `& { -webkit-mask: linear-gradient(transparent 35%, black 75%); mask: linear-gradient(transparent 35%, black 75%); }
&::before { left: -40%; right: -40%; top: 35%; height: 120%; background: linear-gradient(${tinte('acento', 55)} 2px, transparent 2px) 0 0 / 48px 48px, linear-gradient(90deg, ${tinte('acento', 55)} 2px, transparent 2px) 0 0 / 48px 48px; transform-origin: 50% 0; transform: perspective(480px) rotateX(62deg); animation: fa-piso 2.4s linear infinite; }`,
    keyframes: `@keyframes fa-piso { from { transform: perspective(480px) rotateX(62deg) translateY(-48px); } to { transform: perspective(480px) rotateX(62deg) translateY(0); } }`,
    quieto: `&::before { transform: perspective(480px) rotateX(62deg); }`,
  },
  brillo_pasa: {
    nombre: 'Brillo que pasa',
    descripcion: 'Un reflejo del acento que cruza la pantalla cada tanto',
    deLaMaqueta: true,
    js: false,
    css: `&::before { inset: 0; width: 60%; background: linear-gradient(110deg, transparent 20%, ${tinte('acento', 45)} 50%, transparent 80%); transform: translateX(-100%); animation: fa-brillo 4.5s cubic-bezier(.6, 0, .2, 1) infinite; }`,
    keyframes: `@keyframes fa-brillo { 0% { transform: translateX(-100%); } 60%, 100% { transform: translateX(270%); } }`,
    quieto: `&::before { transform: translateX(80%); }`,
  },
  grano_vibra: {
    nombre: 'Grano que vibra',
    descripcion: 'Grano de película que tiembla sobre un degradé del acento',
    deLaMaqueta: false,
    js: false,
    css: `& { background: radial-gradient(70% 60% at 25% 20%, ${tinte('acento', 45)}, transparent), radial-gradient(60% 60% at 85% 90%, ${tinte('acento-suave', 80)}, transparent), var(--color-fondo); }
&::before { inset: -50%; background: var(--color-texto); -webkit-mask: ${RUIDO} 0 0 / 200px 200px; mask: ${RUIDO} 0 0 / 200px 200px; opacity: .22; animation: fa-grano .6s steps(6) infinite; }`,
    keyframes: `@keyframes fa-grano { 0% { transform: translate(0, 0); } 17% { transform: translate(-7%, 4%); } 33% { transform: translate(5%, -9%); } 50% { transform: translate(-11%, -3%); } 67% { transform: translate(9%, 8%); } 83% { transform: translate(-3%, 11%); } 100% { transform: translate(0, 0); } }`,
  },
  ondas_agua: {
    nombre: 'Ondas de agua',
    descripcion: 'Anillos que se abren desde un punto, como una gota en el agua',
    deLaMaqueta: false,
    js: false,
    css: `& { background: radial-gradient(circle at 70% 60%, ${tinte('acento-suave', 70)}, transparent 55%), var(--color-fondo); }
&::before, &::after { left: 70%; top: 60%; width: 140cqmax; height: 140cqmax; margin: -70cqmax 0 0 -70cqmax; border-radius: 50%; background: repeating-radial-gradient(circle, transparent 0 7.5%, ${tinte('acento', 35)} 8%, transparent 9%, transparent 12.5%); transform: scale(.1); opacity: 0; animation: fa-ondas 7s cubic-bezier(.2, .6, .4, 1) infinite; }
&::after { animation-delay: -3.5s; }`,
    keyframes: `@keyframes fa-ondas { 0% { transform: scale(.1); opacity: 0; } 15% { opacity: 1; } 100% { transform: scale(1); opacity: 0; } }`,
    quieto: `&::before { transform: scale(.55); opacity: .7; } &::after { display: none; }`,
  },
  puntos_unidos: {
    nombre: 'Puntos unidos',
    descripcion: 'Una red de puntos unidos por líneas que deriva en dos capas',
    deLaMaqueta: false,
    js: false,
    css: `&::before, &::after { inset: -260px 0 0 -260px; -webkit-mask: ${CONSTELACION} 0 0 / 260px 260px; mask: ${CONSTELACION} 0 0 / 260px 260px; }
&::before { background: var(--color-acento); opacity: .55; animation: fa-red 40s linear infinite; }
&::after { background: var(--color-texto); opacity: .18; -webkit-mask-size: 390px 390px; mask-size: 390px 390px; inset: -390px 0 0 -390px; animation: fa-red-lenta 70s linear infinite reverse; }`,
    keyframes: `@keyframes fa-red { to { transform: translate(260px, 260px); } }
@keyframes fa-red-lenta { to { transform: translate(390px, 0); } }`,
  },
  degrade_gira: {
    nombre: 'Degradé que gira',
    descripcion: 'Un degradé cónico de la paleta que gira despacio, con el centro velado',
    deLaMaqueta: false,
    js: false,
    css: `&::before { left: 50%; top: 50%; width: 150cqmax; height: 150cqmax; margin: -75cqmax 0 0 -75cqmax; background: conic-gradient(from 0deg, var(--color-acento), var(--color-acento-suave), var(--color-superficie), ${tinte('acento', 70)}, var(--color-acento)); animation: fa-gira 24s linear infinite; }
&::after { inset: 0; background: radial-gradient(closest-side, var(--color-fondo), ${tinte('fondo', 60)} 70%, transparent); will-change: auto; }`,
    keyframes: `@keyframes fa-gira { to { transform: rotate(1turn); } }`,
  },
  cuadricula_late: {
    nombre: 'Cuadrícula que late',
    descripcion: 'Una cuadrícula fina con una zona del acento que se enciende y se apaga',
    deLaMaqueta: false,
    js: false,
    css: `& { background: linear-gradient(${tinte('borde', 90)} 1px, transparent 1px) 0 0 / 40px 40px, linear-gradient(90deg, ${tinte('borde', 90)} 1px, transparent 1px) 0 0 / 40px 40px, var(--color-fondo); }
&::before { inset: 0; background: linear-gradient(var(--color-acento) 1px, transparent 1px) 0 0 / 40px 40px, linear-gradient(90deg, var(--color-acento) 1px, transparent 1px) 0 0 / 40px 40px; -webkit-mask: radial-gradient(closest-side at 60% 45%, black, transparent); mask: radial-gradient(closest-side at 60% 45%, black, transparent); opacity: .2; animation: fa-late 3.2s ease-in-out infinite; will-change: opacity; }
&::after { left: 60%; top: 45%; width: 60cqmin; height: 60cqmin; margin: -30cqmin 0 0 -30cqmin; border-radius: 50%; background: radial-gradient(closest-side, ${tinte('acento', 22)}, transparent); animation: fa-late-luz 3.2s ease-in-out infinite; }`,
    keyframes: `@keyframes fa-late { 50% { opacity: .9; } }
@keyframes fa-late-luz { 0%, 100% { transform: scale(.7); opacity: .3; } 50% { transform: scale(1.1); opacity: 1; } }`,
    quieto: `&::before { opacity: .6; }`,
  },
  lluvia_lineas: {
    nombre: 'Lluvia de líneas',
    descripcion: 'Trazos finos que caen inclinados, en dos velocidades',
    deLaMaqueta: false,
    js: false,
    css: `&::before, &::after { inset: -30% -20%; }
&::before { background: linear-gradient(transparent 0 55%, ${tinte('acento', 70)} 92%, transparent 93%) 0 0 / 37px 220px, linear-gradient(transparent 0 70%, ${tinte('acento', 50)} 95%, transparent 96%) 19px 90px / 37px 220px; -webkit-mask: linear-gradient(90deg, black 0 2px, transparent 2px) 0 0 / 19px 100%; mask: linear-gradient(90deg, black 0 2px, transparent 2px) 0 0 / 19px 100%; animation: fa-lluvia 1.1s linear infinite; }
&::after { background: linear-gradient(transparent 0 75%, ${tinte('texto', 28)} 95%, transparent 96%) 8px 40px / 23px 160px; -webkit-mask: linear-gradient(90deg, transparent 8px, black 8px 9.5px, transparent 9.5px) 0 0 / 23px 100%; mask: linear-gradient(90deg, transparent 8px, black 8px 9.5px, transparent 9.5px) 0 0 / 23px 100%; animation: fa-lluvia-lenta 1.6s linear infinite; }`,
    keyframes: `@keyframes fa-lluvia { from { transform: rotate(12deg) translateY(-220px); } to { transform: rotate(12deg) translateY(0); } }
@keyframes fa-lluvia-lenta { from { transform: rotate(12deg) translateY(-160px); } to { transform: rotate(12deg) translateY(0); } }`,
    quieto: `&::before, &::after { transform: rotate(12deg); }`,
  },
  manchas_tinta: {
    nombre: 'Manchas de tinta',
    descripcion: 'Dos manchas irregulares del acento que giran y se deforman despacio',
    deLaMaqueta: false,
    js: false,
    css: `&::before, &::after { width: 70cqmin; height: 70cqmin; border-radius: 42% 58% 63% 37% / 41% 44% 56% 59%; }
&::before { left: 8%; top: 5%; background: radial-gradient(circle at 40% 40%, ${tinte('acento', 55)}, ${tinte('acento', 20)} 70%); animation: fa-tinta 18s ease-in-out infinite alternate; }
&::after { right: 4%; bottom: -10%; width: 55cqmin; height: 55cqmin; border-radius: 61% 39% 33% 67% / 52% 63% 37% 48%; background: radial-gradient(circle at 60% 50%, ${tinte('acento-suave', 90)}, ${tinte('acento', 25)} 75%); animation: fa-tinta-2 23s ease-in-out infinite alternate; }`,
    keyframes: `@keyframes fa-tinta { to { transform: translate(18%, 12%) rotate(160deg) scale(1.15, .9); } }
@keyframes fa-tinta-2 { to { transform: translate(-20%, -14%) rotate(-140deg) scale(.9, 1.2); } }`,
  },
  cinta_texto: {
    nombre: 'Cinta de texto',
    descripcion: 'Una palabra grande y calada que pasa en loop, como una marquesina',
    deLaMaqueta: false,
    js: false,
    // La palabra sale de --fondo-cinta (por defecto «diseño ·»). Va repetida 8 veces: la animación corre la mitad.
    css: `&::before { left: 0; top: 50%; margin-top: -.6em; white-space: nowrap; font-family: var(--fuente-titulos, system-ui, sans-serif); font-weight: 800; font-size: clamp(56px, 45cqh, 240px); line-height: 1.2; letter-spacing: -.03em; transform-origin: 0 50%; color: transparent; -webkit-text-stroke: 1.5px ${tinte('acento', 55)}; content: var(--fondo-cinta, "diseño · ") var(--fondo-cinta, "diseño · ") var(--fondo-cinta, "diseño · ") var(--fondo-cinta, "diseño · ") var(--fondo-cinta, "diseño · ") var(--fondo-cinta, "diseño · ") var(--fondo-cinta, "diseño · ") var(--fondo-cinta, "diseño · "); transform: rotate(-6deg); animation: fa-cinta 30s linear infinite; }`,
    keyframes: `@keyframes fa-cinta { from { transform: rotate(-6deg) translateX(0); } to { transform: rotate(-6deg) translateX(-50%); } }`,
    quieto: `&::before { transform: rotate(-6deg) translateX(-10%); }`,
  },
  luz_cursor: {
    nombre: 'Luz que sigue al cursor',
    descripcion: 'Un halo del acento que persigue al mouse con un poco de retraso (usa JS; sin mouse queda al centro)',
    deLaMaqueta: false,
    js: true,
    // `seguirCursor` escribe --fondo-x y --fondo-y en píxeles; sin ellos la luz queda al centro.
    css: `& { background: radial-gradient(${tinte('borde', 70)} 1.5px, transparent 2px) 0 0 / 24px 24px, var(--color-fondo); }
&::before { left: 0; top: 0; width: 70cqmin; height: 70cqmin; border-radius: 50%; background: radial-gradient(closest-side, ${tinte('acento', 45)}, ${tinte('acento', 12)} 55%, transparent); transform: translate(calc(var(--fondo-x, 50cqw) - 50%), calc(var(--fondo-y, 45cqh) - 50%)); transition: transform .5s cubic-bezier(.2, .8, .3, 1); }`,
    keyframes: '',
  },
  formas_flotan: {
    nombre: 'Formas que flotan',
    descripcion: 'Círculos, cuadrados y anillos del acento que flotan subiendo y bajando',
    deLaMaqueta: false,
    js: false,
    css: `&::before, &::after { inset: -10%; }
&::before { background: radial-gradient(circle, ${tinte('acento', 55)} 0 60%, transparent 62%) 12% 22% / 90px 90px no-repeat, linear-gradient(${tinte('acento-suave', 100)}, ${tinte('acento-suave', 100)}) 78% 30% / 70px 70px no-repeat, radial-gradient(circle, transparent 0 48%, ${tinte('acento', 45)} 50% 60%, transparent 62%) 30% 80% / 120px 120px no-repeat; animation: fa-flotan 8s ease-in-out infinite alternate; }
&::after { background: radial-gradient(circle, ${tinte('texto', 14)} 0 60%, transparent 62%) 64% 70% / 54px 54px no-repeat, linear-gradient(45deg, transparent 45%, ${tinte('acento', 40)} 45% 55%, transparent 55%) 88% 82% / 80px 80px no-repeat, radial-gradient(circle, ${tinte('acento', 30)} 0 60%, transparent 62%) 52% 14% / 40px 40px no-repeat; animation: fa-flotan-2 11s ease-in-out infinite alternate; }`,
    keyframes: `@keyframes fa-flotan { from { transform: translateY(4%) rotate(-2deg); } to { transform: translateY(-5%) rotate(3deg); } }
@keyframes fa-flotan-2 { from { transform: translate(-2%, -4%); } to { transform: translate(3%, 6%) rotate(-3deg); } }`,
  },
};

/** Clase que pinta un fondo animado: `<div class="fondo-animado fa-aurora" aria-hidden="true">`. */
export const SELECTOR_FONDO_ANIMADO = (id: FondoAnimadoId) => `.fondo-animado.fa-${id}`;

/**
 * Todo el CSS de un fondo animado para un selector: la capa, el fondo, sus keyframes y la versión
 * quieta para `prefers-reduced-motion`. Es lo que usa la vista previa y lo que se exporta.
 */
export function cssDeFondoAnimado(id: FondoAnimadoId, selector = SELECTOR_FONDO_ANIMADO(id)): string {
  const f = FONDOS_ANIMADOS[id];
  const con = (css: string) => css.replace(/&/g, selector);
  const quieto = [
    `${selector}, ${selector}::before, ${selector}::after { animation: none !important; transition: none !important; }`,
    f.quieto ? con(f.quieto) : '',
  ].filter(Boolean).join('\n  ');
  return [con(CSS_CAPA), con(f.css), f.keyframes, `@media (prefers-reduced-motion: reduce) {\n  ${quieto}\n}`].filter(Boolean).join('\n');
}

/** El JS de la luz que sigue al cursor, para el export. Mismo comportamiento que `seguirCursor`. */
export const JS_LUZ_CURSOR = `// Luz que sigue al cursor: mueve el halo del fondo animado según el mouse.
document.querySelectorAll('.fa-luz_cursor').forEach((capa) => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const zona = capa.parentElement;
  let cuadro = 0;
  zona.addEventListener('pointermove', (e) => {
    cancelAnimationFrame(cuadro);
    cuadro = requestAnimationFrame(() => {
      const r = capa.getBoundingClientRect();
      capa.style.setProperty('--fondo-x', (e.clientX - r.left) + 'px');
      capa.style.setProperty('--fondo-y', (e.clientY - r.top) + 'px');
    });
  });
});`;

/**
 * Hace que la luz de `capa` siga al puntero dentro de su contenedor (la capa no recibe eventos).
 * Devuelve la función que deja de escuchar. Con `prefers-reduced-motion` no hace nada.
 */
export function seguirCursor(capa: HTMLElement): () => void {
  const zona = capa.parentElement;
  if (!zona || (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches)) return () => {};
  let cuadro = 0;
  const mover = (e: PointerEvent) => {
    cancelAnimationFrame(cuadro);
    cuadro = requestAnimationFrame(() => {
      const r = capa.getBoundingClientRect();
      capa.style.setProperty('--fondo-x', `${e.clientX - r.left}px`);
      capa.style.setProperty('--fondo-y', `${e.clientY - r.top}px`);
    });
  };
  zona.addEventListener('pointermove', mover);
  return () => {
    cancelAnimationFrame(cuadro);
    zona.removeEventListener('pointermove', mover);
  };
}
