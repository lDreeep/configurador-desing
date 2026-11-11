// Plantillas de autor: páginas diseñadas una por una para un negocio concreto, con su propia
// composición, contenido real y fotos (o la interfaz real, en software). Sobre ellas se aplican las
// elecciones de la persona: paleta, letra, botones y cajas entran por los tokens (--color-*,
// --fuente-*, --radio-*) y por BotonPrincipal. Se diseñaron con las skills frontend-design y
// design-taste-frontend: un protagonista por página, texto concreto, sin plantilla genérica.

import type { CSSProperties, ReactNode } from 'react';
import './autor.css';
import { FraseRevelada, useGuion, type Beat } from './demo';
import { BotonPrincipal } from '../componentes/BotonPrincipal';
import { animarToque } from '../componentes/ui';
import type { Config } from '../tipos';
import { creditos, FOTOS, type FotoId } from './fotos';

export function Img({ id, clase = '', prioridad = false }: { id: FotoId; clase?: string; prioridad?: boolean }) {
  const f = FOTOS[id];
  return (
    <img
      className={`au-img ${clase}`}
      src={f.src}
      alt={f.alt}
      width={1200}
      height={Math.round((1200 * f.alto) / f.ancho)}
      loading={prioridad ? 'eager' : 'lazy'}
      decoding="async"
      style={{ objectPosition: f.foco, backgroundImage: f.lqip ? `url(${f.lqip})` : undefined } as CSSProperties}
    />
  );
}

export function Secundario({ c, children }: { c: Config; children: ReactNode }) {
  return (
    <button type="button" className={`pv-boton pv-secundario est-${c.botones.estilo} pg-boton-sec`} onClick={(e) => animarToque(e.currentTarget, e)}>
      {children}
    </button>
  );
}

