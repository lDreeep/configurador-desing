// Layouts genéricos que bajan aparte de la carga inicial (autores.tsx). En Pagina.tsx quedan los
// tres con los que puede abrir la portada (hero partido, bento y mínimo) y las piezas compartidas.
// Su CSS sigue en pagina.css, que es chico y lo usan todos.

import { BotonPrincipal } from '../componentes/BotonPrincipal';
import { IconoFlecha } from '../componentes/ui';
import type { PropsLayout } from './autores';
import { Bajada, Botones, Card, Media, Nav, Recorrido, Titulo } from './Pagina';

export function LayoutGenerico({ c, k, cc }: PropsLayout) {
  const cards = k.items.map((it, i) => <Card key={i} i={i} item={it} cc={cc} />);
  switch (c.visual.layout) {
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
      return null;
  }
}
