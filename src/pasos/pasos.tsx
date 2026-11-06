// Registro de pasos del configurador. Para sumar un paso: escribí su componente,
// agregalo a PASOS y hacé que generarDesignMd lo exporte (ver DESIGN.md §5).

import type { ComponentType } from 'react';
import {
  DIRECCIONES,
  ESTILOS_BOTON,
  FUENTES,
  HOVERS,
  INTEGRACIONES,
  MOVIMIENTOS,
  PATRONES_NAV,
  PLATAFORMAS,
  RADIOS,
  TAMANOS_BOTON,
  TIPOS_PROYECTO,
} from '../catalogo';
import { aplicarTipo, nuevoId, pantallasDePlantilla } from '../estado';
import { paletaActiva } from '../export/sistema';
import type { Config, Pantalla, PasoId, PatronNav, SiNo, TipoProyecto } from '../tipos';
import { Campo, Casillas, ListaEditable, Opciones, Seccion } from '../componentes/ui';
import { PasoBotones, PasoColor, PasoDireccion, PasoForma, PasoMovimiento, PasoTipografia } from './visual';
import { PasoExportar } from './PasoExportar';

export interface PropsPaso {
  config: Config;
  setConfig: (fn: (c: Config) => Config) => void;
}

export interface DefPaso {
  id: PasoId;
  nombre: string;
  resumen: (c: Config) => string;
  componente: ComponentType<PropsPaso>;
  placeholderNota?: string;
}

const opcionesDe = <T extends string, V extends { nombre: string; descripcion?: string }>(
  reg: Record<T, V>,
  extra?: (v: V, id: T) => { muestras?: string[]; fuente?: string },
) => (Object.keys(reg) as T[]).map((id) => ({ id, nombre: reg[id].nombre, descripcion: reg[id].descripcion, ...extra?.(reg[id], id) }));

function PasoProyecto({ config: c, setConfig }: PropsPaso) {
  const set = (campo: keyof Config['proyecto']) => (v: string) =>
    setConfig((x) => ({ ...x, proyecto: { ...x.proyecto, [campo]: v } }));
  return (
    <Seccion titulo="¿Qué es tu proyecto?" ayuda="Con esto la IA sabe qué construir, no solo cómo pintarlo.">
      <Opciones<TipoProyecto>
        etiqueta="Tipo"
        opciones={opcionesDe(TIPOS_PROYECTO)}
        valor={c.proyecto.tipo}
        onElegir={(t) => setConfig((x) => aplicarTipo(x, t))}
      />
      <Campo etiqueta="Nombre" valor={c.proyecto.nombre} onCambiar={set('nombre')} placeholder="Ej.: Barbería Sur" />
      <Campo
        etiqueta="¿Qué es, en una o dos frases?"
        valor={c.proyecto.descripcion}
        onCambiar={set('descripcion')}
        multilinea
        placeholder="Ej.: Una app para manejar los turnos de mi barbería sin usar más el cuaderno."
      />
      <Campo
        etiqueta="La UNA cosa que tiene que lograr"
        valor={c.proyecto.objetivo}
        onCambiar={set('objetivo')}
        placeholder="Ej.: Que reservar un turno lleve segundos"
        ayuda="Ordena todas las decisiones de jerarquía: lo que sirve a este objetivo va primero."
      />
      <Campo etiqueta="¿Quién lo usa?" valor={c.proyecto.publicoQuienes} onCambiar={set('publicoQuienes')} placeholder="Ej.: El dueño y dos empleados" />
      <Campo
        etiqueta="¿Dónde y cómo lo usa?"
        valor={c.proyecto.publicoContexto}
        onCambiar={set('publicoContexto')}
        placeholder="Ej.: En el celular, entre cliente y cliente, apurado"
      />
      <Opciones
        etiqueta="Nivel técnico de quien lo usa"
        columnas={3}
        opciones={[
          { id: 'bajo', nombre: 'Bajo', descripcion: 'Todo tiene que ser obvio' },
          { id: 'medio', nombre: 'Medio', descripcion: 'Usa apps a diario' },
          { id: 'alto', nombre: 'Alto', descripcion: 'Le sobran atajos' },
        ]}
        valor={c.proyecto.nivelTecnico}
        onElegir={(v) => setConfig((x) => ({ ...x, proyecto: { ...x.proyecto, nivelTecnico: v } }))}
      />
      <Casillas
        etiqueta="Plataformas"
        opciones={PLATAFORMAS}
        valores={c.proyecto.plataformas}
        onCambiar={(v) => setConfig((x) => ({ ...x, proyecto: { ...x.proyecto, plataformas: v } }))}
      />
    </Seccion>
  );
}

