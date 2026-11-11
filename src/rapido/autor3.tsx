// Plantillas de autor «landing que convierte»: turnos para consultorios, curso online, restaurante y
// estudio de entrenamiento. Aplican dos skills:
// · landing-page-design: una oferta, un público y una acción; titular con resultado + bajada concreta,
//   la misma acción arriba y al final, una prueba al lado de la promesa, frase grande que se enciende
//   palabra por palabra al bajar, cómo funciona en tres pasos, preguntas frecuentes y reversión de riesgo.
// · stageshow: el producto como protagonista, en una demo animada con cursor (o dedo, en el celular)
//   donde pasa UNA cosa con causa visible; palabras reales solo en lo que cuenta la historia y barras
//   en el resto; el cuadro de reposo (poster) muestra el resultado; con movimiento reducido queda quieto.
// Todo por tokens: paleta, letra, botones y cajas de la persona se aplican encima.

import { useState } from 'react';
import './autor3.css';
import { BotonPrincipal } from '../componentes/BotonPrincipal';
import type { Config } from '../tipos';
import { Img, Pie, Secundario } from './autor';
import { Cursor, FraseRevelada, Preguntas, useGuion, type Beat } from './demo';

// ---------------------------------------------------------------------------------------------
// Piezas compartidas
// ---------------------------------------------------------------------------------------------

function Nav({ marca, links, c, accion }: { marca: string; links: string[]; c: Config; accion: string }) {
  return (
    <header className="au-nav au3-nav">
      <span className="au-marca">{marca}</span>
      <nav aria-label="Secciones de ejemplo">
        {links.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </nav>
      <span className="au3-nav-cta">
        <BotonPrincipal config={c}>{accion}</BotonPrincipal>
      </span>
    </header>
  );
}

const Tilde = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Barra = ({ w }: { w: number }) => <i className="au3-bar" style={{ width: `${w}%` }} />;

export function Cierre({ c, titulo, texto, accion, nota }: { c: Config; titulo: string; texto: string; accion: string; nota: string }) {
  return (
    <section className="au3-cierre">
      <h3 className="au-h2">{titulo}</h3>
      <p>{texto}</p>
      <BotonPrincipal config={c}>{accion}</BotonPrincipal>
      <small>{nota}</small>
    </section>
  );
}

// ---------------------------------------------------------------------------------------------
// 1. Turnera: turnos online para consultorios (software B2B, layout clásico: hero + argumento).
// Demo: la semana en la agenda; el cursor toca un hueco, carga a la paciente, guarda; el turno
// aparece en su lugar y sale el recordatorio por WhatsApp (satélite sobre el borde de la ventana).
// ---------------------------------------------------------------------------------------------

const GUION_TURNOS: Beat[] = [
  { objetivo: 'libre', dura: 1100 },
  { objetivo: 'libre', clic: true, dura: 1500 },
  { objetivo: 'guardar', dura: 900 },
  { objetivo: 'guardar', clic: true, dura: 3400 },
  { objetivo: 'semana', dura: 900 },
  { objetivo: 'semana', clic: true, dura: 700 },
];

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];
const HORAS = ['9:00', '10:00', '11:00', '12:00'];
// [día, hora, nombre o ancho de barra]
const OCUPADOS: [number, number, string | number][] = [
  [0, 0, 'Julián Pérez'], [0, 2, 60], [1, 1, 'Ana Ríos'], [1, 3, 52], [2, 0, 70], [2, 1, 45], [3, 0, 'Lucas Gil'], [3, 3, 58], [4, 1, 66], [4, 2, 'Carla Díaz'],
];

