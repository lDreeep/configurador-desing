// Renderiza una página completa con el layout y el estilo de la config.
// Usa solo los tokens de sistemaDeDiseno y el CSS de cada estilo: lo que se ve es lo que se exporta.

import { Suspense, type CSSProperties, type ReactNode } from 'react';
import { animarToque, IconoFlecha } from '../componentes/ui';
import { EstilosBotones } from '../botones-carga';
import { BotonPrincipal } from '../componentes/BotonPrincipal';
import { clasesDeCaja, CSS_CAJA, paramsDe } from '../cajas';
import { cssDeEstilo, ESTILOS, llevaArgumento } from '../estilos-visuales';
import { cssDeFondo, FONDOS, type FondoId, SELECTOR_FONDO } from '../fondos';
import { sistemaDeDiseno } from '../export/sistema';
import { useFuentes } from '../fuentes';
import { CONTENIDO_TIPO } from './contenido-tipo';
import { PlantillaAutor, PLANTILLAS_AUTOR } from './autores';
import { Cursor, FraseRevelada, Preguntas, useGuion, type Beat } from './demo';
import { LayoutNuevo } from './layouts2';
import type { Config, EstiloId } from '../tipos';

/** Hoja con el CSS de todos los estilos, cada uno limitado a su clase. Se monta una sola vez. */
export function EstilosVisualesGlobales() {
  const estilos = (Object.keys(ESTILOS) as EstiloId[]).map((id) => cssDeEstilo(id, `.pg.estilo-${id}`));
  // Las cajas van al final y con más especificidad: lo que se elige en su panel gana sobre el estilo.
  const cajas = CSS_CAJA.replace(/&/g, '.caja.caja.caja.caja');
  // Los fondos van después de los estilos: si se elige uno, gana sobre el visual del estilo.
  const auto = FONDOS_AUTO.map((id) => cssDeFondo(id, `.pg.pg .pg-media.fa-${id}`));
  const fondos = (Object.keys(FONDOS) as FondoId[]).map((id) => cssDeFondo(id, SELECTOR_FONDO(id)));
  // Los diseños de botón llegan aparte (botones-carga.tsx) y van antes que las cajas, como siempre.
  return (
    <>
      <style>{[...estilos, ...auto, ...fondos].join('\n')}</style>
      <EstilosBotones />
      <style>{cajas}</style>
    </>
  );
}

export function contenido(c: Config) {
  const p = c.proyecto;
  const base = CONTENIDO_TIPO[p.tipo] ?? CONTENIDO_TIPO.landing;
  const pantallas = c.estructura.pantallas;
  const propios = c.funciones.acciones.map((a, i) => ({ titulo: a, texto: pantallas[i]?.proposito || '' }));
  // Lo que la persona escribió gana; si no escribió nada, el contenido de muestra de su tipo de proyecto.
  const items = (propios.length >= 3 ? propios : base.items).slice(0, 4);
  while (items.length < 3) items.push(base.items[items.length]);
  return {
    marca: p.nombre.trim() || base.marca,
    titular: p.objetivo.trim() || p.descripcion.trim() || base.titular,
    bajada: p.objetivo.trim() && p.descripcion.trim() ? p.descripcion.trim() : base.bajada,
    items,
    nav: base.nav,
    cta: base.cta,
    ctaSecundario: base.ctaSecundario,
    cierre: base.cierre,
    prueba: base.prueba,
    frase: base.frase,
    testimonio: base.testimonio,
    preguntas: base.preguntas,
    onPrincipal: undefined as undefined | (() => void),
    onSecundario: undefined as undefined | (() => void),
  };
}

export type Contenido = ReturnType<typeof contenido>;

export function Botones({ c, k, prueba = true }: { c: Config; k: Contenido; prueba?: boolean }) {
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
      {prueba && k.prueba && <p className="pg-prueba">{k.prueba}</p>}
    </div>
  );
}

