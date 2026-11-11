// Dibuja las secciones elegidas (`src/secciones.ts`) debajo de la portada, en el orden elegido.
// Cada diseño es una composición distinta; todos usan solo los tokens de `sistema.ts` y las clases
// de referencia de la página (`.pg-card`, `.pg-boton`), así el estilo elegido también las viste.

import { Fragment, useId, useState, type FormEvent, type ReactNode } from 'react';
import { BotonPrincipal, claseBotonPrincipal } from '../componentes/BotonPrincipal';
import { DISENOS_SECCION, llevaSecciones, seccionDe, type SeccionDisenoId } from '../secciones';
import type { Config } from '../tipos';
import { CONTENIDO_SECCIONES, type ContenidoSecciones } from './contenido-secciones';
import type { Contenido } from './Pagina';
import './secciones.css';

interface Props {
  c: Config;
  /** El contenido de la página (lo que escribió la persona o el de su tipo de proyecto). */
  k: Contenido;
  /** El contenido de muestra de las secciones para su tipo. */
  m: ContenidoSecciones;
}

const iniciales = (nombre: string) =>
  nombre
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2);

const soloNumeros = (t: string) => t.replace(/\D/g, '');

/** El marco de toda sección: clases, nombre accesible y un ancla para que Molde la traiga a la vista. */
function Marco({ id, titulo, tituloOculto = false, children }: { id: SeccionDisenoId; titulo: string; tituloOculto?: boolean; children: (titulo: ReactNode) => ReactNode }) {
  const idTitulo = useId();
  const seccion = seccionDe(id);
  const h = (
    <h3 id={idTitulo} className={`pg-sec-titulo ${tituloOculto ? 'pg-sec-oculto' : ''}`}>
      {titulo}
    </h3>
  );
  return (
    <section className={`pg-sec pg-sec-${seccion} pg-sec-${id}`} data-seccion={seccion} aria-labelledby={idTitulo}>
      {children(h)}
    </section>
  );
}

