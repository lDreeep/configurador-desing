// Modo rápido, paso 3: cajas y contenedores. Diseños base para tocar y todos los ajustes finos.

import { usePaso } from './BarraPasos';
import { useId, type CSSProperties } from 'react';
import { CAJAS, clasesDeCaja, OPCIONES_CAJA, type ParamsCaja, paramsDe, tokensDeCaja } from '../cajas';
import { BotonPrincipal } from '../componentes/BotonPrincipal';
import { sistemaDeDiseno } from '../export/sistema';
import type { CajaPresetId, Config } from '../tipos';
import { Segmentado } from './PanelBotones';
import { ordenar, RECOMENDADOS } from '../recomendados';
import { SelloRecomendado, TituloRecomendados, TituloResto } from './Recomendados';
import './panel-cajas.css';

function Contenido({ titulo = 'Plan Pro' }: { titulo?: string }) {
  return (
    <>
      <span className="pc-etq">Destacado</span>
      <span className="pc-tit">{titulo}</span>
      <span className="pc-txt">Todo lo que necesitás para empezar, en un solo lugar.</span>
      <span className="pc-link">Ver más →</span>
    </>
  );
}

function Deslizador(props: { etiqueta: string; valor: number; min: number; max: number; paso: number; unidad: string; onCambiar: (v: number) => void }) {
  const id = useId();
  return (
    <div className="pb-grupo pc-deslizador">
      <label htmlFor={id} className="pb-etiqueta">
        {props.etiqueta} <span className="pc-valor">{props.valor}{props.unidad}</span>
      </label>
      <input id={id} type="range" min={props.min} max={props.max} step={props.paso} value={props.valor} onChange={(e) => props.onCambiar(+e.target.value)} />
    </div>
  );
}

const op = <K extends keyof typeof OPCIONES_CAJA>(k: K) => Object.entries(OPCIONES_CAJA[k]) as [ParamsCaja[K] & string, string][];

