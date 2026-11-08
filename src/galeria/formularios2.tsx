// Formularios en pasos (wizard) y reserva de turnos.

import { useId, useState, type CSSProperties } from 'react';
import type { Categoria } from './base';

const reducirMov = '@media (prefers-reduced-motion: reduce) { &, & * { animation: none !important; transition: none !important; } }';

// ---------- Formulario en pasos ----------

const ETAPAS = ['Tus datos', 'Detalle', 'Confirmar'];

function MuestraWizard({ clase }: { clase: string; id: string }) {
  const u = useId();
  const [i, setI] = useState(0);
  const [listo, setListo] = useState(false);
  const n = ETAPAS.length;
  return (
    <form
      className={clase}
      style={{ '--i': i, '--n': n } as CSSProperties}
      onSubmit={(e) => {
        e.preventDefault();
        if (i < n - 1) setI(i + 1);
        else setListo(true);
      }}
    >
      <ol className="cm-wz-pasos" aria-label="Pasos">
        {ETAPAS.map((p, j) => (
          <li key={p} data-estado={j < i ? 'hecho' : j === i ? 'actual' : 'pendiente'} aria-current={j === i ? 'step' : undefined}>
            <span className="cm-wz-num">{j < i ? '✓' : j + 1}</span>
            <span className="cm-wz-nombre">{p}</span>
          </li>
        ))}
      </ol>
      <span className="cm-wz-barra" aria-hidden="true">
        <span />
      </span>
      <span className="cm-wz-cuenta">
        Paso {i + 1} de {n}
      </span>
      <div className="cm-wz-cuerpo" key={i}>
        <strong className="cm-wz-titulo">{listo ? '¡Listo!' : ETAPAS[i]}</strong>
        {listo ? (
          <span className="cm-wz-ayuda">Te mandamos un email con todo.</span>
        ) : i === 0 ? (
          <>
            <label className="cm-wz-campo" htmlFor={`${u}-a`}>
              <span>Nombre</span>
              <input id={`${u}-a`} type="text" placeholder="Nombre y apellido" />
            </label>
            <label className="cm-wz-campo" htmlFor={`${u}-b`}>
              <span>Email</span>
              <input id={`${u}-b`} type="email" placeholder="vos@ejemplo.com" />
            </label>
          </>
        ) : i === 1 ? (
          <>
            <label className="cm-wz-campo" htmlFor={`${u}-c`}>
              <span>¿Qué necesitás?</span>
              <select id={`${u}-c`} defaultValue="">
                <option value="" disabled>
                  Elegir
                </option>
                <option>Una consulta</option>
                <option>Un presupuesto</option>
              </select>
            </label>
            <label className="cm-wz-campo" htmlFor={`${u}-d`}>
              <span>Contanos más</span>
              <textarea id={`${u}-d`} rows={2} placeholder="Opcional" />
            </label>
          </>
        ) : (
          <span className="cm-wz-ayuda">Revisá que esté todo bien y confirmá.</span>
        )}
      </div>
      <div className="cm-wz-acciones">
        <button type="button" className="cm-wz-atras" disabled={i === 0 || listo} onClick={() => setI(i - 1)}>
          Atrás
        </button>
        <button type="submit" className="cm-wz-siguiente" onClick={() => listo && (setListo(false), setI(0))}>
          {listo ? 'Empezar de nuevo' : i < n - 1 ? 'Siguiente' : 'Confirmar'}
        </button>
      </div>
    </form>
  );
}

