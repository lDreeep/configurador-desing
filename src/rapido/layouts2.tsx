// Los 12 layouts genéricos de la tanda D3 (PLAN.md §7.5). Cada uno parte de una idea propia:
// una línea que termina en el botón, una barra que compara, un mapa que responde a la lista…
// Usan las mismas piezas y clases que Pagina.tsx (.pg-card, .pg-media, .pg-titulo), así los 20
// estilos les dan su textura sin reglas nuevas. Su CSS está en layouts2.css (lo carga main.tsx después de pagina.css).

import { useId, useState, type CSSProperties } from 'react';
import { BotonPrincipal } from '../componentes/BotonPrincipal';
import { IconoFlecha } from '../componentes/ui';
import type { Config } from '../tipos';
import { Bajada, Botones, type Contenido, FONDOS_AUTO, Media, Nav, Titulo } from './Pagina';

interface Props {
  c: Config;
  k: Contenido;
  /** Clases de la caja elegida, para las tarjetas. */
  cc: string;
}

/** Siempre cuatro puntos, aunque el contenido traiga tres. */
const cuatro = (k: Contenido) => {
  const items = k.items.slice(0, 4);
  while (items.length < 4) items.push(k.items[items.length % k.items.length]);
  return items;
};
const pesos = (n: number) => `$ ${n.toLocaleString('es-AR')}`;
const inicial = (s: string) => s.trim().slice(0, 1).toUpperCase();

