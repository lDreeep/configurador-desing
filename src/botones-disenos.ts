// Diseños de botón del panel de botones. Cada uno define su aspecto, su hover y su animación al tocar.
// El CSS se usa en el configurador y se exporta tal cual (DESIGN.md §10).
// En el CSS, `&` es el botón. Usa solo tokens: --boton-color, --boton-sobre, --color-*, --radio-boton,
// --boton-alto, --boton-padding, --boton-texto, --fuente-texto, --duracion-*, --curva-*.

import type { BotonDisenoId, EstiloId } from './tipos';

export type EfectoToque = 'onda' | 'hundir' | 'gelatina' | 'rebote' | 'pulso' | 'aplastar' | 'brillo' | 'propio';
export type CategoriaBoton = 'solidos' | 'contornos' | 'volumen' | 'texturas' | 'efectos' | 'retro';

export const CATEGORIAS_BOTON: Record<CategoriaBoton, string> = {
  solidos: 'Sólidos',
  contornos: 'Contornos',
  volumen: 'Con volumen',
  texturas: 'Texturas',
  efectos: 'Con efecto',
  retro: 'Retro',
};

export const EFECTOS_TOQUE: Record<EfectoToque, string> = {
  onda: 'Onda que sale desde donde tocás',
  hundir: 'Se hunde y vuelve',
  gelatina: 'Rebota como gelatina',
  rebote: 'Salta hacia arriba',
  pulso: 'Anillo que se expande',
  aplastar: 'Se aplasta y vuelve',
  brillo: 'Destello de luz',
  propio: 'Se presiona hacia adentro',
};

export interface BotonDiseno {
  nombre: string;
  descripcion: string;
  categoria: CategoriaBoton;
  efecto: EfectoToque;
  css: string;
}

