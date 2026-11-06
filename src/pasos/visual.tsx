// Pasos visuales: dirección, color, tipografía, forma, botones y movimiento.

import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import {
  APARICIONES,
  BORDES,
  CAMBIOS,
  CATEGORIAS_FUENTE,
  COMBINACIONES,
  DIRECCIONES,
  ELEVACIONES,
  ESCALAS,
  ESPACIADOS_TITULOS,
  ESTILOS_BOTON,
  FUENTES,
  HOVERS,
  MOVIMIENTOS,
  PALETAS,
  PRESIONAR,
  RADIOS,
  TAMANOS_BOTON,
  type CategoriaFuente,
} from '../catalogo';
import { derivarRoles } from '../color';
import { CampoColor, Filtros, ListaEditable, Opciones, Seccion, useAvanzado } from '../componentes/ui';
import { aplicarDireccion, aplicarMovimiento, pesoDisponible } from '../estado';
import { sistemaDeDiseno } from '../export/sistema';
import type {
  AparicionId,
  BordesId,
  BotonEstiloId,
  BotonIcono,
  BotonTamano,
  CambioId,
  Config,
  DireccionId,
  ElevacionId,
  EscalaId,
  EspaciadoTitulos,
  FuenteId,
  HoverId,
  MovimientoId,
  PaletaId,
  PresionarId,
  RadioId,
  RolColor,
} from '../tipos';
import type { PropsPaso } from './pasos';

const lista = <T extends string, V extends { nombre: string; descripcion?: string }>(reg: Record<T, V>) =>
  (Object.keys(reg) as T[]).map((id) => ({ id, nombre: reg[id].nombre, descripcion: reg[id].descripcion }));

const setVisual = (setConfig: PropsPaso['setConfig'], cambio: Partial<Config['visual']>) =>
  setConfig((x) => ({ ...x, visual: { ...x.visual, ...cambio } }));

export function IconoFlecha() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** Mini vista previa con los tokens de una config (opcionalmente modificada). */
function Mini({ config, cambio, clase = '', children }: { config: Config; cambio?: (c: Config) => Config; clase?: string; children: ReactNode }) {
  const c = cambio ? cambio(config) : config;
  const s = sistemaDeDiseno(c);
  return (
    <span className={`mini-pv pv-hover-${c.visual.hover} pv-presionar-${c.visual.presionar} ${clase}`} style={s.tokens as CSSProperties}>
      {children}
    </span>
  );
}

function MiniBoton({ config, cambio, texto = 'Reservar' }: { config: Config; cambio?: (c: Config) => Config; texto?: string }) {
  const c = cambio ? cambio(config) : config;
  return (
    <Mini config={config} cambio={cambio}>
      <span className={`pv-boton pv-primario est-${c.botones.estilo}`}>
        {c.botones.icono === 'izquierda' && <IconoFlecha />}
        {texto}
        {c.botones.icono === 'derecha' && <IconoFlecha />}
      </span>
    </Mini>
  );
}

// ---------- Dirección ----------

export function PasoDireccion({ config: c, setConfig }: PropsPaso) {
  return (
    <Seccion
      titulo="¿Qué sensación querés transmitir?"
      ayuda="La dirección propone color, tipografía, forma, botones y movimiento que combinan. Después ajustás cada uno."
    >
      <Opciones<DireccionId>
        etiqueta="Dirección"
        opciones={(Object.keys(DIRECCIONES) as DireccionId[]).map((id) => {
          const d = DIRECCIONES[id];
          const r = PALETAS[d.paleta].roles;
          return {
            id,
            nombre: d.nombre,
            descripcion: d.descripcion,
            fuente: FUENTES[d.fuenteTitulos].pila,
            peso: pesoDisponible(d.fuenteTitulos, d.pesoTitulos),
            muestras: [r.fondo, r.superficie, r.acento, r.texto],
          };
        })}
        valor={c.visual.direccion}
        onElegir={(id) => setConfig((x) => aplicarDireccion(x, id))}
      />
      <ListaEditable
        etiqueta="¿Qué NO querés que parezca?"
        items={c.visual.antiReferencias}
        onCambiar={(v) => setVisual(setConfig, { antiReferencias: v })}
        placeholder="Ej.: un banco"
      />
    </Seccion>
  );
}

// ---------- Color ----------

