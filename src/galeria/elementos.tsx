// Elementos de interfaz: etiquetas, avisos, carga, progreso, acordeones, avatares, tooltips y ventanas modales.

import { useRef, type CSSProperties } from 'react';
import { type Categoria, reanimar } from './base';
import { Icono } from './iconos';

const sinMovimiento = '@media (prefers-reduced-motion: reduce) { & *, & { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition: none !important; } }';

// ---------- Etiquetas ----------

export const ETIQUETAS: Categoria = {
  id: 'etiqueta',
  nombre: 'Etiquetas y chips',
  singular: 'etiqueta',
  descripcion: 'Para estados, categorías, descuentos y filtros.',
  estructura: '<span class="cm-etiqueta cm-etiqueta-DISEÑO">Nuevo</span>',
  anchoCelda: 240,
  base: `& { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px; font-family: var(--fuente-texto); font-size: 12px; font-weight: 700; line-height: 1.4; color: var(--color-texto); background: var(--color-superficie); white-space: nowrap; }`,
  disenos: {
    suave: { nombre: 'Suave', descripcion: 'Fondo tenue del acento', css: `& { background: color-mix(in srgb, var(--color-acento) 16%, var(--color-fondo)); }` },
    solida: { nombre: 'Sólida', descripcion: 'Fondo de acento', css: `& { background: var(--color-acento); color: var(--color-sobre-acento); }` },
    contorno: { nombre: 'Contorno', descripcion: 'Solo el borde', css: `& { background: transparent; box-shadow: inset 0 0 0 1.5px var(--color-borde); }` },
    punto: { nombre: 'Con punto', descripcion: 'Un punto de color antes del texto', css: `& { background: transparent; box-shadow: inset 0 0 0 1px var(--color-borde); } &::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: var(--color-acento); }` },
    cuadrada: { nombre: 'Cuadrada', descripcion: 'Mayúsculas y esquinas rectas', css: `& { border-radius: 4px; text-transform: uppercase; letter-spacing: 0.08em; font-size: 11px; }` },
    neobrutal: { nombre: 'Neobrutal', descripcion: 'Borde negro y sombra', css: `& { border-radius: 4px; background: var(--color-fondo); border: 2px solid var(--color-texto); box-shadow: 2px 2px 0 var(--color-texto); }` },
    vidrio: { nombre: 'Vidrio', descripcion: 'Translúcida', css: `& { background: color-mix(in srgb, var(--color-fondo) 40%, transparent); border: 1px solid color-mix(in srgb, var(--color-texto) 18%, transparent); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }` },
    sello: { nombre: 'Sello', descripcion: 'Torcida, como un sello', css: `& { background: transparent; color: var(--color-acento); box-shadow: inset 0 0 0 2px var(--color-acento); border-radius: 6px; text-transform: uppercase; letter-spacing: 0.1em; transform: rotate(-4deg); }` },
    colgante: { nombre: 'Etiqueta colgante', descripcion: 'Con forma de etiqueta de precio', css: `& { border-radius: 0 6px 6px 0; padding-left: 16px; background: var(--color-acento); color: var(--color-sobre-acento); clip-path: polygon(10px 0, 100% 0, 100% 100%, 10px 100%, 0 50%); }` },
    mono: { nombre: 'Código', descripcion: 'Monoespaciada, técnica', css: `& { border-radius: 4px; font-family: ui-monospace, Menlo, monospace; font-weight: 600; background: var(--color-superficie); box-shadow: inset 0 0 0 1px var(--color-borde); }` },
  },
  Muestra: ({ clase }) => (
    <div className="cm-fila-etiquetas">
      {['Nuevo', 'En stock', 'Pendiente', '20% off', 'Diseño'].map((t) => (
        <span key={t} className={clase}>
          {t}
        </span>
      ))}
    </div>
  ),
};

// ---------- Avisos ----------

function MuestraAviso({ clase }: { clase: string; id: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="cm-grupo-controles">
      <div ref={ref} className={`${clase} cm-entra`} role="status">
        <span className="cm-aviso-ico">
          <Icono nombre="check" tamano={18} />
        </span>
        <span className="cm-aviso-texto">
          <strong>Guardado</strong>
          <span>Tus cambios ya están en la nube.</span>
        </span>
        <button type="button" className="cm-aviso-x" aria-label="Cerrar aviso" onClick={() => reanimar(ref.current, 'cm-entra')}>
          ×
        </button>
      </div>
      <button type="button" className="cm-repetir" onClick={() => reanimar(ref.current, 'cm-entra')}>
        Mostrar de nuevo
      </button>
    </div>
  );
}