export const BOTONES: Record<BotonDisenoId, BotonDiseno> = {
  solido: {
    nombre: 'Sólido', descripcion: 'Relleno de color, el más claro', categoria: 'solidos', efecto: 'onda',
    css: `& { background: var(--boton-color); color: var(--boton-sobre); border: none; overflow: hidden; }
&:hover { filter: brightness(0.92); }`,
  },
  pildora: {
    nombre: 'Píldora', descripcion: 'Totalmente redondo', categoria: 'solidos', efecto: 'hundir',
    css: `& { background: var(--boton-color); color: var(--boton-sobre); border: none; border-radius: 999px; padding: 0 calc(var(--boton-padding) * 1.3); }
&:hover { transform: translateY(-1px); box-shadow: 0 6px 18px color-mix(in srgb, var(--boton-color) 40%, transparent); }`,
  },
  tonal: {
    nombre: 'Tonal', descripcion: 'Fondo suave del color', categoria: 'solidos', efecto: 'hundir',
    css: `& { background: color-mix(in srgb, var(--boton-color) 16%, var(--color-fondo)); color: var(--color-texto); border: none; }
&:hover { background: color-mix(in srgb, var(--boton-color) 26%, var(--color-fondo)); }`,
  },
  degradado: {
    nombre: 'Degradado vivo', descripcion: 'El degradado se mueve al pasar', categoria: 'texturas', efecto: 'onda',
    css: `& { background: linear-gradient(120deg, var(--boton-color), color-mix(in oklch, var(--boton-color), #FF4FD8 45%), var(--boton-color)); background-size: 220% 100%; color: var(--boton-sobre); border: none; overflow: hidden; transition: background-position 600ms var(--curva-entrada), transform var(--duracion-rapida) ease; }
&:hover { background-position: 100% 0; }`,
  },
  brillo_barrido: {
    nombre: 'Brillo que cruza', descripcion: 'Una luz lo atraviesa al pasar', categoria: 'efectos', efecto: 'hundir',
    css: `& { background: var(--boton-color); color: var(--boton-sobre); border: none; overflow: hidden; }
&::before { content: ''; position: absolute; top: 0; bottom: 0; left: -60%; width: 40%; background: linear-gradient(100deg, transparent, rgba(255,255,255,.55), transparent); transform: skewX(-20deg); transition: left 700ms var(--curva-entrada); }
&:hover::before { left: 130%; }`,
  },
  flecha: {
    nombre: 'Con flecha', descripcion: 'La flecha avanza al pasar', categoria: 'efectos', efecto: 'hundir',
    css: `& { background: var(--boton-color); color: var(--boton-sobre); border: none; gap: 10px; }
&::after { content: '\\2192'; display: inline-block; transition: transform 260ms var(--curva-entrada); }
&:hover::after { transform: translateX(5px); }`,
  },
  grano: {
    nombre: 'Grano', descripcion: 'Color con textura de papel', categoria: 'texturas', efecto: 'aplastar',
    css: `& { background-color: var(--boton-color); background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E"); background-blend-mode: overlay; color: var(--boton-sobre); border: none; }
&:hover { filter: saturate(1.2) brightness(1.04); }`,
  },
  contorno: {
    nombre: 'Contorno', descripcion: 'Se rellena al pasar', categoria: 'contornos', efecto: 'pulso',
    css: `& { background: transparent; color: var(--color-texto); border: 2px solid var(--boton-color); transition: background-color var(--duracion-media) ease, color var(--duracion-media) ease, box-shadow var(--duracion-lenta) ease; }
&:hover { background: var(--boton-color); color: var(--boton-sobre); }`,
  },
  relleno_abajo: {
    nombre: 'Se llena', descripcion: 'El color sube desde abajo', categoria: 'contornos', efecto: 'aplastar',
    css: `& { color: var(--color-texto); border: 2px solid var(--boton-color); background: linear-gradient(var(--boton-color), var(--boton-color)) no-repeat bottom / 100% 0%; transition: background-size 320ms var(--curva-entrada), color 200ms ease; }
&:hover { background-size: 100% 100%; color: var(--boton-sobre); }`,
  },
  subrayado: {
    nombre: 'Subrayado', descripcion: 'Solo texto, la línea crece', categoria: 'contornos', efecto: 'aplastar',
    css: `& { background: transparent; color: var(--color-texto); border: none; padding: 0 4px; border-radius: 0; background-image: linear-gradient(var(--boton-color), var(--boton-color)); background-repeat: no-repeat; background-position: 0 85%; background-size: 30% 3px; transition: background-size 300ms var(--curva-entrada); }
&:hover { background-size: 100% 3px; }`,
  },
  doble: {
    nombre: 'Línea doble', descripcion: 'Marco doble, elegante', categoria: 'contornos', efecto: 'pulso',
    css: `& { background: transparent; color: var(--color-texto); border: 4px double var(--boton-color); border-radius: 0; text-transform: uppercase; letter-spacing: 0.14em; font-size: calc(var(--boton-texto) * 0.88); }
&:hover { background: color-mix(in srgb, var(--boton-color) 12%, transparent); }`,
  },
  desplazado: {
    nombre: 'Contorno fantasma', descripcion: 'Una copia del borde se acomoda al pasar', categoria: 'contornos', efecto: 'hundir',
    css: `& { background: var(--color-fondo); color: var(--color-texto); border: 2px solid var(--color-texto); margin: 0 6px 6px 0; }
&::before { content: ''; position: absolute; inset: -2px; border: 2px solid var(--boton-color); border-radius: inherit; transform: translate(6px, 6px); z-index: -1; transition: transform 240ms var(--curva-entrada); }
&:hover::before { transform: translate(0, 0); }`,
  },
  borde_animado: {
    nombre: 'Borde que gira', descripcion: 'Un brillo recorre el borde', categoria: 'efectos', efecto: 'pulso',
    css: `@property --bt-ang { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
& { color: var(--color-texto); border: 2px solid transparent; background: linear-gradient(var(--color-fondo), var(--color-fondo)) padding-box, conic-gradient(from var(--bt-ang), var(--boton-color), transparent 40%, var(--boton-color) 70%, transparent) border-box; animation: bt-girar 3s linear infinite; }
@keyframes bt-girar { to { --bt-ang: 360deg; } }
&:hover { background: linear-gradient(color-mix(in srgb, var(--boton-color) 12%, var(--color-fondo)), color-mix(in srgb, var(--boton-color) 12%, var(--color-fondo))) padding-box, conic-gradient(from var(--bt-ang), var(--boton-color), transparent 40%, var(--boton-color) 70%, transparent) border-box; }`,
  },
  circulo: {
    nombre: 'Círculo que crece', descripcion: 'Un círculo se expande hasta llenarlo', categoria: 'efectos', efecto: 'hundir',
    css: `& { background: transparent; color: var(--color-texto); border: 2px solid var(--boton-color); overflow: hidden; z-index: 0; padding-left: calc(var(--boton-alto) * 0.7); transition: color 300ms ease, padding 300ms var(--curva-entrada); }
&::before { content: ''; position: absolute; left: 6px; top: 50%; width: calc(var(--boton-alto) - 16px); aspect-ratio: 1; border-radius: 999px; background: var(--boton-color); transform: translateY(-50%); z-index: -1; transition: width 360ms var(--curva-entrada), left 360ms var(--curva-entrada), border-radius 360ms ease; }
&:hover { color: var(--boton-sobre); }
&:hover::before { left: -2px; width: calc(100% + 4px); height: calc(100% + 4px); aspect-ratio: auto; border-radius: 0; }`,
  },
  sombra_dura: {
    nombre: 'Sombra dura', descripcion: 'Neobrutal: se aplasta contra la sombra', categoria: 'volumen', efecto: 'propio',
    css: `& { background: var(--boton-color); color: var(--boton-sobre); border: 2px solid var(--color-texto); box-shadow: 4px 4px 0 var(--color-texto); }
&:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 var(--color-texto); }
&.toque { animation: bt-k-dura 320ms var(--curva-entrada); }
@keyframes bt-k-dura { 40% { transform: translate(4px, 4px); box-shadow: 0 0 0 var(--color-texto); } }`,
  },
  empujable: {
    nombre: '3D empujable', descripcion: 'Tiene canto; se hunde hasta el fondo', categoria: 'volumen', efecto: 'propio',
    css: `& { background: var(--boton-color); color: var(--boton-sobre); border: none; box-shadow: 0 6px 0 color-mix(in srgb, var(--boton-color) 62%, #000); margin-bottom: 6px; }
&:hover { transform: translateY(-2px); box-shadow: 0 8px 0 color-mix(in srgb, var(--boton-color) 62%, #000); }
&.toque { animation: bt-k-empujar 280ms ease; }
@keyframes bt-k-empujar { 40% { transform: translateY(6px); box-shadow: 0 0 0 color-mix(in srgb, var(--boton-color) 62%, #000); } }`,
  },
  neumorfico: {
    nombre: 'Neumórfico', descripcion: 'En relieve suave; se hunde al tocar', categoria: 'volumen', efecto: 'propio',
    css: `& { background: var(--color-superficie); color: var(--color-texto); border: none; box-shadow: 6px 6px 14px rgba(0,0,0,.16), -6px -6px 14px rgba(255,255,255,.75); }
&:hover { box-shadow: 8px 8px 18px rgba(0,0,0,.18), -8px -8px 18px rgba(255,255,255,.8); }
&.toque { animation: bt-k-neu 360ms ease; }
@keyframes bt-k-neu { 40% { box-shadow: inset 4px 4px 10px rgba(0,0,0,.18), inset -4px -4px 10px rgba(255,255,255,.7); transform: scale(.98); } }`,
  },
  clay: {
    nombre: 'Clay', descripcion: 'Inflado como plastilina', categoria: 'volumen', efecto: 'gelatina',
    css: `& { background: var(--boton-color); color: var(--boton-sobre); border: none; border-radius: 999px; box-shadow: inset 4px 4px 8px rgba(255,255,255,.4), inset -4px -6px 10px rgba(0,0,0,.22), 0 10px 22px color-mix(in srgb, var(--boton-color) 40%, transparent); }
&:hover { transform: translateY(-2px) scale(1.03); }`,
  },
  vidrio: {
    nombre: 'Vidrio', descripcion: 'Translúcido con desenfoque', categoria: 'texturas', efecto: 'brillo',
    css: `& { background: color-mix(in srgb, var(--boton-color) 22%, transparent); color: var(--color-texto); border: 1px solid color-mix(in srgb, var(--boton-color) 55%, transparent); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); box-shadow: inset 0 1px 0 rgba(255,255,255,.35); }
&:hover { background: color-mix(in srgb, var(--boton-color) 34%, transparent); }`,
  },
  neon: {
    nombre: 'Neón', descripcion: 'Brilla como un cartel', categoria: 'texturas', efecto: 'pulso',
    css: `& { background: transparent; color: var(--color-texto); border: 2px solid var(--boton-color); box-shadow: 0 0 8px color-mix(in srgb, var(--boton-color) 70%, transparent), inset 0 0 8px color-mix(in srgb, var(--boton-color) 45%, transparent); }
&:hover { box-shadow: 0 0 16px var(--boton-color), 0 0 32px color-mix(in srgb, var(--boton-color) 60%, transparent), inset 0 0 12px color-mix(in srgb, var(--boton-color) 55%, transparent); }`,
  },
  cromo: {
    nombre: 'Cromo', descripcion: 'Metálico con reflejo', categoria: 'texturas', efecto: 'brillo',
    css: `& { background: linear-gradient(180deg, #FFFFFF, #D7DBE2 45%, #A3AAB5 52%, #E6E9EE); color: #15171C; border: 1px solid #8A9099; overflow: hidden; text-shadow: 0 1px 0 rgba(255,255,255,.7); }
&::before { content: ''; position: absolute; inset: 0; background: linear-gradient(100deg, transparent 30%, rgba(255,255,255,.85) 50%, transparent 70%); transform: translateX(-120%); transition: transform 800ms var(--curva-entrada); }
&:hover::before { transform: translateX(120%); }`,
  },
  sticker: {
    nombre: 'Sticker', descripcion: 'Pegado y torcido; se endereza', categoria: 'texturas', efecto: 'rebote',
    css: `& { background: var(--boton-color); color: var(--boton-sobre); border: 3px solid #FFFFFF; box-shadow: 0 4px 12px rgba(0,0,0,.22); transform: rotate(-3deg); }
&:hover { transform: rotate(0deg) scale(1.05); }`,
  },
  bisel: {
    nombre: 'Bisel retro', descripcion: 'Como una ventana de los 90', categoria: 'retro', efecto: 'propio',
    css: `& { background: #D4D0C8; color: #000000; border: 2px solid; border-color: #FFFFFF #404040 #404040 #FFFFFF; box-shadow: 1px 1px 0 #000; border-radius: 0; font-family: var(--fuente-texto); }
&:hover { background: #E0DDD6; }
&.toque { animation: bt-k-bisel 240ms steps(1); }
@keyframes bt-k-bisel { 0%, 60% { border-color: #404040 #FFFFFF #FFFFFF #404040; transform: translate(1px, 1px); box-shadow: none; } }`,
  },
  terminal: {
    nombre: 'Terminal', descripcion: 'Entre corchetes, parpadea al tocar', categoria: 'retro', efecto: 'propio',
    css: `& { background: transparent; color: var(--color-texto); border: none; border-radius: 0; font-family: ui-monospace, Menlo, monospace; padding: 0 8px; }
&::before { content: '[ '; color: var(--boton-color); white-space: pre; }
&::after { content: ' ]'; color: var(--boton-color); white-space: pre; }
&:hover { background: color-mix(in srgb, var(--boton-color) 18%, transparent); }
&.toque { animation: bt-k-parpadeo 420ms steps(2) 1; }
@keyframes bt-k-parpadeo { 50% { opacity: 0.2; } }`,
  },
};