const ROLES: { id: RolColor; nombre: string }[] = [
  { id: 'fondo', nombre: 'Fondo' },
  { id: 'superficie', nombre: 'Superficie (cards, barras)' },
  { id: 'superficie_alta', nombre: 'Superficie alta (menús, modales)' },
  { id: 'borde', nombre: 'Borde' },
  { id: 'texto', nombre: 'Texto' },
  { id: 'texto_suave', nombre: 'Texto suave' },
  { id: 'acento', nombre: 'Acento' },
  { id: 'sobre_acento', nombre: 'Texto sobre acento' },
];

export function PasoColor({ config: c, setConfig }: PropsPaso) {
  const [modo, setModo] = useState<'claro' | 'oscuro' | 'todas'>('todas');
  const [aMano, setAMano] = useState(Object.keys(c.visual.paletaPersonalizada.manual).length > 0);
  const s = useMemo(() => sistemaDeDiseno(c), [c]);
  const pp = c.visual.paletaPersonalizada;
  const esPersonalizada = c.visual.paleta === 'personalizada';
  const personal = derivarRoles(pp.fondo, pp.texto, pp.acento, pp.manual);

  const setPersonal = (cambio: Partial<typeof pp>) =>
    setVisual(setConfig, { paleta: 'personalizada', paletaPersonalizada: { ...pp, ...cambio } });

  const elegir = (id: PaletaId | 'personalizada') => {
    if (id === 'personalizada' && !esPersonalizada) {
      // Arranca desde la paleta que estaba elegida, para no empezar en blanco.
      const r = s.paleta.roles;
      setVisual(setConfig, { paleta: 'personalizada', paletaPersonalizada: { fondo: r.fondo, texto: r.texto, acento: r.acento, manual: {} } });
      return;
    }
    setVisual(setConfig, { paleta: id });
  };

  const ids = (Object.keys(PALETAS) as PaletaId[]).filter((id) => modo === 'todas' || PALETAS[id].modo === modo);
  const opciones = [
    ...ids.map((id) => {
      const r = PALETAS[id].roles;
      return { id: id as PaletaId | 'personalizada', nombre: PALETAS[id].nombre, descripcion: `Modo ${PALETAS[id].modo} · acento ${r.acento}`, muestras: [r.fondo, r.superficie, r.acento, r.texto] };
    }),
    {
      id: 'personalizada' as const,
      nombre: 'Personalizada',
      descripcion: 'Elegí vos los colores',
      muestras: [personal.fondo, personal.superficie, personal.acento, personal.texto],
    },
  ];

  const { abierto, boton } = useAvanzado('color');
  return (
    <Seccion titulo="Paleta" ayuda="Elegí una paleta armada o combiná tus propios colores. Se definen por rol: fondo, superficie, texto y acento.">
      <Filtros<'claro' | 'oscuro'> etiqueta="Filtrar paletas" opciones={{ claro: 'Claras', oscuro: 'Oscuras' }} valor={modo} onElegir={setModo} />
      <Opciones<PaletaId | 'personalizada'> etiqueta="Paleta" opciones={opciones} valor={c.visual.paleta} onElegir={elegir} />

      {esPersonalizada && (
        <div className="grupo caja">
          <div className="grupo-titulo">Tus colores</div>
          <p className="ayuda">Con fondo, texto y acento alcanza: el resto se calcula para que combine y se lea bien.</p>
          <div className="colores">
            <CampoColor etiqueta="Fondo" valor={pp.fondo} onCambiar={(v) => setPersonal({ fondo: v })} />
            <CampoColor etiqueta="Texto" valor={pp.texto} onCambiar={(v) => setPersonal({ texto: v })} />
            <CampoColor etiqueta="Acento" valor={pp.acento} onCambiar={(v) => setPersonal({ acento: v })} />
          </div>
          {abierto && (
            <label className="interruptor">
              <input type="checkbox" checked={aMano} onChange={(e) => setAMano(e.target.checked)} />
              Ajustar cada color a mano
            </label>
          )}
          {abierto && aMano && (
            <>
              <div className="colores">
                {ROLES.filter((r) => !['fondo', 'texto', 'acento'].includes(r.id)).map((r) => (
                  <CampoColor
                    key={r.id}
                    etiqueta={r.nombre}
                    valor={personal[r.id]}
                    calculado={!pp.manual[r.id]}
                    onCambiar={(v) => setPersonal({ manual: { ...pp.manual, [r.id]: v } })}
                  />
                ))}
              </div>
              {Object.keys(pp.manual).length > 0 && (
                <div className="fila">
                  <button type="button" className="boton fantasma" onClick={() => setPersonal({ manual: {} })}>
                    Volver a calcular todo
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {!abierto && s.contrastes.some((p) => !p.pasa) && (
        <p className="ayuda mal-texto">
          {s.contrastes.filter((p) => !p.pasa).length} combinaciones no pasan contraste. Abrí las opciones avanzadas para verlas.
        </p>
      )}
      {boton(2)}
      {abierto && (
        <>
      <div className="grupo">
        <div className="grupo-titulo">Contraste (accesibilidad AA)</div>
        <ul className="contrastes">
          {s.contrastes.map((p) => (
            <li key={p.nombre}>
              <span className="contraste-muestra" style={{ background: p.fondo, color: p.texto }}>
                Aa
              </span>
              <span>{p.nombre}</span>
              <strong>{p.valor.toFixed(1)}</strong>
              <span className={p.pasa ? 'ok' : 'mal'}>{p.pasa ? 'Pasa' : `No pasa (mín. ${p.minimo})`}</span>
            </li>
          ))}
        </ul>
        {s.contrastes.some((p) => !p.pasa) && (
          <p className="ayuda mal-texto">Hay combinaciones difíciles de leer. Podés exportar igual: quedan marcadas en el archivo para que la IA las corrija.</p>
        )}
      </div>
        </>
      )}
    </Seccion>
  );
}

// ---------- Tipografía ----------

const NOMBRES_PESO: Record<number, string> = { 400: 'Regular', 500: 'Medium', 600: 'Semibold', 700: 'Bold', 800: 'Extra bold' };

function ListaFuentes(props: { etiqueta: string; valor: FuenteId; peso: number; onElegir: (f: FuenteId) => void }) {
  const [cat, setCat] = useState<CategoriaFuente | 'todas'>('todas');
  const ids = (Object.keys(FUENTES) as FuenteId[]).filter((id) => cat === 'todas' || FUENTES[id].categoria === cat);
  return (
    <div className="grupo">
      <Filtros<CategoriaFuente> etiqueta={`Filtrar fuentes de ${props.etiqueta.toLowerCase()}`} opciones={CATEGORIAS_FUENTE} valor={cat} onElegir={setCat} />
      <Opciones<FuenteId>
        etiqueta={props.etiqueta}
        opciones={ids.map((id) => ({
          id,
          nombre: FUENTES[id].nombre,
          descripcion: `${CATEGORIAS_FUENTE[FUENTES[id].categoria]} · ${FUENTES[id].descripcion}`,
          fuente: FUENTES[id].pila,
          peso: pesoDisponible(id, props.peso),
        }))}
        valor={props.valor}
        onElegir={props.onElegir}
      />
    </div>
  );
}

export function PasoTipografia({ config: c, setConfig }: PropsPaso) {
  const v = c.visual;
  const s = sistemaDeDiseno(c);
  const combo = COMBINACIONES.findIndex((x) => x.titulos === v.fuenteTitulos && x.texto === v.fuenteTexto);
  const pesos = FUENTES[v.fuenteTitulos].pesos;
  const { abierto, boton } = useAvanzado('tipografia');
  return (
    <Seccion titulo="Tipografía" ayuda="Arrancá por una combinación o elegí títulos y texto por separado. Cualquier par se puede combinar.">
      <Opciones<string>
        etiqueta="Combinaciones recomendadas"
        opciones={COMBINACIONES.map((x, i) => ({
          id: String(i),
          nombre: x.nombre,
          descripcion: `${FUENTES[x.titulos].nombre} + ${FUENTES[x.texto].nombre}`,
          fuente: FUENTES[x.titulos].pila,
          peso: pesoDisponible(x.titulos, v.pesoTitulos),
        }))}
        valor={combo >= 0 ? String(combo) : ''}
        onElegir={(i) => setVisual(setConfig, { fuenteTitulos: COMBINACIONES[+i].titulos, fuenteTexto: COMBINACIONES[+i].texto })}
      />
      <Opciones<EscalaId>
        etiqueta="Contraste de tamaños"
        opciones={(Object.keys(ESCALAS) as EscalaId[]).map((id) => ({
          id,
          nombre: ESCALAS[id].nombre,
          descripcion: `${ESCALAS[id].descripcion} · título ${Math.round(16 * Math.pow(ESCALAS[id].proporcion, 4))} px`,
        }))}
        valor={v.escala}
        onElegir={(e) => setVisual(setConfig, { escala: e })}
      />
      {boton(4)}
      {abierto && (
        <>
      <ListaFuentes etiqueta="Títulos" valor={v.fuenteTitulos} peso={v.pesoTitulos} onElegir={(id) => setVisual(setConfig, { fuenteTitulos: id })} />
      <Opciones<string>
        etiqueta="Peso de los títulos"
        columnas={Math.min(pesos.length, 3)}
        opciones={pesos.map((p) => ({ id: String(p), nombre: NOMBRES_PESO[p] ?? String(p), descripcion: String(p), fuente: FUENTES[v.fuenteTitulos].pila, peso: p }))}
        valor={String(s.pesoTitulos)}
        onElegir={(p) => setVisual(setConfig, { pesoTitulos: +p })}
      />
      <Opciones<EspaciadoTitulos>
        etiqueta="Espaciado entre letras de los títulos"
        columnas={3}
        opciones={lista(ESPACIADOS_TITULOS)}
        valor={v.espaciadoTitulos}
        onElegir={(e) => setVisual(setConfig, { espaciadoTitulos: e })}
      />
      <ListaFuentes etiqueta="Texto" valor={v.fuenteTexto} peso={400} onElegir={(id) => setVisual(setConfig, { fuenteTexto: id })} />
        </>
      )}
    </Seccion>
  );
}

// ---------- Forma ----------

export function PasoForma({ config: c, setConfig }: PropsPaso) {
  const { abierto, boton } = useAvanzado('forma');
  return (
    <Seccion titulo="Forma" ayuda="Esquinas, sombras y bordes definen gran parte del carácter.">
      <Opciones<RadioId>
        etiqueta="Esquinas"
        opciones={(Object.keys(RADIOS) as RadioId[]).map((id) => ({
          ...lista(RADIOS).find((o) => o.id === id)!,
          extra: (
            <Mini config={c} cambio={(x) => ({ ...x, visual: { ...x.visual, radio: id } })}>
              <span className="mini-card" />
            </Mini>
          ),
        }))}
        valor={c.visual.radio}
        onElegir={(v) => setVisual(setConfig, { radio: v })}
      />
      {boton(2)}
      {abierto && (
        <>
      <Opciones<ElevacionId>
        etiqueta="Sombras"
        opciones={(Object.keys(ELEVACIONES) as ElevacionId[]).map((id) => ({
          ...lista(ELEVACIONES).find((o) => o.id === id)!,
          extra: (
            <Mini config={c} cambio={(x) => ({ ...x, visual: { ...x.visual, elevacion: id } })}>
              <span className="mini-card con-sombra" />
            </Mini>
          ),
        }))}
        valor={c.visual.elevacion}
        onElegir={(v) => setVisual(setConfig, { elevacion: v })}
      />
      <Opciones<BordesId>
        etiqueta="Bordes de cards y bloques"
        columnas={3}
        opciones={(Object.keys(BORDES) as BordesId[]).map((id) => ({
          ...lista(BORDES).find((o) => o.id === id)!,
          extra: (
            <Mini config={c} cambio={(x) => ({ ...x, visual: { ...x.visual, bordes: id } })}>
              <span className="mini-card con-borde" />
            </Mini>
          ),
        }))}
        valor={c.visual.bordes}
        onElegir={(v) => setVisual(setConfig, { bordes: v })}
      />
        </>
      )}
    </Seccion>
  );
}

// ---------- Botones ----------

export function PasoBotones({ config: c, setConfig }: PropsPaso) {
  const setB = (cambio: Partial<Config['botones']>) => setConfig((x) => ({ ...x, botones: { ...x.botones, ...cambio } }));
  const conB = (cambio: Partial<Config['botones']>) => (x: Config) => ({ ...x, botones: { ...x.botones, ...cambio } });
  const { abierto, boton } = useAvanzado('botones');
  return (
    <Seccion titulo="Botones" ayuda="Es lo que más se toca. Tocá cada opción para ver cómo responde al click.">
      <Opciones<BotonEstiloId>
        etiqueta="Estilo del botón principal"
        columnas={1}
        opciones={(Object.keys(ESTILOS_BOTON) as BotonEstiloId[]).map((id) => ({
          ...lista(ESTILOS_BOTON).find((o) => o.id === id)!,
          extra: <MiniBoton config={c} cambio={conB({ estilo: id })} />,
        }))}
        valor={c.botones.estilo}
        onElegir={(estilo) =>
          setConfig((x) => ({
            ...x,
            botones: { ...x.botones, estilo },
            // La sombra dura pide el hover que la "despega".
            visual: estilo === 'sombra_dura' && x.visual.hover !== 'nada' ? { ...x.visual, hover: 'desplazar' } : x.visual,
          }))
        }
      />
      {boton(3)}
      {abierto && (
        <>
      <Opciones<BotonTamano>
        etiqueta="Tamaño"
        columnas={1}
        opciones={(Object.keys(TAMANOS_BOTON) as BotonTamano[]).map((id) => ({
          ...lista(TAMANOS_BOTON).find((o) => o.id === id)!,
          extra: <MiniBoton config={c} cambio={conB({ tamano: id })} />,
        }))}
        valor={c.botones.tamano}
        onElegir={(tamano) => setB({ tamano })}
      />
      <Opciones<'no' | 'si'>
        etiqueta="Texto en mayúsculas"
        opciones={[
          { id: 'no', nombre: 'No', extra: <MiniBoton config={c} cambio={conB({ mayusculas: false })} /> },
          { id: 'si', nombre: 'Sí', extra: <MiniBoton config={c} cambio={conB({ mayusculas: true })} /> },
        ]}
        valor={c.botones.mayusculas ? 'si' : 'no'}
        onElegir={(v) => setB({ mayusculas: v === 'si' })}
      />
      <Opciones<BotonIcono>
        etiqueta="Icono"
        columnas={1}
        opciones={(
          [
            ['ninguno', 'Sin icono'],
            ['izquierda', 'Icono a la izquierda'],
            ['derecha', 'Icono a la derecha'],
          ] as [BotonIcono, string][]
        ).map(([id, nombre]) => ({ id, nombre, extra: <MiniBoton config={c} cambio={conB({ icono: id })} /> }))}
        valor={c.botones.icono}
        onElegir={(icono) => setB({ icono })}
      />
        </>
      )}
    </Seccion>
  );
}

// ---------- Movimiento ----------

export function PasoMovimiento({ config: c, setConfig }: PropsPaso) {
  const conV = (cambio: Partial<Config['visual']>) => (x: Config) => ({ ...x, visual: { ...x.visual, ...cambio } });
  const { abierto, boton } = useAvanzado('movimiento');
  return (
    <Seccion
      titulo="Movimiento"
      ayuda="Elegí un nivel y después ajustá cada efecto. Pasá el mouse por las opciones de hover, y usá «Repetir animación» en la vista previa."
    >
      <Opciones<MovimientoId>
        etiqueta="Nivel general"
        opciones={lista(MOVIMIENTOS)}
        valor={c.visual.movimiento}
        onElegir={(id) => setConfig((x) => aplicarMovimiento(x, id))}
      />
      <Opciones<HoverId>
        etiqueta="Al pasar el mouse por un botón"
        opciones={(Object.keys(HOVERS) as HoverId[]).map((id) => ({
          ...lista(HOVERS).find((o) => o.id === id)!,
          extra: <MiniBoton config={c} cambio={conV({ hover: id })} texto="Botón" />,
        }))}
        valor={c.visual.hover}
        onElegir={(hover) => setVisual(setConfig, { hover })}
      />
      {boton(3)}
      {abierto && (
        <>
      <Opciones<PresionarId>
        etiqueta="Al presionar"
        opciones={(Object.keys(PRESIONAR) as PresionarId[]).map((id) => ({
          ...lista(PRESIONAR).find((o) => o.id === id)!,
          extra: <MiniBoton config={c} cambio={conV({ presionar: id })} texto="Botón" />,
        }))}
        valor={c.visual.presionar}
        onElegir={(presionar) => setVisual(setConfig, { presionar })}
      />
      <Opciones<AparicionId>
        etiqueta="Cómo aparecen las listas y cards"
        opciones={lista(APARICIONES)}
        valor={c.visual.aparicion}
        onElegir={(aparicion) => setVisual(setConfig, { aparicion })}
      />
      <Opciones<CambioId>
        etiqueta="Al cambiar de pantalla"
        opciones={lista(CAMBIOS)}
        valor={c.visual.cambio}
        onElegir={(cambio) => setVisual(setConfig, { cambio })}
      />
        </>
      )}
    </Seccion>
  );
}