export const WIZARDS: Categoria = {
  id: 'wizard',
  nombre: 'Formularios en pasos',
  singular: 'formulario en pasos',
  descripcion: 'Un registro o pedido dividido en etapas, para que no abrume. Tocá «Siguiente» y «Atrás».',
  estructura:
    '<form class="cm-wizard cm-wizard-DISEÑO" style="--i: 0; --n: 3"><ol class="cm-wz-pasos"><li data-estado="actual" aria-current="step"><span class="cm-wz-num">1</span><span class="cm-wz-nombre">Tus datos</span></li>…</ol><span class="cm-wz-barra"><span></span></span><span class="cm-wz-cuenta">Paso 1 de 3</span><div class="cm-wz-cuerpo"><strong class="cm-wz-titulo">Tus datos</strong><label class="cm-wz-campo"><span>Nombre</span><input></label>…</div><div class="cm-wz-acciones"><button class="cm-wz-atras">Atrás</button><button type="submit" class="cm-wz-siguiente">Siguiente</button></div></form> — --i es el paso actual; la barra, los pasos y la cuenta se muestran o no según el diseño.',
  anchoCelda: 380,
  base: `& { display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 420px; padding: 20px; border-radius: var(--radio-grande); background: var(--color-fondo); border: 1px solid var(--color-borde); font-family: var(--fuente-texto); font-size: 14px; color: var(--color-texto); box-sizing: border-box; }
& .cm-wz-pasos { display: grid; grid-template-columns: repeat(var(--n), 1fr); margin: 0; padding: 0; list-style: none; }
& .cm-wz-pasos li { position: relative; display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 12px; color: var(--color-texto-suave); }
& .cm-wz-pasos li + li::before { content: ''; position: absolute; top: 14px; right: calc(50% + 18px); left: calc(-50% + 18px); height: 2px; background: var(--color-borde); }
& .cm-wz-pasos li[data-estado='hecho'] + li::before, & .cm-wz-pasos li[data-estado='actual']::before { background: var(--color-acento); }
& .cm-wz-num { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; border: 2px solid var(--color-borde); background: var(--color-fondo); font-weight: 800; font-size: 12px; transition: all var(--duracion-media) var(--curva-entrada); }
& li[data-estado='hecho'] .cm-wz-num { background: var(--color-acento); border-color: var(--color-acento); color: var(--color-sobre-acento); }
& li[data-estado='actual'] .cm-wz-num { border-color: var(--color-acento); color: var(--color-acento-texto); }
& li[data-estado='actual'] { color: var(--color-texto); font-weight: 700; }
& .cm-wz-barra, & .cm-wz-cuenta { display: none; }
& .cm-wz-barra { height: 6px; border-radius: 3px; background: var(--color-superficie); overflow: hidden; }
& .cm-wz-barra span { display: block; height: 100%; width: calc((var(--i) + 1) / var(--n) * 100%); background: var(--color-acento); transition: width var(--duracion-lenta) var(--curva-entrada); }
& .cm-wz-cuenta { font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--color-texto-suave); }
& .cm-wz-cuerpo { display: flex; flex-direction: column; gap: 12px; min-height: 150px; animation: cm-wz-entra var(--duracion-lenta) var(--curva-entrada) both; }
@keyframes cm-wz-entra { from { opacity: 0; transform: translateX(14px); } }
& .cm-wz-titulo { font-family: var(--fuente-titulos); font-weight: var(--titulos-peso); font-size: 20px; }
& .cm-wz-ayuda { color: var(--color-texto-suave); }
& .cm-wz-campo { display: flex; flex-direction: column; gap: 6px; font-weight: 600; font-size: 13px; }
& input, & select, & textarea { width: 100%; min-height: 44px; padding: 0 12px; border: 1px solid var(--color-borde); border-radius: var(--radio-medio); background: var(--color-fondo); color: var(--color-texto); font: inherit; font-weight: 400; box-sizing: border-box; }
& textarea { padding: 10px 12px; min-height: 60px; }
& input:focus, & select:focus, & textarea:focus { outline: none; border-color: var(--color-acento); box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-acento) 22%, transparent); }
& .cm-wz-acciones { display: flex; justify-content: space-between; gap: 10px; }
& .cm-wz-acciones button { min-height: 46px; padding: 0 20px; border-radius: var(--radio-boton); font: inherit; font-weight: 700; cursor: pointer; }
& .cm-wz-atras { border: 1.5px solid var(--color-borde); background: transparent; color: var(--color-texto); }
& .cm-wz-atras:disabled { opacity: .4; cursor: default; }
& .cm-wz-siguiente { border: none; background: var(--boton-color); color: var(--boton-sobre); }
& button:focus-visible { outline: 2px solid var(--color-acento); outline-offset: 2px; }
${reducirMov}`,
  disenos: {
    circulos: { nombre: 'Círculos con línea', descripcion: 'Números arriba unidos por una línea', css: '' },
    barra: { nombre: 'Barra de avance', descripcion: 'Solo una barra que se llena y «Paso 1 de 3»', css: `& .cm-wz-pasos { display: none; } & .cm-wz-barra, & .cm-wz-cuenta { display: block; } & .cm-wz-cuenta { order: -1; }` },
    puntos: { nombre: 'Puntos', descripcion: 'Puntitos chicos, el actual alargado', css: `& .cm-wz-pasos { display: flex; justify-content: center; gap: 6px; } & .cm-wz-pasos li::before { display: none; } & .cm-wz-num { width: 10px; height: 10px; border: none; background: var(--color-borde); font-size: 0; } & li[data-estado='actual'] .cm-wz-num { width: 28px; border-radius: 999px; background: var(--color-acento); } & li[data-estado='hecho'] .cm-wz-num { background: color-mix(in srgb, var(--color-acento) 50%, var(--color-borde)); } & .cm-wz-nombre { display: none; } & .cm-wz-acciones { justify-content: center; }` },
    pestanas: { nombre: 'Pestañas', descripcion: 'Los pasos como pestañas con una línea debajo', css: `& .cm-wz-pasos li { flex-direction: row; justify-content: center; padding-bottom: 10px; border-bottom: 3px solid var(--color-borde); } & .cm-wz-pasos li::before { display: none; } & .cm-wz-num { width: auto; height: auto; border: none; background: transparent !important; color: inherit !important; } & .cm-wz-num::after { content: '.'; } & li[data-estado='actual'] { border-bottom-color: var(--color-acento); } & li[data-estado='hecho'] { border-bottom-color: color-mix(in srgb, var(--color-acento) 45%, var(--color-borde)); }` },
    lateral: { nombre: 'Pasos al costado', descripcion: 'Los pasos en una columna a la izquierda', css: `& { display: grid; grid-template-columns: 112px minmax(0, 1fr); max-width: 520px; column-gap: 18px; } & .cm-wz-pasos { grid-row: 1 / span 3; grid-template-columns: 1fr; align-content: start; gap: 14px; padding-right: 14px; border-right: 1px solid var(--color-borde); } & .cm-wz-pasos li { flex-direction: row; align-items: center; gap: 8px; } & .cm-wz-pasos li::before { display: none; } & .cm-wz-acciones { grid-column: 2; }` },
    conversacional: { nombre: 'Una pregunta por vez', descripcion: 'Grande y con mucho aire, sin caja', css: `& { border: none; padding: 8px 0; background: transparent; gap: 22px; } & .cm-wz-pasos { display: none; } & .cm-wz-cuenta { display: block; order: -1; color: var(--color-acento-texto); } & .cm-wz-titulo { font-size: 28px; } & input, & select, & textarea { min-height: 54px; font-size: 18px; border: none; border-bottom: 2px solid var(--color-borde); border-radius: 0; padding: 0 2px; } & input:focus, & select:focus, & textarea:focus { box-shadow: none; border-bottom-color: var(--color-acento); } & .cm-wz-cuerpo { animation-name: cm-wz-sube; } @keyframes cm-wz-sube { from { opacity: 0; transform: translateY(18px); } }` },
    oscuro: { nombre: 'Oscuro', descripcion: 'Tarjeta oscura', css: `& { background: #15171C; border-color: #2A2D35; color: #F1F2F4; } & .cm-wz-pasos li { color: #A9AFBA; } & li[data-estado='actual'] { color: #FFFFFF; } & .cm-wz-num { background: #15171C; border-color: #3A3E48; } & li[data-estado='actual'] .cm-wz-num { color: #FFFFFF; } & .cm-wz-ayuda { color: #A9AFBA; } & input, & select, & textarea { background: #1F2229; border-color: #343844; color: #F1F2F4; } & .cm-wz-atras { color: #F1F2F4; border-color: #3A3E48; } & .cm-wz-pasos li + li::before { background: #3A3E48; }` },
    neobrutal: { nombre: 'Neobrutal', descripcion: 'Bordes negros gruesos y sombras duras', css: `& { border: 2px solid var(--color-texto); border-radius: 0; box-shadow: 6px 6px 0 var(--color-texto); } & .cm-wz-num { border-radius: 0; border-color: var(--color-texto); } & li[data-estado='actual'] .cm-wz-num { background: var(--color-acento); color: var(--color-sobre-acento); } & input, & select, & textarea, & .cm-wz-acciones button { border: 2px solid var(--color-texto); border-radius: 0; box-shadow: 3px 3px 0 var(--color-texto); } & .cm-wz-pasos li + li::before { height: 3px; background: var(--color-texto) !important; }` },
  },
  Muestra: MuestraWizard,
};

