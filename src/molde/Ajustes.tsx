// Ajustes finos de una ficha (PLAN.md C4): el modo avanzado fundido en Molde. Tocar una ficha reabre
// su ronda; «Ajustes finos» abre al costado los controles de esos pasos (`PASOS`), con su nota.
// La página del lienzo sigue a la vista y cambia en vivo. Se carga aparte, solo si se abre.

import { useEffect, useRef, type ComponentType } from 'react';
import { NotaPaso } from '../componentes/ui';
import { NotasGenerales } from '../pasos/PasoExportar';
import { PASOS, type PropsPaso } from '../pasos/pasos';
import { AjustesDireccion } from '../pasos/visual';
import type { ClaveRonda } from '../rondas';
import type { PasoId } from '../tipos';
import { AJUSTES } from './recorrido';

/**
 * Pasos que en Molde se muestran en otra versión: Dirección sin pisar color, letra ni forma
 * (ya elegidos en sus rondas), y de Exportar solo las notas generales (la descarga está en el pie).
 */
const EN_MOLDE: Partial<Record<PasoId, ComponentType<PropsPaso>>> = {
  direccion: AjustesDireccion,
  exportar: NotasGenerales,
};

export default function Ajustes(props: PropsPaso & { clave: ClaveRonda; titulo: string; onCerrar: () => void }) {
  const { config, setConfig, onCerrar } = props;
  const titulo = useRef<HTMLHeadingElement>(null);
  useEffect(() => titulo.current?.focus({ preventScroll: true }), []);

  return (
    <aside
      className="molde-ajustes"
      aria-labelledby="molde-ajustes-titulo"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onCerrar();
      }}
    >
      <div className="molde-ajustes-cabeza">
        <h2 id="molde-ajustes-titulo" ref={titulo} tabIndex={-1}>
          Ajustes finos <span>· {props.titulo}</span>
        </h2>
        <button type="button" className="molde-btn molde-btn-1" onClick={onCerrar}>
          Listo
        </button>
      </div>
      <div className="molde-ajustes-cuerpo">
        {(AJUSTES[props.clave] ?? []).map((id) => {
          const paso = PASOS.find((p) => p.id === id)!;
          const Componente = EN_MOLDE[id] ?? paso.componente;
          return (
            <section key={id} className="molde-ajuste" data-paso={id}>
              <Componente config={config} setConfig={setConfig} />
              {paso.placeholderNota && (
                <NotaPaso
                  valor={config.notas[id] ?? ''}
                  placeholder={paso.placeholderNota}
                  onCambiar={(v) => setConfig((c) => ({ ...c, notas: { ...c.notas, [id]: v } }))}
                />
              )}
            </section>
          );
        })}
      </div>
    </aside>
  );
}
