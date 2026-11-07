// Panel genérico del modo rápido para una o más categorías de la galería (con pestañas).

import { useState, type CSSProperties } from 'react';
import { BotonPrincipal } from '../componentes/BotonPrincipal';
import { sistemaDeDiseno } from '../export/sistema';
import { CATEGORIAS, type CategoriaId, DISENO_INICIAL } from '../galeria';
import { claseDe, GaleriaContexto } from '../galeria/base';
import type { Config } from '../tipos';
import { ordenar, RECOMENDADOS } from '../recomendados';
import { SelloRecomendado, TituloRecomendados, TituloResto } from './Recomendados';

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
  /** Entrar por la última pestaña (cuando se vuelve desde el paso siguiente). */
  alFinal?: boolean;
}) {
  const c = props.config;
  const s = sistemaDeDiseno(c);
  const [pestana, setPestana] = useState<CategoriaId>(props.alFinal ? props.categorias[props.categorias.length - 1] : props.categorias[0]);
  const indice = props.categorias.indexOf(pestana);
  const ultima = indice === props.categorias.length - 1;
  const cambiarPestana = (id: CategoriaId) => {
    setPestana(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const cat = CATEGORIAS[pestana];
  const elegido = (id: CategoriaId) => c.componentes[id];
  const estilo = c.visual.estilo !== 'clasico' ? `estilo-${c.visual.estilo}` : '';
  const elegir = (d: string) => props.setConfig((x) => ({ ...x, componentes: { ...x.componentes, [pestana]: d } }));
  const listos = props.categorias.filter((id) => elegido(id)).length;
  const orden = ordenar(Object.keys(cat.disenos), RECOMENDADOS[c.proyecto.tipo].componentes[pestana]);
  const celda = (id: string, rec: boolean) => {
    const d = cat.disenos[id];
    const sel = elegido(pestana) === id;
    return (
      <div key={`${pestana}-${id}`} className={`pb-celda pg-celda ${sel ? 'elegida' : ''} ${rec ? 'recomendada' : ''}`}>
        {rec && <SelloRecomendado />}
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
  };

  return (
    <GaleriaContexto.Provider value={c}>
    <div className={`panel-botones panel-galeria pg ${estilo}`} style={s.tokens as CSSProperties}>
      <div className="pb-contenido">
        <header className="pb-cabecera">
          <span className="pg-etiqueta">
            {props.paso}
            {props.categorias.length > 1 && ` · ${indice + 1} de ${props.categorias.length}: ${cat.nombre}`}
          </span>
          <h1 className="pg-titulo">{props.titulo}</h1>
          <p className="pg-bajada">{props.bajada}</p>
        </header>

        {props.categorias.length > 1 && (
          <div className="pg-pestanas" role="tablist" aria-label="Tipos de componente">
            {props.categorias.map((id) => (
              <button key={id} type="button" role="tab" aria-selected={pestana === id} onClick={() => cambiarPestana(id)}>
                {CATEGORIAS[id].nombre}
                {elegido(id) && <span className="pg-pestana-ok" aria-label="(elegido)">✓</span>}
              </button>
            ))}
          </div>
        )}

        <p className="pg-ayuda-cat">{cat.descripcion}</p>

        <div className="pb-grilla pg-grilla" style={{ '--ancho-celda': `${cat.anchoCelda}px` } as CSSProperties} role="tabpanel">
          {orden.recomendados.length > 0 && <TituloRecomendados tipo={c.proyecto.tipo} />}
          {orden.recomendados.map((id) => celda(id, true))}
          {orden.recomendados.length > 0 && <TituloResto />}
          {orden.resto.map((id) => celda(id, false))}
        </div>
      </div>

      <footer className="pb-pie">
        <button type="button" className="pb-pie-atras" onClick={() => (indice > 0 ? cambiarPestana(props.categorias[indice - 1]) : props.onAtras())}>
          {indice > 0 ? `Volver a ${CATEGORIAS[props.categorias[indice - 1]].nombre.toLowerCase()}` : props.atras}
        </button>
        <span className="pb-pie-estado" aria-live="polite">
          {elegido(pestana) ? `Elegido: ${cat.disenos[elegido(pestana)!]?.nombre}` : 'Si no elegís, queda el primero recomendado'}
          {props.categorias.length > 1 && ` · ${listos} de ${props.categorias.length} listos`}
        </span>
        <BotonPrincipal
          config={c}
          onClick={() =>
            window.setTimeout(() => {
              if (!ultima) {
                // Lo que no se eligió en esta pestaña queda con el primer recomendado; se pasa a la siguiente.
                props.setConfig((x) => ({
                  ...x,
                  componentes: { ...x.componentes, [pestana]: x.componentes[pestana] ?? RECOMENDADOS[x.proyecto.tipo].componentes[pestana]?.[0] ?? DISENO_INICIAL[pestana] },
                }));
                cambiarPestana(props.categorias[indice + 1]);
                return;
              }
              // Lo que no se eligió queda con el primer diseño, así el archivo siempre lo define.
              props.setConfig((x) => ({
                ...x,
                componentes: Object.fromEntries(props.categorias.map((id) => [id, x.componentes[id] ?? RECOMENDADOS[x.proyecto.tipo].componentes[id]?.[0] ?? DISENO_INICIAL[id]]).concat(Object.entries(x.componentes))),
              }));
              props.onSeguir();
            }, 220)
          }
        >
          {ultima ? 'Seguir' : `Siguiente: ${CATEGORIAS[props.categorias[indice + 1]].nombre.toLowerCase()}`}
        </BotonPrincipal>
      </footer>
    </div>
    </GaleriaContexto.Provider>
  );
}
