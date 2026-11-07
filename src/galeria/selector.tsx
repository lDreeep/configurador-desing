// Selectores tipo slide (controles segmentados): elegís una opción u otra y la marca se desliza.

import { useState, type CSSProperties, type KeyboardEvent } from 'react';
import type { Categoria } from './base';

function Selector({ clase, opciones, etiqueta, grande = false }: { clase: string; opciones: string[]; etiqueta: string; grande?: boolean }) {
  const [i, setI] = useState(0);
  const teclado = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const n = (i + (e.key === 'ArrowRight' ? 1 : -1) + opciones.length) % opciones.length;
    setI(n);
    (e.currentTarget.querySelectorAll('button')[n] as HTMLButtonElement | undefined)?.focus();
  };
  return (
    <div className={`${clase} ${grande ? 'cm-grande' : ''}`} role="radiogroup" aria-label={etiqueta} style={{ '--i': i, '--n': opciones.length } as CSSProperties} onKeyDown={teclado}>
      <span className="cm-ind" aria-hidden="true" />
      {opciones.map((o, j) => (
        <button key={o} type="button" role="radio" aria-checked={j === i} tabIndex={j === i ? 0 : -1} onClick={() => setI(j)}>
          {o}
        </button>
      ))}
    </div>
  );
}

function MuestraSelector({ clase }: { clase: string; id: string }) {
  return (
    <div className="cm-grupo-controles cm-centro">
      <Selector clase={clase} opciones={['Mensual', 'Anual']} etiqueta="Forma de pago" />
      <Selector clase={clase} opciones={['Día', 'Semana', 'Mes']} etiqueta="Período" grande />
    </div>
  );
}

const mover = 'transform: translateX(calc(var(--i) * 100%)); transition: transform var(--duracion-lenta) var(--curva-entrada);';