function PasoEstructura({ config: c, setConfig }: PropsPaso) {
  const setPantallas = (fn: (ps: Pantalla[]) => Pantalla[]) =>
    setConfig((x) => ({ ...x, estructura: { ...x.estructura, pantallas: fn(x.estructura.pantallas), editadas: true } }));
  const editar = (id: string, cambio: Partial<Pantalla>) => setPantallas((ps) => ps.map((p) => (p.id === id ? { ...p, ...cambio } : p)));
  const mover = (i: number, d: number) =>
    setPantallas((ps) => {
      const j = i + d;
      if (j < 0 || j >= ps.length) return ps;
      const copia = [...ps];
      [copia[i], copia[j]] = [copia[j], copia[i]];
      return copia;
    });
  const navOpts = opcionesDe(PATRONES_NAV);
  return (
    <Seccion titulo="Pantallas y navegación" ayuda="Arrancan sugeridas según el tipo de proyecto. Cambiá, sumá o sacá lo que quieras.">
      <Opciones<PatronNav>
        etiqueta="Navegación en computadora"
        opciones={navOpts}
        valor={c.estructura.patron}
        onElegir={(v) => setConfig((x) => ({ ...x, estructura: { ...x.estructura, patron: v } }))}
      />
      <Opciones<PatronNav>
        etiqueta="Navegación en celular"
        opciones={navOpts}
        valor={c.estructura.patronMovil}
        onElegir={(v) => setConfig((x) => ({ ...x, estructura: { ...x.estructura, patronMovil: v } }))}
      />
      <div className="grupo">
        <div className="grupo-titulo">Pantallas</div>
        <div className="pantallas">
          {c.estructura.pantallas.map((p, i) => (
            <div key={p.id} className="pantalla">
              <div className="pantalla-barra">
                <span className="pantalla-num">{i + 1}</span>
                <div className="pantalla-acciones">
                  <button type="button" className="icono" aria-label={`Subir ${p.nombre}`} onClick={() => mover(i, -1)} disabled={i === 0}>
                    ↑
                  </button>
                  <button
                    type="button"
                    className="icono"
                    aria-label={`Bajar ${p.nombre}`}
                    onClick={() => mover(i, 1)}
                    disabled={i === c.estructura.pantallas.length - 1}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="icono"
                    aria-label={`Quitar ${p.nombre}`}
                    onClick={() => setPantallas((ps) => ps.filter((x) => x.id !== p.id))}
                  >
                    ×
                  </button>
                </div>
              </div>
              <Campo etiqueta="Nombre" valor={p.nombre} onCambiar={(v) => editar(p.id, { nombre: v })} />
              <Campo etiqueta="Para qué sirve" valor={p.proposito} onCambiar={(v) => editar(p.id, { proposito: v })} />
              <Campo
                etiqueta="Acción principal (el botón más importante)"
                valor={p.accionPrincipal}
                onCambiar={(v) => editar(p.id, { accionPrincipal: v })}
              />
              <Campo
                etiqueta="Bloques, separados por coma"
                valor={p.secciones.join(', ')}
                onCambiar={(v) =>
                  editar(p.id, {
                    secciones: v
                      .split(',')
                      .map((s) => s.trim().toLowerCase().replace(/\s+/g, '_'))
                      .filter(Boolean),
                  })
                }
              />
            </div>
          ))}
        </div>
        <div className="fila">
          <button
            type="button"
            className="boton secundario"
            onClick={() =>
              setPantallas((ps) => [...ps, { id: nuevoId('pantalla'), nombre: 'Nueva pantalla', proposito: '', secciones: [], accionPrincipal: '' }])
            }
          >
            Agregar pantalla
          </button>
          <button
            type="button"
            className="boton fantasma"
            onClick={() =>
              setConfig((x) => ({ ...x, estructura: { ...x.estructura, pantallas: pantallasDePlantilla(x.proyecto.tipo), editadas: false } }))
            }
          >
            Volver a las sugeridas
          </button>
        </div>
      </div>
    </Seccion>
  );
}