export function Pie({ marca, fotos, links }: { marca: string; fotos: FotoId[]; links: string[] }) {
  return (
    <footer className="au-pie">
      <span className="au-pie-marca">{marca}</span>
      <span className="au-pie-links">
        {links.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </span>
      {fotos.length > 0 && <span className="au-pie-creditos">{creditos(fotos)}</span>}
    </footer>
  );
}

// ---------------------------------------------------------------------------------------------
// Panadería de barrio.
// Plan: papel cálido y harina (paleta Arena), serif con cuerpo (Fraunces) + sans de oficio.
// Protagonista: la foto del horno a sangre, grande, sin nada encima. Momento: el horario en
// tipografía enorme. La carta como lista de precios con puntos guía, no como tarjetas.
// ---------------------------------------------------------------------------------------------

const PANES = [
  ['Hogaza de campo', '1 kg, 48 horas de fermentación', '$ 6.800', '7:00'],
  ['Pan de centeno con comino', '800 g', '$ 7.400', '7:00'],
  ['Baguette', 'La de siempre', '$ 2.900', '7:00 y 17:00'],
  ['Focaccia de romero', 'Por plancha', '$ 5.200', '11:00'],
  ['Medialunas de manteca', 'Docena', '$ 9.600', '7:00'],
  ['Budín de limón', 'Con glasé', '$ 6.100', '15:00'],
];

export function Panaderia({ c, marca }: { c: Config; marca?: string }) {
  const m = marca || 'Horno Thames';
  return (
    <div className="au au-pan">
      <header className="au-nav">
        <span className="au-marca">{m}</span>
        <nav aria-label="Secciones de ejemplo">
          <span>La carta</span>
          <span>Encargos</span>
          <span>Cómo llegar</span>
        </nav>
      </header>

      <section className="au-pan-hero">
        <div className="au-pan-hero-texto">
          <h2 className="pg-titulo au-pan-h1">Pan de masa madre, horneado cada mañana en Villa Crespo</h2>
          <p className="au-lead">Sale del horno a las 7 y a las 17. Encargá hasta las 21 y lo retirás al día siguiente.</p>
          <div className="au-acciones">
            <BotonPrincipal config={c}>Encargar pan</BotonPrincipal>
            <Secundario c={c}>Ver la carta</Secundario>
          </div>
          <p className="au3-prueba">4,9 en Google · 1.862 reseñas de vecinos</p>
        </div>
        <Img id="horno" clase="au-pan-hero-img" prioridad />
      </section>

      <section className="au-pan-carta" aria-labelledby="au-pan-carta">
        <h3 id="au-pan-carta" className="au-h2">La carta de hoy</h3>
        <ul>
          {PANES.map(([n, d, p, h]) => (
            <li key={n}>
              <span className="au-pan-nombre">
                {n}
                <small>{d}</small>
              </span>
              <span className="au-pan-guia" aria-hidden="true" />
              <span className="au-pan-precio">{p}</span>
              <span className="au-pan-hora">Sale a las {h}</span>
            </li>
          ))}
        </ul>
      </section>

      <FraseRevelada texto="Harina, agua, sal y dos días de paciencia. Nada más entra en nuestro pan." />

      <section className="au-pan-proceso" aria-labelledby="au-pan-proceso">
        <div className="au-pan-proceso-texto">
          <h3 id="au-pan-proceso" className="au-h2">Dos días por cada pan</h3>
          <p>La masa leuda 48 horas en canastos de mimbre. A la madrugada entra al horno de piso a 250 °C y a las 7 ya está en el mostrador.</p>
        </div>
        <Img id="canastos" clase="au-pan-p1" />
        <Img id="puertas" clase="au-pan-p2" />
        <Img id="pala" clase="au-pan-p3" />
      </section>

      <section className="au-pan-visita" aria-labelledby="au-pan-visita">
        <p className="au-pan-horario" id="au-pan-visita">
          Abrimos de <b>7 a 20</b>
        </p>
        <div className="au-pan-datos">
          <p>Thames y Loyola, Villa Crespo</p>
          <dl>
            <dt>Lunes a sábado</dt>
            <dd>7 a 20</dd>
            <dt>Domingo</dt>
            <dd>8 a 14</dd>
          </dl>
          <BotonPrincipal config={c}>Cómo llegar</BotonPrincipal>
        </div>
      </section>

      <Pie marca={m} fotos={['horno', 'canastos', 'puertas', 'pala']} links={['La carta', 'Encargos', 'Cómo llegar']} />
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// App financiera.
// Plan: noche con vidrio acanalado y un acento eléctrico (paleta Tinta y lima), sans geométrica.
// Protagonista: el celular con la app real (saldo, redondeo, movimientos). Sin fotos: en software
// la interfaz es la imagen. Las funciones son pedazos de la app, no tarjetas con íconos.
// ---------------------------------------------------------------------------------------------

const MOVS = [
  ['Verdulería Don Tito', 'Hoy, 9:41', '- $ 3.940', '+ $ 60'],
  ['Subte', 'Hoy, 8:12', '- $ 857', '+ $ 43'],
  ['Sueldo', 'Ayer', '+ $ 812.000', ''],
  ['Farmacia Central', 'Ayer, 19:20', '- $ 12.730', '+ $ 70'],
  ['Alquiler', 'Lunes', '- $ 380.000', ''],
];

// El celular cuenta una historia sola (stageshow, sin cursor): llega un pago, el aviso baja, el
// movimiento entra arriba de la lista corriendo a los demás, y el ahorro sube. Se ve una vez al
// entrar en pantalla y queda en el resultado.
const GUION_FIN: Beat[] = [
  { objetivo: '', dura: 1300 },
  { objetivo: '', dura: 1700 },
  { objetivo: '', dura: 3000 },
];

function TelefonoFinanzas() {
  const { ref, paso } = useGuion(GUION_FIN, 2, false);
  const llego = paso >= 2;
  const movs = llego ? [['Café Tito', 'Recién', '- $ 3.840', '+ $ 160'], ...MOVS.slice(0, 4)] : MOVS;
  return (
    <div className="au-fin-tel" aria-label="Pantalla de ejemplo de la app" role="img" ref={ref}>
      <div className="au-fin-pantalla">
        <div className={`au-fin-banner ${paso === 1 || paso === 2 ? 'ver' : ''}`}>
          <b>Pagaste $ 3.840 en Café Tito</b>
          <span>Redondeamos a $ 4.000: $ 160 a tu ahorro.</span>
        </div>
        <span className="au-fin-hola">Hola, Ana</span>
        <span className="au-fin-saldo-etq">Saldo disponible</span>
        <span className="au-fin-saldo">
          <span key={String(llego)} className="au3-entra">{llego ? '$ 478.310' : '$ 482.310'}</span>
          <small>,17</small>
        </span>
        <div className="au-fin-botones">
          {['Pagar', 'Transferir', 'Ingresar', 'Más'].map((b) => (
            <span key={b}>
              <i />
              {b}
            </span>
          ))}
        </div>
        <div className="au-fin-ahorro">
          <span>Ahorrado con vueltos</span>
          <b key={String(llego)} className="au3-entra">{llego ? '$ 19.100' : '$ 18.940'}</b>
          <span className="au-fin-barra">
            <i style={{ width: llego ? '64%' : '62%' }} />
          </span>
        </div>
        <ul className="au-fin-movs">
          {movs.map(([n, h, v, r], i) => (
            <li key={n} className={llego && i === 0 ? 'au-fin-nuevo' : ''}>
              <span className="au-fin-av">{n[0]}</span>
              <span className="au-fin-mov">
                {n}
                <small>{h}</small>
              </span>
              <span className="au-fin-monto">
                {v}
                {r && <small>{r} al ahorro</small>}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Finanzas({ c, marca }: { c: Config; marca?: string }) {
  const m = marca || 'Moneda';
  return (
    <div className="au au-fin">
      <div className="au-fin-fondo" aria-hidden="true" />
      <header className="au-nav">
        <span className="au-marca">{m}</span>
        <nav aria-label="Secciones de ejemplo">
          <span>Cuenta</span>
          <span>Ahorro</span>
          <span>Costos</span>
        </nav>
      </header>

      <section className="au-fin-hero">
        <div className="au-fin-hero-texto">
          <h2 className="pg-titulo au-fin-h1">Una cuenta que ahorra los vueltos de cada compra</h2>
          <p className="au-lead">Cada pago se redondea a los $ 100 siguientes y la diferencia va a tu ahorro, que rinde 32 % anual.</p>
          <div className="au-acciones">
            <BotonPrincipal config={c}>Abrir mi cuenta</BotonPrincipal>
            <Secundario c={c}>Ver los costos</Secundario>
          </div>
          <p className="au3-prueba">214.300 cuentas abiertas · sin costo de mantenimiento</p>
        </div>
        <TelefonoFinanzas />
      </section>

      <section className="au-fin-partes" aria-labelledby="au-fin-partes">
        <h3 id="au-fin-partes" className="au-h2">Así se junta, sin que lo pienses</h3>
        <div className="au-fin-grilla">
          <div className="au-fin-pieza au-fin-noti">
            {[
              ['ahora', 'Pagaste $ 3.940 en Verdulería Don Tito', 'Redondeamos a $ 4.000: $ 60 a tu ahorro.'],
              ['hace 1 h', 'Pagaste $ 857 en el subte', 'Redondeamos a $ 900: $ 43 a tu ahorro.'],
              ['ayer', 'Tu ahorro rindió $ 412', 'Ya tenés $ 18.940 guardados con vueltos.'],
            ].map(([t, b, d]) => (
              <div key={t} className="au-fin-aviso">
                <small>
                  {m} · {t}
                </small>
                <b>{b}</b>
                <span>{d}</span>
              </div>
            ))}
          </div>
          <div className="au-fin-pieza au-fin-meta">
            <span>Vacaciones en Bariloche</span>
            <b>$ 180.000 de $ 400.000</b>
            <span className="au-fin-barra">
              <i style={{ width: '45%' }} />
            </span>
            <small>Al ritmo de este mes llegás en julio.</small>
          </div>
          <div className="au-fin-pieza au-fin-graf">
            <span>Tu ahorro, mes a mes</span>
            <svg viewBox="0 0 300 110" aria-hidden="true">
              <path d="M0 96 C40 90 60 84 90 74 S150 58 180 46 S240 22 300 10" fill="none" stroke="currentColor" strokeWidth="2.5" />
              <path d="M0 96 C40 90 60 84 90 74 S150 58 180 46 S240 22 300 10 V110 H0Z" fill="currentColor" opacity=".14" />
            </svg>
          </div>
        </div>
      </section>

      <FraseRevelada texto="Los vueltos que antes se perdían en la billetera ahora son tus vacaciones de julio." />

      <section className="au-fin-costos" aria-labelledby="au-fin-costos">
        <h3 id="au-fin-costos" className="au-h2">Lo que cuesta</h3>
        <dl>
          <dt>Mantenimiento de la cuenta</dt>
          <dd>$ 0</dd>
          <dt>Transferencias</dt>
          <dd>$ 0</dd>
          <dt>Tarjeta física, envío incluido</dt>
          <dd>$ 0</dd>
          <dt>Extracción en cajeros de otra red</dt>
          <dd>$ 450</dd>
        </dl>
      </section>

      <Pie marca={m} fotos={[]} links={['Cuenta', 'Ahorro', 'Costos', 'Ayuda']} />
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// Portfolio de estudio.
// Plan: papel y tinta (paleta Papel), serif de revista (Instrument Serif) + sans neutra.
// Protagonista: el índice de proyectos en tipografía grande. Las fotos van en una grilla
// asimétrica de tamaños distintos, nunca todas iguales; los datos (año, rubro) en una línea.
// ---------------------------------------------------------------------------------------------

const PROYECTOS: [string, string, string, FotoId][] = [
  ['Fragua del Sur', 'Identidad y catálogo', '2026', 'fragua'],
  ['Luthería Arce', 'Sitio web y fotos de taller', '2025', 'violin'],
  ['Encuadernación Lomo', 'Packaging y papelería', '2025', 'encuadernacion'],
  ['Flores de Estación', 'Identidad y redes', '2024', 'florista'],
  ['Café Molienda', 'Carta y señalética', '2024', 'cafe'],
];

export function Portfolio({ c, marca }: { c: Config; marca?: string }) {
  const m = marca || 'Estudio Ferro';
  return (
    <div className="au au-por">
      <header className="au-nav">
        <span className="au-marca">{m}</span>
        <nav aria-label="Secciones de ejemplo">
          <span>Trabajos</span>
          <span>Estudio</span>
          <span>Contacto</span>
        </nav>
      </header>

      <section className="au-por-hero">
        <h2 className="pg-titulo au-por-h1">Identidad y sitios web para talleres y oficios</h2>
        <div className="au-por-hero-pie">
          <p className="au-lead">Diseñamos para gente que hace cosas con las manos: herreros, luthiers, encuadernadores, floristas. Tomamos cuatro proyectos por año.</p>
          <BotonPrincipal config={c}>Contar un proyecto</BotonPrincipal>
        </div>
      </section>

      <section className="au-por-indice" aria-labelledby="au-por-indice">
        <h3 id="au-por-indice" className="au-h2 au-oculto">Trabajos</h3>
        <ol>
          {PROYECTOS.map(([n, t, a, f]) => (
            <li key={n}>
              <span className="au-por-n">{n}</span>
              <span className="au-por-t">{t}</span>
              <span className="au-por-a">{a}</span>
              <Img id={f} clase="au-por-mini" />
            </li>
          ))}
        </ol>
      </section>

      <FraseRevelada texto="Un oficio bien mostrado se vende solo. Nuestro trabajo es que se vea como se hace." />

      <section className="au-por-galeria" aria-label="Fotos de los trabajos">
        <Img id="fragua" clase="au-por-g1" />
        <Img id="yunque" clase="au-por-g2" />
        <Img id="violin" clase="au-por-g3" />
        <Img id="encuadernacion" clase="au-por-g4" />
      </section>

      <section className="au-por-contacto">
        <p className="au-por-frase">Si tenés un taller y querés que se vea como trabajás, escribinos.</p>
        <div className="au-acciones">
          <BotonPrincipal config={c}>Contar un proyecto</BotonPrincipal>
          <Secundario c={c}>hola@estudioferro.example</Secundario>
        </div>
      </section>

      <Pie marca={m} fotos={['fragua', 'yunque', 'violin', 'encuadernacion', 'florista', 'cafe']} links={['Trabajos', 'Estudio', 'Contacto']} />
    </div>
  );
}
