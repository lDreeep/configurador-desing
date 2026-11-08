import { useEffect, useId, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { DECISIONES_UI, GRUPOS_UI, IDS_DECISIONES, normalizarDecisiones, type DecisionId } from '../decisiones';
import { clasesDecisiones } from '../export/decisiones';
import { sistemaDeDiseno } from '../export/sistema';
import type { PropsPaso } from './pasos';

// Imagen vectorial propia, local: el panel funciona sin servicios de imágenes externos.
const FOTO = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="#dce8df"/><circle cx="590" cy="140" r="68" fill="#f2c375"/><path d="M0 480L250 170 510 480Z" fill="#658578"/><path d="M240 600L580 230 800 500V600Z" fill="#355b50"/><path d="M0 500Q200 430 400 540T800 500V600H0Z" fill="#a8c6bb"/></svg>')}`;

export function PasoSistema({ config, setConfig }: PropsPaso) {
  const d = normalizarDecisiones(config.decisiones);
  const [grupo, setGrupo] = useState<string>(GRUPOS_UI[0]);
  const [buscar, setBuscar] = useState('');
  const [celular, setCelular] = useState(false);
  const [email, setEmail] = useState('');
  const [tocado, setTocado] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [progreso, setProgreso] = useState<number | null>(null);
  const [guardado, setGuardado] = useState(false);
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  useEffect(() => setSeleccionados([]), [d.seleccion]);
  const id = useId();
  const errorRef = useRef<HTMLDivElement>(null);
  const controlesRef = useRef<HTMLDivElement>(null);
  const muestraRef = useRef<HTMLElement>(null);
  const cargando = progreso !== null;
  const invalido = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const mostrarError = invalido && (enviado || (d.validacion === 'salir' && tocado) || (d.validacion === 'escribir' && (tocado || enviado)));
  const s = sistemaDeDiseno(config);
  const opciones = IDS_DECISIONES.filter(k => buscar.trim() ? `${DECISIONES_UI[k].nombre} ${DECISIONES_UI[k].ayuda} ${DECISIONES_UI[k].opciones.map(o => o.nombre).join(' ')}`.toLocaleLowerCase('es').includes(buscar.trim().toLocaleLowerCase('es')) : DECISIONES_UI[k].grupo === grupo);
  const cambiar = (k: DecisionId, v: string) => setConfig(c => ({ ...c, decisiones: { ...normalizarDecisiones(c.decisiones), [k]: v } }));
  useEffect(() => { setTocado(false); setEnviado(false); }, [d.validacion]);
  useEffect(() => {
    if (progreso === null) return;
    if (progreso >= 100) { setProgreso(null); setGuardado(true); return; }
    const t = window.setTimeout(() => setProgreso(n => n === null ? null : n + 20), 180);
    return () => window.clearTimeout(t);
  }, [progreso]);
  const guardar = (e: FormEvent) => {
    e.preventDefault(); setEnviado(true); setGuardado(false);
    if (invalido) { window.requestAnimationFrame(() => { if (d.errores === 'resumen') errorRef.current?.focus(); else document.getElementById(`${id}-email`)?.focus(); }); return; }
    setProgreso(0);
  };
  const demo = (
    <div className={`du-muestra ${clasesDecisiones(d)}`} style={s.tokens as CSSProperties}>
      <header className="du-encabezado">
        <span className="du-kicker">TU SISTEMA EN ACCIÓN</span>
        <h2>Un espacio para tus ideas</h2>
        <p className="du-parrafo">Organizá tus proyectos, compartí lo que estás creando y encontrá todo en un mismo lugar. Esta muestra cambia con cada decisión.</p>
      </header>
      <div className="du-grilla">
        <section className="du-superficie" aria-labelledby={`${id}-formulario`}>
          <h3 id={`${id}-formulario`}>Tu próximo proyecto</h3>
          <form onSubmit={guardar} noValidate>
            {mostrarError && enviado && d.errores === 'resumen' && <div className="du-error" tabIndex={-1} ref={errorRef}><strong>Revisá un dato antes de continuar.</strong> <a href={`#${id}-email`}>Ingresá un email válido.</a></div>}
            <div className="du-campo"><label htmlFor={`${id}-nombre`}>Nombre del proyecto</label><input id={`${id}-nombre`} defaultValue="Mi nuevo espacio" aria-describedby={`${id}-ayuda-nombre`} /><span className="du-ayuda" id={`${id}-ayuda-nombre`}>Podés cambiarlo después.</span></div>
            <div className="du-campo"><label htmlFor={`${id}-email`}>Email de contacto</label><input id={`${id}-email`} type="email" value={email} onChange={e => { setEmail(e.target.value); setGuardado(false); }} onBlur={() => setTocado(true)} aria-invalid={mostrarError || undefined} aria-describedby={`${id}-ayuda-email${mostrarError ? ` ${id}-error-email` : ''}`} required /><span className="du-ayuda" id={`${id}-ayuda-email`}>Por ejemplo: vos@ejemplo.com</span>{mostrarError && <span className="du-error" id={`${id}-error-email`}>Revisá el email: necesita un nombre y un dominio válido.</span>}</div>
            <div className="du-acciones"><button className="du-primario" type="submit" disabled={cargando}>{cargando ? 'Guardando…' : 'Guardar proyecto'}</button><button className="du-secundario" type="button" onClick={() => { setEmail(''); setTocado(false); setEnviado(false); setGuardado(false); setProgreso(null); }}>Limpiar muestra</button></div>
            <div className="du-estado-carga" role="status" aria-live="polite">{cargando && <>{d.carga === 'spinner' && <span className="du-spinner" aria-hidden="true" />}Guardando tu proyecto… {d.carga === 'progreso' && <progress aria-label="Progreso de la demostración" value={progreso ?? 0} max={100} />}</>}</div>
          </form>
        </section>
        <section className="du-superficie" aria-labelledby={`${id}-imagen`}><img className="du-foto" src={FOTO} alt="Ilustración de montañas verdes con un sol dorado" /><h3 id={`${id}-imagen`}>Una idea que crece</h3><p className="du-parrafo">El mismo contenido, con el encuadre y el ritmo que elegiste.</p></section>
      </div>
      <section className="du-superficie" aria-labelledby={`${id}-tabla`}><h3 id={`${id}-tabla`}>Proyectos recientes</h3><p className="du-ayuda">{d.seleccion === 'ninguna' ? 'Una lista para consultar.' : `${seleccionados.length} seleccionados · probá los controles de cada fila.`}</p><div className="du-tabla-area" tabIndex={d.tablaMovil === 'desplazar' ? 0 : undefined} role="region" aria-label="Lista de proyectos"><table className="du-tabla"><caption className="solo-lectores">Proyectos y su estado</caption><thead><tr>{d.seleccion !== 'ninguna' && <th scope="col">Selección</th>}<th scope="col">Proyecto</th><th scope="col">Estado</th><th scope="col">Actualizado</th></tr></thead><tbody>{['Sitio del estudio', 'Tienda de objetos', 'Agenda de turnos'].map((nombre, i) => <tr key={nombre}>{d.seleccion !== 'ninguna' && <td data-etiqueta="Elegir"><label><input type={d.seleccion === 'unica' ? 'radio' : 'checkbox'} name={`${id}-seleccion`} checked={seleccionados.includes(i)} onChange={e => setSeleccionados(actual => d.seleccion === 'unica' ? [i] : e.target.checked ? [...actual, i] : actual.filter(n => n !== i))} aria-label={`Seleccionar ${nombre}`} /></label></td>}<td data-etiqueta="Proyecto">{nombre}</td><td data-etiqueta="Estado">{i === 1 ? 'En revisión' : 'En marcha'}</td><td data-etiqueta="Actualizado">Hace {i + 1} días</td></tr>)}</tbody></table></div></section>
      <div role="status" aria-live="polite">{guardado && <div className="du-respuesta">✓ Proyecto guardado en esta demostración. <button type="button" className="du-cerrar" aria-label="Cerrar confirmación" onClick={() => setGuardado(false)}>×</button></div>}</div>
    </div>
  );
  return (
    <section className="sistema-editor" aria-labelledby={`${id}-titulo`}>
      <header className="sistema-cabecera"><span className="sistema-etiqueta">DECISIONES DE DISEÑO</span><h1 id={`${id}-titulo`}>Dale forma a toda tu interfaz</h1><p>23 decisiones, seis grupos y una muestra que podés usar. No hace falta elegir todo: «Del estilo» conserva tu sistema visual.</p></header>
      <div className="sistema-columnas">
        <div className="sistema-controles" ref={controlesRef} tabIndex={-1}><label className="sistema-buscar" htmlFor={`${id}-buscar`}>Buscar una decisión<input id={`${id}-buscar`} type="search" value={buscar} onChange={e => setBuscar(e.target.value)} placeholder="Ej.: tablas, espacio, errores…" /></label><nav className="sistema-grupos" aria-label="Grupos de decisiones">{GRUPOS_UI.map(g => <button key={g} type="button" aria-pressed={!buscar && grupo === g} onClick={() => { setGrupo(g); setBuscar(''); }}>{g} <span>{IDS_DECISIONES.filter(k => DECISIONES_UI[k].grupo === g).length}</span></button>)}</nav><button type="button" className="sistema-saltar" onClick={() => { muestraRef.current?.focus(); muestraRef.current?.scrollIntoView({ block: 'start' }); }}>Ver mi muestra ↓</button><p className="sistema-conteo" role="status">{opciones.length} decisiones {buscar ? 'encontradas' : `en ${grupo.toLowerCase()}`}</p>
          {opciones.length === 0 && <p>No encontramos esa decisión. Probá con otra palabra.</p>}
          {opciones.map(k => { const item = DECISIONES_UI[k]; return <fieldset className="sistema-decision" key={k}><legend>{item.nombre}</legend><p>{item.ayuda}</p><div className="sistema-opciones">{item.opciones.map(o => <label key={o.id} className={d[k] === o.id ? 'elegida' : ''}><input type="radio" name={`${id}-${k}`} value={o.id} checked={d[k] === o.id} onChange={() => cambiar(k, o.id)} /><span><strong>{o.nombre}</strong><small>{o.descripcion}</small></span></label>)}</div></fieldset>; })}
          <button type="button" className="sistema-restablecer" onClick={() => setConfig(c => { const actual = normalizarDecisiones(c.decisiones); for (const k of opciones) actual[k] = DECISIONES_UI[k].inicial; return { ...c, decisiones: actual }; })} disabled={!opciones.length}>Restablecer este grupo{buscar && ' de resultados'}</button>
        </div>
        <aside className="sistema-preview" ref={muestraRef} tabIndex={-1} aria-label="Muestra interactiva de tus decisiones"><div className="sistema-preview-barra"><strong>Probá tu interfaz</strong><div role="group" aria-label="Tamaño de la muestra"><button type="button" aria-pressed={!celular} onClick={() => setCelular(false)}>Escritorio</button><button type="button" aria-pressed={celular} onClick={() => setCelular(true)}>Celular</button></div></div><button type="button" className="sistema-saltar" onClick={() => { controlesRef.current?.focus(); controlesRef.current?.scrollIntoView({ block: 'start' }); }}>↑ Volver a las decisiones</button><p className="sistema-preview-ayuda">Escribí, seleccioná filas y guardá. Es una demostración: no envía datos.</p><div className={`sistema-lienzo ${celular ? 'es-celular' : ''}`}>{demo}</div></aside>
      </div>
    </section>
  );
}
