// Inicio: la página entera es la publicidad del producto y cambia de diseño sola, de a una.
// «Comenzar» está siempre en el centro, fijo. Al tocarlo, esa misma página se despliega:
// aparecen las flechas para pasar de a una y el botón central pasa a ser «Elegir este diseño».

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ESTILOS, LAYOUTS } from '../estilos-visuales';
import type { Config } from '../tipos';
import { aplicarCombinacion, codigo, type Combinacion, combinacionAlAzar, decodificar, LISTA_FONDOS } from './combinar';
import { type Contenido, contenido as contenidoDe, Pagina } from './Pagina';
import { Esquema } from './esquemas';
import { FONDOS, type FondoId } from '../fondos';
import type { EstiloId, LayoutId } from '../tipos';

const INTERVALO = 4000;

const reducido = () => {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
};

function codigoDeLaUrl(): Combinacion | null {
  try {
    const m = window.location.hash.match(/c=([0-9a-z]{5})/i);
    return m ? decodificar(m[1]) : null;
  } catch {
    return null;
  }
}

interface Capa {
  id: number;
  k: Combinacion;
  sentido: 'adelante' | 'atras';
}

const Flecha = ({ izquierda = false }: { izquierda?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={izquierda ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
  </svg>
);

export function Inicio(props: { config: Config; onElegir: (k: Combinacion) => void; onAvanzado: () => void }) {
  const desdeUrl = useMemo(codigoDeLaUrl, []);
  // 'muestra': el diseño cambia solo y la página es fondo. 'eleccion': se pasa a mano y se elige.
  const [modo, setModo] = useState<'muestra' | 'eleccion'>(desdeUrl ? 'eleccion' : 'muestra');
  const [historial, setHistorial] = useState<Combinacion[]>(() => [desdeUrl ?? combinacionAlAzar(null, new Set())]);
  const [pos, setPos] = useState(0);
  const [capas, setCapas] = useState<Capa[]>(() => [{ id: 0, k: historial[0], sentido: 'adelante' }]);
  const [pausado, setPausado] = useState(reducido());
  const siguienteId = useRef(1);
  const escena = useRef<HTMLDivElement>(null);
  const actual = historial[pos];

  const mostrar = useCallback((k: Combinacion, sentido: Capa['sentido']) => {
    setCapas((cs) => {
      const nueva: Capa = { id: siguienteId.current++, k, sentido };
      // Sin animaciones, la nueva reemplaza a la anterior de golpe.
      return reducido() ? [nueva] : [cs[cs.length - 1], nueva];
    });
  }, []);

  const siguiente = useCallback(() => {
    if (pos < historial.length - 1) {
      mostrar(historial[pos + 1], 'adelante');
      setPos(pos + 1);
      return;
    }
    const k = combinacionAlAzar(historial[historial.length - 1], new Set());
    setHistorial((h) => [...h, k]);
    setPos(pos + 1);
    mostrar(k, 'adelante');
  }, [pos, historial, mostrar]);

  /** Muestra una combinación nueva a partir de la actual (descarta lo que había "adelante" en el historial). */
  const irA = useCallback(
    (k: Combinacion, sentido: Capa['sentido'] = 'adelante') => {
      setHistorial((h) => [...h.slice(0, pos + 1), k]);
      setPos(pos + 1);
      mostrar(k, sentido);
    },
    [pos, mostrar],
  );
  const LISTA_LAYOUTS = Object.keys(LAYOUTS) as LayoutId[];
  const LISTA_ESTILOS = Object.keys(ESTILOS) as EstiloId[];
  /** Cambia solo el layout: el estilo, los colores y la letra quedan igual. */
  const cambiarLayout = (paso: number) => {
    const i = LISTA_LAYOUTS.indexOf(actual.layout);
    irA({ ...actual, layout: LISTA_LAYOUTS[(i + paso + LISTA_LAYOUTS.length) % LISTA_LAYOUTS.length] }, paso < 0 ? 'atras' : 'adelante');
  };
  /** Cambia solo el estilo: el layout queda igual; colores y letra pasan a los del estilo nuevo. */
  const cambiarEstilo = (paso: number) => {
    const i = LISTA_ESTILOS.indexOf(actual.estilo);
    const estilo = LISTA_ESTILOS[(i + paso + LISTA_ESTILOS.length) % LISTA_ESTILOS.length];
    const e = ESTILOS[estilo];
    irA({ ...actual, estilo, paleta: e.paletas[0], titulos: e.fuentes[0][0], texto: e.fuentes[0][1] }, paso < 0 ? 'atras' : 'adelante');
  };
  /** Cambia solo el fondo con textura (incluye «sin fondo»). */
  const LISTA_FONDO: (FondoId | 'ninguno')[] = ['ninguno', ...LISTA_FONDOS];
  const cambiarFondo = (paso: number) => {
    const i = LISTA_FONDO.indexOf(actual.fondo ?? 'ninguno');
    irA({ ...actual, fondo: LISTA_FONDO[(i + paso + LISTA_FONDO.length) % LISTA_FONDO.length] }, paso < 0 ? 'atras' : 'adelante');
  };
  const [verLayouts, setVerLayouts] = useState(false);

  const anterior = useCallback(() => {
    if (pos === 0) return;
    mostrar(historial[pos - 1], 'atras');
    setPos(pos - 1);
  }, [pos, historial, mostrar]);

  // Muestra: cambia sola, de a una.
  useEffect(() => {
    if (modo !== 'muestra' || pausado) return;
    const t = window.setTimeout(() => {
      if (!document.hidden) siguiente();
    }, INTERVALO);
    return () => window.clearTimeout(t);
  }, [modo, pausado, pos, siguiente]);

  // Elección: flechas del teclado.
  useEffect(() => {
    if (modo !== 'eleccion') return;
    const alPresionar = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input, textarea, select, [contenteditable]')) return;
      if (e.key === 'ArrowRight') siguiente();
      if (e.key === 'ArrowLeft') anterior();
    };
    window.addEventListener('keydown', alPresionar);
    return () => window.removeEventListener('keydown', alPresionar);
  }, [modo, siguiente, anterior]);

  // Elección: deslizar con el dedo.
  const inicio = useRef<{ x: number; y: number } | null>(null);
  const alApoyar = (e: React.PointerEvent) => {
    if (modo === 'eleccion' && e.pointerType !== 'mouse') inicio.current = { x: e.clientX, y: e.clientY };
  };
  const alSoltar = (e: React.PointerEvent) => {
    const i = inicio.current;
    inicio.current = null;
    if (!i) return;
    const dx = e.clientX - i.x;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(e.clientY - i.y) * 1.5) (dx < 0 ? siguiente : anterior)();
  };

  const comenzar = () => {
    setModo('eleccion');
    escena.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const textos = (): Contenido => ({
    ...contenidoDe(props.config),
    marca: 'Armá tu página',
    titular: 'Diseñá tu web o tu app y llevate el archivo para tu IA',
    bajada: `Elegís entre ${Object.keys(ESTILOS).length} estilos y más de 500 piezas tocándolas. Al terminar descargás un DESIGN.md con el CSS de cada una.`,
    items: [
      { titulo: 'Probás cada pieza antes de elegirla', texto: 'Los botones se tocan, los menús se abren y los formularios se escriben.' },
      { titulo: `${Object.keys(ESTILOS).length} estilos con sus reglas`, texto: 'Cada estilo trae sus colores, sus letras y lo que no puede faltar.' },
      { titulo: 'Un prototipo con todo junto', texto: 'Antes de descargar ves tu app armada, en computadora y en celular.' },
      { titulo: 'Un archivo para cualquier IA', texto: 'Claude, v0 o Lovable leen el CSS real en lugar de adivinarlo.' },
    ],
    nav: ['Cómo funciona', 'Estilos', 'Ejemplos'],
    cta: 'Elegir un diseño',
    ctaSecundario: 'Ver cómo funciona',
    cierre: 'Gratis y sin cuenta. Lo que elegís queda guardado en tu navegador.',
  });

  return (
    <div className={`inicio modo-${modo}`}>
      <div ref={escena} className="inicio-escena" onPointerDown={alApoyar} onPointerUp={alSoltar} onPointerCancel={() => (inicio.current = null)}>
        {capas.map((capa, i) => {
          const ultima = i === capas.length - 1;
          const animando = capas.length > 1;
          return (
            <div
              key={capa.id}
              className={`inicio-capa ${animando ? (ultima ? `entra-${capa.sentido}` : `sale-${capas[capas.length - 1].sentido}`) : ''}`}
              aria-hidden={!ultima || modo === 'muestra'}
              {...(!ultima || modo === 'muestra' ? { inert: '' } : {})}
              onAnimationEnd={(e) => {
                if (ultima && animando && e.target === e.currentTarget) setCapas((cs) => cs.slice(-1));
              }}
            >
              <Pagina config={aplicarCombinacion(props.config, capa.k)} contenido={textos()} />
            </div>
          );
        })}
      </div>

      <h1 className="solo-lectores">Elegí el diseño de tu página</h1>
      <div className="inicio-velo" aria-hidden="true" />

      {modo === 'eleccion' && (
        <>
          <button type="button" className="inicio-flecha izquierda" onClick={anterior} disabled={pos === 0} aria-label="Diseño anterior">
            <Flecha izquierda />
          </button>
          <button type="button" className="inicio-flecha derecha" onClick={siguiente} aria-label="Diseño siguiente">
            <Flecha />
          </button>
        </>
      )}

      {/* El botón central nunca se mueve: en la muestra dice «Comenzar»; al elegir, «Elegir este diseño». */}
      <div className="inicio-centro">
        <div className="inicio-centro-caja">
          {modo === 'muestra' ? (
            <>
              <h1 className="inicio-centro-titulo">Armá tu página a medida</h1>
              <button type="button" className="inicio-boton" onClick={comenzar}>
                Comenzar
              </button>
            </>
          ) : (
            <>
              <div className="inicio-ajustes">
                <div className="inicio-ajuste" role="group" aria-label="Cambiar solo el layout">
                  <span className="inicio-ajuste-etq">Layout</span>
                  <button type="button" aria-label="Layout anterior" onClick={() => cambiarLayout(-1)}>
                    ‹
                  </button>
                  <span className="inicio-ajuste-valor" aria-live="polite">
                    {LAYOUTS[actual.layout].nombre}
                  </span>
                  <button type="button" aria-label="Layout siguiente" onClick={() => cambiarLayout(1)}>
                    ›
                  </button>
                </div>
                <div className="inicio-ajuste" role="group" aria-label="Cambiar solo el estilo">
                  <span className="inicio-ajuste-etq">Estilo</span>
                  <button type="button" aria-label="Estilo anterior" onClick={() => cambiarEstilo(-1)}>
                    ‹
                  </button>
                  <span className="inicio-ajuste-valor" aria-live="polite">
                    {ESTILOS[actual.estilo].nombre}
                  </span>
                  <button type="button" aria-label="Estilo siguiente" onClick={() => cambiarEstilo(1)}>
                    ›
                  </button>
                </div>
                <div className="inicio-ajuste" role="group" aria-label="Cambiar solo el fondo">
                  <span className="inicio-ajuste-etq">Fondo</span>
                  <button type="button" aria-label="Fondo anterior" onClick={() => cambiarFondo(-1)}>
                    ‹
                  </button>
                  <span className="inicio-ajuste-valor" aria-live="polite">
                    {actual.fondo && actual.fondo !== 'ninguno' ? FONDOS[actual.fondo].nombre : 'Sin fondo'}
                  </span>
                  <button type="button" aria-label="Fondo siguiente" onClick={() => cambiarFondo(1)}>
                    ›
                  </button>
                </div>
                <button type="button" className="inicio-ver-layouts" aria-expanded={verLayouts} onClick={() => setVerLayouts((v) => !v)}>
                  Ver todos los layouts
                </button>
              </div>
              <button type="button" className="inicio-boton" onClick={() => props.onElegir(actual)}>
                Elegir este diseño
              </button>
            </>
          )}
        </div>
      </div>

      {modo === 'eleccion' && verLayouts && (
        <div className="inicio-layouts" role="dialog" aria-label="Elegí un layout">
          <div className="inicio-layouts-cabeza">
            <strong>Elegí la estructura</strong>
            <span>Se mantiene el estilo, los colores y la letra.</span>
            <button type="button" className="inicio-layouts-cerrar" aria-label="Cerrar" onClick={() => setVerLayouts(false)}>
              ×
            </button>
          </div>
          <div className="inicio-layouts-grilla">
            {(Object.keys(LAYOUTS) as LayoutId[]).map((id) => (
              <button
                key={id}
                type="button"
                className="inicio-layout"
                aria-pressed={actual.layout === id}
                onClick={() => {
                  if (id !== actual.layout) irA({ ...actual, layout: id });
                  setVerLayouts(false);
                }}
              >
                <Esquema id={id} />
                <span className="inicio-layout-nombre">{LAYOUTS[id].nombre}</span>
                <span className="inicio-layout-desc">{LAYOUTS[id].descripcion}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="inicio-control" role="group" aria-label="Controles">
        {modo === 'muestra' ? (
          <button type="button" onClick={() => setPausado((p) => !p)} aria-label={pausado ? 'Reanudar el cambio de diseños' : 'Pausar el cambio de diseños'}>
            {pausado ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M7 5l12 7-12 7z" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            )}
          </button>
        ) : (
          <button type="button" className="inicio-texto" onClick={() => setModo('muestra')}>
            Volver
          </button>
        )}
        <span className="inicio-codigo" title="Código de este diseño">
          {codigo(actual)}
        </span>
        <button type="button" className="inicio-texto inicio-avanzado" onClick={props.onAvanzado}>
          Modo avanzado
        </button>
      </div>
    </div>
  );
}