export function Nav({ k, simple = false }: { k: Contenido; simple?: boolean }) {
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
    <Fragmento i={i} />
    {children}
  </div>
);

export const Titulo = ({ k }: { k: Contenido }) => <h2 className="pg-titulo">{k.titular}</h2>;
export const Bajada = ({ k }: { k: Contenido }) => <p className="pg-bajada">{k.bajada}</p>;
/** Fondos que usan los visuales cuando la persona no eligió uno: nunca queda un bloque de color vacío. */
export const FONDOS_AUTO: FondoId[] = ['paisaje', 'desenfocado', 'curvas_nivel', 'grano', 'semitono', 'punteado', 'pixeles', 'vidrio_acanalado'];
export const Media = ({ clase = '', escena, f }: { clase?: string; escena?: Contenido; f?: number }) => (
  <div className={`pg-media ${clase} ${escena ? 'con-escena' : ''} ${f !== undefined ? `fa-${FONDOS_AUTO[f % FONDOS_AUTO.length]}` : ''}`} aria-hidden="true">
    {escena && <Escena k={escena} />}
  </div>
);

/**
 * El visual del hero (skill stageshow): la ventana del producto con datos del proyecto, y una
 * historia corta con cursor: toca la segunda fila, la acción queda hecha, la barra del día sube y
 * el aviso asoma sobre el borde. La causa del reinicio es cambiar de período. Corre solo a la
 * vista; con movimiento reducido queda en el resultado.
 */
const GUION_ESCENA: Beat[] = [
  { objetivo: 'fila', dura: 1100 },
  { objetivo: 'fila', clic: true, dura: 3400 },
  { objetivo: 'periodo', dura: 900 },
  { objetivo: 'periodo', clic: true, dura: 800 },
];

