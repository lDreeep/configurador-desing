// Inicio: la página entera es la publicidad del producto y cambia de diseño sola cada pocos segundos.
// «Comenzar», en el diseño que esté a la vista, lo guarda y lleva al panel de botones.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ESTILOS, LAYOUTS } from '../estilos-visuales';
import type { Config } from '../tipos';
import { aplicarCombinacion, codigo, type Combinacion, combinacionAlAzar, decodificar } from './combinar';
import { type Contenido, contenido as contenidoDe, Pagina } from './Pagina';

const INTERVALO = 3600;
const TRANSICIONES = ['fundido', 'barrido', 'circulo', 'persiana', 'zoom'] as const;
type Transicion = (typeof TRANSICIONES)[number];

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
  transicion: Transicion;
}

export function Inicio(props: { config: Config; onComenzar: (k: Combinacion) => void; onAvanzado: () => void }) {
  const desdeUrl = useMemo(codigoDeLaUrl, []);
  const [capas, setCapas] = useState<Capa[]>(() => [
    { id: 0, k: desdeUrl ?? combinacionAlAzar(null, new Set()), transicion: 'fundido' },
  ]);
  // Si se entra con un código en el link, arranca en pausa mostrando ese diseño.
  const [pausado, setPausado] = useState(desdeUrl !== null || reducido());
  const siguienteId = useRef(1);
  const actual = capas[capas.length - 1];

  const cambiar = useCallback((k?: Combinacion) => {
    setCapas((cs) => {
      const ultima = cs[cs.length - 1];
      const nueva: Capa = {
        id: siguienteId.current++,
        k: k ?? combinacionAlAzar(ultima.k, new Set()),
        transicion: TRANSICIONES[Math.floor(Math.random() * TRANSICIONES.length)],
      };
      // Quedan como mucho la anterior (debajo) y la nueva (entrando arriba). Sin animaciones, solo la nueva.
      return reducido() ? [nueva] : [ultima, nueva];
    });
  }, []);

  // Cambio automático; se reinicia cada vez que cambia el diseño (también si es a mano).
  useEffect(() => {
    if (pausado) return;
    const t = window.setTimeout(() => {
      if (!document.hidden) cambiar();
    }, INTERVALO);
    return () => window.clearTimeout(t);
  }, [pausado, actual.id, cambiar]);

  // Teclado: flechas para pasar a mano, espacio para pausar (salvo sobre un control).
  useEffect(() => {
    const alPresionar = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('input, textarea, select, button, a, [contenteditable]')) return;
      if (e.key === 'ArrowRight') cambiar();
      if (e.key === ' ') {
        e.preventDefault();
        setPausado((p) => !p);
      }
    };
    window.addEventListener('keydown', alPresionar);
    return () => window.removeEventListener('keydown', alPresionar);
  }, [cambiar]);

  const textos = (k: Combinacion): Contenido => {
    const base = contenidoDe(props.config);
    return {
      ...base,
      marca: 'Armá tu página',
      titular: 'Tu página, diseñada a tu medida',
      bajada:
        'Elegí cómo se ve tocando y deslizando: estilos, botones, colores y animaciones. Al final te llevás un archivo listo para que cualquier IA la construya tal cual.',
      items: [
        { titulo: 'Elegí viendo, no leyendo', texto: 'Cada opción se ve y se toca antes de elegirla.' },
        { titulo: `${Object.keys(ESTILOS).length} estilos que combinan`, texto: 'Del suizo al Y2K, con reglas para que nada desentone.' },
        { titulo: 'Botones que responden', texto: 'Formas, texturas y animaciones de click para probar en vivo.' },
        { titulo: 'Un archivo para cualquier IA', texto: 'Con el CSS real: la IA copia en vez de adivinar.' },
      ],
      nav: ['Cómo funciona', 'Estilos', 'Botones'],
      cta: 'Comenzar',
      ctaSecundario: 'Ver otro diseño',
      onPrincipal: () => window.setTimeout(() => props.onComenzar(k), 260),
      onSecundario: () => cambiar(),
    };
  };

  return (
    <div className="inicio">
      <div className="inicio-escena">
        {capas.map((capa, i) => {
          const entrando = i === capas.length - 1 && capas.length > 1;
          return (
            <div
              key={capa.id}
              className={`inicio-capa ${entrando ? `entra-${capa.transicion}` : ''}`}
              aria-hidden={i < capas.length - 1}
              onAnimationEnd={(e) => {
                if (entrando && e.target === e.currentTarget) setCapas((cs) => cs.slice(-1));
              }}
            >
              <Pagina config={aplicarCombinacion(props.config, capa.k)} contenido={textos(capa.k)} />
            </div>
          );
        })}
      </div>

      <div className="inicio-control" role="group" aria-label="Diseños de muestra">
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
        <button type="button" onClick={() => cambiar()} aria-label="Ver otro diseño">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
        <span className="inicio-etiqueta" aria-live="polite">
          {ESTILOS[actual.k.estilo].nombre} · {LAYOUTS[actual.k.layout].nombre} · <span className="inicio-codigo">{codigo(actual.k)}</span>
        </span>
        <button type="button" className="inicio-avanzado" onClick={props.onAvanzado}>
          Modo avanzado
        </button>
      </div>
    </div>
  );
}
