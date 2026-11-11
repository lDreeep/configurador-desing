// Molde (PLAN.md tarea C2): un lienzo con la página de la persona y un botón en el centro que
// explota en ideas. Pasar el mouse (o el foco) muestra la idea en toda la página; clic, Enter o
// arrastrarla al centro la elige. Lo elegido queda como fichas abajo; tocar una reabre su ronda.
// La página es `Pagina` con la Config real: lo que se ve es lo que se exporta.

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as PE } from 'react';
import { generarDesignMd } from '../export/generarDesignMd';
import { useFuentes } from '../fuentes';
import { Esquema } from '../rapido/esquemas';
import { EstilosVisualesGlobales, Pagina } from '../rapido/Pagina';
import { faltanObligatorias, rondasDe, type ClaveRonda, type OpcionRonda, type Ronda } from '../rondas';
import type { Config, LayoutId } from '../tipos';
import { elegir, INICIO_MOLDE, LISTO_MOLDE, POR_VEZ, posiciones, resolverPaso, siguiente, useElegidas, valorDeFicha } from './recorrido';
import './molde.css';

interface Props {
  config: Config;
  setConfig: (c: Config) => void;
  reiniciar: () => void;
  /** La ronda abierta (su clave), `inicio` o `listo`: viene de la URL (`#/molde/color`). */
  paso: string;
  /** Va a otro paso y suma una entrada al historial (Atrás del navegador vuelve); `reemplazar` no la suma. */
  ir: (paso: string, atras?: boolean, reemplazar?: boolean) => void;
}

/** Lo que se está mirando antes de elegirlo: se dibuja en la capa de vista previa. */
interface Vista {
  id: string;
  config: Config;
}

