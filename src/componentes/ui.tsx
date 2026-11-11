import { useId, useState, type ReactNode } from 'react';
import { fuenteDePila, useFuentes } from '../fuentes';
import { animarToque } from './toque';

export interface Opcion<T extends string> {
  id: T;
  nombre: string;
  descripcion?: string;
  muestras?: string[];
  fuente?: string;
  /** Peso para mostrar el nombre (por ejemplo, el peso de títulos elegido). */
  peso?: number;
  /** Contenido visual extra a la derecha: una mini vista previa. */
  extra?: ReactNode;
}

export function Opciones<T extends string>(props: {
  etiqueta: string;
  opciones: Opcion<T>[];
  valor: T;
  onElegir: (id: T) => void;
  columnas?: number;
}) {
  useFuentes(props.opciones.map((o) => fuenteDePila(o.fuente)));
  return (
    <fieldset className="grupo">
      <legend className="grupo-titulo">{props.etiqueta}</legend>
      <div className="opciones" style={{ ['--cols' as string]: props.columnas ?? 2 }}>
        {props.opciones.map((o) => (
          <button
            key={o.id}
            type="button"
            className="opcion"
            aria-pressed={o.id === props.valor}
            onClick={(e) => {
              animarToque(e.currentTarget);
              props.onElegir(o.id);
            }}
          >
            <span className="opcion-texto">
              <span className="opcion-nombre" style={o.fuente ? { fontFamily: o.fuente, fontWeight: o.peso } : undefined}>
                {o.nombre}
              </span>
              {o.descripcion && <span className="opcion-desc">{o.descripcion}</span>}
            </span>
            {o.extra && (
              <span className="opcion-extra" aria-hidden="true">
                {o.extra}
              </span>
            )}
            {o.muestras && (
              <span className="muestras" aria-hidden="true">
                {o.muestras.map((m, i) => (
                  <span key={i} className="muestra" style={{ background: m }} />
                ))}
              </span>
            )}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function Campo(props: {
  etiqueta: string;
  valor: string;
  onCambiar: (v: string) => void;
  ayuda?: string;
  placeholder?: string;
  multilinea?: boolean;
}) {
  const id = useId();
  return (
    <div className="campo">
      <label htmlFor={id}>{props.etiqueta}</label>
      {props.multilinea ? (
        <textarea
          id={id}
          rows={3}
          value={props.valor}
          placeholder={props.placeholder}
          onChange={(e) => props.onCambiar(e.target.value)}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={props.valor}
          placeholder={props.placeholder}
          onChange={(e) => props.onCambiar(e.target.value)}
        />
      )}
      {props.ayuda && <span className="ayuda">{props.ayuda}</span>}
    </div>
  );
}

export function ListaEditable(props: {
  etiqueta: string;
  items: string[];
  onCambiar: (items: string[]) => void;
  placeholder?: string;
  ayuda?: string;
}) {
  const id = useId();
  const [nuevo, setNuevo] = useState('');
  const agregar = () => {
    const v = nuevo.trim();
    if (!v) return;
    props.onCambiar([...props.items, v]);
    setNuevo('');
  };
  return (
    <div className="campo">
      <label htmlFor={id}>{props.etiqueta}</label>
      {props.items.length > 0 && (
        <ul className="lista">
          {props.items.map((it, i) => (
            <li key={i}>
              <span>{it}</span>
              <button
                type="button"
                className="quitar"
                aria-label={`Quitar "${it}"`}
                onClick={() => props.onCambiar(props.items.filter((_, j) => j !== i))}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="fila">
        <input
          id={id}
          type="text"
          value={nuevo}
          placeholder={props.placeholder}
          onChange={(e) => setNuevo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              agregar();
            }
          }}
        />
        <button type="button" className="boton secundario" onClick={agregar}>
          Agregar
        </button>
      </div>
      {props.ayuda && <span className="ayuda">{props.ayuda}</span>}
    </div>
  );
}

export function Casillas(props: {
  etiqueta: string;
  opciones: Record<string, string>;
  valores: string[];
  onCambiar: (v: string[]) => void;
}) {
  return (
    <fieldset className="grupo">
      <legend className="grupo-titulo">{props.etiqueta}</legend>
      <div className="casillas">
        {Object.entries(props.opciones).map(([id, nombre]) => (
          <label key={id} className="casilla">
            <input
              type="checkbox"
              checked={props.valores.includes(id)}
              onChange={(e) =>
                props.onCambiar(e.target.checked ? [...props.valores, id] : props.valores.filter((v) => v !== id))
              }
            />
            {nombre}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function NotaPaso(props: { valor: string; onCambiar: (v: string) => void; placeholder: string }) {
  return (
    <div className="nota">
      <Campo
        etiqueta="Tu nota para este paso (opcional)"
        valor={props.valor}
        onCambiar={props.onCambiar}
        placeholder={props.placeholder}
        multilinea
        ayuda="Va al archivo tal cual la escribís, y para la IA pesa más que lo elegido arriba."
      />
    </div>
  );
}

export function Seccion(props: { titulo: string; ayuda: string; children: ReactNode }) {
  return (
    <>
      <header className="paso-encabezado">
        <h2>{props.titulo}</h2>
        <p>{props.ayuda}</p>
      </header>
      {props.children}
    </>
  );
}

export function Filtros<T extends string>(props: {
  etiqueta: string;
  opciones: Record<T, string>;
  valor: T | 'todas';
  onElegir: (v: T | 'todas') => void;
}) {
  const todas: [T | 'todas', string][] = [['todas', 'Todas'], ...(Object.entries(props.opciones) as [T, string][])];
  return (
    <div className="filtros" role="group" aria-label={props.etiqueta}>
      {todas.map(([id, nombre]) => (
        <button key={id} type="button" className="chip" aria-pressed={props.valor === id} onClick={() => props.onElegir(id)}>
          {nombre}
        </button>
      ))}
    </div>
  );
}

const esHexValido = (s: string) => /^#[0-9a-fA-F]{6}$/.test(s);

/** Selector de color: muestra nativa + campo hex. */
export function CampoColor(props: { etiqueta: string; valor: string; onCambiar: (v: string) => void; ayuda?: string; calculado?: boolean }) {
  const id = useId();
  const [texto, setTexto] = useState(props.valor);
  const [editando, setEditando] = useState(false);
  const mostrado = editando ? texto : props.valor;
  return (
    <div className="campo-color">
      <input
        type="color"
        aria-label={`${props.etiqueta}: elegir color`}
        value={props.valor.toLowerCase()}
        onChange={(e) => props.onCambiar(e.target.value.toUpperCase())}
      />
      <div className="campo-color-texto">
        <label htmlFor={id}>
          {props.etiqueta}
          {props.calculado && <span className="calculado"> · calculado</span>}
        </label>
        <input
          id={id}
          type="text"
          inputMode="text"
          spellCheck={false}
          value={mostrado}
          onFocus={() => {
            setTexto(props.valor);
            setEditando(true);
          }}
          onBlur={() => setEditando(false)}
          onChange={(e) => {
            const v = e.target.value.trim();
            setTexto(v);
            const conNumeral = v.startsWith('#') ? v : `#${v}`;
            if (esHexValido(conNumeral)) props.onCambiar(conNumeral.toUpperCase());
          }}
        />
      </div>
      {props.ayuda && <span className="ayuda">{props.ayuda}</span>}
    </div>
  );
}

/**
 * Opciones avanzadas plegables. Devuelve si están abiertas y el botón para abrirlas.
 * Recuerda la elección por paso en este navegador.
 */
export function useAvanzado(clave: string) {
  const k = `configurador-diseno:avanzado:${clave}`;
  const [abierto, setAbierto] = useState(() => {
    try {
      return localStorage.getItem(k) === '1';
    } catch {
      return false;
    }
  });
  const cambiar = () => {
    const nuevo = !abierto;
    setAbierto(nuevo);
    try {
      localStorage.setItem(k, nuevo ? '1' : '0');
    } catch {
      // sin almacenamiento: solo dura la sesión
    }
  };
  // Se devuelve como función (no componente) para que el botón no se vuelva a montar y conserve el foco.
  const boton = (cantidad: number) => (
    <button type="button" className="avanzado-boton" aria-expanded={abierto} onClick={cambiar}>
      <span>{abierto ? 'Ocultar opciones avanzadas' : 'Ver opciones avanzadas'}</span>
      <span className="avanzado-cantidad">{cantidad}</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="avanzado-flecha">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>
  );
  return { abierto, boton };
}

// Viven en toque.tsx (chico) para que la carga inicial no se lleve todo ui.tsx.
export { animarToque, IconoFlecha } from './toque';
