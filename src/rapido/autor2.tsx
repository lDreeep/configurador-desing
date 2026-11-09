// Más plantillas de autor: festival, app para correr, cafetería, florería y refugio de montaña.
// Mismo criterio que autor.tsx: un negocio concreto, contenido real, un protagonista por página,
// y todo por tokens para que encima se apliquen las elecciones de la persona.

import { useState } from 'react';
import { BotonPrincipal } from '../componentes/BotonPrincipal';
import type { Config } from '../tipos';
import { Img, Pie, Secundario } from './autor';
import { Cierre } from './autor3';
import { FraseRevelada, Preguntas, useGuion, type Beat } from './demo';

const Nav = ({ marca, links, accion }: { marca: string; links: string[]; accion?: string }) => (
  <header className="au-nav">
    <span className="au-marca">{marca}</span>
    <nav aria-label="Secciones de ejemplo">
      {links.map((l) => (
        <span key={l}>{l}</span>
      ))}
      {accion && <span className="au-nav-accion">{accion}</span>}
    </nav>
  </header>
);

// ---------------------------------------------------------------------------------------------
// Festival de música.
// Plan: noche violeta con manchas de calor (imagen térmica), letra ancha y pesada (Unbounded).
// Protagonista: la grilla de artistas en tipografía gigante, de mayor a menor. Nada de fotos de
// público: el cartel es la imagen. Entradas como tabla con la preventa agotada tachada.
// ---------------------------------------------------------------------------------------------

const ARTISTAS = [
  ['Lumbre', 'Marea Baja', 'Ciudad Satélite'],
  ['Norte Magnético', 'Sofía Ceniza', 'Los Faros', 'Tiempo Real'],
  ['Club Eclipse', 'Arena Fina', 'Dúo Lúmen', 'Vértigo Suave', 'Pampa Sur'],
];