export const SELECTOR: Categoria = {
  id: 'selector',
  nombre: 'Selectores (slide)',
  singular: 'selector',
  descripcion: 'Elegí una opción u otra: la marca se desliza. Hay uno chico y uno grande.',
  estructura:
    '<div class="cm-selector cm-selector-DISEÑO" role="radiogroup" style="--i: 0; --n: 2"><span class="cm-ind"></span><button role="radio" aria-checked="true">Mensual</button><button role="radio" aria-checked="false">Anual</button></div> — agregar .cm-grande para la versión grande; --i es la opción elegida.',
  anchoCelda: 280,
  base: `& { position: relative; display: inline-grid; grid-template-columns: repeat(var(--n), 1fr); padding: 4px; border-radius: 999px; background: color-mix(in srgb, var(--color-texto) 9%, var(--color-fondo)); font-family: var(--fuente-texto); }
& .cm-ind { position: absolute; top: 4px; bottom: 4px; left: 4px; width: calc((100% - 8px) / var(--n)); border-radius: 999px; background: var(--color-fondo); box-shadow: 0 1px 4px rgba(0,0,0,.14); ${mover} }
& button { position: relative; z-index: 1; min-height: 36px; padding: 0 16px; border: none; border-radius: 999px; background: transparent; color: var(--color-texto-suave); font: inherit; font-size: 14px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: color var(--duracion-media) ease; }
& button[aria-checked='true'] { color: var(--color-texto); }
& button:focus-visible { outline: 2px solid var(--color-acento); outline-offset: 1px; }
&.cm-grande button { min-height: 48px; padding: 0 22px; font-size: 16px; }
@media (prefers-reduced-motion: reduce) { & .cm-ind, & button { transition: none !important; } }`,
  disenos: {
    pildora: { nombre: 'Píldora', descripcion: 'La clásica: una pastilla blanca que se desliza', css: '' },
    acento: { nombre: 'De color', descripcion: 'La marca es del color de acento', css: `& .cm-ind { background: var(--color-acento); } & button[aria-checked='true'] { color: var(--color-sobre-acento); }` },
    cuadrado: { nombre: 'Cuadrado', descripcion: 'Esquinas rectas, más técnico', css: `&, & .cm-ind, & button { border-radius: 8px; } & .cm-ind { border-radius: 6px; }` },
    subrayado: { nombre: 'Subrayado', descripcion: 'Sin fondo; una línea se mueve abajo', css: `& { background: transparent; border-bottom: 1px solid var(--color-borde); border-radius: 0; padding: 0; } & .cm-ind { top: auto; bottom: -1px; left: 0; width: calc(100% / var(--n)); height: 2px; border-radius: 0; background: var(--color-acento); box-shadow: none; }` },
    contorno: { nombre: 'Contorno', descripcion: 'Borde fino y marca oscura', css: `& { background: transparent; border: 1.5px solid var(--color-borde); } & .cm-ind { background: var(--color-texto); box-shadow: none; } & button[aria-checked='true'] { color: var(--color-fondo); }` },
    gota: { nombre: 'Gota elástica', descripcion: 'La marca se pasa de largo y rebota', css: `& .cm-ind { transition: transform 620ms cubic-bezier(.34,1.8,.4,1); background: var(--color-acento); } & button[aria-checked='true'] { color: var(--color-sobre-acento); }` },
    neobrutal: { nombre: 'Neobrutal', descripcion: 'Bordes negros y sombra sólida', css: `& { border-radius: 0; background: var(--color-fondo); border: 2px solid var(--color-texto); box-shadow: 4px 4px 0 var(--color-texto); padding: 3px; } & .cm-ind { top: 3px; bottom: 3px; left: 3px; width: calc((100% - 6px) / var(--n)); border-radius: 0; background: var(--color-acento); box-shadow: none; } & button { border-radius: 0; } & button[aria-checked='true'] { color: var(--color-sobre-acento); }` },
    vidrio: { nombre: 'Vidrio', descripcion: 'Translúcido con marca brillante', css: `& { background: color-mix(in srgb, var(--color-texto) 7%, transparent); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid color-mix(in srgb, var(--color-texto) 14%, transparent); } & .cm-ind { background: color-mix(in srgb, var(--color-fondo) 80%, transparent); box-shadow: 0 2px 10px rgba(0,0,0,.15), inset 0 1px 0 rgba(255,255,255,.6); }` },
    oscuro: { nombre: 'Oscuro', descripcion: 'Fondo oscuro, marca clara', css: `& { background: #111318; } & .cm-ind { background: #FFFFFF; } & button { color: #9CA3AF; } & button[aria-checked='true'] { color: #111318; }` },
    separado: { nombre: 'Opciones separadas', descripcion: 'Cada opción es una pastilla; la elegida se pinta', css: `& { background: transparent; gap: 8px; padding: 0; } & .cm-ind { display: none; } & button { border: 1.5px solid var(--color-borde); } & button[aria-checked='true'] { background: var(--color-acento); border-color: var(--color-acento); color: var(--color-sobre-acento); }` },
    ios: { nombre: 'Segmentado de sistema', descripcion: 'Como los controles de iOS', css: `&, & button { border-radius: 9px; } & .cm-ind { border-radius: 7px; top: 2px; bottom: 2px; left: 2px; width: calc((100% - 4px) / var(--n)); box-shadow: 0 3px 8px rgba(0,0,0,.12), 0 1px 1px rgba(0,0,0,.08); } & { padding: 2px; background: color-mix(in srgb, var(--color-texto) 9%, var(--color-fondo)); } & button { min-height: 32px; font-size: 13px; }` },
    editorial: { nombre: 'Editorial', descripcion: 'Mayúsculas finas con barra', css: `& { background: transparent; padding: 0; border-radius: 0; } & .cm-ind { display: none; } & button { border-radius: 0; text-transform: uppercase; letter-spacing: 0.14em; font-size: 12px; } & button + button { border-left: 1px solid var(--color-borde); } & button[aria-checked='true'] { color: var(--color-acento-texto); text-decoration: underline; text-underline-offset: 6px; }` },
  },
  Muestra: MuestraSelector,
};
