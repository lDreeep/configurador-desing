// Datos y métricas: tarjetas de indicadores, gráficos y tablas.
// Gráficos según la guía de visualización: marcas finas, extremos de 4px redondeados apoyados en la base,
// líneas de 2px, grilla tenue, una sola serie por color (sin arcoíris), textos con los colores de texto,
// tooltip al pasar por cada marca y leyenda cuando hay más de una serie.

import type { CSSProperties, ReactElement } from 'react';
import type { Categoria } from './base';
import { Icono } from './iconos';

const sinMovimiento = '@media (prefers-reduced-motion: reduce) { & *, & { animation: none !important; transition: none !important; } }';

// ---------- Tarjetas de métricas ----------

const SPARK = [12, 18, 14, 22, 19, 27, 24, 31];

function Sparkline() {
  const max = Math.max(...SPARK);
  const pts = SPARK.map((v, i) => `${(i / (SPARK.length - 1)) * 116 + 2},${30 - (v / max) * 26}`).join(' ');
  return (
    <svg className="cm-m-spark" viewBox="0 0 120 32" aria-hidden="true">
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const METRICAS: Categoria = {
  id: 'metrica',
  nombre: 'Tarjetas de métricas',
  singular: 'tarjeta de métrica',
  descripcion: 'El número importante de un vistazo: valor, cambio y contexto.',
  estructura:
    '<div class="cm-metrica cm-metrica-DISEÑO"><span class="cm-m-ico">(icono)</span><span class="cm-m-etq">Etiqueta</span><span class="cm-m-valor">$ 48.230</span><span class="cm-m-cambio">▲ 12,4% vs. mes anterior</span><svg class="cm-m-spark">…</svg><span class="cm-m-meta"><span class="cm-m-meta-relleno" style="--p: 72%"></span></span><span class="cm-m-meta-txt">72% de la meta</span></div> — las partes opcionales se muestran según el diseño.',
  anchoCelda: 260,
  base: `& { display: flex; flex-direction: column; gap: 4px; width: 100%; max-width: 280px; padding: 18px; border-radius: var(--radio-medio); background: var(--color-superficie); color: var(--color-texto); font-family: var(--fuente-texto); }
& .cm-m-ico, & .cm-m-spark, & .cm-m-meta, & .cm-m-meta-txt { display: none; }
& .cm-m-etq { font-size: 13px; color: var(--color-texto-suave); font-weight: 600; }
& .cm-m-valor { font-family: var(--fuente-titulos); font-weight: var(--titulos-peso); font-size: 30px; line-height: 1.1; letter-spacing: var(--titulos-espaciado); font-variant-numeric: tabular-nums; }
& .cm-m-cambio { font-size: 12.5px; font-weight: 700; color: color-mix(in srgb, var(--color-exito) 78%, var(--color-texto)); }
& .cm-m-spark { width: 100%; height: 36px; margin-top: 6px; color: var(--color-acento-texto); }
& .cm-m-meta { position: relative; height: 6px; margin-top: 10px; border-radius: 3px; background: color-mix(in srgb, var(--color-texto) 12%, transparent); overflow: hidden; }
& .cm-m-meta-relleno { position: absolute; inset: 0 auto 0 0; width: var(--p); border-radius: 3px; background: var(--color-acento); }
& .cm-m-meta-txt { font-size: 12px; color: var(--color-texto-suave); }`,
  disenos: {
    simple: { nombre: 'Simple', descripcion: 'Etiqueta, número y cambio', css: '' },
    sparkline: { nombre: 'Con mini gráfico', descripcion: 'Una línea con la tendencia', css: `& .cm-m-spark { display: block; }` },
    icono: { nombre: 'Con icono', descripcion: 'Un icono de color arriba', css: `& .cm-m-ico { display: grid; place-items: center; width: 40px; height: 40px; margin-bottom: 8px; border-radius: 12px; background: color-mix(in srgb, var(--color-acento) 16%, var(--color-fondo)); color: var(--color-acento-texto); }` },
    hero: { nombre: 'Número protagonista', descripcion: 'El valor enorme, todo lo demás chico', css: `& { background: transparent; padding: 8px 0; } & .cm-m-valor { font-size: 48px; } & .cm-m-etq { text-transform: uppercase; letter-spacing: 0.08em; font-size: 11px; }` },
    acento: { nombre: 'De color', descripcion: 'Fondo de acento, texto claro', css: `& { background: var(--color-acento); color: var(--color-sobre-acento); } & .cm-m-etq, & .cm-m-cambio { color: var(--color-sobre-acento); }` },
    meta: { nombre: 'Con meta', descripcion: 'Barra de avance hacia un objetivo', css: `& .cm-m-meta, & .cm-m-meta-txt { display: block; } & .cm-m-cambio { display: none; }` },
    borde: { nombre: 'Borde lateral', descripcion: 'Una línea de color a la izquierda', css: `& { background: var(--color-fondo); border-left: 4px solid var(--color-acento); border-radius: 4px; box-shadow: 0 2px 10px rgba(0,0,0,.08); }` },
    oscura: { nombre: 'Oscura', descripcion: 'Fondo oscuro con mini gráfico', css: `& { background: #15171C; color: #FFFFFF; } & .cm-m-etq { color: #B8BDC7; } & .cm-m-cambio { color: #4ADE80; } & .cm-m-spark { display: block; color: #FFFFFF; }` },
    neobrutal: { nombre: 'Neobrutal', descripcion: 'Borde negro y sombra sólida', css: `& { background: var(--color-fondo); border: 2px solid var(--color-texto); border-radius: 0; box-shadow: 5px 5px 0 var(--color-texto); }` },
    pastilla: { nombre: 'Cambio en pastilla', descripcion: 'El cambio va en una pastilla de color suave', css: `& .cm-m-cambio { align-self: flex-start; margin-top: 6px; padding: 3px 9px; border-radius: 999px; background: color-mix(in srgb, var(--color-exito) 12%, var(--color-fondo)); color: color-mix(in srgb, var(--color-exito) 62%, var(--color-texto)); }` },
  },
  Muestra: ({ clase }) => (
    <div className={clase}>
      <span className="cm-m-ico">
        <Icono nombre="grafico" tamano={20} />
      </span>
      <span className="cm-m-etq">Ventas del mes</span>
      <span className="cm-m-valor">$ 48.230</span>
      <span className="cm-m-cambio">▲ 12,4% vs. mes anterior</span>
      <Sparkline />
      <span className="cm-m-meta" aria-hidden="true">
        <span className="cm-m-meta-relleno" style={{ '--p': '72%' } as CSSProperties} />
      </span>
      <span className="cm-m-meta-txt">72% de la meta mensual</span>
    </div>
  ),
};

// ---------- Gráficos ----------

const DIAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const VENTAS = [32, 45, 38, 56, 49, 64, 58];
const W = 280;
const H = 150;
const BASE = 126;
const ALTO = 104;
const max = 70;
const y = (v: number) => BASE - (v / max) * ALTO;

/** Barra con las dos esquinas de arriba redondeadas (4px) y apoyada en la base. */
const barra = (x: number, yTop: number, w: number, r = 4) =>
  `M${x},${BASE} V${yTop + r} Q${x},${yTop} ${x + r},${yTop} H${x + w - r} Q${x + w},${yTop} ${x + w},${yTop + r} V${BASE} Z`;

function Grilla() {
  return (
    <g className="cm-g-grilla" aria-hidden="true">
      {[0, 35, 70].map((v) => (
        <g key={v}>
          <line x1="24" x2={W - 6} y1={y(v)} y2={y(v)} />
          <text x="18" y={y(v) + 3} textAnchor="end">
            {v}
          </text>
        </g>
      ))}
    </g>
  );
}

function Ejes() {
  const paso = (W - 40) / DIAS.length;
  return (
    <g className="cm-g-ejes" aria-hidden="true">
      {DIAS.map((d, i) => (
        <text key={d} x={32 + paso * i + paso / 2 - 4} y={BASE + 16} textAnchor="middle">
          {d}
        </text>
      ))}
    </g>
  );
}

function Barras({ resaltar }: { resaltar?: number }) {
  const paso = (W - 40) / DIAS.length;
  const ancho = paso * 0.56;
  return (
    <>
      <Grilla />
      {VENTAS.map((v, i) => (
        <path
          key={i}
          className={`cm-g-marca cm-g-barra ${resaltar !== undefined && i !== resaltar ? 'cm-g-tenue' : ''}`}
          d={barra(32 + paso * i + (paso - ancho) / 2 - 4, y(v), ancho)}
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <title>{`${DIAS[i]}: ${v} ventas`}</title>
        </path>
      ))}
      {resaltar !== undefined && (
        <text className="cm-g-dato" x={32 + paso * resaltar + paso / 2 - 4} y={y(VENTAS[resaltar]) - 6} textAnchor="middle">
          {VENTAS[resaltar]}
        </text>
      )}
      <Ejes />
    </>
  );
}

function puntosLinea() {
  const paso = (W - 40) / (VENTAS.length - 1);
  return VENTAS.map((v, i) => [30 + paso * i, y(v)] as const);
}

function curva(pts: readonly (readonly [number, number])[]) {
  return pts.reduce((d, [px, py], i) => {
    if (i === 0) return `M${px},${py}`;
    const [ax, ay] = pts[i - 1];
    const cx = (ax + px) / 2;
    return `${d} C${cx},${ay} ${cx},${py} ${px},${py}`;
  }, '');
}

function Linea({ suave = false, area = false, lollipop = false }: { suave?: boolean; area?: boolean; lollipop?: boolean }) {
  const pts = puntosLinea();
  const d = suave || area ? curva(pts) : `M${pts.map((p) => p.join(',')).join(' L')}`;
  const [ux, uy] = pts[pts.length - 1];
  if (lollipop)
    return (
      <>
        <Grilla />
        {pts.map(([px, py], i) => (
          <g key={i} className="cm-g-marca">
            <line className="cm-g-tallo" x1={px} x2={px} y1={BASE} y2={py} />
            <circle className="cm-g-punto" cx={px} cy={py} r="5" />
            <title>{`${DIAS[i]}: ${VENTAS[i]} ventas`}</title>
          </g>
        ))}
        <LineaEjes />
      </>
    );
  return (
    <>
      <Grilla />
      {area && <path className="cm-g-area" d={`${d} L${ux},${BASE} L${pts[0][0]},${BASE} Z`} />}
      <path className="cm-g-linea" d={d} pathLength={1} />
      {pts.map(([px, py], i) => (
        <circle key={i} className="cm-g-objetivo" cx={px} cy={py} r="10">
          <title>{`${DIAS[i]}: ${VENTAS[i]} ventas`}</title>
        </circle>
      ))}
      <circle className="cm-g-punto" cx={ux} cy={uy} r="4.5" />
      <text className="cm-g-dato" x={ux - 4} y={uy - 10} textAnchor="end">
        {VENTAS[VENTAS.length - 1]}
      </text>
      <LineaEjes />
    </>
  );
}

function LineaEjes() {
  const paso = (W - 40) / (VENTAS.length - 1);
  return (
    <g className="cm-g-ejes" aria-hidden="true">
      {DIAS.map((dd, i) => (
        <text key={dd} x={30 + paso * i} y={BASE + 16} textAnchor="middle">
          {dd}
        </text>
      ))}
    </g>
  );
}

function BarrasHorizontales() {
  const datos = [
    ['Web', 64],
    ['App', 48],
    ['Local', 31],
    ['Teléfono', 17],
  ] as const;
  return (
    <>
      {datos.map(([n, v], i) => {
        const largo = (v / 70) * (W - 110);
        const yy = 14 + i * 32;
        return (
          <g key={n}>
            <text className="cm-g-etq" x="64" y={yy + 13} textAnchor="end">
              {n}
            </text>
            <path className="cm-g-marca cm-g-barra-h" d={`M72,${yy} H${72 + largo - 4} Q${72 + largo},${yy} ${72 + largo},${yy + 4} V${yy + 14} Q${72 + largo},${yy + 18} ${72 + largo - 4},${yy + 18} H72 Z`} style={{ animationDelay: `${i * 70}ms` }}>
              <title>{`${n}: ${v}%`}</title>
            </path>
            <text className="cm-g-dato" x={78 + largo} y={yy + 13}>
              {v}%
            </text>
          </g>
        );
      })}
    </>
  );
}

function Dona({ anillo = false }: { anillo?: boolean }) {
  const r = 48;
  const c = 2 * Math.PI * r;
  const partes = anillo
    ? [{ n: 'Completado', v: 72, cls: 'cm-g-s1' }]
    : [
        { n: 'Web', v: 52, cls: 'cm-g-s1' },
        { n: 'App', v: 31, cls: 'cm-g-s2' },
        { n: 'Local', v: 17, cls: 'cm-g-s3' },
      ];
  let acum = 0;
  const hueco = anillo ? 0 : 1.2; // separación de superficie entre segmentos (en %)
  return (
    <>
      <g transform="translate(78 75) rotate(-90)">
        {anillo && <circle r={r} className="cm-g-pista" />}
        {partes.map((p) => {
          const largo = (p.v / 100) * c - (hueco / 100) * c;
          const el = (
            <circle key={p.n} r={r} className={`cm-g-marca cm-g-seg ${p.cls}`} strokeDasharray={`${Math.max(largo, 0)} ${c}`} strokeDashoffset={-(acum / 100) * c}>
              <title>{`${p.n}: ${p.v}%`}</title>
            </circle>
          );
          acum += p.v;
          return el;
        })}
      </g>
      <text className="cm-g-centro" x="78" y="81" textAnchor="middle">
        {anillo ? '72%' : '3 canales'}
      </text>
      {anillo ? (
        <text className="cm-g-etq" x="148" y="80">
          de la meta anual
        </text>
      ) : (
        <g className="cm-g-leyenda">
          {partes.map((p, i) => (
            <g key={p.n} transform={`translate(150 ${52 + i * 22})`}>
              <rect className={`${p.cls} cm-g-llave`} width="10" height="10" rx="3" />
              <text className="cm-g-etq" x="16" y="9">
                {`${p.n} · ${p.v}%`}
              </text>
            </g>
          ))}
        </g>
      )}
    </>
  );
}

function MapaCalor() {
  const semanas = 5;
  const valores = Array.from({ length: 7 * semanas }, (_, i) => ((i * 37) % 11) / 10);
  return (
    <>
      {valores.map((v, i) => {
        const col = Math.floor(i / 7);
        const fila = i % 7;
        return (
          <rect key={i} className="cm-g-marca cm-g-celda" x={60 + col * 34} y={8 + fila * 18} width="30" height="15" rx="3" style={{ '--v': v } as CSSProperties}>
            <title>{`Semana ${col + 1}, ${DIAS[fila]}: ${Math.round(v * 20)} visitas`}</title>
          </rect>
        );
      })}
      {DIAS.map((d, i) => (
        <text key={d} className="cm-g-etq" x="50" y={19 + i * 18} textAnchor="end">
          {d}
        </text>
      ))}
    </>
  );
}

const GRAFICOS: Record<string, { nombre: string; descripcion: string; resumen: string; dibujo: () => ReactElement }> = {
  barras: { nombre: 'Barras', descripcion: 'Columnas con la punta redondeada', resumen: 'Ventas por día, de 32 a 64', dibujo: () => <Barras /> },
  barras_resaltada: { nombre: 'Barra destacada', descripcion: 'Una barra en color, el resto tenue', resumen: 'Ventas por día; el sábado, el mejor, con 64', dibujo: () => <Barras resaltar={5} /> },
  barras_horizontales: { nombre: 'Barras horizontales', descripcion: 'Para comparar categorías con nombre', resumen: 'Ventas por canal: web 64%, app 48%, local 31%, teléfono 17%', dibujo: () => <BarrasHorizontales /> },
  linea: { nombre: 'Línea', descripcion: 'Tendencia con el último valor marcado', resumen: 'Ventas por día, en subida hasta 58', dibujo: () => <Linea /> },
  linea_suave: { nombre: 'Línea suave', descripcion: 'La misma tendencia con curvas', resumen: 'Ventas por día, en subida hasta 58', dibujo: () => <Linea suave /> },
  area: { nombre: 'Área', descripcion: 'Línea con relleno que se desvanece', resumen: 'Ventas por día, en subida hasta 58', dibujo: () => <Linea area /> },
  lollipop: { nombre: 'Piruletas', descripcion: 'Tallos finos con un punto en la punta', resumen: 'Ventas por día, de 32 a 64', dibujo: () => <Linea lollipop /> },
  dona: { nombre: 'Dona', descripcion: 'Partes de un total, con leyenda', resumen: 'Ventas por canal: web 52%, app 31%, local 17%', dibujo: () => <Dona /> },
  anillo: { nombre: 'Anillo de avance', descripcion: 'Un solo porcentaje hacia una meta', resumen: '72% de la meta anual', dibujo: () => <Dona anillo /> },
  mapa_calor: { nombre: 'Mapa de calor', descripcion: 'Intensidad por día y semana, un solo color', resumen: 'Visitas por día durante 5 semanas', dibujo: () => <MapaCalor /> },
};

export const GRAFICOS_CAT: Categoria = {
  id: 'grafico',
  nombre: 'Gráficos',
  singular: 'gráfico',
  descripcion: 'Pasá el mouse por cada barra, punto o porción para ver el dato.',
  estructura: '<figure class="cm-grafico cm-grafico-DISEÑO"><figcaption>Título</figcaption><svg role="img" aria-label="Resumen del dato">…marcas .cm-g-marca con <title> para el tooltip…</svg></figure> — una serie por color; leyenda si hay más de una; grilla tenue.',
  anchoCelda: 320,
  base: `& { display: flex; flex-direction: column; gap: 8px; width: 100%; max-width: 340px; margin: 0; font-family: var(--fuente-texto); color: var(--color-texto); }
& figcaption { font-size: 13px; font-weight: 700; }
& svg { width: 100%; height: auto; overflow: visible; }
& .cm-g-grilla line { stroke: var(--color-borde); stroke-width: 1; }
& text { font-family: var(--fuente-texto); font-size: 10px; fill: var(--color-texto-suave); }
& .cm-g-dato { font-size: 11px; font-weight: 700; fill: var(--color-texto); }
& .cm-g-etq { font-size: 11px; fill: var(--color-texto); }
& .cm-g-centro { font-family: var(--fuente-titulos); font-size: 17px; font-weight: 700; fill: var(--color-texto); }
& .cm-g-marca { fill: var(--color-acento); transition: opacity var(--duracion-rapida) ease; cursor: default; }
& .cm-g-tenue { fill: color-mix(in srgb, var(--color-texto) 22%, var(--color-fondo)); }
& svg:hover .cm-g-marca { opacity: 0.45; }
& svg .cm-g-marca:hover { opacity: 1; }
& .cm-g-barra, & .cm-g-barra-h { stroke: var(--color-fondo); stroke-width: 2px; paint-order: stroke; transform-box: fill-box; }
& .cm-g-barra { transform-origin: bottom; animation: cm-g-crece 700ms var(--curva-entrada) both; }
& .cm-g-barra-h { transform-origin: left; animation: cm-g-crece-h 700ms var(--curva-entrada) both; }
@keyframes cm-g-crece { from { transform: scaleY(0); } }
@keyframes cm-g-crece-h { from { transform: scaleX(0); } }
& .cm-g-linea { fill: none; stroke: var(--color-acento); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; animation: cm-g-dibuja 900ms var(--curva-entrada) both; }
@keyframes cm-g-dibuja { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
& .cm-g-area { fill: color-mix(in srgb, var(--color-acento) 18%, transparent); }
& .cm-g-punto { fill: var(--color-acento); stroke: var(--color-fondo); stroke-width: 2; }
& .cm-g-objetivo { fill: transparent; }
& .cm-g-objetivo:hover { fill: color-mix(in srgb, var(--color-acento) 18%, transparent); }
& .cm-g-tallo { stroke: var(--color-acento); stroke-width: 2; stroke-linecap: round; }
& .cm-g-seg { fill: none; stroke-width: 18; }
& .cm-g-pista { fill: none; stroke: var(--color-superficie); stroke-width: 18; }
& .cm-g-s1 { stroke: var(--color-acento); fill: var(--color-acento); }
& .cm-g-s2 { stroke: color-mix(in srgb, var(--color-acento) 55%, var(--color-fondo)); fill: color-mix(in srgb, var(--color-acento) 55%, var(--color-fondo)); }
& .cm-g-s3 { stroke: color-mix(in srgb, var(--color-acento) 25%, var(--color-fondo)); fill: color-mix(in srgb, var(--color-acento) 25%, var(--color-fondo)); }
& .cm-g-seg.cm-g-marca { fill: none; }
& .cm-g-celda { fill: color-mix(in srgb, var(--color-acento) calc(12% + var(--v) * 88%), var(--color-fondo)); }
${sinMovimiento}`,
  disenos: Object.fromEntries(Object.entries(GRAFICOS).map(([id, g]) => [id, { nombre: g.nombre, descripcion: g.descripcion, css: '' }])),
  Muestra: ({ clase, id }) => <Grafico clase={clase} id={id} />,
};

/** Un gráfico del catálogo con título propio (lo usa también el prototipo). */
export function Grafico({ clase, id, titulo }: { clase: string; id: string; titulo?: string }) {
    const g = GRAFICOS[id] ?? GRAFICOS.barras;
    return (
      <figure className={clase}>
        <figcaption>{titulo ?? g.nombre}</figcaption>
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={g.resumen}>
          {g.dibujo()}
        </svg>
      </figure>
    );
}

// ---------- Tablas ----------

const FILAS = [
  ['Lucía Gómez', 'pagado', '$ 12.400'],
  ['Martín Ruiz', 'pendiente', '$ 8.900'],
  ['Ana Paz', 'pagado', '$ 21.300'],
  ['Diego Sosa', 'vencido', '$ 4.150'],
];
const NOMBRE_ESTADO: Record<string, string> = { pagado: 'Pagado', pendiente: 'Pendiente', vencido: 'Vencido' };

export const TABLAS: Categoria = {
  id: 'tabla',
  nombre: 'Tablas',
  singular: 'tabla',
  descripcion: 'Listas de datos con estado. Pasá el mouse por las filas.',
  estructura: '<table class="cm-tabla cm-tabla-DISEÑO"><thead><tr><th>Cliente</th><th>Estado</th><th class="cm-num">Monto</th></tr></thead><tbody><tr><td>…</td><td><span class="cm-t-estado" data-estado="pagado">Pagado</span></td><td class="cm-num">…</td></tr></tbody></table>',
  anchoCelda: 360,
  base: `& { width: 100%; border-collapse: separate; border-spacing: 0; font-family: var(--fuente-texto); font-size: 13.5px; color: var(--color-texto); }
& th { text-align: left; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--color-texto-suave); padding: 8px 10px; }
& td { padding: 11px 10px; }
& .cm-num { text-align: right; font-variant-numeric: tabular-nums; }
& tbody tr { transition: background-color var(--duracion-rapida) ease; }
& .cm-t-estado { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; }
& .cm-t-estado::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
& .cm-t-estado[data-estado='pagado'] { color: color-mix(in srgb, var(--color-exito) 78%, var(--color-texto)); }
& .cm-t-estado[data-estado='pendiente'] { color: color-mix(in srgb, var(--color-aviso) 78%, var(--color-texto)); }
& .cm-t-estado[data-estado='vencido'] { color: color-mix(in srgb, var(--color-error) 78%, var(--color-texto)); }`,
  disenos: {
    lineas: { nombre: 'Con líneas', descripcion: 'Filas separadas por líneas finas', css: `& td { border-top: 1px solid var(--color-borde); } & tbody tr:hover { background: var(--color-superficie); }` },
    cebra: { nombre: 'Cebra', descripcion: 'Filas alternadas', css: `& tbody tr:nth-child(odd) { background: var(--color-superficie); } & tbody tr:hover { background: color-mix(in srgb, var(--color-acento) 10%, var(--color-fondo)); }` },
    encabezado: { nombre: 'Encabezado oscuro', descripcion: 'La primera fila resalta', css: `& th { background: var(--color-texto); color: var(--color-fondo); } & th:first-child { border-radius: 8px 0 0 8px; } & th:last-child { border-radius: 0 8px 8px 0; } & td { border-bottom: 1px solid var(--color-borde); }` },
    tarjeta: { nombre: 'En tarjeta', descripcion: 'Dentro de una caja con sombra', css: `& { background: var(--color-superficie-alta); border-radius: var(--radio-medio); box-shadow: 0 4px 16px rgba(0,0,0,.08); overflow: hidden; } & th { background: var(--color-superficie); } & td { border-top: 1px solid var(--color-borde); }` },
    grilla: { nombre: 'Grilla', descripcion: 'Bordes en todas las celdas', css: `& { border: 1px solid var(--color-borde); border-radius: 8px; overflow: hidden; } & th, & td { border-right: 1px solid var(--color-borde); border-bottom: 1px solid var(--color-borde); } & th:last-child, & td:last-child { border-right: none; } & tbody tr:last-child td { border-bottom: none; }` },
    pastillas: { nombre: 'Estados en pastilla', descripcion: 'El estado va en una pastilla de color suave', css: `& td { border-top: 1px solid var(--color-borde); } & .cm-t-estado { padding: 3px 9px; border-radius: 999px; background: color-mix(in srgb, currentColor 12%, var(--color-fondo)); color: color-mix(in srgb, currentColor 62%, var(--color-texto)); } & tbody tr:hover td { background: var(--color-superficie); }` },
  },
  Muestra: ({ clase, id }) => (
    <table className={clase}>
      <caption className="cm-oculto">Pagos de clientes (ejemplo {id})</caption>
      <thead>
        <tr>
          <th scope="col">Cliente</th>
          <th scope="col">Estado</th>
          <th scope="col" className="cm-num">
            Monto
          </th>
        </tr>
      </thead>
      <tbody>
        {FILAS.map(([n, e, m]) => (
          <tr key={n}>
            <td>{n}</td>
            <td>
              <span className="cm-t-estado" data-estado={e}>
                {NOMBRE_ESTADO[e]}
              </span>
            </td>
            <td className="cm-num">{m}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};