export const AVISOS: Categoria = {
  id: 'aviso',
  nombre: 'Avisos',
  singular: 'aviso',
  descripcion: 'Confirmaciones y notificaciones. Tocá «Mostrar de nuevo» para ver cómo entran.',
  estructura: '<div class="cm-aviso cm-aviso-DISEÑO cm-entra" role="status"><span class="cm-aviso-ico">(icono)</span><span class="cm-aviso-texto"><strong>Título</strong><span>Detalle</span></span><button class="cm-aviso-x" aria-label="Cerrar">×</button></div> — la clase .cm-entra dispara la animación de entrada.',
  anchoCelda: 320,
  base: `& { display: flex; align-items: flex-start; gap: 12px; width: 100%; max-width: 340px; padding: 14px 14px 14px 16px; border-radius: var(--radio-medio); background: var(--color-superficie-alta); color: var(--color-texto); font-family: var(--fuente-texto); box-shadow: 0 8px 24px rgba(0,0,0,.14); }
& .cm-aviso-ico { flex-shrink: 0; display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; background: var(--color-exito); color: var(--color-fondo); }
& .cm-aviso-texto { flex: 1; display: flex; flex-direction: column; gap: 2px; font-size: 14px; }
& .cm-aviso-texto span { color: var(--color-texto-suave); font-size: 13px; }
& .cm-aviso-x { flex-shrink: 0; width: 32px; height: 32px; margin: -6px -6px 0 0; border: none; border-radius: 8px; background: transparent; color: var(--color-texto-suave); font-size: 20px; line-height: 1; cursor: pointer; }
& .cm-aviso-x:hover { background: var(--color-superficie); }
&.cm-entra { animation: cm-aviso-entra 420ms var(--curva-entrada) both; }
@keyframes cm-aviso-entra { from { opacity: 0; transform: translateY(12px) scale(.97); } }
${sinMovimiento}`,
  disenos: {
    tarjeta: { nombre: 'Tarjeta', descripcion: 'Blanca con sombra, la más común', css: '' },
    barra: { nombre: 'Barra lateral', descripcion: 'Una línea de color a la izquierda', css: `& { border-left: 4px solid var(--color-exito); border-radius: 6px; } & .cm-aviso-ico { background: transparent; color: var(--color-exito); }` },
    oscura: { nombre: 'Oscura', descripcion: 'Fondo oscuro, texto claro', css: `& { background: #15171C; color: #FFFFFF; } & .cm-aviso-texto span { color: #B8BDC7; } & .cm-aviso-x { color: #B8BDC7; } & .cm-aviso-x:hover { background: rgba(255,255,255,.1); }` },
    tonal: { nombre: 'Tonal', descripcion: 'Fondo suave del color del estado', css: `& { box-shadow: none; background: color-mix(in srgb, var(--color-exito) 14%, var(--color-fondo)); border: 1px solid color-mix(in srgb, var(--color-exito) 35%, transparent); }` },
    vidrio: { nombre: 'Vidrio', descripcion: 'Translúcido con desenfoque', css: `& { background: color-mix(in srgb, var(--color-fondo) 55%, transparent); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1px solid color-mix(in srgb, var(--color-texto) 14%, transparent); }` },
    neobrutal: { nombre: 'Neobrutal', descripcion: 'Borde y sombra sólida', css: `& { border-radius: 0; border: 2px solid var(--color-texto); box-shadow: 5px 5px 0 var(--color-texto); background: var(--color-fondo); } & .cm-aviso-ico { border-radius: 0; }` },
    desde_arriba: { nombre: 'Cae desde arriba', descripcion: 'Entra de arriba con un rebote', css: `&.cm-entra { animation: cm-aviso-cae 600ms cubic-bezier(.3,1.5,.5,1) both; } @keyframes cm-aviso-cae { from { opacity: 0; transform: translateY(-30px); } }` },
    temporizador: { nombre: 'Con tiempo', descripcion: 'Una barra muestra cuánto falta para cerrarse', css: `& { position: relative; overflow: hidden; } &::after { content: ''; position: absolute; left: 0; bottom: 0; height: 3px; width: 100%; background: var(--color-exito); transform-origin: left; } &.cm-entra::after { animation: cm-aviso-tiempo 4s linear both; } @keyframes cm-aviso-tiempo { from { transform: scaleX(1); } to { transform: scaleX(0); } }` },
  },
  Muestra: MuestraAviso,
};

// ---------- Cargando ----------

