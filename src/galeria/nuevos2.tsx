// Más componentes: calendarios, carruseles y pies de página.

import { useId, useState, type CSSProperties } from 'react';
import type { Categoria } from './base';

const reducirMov = '@media (prefers-reduced-motion: reduce) { &, & * { animation: none !important; transition: none !important; } }';

// ---------- Calendario ----------

const SEMANA = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const EVENTOS = new Set([5, 12, 19, 23]);

function diasDelMes(anio: number, mes: number) {
  const primero = new Date(anio, mes, 1);
  const corrimiento = (primero.getDay() + 6) % 7; // lunes = 0
  const enMes = new Date(anio, mes + 1, 0).getDate();
  const previo = new Date(anio, mes, 0).getDate();
  const celdas: { dia: number; fuera: boolean }[] = [];
  for (let i = corrimiento - 1; i >= 0; i--) celdas.push({ dia: previo - i, fuera: true });
  for (let d = 1; d <= enMes; d++) celdas.push({ dia: d, fuera: false });
  while (celdas.length % 7) celdas.push({ dia: celdas.length - enMes - corrimiento + 1, fuera: true });
  return celdas;
}

function MuestraCalendario({ clase }: { clase: string; id: string }) {
  const [mes, setMes] = useState(10);
  const [elegido, setElegido] = useState(14);
  const anio = 2026;
  const titulo = useId();
  return (
    <div className={clase}>
      <div className="cm-c-cabeza">
        <button type="button" className="cm-c-flecha" aria-label="Mes anterior" onClick={() => setMes((m) => (m + 11) % 12)}>
          ‹
        </button>
        <strong id={titulo} className="cm-c-titulo">
          {MESES[mes]} {anio}
        </strong>
        <button type="button" className="cm-c-flecha" aria-label="Mes siguiente" onClick={() => setMes((m) => (m + 1) % 12)}>
          ›
        </button>
      </div>
      <div className="cm-c-grilla" role="group" aria-labelledby={titulo}>
        {SEMANA.map((d) => (
          <span key={d} className="cm-c-sem" aria-hidden="true">
            {d}
          </span>
        ))}
        {diasDelMes(anio, mes).map(({ dia, fuera }, i) => (
          <button
            key={i}
            type="button"
            className="cm-c-dia"
            disabled={fuera}
            aria-pressed={!fuera && dia === elegido}
            aria-label={`${dia} de ${MESES[mes]}${EVENTOS.has(dia) && !fuera ? ', con evento' : ''}`}
            data-fuera={fuera || undefined}
            data-hoy={!fuera && dia === 7 ? '' : undefined}
            data-evento={!fuera && EVENTOS.has(dia) ? '' : undefined}
            data-en-rango={!fuera && dia > elegido && dia <= elegido + 4 ? '' : undefined}
            data-fin-rango={!fuera && dia === elegido + 4 ? '' : undefined}
            onClick={() => setElegido(dia)}
          >
            {dia}
          </button>
        ))}
      </div>
    </div>
  );
}

