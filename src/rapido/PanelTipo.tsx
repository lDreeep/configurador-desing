// Modo rápido: «¿Qué vas a hacer?». Define el tipo de proyecto y qué paneles se muestran primero.

import { usePaso } from './BarraPasos';
import { useState, type CSSProperties } from 'react';
import { DISENO_POR_ESTILO } from '../botones-disenos';
import { ESTILOS, LAYOUTS } from '../estilos-visuales';
import { RECOMENDADOS } from '../recomendados';
import { aplicarCombinacion, type Combinacion } from './combinar';
import { Pagina } from './Pagina';
import { aplicarTipo } from '../estado';
import { sistemaDeDiseno } from '../export/sistema';
import { Icono } from '../galeria/iconos';
import type { Config, EstiloId, TipoProyecto } from '../tipos';

const OPCIONES: { tipo: TipoProyecto; nombre: string; descripcion: string; icono: string; plataformas: string[] }[] = [
  { tipo: 'landing', nombre: 'Página web', descripcion: 'Presentar un negocio, un producto o a vos', icono: 'inicio', plataformas: ['web_escritorio', 'web_movil'] },
  { tipo: 'sitio', nombre: 'Sitio con secciones', descripcion: 'Empresa, estudio u organización, con varias páginas', icono: 'edificio', plataformas: ['web_escritorio', 'web_movil'] },
  { tipo: 'tienda', nombre: 'Tienda online', descripcion: 'Catálogo, carrito y compra', icono: 'carrito', plataformas: ['web_escritorio', 'web_movil'] },
  { tipo: 'app_web', nombre: 'App web', descripcion: 'Una herramienta con cuentas y datos', icono: 'ajustes', plataformas: ['web_escritorio', 'web_movil'] },
  { tipo: 'app_movil', nombre: 'App para celular', descripcion: 'Pensada primero para el teléfono', icono: 'celular', plataformas: ['ios', 'android', 'web_movil'] },
  { tipo: 'dashboard', nombre: 'Dashboard', descripcion: 'Métricas, tablas y gestión', icono: 'grafico', plataformas: ['web_escritorio'] },
  { tipo: 'portfolio', nombre: 'Portfolio', descripcion: 'Mostrar tus trabajos o proyectos', icono: 'imagen', plataformas: ['web_escritorio', 'web_movil'] },
  { tipo: 'blog', nombre: 'Blog o revista', descripcion: 'Artículos, notas y novedades', icono: 'libro', plataformas: ['web_escritorio', 'web_movil'] },
];

/** Combinaciones recomendadas para el tipo que respetan lo que ya encaja del diseño actual. */
function alternativas(c: Config, tipo: TipoProyecto): Combinacion[] {
  const r = RECOMENDADOS[tipo];
  const v = c.visual;
  const layoutOk = r.layouts.includes(v.layout);
  const estiloOk = v.estilo !== 'clasico' && r.estilos.includes(v.estilo);
  if (layoutOk && estiloOk) return [];
  const vistas = new Set<string>();
  const res: Combinacion[] = [];
  for (let i = 0; res.length < 3 && i < 6; i++) {
    const layout = layoutOk ? v.layout : r.layouts[i % r.layouts.length];
    const estilo = estiloOk ? (v.estilo as EstiloId) : r.estilos[i % r.estilos.length];
    const clave = `${layout}-${estilo}`;
    if (vistas.has(clave)) continue;
    vistas.add(clave);
    const e = ESTILOS[estilo];
    const mismoEstilo = estilo === v.estilo;
    res.push({
      estilo,
      layout,
      paleta: mismoEstilo && v.paleta !== 'personalizada' ? v.paleta : e.paletas[0],
      titulos: mismoEstilo ? v.fuenteTitulos : e.fuentes[0][0],
      texto: mismoEstilo ? v.fuenteTexto : e.fuentes[0][1],
    });
  }
  return res;
}

/** La página real en miniatura, para comparar diseños. */
function Miniatura({ config }: { config: Config }) {
  return (
    <span className="pt-mini" aria-hidden="true">
      <span className="pt-mini-pagina">
        <Pagina config={config} />
      </span>
    </span>
  );
}

export function PanelTipo(props: { config: Config; setConfig: (fn: (c: Config) => Config) => void; onAtras: () => void; onSeguir: () => void }) {
  const c = props.config;
  const s = sistemaDeDiseno(c);
  const estilo = c.visual.estilo !== 'clasico' ? `estilo-${c.visual.estilo}` : '';
  const [opciones, setOpciones] = useState<Combinacion[]>([]);
  const tipo = c.proyecto.tipo;
  const r = RECOMENDADOS[tipo];
  /** Igual que «Elegir este diseño» en el inicio: estilo, layout, colores, letra y el botón del estilo. */
  const conDiseno = (x: Config, k: Combinacion): Config => {
    const y = aplicarCombinacion(x, k);
    return { ...y, botones: { ...y.botones, diseno: DISENO_POR_ESTILO[k.estilo] } };
  };
  const usar = (k: Combinacion) => {
    props.setConfig((x) => conDiseno(x, k));
    window.setTimeout(props.onSeguir, 220);
  };
  const actual = c.visual.estilo !== 'clasico' ? ESTILOS[c.visual.estilo].nombre : 'Clásico';
  return (
    <div className={`panel-botones panel-tipo pg ${estilo}`} style={s.tokens as CSSProperties}>
      <div className="pb-contenido pt-contenido">
        <header className="pb-cabecera">
          <span className="pg-etiqueta">{usePaso()}</span>
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
                const alt = alternativas(c, o.tipo);
                if (alt.length) setOpciones(alt);
                else window.setTimeout(props.onSeguir, 260);
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

        {opciones.length > 0 && (
          <section className="pt-sugerencia pg-card" aria-labelledby="pt-sug-titulo" ref={(el) => el?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
            <h2 id="pt-sug-titulo" className="pt-sug-titulo">Para tu {r.para}, estos diseños suelen funcionar mejor</h2>
            <p className="pt-sug-porque">{r.porque} Podés seguir con el tuyo: nada se pierde y todo se puede cambiar después.</p>
            <div className="pt-sug-grilla">
              <button type="button" className="pt-sug-opcion pt-sug-tuyo" onClick={() => window.setTimeout(props.onSeguir, 120)}>
                <Miniatura config={c} />
                <span className="pt-sug-nombre">Seguir con el mío</span>
                <span className="pt-sug-desc">
                  {LAYOUTS[c.visual.layout].nombre} · {actual}
                </span>
              </button>
              {opciones.map((k) => (
                <button key={`${k.layout}-${k.estilo}`} type="button" className="pt-sug-opcion" onClick={() => usar(k)}>
                  <Miniatura config={conDiseno(c, k)} />
                  <span className="pt-sug-nombre">★ Usar este</span>
                  <span className="pt-sug-desc">
                    {LAYOUTS[k.layout].nombre} · {ESTILOS[k.estilo].nombre}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
      <footer className="pb-pie">
        <button type="button" className="pb-pie-atras" onClick={props.onAtras}>
          Volver al diseño
        </button>
      </footer>
    </div>
  );
}