export const CARGANDO: Categoria = {
  id: 'cargando',
  nombre: 'Cargando',
  singular: 'indicador de carga',
  descripcion: 'Lo que se ve mientras algo carga.',
  estructura: '<div class="cm-cargando cm-cargando-DISEÑO" role="status" aria-label="Cargando"><span></span><span></span><span></span></div>',
  anchoCelda: 200,
  base: `& { position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 6px; width: 56px; height: 56px; color: var(--color-acento); }
& span { display: none; }
@media (prefers-reduced-motion: reduce) { & *, & { animation-duration: 3s !important; } }`,
  disenos: {
    anillo: { nombre: 'Anillo', descripcion: 'El clásico que gira', css: `& { width: 40px; height: 40px; border-radius: 50%; border: 4px solid color-mix(in srgb, currentColor 22%, transparent); border-top-color: currentColor; animation: cm-girar 800ms linear infinite; } @keyframes cm-girar { to { transform: rotate(360deg); } }` },
    puntos: { nombre: 'Puntos que saltan', descripcion: 'Tres puntos que rebotan', css: `& span { display: block; width: 10px; height: 10px; border-radius: 50%; background: currentColor; animation: cm-saltar 900ms ease-in-out infinite; } & span:nth-child(2) { animation-delay: 150ms; } & span:nth-child(3) { animation-delay: 300ms; } @keyframes cm-saltar { 0%, 80%, 100% { transform: translateY(0); opacity: .5; } 40% { transform: translateY(-12px); opacity: 1; } }` },
    barras: { nombre: 'Barras', descripcion: 'Tres barras que crecen', css: `& span { display: block; width: 6px; height: 28px; border-radius: 3px; background: currentColor; animation: cm-barras 900ms ease-in-out infinite; } & span:nth-child(2) { animation-delay: 120ms; } & span:nth-child(3) { animation-delay: 240ms; } @keyframes cm-barras { 0%, 100% { transform: scaleY(.4); } 50% { transform: scaleY(1); } }` },
    pulso: { nombre: 'Pulso', descripcion: 'Un círculo que late y se expande', css: `& span:first-child { display: block; position: absolute; width: 40px; height: 40px; border-radius: 50%; background: currentColor; animation: cm-pulso 1200ms ease-out infinite; } @keyframes cm-pulso { from { transform: scale(.3); opacity: 1; } to { transform: scale(1.3); opacity: 0; } }` },
    linea: { nombre: 'Línea', descripcion: 'Una barra que recorre de lado a lado', css: `& { width: 140px; height: 6px; border-radius: 3px; background: color-mix(in srgb, currentColor 18%, transparent); overflow: hidden; } & span:first-child { display: block; position: absolute; left: 0; top: 0; bottom: 0; width: 40%; border-radius: 3px; background: currentColor; animation: cm-linea 1100ms ease-in-out infinite; } @keyframes cm-linea { from { transform: translateX(-100%); } to { transform: translateX(260%); } }` },
    orbita: { nombre: 'Órbita', descripcion: 'Un punto que gira alrededor', css: `& { width: 44px; height: 44px; border-radius: 50%; border: 2px solid color-mix(in srgb, currentColor 22%, transparent); animation: cm-girar 1100ms linear infinite; } & span:first-child { display: block; position: absolute; top: -6px; left: 50%; width: 10px; height: 10px; margin-left: -5px; border-radius: 50%; background: currentColor; } @keyframes cm-girar { to { transform: rotate(360deg); } }` },
    esqueleto: { nombre: 'Esqueleto', descripcion: 'Líneas grises con brillo que pasa', css: `& { flex-direction: column; align-items: stretch; width: 180px; height: auto; gap: 8px; } & span { display: block; height: 12px; border-radius: 6px; background: linear-gradient(90deg, var(--color-superficie) 25%, color-mix(in srgb, var(--color-superficie) 50%, var(--color-fondo)) 50%, var(--color-superficie) 75%); background-size: 200% 100%; animation: cm-brillo 1300ms linear infinite; } & span:nth-child(2) { width: 80%; } & span:nth-child(3) { width: 55%; } @keyframes cm-brillo { from { background-position: 200% 0; } to { background-position: -200% 0; } }` },
    cuadrados: { nombre: 'Cuadrados', descripcion: 'Tres cuadrados que giran a destiempo', css: `& span { display: block; width: 12px; height: 12px; border-radius: 2px; background: currentColor; animation: cm-cuadrado 1200ms ease-in-out infinite; } & span:nth-child(2) { animation-delay: 200ms; } & span:nth-child(3) { animation-delay: 400ms; } @keyframes cm-cuadrado { 0%, 100% { transform: rotate(0) scale(1); } 50% { transform: rotate(180deg) scale(.6); } }` },
    onda: { nombre: 'Onda', descripcion: 'Puntos que suben y bajan en ola', css: `& span { display: block; width: 8px; height: 8px; border-radius: 50%; background: currentColor; animation: cm-onda 1000ms ease-in-out infinite; } & span:nth-child(2) { animation-delay: 100ms; } & span:nth-child(3) { animation-delay: 200ms; } @keyframes cm-onda { 0%, 100% { transform: translateY(6px); } 50% { transform: translateY(-6px); } }` },
    dona: { nombre: 'Dona', descripcion: 'Un arco de color que da vueltas', css: `& { width: 42px; height: 42px; border-radius: 50%; background: conic-gradient(currentColor 0 30%, color-mix(in srgb, currentColor 18%, transparent) 30%); -webkit-mask: radial-gradient(circle, transparent 13px, #000 14px); mask: radial-gradient(circle, transparent 13px, #000 14px); animation: cm-girar 900ms linear infinite; } @keyframes cm-girar { to { transform: rotate(360deg); } }` },
  },
  Muestra: ({ clase }) => (
    <div className={clase} role="status" aria-label="Cargando">
      <span />
      <span />
      <span />
    </div>
  ),
};