export const CALENDARIOS: Categoria = {
  id: 'calendario',
  nombre: 'Calendarios',
  singular: 'calendario',
  descripcion: 'Para elegir fechas: turnos, reservas, entregas. Tocá un día y cambiá de mes.',
  estructura:
    '<div class="cm-calendario cm-calendario-DISEÑO"><div class="cm-c-cabeza"><button class="cm-c-flecha" aria-label="Mes anterior">‹</button><strong class="cm-c-titulo">noviembre 2026</strong><button class="cm-c-flecha">›</button></div><div class="cm-c-grilla"><span class="cm-c-sem">Lu</span>…<button class="cm-c-dia" aria-pressed="true" data-hoy data-evento data-en-rango data-fin-rango data-fuera>14</button>…</div></div> — data-hoy (hoy), data-evento (tiene algo), data-en-rango y data-fin-rango (para elegir un rango), data-fuera (días de otro mes).',
  anchoCelda: 300,
  base: `& { box-sizing: border-box; width: 100%; max-width: 300px; padding: 12px; border-radius: var(--radio-grande); background: var(--color-superficie-alta, var(--color-fondo)); border: 1px solid var(--color-borde); font-family: var(--fuente-texto); color: var(--color-texto); box-shadow: 0 8px 24px rgba(0,0,0,.08); }
& .cm-c-cabeza { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
& .cm-c-titulo { font-size: 15px; text-transform: capitalize; }
& .cm-c-flecha { width: 36px; height: 36px; border: none; border-radius: 10px; background: transparent; color: var(--color-texto); font-size: 20px; cursor: pointer; }
& .cm-c-flecha:hover { background: var(--color-superficie); }
& .cm-c-grilla { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 2px; }
& .cm-c-sem { display: grid; place-items: center; height: 28px; font-size: 11px; font-weight: 700; color: var(--color-texto-suave); text-transform: uppercase; }
& .cm-c-dia { position: relative; display: grid; place-items: center; aspect-ratio: 1; min-width: 0; min-height: 30px; padding: 0; border: none; border-radius: 10px; background: transparent; color: var(--color-texto); font: inherit; font-size: 13.5px; font-variant-numeric: tabular-nums; cursor: pointer; transition: background var(--duracion-rapida) ease, color var(--duracion-rapida) ease; }
& .cm-c-dia:hover:not(:disabled) { background: var(--color-superficie); }
& .cm-c-dia[data-fuera] { color: var(--color-texto-suave); opacity: .45; cursor: default; }
& .cm-c-dia[data-hoy] { font-weight: 800; box-shadow: inset 0 0 0 1.5px var(--color-borde); }
& .cm-c-dia[aria-pressed='true'] { background: var(--color-acento); color: var(--color-sobre-acento); font-weight: 700; }
& .cm-c-dia:focus-visible, & .cm-c-flecha:focus-visible { outline: 2px solid var(--color-acento); outline-offset: 1px; }
${reducirMov}`,
  disenos: {
    clasico: { nombre: 'Clásico', descripcion: 'El día elegido en un cuadro de color', css: '' },
    circulos: { nombre: 'Círculos', descripcion: 'Días redondos, el elegido como un punto de color', css: `& .cm-c-dia { border-radius: 999px; }` },
    eventos: { nombre: 'Con eventos', descripcion: 'Un puntito marca los días que tienen algo', css: `& .cm-c-dia[data-evento]::after { content: ''; position: absolute; bottom: 4px; width: 5px; height: 5px; border-radius: 50%; background: var(--color-acento); } & .cm-c-dia[aria-pressed='true']::after { background: var(--color-sobre-acento); }` },
    rango: { nombre: 'Rango', descripcion: 'Para elegir desde-hasta: los días del medio se pintan suave', css: `& .cm-c-grilla { gap: 2px 0; } & .cm-c-dia[data-en-rango] { background: color-mix(in srgb, var(--color-acento) 18%, var(--color-fondo)); border-radius: 0; } & .cm-c-dia[aria-pressed='true'] { border-radius: 10px 0 0 10px; } & .cm-c-dia[data-fin-rango] { background: var(--color-acento); color: var(--color-sobre-acento); border-radius: 0 10px 10px 0; }` },
    compacto: { nombre: 'Compacto', descripcion: 'Más chico, sin borde, para dentro de un formulario', css: `& { max-width: 260px; padding: 8px; box-shadow: none; border: none; background: transparent; } & .cm-c-dia { min-height: 30px; font-size: 12.5px; border-radius: 6px; }` },
    tonal: { nombre: 'Tonal', descripcion: 'El elegido en un tono suave, hoy subrayado', css: `& .cm-c-dia[aria-pressed='true'] { background: color-mix(in srgb, var(--color-acento) 20%, var(--color-fondo)); color: var(--color-texto); } & .cm-c-dia[data-hoy] { box-shadow: none; text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 4px; text-decoration-color: var(--color-acento); }` },
    oscuro: { nombre: 'Oscuro', descripcion: 'Fondo oscuro, días claros', css: `& { background: #15171C; border-color: #2A2D35; color: #F1F2F4; } & .cm-c-flecha, & .cm-c-dia { color: #F1F2F4; } & .cm-c-sem { color: #9CA3AF; } & .cm-c-dia:hover:not(:disabled), & .cm-c-flecha:hover { background: #23262E; } & .cm-c-dia[data-fuera] { color: #9CA3AF; } & .cm-c-dia[aria-pressed='true'] { color: var(--color-sobre-acento); }` },
    vidrio: { nombre: 'Vidrio', descripcion: 'Translúcido con desenfoque', css: `& { background: color-mix(in srgb, var(--color-fondo) 60%, transparent); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-color: color-mix(in srgb, var(--color-texto) 14%, transparent); }` },
    neobrutal: { nombre: 'Neobrutal', descripcion: 'Bordes negros y sombra dura', css: `& { border: 2px solid var(--color-texto); border-radius: 0; box-shadow: 5px 5px 0 var(--color-texto); } & .cm-c-dia { border-radius: 0; } & .cm-c-dia[aria-pressed='true'] { outline: 2px solid var(--color-texto); }` },
  },
  Muestra: MuestraCalendario,
};