/* ---------- Línea de tiempo ---------- */
function LineaTiempo({ c, k, cc }: Props) {
  const cuando = ['Día 1', 'Semana 1', 'Semana 3', 'Después'];
  return (
    <>
      <Nav k={k} />
      <section className="pg-hero">
        <Titulo k={k} />
        <Bajada k={k} />
        <Botones c={c} k={k} />
      </section>
      <ol className="pg-lt">
        {cuatro(k).map((it, i) => (
          <li key={i} className="pg-lt-hito">
            <span className="pg-lt-cuando">{cuando[i]}</span>
            <span className="pg-lt-nodo" aria-hidden="true" />
            <div className={`pg-card ${cc}`}>
              <span className="pg-card-titulo">{it.titulo}</span>
              {it.texto && <span className="pg-card-texto">{it.texto}</span>}
              {i === 3 && (
                <BotonPrincipal config={c} clase="pg-boton" onClick={k.onPrincipal}>
                  {k.cta}
                </BotonPrincipal>
              )}
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}

/* ---------- Antes y después ---------- */
const ANTES = ['Planillas sueltas', 'Mensajes que se pierden', 'Todo de memoria', 'Cuentas a mano'];

function AntesDespues({ c, k }: Props) {
  const [pos, setPos] = useState(50);
  const items = cuatro(k);
  return (
    <>
      <Nav k={k} />
      <section className="pg-hero pg-centro">
        <Titulo k={k} />
        <Bajada k={k} />
      </section>
      <section className="pg-ad" style={{ '--ad': `${pos}%` } as CSSProperties}>
        <div className={`pg-ad-lado pg-media fa-${FONDOS_AUTO[2]}`} aria-hidden="true">
          <span className="pg-ad-rotulo der">Después</span>
          <div className="pg-rc-tarjeta">
            <b>{k.marca}</b>
            {items.slice(0, 3).map((it, i) => (
              <span key={i} className="pg-rc-fila">
                {it.titulo}
                <b className="pg-ad-tilde">✓</b>
              </span>
            ))}
          </div>
        </div>
        <div className="pg-ad-lado pg-ad-antes" aria-hidden="true">
          <span className="pg-ad-rotulo">Antes</span>
          <div className="pg-ad-notas">
            {ANTES.slice(0, 3).map((a) => (
              <span key={a}>{a}</span>
            ))}
          </div>
        </div>
        <span className="pg-ad-barra" aria-hidden="true">
          <i>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
            </svg>
          </i>
        </span>
        <input
          type="range"
          className="pg-ad-control"
          min={4}
          max={96}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Mover la comparación entre antes y después"
        />
      </section>
      <section className="pg-ad-pares" aria-label="Qué cambia">
        <div className="pg-ad-par pg-ad-par-cabeza" aria-hidden="true">
          <span>Antes</span>
          <span>Con {k.marca}</span>
        </div>
        {items.map((it, i) => (
          <div key={i} className="pg-ad-par">
            <s>{ANTES[i]}</s>
            <span>
              <b>{it.titulo}</b>
              {it.texto}
            </span>
          </div>
        ))}
      </section>
      <section className="pg-hero pg-centro">
        <Botones c={c} k={k} />
      </section>
    </>
  );
}

/* ---------- Mapa con lista ---------- */
const LUGARES = [
  { nombre: 'Palermo', direccion: 'Thames 1380', a: 'a 300 m', horario: 'Abierto hasta las 20', x: 34, y: 30 },
  { nombre: 'Caballito', direccion: 'Av. Rivadavia 4520', a: 'a 1,2 km', horario: 'Abierto hasta las 19', x: 66, y: 22 },
  { nombre: 'Belgrano', direccion: 'Av. Cabildo 2240', a: 'a 2,5 km', horario: 'Abre mañana a las 9', x: 54, y: 58 },
  { nombre: 'San Telmo', direccion: 'Defensa 910', a: 'a 4 km', horario: 'Abierto hasta las 21', x: 80, y: 74 },
];

function MapaLista({ c, k, cc }: Props) {
  const [sel, setSel] = useState(0);
  return (
    <div className="pg-ml">
      <div className="pg-ml-panel">
        <Nav k={k} simple />
        <Titulo k={k} />
        <Bajada k={k} />
        <ul className="pg-ml-lista">
          {LUGARES.map((l, i) => (
            <li key={l.nombre}>
              <button type="button" className={`pg-card pg-ml-lugar ${cc} ${i === sel ? 'activo' : ''}`} aria-pressed={i === sel} onClick={() => setSel(i)}>
                <span className="pg-ml-letra" aria-hidden="true">
                  {'ABCD'[i]}
                </span>
                <span className="pg-ml-datos">
                  <span className="pg-card-titulo">{l.nombre}</span>
                  <span className="pg-card-texto">
                    {l.direccion}, {l.a}
                  </span>
                  <span className="pg-card-texto">{l.horario}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <Botones c={c} k={k} prueba={false} />
      </div>
      <div className="pg-ml-mapa" aria-hidden="true">
        <svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice">
          <path className="pg-ml-rio" d="M-20 470 C120 430 190 560 330 520 S520 420 640 470 V640 H-20Z" />
          <path className="pg-ml-plaza" d="M250 190h120v90H250z" />
          <g className="pg-ml-calles">
            <path d="M-20 110H640M-20 190H640M-20 280H640M-20 370H640M90 -20V480M170 -20V500M250 -20V540M370 -20V520M450 -20V470M530 -20V450" />
          </g>
          <g className="pg-ml-avenidas">
            <path d="M-20 40L640 330M330 -20L210 640" />
          </g>
        </svg>
        {LUGARES.map((l, i) => (
          <span key={l.nombre} className={`pg-ml-marca ${i === sel ? 'activo' : ''}`} style={{ left: `${l.x}%`, top: `${l.y}%` }}>
            <b>{'ABCD'[i]}</b>
            {i === sel && (
              <span className="pg-ml-ficha">
                <b>{l.nombre}</b>
                {l.horario}
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Carta de restaurante ---------- */
function Carta({ c, k }: Props) {
  const precios = [12900, 8500, 6200, 15400];
  return (
    <>
      <Nav k={k} />
      <section className="pg-card pg-carta">
        <header className="pg-carta-cabeza">
          <Titulo k={k} />
          <Bajada k={k} />
        </header>
        <div className="pg-carta-cuerpo">
          <ul className="pg-carta-lista">
            {cuatro(k).map((it, i) => (
              <li key={i} className={i === 0 ? 'destacado' : ''}>
                <span className="pg-carta-renglon">
                  <span className="pg-card-titulo">{it.titulo}</span>
                  <i aria-hidden="true" />
                  <span className="pg-precio">{pesos(precios[i])}</span>
                </span>
                {it.texto && <span className="pg-card-texto">{it.texto}</span>}
              </li>
            ))}
          </ul>
          <div className="pg-carta-foto">
            <Media f={0} />
            <span className="pg-carta-sello">
              <b>Martes a domingo</b>
              de 9 a 20
            </span>
          </div>
        </div>
        <div className="pg-carta-talon">
          {k.prueba && <p className="pg-card-texto">{k.prueba}</p>}
          <Botones c={c} k={k} prueba={false} />
        </div>
      </section>
    </>
  );
}

/* ---------- Agenda semanal ---------- */
const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const SEMANAS = [
  { rango: '9 al 14 de noviembre', desde: 9 },
  { rango: '16 al 21 de noviembre', desde: 16 },
];
/** [día, fila de inicio (0 = 9 h, de a media hora), medias horas, punto del contenido, clase] */
const TURNOS: [number, number, number, number, 'lleno' | 'suave' | 'linea'][] = [
  [0, 1, 3, 0, 'lleno'],
  [0, 9, 2, 2, 'linea'],
  [1, 3, 2, 1, 'suave'],
  [1, 12, 4, 3, 'lleno'],
  [2, 0, 2, 2, 'suave'],
  [2, 7, 3, 0, 'lleno'],
  [3, 5, 4, 1, 'linea'],
  [3, 13, 2, 0, 'suave'],
  [4, 2, 2, 3, 'lleno'],
  [4, 10, 3, 2, 'suave'],
  [5, 1, 4, 1, 'suave'],
];
const hora = (fila: number) => `${9 + Math.floor(fila / 2)}:${fila % 2 ? '30' : '00'}`;
const HOY = 2;

function AgendaSemanal({ c, k }: Props) {
  const [semana, setSemana] = useState(0);
  const [dia, setDia] = useState(HOY);
  const items = cuatro(k);
  const s = SEMANAS[semana];
  return (
    <>
      <Nav k={k} />
      <section className="pg-ag-cabeza">
        <h2 className="pg-titulo">{k.nav[0] ?? 'Agenda'}</h2>
        <div className="pg-ag-semana">
          <button type="button" aria-label="Semana anterior" disabled={semana === 0} onClick={() => setSemana(0)}>
            ‹
          </button>
          <b aria-live="polite">{s.rango}</b>
          <button type="button" aria-label="Semana siguiente" disabled={semana === 1} onClick={() => setSemana(1)}>
            ›
          </button>
        </div>
        <BotonPrincipal config={c} clase="pg-boton" onClick={k.onPrincipal}>
          {k.cta}
        </BotonPrincipal>
      </section>
      <div className="pg-ag-dias" role="group" aria-label="Día">
        {DIAS.map((d, i) => (
          <button key={d} type="button" aria-pressed={i === dia} onClick={() => setDia(i)}>
            {d} <b>{s.desde + i}</b>
          </button>
        ))}
      </div>
      <section className="pg-card pg-ag" aria-label={`Semana del ${s.rango}`}>
        <div className="pg-ag-horas" aria-hidden="true">
          {Array.from({ length: 10 }, (_, i) => (
            <span key={i} style={{ gridRow: `${i * 2 + 2} / span 2` }}>
              {9 + i}
            </span>
          ))}
        </div>
        {DIAS.map((d, i) => {
          const hoy = semana === 0 && i === HOY;
          return (
            <div key={d} className={`pg-ag-dia ${i === dia ? 'activo' : ''} ${hoy ? 'hoy' : ''}`}>
              <span className="pg-ag-nombre">
                {d} <b>{s.desde + i}</b>
              </span>
              {TURNOS.filter((t) => (t[0] + semana * 2) % 6 === i).map(([, ini, dur, p, clase], j) => (
                <div key={j} className={`pg-ag-turno ${clase}`} style={{ gridRow: `${ini + 2} / span ${dur}` }}>
                  <b>{items[p].titulo}</b>
                  <span>
                    {hora(ini)} a {hora(ini + dur)}
                  </span>
                </div>
              ))}
              {hoy && <i className="pg-ag-ahora" aria-hidden="true" />}
            </div>
          );
        })}
      </section>
    </>
  );
}

/* ---------- Tablero de columnas ---------- */
function Tablero({ c, k, cc }: Props) {
  const items = cuatro(k);
  const t = (titulo: string, quien: string, fecha: string) => ({ titulo, quien, fecha });
  const columnas = [
    { nombre: 'Por hacer', tarjetas: [t(items[0].titulo, 'Ana', 'Vie 13'), t('Pedir la seña', 'Juli', 'Lun 16'), t('Subir las fotos', 'Martín', 'Mar 17')] },
    { nombre: 'En curso', tarjetas: [t(items[1].titulo, 'Sofi', 'Hoy'), t('Revisar el presupuesto', 'Ana', 'Mañana')] },
    { nombre: 'Hecho', tarjetas: [t(items[2].titulo, 'Martín', 'Lun 9'), t('Mandar la factura', 'Juli', 'Mar 10')] },
  ];
  const Tarjeta = ({ x, clase = '' }: { x: ReturnType<typeof t>; clase?: string }) => (
    <div className={`pg-card pg-tb-tarjeta ${cc} ${clase}`}>
      <span className="pg-tb-titulo">{x.titulo}</span>
      <span className="pg-tb-meta">
        <i aria-hidden="true">{inicial(x.quien)}</i>
        {x.quien}
        <b>{x.fecha}</b>
      </span>
    </div>
  );
  return (
    <>
      <Nav k={k} />
      <section className="pg-ag-cabeza">
        <h2 className="pg-titulo">{k.nav[0] ?? 'Tablero'}</h2>
        <Botones c={c} k={k} prueba={false} />
      </section>
      <section className="pg-tb" tabIndex={0} aria-label="Tablero de ejemplo">
        {columnas.map((col, i) => (
          <div key={col.nombre} className={`pg-tb-col ${i === 2 ? 'hecho' : ''}`}>
            <h3>
              {col.nombre} <span>{col.tarjetas.length + (i === 1 ? 1 : 0)}</span>
            </h3>
            {col.tarjetas.map((x) => (
              <Tarjeta key={x.titulo} x={x} />
            ))}
            {i === 1 && (
              <div className="pg-tb-hueco">
                <div className="pg-tb-vuela">
                  <Tarjeta x={t(items[3].titulo, 'Juli', 'Jue 12')} />
                </div>
              </div>
            )}
          </div>
        ))}
      </section>
    </>
  );
}

/* ---------- Muro de publicaciones ---------- */
const GENTE = [
  ['Laura G.', 'hace 2 h'],
  ['Pedro M.', 'hace 5 h'],
  ['Caro S.', 'ayer'],
  ['Tomi R.', 'ayer'],
  ['Vale D.', 'el lunes'],
];

function Publicacion({ quien, cuando, texto, foto, base, clase = '' }: { quien: string; cuando: string; texto: string; foto?: number; base: number; clase?: string }) {
  const [gusta, setGusta] = useState(false);
  return (
    <article className={`pg-card pg-muro-pub ${clase}`}>
      <header>
        <i aria-hidden="true">{inicial(quien)}</i>
        <b>{quien}</b>
        <span>{cuando}</span>
      </header>
      <p>{texto}</p>
      {foto !== undefined && <Media f={foto} />}
      <footer>
        <button type="button" aria-pressed={gusta} aria-label="Me gusta" onClick={() => setGusta(!gusta)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill={gusta ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 21s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z" />
          </svg>
          {base + (gusta ? 1 : 0)}
        </button>
        <span>{(base % 7) + 1} respuestas</span>
      </footer>
    </article>
  );
}

function Muro({ c, k, cc }: Props) {
  const id = useId();
  const items = cuatro(k);
  return (
    <>
      <Nav k={k} />
      <section className="pg-hero">
        <Titulo k={k} />
        <Bajada k={k} />
      </section>
      <form className={`pg-card pg-muro-escribir ${cc}`} onSubmit={(e) => e.preventDefault()}>
        <i aria-hidden="true">{inicial(k.marca)}</i>
        <label className="solo-lectores" htmlFor={id}>
          Escribí una publicación
        </label>
        <input id={id} type="text" placeholder="¿Qué querés contar?" autoComplete="off" />
        <BotonPrincipal config={c} clase="pg-boton" onClick={k.onPrincipal}>
          Publicar
        </BotonPrincipal>
      </form>
      <section className="pg-muro">
        <Publicacion quien={k.testimonio?.nombre ?? k.marca} cuando="Fijada" texto={k.testimonio?.texto ?? k.frase} base={48} clase="fijada" />
        {items.map((it, i) => (
          <Publicacion key={i} quien={GENTE[i][0]} cuando={GENTE[i][1]} texto={it.texto ? `${it.titulo}. ${it.texto}` : it.titulo} foto={i % 2 === 0 ? i + 1 : undefined} base={[24, 9, 31, 12][i]} clase={cc} />
        ))}
        <Publicacion quien={GENTE[4][0]} cuando={GENTE[4][1]} texto={k.bajada} base={17} clase={cc} />
      </section>
    </>
  );
}

/* ---------- Documentación con índice ---------- */
function Documentacion({ c, k, cc }: Props) {
  const id = useId();
  const items = cuatro(k);
  const primeros = ['Introducción', 'Cómo empezar', 'Preguntas frecuentes'];
  return (
    <div className="pg-doc">
      <aside className="pg-doc-menu">
        <span className="pg-marca">{k.marca}</span>
        <label className="solo-lectores" htmlFor={id}>
          Buscar en la guía
        </label>
        <input id={id} type="search" className="pg-campo" placeholder="Buscar en la guía" autoComplete="off" />
        <nav aria-label="Temas de ejemplo">
          <b>Primeros pasos</b>
          {primeros.map((t, i) => (
            <span key={t} className={i === 0 ? 'activo' : ''}>
              {t}
            </span>
          ))}
          <b>Guías</b>
          {items.map((it) => (
            <span key={it.titulo}>{it.titulo}</span>
          ))}
        </nav>
      </aside>
      <article className="pg-doc-nota">
        <p className="pg-doc-migas">Primeros pasos / Introducción</p>
        <Titulo k={k} />
        <Bajada k={k} />
        <h3>{items[0].titulo}</h3>
        <p>{items[0].texto} Esta guía va de lo más simple a lo más completo: podés leerla de corrido o saltar al tema que necesites desde el menú.</p>
        <pre className="pg-doc-ejemplo">
          {`nombre:   ${k.marca}\nplan:     Pro\npersonas: 5`}
        </pre>
        <h3>{items[1].titulo}</h3>
        <p>{items[1].texto}</p>
        <div className={`pg-card pg-doc-aviso ${cc}`}>
          <span className="pg-card-titulo">Antes de seguir</span>
          <span className="pg-card-texto">{k.prueba || k.bajada}</span>
        </div>
        <h3>{items[2].titulo}</h3>
        <ol>
          {items.slice(0, 3).map((it) => (
            <li key={it.titulo}>{it.texto || it.titulo}</li>
          ))}
        </ol>
        <div className="pg-doc-pie">
          <Botones c={c} k={k} prueba={false} />
          <span className="pg-doc-sigue">
            Sigue: <b>{primeros[1]}</b> <IconoFlecha />
          </span>
        </div>
      </article>
      <nav className="pg-doc-indice" aria-label="En esta página">
        <b>En esta página</b>
        {items.slice(0, 3).map((it, i) => (
          <span key={it.titulo} className={i === 0 ? 'activo' : ''}>
            {it.titulo}
          </span>
        ))}
      </nav>
    </div>
  );
}

/* ---------- Link en bio ---------- */
function LinkBio({ c, k, cc }: Props) {
  const items = cuatro(k);
  return (
    <section className="pg-lb">
      <div className="pg-hero pg-lb-quien">
        <Media clase="pg-lb-foto" f={1} />
        <h2 className="pg-titulo">{k.marca}</h2>
        <p className="pg-bajada">{k.titular}</p>
        <div className="pg-chips">
          {['Instagram', 'WhatsApp', 'Mail'].map((r) => (
            <span key={r} className="pg-chip">
              {r}
            </span>
          ))}
        </div>
      </div>
      <div className="pg-lb-links">
        <button type="button" className={`pg-card pg-lb-link grande ${cc}`} onClick={k.onSecundario}>
          <Media f={3} />
          <span className="pg-lb-texto">
            <span className="pg-card-titulo">{items[0].titulo}</span>
            {items[0].texto && <span className="pg-card-texto">{items[0].texto}</span>}
          </span>
          <IconoFlecha />
        </button>
        {items.slice(1).map((it, i) => (
          <button key={i} type="button" className={`pg-card pg-lb-link ${cc}`} onClick={k.onSecundario}>
            <Media f={i + 4} />
            <span className="pg-lb-texto">
              <span className="pg-card-titulo">{it.titulo}</span>
              {it.texto && <span className="pg-card-texto">{it.texto}</span>}
            </span>
            <IconoFlecha />
          </button>
        ))}
        <BotonPrincipal config={c} clase="pg-boton" onClick={k.onPrincipal}>
          {k.cta}
        </BotonPrincipal>
      </div>
    </section>
  );
}

/* ---------- Compra en una sola página ---------- */
function Opcion({ nombre, valor, actual, alCambiar, titulo, detalle }: { nombre: string; valor: string; actual: string; alCambiar: (v: string) => void; titulo: string; detalle: string }) {
  return (
    <label className={`pg-co-opcion ${actual === valor ? 'activa' : ''}`}>
      <input type="radio" name={nombre} checked={actual === valor} onChange={() => alCambiar(valor)} />
      <span>
        <b>{titulo}</b>
        {detalle}
      </span>
    </label>
  );
}

function CompraUnica({ c, k, cc }: Props) {
  const id = useId();
  const [entrega, setEntrega] = useState<'envio' | 'retiro'>('envio');
  const [pago, setPago] = useState('tarjeta');
  const pedido = cuatro(k)
    .slice(0, 3)
    .map((it, i) => ({ nombre: it.titulo, cantidad: [1, 2, 1][i], precio: [18900, 7400, 12600][i] }));
  const subtotal = pedido.reduce((n, p) => n + p.precio * p.cantidad, 0);
  const envio = entrega === 'envio' ? 2500 : 0;
  return (
    <>
      <Nav k={k} simple />
      <div className="pg-co">
        <h2 className="pg-titulo">Terminá tu compra</h2>
        <form className="pg-co-form" onSubmit={(e) => e.preventDefault()}>
          <fieldset>
            <legend>
              <i aria-hidden="true">1</i> Tus datos
            </legend>
            <div className="pg-co-fila">
              <label className="pg-co-campo">
                Nombre y apellido
                <input type="text" className="pg-campo" autoComplete="off" placeholder="Ana López" />
              </label>
              <label className="pg-co-campo">
                Email
                <input type="email" className="pg-campo" autoComplete="off" placeholder="ana@ejemplo.com" />
              </label>
            </div>
          </fieldset>
          <fieldset>
            <legend>
              <i aria-hidden="true">2</i> Entrega
            </legend>
            <div className="pg-co-fila">
              <Opcion nombre={`${id}-entrega`} valor="envio" actual={entrega} alCambiar={(v) => setEntrega(v as 'envio')} titulo="Envío a domicilio" detalle={`${pesos(2500)}, llega el jueves`} />
              <Opcion nombre={`${id}-entrega`} valor="retiro" actual={entrega} alCambiar={(v) => setEntrega(v as 'retiro')} titulo="Retiro en el local" detalle="Gratis, desde mañana" />
            </div>
            {entrega === 'envio' && (
              <label className="pg-co-campo">
                Dirección
                <input type="text" className="pg-campo" autoComplete="off" placeholder="Thames 1380, 2.º B" />
              </label>
            )}
          </fieldset>
          <fieldset>
            <legend>
              <i aria-hidden="true">3</i> Pago
            </legend>
            <div className="pg-co-fila">
              <Opcion nombre={`${id}-pago`} valor="tarjeta" actual={pago} alCambiar={setPago} titulo="Tarjeta" detalle="Hasta 3 cuotas sin interés" />
              <Opcion nombre={`${id}-pago`} valor="transferencia" actual={pago} alCambiar={setPago} titulo="Transferencia" detalle="Te mostramos los datos al confirmar" />
            </div>
          </fieldset>
          <BotonPrincipal config={c} clase="pg-boton" onClick={k.onPrincipal}>
            Pagar {pesos(subtotal + envio)}
          </BotonPrincipal>
          {k.prueba && <p className="pg-prueba">{k.prueba}</p>}
        </form>
        <aside className={`pg-card pg-co-pedido ${cc}`} aria-label="Tu pedido">
          <span className="pg-card-titulo">Tu pedido</span>
          {pedido.map((p, i) => (
            <span key={i} className="pg-co-item">
              <Media f={i + 2} />
              <span>
                <b>{p.nombre}</b>
                {p.cantidad} {p.cantidad === 1 ? 'unidad' : 'unidades'}
              </span>
              <span className="pg-precio">{pesos(p.precio * p.cantidad)}</span>
            </span>
          ))}
          <span className="pg-co-linea">
            Subtotal <span>{pesos(subtotal)}</span>
          </span>
          <span className="pg-co-linea">
            Envío <span>{envio ? pesos(envio) : 'Gratis'}</span>
          </span>
          <span className="pg-co-linea total" aria-live="polite">
            Total <b>{pesos(subtotal + envio)}</b>
          </span>
        </aside>
      </div>
    </>
  );
}

/* ---------- Portada con buscador ---------- */
const sinTildes = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function PortadaBuscador({ c, k, cc }: Props) {
  const id = useId();
  const [q, setQ] = useState('');
  const items = cuatro(k);
  const cantidades = [128, 64, 37, 19];
  const filtrados = items.map((it, i) => ({ ...it, n: cantidades[i] })).filter((it) => sinTildes(`${it.titulo} ${it.texto}`).includes(sinTildes(q.trim())));
  return (
    <>
      <Nav k={k} />
      <section className="pg-hero pg-centro pg-bq">
        <Titulo k={k} />
        <div className="pg-bq-caja">
          <form className="pg-bq-campo" role="search" onSubmit={(e) => e.preventDefault()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
            <label className="solo-lectores" htmlFor={id}>
              Buscar en {k.marca}
            </label>
            <input id={id} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Buscá en ${k.marca}`} autoComplete="off" />
            <BotonPrincipal config={c} clase="pg-boton" onClick={k.onPrincipal}>
              Buscar
            </BotonPrincipal>
          </form>
          <div className="pg-bq-panel" aria-live="polite">
            <span className="pg-bq-rotulo">{q.trim() ? `${filtrados.length} ${filtrados.length === 1 ? 'coincidencia' : 'coincidencias'}` : 'Lo más buscado'}</span>
            {filtrados.length === 0 && <p className="pg-bq-nada">No encontramos «{q.trim()}». Probá con otra palabra o más corta.</p>}
            <ul>
              {filtrados.map((it) => (
                <li key={it.titulo}>
                  <b>{it.titulo}</b>
                  <span>{it.texto}</span>
                  <em>{it.n} resultados</em>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="pg-bq-categorias" aria-label="Categorías de ejemplo">
        {items.map((it, i) => (
          <div key={i} className={`pg-card pg-bq-categoria ${cc}`}>
            <Media f={i + 4} />
            <span className="pg-card-titulo">{it.titulo}</span>
            <span className="pg-card-texto">{cantidades[i]} resultados</span>
          </div>
        ))}
      </section>
    </>
  );
}

/* ---------- Pantalla partida con scroll independiente ---------- */
function PartidaScroll({ c, k }: Props) {
  return (
    <div className="pg-ps">
      <div className="pg-ps-lado pg-ps-texto" tabIndex={0} role="region" aria-label="Texto de la página">
        <Nav k={k} simple />
        <div className="pg-hero">
          <Titulo k={k} />
          <Bajada k={k} />
          <Botones c={c} k={k} />
        </div>
        {cuatro(k).map((it, i) => (
          <div key={i} className="pg-ps-bloque">
            <h3>{it.titulo}</h3>
            <p>{it.texto}</p>
          </div>
        ))}
        <p className="pg-ps-fin">{k.cierre}</p>
      </div>
      <div className="pg-ps-lado pg-ps-fotos" tabIndex={0} role="region" aria-label="Imágenes de ejemplo">
        <Media escena={k} />
        {[1, 2, 3, 4, 5].map((f) => (
          <Media key={f} f={f} clase={f % 2 ? 'alto' : ''} />
        ))}
      </div>
    </div>
  );
}

export function LayoutNuevo(p: Props) {
  switch (p.c.visual.layout) {
    case 'linea_tiempo':
      return <LineaTiempo {...p} />;
    case 'antes_despues':
      return <AntesDespues {...p} />;
    case 'mapa_lista':
      return <MapaLista {...p} />;
    case 'carta':
      return <Carta {...p} />;
    case 'agenda_semanal':
      return <AgendaSemanal {...p} />;
    case 'tablero':
      return <Tablero {...p} />;
    case 'muro':
      return <Muro {...p} />;
    case 'documentacion':
      return <Documentacion {...p} />;
    case 'link_bio':
      return <LinkBio {...p} />;
    case 'compra_unica':
      return <CompraUnica {...p} />;
    case 'portada_buscador':
      return <PortadaBuscador {...p} />;
    case 'partida_scroll':
      return <PartidaScroll {...p} />;
    default:
      return null;
  }
}