// ---------- Progreso ----------

function MuestraProgreso({ clase }: { clase: string; id: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="cm-grupo-controles cm-ancho">
      <div ref={ref} className={clase} style={{ '--p': '64%' } as CSSProperties}>
        <div className="cm-etq">
          <span>Subiendo archivos</span>
          <span>64%</span>
        </div>
        <div className="cm-pista" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={64} aria-label="Subiendo archivos">
          <span className="cm-relleno" />
        </div>
      </div>
      <button type="button" className="cm-repetir" onClick={() => reanimar(ref.current?.querySelector('.cm-relleno') ?? null, 'cm-anima')}>
        Repetir
      </button>
    </div>
  );
}

export const PROGRESO: Categoria = {
  id: 'progreso',
  nombre: 'Barras de progreso',
  singular: 'barra de progreso',
  descripcion: 'Para mostrar avance: subidas, pasos, metas.',
  estructura: '<div class="cm-progreso cm-progreso-DISEÑO" style="--p: 64%"><div class="cm-etq"><span>Texto</span><span>64%</span></div><div class="cm-pista" role="progressbar" aria-valuenow="64"><span class="cm-relleno"></span></div></div>',
  anchoCelda: 280,
  base: `& { display: flex; flex-direction: column; gap: 8px; width: 100%; max-width: 320px; font-family: var(--fuente-texto); color: var(--color-texto); }
& .cm-etq { display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; }
& .cm-etq span:last-child { color: var(--color-texto-suave); font-variant-numeric: tabular-nums; }
& .cm-pista { position: relative; height: 8px; border-radius: 999px; background: var(--color-superficie); overflow: hidden; }
& .cm-relleno { position: absolute; inset: 0 auto 0 0; width: var(--p); border-radius: inherit; background: var(--color-acento); animation: cm-llenar 1100ms var(--curva-entrada) both; }
& .cm-relleno.cm-anima { animation: cm-llenar 1100ms var(--curva-entrada) both; }
@keyframes cm-llenar { from { width: 0; } }
${sinMovimiento}`,
  disenos: {
    fina: { nombre: 'Fina', descripcion: 'Línea delgada y redondeada', css: '' },
    gruesa: { nombre: 'Gruesa', descripcion: 'Ancha, con el porcentaje bien visible', css: `& .cm-pista { height: 16px; }` },
    rayada: { nombre: 'Rayada', descripcion: 'Con rayas que se mueven', css: `& .cm-pista { height: 14px; } & .cm-relleno { background-image: repeating-linear-gradient(45deg, rgba(255,255,255,.28) 0 8px, transparent 8px 16px); background-size: 22.6px 22.6px; animation: cm-llenar 1100ms var(--curva-entrada) both, cm-rayas 700ms linear infinite; } @keyframes cm-rayas { to { background-position: 22.6px 0; } }` },
    degradado: { nombre: 'Degradado', descripcion: 'El relleno cambia de color', css: `& .cm-pista { height: 10px; } & .cm-relleno { background: linear-gradient(90deg, color-mix(in srgb, var(--color-acento) 55%, var(--color-fondo)), var(--color-acento)); }` },
    pasos: { nombre: 'Por pasos', descripcion: 'Dividida en bloques', css: `& .cm-pista { height: 12px; border-radius: 3px; -webkit-mask: repeating-linear-gradient(90deg, #000 0 calc(10% - 3px), transparent calc(10% - 3px) 10%); mask: repeating-linear-gradient(90deg, #000 0 calc(10% - 3px), transparent calc(10% - 3px) 10%); }` },
    circular: { nombre: 'Circular', descripcion: 'Un anillo que se completa', css: `& { flex-direction: row-reverse; align-items: center; justify-content: flex-end; gap: 14px; } & .cm-etq { flex-direction: column; } & .cm-pista { width: 64px; height: 64px; flex-shrink: 0; border-radius: 50%; background: conic-gradient(var(--color-acento) var(--p), var(--color-superficie) 0); -webkit-mask: radial-gradient(circle, transparent 23px, #000 24px); mask: radial-gradient(circle, transparent 23px, #000 24px); } & .cm-relleno { display: none; }` },
    neobrutal: { nombre: 'Neobrutal', descripcion: 'Borde negro, relleno plano', css: `& .cm-pista { height: 18px; border-radius: 0; border: 2px solid var(--color-texto); background: var(--color-fondo); box-shadow: 3px 3px 0 var(--color-texto); } & .cm-relleno { border-radius: 0; border-right: 2px solid var(--color-texto); }` },
    brillo: { nombre: 'Con brillo', descripcion: 'Un destello recorre el relleno', css: `& .cm-pista { height: 10px; } & .cm-relleno { box-shadow: 0 0 10px color-mix(in srgb, var(--color-acento) 60%, transparent); overflow: hidden; } & .cm-relleno::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent); transform: translateX(-100%); animation: cm-destello 1800ms ease-in-out infinite; } @keyframes cm-destello { to { transform: translateX(100%); } }` },
  },
  Muestra: MuestraProgreso,
};

