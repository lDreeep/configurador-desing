// Interruptores, casillas y deslizadores.

import { useId, useState, type CSSProperties } from 'react';
import type { Categoria } from './base';

// ---------- Interruptores ----------

function MuestraInterruptor({ clase }: { clase: string; id: string }) {
  return (
    <div className="cm-grupo-controles">
      <label className={clase}>
        <input type="checkbox" role="switch" defaultChecked />
        <span className="cm-pista" aria-hidden="true">
          <span className="cm-perilla" />
        </span>
        <span className="cm-txt">Notificaciones</span>
      </label>
      <label className={clase}>
        <input type="checkbox" role="switch" />
        <span className="cm-pista" aria-hidden="true">
          <span className="cm-perilla" />
        </span>
        <span className="cm-txt">Modo oscuro</span>
      </label>
    </div>
  );
}

export const INTERRUPTORES: Categoria = {
  id: 'interruptor',
  nombre: 'Interruptores',
  singular: 'interruptor',
  descripcion: 'Prendelos y apagalos para ver la animación.',
  estructura:
    '<label class="cm-interruptor cm-interruptor-DISEÑO"><input type="checkbox" role="switch"><span class="cm-pista"><span class="cm-perilla"></span></span><span class="cm-txt">Texto</span></label>',
  anchoCelda: 240,
  base: `& { position: relative; display: inline-flex; align-items: center; gap: 12px; min-height: 44px; cursor: pointer; font-family: var(--fuente-texto); color: var(--color-texto); font-size: 15px; }
& input { position: absolute; opacity: 0; width: 1px; height: 1px; }
& .cm-pista { position: relative; flex-shrink: 0; width: 52px; height: 30px; border-radius: 999px; background: color-mix(in srgb, var(--color-texto) 24%, var(--color-fondo)); transition: background-color var(--duracion-media) ease, box-shadow var(--duracion-media) ease; }
& .cm-perilla { position: absolute; top: 3px; left: 3px; width: 24px; height: 24px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 1px 3px rgba(0,0,0,.3);
  transition: transform var(--duracion-media) var(--curva-entrada), width var(--duracion-rapida) ease, background-color var(--duracion-media) ease; }
& input:checked + .cm-pista { background: var(--color-acento); }
& input:checked + .cm-pista .cm-perilla { transform: translateX(22px); }
& input:focus-visible + .cm-pista { outline: 3px solid var(--color-acento); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { & .cm-pista, & .cm-perilla { transition: none !important; } }`,
  disenos: {
    clasico: { nombre: 'Clásico', descripcion: 'Pastilla con perilla blanca', css: '' },
    cuadrado: {
      nombre: 'Cuadrado', descripcion: 'Esquinas rectas, más técnico',
      css: `& .cm-pista { border-radius: 6px; } & .cm-perilla { border-radius: 4px; }`,
    },
    material: {
      nombre: 'Material', descripcion: 'Pista fina y perilla grande que se colorea',
      css: `& .cm-pista { height: 16px; margin: 7px 0; width: 46px; background: color-mix(in srgb, var(--color-texto) 25%, transparent); }
& .cm-perilla { top: -5px; left: -2px; width: 26px; height: 26px; }
& input:checked + .cm-pista { background: color-mix(in srgb, var(--color-acento) 45%, transparent); }
& input:checked + .cm-pista .cm-perilla { transform: translateX(24px); background: var(--color-acento); }`,
    },
    liquido: {
      nombre: 'Líquido', descripcion: 'La perilla se estira mientras la tocás',
      css: `& .cm-perilla { transition: transform 420ms cubic-bezier(.3,1.5,.5,1), width 160ms ease, left 160ms ease; }
& input:active + .cm-pista .cm-perilla, &:active .cm-perilla { width: 32px; }
& input:checked:active + .cm-pista .cm-perilla { transform: translateX(14px); }`,
    },
    iconos: {
      nombre: 'Con símbolos', descripcion: 'Muestra I y O dentro de la pista',
      css: `& .cm-pista { width: 60px; }
& .cm-pista::before, & .cm-pista::after { position: absolute; top: 50%; transform: translateY(-50%); font-size: 12px; font-weight: 800; }
& .cm-pista::before { content: 'I'; left: 12px; color: var(--color-sobre-acento); }
& .cm-pista::after { content: 'O'; right: 10px; color: var(--color-texto-suave); }
& input:checked + .cm-pista .cm-perilla { transform: translateX(30px); }`,
    },
    neobrutal: {
      nombre: 'Neobrutal', descripcion: 'Borde negro y sombra sólida',
      css: `& .cm-pista { border: 2px solid var(--color-texto); background: var(--color-fondo); box-shadow: 3px 3px 0 var(--color-texto); border-radius: 0; height: 30px; }
& .cm-perilla { top: 2px; left: 2px; border-radius: 0; background: var(--color-texto); box-shadow: none; width: 22px; height: 22px; }
& input:checked + .cm-pista { background: var(--color-acento); }
& input:checked + .cm-pista .cm-perilla { transform: translateX(22px); }`,
    },
    neumorfico: {
      nombre: 'Neumórfico', descripcion: 'Pista hundida y perilla en relieve',
      css: `& .cm-pista { background: var(--color-superficie); box-shadow: inset 2px 2px 5px rgba(0,0,0,.18), inset -2px -2px 5px rgba(255,255,255,.7); }
& .cm-perilla { background: var(--color-superficie); box-shadow: 2px 2px 5px rgba(0,0,0,.2), -1px -1px 3px rgba(255,255,255,.8); }
& input:checked + .cm-pista { background: var(--color-superficie); box-shadow: inset 2px 2px 5px rgba(0,0,0,.18), inset -2px -2px 5px rgba(255,255,255,.7), inset 0 0 0 30px color-mix(in srgb, var(--color-acento) 30%, transparent); }
& input:checked + .cm-pista .cm-perilla { background: var(--color-acento); }`,
    },
    retro: {
      nombre: 'Retro', descripcion: 'Biselado, con ON y OFF',
      css: `& .cm-pista { width: 64px; height: 28px; border-radius: 0; background: #D4D0C8; border: 2px solid; border-color: #404040 #FFFFFF #FFFFFF #404040; }
& .cm-perilla { top: 1px; left: 1px; width: 28px; height: 22px; border-radius: 0; background: #D4D0C8; border: 2px solid; border-color: #FFFFFF #404040 #404040 #FFFFFF; box-shadow: none; }
& .cm-perilla::after { content: 'OFF'; position: absolute; inset: 0; display: grid; place-items: center; font: 700 9px ui-monospace, monospace; color: #000; }
& input:checked + .cm-pista { background: #000080; }
& input:checked + .cm-pista .cm-perilla { transform: translateX(30px); }
& input:checked + .cm-pista .cm-perilla::after { content: 'ON'; }`,
    },
  },
  Muestra: MuestraInterruptor,
};