/** Diseño de botón que se propone para cada estilo visual (después se cambia en el panel). */
export const DISENO_POR_ESTILO: Record<EstiloId, BotonDisenoId> = {
  suizo: 'solido',
  bauhaus: 'empujable',
  memphis: 'sticker',
  neobrutalismo: 'sombra_dura',
  vidrio: 'vidrio',
  clay: 'clay',
  retro_os: 'bisel',
  terminal: 'terminal',
  editorial: 'subrayado',
  art_deco: 'doble',
  y2k: 'cromo',
  organico: 'pildora',
};

/** CSS base de todos los botones del panel y de las animaciones al tocar. */
export const CSS_BASE_BOTON = `& {
  position: relative; isolation: isolate; display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  min-height: var(--boton-alto); padding: 0 var(--boton-padding); border-radius: var(--radio-boton);
  font-family: var(--fuente-texto); font-size: var(--boton-texto); font-weight: 600; white-space: nowrap;
  text-transform: var(--boton-mayusculas); letter-spacing: var(--boton-espaciado); cursor: pointer;
  transition: transform var(--duracion-rapida) var(--curva-entrada), box-shadow var(--duracion-rapida) var(--curva-entrada),
    filter var(--duracion-rapida) ease, background-color var(--duracion-media) ease, color var(--duracion-media) ease;
}
&:focus-visible { outline: 3px solid var(--color-texto); outline-offset: 3px; }
&.bt-ef-onda::after { content: ''; position: absolute; left: var(--x, 50%); top: var(--y, 50%); width: 12px; height: 12px; border-radius: 50%; background: currentColor; opacity: 0; transform: translate(-50%, -50%) scale(0); pointer-events: none; }
&.bt-ef-onda.toque::after { animation: bt-onda 650ms ease-out; }
@keyframes bt-onda { from { opacity: .35; transform: translate(-50%, -50%) scale(0); } to { opacity: 0; transform: translate(-50%, -50%) scale(28); } }
&.bt-ef-hundir.toque { animation: bt-hundir 320ms var(--curva-entrada); }
@keyframes bt-hundir { 35% { transform: scale(.92); } 70% { transform: scale(1.03); } }
&.bt-ef-gelatina.toque { animation: bt-gelatina 600ms ease; }
@keyframes bt-gelatina { 30% { transform: scale(1.18, .82); } 45% { transform: scale(.88, 1.12); } 60% { transform: scale(1.06, .94); } 80% { transform: scale(.98, 1.02); } }
&.bt-ef-rebote.toque { animation: bt-rebote 520ms cubic-bezier(.3,1.6,.5,1); }
@keyframes bt-rebote { 40% { transform: translateY(-10px) rotate(0deg); } }
&.bt-ef-pulso.toque { animation: bt-pulso 600ms ease-out; }
@keyframes bt-pulso { from { box-shadow: 0 0 0 0 color-mix(in srgb, var(--boton-color) 60%, transparent); } to { box-shadow: 0 0 0 16px transparent; } }
&.bt-ef-aplastar.toque { animation: bt-aplastar 360ms ease; }
@keyframes bt-aplastar { 35% { transform: scale(1.06, .8); } 70% { transform: scale(.98, 1.04); } }
&.bt-ef-brillo.toque { animation: bt-brillo 420ms ease; }
@keyframes bt-brillo { 30% { filter: brightness(1.5) saturate(1.2); } }
@media (prefers-reduced-motion: reduce) { &, &::before, &::after { animation: none !important; transition: none !important; } }`;

/** CSS de un diseño de botón con `&` reemplazado por el selector dado. */
export const cssDeBoton = (id: BotonDisenoId, selector: string) =>
  (CSS_BASE_BOTON + '\n' + BOTONES[id].css).replace(/&/g, selector);

/** Clases que lleva un botón con este diseño. */
export const clasesDeBoton = (id: BotonDisenoId) => `bt bt-${id} bt-ef-${BOTONES[id].efecto}`;