// ---------- Acordeón ----------

const PREGUNTAS = [
  ['¿Cuánto tarda el envío?', 'Entre 24 y 72 horas hábiles, según tu zona.'],
  ['¿Puedo cambiar el producto?', 'Sí, tenés 30 días para cambiarlo sin costo.'],
  ['¿Qué medios de pago aceptan?', 'Tarjetas, transferencia y billeteras virtuales.'],
];

export const ACORDEONES: Categoria = {
  id: 'acordeon',
  nombre: 'Acordeones',
  singular: 'acordeón',
  descripcion: 'Preguntas frecuentes que se abren y se cierran. Tocá cada una.',
  estructura: '<div class="cm-acordeon cm-acordeon-DISEÑO"><details><summary>Pregunta</summary><div class="cm-resp">Respuesta</div></details>…</div>',
  anchoCelda: 320,
  base: `& { display: flex; flex-direction: column; width: 100%; max-width: 360px; font-family: var(--fuente-texto); color: var(--color-texto); }
& summary { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 48px; padding: 10px 4px; font-weight: 600; font-size: 15px; cursor: pointer; list-style: none; }
& summary::-webkit-details-marker { display: none; }
& summary::after { content: ''; flex-shrink: 0; width: 9px; height: 9px; border-right: 2px solid currentColor; border-bottom: 2px solid currentColor; transform: rotate(45deg) translateY(-3px); transition: transform var(--duracion-media) var(--curva-entrada); }
& details[open] summary::after { transform: rotate(-135deg) translateY(-3px); }
& summary:focus-visible { outline: 2px solid var(--color-acento); outline-offset: 2px; border-radius: 6px; }
& .cm-resp { padding: 0 4px 14px; font-size: 14px; color: var(--color-texto-suave); }
& details[open] .cm-resp { animation: cm-abrir var(--duracion-lenta) var(--curva-entrada); }
@keyframes cm-abrir { from { opacity: 0; transform: translateY(-6px); } }
& details + details { border-top: 1px solid var(--color-borde); }
${sinMovimiento}`,
  disenos: {
    lineas: { nombre: 'Con líneas', descripcion: 'Separadas por líneas finas', css: '' },
    tarjetas: { nombre: 'Tarjetas', descripcion: 'Cada pregunta es una tarjeta', css: `& { gap: 8px; } & details + details { border-top: none; } & details { padding: 0 12px; border-radius: var(--radio-medio); background: var(--color-superficie); }` },
    mas_menos: { nombre: 'Más y menos', descripcion: 'Un + que se vuelve −', css: `& summary::after { content: '+'; width: auto; height: auto; border: none; transform: none; font-size: 22px; font-weight: 400; line-height: 1; } & details[open] summary::after { content: '−'; transform: none; }` },
    numerado: { nombre: 'Numerado', descripcion: 'Con número grande adelante', css: `& { counter-reset: preg; } & summary { justify-content: flex-start; } & summary::before { counter-increment: preg; content: counter(preg, decimal-leading-zero); font-family: var(--fuente-titulos); color: var(--color-acento); font-size: 14px; } & summary::after { margin-left: auto; }` },
    resaltado: { nombre: 'Abierta resaltada', descripcion: 'La abierta se pinta con una barra de color', css: `& details { padding: 0 12px; border-left: 3px solid transparent; transition: background-color var(--duracion-media) ease; } & details[open] { background: color-mix(in srgb, var(--color-acento) 10%, var(--color-fondo)); border-left-color: var(--color-acento); }` },
    grande: { nombre: 'Grande', descripcion: 'Preguntas con letra de título', css: `& summary { font-family: var(--fuente-titulos); font-size: 19px; font-weight: var(--subtitulos-peso); min-height: 60px; } & details + details { border-top: 1.5px solid var(--color-texto); }` },
  },
  Muestra: ({ clase }) => (
    <div className={clase}>
      {PREGUNTAS.map(([p, r], i) => (
        <details key={p} open={i === 0}>
          <summary>{p}</summary>
          <div className="cm-resp">{r}</div>
        </details>
      ))}
    </div>
  ),
};

