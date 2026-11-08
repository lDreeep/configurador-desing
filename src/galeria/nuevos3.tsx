// Más componentes: tarjetas de producto, notificaciones y menú de usuario.

import { useId, useState, type CSSProperties } from 'react';
import type { Categoria } from './base';

const reducirMov = '@media (prefers-reduced-motion: reduce) { &, & * { animation: none !important; transition: none !important; } }';
const campana = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 0 0 4 0" />
  </svg>
);

// ---------- Tarjeta de producto ----------

/** Ilustración propia, sin imágenes externas ni marcas. El color sigue la variante elegida. */
function ProductoIlustrado() {
  return (
    <svg className="cm-pr-ilustracion" viewBox="0 0 360 280" role="img" aria-label="Zapatilla urbana de perfil, con suela clara y cordones">
      <ellipse cx="180" cy="226" rx="133" ry="13" fill="var(--color-texto)" opacity=".1" />
      <g transform="rotate(-12 180 160)">
        <path d="M46 180c8-19 10-55 20-70l30 22 29-41 40 13 36 44 62 24c26 10 47 12 50 34H47Z" fill="var(--producto-tono, var(--color-acento))" />
        <path d="m91 134 39-28 28 9 35 43-35 21-31-28Z" fill="var(--color-fondo)" opacity=".65" />
        <path d="M48 196c45 9 74-1 109 2s80 18 154 7v17H48c-12 0-15-22 0-26Z" fill="var(--color-superficie-alta)" stroke="var(--color-texto)" strokeWidth="2" />
        <path d="m130 125 27 2m-18 11 28 1m-19 12 29 1" stroke="var(--color-fondo)" strokeWidth="6" strokeLinecap="round" />
        <path d="m204 169 28 9m-26-2 23 8M72 153l-4 26" stroke="var(--color-fondo)" strokeWidth="3" strokeLinecap="round" opacity=".6" />
        <path d="M56 212h35m17 0h24m110 3h49" stroke="var(--color-borde)" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function MuestraProducto({ clase }: { clase: string; id: string }) {
  const [fav, setFav] = useState(false);
  const [agregado, setAgregado] = useState(false);
  const [talle, setTalle] = useState('');
  const [color, setColor] = useState(0);
  const [intento, setIntento] = useState(false);
  const u = useId();
  const colores = ['Acento', 'Tinta', 'Suave'];
  const tonos = ['var(--color-acento)', 'var(--color-texto)', 'color-mix(in srgb, var(--color-acento) 35%, var(--color-superficie))'];
  const error = intento && !talle;
  return (
    <article className={clase} style={{ '--producto-tono': tonos[color] } as CSSProperties}>
      <div className="cm-pr-foto">
        <ProductoIlustrado />
        <span className="cm-pr-etq">−20%</span>
        <button type="button" className="cm-pr-fav" aria-pressed={fav} aria-label={fav ? 'Quitar de favoritos' : 'Guardar en favoritos'} onClick={() => setFav(!fav)}>{fav ? '♥' : '♡'}</button>
      </div>
      <div className="cm-pr-info">
        <span className="cm-pr-cat">Colección urbana · Unisex</span>
        <strong className="cm-pr-nombre">Zapatillas urbanas</strong>
        <span className="cm-pr-estrellas" aria-label="4 de 5 estrellas, 128 opiniones">★★★★☆ <small>(128)</small></span>
        <span className="cm-pr-precio"><b>$ 34.500</b> <s aria-label="Precio anterior: 43.100 pesos">$ 43.100</s></span>
        <div className="cm-pr-opciones">
          <fieldset className="cm-pr-colores"><legend>Color: {colores[color]}</legend>{colores.map((nombre, i) => <label key={nombre} style={{ '--muestra-color': tonos[i] } as CSSProperties}><input type="radio" name={`${u}-color`} value={nombre} checked={color === i} onChange={() => { setColor(i); setAgregado(false); }} /><span className="cm-pr-muestra-color" aria-hidden="true" /><span className="cm-pr-sr">{nombre}</span></label>)}</fieldset>
          <div className="cm-pr-talle"><label htmlFor={`${u}-talle`}>Talle</label><select id={`${u}-talle`} value={talle} onChange={e => { setTalle(e.target.value); setAgregado(false); }} aria-invalid={error || undefined} aria-describedby={error ? `${u}-error` : undefined}><option value="">Elegí</option>{['36', '37', '38', '39', '40', '41', '42'].map(n => <option key={n}>{n}</option>)}</select></div>
          {error && <span className="cm-pr-error" id={`${u}-error`} role="status">Elegí un talle para agregar.</span>}
        </div>
        <span className="cm-pr-disponible">✓ Disponible · envío en 48 h</span>
        <button type="button" className="cm-pr-boton" onClick={() => { setIntento(true); if (talle) setAgregado(!agregado); else document.getElementById(`${u}-talle`)?.focus(); }}>{agregado ? 'Quitar del carrito' : 'Agregar al carrito'}</button>
        <span className="cm-pr-confirmacion" role="status">{agregado ? `✓ Agregado · talle ${talle} · ${colores[color].toLowerCase()}` : ''}</span>
      </div>
    </article>
  );
}

export const PRODUCTOS: Categoria = {
  id: 'producto',
  nombre: 'Tarjetas de producto',
  singular: 'tarjeta de producto',
  descripcion: 'Probá una compra: elegí color y talle, guardá en favoritos y agregá al carrito. La ilustración cambia con la variante. Son datos de muestra; no se realizan compras.',
  estructura:
    '<article class="cm-producto cm-producto-DISEÑO"><div class="cm-pr-foto"><img class="cm-pr-ilustracion" src="producto.webp" alt="Descripción del producto"><span class="cm-pr-etq">−20%</span><button type="button" class="cm-pr-fav" aria-label="Guardar en favoritos" aria-pressed="false">♡</button></div><div class="cm-pr-info"><span class="cm-pr-cat">Categoría</span><strong class="cm-pr-nombre">Producto</strong><span class="cm-pr-estrellas" aria-label="4 de 5 estrellas, 128 opiniones">★★★★☆ (128)</span><span class="cm-pr-precio"><b>$ 34.500</b><s>$ 43.100</s></span><div class="cm-pr-opciones"><fieldset class="cm-pr-colores"><legend>Color</legend><label><input type="radio" name="color" value="acento"><span class="cm-pr-muestra-color" aria-hidden="true"></span>Acento</label>…</fieldset><div class="cm-pr-talle"><label for="talle">Talle</label><select id="talle"><option value="">Elegí</option>…</select></div><span class="cm-pr-error" id="error-talle" role="status"></span></div><span class="cm-pr-disponible">Disponible</span><button type="button" class="cm-pr-boton">Agregar al carrito</button><span class="cm-pr-confirmacion" role="status"></span></div></article> — Usar ids y names únicos por instancia. Seleccionar color actualiza --producto-tono y la imagen de variante; seleccionar talle habilita agregar; si falta, anunciar error y enfocar el selector con aria-invalid y aria-describedby. Favoritos usa aria-pressed. Agregar/quitar actualiza el carrito real del proyecto y anuncia el resultado. La galería solo lo simula.',
  anchoCelda: 260,
  base: `& { display: flex; flex-direction: column; width: 100%; max-width: 260px; border-radius: var(--radio-grande); background: var(--color-fondo); border: 1px solid var(--color-borde); overflow: hidden; font-family: var(--fuente-texto); color: var(--color-texto); }
& .cm-pr-foto { position: relative; aspect-ratio: 1; background: radial-gradient(circle at 35% 40%, color-mix(in srgb, var(--color-acento) 45%, var(--color-fondo)) 0 28%, transparent 29%), color-mix(in srgb, var(--color-acento) 14%, var(--color-superficie)); }
& .cm-pr-etq { position: absolute; top: 10px; left: 10px; padding: 3px 8px; border-radius: 999px; background: var(--color-texto); color: var(--color-fondo); font-size: 12px; font-weight: 800; }
& .cm-pr-fav { position: absolute; top: 8px; right: 8px; width: 44px; height: 44px; border: none; border-radius: 50%; background: var(--color-fondo); color: var(--color-texto); font-size: 18px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,.12); }
& .cm-pr-fav[aria-pressed='true'] { color: var(--color-acento-texto); }
& .cm-pr-info { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px 14px; }
& .cm-pr-cat { font-size: 11.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--color-texto-suave); }
& .cm-pr-nombre { font-family: var(--fuente-titulos); font-size: 16px; }
& .cm-pr-estrellas { font-size: 13px; color: var(--color-acento-texto); letter-spacing: 1px; }
& .cm-pr-estrellas small { color: var(--color-texto-suave); letter-spacing: 0; }
& .cm-pr-precio { display: flex; align-items: baseline; gap: 8px; margin-top: 2px; }
& .cm-pr-precio b { font-size: 18px; }
& .cm-pr-precio s { font-size: 13px; color: var(--color-texto-suave); }
& .cm-pr-boton { margin-top: 8px; min-height: 44px; border: none; border-radius: var(--radio-boton); background: var(--boton-color); color: var(--boton-sobre); font: inherit; font-weight: 700; cursor: pointer; }
& .cm-pr-ilustracion { display: block; width: 100%; height: 100%; position: absolute; inset: 0; object-fit: contain; transition: transform var(--duracion-media) var(--curva-entrada); }
&:hover .cm-pr-ilustracion { transform: scale(1.04); }
& .cm-pr-opciones { display: flex; flex-wrap: wrap; gap: 8px 16px; align-items: end; margin-top: 8px; }
& .cm-pr-colores { border: 0; padding: 0; margin: 0; display: flex; gap: 0; min-width: 0; }
& .cm-pr-colores legend, & .cm-pr-talle label { font-size: 12px; color: var(--color-texto-suave); padding: 0; }
& .cm-pr-colores label { position: relative; display: grid; place-items: center; width: 44px; height: 44px; cursor: pointer; }
& .cm-pr-colores input { position: absolute; inset: 0; opacity: 0; margin: 0; width: 100%; height: 100%; cursor: pointer; }
& .cm-pr-muestra-color { width: 22px; height: 22px; border-radius: 50%; background: var(--muestra-color, var(--color-acento)); border: 1px solid var(--color-texto-suave); }
& .cm-pr-colores input:checked + .cm-pr-muestra-color { outline: 2px solid var(--color-texto); outline-offset: 3px; }
& .cm-pr-colores input:focus-visible + .cm-pr-muestra-color { outline: 3px solid var(--color-acento-texto); outline-offset: 4px; }
& .cm-pr-talle { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 68px; }
& .cm-pr-talle select { min-height: 44px; width: 100%; border: 1px solid var(--color-borde); border-radius: var(--radio-pequeno); padding: 0 8px; background: var(--color-fondo); color: var(--color-texto); font: inherit; font-size: 16px; }
& .cm-pr-disponible { font-size: 12px; color: var(--color-texto-suave); margin-top: 8px; }
& .cm-pr-error, & .cm-pr-confirmacion { font-size: 12px; line-height: 1.5; color: var(--color-texto); }
& .cm-pr-error { flex-basis: 100%; border-inline-start: 3px solid var(--color-error); padding-inline-start: 8px; }
& .cm-pr-confirmacion:empty { display: none; }
& .cm-pr-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
& button:focus-visible, & select:focus-visible { outline: 2px solid var(--color-acento-texto); outline-offset: 2px; }
${reducirMov}`,
  disenos: {
    clasica: { nombre: 'Clásica', descripcion: 'Foto, datos y botón a lo ancho', css: '' },
    sin_caja: { nombre: 'Sin caja', descripcion: 'Solo la foto redondeada y los datos abajo, sin borde', css: `& { border: none; background: transparent; overflow: visible; } & .cm-pr-foto { border-radius: var(--radio-grande); } & .cm-pr-info { padding: 10px 2px 0; } & .cm-pr-boton { background: transparent; color: var(--color-texto); border: 1.5px solid var(--color-borde); }` },
    al_pasar: { nombre: 'Botón al pasar', descripcion: 'El botón aparece sobre la foto al pasar el mouse', css: `& { position: relative; container-type: inline-size; } & .cm-pr-boton { position: absolute; left: 12px; right: 12px; top: calc(100cqw - 56px); margin: 0; opacity: 0; transform: translateY(8px); transition: opacity var(--duracion-media) ease, transform var(--duracion-media) var(--curva-entrada); } &:hover .cm-pr-boton, &:focus-within .cm-pr-boton, & .cm-pr-boton:focus-visible { opacity: 1; transform: none; } @media (hover: none) { & .cm-pr-boton { position: static; opacity: 1; transform: none; margin-top: 8px; } }` },
    horizontal: { nombre: 'Horizontal', descripcion: 'Foto a la izquierda, para listas y carritos', css: `& { flex-direction: row; max-width: 360px; } & .cm-pr-foto { flex: 0 0 120px; aspect-ratio: auto; } & .cm-pr-etq, & .cm-pr-estrellas { display: none; } & .cm-pr-fav { width: 44px; height: 44px; font-size: 16px; } & .cm-pr-info { flex: 1; padding: 10px 12px; } & .cm-pr-boton { min-height: 44px; font-size: 13px; }` },
    precio_foto: { nombre: 'Precio sobre la foto', descripcion: 'El precio va en una pastilla encima de la imagen', css: `& .cm-pr-foto { display: flex; align-items: flex-end; padding: 10px; } & .cm-pr-precio { position: absolute; } & .cm-pr-info { position: relative; } & .cm-pr-precio { top: -48px; left: 10px; padding: 6px 12px; border-radius: 999px; background: var(--color-fondo); box-shadow: 0 4px 12px rgba(0,0,0,.15); } & .cm-pr-precio s { display: none; }` },
    sombra: { nombre: 'Flotante', descripcion: 'Sin borde, con sombra que crece al pasar', css: `& { border: none; box-shadow: 0 2px 10px rgba(0,0,0,.08); transition: transform var(--duracion-media) var(--curva-entrada), box-shadow var(--duracion-media) ease; } &:hover { transform: translateY(-4px); box-shadow: 0 16px 34px rgba(0,0,0,.14); }` },
    minimal: { nombre: 'Mínima', descripcion: 'Solo foto, nombre y precio; sin estrellas ni botón', css: `& { border: none; border-radius: 0; } & .cm-pr-foto { border-radius: 0; } & .cm-pr-estrellas, & .cm-pr-boton, & .cm-pr-cat, & .cm-pr-etq, & .cm-pr-opciones, & .cm-pr-disponible, & .cm-pr-confirmacion { display: none; } & .cm-pr-info { flex-direction: row; justify-content: space-between; align-items: baseline; padding: 10px 0; } & .cm-pr-nombre { font-size: 14px; font-weight: 500; } & .cm-pr-precio b { font-size: 14px; }` },
    neobrutal: { nombre: 'Neobrutal', descripcion: 'Borde negro, sombra dura y etiqueta torcida', css: `& { border: 2px solid var(--color-texto); border-radius: 0; box-shadow: 5px 5px 0 var(--color-texto); } & .cm-pr-foto { border-bottom: 2px solid var(--color-texto); } & .cm-pr-etq { border-radius: 0; background: var(--color-acento); color: var(--color-sobre-acento); transform: rotate(-6deg); border: 2px solid var(--color-texto); } & .cm-pr-boton { border-radius: 0; border: 2px solid var(--color-texto); box-shadow: 3px 3px 0 var(--color-texto); }` },
  },
  Muestra: MuestraProducto,
};

// ---------- Notificaciones ----------

const AVISOS_N = [
  ['Nuevo pedido', 'Hace 2 min'],
  ['Pago recibido', 'Hace 1 hora'],
  ['Tenés un mensaje', 'Ayer'],
];

function MuestraNotificaciones({ clase }: { clase: string; id: string }) {
  const [abierto, setAbierto] = useState(true);
  const [leidas, setLeidas] = useState(false);
  return (
    <div className="cm-lugar-desplegable cm-lugar-derecha">
      <div className={clase}>
        <button type="button" className="cm-n-boton" aria-expanded={abierto} aria-label={leidas ? 'Notificaciones' : 'Notificaciones, 3 nuevas'} onClick={() => setAbierto(!abierto)}>
          {campana}
          {!leidas && <span className="cm-n-num">3</span>}
        </button>
        {abierto && (
          <div className="cm-n-panel">
            <div className="cm-n-cab">
              <strong>Notificaciones</strong>
              <button type="button" onClick={() => setLeidas(true)}>
                Marcar leídas
              </button>
            </div>
            <ul>
              {AVISOS_N.map(([t, h]) => (
                <li key={t} data-nueva={!leidas || undefined}>
                  <span className="cm-n-ico" aria-hidden="true">
                    {t[0]}
                  </span>
                  <span className="cm-n-txt">
                    <b>{t}</b>
                    <span>{h}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export const NOTIFICACIONES: Categoria = {
  id: 'notificaciones',
  nombre: 'Notificaciones',
  singular: 'notificaciones',
  descripcion: 'La campanita con el número de avisos nuevos y su lista. Tocá la campana y «Marcar leídas».',
  estructura:
    '<div class="cm-notificaciones cm-notificaciones-DISEÑO"><button class="cm-n-boton" aria-expanded="true" aria-label="Notificaciones, 3 nuevas"><svg/><span class="cm-n-num">3</span></button><div class="cm-n-panel"><div class="cm-n-cab"><strong>Notificaciones</strong><button>Marcar leídas</button></div><ul><li data-nueva><span class="cm-n-ico">N</span><span class="cm-n-txt"><b>Nuevo pedido</b><span>Hace 2 min</span></span></li>…</ul></div></div>',
  anchoCelda: 320,
  base: `& { position: relative; display: inline-block; font-family: var(--fuente-texto); color: var(--color-texto); font-size: 13.5px; }
& .cm-n-boton { position: relative; display: grid; place-items: center; width: 44px; height: 44px; border: 1px solid var(--color-borde); border-radius: 50%; background: var(--color-fondo); color: var(--color-texto); cursor: pointer; }
& .cm-n-num { position: absolute; top: -4px; right: -4px; min-width: 20px; height: 20px; padding: 0 5px; border-radius: 999px; background: #D9264F; color: #FFFFFF; font: 800 11px/20px var(--fuente-texto); box-shadow: 0 0 0 2px var(--color-fondo); }
& .cm-n-panel { position: absolute; z-index: 5; top: calc(100% + 8px); right: 0; width: 270px; border-radius: var(--radio-grande); background: var(--color-superficie-alta, var(--color-fondo)); border: 1px solid var(--color-borde); box-shadow: 0 14px 36px rgba(0,0,0,.16); overflow: hidden; animation: cm-n-entra var(--duracion-media) var(--curva-entrada) both; transform-origin: top right; }
@keyframes cm-n-entra { from { opacity: 0; transform: translateY(-6px) scale(.97); } }
& .cm-n-cab { display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; border-bottom: 1px solid var(--color-borde); }
& .cm-n-cab button { min-height: 32px; border: none; background: transparent; color: var(--color-acento-texto); font: inherit; font-size: 12.5px; font-weight: 700; cursor: pointer; }
& ul { margin: 0; padding: 4px; list-style: none; }
& li { position: relative; display: flex; gap: 10px; align-items: center; padding: 10px; border-radius: calc(var(--radio-medio) * .8); }
& li[data-nueva] { background: color-mix(in srgb, var(--color-acento) 7%, transparent); }
& li[data-nueva]::after { content: ''; position: absolute; right: 12px; width: 8px; height: 8px; border-radius: 50%; background: var(--color-acento); }
& .cm-n-ico { display: grid; place-items: center; flex: none; width: 34px; height: 34px; border-radius: 50%; background: var(--color-superficie); font-weight: 800; }
& .cm-n-txt { display: flex; flex-direction: column; }
& .cm-n-txt span { font-size: 12px; color: var(--color-texto-suave); }
& button:focus-visible { outline: 2px solid var(--color-acento); outline-offset: 2px; }
${reducirMov}`,
  disenos: {
    clasica: { nombre: 'Clásica', descripcion: 'Número rojo y panel flotante', css: '' },
    punto: { nombre: 'Solo un punto', descripcion: 'Un puntito en vez del número', css: `& .cm-n-num { min-width: 12px; width: 12px; height: 12px; padding: 0; top: 6px; right: 6px; font-size: 0; }` },
    pulso: { nombre: 'Número que late', descripcion: 'El número late para llamar la atención', css: `& .cm-n-num::after { content: ''; position: absolute; inset: 0; border-radius: inherit; background: #D9264F; animation: cm-n-pulso 1.6s ease-out infinite; z-index: -1; } @keyframes cm-n-pulso { to { transform: scale(2); opacity: 0; } }` },
    acento: { nombre: 'De color', descripcion: 'El número y el encabezado con el acento', css: `& .cm-n-num { background: var(--color-acento); color: var(--color-sobre-acento); } & .cm-n-cab { background: var(--color-acento); color: var(--color-sobre-acento); border-bottom: none; } & .cm-n-cab button { color: var(--color-sobre-acento); text-decoration: underline; }` },
    lineas: { nombre: 'Lista con líneas', descripcion: 'Avisos separados por líneas, sin fondos', css: `& ul { padding: 0; } & li { border-radius: 0; } & li + li { border-top: 1px solid var(--color-borde); } & li[data-nueva] { background: transparent; box-shadow: inset 3px 0 0 var(--color-acento); }` },
    sin_borde: { nombre: 'Campana suelta', descripcion: 'La campana sin círculo ni borde', css: `& .cm-n-boton { border: none; background: transparent; } & .cm-n-boton:hover { background: var(--color-superficie); }` },
    oscura: { nombre: 'Oscura', descripcion: 'Panel oscuro', css: `& .cm-n-panel { background: #15171C; border-color: #2A2D35; color: #F1F2F4; } & .cm-n-cab { border-bottom-color: #2A2D35; } & .cm-n-cab button { color: #F1F2F4; } & .cm-n-txt span { color: #A9AFBA; } & .cm-n-ico { background: #23262E; } & li[data-nueva] { background: #1C1F26; }` },
    neobrutal: { nombre: 'Neobrutal', descripcion: 'Bordes negros y sombras duras', css: `& .cm-n-boton, & .cm-n-panel { border: 2px solid var(--color-texto); border-radius: 0; box-shadow: 4px 4px 0 var(--color-texto); } & .cm-n-num { border-radius: 0; background: var(--color-acento); color: var(--color-sobre-acento); box-shadow: none; border: 2px solid var(--color-texto); } & li { border-radius: 0; } & .cm-n-ico { border-radius: 0; border: 2px solid var(--color-texto); }` },
  },
  Muestra: MuestraNotificaciones,
};

// ---------- Menú de usuario ----------

function MuestraUsuario({ clase }: { clase: string; id: string }) {
  const [abierto, setAbierto] = useState(true);
  return (
    <div className="cm-lugar-desplegable cm-lugar-derecha">
      <div className={clase}>
        <button type="button" className="cm-u-boton" aria-expanded={abierto} aria-haspopup="menu" onClick={() => setAbierto(!abierto)}>
          <span className="cm-u-av" aria-hidden="true">
            AL
          </span>
          <span className="cm-u-nombre">Ana López</span>
          <span className="cm-u-chev" aria-hidden="true">
            ▾
          </span>
        </button>
        {abierto && (
          <div className="cm-u-menu" role="menu" aria-label="Cuenta">
            <div className="cm-u-cab">
              <b>Ana López</b>
              <span>ana@ejemplo.com</span>
            </div>
            {['Mi perfil', 'Ajustes', 'Ayuda'].map((x) => (
              <button key={x} type="button" role="menuitem" className="cm-u-item">
                {x}
              </button>
            ))}
            <button type="button" role="menuitem" className="cm-u-item cm-u-salir">
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export const USUARIOS: Categoria = {
  id: 'usuario',
  nombre: 'Menú de usuario',
  singular: 'menú de usuario',
  descripcion: 'El botón con tu foto o iniciales que abre el perfil, los ajustes y cerrar sesión.',
  estructura:
    '<div class="cm-usuario cm-usuario-DISEÑO"><button class="cm-u-boton" aria-expanded="true" aria-haspopup="menu"><span class="cm-u-av">AL</span><span class="cm-u-nombre">Ana López</span><span class="cm-u-chev">▾</span></button><div class="cm-u-menu" role="menu"><div class="cm-u-cab"><b>Ana López</b><span>ana@ejemplo.com</span></div><button role="menuitem" class="cm-u-item">Mi perfil</button>…<button role="menuitem" class="cm-u-item cm-u-salir">Cerrar sesión</button></div></div>',
  anchoCelda: 300,
  base: `& { position: relative; display: inline-block; font-family: var(--fuente-texto); color: var(--color-texto); font-size: 14px; }
& .cm-u-boton { display: inline-flex; align-items: center; gap: 8px; min-height: 44px; padding: 4px 12px 4px 4px; border: 1px solid var(--color-borde); border-radius: 999px; background: var(--color-fondo); color: var(--color-texto); font: inherit; font-weight: 600; cursor: pointer; }
& .cm-u-av { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 50%; background: var(--color-acento); color: var(--color-sobre-acento); font-size: 12px; font-weight: 800; }
& .cm-u-chev { font-size: 12px; color: var(--color-texto-suave); }
& .cm-u-menu { position: absolute; z-index: 5; top: calc(100% + 8px); right: 0; display: flex; flex-direction: column; width: 220px; padding: 6px; border-radius: var(--radio-grande); background: var(--color-superficie-alta, var(--color-fondo)); border: 1px solid var(--color-borde); box-shadow: 0 14px 36px rgba(0,0,0,.16); animation: cm-n-entra var(--duracion-media) var(--curva-entrada) both; transform-origin: top right; }
@keyframes cm-n-entra { from { opacity: 0; transform: translateY(-6px) scale(.97); } }
& .cm-u-cab { display: flex; flex-direction: column; padding: 8px 10px 10px; margin-bottom: 4px; border-bottom: 1px solid var(--color-borde); }
& .cm-u-cab span { font-size: 12.5px; color: var(--color-texto-suave); }
& .cm-u-item { display: flex; align-items: center; min-height: 40px; padding: 0 10px; border: none; border-radius: calc(var(--radio-medio) * .7); background: transparent; color: var(--color-texto); font: inherit; text-align: left; cursor: pointer; }
& .cm-u-item:hover { background: var(--color-superficie); }
& .cm-u-salir { margin-top: 4px; color: color-mix(in srgb, var(--color-error) 80%, var(--color-texto)); }
& button:focus-visible { outline: 2px solid var(--color-acento); outline-offset: 2px; }
${reducirMov}`,
  disenos: {
    clasico: { nombre: 'Clásico', descripcion: 'Avatar, nombre y flechita; menú flotante', css: '' },
    solo_avatar: { nombre: 'Solo la foto', descripcion: 'Un círculo con las iniciales, sin nombre', css: `& .cm-u-boton { padding: 2px; border: none; } & .cm-u-nombre, & .cm-u-chev { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); } & .cm-u-av { width: 40px; height: 40px; box-shadow: 0 0 0 2px var(--color-fondo), 0 0 0 4px var(--color-acento); }` },
    cabecera_color: { nombre: 'Cabecera de color', descripcion: 'El menú arranca con un bloque del acento', css: `& .cm-u-menu { padding: 0; overflow: hidden; } & .cm-u-cab { padding: 16px 14px; background: var(--color-acento); color: var(--color-sobre-acento); border-bottom: none; } & .cm-u-cab span { color: var(--color-sobre-acento); } & .cm-u-item { margin: 0 6px; } & .cm-u-salir { margin-bottom: 6px; }` },
    lineas: { nombre: 'Con líneas', descripcion: 'Opciones separadas por líneas finas', css: `& .cm-u-menu { padding: 0; } & .cm-u-item { border-radius: 0; padding: 0 14px; } & .cm-u-item + .cm-u-item { border-top: 1px solid var(--color-borde); } & .cm-u-cab { padding: 12px 14px; margin: 0; }` },
    cuadrado: { nombre: 'Cuadrado', descripcion: 'Botón y avatar con esquinas, más sobrio', css: `& .cm-u-boton { border-radius: var(--radio-medio); } & .cm-u-av { border-radius: 8px; } & .cm-u-menu { border-radius: var(--radio-medio); }` },
    oscuro: { nombre: 'Oscuro', descripcion: 'Menú oscuro', css: `& .cm-u-menu { background: #15171C; border-color: #2A2D35; } & .cm-u-cab { border-bottom-color: #2A2D35; color: #F1F2F4; } & .cm-u-cab span { color: #A9AFBA; } & .cm-u-item { color: #F1F2F4; } & .cm-u-item:hover { background: #23262E; } & .cm-u-salir { color: #FF8FA3; }` },
    vidrio: { nombre: 'Vidrio', descripcion: 'Botón y menú translúcidos', css: `& .cm-u-boton, & .cm-u-menu { background: color-mix(in srgb, var(--color-fondo) 60%, transparent); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-color: color-mix(in srgb, var(--color-texto) 14%, transparent); }` },
    neobrutal: { nombre: 'Neobrutal', descripcion: 'Bordes negros y sombras duras', css: `& .cm-u-boton, & .cm-u-menu { border: 2px solid var(--color-texto); border-radius: 0; box-shadow: 4px 4px 0 var(--color-texto); } & .cm-u-av, & .cm-u-item { border-radius: 0; } & .cm-u-av { border: 2px solid var(--color-texto); }` },
  },
  Muestra: MuestraUsuario,
};