/** Tamaño del área de Molde, para acomodar las ideas. */
function useTamano(ref: React.RefObject<HTMLElement>) {
  const [t, setT] = useState({ ancho: 1280, alto: 800 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const medir = () => setT({ ancho: el.clientWidth || window.innerWidth, alto: el.clientHeight || window.innerHeight });
    medir();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', medir);
      return () => window.removeEventListener('resize', medir);
    }
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return t;
}

const enDosCuadros = (f: () => void) => {
  if (typeof requestAnimationFrame === 'undefined') return void setTimeout(f, 0);
  requestAnimationFrame(() => requestAnimationFrame(f));
};

export function Molde({ config, setConfig, reiniciar, paso: pasoUrl, ir }: Props) {
  const raiz = useRef<HTMLDivElement>(null);
  const nucleo = useRef<HTMLHeadingElement>(null);
  const [elegidas, setElegidas] = useElegidas();
  const [vista, setVista] = useState<Vista | null>(null);
  const [nueva, setNueva] = useState<ClaveRonda | null>(null);
  const [aviso, setAviso] = useState('');
  const tamano = useTamano(raiz);
  useFuentes(['bricolage']);

  const { ronda, paso } = resolverPaso(config, elegidas, pasoUrl);
  const rondas = rondasDe(config);
  const hayPagina = elegidas.has('proyecto');
  const faltan = faltanObligatorias(config, elegidas);

  // Un paso que no corresponde (por ejemplo, Color sin proyecto) se corrige en la URL sin sumar historial.
  useEffect(() => {
    if (paso !== pasoUrl) ir(paso, false, true);
  }, [paso, pasoUrl, ir]);

  // Al abrir otra ronda: se borra la vista previa y, si el foco quedó en el aire, va a la pregunta.
  // Al cargar la página no se mueve el foco.
  const primeraRonda = useRef(true);
  useEffect(() => {
    setVista(null);
    if (primeraRonda.current) return void (primeraRonda.current = false);
    const activo = document.activeElement;
    if (ronda && (!activo || activo === document.body || !raiz.current?.contains(activo))) nucleo.current?.focus({ preventScroll: true });
  }, [ronda?.clave]); // eslint-disable-line react-hooks/exhaustive-deps

  const alElegir = (r: Ronda, id: string) => {
    const res = elegir(config, elegidas, r, id);
    setConfig(res.config);
    setElegidas(res.elegidas);
    setNueva(r.clave);
    setVista(null);
    ir(res.siguiente);
  };

  const empezarDeCero = () => {
    if (typeof window.confirm === 'function' && !window.confirm('¿Empezar de cero? Se borra todo lo que elegiste.')) return;
    reiniciar();
    setElegidas(new Set());
    setVista(null);
    ir(INICIO_MOLDE);
  };

  const descargar = () => {
    const url = URL.createObjectURL(new Blob([generarDesignMd(config)], { type: 'text/markdown;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'DESIGN.md';
    a.click();
    URL.revokeObjectURL(url);
    setAviso('Descargado. Pasáselo a tu IA junto con lo que querés que construya.');
  };

  const fichas = rondas.filter((r) => elegidas.has(r.clave));
  const sigOpcional = siguiente(config, elegidas);
  const clases = ['molde', ronda ? 'eligiendo' : '', vista ? 'viendo' : '', paso === LISTO_MOLDE ? 'terminado' : ''].join(' ');

  return (
    <div ref={raiz} className={clases}>
      <EstilosVisualesGlobales />
      <header className="molde-barra">
        <span className="molde-marca">
          <i aria-hidden="true" />
          Molde
        </span>
        <span className="molde-hueco" />
        {elegidas.size > 0 && (
          <button type="button" className="molde-enlace" onClick={empezarDeCero}>
            Empezar de cero
          </button>
        )}
      </header>

      <main className="molde-main">
        {/* El lienzo: la página real. Es una muestra, así que no se navega por dentro. */}
        <div className={`molde-lienzo ${hayPagina ? 'hay' : ''}`} aria-hidden="true" {...{ inert: '' }}>
          <div className="molde-capa molde-base">{hayPagina && <Pagina key={config.visual.aparicion} config={config} />}</div>
          <div className={`molde-capa molde-prev ${vista ? 'on' : ''}`}>{vista && <Pagina key={vista.id} config={vista.config} />}</div>
        </div>

        {paso === INICIO_MOLDE && (
          <div className="molde-centro">
            <h1>Armá el diseño de tu página</h1>
            <p>Del botón salen ideas. Las que elegís se quedan en la página, y al final te la llevás armada.</p>
            <button type="button" className="molde-nucleo molde-empezar" onClick={() => ir(siguiente(config, elegidas))}>
              Empezar
            </button>
          </div>
        )}

        {ronda && (
          <>
            <h1 className="solo-lectores">Molde: armá el diseño de tu página</h1>
            <h2 key={`pregunta-${ronda.clave}`} ref={nucleo} tabIndex={-1} className="molde-nucleo molde-pregunta">
              {ronda.pregunta}
            </h2>
            <RondaAbierta
              key={ronda.clave}
              ronda={ronda}
              config={config}
              elegidas={elegidas}
              tamano={tamano}
              vista={vista}
              onVer={(op) => setVista({ id: op.id, config: ronda.aplicar(config, op.id, { elegidas }) })}
              onDejar={(op) => setVista((v) => (v?.id === op.id ? null : v))}
              onElegir={(op) => alElegir(ronda, op.id)}
            />
          </>
        )}

        {paso === LISTO_MOLDE && <h1 className="solo-lectores">Tu página está lista</h1>}
      </main>

      <footer className="molde-pie">
        <div className="molde-fichas" aria-label="Lo que elegiste">
          {fichas.length === 0 ? (
            <p className="molde-pista">
              {paso === INICIO_MOLDE
                ? 'Gratis y sin cuenta. Lo que elegís queda en tu navegador.'
                : 'Pasá el mouse o el foco por una idea para verla en la página. Elegila con un clic, con Enter o arrastrándola al centro.'}
            </p>
          ) : (
            fichas.map((r) => (
              <button
                key={r.clave}
                type="button"
                className={`molde-ficha ${r.clave === nueva ? 'nueva' : ''}`}
                aria-current={r.clave === paso ? 'step' : undefined}
                onClick={() => ir(r.clave)}
              >
                {r.ficha}
                <b>{valorDeFicha(config, r)}</b>
              </button>
            ))
          )}
        </div>
        <div className="molde-final">
          {paso === LISTO_MOLDE ? (
            <>
              {sigOpcional !== LISTO_MOLDE && (
                <button type="button" className="molde-btn molde-btn-2" onClick={() => ir(sigOpcional)}>
                  Más ideas
                </button>
              )}
              <button type="button" className="molde-btn molde-btn-1" onClick={descargar}>
                Descargar DESIGN.md
              </button>
            </>
          ) : (
            ronda &&
            faltan.length === 0 && (
              <button type="button" className="molde-btn molde-btn-1" onClick={() => ir(LISTO_MOLDE)}>
                Terminar
              </button>
            )
          )}
        </div>
      </footer>
      <p className="molde-aviso" role="status" hidden={!aviso}>
        {aviso}
      </p>
    </div>
  );
}

/** Lo que va dentro de cada idea: muestra (colores o esquema), nombre y una línea de ayuda. */
function ContenidoIdea({ ronda, op }: { ronda: Ronda; op: OpcionRonda }) {
  return (
    <>
      {ronda.clave === 'layout' && <Esquema id={op.id as LayoutId} />}
      {op.muestras && (
        <span className="molde-muestras" aria-hidden="true">
          {op.muestras.map((c, i) => (
            <i key={i} style={{ background: c }} />
          ))}
        </span>
      )}
      <span className="molde-idea-texto">
        {op.nombre}
        {(op.recomendada || op.descripcion) && (
          <small>
            {op.recomendada && <span className="molde-sello">Recomendada</span>}
            {op.recomendada && op.descripcion ? ' · ' : ''}
            {op.descripcion}
          </small>
        )}
      </span>
    </>
  );
}

interface Arrastre {
  id: string;
  el: HTMLButtonElement;
  x0: number;
  y0: number;
  ox: number;
  oy: number;
  movio: boolean;
}

/** Las ideas de una ronda: salen del centro, de a 6, con flechas para ver más. */
function RondaAbierta(props: {
  ronda: Ronda;
  config: Config;
  elegidas: ReadonlySet<ClaveRonda>;
  tamano: { ancho: number; alto: number };
  vista: Vista | null;
  onVer: (op: OpcionRonda) => void;
  onDejar: (op: OpcionRonda) => void;
  onElegir: (op: OpcionRonda) => void;
}) {
  const { ronda, config, tamano, vista } = props;
  const todas = useMemo(() => ronda.opciones(config), [ronda, config]);
  const hojas = Math.max(1, Math.ceil(todas.length / POR_VEZ));
  // Lo que la config trae de fábrica no cuenta como elegido: solo lo que la persona eligió en esta ronda.
  const elegida = props.elegidas.has(ronda.clave) ? ronda.elegida(config) : null;
  // Se abre en la vuelta donde está lo que ya se eligió.
  const [hoja, setHoja] = useState(() => {
    const i = todas.findIndex((o) => o.id === elegida);
    return i < 0 ? 0 : Math.floor(i / POR_VEZ);
  });
  const ops = todas.slice(hoja * POR_VEZ, hoja * POR_VEZ + POR_VEZ);
  const botones = useRef<(HTMLButtonElement | null)[]>([]);
  const [pos, setPos] = useState<[number, number][]>([]);
  const [abiertas, setAbiertas] = useState(false);
  const arrastre = useRef<Arrastre | null>(null);
  const recienArrastrada = useRef(false);

  // Explosión: cada idea mide su ancho y se acomoda sin salirse de la pantalla; dos cuadros después sale del centro.
  useLayoutEffect(() => {
    setAbiertas(false);
    const base = posiciones(ops.length, tamano.ancho, tamano.alto);
    setPos(
      base.map(([x, y], k) => {
        const w = botones.current[k]?.offsetWidth ?? 0;
        const tope = Math.max(0, tamano.ancho / 2 - w / 2 - 10);
        return [Math.max(-tope, Math.min(tope, x)), y];
      }),
    );
    let vivo = true;
    enDosCuadros(() => vivo && setAbiertas(true));
    return () => {
      vivo = false;
    };
  }, [hoja, ops.length, tamano.ancho, tamano.alto]);

  const mover = (el: HTMLElement, x: number, y: number) => {
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
  };

  const alApoyar = (e: PE<HTMLButtonElement>, op: OpcionRonda, k: number) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    const [ox, oy] = pos[k] ?? [0, 0];
    arrastre.current = { id: op.id, el: e.currentTarget, x0: e.clientX, y0: e.clientY, ox, oy, movio: false };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const alMover = (e: PE<HTMLButtonElement>, op: OpcionRonda) => {
    const a = arrastre.current;
    if (!a || a.id !== op.id) return;
    const dx = e.clientX - a.x0;
    const dy = e.clientY - a.y0;
    if (!a.movio && Math.hypot(dx, dy) < 8) return;
    a.movio = true;
    a.el.classList.add('arrastra');
    mover(a.el, a.ox + dx, a.oy + dy);
  };
  const alSoltar = (e: PE<HTMLButtonElement>, op: OpcionRonda) => {
    const a = arrastre.current;
    if (!a || a.id !== op.id) return;
    arrastre.current = null;
    a.el.classList.remove('arrastra');
    if (!a.movio) return;
    recienArrastrada.current = true;
    setTimeout(() => (recienArrastrada.current = false), 50);
    const x = a.ox + e.clientX - a.x0;
    const y = a.oy + e.clientY - a.y0;
    // Soltarla cerca del centro la elige; si no, vuelve a su lugar.
    if (Math.hypot(x, y) < 130) props.onElegir(op);
    else mover(a.el, a.ox, a.oy);
  };

  const cambiarHoja = (d: number) => setHoja((h) => (h + d + hojas) % hojas);

  return (
    <>
      <div key={hoja} className={`molde-ideas ${abiertas ? 'abiertas' : ''}`} role="group" aria-label={`Ideas: ${ronda.pregunta}`}>
        {ops.map((op, k) => {
          const [x, y] = abiertas ? (pos[k] ?? [0, 0]) : [0, 0];
          const estilo = { '--x': `${x}px`, '--y': `${y}px`, transitionDelay: abiertas ? `${k * 40}ms` : '0ms' } as CSSProperties;
          return (
            <button
              key={op.id}
              ref={(el) => (botones.current[k] = el)}
              type="button"
              className={`molde-idea ${vista?.id === op.id ? 'viva' : ''}`}
              aria-pressed={op.id === elegida}
              style={estilo}
              onPointerEnter={(e) => e.pointerType === 'mouse' && !arrastre.current && props.onVer(op)}
              onPointerLeave={(e) => e.pointerType === 'mouse' && !arrastre.current && props.onDejar(op)}
              onFocus={() => props.onVer(op)}
              onBlur={() => props.onDejar(op)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') props.onDejar(op);
              }}
              onClick={() => !recienArrastrada.current && props.onElegir(op)}
              onPointerDown={(e) => alApoyar(e, op, k)}
              onPointerMove={(e) => alMover(e, op)}
              onPointerUp={(e) => alSoltar(e, op)}
              onPointerCancel={() => (arrastre.current = null)}
            >
              <ContenidoIdea ronda={ronda} op={op} />
            </button>
          );
        })}
      </div>
      {hojas > 1 && (
        <div className="molde-paginas">
          <button type="button" className="molde-flecha" aria-label="Ideas anteriores" onClick={() => cambiarHoja(-1)}>
            ‹
          </button>
          <span aria-live="polite">
            {hoja + 1} de {hojas}
          </span>
          <button type="button" className="molde-flecha" aria-label="Más ideas" onClick={() => cambiarHoja(1)}>
            ›
          </button>
        </div>
      )}
    </>
  );
}