// ---------- Reserva de turnos ----------

const DIAS = [
  ['Lun', '10'],
  ['Mar', '11'],
  ['Mié', '12'],
  ['Jue', '13'],
  ['Vie', '14'],
];
const HORAS = ['09:00', '09:45', '10:30', '11:15', '12:00', '14:00', '14:45', '15:30'];
const OCUPADAS = new Set(['09:45', '12:00', '14:45']);

function MuestraReserva({ clase }: { clase: string; id: string }) {
  const [dia, setDia] = useState(1);
  const [hora, setHora] = useState('10:30');
  const [confirmado, setConfirmado] = useState(false);
  return (
    <div className={clase}>
      <strong className="cm-rs-titulo">Elegí un turno</strong>
      <div className="cm-rs-dias" role="group" aria-label="Día">
        {DIAS.map(([d, n], i) => (
          <button key={d} type="button" aria-pressed={i === dia} onClick={() => setDia(i)}>
            <span className="cm-rs-dsem">{d}</span>
            <span className="cm-rs-dnum">{n}</span>
          </button>
        ))}
      </div>
      <div className="cm-rs-horas" role="group" aria-label="Horario">
        {HORAS.map((h) => (
          <button key={h} type="button" disabled={OCUPADAS.has(h)} aria-pressed={h === hora} onClick={() => setHora(h)}>
            {h}
          </button>
        ))}
      </div>
      <div className="cm-rs-resumen" aria-live="polite">
        <span>
          {DIAS[dia][0]} {DIAS[dia][1]} · {hora} hs
        </span>
        <small>45 minutos · Corte y lavado</small>
      </div>
      <button type="button" className="cm-rs-confirmar" onClick={() => setConfirmado(!confirmado)}>
        {confirmado ? '✓ Turno confirmado' : 'Confirmar turno'}
      </button>
    </div>
  );
}

