// Molde (PLAN.md tarea C2): un lienzo con la página de la persona y un botón en el centro que
// explota en ideas. Pasar el mouse (o el foco) muestra la idea en toda la página; clic, Enter o
// arrastrarla al centro la elige. Lo elegido queda como fichas abajo; tocar una reabre su ronda
// y ofrece «Ajustes finos» (C4): los controles del modo avanzado para ese tema, al costado.
// La página es `Pagina` con la Config real: lo que se ve es lo que se exporta.

import { lazy, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type Dispatch, type PointerEvent as PE, type SetStateAction } from 'react';
import { generarDesignMd } from '../export/generarDesignMd';
import { useFuentes } from '../fuentes';
import { Esquema } from '../rapido/esquemas';
import { EstilosVisualesGlobales, Pagina } from '../rapido/Pagina';
import { faltanObligatorias, rondasDe, type ClaveRonda, type OpcionRonda, type Ronda } from '../rondas';
import { esDisenoSeccion, seccionDe } from '../secciones';
import type { Config, LayoutId } from '../tipos';
import { AJUSTES, elegir, INICIO_MOLDE, LISTO_MOLDE, POR_VEZ, posiciones, resolverPaso, siguiente, useElegidas, valorDeFicha } from './recorrido';
import './molde.css';
const Portada = lazy(() => import('./Portada').then((m) => ({ default: m.Portada })));

const Ajustes = lazy(() => import('./Ajustes'));

