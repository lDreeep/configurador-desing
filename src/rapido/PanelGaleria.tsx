// Panel genérico del modo rápido para una o más categorías de la galería (con pestañas).

import { useState, type CSSProperties } from 'react';
import { BotonPrincipal } from '../componentes/BotonPrincipal';
import { sistemaDeDiseno } from '../export/sistema';
import { CATEGORIAS, type CategoriaId, DISENO_INICIAL } from '../galeria';
import { claseDe, GaleriaContexto } from '../galeria/base';
import type { Config } from '../tipos';

export function PanelGaleria(props: {
  config: Config;
  setConfig: (fn: (c: Config) => Config) => void;
  paso: string;
  titulo: string;
  bajada: string;
  categorias: CategoriaId[];
  atras: string;
  onAtras: () => void;
  onSeguir: () => void;
}) {
  const c = props.config;
  const s = sistemaDeDiseno(c);
  const [pestana, setPestana] = useState<CategoriaId>(props.categorias[0]);
  const cat = CATEGORIAS[pestana];
  const elegido = (id: CategoriaId) => c.componentes[id];
  const estilo = c.visual.estilo !== 'clasico' ? `estilo-${c.visual.estilo}` : '';
  const elegir = (d: string) => props.setConfig((x) => ({ ...x, componentes: { ...x.componentes, [pestana]: d } }));
  const listos = props.categorias.filter((id) => elegido(id)).length;

  return (
    <GaleriaContexto.Provider value={c}>
    <div className={`panel-botones panel-galeria pg ${estilo}`} style={s.tokens as CSSProperties}>
      <div className="pb-contenido">
        <header className="pb-cabecera">
          <span className="pg-etiqueta">{props.paso}</span>
          <h1 className="pg-titulo">{props.titulo}</h1>
          <p className="pg-bajada">{props.bajada}</p>
        </header>

        {props.categorias.length > 1 && (
          <div className="pg-pestanas" role="tablist" aria-label="Tipos de componente">
            {props.categorias.map((id) => (
              <button key={id} type="button" role="tab" aria-selected={pestana === id} onClick={() => setPestana(id)}>
                {CATEGORIAS[id].nombre}
                {elegido(id) && <span className="pg-pestana-ok" aria-label="(elegido)">✓</span>}
              </button>
            ))}
          </div>
        )}

        <p className="pg-ayuda-cat">{cat.descripcion}</p>

        <div className="pb-grilla pg-grilla" style={{ '--ancho-celda': `${cat.anchoCelda}px` } as CSSProperties} role="tabpanel">
          {Object.entries(cat.disenos).map(([id, d]) => {
            const sel = elegido(pestana) === id;
            return (
              <div key={`${pestana}-${id}`} className={`pb-celda pg-celda ${sel ? 'elegida' : ''}`}>
                <div className="pg-muestra">
                  <cat.Muestra clase={claseDe(pestana, id)} id={id} />
                </div>
                <div className="pb-info">
                  <span className="pg-card-titulo">{d.nombre}</span>
                  <span className="pb-desc">{d.descripcion}</span>
                </div>
                <button type="button" className="pg-elegir" aria-pressed={sel} onClick={() => elegir(id)}>
                  {sel ? 'Elegido' : 'Elegir este'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <footer className="pb-pie">
        <button type="button" className="pb-pie-atras" onClick={props.onAtras}>
          {props.atras}
        </button>
        <span className="pb-pie-estado" aria-live="polite">
          {listos} de {props.categorias.length} elegidos
          {listos < props.categorias.length && ' · lo que no elijas queda con el primero de la lista'}
        </span>
        <BotonPrincipal
          config={c}
          onClick={() =>
            window.setTimeout(() => {
              // Lo que no se eligió queda con el primer diseño, así el archivo siempre lo define.
              props.setConfig((x) => ({
                ...x,
                componentes: Object.fromEntries(props.categorias.map((id) => [id, x.componentes[id] ?? DISENO_INICIAL[id]]).concat(Object.entries(x.componentes))),
              }));
              props.onSeguir();
            }, 220)
          }
        >
          Seguir
        </BotonPrincipal>
      </footer>
    </div>
    </GaleriaContexto.Provider>
  );
}
