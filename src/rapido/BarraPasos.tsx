// Barra de progreso del modo rápido: todos los pasos a la vista, el actual marcado y cualquiera se puede tocar.
// También provee la etiqueta «Paso N de M» que muestra cada panel (así la numeración nunca se desordena).

import { createContext, useContext, useEffect, useRef, type CSSProperties } from 'react';
import { sistemaDeDiseno } from '../export/sistema';
import type { Config } from '../tipos';

export const PasoContexto = createContext('');
/** «Paso 5 de 13» del panel actual. */
export const usePaso = () => useContext(PasoContexto);

export function BarraPasos<P extends string>(props: {
  config: Config;
  pasos: { id: P; nombre: string }[];
  actual: P;
  onIr: (p: P) => void;
}) {
  const s = sistemaDeDiseno(props.config);
  const i = props.pasos.findIndex((p) => p.id === props.actual);
  const lista = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const el = lista.current?.querySelector<HTMLElement>('[aria-current="step"]');
    el?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [props.actual]);
  return (
    <nav className="barra-pasos" aria-label="Pasos" style={s.tokens as CSSProperties}>
      <span className="bp-contador">
        {i + 1}/{props.pasos.length}
      </span>
      <ol className="bp-lista" ref={lista}>
        {props.pasos.map((p, j) => (
          <li key={p.id}>
            <button
              type="button"
              className={`bp-paso ${j < i ? 'hecho' : ''}`}
              aria-current={j === i ? 'step' : undefined}
              onClick={() => props.onIr(p.id)}
            >
              <span className="bp-num" aria-hidden="true">
                {j < i ? '✓' : j + 1}
              </span>
              {p.nombre}
            </button>
          </li>
        ))}
      </ol>
      <span className="bp-linea" aria-hidden="true" style={{ '--avance': `${((i + 1) / props.pasos.length) * 100}%` } as CSSProperties} />
    </nav>
  );
}
