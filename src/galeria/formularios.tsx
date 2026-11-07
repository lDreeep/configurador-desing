// Formularios completos (cargar datos de lo que sea: un cliente, un vehículo, un pedido) y subida de archivos.
// Un mismo formulario con secciones, filas, selector, interruptor, fecha, notas y botones;
// cada diseño cambia solo el CSS. Incluye el estilo «lista agrupada», tipo ajustes del celular.

import { useId, useState, type CSSProperties } from 'react';
import type { Categoria } from './base';

const camara = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 8h3l2-3h6l2 3h3v11H4zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
  </svg>
);
const subir = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 16V4M7 9l5-5 5 5M4 16v4h16v-4" />
  </svg>
);
const reducirMov = '@media (prefers-reduced-motion: reduce) { &, & * { animation: none !important; transition: none !important; } }';

// ---------- Formulario completo ----------

const MODOS = ['Mensual', 'Semestral', 'Anual'];

function MuestraFormulario({ clase }: { clase: string; id: string }) {
  const u = useId();
  const [modo, setModo] = useState(0);
  const [activo, setActivo] = useState(true);
  const [guardado, setGuardado] = useState(false);
  return (
    <form
      className={clase}
      onSubmit={(e) => {
        e.preventDefault();
        setGuardado(true);
        window.setTimeout(() => setGuardado(false), 1800);
      }}
    >
      <header className="cm-fo-cab">
        <strong className="cm-fo-titulo">Nuevo registro</strong>
        <span className="cm-fo-ayuda">El código se genera solo al guardar.</span>
      </header>

      <section className="cm-fo-seccion">
        <span className="cm-fo-sec-titulo">Contacto</span>
        <div className="cm-fo-grupo">
          <label className="cm-fo-fila" htmlFor={`${u}-n`}>
            <span className="cm-fo-etq">Nombre</span>
            <input id={`${u}-n`} type="text" placeholder="Nombre y apellido" autoComplete="off" />
          </label>
          <label className="cm-fo-fila" htmlFor={`${u}-t`}>
            <span className="cm-fo-etq">WhatsApp</span>
            <input id={`${u}-t`} type="tel" placeholder="549 11 1234-5678" />
          </label>
        </div>
      </section>

      <section className="cm-fo-seccion">
        <span className="cm-fo-sec-titulo">Detalle</span>
        <div className="cm-fo-grupo">
          <div className="cm-fo-fila" role="group" aria-label="Modo">
            <span className="cm-fo-etq" aria-hidden="true">
              Modo
            </span>
            <span className="cm-fo-segmento" style={{ '--i': modo, '--n': MODOS.length } as CSSProperties}>
              <span className="cm-fo-seg-ind" aria-hidden="true" />
              {MODOS.map((m, i) => (
                <button key={m} type="button" aria-pressed={i === modo} onClick={() => setModo(i)}>
                  {m}
                </button>
              ))}
            </span>
          </div>
          <label className="cm-fo-fila" htmlFor={`${u}-f`}>
            <span className="cm-fo-etq">Inicio</span>
            <input id={`${u}-f`} type="date" defaultValue="2026-11-07" />
          </label>
          <label className="cm-fo-fila" htmlFor={`${u}-v`}>
            <span className="cm-fo-etq">Valor</span>
            <input id={`${u}-v`} type="text" inputMode="numeric" placeholder="$ 0" />
          </label>
          <label className="cm-fo-fila" htmlFor={`${u}-u`}>
            <span className="cm-fo-etq">Ubicación</span>
            <select id={`${u}-u`} defaultValue="">
              <option value="" disabled>
                Elegir
              </option>
              <option>Depósito norte</option>
              <option>Depósito sur</option>
              <option>Taller</option>
            </select>
          </label>
        </div>
      </section>

      <section className="cm-fo-seccion">
        <span className="cm-fo-sec-titulo">Estado</span>
        <div className="cm-fo-grupo">
          <button type="button" className="cm-fo-fila cm-fo-switch" role="switch" aria-checked={activo} onClick={() => setActivo(!activo)}>
            <span className="cm-fo-etq">Activo</span>
            <span className="cm-fo-perilla" aria-hidden="true" />
          </button>
          <button type="button" className="cm-fo-fila cm-fo-accion">
            {camara}
            <span>Sacar foto</span>
          </button>
          <label className="cm-fo-fila cm-fo-nota-campo" htmlFor={`${u}-o`}>
            <span className="cm-fo-etq">Observaciones</span>
            <textarea id={`${u}-o`} rows={2} placeholder="Algo para tener en cuenta…" />
          </label>
        </div>
        <span className="cm-fo-nota">«Sacar foto» la guarda al instante.</span>
      </section>

      <div className="cm-fo-acciones">
        <button type="button" className="cm-fo-cancelar">
          Cancelar
        </button>
        <button type="submit" className="cm-fo-guardar" aria-live="polite">
          {guardado ? '✓ Guardado' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}

// Lo común a varios diseños: filas en línea (etiqueta a la izquierda, dato a la derecha).
const enLinea = `& .cm-fo-fila { flex-direction: row; align-items: center; gap: 12px; } & .cm-fo-etq { flex: 0 0 34%; margin: 0; } & .cm-fo-fila input, & .cm-fo-fila select { flex: 1; min-width: 0; } & .cm-fo-nota-campo { flex-direction: column; align-items: stretch; } & .cm-fo-nota-campo .cm-fo-etq { flex: none; }`;

export const FORMULARIOS: Categoria = {
  id: 'formulario',
  nombre: 'Formularios completos',
  singular: 'formulario',
  descripcion: 'Para cargar datos de lo que sea: un cliente, un pedido, un turno, un vehículo. Mismo formulario, distinta forma. Probá escribir, cambiar el modo y el interruptor.',
  estructura:
    '<form class="cm-formulario cm-formulario-DISEÑO"><header class="cm-fo-cab"><strong class="cm-fo-titulo">Título</strong><span class="cm-fo-ayuda">Ayuda</span></header><section class="cm-fo-seccion"><span class="cm-fo-sec-titulo">Sección</span><div class="cm-fo-grupo"><label class="cm-fo-fila"><span class="cm-fo-etq">Nombre</span><input></label>…<div class="cm-fo-fila"><span class="cm-fo-etq">Modo</span><span class="cm-fo-segmento" style="--i: 0; --n: 3"><span class="cm-fo-seg-ind"></span><button aria-pressed="true">Mensual</button>…</span></div><button class="cm-fo-fila cm-fo-switch" role="switch" aria-checked="true"><span class="cm-fo-etq">Activo</span><span class="cm-fo-perilla"></span></button><button class="cm-fo-fila cm-fo-accion"><svg/>Sacar foto</button><label class="cm-fo-fila cm-fo-nota-campo"><span class="cm-fo-etq">Observaciones</span><textarea></textarea></label></div><span class="cm-fo-nota">Nota</span></section>…<div class="cm-fo-acciones"><button class="cm-fo-cancelar">Cancelar</button><button type="submit" class="cm-fo-guardar">Guardar</button></div></form>',
  anchoCelda: 460,
  base: `& { display: flex; flex-direction: column; gap: 18px; width: 100%; max-width: 480px; font-family: var(--fuente-texto); font-size: 14px; color: var(--color-texto); text-align: left; }
& .cm-fo-cab { display: flex; flex-direction: column; gap: 2px; }
& .cm-fo-titulo { font-family: var(--fuente-titulos); font-weight: var(--titulos-peso); font-size: 20px; }
& .cm-fo-ayuda, & .cm-fo-nota { font-size: 12.5px; color: var(--color-texto-suave); }
& .cm-fo-seccion { display: flex; flex-direction: column; gap: 8px; }
& .cm-fo-sec-titulo { font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--color-texto-suave); }
& .cm-fo-grupo { display: flex; flex-direction: column; gap: 12px; }
& .cm-fo-fila { display: flex; flex-direction: column; gap: 6px; width: 100%; font: inherit; color: inherit; text-align: left; }
& .cm-fo-etq { font-weight: 600; font-size: 13px; }
& input, & select, & textarea { width: 100%; min-height: 44px; padding: 0 12px; border: 1px solid var(--color-borde); border-radius: var(--radio-medio); background: var(--color-fondo); color: var(--color-texto); font: inherit; box-sizing: border-box; }
& textarea { padding: 10px 12px; min-height: 64px; resize: vertical; }
& input:focus, & select:focus, & textarea:focus { outline: none; border-color: var(--color-acento); box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-acento) 22%, transparent); }
& .cm-fo-segmento { position: relative; display: grid; grid-template-columns: repeat(var(--n), 1fr); padding: 3px; border-radius: var(--radio-medio); background: var(--color-superficie); }
& .cm-fo-seg-ind { position: absolute; top: 3px; bottom: 3px; left: 3px; width: calc((100% - 6px) / var(--n)); border-radius: calc(var(--radio-medio) * .75); background: var(--color-fondo); box-shadow: 0 1px 3px rgba(0,0,0,.15); transform: translateX(calc(var(--i) * 100%)); transition: transform var(--duracion-media) var(--curva-entrada); }
& .cm-fo-segmento button { position: relative; min-height: 36px; border: none; background: transparent; color: var(--color-texto-suave); font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; }
& .cm-fo-segmento button[aria-pressed='true'] { color: var(--color-texto); }
& .cm-fo-switch { flex-direction: row; justify-content: space-between; align-items: center; min-height: 44px; border: none; background: transparent; padding: 0; cursor: pointer; }
& .cm-fo-perilla { position: relative; flex: none; width: 46px; height: 28px; border-radius: 999px; background: var(--color-borde); transition: background var(--duracion-media) ease; }
& .cm-fo-perilla::after { content: ''; position: absolute; top: 3px; left: 3px; width: 22px; height: 22px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 1px 3px rgba(0,0,0,.25); transition: transform var(--duracion-media) var(--curva-entrada); }
& .cm-fo-switch[aria-checked='true'] .cm-fo-perilla { background: var(--color-acento); }
& .cm-fo-switch[aria-checked='true'] .cm-fo-perilla::after { transform: translateX(18px); }
& .cm-fo-accion { flex-direction: row; align-items: center; gap: 10px; min-height: 44px; padding: 0 12px; border: 1.5px dashed var(--color-borde); border-radius: var(--radio-medio); background: transparent; color: var(--color-acento-texto); font-weight: 700; cursor: pointer; }
& .cm-fo-acciones { display: flex; justify-content: flex-end; gap: 10px; }
& .cm-fo-acciones button { min-height: 46px; padding: 0 18px; border-radius: var(--radio-boton); font: inherit; font-weight: 700; cursor: pointer; }
& .cm-fo-cancelar { border: 1.5px solid var(--color-borde); background: transparent; color: var(--color-texto); }
& .cm-fo-guardar { border: none; background: var(--boton-color); color: var(--boton-sobre); }
& button:focus-visible { outline: 2px solid var(--color-acento); outline-offset: 2px; }
${reducirMov}`,
  disenos: {
    apilado: { nombre: 'Clásico apilado', descripcion: 'La etiqueta arriba de cada campo; el más claro y universal', css: '' },
    lista_agrupada: {
      nombre: 'Lista agrupada',
      descripcion: 'Como los ajustes del celular: grupos en tarjetas, etiqueta a la izquierda y dato a la derecha',
      css: `& { gap: 20px; } & .cm-fo-sec-titulo { padding-left: 14px; } & .cm-fo-grupo { gap: 0; border-radius: 14px; background: var(--color-superficie); overflow: hidden; } & .cm-fo-fila { flex-direction: row; align-items: center; gap: 12px; min-height: 48px; padding: 4px 14px; } & .cm-fo-fila + .cm-fo-fila { border-top: 1px solid var(--color-borde); } & .cm-fo-etq { flex: 0 0 34%; font-weight: 500; } & .cm-fo-fila input, & .cm-fo-fila select { flex: 1; min-width: 0; min-height: 40px; border: none; background: transparent; padding: 0; text-align: right; } & .cm-fo-fila input:focus, & .cm-fo-fila select:focus { box-shadow: none; } & .cm-fo-fila:focus-within { background: color-mix(in srgb, var(--color-acento) 8%, transparent); } & .cm-fo-segmento { flex: 1; } & .cm-fo-switch { padding: 4px 14px; } & .cm-fo-accion { border: none; border-radius: 0; padding: 4px 14px; } & .cm-fo-nota-campo { flex-direction: column; align-items: stretch; } & .cm-fo-nota-campo textarea { border: none; background: transparent; padding: 0; } & .cm-fo-nota { padding-left: 14px; } & .cm-fo-acciones button { flex: 1; }`,
    },
    tarjetas: { nombre: 'Secciones en tarjetas', descripcion: 'Cada sección en su card con sombra suave', css: `& .cm-fo-seccion { padding: 16px; border-radius: var(--radio-grande); background: var(--color-fondo); box-shadow: 0 1px 3px rgba(0,0,0,.06), 0 8px 24px rgba(0,0,0,.06); border: 1px solid var(--color-borde); } & .cm-fo-sec-titulo { font-size: 15px; text-transform: none; letter-spacing: 0; color: var(--color-texto); font-family: var(--fuente-titulos); }` },
    en_linea: { nombre: 'Etiqueta al costado', descripcion: 'Etiqueta a la izquierda y campo a la derecha, con bordes', css: enLinea },
    lateral: { nombre: 'Títulos al costado', descripcion: 'El nombre de cada sección en una columna a la izquierda, como una página de ajustes', css: `& .cm-fo-seccion { display: grid; grid-template-columns: 110px minmax(0, 1fr); gap: 4px 18px; padding-top: 16px; border-top: 1px solid var(--color-borde); } & .cm-fo-sec-titulo { font-size: 14px; text-transform: none; letter-spacing: 0; color: var(--color-texto); } & .cm-fo-nota { grid-column: 2; }` },
    subrayado: { nombre: 'Subrayado', descripcion: 'Solo una línea debajo de cada campo, muy limpio', css: `& input, & select, & textarea { border: none; border-bottom: 1.5px solid var(--color-borde); border-radius: 0; padding: 0 2px; background: transparent; } & input:focus, & select:focus, & textarea:focus { box-shadow: none; border-bottom-color: var(--color-acento); } & .cm-fo-accion { border-radius: 0; border-style: solid; border-width: 0 0 1.5px; padding: 0 2px; } & .cm-fo-segmento { background: transparent; border-bottom: 1.5px solid var(--color-borde); border-radius: 0; } & .cm-fo-seg-ind { top: auto; bottom: -1.5px; height: 2px; border-radius: 0; box-shadow: none; background: var(--color-acento); }` },
    relleno: { nombre: 'Campos rellenos', descripcion: 'Campos con fondo suave y sin borde', css: `& input, & select, & textarea { border: none; background: var(--color-superficie); border-bottom: 2px solid transparent; border-radius: var(--radio-medio) var(--radio-medio) 4px 4px; } & input:focus, & select:focus, & textarea:focus { box-shadow: none; border-bottom-color: var(--color-acento); }` },
    etiqueta_dentro: { nombre: 'Etiqueta adentro', descripcion: 'La etiqueta chiquita va dentro de la caja, arriba del texto', css: `& .cm-fo-fila:not(.cm-fo-switch):not(.cm-fo-accion) { position: relative; gap: 0; padding: 8px 12px 4px; border: 1px solid var(--color-borde); border-radius: var(--radio-medio); background: var(--color-fondo); } & .cm-fo-fila:not(.cm-fo-switch):not(.cm-fo-accion):focus-within { border-color: var(--color-acento); box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-acento) 22%, transparent); } & .cm-fo-etq { font-size: 11px; color: var(--color-texto-suave); } & .cm-fo-fila input, & .cm-fo-fila select, & .cm-fo-fila textarea { border: none; padding: 0; min-height: 30px; background: transparent; } & .cm-fo-fila input:focus, & .cm-fo-fila select:focus, & .cm-fo-fila textarea:focus { box-shadow: none; } & .cm-fo-segmento { margin: 4px 0; }` },
    numerado: { nombre: 'Por pasos numerados', descripcion: 'Cada sección con un número y una línea que las une', css: `& { counter-reset: paso; } & .cm-fo-seccion { position: relative; padding-left: 40px; } & .cm-fo-seccion::before { counter-increment: paso; content: counter(paso); position: absolute; left: 0; top: -2px; display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; background: var(--color-acento); color: var(--color-sobre-acento); font-weight: 800; font-size: 13px; } & .cm-fo-seccion::after { content: ''; position: absolute; left: 13px; top: 32px; bottom: -14px; width: 2px; background: var(--color-borde); } & .cm-fo-seccion:last-of-type::after { display: none; } & .cm-fo-sec-titulo { font-size: 15px; text-transform: none; letter-spacing: 0; color: var(--color-texto); }` },
    compacto: { nombre: 'Compacto', descripcion: 'Denso, para cargar muchos datos rápido en la compu', css: `& { gap: 12px; font-size: 13px; } & .cm-fo-grupo { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 12px; } & .cm-fo-nota-campo, & .cm-fo-accion, & .cm-fo-switch { grid-column: 1 / -1; } & input, & select { min-height: 36px; } & .cm-fo-fila { gap: 3px; } & .cm-fo-etq { font-size: 12px; } & .cm-fo-titulo { font-size: 17px; }` },
    oscuro: { nombre: 'Oscuro', descripcion: 'Fondo oscuro, campos un poco más claros', css: `& { padding: 20px; border-radius: var(--radio-grande); background: #15171C; color: #F1F2F4; } & .cm-fo-ayuda, & .cm-fo-nota, & .cm-fo-sec-titulo { color: #A9AFBA; } & input, & select, & textarea { background: #1F2229; border-color: #343844; color: #F1F2F4; } & .cm-fo-segmento { background: #1F2229; } & .cm-fo-seg-ind { background: #343844; } & .cm-fo-segmento button { color: #A9AFBA; } & .cm-fo-segmento button[aria-pressed='true'] { color: #FFFFFF; } & .cm-fo-perilla { background: #3A3E48; } & .cm-fo-cancelar { color: #F1F2F4; border-color: #3A3E48; } & .cm-fo-accion { border-color: #3A3E48; color: #F1F2F4; }` },
    vidrio: { nombre: 'Vidrio', descripcion: 'Todo dentro de un panel translúcido', css: `& { padding: 20px; border-radius: var(--radio-grande); background: color-mix(in srgb, var(--color-fondo) 60%, transparent); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid color-mix(in srgb, var(--color-texto) 12%, transparent); } & input, & select, & textarea { background: color-mix(in srgb, var(--color-fondo) 70%, transparent); }` },
    barra_fija: { nombre: 'Botones a lo ancho', descripcion: 'Los botones ocupan todo el ancho abajo, como en el celular', css: `& .cm-fo-acciones { flex-direction: column-reverse; gap: 8px; padding-top: 12px; border-top: 1px solid var(--color-borde); } & .cm-fo-acciones button { width: 100%; min-height: 50px; } & .cm-fo-cancelar { border: none; }` },
    neobrutal: { nombre: 'Neobrutal', descripcion: 'Bordes negros gruesos y sombras duras', css: `& input, & select, & textarea, & .cm-fo-segmento, & .cm-fo-accion { border: 2px solid var(--color-texto); border-radius: 0; box-shadow: 3px 3px 0 var(--color-texto); } & .cm-fo-accion { border-style: solid; } & input:focus, & select:focus, & textarea:focus { box-shadow: 3px 3px 0 var(--color-acento); border-color: var(--color-texto); } & .cm-fo-seg-ind { border-radius: 0; background: var(--color-acento); box-shadow: none; } & .cm-fo-segmento button[aria-pressed='true'] { color: var(--color-sobre-acento); } & .cm-fo-acciones button { border: 2px solid var(--color-texto); border-radius: 0; box-shadow: 3px 3px 0 var(--color-texto); }` },
  },
  Muestra: MuestraFormulario,
};

// ---------- Subir archivos ----------

function MuestraSubir({ clase }: { clase: string; id: string }) {
  const u = useId();
  const [archivos, setArchivos] = useState<string[]>(['comprobante.pdf']);
  const [encima, setEncima] = useState(false);
  return (
    <div className={clase}>
      <label
        className="cm-s-zona"
        htmlFor={u}
        data-encima={encima || undefined}
        onDragOver={(e) => {
          e.preventDefault();
          setEncima(true);
        }}
        onDragLeave={() => setEncima(false)}
        onDrop={(e) => {
          e.preventDefault();
          setEncima(false);
          setArchivos((a) => [...a, ...Array.from(e.dataTransfer.files).map((f) => f.name)]);
        }}
      >
        <span className="cm-s-ico">{subir}</span>
        <span className="cm-s-txt">
          <strong>Arrastrá un archivo o tocá para elegir</strong>
          <span>Fotos o PDF, hasta 10 MB</span>
        </span>
        <span className="cm-s-boton">Elegir archivo</span>
        <input id={u} type="file" multiple onChange={(e) => setArchivos((a) => [...a, ...Array.from(e.target.files ?? []).map((f) => f.name)])} />
      </label>
      <ul className="cm-s-lista">
        {archivos.map((a, i) => (
          <li key={a + i}>
            <span className="cm-s-nombre">{a}</span>
            <span className="cm-s-barra" aria-hidden="true">
              <span />
            </span>
            <button type="button" aria-label={`Quitar ${a}`} onClick={() => setArchivos((x) => x.filter((_, j) => j !== i))}>
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const SUBIR: Categoria = {
  id: 'subir',
  nombre: 'Subir archivos',
  singular: 'subida de archivos',
  descripcion: 'Para adjuntar fotos, comprobantes o documentos. Podés tocar para elegir o arrastrar un archivo.',
  estructura:
    '<div class="cm-subir cm-subir-DISEÑO"><label class="cm-s-zona" data-encima><span class="cm-s-ico"><svg/></span><span class="cm-s-txt"><strong>Arrastrá un archivo…</strong><span>Fotos o PDF</span></span><span class="cm-s-boton">Elegir archivo</span><input type="file" multiple></label><ul class="cm-s-lista"><li><span class="cm-s-nombre">comprobante.pdf</span><span class="cm-s-barra"><span></span></span><button aria-label="Quitar">×</button></li></ul></div> — data-encima mientras se arrastra un archivo encima.',
  anchoCelda: 340,
  base: `& { display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 380px; font-family: var(--fuente-texto); color: var(--color-texto); font-size: 13.5px; }
& .cm-s-zona { position: relative; display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 22px 16px; border: 2px dashed var(--color-borde); border-radius: var(--radio-grande); background: var(--color-fondo); text-align: center; cursor: pointer; transition: border-color var(--duracion-media) ease, background var(--duracion-media) ease; }
& .cm-s-zona:hover, & .cm-s-zona[data-encima] { border-color: var(--color-acento); background: color-mix(in srgb, var(--color-acento) 7%, var(--color-fondo)); }
& .cm-s-zona:focus-within { outline: 2px solid var(--color-acento); outline-offset: 2px; }
& .cm-s-zona input { position: absolute; width: 1px; height: 1px; opacity: 0; }
& .cm-s-ico { display: grid; place-items: center; width: 52px; height: 52px; border-radius: 50%; background: var(--color-superficie); color: var(--color-acento-texto); }
& .cm-s-txt { display: flex; flex-direction: column; gap: 2px; }
& .cm-s-txt span { color: var(--color-texto-suave); font-size: 12.5px; }
& .cm-s-boton { display: none; }
& .cm-s-lista { display: flex; flex-direction: column; gap: 6px; margin: 0; padding: 0; list-style: none; }
& .cm-s-lista li { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 2px 8px; padding: 8px 6px 8px 12px; border-radius: var(--radio-medio); background: var(--color-superficie); }
& .cm-s-nombre { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600; }
& .cm-s-barra { grid-column: 1; grid-row: 2; height: 4px; border-radius: 2px; background: var(--color-borde); overflow: hidden; }
& .cm-s-barra span { display: block; height: 100%; width: 100%; background: var(--color-acento); animation: cm-s-carga 1.4s var(--curva-entrada) both; }
@keyframes cm-s-carga { from { width: 0; } }
& .cm-s-lista button { grid-row: 1 / 3; grid-column: 2; width: 36px; height: 36px; border: none; border-radius: 8px; background: transparent; color: var(--color-texto-suave); font-size: 20px; cursor: pointer; }
& .cm-s-lista button:hover { background: var(--color-borde); }
& .cm-s-lista button:focus-visible { outline: 2px solid var(--color-acento); }
${reducirMov}`,
  disenos: {
    zona: { nombre: 'Zona punteada', descripcion: 'Un recuadro punteado para soltar o tocar', css: '' },
    boton: { nombre: 'Con botón', descripcion: 'Suma un botón visible de «Elegir archivo»', css: `& .cm-s-boton { display: inline-flex; align-items: center; min-height: 40px; padding: 0 16px; border-radius: var(--radio-boton); background: var(--boton-color); color: var(--boton-sobre); font-weight: 700; }` },
    fila: { nombre: 'En una fila', descripcion: 'Compacto: icono, texto y botón en una línea', css: `& .cm-s-zona { flex-direction: row; text-align: left; padding: 12px; gap: 12px; border-style: solid; border-width: 1px; } & .cm-s-ico { width: 40px; height: 40px; flex: none; } & .cm-s-txt { flex: 1; } & .cm-s-txt strong { font-size: 13px; } & .cm-s-boton { display: inline-flex; align-items: center; min-height: 36px; padding: 0 12px; border-radius: var(--radio-boton); border: 1.5px solid var(--color-borde); font-weight: 700; }` },
    tonal: { nombre: 'Tonal', descripcion: 'Zona de color suave, sin borde punteado', css: `& .cm-s-zona { border: none; background: color-mix(in srgb, var(--color-acento) 10%, var(--color-fondo)); } & .cm-s-ico { background: var(--color-acento); color: var(--color-sobre-acento); }` },
    foto: { nombre: 'Para fotos', descripcion: 'Cuadro grande con cámara, para la foto de algo', css: `& .cm-s-zona { aspect-ratio: 4 / 3; justify-content: center; border-style: solid; border-width: 1px; background: repeating-linear-gradient(45deg, var(--color-superficie) 0 10px, var(--color-fondo) 10px 20px); } & .cm-s-ico { width: 64px; height: 64px; background: var(--color-fondo); box-shadow: 0 4px 14px rgba(0,0,0,.1); }` },
    minimo: { nombre: 'Solo un link', descripcion: 'Una línea con «Adjuntar archivo», sin caja', css: `& .cm-s-zona { flex-direction: row; justify-content: flex-start; padding: 6px 0; border: none; background: transparent; gap: 8px; } & .cm-s-zona:hover { background: transparent; } & .cm-s-ico { width: 28px; height: 28px; background: transparent; } & .cm-s-ico svg { width: 20px; height: 20px; } & .cm-s-txt span { display: none; } & .cm-s-txt strong { color: var(--color-acento-texto); text-decoration: underline; text-underline-offset: 3px; font-size: 14px; }` },
    oscuro: { nombre: 'Oscuro', descripcion: 'Zona oscura con borde claro', css: `& .cm-s-zona { background: #15171C; border-color: #3A3E48; color: #F1F2F4; } & .cm-s-zona:hover, & .cm-s-zona[data-encima] { background: #1C1F26; } & .cm-s-txt span { color: #A9AFBA; } & .cm-s-ico { background: #23262E; color: #F1F2F4; }` },
    neobrutal: { nombre: 'Neobrutal', descripcion: 'Borde negro y sombra dura', css: `& .cm-s-zona { border: 2px solid var(--color-texto); border-radius: 0; box-shadow: 5px 5px 0 var(--color-texto); } & .cm-s-ico { border-radius: 0; border: 2px solid var(--color-texto); background: var(--color-acento); color: var(--color-sobre-acento); } & .cm-s-lista li { border-radius: 0; border: 2px solid var(--color-texto); background: var(--color-fondo); }` },
  },
  Muestra: MuestraSubir,
};