export const RESERVAS: Categoria = {
  id: 'reserva',
  nombre: 'Reserva de turnos',
  singular: 'reserva de turnos',
  descripcion: 'Elegir día y horario, ver el resumen y confirmar. Los horarios ocupados no se pueden tocar.',
  estructura:
    '<div class="cm-reserva cm-reserva-DISEÑO"><strong class="cm-rs-titulo">Elegí un turno</strong><div class="cm-rs-dias" role="group"><button aria-pressed="true"><span class="cm-rs-dsem">Mar</span><span class="cm-rs-dnum">11</span></button>…</div><div class="cm-rs-horas" role="group"><button aria-pressed="true">10:30</button><button disabled>12:00</button>…</div><div class="cm-rs-resumen"><span>Mar 11 · 10:30 hs</span><small>45 minutos · Servicio</small></div><button class="cm-rs-confirmar">Confirmar turno</button></div> — los horarios ocupados van con disabled.',
  anchoCelda: 360,
  base: `& { display: flex; flex-direction: column; gap: 14px; width: 100%; max-width: 400px; padding: 18px; border-radius: var(--radio-grande); background: var(--color-fondo); border: 1px solid var(--color-borde); font-family: var(--fuente-texto); color: var(--color-texto); font-size: 14px; box-sizing: border-box; }
& .cm-rs-titulo { font-family: var(--fuente-titulos); font-weight: var(--titulos-peso); font-size: 18px; }
& .cm-rs-dias { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px; }
& .cm-rs-dias button { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 8px 0; border: 1px solid var(--color-borde); border-radius: var(--radio-medio); background: var(--color-fondo); color: var(--color-texto); font: inherit; cursor: pointer; }
& .cm-rs-dsem { font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--color-texto-suave); }
& .cm-rs-dnum { font-size: 18px; font-weight: 800; }
& .cm-rs-dias button[aria-pressed='true'] { background: var(--color-acento); border-color: var(--color-acento); color: var(--color-sobre-acento); }
& .cm-rs-dias button[aria-pressed='true'] .cm-rs-dsem { color: var(--color-sobre-acento); }
& .cm-rs-horas { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; }
& .cm-rs-horas button { min-height: 40px; border: 1px solid var(--color-borde); border-radius: 999px; background: var(--color-fondo); color: var(--color-texto); font: inherit; font-weight: 600; font-variant-numeric: tabular-nums; cursor: pointer; transition: background var(--duracion-rapida) ease; }
& .cm-rs-horas button:hover:not(:disabled) { background: var(--color-superficie); }
& .cm-rs-horas button:disabled { color: var(--color-texto-suave); text-decoration: line-through; opacity: .55; cursor: default; }
& .cm-rs-horas button[aria-pressed='true'] { background: var(--color-texto); border-color: var(--color-texto); color: var(--color-fondo); }
& .cm-rs-resumen { display: flex; flex-direction: column; gap: 2px; padding: 10px 12px; border-radius: var(--radio-medio); background: var(--color-superficie); font-weight: 700; }
& .cm-rs-resumen small { font-weight: 400; color: var(--color-texto-suave); }
& .cm-rs-confirmar { min-height: 48px; border: none; border-radius: var(--radio-boton); background: var(--boton-color); color: var(--boton-sobre); font: inherit; font-weight: 800; cursor: pointer; }
& button:focus-visible { outline: 2px solid var(--color-acento); outline-offset: 2px; }
${reducirMov}`,
  disenos: {
    pastillas: { nombre: 'Pastillas', descripcion: 'Días en cuadros y horarios en pastillas', css: '' },
    cuadros: { nombre: 'Grilla de cuadros', descripcion: 'Horarios en cuadros con esquinas suaves', css: `& .cm-rs-horas { grid-template-columns: repeat(4, minmax(0, 1fr)); } & .cm-rs-horas button { border-radius: var(--radio-medio); min-height: 46px; } & .cm-rs-horas button[aria-pressed='true'] { background: var(--color-acento); border-color: var(--color-acento); color: var(--color-sobre-acento); }` },
    lista: { nombre: 'Lista de horarios', descripcion: 'Los horarios uno debajo del otro, con la duración', css: `& .cm-rs-horas { grid-template-columns: 1fr; gap: 0; border: 1px solid var(--color-borde); border-radius: var(--radio-medio); overflow: hidden; } & .cm-rs-horas button { border: none; border-radius: 0; text-align: left; padding: 0 14px; display: flex; justify-content: space-between; align-items: center; } & .cm-rs-horas button::after { content: 'Libre'; font-size: 12px; font-weight: 600; color: color-mix(in srgb, var(--color-exito) 78%, var(--color-texto)); } & .cm-rs-horas button:disabled::after { content: 'Ocupado'; color: var(--color-texto-suave); } & .cm-rs-horas button + button { border-top: 1px solid var(--color-borde); } & .cm-rs-horas button[aria-pressed='true']::after { content: 'Elegido'; color: inherit; } & .cm-rs-horas button:nth-child(n+6) { display: none; }` },
    tonal: { nombre: 'Tonal', descripcion: 'Fondos suaves del acento, sin bordes', css: `& { border: none; background: var(--color-superficie); } & .cm-rs-dias button, & .cm-rs-horas button { border-color: transparent; background: var(--color-fondo); } & .cm-rs-dias button[aria-pressed='true'] { background: var(--color-acento); color: var(--color-sobre-acento); } & .cm-rs-horas button[aria-pressed='true'] { background: color-mix(in srgb, var(--color-acento) 22%, var(--color-fondo)); color: var(--color-texto); border-color: var(--color-acento); } & .cm-rs-resumen { background: var(--color-fondo); }` },
    franja: { nombre: 'Días en franja', descripcion: 'Los días como una franja que se desliza, el elegido subrayado', css: `& .cm-rs-dias { gap: 0; border-bottom: 1px solid var(--color-borde); } & .cm-rs-dias button { border: none; border-radius: 0; background: transparent; border-bottom: 3px solid transparent; } & .cm-rs-dias button[aria-pressed='true'] { background: transparent; color: var(--color-texto); border-bottom-color: var(--color-acento); } & .cm-rs-dias button[aria-pressed='true'] .cm-rs-dsem { color: var(--color-acento-texto); }` },
    sin_caja: { nombre: 'Sin caja', descripcion: 'Directo sobre la página, sin borde', css: `& { border: none; padding: 4px 0; background: transparent; } & .cm-rs-resumen { background: transparent; padding: 0; border-top: 1px solid var(--color-borde); padding-top: 12px; border-radius: 0; }` },
    oscuro: { nombre: 'Oscuro', descripcion: 'Tarjeta oscura', css: `& { background: #15171C; border-color: #2A2D35; color: #F1F2F4; } & .cm-rs-dias button, & .cm-rs-horas button { background: #1F2229; border-color: #343844; color: #F1F2F4; } & .cm-rs-dias button[aria-pressed='true'] { background: var(--color-acento); border-color: var(--color-acento); color: var(--color-sobre-acento); } & .cm-rs-dias button[aria-pressed='true'] .cm-rs-dsem { color: var(--color-sobre-acento); } & .cm-rs-dsem, & .cm-rs-resumen small { color: #A9AFBA; } & .cm-rs-horas button:disabled { color: #8A909C; } & .cm-rs-horas button[aria-pressed='true'] { background: #F1F2F4; color: #15171C; } & .cm-rs-resumen { background: #1F2229; }` },
    neobrutal: { nombre: 'Neobrutal', descripcion: 'Bordes negros y sombras duras', css: `& { border: 2px solid var(--color-texto); border-radius: 0; box-shadow: 6px 6px 0 var(--color-texto); } & .cm-rs-dias button, & .cm-rs-horas button, & .cm-rs-confirmar { border: 2px solid var(--color-texto); border-radius: 0; } & .cm-rs-horas button[aria-pressed='true'] { background: var(--color-acento); color: var(--color-sobre-acento); box-shadow: 3px 3px 0 var(--color-texto); } & .cm-rs-resumen { border-radius: 0; border: 2px dashed var(--color-texto); background: transparent; }` },
  },
  Muestra: MuestraReserva,
};