// ---------- Avatares ----------

export const AVATARES: Categoria = {
  id: 'avatar',
  nombre: 'Avatares',
  singular: 'avatar',
  descripcion: 'Fotos o iniciales de personas, sueltas o en grupo.',
  estructura: '<div class="cm-avatar cm-avatar-DISEÑO"><span class="cm-av" data-estado="activo">AL</span>…<span class="cm-av cm-mas">+3</span></div>',
  anchoCelda: 240,
  base: `& { display: flex; align-items: center; gap: 8px; font-family: var(--fuente-texto); }
& .cm-av { position: relative; display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; background: var(--color-acento); color: var(--color-sobre-acento); font-size: 15px; font-weight: 700; }
& .cm-av:nth-child(2) { background: color-mix(in srgb, var(--color-acento) 55%, var(--color-texto)); color: #FFFFFF; }
& .cm-av:nth-child(3) { background: var(--color-superficie); color: var(--color-texto); }
& .cm-mas { background: var(--color-texto) !important; color: var(--color-fondo) !important; font-size: 13px; }`,
  disenos: {
    circulo: { nombre: 'Círculos', descripcion: 'Uno al lado del otro', css: '' },
    cuadrado: { nombre: 'Cuadrados suaves', descripcion: 'Esquinas redondeadas', css: `& .cm-av { border-radius: 12px; }` },
    apilados: { nombre: 'Apilados', descripcion: 'Superpuestos, con un borde que los separa', css: `& { gap: 0; } & .cm-av { box-shadow: 0 0 0 3px var(--color-fondo); transition: transform var(--duracion-media) var(--curva-entrada); } & .cm-av + .cm-av { margin-left: -12px; } & .cm-av:hover { transform: translateY(-4px); z-index: 1; }` },
    anillo: { nombre: 'Con anillo', descripcion: 'Un anillo de color, como las historias', css: `& .cm-av { box-shadow: 0 0 0 2px var(--color-fondo), 0 0 0 4px var(--color-acento); }` },
    estado: { nombre: 'Con estado', descripcion: 'Un punto verde si está conectado', css: `& .cm-av:not(.cm-mas)::after { content: ''; position: absolute; right: 0; bottom: 0; width: 12px; height: 12px; border-radius: 50%; background: var(--color-exito); box-shadow: 0 0 0 2px var(--color-fondo); }` },
    contorno: { nombre: 'Contorno', descripcion: 'Iniciales con borde, sin relleno', css: `& .cm-av, & .cm-av:nth-child(2), & .cm-av:nth-child(3) { background: transparent; color: var(--color-texto); box-shadow: inset 0 0 0 1.5px var(--color-texto); }` },
  },
  Muestra: ({ clase }) => (
    <div className={clase}>
      {['AL', 'MR', 'JP'].map((x) => (
        <span key={x} className="cm-av" title={x}>
          {x}
        </span>
      ))}
      <span className="cm-av cm-mas">+3</span>
    </div>
  ),
};

