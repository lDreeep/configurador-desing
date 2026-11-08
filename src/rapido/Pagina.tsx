// Renderiza una página completa con el layout y el estilo de la config.
// Usa solo los tokens de sistemaDeDiseno y el CSS de cada estilo: lo que se ve es lo que se exporta.

import type { CSSProperties, ReactNode } from 'react';
import { animarToque, IconoFlecha } from '../componentes/ui';
import { BOTONES, CSS_BASE_BOTON } from '../botones-disenos';
import { BotonPrincipal } from '../componentes/BotonPrincipal';
import { clasesDeCaja, CSS_CAJA, paramsDe } from '../cajas';
import { cssDeEstilo, ESTILOS } from '../estilos-visuales';
import { cssDeFondo, FONDOS, type FondoId, SELECTOR_FONDO } from '../fondos';
import { sistemaDeDiseno } from '../export/sistema';
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
  // Los fondos van después de los estilos: si se elige uno, gana sobre el visual del estilo.
  const fondos = (Object.keys(FONDOS) as FondoId[]).map((id) => cssDeFondo(id, SELECTOR_FONDO(id)));
  return <style>{[...estilos, ...fondos, ...botones, cajas].join('\n')}</style>;
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
    <span className="pg-card-ico" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={ICONOS_CARD[i % ICONOS_CARD.length]} />
      </svg>
    </span>
    <span className="pg-card-titulo">{item.titulo}</span>
    {item.texto && <span className="pg-card-texto">{item.texto}</span>}
    {children}
  </div>
);

const Titulo = ({ k }: { k: Contenido }) => <h2 className="pg-titulo">{k.titular}</h2>;
const Bajada = ({ k }: { k: Contenido }) => <p className="pg-bajada">{k.bajada}</p>;
const Media = ({ clase = '', escena }: { clase?: string; escena?: Contenido }) => (
  <div className={`pg-media ${clase} ${escena ? 'con-escena' : ''}`} aria-hidden="true">
    {escena && <Escena k={escena} />}
  </div>
);

/**
 * El visual del hero: en vez de un bloque de color vacío, una ventana del producto con datos
 * reales del proyecto y dos avisos flotantes. Le da profundidad a la página y usa solo tokens.
 */