function PasoFunciones({ config: c, setConfig }: PropsPaso) {
  const set = <K extends keyof Config['funciones']>(k: K) => (v: Config['funciones'][K]) =>
    setConfig((x) => ({ ...x, funciones: { ...x.funciones, [k]: v } }));
  return (
    <Seccion titulo="¿Qué hace?" ayuda="Las acciones más importantes, en orden. Y lo que NO tiene que hacer, que importa igual.">
      <ListaEditable
        etiqueta="Acciones clave (3 a 6)"
        items={c.funciones.acciones}
        onCambiar={set('acciones')}
        placeholder="Ej.: Reservar un turno en menos de 15 segundos"
      />
      <Opciones<SiNo>
        etiqueta="¿Hace falta crear una cuenta?"
        columnas={3}
        opciones={[
          { id: 'si', nombre: 'Sí' },
          { id: 'opcional', nombre: 'Opcional' },
          { id: 'no', nombre: 'No' },
        ]}
        valor={c.funciones.requiereCuenta}
        onElegir={set('requiereCuenta')}
      />
      <Casillas etiqueta="Se conecta con…" opciones={INTEGRACIONES} valores={c.funciones.integraciones} onCambiar={set('integraciones')} />
      <ListaEditable
        etiqueta="Fuera de alcance"
        items={c.funciones.fueraDeAlcance}
        onCambiar={set('fueraDeAlcance')}
        placeholder="Ej.: Pagos online"
        ayuda="Evita que la IA agregue cosas por su cuenta."
      />
    </Seccion>
  );
}

const corto = (s: string, n = 24) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

export const PASOS: DefPaso[] = [
  {
    id: 'proyecto',
    nombre: 'Proyecto',
    resumen: (c) => corto(c.proyecto.nombre || TIPOS_PROYECTO[c.proyecto.tipo].nombre),
    componente: PasoProyecto,
    placeholderNota: 'Ej.: "es para gente grande, que no se maneja bien con el celular"',
  },
  {
    id: 'estructura',
    nombre: 'Pantallas',
    resumen: (c) => `${c.estructura.pantallas.length} · ${PATRONES_NAV[c.estructura.patron].nombre}`,
    componente: PasoEstructura,
    placeholderNota: 'Ej.: "en el celular, pestañas abajo sí o sí"',
  },
  {
    id: 'funciones',
    nombre: 'Qué hace',
    resumen: (c) => (c.funciones.acciones.length ? `${c.funciones.acciones.length} acciones` : 'Sin definir'),
    componente: PasoFunciones,
    placeholderNota: 'Ej.: "el recordatorio puede ser un link de WhatsApp, no hace falta API"',
  },
  {
    id: 'direccion',
    nombre: 'Dirección',
    resumen: (c) => DIRECCIONES[c.visual.direccion].nombre,
    componente: PasoDireccion,
    placeholderNota: 'Ej.: "calmo, pero que no parezca un banco"',
  },
  {
    id: 'color',
    nombre: 'Color',
    resumen: (c) => paletaActiva(c).nombre,
    componente: PasoColor,
    placeholderNota: 'Ej.: "el acento un poco menos saturado"',
  },
  {
    id: 'tipografia',
    nombre: 'Tipografía',
    resumen: (c) => corto(`${FUENTES[c.visual.fuenteTitulos].nombre} + ${FUENTES[c.visual.fuenteTexto].nombre}`),
    componente: PasoTipografia,
    placeholderNota: 'Ej.: "las horas de los turnos bien grandes"',
  },
  {
    id: 'forma',
    nombre: 'Forma',
    resumen: (c) => RADIOS[c.visual.radio].nombre,
    componente: PasoForma,
    placeholderNota: 'Ej.: "cards suaves, pero inputs rectos"',
  },
  {
    id: 'botones',
    nombre: 'Botones',
    resumen: (c) => `${ESTILOS_BOTON[c.botones.estilo].nombre} · ${TAMANOS_BOTON[c.botones.tamano].nombre}`,
    componente: PasoBotones,
    placeholderNota: 'Ej.: "el botón de reservar tiene que ser enorme"',
  },
  {
    id: 'movimiento',
    nombre: 'Movimiento',
    resumen: (c) => `${MOVIMIENTOS[c.visual.movimiento].nombre} · ${HOVERS[c.visual.hover].nombre}`,
    componente: PasoMovimiento,
    placeholderNota: 'Ej.: "nada que rebote en formularios"',
  },
  { id: 'exportar', nombre: 'Exportar', resumen: () => 'Tu DESIGN.md', componente: PasoExportar },
];
