// Navegación: barras inferiores para celular y navegación web (superior y lateral), con su animación al cambiar.

import { useState, type CSSProperties } from 'react';
import type { Categoria } from './base';
import { Icono } from './iconos';

const ITEMS_MOVIL = [
  { id: 'inicio', nombre: 'Inicio' },
  { id: 'buscar', nombre: 'Buscar' },
  { id: 'mas', nombre: 'Crear' },
  { id: 'corazon', nombre: 'Favoritos' },
  { id: 'perfil', nombre: 'Perfil' },
];

function MuestraNavMovil({ clase, id }: { clase: string; id: string }) {
  const [activo, setActivo] = useState(0);
  return (
    <div className="cm-marco-movil">
      <div className="cm-pantalla" aria-hidden="true">
        <span className="cm-esq" style={{ width: '58%' }} />
        <span className="cm-esq" style={{ width: '82%' }} />
        <span className="cm-esq cm-esq-alta" />
      </div>
      <nav className={clase} style={{ '--i': activo, '--n': ITEMS_MOVIL.length } as CSSProperties} aria-label={`Barra inferior de ejemplo: ${NAV_MOVIL.disenos[id]?.nombre ?? id}`}>
        <span className="cm-ind" aria-hidden="true" />
        {ITEMS_MOVIL.map((it, i) => (
          <button key={it.id} type="button" className="cm-item" aria-current={i === activo ? 'page' : undefined} onClick={() => setActivo(i)}>
            <span className="cm-ico">
              <Icono nombre={it.id} />
            </span>
            <span className="cm-lbl">{it.nombre}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

const centro = '& .cm-item:nth-of-type(3)';

export const NAV_MOVIL: Categoria = {
  id: 'nav_movil',
  nombre: 'Barras inferiores (celular)',
  singular: 'barra inferior',
  descripcion: 'Tocá las pestañas: cada barra tiene su forma de marcar la activa.',
  estructura:
    '<nav class="cm-nav_movil cm-nav_movil-DISEÑO" style="--i: 0; --n: 5"><span class="cm-ind"></span><button class="cm-item" aria-current="page"><span class="cm-ico">(icono)</span><span class="cm-lbl">Inicio</span></button>…</nav> — --i es el índice de la pestaña activa y --n la cantidad.',
  anchoCelda: 300,
  base: `& { position: relative; display: grid; grid-template-columns: repeat(var(--n), minmax(0, 1fr)); align-items: center; padding: 6px 4px calc(6px + env(safe-area-inset-bottom, 0px)); background: var(--color-superficie); border-top: 1px solid var(--color-borde); font-family: var(--fuente-texto); }
& .cm-ind { display: none; }
& .cm-item { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; min-height: 52px; padding: 4px 0; border: none; background: none; cursor: pointer; color: var(--color-texto-suave); font: inherit; font-size: 11px; font-weight: 600;
  transition: color var(--duracion-rapida) ease, transform var(--duracion-media) var(--curva-entrada); }
& .cm-ico { display: inline-flex; transition: transform var(--duracion-media) var(--curva-entrada), color var(--duracion-rapida) ease, background-color var(--duracion-media) ease; }
& .cm-item[aria-current] { color: var(--color-texto); }
& .cm-item[aria-current] .cm-ico { color: var(--color-acento-texto); }
& .cm-item:focus-visible { outline: 2px solid var(--color-acento); outline-offset: -2px; border-radius: 10px; }
@media (prefers-reduced-motion: reduce) { & *, & { transition: none !important; animation: none !important; } }`,
  disenos: {
    clasica: { nombre: 'Clásica', descripcion: 'Icono y texto; la activa toma color', css: '' },
    indicador: {
      nombre: 'Indicador que se desliza', descripcion: 'Una línea arriba viaja hasta la pestaña activa',
      css: `& .cm-ind { display: block; position: absolute; top: 0; left: 4px; width: calc((100% - 8px) / var(--n)); height: 3px; border-radius: 0 0 3px 3px; background: var(--color-acento); transform: translateX(calc(var(--i) * 100%)); transition: transform var(--duracion-lenta) var(--curva-entrada); }`,
    },
    pildora: {
      nombre: 'Píldora', descripcion: 'Una píldora de color detrás del icono activo',
      css: `& .cm-ico { padding: 4px 18px; border-radius: 999px; }
& .cm-item[aria-current] .cm-ico { background: color-mix(in srgb, var(--color-acento) 20%, transparent); color: var(--color-texto); }`,
    },
    expandible: {
      nombre: 'Se expande', descripcion: 'Solo la activa muestra el texto, en una píldora',
      css: `& { display: flex; gap: 4px; padding: 8px; }
& .cm-item { flex: 1; flex-direction: row; gap: 6px; min-height: 44px; border-radius: 999px; transition: flex var(--duracion-lenta) var(--curva-entrada), background-color var(--duracion-media) ease, color var(--duracion-rapida) ease; }
& .cm-lbl { max-width: 0; overflow: hidden; white-space: nowrap; transition: max-width var(--duracion-lenta) var(--curva-entrada); font-size: 13px; }
& .cm-item[aria-current] { flex: 2.4; background: var(--color-acento); color: var(--color-sobre-acento); }
& .cm-item[aria-current] .cm-ico { color: var(--color-sobre-acento); }
& .cm-item[aria-current] .cm-lbl { max-width: 90px; }`,
    },
    flotante: {
      nombre: 'Flotante', descripcion: 'Despegada del borde, redondeada y con sombra',
      css: `& { margin: 0 10px 10px; border: 1px solid var(--color-borde); border-radius: 22px; background: var(--color-superficie-alta); box-shadow: 0 10px 28px rgba(0,0,0,.18); }`,
    },
    central: {
      nombre: 'Botón central', descripcion: 'El del medio es un botón grande que sobresale',
      css: `${centro} .cm-ico { width: 52px; height: 52px; margin-top: -26px; border-radius: 50%; display: grid; place-items: center; background: var(--color-acento); color: var(--color-sobre-acento); box-shadow: 0 6px 16px color-mix(in srgb, var(--color-acento) 45%, transparent); }
${centro}[aria-current] .cm-ico { color: var(--color-sobre-acento); transform: rotate(90deg); }
${centro} .cm-lbl { margin-top: 2px; }`,
    },
    burbuja: {
      nombre: 'Burbuja', descripcion: 'El icono activo sube dentro de un círculo',
      css: `& { padding-top: 14px; }
& .cm-ico { width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center; transition: transform 460ms cubic-bezier(.3,1.5,.5,1), background-color var(--duracion-media) ease; }
& .cm-item[aria-current] .cm-ico { transform: translateY(-18px); background: var(--color-acento); color: var(--color-sobre-acento); box-shadow: 0 0 0 5px var(--color-superficie); }
& .cm-item[aria-current] .cm-lbl { transform: translateY(-14px); }
& .cm-lbl { transition: transform 460ms cubic-bezier(.3,1.5,.5,1); }`,
    },
    puntos: {
      nombre: 'Solo iconos', descripcion: 'Sin texto; un punto marca la activa',
      css: `& .cm-lbl { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
& .cm-item::after { content: ''; width: 5px; height: 5px; margin-top: 4px; border-radius: 50%; background: var(--color-acento); transform: scale(0); transition: transform var(--duracion-media) var(--curva-entrada); }
& .cm-item[aria-current]::after { transform: scale(1); }`,
    },
    vidrio: {
      nombre: 'Vidrio', descripcion: 'Translúcida, flotando sobre el contenido',
      css: `& { margin: 0 12px 12px; border-radius: 24px; border: 1px solid color-mix(in srgb, var(--color-texto) 16%, transparent); background: color-mix(in srgb, var(--color-superficie) 55%, transparent); backdrop-filter: blur(16px) saturate(1.3); -webkit-backdrop-filter: blur(16px) saturate(1.3); }`,
    },
    neobrutal: {
      nombre: 'Neobrutal', descripcion: 'Bordes negros; la activa se rellena',
      css: `& { gap: 6px; padding: 8px; border-top: 2px solid var(--color-texto); background: var(--color-fondo); }
& .cm-item { border: 2px solid transparent; }
& .cm-item[aria-current] { background: var(--color-acento); color: var(--color-sobre-acento); border-color: var(--color-texto); box-shadow: 3px 3px 0 var(--color-texto); }
& .cm-item[aria-current] .cm-ico { color: var(--color-sobre-acento); }`,
    },
    gota: {
      nombre: 'Gota que se mueve', descripcion: 'Una gota de color viaja bajo la pestaña activa',
      css: `& .cm-ind { display: block; position: absolute; bottom: 4px; left: 4px; width: calc((100% - 8px) / var(--n)); height: 6px; transform: translateX(calc(var(--i) * 100%)); transition: transform 520ms cubic-bezier(.5,1.6,.4,1); }
& .cm-ind::before { content: ''; display: block; width: 6px; height: 6px; margin: 0 auto; border-radius: 50%; background: var(--color-acento); }
& .cm-item[aria-current] .cm-ico { transform: translateY(-3px); }`,
    },
    muesca: {
      nombre: 'Muesca', descripcion: 'La barra se curva bajo un círculo que se mueve',
      css: `& { margin-top: 26px; background: transparent; border-top: none; }
& .cm-ind { display: block; position: absolute; inset: 0; z-index: 0; background: var(--color-superficie); border-top: 1px solid var(--color-borde); -webkit-mask: radial-gradient(circle 32px at calc((100% - 8px) / var(--n) * (var(--i) + 0.5) + 4px) 0, transparent 98%, #000); mask: radial-gradient(circle 32px at calc((100% - 8px) / var(--n) * (var(--i) + 0.5) + 4px) 0, transparent 98%, #000); }
& .cm-item[aria-current] .cm-ico { width: 48px; height: 48px; display: grid; place-items: center; border-radius: 50%; background: var(--color-acento); color: var(--color-sobre-acento); transform: translateY(-26px); }
& .cm-item[aria-current] .cm-lbl { transform: translateY(-20px); }
& .cm-ico, & .cm-lbl { transition: transform 420ms cubic-bezier(.3,1.5,.5,1); }`,
    },
    linea_abajo: {
      nombre: 'Línea abajo', descripcion: 'Una línea debajo del icono activo que se desliza',
      css: `& .cm-ind { display: block; position: absolute; bottom: 2px; left: calc(4px + (100% - 8px) / var(--n) * 0.3); width: calc((100% - 8px) / var(--n) * 0.4); height: 3px; border-radius: 3px; background: var(--color-texto); transform: translateX(calc(var(--i) * 250%)); transition: transform var(--duracion-lenta) var(--curva-entrada); }`,
    },
    fondo_desliza: {
      nombre: 'Fondo que se desliza', descripcion: 'Un bloque de color se mueve detrás de la activa',
      css: `& .cm-ind { display: block; position: absolute; top: 6px; bottom: 6px; left: 4px; width: calc((100% - 8px) / var(--n)); border-radius: 14px; background: color-mix(in srgb, var(--color-acento) 18%, transparent); transform: translateX(calc(var(--i) * 100%)); transition: transform var(--duracion-lenta) var(--curva-entrada); }`,
    },
    rellena: {
      nombre: 'Se rellena', descripcion: 'El icono activo se pinta por dentro',
      css: `& .cm-item[aria-current] svg { fill: currentColor; fill-opacity: 0.25; }
& .cm-item[aria-current] .cm-ico { transform: scale(1.12); }`,
    },
    oscura: {
      nombre: 'Oscura', descripcion: 'Barra oscura con la activa encendida',
      css: `& { background: #111318; border-top-color: #111318; }
& .cm-item { color: #8A8F99; }
& .cm-item[aria-current] { color: #FFFFFF; }
& .cm-item[aria-current] .cm-ico { color: #FFFFFF; filter: drop-shadow(0 0 6px var(--color-acento)); }`,
    },
    rebote: {
      nombre: 'Rebota al tocar', descripcion: 'El icono salta cuando lo elegís',
      css: `& .cm-item[aria-current] .cm-ico { animation: cm-nav-salto 520ms cubic-bezier(.3,1.6,.5,1); }
@keyframes cm-nav-salto { 0% { transform: translateY(0); } 40% { transform: translateY(-9px) scale(1.1); } 100% { transform: translateY(0); } }`,
    },
    giro: {
      nombre: 'Gira', descripcion: 'El icono da una vuelta al elegirlo',
      css: `& .cm-item[aria-current] .cm-ico { animation: cm-nav-giro 560ms var(--curva-entrada); }
@keyframes cm-nav-giro { from { transform: rotate(-360deg) scale(.6); } to { transform: rotate(0) scale(1); } }`,
    },
  },
  Muestra: MuestraNavMovil,
};

const ITEMS_WEB = [
  { id: 'inicio', nombre: 'Inicio' },
  { id: 'grafico', nombre: 'Métricas' },
  { id: 'perfil', nombre: 'Clientes' },
  { id: 'ajustes', nombre: 'Ajustes' },
];

function MuestraNavWeb({ clase, id }: { clase: string; id: string }) {
  const [activo, setActivo] = useState(0);
  return (
    <div className={`cm-marco-web ${/lateral/.test(clase) ? 'es-lateral' : ''}`}>
      <nav className={clase} style={{ '--i': activo, '--n': ITEMS_WEB.length } as CSSProperties} aria-label={`Navegación de ejemplo: ${NAV_WEB.disenos[id]?.nombre ?? id}`}>
        <span className="cm-marca">Marca</span>
        <div className="cm-items">
          <span className="cm-ind" aria-hidden="true" />
          {ITEMS_WEB.map((it, i) => (
            <button key={it.id} type="button" className="cm-item" aria-current={i === activo ? 'page' : undefined} onClick={() => setActivo(i)}>
              <span className="cm-ico">
                <Icono nombre={it.id} tamano={18} />
              </span>
              <span className="cm-lbl">{it.nombre}</span>
            </button>
          ))}
        </div>
      </nav>
      <div className="cm-cuerpo" aria-hidden="true">
        <span className="cm-esq" style={{ width: '60%' }} />
        <span className="cm-esq" style={{ width: '40%' }} />
        <span className="cm-esq cm-esq-alta" />
      </div>
    </div>
  );
}

export const NAV_WEB: Categoria = {
  id: 'nav_web',
  nombre: 'Navegación web',
  singular: 'navegación web',
  descripcion: 'Tocá las secciones: superiores, flotantes y laterales.',
  estructura:
    '<nav class="cm-nav_web cm-nav_web-DISEÑO" style="--i: 0; --n: 4"><span class="cm-marca">Marca</span><div class="cm-items"><span class="cm-ind"></span><button class="cm-item" aria-current="page"><span class="cm-ico">(icono)</span><span class="cm-lbl">Inicio</span></button>…</div></nav>',
  anchoCelda: 380,
  base: `& { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 10px 16px; background: var(--color-superficie); border-bottom: 1px solid var(--color-borde); font-family: var(--fuente-texto); color: var(--color-texto); }
& .cm-marca { font-family: var(--fuente-titulos); font-weight: var(--titulos-peso); font-size: 16px; }
& .cm-items { position: relative; display: grid; grid-template-columns: repeat(var(--n), minmax(0, 1fr)); gap: 0; }
& .cm-ind { display: none; }
& .cm-item { position: relative; z-index: 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-height: 40px; padding: 0 12px; border: none; background: none; cursor: pointer; color: var(--color-texto-suave); font: inherit; font-size: 14px; font-weight: 600; white-space: nowrap; transition: color var(--duracion-rapida) ease; }
& .cm-ico { display: none; }
& .cm-item[aria-current] { color: var(--color-texto); }
& .cm-item:focus-visible { outline: 2px solid var(--color-acento); outline-offset: -2px; border-radius: 8px; }
@media (prefers-reduced-motion: reduce) { & *, & { transition: none !important; } }`,
  disenos: {
    clasica: { nombre: 'Clásica', descripcion: 'Links; el activo en negrita', css: `& .cm-item[aria-current] { font-weight: 800; }` },
    subrayado: {
      nombre: 'Subrayado que se desliza', descripcion: 'Una línea viaja bajo la sección activa',
      css: `& .cm-ind { display: block; position: absolute; bottom: -10px; left: 0; width: calc(100% / var(--n)); height: 2px; background: var(--color-acento); transform: translateX(calc(var(--i) * 100%)); transition: transform var(--duracion-lenta) var(--curva-entrada); }`,
    },
    pastilla: {
      nombre: 'Pastilla', descripcion: 'Un fondo de color se mueve detrás del activo',
      css: `& .cm-ind { display: block; position: absolute; inset: 0 auto 0 0; width: calc(100% / var(--n)); border-radius: 999px; background: color-mix(in srgb, var(--color-acento) 18%, transparent); transform: translateX(calc(var(--i) * 100%)); transition: transform var(--duracion-lenta) var(--curva-entrada); }`,
    },
    segmentada: {
      nombre: 'Segmentada', descripcion: 'Como un selector con la opción activa resaltada',
      css: `& .cm-items { padding: 4px; border-radius: 12px; background: var(--color-fondo); border: 1px solid var(--color-borde); }
& .cm-ind { display: block; position: absolute; top: 4px; bottom: 4px; left: 4px; width: calc((100% - 8px) / var(--n)); border-radius: 9px; background: var(--color-superficie-alta); box-shadow: 0 1px 4px rgba(0,0,0,.14); transform: translateX(calc(var(--i) * 100%)); transition: transform var(--duracion-lenta) var(--curva-entrada); }`,
    },
    flotante: {
      nombre: 'Flotante', descripcion: 'Una barra redondeada que flota arriba',
      css: `& { margin: 10px 12px 0; border: 1px solid var(--color-borde); border-radius: 999px; box-shadow: 0 8px 24px rgba(0,0,0,.14); background: var(--color-superficie-alta); }
& .cm-item[aria-current] { color: var(--color-acento-texto); }`,
    },
    vidrio: {
      nombre: 'Vidrio', descripcion: 'Translúcida sobre el contenido',
      css: `& { position: absolute; left: 10px; right: 10px; top: 10px; border-radius: 16px; border: 1px solid color-mix(in srgb, var(--color-texto) 14%, transparent); background: color-mix(in srgb, var(--color-superficie) 50%, transparent); backdrop-filter: blur(14px) saturate(1.3); -webkit-backdrop-filter: blur(14px) saturate(1.3); }`,
    },
    neobrutal: {
      nombre: 'Neobrutal', descripcion: 'Bordes negros; el activo se rellena',
      css: `& { border-bottom: 2px solid var(--color-texto); background: var(--color-fondo); }
& .cm-items { gap: 6px; }
& .cm-item { border: 2px solid transparent; }
& .cm-item[aria-current] { background: var(--color-acento); color: var(--color-sobre-acento); border-color: var(--color-texto); box-shadow: 3px 3px 0 var(--color-texto); }`,
    },
    lateral: {
      nombre: 'Menú lateral', descripcion: 'A la izquierda, con indicador que baja',
      css: `& { flex-direction: column; align-items: stretch; justify-content: flex-start; width: 170px; padding: 14px 10px; border-bottom: none; border-right: 1px solid var(--color-borde); }
& .cm-marca { padding: 0 10px 8px; }
& .cm-items { grid-template-columns: minmax(0, 1fr); grid-auto-rows: 42px; }
& .cm-item { justify-content: flex-start; border-radius: 8px; }
& .cm-ico { display: inline-flex; }
& .cm-item[aria-current] { background: color-mix(in srgb, var(--color-acento) 14%, transparent); color: var(--color-texto); }
& .cm-ind { display: block; position: absolute; left: -10px; top: 0; width: 3px; height: 42px; border-radius: 0 3px 3px 0; background: var(--color-acento); transform: translateY(calc(var(--i) * 42px)); transition: transform var(--duracion-lenta) var(--curva-entrada); }`,
    },
    lateral_compacta: {
      nombre: 'Lateral que se abre', descripcion: 'Solo iconos; al pasar el mouse muestra el texto',
      css: `& { flex-direction: column; align-items: stretch; justify-content: flex-start; width: 60px; padding: 14px 8px; border-bottom: none; border-right: 1px solid var(--color-borde); overflow: hidden; transition: width var(--duracion-lenta) var(--curva-entrada); }
&:hover, &:focus-within { width: 170px; }
& .cm-marca { padding: 0 6px 8px; white-space: nowrap; overflow: hidden; opacity: 0; transition: opacity var(--duracion-media) ease; }
&:hover .cm-marca, &:focus-within .cm-marca { opacity: 1; }
& .cm-items { grid-template-columns: minmax(0, 1fr); grid-auto-rows: 42px; }
& .cm-item { justify-content: flex-start; padding: 0 12px; border-radius: 10px; }
& .cm-ico { display: inline-flex; flex-shrink: 0; }
& .cm-lbl { opacity: 0; transition: opacity var(--duracion-media) ease; }
&:hover .cm-lbl, &:focus-within .cm-lbl { opacity: 1; }
& .cm-item[aria-current] { background: var(--color-acento); color: var(--color-sobre-acento); }`,
    },
    crece: {
      nombre: 'Subrayado que crece', descripcion: 'Al pasar, una línea crece desde el centro; la activa queda',
      css: `& .cm-item::after { content: ''; position: absolute; left: 12px; right: 12px; bottom: 4px; height: 2px; background: var(--color-acento); transform: scaleX(0); transition: transform var(--duracion-media) var(--curva-entrada); }
& .cm-item:hover::after, & .cm-item[aria-current]::after { transform: scaleX(1); }`,
    },
    punto: {
      nombre: 'Punto', descripcion: 'Un punto se desliza bajo la sección activa',
      css: `& .cm-ind { display: block; position: absolute; bottom: -6px; left: 0; width: calc(100% / var(--n)); height: 6px; transform: translateX(calc(var(--i) * 100%)); transition: transform var(--duracion-lenta) var(--curva-entrada); }
& .cm-ind::before { content: ''; display: block; width: 6px; height: 6px; margin: 0 auto; border-radius: 50%; background: var(--color-acento); }`,
    },
    contorno: {
      nombre: 'Contorno', descripcion: 'La sección activa queda dentro de una línea',
      css: `& .cm-ind { display: block; position: absolute; inset: 0 auto 0 0; width: calc(100% / var(--n)); border: 1.5px solid var(--color-texto); border-radius: 999px; transform: translateX(calc(var(--i) * 100%)); transition: transform var(--duracion-lenta) var(--curva-entrada); }`,
    },
    editorial: {
      nombre: 'Editorial', descripcion: 'Mayúsculas espaciadas con barras',
      css: `& .cm-item { text-transform: uppercase; letter-spacing: 0.14em; font-size: 12px; }
& .cm-item + .cm-item::before { content: '/'; position: absolute; left: -3px; color: var(--color-borde); }
& .cm-item[aria-current] { color: var(--color-acento-texto); }
& .cm-marca { font-style: italic; }`,
    },
    oscura: {
      nombre: 'Oscura', descripcion: 'Barra oscura con texto claro',
      css: `& { background: #111318; border-bottom-color: #111318; color: #FFFFFF; }
& .cm-item { color: #9CA3AF; }
& .cm-item[aria-current] { color: #FFFFFF; }
& .cm-ind { display: block; position: absolute; bottom: -10px; left: 0; width: calc(100% / var(--n)); height: 2px; background: var(--color-acento); transform: translateX(calc(var(--i) * 100%)); transition: transform var(--duracion-lenta) var(--curva-entrada); }`,
    },
    carpeta: {
      nombre: 'Pestañas de carpeta', descripcion: 'La activa se une con el contenido de abajo',
      css: `& { padding-bottom: 0; align-items: flex-end; background: var(--color-superficie); }
& .cm-items { gap: 4px; }
& .cm-item { border-radius: 10px 10px 0 0; background: color-mix(in srgb, var(--color-texto) 6%, transparent); margin-bottom: -1px; border: 1px solid transparent; }
& .cm-item[aria-current] { background: var(--color-fondo); border-color: var(--color-borde); border-bottom-color: var(--color-fondo); }`,
    },
    resaltador: {
      nombre: 'Resaltador', descripcion: 'Un trazo de marcador detrás de la activa',
      css: `& .cm-ind { display: block; position: absolute; top: 50%; left: 0; width: calc(100% / var(--n)); height: 16px; transform: translate(calc(var(--i) * 100%), -30%) skewX(-12deg) rotate(-2deg); background: color-mix(in srgb, var(--color-acento) 40%, transparent); border-radius: 3px; transition: transform var(--duracion-lenta) var(--curva-entrada); }`,
    },
    lateral_oscura: {
      nombre: 'Lateral oscura', descripcion: 'Menú lateral oscuro con la activa encendida',
      css: `& { flex-direction: column; align-items: stretch; justify-content: flex-start; width: 170px; min-height: max-content; padding: 14px 10px; border-bottom: none; background: #111318; color: #FFFFFF; }
& .cm-marca { padding: 0 10px 8px; }
& .cm-items { grid-template-columns: minmax(0, 1fr); grid-auto-rows: 42px; }
& .cm-item { justify-content: flex-start; border-radius: 8px; color: #9CA3AF; }
& .cm-ico { display: inline-flex; }
& .cm-item[aria-current] { color: #FFFFFF; }
& .cm-ind { display: block; position: absolute; left: 0; right: 0; top: 0; height: 42px; border-radius: 8px; background: rgba(255,255,255,.1); box-shadow: inset 3px 0 0 var(--color-acento); transform: translateY(calc(var(--i) * 42px)); transition: transform var(--duracion-lenta) var(--curva-entrada); }`,
    },
  },
  Muestra: MuestraNavWeb,
};
