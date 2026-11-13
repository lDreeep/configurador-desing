// Molde (PLAN.md C2 e I3): la página de la persona, siempre en grande y usable mientras se arma, y
// encima un botón del que salen las ideas del paso. Pasar el mouse (o el foco) por una idea la muestra
// en la página; clic, Enter o arrastrarla al centro la elige; con el dedo, un toque la muestra y «Usar»
// la elige. Al scrollear o tocar la página, las ideas se recogen arriba, en el botón de la pregunta:
// tocarlo las vuelve a abrir. El recorrido son los pasos de `pasosDe` (5 como máximo); lo que no se
// pregunta queda como fichas bajo «Ajustar». Al final: la página entera y un botón «Descargar».
// La página es `Pagina` con la Config real: lo que se ve es lo que se exporta.

import { lazy, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type Dispatch, type MouseEvent as ME, type PointerEvent as PE, type RefObject, type SetStateAction } from 'react';
import { generarDesignMd } from '../export/generarDesignMd';
import { useFuentes } from '../fuentes';
import { Esquema } from '../rapido/esquemas';
import { EstilosVisualesGlobales, Pagina } from '../rapido/Pagina';
import { admiteRonda, faltanObligatorias, pasoDeRonda, pasosDe, rondasDeAjustar, type ClaveRonda, type OpcionRonda, type Ronda } from '../rondas';
import { esDisenoSeccion, seccionDe } from '../secciones';
import type { Config, LayoutId } from '../tipos';
import { AJUSTES, despuesDe, elegir, INICIO_MOLDE, LISTO_MOLDE, POR_VEZ, posiciones, resolverPaso, rondasDelRecorrido, siguiente, useElegidas, valorDeFicha } from './recorrido';
import './molde.css';
import { OrdenSecciones } from './OrdenSecciones';
const Portada = lazy(() => import('./Portada').then((m) => ({ default: m.Portada })));

const Ajustes = lazy(() => import('./Ajustes'));

interface Props {
  config: Config;
  setConfig: Dispatch<SetStateAction<Config>>;
  reiniciar: () => void;
  /** La ronda abierta (su clave), `inicio` o `listo`: viene de la URL (`#/color`). */
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
const irA = (el: HTMLElement, top: number) => el.scrollTo?.({ top: Math.max(0, top), behavior: sinMovimiento() ? 'auto' : 'smooth' });
/** Dónde queda `destino` dentro de su capa, dejando lugar para una cabecera fija. */
const topEn = (capa: HTMLElement, destino: HTMLElement) => destino.getBoundingClientRect().top - capa.getBoundingClientRect().top + capa.scrollTop - 88;

/**
 * Una capa del lienzo: se scrollea como una página. Con `bajar`, se baja sola y vuelve hasta que la
 * persona la toca (la página se usa: no se le pelea el scroll). Con movimiento reducido no se mueve.
 */
function Capa({ clase, bajar, mostrar, marca, capa, children }: { clase: string; bajar: boolean; mostrar?: string; marca?: string; capa: RefObject<HTMLDivElement>; children: React.ReactNode }) {
  const ref = capa;
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
    irA(el, destino ? topEn(el, destino) : 0);
  }, [mostrar, marca]); // eslint-disable-line react-hooks/exhaustive-deps
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
    // En cuanto la persona toca la página, el paseo se corta y la página queda donde ella la deja.
    const TOQUES = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const;
    let tocada = false;
    const cortar = () => {
      tocada = true;
      cancelAnimationFrame(raf);
    };
    for (const t of TOQUES) el.addEventListener(t, cortar, { passive: true });
    return () => {
      for (const t of TOQUES) el.removeEventListener(t, cortar);
      cancelAnimationFrame(raf);
      if (!tocada) el.scrollTop = 0;
    };
  }, [bajar]); // eslint-disable-line react-hooks/exhaustive-deps
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

