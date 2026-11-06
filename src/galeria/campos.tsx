// Campos de texto: aspecto, animación al enfocar y animación al escribir.

import { useId } from 'react';
import { type Categoria, reanimar } from './base';
import { Icono } from './iconos';

function MuestraCampo({ clase }: { clase: string; id: string }) {
  const id = useId();
  return (
    <div className={clase}>
      <label htmlFor={id} className="cm-etq">
        Tu email
      </label>
      <div className="cm-caja">
        <span className="cm-icono">
          <Icono nombre="correo" tamano={18} />
        </span>
        <input
          id={id}
          type="email"
          placeholder="vos@ejemplo.com"
          autoComplete="off"
          onInput={(e) => reanimar((e.currentTarget as HTMLElement).parentElement, 'escribiendo')}
        />
        <span className="cm-linea" aria-hidden="true" />
      </div>
      <span className="cm-ayuda">Te mandamos la confirmación acá.</span>
    </div>
  );
}

const anillo = 'box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-acento) 28%, transparent);';

export const CAMPOS: Categoria = {
  id: 'campo',
  nombre: 'Campos de texto',
  singular: 'campo de texto',
  descripcion: 'Escribí en cada uno para ver cómo responde al enfocar y al tipear.',
  estructura:
    '<div class="cm-campo cm-campo-DISEÑO"><label class="cm-etq" for="x">Etiqueta</label><div class="cm-caja"><span class="cm-icono">(icono opcional)</span><input id="x" placeholder="…"><span class="cm-linea"></span></div><span class="cm-ayuda">Texto de ayuda</span></div> — al escribir, se agrega y reinicia la clase .escribiendo en .cm-caja.',
  anchoCelda: 260,
  base: `& { position: relative; display: flex; flex-direction: column; gap: 6px; width: 100%; max-width: 320px; font-family: var(--fuente-texto); color: var(--color-texto); }
& .cm-etq { font-size: 14px; font-weight: 600; }
& .cm-caja { position: relative; display: flex; align-items: center; gap: 8px; min-height: 48px; padding: 0 14px; border-radius: var(--radio-pequeno);
  transition: border-color var(--duracion-rapida) ease, box-shadow var(--duracion-media) var(--curva-entrada), background-color var(--duracion-media) ease, transform var(--duracion-rapida) ease; }
& input { flex: 1; min-width: 0; border: none; outline: none; background: transparent; font: inherit; font-size: 16px; color: inherit; padding: 12px 0; caret-color: var(--color-acento); }
& input::placeholder { color: var(--color-texto-suave); opacity: 0.85; }
& .cm-icono { display: none; color: var(--color-texto-suave); transition: color var(--duracion-rapida) ease; }
& .cm-linea { display: none; }
& .cm-ayuda { font-size: 12.5px; color: var(--color-texto-suave); }
@keyframes cm-tecla { 40% { transform: scale(1.012); } }
@keyframes cm-tecla-brillo { 40% { box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-acento) 30%, transparent), 0 0 26px color-mix(in srgb, var(--color-acento) 45%, transparent); } }
@media (prefers-reduced-motion: reduce) { & .cm-caja, & .cm-linea, & .cm-etq { transition: none !important; animation: none !important; } }`,
  disenos: {
    contorno: {
      nombre: 'Contorno', descripcion: 'Borde fino; al enfocar se marca con un anillo',
      css: `& .cm-caja { border: 1.5px solid var(--color-borde); background: var(--color-fondo); }
& .cm-caja:focus-within { border-color: var(--color-acento); ${anillo} }`,
    },
    relleno: {
      nombre: 'Relleno', descripcion: 'Fondo suave y línea abajo, estilo Material',
      css: `& .cm-caja { background: var(--color-superficie); border-bottom: 2px solid var(--color-borde); border-radius: var(--radio-pequeno) var(--radio-pequeno) 0 0; }
& .cm-caja:focus-within { border-bottom-color: var(--color-acento); background: color-mix(in srgb, var(--color-acento) 8%, var(--color-superficie)); }`,
    },
    subrayado: {
      nombre: 'Subrayado', descripcion: 'Solo una línea; al enfocar crece desde el centro',
      css: `& .cm-caja { padding: 0; border-radius: 0; border-bottom: 1.5px solid var(--color-borde); }
& .cm-linea { display: block; position: absolute; left: 0; right: 0; bottom: -1.5px; height: 2px; background: var(--color-acento); transform: scaleX(0); transition: transform var(--duracion-lenta) var(--curva-entrada); }
& .cm-caja:focus-within .cm-linea { transform: scaleX(1); }`,
    },
    flotante: {
      nombre: 'Etiqueta flotante', descripcion: 'La etiqueta está adentro y sube al escribir',
      css: `& { gap: 0; }
& .cm-etq { position: absolute; left: 12px; top: 24px; transform: translateY(-50%); padding: 0 4px; font-weight: 500; font-size: 16px; color: var(--color-texto-suave); background: var(--color-fondo); pointer-events: none; z-index: 1;
  transition: top var(--duracion-media) var(--curva-entrada), font-size var(--duracion-media) var(--curva-entrada), color var(--duracion-rapida) ease; }
& .cm-caja { border: 1.5px solid var(--color-borde); background: var(--color-fondo); }
& input::placeholder { color: transparent; }
& .cm-caja:focus-within input::placeholder { color: var(--color-texto-suave); }
&:has(input:focus) .cm-etq, &:has(input:not(:placeholder-shown)) .cm-etq { top: 0; font-size: 12px; font-weight: 600; color: var(--color-texto); }
& .cm-caja:focus-within { border-color: var(--color-acento); }
& .cm-ayuda { margin-top: 6px; }`,
    },
    pildora: {
      nombre: 'Píldora', descripcion: 'Redondo y sin borde',
      css: `& .cm-caja { border-radius: 999px; background: var(--color-superficie); padding: 0 20px; border: 1.5px solid transparent; }
& .cm-caja:focus-within { border-color: var(--color-acento); background: var(--color-fondo); ${anillo} }`,
    },
    vidrio: {
      nombre: 'Vidrio', descripcion: 'Translúcido con desenfoque',
      css: `& .cm-caja { background: color-mix(in srgb, var(--color-fondo) 45%, transparent); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid color-mix(in srgb, var(--color-texto) 22%, transparent); border-radius: 14px; }
& .cm-caja:focus-within { border-color: var(--color-acento); box-shadow: 0 0 22px color-mix(in srgb, var(--color-acento) 35%, transparent); }`,
    },
    neobrutal: {
      nombre: 'Neobrutal', descripcion: 'Borde grueso y sombra sólida; tiembla al escribir',
      css: `& .cm-caja { border: 2px solid var(--color-texto); background: var(--color-fondo); border-radius: 0; box-shadow: 4px 4px 0 var(--color-texto); }
& .cm-caja:focus-within { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 var(--color-acento); }
& .cm-caja.escribiendo { animation: cm-temblor 120ms linear; }
@keyframes cm-temblor { 25% { margin-left: 1px; } 75% { margin-left: -1px; } }`,
    },
    hundido: {
      nombre: 'Hundido', descripcion: 'Tallado hacia adentro, neumórfico',
      css: `& .cm-caja { background: var(--color-superficie); border-radius: 14px; box-shadow: inset 3px 3px 7px rgba(0,0,0,.14), inset -3px -3px 7px rgba(255,255,255,.65); }
& .cm-caja:focus-within { box-shadow: inset 4px 4px 9px rgba(0,0,0,.18), inset -4px -4px 9px rgba(255,255,255,.7), 0 0 0 2px var(--color-acento); }`,
    },
    con_icono: {
      nombre: 'Con icono', descripcion: 'Icono adentro que toma color al enfocar',
      css: `& .cm-caja { border: 1.5px solid var(--color-borde); background: var(--color-fondo); border-radius: 12px; }
& .cm-icono { display: inline-flex; }
& .cm-caja:focus-within { border-color: var(--color-acento); }
& .cm-caja:focus-within .cm-icono { color: var(--color-acento); }`,
    },
    terminal: {
      nombre: 'Terminal', descripcion: 'Monoespaciado con prompt',
      css: `& .cm-caja { background: var(--color-superficie); border-left: 3px solid var(--color-acento); border-radius: 0; font-family: ui-monospace, Menlo, monospace; }
& .cm-caja::before { content: '>'; color: var(--color-acento); font-family: ui-monospace, Menlo, monospace; font-weight: 700; }
& input { font-family: ui-monospace, Menlo, monospace; }
& .cm-etq { font-family: ui-monospace, Menlo, monospace; text-transform: lowercase; }
& .cm-caja:focus-within { background: color-mix(in srgb, var(--color-acento) 10%, var(--color-superficie)); }`,
    },
    cuaderno: {
      nombre: 'Cuaderno', descripcion: 'Renglón de papel',
      css: `& .cm-caja { padding: 0 2px; border-radius: 0; border-bottom: 2px dashed var(--color-borde); background: repeating-linear-gradient(180deg, transparent 0 46px, color-mix(in srgb, var(--color-acento) 25%, transparent) 46px 47px); }
& .cm-etq { font-style: italic; font-weight: 500; }
& .cm-caja:focus-within { border-bottom-style: solid; border-bottom-color: var(--color-acento); }`,
    },
    degradado: {
      nombre: 'Borde degradado', descripcion: 'Al enfocar, el borde se vuelve un degradado',
      css: `& .cm-caja { border: 2px solid var(--color-borde); background: var(--color-fondo); border-radius: 12px; }
& .cm-caja:focus-within { border-color: transparent; background: linear-gradient(var(--color-fondo), var(--color-fondo)) padding-box, linear-gradient(120deg, var(--color-acento), color-mix(in oklch, var(--color-acento), #FF4FD8 50%)) border-box; }`,
    },
    resplandor: {
      nombre: 'Resplandor', descripcion: 'Brilla al enfocar y late con cada tecla',
      css: `& .cm-caja { border: 1.5px solid var(--color-borde); background: var(--color-fondo); border-radius: 12px; }
& .cm-caja:focus-within { border-color: var(--color-acento); box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-acento) 22%, transparent), 0 0 20px color-mix(in srgb, var(--color-acento) 35%, transparent); }
& .cm-caja.escribiendo { animation: cm-tecla-brillo 260ms ease; }`,
    },
    grande: {
      nombre: 'Grande y limpio', descripcion: 'Letra grande, etiqueta chica en mayúsculas',
      css: `& .cm-etq { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-texto-suave); }
& .cm-caja { padding: 0; border-radius: 0; border-bottom: 2px solid var(--color-texto); min-height: 56px; }
& input { font-size: 22px; font-family: var(--fuente-titulos); }
& .cm-caja:focus-within { border-bottom-color: var(--color-acento); }`,
    },
    prefijo: {
      nombre: 'Etiqueta al costado', descripcion: 'La etiqueta va dentro, a la izquierda',
      css: `& .cm-etq { position: absolute; left: 1.5px; top: 1.5px; height: 45px; display: flex; align-items: center; padding: 0 12px; background: var(--color-superficie); border-right: 1px solid var(--color-borde); border-radius: var(--radio-pequeno) 0 0 var(--radio-pequeno); font-size: 13px; z-index: 1; }
& .cm-caja { border: 1.5px solid var(--color-borde); background: var(--color-fondo); padding-left: 96px; }
& .cm-caja:focus-within { border-color: var(--color-acento); }`,
    },
    latido: {
      nombre: 'Late al escribir', descripcion: 'Cada tecla le da un pequeño pulso',
      css: `& .cm-caja { border: 1.5px solid var(--color-borde); background: var(--color-fondo); border-radius: 10px; }
& .cm-caja:focus-within { border-color: var(--color-acento); }
& .cm-caja.escribiendo { animation: cm-tecla 180ms var(--curva-entrada); }`,
    },
    esquinas: {
      nombre: 'Esquinas', descripcion: 'Marcas en las esquinas que se cierran al enfocar',
      css: `& .cm-caja { border-radius: 0; --e: 10px; background:
  linear-gradient(var(--color-texto), var(--color-texto)) 0 0 / var(--e) 2px no-repeat, linear-gradient(var(--color-texto), var(--color-texto)) 0 0 / 2px var(--e) no-repeat,
  linear-gradient(var(--color-texto), var(--color-texto)) 100% 0 / var(--e) 2px no-repeat, linear-gradient(var(--color-texto), var(--color-texto)) 100% 0 / 2px var(--e) no-repeat,
  linear-gradient(var(--color-texto), var(--color-texto)) 0 100% / var(--e) 2px no-repeat, linear-gradient(var(--color-texto), var(--color-texto)) 0 100% / 2px var(--e) no-repeat,
  linear-gradient(var(--color-texto), var(--color-texto)) 100% 100% / var(--e) 2px no-repeat, linear-gradient(var(--color-texto), var(--color-texto)) 100% 100% / 2px var(--e) no-repeat;
  transition: --e 0s, background-size var(--duracion-lenta) var(--curva-entrada); }
& .cm-caja:focus-within { --e: 50%; }`,
    },
    se_dibuja: {
      nombre: 'Borde que se dibuja', descripcion: 'Al enfocar, el borde se traza alrededor',
      css: `& .cm-caja { border-radius: 0; box-shadow: inset 0 0 0 1px var(--color-borde); background:
  linear-gradient(var(--color-acento), var(--color-acento)) 0 0 / 0 2px no-repeat,
  linear-gradient(var(--color-acento), var(--color-acento)) 100% 0 / 2px 0 no-repeat,
  linear-gradient(var(--color-acento), var(--color-acento)) 100% 100% / 0 2px no-repeat,
  linear-gradient(var(--color-acento), var(--color-acento)) 0 100% / 2px 0 no-repeat;
  transition: background-size 500ms var(--curva-entrada); }
& .cm-caja:focus-within { background-size: 100% 2px, 2px 100%, 100% 2px, 2px 100%; }`,
    },
    tarjeta: {
      nombre: 'Tarjeta', descripcion: 'Campo dentro de una tarjeta con sombra',
      css: `& { padding: 14px 16px 12px; border-radius: 14px; background: var(--color-superficie-alta); box-shadow: 0 6px 20px rgba(0,0,0,.10); gap: 2px; }
& .cm-etq { font-size: 12px; color: var(--color-texto-suave); }
& .cm-caja { padding: 0; min-height: 36px; }
& input { padding: 4px 0; font-size: 17px; }
&:focus-within { box-shadow: 0 6px 20px rgba(0,0,0,.10), 0 0 0 2px var(--color-acento); }`,
    },
    leyenda: {
      nombre: 'Leyenda', descripcion: 'La etiqueta corta el borde de arriba',
      css: `& { padding-top: 10px; }
& .cm-etq { position: absolute; top: 2px; left: 12px; padding: 0 6px; background: var(--color-fondo); font-size: 12px; z-index: 1; }
& .cm-caja { border: 1.5px solid var(--color-borde); background: var(--color-fondo); border-radius: 10px; }
& .cm-caja:focus-within { border-color: var(--color-acento); }
&:focus-within .cm-etq { color: var(--color-acento); }`,
    },
    invertido: {
      nombre: 'Invertido', descripcion: 'Oscuro sobre claro (o al revés)',
      css: `& .cm-caja { background: var(--color-texto); color: var(--color-fondo); border-radius: 12px; }
& input { color: var(--color-fondo); caret-color: var(--color-fondo); }
& input::placeholder { color: color-mix(in srgb, var(--color-fondo) 70%, transparent); }
& .cm-caja:focus-within { box-shadow: 0 0 0 3px var(--color-acento); }`,
    },
    doble_linea: {
      nombre: 'Doble línea', descripcion: 'Dos líneas finas abajo',
      css: `& .cm-caja { padding: 0; border-radius: 0; border-bottom: 4px double var(--color-texto); }
& .cm-caja:focus-within { border-bottom-color: var(--color-acento); }`,
    },
    punteado: {
      nombre: 'Punteado', descripcion: 'Borde de puntos que se vuelve línea al enfocar',
      css: `& .cm-caja { border: 2px dotted var(--color-texto-suave); border-radius: 10px; }
& .cm-caja:focus-within { border-style: solid; border-color: var(--color-acento); }`,
    },
    icono_derecha: {
      nombre: 'Icono a la derecha', descripcion: 'Con un icono al final, como un buscador',
      css: `& .cm-caja { border: 1.5px solid var(--color-borde); border-radius: 999px; padding: 0 6px 0 18px; }
& .cm-icono { display: grid; place-items: center; order: 3; width: 36px; height: 36px; border-radius: 50%; background: var(--color-acento); color: var(--color-sobre-acento); }
& .cm-caja:focus-within { border-color: var(--color-acento); }`,
    },
    maquina: {
      nombre: 'Máquina de escribir', descripcion: 'Monoespaciado; cada tecla deja un destello',
      css: `& .cm-caja { background: var(--color-superficie); border-radius: 4px; border: 1px solid var(--color-borde); }
& input, & .cm-etq { font-family: ui-monospace, Menlo, monospace; }
& .cm-caja:focus-within { border-color: var(--color-texto); }
& .cm-caja.escribiendo { animation: cm-maquina 140ms steps(2); }
@keyframes cm-maquina { 50% { background: color-mix(in srgb, var(--color-acento) 18%, var(--color-superficie)); } }`,
    },
    invisible: {
      nombre: 'Invisible', descripcion: 'Sin bordes; aparece un fondo al enfocar',
      css: `& .cm-caja { border-radius: 10px; background: transparent; }
& .cm-caja:hover { background: color-mix(in srgb, var(--color-superficie) 60%, transparent); }
& .cm-caja:focus-within { background: var(--color-superficie); box-shadow: inset 0 0 0 2px var(--color-acento); }`,
    },
    retro: {
      nombre: 'Retro', descripcion: 'Hundido, como un formulario de los 90',
      css: `& .cm-caja { border-radius: 0; background: #FFFFFF; color: #000000; border: 2px solid; border-color: #404040 #FFFFFF #FFFFFF #404040; box-shadow: inset 1px 1px 0 #000; }
& input { color: #000000; font-family: ui-monospace, Menlo, monospace; }
& .cm-caja:focus-within { outline: 1px dotted #000; outline-offset: 2px; }`,
    },
    degradado_suave: {
      nombre: 'Fondo degradado', descripcion: 'Fondo con un degradado sutil del acento',
      css: `& .cm-caja { border-radius: 14px; border: 1px solid color-mix(in srgb, var(--color-acento) 30%, var(--color-borde)); background: linear-gradient(120deg, color-mix(in srgb, var(--color-acento) 10%, var(--color-fondo)), var(--color-fondo)); }
& .cm-caja:focus-within { background: linear-gradient(120deg, color-mix(in srgb, var(--color-acento) 18%, var(--color-fondo)), var(--color-fondo)); border-color: var(--color-acento); }`,
    },
    linea_izquierda: {
      nombre: 'Línea lateral', descripcion: 'Una barra a la izquierda que crece al enfocar',
      css: `& .cm-caja { border-radius: 0; background: var(--color-superficie); box-shadow: inset 3px 0 0 var(--color-borde); }
& .cm-caja:focus-within { box-shadow: inset 6px 0 0 var(--color-acento); }`,
    },
    sombra_flotante: {
      nombre: 'Flota al enfocar', descripcion: 'Se eleva con sombra cuando lo usás',
      css: `& .cm-caja { border: 1px solid var(--color-borde); border-radius: 12px; background: var(--color-fondo); }
& .cm-caja:focus-within { transform: translateY(-3px); border-color: var(--color-acento); box-shadow: 0 12px 28px rgba(0,0,0,.16); }`,
    },
  },
  Muestra: MuestraCampo,
};