function BeneficiosRenglones({ k, m }: Props) {
  return (
    <Marco id="beneficios_renglones" titulo={m.beneficios.titulo}>
      {(h) => (
        <>
          {h}
          <ul className="pg-sec-renglones">
            {k.items.map((it) => (
              <li key={it.titulo}>
                <span className="pg-sec-grande">{it.titulo}</span>
                <span className="pg-sec-suave">{it.texto}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </Marco>
  );
}

function BeneficiosDestacado({ k, m }: Props) {
  const [primero, ...resto] = k.items;
  return (
    <Marco id="beneficios_destacado" titulo={m.beneficios.titulo}>
      {(h) => (
        <div className="pg-sec-dos">
          <div className="pg-sec-bloque">
            {h}
            <p>
              <span className="pg-sec-enorme">{primero.titulo}</span>
              <span>{primero.texto}</span>
            </p>
          </div>
          <ul className="pg-sec-pila">
            {resto.map((it) => (
              <li key={it.titulo} className="pg-card">
                <span className="pg-card-titulo">{it.titulo}</span>
                <span className="pg-card-texto">{it.texto}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Marco>
  );
}

function Pasos({ id, m }: Props & { id: 'pasos_fila' | 'pasos_escalera' }) {
  return (
    <Marco id={id} titulo={m.pasos.titulo}>
      {(h) => (
        <>
          {h}
          <ol className="pg-sec-lista-pasos">
            {m.pasos.items.map((p, i) => (
              <li key={p.titulo}>
                <span className="pg-sec-numero" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="pg-sec-paso">
                  <b>{p.titulo}</b>
                  <span className="pg-sec-suave">{p.texto}</span>
                </span>
              </li>
            ))}
          </ol>
        </>
      )}
    </Marco>
  );
}

/** Lo que incluye un plan, leído de los renglones de la tabla: una sola fuente para los dos diseños. */
const incluye = (m: ContenidoSecciones, plan: number) =>
  m.precios.filas.flatMap((f) => {
    const v = f.valores[plan];
    return v === false ? [] : [v === true ? f.nombre : `${f.nombre}: ${v.toLowerCase()}`];
  });

function PreciosPlanes({ c, k, m }: Props) {
  const p = m.precios;
  return (
    <Marco id="precios_planes" titulo={p.titulo}>
      {(h) => (
        <>
          <div className="pg-sec-cabeza">
            {h}
            <p className="pg-sec-suave">{p.nota}</p>
          </div>
          <ul className="pg-sec-planes">
            {p.planes.map((plan, i) => {
              const elegido = i === p.destacado;
              return (
                <li key={plan.nombre} className={`pg-card ${elegido ? 'pg-sec-elegido' : ''}`}>
                  {elegido && <span className="pg-sec-sello">El más elegido</span>}
                  <span className="pg-card-titulo">{plan.nombre}</span>
                  <span className="pg-card-texto">{plan.para}</span>
                  <span className="pg-sec-precio">
                    <b>{plan.precio}</b> {plan.periodo}
                  </span>
                  <ul className="pg-sec-incluye">
                    {incluye(m, i).map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                  {elegido ? (
                    <BotonPrincipal config={c} clase="pg-boton" onClick={k.onPrincipal}>
                      {plan.cta}
                    </BotonPrincipal>
                  ) : (
                    <button type="button" className={`pv-boton pv-secundario est-${c.botones.estilo} pg-boton-sec`}>
                      {plan.cta}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </Marco>
  );
}

function PreciosTabla({ m }: Props) {
  const p = m.precios;
  return (
    <Marco id="precios_tabla" titulo={p.titulo}>
      {(h) => (
        <>
          <div className="pg-sec-cabeza">
            {h}
            <p className="pg-sec-suave">{p.nota}</p>
          </div>
          <div className="pg-sec-tabla" role="region" aria-label={`${p.titulo}: tabla comparativa`} tabIndex={0}>
            <table>
              <caption className="pg-sec-oculto">{p.titulo}: qué incluye cada opción</caption>
              <thead>
                <tr>
                  <td />
                  {p.planes.map((plan, i) => (
                    <th key={plan.nombre} scope="col" className={i === p.destacado ? 'pg-sec-elegido' : ''}>
                      <span className="pg-sec-plan">{plan.nombre}</span>
                      <span className="pg-sec-precio">
                        <b>{plan.precio}</b> {plan.periodo}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {p.filas.map((f) => (
                  <tr key={f.nombre}>
                    <th scope="row">{f.nombre}</th>
                    {f.valores.map((v, i) => (
                      <td key={i} className={`${i === p.destacado ? 'pg-sec-elegido' : ''} ${v === false ? 'pg-sec-no' : ''}`}>
                        {v === true ? 'Sí' : v === false ? 'No' : v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Marco>
  );
}

function Autor({ nombre, rol, avatar = false }: { nombre: string; rol: string; avatar?: boolean }) {
  return (
    <figcaption>
      {avatar && (
        <span className="pg-sec-avatar" aria-hidden="true">
          {iniciales(nombre)}
        </span>
      )}
      <span>
        <b>{nombre}</b>
        <span className="pg-sec-suave">{rol}</span>
      </span>
    </figcaption>
  );
}

function TestimoniosCita({ k, m }: Props) {
  // Si la página trae su propio testimonio, va ese.
  const cita = k.testimonio ?? m.testimonios.citas[0];
  return (
    <Marco id="testimonios_cita" titulo={m.testimonios.titulo} tituloOculto>
      {(h) => (
        <>
          {h}
          <figure className="pg-sec-cita">
            <blockquote>{cita.texto}</blockquote>
            <Autor nombre={cita.nombre} rol={cita.rol} avatar />
          </figure>
        </>
      )}
    </Marco>
  );
}

function TestimoniosTres({ m }: Props) {
  return (
    <Marco id="testimonios_tres" titulo={m.testimonios.titulo}>
      {(h) => (
        <>
          {h}
          <div className="pg-sec-voces">
            {m.testimonios.citas.map((x) => (
              <figure key={x.nombre}>
                <blockquote>{x.texto}</blockquote>
                <Autor nombre={x.nombre} rol={x.rol} />
              </figure>
            ))}
          </div>
        </>
      )}
    </Marco>
  );
}

function PreguntasAcordeon({ k, m }: Props) {
  return (
    <Marco id="preguntas_acordeon" titulo={m.preguntas.titulo}>
      {(h) => (
        <div className="pg-sec-faq">
          {h}
          <div>
            {k.preguntas.map(([p, r]) => (
              <details key={p}>
                <summary>{p}</summary>
                <p className="pg-sec-suave">{r}</p>
              </details>
            ))}
          </div>
        </div>
      )}
    </Marco>
  );
}

function PreguntasAbiertas({ k, m }: Props) {
  return (
    <Marco id="preguntas_abiertas" titulo={m.preguntas.titulo}>
      {(h) => (
        <>
          {h}
          <dl className="pg-sec-respuestas">
            {k.preguntas.map(([p, r]) => (
              <div key={p}>
                <dt>{p}</dt>
                <dd className="pg-sec-suave">{r}</dd>
              </div>
            ))}
          </dl>
        </>
      )}
    </Marco>
  );
}

function EquipoRetratos({ m }: Props) {
  const e = m.equipo;
  return (
    <Marco id="equipo_retratos" titulo={e.titulo}>
      {(h) => (
        <>
          <div className="pg-sec-cabeza">
            {h}
            <p className="pg-sec-suave">{e.bajada}</p>
          </div>
          <div className="pg-sec-retratos">
            {e.personas.map((p) => (
              <figure key={p.nombre}>
                {/* Sin foto todavía: las iniciales ocupan su lugar. */}
                <span className="pg-sec-retrato" aria-hidden="true">
                  {iniciales(p.nombre)}
                </span>
                <Autor nombre={p.nombre} rol={p.rol} />
              </figure>
            ))}
          </div>
        </>
      )}
    </Marco>
  );
}

function EquipoLista({ m }: Props) {
  const e = m.equipo;
  return (
    <Marco id="equipo_lista" titulo={e.titulo}>
      {(h) => (
        <>
          {h}
          <ul className="pg-sec-renglones pg-sec-creditos">
            {e.personas.map((p) => (
              <li key={p.nombre}>
                <span className="pg-sec-grande">{p.nombre}</span>
                <span className="pg-sec-suave">{p.rol}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </Marco>
  );
}

function Numeros({ id, m }: Props & { id: 'numeros_fila' | 'numeros_protagonista' }) {
  return (
    <Marco id={id} titulo={m.numeros.titulo} tituloOculto>
      {(h) => (
        <>
          {h}
          <dl className="pg-sec-cifras">
            {m.numeros.cifras.map((x) => (
              <div key={x.valor}>
                <dt className="pg-sec-suave">{x.texto}</dt>
                <dd>{x.valor}</dd>
              </div>
            ))}
          </dl>
        </>
      )}
    </Marco>
  );
}

function ContactoFormulario({ c, m }: Props) {
  const x = m.contacto;
  const id = useId();
  const [enviado, setEnviado] = useState(false);
  const enviar = (e: FormEvent) => {
    e.preventDefault();
    setEnviado(true);
  };
  return (
    <Marco id="contacto_formulario" titulo={x.titulo}>
      {(h) => (
        <div className="pg-sec-dos">
          <div className="pg-sec-quien">
            {h}
            <p className="pg-sec-suave">{x.bajada}</p>
            <address>
              <span>{x.direccion}</span>
              <span>{x.horario}</span>
              <a href={`tel:${soloNumeros(x.telefono)}`}>{x.telefono}</a>
              <a href={`mailto:${x.mail}`}>{x.mail}</a>
            </address>
          </div>
          <form className="pg-card pg-sec-form" onSubmit={enviar}>
            <label htmlFor={`${id}-nombre`}>Nombre</label>
            <input id={`${id}-nombre`} name="nombre" type="text" autoComplete="name" required />
            <label htmlFor={`${id}-mail`}>Mail</label>
            <input id={`${id}-mail`} name="mail" type="email" autoComplete="email" required />
            <label htmlFor={`${id}-mensaje`}>Mensaje</label>
            <textarea id={`${id}-mensaje`} name="mensaje" rows={4} required />
            <button type="submit" className={`${claseBotonPrincipal(c)} pg-boton`}>
              <span className="bt-texto">{x.enviar}</span>
            </button>
            <p role="status" className="pg-sec-estado">
              {enviado ? `${x.enviado} (Es una muestra: no se envió nada.)` : ''}
            </p>
          </form>
        </div>
      )}
    </Marco>
  );
}

function ContactoDatos({ m }: Props) {
  const x = m.contacto;
  return (
    <Marco id="contacto_datos" titulo={x.titulo}>
      {(h) => (
        <>
          {h}
          <a className="pg-sec-mail" href={`mailto:${x.mail}`}>
            {x.mail}
          </a>
          <dl className="pg-sec-datos">
            <div>
              <dt className="pg-sec-suave">Dónde</dt>
              <dd>
                <address>{x.direccion}</address>
              </dd>
            </div>
            <div>
              <dt className="pg-sec-suave">Cuándo</dt>
              <dd>{x.horario}</dd>
            </div>
            <div>
              <dt className="pg-sec-suave">Teléfono</dt>
              <dd>
                <a href={`tel:${soloNumeros(x.telefono)}`}>{x.telefono}</a>
              </dd>
            </div>
          </dl>
        </>
      )}
    </Marco>
  );
}

const DIBUJAR: Record<SeccionDisenoId, (p: Props) => ReactNode> = {
  beneficios_renglones: (p) => <BeneficiosRenglones {...p} />,
  beneficios_destacado: (p) => <BeneficiosDestacado {...p} />,
  pasos_fila: (p) => <Pasos id="pasos_fila" {...p} />,
  pasos_escalera: (p) => <Pasos id="pasos_escalera" {...p} />,
  precios_planes: (p) => <PreciosPlanes {...p} />,
  precios_tabla: (p) => <PreciosTabla {...p} />,
  testimonios_cita: (p) => <TestimoniosCita {...p} />,
  testimonios_tres: (p) => <TestimoniosTres {...p} />,
  preguntas_acordeon: (p) => <PreguntasAcordeon {...p} />,
  preguntas_abiertas: (p) => <PreguntasAbiertas {...p} />,
  equipo_retratos: (p) => <EquipoRetratos {...p} />,
  equipo_lista: (p) => <EquipoLista {...p} />,
  numeros_fila: (p) => <Numeros id="numeros_fila" {...p} />,
  numeros_protagonista: (p) => <Numeros id="numeros_protagonista" {...p} />,
  contacto_formulario: (p) => <ContactoFormulario {...p} />,
  contacto_datos: (p) => <ContactoDatos {...p} />,
};

/** Las secciones que esta config dibuja: las elegidas, si su tipo de proyecto las lleva. */
export function seccionesDe(c: Config): SeccionDisenoId[] {
  return llevaSecciones(c.proyecto.tipo) ? (c.visual.secciones ?? []).filter((id) => id in DISENOS_SECCION) : [];
}

/** Las secciones elegidas, en orden. No dibuja nada si no hay ninguna o el tipo de proyecto no las lleva. */
export function Secciones({ c, k }: { c: Config; k: Contenido }) {
  const ids = seccionesDe(c);
  if (!ids.length || !llevaSecciones(c.proyecto.tipo)) return null;
  const m = CONTENIDO_SECCIONES[c.proyecto.tipo];
  return (
    <div className="pg-secciones">
      {ids.map((id) => (
        <Fragment key={seccionDe(id)}>{DIBUJAR[id]({ c, k, m })}</Fragment>
      ))}
    </div>
  );
}

