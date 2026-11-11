// Renderiza una página completa con el layout y el estilo de la config.
// Usa solo los tokens de sistemaDeDiseno y el CSS de cada estilo: lo que se ve es lo que se exporta.

import { lazy, Suspense, type CSSProperties, type ReactNode } from 'react';
import { animarToque } from '../componentes/toque';
import { EstilosBotones } from '../botones-carga';
import { BotonPrincipal } from '../componentes/BotonPrincipal';
import { clasesDeCaja, CSS_CAJA, paramsDe } from '../cajas';
import { llevaArgumento } from '../estilos-visuales';
import type { FondoId } from '../fondos';
import { sistemaDeDiseno } from '../export/sistema';
import { claseScroll, ELEMENTO_SCROLL } from '../scroll-base';
import { cargarHojaPagina, datosDeHoja, useHojaPagina } from './hoja';
import { useFuentes } from '../fuentes';
import { LayoutAparte, PlantillaAutor, PLANTILLAS_AUTOR } from './autores';
import { Cursor, FraseRevelada, Preguntas, useGuion, type Beat } from './demo';
import { esDisenoSeccion, llevaSecciones } from '../secciones-base';
import type { Config } from '../tipos';

// Las secciones (D12) bajan aparte, con su CSS, recién cuando se elige la primera.
// Si ya están cargadas se dibujan de una, sin pasar por Suspense.
let moduloSecciones: typeof import('./secciones') | null = null;
export const precargarSecciones = () => import('./secciones').then((m) => (moduloSecciones = m));
const SeccionesDiferidas = lazy(() => precargarSecciones().then((m) => ({ default: m.Secciones })));
function Secciones(props: { c: Config; k: Contenido }) {
  if (moduloSecciones) return <moduloSecciones.Secciones {...props} />;
  return (
    <Suspense fallback={null}>
      <SeccionesDiferidas {...props} />
    </Suspense>
  );
}

/**
 * Las hojas de la página. El CSS de los estilos, los fondos y el scroll baja aparte (hoja.ts);
 * acá quedan los diseños de botón (que también llegan aparte) y las cajas, al final y con más
 * especificidad: lo que se elige en su panel gana sobre el estilo. Se monta una sola vez.
 */
export function EstilosVisualesGlobales() {
  void cargarHojaPagina();
  const cajas = CSS_CAJA.replace(/&/g, '.caja.caja.caja.caja');
  return (
    <>
      <EstilosBotones />
      <style>{cajas}</style>
    </>
  );
}

/** El contenido de la página. El de muestra baja con la hoja (hoja.ts): si no llegó, suspende. */
export function contenido(c: Config) {
  const p = c.proyecto;
  const { CONTENIDO_TIPO } = datosDeHoja();
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

export const Card = ({ i, item, cc = '', children }: { i: number; item: { titulo: string; texto: string }; cc?: string; children?: ReactNode }) => (
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

export const ICONOS_CARD = ['M4 12l5 5L20 6', 'M12 3v18M3 12h18', 'M4 6h16M4 12h10M4 18h7', 'M12 21s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z'];

/**
 * Recorrido: cuatro pasos de texto y, al costado, un visual fijo que cambia con cada paso a
 * medida que bajás (CSS scroll-driven animations). Sin soporte o con movimiento reducido, queda
 * el primer visual quieto y los pasos se leen igual.
 */
export function Recorrido({ c, k, f = 0 }: { c: Config; k: Contenido; f?: number }) {
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
    default:
      // El resto de los layouts genéricos (layouts1.tsx) y los 12 de la tanda D3 (layouts2.tsx)
      // bajan aparte (autores.tsx).
      return (
        <Suspense fallback={<div className="pg-autor-cargando" aria-busy="true" />}>
          <LayoutAparte c={c} k={k} cc={cc} />
        </Suspense>
      );
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

/** La página. Espera su hoja de CSS (hoja.ts) para no mostrarse nunca sin estilo. */
export function Pagina(props: { config: Config; contenido?: Contenido }) {
  return (
    <Suspense fallback={<div className="pg-autor-cargando" aria-busy="true" />}>
      <PaginaConHoja {...props} />
    </Suspense>
  );
}

function PaginaConHoja({ config, contenido: propio }: { config: Config; contenido?: Contenido }) {
  useHojaPagina();
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
    ...(v.scroll ?? []).map(claseScroll),
  ].join(' ');
  const conSecciones =
    llevaSecciones(config.proyecto.tipo) && (v.secciones ?? []).some(esDisenoSeccion);
  const conBarra = (v.scroll ?? []).some((id) => ELEMENTO_SCROLL[id] === 'barra');
  return (
    <div className={clases} style={s.tokens as CSSProperties}>
      {conBarra && <div className="scroll-barra" aria-hidden="true" />}
      <div className="pg-deco" aria-hidden="true">
        <span className="a" />
        <span className="b" />
        <span className="c" />
      </div>
      <div className="pg-contenido">
        <Layout c={config} k={k} />
      </div>
      {/* Las secciones elegidas reemplazan al argumento genérico del layout. */}
      {conSecciones ? <Secciones c={config} k={k} /> : llevaArgumento(v.layout) && <Argumento k={k} />}
      {v.layout !== 'link_bio' && <Cierre c={config} k={k} />}
    </div>
  );
}