function DemoTurnos() {
  const { ref, paso, vuelta, activo, beat } = useGuion(GUION_TURNOS, 3);
  const abierto = paso === 1 || paso === 2;
  const hecho = paso === 3 || paso === 4;
  const semana = vuelta % 2 === 0 ? 'Semana del 9 al 13 de noviembre' : 'Semana del 16 al 20 de noviembre';
  return (
    <div className="au3-escena au3-tur-escena" ref={ref}>
      <div className="au3-ventana au3-tur-ventana">
        <div className="au3-chrome">
          <i /><i /><i />
          <span className="au3-url">turnera.app/agenda</span>
        </div>
        <div className="au3-tur-app">
          <aside className="au3-tur-lado" aria-hidden="true">
            <span className="au3-tur-yo">Dra. Ferreyra</span>
            <span className="sel">Agenda</span>
            <Barra w={58} />
            <Barra w={44} />
            <Barra w={66} />
          </aside>
          <div className="au3-tur-cal">
            <div className="au3-tur-barra">
              <b key={vuelta} className="au3-entra">{semana}</b>
              <span className="au3-tur-flechas" data-objetivo="semana">‹ ›</span>
              <span className="au3-tur-cuenta">
                <b>{hecho ? 38 : 37}</b> turnos
              </span>
            </div>
            <div className={`au3-tur-grilla ${paso === 5 ? 'se-va' : ''}`} key={vuelta}>
              <span />
              {DIAS.map((d) => (
                <span key={d} className="au3-tur-dia">{d}</span>
              ))}
              {HORAS.map((h, hi) => (
                <FilaTurnos key={h} h={h} hi={hi} abierto={abierto} hecho={hecho} />
              ))}
            </div>
            {abierto && (
              <div className="au3-tur-pop" role="presentation">
                <span className="au3-tur-pop-t">Nuevo turno · Jue 11:00</span>
                <span className="au3-tur-campo">
                  <span className={paso === 1 ? 'au3-tipea' : ''}>Martina Sosa</span>
                </span>
                <span className="au3-tur-campo suave">Control · 30 min</span>
                <span className="au3-tur-guardar" data-objetivo="guardar">Guardar turno</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={`au3-tur-aviso ${hecho ? 'ver' : ''}`} aria-hidden={!hecho}>
        <span className="au3-tur-wa">WhatsApp</span>
        <b>Recordatorio programado</b>
        <span>Martina recibe el aviso el miércoles a las 11:00.</span>
      </div>
      <Cursor escena={ref} beat={beat} paso={paso} activo={activo} />
    </div>
  );
}

function FilaTurnos({ h, hi, abierto, hecho }: { h: string; hi: number; abierto: boolean; hecho: boolean }) {
  return (
    <>
      <span className="au3-tur-hora">{h}</span>
      {DIAS.map((_, di) => {
        const o = OCUPADOS.find(([d, hh]) => d === di && hh === hi);
        const esLibre = di === 3 && hi === 2;
        if (esLibre)
          return (
            <span key={di} className={`au3-tur-celda libre ${abierto ? 'elegida' : ''} ${hecho ? 'nuevo' : ''}`} data-objetivo="libre">
              {hecho && (
                <span className="au3-tur-turno destacado au3-entra">
                  Martina Sosa<small>Control</small>
                </span>
              )}
            </span>
          );
        return (
          <span key={di} className="au3-tur-celda">
            {o &&
              (typeof o[2] === 'string' ? (
                <span className="au3-tur-turno">{o[2]}</span>
              ) : (
                <span className="au3-tur-turno vacio">
                  <Barra w={o[2]} />
                </span>
              ))}
          </span>
        );
      })}
    </>
  );
}

const PLANES_TUR: { nombre: string; para: string; mes: number; items: string[] }[] = [
  { nombre: 'Profesional', para: 'Para una persona que atiende sola', mes: 14900, items: ['Agenda ilimitada', 'Recordatorios por WhatsApp', 'Link propio para sacar turno'] },
  { nombre: 'Centro', para: 'Hasta 8 profesionales y una recepción', mes: 38500, items: ['Todo lo de Profesional', 'Agendas por consultorio', 'Reportes de ausencias'] },
];

export function Turnos({ c, marca }: { c: Config; marca?: string }) {
  const m = marca || 'Turnera';
  const [anual, setAnual] = useState(false);
  const precio = (n: number) => '$ ' + Math.round(anual ? n * 0.85 : n).toLocaleString('es-AR');
  return (
    <div className="au au3 au3-tur">
      <Nav marca={m} c={c} links={['Cómo funciona', 'Precios', 'Preguntas']} accion="Probar gratis" />

      <section className="au3-hero">
        <div className="au3-hero-texto">
          <span className="au3-etq">Para consultorios y centros de salud</span>
          <h2 className="pg-titulo au3-h1">
            Tu agenda llena,
            <br /> sin atender el teléfono
          </h2>
          <p className="au-lead">Tus pacientes sacan turno solos desde WhatsApp o la web. {m} les recuerda el día anterior y libera el horario si cancelan.</p>
          <div className="au-acciones">
            <BotonPrincipal config={c}>Probar 30 días gratis</BotonPrincipal>
          </div>
          <p className="au3-prueba">
            <span className="au3-caras" aria-hidden="true">
              <i>PF</i>
              <i>MR</i>
              <i>GL</i>
            </span>
            Lo usan 1.243 consultorios de Argentina y Uruguay. Sin tarjeta para empezar.
          </p>
        </div>
        <DemoTurnos />
      </section>

      <section className="au3-problema">
        <p className="au3-dato">
          <b>18,4%</b>
          <span>de los turnos se pierde porque el paciente se olvida o avisa tarde.</span>
        </p>
        <div className="au3-antes">
          <h3 className="au3-h3">Hoy</h3>
          <ul>
            <li>Respondés mensajes entre paciente y paciente.</li>
            <li>Los huecos que deja una cancelación quedan vacíos.</li>
            <li>La agenda vive en un cuaderno o en tu cabeza.</li>
          </ul>
        </div>
        <div className="au3-despues">
          <h3 className="au3-h3">Con {m}</h3>
          <ul>
            <li><Tilde /> Cada paciente elige su horario desde un link.</li>
            <li><Tilde /> Si alguien cancela, el turno se ofrece a la lista de espera.</li>
            <li><Tilde /> Ves la semana entera desde el celular.</li>
          </ul>
        </div>
      </section>

      <FraseRevelada texto="Menos llamadas, menos huecos en la agenda y más tiempo para tus pacientes." />

      <section className="au3-pasos" aria-labelledby="au3-tur-pasos">
        <h3 id="au3-tur-pasos" className="au-h2">Empezás a recibir turnos hoy</h3>
        <ol>
          <li>
            <span className="au3-num">1</span>
            <b>Cargás tus horarios</b>
            <p>Días, duración de cada consulta y pausas. Diez minutos.</p>
            <span className="au3-pieza au3-chips" aria-hidden="true">
              <em className="on">Lun</em><em className="on">Mar</em><em>Mié</em><em className="on">Jue</em><em className="on">Vie</em>
            </span>
          </li>
          <li>
            <span className="au3-num">2</span>
            <b>Compartís tu link</b>
            <p>En tu bio, en WhatsApp o en la puerta del consultorio.</p>
            <span className="au3-pieza au3-link" aria-hidden="true">turnera.app/dra-ferreyra</span>
          </li>
          <li>
            <span className="au3-num">3</span>
            <b>Te llegan los turnos</b>
            <p>Confirmados, con recordatorio y sin que levantes el teléfono.</p>
            <span className="au3-pieza au3-noti" aria-hidden="true">
              <b>Nuevo turno</b> Jue 11:00 · Martina Sosa
            </span>
          </li>
        </ol>
      </section>

      <figure className="au3-testimonio">
        <blockquote>«Pasé de 11 ausencias por mes a 3. La recepción dejó de vivir en el teléfono.»</blockquote>
        <figcaption>
          <b>Paula Ferreyra</b> Kinesióloga, consultorio en Rosario
        </figcaption>
      </figure>

      <section className="au3-precios" aria-labelledby="au3-tur-precios">
        <div className="au3-precios-cabeza">
          <h3 id="au3-tur-precios" className="au-h2">Un precio por consultorio</h3>
          <div className="au3-seg" role="group" aria-label="Forma de pago">
            <button type="button" aria-pressed={!anual} onClick={() => setAnual(false)}>Mensual</button>
            <button type="button" aria-pressed={anual} onClick={() => setAnual(true)}>Anual · 15% menos</button>
          </div>
        </div>
        <div className="au3-planes">
          {PLANES_TUR.map((p, i) => (
            <div key={p.nombre} className={`au3-plan ${i === 1 ? 'fuerte' : ''}`}>
              <b>{p.nombre}</b>
              <span className="au3-plan-para">{p.para}</span>
              <span className="au3-plan-precio" key={String(anual)}>
                {precio(p.mes)}
                <small> por mes</small>
              </span>
              <ul>
                {p.items.map((t) => (
                  <li key={t}><Tilde /> {t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="au3-garantia">30 días gratis, sin tarjeta. Si no te sirve, no pagás nada y te llevás tu agenda en Excel.</p>
      </section>

      <Preguntas
        items={[
          ['¿Mis pacientes tienen que bajar una app?', 'No. Sacan el turno desde un link que se abre en cualquier navegador o desde WhatsApp.'],
          ['¿Cómo funcionan los recordatorios?', 'Salen solos por WhatsApp 24 horas antes, con un botón para confirmar o cancelar.'],
          ['¿Puedo bloquear días u horarios?', 'Sí. Marcás vacaciones, feriados o una tarde libre y esos horarios desaparecen del link.'],
          ['¿Qué pasa si cancelan?', 'El horario se libera y se ofrece a quienes están en la lista de espera para esa semana.'],
          ['¿Sirve para obras sociales?', 'Podés pedir el número de afiliado al sacar el turno y verlo en la ficha de cada paciente.'],
          ['¿Puedo cancelar cuando quiera?', 'Sí, desde tu cuenta y sin llamar a nadie. Te descargás tus datos antes de irte.'],
        ]}
      />

      <Cierre c={c} titulo="Probalo con tu agenda real" texto="Cargá tus horarios hoy y mañana ya tenés turnos confirmados." accion="Probar 30 días gratis" nota="Sin tarjeta. Cancelás cuando quieras." />
      <Pie marca={m} fotos={[]} links={['Precios', 'Privacidad', 'Términos']} />
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// 2. Encuadre: curso online de fotografía con el celular (infoproducto, historia larga).
// Demo: el reproductor con la clase actual; el cursor da play, la barra avanza, la clase queda
// con tilde y el progreso del curso sube. La causa del reinicio es la clase siguiente.
// ---------------------------------------------------------------------------------------------

const GUION_CURSO: Beat[] = [
  { objetivo: 'play', dura: 1000 },
  { objetivo: 'play', clic: true, dura: 2600 },
  { objetivo: 'reposo', dura: 2800 },
  { objetivo: 'siguiente', dura: 900 },
  { objetivo: 'siguiente', clic: true, dura: 700 },
];

const CLASES = ['La luz de la mañana', 'Regla de tercios', 'Retratos a contraluz', 'Editar sin filtros', 'Noche con el celular'];

function DemoCurso() {
  const { ref, paso, vuelta, activo, beat } = useGuion(GUION_CURSO, 2);
  const actual = 2 + (vuelta % 2);
  const corriendo = paso === 1;
  const terminada = paso >= 2;
  const progreso = Math.round(((actual + (terminada ? 1 : 0)) / 24) * 100);
  return (
    <div className="au3-escena au3-cur-escena" ref={ref}>
      <div className="au3-ventana au3-cur-ventana">
        <div className="au3-cur-video">
          <Img id="reflejo" clase="au3-cur-img" prioridad />
          <span className={`au3-cur-play ${corriendo ? 'oculto' : ''}`} data-objetivo="play" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor" /></svg>
          </span>
          <span className="au3-cur-tiempo">
            <i className={corriendo ? 'corre' : terminada ? 'llena' : ''} />
          </span>
        </div>
        <div className="au3-cur-lista">
          <span className="au3-cur-prog">
            Tu progreso <b key={progreso} className="au3-entra">{progreso}%</b>
          </span>
          <ol>
            {CLASES.map((t, i) => {
              const hecha = i < actual || (i === actual && terminada);
              return (
                <li key={t} className={`${i === actual ? 'actual' : ''} ${hecha ? 'hecha' : ''}`} data-objetivo={i === actual + 1 ? 'siguiente' : undefined}>
                  <span className="au3-cur-marca">{hecha ? <Tilde /> : i + 1}</span>
                  {i <= actual + 1 ? t : <Barra w={50 + i * 7} />}
                  <small>{['6:40', '8:15', '11:02', '9:30', '12:48'][i]}</small>
                </li>
              );
            })}
          </ol>
          <span className="au3-cur-reposo" data-objetivo="reposo" />
        </div>
      </div>
      <Cursor escena={ref} beat={beat} paso={paso} activo={activo} />
    </div>
  );
}

const MODULOS: [string, string, string[]][] = [
  ['Mirar la luz', '6 clases · 52 min', ['De dónde viene la luz y por qué importa', 'La hora dorada en la ciudad', 'Sombras duras sin miedo']],
  ['Encuadrar', '7 clases · 61 min', ['Regla de tercios y cuándo romperla', 'Líneas que guían la mirada', 'Retratos a contraluz']],
  ['Editar', '6 clases · 58 min', ['Exposición y balance de blancos', 'Color sin filtros', 'Exportar para Instagram y para imprimir']],
  ['Proyecto final', '5 clases · 44 min', ['Una serie de 9 fotos', 'Devolución personal del profe']],
];

export function Curso({ c, marca }: { c: Config; marca?: string }) {
  const m = marca || 'Encuadre';
  const [corte, setCorte] = useState(52);
  return (
    <div className="au au3 au3-cur">
      <Nav marca={m} c={c} links={['El programa', 'Antes y después', 'Preguntas']} accion="Inscribirme" />

      <section className="au3-hero">
        <div className="au3-hero-texto">
          <span className="au3-etq">Curso online · 24 clases cortas</span>
          <h2 className="pg-titulo au3-h1">
            Fotos que parecen de cámara,
            <br /> sacadas con tu celular
          </h2>
          <p className="au-lead">Entendés la luz, encuadrás con intención y editás sin filtros. A tu ritmo, en cuatro semanas, con devolución personal al final.</p>
          <div className="au-acciones">
            <BotonPrincipal config={c}>Inscribirme por $ 39.900</BotonPrincipal>
          </div>
          <p className="au3-prueba">
            <span className="au3-estrellas" aria-hidden="true">★★★★★</span>
            4,9 de 5 en 812 reseñas · 3.186 alumnos
          </p>
        </div>
        <DemoCurso />
      </section>

      <FraseRevelada texto="No necesitás una cámara nueva. Necesitás saber dónde está la luz." />

      <section className="au3-comparar" aria-labelledby="au3-cur-comp">
        <div className="au3-comparar-texto">
          <h3 id="au3-cur-comp" className="au-h2">La misma foto, después de la clase 9</h3>
          <p>Deslizá para comparar. Sin apps pagas: exposición, balance de blancos y un recorte.</p>
        </div>
        <div className="au3-comparar-foto" style={{ ['--corte' as string]: `${corte}%` }}>
          <Img id="reflejo" clase="au3-despues-img" />
          <Img id="reflejo" clase="au3-antes-img" />
          <span className="au3-comparar-linea" aria-hidden="true" />
          <span className="au3-comparar-etq a">Antes</span>
          <span className="au3-comparar-etq d">Después</span>
          <input type="range" min={5} max={95} value={corte} onChange={(e) => setCorte(Number(e.target.value))} aria-label="Comparar antes y después" />
        </div>
      </section>

      <section className="au3-modulos" aria-labelledby="au3-cur-mod">
        <h3 id="au3-cur-mod" className="au-h2">El programa</h3>
        <div>
          {MODULOS.map(([t, d, cl], i) => (
            <details key={t} open={i === 0}>
              <summary>
                <span className="au3-mod-n">0{i + 1}</span>
                <b>{t}</b>
                <small>{d}</small>
              </summary>
              <ul>
                {cl.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </section>

      <section className="au3-voces" aria-label="Lo que dicen los alumnos">
        {[
          ['«Volví de las vacaciones con fotos que mi familia pensó que eran de un fotógrafo.»', 'Sofía Brizuela', 'Córdoba'],
          ['«Las clases duran lo que dura un café. Las hacía en el colectivo.»', 'Matías Ocampo', 'La Plata'],
          ['«Vendo ropa por Instagram y las ventas subieron cuando cambié las fotos.»', 'Lucía Benítez', 'Mendoza'],
        ].map(([q, n, l]) => (
          <figure key={n}>
            <blockquote>{q}</blockquote>
            <figcaption>
              <b>{n}</b> {l}
            </figcaption>
          </figure>
        ))}
      </section>

      <Preguntas
        items={[
          ['¿Sirve cualquier celular?', 'Sí. Las clases están pensadas para la cámara que ya tenés, de cualquier marca y año.'],
          ['¿Cuánto tiempo tengo para hacerlo?', 'El acceso es de por vida, incluidas las clases que agreguemos.'],
          ['¿Hay horarios?', 'No. Todas las clases están grabadas y duran entre 6 y 13 minutos.'],
          ['¿Cómo es la devolución personal?', 'Subís tu serie de 9 fotos y el profe te manda un audio de 10 minutos con comentarios.'],
          ['¿Puedo pagar en cuotas?', 'Sí, hasta 3 cuotas sin interés con tarjeta de crédito.'],
          ['¿Y si no me gusta?', 'Te devolvemos el total si lo pedís dentro de los 7 días, sin preguntas.'],
        ]}
      />

      <Cierre c={c} titulo="Tu próxima foto ya puede ser otra" texto="Empezás hoy mismo: la primera clase dura 6 minutos." accion="Inscribirme por $ 39.900" nota="Garantía de 7 días. Acceso de por vida." />
      <Pie marca={m} fotos={['reflejo']} links={['Programa', 'Privacidad', 'Términos']} />
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// 3. Brasa: restaurante a las brasas. La acción es reservar; el protagonista, el celular con la
// reserva hecha en tres toques (personas, horario, confirmar) y el comprobante que sale al costado.
// ---------------------------------------------------------------------------------------------

const GUION_RESTO: Beat[] = [
  { objetivo: 'personas', dura: 900 },
  { objetivo: 'personas', clic: true, dura: 900 },
  { objetivo: 'hora', dura: 800 },
  { objetivo: 'hora', clic: true, dura: 900 },
  { objetivo: 'confirmar', dura: 800 },
  { objetivo: 'confirmar', clic: true, dura: 3600 },
  { objetivo: 'nueva', clic: true, dura: 800 },
];

function DemoResto() {
  const { ref, paso, activo, beat } = useGuion(GUION_RESTO, 5);
  const personas = paso >= 1 && paso < 6 ? 4 : 2;
  const hora = paso >= 3 && paso < 6 ? '21:30' : null;
  const lista = paso === 5;
  return (
    <div className="au3-escena au3-res-escena" ref={ref}>
      <div className="au3-tel">
        <div className="au3-tel-pantalla">
          <span className="au3-tel-isla" aria-hidden="true" />
          {!lista ? (
            <div className="au3-res-form au3-entra" key="f">
              <span className="au3-res-t">Reservar mesa</span>
              <span className="au3-res-sub">Sábado 14 de noviembre</span>
              <span className="au3-res-etq">Personas</span>
              <span className="au3-res-fila">
                {[2, 3, 4, 5, 6].map((n) => (
                  <em key={n} className={n === personas ? 'on' : ''} data-objetivo={n === 4 ? 'personas' : undefined}>{n}</em>
                ))}
              </span>
              <span className="au3-res-etq">Horario</span>
              <span className="au3-res-horas">
                {['20:00', '20:30', '21:30', '22:00', '22:30', '23:00'].map((h) => (
                  <em key={h} className={`${h === hora ? 'on' : ''} ${h === '20:30' || h === '22:00' ? 'no' : ''}`} data-objetivo={h === '21:30' ? 'hora' : undefined}>{h}</em>
                ))}
              </span>
              <span className="au3-res-etq">Dónde</span>
              <span className="au3-res-donde">
                <em>Salón</em>
                <em className="on">Junto al fuego</em>
                <em>Barra</em>
              </span>
              <span className="au3-res-aviso">Quedan 2 mesas junto al fuego para esta noche.</span>
              <span className={`au3-res-btn ${hora ? '' : 'apagado'}`} data-objetivo="confirmar">Confirmar reserva</span>
            </div>
          ) : (
            <div className="au3-res-ok au3-entra" key="ok">
              <span className="au3-res-check"><Tilde /></span>
              <span className="au3-res-t">Mesa reservada</span>
              <span className="au3-res-sub">Sáb 14 · 21:30 · 4 personas</span>
              <span className="au3-res-nota">Te guardamos la mesa hasta las 21:45.</span>
              <span className="au3-res-btn sec" data-objetivo="nueva">Hacer otra reserva</span>
            </div>
          )}
        </div>
      </div>
      <div className={`au3-res-ticket ${lista ? 'ver' : ''}`} aria-hidden={!lista}>
        <small>Reserva n.º 4.817</small>
        <b>Mesa junto al fuego</b>
        <span>Sáb 14 · 21:30 · 4 personas</span>
      </div>
      <Cursor escena={ref} beat={beat} paso={paso} dedo activo={activo} />
    </div>
  );
}

const CARTA: [string, [string, string, string][]][] = [
  ['Para empezar', [['Provoleta de cabra', 'Miel de caña y tomillo', '$ 9.800'], ['Mollejas al limón', 'Crocantes, con chimichurri', '$ 14.200'], ['Morrones asados', 'Ajo confitado y pan de campo', '$ 7.900']]],
  ['Del fuego', [['Ojo de bife', '450 g, 21 días de maduración', '$ 31.500'], ['Entraña', 'Con papas al rescoldo', '$ 26.900'], ['Pesca del día', 'Envuelta en hojas de parra', '$ 24.300'], ['Coliflor entera', 'Ahumada, con salsa de yogur', '$ 15.600']]],
  ['Para terminar', [['Flan de dulce de leche', 'Con crema batida', '$ 7.400'], ['Durazno a la brasa', 'Helado de vainilla', '$ 8.100']]],
];

export function Restaurante({ c, marca }: { c: Config; marca?: string }) {
  const m = marca || 'Brasa';
  return (
    <div className="au au3 au3-res">
      <Nav marca={m} c={c} links={['La carta', 'Dónde estamos', 'Grupos']} accion="Reservar" />

      <section className="au3-hero">
        <div className="au3-hero-texto">
          <span className="au3-etq">Palermo · Gorriti 4815</span>
          <h2 className="pg-titulo au3-h1">
            Cocina a las brasas,
            <br /> doce mesas y un fuego
          </h2>
          <p className="au-lead">La carta cambia cada semana según lo que llega del mercado. Reservá hasta las 18 para cenar esta misma noche.</p>
          <div className="au-acciones">
            <BotonPrincipal config={c}>Reservar mesa</BotonPrincipal>
          </div>
          <p className="au3-prueba">
            <span className="au3-estrellas" aria-hidden="true">★★★★★</span>
            4,8 en 2.317 reseñas
          </p>
        </div>
        <DemoResto />
      </section>

      <FraseRevelada texto="Todo pasa por el fuego. Lo que no se puede asar, no está en la carta." />

      <section className="au3-carta" aria-labelledby="au3-res-carta">
        <div className="au3-carta-cabeza">
          <h3 id="au3-res-carta" className="au-h2">La carta de esta semana</h3>
          <p>Del 9 al 15 de noviembre. Opciones sin TACC marcadas en el salón.</p>
        </div>
        {CARTA.map(([t, platos]) => (
          <div key={t} className="au3-carta-grupo">
            <h4 className="au3-h3">{t}</h4>
            <ul>
              {platos.map(([n, d, p]) => (
                <li key={n}>
                  <span>
                    {n}
                    <small>{d}</small>
                  </span>
                  <i aria-hidden="true" />
                  <b>{p}</b>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="au3-res-visita">
        <p className="au3-res-horario">
          Martes a domingo
          <b>20 a 0:30</b>
        </p>
        <div>
          <p>Gorriti 4815, Palermo. A dos cuadras de la estación Plaza Italia.</p>
          <p>Grupos de más de 8 personas: escribinos y armamos un menú de pasos.</p>
          <Secundario c={c}>Cómo llegar</Secundario>
        </div>
      </section>

      <Preguntas
        items={[
          ['¿Puedo ir sin reserva?', 'Guardamos dos mesas en la barra para quien llega sin reserva, por orden de llegada.'],
          ['¿Hay opciones vegetarianas?', 'Sí, siempre hay al menos tres platos sin carne, también hechos al fuego.'],
          ['¿Cuánto tiempo me guardan la mesa?', 'Quince minutos. Si se te hace tarde, avisanos por WhatsApp y la sostenemos.'],
          ['¿Se puede cancelar?', 'Sí, desde el mismo link de la reserva y sin cargo hasta 2 horas antes.'],
        ]}
      />

      <Cierre c={c} titulo="Esta noche hay fuego" texto="Quedan mesas para el sábado a las 21:30 y a las 23." accion="Reservar mesa" nota="Cancelás sin cargo hasta 2 horas antes." />
      <Pie marca={m} fotos={[]} links={['La carta', 'Privacidad', 'Términos']} />
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// 4. Pulso: estudio de entrenamiento con cupos. Demo: la grilla del día; el cursor reserva la clase
// de las 19, el cupo se completa y aparece el aviso. La causa del reinicio: pasa a «Mañana».
// ---------------------------------------------------------------------------------------------

const GUION_GYM: Beat[] = [
  { objetivo: 'reservar', dura: 1000 },
  { objetivo: 'reservar', clic: true, dura: 3400 },
  { objetivo: 'manana', dura: 900 },
  { objetivo: 'manana', clic: true, dura: 800 },
];

const CLASES_GYM: [string, string, string, number][] = [
  ['7:00', 'Movilidad', 'Caro', 7],
  ['8:15', 'Fuerza', 'Nico', 12],
  ['18:00', 'Funcional', 'Juli', 9],
  ['19:00', 'Fuerza', 'Nico', 11],
  ['20:15', 'Core y estiramiento', 'Caro', 5],
];

function DemoGym() {
  const { ref, paso, vuelta, activo, beat } = useGuion(GUION_GYM, 1);
  const reservada = paso === 1 || paso === 2;
  const dia = vuelta % 2 === 0 ? 'Hoy, jueves 12' : 'Hoy, viernes 13';
  return (
    <div className="au3-escena au3-gym-escena" ref={ref}>
      <div className="au3-gym-panel">
        <div className="au3-gym-tabs">
          <b key={vuelta} className="au3-entra">{dia}</b>
          <span data-objetivo="manana">Mañana ›</span>
        </div>
        <ul className={paso === 3 ? 'se-va' : ''} key={vuelta}>
          {CLASES_GYM.map(([h, n, coach, cupo]) => {
            const esta = h === '19:00';
            const ocupados = esta && reservada ? cupo + 1 : cupo;
            const llena = ocupados >= 12;
            return (
              <li key={h} className={esta ? 'foco' : ''}>
                <span className="au3-gym-hora">{h}</span>
                <span className="au3-gym-clase">
                  {esta || h === '18:00' ? n : <Barra w={40 + n.length * 3} />}
                  <small>{esta || h === '18:00' ? `con ${coach} · Sala ${esta ? 2 : 1}` : <Barra w={30} />}</small>
                </span>
                <span className="au3-gym-cupo">
                  <i style={{ width: `${(ocupados / 12) * 100}%` }} />
                  <small>{ocupados}/12</small>
                </span>
                {esta ? (
                  <span className={`au3-gym-btn ${reservada ? 'ok' : ''}`} data-objetivo="reservar">
                    {reservada ? <><Tilde /> Reservada</> : 'Reservar'}
                  </span>
                ) : (
                  <span className={`au3-gym-btn ${llena ? 'llena' : 'sec'}`}>{llena ? 'Completa' : 'Reservar'}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div className={`au3-gym-aviso ${reservada ? 'ver' : ''}`} aria-hidden={!reservada}>
        <b>Te esperamos a las 19:00</b>
        <span>Sala 2 · Nico ya sabe que venís por fuerza.</span>
      </div>
      <Cursor escena={ref} beat={beat} paso={paso} activo={activo} />
    </div>
  );
}

const PLANES_GYM: Record<string, [string, string]> = {
  '2 veces': ['$ 32.400', '8 clases por mes'],
  '3 veces': ['$ 41.900', '12 clases por mes'],
  'Libre': ['$ 54.700', 'Todas las clases que quieras'],
};

export function Gimnasio({ c, marca }: { c: Config; marca?: string }) {
  const m = marca || 'Pulso';
  const [plan, setPlan] = useState('3 veces');
  return (
    <div className="au au3 au3-gym">
      <Nav marca={m} c={c} links={['Clases', 'Planes', 'Coaches']} accion="Clase gratis" />

      <section className="au3-hero">
        <div className="au3-hero-texto">
          <span className="au3-etq">Estudio de entrenamiento en Núñez</span>
          <h2 className="pg-titulo au3-h1">
            Clases de 45 minutos,
            <br /> doce personas por turno
          </h2>
          <p className="au-lead">Fuerza, funcional y movilidad con un coach que te conoce. Reservás tu lugar desde el celular y llegás a entrenar.</p>
          <div className="au-acciones">
            <BotonPrincipal config={c}>Probar una clase gratis</BotonPrincipal>
          </div>
          <p className="au3-prueba">46 clases por semana · 8 coaches · de 7 a 21:30</p>
        </div>
        <DemoGym />
      </section>

      <FraseRevelada texto="No venís a sufrir. Venís a salir mejor de lo que entraste, tres veces por semana." />

      <section className="au3-pasos" aria-labelledby="au3-gym-pasos">
        <h3 id="au3-gym-pasos" className="au-h2">Tu primera semana</h3>
        <ol>
          <li>
            <span className="au3-num">1</span>
            <b>Clase de prueba</b>
            <p>Venís, entrenás y el coach mide tu punto de partida.</p>
          </li>
          <li>
            <span className="au3-num">2</span>
            <b>Elegís tu plan</b>
            <p>Dos, tres veces o libre. Sin matrícula ni permanencia.</p>
          </li>
          <li>
            <span className="au3-num">3</span>
            <b>Reservás desde el celu</b>
            <p>Ves el cupo de cada clase y cancelás hasta 2 horas antes.</p>
          </li>
        </ol>
      </section>

      <section className="au3-gym-planes" aria-labelledby="au3-gym-planes">
        <h3 id="au3-gym-planes" className="au-h2">¿Cuántas veces por semana?</h3>
        <div className="au3-seg grande" role="group" aria-label="Frecuencia">
          {Object.keys(PLANES_GYM).map((k) => (
            <button key={k} type="button" aria-pressed={plan === k} onClick={() => setPlan(k)}>
              {k}
            </button>
          ))}
        </div>
        <p className="au3-gym-precio" key={plan}>
          <b className="au3-entra">{PLANES_GYM[plan][0]}</b>
          <span>por mes · {PLANES_GYM[plan][1]}</span>
        </p>
        <BotonPrincipal config={c}>Probar una clase gratis</BotonPrincipal>
        <small>La primera clase no se paga. Si no volvés, no pasa nada.</small>
      </section>

      <section className="au3-voces" aria-label="Lo que dicen quienes entrenan">
        {[
          ['«En tres meses dejé de tener dolor de espalda. Y me empezó a gustar entrenar.»', 'Gabriela Luna', 'Entrena hace 8 meses'],
          ['«Me gusta que sean doce. Nico sabe qué me pasa en la rodilla sin que se lo diga.»', 'Federico Paz', 'Entrena hace 1 año'],
        ].map(([q, n, l]) => (
          <figure key={n}>
            <blockquote>{q}</blockquote>
            <figcaption>
              <b>{n}</b> {l}
            </figcaption>
          </figure>
        ))}
      </section>

      <Preguntas
        items={[
          ['¿Tengo que estar en forma para empezar?', 'No. Cada ejercicio tiene una versión más fácil y el coach te la marca desde la primera clase.'],
          ['¿Hay matrícula o permanencia?', 'No. Pagás mes a mes y podés pausar el plan hasta 30 días por año.'],
          ['¿Qué tengo que llevar?', 'Ropa cómoda, zapatillas y una botella. Toallas y candados hay en el estudio.'],
          ['¿Qué pasa si falto?', 'Si cancelás hasta 2 horas antes, la clase vuelve a tu cuenta para usarla otro día.'],
          ['¿Hay vestuarios?', 'Sí, con duchas y lockers.'],
          ['¿Puedo ir con un amigo?', 'Sí. Su primera clase también es gratis.'],
        ]}
      />

      <Cierre c={c} titulo="Tu primera clase va por nuestra cuenta" texto="Elegí un horario de esta semana y vení a probar." accion="Probar una clase gratis" nota="Sin matrícula. Sin permanencia." />
      <Pie marca={m} fotos={[]} links={['Clases', 'Privacidad', 'Términos']} />
    </div>
  );
}

