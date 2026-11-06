// Renderiza una página completa con el layout y el estilo de la config.
// Usa solo los tokens de sistemaDeDiseno y el CSS de cada estilo: lo que se ve es lo que se exporta.

import type { CSSProperties, ReactNode } from 'react';
import { animarToque } from '../componentes/ui';
import { BOTONES, CSS_BASE_BOTON } from '../botones-disenos';
import { BotonPrincipal } from '../componentes/BotonPrincipal';
import { clasesDeCaja, CSS_CAJA, paramsDe } from '../cajas';
import { cssDeEstilo, ESTILOS } from '../estilos-visuales';
import { sistemaDeDiseno } from '../export/sistema';
import { IconoFlecha } from '../pasos/visual';
import type { BotonDisenoId, Config, EstiloId } from '../tipos';

/** Hoja con el CSS de todos los estilos, cada uno limitado a su clase. Se monta una sola vez. */
export function EstilosVisualesGlobales() {
  const estilos = (Object.keys(ESTILOS) as EstiloId[]).map((id) => cssDeEstilo(id, `.pg.estilo-${id}`));
  const botones = [
    CSS_BASE_BOTON.replace(/&/g, '.bt'),
    ...(Object.keys(BOTONES) as BotonDisenoId[]).map((id) => BOTONES[id].css.replace(/&/g, `.bt.bt-${id}`)),
  ];
  // Las cajas van al final y con más especificidad: lo que se elige en su panel gana sobre el estilo.
  const cajas = CSS_CAJA.replace(/&/g, '.caja.caja.caja.caja');
  return <style>{[...estilos, ...botones, cajas].join('\n')}</style>;
}

export function contenido(c: Config) {
  const p = c.proyecto;
  const pantallas = c.estructura.pantallas;
  const marca = p.nombre.trim() || 'Tu marca';
  const titular = p.objetivo.trim() || p.descripcion.trim() || 'Tu idea, dicha en grande';
  const bajada =
    p.objetivo.trim() && p.descripcion.trim()
      ? p.descripcion.trim()
      : 'Acá va una frase que cuenta qué hacés y para quién. Se completa en el paso «Proyecto».';
  const fallback = [
    { titulo: 'Rápido', texto: 'Lo importante, sin vueltas.' },
    { titulo: 'Claro', texto: 'Cada cosa en su lugar.' },
    { titulo: 'A tu medida', texto: 'Hecho para tu forma de trabajar.' },
    { titulo: 'Siempre a mano', texto: 'En la compu y en el celular.' },
  ];
  const desdeAcciones = c.funciones.acciones.map((a, i) => ({ titulo: a, texto: pantallas[i]?.proposito || '' }));
  const desdePantallas = pantallas.map((x) => ({ titulo: x.nombre, texto: x.proposito }));
  const items = (desdeAcciones.length >= 3 ? desdeAcciones : desdePantallas.length >= 3 ? desdePantallas : fallback).slice(0, 4);
  while (items.length < 3) items.push(fallback[items.length]);
  return {
    marca,
    titular,
    bajada,
    items,
    nav: pantallas.slice(0, 4).map((x) => x.nombre),
    cta: pantallas[0]?.accionPrincipal.trim() || 'Empezar',
    ctaSecundario: 'Ver más',
    onPrincipal: undefined as undefined | (() => void),
    onSecundario: undefined as undefined | (() => void),
  };
}

export type Contenido = ReturnType<typeof contenido>;

function Botones({ c, k }: { c: Config; k: Contenido }) {
  return (
    <div className="pg-acciones">
      <BotonPrincipal config={c} clase="pg-boton" onClick={k.onPrincipal}>
        {k.cta}
      </BotonPrincipal>
      <button type="button" className={`pv-boton pv-secundario est-${c.botones.estilo} pg-boton-sec`} onClick={(e) => {
          animarToque(e.currentTarget, e);
          k.onSecundario?.();
        }}>
        {k.ctaSecundario}
      </button>
    </div>
  );
}

