// Más componentes: menús desplegables, buscadores, paginación, migas de pan, pasos y pantallas vacías.
// Mismo esquema que el resto de la galería: estructura fija + diseños en CSS con tokens.

import { useId, useState, type CSSProperties } from 'react';
import type { Categoria } from './base';

const chevron = (
  <svg className="cm-chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 9l6 6 6-6" />
  </svg>
);
const lupa = (
  <svg className="cm-b-ico" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-4.3-4.3" />
  </svg>
);
const reducirMov = '@media (prefers-reduced-motion: reduce) { &, & * { animation: none !important; transition: none !important; } }';

// ---------- Menú desplegable ----------

const OPCIONES_D = ['Más nuevos', 'Más vendidos', 'Precio: menor a mayor', 'Precio: mayor a menor'];

function MuestraDesplegable({ clase }: { clase: string; id: string }) {
  const [abierto, setAbierto] = useState(true);
  const [elegida, setElegida] = useState(0);
  const lista = useId();
  return (
    <div className="cm-lugar-desplegable">
      <div className={clase} data-abierto={abierto || undefined}>
        <button type="button" className="cm-d-boton" aria-haspopup="listbox" aria-expanded={abierto} aria-controls={lista} onClick={() => setAbierto(!abierto)}>
          <span className="cm-d-etq">Ordenar:</span> {OPCIONES_D[elegida]}
          {chevron}
        </button>
        {abierto && (
          <ul className="cm-d-lista" id={lista} role="listbox" aria-label="Ordenar">
            {OPCIONES_D.map((o, i) => (
              <li key={o} role="option" aria-selected={i === elegida} tabIndex={0} onClick={() => setElegida(i)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setElegida(i)}>
                {o}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export const DESPLEGABLES: Categoria = {
  id: 'desplegable',
  nombre: 'Menús desplegables',
  singular: 'menú desplegable',
  descripcion: 'Para elegir una opción de una lista: ordenar, filtrar, cambiar de cuenta. Tocá el botón para abrir y cerrar.',
  estructura:
    '<div class="cm-desplegable cm-desplegable-DISEÑO" data-abierto><button class="cm-d-boton" aria-haspopup="listbox" aria-expanded="true">Más nuevos <svg class="cm-chev">…</svg></button><ul class="cm-d-lista" role="listbox"><li role="option" aria-selected="true">Más nuevos</li>…</ul></div> — data-abierto mientras la lista está abierta.',
  anchoCelda: 280,
  base: `& { position: relative; display: inline-block; font-family: var(--fuente-texto); font-size: 14px; }
& .cm-d-boton { display: inline-flex; align-items: center; gap: 6px; min-height: 44px; padding: 0 14px; border: 1px solid var(--color-borde); border-radius: var(--radio-medio); background: var(--color-fondo); color: var(--color-texto); font: inherit; font-weight: 600; cursor: pointer; }
& .cm-d-etq { color: var(--color-texto-suave); font-weight: 500; }
& .cm-chev { transition: transform var(--duracion-media) var(--curva-entrada); }
&[data-abierto] .cm-chev { transform: rotate(180deg); }
& .cm-d-boton:focus-visible, & li:focus-visible { outline: 2px solid var(--color-acento); outline-offset: 2px; }
& .cm-d-lista { position: absolute; z-index: 5; top: calc(100% + 6px); left: 0; min-width: 100%; margin: 0; padding: 6px; list-style: none; border-radius: var(--radio-medio); background: var(--color-superficie-alta, var(--color-fondo)); border: 1px solid var(--color-borde); box-shadow: 0 12px 32px rgba(0,0,0,.14); animation: cm-d-entra var(--duracion-media) var(--curva-entrada) both; transform-origin: top left; }
& li { display: flex; align-items: center; min-height: 40px; padding: 0 12px; border-radius: calc(var(--radio-medio) * .6); color: var(--color-texto); white-space: nowrap; cursor: pointer; }
& li:hover { background: var(--color-superficie); }
& li[aria-selected='true'] { font-weight: 700; }
@keyframes cm-d-entra { from { opacity: 0; transform: translateY(-6px); } }
${reducirMov}`,
  disenos: {
    clasico: { nombre: 'Clásico', descripcion: 'Lista flotante con sombra suave', css: '' },
    tilde: { nombre: 'Con tilde', descripcion: 'La elegida lleva una tilde a la izquierda', css: `& li { padding-left: 34px; position: relative; } & li[aria-selected='true']::before { content: '✓'; position: absolute; left: 12px; color: var(--color-acento-texto); font-weight: 700; }` },
    acento: { nombre: 'Elegida de color', descripcion: 'La opción elegida se pinta con el acento', css: `& li[aria-selected='true'] { background: var(--color-acento); color: var(--color-sobre-acento); }` },
    contorno: { nombre: 'Contorno', descripcion: 'Sin sombra, solo líneas finas', css: `& .cm-d-lista { box-shadow: none; border-width: 1.5px; } & li + li { border-top: 1px solid var(--color-borde); border-radius: 0; }` },
    pildora: { nombre: 'Píldora', descripcion: 'Botón redondo y lista con esquinas grandes', css: `& .cm-d-boton { border-radius: 999px; padding: 0 18px; background: var(--color-superficie); border-color: transparent; } & .cm-d-lista { border-radius: 20px; } & li { border-radius: 999px; }` },
    escala: { nombre: 'Crece desde el botón', descripcion: 'La lista aparece creciendo, con rebote', css: `& .cm-d-lista { animation: cm-d-escala var(--duracion-lenta) cubic-bezier(.3,1.5,.5,1) both; } @keyframes cm-d-escala { from { opacity: 0; transform: scale(.85); } }` },
    oscuro: { nombre: 'Oscuro', descripcion: 'Lista oscura sobre cualquier fondo', css: `& .cm-d-lista { background: #15171C; border-color: #2A2D35; } & li { color: #E8E9EC; } & li:hover { background: #23262E; } & li[aria-selected='true'] { color: #FFFFFF; }` },
    vidrio: { nombre: 'Vidrio', descripcion: 'Translúcida con desenfoque', css: `& .cm-d-lista { background: color-mix(in srgb, var(--color-fondo) 70%, transparent); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-color: color-mix(in srgb, var(--color-texto) 14%, transparent); }` },
    neobrutal: { nombre: 'Neobrutal', descripcion: 'Bordes negros y sombra dura', css: `& .cm-d-boton, & .cm-d-lista { border: 2px solid var(--color-texto); border-radius: 0; box-shadow: 4px 4px 0 var(--color-texto); } & li { border-radius: 0; } & li[aria-selected='true'] { background: var(--color-acento); color: var(--color-sobre-acento); }` },
  },
  Muestra: MuestraDesplegable,
};

// ---------- Buscador ----------

const SUGERENCIAS = ['Zapatillas urbanas', 'Zapatillas de running', 'Zapatos de cuero', 'Ojotas'];

function MuestraBuscador({ clase }: { clase: string; id: string }) {
  const [texto, setTexto] = useState('Zap');
  const id = useId();
  const visibles = SUGERENCIAS.filter((s) => s.toLowerCase().includes(texto.trim().toLowerCase()));
  return (
    <div className="cm-lugar-desplegable">
      <div className={clase}>
        <label className="cm-b-caja">
          {lupa}
          <span className="solo-lectores">Buscar</span>
          <input type="search" value={texto} placeholder="Buscar…" onChange={(e) => setTexto(e.target.value)} aria-controls={id} aria-autocomplete="list" />
          <kbd className="cm-b-atajo">⌘K</kbd>
        </label>
        {texto && visibles.length > 0 && (
          <ul className="cm-b-sugerencias" id={id} role="listbox" aria-label="Sugerencias">
            <li className="cm-b-titulo" role="presentation">
              Sugerencias
            </li>
            {visibles.map((s, i) => (
              <li key={s} role="option" aria-selected={i === 0}>
                {lupa}
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export const BUSCADORES: Categoria = {
  id: 'buscador',
  nombre: 'Buscadores',
  singular: 'buscador',
  descripcion: 'Un campo para buscar con sugerencias mientras escribís. Probá borrar y escribir otra cosa.',
  estructura:
    '<div class="cm-buscador cm-buscador-DISEÑO"><label class="cm-b-caja"><svg class="cm-b-ico">…</svg><input type="search" aria-autocomplete="list"><kbd class="cm-b-atajo">⌘K</kbd></label><ul class="cm-b-sugerencias" role="listbox"><li class="cm-b-titulo">Sugerencias</li><li role="option" aria-selected="true"><svg class="cm-b-ico">…</svg>Zapatillas urbanas</li>…</ul></div>',
  anchoCelda: 300,
  base: `& { position: relative; width: 100%; max-width: 340px; font-family: var(--fuente-texto); font-size: 14px; }
& .cm-b-caja { display: flex; align-items: center; gap: 8px; min-height: 46px; padding: 0 12px; border: 1px solid var(--color-borde); border-radius: var(--radio-medio); background: var(--color-fondo); color: var(--color-texto-suave); cursor: text; transition: border-color var(--duracion-media) ease, box-shadow var(--duracion-media) ease; }
& .cm-b-caja:focus-within { border-color: var(--color-acento); box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-acento) 22%, transparent); }
& input { flex: 1; min-width: 0; height: 44px; border: none; outline: none; background: transparent; color: var(--color-texto); font: inherit; }
& input::-webkit-search-cancel-button { display: none; }
& .cm-b-atajo { padding: 2px 6px; border-radius: 6px; border: 1px solid var(--color-borde); font: 600 11px/1.4 var(--fuente-texto); color: var(--color-texto-suave); }
& .cm-b-sugerencias { position: absolute; z-index: 5; top: calc(100% + 6px); left: 0; right: 0; margin: 0; padding: 6px; list-style: none; border-radius: var(--radio-medio); background: var(--color-superficie-alta, var(--color-fondo)); border: 1px solid var(--color-borde); box-shadow: 0 12px 32px rgba(0,0,0,.14); animation: cm-d-entra var(--duracion-media) var(--curva-entrada) both; }
& .cm-b-titulo { padding: 6px 10px 4px; font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--color-texto-suave); }
& li[role='option'] { display: flex; align-items: center; gap: 10px; min-height: 40px; padding: 0 10px; border-radius: calc(var(--radio-medio) * .6); color: var(--color-texto); cursor: pointer; }
& li[role='option'] .cm-b-ico { color: var(--color-texto-suave); }
& li[role='option']:hover, & li[aria-selected='true'] { background: var(--color-superficie); }
@keyframes cm-d-entra { from { opacity: 0; transform: translateY(-6px); } }
${reducirMov}`,
  disenos: {
    simple: { nombre: 'Simple', descripcion: 'Caja con borde y lista flotante', css: '' },
    pildora: { nombre: 'Píldora', descripcion: 'Redondo y con fondo suave', css: `& .cm-b-caja { border-radius: 999px; border-color: transparent; background: var(--color-superficie); padding: 0 16px; } & .cm-b-sugerencias { border-radius: 18px; }` },
    comando: { nombre: 'Paleta de comandos', descripcion: 'Como el buscador de las apps de escritorio, con atajo', css: `& .cm-b-caja { border-radius: 12px 12px 0 0; border-bottom-color: transparent; box-shadow: 0 12px 32px rgba(0,0,0,.14); } & .cm-b-caja:focus-within { box-shadow: 0 12px 32px rgba(0,0,0,.14); border-color: var(--color-borde); border-bottom-color: transparent; } & .cm-b-sugerencias { top: 100%; border-radius: 0 0 12px 12px; border-top: 1px solid var(--color-borde); animation: none; } & li[aria-selected='true'] { box-shadow: inset 3px 0 0 var(--color-acento); }` },
    subrayado: { nombre: 'Subrayado', descripcion: 'Solo una línea abajo, muy limpio', css: `& .cm-b-caja { border: none; border-bottom: 2px solid var(--color-borde); border-radius: 0; padding: 0 2px; } & .cm-b-caja:focus-within { box-shadow: none; border-bottom-color: var(--color-acento); } & .cm-b-atajo { display: none; }` },
    grande: { nombre: 'Grande', descripcion: 'Protagonista, para la portada de un buscador', css: `& .cm-b-caja { min-height: 58px; padding: 0 18px; font-size: 17px; border-width: 2px; border-radius: 16px; } & input { height: 56px; } & .cm-b-ico { width: 22px; height: 22px; }` },
    acento: { nombre: 'Con botón de color', descripcion: 'La lupa va en un botón de acento a la derecha', css: `& .cm-b-caja { padding-right: 4px; } & .cm-b-caja > .cm-b-ico { order: 3; width: 38px; height: 38px; padding: 10px; border-radius: calc(var(--radio-medio) * .8); background: var(--color-acento); color: var(--color-sobre-acento); } & .cm-b-atajo { display: none; }` },
    vidrio: { nombre: 'Vidrio', descripcion: 'Translúcido con desenfoque', css: `& .cm-b-caja, & .cm-b-sugerencias { background: color-mix(in srgb, var(--color-fondo) 65%, transparent); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-color: color-mix(in srgb, var(--color-texto) 14%, transparent); }` },
    neobrutal: { nombre: 'Neobrutal', descripcion: 'Borde grueso y sombra dura', css: `& .cm-b-caja, & .cm-b-sugerencias { border: 2px solid var(--color-texto); border-radius: 0; box-shadow: 4px 4px 0 var(--color-texto); } & .cm-b-caja:focus-within { box-shadow: 4px 4px 0 var(--color-acento); border-color: var(--color-texto); } & li[role='option'] { border-radius: 0; }` },
  },
  Muestra: MuestraBuscador,
};

// ---------- Paginación ----------

function MuestraPaginacion({ clase, id }: { clase: string; id: string }) {
  const [p, setP] = useState(2);
  const total = 10;
  const numeros = [1, 2, 3, 4, '…', total] as const;
  return (
    <nav className={clase} aria-label={`Paginación de ejemplo: ${PAGINACION.disenos[id]?.nombre ?? id}`}>
      <button type="button" className="cm-p-flecha" aria-label="Página anterior" disabled={p === 1} onClick={() => setP(Math.max(1, p - 1))}>
        ‹<span className="cm-p-flecha-txt">Anterior</span>
      </button>
      <span className="cm-p-info">
        Página {p} de {total}
      </span>
      {numeros.map((n, i) =>
        n === '…' ? (
          <span key={i} className="cm-p-puntos" aria-hidden="true">
            …
          </span>
        ) : (
          <button key={n} type="button" className="cm-p-num" aria-current={p === n ? 'page' : undefined} aria-label={`Página ${n}`} onClick={() => setP(n)}>
            {n}
          </button>
        ),
      )}
      <button type="button" className="cm-p-flecha" aria-label="Página siguiente" disabled={p === total} onClick={() => setP(Math.min(total, p + 1))}>
        <span className="cm-p-flecha-txt">Siguiente</span>›
      </button>
    </nav>
  );
}

export const PAGINACION: Categoria = {
  id: 'paginacion',
  nombre: 'Paginación',
  singular: 'paginación',
  descripcion: 'Para pasar entre páginas de una lista larga. Tocá los números y las flechas.',
  estructura:
    '<nav class="cm-paginacion cm-paginacion-DISEÑO" aria-label="Paginación"><button class="cm-p-flecha" aria-label="Página anterior">‹<span class="cm-p-flecha-txt">Anterior</span></button><span class="cm-p-info">Página 2 de 10</span><button class="cm-p-num" aria-current="page">2</button>…<span class="cm-p-puntos">…</span><button class="cm-p-flecha">…›</button></nav> — .cm-p-info y .cm-p-flecha-txt se muestran o no según el diseño.',
  anchoCelda: 340,
  base: `& { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 4px; font-family: var(--fuente-texto); font-size: 14px; }
& button { display: inline-grid; place-items: center; min-width: 40px; height: 40px; padding: 0 10px; border: 1px solid transparent; border-radius: var(--radio-pequeno); background: transparent; color: var(--color-texto); font: inherit; font-weight: 600; cursor: pointer; transition: background var(--duracion-rapida) ease, color var(--duracion-rapida) ease; }
& button:hover:not(:disabled) { background: var(--color-superficie); }
& button:disabled { opacity: .4; cursor: default; }
& button:focus-visible { outline: 2px solid var(--color-acento); outline-offset: 2px; }
& .cm-p-num[aria-current] { background: var(--color-texto); color: var(--color-fondo); }
& .cm-p-flecha { font-size: 18px; }
& .cm-p-flecha-txt, & .cm-p-info { display: none; }
& .cm-p-puntos { min-width: 24px; text-align: center; color: var(--color-texto-suave); }
${reducirMov}`,
  disenos: {
    numeros: { nombre: 'Números', descripcion: 'Simple: la página actual resaltada', css: '' },
    acento: { nombre: 'Círculo de color', descripcion: 'La actual es un círculo del acento', css: `& button { border-radius: 999px; } & .cm-p-num[aria-current] { background: var(--color-acento); color: var(--color-sobre-acento); }` },
    cuadros: { nombre: 'Cuadros', descripcion: 'Cada número en su cuadro con borde', css: `& button { border-color: var(--color-borde); } & .cm-p-num[aria-current] { border-color: var(--color-texto); }` },
    grupo: { nombre: 'Grupo unido', descripcion: 'Todos pegados en una sola barra', css: `& { gap: 0; } & button, & .cm-p-puntos { height: 40px; border: 1px solid var(--color-borde); border-radius: 0; margin-left: -1px; display: inline-grid; place-items: center; } & > :first-child { border-radius: var(--radio-pequeno) 0 0 var(--radio-pequeno); } & > :last-child { border-radius: 0 var(--radio-pequeno) var(--radio-pequeno) 0; }` },
    subrayado: { nombre: 'Subrayado', descripcion: 'Una línea abajo marca la actual', css: `& .cm-p-num[aria-current] { background: transparent; color: var(--color-texto); border-radius: 0; box-shadow: inset 0 -2px 0 var(--color-acento); }` },
    texto: { nombre: 'Anterior y siguiente', descripcion: 'Solo «Anterior», «Página 2 de 10» y «Siguiente»', css: `& { justify-content: space-between; width: 100%; } & .cm-p-num, & .cm-p-puntos { display: none; } & .cm-p-info { display: inline; color: var(--color-texto-suave); } & .cm-p-flecha { gap: 6px; display: inline-flex; border-color: var(--color-borde); font-size: 14px; } & .cm-p-flecha-txt { display: inline; }` },
    puntos: { nombre: 'Puntos', descripcion: 'Puntitos en vez de números, para carruseles', css: `& { gap: 2px; } & .cm-p-num { min-width: 24px; width: 24px; padding: 0; font-size: 0; } & .cm-p-num::after { content: ''; width: 8px; height: 8px; border-radius: 999px; background: var(--color-borde); transition: width var(--duracion-media) var(--curva-entrada); } & .cm-p-num[aria-current] { background: transparent; width: 36px; } & .cm-p-num[aria-current]::after { width: 24px; background: var(--color-acento); } & .cm-p-puntos { display: none; }` },
    neobrutal: { nombre: 'Neobrutal', descripcion: 'Bordes negros y sombra dura', css: `& button { border: 2px solid var(--color-texto); border-radius: 0; box-shadow: 3px 3px 0 var(--color-texto); } & button:active { box-shadow: none; transform: translate(3px, 3px); } & .cm-p-num[aria-current] { background: var(--color-acento); color: var(--color-sobre-acento); }` },
  },
  Muestra: MuestraPaginacion,
};

// ---------- Migas de pan ----------

function MuestraMigas({ clase, id }: { clase: string; id: string }) {
  const migas = ['Inicio', 'Catálogo', 'Calzado'];
  return (
    <nav className={clase} aria-label={`Estás en (ejemplo: ${MIGAS.disenos[id]?.nombre ?? id})`}>
      <ol>
        {migas.map((m) => (
          <li key={m}>
            <a href="#" onClick={(e) => e.preventDefault()}>
              {m}
            </a>
          </li>
        ))}
        <li aria-current="page">Zapatillas urbanas</li>
      </ol>
    </nav>
  );
}

const separador = (contenido: string, extra = '') => `& li + li::before { content: '${contenido}'; ${extra} }`;

export const MIGAS: Categoria = {
  id: 'migas',
  nombre: 'Migas de pan',
  singular: 'migas de pan',
  descripcion: 'Muestran dónde estás y te dejan volver un nivel atrás. Van arriba del título.',
  estructura: '<nav class="cm-migas cm-migas-DISEÑO" aria-label="Estás en"><ol><li><a href="/">Inicio</a></li><li><a href="/catalogo">Catálogo</a></li><li aria-current="page">Zapatillas urbanas</li></ol></nav> — el separador lo pone el CSS.',
  anchoCelda: 340,
  base: `& { font-family: var(--fuente-texto); font-size: 14px; }
& ol { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; margin: 0; padding: 0; list-style: none; }
& li { display: inline-flex; align-items: center; gap: 8px; color: var(--color-texto-suave); }
& a { display: inline-flex; align-items: center; min-height: 32px; color: var(--color-texto-suave); text-decoration: none; border-radius: 4px; }
& a:hover { color: var(--color-texto); text-decoration: underline; text-underline-offset: 3px; }
& a:focus-visible { outline: 2px solid var(--color-acento); outline-offset: 2px; }
& li[aria-current] { color: var(--color-texto); font-weight: 600; }
& li + li::before { content: '/'; color: var(--color-borde); }`,
  disenos: {
    barra: { nombre: 'Barra', descripcion: 'Separadas con /', css: '' },
    chevron: { nombre: 'Flechita', descripcion: 'Separadas con ›', css: separador('›', 'font-size: 18px; color: var(--color-texto-suave);') },
    punto: { nombre: 'Punto', descripcion: 'Separadas con un punto medio', css: separador('·', 'font-weight: 700;') },
    flecha: { nombre: 'Flecha', descripcion: 'Separadas con →', css: separador('→', 'color: var(--color-acento-texto);') },
    pastillas: { nombre: 'Pastillas', descripcion: 'Cada nivel en una pastilla', css: `& li + li::before { content: '›'; } & a, & li[aria-current] { padding: 0 12px; min-height: 32px; display: inline-flex; align-items: center; border-radius: 999px; background: var(--color-superficie); } & a:hover { text-decoration: none; background: var(--color-borde); } & li[aria-current] { background: var(--color-acento); color: var(--color-sobre-acento); }` },
    flechas: { nombre: 'Bloques con punta', descripcion: 'Cada nivel es un bloque con forma de flecha', css: `& ol { gap: 0; } & li + li::before { content: none; } & a, & li[aria-current] { min-height: 34px; padding: 0 18px 0 22px; display: inline-flex; align-items: center; background: var(--color-superficie); clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%, 10px 50%); margin-right: -6px; } & li:first-child a { clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%); padding-left: 14px; } & li[aria-current] { background: var(--color-acento); color: var(--color-sobre-acento); } & a:hover { text-decoration: none; background: var(--color-borde); }` },
    mayusculas: { nombre: 'Mayúsculas chicas', descripcion: 'Texto chico en mayúsculas, editorial', css: `& { font-size: 11.5px; letter-spacing: .08em; text-transform: uppercase; } ${separador('—', 'color: var(--color-borde);')}` },
    volver: { nombre: 'Solo volver', descripcion: 'En el celular: solo el nivel anterior con flecha', css: `& li { display: none; } & li:nth-last-child(2) { display: inline-flex; } & li:nth-last-child(2)::before { content: '‹'; font-size: 20px; color: var(--color-texto); } & li:nth-last-child(2) a { color: var(--color-texto); font-weight: 600; }` },
  },
  Muestra: MuestraMigas,
};

// ---------- Pasos (stepper) ----------

const PASOS_EJ = ['Carrito', 'Envío', 'Pago', 'Listo'];

function MuestraPasos({ clase }: { clase: string; id: string }) {
  const [i, setI] = useState(1);
  return (
    <div className="cm-lugar-pasos">
      <ol className={clase} style={{ '--i': i, '--n': PASOS_EJ.length } as CSSProperties} aria-label="Pasos de la compra">
        {PASOS_EJ.map((p, j) => (
          <li key={p} data-estado={j < i ? 'hecho' : j === i ? 'actual' : 'pendiente'} aria-current={j === i ? 'step' : undefined}>
            <button type="button" onClick={() => setI(j)}>
              <span className="cm-ps-num">{j < i ? '✓' : j + 1}</span>
              <span className="cm-ps-txt">{p}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export const PASOS: Categoria = {
  id: 'pasos',
  nombre: 'Pasos',
  singular: 'indicador de pasos',
  descripcion: 'Para procesos de varias etapas: compra, registro, configuración. Tocá cada paso para ver cómo cambia.',
  estructura:
    '<ol class="cm-pasos cm-pasos-DISEÑO" style="--i: 1; --n: 4"><li data-estado="hecho"><button><span class="cm-ps-num">✓</span><span class="cm-ps-txt">Carrito</span></button></li><li data-estado="actual" aria-current="step">…</li><li data-estado="pendiente">…</li></ol> — --i es el paso actual y --n la cantidad.',
  anchoCelda: 360,
  base: `& { position: relative; display: grid; grid-template-columns: repeat(var(--n), 1fr); margin: 0; padding: 0; list-style: none; font-family: var(--fuente-texto); font-size: 13px; }
& li { position: relative; display: flex; justify-content: center; }
& li + li::before { content: ''; position: absolute; top: 18px; right: calc(50% + 22px); left: calc(-50% + 22px); height: 2px; background: var(--color-borde); transition: background var(--duracion-lenta) var(--curva-entrada); }
& li[data-estado='hecho'] + li::before, & li[data-estado='actual']::before { background: var(--color-acento); }
& button { display: flex; flex-direction: column; align-items: center; gap: 6px; min-height: 44px; padding: 0 4px; border: none; background: transparent; color: var(--color-texto-suave); font: inherit; cursor: pointer; }
& button:focus-visible { outline: 2px solid var(--color-acento); outline-offset: 2px; border-radius: 6px; }
& .cm-ps-num { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 999px; border: 2px solid var(--color-borde); background: var(--color-fondo); color: var(--color-texto-suave); font-weight: 700; transition: all var(--duracion-media) var(--curva-entrada); }
& li[data-estado='hecho'] .cm-ps-num { border-color: var(--color-acento); background: var(--color-acento); color: var(--color-sobre-acento); }
& li[data-estado='actual'] .cm-ps-num { border-color: var(--color-acento); color: var(--color-acento-texto); box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-acento) 20%, transparent); }
& li[data-estado='actual'] button, & li[data-estado='hecho'] button { color: var(--color-texto); }
& li[data-estado='actual'] .cm-ps-txt { font-weight: 700; }
${reducirMov}`,
  disenos: {
    circulos: { nombre: 'Círculos con línea', descripcion: 'Números unidos por una línea que se pinta', css: '' },
    puntos: { nombre: 'Puntos', descripcion: 'Puntitos chicos, el actual más largo', css: `& li + li::before { top: 9px; right: calc(50% + 10px); left: calc(-50% + 10px); } & .cm-ps-num { width: 18px; height: 18px; font-size: 0; border-width: 0; background: var(--color-borde); } & li[data-estado='actual'] .cm-ps-num { width: 30px; background: var(--color-acento); box-shadow: none; } & li[data-estado='hecho'] .cm-ps-num { background: var(--color-acento); }` },
    barras: { nombre: 'Barras', descripcion: 'Una barra por paso, se van llenando', css: `& { gap: 6px; } & li + li::before { content: none; } & button { width: 100%; align-items: flex-start; } & .cm-ps-num { width: 100%; height: 6px; border: none; border-radius: 999px; font-size: 0; background: var(--color-borde); } & li[data-estado='actual'] .cm-ps-num { background: var(--color-acento); box-shadow: none; } & li[data-estado='hecho'] .cm-ps-num { background: var(--color-acento); opacity: .55; }` },
    flechas: { nombre: 'Bloques con punta', descripcion: 'Cada paso es una flecha; los hechos se pintan', css: `& { gap: 0; } & li + li::before { content: none; } & button { width: 100%; flex-direction: row; justify-content: center; min-height: 44px; background: var(--color-superficie); clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%, 12px 50%); margin-right: -8px; padding: 0 14px 0 18px; } & .cm-ps-num { width: auto; height: auto; border: none; background: transparent; box-shadow: none !important; color: inherit; } & li[data-estado='hecho'] button { background: color-mix(in srgb, var(--color-acento) 25%, var(--color-fondo)); } & li[data-estado='hecho'] .cm-ps-num { background: transparent; color: inherit; } & li[data-estado='actual'] button { background: var(--color-acento); color: var(--color-sobre-acento); } & li[data-estado='actual'] .cm-ps-num { color: inherit; }` },
    texto: { nombre: 'Solo texto', descripcion: 'Nombres con una línea abajo que marca el actual', css: `& li + li::before { content: none; } & button { flex-direction: row; width: 100%; padding-bottom: 8px; border-bottom: 2px solid var(--color-borde); border-radius: 0; } & .cm-ps-num { width: auto; height: auto; border: none; background: transparent !important; box-shadow: none !important; color: inherit !important; font-size: 12px; } & .cm-ps-num::after { content: '.'; } & li[data-estado='hecho'] button { border-bottom-color: color-mix(in srgb, var(--color-acento) 45%, var(--color-borde)); } & li[data-estado='actual'] button { border-bottom-color: var(--color-acento); }` },
    vertical: { nombre: 'Vertical', descripcion: 'Uno debajo del otro, para el costado', css: `& { grid-template-columns: 1fr; gap: 10px; } & li { justify-content: flex-start; } & li + li::before { top: -12px; left: 17px; right: auto; width: 2px; height: 14px; } & button { flex-direction: row; gap: 12px; }` },
    cuadrados: { nombre: 'Cuadrados', descripcion: 'Números en cuadros, más técnico', css: `& .cm-ps-num { border-radius: 8px; } & li + li::before { height: 1px; border-top: 1px dashed var(--color-borde); background: transparent !important; } & li[data-estado='hecho'] + li::before, & li[data-estado='actual']::before { border-top-style: solid; border-top-color: var(--color-acento); }` },
    neobrutal: { nombre: 'Neobrutal', descripcion: 'Bordes negros y sombra dura', css: `& .cm-ps-num { border-radius: 0; border-color: var(--color-texto); box-shadow: 3px 3px 0 var(--color-texto) !important; } & li + li::before { height: 3px; background: var(--color-texto) !important; } & li[data-estado='actual'] .cm-ps-num { background: var(--color-acento); color: var(--color-sobre-acento); }` },
  },
  Muestra: MuestraPasos,
};

// ---------- Pantallas vacías ----------

function MuestraVacio({ clase }: { clase: string; id: string }) {
  return (
    <div className={clase}>
      <span className="cm-v-ilus" aria-hidden="true">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7M12 11v10" />
        </svg>
      </span>
      <div className="cm-v-texto">
        <strong className="cm-v-tit">Todavía no hay pedidos</strong>
        <p className="cm-v-txt">Cuando alguien compre, lo vas a ver acá.</p>
      </div>
      <button type="button" className="cm-v-boton">
        Compartir mi tienda
      </button>
    </div>
  );
}

export const VACIOS: Categoria = {
  id: 'vacio',
  nombre: 'Pantallas vacías',
  singular: 'pantalla vacía',
  descripcion: 'Lo que se ve cuando todavía no hay nada: sin pedidos, sin mensajes, sin resultados. Explica y propone qué hacer.',
  estructura:
    '<div class="cm-vacio cm-vacio-DISEÑO"><span class="cm-v-ilus"><svg>…</svg></span><div class="cm-v-texto"><strong class="cm-v-tit">Todavía no hay pedidos</strong><p class="cm-v-txt">Cuando alguien compre, lo vas a ver acá.</p></div><button class="cm-v-boton">Compartir mi tienda</button></div>',
  anchoCelda: 300,
  base: `& { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 24px 16px; text-align: center; font-family: var(--fuente-texto); color: var(--color-texto); }
& .cm-v-ilus { display: grid; place-items: center; width: 72px; height: 72px; border-radius: 999px; background: var(--color-superficie); color: var(--color-texto-suave); }
& .cm-v-texto { display: flex; flex-direction: column; gap: 4px; }
& .cm-v-tit { font-family: var(--fuente-titulos); font-size: 17px; }
& .cm-v-txt { margin: 0; color: var(--color-texto-suave); font-size: 14px; max-width: 28ch; }
& .cm-v-boton { min-height: 44px; padding: 0 18px; border: none; border-radius: var(--radio-boton); background: var(--boton-color); color: var(--boton-sobre); font: inherit; font-weight: 700; cursor: pointer; }
& .cm-v-boton:focus-visible { outline: 2px solid var(--color-acento); outline-offset: 2px; }`,
  disenos: {
    centrado: { nombre: 'Centrado', descripcion: 'Icono, texto y botón al medio', css: '' },
    punteado: { nombre: 'Caja punteada', descripcion: 'Dentro de un recuadro punteado, como «soltá acá»', css: `& { border: 2px dashed var(--color-borde); border-radius: var(--radio-grande); }` },
    color: { nombre: 'Icono de color', descripcion: 'El icono en un círculo del acento', css: `& .cm-v-ilus { background: color-mix(in srgb, var(--color-acento) 16%, var(--color-fondo)); color: var(--color-acento-texto); }` },
    lateral: { nombre: 'En fila', descripcion: 'Icono a la izquierda, compacto, para dentro de una card', css: `& { flex-direction: row; text-align: left; align-items: center; padding: 16px; } & .cm-v-ilus { flex: none; width: 52px; height: 52px; } & .cm-v-ilus svg { width: 28px; height: 28px; } & .cm-v-texto { flex: 1; } & .cm-v-boton { display: none; }` },
    tarjeta: { nombre: 'Tarjeta', descripcion: 'En una card con sombra suave', css: `& { background: var(--color-superficie); border-radius: var(--radio-grande); box-shadow: 0 1px 2px rgba(0,0,0,.06); } & .cm-v-ilus { background: var(--color-fondo); }` },
    grande: { nombre: 'Grande', descripcion: 'Icono enorme, para una pantalla entera vacía', css: `& .cm-v-ilus { width: 120px; height: 120px; background: transparent; } & .cm-v-ilus svg { width: 88px; height: 88px; stroke-width: 1; } & .cm-v-tit { font-size: 22px; }` },
    flota: { nombre: 'Icono que flota', descripcion: 'El icono sube y baja despacio', css: `& .cm-v-ilus { animation: cm-v-flota 3s ease-in-out infinite; } @keyframes cm-v-flota { 50% { transform: translateY(-6px); } } @media (prefers-reduced-motion: reduce) { & .cm-v-ilus { animation: none; } }` },
    neobrutal: { nombre: 'Neobrutal', descripcion: 'Borde negro, sombra dura y botón igual', css: `& { border: 2px solid var(--color-texto); box-shadow: 5px 5px 0 var(--color-texto); } & .cm-v-ilus { border-radius: 0; border: 2px solid var(--color-texto); background: var(--color-acento); color: var(--color-sobre-acento); } & .cm-v-boton { border-radius: 0; border: 2px solid var(--color-texto); box-shadow: 3px 3px 0 var(--color-texto); }` },
  },
  Muestra: MuestraVacio,
};
