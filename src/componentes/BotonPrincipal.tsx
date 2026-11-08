// Botón principal con el diseño elegido (panel de botones) o con el estilo simple.
// Lo usan la vista previa, las páginas del modo rápido y el panel: siempre se ve igual que en el export.

import { useContext, type MouseEvent, type ReactNode, type CSSProperties } from 'react';
import { sistemaDeDiseno } from '../export/sistema';
import { EdicionContexto, claveElemento, resolverElemento } from '../rapido/edicion';
import { clasesDeBoton } from '../botones-disenos';
import { IconoFlecha } from '../pasos/visual';
import type { BotonDisenoId, Config } from '../tipos';
import { animarToque } from './ui';

export function claseBotonPrincipal(c: Config, diseno: BotonDisenoId | 'ninguno' = c.botones.diseno) {
  return diseno === 'ninguno' ? `pv-boton pv-primario est-${c.botones.estilo}` : `pv-boton ${clasesDeBoton(diseno, c.botones.efecto)}`;
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
  const edicion = useContext(EdicionContexto);
  const idElemento = edicion ? claveElemento(edicion.pantalla, 'boton', props.etiqueta ?? String(props.children)) : undefined;
  const config = edicion && idElemento ? resolverElemento(props.config, idElemento) : props.config;
  const icono = config.botones.icono;
  return (
    <button
      type="button"
      style={edicion && idElemento && edicion.config.elementos?.[idElemento] ? sistemaDeDiseno(config).tokens as CSSProperties : undefined}
      data-elemento-id={idElemento}
      data-editor-categoria="boton"
      className={`${claseBotonPrincipal(config, props.diseno)} ${props.clase ?? ''}`}
      aria-pressed={props.presionado}
      aria-label={props.etiqueta}
      data-texto={typeof props.children === 'string' ? props.children : undefined}
      onClick={(e) => {
        if (edicion?.editando && idElemento) { e.preventDefault(); e.stopPropagation(); edicion.seleccionar('boton', idElemento); return; }
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
