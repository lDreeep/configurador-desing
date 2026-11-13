import { useRef, useState } from 'react';
import { moverSeccion, type SeccionDisenoId } from '../secciones-base';
import { nombreDeDiseno } from '../secciones';

/** Orden persistido: el arrastre solo se confirma al soltar sobre otra ficha. */
export function OrdenSecciones({ lista, onCambiar }: { lista: SeccionDisenoId[]; onCambiar: (lista: SeccionDisenoId[]) => void }) {
  const arrastre = useRef<SeccionDisenoId | null>(null);
  const [sobre, setSobre] = useState<string | null>(null);
  const [aviso, setAviso] = useState('');
  const mover = (id: SeccionDisenoId, destino: SeccionDisenoId) => {
    const nueva = moverSeccion(lista, id, destino);
    onCambiar(nueva);
    setAviso(`${nombreDeDiseno(id)}: posición ${nueva.indexOf(id) + 1} de ${nueva.length}`);
  };
  return <details className="molde-orden">
    <summary>Orden de las secciones ({lista.length})</summary>
    <p>Arrastrá la manija o usá Subir y Bajar.</p>
    <ol>{lista.map((id, i) => <li key={id} data-orden-seccion={id} className={sobre === id ? 'molde-destino' : undefined}>
      <button type="button" className="molde-manija" aria-label={`Arrastrar ${nombreDeDiseno(id)}`}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          arrastre.current = id;
          e.currentTarget.setPointerCapture?.(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!arrastre.current) return;
          setSobre(document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-orden-seccion]')?.getAttribute('data-orden-seccion') ?? null);
        }}
        onPointerCancel={() => { arrastre.current = null; setSobre(null); }}
        onPointerUp={(e) => {
          setSobre(null);
          const desde = arrastre.current;
          arrastre.current = null;
          const destino = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-orden-seccion]')?.getAttribute('data-orden-seccion');
          if (desde && destino && lista.includes(destino as SeccionDisenoId) && desde !== destino) mover(desde, destino as SeccionDisenoId);
        }}>↕</button>
      <span>{i + 1}. {nombreDeDiseno(id)}</span>
      <button type="button" disabled={i === 0} aria-label={`Subir ${nombreDeDiseno(id)}`} onClick={() => mover(id, lista[i - 1])}>↑</button>
      <button type="button" disabled={i === lista.length - 1} aria-label={`Bajar ${nombreDeDiseno(id)}`} onClick={() => mover(id, lista[i + 1])}>↓</button>
    </li>)}</ol>
    <span role="status">{aviso}</span>
  </details>;
}
