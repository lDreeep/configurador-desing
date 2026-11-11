// Paso «Tu UI»: todas las piezas a la vez, en una pantalla larga ordenada por secciones, armadas
// como un paquete coherente (una familia). Con un clic cambia todo a otra combinación que también
// combina. Se puede tocar todo: botones, formularios, selectores, menús.

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { CAJAS, clasesDeCaja, tokensDeCaja } from '../cajas';
import { BotonPrincipal } from '../componentes/BotonPrincipal';
import { sistemaDeDiseno } from '../export/sistema';
import { aplicarPaquete, FAMILIAS, paqueteN } from '../familias';
import { CATEGORIAS, type CategoriaId } from '../galeria';
import { claseDe, GaleriaContexto } from '../galeria/base';
import type { Config } from '../tipos';
import { usePaso } from './BarraPasos';
import './panel-paquete.css';

/** Piezas chicas: en el celular van de a dos por fila. */
const CHICAS: CategoriaId[] = ['boton_icono', 'interruptor', 'casilla', 'avatar', 'etiqueta', 'tooltip', 'cargando', 'progreso', 'deslizador', 'metrica'];
const ANCHOS: CategoriaId[] = ['nav_web', 'pie', 'tabla', 'formulario', 'acceso', 'wizard', 'reserva'];

// El orden de las piezas en el mosaico: lo principal primero, después por familia.
const SECCIONES: { titulo: string; ayuda: string; cats: CategoriaId[] }[] = [
  { titulo: 'Botones', ayuda: 'Tocalos: cada uno responde a su manera.', cats: ['boton_sec', 'boton_icono'] },
  { titulo: 'Formularios', ayuda: 'Escribí, deslizá y elegí: todo funciona.', cats: ['formulario', 'acceso', 'campo', 'selector', 'desplegable', 'buscador', 'interruptor', 'casilla', 'deslizador', 'calendario', 'subir', 'wizard', 'reserva'] },
  { titulo: 'Navegación', ayuda: 'Las barras para la compu y para el celular, y todo lo que ayuda a moverse.', cats: ['nav_web', 'nav_movil', 'migas', 'paginacion', 'pasos', 'notificaciones', 'usuario', 'pie'] },
  { titulo: 'Datos', ayuda: 'Para paneles y estadísticas.', cats: ['metrica', 'grafico', 'tabla'] },
  { titulo: 'Contenido', ayuda: 'Tarjetas, avisos, ventanas y los detalles chicos.', cats: ['producto', 'carrusel', 'acordeon', 'etiqueta', 'avatar', 'tooltip', 'aviso', 'modal', 'cargando', 'progreso', 'vacio'] },
];

/** Alto de cada fila del mosaico y espacio entre piezas, en px (iguales a los del CSS). */
const FILA = 4;
const HUECO = 12;

/**
 * Mosaico que encastra: cada pieza mide su alto real y ocupa justo esas filas de una grilla de 4px,
 * con `grid-auto-flow: dense`, así las piezas chicas rellenan el lugar al lado de las grandes y no
 * quedan huecos. Si una pieza cambia de alto (un acordeón que se abre), se vuelve a medir.
 */
function Mosaico({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const g = ref.current;
    if (!g) return;
    const ajustar = (el: HTMLElement) => {
      const h = el.getBoundingClientRect().height;
      el.style.gridRowEnd = `span ${Math.max(1, Math.ceil((h + HUECO) / (FILA + HUECO)))}`;
    };
    const items = Array.from(g.children) as HTMLElement[];
    items.forEach(ajustar);
    const ro = new ResizeObserver((entradas) => entradas.forEach((e) => ajustar(e.target as HTMLElement)));
    items.forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  });
  return (
    <div className="pq-grilla pq-mosaico" ref={ref}>
      {children}
    </div>
  );
}

