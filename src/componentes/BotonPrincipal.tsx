// Botón principal con el diseño elegido (panel de botones) o con el estilo simple.
// Lo usan la vista previa, las páginas del modo rápido y el panel: siempre se ve igual que en el export.

import type { MouseEvent, ReactNode } from 'react';
import { clasesDeBoton } from '../botones-disenos';
import { IconoFlecha } from '../pasos/visual';
import type { BotonDisenoId, Config } from '../tipos';
import { animarToque } from './ui';

export function claseBotonPrincipal(c: Config, diseno: BotonDisenoId | 'ninguno' = c.botones.diseno) {
  return diseno === 'ninguno' ? `pv-boton pv-primario est-${c.botones.estilo}` : `pv-boton ${clasesDeBoton(diseno)}`;
}

export function BotonPrincipal(props: {
  config: Config;
  children: ReactNode;
  diseno?: BotonDisenoId | 'ninguno';
  clase?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  presionado?: boolean;
  etiqueta?: string;
}) {
  const icono = props.config.botones.icono;
  return (
    <button
      type="button"
      className={`${claseBotonPrincipal(props.config, props.diseno)} ${props.clase ?? ''}`}
      aria-pressed={props.presionado}
      aria-label={props.etiqueta}
      data-texto={typeof props.children === 'string' ? props.children : undefined}
      onClick={(e) => {
        animarToque(e.currentTarget, e);
        props.onClick?.(e);
      }}
    >
      {icono === 'izquierda' && <IconoFlecha />}
      <span className="bt-texto">{props.children}</span>
      {icono === 'derecha' && <IconoFlecha />}
    </button>
  );
}