// ---------- Carrusel ----------

const SLIDES = [
  { t: 'Colección de otoño', s: 'Nueva temporada' },
  { t: 'Envío gratis', s: 'En compras desde $ 50.000' },
  { t: 'Hecho a mano', s: 'Piezas únicas' },
  { t: '20% off', s: 'Solo esta semana' },
];

function MuestraCarrusel({ clase, id }: { clase: string; id: string }) {
  const [i, setI] = useState(0);
  const n = SLIDES.length;
  return (
    <div className={clase} style={{ '--i': i, '--n': n } as CSSProperties} role="region" aria-roledescription="carrusel" aria-label={`Novedades (ejemplo: ${CARRUSELES.disenos[id]?.nombre ?? id})`}>
      <div className="cm-k-ventana">
        <div className="cm-k-pista">
          {SLIDES.map((s, j) => (
            <div key={s.t} className="cm-k-slide" data-activo={j === i || undefined} aria-hidden={j !== i} role="group" aria-roledescription="diapositiva" aria-label={`${j + 1} de ${n}`}>
              <strong>{s.t}</strong>
              <span>{s.s}</span>
            </div>
          ))}
        </div>
      </div>
      <button type="button" className="cm-k-flecha cm-k-prev" aria-label="Anterior" onClick={() => setI((i - 1 + n) % n)}>
        ‹
      </button>
      <button type="button" className="cm-k-flecha cm-k-next" aria-label="Siguiente" onClick={() => setI((i + 1) % n)}>
        ›
      </button>
      <span className="cm-k-cuenta" aria-hidden="true">
        {i + 1} / {n}
      </span>
      <div className="cm-k-puntos">
        {SLIDES.map((s, j) => (
          <button key={s.t} type="button" aria-label={`Ir a la ${j + 1}`} aria-current={j === i || undefined} onClick={() => setI(j)} />
        ))}
      </div>
    </div>
  );
}