export function PanelCajas(props: {
  config: Config;
  setConfig: (fn: (c: Config) => Config) => void;
  onAtras: () => void;
  onSeguir: () => void;
}) {
  const c = props.config;
  const s = sistemaDeDiseno(c);
  const actual = paramsDe(c) ?? CAJAS.superficie.params;
  const elegido = c.cajas.preset;
  const estilo = c.visual.estilo !== 'clasico' ? `estilo-${c.visual.estilo}` : '';

  const elegir = (preset: CajaPresetId) => props.setConfig((x) => ({ ...x, cajas: { preset, ajustes: {} } }));
  const ajustar = (cambio: Partial<ParamsCaja>) =>
    props.setConfig((x) => ({
      ...x,
      cajas: { preset: x.cajas.preset === 'ninguno' ? 'superficie' : x.cajas.preset, ajustes: { ...x.cajas.ajustes, ...cambio } },
    }));
  const tokens = (params: ParamsCaja) => tokensDeCaja(params, s.paleta, s.radio.medio) as CSSProperties;
  const hayAjustes = Object.keys(c.cajas.ajustes).length > 0;
  const orden = ordenar(Object.keys(CAJAS) as CajaPresetId[], RECOMENDADOS[c.proyecto.tipo].cajas);
  const celda = (id: CajaPresetId, rec: boolean) => {
    const x = CAJAS[id];
    const sel = elegido === id;
    return (
      <button key={id} type="button" className={`pc-celda ${sel ? 'elegida' : ''} ${rec ? 'recomendada' : ''}`} aria-pressed={sel} onClick={() => elegir(id)}>
        {rec && <SelloRecomendado />}
        <span className="pc-escena" aria-hidden="true">
          <span className={clasesDeCaja(x.params)} style={tokens(x.params)}>
            <Contenido />
          </span>
        </span>
        <span className="pc-info">
          <span className="pc-nombre">{x.nombre}</span>
          <span className="pc-desc">{x.descripcion}</span>
        </span>
        {sel && (
          <span className="pb-sello" aria-hidden="true">
            {hayAjustes ? 'Elegido · ajustado' : 'Elegido'}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className={`panel-botones panel-cajas pg ${estilo}`} style={s.tokens as CSSProperties}>
      <div className="pb-contenido">
        <header className="pb-cabecera">
          <span className="pg-etiqueta">{usePaso()}</span>
          <h1 className="pg-titulo">Elegí tus cajas</h1>
          <p className="pg-bajada">
            Las cajas son las cards, paneles y bloques donde va el contenido. Elegí un diseño y ajustalo a gusto: fondo, transparencia, contorno, sombra, forma y qué
            hace al pasar el mouse. Las cajas están sobre manchas de color para que se note la transparencia.
          </p>
        </header>

        <div className="pc-cuerpo">
          <div className="pc-grilla">
            {orden.recomendados.length > 0 && <TituloRecomendados tipo={c.proyecto.tipo} />}
            {orden.recomendados.map((id) => celda(id, true))}
            {orden.recomendados.length > 0 && <TituloResto />}
            {orden.resto.map((id) => celda(id, false))}
          </div>

          <aside className="pc-lateral" aria-label="Ajustes de las cajas">
            <div className="pc-escena pc-escena-grande" aria-hidden="true">
              <span className={clasesDeCaja(actual)} style={tokens(actual)}>
                <Contenido />
              </span>
              <span className={clasesDeCaja(actual)} style={tokens(actual)}>
                <Contenido titulo="Plan Equipo" />
              </span>
            </div>
            <p className="pc-nota">Pasá el mouse por las cajas de arriba para ver el efecto.</p>

            <div className="pc-ajustes">
              <Segmentado etiqueta="Fondo" opciones={op('fondo')} valor={actual.fondo} onElegir={(fondo) => ajustar({ fondo })} />
              <Deslizador etiqueta="Transparencia" valor={actual.transparencia} min={0} max={90} paso={5} unidad="%" onCambiar={(transparencia) => ajustar({ transparencia })} />
              <Deslizador etiqueta="Desenfoque de lo de atrás" valor={actual.desenfoque} min={0} max={32} paso={2} unidad="px" onCambiar={(desenfoque) => ajustar({ desenfoque })} />
              <Deslizador etiqueta="Grosor del contorno" valor={actual.bordeGrosor} min={0} max={6} paso={1} unidad="px" onCambiar={(bordeGrosor) => ajustar({ bordeGrosor })} />
              <Segmentado etiqueta="Línea del contorno" opciones={op('bordeEstilo')} valor={actual.bordeEstilo} onElegir={(bordeEstilo) => ajustar({ bordeEstilo, bordeGrosor: actual.bordeGrosor || 2 })} />
              <Segmentado etiqueta="Color del contorno" opciones={op('bordeColor')} valor={actual.bordeColor} onElegir={(bordeColor) => ajustar({ bordeColor, bordeGrosor: actual.bordeGrosor || 1 })} />
              <Segmentado etiqueta="Esquinas" opciones={op('radio')} valor={actual.radio} onElegir={(radio) => ajustar({ radio })} />
              <Segmentado etiqueta="Sombra" opciones={op('sombra')} valor={actual.sombra} onElegir={(sombra) => ajustar({ sombra })} />
              <Segmentado etiqueta="Espacio interno" opciones={op('relleno')} valor={actual.relleno} onElegir={(relleno) => ajustar({ relleno })} />
              <Segmentado etiqueta="Forma" opciones={op('forma')} valor={actual.forma} onElegir={(forma) => ajustar({ forma })} />
              <Segmentado etiqueta="Al pasar el mouse" opciones={op('hover')} valor={actual.hover} onElegir={(hover) => ajustar({ hover })} />
              {hayAjustes && (
                <button type="button" className="pb-pie-atras" onClick={() => elegido !== 'ninguno' && elegir(elegido)}>
                  Volver al diseño base
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>

      <footer className="pb-pie">
        <button type="button" className="pb-pie-atras" onClick={props.onAtras}>
          Volver a los botones
        </button>
        <span className="pb-pie-estado" aria-live="polite">
          {elegido !== 'ninguno' ? `Elegido: ${CAJAS[elegido].nombre}${hayAjustes ? ' (ajustado)' : ''}` : 'Tocá una caja para elegirla'}
        </span>
        <BotonPrincipal config={c} onClick={() => window.setTimeout(props.onSeguir, 220)}>
          Seguir
        </BotonPrincipal>
      </footer>
    </div>
  );
}