export function Festival({ c, marca }: { c: Config; marca?: string }) {
  const m = marca || 'Infrarrojo';
  return (
    <div className="au au-fes">
      <div className="au-fes-calor" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <Nav marca={m} links={['Artistas', 'Horarios', 'Cómo llegar']} />
      <section className="au-fes-hero">
        <p className="au-fes-fecha">14 y 15 de marzo de 2027, Costanera Sur, Buenos Aires</p>
        <h2 className="pg-titulo au-fes-h1">{m}</h2>
        <p className="au-lead">Dos noches de música electrónica, tres escenarios y 24 artistas. Las puertas abren a las 18.</p>
        <div className="au-acciones">
          <BotonPrincipal config={c}>Comprar entradas</BotonPrincipal>
          <Secundario c={c}>Ver horarios</Secundario>
        </div>
        <p className="au3-prueba">La preventa 1 se agotó en 9 horas · quedan 1.240 entradas generales</p>
      </section>
      <section className="au-fes-cartel" aria-labelledby="au-fes-cartel">
        <h3 id="au-fes-cartel" className="au-oculto">
          Artistas
        </h3>
        {ARTISTAS.map((fila, i) => (
          <p key={i} className={`au-fes-fila au-fes-f${i}`}>
            {fila.map((a, j) => (
              <span key={a}>
                {a}
                {j < fila.length - 1 && <i aria-hidden="true">/</i>}
              </span>
            ))}
          </p>
        ))}
      </section>
      <section className="au-fes-entradas" aria-labelledby="au-fes-entradas">
        <h3 id="au-fes-entradas" className="au-h2">
          Entradas
        </h3>
        <ul>
          <li className="agotada">
            <span>Preventa 1</span>
            <span>Agotada</span>
            <b>$ 38.000</b>
          </li>
          <li>
            <span>Preventa 2</span>
            <span>Quedan 400</span>
            <b>$ 48.000</b>
          </li>
          <li>
            <span>General, las dos noches</span>
            <span>Desde el 1 de febrero</span>
            <b>$ 62.000</b>
          </li>
        </ul>
        <BotonPrincipal config={c}>Comprar entradas</BotonPrincipal>
      </section>
      <Pie marca={m} fotos={[]} links={['Artistas', 'Horarios', 'Preguntas', 'Cómo llegar']} />
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// App para correr.
// Plan: claro y técnico (azul eléctrico), sans geométrica. Protagonista: un mapa grande con la
// ruta dibujada sobre curvas de nivel y los datos encima. La semana como gráfico de barras real.
// ---------------------------------------------------------------------------------------------

const RUTAS: [string, string, string, string][] = [
  ['Costanera Norte', '10,4 km', '42 m', 'M8 60 C30 20 60 70 90 30 S140 10 152 40'],
  ['Bosques de Palermo', '6,2 km', '18 m', 'M10 40 C20 10 70 10 80 40 S130 70 150 30'],
  ['Parque Centenario', '3,1 km', '6 m', 'M40 20 C70 0 120 10 120 40 S70 80 40 60 S10 30 40 20'],
];

// El mapa cuenta una sola cosa (stageshow): la ruta se dibuja desde tu puerta, aparece la meta
// y los datos de la vuelta. Una vez al entrar en pantalla; con movimiento reducido, ya dibujada.
const GUION_RUN: Beat[] = [
  { objetivo: '', dura: 2600 },
  { objetivo: '', dura: 1000 },
];

function MapaCorrer() {
  const { ref, paso, activo } = useGuion(GUION_RUN, 1, false);
  // Antes de entrar en pantalla la ruta espera sin dibujar; al entrar se dibuja una vez.
  const dibujando = paso === 0;
  const listo = paso >= 1;
  const espera = dibujando && !activo;
  return (
    <div className={`au-run-mapa ${dibujando ? 'dibuja' : ''} ${espera ? 'espera' : ''} ${listo ? 'listo' : ''}`} role="img" aria-label="Mapa de ejemplo con una ruta de 10,4 kilómetros" ref={ref}>
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => (
          <ellipse key={i} cx={260} cy={120} rx={20 + i * 22} ry={12 + i * 15} className="au-run-curva" transform={`rotate(${-14 + i * 2} 260 120)`} />
        ))}
        <path d="M60 250 C90 200 70 170 120 150 S200 170 230 120 S300 60 340 70" className="au-run-ruta au-run-trazo" pathLength={1} />
        <circle cx="60" cy="250" r="7" className="au-run-pin" />
        <circle cx="340" cy="70" r="7" className="au-run-pin fin" />
        <circle cx="180" cy="152" r="5" className="au-run-agua" />
        <circle cx="290" cy="82" r="5" className="au-run-agua dos" />
      </svg>
      <div className="au-run-datos">
        <span>
          <b>10,4</b> km
        </span>
        <span>
          <b>42</b> m de desnivel
        </span>
        <span>
          <b>2</b> canillas
        </span>
      </div>
    </div>
  );
}