/** La muestra se usa, pero no saca a nadie de Molde: los links no navegan (los internos llevan a su sección). */
function alTocarLaMuestra(e: ME<HTMLDivElement>) {
  const enlace = (e.target as Element).closest?.('a[href]');
  if (!enlace) return;
  e.preventDefault();
  const id = (enlace.getAttribute('href') ?? '').replace(/^#/, '');
  const capa = enlace.closest<HTMLElement>('.molde-capa');
  if (!capa || !id || id === enlace.getAttribute('href')) return;
  const destino = [...capa.querySelectorAll<HTMLElement>('[id]')].find((x) => x.id === id);
  if (destino) irA(capa, topEn(capa, destino));
}

export function Molde({ config, setConfig, reiniciar, paso: pasoUrl, ir }: Props) {
  const raiz = useRef<HTMLDivElement>(null);
  const nucleo = useRef<HTMLButtonElement>(null);
  const capaBase = useRef<HTMLDivElement>(null);
  const capaPrev = useRef<HTMLDivElement>(null);
  const [elegidas, setElegidas] = useElegidas();
  const [vista, setVista] = useState<Vista | null>(null);
  const [nueva, setNueva] = useState<ClaveRonda | null>(null);
  const [aviso, setAviso] = useState('');
  // Las ideas recogidas arriba, en el botón de la pregunta: la página queda libre para usarla.
  const [recogidas, setRecogidas] = useState(false);
  const tamano = useTamano(raiz);
  const [descargando, setDescargando] = useState(false);
  const tituloFinal = useRef<HTMLHeadingElement>(null);
  const tituloDescarga = useRef<HTMLHeadingElement>(null);
  const botonDescargar = useRef<HTMLButtonElement>(null);
  const archivo = useMemo(() => (descargando ? generarDesignMd(config) : ''), [config, descargando]);
  const [ajustando, setAjustando] = useState(false);
  const botonAjustes = useRef<HTMLButtonElement>(null);
  useFuentes(['bricolage']);

  const { ronda, paso } = resolverPaso(config, elegidas, pasoUrl);
  const pasos = pasosDe(config);
  const pasoActual = ronda ? pasoDeRonda(config, ronda.clave) : null;
  const hayPagina = elegidas.has('proyecto');
  const faltan = faltanObligatorias(config, elegidas);
  const terminado = paso === LISTO_MOLDE;

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
    setRecogidas(false);
    if (primeraRonda.current) return void (primeraRonda.current = false);
    const activo = document.activeElement;
    if (ronda && (!activo || activo === document.body || !raiz.current?.contains(activo))) nucleo.current?.focus({ preventScroll: true });
  }, [ronda?.clave]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setDescargando(false);
    if (terminado) tituloFinal.current?.focus({ preventScroll: true });
  }, [terminado]);
  useEffect(() => {
    if (descargando) tituloDescarga.current?.focus({ preventScroll: true });
  }, [descargando]);

  // La vista previa se abre donde está la página: se mira el mismo lugar con la idea puesta. Mientras
  // está abierta se scrollea ella, y la página de abajo la sigue para quedar en el mismo lugar al cerrarla.
  const idVista = vista?.id;
  useLayoutEffect(() => {
    const base = capaBase.current;
    const prev = capaPrev.current;
    if (!idVista || !base || !prev) return;
    const top = base.scrollTop;
    let movida = false;
    const igualar = () => !movida && prev.scrollTop !== top && (prev.scrollTop = top);
    const seguir = () => {
      // Un layout que todavía está bajando deja la capa corta: se vuelve a intentar cuando crece.
      if (Math.abs(prev.scrollTop - top) > 1) movida = prev.scrollHeight - prev.clientHeight >= top;
      if (movida) base.scrollTop = prev.scrollTop;
    };
    igualar();
    prev.addEventListener('scroll', seguir, { passive: true });
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(igualar);
    if (ro && prev.firstElementChild) ro.observe(prev.firstElementChild);
    return () => {
      prev.removeEventListener('scroll', seguir);
      ro?.disconnect();
    };
  }, [idVista]);

  const alElegir = (r: Ronda, id: string) => {
    const res = elegir(config, elegidas, r, id);
    setConfig(res.config);
    setElegidas(res.elegidas);
    setNueva(r.clave);
    setVista(null);
    // Las rondas de elegir varias (secciones, scroll) y las de «Ajustar» quedan abiertas; el botón de la bandeja sigue.
    if (!r.maximo && res.siguiente !== r.clave) ir(res.siguiente);
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

  const descargarHtml = async () => {
    const pagina = raiz.current?.querySelector<HTMLElement>('.molde-base .pg');
    if (!pagina || pagina.querySelector('[aria-busy="true"]')) {
      setAviso('La página se está cargando. Probá de nuevo en un momento.');
      return;
    }
    try {
      const { generarPreviewHtml } = await import('../export/generarPreviewHtml');
      const html = await generarPreviewHtml(pagina, config.proyecto.nombre);
      const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
      const enlace = document.createElement('a');
      enlace.href = url;
      enlace.download = 'preview.html';
      enlace.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setAviso('Descargaste preview.html. Abrilo en tu navegador.');
    } catch {
      setAviso('No se pudo preparar la página completa. Volvé a intentar la descarga.');
    }
  };

  const cerrarDescarga = () => {
    setDescargando(false);
    enDosCuadros(() => botonDescargar.current?.focus({ preventScroll: true }));
  };

  const delRecorrido = rondasDelRecorrido(config);
  const fichas = delRecorrido.filter((r) => elegidas.has(r.clave));
  // «Ajustar»: lo que el recorrido no pregunta. Aparece cuando el estilo ya lo dejó resuelto (o si se eligió a mano).
  const ajustar = rondasDeAjustar(config).filter((r) => elegidas.has(r.clave) || r.clave === ronda?.clave || (elegidas.has('estilo') && admiteRonda(config, r.clave)));
  // En la ronda de scroll la página se baja sola, para que se vea qué hace cada efecto.
  const bajaSola = ronda?.clave === 'scroll';
  // En la ronda de secciones la página va sola hasta la sección que se mira (o la última elegida).
  const idSeccion = ronda?.clave === 'secciones' ? (vista?.id ?? ronda.elegida(config)) : undefined;
  const mostrar = idSeccion === undefined ? undefined : esDisenoSeccion(idSeccion) ? `[data-seccion="${seccionDe(idSeccion)}"]` : '';
  const marca = `${vista?.id ?? ''}|${config.visual.secciones.join()}`;
  // A dónde lleva el botón de la bandeja: la ronda que sigue en el recorrido, o lo que falte elegir.
  const pendiente = siguiente(config, elegidas);
  const proxima = ronda && pasoActual ? despuesDe(config, ronda.clave) : pendiente;
  const destino = proxima === LISTO_MOLDE && faltan.length ? pendiente : proxima;
  const puedeSeguir = ronda && destino !== ronda.clave && !(ronda.obligatoria && !elegidas.has(ronda.clave));
  // Ajustes finos: solo en una ronda ya elegida (se llega tocando su ficha) que tenga pasos del modo avanzado.
  const conAjustes = ronda && elegidas.has(ronda.clave) && AJUSTES[ronda.clave] ? ronda : null;
  const abiertos = ajustando && conAjustes;
  const cerrarAjustes = () => {
    setAjustando(false);
    enDosCuadros(() => botonAjustes.current?.focus({ preventScroll: true }));
  };
  const clases = ['molde', ronda && !abiertos ? 'eligiendo' : '', ronda && !abiertos && recogidas ? 'recogidas' : '', vista ? 'viendo' : '', abiertos ? 'ajustando' : '', terminado ? 'terminado' : ''].join(' ');
  // Scrollear o tocar la página recoge las ideas (sin soltar lo que se está mirando con el dedo).
  const usarPagina = () => ronda && !abiertos && !recogidas && (hayPagina || vista) && setRecogidas(true);
  const ficha = (r: Ronda, animar = true) => (
    <button key={r.clave} type="button" className={`molde-ficha ${animar && r.clave === nueva ? 'nueva' : ''}`} aria-current={r.clave === paso ? 'step' : undefined} onClick={() => ir(r.clave)}>
      {r.ficha}
      <b>{valorDeFicha(config, r)}</b>
    </button>
  );

  return (
    <div ref={raiz} className={clases}>
      <EstilosVisualesGlobales />
      {!terminado && (
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
      )}

      <main className="molde-main">
        {ronda && <h1 className="solo-lectores">Molde: armá el diseño de tu página</h1>}
        {terminado && (
          <h1 ref={tituloFinal} tabIndex={-1} className="solo-lectores">
            Tu página está lista
          </h1>
        )}

        {/* La pregunta y sus ideas van antes que la página: con Tab se llega a ellas sin cruzar toda la muestra.
            Con los ajustes finos abiertos se esconden: la página queda entera a la vista. */}
        {ronda && !abiertos && (
          <>
            <h2 key={`pregunta-${ronda.clave}`} className="molde-nucleo">
              <button ref={nucleo} type="button" className="molde-pregunta" aria-expanded={!recogidas} onClick={() => setRecogidas((r) => !r)}>
                <small className="molde-paso">
                  {recogidas ? 'Tocá para ver las ideas' : `${pasoActual ? `Paso ${pasos.findIndex((p) => p.id === pasoActual.id) + 1} de ${pasos.length} · ${pasoActual.nombre}` : `Ajustar · ${ronda.ficha}`}`}
                </small>
                {ronda.pregunta}
              </button>
            </h2>
            {ronda.clave === 'secciones' && config.visual.secciones.length > 0 && (
              <OrdenSecciones lista={config.visual.secciones} onCambiar={(secciones) => {
                setVista(null);
                setConfig((actual) => ({ ...actual, visual: { ...actual.visual, secciones } }));
              }} />
            )}
            <RondaAbierta
              key={ronda.clave}
              ronda={ronda}
              config={config}
              elegidas={elegidas}
              tamano={tamano}
              recogidas={recogidas}
              vista={vista}
              onVer={(op) => setVista({ id: op.id, config: ronda.aplicar(config, op.id, { elegidas }) })}
              onDejar={(op) => setVista((v) => (v?.id === op.id ? null : v))}
              onElegir={(op) => alElegir(ronda, op.id)}
            />
          </>
        )}

        {/* El lienzo: la página real, que se scrollea y se toca. Es una muestra: no navega ni envía nada. */}
        <div
          className={`molde-lienzo ${hayPagina ? 'hay' : ''}`}
          role="region"
          aria-label="Tu página, de muestra"
          hidden={paso === INICIO_MOLDE}
          onClick={alTocarLaMuestra}
          onWheel={usarPagina}
          onTouchMove={usarPagina}
          onPointerDown={usarPagina}
          onSubmit={(e) => e.preventDefault()}
          {...(descargando ? { inert: '' } : {})}
        >
          <Capa capa={capaBase} clase="molde-base" bajar={bajaSola} mostrar={mostrar} marca={marca}>
            {hayPagina && <Pagina key={config.visual.aparicion} config={config} />}
          </Capa>
          <Capa capa={capaPrev} clase={`molde-prev ${vista ? 'on' : ''}`} bajar={bajaSola && !!vista} mostrar={mostrar} marca={marca}>
            {vista && <Pagina key={vista.id} config={vista.config} />}
          </Capa>
        </div>

        {paso === INICIO_MOLDE && (
          <Suspense fallback={<div className="molde-centro"><button type="button" className="molde-empezar" onClick={() => ir(siguiente(config, elegidas))}>Empezar</button></div>}>
            <Portada empezar={() => ir(siguiente(config, elegidas))} />
          </Suspense>
        )}

        {terminado && (
          <div className="molde-esquina" {...(descargando ? { inert: '' } : {})}>
            <button type="button" className="molde-btn molde-btn-2" onClick={() => ir(delRecorrido[delRecorrido.length - 1].clave)}>
              Seguir editando
            </button>
            <button ref={botonDescargar} type="button" className="molde-btn molde-btn-1" aria-haspopup="dialog" onClick={() => setDescargando(true)}>
              Descargar
            </button>
          </div>
        )}

        {terminado && descargando && (
          <div className="molde-velo" onClick={(e) => e.target === e.currentTarget && cerrarDescarga()}>
            <section
              className="molde-descarga"
              role="dialog"
              aria-modal="true"
              aria-labelledby="molde-descarga-titulo"
              onKeyDown={(e) => {
                if (e.key === 'Escape') cerrarDescarga();
              }}
            >
              <div className="molde-descarga-cabeza">
                <h2 id="molde-descarga-titulo" ref={tituloDescarga} tabIndex={-1}>Tu molde está listo</h2>
                <button type="button" className="molde-btn molde-btn-2" onClick={cerrarDescarga}>Cerrar</button>
              </div>
              <p>Descargá el archivo y pasáselo a tu IA junto con lo que querés construir. El HTML te sirve para ver la página en tu navegador.</p>
              <div className="molde-descarga-acciones">
                <button type="button" className="molde-btn molde-btn-1" onClick={descargar}>Descargar DESIGN.md</button>
                <button type="button" className="molde-btn molde-btn-2" onClick={descargarHtml}>Descargar HTML</button>
              </div>
              <div className="molde-archivo">
                <h3>DESIGN.md</h3>
                <pre tabIndex={0} aria-label="Contenido de DESIGN.md">{archivo}</pre>
              </div>
              <details className="molde-resumen">
                <summary>Lo que elegiste · {fichas.length} decisiones</summary>
                <div className="molde-resumen-fichas">{[...fichas, ...ajustar].map((r) => ficha(r, false))}</div>
              </details>
              <button type="button" className="molde-enlace" onClick={empezarDeCero}>Empezar de cero</button>
            </section>
          </div>
        )}
      </main>

      {abiertos && (
        <Suspense fallback={<div className="molde-ajustes molde-ajustes-cargando" role="status">Cargando…</div>}>
          <Ajustes clave={abiertos.clave} titulo={abiertos.ficha} config={config} setConfig={setConfig} onCerrar={cerrarAjustes} />
        </Suspense>
      )}

      {!terminado && (
        <footer className="molde-pie">
          <div className="molde-fichas" aria-label="Lo que elegiste">
            {fichas.length === 0 && (
              <p className="molde-pista">
                {paso === INICIO_MOLDE
                  ? 'Gratis y sin cuenta. Lo que elegís queda en tu navegador.'
                  : 'Pasá el mouse o el foco por una idea para verla en la página. Elegila con un clic, con Enter o arrastrándola al centro.'}
              </p>
            )}
            {fichas.map((r) => ficha(r))}
            {ajustar.length > 0 && (
              <div className="molde-ajustar" role="group" aria-label="Ajustar">
                <span className="molde-ajustar-titulo">Ajustar</span>
                {ajustar.map((r) => ficha(r))}
              </div>
            )}
          </div>
          <div className="molde-final">
            {conAjustes && (
              <button ref={botonAjustes} type="button" className="molde-btn molde-btn-2" aria-expanded={ajustando} onClick={() => (ajustando ? cerrarAjustes() : setAjustando(true))}>
                Ajustes finos
              </button>
            )}
            {puedeSeguir && destino !== LISTO_MOLDE && (
              <button type="button" className={`molde-btn ${faltan.length ? 'molde-btn-1' : 'molde-btn-2'}`} onClick={() => ir(destino)}>
                {pasoActual ? 'Siguiente' : 'Seguir'}
              </button>
            )}
            {ronda && faltan.length === 0 && (
              <button type="button" className="molde-btn molde-btn-1" onClick={() => ir(LISTO_MOLDE)}>
                Terminar
              </button>
            )}
          </div>
        </footer>
      )}
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
  /** Recogidas arriba: siguen montadas (lo que se mira con el dedo no se pierde), pero no se ven ni se tocan. */
  recogidas: boolean;
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
      <div key={hoja} className={`molde-ideas ${abiertas ? 'abiertas' : ''}`} {...(props.recogidas ? { inert: '' } : {})} role="group" aria-label={`Ideas: ${ronda.pregunta}`}>
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
              onPointerLeave={(e) => e.pointerType === 'mouse' && !arrastre.current && tocada?.id !== op.id && props.onDejar(op)}
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
      {hojas > 1 && !props.recogidas && (
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
