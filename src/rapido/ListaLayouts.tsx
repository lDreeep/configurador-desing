// La lista de layouts de la portada («Ver todos los layouts»): los de autor y los genéricos, cada
// uno con su esquema. Baja aparte: solo se ve cuando se abre.

import { esAutor, LAYOUTS, RECETAS_AUTOR } from '../estilos-visuales';
import type { LayoutId } from '../tipos';
import type { Combinacion } from './combinar';
import { Esquema } from './esquemas';

export function ListaLayouts({ actual, irA, cerrar }: { actual: Combinacion; irA: (k: Combinacion) => void; cerrar: () => void }) {
  return (
    <div className="inicio-layouts" role="dialog" aria-label="Elegí un layout">
      <div className="inicio-layouts-cabeza">
        <strong>Elegí la estructura</strong>
        <span>Se mantiene el estilo, los colores y la letra.</span>
        <button type="button" className="inicio-layouts-cerrar" aria-label="Cerrar" onClick={cerrar}>
          ×
        </button>
      </div>
      <p className="inicio-layouts-sub">Diseños de autor: páginas pensadas para un negocio concreto. Se abren con su estilo, sus colores y su letra; después cambiás lo que quieras.</p>
      <div className="inicio-layouts-grilla">
        {(Object.keys(LAYOUTS) as LayoutId[]).filter(esAutor).map((id) => (
          <button
            key={id}
            type="button"
            className="inicio-layout inicio-layout-autor"
            aria-pressed={actual.layout === id}
            onClick={() => {
              irA({ ...actual, layout: id, ...RECETAS_AUTOR[id] });
              cerrar();
            }}
          >
            <Esquema id={id} />
            <span className="inicio-layout-nombre">{LAYOUTS[id].nombre}</span>
            <span className="inicio-layout-desc">{LAYOUTS[id].descripcion}</span>
          </button>
        ))}
      </div>
      <p className="inicio-layouts-sub">Estructuras para cualquier proyecto: se mantiene el estilo, los colores y la letra.</p>
      <div className="inicio-layouts-grilla">
        {(Object.keys(LAYOUTS) as LayoutId[]).filter((id) => !esAutor(id)).map((id) => (
          <button
            key={id}
            type="button"
            className="inicio-layout"
            aria-pressed={actual.layout === id}
            onClick={() => {
              if (id !== actual.layout) irA({ ...actual, layout: id });
              cerrar();
            }}
          >
            <Esquema id={id} />
            <span className="inicio-layout-nombre">{LAYOUTS[id].nombre}</span>
            <span className="inicio-layout-desc">{LAYOUTS[id].descripcion}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