// ---------- Casillas ----------

function MuestraCasilla({ clase }: { clase: string; id: string }) {
  return (
    <div className="cm-grupo-controles">
      {['Recordarme', 'Quiero recibir novedades', 'Acepto los términos'].map((t, i) => (
        <label key={t} className={clase}>
          <input type="checkbox" defaultChecked={i === 0} />
          <span className="cm-marca" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>
          <span className="cm-txt">{t}</span>
        </label>
      ))}
    </div>
  );
}

export const CASILLAS: Categoria = {
  id: 'casilla',
  nombre: 'Casillas',
  singular: 'casilla',
  descripcion: 'Marcalas y desmarcalas.',
  estructura:
    '<label class="cm-casilla cm-casilla-DISEÑO"><input type="checkbox"><span class="cm-marca"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span class="cm-txt">Texto</span></label>',
  anchoCelda: 240,
  base: `& { position: relative; display: flex; align-items: center; gap: 12px; min-height: 40px; cursor: pointer; font-family: var(--fuente-texto); color: var(--color-texto); font-size: 15px; }
& input { position: absolute; opacity: 0; width: 1px; height: 1px; }
& .cm-marca { flex-shrink: 0; display: grid; place-items: center; width: 22px; height: 22px; border: 2px solid var(--color-borde); border-radius: 6px; background: var(--color-fondo);
  transition: background-color var(--duracion-media) ease, border-color var(--duracion-media) ease, transform var(--duracion-media) var(--curva-entrada); }
& svg { width: 16px; height: 16px; fill: none; stroke: var(--color-sobre-acento); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 24; stroke-dashoffset: 24; transition: stroke-dashoffset var(--duracion-lenta) var(--curva-entrada); }
& input:checked + .cm-marca { background: var(--color-acento); border-color: var(--color-acento); }
& input:checked + .cm-marca svg { stroke-dashoffset: 0; }
& input:focus-visible + .cm-marca { outline: 3px solid var(--color-acento); outline-offset: 2px; }
& .cm-txt { transition: color var(--duracion-media) ease; }
@media (prefers-reduced-motion: reduce) { & .cm-marca, & svg, & .cm-txt { transition: none !important; animation: none !important; } }`,
  disenos: {
    cuadrada: { nombre: 'Cuadrada', descripcion: 'La tilde se dibuja al marcar', css: '' },
    redonda: { nombre: 'Redonda', descripcion: 'Círculo en lugar de cuadrado', css: `& .cm-marca { border-radius: 50%; width: 24px; height: 24px; }` },
    dibujada: {
      nombre: 'Solo la tilde', descripcion: 'Sin relleno: aparece una tilde de color',
      css: `& svg { stroke: var(--color-acento); }
& input:checked + .cm-marca { background: var(--color-fondo); border-color: var(--color-acento); }`,
    },
    rebote: {
      nombre: 'Con rebote', descripcion: 'Salta al marcarla',
      css: `& input:checked + .cm-marca { animation: cm-pop 380ms cubic-bezier(.3,1.6,.5,1); }
@keyframes cm-pop { 0% { transform: scale(.7); } 60% { transform: scale(1.15); } 100% { transform: scale(1); } }`,
    },
    neobrutal: {
      nombre: 'Neobrutal', descripcion: 'Borde negro y sombra sólida',
      css: `& .cm-marca { border: 2px solid var(--color-texto); border-radius: 0; box-shadow: 2px 2px 0 var(--color-texto); }
& input:checked + .cm-marca { border-color: var(--color-texto); transform: translate(2px, 2px); box-shadow: none; }`,
    },
    tachar: {
      nombre: 'Lista de tareas', descripcion: 'Al marcar, el texto se tacha',
      css: `& .cm-marca { border-radius: 50%; }
& .cm-txt { background: linear-gradient(currentColor, currentColor) no-repeat 0 55% / 0 1.5px; transition: background-size var(--duracion-lenta) var(--curva-entrada), color var(--duracion-media) ease; }
& input:checked ~ .cm-txt { background-size: 100% 1.5px; color: var(--color-texto-suave); }`,
    },
    suave: {
      nombre: 'Tonal', descripcion: 'Fondo suave del acento y tilde de color',
      css: `& .cm-marca { border-color: transparent; background: var(--color-superficie); border-radius: 8px; width: 26px; height: 26px; }
& svg { stroke: var(--color-acento); }
& input:checked + .cm-marca { background: color-mix(in srgb, var(--color-acento) 20%, var(--color-fondo)); border-color: transparent; }`,
    },
    retro: {
      nombre: 'Retro', descripcion: 'Biselada, como los 90',
      css: `& .cm-marca { border-radius: 0; border: 2px solid; border-color: #404040 #FFFFFF #FFFFFF #404040; background: #FFFFFF; }
& svg { stroke: #000000; stroke-width: 3.5; transition: none; }
& input:checked + .cm-marca { background: #FFFFFF; border-color: #404040 #FFFFFF #FFFFFF #404040; }`,
    },
  },
  Muestra: MuestraCasilla,
};