// ---------- Tooltips ----------

export const TOOLTIPS: Categoria = {
  id: 'tooltip',
  nombre: 'Tooltips',
  singular: 'tooltip',
  descripcion: 'Pasá el mouse o enfocá el botón para ver la ayuda.',
  estructura: '<span class="cm-tooltip cm-tooltip-DISEÑO"><button aria-describedby="t">Botón</button><span id="t" role="tooltip" class="cm-tip">Ayuda</span></span>',
  anchoCelda: 240,
  base: `& { position: relative; display: inline-flex; font-family: var(--fuente-texto); padding-top: 44px; }
& button { min-height: 40px; padding: 0 14px; border: 1.5px solid var(--color-borde); border-radius: 10px; background: var(--color-fondo); color: var(--color-texto); font: inherit; font-size: 14px; font-weight: 600; cursor: pointer; }
& button:focus-visible { outline: 2px solid var(--color-acento); outline-offset: 2px; }
& .cm-tip { position: absolute; left: 50%; top: 0; transform: translate(-50%, 4px); padding: 6px 10px; border-radius: 8px; background: var(--color-texto); color: var(--color-fondo); font-size: 12.5px; font-weight: 600; white-space: nowrap; pointer-events: none; opacity: 0;
  transition: opacity var(--duracion-media) ease, transform var(--duracion-media) var(--curva-entrada); }
&:hover .cm-tip, &:focus-within .cm-tip { opacity: 1; transform: translate(-50%, 0); }`,
  disenos: {
    oscuro: { nombre: 'Oscuro', descripcion: 'Fondo del color del texto', css: '' },
    claro: { nombre: 'Claro con sombra', descripcion: 'Blanco con sombra suave', css: `& .cm-tip { background: var(--color-superficie-alta); color: var(--color-texto); box-shadow: 0 6px 18px rgba(0,0,0,.16); border: 1px solid var(--color-borde); }` },
    acento: { nombre: 'De color', descripcion: 'Del color de acento', css: `& .cm-tip { background: var(--color-acento); color: var(--color-sobre-acento); }` },
    flecha: { nombre: 'Con flecha', descripcion: 'Una punta que señala el botón', css: `& .cm-tip::after { content: ''; position: absolute; left: 50%; bottom: -5px; width: 10px; height: 10px; background: inherit; transform: translateX(-50%) rotate(45deg); border-radius: 2px; }` },
    vidrio: { nombre: 'Vidrio', descripcion: 'Translúcido', css: `& .cm-tip { background: color-mix(in srgb, var(--color-texto) 70%, transparent); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }` },
    rebote: { nombre: 'Con rebote', descripcion: 'Aparece agrandándose con rebote', css: `& .cm-tip { transform: translate(-50%, 0) scale(.6); transition: opacity 160ms ease, transform 360ms cubic-bezier(.3,1.6,.5,1); } &:hover .cm-tip, &:focus-within .cm-tip { transform: translate(-50%, 0) scale(1); }` },
  },
  Muestra: ({ clase, id }) => (
    <span className={clase}>
      <button type="button" aria-describedby={`tip-${id}`}>
        Copiar enlace
      </button>
      <span id={`tip-${id}`} role="tooltip" className="cm-tip">
        Se copia al portapapeles
      </span>
    </span>
  ),
};

// ---------- Ventanas modales ----------

