import { useId, useState, type ReactNode } from 'react';

export interface Opcion<T extends string> {
  id: T;
  nombre: string;
  descripcion?: string;
  muestras?: string[];
  fuente?: string;
}

export function Opciones<T extends string>(props: {
  etiqueta: string;
  opciones: Opcion<T>[];
  valor: T;
  onElegir: (id: T) => void;
  columnas?: number;
}) {
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
            onClick={() => props.onElegir(o.id)}
          >
            <span className="opcion-texto">
              <span className="opcion-nombre" style={o.fuente ? { fontFamily: o.fuente } : undefined}>
                {o.nombre}
              </span>
              {o.descripcion && <span className="opcion-desc">{o.descripcion}</span>}
            </span>
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