// ---------- Deslizadores ----------

function MuestraDeslizador({ clase }: { clase: string; id: string }) {
  const id = useId();
  const [v, setV] = useState(40);
  return (
    <div className={clase} style={{ '--valor': `${v}%` } as CSSProperties}>
      <label htmlFor={id} className="cm-etq">
        <span>Presupuesto</span>
        <output htmlFor={id}>{v}%</output>
      </label>
      <input id={id} type="range" min={0} max={100} step={1} value={v} onChange={(e) => setV(+e.target.value)} />
    </div>
  );
}

const pista = (css: string) => `& input::-webkit-slider-runnable-track { ${css} }
& input::-moz-range-track { ${css} }`;
const perilla = (css: string) => `& input::-webkit-slider-thumb { ${css} }
& input::-moz-range-thumb { ${css} }`;

export const DESLIZADORES: Categoria = {
  id: 'deslizador',
  nombre: 'Deslizadores',
  singular: 'deslizador',
  descripcion: 'Arrastralos para ver el relleno y la perilla.',
  estructura:
    '<div class="cm-deslizador cm-deslizador-DISEÑO" style="--valor: 40%"><label class="cm-etq" for="x"><span>Etiqueta</span><output>40%</output></label><input id="x" type="range" min="0" max="100"></div> — al mover, actualizar --valor (porcentaje) y el output.',
  anchoCelda: 260,
  base: `& { position: relative; display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 320px; font-family: var(--fuente-texto); color: var(--color-texto); }
& .cm-etq { display: flex; justify-content: space-between; font-size: 14px; font-weight: 600; }
& output { font-variant-numeric: tabular-nums; color: var(--color-texto-suave); }
& input { -webkit-appearance: none; appearance: none; width: 100%; height: 30px; margin: 0; background: transparent; cursor: pointer; }
& input:focus { outline: none; }
${pista('height: 6px; border-radius: 999px; background: linear-gradient(to right, var(--color-acento) var(--valor), var(--color-borde) var(--valor));')}
${perilla('-webkit-appearance: none; appearance: none; width: 22px; height: 22px; margin-top: -8px; border-radius: 50%; background: #FFFFFF; border: 2px solid var(--color-acento); box-shadow: 0 1px 4px rgba(0,0,0,.25); transition: transform var(--duracion-rapida) var(--curva-entrada);')}
& input::-moz-range-thumb { margin-top: 0; }
& input:active::-webkit-slider-thumb { transform: scale(1.2); }
& input:active::-moz-range-thumb { transform: scale(1.2); }
& input:focus-visible::-webkit-slider-thumb { outline: 3px solid var(--color-acento); outline-offset: 2px; }
& input:focus-visible::-moz-range-thumb { outline: 3px solid var(--color-acento); outline-offset: 2px; }`,
  disenos: {
    clasico: { nombre: 'Clásico', descripcion: 'Relleno de color y perilla blanca', css: '' },
    grueso: {
      nombre: 'Grueso', descripcion: 'Pista ancha, perilla integrada',
      css: `${pista('height: 16px;')}
${perilla('width: 26px; height: 26px; margin-top: -5px; border-width: 4px;')}`,
    },
    fino: {
      nombre: 'Fino', descripcion: 'Línea mínima, perilla oscura',
      css: `${pista('height: 2px; background: linear-gradient(to right, var(--color-texto) var(--valor), var(--color-borde) var(--valor));')}
${perilla('width: 16px; height: 16px; margin-top: -7px; background: var(--color-texto); border: none;')}`,
    },
    neobrutal: {
      nombre: 'Neobrutal', descripcion: 'Pista con borde y perilla cuadrada',
      css: `${pista('height: 14px; border-radius: 0; border: 2px solid var(--color-texto); box-shadow: 2px 2px 0 var(--color-texto);')}
${perilla('width: 22px; height: 26px; margin-top: -8px; border-radius: 0; background: var(--color-fondo); border: 2px solid var(--color-texto); box-shadow: 2px 2px 0 var(--color-texto);')}`,
    },
    vidrio: {
      nombre: 'Vidrio', descripcion: 'Pista translúcida con brillo',
      css: `${pista('height: 10px; background: linear-gradient(to right, color-mix(in srgb, var(--color-acento) 80%, transparent) var(--valor), color-mix(in srgb, var(--color-texto) 14%, transparent) var(--valor)); box-shadow: inset 0 1px 2px rgba(0,0,0,.2);')}
${perilla('width: 24px; height: 24px; margin-top: -7px; border: 1px solid rgba(255,255,255,.7); background: radial-gradient(circle at 35% 30%, #FFFFFF, color-mix(in srgb, var(--color-acento) 30%, #FFFFFF)); box-shadow: 0 0 14px color-mix(in srgb, var(--color-acento) 55%, transparent);')}`,
    },
    escalonado: {
      nombre: 'Con marcas', descripcion: 'Marcas cada 10%',
      css: `${pista('height: 6px; background: repeating-linear-gradient(to right, transparent 0 calc(10% - 2px), var(--color-texto-suave) calc(10% - 2px) 10%), linear-gradient(to right, var(--color-acento) var(--valor), var(--color-borde) var(--valor));')}`,
    },
    burbuja: {
      nombre: 'Con burbuja', descripcion: 'El valor viaja arriba de la perilla',
      css: `& { padding-top: 34px; }
& .cm-etq { position: static; }
& output { position: absolute; top: 0; left: clamp(0px, calc(var(--valor) - 20px), calc(100% - 44px)); min-width: 44px; padding: 3px 8px; border-radius: 999px; background: var(--color-acento); color: var(--color-sobre-acento); text-align: center; font-size: 13px; font-weight: 700; }`,
    },
    degradado: {
      nombre: 'Degradado', descripcion: 'El relleno pasa de un color a otro',
      css: `${pista('height: 8px; background: linear-gradient(to right, var(--color-acento), color-mix(in oklch, var(--color-acento), #FF4FD8 55%) var(--valor), var(--color-borde) var(--valor));')}
${perilla('border-color: color-mix(in oklch, var(--color-acento), #FF4FD8 55%);')}`,
    },
  },
  Muestra: MuestraDeslizador,
};