function Escena({ k }: { k: Contenido }) {
  const alturas = [38, 54, 46, 72, 60, 88, 70];
  return (
    <div className="pg-escena">
      <div className="pg-esc-ventana">
        <div className="pg-esc-barra">
          <i />
          <i />
          <i />
          <span>{k.marca}</span>
        </div>
        <div className="pg-esc-cuerpo">
          <span className="pg-esc-tit">{k.items[0]?.titulo}</span>
          <div className="pg-esc-grafico">
            {alturas.map((h, i) => (
              <span key={i} style={{ height: `${h}%` }} className={i === 5 ? 'dest' : ''} />
            ))}
          </div>
          <div className="pg-esc-filas">
            {k.items.slice(0, 3).map((it, i) => (
              <span key={i} className="pg-esc-fila">
                <b className="pg-esc-av">{it.titulo.slice(0, 1)}</b>
                <span className="pg-esc-linea">{it.titulo}</span>
                <span className="pg-esc-dato">{['$ 12.400', '$ 8.900', '$ 21.300'][i]}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="pg-esc-chip uno">
        <span className="pg-esc-ok">✓</span> {k.cta}: listo
      </div>
      <div className="pg-esc-chip dos">
        <b>+24%</b> este mes
      </div>
    </div>
  );
}

const ICONOS_CARD = ['M4 12l5 5L20 6', 'M12 3v18M3 12h18', 'M4 6h16M4 12h10M4 18h7', 'M12 21s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z'];

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
            <Media escena={k} />
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
            <Media clase="pg-bento-media" escena={k} />
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
    case 'galeria': {
      const precios = ['$ 12.900', '$ 34.500', '$ 9.800', '$ 21.300', '$ 15.600', '$ 8.400', '$ 27.900', '$ 11.200'];
      const productos = [...k.items, ...k.items, ...k.items].slice(0, 8);
      return (
        <>
          <Nav k={k} />
          <section className="pg-hero pg-galeria-cabeza">
            <div>
              <span className="pg-etiqueta">Novedades</span>
              <Titulo k={k} />
            </div>
            <Botones c={c} k={k} />
          </section>
          <section className="pg-galeria">
            {productos.map((it, i) => (
              <div key={i} className={`pg-card pg-producto ${cc}`} style={{ animationDelay: `${i * 50}ms` }}>
                <Media clase="pg-producto-foto" />
                <span className="pg-card-titulo">{it.titulo}</span>
                <span className="pg-precio">{precios[i]}</span>
              </div>
            ))}
          </section>
        </>
      );
    }
    case 'precios': {
      const planes = [
        { nombre: 'Básico', precio: '$ 0', nota: 'Para probar', items: ['Lo esencial', '1 persona', 'Ayuda por email'] },
        { nombre: 'Pro', precio: '$ 9.900', nota: 'por mes', items: ['Todo lo del básico', 'Hasta 5 personas', 'Ayuda prioritaria'] },
        { nombre: 'Equipo', precio: '$ 24.900', nota: 'por mes', items: ['Todo lo del Pro', 'Personas sin límite', 'Asesoría dedicada'] },
      ];
      return (
        <>
          <Nav k={k} />
          <section className="pg-hero pg-centro">
            <Titulo k={k} />
            <Bajada k={k} />
          </section>
          <section className="pg-precios">
            {planes.map((pl, i) => (
              <div key={pl.nombre} className={`pg-card pg-plan ${i === 1 ? 'pg-destacado' : ''} ${cc}`} style={{ animationDelay: `${i * 70}ms` }}>
                {i === 1 && <span className="pg-etiqueta pg-plan-etq">Más elegido</span>}
                <span className="pg-card-titulo">{pl.nombre}</span>
                <span className="pg-plan-precio">
                  {pl.precio} <small>{pl.nota}</small>
                </span>
                <ul className="pg-plan-lista">
                  {pl.items.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                {i === 1 ? (
                  <BotonPrincipal config={c} clase="pg-boton" onClick={k.onPrincipal}>
                    {k.cta}
                  </BotonPrincipal>
                ) : (
                  <button type="button" className={`pv-boton pv-secundario est-${c.botones.estilo} pg-boton-sec`} onClick={k.onSecundario}>
                    Elegir {pl.nombre}
                  </button>
                )}
              </div>
            ))}
          </section>
        </>
      );
    }
    case 'portada_video':
      return (
        <>
          <Nav k={k} />
          <section className="pg-video">
            <Media clase="pg-video-fondo" />
            <div className="pg-video-texto">
              <Titulo k={k} />
              <Bajada k={k} />
              <Botones c={c} k={k} />
            </div>
            <span className="pg-video-play" aria-hidden="true">
              ▶
            </span>
          </section>
          <section className="pg-fila">{cards}</section>
        </>
      );
    case 'blog_lateral':
      return (
        <>
          <Nav k={k} />
          <section className="pg-hero pg-blog-cabeza">
            <span className="pg-etiqueta">Blog</span>
            <Titulo k={k} />
            <Bajada k={k} />
          </section>
          <section className="pg-blog">
            <div className="pg-blog-lista">
              {k.items.slice(0, 3).map((it, i) => (
                <article key={i} className="pg-articulo" style={{ animationDelay: `${i * 70}ms` }}>
                  <Media clase="pg-articulo-foto" />
                  <div className="pg-articulo-texto">
                    <span className="pg-etiqueta">{['Novedades', 'Guías', 'Historias'][i]}</span>
                    <span className="pg-card-titulo">{it.titulo}</span>
                    {it.texto && <span className="pg-card-texto">{it.texto}</span>}
                    <span className="pg-articulo-meta">{[5, 8, 3][i]} min de lectura</span>
                  </div>
                </article>
              ))}
            </div>
            <aside className="pg-blog-lateral">
              <div className={`pg-card ${cc}`}>
                <span className="pg-card-titulo">Sobre {k.marca}</span>
                <span className="pg-card-texto">Notas, guías y novedades, una vez por semana.</span>
                <Botones c={c} k={k} />
              </div>
              <div className="pg-chips">
                {['Diseño', 'Producto', 'Equipo', 'Clientes', 'Tutoriales'].map((t) => (
                  <span key={t} className="pg-chip">
                    {t}
                  </span>
                ))}
              </div>
            </aside>
          </section>
        </>
      );
    case 'equipo': {
      const personas = [
        ['Ana López', 'Fundadora'],
        ['Martín Ruiz', 'Diseño'],
        ['Juli Paz', 'Desarrollo'],
        ['Sofi Díaz', 'Atención'],
      ];
      const citas = ['Nos cambió la forma de trabajar.', 'Rápido, claro y siempre atentos.', 'Lo recomiendo sin dudar.'];
      return (
        <>
          <Nav k={k} />
          <section className="pg-hero pg-centro">
            <span className="pg-etiqueta">Quiénes somos</span>
            <Titulo k={k} />
            <Bajada k={k} />
          </section>
          <section className="pg-equipo">
            {personas.map(([n, r]) => (
              <div key={n} className="pg-persona">
                <Media clase="pg-persona-foto" />
                <span className="pg-card-titulo">{n}</span>
                <span className="pg-card-texto">{r}</span>
              </div>
            ))}
          </section>
          <section className="pg-testimonios">
            {citas.map((q, i) => (
              <figure key={q} className={`pg-card pg-testimonio ${cc}`} style={{ animationDelay: `${i * 70}ms` }}>
                <span className="pg-estrellas" aria-label="5 de 5 estrellas">
                  ★★★★★
                </span>
                <blockquote>{q}</blockquote>
                <figcaption>{['Laura G.', 'Pedro M.', 'Caro S.'][i]}</figcaption>
              </figure>
            ))}
          </section>
          <section className="pg-centro pg-equipo-acciones">
            <Botones c={c} k={k} />
          </section>
        </>
      );
    }
    case 'fondo_protagonista':
      return (
        <section className="pg-fp">
          <div className="pg-fondo-area" aria-hidden="true" />
          <div className="pg-fp-velo" aria-hidden="true" />
          <div className="pg-fp-nav">
            <Nav k={k} />
          </div>
          <div className="pg-fp-texto">
            <span className="pg-etiqueta">Temporada 2027</span>
            <Titulo k={k} />
            <Bajada k={k} />
          </div>
          <div className="pg-card pg-fp-tarjeta">
            <span className="pg-etiqueta">Próximas fechas</span>
            {k.items.slice(0, 3).map((it, i) => (
              <span key={i} className="pg-fp-fila">
                <span>{it.titulo}</span>
                <b>{['Sáb 14', 'Dom 15', 'Sáb 21'][i]}</b>
              </span>
            ))}
            <BotonPrincipal config={c} clase="pg-boton" onClick={k.onPrincipal}>
              {k.cta}
            </BotonPrincipal>
          </div>
        </section>
      );
    case 'tarjeta_sobre_fondo':
      return (
        <section className="pg-tsf">
          <div className="pg-fondo-area" aria-hidden="true" />
          <div className="pg-card pg-tsf-tarjeta">
            <span className="pg-marca">{k.marca}</span>
            <Titulo k={k} />
            <Bajada k={k} />
            <ul className="pg-tsf-lista">
              {k.items.slice(0, 3).map((it, i) => (
                <li key={i}>{it.titulo}</li>
              ))}
            </ul>
            <Botones c={c} k={k} />
          </div>
        </section>
      );
    case 'editorial_fondo':
      return (
        <>
          <Nav k={k} />
          <section className="pg-hero pg-ef">
            <div className="pg-ef-texto">
              <span className="pg-etiqueta">Edición de otoño</span>
              <Titulo k={k} />
              <Bajada k={k} />
              <Botones c={c} k={k} />
            </div>
            <div className="pg-ef-lamina">
              <div className="pg-fondo-area" aria-hidden="true" />
              <div className="pg-card pg-ef-ficha">
                <span className="pg-etiqueta">Salidas</span>
                <span className="pg-card-titulo">14 al 21 de marzo</span>
                <span className="pg-card-texto">Quedan 6 lugares</span>
              </div>
            </div>
          </section>
          <section className="pg-fila">{cards}</section>
        </>
      );
    case 'widgets_fondo':
      return (
        <section className="pg-wf">
          <div className="pg-fondo-area" aria-hidden="true" />
          <div className="pg-wf-nav">
            <Nav k={k} />
          </div>
          <div className="pg-wf-grilla">
            <div className="pg-card pg-wf-grande">
              <span className="pg-etiqueta">Hoy</span>
              <span className="pg-wf-numero">22:40</span>
              <span className="pg-card-texto">{k.titular}</span>
            </div>
            <div className="pg-card pg-wf-accion">
              <span className="pg-card-titulo">{k.items[0]?.titulo}</span>
              <span className="pg-card-texto">{k.bajada}</span>
              <Botones c={c} k={k} />
            </div>
            <div className="pg-card pg-wf-chica">
              <span className="pg-etiqueta">Carga</span>
              <span className="pg-wf-numero chico">41%</span>
            </div>
            <div className="pg-card pg-wf-chica">
              <span className="pg-etiqueta">Afuera</span>
              <span className="pg-wf-numero chico">9°</span>
            </div>
          </div>
        </section>
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
            <Media escena={k} />
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
                <Media escena={k} />
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
    v.fondo && v.fondo !== 'ninguno' ? `fondo-${v.fondo}` : '',
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