export function PanelPaquete(props: { config: Config; setConfig: (fn: (c: Config) => Config) => void; onAtras: () => void; onSeguir: () => void; onDetallado: () => void }) {
  const paso = usePaso();
  const estiloId = props.config.visual.estilo;
  const [n, setN] = useState(0);
  const pq = useMemo(() => paqueteN(estiloId, n), [estiloId, n]);
  const c = useMemo(() => aplicarPaquete(props.config, pq), [props.config, pq]);
  const s = sistemaDeDiseno(c);
  const estilo = estiloId !== 'clasico' ? `estilo-${estiloId}` : '';
  const fam = FAMILIAS[pq.familia];
  const caja = CAJAS[pq.caja];

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input, textarea, select, [role="radiogroup"], [role="slider"]')) return;
      if (e.key === 'ArrowRight') setN((x) => x + 1);
      if (e.key === 'ArrowLeft') setN((x) => Math.max(0, x - 1));
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, []);

  return (
    <GaleriaContexto.Provider value={c}>
      <div className={`panel-botones panel-paquete pg ${estilo}`} style={s.tokens as CSSProperties}>
        <div className="pb-contenido">
          <header className="pb-cabecera">
            <span className="pg-etiqueta">{paso}</span>
            <h1 className="pg-titulo">Elegí tu UI completa</h1>
            <p className="pg-bajada">
              Acá está todo junto: botones, formularios, navegación, tarjetas y datos, armados para que combinen con tu diseño. Probalo y, si no te convence, tocá
              «Otra combinación»: cambia todo a la vez. Después vas a poder retocar cualquier pieza en el prototipo.
            </p>
          </header>

          <div className="pq-cuerpo" key={n}>
            <h2 className="au-oculto">Todas las piezas</h2>
            <Mosaico>
              <div className="pq-item">
                <span className="pq-etq">Botón principal</span>
                <div className="pq-muestra pq-botones">
                  <BotonPrincipal config={c}>Empezar ahora</BotonPrincipal>
                  <BotonPrincipal config={c}>Guardar</BotonPrincipal>
                </div>
              </div>
              <div className="pq-item pq-ancho-2">
                <span className="pq-etq">Cajas · {caja.nombre}</span>
                <div className="pq-muestra pq-cajas">
                  {['Plan Pro', 'Plan Equipo'].map((t) => (
                    <span key={t} className={clasesDeCaja(caja.params)} style={tokensDeCaja(caja.params, s.paleta, s.radio.medio) as CSSProperties}>
                      <span className="pc-tit">{t}</span>
                      <span className="pc-txt">Todo lo que necesitás para empezar, en un solo lugar.</span>
                    </span>
                  ))}
                </div>
              </div>
              {SECCIONES.flatMap((sec) =>
                sec.cats.map((cat) => {
                  const C = CATEGORIAS[cat];
                  const id = pq.componentes[cat]!;
                  return (
                    <div key={cat} className={`pq-item ${C.anchoCelda >= 440 || ANCHOS.includes(cat) ? 'pq-ancho-2' : ''} ${CHICAS.includes(cat) ? 'pq-chica' : ''}`} style={{ '--w': `${C.anchoCelda}px` } as CSSProperties}>
                      <span className="pq-etq">
                        {C.nombre} · {C.disenos[id].nombre}
                      </span>
                      <div className="pg-muestra pq-muestra">
                        <C.Muestra clase={claseDe(cat, id)} id={id} />
                      </div>
                    </div>
                  );
                }),
              )}
            </Mosaico>

            <p className="pq-detallado">
              ¿Preferís elegir cada pieza por separado?{' '}
              <button type="button" onClick={props.onDetallado}>
                Usar el modo detallado
              </button>
            </p>
          </div>
        </div>

        <footer className="pb-pie pq-pie">
          <button type="button" className="pb-pie-atras" onClick={props.onAtras}>
            Volver
          </button>
          <div className="pq-control" role="group" aria-label="Cambiar de combinación">
            <button type="button" className="pq-flecha" aria-label="Combinación anterior" disabled={n === 0} onClick={() => setN(n - 1)}>
              ‹
            </button>
            <span className="pq-nombre" aria-live="polite">
              <b>{fam.nombre}</b>
              <small>{fam.descripcion}</small>
            </span>
            <button type="button" className="pq-otra" onClick={() => setN(n + 1)}>
              Otra combinación ›
            </button>
          </div>
          <BotonPrincipal
            config={c}
            onClick={() =>
              window.setTimeout(() => {
                props.setConfig((x) => aplicarPaquete(x, pq));
                props.onSeguir();
              }, 200)
            }
          >
            Elegir esta
          </BotonPrincipal>
        </footer>
      </div>
    </GaleriaContexto.Provider>
  );
}