export const CARRUSELES: Categoria = {
  id: 'carrusel',
  nombre: 'Carruseles',
  singular: 'carrusel',
  descripcion: 'Banners o tarjetas que se pasan de a una. Usá las flechas o los puntos.',
  estructura:
    '<div class="cm-carrusel cm-carrusel-DISEÑO" style="--i: 0; --n: 4" role="region" aria-roledescription="carrusel"><div class="cm-k-ventana"><div class="cm-k-pista"><div class="cm-k-slide" data-activo><strong>Título</strong><span>Detalle</span></div>…</div></div><button class="cm-k-flecha cm-k-prev">‹</button><button class="cm-k-flecha cm-k-next">›</button><div class="cm-k-puntos"><button aria-current="true"></button>…</div></div> — --i es la diapositiva actual.',
  anchoCelda: 340,
  base: `& { position: relative; width: 100%; max-width: 380px; font-family: var(--fuente-texto); }
& .cm-k-ventana { overflow: hidden; border-radius: var(--radio-grande); }
& .cm-k-pista { display: flex; transform: translateX(calc(var(--i) * -100%)); transition: transform var(--duracion-lenta) var(--curva-entrada); }
& .cm-k-slide { flex: 0 0 100%; display: flex; flex-direction: column; justify-content: flex-end; gap: 4px; height: 170px; padding: 18px; color: var(--color-sobre-acento); background: var(--color-acento); }
& .cm-k-slide:nth-child(2) { background: color-mix(in srgb, var(--color-acento) 22%, var(--color-texto)); color: var(--color-fondo); }
& .cm-k-slide:nth-child(3) { background: color-mix(in srgb, var(--color-acento) 18%, var(--color-fondo)); color: var(--color-texto); }
& .cm-k-slide:nth-child(4) { background: var(--color-texto); color: var(--color-fondo); }
& .cm-k-slide strong { font-family: var(--fuente-titulos); font-size: 22px; line-height: 1.1; }
& .cm-k-slide span { font-size: 13.5px; }
& .cm-k-flecha { position: absolute; top: 85px; transform: translateY(-50%); width: 40px; height: 40px; border: none; border-radius: 999px; background: color-mix(in srgb, var(--color-fondo) 88%, transparent); color: var(--color-texto); font-size: 22px; line-height: 1; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,.15); }
& .cm-k-prev { left: 8px; } & .cm-k-next { right: 8px; }
& .cm-k-cuenta { display: none; }
& .cm-k-puntos { display: flex; justify-content: center; gap: 2px; margin-top: 8px; }
& .cm-k-puntos button { width: 24px; height: 24px; border: none; background: transparent; cursor: pointer; display: grid; place-items: center; }
& .cm-k-puntos button::after { content: ''; width: 8px; height: 8px; border-radius: 999px; background: var(--color-borde); transition: width var(--duracion-media) var(--curva-entrada), background var(--duracion-media) ease; }
& .cm-k-puntos button[aria-current]::after { background: var(--color-acento); }
& button:focus-visible { outline: 2px solid var(--color-acento); outline-offset: 2px; }
${reducirMov}`,
  disenos: {
    clasico: { nombre: 'Clásico', descripcion: 'Flechas a los costados y puntos abajo', css: '' },
    asoma: { nombre: 'Asoma el siguiente', descripcion: 'Se ve un pedazo de la próxima tarjeta', css: `& .cm-k-ventana { border-radius: 0; } & .cm-k-pista { gap: 12px; transform: translateX(calc(var(--i) * (-82% - 12px))); } & .cm-k-slide { flex-basis: 82%; border-radius: var(--radio-grande); } & .cm-k-flecha { display: none; }` },
    fundido: { nombre: 'Fundido', descripcion: 'Cambia con un fundido en vez de deslizar', css: `& .cm-k-pista { display: grid; transform: none; } & .cm-k-slide { grid-area: 1 / 1; opacity: 0; transition: opacity var(--duracion-lenta) ease; } & .cm-k-slide[data-activo] { opacity: 1; }` },
    barras: { nombre: 'Barras', descripcion: 'Puntos alargados; el actual se estira', css: `& .cm-k-puntos button { width: auto; padding: 0 2px; } & .cm-k-puntos button::after { width: 14px; height: 4px; } & .cm-k-puntos button[aria-current]::after { width: 34px; }` },
    abajo: { nombre: 'Controles abajo', descripcion: 'Flechas y puntos juntos debajo, a la derecha', css: `& { padding-bottom: 48px; } & .cm-k-flecha { top: auto; bottom: 0; transform: none; box-shadow: none; border: 1.5px solid var(--color-borde); background: var(--color-fondo); } & .cm-k-prev { left: auto; right: 52px; } & .cm-k-next { right: 0; } & .cm-k-puntos { position: absolute; left: 0; bottom: 8px; margin: 0; }` },
    escala: { nombre: 'Zoom al entrar', descripcion: 'La que entra crece un poco', css: `& .cm-k-slide { transform: scale(.88); transition: transform var(--duracion-lenta) var(--curva-entrada); } & .cm-k-slide[data-activo] { transform: none; }` },
    numeros: { nombre: 'Con número', descripcion: 'Dice «1 / 4» en vez de puntos', css: `& .cm-k-puntos { display: none; } & .cm-k-cuenta { position: absolute; top: 12px; right: 12px; display: block; padding: 4px 10px; border-radius: 999px; background: rgba(0,0,0,.55); color: #FFFFFF; font: 700 12px var(--fuente-texto); }` },
    neobrutal: { nombre: 'Neobrutal', descripcion: 'Borde negro, sombra dura y flechas cuadradas', css: `& .cm-k-ventana { border-radius: 0; border: 2px solid var(--color-texto); box-shadow: 5px 5px 0 var(--color-texto); } & .cm-k-flecha { border-radius: 0; border: 2px solid var(--color-texto); box-shadow: 2px 2px 0 var(--color-texto); background: var(--color-fondo); }` },
  },
  Muestra: MuestraCarrusel,
};

// ---------- Pie de página ----------

