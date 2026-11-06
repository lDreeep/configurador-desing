// Modo rápido: «¿Qué vas a hacer?». Define el tipo de proyecto y qué paneles se muestran primero.

import type { CSSProperties } from 'react';
import { aplicarTipo } from '../estado';
import { sistemaDeDiseno } from '../export/sistema';
import { Icono } from '../galeria/iconos';
import type { Config, TipoProyecto } from '../tipos';

const OPCIONES: { tipo: TipoProyecto; nombre: string; descripcion: string; icono: string; plataformas: string[] }[] = [
  { tipo: 'landing', nombre: 'Página web', descripcion: 'Presentar un negocio, un producto o a vos', icono: 'inicio', plataformas: ['web_escritorio', 'web_movil'] },
  { tipo: 'tienda', nombre: 'Tienda online', descripcion: 'Catálogo, carrito y compra', icono: 'corazon', plataformas: ['web_escritorio', 'web_movil'] },
  { tipo: 'app_web', nombre: 'App web', descripcion: 'Una herramienta con cuentas y datos', icono: 'ajustes', plataformas: ['web_escritorio', 'web_movil'] },
  { tipo: 'app_movil', nombre: 'App para celular', descripcion: 'Pensada primero para el teléfono', icono: 'perfil', plataformas: ['ios', 'android', 'web_movil'] },
  { tipo: 'dashboard', nombre: 'Dashboard', descripcion: 'Métricas, tablas y gestión', icono: 'grafico', plataformas: ['web_escritorio'] },
];

export function PanelTipo(props: { config: Config; setConfig: (fn: (c: Config) => Config) => void; onAtras: () => void; onSeguir: () => void }) {
  const c = props.config;
  const s = sistemaDeDiseno(c);
  const estilo = c.visual.estilo !== 'clasico' ? `estilo-${c.visual.estilo}` : '';
  return (
    <div className={`panel-botones panel-tipo pg ${estilo}`} style={s.tokens as CSSProperties}>
      <div className="pb-contenido pt-contenido">
        <header className="pb-cabecera">
          <span className="pg-etiqueta">Paso 2</span>
          <h1 className="pg-titulo">¿Qué vas a hacer?</h1>
          <p className="pg-bajada">Con esto ordenamos lo que viene: por ejemplo, si es para celular te mostramos primero las barras de navegación inferiores.</p>
        </header>
        <div className="pt-opciones">
          {OPCIONES.map((o) => (
            <button
              key={o.tipo}
              type="button"
              className={`pt-opcion pg-card ${c.proyecto.tipo === o.tipo ? 'elegida' : ''}`}
              aria-pressed={c.proyecto.tipo === o.tipo}
              onClick={() => {
                props.setConfig((x) => {
                  const y = aplicarTipo(x, o.tipo);
                  return { ...y, proyecto: { ...y.proyecto, plataformas: o.plataformas } };
                });
                window.setTimeout(props.onSeguir, 260);
              }}
            >
              <span className="pt-icono">
                <Icono nombre={o.icono} tamano={28} />
              </span>
              <span className="pt-nombre">{o.nombre}</span>
              <span className="pt-desc">{o.descripcion}</span>
            </button>
          ))}
        </div>
      </div>
      <footer className="pb-pie">
        <button type="button" className="pb-pie-atras" onClick={props.onAtras}>
          Volver al diseño
        </button>
      </footer>
    </div>
  );
}
