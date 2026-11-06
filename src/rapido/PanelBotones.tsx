// Modo rápido, paso 2: panel grande de botones para tocar y elegir.
// Usa los colores, la letra y el estilo de la página elegida en el inicio.

import { useState, type CSSProperties } from 'react';
import { BOTONES, CATEGORIAS_BOTON, type CategoriaBoton, EFECTOS_TOQUE } from '../botones-disenos';
import { TAMANOS_BOTON } from '../catalogo';
import { BotonPrincipal } from '../componentes/BotonPrincipal';
import { sistemaDeDiseno } from '../export/sistema';
import type { BotonDisenoId, BotonIcono, BotonTamano, Config } from '../tipos';

const COLORES: { id: string; nombre: string }[] = [
  { id: 'acento', nombre: 'Acento de la paleta' },
  { id: 'texto', nombre: 'Monocromo' },
  { id: '#2F5BFF', nombre: 'Azul' },
  { id: '#7C3AED', nombre: 'Violeta' },
  { id: '#DB2777', nombre: 'Rosa' },
  { id: '#EA580C', nombre: 'Naranja' },
  { id: '#16A34A', nombre: 'Verde' },
  { id: '#0891B2', nombre: 'Turquesa' },
];

export function Segmentado<T extends string>(props: { etiqueta: string; opciones: [T, string][]; valor: T; onElegir: (v: T) => void }) {
  return (
    <div className="pb-grupo">
      <span className="pb-etiqueta">{props.etiqueta}</span>
      <div className="pb-segmentado" role="group" aria-label={props.etiqueta}>
        {props.opciones.map(([id, nombre]) => (
          <button key={id} type="button" aria-pressed={props.valor === id} onClick={() => props.onElegir(id)}>
            {nombre}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PanelBotones(props: {
  config: Config;
  setConfig: (fn: (c: Config) => Config) => void;
  onAtras: () => void;
  onSeguir: () => void;
}) {
  const c = props.config;
  const s = sistemaDeDiseno(c);
  const [cat, setCat] = useState<CategoriaBoton | 'todas'>('todas');
  const setB = (cambio: Partial<Config['botones']>) => props.setConfig((x) => ({ ...x, botones: { ...x.botones, ...cambio } }));
  const ids = (Object.keys(BOTONES) as BotonDisenoId[]).filter((id) => cat === 'todas' || BOTONES[id].categoria === cat);
  const elegido = c.botones.diseno;
  const colorMuestra = (id: string) => (id === 'acento' ? s.paleta.roles.acento : id === 'texto' ? s.paleta.roles.texto : id);
  const estilo = c.visual.estilo !== 'clasico' ? `estilo-${c.visual.estilo}` : '';

  return (
    <div className={`panel-botones pg ${estilo}`} style={s.tokens as CSSProperties}>
      <div className="pb-contenido">
        <header className="pb-cabecera">
          <span className="pg-etiqueta">Paso 3</span>
          <h1 className="pg-titulo">Elegí tus botones</h1>
          <p className="pg-bajada">
            Tocá cualquiera para ver cómo responde. Todos usan los colores y la letra de la página que elegiste; abajo de cada uno dice qué hace al tocarlo.
          </p>
        </header>

        <section className="pb-ajustes" aria-label="Ajustes de los botones">
          <div className="pb-grupo">
            <span className="pb-etiqueta">Color</span>
            <div className="pb-colores" role="group" aria-label="Color de los botones">
              {COLORES.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  className="pb-color"
                  aria-pressed={c.botones.color === x.id}
                  aria-label={x.nombre}
                  title={x.nombre}
                  style={{ background: colorMuestra(x.id) }}
                  onClick={() => setB({ color: x.id })}
                />
              ))}
            </div>
          </div>
          <Segmentado<BotonTamano>
            etiqueta="Tamaño"
            opciones={(Object.keys(TAMANOS_BOTON) as BotonTamano[]).map((t) => [t, TAMANOS_BOTON[t].nombre])}
            valor={c.botones.tamano}
            onElegir={(tamano) => setB({ tamano })}
          />
          <Segmentado<BotonIcono>
            etiqueta="Icono"
            opciones={[
              ['ninguno', 'Sin icono'],
              ['izquierda', 'Izquierda'],
              ['derecha', 'Derecha'],
            ]}
            valor={c.botones.icono}
            onElegir={(icono) => setB({ icono })}
          />
          <Segmentado<'no' | 'si'>
            etiqueta="Mayúsculas"
            opciones={[
              ['no', 'No'],
              ['si', 'Sí'],
            ]}
            valor={c.botones.mayusculas ? 'si' : 'no'}
            onElegir={(v) => setB({ mayusculas: v === 'si' })}
          />
        </section>

        <div className="pb-filtros" role="group" aria-label="Filtrar botones">
          {([['todas', 'Todos'], ...Object.entries(CATEGORIAS_BOTON)] as [CategoriaBoton | 'todas', string][]).map(([id, nombre]) => (
            <button key={id} type="button" aria-pressed={cat === id} onClick={() => setCat(id)}>
              {nombre}
            </button>
          ))}
        </div>

        <div className="pb-grilla">
          {ids.map((id) => {
            const b = BOTONES[id];
            const sel = elegido === id;
            return (
              <div key={id} className={`pb-celda pg-card ${sel ? 'elegida' : ''}`}>
                <div className="pb-muestra">
                  <BotonPrincipal config={c} diseno={id} presionado={sel} etiqueta={`${b.nombre}: elegir este botón`} onClick={() => setB({ diseno: id })}>
                    Comenzar
                  </BotonPrincipal>
                </div>
                <div className="pb-info">
                  <span className="pg-card-titulo">{b.nombre}</span>
                  <span className="pb-desc">{b.descripcion}</span>
                  <span className="pb-efecto">Al tocar: {EFECTOS_TOQUE[b.efecto].toLowerCase()}</span>
                </div>
                {sel && (
                  <span className="pb-sello" aria-hidden="true">
                    Elegido
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <footer className="pb-pie">
        <button type="button" className="pb-pie-atras" onClick={props.onAtras}>
          Volver al inicio
        </button>
        <span className="pb-pie-estado" aria-live="polite">
          {elegido !== 'ninguno' ? `Elegido: ${BOTONES[elegido].nombre}` : 'Tocá un botón para elegirlo'}
        </span>
        <BotonPrincipal config={c} onClick={() => window.setTimeout(props.onSeguir, 220)}>
          Seguir
        </BotonPrincipal>
      </footer>
    </div>
  );
}