interface Props {
  config: Config;
  setConfig: Dispatch<SetStateAction<Config>>;
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

const sinMovimiento = () => typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Una capa del lienzo. Con `bajar`, la página se baja sola y vuelve, en un ciclo que comparten las
 * dos capas (base y vista previa van parejas). Con movimiento reducido no se mueve.
 */
function Capa({ clase, bajar, mostrar, marca, children }: { clase: string; bajar: boolean; mostrar?: string; marca?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  // Con `mostrar` (un selector), la capa trae esa parte de la página a la vista: en la ronda de secciones,
  // la que se está mirando o la última elegida. '' vuelve arriba; si el selector no está, no se mueve.
  const mostraba = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (mostrar === undefined) {
      if (mostraba.current) el.scrollTop = 0;
      mostraba.current = false;
      return;
    }
    mostraba.current = true;
    const destino = mostrar ? el.querySelector<HTMLElement>(mostrar) : null;
    if (mostrar && !destino) return;
    const top = destino ? destino.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop - 88 : 0;
    el.scrollTo?.({ top: Math.max(0, top), behavior: sinMovimiento() ? 'auto' : 'smooth' });
  }, [mostrar, marca]);
  useEffect(() => {
    const el = ref.current;
    if (!bajar || !el || typeof requestAnimationFrame === 'undefined' || sinMovimiento()) return;
    let raf = 0;
    const suave = (x: number) => x * x * (3 - 2 * x);
    const marco = (t: number) => {
      // Ciclo de 11 s: baja 6 s, espera 1,2 s abajo, sube 2,6 s y espera arriba.
      const fase = (t % 11000) / 1000;
      const p = fase < 6 ? suave(fase / 6) : fase < 7.2 ? 1 : fase < 9.8 ? 1 - suave((fase - 7.2) / 2.6) : 0;
      el.scrollTop = p * Math.max(0, el.scrollHeight - el.clientHeight);
      raf = requestAnimationFrame(marco);
    };
    raf = requestAnimationFrame(marco);
    return () => {
      cancelAnimationFrame(raf);
      el.scrollTop = 0;
    };
  }, [bajar]);
  return (
    <div ref={ref} className={`molde-capa ${clase}`}>
      {children}
    </div>
  );
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
  const [ajustando, setAjustando] = useState(false);
  const botonAjustes = useRef<HTMLButtonElement>(null);
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
    setAjustando(false);
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
    // En las rondas de elegir varias (scroll) la ronda queda abierta para sumar o sacar; «Seguir» pasa a la otra.
    if (!r.maximo) ir(res.siguiente);
  };

  const empezarDeCero = () => {
    if (typeof window.confirm === 'function' && !window.confirm('¿Empezar de cero? Se borra todo lo que elegiste.')) return;
    reiniciar();
    setElegidas(new Set());
    setVista(null);
    setAjustando(false);
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
  // En la ronda de scroll la página se baja sola, para que se vea qué hace cada efecto.
  const bajaSola = ronda?.clave === 'scroll';
  // En la ronda de secciones la página va sola hasta la sección que se mira (o la última elegida).
  const idSeccion = ronda?.clave === 'secciones' ? (vista?.id ?? ronda.elegida(config)) : undefined;
  const mostrar = idSeccion === undefined ? undefined : esDisenoSeccion(idSeccion) ? `[data-seccion="${seccionDe(idSeccion)}"]` : '';
  const marca = `${vista?.id ?? ''}|${config.visual.secciones.join()}`;
  const sigOpcional = siguiente(config, elegidas);
  // Ajustes finos: solo en una ronda ya elegida (se llega tocando su ficha) que tenga pasos del modo avanzado.
  const conAjustes = ronda && elegidas.has(ronda.clave) && AJUSTES[ronda.clave] ? ronda : null;
  const abiertos = ajustando && conAjustes;
  const cerrarAjustes = () => {
    setAjustando(false);
    enDosCuadros(() => botonAjustes.current?.focus({ preventScroll: true }));
  };
  const clases = ['molde', ronda && !abiertos ? 'eligiendo' : '', abiertos ? 'ajustando' : '', vista ? 'viendo' : '', paso === LISTO_MOLDE ? 'terminado' : ''].join(' ');

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
          <Capa clase="molde-base" bajar={bajaSola} mostrar={mostrar} marca={marca}>
            {hayPagina && <Pagina key={config.visual.aparicion} config={config} />}
          </Capa>
          <Capa clase={`molde-prev ${vista ? 'on' : ''}`} bajar={bajaSola && !!vista} mostrar={mostrar} marca={marca}>
            {vista && <Pagina key={vista.id} config={vista.config} />}
          </Capa>
        </div>

        {paso === INICIO_MOLDE && (
          <Suspense fallback={<div className="molde-centro"><button type="button" className="molde-empezar" onClick={() => ir(siguiente(config, elegidas))}>Empezar</button></div>}>
            <Portada empezar={() => ir(siguiente(config, elegidas))} />
          </Suspense>
        )}

        {ronda && <h1 className="solo-lectores">Molde: armá el diseño de tu página</h1>}

        {/* Con los ajustes finos abiertos se esconden las ideas: la página queda entera a la vista. */}
        {ronda && !abiertos && (
          <>
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

      {abiertos && (
        <Suspense fallback={<div className="molde-ajustes molde-ajustes-cargando" role="status">Cargando…</div>}>
          <Ajustes clave={abiertos.clave} titulo={abiertos.ficha} config={config} setConfig={setConfig} onCerrar={cerrarAjustes} />
        </Suspense>
      )}

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
            <>
              {conAjustes && (
                <button
                  ref={botonAjustes}
                  type="button"
                  className="molde-btn molde-btn-2"
                  aria-expanded={ajustando}
                  onClick={() => (ajustando ? cerrarAjustes() : setAjustando(true))}
                >
                  Ajustes finos
                </button>
              )}
              {ronda?.maximo && (
                <button type="button" className="molde-btn molde-btn-2" onClick={() => ir(siguiente(config, new Set([...elegidas, ronda.clave])))}>
                  Seguir
                </button>
              )}
              {ronda && faltan.length === 0 && (
                <button type="button" className="molde-btn molde-btn-1" onClick={() => ir(LISTO_MOLDE)}>
                  Terminar
                </button>
              )}
            </>
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
  const marcadas = props.elegidas.has(ronda.clave) ? (ronda.marcadas?.(config) ?? (elegida ? [elegida] : [])) : [];
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
  // Cómo se tocó por última vez: con el dedo un toque muestra y «Usar» confirma; con mouse o teclado se elige directo.
  const ultimo = useRef<'mouse' | 'toque' | 'teclado'>('mouse');
  const [tocada, setTocada] = useState<OpcionRonda | null>(null);
  const confirmando = tocada !== null && vista?.id === tocada.id;

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

  const cambiarHoja = (d: number) => {
    setTocada(null);
    setHoja((h) => (h + d + hojas) % hojas);
  };
  const verOtras = () => {
    if (!tocada) return;
    props.onDejar(tocada);
    setTocada(null);
    if (hojas > 1) setHoja((h) => (h + 1) % hojas);
  };

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
              aria-pressed={marcadas.includes(op.id)}
              style={estilo}
              onPointerEnter={(e) => e.pointerType === 'mouse' && !arrastre.current && props.onVer(op)}
              onPointerLeave={(e) => e.pointerType === 'mouse' && !arrastre.current && props.onDejar(op)}
              onFocus={() => props.onVer(op)}
              onBlur={() => !(ultimo.current === 'toque' && tocada) && props.onDejar(op)}
              onKeyDown={(e) => {
                ultimo.current = 'teclado';
                if (e.key === 'Escape') props.onDejar(op);
              }}
              onClick={(e) => {
                if (recienArrastrada.current) return;
                // Con el dedo (un clic real, no el de Enter): el toque muestra la idea y «Usar» la elige.
                if (e.detail > 0 && ultimo.current === 'toque') {
                  setTocada(op);
                  props.onVer(op);
                } else props.onElegir(op);
              }}
              onPointerDown={(e) => {
                ultimo.current = e.pointerType === 'mouse' ? 'mouse' : 'toque';
                alApoyar(e, op, k);
              }}
              onPointerMove={(e) => alMover(e, op)}
              onPointerUp={(e) => alSoltar(e, op)}
              onPointerCancel={() => (arrastre.current = null)}
            >
              <ContenidoIdea ronda={ronda} op={op} />
            </button>
          );
        })}
      </div>
      {confirmando && tocada && (
        <div className="molde-confirmar" role="group" aria-label={`${tocada.nombre}: ¿la usás?`}>
          <button type="button" className="molde-btn molde-btn-2" onClick={verOtras}>
            Ver otras
          </button>
          <button type="button" className="molde-btn molde-btn-1" onClick={() => props.onElegir(tocada)}>
            Usar
          </button>
        </div>
      )}
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