export function Correr({ c, marca }: { c: Config; marca?: string }) {
  const m = marca || 'Ruta';
  const km = [6.2, 0, 10.4, 5.1, 0, 14.8, 3.1];
  return (
    <div className="au au-run">
      <Nav marca={m} links={['Rutas', 'Grupos', 'Precios']} accion="Descargar" />
      <section className="au-run-hero">
        <div className="au-run-texto">
          <h2 className="pg-titulo au-run-h1">Rutas para correr cerca de tu casa, con el desnivel y el agua marcados</h2>
          <p className="au-lead">Más de 3.000 recorridos en Buenos Aires. Elegís la distancia y la app te arma la vuelta desde tu puerta.</p>
          <div className="au-acciones">
            <BotonPrincipal config={c}>Descargar la app</BotonPrincipal>
            <Secundario c={c}>Ver rutas</Secundario>
          </div>
          <p className="au3-prueba">4,7 en App Store · 86.400 corredores en Buenos Aires</p>
        </div>
        <MapaCorrer />
      </section>
      <section className="au-run-semana" aria-labelledby="au-run-semana">
        <div>
          <h3 id="au-run-semana" className="au-h2">
            Tu semana
          </h3>
          <p className="au-run-total">
            <b>39,6</b> km
          </p>
          <p className="au-run-nota">8 km más que la semana pasada.</p>
        </div>
        <div className="au-run-barras" aria-label="Kilómetros por día">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
            <span key={i} className={km[i] === Math.max(...km) ? 'max' : ''}>
              <i style={{ height: `${(km[i] / 15) * 100}%` }} />
              <small>{d}</small>
              {km[i] > 0 && <em>{String(km[i]).replace('.', ',')}</em>}
            </span>
          ))}
        </div>
      </section>
      <FraseRevelada texto="Salir a correr es más fácil cuando ya sabés por dónde ir y dónde cargar agua." />

      <section className="au-run-rutas" aria-labelledby="au-run-rutas">
        <h3 id="au-run-rutas" className="au-h2">
          Cerca tuyo
        </h3>
        <ul>
          {RUTAS.map(([n, d, h, path]) => (
            <li key={n}>
              <svg viewBox="0 0 160 80" aria-hidden="true">
                <path d={path} className="au-run-ruta" />
              </svg>
              <b>{n}</b>
              <span>
                {d} · {h} de desnivel
              </span>
            </li>
          ))}
        </ul>
      </section>
      <Pie marca={m} fotos={[]} links={['Rutas', 'Grupos', 'Precios', 'Ayuda']} />
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// Cafetería de especialidad.
// Plan: crema y tinta con un rojo de grano tostado (Arena), serif de cartel. Protagonista: la
// pizarra de precios, oscura, en una columna de mono. Fotos del oficio (el espresso, el tueste),
// nunca latte art desde arriba.
// ---------------------------------------------------------------------------------------------

const CARTA: [string, string][] = [
  ['Espresso', '$ 2.400'],
  ['Cortado', '$ 2.700'],
  ['Flat white', '$ 3.600'],
  ['Filtrado del día', '$ 3.200'],
  ['Medialuna de manteca', '$ 1.400'],
  ['Tostado de jamón y queso', '$ 5.900'],
];

