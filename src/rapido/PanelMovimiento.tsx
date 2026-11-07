// Modo rápido: movimiento. Ritmo general, cómo aparece el contenido y cómo se pasa de pantalla.
// Cada opción se ve en vivo: las demos se repiten solas cada pocos segundos.
// Las animaciones de los botones (al pasar el mouse y al tocar) ya se eligieron en el panel de botones.

import { usePaso } from './BarraPasos';
import { useEffect, useState, type CSSProperties } from 'react';
import { APARICIONES, CAMBIOS, MOVIMIENTOS } from '../catalogo';
import { BotonPrincipal } from '../componentes/BotonPrincipal';
import { aplicarMovimiento } from '../estado';
import { sistemaDeDiseno } from '../export/sistema';
import type { AparicionId, CambioId, Config, MovimientoId } from '../tipos';

const reducido = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Número que sube cada `ms` para volver a montar las demos y que se repitan. */
function useVuelta(ms: number) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (reducido()) return;
    const t = window.setInterval(() => setN((x) => x + 1), ms);
    return () => window.clearInterval(t);
  }, [ms]);
  return [n, () => setN((x) => x + 1)] as const;
}

function Bloques({ aparicion }: { aparicion: AparicionId }) {
  return (
    <span className={`pm-bloques pv-aparicion-${aparicion}`}>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="pv-bloque pm-bloque" style={{ animationDelay: `${i * 70}ms` }} />
      ))}
    </span>
  );
}

export function PanelMovimiento(props: {
  config: Config;
  setConfig: (fn: (c: Config) => Config) => void;
  onAtras: () => void;
  onSeguir: () => void;
}) {
  const c = props.config;
  const s = sistemaDeDiseno(c);
  const estilo = c.visual.estilo !== 'clasico' ? `estilo-${c.visual.estilo}` : '';
  const [vuelta, repetir] = useVuelta(2600);
  const setV = (cambio: Partial<Config['visual']>) => props.setConfig((x) => ({ ...x, visual: { ...x.visual, ...cambio } }));

  return (
    <div className={`panel-botones panel-movimiento pg ${estilo}`} style={s.tokens as CSSProperties}>
      <div className="pb-contenido">
        <header className="pb-cabecera">
          <span className="pg-etiqueta">{usePaso()}</span>
          <h1 className="pg-titulo">Elegí el movimiento</h1>
          <p className="pg-bajada">
            Cuánto se mueve tu app y a qué ritmo. Las demos se repiten solas; si querés verlas otra vez ya, tocá «Repetir». Las animaciones de los botones ya
            las elegiste en su panel.
          </p>
          <button type="button" className="pm-repetir" onClick={repetir}>
            ↻ Repetir demos
          </button>
        </header>

        <section className="pm-seccion" aria-labelledby="pm-ritmo">
          <h2 id="pm-ritmo" className="pm-titulo">Ritmo general</h2>
          <p className="pm-ayuda">Define la velocidad y la curva de todo. Elegir uno precarga cómo aparece el contenido y el cambio de pantalla.</p>
          <div className="pm-grilla">
            {(Object.keys(MOVIMIENTOS) as MovimientoId[]).map((id) => {
              const m = MOVIMIENTOS[id];
              const vars = { '--pm-dur': `${Math.max(m.media, 1) * 2}ms`, '--pm-curva': m.curvaEntrada } as CSSProperties;
              return (
                <button key={id} type="button" className="pm-opcion" aria-pressed={c.visual.movimiento === id} onClick={() => props.setConfig((x) => aplicarMovimiento(x, id))}>
                  <span className="pm-demo pm-pista" aria-hidden="true" style={vars}>
                    <span key={vuelta} className={`pm-bola ${m.media === 0 ? 'pm-salto' : ''}`} />
                  </span>
                  <span className="pm-nombre">{m.nombre}</span>
                  <span className="pm-desc">{m.descripcion}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="pm-seccion" aria-labelledby="pm-aparicion">
          <h2 id="pm-aparicion" className="pm-titulo">Cómo aparece el contenido</h2>
          <p className="pm-ayuda">Cuando se carga una pantalla o una lista: las cards, filas y bloques.</p>
          <div className="pm-grilla">
            {(Object.keys(APARICIONES) as AparicionId[]).map((id) => (
              <button key={id} type="button" className="pm-opcion" aria-pressed={c.visual.aparicion === id} onClick={() => setV({ aparicion: id })}>
                <span className="pm-demo" aria-hidden="true">
                  <Bloques key={vuelta} aparicion={id} />
                </span>
                <span className="pm-nombre">{APARICIONES[id].nombre}</span>
                <span className="pm-desc">{APARICIONES[id].descripcion}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="pm-seccion" aria-labelledby="pm-cambio">
          <h2 id="pm-cambio" className="pm-titulo">Cambio de pantalla</h2>
          <p className="pm-ayuda">Al pasar de una sección a otra de la app.</p>
          <div className="pm-grilla">
            {(Object.keys(CAMBIOS) as CambioId[]).map((id) => (
              <button key={id} type="button" className="pm-opcion" aria-pressed={c.visual.cambio === id} onClick={() => setV({ cambio: id })}>
                <span className="pm-demo pm-pantalla" aria-hidden="true">
                  <span key={vuelta} className={`pm-contenido proto-cambio-${id} ${vuelta % 2 ? 'pm-b' : 'pm-a'}`}>
                    <span className="pm-linea pm-larga" />
                    <span className="pm-linea" />
                    <span className="pm-caja" />
                  </span>
                </span>
                <span className="pm-nombre">{CAMBIOS[id].nombre}</span>
                <span className="pm-desc">{CAMBIOS[id].descripcion}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <footer className="pb-pie">
        <button type="button" className="pb-pie-atras" onClick={props.onAtras}>
          Volver
        </button>
        <span className="pb-pie-estado" aria-live="polite">
          {MOVIMIENTOS[c.visual.movimiento].nombre} · aparece: {APARICIONES[c.visual.aparicion].nombre.toLowerCase()} · pantallas: {CAMBIOS[c.visual.cambio].nombre.toLowerCase()}
        </span>
        <BotonPrincipal config={c} onClick={() => window.setTimeout(props.onSeguir, 220)}>
          Ver mi prototipo
        </BotonPrincipal>
      </footer>
    </div>
  );
}
