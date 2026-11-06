// Modo rápido, paso 1: deslizar entre páginas completas hasta encontrar una que guste.

import { useCallback, useEffect, useRef, useState } from 'react';
import { FUENTES, PALETAS } from '../catalogo';
import { ESTILOS, LAYOUTS } from '../estilos-visuales';
import type { Config } from '../tipos';
import { aplicarCombinacion, type Candado, codigo, type Combinacion, combinacionAlAzar, combinacionDe, decodificar, totalCombinaciones } from './combinar';
import { Pagina } from './Pagina';

const CANDADOS: { id: Candado; nombre: string }[] = [
  { id: 'estilo', nombre: 'Estilo' },
  { id: 'layout', nombre: 'Layout' },
  { id: 'paleta', nombre: 'Colores' },
  { id: 'tipografia', nombre: 'Tipografía' },
];

function IconoCandado({ cerrado }: { cerrado: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d={cerrado ? 'M8 11V7a4 4 0 0 1 8 0v4' : 'M8 11V7a4 4 0 0 1 7.5-2'} />
    </svg>
  );
}

const Flecha = ({ izquierda = false }: { izquierda?: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={izquierda ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
  </svg>
);

function codigoDeLaUrl(): Combinacion | null {
  try {
    const m = window.location.hash.match(/c=([0-9a-z]{5})/i);
    return m ? decodificar(m[1]) : null;
  } catch {
    return null;
  }
}

export function ElegirPagina(props: {
  config: Config;
  setConfig: (fn: (c: Config) => Config) => void;
  onSeguir: () => void;
  onAvanzado: () => void;
}) {
  const { config, setConfig } = props;
  const [historial, setHistorial] = useState<Combinacion[]>(() => {
    const inicial = codigoDeLaUrl() ?? combinacionDe(config) ?? combinacionAlAzar(null, new Set());
    return [inicial];
  });
  const [pos, setPos] = useState(0);
  const [direccion, setDireccion] = useState<'izq' | 'der'>('der');
  const [candados, setCandados] = useState<Set<Candado>>(new Set());
  const [copiado, setCopiado] = useState(false);
  const actual = historial[pos];
  const escenario = useRef<HTMLDivElement>(null);

  // Al deslizar, la combinación visible pasa a ser la config (el modo avanzado la ve ya aplicada).
  // La primera no se aplica sola: así entrar al modo rápido no pisa una config armada a mano.
  const aplicada = useRef(codigo(historial[0]));
  useEffect(() => {
    if (codigo(actual) !== aplicada.current) {
      aplicada.current = codigo(actual);
      setConfig((c) => aplicarCombinacion(c, actual));
    }
    try {
      history.replaceState(null, '', `#c=${codigo(actual)}`);
    } catch {
      // sin acceso al historial (vista previa embebida): no pasa nada
    }
    escenario.current?.scrollTo({ top: 0 });
  }, [actual, setConfig]);

  const siguiente = useCallback(() => {
    setDireccion('der');
    if (pos < historial.length - 1) {
      setPos(pos + 1);
      return;
    }
    setHistorial((h) => [...h, combinacionAlAzar(h[h.length - 1], candados)]);
    setPos(pos + 1);
  }, [pos, historial.length, candados]);

  const anterior = useCallback(() => {
    if (pos === 0) return;
    setDireccion('izq');
    setPos(pos - 1);
  }, [pos]);

  // Teclado: flechas izquierda/derecha (salvo que se esté escribiendo).
  useEffect(() => {
    const alPresionar = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('input, textarea, select, [contenteditable]')) return;
      if (e.key === 'ArrowRight') siguiente();
      if (e.key === 'ArrowLeft') anterior();
    };
    window.addEventListener('keydown', alPresionar);
    return () => window.removeEventListener('keydown', alPresionar);
  }, [siguiente, anterior]);

  // Deslizar con el dedo o el mouse.
  const inicio = useRef<{ x: number; y: number } | null>(null);
  const alApoyar = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') return;
    inicio.current = { x: e.clientX, y: e.clientY };
  };
  const alSoltar = (e: React.PointerEvent) => {
    const i = inicio.current;
    inicio.current = null;
    if (!i) return;
    const dx = e.clientX - i.x;
    const dy = e.clientY - i.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx < 0 ? siguiente : anterior)();
  };

  const alternar = (id: Candado) =>
    setCandados((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const cod = codigo(actual);
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#c=${cod}`);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch {
      // sin portapapeles: el código igual está a la vista
    }
  };

  const valores: Record<Candado, string> = {
    estilo: ESTILOS[actual.estilo].nombre,
    layout: LAYOUTS[actual.layout].nombre,
    paleta: PALETAS[actual.paleta].nombre,
    tipografia: `${FUENTES[actual.titulos].nombre} + ${FUENTES[actual.texto].nombre}`,
  };

  return (
    <div className="rapido">
      <header className="rapido-barra">
        <div className="rapido-titulo">
          <span className="rapido-paso">Paso 1</span>
          <h1>Elegí tu página</h1>
        </div>
        <p className="rapido-ayuda">
          Deslizá o usá las flechas. Hay {totalCombinaciones().toLocaleString('es-AR')} combinaciones; fijá con el candado lo que te guste.
        </p>
        <button type="button" className="boton fantasma" onClick={props.onAvanzado}>
          Modo avanzado
        </button>
      </header>

      <div className="rapido-escenario-marco">
        <button type="button" className="rapido-flecha izquierda" onClick={anterior} disabled={pos === 0} aria-label="Página anterior">
          <Flecha izquierda />
        </button>
        <div
          ref={escenario}
          className="rapido-escenario"
          onPointerDown={alApoyar}
          onPointerUp={alSoltar}
          onPointerCancel={() => (inicio.current = null)}
        >
          <div key={`${pos}-${cod}`} className={`rapido-pagina entra-${direccion}`}>
            <Pagina config={aplicarCombinacion(config, actual)} />
          </div>
        </div>
        <button type="button" className="rapido-flecha derecha" onClick={siguiente} aria-label="Página siguiente">
          <Flecha />
        </button>
      </div>

      <footer className="rapido-pie">
        <div className="rapido-candados" role="group" aria-label="Fijar lo que te gusta">
          {CANDADOS.map((x) => (
            <button key={x.id} type="button" className="candado" aria-pressed={candados.has(x.id)} onClick={() => alternar(x.id)}>
              <IconoCandado cerrado={candados.has(x.id)} />
              <span className="candado-nombre">{x.nombre}</span>
              <span className="candado-valor">{valores[x.id]}</span>
            </button>
          ))}
        </div>
        <div className="rapido-acciones">
          <button type="button" className="codigo-chip" onClick={copiar} aria-label={`Copiar link de la combinación ${cod}`}>
            <span>Código</span>
            <strong>{cod}</strong>
            <span className="codigo-estado" aria-live="polite">
              {copiado ? 'Link copiado' : 'Copiar link'}
            </span>
          </button>
          <button type="button" className="boton secundario" onClick={siguiente}>
            Otra al azar
          </button>
          <button
            type="button"
            className="boton primario"
            onClick={() => {
              setConfig((c) => aplicarCombinacion(c, actual));
              props.onSeguir();
            }}
          >
            Me gusta esta
          </button>
        </div>
      </footer>
    </div>
  );
}
