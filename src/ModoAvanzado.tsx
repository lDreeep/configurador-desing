// Modo avanzado: todos los pasos con su vista previa al costado. Se carga solo si se usa.

import { useEffect, useRef, useState } from 'react';
import { NotaPaso } from './componentes/ui';
import EstilosGaleria from './galeria/EstilosGaleria';
import { PASOS } from './pasos/pasos';
import { Preview } from './preview/Preview';
import { EstilosVisualesGlobales } from './rapido/Pagina';
import type { Config } from './tipos';

export default function ModoAvanzado(props: {
  config: Config;
  setConfig: (fn: (c: Config) => Config) => void;
  reiniciar: () => void;
  pasoInicial: string;
  onRapido: () => void;
}) {
  const { config, setConfig, reiniciar } = props;
  const [indice, setIndice] = useState(() => Math.max(0, PASOS.findIndex((p) => p.id === props.pasoInicial)));
  const panel = useRef<HTMLElement>(null);
  const paso = PASOS[indice];
  const Componente = paso.componente;

  useEffect(() => {
    panel.current?.scrollTo({ top: 0 });
  }, [indice]);

  const ir = (i: number) => setIndice(Math.max(0, Math.min(PASOS.length - 1, i)));
  const progreso = Math.round(((indice + 1) / PASOS.length) * 100);

  return (
    <div className="app">
      <EstilosVisualesGlobales />
      <EstilosGaleria />
      <header className="cabecera">
        <div>
          <h1>Armá el diseño de tu app</h1>
          <p>
            Modo avanzado · paso {indice + 1} de {PASOS.length} · se guarda solo en este navegador
          </p>
        </div>
        <div className="cabecera-derecha">
          <div
            className="progreso"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progreso}
            aria-label="Progreso"
          >
            <div style={{ width: `${progreso}%` }} />
          </div>
          <button
            type="button"
            className="boton secundario"
            onClick={props.onRapido}
          >
            Modo rápido
          </button>
          <button
            type="button"
            className="boton fantasma"
            onClick={() => {
              if (window.confirm('¿Empezar de cero? Se borra todo lo que elegiste.')) {
                reiniciar();
                setIndice(0);
              }
            }}
          >
            Empezar de cero
          </button>
        </div>
      </header>

      <div className="cuerpo">
        <nav className="pasos" aria-label="Pasos">
          <ol>
            {PASOS.map((p, i) => (
              <li key={p.id}>
                <button type="button" aria-current={i === indice ? 'step' : undefined} onClick={() => ir(i)}>
                  <span className="paso-num">{i + 1}</span>
                  <span className="paso-texto">
                    <span className="paso-nombre">{p.nombre}</span>
                    <span className="paso-resumen">{p.resumen(config)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <main className="panel" ref={panel}>
          <Componente config={config} setConfig={setConfig} />
          {paso.placeholderNota && (
            <NotaPaso
              valor={config.notas[paso.id] ?? ''}
              placeholder={paso.placeholderNota}
              onCambiar={(v) => setConfig((c) => ({ ...c, notas: { ...c.notas, [paso.id]: v } }))}
            />
          )}
          <div className="navegacion-pasos">
            {indice > 0 && (
              <button type="button" className="boton secundario" onClick={() => ir(indice - 1)}>
                Atrás
              </button>
            )}
            <span className="espaciador" />
            {indice < PASOS.length - 1 && (
              <button type="button" className="boton primario" onClick={() => ir(indice + 1)}>
                {indice === PASOS.length - 2 ? 'Ver mi DESIGN.md' : 'Siguiente'}
              </button>
            )}
          </div>
        </main>

        <aside className="lateral-preview">
          <Preview config={config} />
        </aside>
      </div>
    </div>
  );
}
