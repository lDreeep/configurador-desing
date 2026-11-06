// Diseños de botón del panel de botones. Cada uno define su aspecto, su hover y su animación al tocar.
// El CSS se usa en el configurador y se exporta tal cual (DESIGN.md §10).
// En el CSS, `&` es el botón. Usa solo tokens: --boton-color, --boton-sobre, --color-*, --radio-boton,
// --boton-alto, --boton-padding, --boton-texto, --fuente-texto, --duracion-*, --curva-*.

import type { BotonDisenoId, EstiloId } from './tipos';

export type EfectoToque = 'onda' | 'hundir' | 'gelatina' | 'rebote' | 'pulso' | 'aplastar' | 'brillo' | 'temblor' | 'latido' | 'estallido' | 'propio';
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
  temblor: 'Tiembla',
  latido: 'Late dos veces, como un corazón',
  estallido: 'Suelta chispas alrededor',
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
  gradiente_borde: {
    nombre: 'Borde degradado', descripcion: 'Contorno de degradado; se rellena al pasar', categoria: 'contornos', efecto: 'pulso',
    css: `& { color: var(--color-texto); border: 2px solid transparent; border-radius: 999px; background: linear-gradient(var(--color-fondo), var(--color-fondo)) padding-box, linear-gradient(120deg, var(--boton-color), color-mix(in oklch, var(--boton-color), #FF4FD8 55%)) border-box; }
&:hover { color: var(--boton-sobre); background: linear-gradient(120deg, var(--boton-color), color-mix(in oklch, var(--boton-color), #FF4FD8 55%)) padding-box, linear-gradient(120deg, var(--boton-color), color-mix(in oklch, var(--boton-color), #FF4FD8 55%)) border-box; }`,
  },
  sombra_color: {
    nombre: 'Sombra de color', descripcion: 'Sombra sólida del mismo color, corrida', categoria: 'volumen', efecto: 'propio',
    css: `& { background: var(--color-fondo); color: var(--color-texto); border: 2px solid var(--boton-color); box-shadow: 5px 5px 0 var(--boton-color); }
&:hover { transform: translate(-2px, -2px); box-shadow: 7px 7px 0 var(--boton-color); }
&.toque { animation: bt-k-sombra-color 300ms var(--curva-entrada); }
@keyframes bt-k-sombra-color { 40% { transform: translate(5px, 5px); box-shadow: 0 0 0 var(--boton-color); } }`,
  },
  sombra_larga: {
    nombre: 'Sombra larga', descripcion: 'Sombra plana en diagonal, estilo flat', categoria: 'volumen', efecto: 'hundir',
    css: `& { background: var(--boton-color); color: var(--boton-sobre); border: none; box-shadow: 1px 1px 0 color-mix(in srgb, var(--boton-color) 60%, #000), 2px 2px 0 color-mix(in srgb, var(--boton-color) 60%, #000), 3px 3px 0 color-mix(in srgb, var(--boton-color) 60%, #000), 4px 4px 0 color-mix(in srgb, var(--boton-color) 60%, #000), 5px 5px 0 color-mix(in srgb, var(--boton-color) 60%, #000), 6px 6px 0 color-mix(in srgb, var(--boton-color) 60%, #000); }
&:hover { transform: translate(-2px, -2px); }`,
  },
  neon_encendido: {
    nombre: 'Neón encendido', descripcion: 'Relleno con un halo fuerte', categoria: 'texturas', efecto: 'latido',
    css: `& { background: var(--boton-color); color: var(--boton-sobre); border: none; box-shadow: 0 0 12px var(--boton-color), 0 0 32px color-mix(in srgb, var(--boton-color) 60%, transparent); }
&:hover { box-shadow: 0 0 18px var(--boton-color), 0 0 48px color-mix(in srgb, var(--boton-color) 70%, transparent); }`,
  },
  texto_sube: {
    nombre: 'Texto que sube', descripcion: 'Al pasar, el texto sale por arriba y entra otro', categoria: 'efectos', efecto: 'hundir',
    css: `& { background: var(--boton-color); color: var(--boton-sobre); border: none; overflow: hidden; }
& .bt-texto { display: inline-block; transition: transform 320ms var(--curva-entrada); }
&::after { content: attr(data-texto); position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; transform: translateY(100%); transition: transform 320ms var(--curva-entrada); }
&:hover .bt-texto { transform: translateY(-180%); }
&:hover::after { transform: none; }`,
  },
  cortina: {
    nombre: 'Cortina', descripcion: 'El color se abre desde el centro', categoria: 'efectos', efecto: 'aplastar',
    css: `& { background: transparent; color: var(--color-texto); border: 2px solid var(--boton-color); overflow: hidden; z-index: 0; }
&::before { content: ''; position: absolute; inset: 0; background: var(--boton-color); transform: scaleX(0); transition: transform 360ms var(--curva-entrada); z-index: -1; }
&:hover { color: var(--boton-sobre); }
&:hover::before { transform: scaleX(1); }`,
  },
  diagonal: {
    nombre: 'Barrido diagonal', descripcion: 'El color entra en diagonal', categoria: 'efectos', efecto: 'onda',
    css: `& { background: var(--color-fondo); color: var(--color-texto); border: 2px solid var(--boton-color); overflow: hidden; z-index: 0; }
&::before { content: ''; position: absolute; top: 0; bottom: 0; left: -20%; width: 140%; background: var(--boton-color); transform: translateX(-100%) skewX(-24deg); transition: transform 420ms var(--curva-entrada); z-index: -1; }
&:hover { color: var(--boton-sobre); }
&:hover::before { transform: translateX(0) skewX(-24deg); }`,
  },
  circulo_flecha: {
    nombre: 'Círculo con flecha', descripcion: 'Un círculo con flecha que gira al pasar', categoria: 'efectos', efecto: 'rebote',
    css: `& { background: var(--boton-color); color: var(--boton-sobre); border: none; border-radius: 999px; padding-right: calc(var(--boton-alto) + 4px); }
&::after { content: '\\2192'; position: absolute; right: 5px; top: 50%; width: calc(var(--boton-alto) - 10px); aspect-ratio: 1; display: grid; place-items: center; border-radius: 50%; background: var(--boton-sobre); color: var(--boton-color); transform: translateY(-50%); transition: transform 320ms var(--curva-entrada); }
&:hover::after { transform: translateY(-50%) rotate(-45deg); }`,
  },
  esquinas: {
    nombre: 'Esquinas', descripcion: 'Solo marcas en las esquinas; se cierran al pasar', categoria: 'contornos', efecto: 'pulso',
    css: `& { background: transparent; color: var(--color-texto); border: none; border-radius: 0; --e: 12px; --g: 2px;
  background-image: linear-gradient(var(--boton-color), var(--boton-color)), linear-gradient(var(--boton-color), var(--boton-color)), linear-gradient(var(--boton-color), var(--boton-color)), linear-gradient(var(--boton-color), var(--boton-color)), linear-gradient(var(--boton-color), var(--boton-color)), linear-gradient(var(--boton-color), var(--boton-color)), linear-gradient(var(--boton-color), var(--boton-color)), linear-gradient(var(--boton-color), var(--boton-color));
  background-repeat: no-repeat;
  background-size: var(--e) var(--g), var(--g) var(--e), var(--e) var(--g), var(--g) var(--e), var(--e) var(--g), var(--g) var(--e), var(--e) var(--g), var(--g) var(--e);
  background-position: 0 0, 0 0, 100% 0, 100% 0, 0 100%, 0 100%, 100% 100%, 100% 100%;
  transition: background-size 320ms var(--curva-entrada); }
&:hover { --e: 50%; }`,
  },
  banderin: {
    nombre: 'Banderín', descripcion: 'Con punta de flecha a la derecha', categoria: 'solidos', efecto: 'rebote',
    css: `& { background: var(--boton-color); color: var(--boton-sobre); border: none; border-radius: 0; padding-right: calc(var(--boton-padding) + 16px); clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%); }
&:hover { padding-right: calc(var(--boton-padding) + 24px); }`,
  },
  hexagonal: {
    nombre: 'Hexagonal', descripcion: 'Puntas en los dos extremos', categoria: 'solidos', efecto: 'latido',
    css: `& { background: var(--boton-color); color: var(--boton-sobre); border: none; border-radius: 0; padding: 0 calc(var(--boton-padding) + 10px); clip-path: polygon(14px 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 14px 100%, 0 50%); }
&:hover { filter: brightness(1.08); }`,
  },
  pixel: {
    nombre: 'Pixel', descripcion: 'Esquinas escalonadas de videojuego', categoria: 'retro', efecto: 'temblor',
    css: `& { background: var(--boton-color); color: var(--boton-sobre); border: none; border-radius: 0; font-family: ui-monospace, Menlo, monospace; text-transform: uppercase; clip-path: polygon(0 6px, 6px 6px, 6px 0, calc(100% - 6px) 0, calc(100% - 6px) 6px, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 6px calc(100% - 6px), 0 calc(100% - 6px)); box-shadow: inset -4px -4px 0 color-mix(in srgb, var(--boton-color) 60%, #000), inset 4px 4px 0 color-mix(in srgb, var(--boton-color) 60%, #fff); }
&:hover { filter: brightness(1.1); }`,
  },
  extruido: {
    nombre: 'Extruido', descripcion: 'Con volumen en capas, se hunde al tocar', categoria: 'volumen', efecto: 'propio',
    css: `& { background: var(--boton-color); color: var(--boton-sobre); border: none; box-shadow: 0 1px 0 color-mix(in srgb, var(--boton-color) 75%, #000), 0 2px 0 color-mix(in srgb, var(--boton-color) 70%, #000), 0 3px 0 color-mix(in srgb, var(--boton-color) 65%, #000), 0 4px 0 color-mix(in srgb, var(--boton-color) 60%, #000), 0 8px 14px rgba(0,0,0,.25); margin-bottom: 4px; }
&:hover { transform: translateY(-1px); }
&.toque { animation: bt-k-extruido 260ms ease; }
@keyframes bt-k-extruido { 40% { transform: translateY(4px); box-shadow: 0 0 0 color-mix(in srgb, var(--boton-color) 60%, #000), 0 2px 4px rgba(0,0,0,.2); } }`,
  },
  vidrio_ahumado: {
    nombre: 'Vidrio ahumado', descripcion: 'Oscuro y translúcido con brillo arriba', categoria: 'texturas', efecto: 'brillo',
    css: `& { background: rgba(10, 10, 14, 0.55); color: #FFFFFF; border: 1px solid rgba(255,255,255,.18); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); box-shadow: inset 0 1px 0 rgba(255,255,255,.25), 0 8px 20px rgba(0,0,0,.25); }
&:hover { background: rgba(10, 10, 14, 0.7); }`,
  },
  aurora: {
    nombre: 'Aurora', descripcion: 'Degradado que se mueve solo, sin parar', categoria: 'texturas', efecto: 'onda',
    css: `& { color: var(--boton-sobre); border: none; overflow: hidden; background: linear-gradient(110deg, var(--boton-color), color-mix(in oklch, var(--boton-color), #3EE6FF 50%), color-mix(in oklch, var(--boton-color), #FF4FD8 50%), var(--boton-color)); background-size: 300% 100%; animation: bt-aurora 6s ease-in-out infinite; }
@keyframes bt-aurora { 50% { background-position: 100% 0; } }`,
  },
  holografico: {
    nombre: 'Holográfico', descripcion: 'Tornasolado que cambia al pasar', categoria: 'texturas', efecto: 'brillo',
    css: `& { color: #15171C; border: 1px solid rgba(255,255,255,.6); background: linear-gradient(115deg, #FFD6F5, #C6F0FF 30%, #E9FFD1 55%, #FFE7C2 80%, #F3D1FF); background-size: 200% 200%; box-shadow: inset 0 1px 0 rgba(255,255,255,.8), 0 6px 18px rgba(0,0,0,.12); transition: background-position 700ms ease, transform var(--duracion-rapida) ease; }
&:hover { background-position: 100% 100%; }`,
  },
  hormigas: {
    nombre: 'Borde que camina', descripcion: 'Línea punteada en movimiento', categoria: 'contornos', efecto: 'pulso',
    css: `& { color: var(--color-texto); border: none; background:
  linear-gradient(90deg, var(--boton-color) 50%, transparent 0) repeat-x 0 0 / 12px 2px,
  linear-gradient(90deg, var(--boton-color) 50%, transparent 0) repeat-x 0 100% / 12px 2px,
  linear-gradient(0deg, var(--boton-color) 50%, transparent 0) repeat-y 0 0 / 2px 12px,
  linear-gradient(0deg, var(--boton-color) 50%, transparent 0) repeat-y 100% 0 / 2px 12px; border-radius: 0; }
&:hover { animation: bt-hormigas 600ms linear infinite; }
@keyframes bt-hormigas { to { background-position: 12px 0, -12px 100%, 0 -12px, 100% 12px; } }`,
  },
  a_mano: {
    nombre: 'Dibujado a mano', descripcion: 'Borde irregular, como con marcador', categoria: 'contornos', efecto: 'temblor',
    css: `& { background: var(--color-fondo); color: var(--color-texto); border: 2px solid var(--color-texto); border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px; }
&:hover { background: color-mix(in srgb, var(--boton-color) 20%, var(--color-fondo)); border-radius: 15px 225px 15px 255px / 255px 15px 225px 15px; }`,
  },
  tinta: {
    nombre: 'Mancha de tinta', descripcion: 'El color se expande desde el centro', categoria: 'efectos', efecto: 'onda',
    css: `& { background: var(--color-fondo); color: var(--color-texto); border: 2px solid var(--boton-color); overflow: hidden; z-index: 0; }
&::before { content: ''; position: absolute; left: 50%; top: 50%; width: 0; height: 0; border-radius: 50%; background: var(--boton-color); transform: translate(-50%, -50%); transition: width 460ms var(--curva-entrada), height 460ms var(--curva-entrada); z-index: -1; }
&:hover { color: var(--boton-sobre); }
&:hover::before { width: 260%; height: 600%; }`,
  },
  respira: {
    nombre: 'Respira', descripcion: 'Un brillo suave que late todo el tiempo', categoria: 'efectos', efecto: 'hundir',
    css: `& { background: var(--boton-color); color: var(--boton-sobre); border: none; animation: bt-respira 2.6s ease-in-out infinite; }
@keyframes bt-respira { 50% { box-shadow: 0 0 0 8px color-mix(in srgb, var(--boton-color) 22%, transparent); } }`,
  },
  link_flecha: {
    nombre: 'Link con flecha', descripcion: 'Texto con línea y flecha que avanza', categoria: 'contornos', efecto: 'aplastar',
    css: `& { background: transparent; color: var(--color-texto); border: none; border-radius: 0; padding: 0 2px; border-bottom: 2px solid var(--boton-color); min-height: calc(var(--boton-alto) - 8px); }
&::after { content: '\\2192'; display: inline-block; transition: transform 260ms var(--curva-entrada); color: var(--boton-color); }
&:hover::after { transform: translateX(6px); }`,
  },
  doble_capa: {
    nombre: 'Doble capa', descripcion: 'Una capa de color atrás que se alinea al pasar', categoria: 'volumen', efecto: 'hundir',
    css: `& { background: var(--boton-color); color: var(--boton-sobre); border: none; margin: 0 6px 6px 0; }
&::before { content: ''; position: absolute; inset: 0; border: 2px solid var(--color-texto); border-radius: inherit; transform: translate(6px, 6px); transition: transform 260ms var(--curva-entrada); z-index: -1; }
&:hover::before { transform: translate(0, 0); }`,
  },
  synthwave: {
    nombre: 'Synthwave', descripcion: 'Ochentoso: degradado rosa y violeta con neón', categoria: 'retro', efecto: 'latido',
    css: `& { color: #FFFFFF; border: 2px solid #FF4FD8; background: linear-gradient(180deg, #2B0B3F, #5B1A7A); text-shadow: 0 0 8px #FF4FD8; box-shadow: 0 0 12px rgba(255,79,216,.6), inset 0 0 10px rgba(62,230,255,.35); text-transform: uppercase; letter-spacing: 0.1em; font-size: calc(var(--boton-texto) * 0.9); }
&:hover { box-shadow: 0 0 20px rgba(255,79,216,.85), inset 0 0 14px rgba(62,230,255,.5); }`,
  },
  acuoso: {
    nombre: 'Brillo acuoso', descripcion: 'Gota brillante con reflejo arriba', categoria: 'texturas', efecto: 'gelatina',
    css: `& { background: linear-gradient(180deg, color-mix(in srgb, var(--boton-color) 70%, #fff), var(--boton-color) 55%, color-mix(in srgb, var(--boton-color) 80%, #000)); color: var(--boton-sobre); border: 1px solid color-mix(in srgb, var(--boton-color) 70%, #000); border-radius: 999px; overflow: hidden; box-shadow: 0 6px 14px color-mix(in srgb, var(--boton-color) 40%, transparent); }
&::before { content: ''; position: absolute; left: 10%; right: 10%; top: 2px; height: 45%; border-radius: 999px; background: linear-gradient(rgba(255,255,255,.75), rgba(255,255,255,.05)); pointer-events: none; }`,
  },
  estallido: {
    nombre: 'Estallido', descripcion: 'Al tocarlo suelta chispas', categoria: 'efectos', efecto: 'estallido',
    css: `& { background: var(--boton-color); color: var(--boton-sobre); border: none; }
&:hover { transform: translateY(-1px); }`,
  },
  tembloroso: {
    nombre: 'Nervioso', descripcion: 'Sólido que tiembla al tocarlo', categoria: 'solidos', efecto: 'temblor',
    css: `& { background: var(--boton-color); color: var(--boton-sobre); border: none; border-radius: 6px; }
&:hover { transform: rotate(-1.5deg); }`,
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
&.bt-ef-temblor.toque { animation: bt-temblor 360ms linear; }
@keyframes bt-temblor { 15% { transform: translateX(-4px) rotate(-2deg); } 30% { transform: translateX(4px) rotate(2deg); } 45% { transform: translateX(-3px); } 60% { transform: translateX(3px); } 75% { transform: translateX(-1px); } }
&.bt-ef-latido.toque { animation: bt-latido 560ms ease; }
@keyframes bt-latido { 15% { transform: scale(1.12); } 30% { transform: scale(1); } 45% { transform: scale(1.08); } 60% { transform: scale(1); } }
&.bt-ef-estallido.toque { animation: bt-estallido 520ms ease-out; }
@keyframes bt-estallido {
  0% { box-shadow: 0 0 0 0 var(--boton-color), 0 0 0 0 var(--boton-color), 0 0 0 0 var(--boton-color), 0 0 0 0 var(--boton-color), 0 0 0 0 var(--boton-color), 0 0 0 0 var(--boton-color); }
  60% { box-shadow: 0 -26px 0 -3px var(--boton-color), 24px -14px 0 -3px var(--boton-color), 26px 12px 0 -3px var(--boton-color), 0 26px 0 -3px var(--boton-color), -26px 12px 0 -3px var(--boton-color), -24px -14px 0 -3px var(--boton-color); }
  100% { box-shadow: 0 -34px 0 -6px transparent, 32px -18px 0 -6px transparent, 34px 16px 0 -6px transparent, 0 34px 0 -6px transparent, -34px 16px 0 -6px transparent, -32px -18px 0 -6px transparent; }
}
@media (prefers-reduced-motion: reduce) { &, &::before, &::after { animation: none !important; transition: none !important; } }`;

/** CSS de un diseño de botón con `&` reemplazado por el selector dado. */
export const cssDeBoton = (id: BotonDisenoId, selector: string) =>
  (CSS_BASE_BOTON + '\n' + BOTONES[id].css).replace(/&/g, selector);

/** Clases que lleva un botón con este diseño. */
export const clasesDeBoton = (id: BotonDisenoId) => `bt bt-${id} bt-ef-${BOTONES[id].efecto}`;