function Escena({ k }: { k: Contenido }) {
  const { ref, paso, vuelta, activo, beat } = useGuion(GUION_ESCENA, 1);
  const hecho = paso === 1 || paso === 2;
  const mes = vuelta % 2 === 1;
  const alturas = mes ? [52, 40, 66, 58, 74, 62, 70] : [38, 54, 46, 72, 60, 64, 70];
  const datos = mes ? ['$ 48.700', '$ 31.250', '$ 86.900'] : ['$ 12.400', '$ 8.900', '$ 21.300'];
  return (
    <div className="pg-escena" ref={ref}>
      <div className="pg-esc-ventana">
        <div className="pg-esc-barra">
          <i />
          <i />
          <i />
          <span>{k.marca}</span>
          <em className="pg-esc-periodo" data-objetivo="periodo" key={vuelta}>
            {mes ? 'Este mes' : 'Esta semana'}
          </em>
        </div>
        <div className={`pg-esc-cuerpo ${paso === 3 ? 'se-va' : ''}`} key={vuelta}>
          <span className="pg-esc-tit">{k.items[0]?.titulo}</span>
          <div className="pg-esc-grafico">
            {alturas.map((h, i) => (
              <span key={i} style={{ height: `${i === 5 && hecho ? 88 : h}%` }} className={i === 5 ? 'dest' : ''} />
            ))}
          </div>
          <div className="pg-esc-filas">
            {k.items.slice(0, 3).map((it, i) => (
              <span key={i} className={`pg-esc-fila ${i === 1 && hecho ? 'hecha' : ''}`} data-objetivo={i === 1 ? 'fila' : undefined}>
                <b className="pg-esc-av">{i === 1 && hecho ? '✓' : it.titulo.slice(0, 1)}</b>
                <span className="pg-esc-linea">{it.titulo}</span>
                <span className="pg-esc-dato">{datos[i]}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className={`pg-esc-chip uno ${hecho ? 'ver' : ''}`}>
        <span className="pg-esc-ok">✓</span> {k.cta}: listo
      </div>
      <div className="pg-esc-chip dos">
        <b key={String(hecho)} className="pg-esc-rueda">{hecho ? '+24%' : '+21%'}</b> {mes ? 'este mes' : 'esta semana'}
      </div>
      <Cursor escena={ref} beat={beat} paso={paso} activo={activo} />
    </div>
  );
}

/** Un pedacito de interfaz en cada tarjeta: le da algo para mirar además del texto. */
function Fragmento({ i }: { i: number }) {
  switch (i % 4) {
    case 0:
      return (
        <span className="pg-frag pg-frag-barras" aria-hidden="true">
          {[40, 62, 48, 80, 66].map((h, j) => (
            <i key={j} style={{ height: `${h}%` }} />
          ))}
        </span>
      );
    case 1:
      return (
        <span className="pg-frag pg-frag-switch" aria-hidden="true">
          <i />
          <b />
        </span>
      );
    case 2:
      return (
        <span className="pg-frag pg-frag-avatares" aria-hidden="true">
          <i>A</i>
          <i>M</i>
          <i>J</i>
          <b>+12</b>
        </span>
      );
    default:
      return (
        <span className="pg-frag pg-frag-avance" aria-hidden="true">
          <i />
        </span>
      );
  }
}

const ICONOS_CARD = ['M4 12l5 5L20 6', 'M12 3v18M3 12h18', 'M4 6h16M4 12h10M4 18h7', 'M12 21s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z'];

/**
 * Recorrido: cuatro pasos de texto y, al costado, un visual fijo que cambia con cada paso a
 * medida que bajás (CSS scroll-driven animations). Sin soporte o con movimiento reducido, queda
 * el primer visual quieto y los pasos se leen igual.
 */
function Recorrido({ c, k, f = 0 }: { c: Config; k: Contenido; f?: number }) {
  const pasos = k.items.slice(0, 4);
  while (pasos.length < 4) pasos.push(k.items[pasos.length % k.items.length]);
  return (
    <section className="pg-rc" aria-label="Cómo funciona">
      <div className="pg-rc-pasos">
        <h2 className="pg-rc-intro">Cómo funciona, paso a paso</h2>
        {pasos.map((p, i) => (
          <div key={i} className="pg-rc-paso">
            <span className="pg-rc-num">Paso {i + 1}</span>
            <h3>{p.titulo}</h3>
            {p.texto && <p>{p.texto}</p>}
          </div>
        ))}
      </div>
      <div className="pg-rc-visual" aria-hidden="true" ref={(el) => el?.setAttribute('inert', '')}>
        <div className={`pg-rc-capa pg-media fa-${FONDOS_AUTO[f % FONDOS_AUTO.length]}`}>
          <Escena k={k} />
        </div>
        <div className={`pg-rc-capa pg-media fa-${FONDOS_AUTO[(f + 1) % FONDOS_AUTO.length]}`}>
          <div className="pg-rc-tarjeta">
            <b>{pasos[1].titulo}</b>
            {pasos.slice(0, 3).map((p, i) => (
              <span key={i} className="pg-rc-fila">
                {p.titulo}
                <b>{['Hoy', 'Mañana', 'Viernes'][i]}</b>
              </span>
            ))}
          </div>
        </div>
        <div className={`pg-rc-capa pg-media fa-${FONDOS_AUTO[(f + 2) % FONDOS_AUTO.length]}`}>
          <div className="pg-rc-tarjeta">
            <span className="pg-rc-numero">+24%</span>
            <span>{pasos[2].titulo}</span>
            <Fragmento i={0} />
          </div>
        </div>
        <div className={`pg-rc-capa pg-media fa-${FONDOS_AUTO[(f + 3) % FONDOS_AUTO.length]}`}>
          <div className="pg-rc-tarjeta" style={{ alignItems: 'center', textAlign: 'center' }}>
            <span className="pg-rc-check">✓</span>
            <b>{pasos[3].titulo}</b>
            <BotonPrincipal config={c} clase="pg-boton" onClick={k.onPrincipal}>
              {k.cta}
            </BotonPrincipal>
          </div>
        </div>
        <div className="pg-rc-barra">
          <i />
          <i />
          <i />
          <i />
        </div>
      </div>
    </section>
  );
}

function Layout({ c, k }: { c: Config; k: Contenido }) {
  const caja = paramsDe(c);
  const cc = caja ? clasesDeCaja(caja) : '';
  const cards = k.items.map((it, i) => <Card key={i} i={i} item={it} cc={cc} />);
  const marcaPropia = c.proyecto.nombre.trim() || undefined;
  // Las plantillas de autor bajan aparte (autores.tsx); mientras llegan, un espacio vacío del alto de la página.
  if (PLANTILLAS_AUTOR[c.visual.layout]) {
    return (
      <Suspense fallback={<div className="pg-autor-cargando" aria-busy="true" />}>
        <PlantillaAutor layout={c.visual.layout} c={c} marca={marcaPropia} />
      </Suspense>
    );
  }
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
          <Recorrido c={c} k={k} f={1} />
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
            <div className="pg-numero" aria-hidden="true">{k.marca.slice(0, 1)}</div>
            <div className="pg-revista-texto">
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
          <Recorrido c={c} k={k} f={5} />
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
              <Titulo k={k} />
            </div>
            <Botones c={c} k={k} />
          </section>
          <section className="pg-galeria">
            {productos.map((it, i) => (
              <div key={i} className={`pg-card pg-producto ${cc}`} style={{ animationDelay: `${i * 50}ms` }}>
                <Media clase="pg-producto-foto" f={i} />
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
          <Recorrido c={c} k={k} f={4} />
          <section className="pg-fila">{cards}</section>
        </>
      );
    case 'blog_lateral':
      return (
        <>
          <Nav k={k} />
          <section className="pg-hero pg-blog-cabeza">
            <Titulo k={k} />
            <Bajada k={k} />
          </section>
          <section className="pg-blog">
            <div className="pg-blog-lista">
              {k.items.slice(0, 3).map((it, i) => (
                <article key={i} className="pg-articulo" style={{ animationDelay: `${i * 70}ms` }}>
                  <Media clase="pg-articulo-foto" f={i + 2} />
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
                <Botones c={c} k={k} prueba={false} />
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
            <Titulo k={k} />
            <Bajada k={k} />
          </section>
          <section className="pg-equipo">
            {personas.map(([n, r], i) => (
              <div key={n} className="pg-persona">
                <Media clase="pg-persona-foto" f={i + 1} />
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
        <>
        <section className="pg-fp">
          <div className="pg-fondo-area" aria-hidden="true" />
          <div className="pg-fp-velo" aria-hidden="true" />
          <div className="pg-fp-nav">
            <Nav k={k} />
          </div>
          <div className="pg-fp-texto">
            <Titulo k={k} />
            <Bajada k={k} />
          </div>
          <div className="pg-card pg-fp-tarjeta">
            <span className="pg-card-titulo">Próximas fechas</span>
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
        <Recorrido c={c} k={k} f={6} />
        </>
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
              <Titulo k={k} />
              <Bajada k={k} />
              <Botones c={c} k={k} />
            </div>
            <div className="pg-ef-lamina">
              <div className="pg-fondo-area" aria-hidden="true" />
              <div className="pg-card pg-ef-ficha">
                
                <span className="pg-card-titulo">14 al 21 de marzo</span>
                <span className="pg-card-texto">Quedan 6 lugares</span>
              </div>
            </div>
          </section>
          <Recorrido c={c} k={k} f={2} />
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
            <Media clase="alto" f={0} />
            {cards[0]}
            <Media escena={k} />
            {cards[1]}
            <Media clase="alto" f={3} />
            {cards[2]}
          </section>
        </>
      );
    case 'minimo':
      return (
        <>
          <Nav k={k} simple />
          <section className="pg-hero pg-minimo">
            <Titulo k={k} />
            <Bajada k={k} />
            <Botones c={c} k={k} />
          </section>
          <Recorrido c={c} k={k} f={3} />
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
              <Botones c={c} k={k} prueba={false} />
            </div>
            <div className="pg-kpis">
              {k.items.slice(0, 3).map((it, i) => (
                <div key={i} className={`pg-card ${cc}`} style={{ animationDelay: `${i * 70}ms` }}>
                  <span className="pg-etiqueta">{it.titulo}</span>
                  <span className="pg-kpi">{[128, 24, 96][i]}</span>
                </div>
              ))}
            </div>
            <Media clase="pg-grafico" escena={k} />
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
          <div className="pg-hz-pin">
          <section className="pg-horizontal" tabIndex={0} aria-label="Paneles de ejemplo">
            {k.items.map((it, i) => (
              <Card key={i} i={i} item={it} cc={cc}>
                {i === 0 ? <Media escena={k} /> : <Media f={i + 1} />}
              </Card>
            ))}
          </section>
          </div>
        </>
      );
    default:
      // Los 12 layouts de la tanda D3 viven en layouts2.tsx.
      return <LayoutNuevo c={c} k={k} cc={cc} />;
  }
}

/**
 * El argumento de la landing (skill landing-page-design), después de la composición de cada layout:
 * la frase grande que se enciende al bajar, la prueba con nombre junto a la promesa y las objeciones
 * respondidas. Va en todos los layouts de página; el estilo elegido le da la forma.
 */
function Argumento({ k }: { k: Contenido }) {
  return (
    <section className="pg-arg" aria-label="Por qué elegirnos">
      {k.frase && <FraseRevelada texto={k.frase} clase="pg-arg-frase" />}
      <div className="pg-arg-fila">
        {k.testimonio && (
          <figure className="pg-card pg-arg-testimonio">
            <blockquote>{k.testimonio.texto}</blockquote>
            <figcaption>
              <span className="pg-arg-av" aria-hidden="true">
                {k.testimonio.nombre
                  .split(' ')
                  .map((p) => p[0])
                  .join('')}
              </span>
              <span>
                <b>{k.testimonio.nombre}</b>
                {k.testimonio.rol}
              </span>
            </figcaption>
          </figure>
        )}
        {k.preguntas?.length > 0 && <Preguntas items={k.preguntas} clase="pg-arg-faq" />}
      </div>
    </section>
  );
}

/** El cierre y el pie en una sola franja, con un cambio de fondo que separa del resto de la página. */
function Cierre({ c, k }: { c: Config; k: Contenido }) {
  return (
    <footer className="pg-cierre">
      <div className="pg-cierre-fila">
        <p className="pg-cierre-texto">{k.cierre}</p>
        <BotonPrincipal config={c} clase="pg-boton" onClick={k.onPrincipal}>
          {k.cta}
        </BotonPrincipal>
      </div>
      <div className="pg-cierre-pie">
        <span className="pg-marca">{k.marca}</span>
        <span className="pg-cierre-links">
          {k.nav.map((n) => (
            <span key={n}>{n}</span>
          ))}
        </span>
        <span className="pg-cierre-legal">© 2026 {k.marca}</span>
      </div>
    </footer>
  );
}

export function Pagina({ config, contenido: propio }: { config: Config; contenido?: Contenido }) {
  const s = sistemaDeDiseno(config);
  const v = config.visual;
  useFuentes([v.fuenteTitulos, v.fuenteTexto]);
  const k = propio ?? contenido(config);
  const conDiseno = config.botones.diseno !== 'ninguno';
  const clases = [
    'pg pgp',
    `pg-l-${v.layout}`,
    v.layout.startsWith('autor_') ? 'pg-autor' : '',
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
      {llevaArgumento(v.layout) && <Argumento k={k} />}
      {v.layout !== 'link_bio' && <Cierre c={config} k={k} />}
    </div>
  );
}