function Nav({ k, simple = false }: { k: Contenido; simple?: boolean }) {
  return (
    <nav className="pg-nav" aria-label="Navegación de ejemplo">
      <span className="pg-marca">{k.marca}</span>
      {!simple && (
        <span className="pg-links">
          {k.nav.map((n) => (
            <span key={n}>{n}</span>
          ))}
        </span>
      )}
    </nav>
  );
}

const Card = ({ i, item, cc = '', children }: { i: number; item: { titulo: string; texto: string }; cc?: string; children?: ReactNode }) => (
  <div className={`pg-card ${cc}`} style={{ animationDelay: `${i * 70}ms` }}>
    <span className="pg-etiqueta">{String(i + 1).padStart(2, '0')}</span>
    <span className="pg-card-titulo">{item.titulo}</span>
    {item.texto && <span className="pg-card-texto">{item.texto}</span>}
    {children}
  </div>
);

const Titulo = ({ k }: { k: Contenido }) => <h2 className="pg-titulo">{k.titular}</h2>;
const Bajada = ({ k }: { k: Contenido }) => <p className="pg-bajada">{k.bajada}</p>;
const Media = ({ clase = '' }: { clase?: string }) => <div className={`pg-media ${clase}`} aria-hidden="true" />;

function Layout({ c, k }: { c: Config; k: Contenido }) {
  const caja = paramsDe(c);
  const cc = caja ? clasesDeCaja(caja) : '';
  const cards = k.items.map((it, i) => <Card key={i} i={i} item={it} cc={cc} />);
  switch (c.visual.layout) {
    case 'hero_partido':
      return (
        <>
          <Nav k={k} />
          <section className="pg-hero pg-split">
            <div className="pg-split-texto">
              <Titulo k={k} />
              <Bajada k={k} />
              <Botones c={c} k={k} />
            </div>
            <Media />
          </section>
          <section className="pg-fila">{cards}</section>
        </>
      );
    case 'bento':
      return (
        <>
          <Nav k={k} />
          <section className="pg-bento">
            <div className="pg-hero pg-bento-principal">
              <Titulo k={k} />
              <Bajada k={k} />
              <Botones c={c} k={k} />
            </div>
            <Media clase="pg-bento-media" />
            {cards}
          </section>
        </>
      );
    case 'revista':
      return (
        <>
          <Nav k={k} />
          <section className="pg-hero pg-revista">
            <div className="pg-numero" aria-hidden="true">01</div>
            <div className="pg-revista-texto">
              <span className="pg-etiqueta">Edición de hoy</span>
              <Titulo k={k} />
            </div>
            <div className="pg-revista-col">
              <Bajada k={k} />
              <Botones c={c} k={k} />
            </div>
            <blockquote className="pg-cita">«{k.items[0].titulo}»</blockquote>
          </section>
          <section className="pg-fila">{cards}</section>
        </>
      );
    case 'tipografico':
      return (
        <>
          <Nav k={k} simple />
          <section className="pg-hero pg-afiche">
            <Titulo k={k} />
            <div className="pg-afiche-pie">
              <Bajada k={k} />
              <Botones c={c} k={k} />
            </div>
          </section>
        </>
      );
    case 'cinta': {
      const texto = k.items.map((x) => x.titulo).join('  •  ');
      return (
        <>
          <Nav k={k} />
          <section className="pg-hero pg-centro">
            <Titulo k={k} />
            <Bajada k={k} />
            <Botones c={c} k={k} />
          </section>
          <div className="pg-cinta" aria-hidden="true">
            <div className="pg-cinta-pista">
              <span>{texto}  •  </span>
              <span>{texto}  •  </span>
            </div>
          </div>
          <section className="pg-fila">{cards}</section>
        </>
      );
    }
    case 'apiladas':
      return (
        <>
          <Nav k={k} />
          <section className="pg-hero pg-split">
            <div className="pg-split-texto">
              <Titulo k={k} />
              <Bajada k={k} />
              <Botones c={c} k={k} />
            </div>
            <div className="pg-pila">{cards}</div>
          </section>
        </>
      );
    case 'indice':
      return (
        <>
          <Nav k={k} />
          <section className="pg-hero pg-indice">
            <div>
              <Titulo k={k} />
              <Bajada k={k} />
              <Botones c={c} k={k} />
            </div>
            <ol className="pg-indice-lista">
              {k.items.map((it, i) => (
                <li key={i} className="pg-indice-fila">
                  <span className="pg-etiqueta">{String(i + 1).padStart(2, '0')}</span>
                  <span className="pg-card-titulo">{it.titulo}</span>
                  <IconoFlecha />
                </li>
              ))}
            </ol>
          </section>
        </>
      );
    case 'panel_fijo':
      return (
        <div className="pg-panel">
          <aside className="pg-panel-color">
            <span className="pg-marca">{k.marca}</span>
            <Titulo k={k} />
          </aside>
          <div className="pg-panel-contenido">
            <Bajada k={k} />
            <Botones c={c} k={k} />
            <div className="pg-columna">{cards}</div>
          </div>
        </div>
      );
    case 'mosaico':
      return (
        <>
          <Nav k={k} />
          <section className="pg-hero pg-centro">
            <Titulo k={k} />
            <Botones c={c} k={k} />
          </section>
          <section className="pg-mosaico">
            <Media clase="alto" />
            {cards[0]}
            <Media />
            {cards[1]}
            <Media clase="alto" />
            {cards[2]}
          </section>
        </>
      );
    case 'minimo':
      return (
        <>
          <Nav k={k} simple />
          <section className="pg-hero pg-minimo">
            <span className="pg-etiqueta">{k.marca}</span>
            <Titulo k={k} />
            <Bajada k={k} />
            <Botones c={c} k={k} />
          </section>
        </>
      );
    case 'app_lateral':
      return (
        <div className="pg-app">
          <aside className="pg-nav pg-app-menu" aria-label="Menú de ejemplo">
            <span className="pg-marca">{k.marca}</span>
            {k.nav.map((n, i) => (
              <span key={n} className={i === 0 ? 'activo' : ''}>
                {n}
              </span>
            ))}
          </aside>
          <div className="pg-app-contenido">
            <div className="pg-app-cabecera">
              <h2 className="pg-titulo">{k.nav[0] ?? 'Inicio'}</h2>
              <Botones c={c} k={k} />
            </div>
            <div className="pg-kpis">
              {k.items.slice(0, 3).map((it, i) => (
                <div key={i} className={`pg-card ${cc}`} style={{ animationDelay: `${i * 70}ms` }}>
                  <span className="pg-etiqueta">{it.titulo}</span>
                  <span className="pg-kpi">{[128, 24, 96][i]}</span>
                </div>
              ))}
            </div>
            <Media clase="pg-grafico" />
          </div>
        </div>
      );
    case 'horizontal':
      return (
        <>
          <Nav k={k} />
          <section className="pg-hero">
            <Titulo k={k} />
            <Bajada k={k} />
            <Botones c={c} k={k} />
          </section>
          <section className="pg-horizontal" tabIndex={0} aria-label="Paneles de ejemplo">
            {k.items.map((it, i) => (
              <Card key={i} i={i} item={it} cc={cc}>
                <Media />
              </Card>
            ))}
          </section>
        </>
      );
  }
}

export function Pagina({ config, contenido: propio }: { config: Config; contenido?: Contenido }) {
  const s = sistemaDeDiseno(config);
  const v = config.visual;
  const k = propio ?? contenido(config);
  const conDiseno = config.botones.diseno !== 'ninguno';
  const clases = [
    'pg pgp',
    `pg-l-${v.layout}`,
    v.estilo !== 'clasico' ? `estilo-${v.estilo}` : '',
    conDiseno ? '' : `pv-hover-${v.hover}`,
    conDiseno ? '' : `pv-presionar-${v.presionar}`,
    `pv-aparicion-${v.aparicion}`,
  ].join(' ');
  return (
    <div className={clases} style={s.tokens as CSSProperties}>
      <div className="pg-deco" aria-hidden="true">
        <span className="a" />
        <span className="b" />
        <span className="c" />
      </div>
      <div className="pg-contenido">
        <Layout c={config} k={k} />
      </div>
    </div>
  );
}
