// Paso final del modo rápido: un prototipo que funciona con TODO lo elegido, para ver si combina.
// Cada elemento se puede cambiar ahí mismo (modo edición) antes de descargar el archivo.

import { usePaso } from './BarraPasos';
import { createContext, useContext, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { BOTONES } from '../botones-disenos';
import { CAJAS, clasesDeCaja, paramsDe } from '../cajas';
import { APARICIONES, CAMBIOS, COMBINACIONES, MOVIMIENTOS, FUENTES, PALETAS } from '../catalogo';
import { BotonPrincipal } from '../componentes/BotonPrincipal';
import { ESTILOS } from '../estilos-visuales';
import { conPaletaAlterna, paletaActiva, sistemaDeDiseno } from '../export/sistema';
import { CATEGORIAS, type CategoriaId, DISENO_INICIAL } from '../galeria';
import { claseDe, GaleriaContexto, reanimar } from '../galeria/base';
import { Grafico } from '../galeria/datos';
import { Icono } from '../galeria/iconos';
import { aplicarMovimiento } from '../estado';
import type { AparicionId, BotonDisenoId, CajaPresetId, CambioId, MovimientoId, Config, EstiloId, PaletaId } from '../tipos';
import { aplicarCombinacion } from './combinar';
import { baseDesdeColores, derivarRoles, hexesDeTexto } from '../color';
import { COLORES } from './PanelBotones';
import { Pagina } from './Pagina';
import { TEXTOS_PROTOTIPO } from './textos-prototipo';

/** ¿Se está viendo desde un teléfono? */
const enTelefono = () => {
  try {
    return window.matchMedia('(max-width: 600px)').matches;
  } catch {
    return false;
  }
};

/** Tamaño real del teléfono con su marco (pantalla de 390 × 844 y 12px de borde). */
const TEL_ANCHO = 414;
const TEL_ALTO = 868;

type Pantalla = 'portada' | 'explorar' | 'crear' | 'panel' | 'ayuda';
const PANTALLAS: { id: Pantalla; nombre: string; icono: string }[] = [
  { id: 'portada', nombre: 'Portada', icono: 'inicio' },
  { id: 'explorar', nombre: 'Explorar', icono: 'buscar' },
  { id: 'crear', nombre: 'Crear', icono: 'mas' },
  { id: 'panel', nombre: 'Panel', icono: 'grafico' },
  { id: 'ayuda', nombre: 'Ayuda', icono: 'perfil' },
];

/** Qué se puede cambiar desde el modo edición. */
type Editable = CategoriaId | 'boton' | 'caja' | 'paleta' | 'tipografia' | 'estilo' | 'cambio' | 'color_boton' | 'movimiento' | 'aparicion';
const NOMBRES_EXTRA: Record<Exclude<Editable, CategoriaId>, string> = {
  boton: 'Botón principal',
  caja: 'Cajas',
  paleta: 'Colores',
  tipografia: 'Tipografía',
  estilo: 'Estilo visual',
  cambio: 'Cambio de pantalla',
  movimiento: 'Ritmo general',
  aparicion: 'Cómo aparece el contenido',
  color_boton: 'Color de los botones',
};
const nombreDe = (e: Editable) => (e in NOMBRES_EXTRA ? NOMBRES_EXTRA[e as keyof typeof NOMBRES_EXTRA] : CATEGORIAS[e as CategoriaId].nombre);

interface Proto {
  c: Config;
  cl: (cat: CategoriaId) => string;
  editando: boolean;
  abierto: Editable | null;
  editar: (e: Editable) => void;
}
const ProtoContexto = createContext<Proto | null>(null);
const useProto = () => useContext(ProtoContexto)!;

/** Envuelve un elemento: en modo edición muestra un lápiz para cambiarlo. */
function Zona({ e, children, clase = '' }: { e: Editable; children: ReactNode; clase?: string }) {
  const { editando, abierto, editar } = useProto();
  return (
    <div className={`proto-zona ${editando ? 'editando' : ''} ${abierto === e ? 'marcada' : ''} ${clase}`}>
      {editando && (
        <button type="button" className="proto-lapiz" onClick={() => editar(e)} aria-label={`Cambiar ${nombreDe(e).toLowerCase()}`}>
          ✎ {nombreDe(e)}
        </button>
      )}
      {children}
    </div>
  );
}

function Titulo({ t, sub }: { t: string; sub: string }) {
  return (
    <header className="proto-encabezado">
      <h2 className="pg-titulo proto-h">{t}</h2>
      <p className="proto-sub">{sub}</p>
    </header>
  );
}

function Botones({ principal, secundario, onPrincipal, onSecundario }: { principal: string; secundario: string; onPrincipal?: () => void; onSecundario?: () => void }) {
  const { c, cl } = useProto();
  return (
    <div className="proto-botones">
      <Zona e="boton">
        <BotonPrincipal config={c} onClick={onPrincipal}>
          {principal}
        </BotonPrincipal>
      </Zona>
      <Zona e="boton_sec">
        <button
          type="button"
          className={cl('boton_sec')}
          onClick={(ev) => {
            reanimar(ev.currentTarget, 'toque');
            onSecundario?.();
          }}
        >
          <span className="cm-ico">
            <Icono nombre="inicio" tamano={16} />
          </span>
          {secundario}
        </button>
      </Zona>
    </div>
  );
}

function Metrica({ etq, valor, cambio, meta }: { etq: string; valor: string; cambio: string; meta: string }) {
  const { cl } = useProto();
  return (
    <div className={cl('metrica')}>
      <span className="cm-m-ico">
        <Icono nombre="grafico" tamano={20} />
      </span>
      <span className="cm-m-etq">{etq}</span>
      <span className="cm-m-valor">{valor}</span>
      <span className="cm-m-cambio">{cambio}</span>
      <svg className="cm-m-spark" viewBox="0 0 120 32" aria-hidden="true">
        <polyline points="2,26 18,20 34,23 50,14 66,17 82,8 98,11 118,4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="cm-m-meta" aria-hidden="true">
        <span className="cm-m-meta-relleno" style={{ '--p': meta } as CSSProperties} />
      </span>
      <span className="cm-m-meta-txt">{meta} de la meta</span>
    </div>
  );
}

export function Prototipo(props: { config: Config; setConfig: (fn: (c: Config) => Config) => void; onAtras: () => void; onListo: () => void }) {
  const real = props.config;
  // Ver el modo opuesto (claro ↔ oscuro) sin tocar la paleta elegida.
  const [verAlterno, setVerAlterno] = useState(false);
  const c = useMemo(() => (verAlterno ? conPaletaAlterna(real) : real), [real, verAlterno]);
  const s = useMemo(() => sistemaDeDiseno(c), [c]);
  const modoBase = paletaActiva(real).modo;
  const modoOtro = modoBase === 'claro' ? 'oscuro' : 'claro';
  const T = TEXTOS_PROTOTIPO[real.proyecto.tipo];
  const nombreDePantalla = (id: Pantalla) => T.pantallas[PANTALLAS.findIndex((p) => p.id === id)];

  const [dispositivo, setDispositivo] = useState<'computadora' | 'celular'>(c.proyecto.tipo === 'app_movil' || enTelefono() ? 'celular' : 'computadora');
  const [pantalla, setPantalla] = useState<Pantalla>('portada');
  const [editando, setEditando] = useState(false);
  const [abierto, setAbierto] = useState<Editable | null>(null);
  const [aviso, setAviso] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [modal, setModal] = useState(false);
  const [plan, setPlan] = useState(0);
  const [filtro, setFiltro] = useState(0);
  const [presupuesto, setPresupuesto] = useState(40);
  const avisoRef = useRef<HTMLDivElement>(null);

  // El celular se dibuja a tamaño real (390 × 844 + marco) y se escala entero para entrar en el espacio disponible.
  const area = useRef<HTMLDivElement>(null);
  const [escala, setEscala] = useState(1);
  const [pantallaChica, setPantallaChica] = useState(enTelefono());
  useEffect(() => {
    const el = area.current;
    if (!el) return;
    const medir = () => {
      setPantallaChica(enTelefono());
      const r = el.getBoundingClientRect();
      setEscala(Math.max(0.4, Math.min(1, (r.height - 8) / TEL_ALTO, (r.width - 8) / TEL_ANCHO)));
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const d = (cat: CategoriaId) => c.componentes[cat] ?? DISENO_INICIAL[cat];
  const cl = (cat: CategoriaId) => claseDe(cat, d(cat));
  const caja = paramsDe(c);
  const cc = caja ? clasesDeCaja(caja) : 'proto-caja-base';
  const estilo = c.visual.estilo !== 'clasico' ? `estilo-${c.visual.estilo}` : '';
  const indice = PANTALLAS.findIndex((p) => p.id === pantalla);
  const lateral = /lateral/.test(d('nav_web'));

  useEffect(() => {
    if (!aviso) return;
    const t = window.setTimeout(() => setAviso(false), 4200);
    return () => window.clearTimeout(t);
  }, [aviso]);

  const guardar = () => {
    setGuardando(true);
    window.setTimeout(() => {
      setGuardando(false);
      setAviso(true);
      window.setTimeout(() => reanimar(avisoRef.current, 'cm-entra'), 0);
    }, 1300);
  };

  const editar = (e: Editable) => {
    setAbierto(e);
    setEditando(true);
  };

  // ---------- Navegación ----------

  const navMovil = (
    <Zona e="nav_movil" clase="proto-zona-nav">
      <nav className={cl('nav_movil')} style={{ '--i': indice, '--n': PANTALLAS.length } as CSSProperties} aria-label="Navegación del prototipo">
        <span className="cm-ind" aria-hidden="true" />
        {PANTALLAS.map((p) => (
          <button key={p.id} type="button" className="cm-item" aria-current={p.id === pantalla ? 'page' : undefined} onClick={() => setPantalla(p.id)}>
            <span className="cm-ico">
              <Icono nombre={p.icono} />
            </span>
            <span className="cm-lbl">{nombreDePantalla(p.id)}</span>
          </button>
        ))}
      </nav>
    </Zona>
  );
  const navWeb = (
    <Zona e="nav_web" clase={`proto-zona-nav ${lateral ? 'es-lateral' : ''}`}>
      <nav className={cl('nav_web')} style={{ '--i': indice, '--n': PANTALLAS.length } as CSSProperties} aria-label="Navegación del prototipo">
        <span className="cm-marca">{c.proyecto.nombre.trim() || 'Tu marca'}</span>
        <div className="cm-items">
          <span className="cm-ind" aria-hidden="true" />
          {PANTALLAS.map((p) => (
            <button key={p.id} type="button" className="cm-item" aria-current={p.id === pantalla ? 'page' : undefined} onClick={() => setPantalla(p.id)}>
              <span className="cm-ico">
                <Icono nombre={p.icono} tamano={18} />
              </span>
              <span className="cm-lbl">{nombreDePantalla(p.id)}</span>
            </button>
          ))}
        </div>
      </nav>
    </Zona>
  );

  // ---------- Piezas ----------




  // ---------- Pantallas ----------

  const contenido: Record<Pantalla, ReactNode> = {
    portada: (
      <div className="proto-portada">
        <Zona e="estilo" clase="proto-zona-portada">
          <Pagina config={c} />
        </Zona>
        <Zona e="pie">
          <CATEGORIAS.pie.Muestra clase={cl('pie')} id={d('pie')} />
        </Zona>
      </div>
    ),
    panel: (
      <div className="proto-pantalla">
        <Titulo t={T.panel.titulo} sub={T.panel.sub} />
        <Botones principal={T.panel.principal} secundario={T.panel.secundario} />
        <Zona e="metrica" clase="proto-fila">
          {T.panel.metricas.map((m) => (
            <Metrica key={m.etq} {...m} />
          ))}
        </Zona>
        <div className="proto-dos">
          <div className={cc}>
            <Zona e="grafico">
              <Grafico clase={cl('grafico')} id={d('grafico')} titulo={T.panel.grafico} />
            </Zona>
          </div>
          <div className={cc}>
            <Zona e="tabla">
              <CATEGORIAS.tabla.Muestra clase={cl('tabla')} id={d('tabla')} />
            </Zona>
          </div>
        </div>
      </div>
    ),
    explorar: (
      <div className="proto-pantalla">
        <Zona e="migas">
          <CATEGORIAS.migas.Muestra clase={cl('migas')} id={d('migas')} />
        </Zona>
        <Titulo t={T.explorar.titulo} sub={T.explorar.sub} />
        <div className="proto-filtros">
          <Zona e="campo" clase="proto-crece">
            <div className={cl('campo')}>
              <label htmlFor="proto-buscar" className="cm-etq">
                Buscar
              </label>
              <div className="cm-caja">
                <span className="cm-icono">
                  <Icono nombre="buscar" tamano={18} />
                </span>
                <input id="proto-buscar" type="search" placeholder={T.explorar.buscar} onInput={(e) => reanimar(e.currentTarget.parentElement, 'escribiendo')} />
                <span className="cm-linea" aria-hidden="true" />
              </div>
            </div>
          </Zona>
          <Zona e="selector">
            <div className={cl('selector')} role="radiogroup" aria-label="Filtrar" style={{ '--i': filtro, '--n': 3 } as CSSProperties}>
              <span className="cm-ind" aria-hidden="true" />
              {T.explorar.filtros.map((o, j) => (
                <button key={o} type="button" role="radio" aria-checked={j === filtro} onClick={() => setFiltro(j)}>
                  {o}
                </button>
              ))}
            </div>
          </Zona>
        </div>
        <Zona e="etiqueta" clase="proto-etiquetas">
          {T.explorar.temas.map((t) => (
            <span key={t} className={cl('etiqueta')}>
              {t}
            </span>
          ))}
        </Zona>
        <Zona e="carrusel">
          <CATEGORIAS.carrusel.Muestra clase={cl('carrusel')} id={d('carrusel')} />
        </Zona>
        <Zona e="caja" clase="proto-grilla">
          {T.explorar.items.map(([t, etq], i) => (
            <article key={t} className={cc}>
              <div className="proto-tarjeta-cabeza">
                <span className={cl('etiqueta')}>{etq}</span>
                <button type="button" className={cl('boton_icono')} aria-label={`Guardar ${t}`} onClick={(e) => {
                  e.currentTarget.toggleAttribute('data-activo');
                  reanimar(e.currentTarget, 'toque');
                }}>
                  <Icono nombre="corazon" tamano={20} />
                </button>
              </div>
              <h3 className="proto-tarjeta-titulo">{t.split(' · ')[0]}</h3>
              {t.includes(' · ') && <strong className="proto-precio">{t.split(' · ')[1]}</strong>}
              <p className="proto-tarjeta-texto">{T.explorar.texto}</p>
              {i === 1 && (
                <div className={cl('progreso')} style={{ '--p': '45%' } as CSSProperties}>
                  <div className="cm-etq">
                    <span>{T.explorar.progreso}</span>
                    <span>45%</span>
                  </div>
                  <div className="cm-pista" role="progressbar" aria-valuenow={45} aria-valuemin={0} aria-valuemax={100} aria-label={T.explorar.progreso}>
                    <span className="cm-relleno" />
                  </div>
                </div>
              )}
              <div className={cl('avatar')}>
                {['AL', 'MR'].map((x) => (
                  <span key={x} className="cm-av">
                    {x}
                  </span>
                ))}
                <span className="cm-av cm-mas">+{i + 2}</span>
              </div>
            </article>
          ))}
        </Zona>
        <Zona e="paginacion">
          <CATEGORIAS.paginacion.Muestra clase={cl('paginacion')} id={d('paginacion')} />
        </Zona>
        <div className="proto-editables-sueltos">
          <Zona e="boton_icono">
            <span className="proto-nota">Botones de icono</span>
          </Zona>
          <Zona e="progreso">
            <span className="proto-nota">Barra de progreso</span>
          </Zona>
          <Zona e="avatar">
            <span className="proto-nota">Avatares</span>
          </Zona>
        </div>
      </div>
    ),
    crear: (
      <div className="proto-pantalla">
        <Titulo t={T.crear.titulo} sub={T.crear.sub} />
        <Zona e="pasos">
          <CATEGORIAS.pasos.Muestra clase={cl('pasos')} id={d('pasos')} />
        </Zona>
        <form className={`${cc} proto-form`} onSubmit={(e) => e.preventDefault()}>
          <Zona e="campo" clase="proto-dos-campos">
            {[
              ['Nombre', 'Ana López', 'text'],
              ['Email', 'ana@ejemplo.com', 'email'],
            ].map(([etq, ph, t]) => (
              <div key={etq} className={cl('campo')}>
                <label htmlFor={`proto-${etq}`} className="cm-etq">
                  {etq}
                </label>
                <div className="cm-caja">
                  <span className="cm-icono">
                    <Icono nombre={t === 'email' ? 'correo' : 'perfil'} tamano={18} />
                  </span>
                  <input id={`proto-${etq}`} type={t} placeholder={ph} onInput={(e) => reanimar(e.currentTarget.parentElement, 'escribiendo')} />
                  <span className="cm-linea" aria-hidden="true" />
                </div>
                <span className="cm-ayuda">{etq === 'Email' ? 'Nunca lo compartimos.' : 'Como querés que te llamemos.'}</span>
              </div>
            ))}
          </Zona>
          <Zona e="selector">
            <div className={`${cl('selector')} cm-grande`} role="radiogroup" aria-label="Plan" style={{ '--i': plan, '--n': 2 } as CSSProperties}>
              <span className="cm-ind" aria-hidden="true" />
              {T.crear.plan.map((o, j) => (
                <button key={o} type="button" role="radio" aria-checked={j === plan} onClick={() => setPlan(j)}>
                  {o}
                </button>
              ))}
            </div>
          </Zona>
          <Zona e="calendario">
            <CATEGORIAS.calendario.Muestra clase={cl('calendario')} id={d('calendario')} />
          </Zona>
          <Zona e="deslizador">
            <div className={cl('deslizador')} style={{ '--valor': `${presupuesto}%` } as CSSProperties}>
              <label htmlFor="proto-presupuesto" className="cm-etq">
                <span>{T.crear.rango}</span>
                <output htmlFor="proto-presupuesto">{/presupuesto|propina|descuento/i.test(T.crear.rango) ? (/descuento/i.test(T.crear.rango) ? `${Math.round(presupuesto / 2)}%` : `$ ${presupuesto * 1000}`) : presupuesto}</output>
              </label>
              <input id="proto-presupuesto" type="range" min={0} max={100} value={presupuesto} onChange={(e) => setPresupuesto(+e.target.value)} />
            </div>
          </Zona>
          <div className="proto-dos-campos">
            <Zona e="interruptor">
              <label className={cl('interruptor')}>
                <input type="checkbox" role="switch" defaultChecked />
                <span className="cm-pista" aria-hidden="true">
                  <span className="cm-perilla" />
                </span>
                <span className="cm-txt">Recibir avisos</span>
              </label>
            </Zona>
            <Zona e="casilla">
              <label className={cl('casilla')}>
                <input type="checkbox" />
                <span className="cm-marca" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </span>
                <span className="cm-txt">Acepto los términos</span>
              </label>
            </Zona>
          </div>
          <div className="proto-acciones">
            {guardando ? (
              <Zona e="cargando">
                <div className={cl('cargando')} role="status" aria-label="Guardando">
                  <span />
                  <span />
                  <span />
                </div>
              </Zona>
            ) : (
              <Botones principal={T.crear.principal} secundario={T.crear.secundario} onPrincipal={guardar} onSecundario={() => setModal(true)} />
            )}
          </div>
        </form>
        <div className="proto-editables-sueltos">
          <Zona e="cargando">
            <span className="proto-nota">Carga (aparece al guardar)</span>
          </Zona>
          <Zona e="aviso">
            <span className="proto-nota">Aviso (aparece después)</span>
          </Zona>
          <Zona e="modal">
            <span className="proto-nota">Ventana (al eliminar)</span>
          </Zona>
        </div>
        <div className="proto-form-completo">
          <span className="proto-nota">Así se ve un formulario completo para cargar datos</span>
          <Zona e="formulario">
            <CATEGORIAS.formulario.Muestra clase={cl('formulario')} id={d('formulario')} />
          </Zona>
        </div>
      </div>
    ),
    ayuda: (
      <div className="proto-pantalla">
        <Titulo t="Ayuda" sub="Preguntas frecuentes y contacto." />
        <div className="proto-dos">
          <Zona e="acordeon">
            <div className={cl('acordeon')}>
              {T.ayuda.faqs.map(([p, r], i) => (
                <details key={p} open={i === 0}>
                  <summary>{p}</summary>
                  <div className="cm-resp">{r}</div>
                </details>
              ))}
            </div>
          </Zona>
          <div className={cc}>
            <div className="proto-soporte">
              <Zona e="avatar">
                <div className={cl('avatar')}>
                  {['SO', 'PA'].map((x) => (
                    <span key={x} className="cm-av">
                      {x}
                    </span>
                  ))}
                </div>
              </Zona>
              <strong>{T.ayuda.dudas}</strong>
              <span className="proto-sub">{T.ayuda.dudasSub}</span>
              <Zona e="tooltip">
                <span className={cl('tooltip')}>
                  <button type="button" aria-describedby="proto-tip">
                    Copiar email de soporte
                  </button>
                  <span id="proto-tip" role="tooltip" className="cm-tip">
                    soporte@ejemplo.com
                  </span>
                </span>
              </Zona>
              <Botones principal="Escribir al equipo" secundario="Ver guías" />
            </div>
          </div>
        </div>
      </div>
    ),
  };

  const nombrePantalla = nombreDePantalla(pantalla);
  const appBar = (
    <div className="proto-appbar">
      <span className="proto-appbar-titulo">{pantalla === 'portada' ? c.proyecto.nombre.trim() || 'Tu marca' : nombrePantalla}</span>
      <Zona e="boton_icono" clase="proto-appbar-iconos">
        {[
          ['buscar', 'Buscar'],
          ['corazon', 'Favoritos'],
        ].map(([ic, n]) => (
          <button key={ic} type="button" className={cl('boton_icono')} aria-label={n} onClick={(ev) => {
            ev.currentTarget.toggleAttribute('data-activo');
            reanimar(ev.currentTarget, 'toque');
          }}>
            <Icono nombre={ic} tamano={20} />
          </button>
        ))}
      </Zona>
    </div>
  );

  const pantallaActual = (
    <>
    <div className="proto-escena">
      {dispositivo === 'celular' && appBar}
      <div key={`${pantalla}-${c.visual.cambio}-${c.visual.aparicion}-${c.visual.movimiento}`} className={`proto-contenido proto-cambio-${c.visual.cambio} proto-aparicion-${c.visual.aparicion}`}>
        {contenido[pantalla]}
      </div>
    </div>
      {aviso && (
        <div className="proto-aviso-lugar">
          <div ref={avisoRef} className={`${cl('aviso')} cm-entra`} role="status">
            <span className="cm-aviso-ico">
              <Icono nombre="check" tamano={18} />
            </span>
            <span className="cm-aviso-texto">
              <strong>Guardado</strong>
              <span>Tus datos se guardaron bien.</span>
            </span>
            <button type="button" className="cm-aviso-x" aria-label="Cerrar aviso" onClick={() => setAviso(false)}>
              ×
            </button>
          </div>
        </div>
      )}
      {modal && (
        <div className={`${cl('modal')} proto-modal`}>
          <div className="cm-fondo-modal" onClick={() => setModal(false)} />
          <div className="cm-ventana cm-entra" role="dialog" aria-modal="true" aria-label="Confirmar">
            <span className="cm-ventana-ico" aria-hidden="true">
              <Icono nombre="corazon" tamano={20} />
            </span>
            <strong>¿Eliminar este borrador?</strong>
            <span className="cm-ventana-txt">No se puede deshacer.</span>
            <span className="cm-ventana-acciones">
              <button type="button" onClick={() => setModal(false)} autoFocus>
                Cancelar
              </button>
              <button type="button" className="cm-primario" onClick={() => setModal(false)}>
                Eliminar
              </button>
            </span>
          </div>
        </div>
      )}
    </>
  );

  return (
    <GaleriaContexto.Provider value={c}>
      <ProtoContexto.Provider value={{ c, cl, editando, abierto, editar }}>
      <div className="proto">
        <header className="proto-barra">
          <div className="proto-barra-titulo">
            <span className="proto-paso">{usePaso()}</span>
            <h1>Tu prototipo</h1>
          </div>
          <p className="proto-ayuda">Usalo como si fuera tu app: navegá, escribí, tocá. Si algo no te convence, activá «Editar» y cambialo ahí mismo.</p>
          <div className="segmentado proto-seg" role="group" aria-label="Dispositivo">
            {(['computadora', 'celular'] as const).map((x) => (
              <button key={x} type="button" aria-pressed={dispositivo === x} onClick={() => setDispositivo(x)}>
                {x === 'computadora' ? 'Computadora' : 'Celular'}
              </button>
            ))}
          </div>
          <div className="proto-modos">
            <div className="segmentado proto-seg" role="group" aria-label="Modo de color">
              {([modoBase, modoOtro] as const).map((m, i) => (
                <button key={m} type="button" aria-pressed={verAlterno === (i === 1)} onClick={() => setVerAlterno(i === 1)}>
                  {m === 'claro' ? '☀ Claro' : '☾ Oscuro'}
                </button>
              ))}
            </div>
            <label className="proto-ambos">
              <input
                type="checkbox"
                checked={real.visual.ambosModos}
                onChange={(e) => props.setConfig((x) => ({ ...x, visual: { ...x.visual, ambosModos: e.target.checked } }))}
              />
              Incluir el modo {modoOtro} en el archivo
            </label>
          </div>
          <button type="button" className={`proto-editar ${editando ? 'activo' : ''}`} aria-pressed={editando} onClick={() => { setEditando(!editando); if (editando) setAbierto(null); }}>
            {editando ? 'Listo' : '✎ Editar'}
          </button>
        </header>

        <div className="proto-cuerpo">
          <div className="proto-area" ref={area}>
            <div
              className={dispositivo === 'celular' && !pantallaChica ? 'proto-tel-hueco' : 'proto-sin-hueco'}
              style={dispositivo === 'celular' && !pantallaChica ? { width: TEL_ANCHO * escala, height: TEL_ALTO * escala } : undefined}
            >
            <div
              className={`proto-marco proto-${dispositivo} pg ${estilo} ${dispositivo === 'computadora' && lateral ? 'con-lateral' : ''} ${pantallaChica ? 'en-telefono' : ''}`}
              data-dispositivo={dispositivo}
              style={{ ...(s.tokens as CSSProperties), ...(dispositivo === 'celular' && !pantallaChica ? { transform: `scale(${escala})` } : {}) }}
            >
              {dispositivo === 'computadora' ? (
                <>
                  {navWeb}
                  {pantallaActual}
                </>
              ) : (
                <>
                  <div className="proto-estado" aria-hidden="true">
                    <span className="proto-hora">9:41</span>
                    <span className="proto-isla" />
                    <span className="proto-indicadores">
                      <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5" width="3" height="7" rx="1" /><rect x="10" y="2.5" width="3" height="9.5" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
                      <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1.5 4.5a9.5 9.5 0 0 1 13 0M4 7.3a6 6 0 0 1 8 0M6.6 10a2.4 2.4 0 0 1 2.8 0" /></svg>
                      <svg width="26" height="12" viewBox="0 0 26 12" fill="none"><rect x="0.75" y="0.75" width="21.5" height="10.5" rx="3" stroke="currentColor" strokeWidth="1.5" opacity=".5" /><rect x="2.5" y="2.5" width="16" height="7" rx="1.6" fill="currentColor" /><rect x="23.5" y="4" width="1.8" height="4" rx=".9" fill="currentColor" opacity=".5" /></svg>
                    </span>
                  </div>
                  {pantallaActual}
                  {navMovil}
                  <span className="proto-inicio" aria-hidden="true" />
                </>
              )}
            </div>
            </div>
          </div>

          {editando && (
            <aside className="proto-editor" aria-label="Cambiar elementos">
              <Editor config={real} setConfig={props.setConfig} abierto={abierto} setAbierto={setAbierto} />
            </aside>
          )}
        </div>

        <footer className="proto-pie">
          <button type="button" className="pb-pie-atras proto-btn-claro" onClick={props.onAtras}>
            Volver
          </button>
          <span className="proto-pie-texto">¿Te convence cómo funciona todo junto?</span>
          <button type="button" className="proto-btn-final" onClick={props.onListo}>
            Me convence: descargar
          </button>
        </footer>
      </div>
      </ProtoContexto.Provider>
    </GaleriaContexto.Provider>
  );
}

// ---------- Editor lateral ----------

const GRUPOS: { nombre: string; items: Editable[] }[] = [
  { nombre: 'General', items: ['estilo', 'paleta', 'tipografia'] },
  { nombre: 'Movimiento', items: ['movimiento', 'aparicion', 'cambio'] },
  { nombre: 'Botones', items: ['boton', 'color_boton', 'boton_sec', 'boton_icono'] },
  { nombre: 'Contenedores', items: ['caja', 'metrica', 'grafico', 'tabla'] },
  { nombre: 'Formularios', items: ['formulario', 'acceso', 'campo', 'selector', 'desplegable', 'buscador', 'calendario', 'interruptor', 'casilla', 'deslizador', 'subir'] },
  { nombre: 'Navegación', items: ['nav_web', 'nav_movil', 'migas', 'paginacion', 'pasos', 'notificaciones', 'usuario', 'pie'] },
  { nombre: 'Detalles', items: ['etiqueta', 'aviso', 'cargando', 'progreso', 'acordeon', 'avatar', 'tooltip', 'modal', 'vacio', 'carrusel', 'producto'] },
];

function Editor(props: { config: Config; setConfig: (fn: (c: Config) => Config) => void; abierto: Editable | null; setAbierto: (e: Editable | null) => void }) {
  const c = props.config;
  const set = props.setConfig;
  const e = props.abierto;

  let opciones: { id: string; nombre: string; descripcion?: string; muestras?: string[] }[] = [];
  let actual = '';
  let elegir: (id: string) => void = () => {};
  if (e === 'boton') {
    opciones = (Object.keys(BOTONES) as BotonDisenoId[]).map((id) => ({ id, nombre: BOTONES[id].nombre, descripcion: BOTONES[id].descripcion }));
    actual = c.botones.diseno;
    elegir = (id) => set((x) => ({ ...x, botones: { ...x.botones, diseno: id as BotonDisenoId } }));
  } else if (e === 'caja') {
    opciones = (Object.keys(CAJAS) as CajaPresetId[]).map((id) => ({ id, nombre: CAJAS[id].nombre, descripcion: CAJAS[id].descripcion }));
    actual = c.cajas.preset;
    elegir = (id) => set((x) => ({ ...x, cajas: { preset: id as CajaPresetId, ajustes: {} } }));
  } else if (e === 'paleta') {
    opciones = (Object.keys(PALETAS) as PaletaId[]).map((id) => {
      const r = PALETAS[id].roles;
      return { id, nombre: PALETAS[id].nombre, descripcion: `Modo ${PALETAS[id].modo}`, muestras: [r.fondo, r.superficie, r.acento, r.texto] };
    });
    actual = c.visual.paleta;
    elegir = (id) => set((x) => ({ ...x, visual: { ...x.visual, paleta: id as PaletaId } }));
  } else if (e === 'tipografia') {
    opciones = COMBINACIONES.map((x, i) => ({ id: String(i), nombre: x.nombre, descripcion: `${FUENTES[x.titulos].nombre} + ${FUENTES[x.texto].nombre}` }));
    actual = String(COMBINACIONES.findIndex((x) => x.titulos === c.visual.fuenteTitulos && x.texto === c.visual.fuenteTexto));
    elegir = (id) => set((x) => ({ ...x, visual: { ...x.visual, fuenteTitulos: COMBINACIONES[+id].titulos, fuenteTexto: COMBINACIONES[+id].texto } }));
  } else if (e === 'estilo') {
    opciones = [{ id: 'clasico', nombre: 'Clásico', descripcion: 'Sin estilo especial' }, ...(Object.keys(ESTILOS) as EstiloId[]).map((id) => ({ id, nombre: ESTILOS[id].nombre, descripcion: ESTILOS[id].descripcion }))];
    actual = c.visual.estilo;
    elegir = (id) =>
      set((x) => {
        if (id === 'clasico') return { ...x, visual: { ...x.visual, estilo: 'clasico' } };
        const es = ESTILOS[id as EstiloId];
        // Cambiar el estilo trae sus colores y letras, pero respeta el botón y las cajas que ya elegiste.
        const y = aplicarCombinacion(x, { estilo: id as EstiloId, layout: x.visual.layout, paleta: es.paletas[0], titulos: es.fuentes[0][0], texto: es.fuentes[0][1] });
        return { ...y, botones: x.botones };
      });
  } else if (e === 'cambio') {
    opciones = (Object.keys(CAMBIOS) as CambioId[]).map((id) => ({ id, nombre: CAMBIOS[id].nombre, descripcion: CAMBIOS[id].descripcion }));
    actual = c.visual.cambio;
    elegir = (id) => set((x) => ({ ...x, visual: { ...x.visual, cambio: id as CambioId } }));
  } else if (e === 'movimiento') {
    opciones = (Object.keys(MOVIMIENTOS) as MovimientoId[]).map((id) => ({ id, nombre: MOVIMIENTOS[id].nombre, descripcion: MOVIMIENTOS[id].descripcion }));
    actual = c.visual.movimiento;
    elegir = (id) => set((x) => aplicarMovimiento(x, id as MovimientoId));
  } else if (e === 'aparicion') {
    opciones = (Object.keys(APARICIONES) as AparicionId[]).map((id) => ({ id, nombre: APARICIONES[id].nombre, descripcion: APARICIONES[id].descripcion }));
    actual = c.visual.aparicion;
    elegir = (id) => set((x) => ({ ...x, visual: { ...x.visual, aparicion: id as AparicionId } }));
  } else if (e === 'color_boton') {
    const r = sistemaDeDiseno(c).paleta.roles;
    opciones = COLORES.map((x) => ({ id: x.id, nombre: x.nombre, muestras: [x.id === 'acento' ? r.acento : x.id === 'texto' ? r.texto : x.id] }));
    actual = c.botones.color;
    elegir = (id) => set((x) => ({ ...x, botones: { ...x.botones, color: id } }));
  } else if (e) {
    const cat = CATEGORIAS[e];
    opciones = Object.entries(cat.disenos).map(([id, x]) => ({ id, nombre: x.nombre, descripcion: x.descripcion }));
    actual = c.componentes[e] ?? DISENO_INICIAL[e];
    elegir = (id) => set((x) => ({ ...x, componentes: { ...x.componentes, [e]: id } }));
  }

  return (
    <div className="proto-editor-dentro">
      <label className="proto-editor-etq" htmlFor="proto-que">
        ¿Qué querés cambiar?
      </label>
      <select id="proto-que" value={e ?? ''} onChange={(ev) => props.setAbierto((ev.target.value || null) as Editable | null)}>
        <option value="">Elegí un elemento…</option>
        {GRUPOS.map((g) => (
          <optgroup key={g.nombre} label={g.nombre}>
            {g.items.map((it) => (
              <option key={it} value={it}>
                {nombreDe(it)}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      {!e && <p className="proto-editor-ayuda">También podés tocar los lápices que aparecen sobre cada elemento del prototipo.</p>}
      {e === 'paleta' && <TusColores config={c} setConfig={set} />}
      {e && (
        <ul className="proto-opciones">
          {opciones.map((o) => (
            <li key={o.id}>
              <button type="button" className="proto-opcion" aria-pressed={o.id === actual} onClick={() => elegir(o.id)}>
                <span className="proto-opcion-texto">
                  <span className="proto-opcion-nombre">{o.nombre}</span>
                  {o.descripcion && <span className="proto-opcion-desc">{o.descripcion}</span>}
                </span>
                {o.muestras && (
                  <span className="muestras" aria-hidden="true">
                    {o.muestras.map((m, i) => (
                      <span key={i} className="muestra" style={{ background: m }} />
                    ))}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Colores propios: rueda de color o códigos pegados (uno o varios). */
function TusColores({ config, setConfig }: { config: Config; setConfig: (fn: (c: Config) => Config) => void }) {
  const pp = config.visual.paletaPersonalizada;
  const [lista, setLista] = useState<string[]>(config.visual.paleta === 'personalizada' ? [pp.fondo, pp.texto, pp.acento] : ['#2F5BFF']);
  const [texto, setTexto] = useState('');
  const aplicar = (cs: string[]) => {
    setLista(cs);
    const base = baseDesdeColores(cs);
    setConfig((x) => ({ ...x, visual: { ...x.visual, paleta: 'personalizada', paletaPersonalizada: { ...base, manual: {} } } }));
  };
  const r = derivarRoles(...(Object.values(baseDesdeColores(lista)) as [string, string, string]));
  return (
    <div className="tus-colores">
      <span className="proto-editor-etq">Tus colores</span>
      <p className="proto-editor-ayuda">Elegí con la rueda o pegá tus códigos (uno o varios). El más claro va de fondo, el más oscuro de texto y el más vivo de acento.</p>
      <div className="tus-colores-fila">
        {lista.map((col, i) => (
          <span key={i} className="tus-colores-item">
            <input type="color" aria-label={`Color ${i + 1}`} value={col.toLowerCase()} onChange={(ev) => aplicar(lista.map((x, j) => (j === i ? ev.target.value.toUpperCase() : x)))} />
            {lista.length > 1 && (
              <button type="button" aria-label={`Quitar color ${i + 1}`} onClick={() => aplicar(lista.filter((_, j) => j !== i))}>
                ×
              </button>
            )}
          </span>
        ))}
        {lista.length < 5 && (
          <button type="button" className="tus-colores-mas" onClick={() => aplicar([...lista, '#FF5A1F'])}>
            + Color
          </button>
        )}
      </div>
      <div className="tus-colores-fila">
        <input
          className="tus-colores-texto"
          aria-label="Pegá tus códigos de color"
          placeholder="#1A1A2E, #E94560, #F5F5F5"
          value={texto}
          onChange={(ev) => setTexto(ev.target.value)}
        />
        <button type="button" className="tus-colores-mas" disabled={hexesDeTexto(texto).length === 0} onClick={() => aplicar(hexesDeTexto(texto).slice(0, 5))}>
          Usar
        </button>
      </div>
      <span className="muestras" aria-label="Resultado">
        {[r.fondo, r.superficie, r.acento, r.texto].map((m, i) => (
          <span key={i} className="muestra" style={{ background: m }} />
        ))}
      </span>
    </div>
  );
}