function MuestraModal({ clase }: { clase: string; id: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const repetir = () => reanimar(ref.current, 'cm-entra');
  return (
    <div className="cm-grupo-controles cm-ancho">
      <div className={`cm-escena-modal ${clase}`}>
        <div className="cm-fondo-modal" aria-hidden="true" />
        <div ref={ref} className="cm-ventana cm-entra" role="dialog" aria-label="Ejemplo de ventana">
          <span className="cm-ventana-ico" aria-hidden="true">
            <Icono nombre="corazon" tamano={20} />
          </span>
          <strong>¿Guardar los cambios?</strong>
          <span className="cm-ventana-txt">Si salís sin guardar, se pierden.</span>
          <span className="cm-ventana-acciones">
            <button type="button" onClick={repetir}>
              Cancelar
            </button>
            <button type="button" className="cm-primario" onClick={repetir}>
              Guardar
            </button>
          </span>
        </div>
      </div>
      <button type="button" className="cm-repetir" onClick={repetir}>
        Abrir de nuevo
      </button>
    </div>
  );
}

export const MODALES: Categoria = {
  id: 'modal',
  nombre: 'Ventanas',
  singular: 'ventana',
  descripcion: 'Ventanas de confirmación y paneles. Tocá «Abrir de nuevo» para ver cómo aparecen.',
  estructura: '<div class="cm-modal cm-modal-DISEÑO"><div class="cm-fondo-modal"></div><div class="cm-ventana cm-entra" role="dialog" aria-modal="true"><span class="cm-ventana-ico">(icono)</span><strong>Título</strong><span class="cm-ventana-txt">Texto</span><span class="cm-ventana-acciones"><button>Cancelar</button><button class="cm-primario">Guardar</button></span></div></div>',
  anchoCelda: 320,
  base: `& { position: relative; width: 100%; height: 230px; border-radius: 12px; overflow: hidden; background: var(--color-superficie); font-family: var(--fuente-texto); color: var(--color-texto); }
& .cm-fondo-modal { position: absolute; inset: 0; background: rgba(10, 10, 14, 0.45); }
& .cm-ventana { position: absolute; left: 50%; top: 50%; width: min(260px, 86%); transform: translate(-50%, -50%); display: flex; flex-direction: column; gap: 6px; padding: 18px; border-radius: var(--radio-grande); background: var(--color-superficie-alta); box-shadow: 0 18px 40px rgba(0,0,0,.28); }
& .cm-ventana-ico { display: none; }
& .cm-ventana-txt { font-size: 13px; color: var(--color-texto-suave); }
& .cm-ventana-acciones { display: flex; justify-content: flex-end; gap: 8px; margin-top: 10px; }
& .cm-ventana-acciones button { min-height: 38px; padding: 0 14px; border-radius: var(--radio-boton); border: 1.5px solid var(--color-borde); background: transparent; color: var(--color-texto); font: inherit; font-size: 13px; font-weight: 700; cursor: pointer; }
& .cm-ventana-acciones .cm-primario { background: var(--boton-color); color: var(--boton-sobre); border-color: transparent; }
& .cm-ventana.cm-entra { animation: cm-modal-entra 380ms var(--curva-entrada) both; }
@keyframes cm-modal-entra { from { opacity: 0; transform: translate(-50%, -46%) scale(.94); } }
${sinMovimiento}`,
  disenos: {
    centrada: { nombre: 'Centrada', descripcion: 'Aparece en el medio, agrandándose', css: '' },
    hoja: { nombre: 'Hoja de abajo', descripcion: 'Sube desde abajo, típica del celular', css: `& .cm-ventana { left: 0; right: 0; top: auto; bottom: 0; width: auto; transform: none; border-radius: 22px 22px 0 0; } & .cm-ventana::before { content: ''; align-self: center; width: 40px; height: 4px; border-radius: 2px; background: var(--color-borde); margin-bottom: 6px; } & .cm-ventana.cm-entra { animation: cm-hoja 420ms var(--curva-entrada) both; } @keyframes cm-hoja { from { transform: translateY(100%); } }` },
    lateral: { nombre: 'Panel lateral', descripcion: 'Entra desde la derecha', css: `& .cm-ventana { left: auto; right: 0; top: 0; bottom: 0; width: 62%; transform: none; border-radius: 16px 0 0 16px; justify-content: center; } & .cm-ventana.cm-entra { animation: cm-lateral 420ms var(--curva-entrada) both; } @keyframes cm-lateral { from { transform: translateX(100%); } }` },
    alerta: { nombre: 'Alerta con icono', descripcion: 'Centrada, con icono arriba', css: `& .cm-ventana { align-items: center; text-align: center; } & .cm-ventana-ico { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; background: color-mix(in srgb, var(--color-acento) 18%, var(--color-fondo)); color: var(--color-acento); margin-bottom: 4px; } & .cm-ventana-acciones { justify-content: center; }` },
    vidrio: { nombre: 'Vidrio', descripcion: 'Ventana translúcida sobre fondo desenfocado', css: `& .cm-fondo-modal { background: rgba(10,10,14,.2); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); } & .cm-ventana { background: color-mix(in srgb, var(--color-fondo) 60%, transparent); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); border: 1px solid color-mix(in srgb, var(--color-texto) 14%, transparent); }` },
    neobrutal: { nombre: 'Neobrutal', descripcion: 'Bordes negros y sombra sólida', css: `& .cm-ventana { border-radius: 0; border: 2px solid var(--color-texto); box-shadow: 7px 7px 0 var(--color-texto); background: var(--color-fondo); } & .cm-ventana-acciones button { border-radius: 0; border: 2px solid var(--color-texto); }` },
  },
  Muestra: MuestraModal,
};