export function Cafeteria({ c, marca }: { c: Config; marca?: string }) {
  const m = marca || 'Tueste';
  return (
    <div className="au au-caf">
      <Nav marca={m} links={['Carta', 'Café en grano', 'Dónde estamos']} />
      <section className="au-caf-hero">
        <Img id="espresso" clase="au-caf-hero-img" prioridad />
        <div className="au-caf-hero-texto">
          <h2 className="pg-titulo au-caf-h1">Café de especialidad tostado los martes en Chacarita</h2>
          <p className="au-lead">Abrimos de 8 a 19. El grano que servís en la barra es el mismo que te llevás en bolsa de 250 g.</p>
          <div className="au-acciones">
            <BotonPrincipal config={c}>Comprar café en grano</BotonPrincipal>
            <Secundario c={c}>Ver la carta</Secundario>
          </div>
          <p className="au3-prueba">Tostamos 42 kg por semana · 4,8 en Google</p>
        </div>
      </section>
      <section className="au-caf-pizarra" aria-labelledby="au-caf-pizarra">
        <h3 id="au-caf-pizarra" className="au-h2">
          En la barra
        </h3>
        <dl>
          {CARTA.map(([n, p]) => (
            <div key={n}>
              <dt>{n}</dt>
              <dd>{p}</dd>
            </div>
          ))}
        </dl>
        <p className="au-caf-leche">Leche de almendras o de avena sin cargo.</p>
      </section>
      <FraseRevelada texto="El café que tomás en la barra es el mismo que te llevás en bolsa, tostado el martes." />

      <section className="au-caf-origen" aria-labelledby="au-caf-origen">
        <Img id="tueste" clase="au-caf-o1" />
        <div className="au-caf-origen-texto">
          <h3 id="au-caf-origen" className="au-h2">
            Este mes: Huila, Colombia
          </h3>
          <p>Lavado, de altura, con notas de panela y mandarina. Lo tostamos claro para filtrado y un poco más oscuro para espresso.</p>
          <BotonPrincipal config={c}>Llevar 250 g por $ 14.500</BotonPrincipal>
        </div>
        <Img id="granos" clase="au-caf-o2" />
        <Img id="cafe" clase="au-caf-o3" />
      </section>
      <Pie marca={m} fotos={['espresso', 'tueste', 'granos', 'cafe']} links={['Carta', 'Café en grano', 'Dónde estamos']} />
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// Florería con suscripción.
// Plan: verde suave y blanco roto (Menta), serif fina (Cormorant). Protagonista: un collage de
// tres fotos superpuestas en el hero. Los planes como un selector real que cambia el precio.
// ---------------------------------------------------------------------------------------------

const PLANES: [string, string, string][] = [
  ['Cada semana', '$ 18.900', 'por ramo'],
  ['Cada quince días', '$ 21.500', 'por ramo'],
  ['Una vez por mes', '$ 24.000', 'por ramo'],
];

export function Floreria({ c, marca }: { c: Config; marca?: string }) {
  const m = marca || 'Flores de Estación';
  const [plan, setPlan] = useState(0);
  return (
    <div className="au au-flo">
      <Nav marca={m} links={['Ramos', 'Suscripción', 'Eventos']} />
      <section className="au-flo-hero">
        <div className="au-flo-texto">
          <h2 className="pg-titulo au-flo-h1">Un ramo de flores de estación en tu casa, cada semana</h2>
          <p className="au-lead">Compramos en el Mercado de Flores los lunes a la madrugada y entregamos el martes en CABA. Pausás o cancelás cuando quieras.</p>
          <BotonPrincipal config={c}>Elegir mi plan</BotonPrincipal>
          <p className="au3-prueba">1.146 casas reciben flores cada martes</p>
        </div>
        <div className="au-flo-collage">
          <Img id="ramo" clase="au-flo-c1" prioridad />
          <Img id="brotes" clase="au-flo-c2" />
          <Img id="florista" clase="au-flo-c3" />
        </div>
      </section>
      <section className="au-flo-planes" aria-labelledby="au-flo-planes">
        <h3 id="au-flo-planes" className="au-h2">
          ¿Cada cuánto?
        </h3>
        <div className="au-flo-selector" role="radiogroup" aria-label="Frecuencia">
          {PLANES.map(([n], i) => (
            <button key={n} type="button" role="radio" aria-checked={plan === i} onClick={() => setPlan(i)}>
              {n}
            </button>
          ))}
        </div>
        <p className="au-flo-precio" aria-live="polite">
          {PLANES[plan][1]} <small>{PLANES[plan][2]}, envío incluido</small>
        </p>
        <div className="au-flo-semana">
          <b>El ramo de esta semana</b>
          <span>Leucadendron, eucalipto baby blue, rosas de jardín y ruscus.</span>
        </div>
      </section>
      <FraseRevelada texto="Flores que duran una semana entera porque llegan a tu mesa un día después del mercado." />
      <Preguntas
        items={[
          ['¿Puedo pausar la suscripción?', 'Sí, desde tu cuenta y hasta el domingo anterior a la entrega.'],
          ['¿A qué zonas entregan?', 'A toda la Ciudad de Buenos Aires, los martes entre las 9 y las 14.'],
          ['¿Y si no estoy en casa?', 'Lo dejamos en portería o con quien nos indiques. Si no hay nadie, volvemos a la tarde.'],
          ['¿Cuánto duran las flores?', 'Entre 7 y 10 días si cambiás el agua cada dos días.'],
        ]}
      />
      <Cierre c={c} titulo="El martes puede llegar el primero" texto="Elegí cada cuánto y te avisamos qué trae el ramo de esta semana." accion="Elegir mi plan" nota="Pausás o cancelás cuando quieras." />
      <Pie marca={m} fotos={['ramo', 'brotes', 'florista']} links={['Ramos', 'Suscripción', 'Eventos', 'Preguntas']} />
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// Refugio de montaña.
// Plan: noche y oro viejo (Noche dorada), serif fina y espaciada. Protagonista: el paisaje a
// sangre con la barra de reserva apoyada abajo. Las habitaciones por su vista, con precio por
// noche; un dato enorme de cómo llegar.
// ---------------------------------------------------------------------------------------------

const HABITACIONES: [string, string, string, 'reflejo' | 'valle' | 'rayos'][] = [
  ['Vista al lago', 'Para dos, con estufa a leña', '$ 186.000', 'reflejo'],
  ['Vista al valle', 'Para cuatro, con cocina', '$ 248.000', 'valle'],
  ['Altillo', 'Para dos, bajo el techo de lenga', '$ 154.000', 'rayos'],
];

export function Refugio({ c, marca }: { c: Config; marca?: string }) {
  const m = marca || 'Refugio Lenga';
  return (
    <div className="au au-ref">
      <section className="au-ref-hero">
        <Img id="reflejo" clase="au-ref-hero-img" prioridad />
        <div className="au-ref-velo" aria-hidden="true" />
        <Nav marca={m} links={['Habitaciones', 'Excursiones', 'Cómo llegar']} />
        <div className="au-ref-texto">
          <h2 className="pg-titulo au-ref-h1">Un refugio de seis habitaciones frente al lago, en la Comarca Andina</h2>
          <p className="au3-prueba au-ref-prueba">9,6 en Booking · 438 opiniones</p>
        </div>
        <form className="au-ref-reserva" onSubmit={(e) => e.preventDefault()} aria-label="Buscar disponibilidad">
          <label>
            Llegada
            <input type="date" defaultValue="2027-01-14" />
          </label>
          <label>
            Salida
            <input type="date" defaultValue="2027-01-18" />
          </label>
          <label>
            Huéspedes
            <select defaultValue="2">
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
            </select>
          </label>
          <BotonPrincipal config={c}>Ver disponibilidad</BotonPrincipal>
        </form>
      </section>
      <section className="au-ref-habs" aria-labelledby="au-ref-habs">
        <h3 id="au-ref-habs" className="au-h2">
          Las habitaciones
        </h3>
        <ul>
          {HABITACIONES.map(([n, d, p, f]) => (
            <li key={n}>
              <Img id={f} clase="au-ref-foto" />
              <b>{n}</b>
              <span>{d}</span>
              <span className="au-ref-precio">
                {p} <small>la noche, con desayuno</small>
              </span>
            </li>
          ))}
        </ul>
      </section>
      <FraseRevelada texto="Despertarte con el lago quieto y no tener que ir a ningún lado." />

      <section className="au-ref-llegar" aria-labelledby="au-ref-llegar">
        <Img id="camino" clase="au-ref-llegar-img" />
        <div>
          <p id="au-ref-llegar" className="au-ref-km">
            A 22 km de El Bolsón, por ripio
          </p>
          <p>Te buscamos en la terminal sin cargo. En invierno el último tramo pide cadenas: te avisamos el día anterior.</p>
          <Secundario c={c}>Cómo llegar</Secundario>
        </div>
      </section>
      <Preguntas
        items={[
          ['¿Qué incluye la tarifa?', 'Desayuno casero, ropa de cama y leña para la salamandra.'],
          ['¿Se puede cancelar?', 'Sin cargo hasta 15 días antes. Después, la seña queda para otra fecha.'],
          ['¿Aceptan mascotas?', 'Sí, en la Cabaña del bosque, con aviso previo.'],
          ['¿Hay señal de celular?', 'Hay wifi en el salón. En las habitaciones, a propósito, no.'],
        ]}
      />
      <Cierre c={c} titulo="Seis habitaciones, y enero se llena en octubre" texto="Mirá las fechas libres y reservá con una seña del 30%." accion="Ver disponibilidad" nota="Cancelás sin cargo hasta 15 días antes." />
      <Pie marca={m} fotos={['reflejo', 'valle', 'rayos', 'camino']} links={['Habitaciones', 'Excursiones', 'Cómo llegar']} />
    </div>
  );
}