const COLUMNAS: [string, string[]][] = [
  ['Producto', ['Funciones', 'Precios', 'Novedades']],
  ['Empresa', ['Nosotros', 'Trabajo', 'Prensa']],
  ['Ayuda', ['Contacto', 'Preguntas', 'Términos']],
];

function MuestraPie({ clase, id }: { clase: string; id: string }) {
  const correo = useId();
  return (
    <footer className={clase} aria-label={`Pie de página de ejemplo: ${PIES.disenos[id]?.nombre ?? id}`}>
      <div className="cm-f-arriba">
        <div className="cm-f-marca">
          <strong>Tu marca</strong>
          <p>Hecho con cuidado, para que tu día sea más simple.</p>
        </div>
        <div className="cm-f-cols">
          {COLUMNAS.map(([t, links]) => (
            <div key={t} className="cm-f-col">
              <strong>{t}</strong>
              {links.map((l) => (
                <a key={l} href="#" onClick={(e) => e.preventDefault()}>
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>
        <form className="cm-f-news" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor={correo}>Recibí las novedades</label>
          <div className="cm-f-news-fila">
            <input id={correo} type="email" placeholder="vos@ejemplo.com" />
            <button type="submit">Suscribirme</button>
          </div>
        </form>
      </div>
      <div className="cm-f-legal">
        <span>© 2026 Tu marca</span>
        <span className="cm-f-redes">
          {['IG', 'IN', 'YT'].map((r) => (
            <a key={r} href="#" aria-label={`Red social ${r}`} onClick={(e) => e.preventDefault()}>
              {r}
            </a>
          ))}
        </span>
      </div>
      <span className="cm-f-gigante" aria-hidden="true">
        Tu marca
      </span>
    </footer>
  );
}

export const PIES: Categoria = {
  id: 'pie',
  nombre: 'Pies de página',
  singular: 'pie de página',
  descripcion: 'Lo que va al final de cada página: links, contacto, newsletter y redes.',
  estructura:
    '<footer class="cm-pie cm-pie-DISEÑO"><div class="cm-f-arriba"><div class="cm-f-marca"><strong>Marca</strong><p>Frase</p></div><div class="cm-f-cols"><div class="cm-f-col"><strong>Producto</strong><a>…</a></div>…</div><form class="cm-f-news"><label>Recibí las novedades</label><div class="cm-f-news-fila"><input type="email"><button>Suscribirme</button></div></form></div><div class="cm-f-legal"><span>© 2026 Marca</span><span class="cm-f-redes"><a aria-label="Instagram">IG</a>…</span></div><span class="cm-f-gigante" aria-hidden="true">Marca</span></footer> — .cm-f-gigante y .cm-f-news se muestran o no según el diseño.',
  anchoCelda: 520,
  base: `& { position: relative; width: 100%; padding: 22px; border-top: 1px solid var(--color-borde); background: var(--color-fondo); color: var(--color-texto); font-family: var(--fuente-texto); font-size: 13px; overflow: hidden; }
& .cm-f-arriba { display: flex; flex-wrap: wrap; gap: 20px 32px; }
& .cm-f-marca { flex: 1 1 140px; display: flex; flex-direction: column; gap: 6px; }
& .cm-f-marca strong { font-family: var(--fuente-titulos); font-size: 17px; }
& .cm-f-marca p { margin: 0; color: var(--color-texto-suave); max-width: 24ch; }
& .cm-f-cols { flex: 2 1 260px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
& .cm-f-col { display: flex; flex-direction: column; gap: 2px; }
& .cm-f-col strong { font-size: 12px; margin-bottom: 4px; }
& a { display: inline-flex; align-items: center; min-height: 28px; color: var(--color-texto-suave); text-decoration: none; }
& a:hover { color: var(--color-texto); text-decoration: underline; text-underline-offset: 3px; }
& a:focus-visible, & button:focus-visible, & input:focus-visible { outline: 2px solid var(--color-acento); outline-offset: 2px; }
& .cm-f-news { display: none; flex: 1 1 100%; flex-direction: column; gap: 6px; }
& .cm-f-news label { font-weight: 700; }
& .cm-f-news-fila { display: flex; gap: 8px; }
& .cm-f-news input { flex: 1; min-width: 0; height: 40px; padding: 0 12px; border: 1px solid var(--color-borde); border-radius: var(--radio-medio); background: var(--color-fondo); color: var(--color-texto); font: inherit; }
& .cm-f-news button { height: 40px; padding: 0 14px; border: none; border-radius: var(--radio-boton); background: var(--boton-color); color: var(--boton-sobre); font: inherit; font-weight: 700; cursor: pointer; }
& .cm-f-legal { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 8px; margin-top: 18px; padding-top: 12px; border-top: 1px solid var(--color-borde); color: var(--color-texto-suave); font-size: 12px; }
& .cm-f-redes { display: flex; gap: 6px; }
& .cm-f-redes a { justify-content: center; width: 32px; height: 32px; border-radius: 999px; background: var(--color-superficie); font-size: 11px; font-weight: 700; color: var(--color-texto); }
& .cm-f-gigante { display: none; }`,
  disenos: {
    columnas: { nombre: 'Columnas', descripcion: 'Marca a la izquierda y tres columnas de links', css: '' },
    newsletter: { nombre: 'Con newsletter', descripcion: 'Suma una caja para suscribirse', css: `& .cm-f-news { display: flex; padding: 14px; border-radius: var(--radio-medio); background: var(--color-superficie); }` },
    oscuro: { nombre: 'Oscuro', descripcion: 'Fondo oscuro, texto claro', css: `& { background: #121418; color: #F1F2F4; border-top: none; } & a, & .cm-f-marca p, & .cm-f-legal { color: #B8BCC6; } & a:hover { color: #FFFFFF; } & .cm-f-legal { border-top-color: #2A2D35; } & .cm-f-redes a { background: #23262E; color: #F1F2F4; }` },
    simple: { nombre: 'Una línea', descripcion: 'Solo marca, links y redes en una fila', css: `& { padding: 14px 18px; } & .cm-f-arriba { align-items: center; } & .cm-f-marca p, & .cm-f-col strong, & .cm-f-col a:not(:nth-child(2)) { display: none; } & .cm-f-cols { display: flex; gap: 16px; flex: 0 1 auto; } & .cm-f-legal { margin-top: 8px; padding-top: 8px; }` },
    gigante: { nombre: 'Marca gigante', descripcion: 'El nombre enorme al final, como cierre', css: `& { padding-bottom: 0; } & .cm-f-gigante { display: block; margin-top: 10px; font-family: var(--fuente-titulos); font-weight: var(--titulos-peso); font-size: 92px; line-height: .8; letter-spacing: -0.04em; white-space: nowrap; color: var(--color-texto); transform: translateY(14%); }` },
    acento: { nombre: 'De color', descripcion: 'Fondo del color de acento', css: `& { background: var(--color-acento); color: var(--color-sobre-acento); border-top: none; } & a, & .cm-f-marca p, & .cm-f-legal { color: var(--color-sobre-acento); } & a:hover { color: var(--color-sobre-acento); } & .cm-f-legal { border-top-color: color-mix(in srgb, var(--color-sobre-acento) 30%, transparent); } & .cm-f-redes a { background: transparent; box-shadow: inset 0 0 0 1.5px var(--color-sobre-acento); color: var(--color-sobre-acento); }` },
    tarjeta: { nombre: 'Tarjeta flotante', descripcion: 'Una card redondeada separada de los bordes', css: `& { border: none; border-radius: var(--radio-grande); background: var(--color-superficie); margin: 0; box-shadow: 0 8px 24px rgba(0,0,0,.08); }` },
    centrado: { nombre: 'Centrado', descripcion: 'Todo centrado, con las redes protagonistas', css: `& { text-align: center; } & .cm-f-arriba { flex-direction: column; align-items: center; } & .cm-f-marca { align-items: center; } & .cm-f-cols { display: flex; justify-content: center; gap: 18px; } & .cm-f-col strong, & .cm-f-col a:not(:nth-child(2)) { display: none; } & .cm-f-legal { flex-direction: column-reverse; justify-content: center; } & .cm-f-redes a { width: 40px; height: 40px; }` },
    neobrutal: { nombre: 'Neobrutal', descripcion: 'Borde negro grueso y redes en cuadros', css: `& { border: 2px solid var(--color-texto); box-shadow: 5px 5px 0 var(--color-texto); } & .cm-f-legal { border-top: 2px solid var(--color-texto); } & .cm-f-redes a { border-radius: 0; border: 2px solid var(--color-texto); background: var(--color-acento); color: var(--color-sobre-acento); }` },
  },
  Muestra: MuestraPie,
};
