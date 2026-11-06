// Paso final del modo rápido: un prototipo que funciona con TODO lo elegido, para ver si combina.
// Cada elemento se puede cambiar ahí mismo (modo edición) antes de descargar el archivo.

import { createContext, useContext, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { BOTONES } from '../botones-disenos';
import { CAJAS, clasesDeCaja, paramsDe } from '../cajas';
import { CAMBIOS, COMBINACIONES, FUENTES, PALETAS } from '../catalogo';
import { BotonPrincipal } from '../componentes/BotonPrincipal';
import { ESTILOS } from '../estilos-visuales';
import { sistemaDeDiseno } from '../export/sistema';
import { CATEGORIAS, type CategoriaId, DISENO_INICIAL } from '../galeria';
import { claseDe, GaleriaContexto, reanimar } from '../galeria/base';
import { Grafico } from '../galeria/datos';
import { Icono } from '../galeria/iconos';
import type { BotonDisenoId, CajaPresetId, CambioId, Config, EstiloId, PaletaId } from '../tipos';
import { aplicarCombinacion } from './combinar';
import { COLORES } from './PanelBotones';
import { Pagina } from './Pagina';

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
type Editable = CategoriaId | 'boton' | 'caja' | 'paleta' | 'tipografia' | 'estilo' | 'cambio' | 'color_boton';
const NOMBRES_EXTRA: Record<Exclude<Editable, CategoriaId>, string> = {
  boton: 'Botón principal',
  caja: 'Cajas',
  paleta: 'Colores',
  tipografia: 'Tipografía',
  estilo: 'Estilo visual',
  cambio: 'Cambio de pantalla',
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
  const c = props.config;
  const s = useMemo(() => sistemaDeDiseno(c), [c]);

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
            <span className="cm-lbl">{p.nombre}</span>
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
              <span className="cm-lbl">{p.nombre}</span>
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
      </div>
    ),
    panel: (
      <div className="proto-pantalla">
        <Titulo t="Panel" sub="Así se ven tus números del mes." />
        <Botones principal="Nueva venta" secundario="Ver reportes" />
        <Zona e="metrica" clase="proto-fila">
          <Metrica etq="Ventas del mes" valor="$ 48.230" cambio="▲ 12,4% vs. mes anterior" meta="72%" />
          <Metrica etq="Clientes nuevos" valor="128" cambio="▲ 8% vs. mes anterior" meta="64%" />
          <Metrica etq="Ticket promedio" valor="$ 3.120" cambio="▲ 3,1% vs. mes anterior" meta="81%" />
        </Zona>
        <div className="proto-dos">
          <div className={cc}>
            <Zona e="grafico">
              <Grafico clase={cl('grafico')} id={d('grafico')} titulo="Ventas de la semana" />
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
        <Titulo t="Explorar" sub="Buscá, filtrá y guardá lo que te guste." />
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
                <input id="proto-buscar" type="search" placeholder="Productos, servicios…" onInput={(e) => reanimar(e.currentTarget.parentElement, 'escribiendo')} />
                <span className="cm-linea" aria-hidden="true" />
              </div>
            </div>
          </Zona>
          <Zona e="selector">
            <div className={cl('selector')} role="radiogroup" aria-label="Filtrar" style={{ '--i': filtro, '--n': 3 } as CSSProperties}>
              <span className="cm-ind" aria-hidden="true" />
              {['Todos', 'Nuevos', 'Ofertas'].map((o, j) => (
                <button key={o} type="button" role="radio" aria-checked={j === filtro} onClick={() => setFiltro(j)}>
                  {o}
                </button>
              ))}
            </div>
          </Zona>
        </div>
        <Zona e="etiqueta" clase="proto-etiquetas">
          {['Diseño', 'Fotografía', 'Ilustración', 'Música'].map((t) => (
            <span key={t} className={cl('etiqueta')}>
              {t}
            </span>
          ))}
        </Zona>
        <Zona e="caja" clase="proto-grilla">
          {['Kit de marca', 'Sesión de fotos', 'Pack de íconos', 'Asesoría'].map((t, i) => (
            <article key={t} className={cc}>
              <div className="proto-tarjeta-cabeza">
                <span className={cl('etiqueta')}>{i === 0 ? 'Nuevo' : i === 2 ? '20% off' : 'Popular'}</span>
                <button type="button" className={cl('boton_icono')} aria-label={`Guardar ${t}`} onClick={(e) => {
                  e.currentTarget.toggleAttribute('data-activo');
                  reanimar(e.currentTarget, 'toque');
                }}>
                  <Icono nombre="corazon" tamano={20} />
                </button>
              </div>
              <h3 className="proto-tarjeta-titulo">{t}</h3>
              <p className="proto-tarjeta-texto">Todo listo para usar en tu proyecto.</p>
              {i === 1 && (
                <div className={cl('progreso')} style={{ '--p': '45%' } as CSSProperties}>
                  <div className="cm-etq">
                    <span>Cupos ocupados</span>
                    <span>45%</span>
                  </div>
                  <div className="cm-pista" role="progressbar" aria-valuenow={45} aria-valuemin={0} aria-valuemax={100} aria-label="Cupos ocupados">
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
        <Titulo t="Crear" sub="Probá el formulario: guardá para ver la carga y el aviso, o eliminá para ver la ventana." />
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
              {['Mensual', 'Anual · 2 meses gratis'].map((o, j) => (
                <button key={o} type="button" role="radio" aria-checked={j === plan} onClick={() => setPlan(j)}>
                  {o}
                </button>
              ))}
            </div>
          </Zona>
          <Zona e="deslizador">
            <div className={cl('deslizador')} style={{ '--valor': `${presupuesto}%` } as CSSProperties}>
              <label htmlFor="proto-presupuesto" className="cm-etq">
                <span>Presupuesto</span>
                <output htmlFor="proto-presupuesto">$ {presupuesto * 1000}</output>
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
              <Botones principal="Guardar" secundario="Eliminar" onPrincipal={guardar} onSecundario={() => setModal(true)} />
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
      </div>
    ),
    ayuda: (
      <div className="proto-pantalla">
        <Titulo t="Ayuda" sub="Preguntas frecuentes y contacto." />
        <div className="proto-dos">
          <Zona e="acordeon">
            <div className={cl('acordeon')}>
              {[
                ['¿Cómo cambio mi plan?', 'Desde Crear podés elegir mensual o anual cuando quieras.'],
                ['¿Puedo cancelar?', 'Sí, sin costo y en cualquier momento.'],
                ['¿Dónde veo mis ventas?', 'En el Panel, con gráficos y la tabla de pagos.'],
              ].map(([p, r], i) => (
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
              <strong>¿Seguís con dudas?</strong>
              <span className="proto-sub">El equipo responde en menos de una hora.</span>
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

  const nombrePantalla = PANTALLAS.find((x) => x.id === pantalla)?.nombre ?? '';
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
      <div key={`${pantalla}-${c.visual.cambio}`} className={`proto-contenido proto-cambio-${c.visual.cambio}`}>
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
            <span className="proto-paso">Último paso</span>
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
              <Editor config={c} setConfig={props.setConfig} abierto={abierto} setAbierto={setAbierto} />
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
  { nombre: 'General', items: ['estilo', 'paleta', 'tipografia', 'cambio'] },
  { nombre: 'Botones', items: ['boton', 'color_boton', 'boton_sec', 'boton_icono'] },
  { nombre: 'Contenedores', items: ['caja', 'metrica', 'grafico', 'tabla'] },
  { nombre: 'Formularios', items: ['campo', 'selector', 'interruptor', 'casilla', 'deslizador'] },
  { nombre: 'Navegación', items: ['nav_web', 'nav_movil'] },
  { nombre: 'Detalles', items: ['etiqueta', 'aviso', 'cargando', 'progreso', 'acordeon', 'avatar', 'tooltip', 'modal'] },
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
