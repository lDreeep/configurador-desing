import { useEffect, useRef, useState } from 'react';
import { NotaPaso } from './componentes/ui';
import { useConfig } from './estado';
import { PASOS } from './pasos/pasos';
import { Preview } from './preview/Preview';
import { DISENO_POR_ESTILO } from './botones-disenos';
import { aplicarCombinacion } from './rapido/combinar';
import { Inicio } from './rapido/Inicio';
import { EstilosVisualesGlobales } from './rapido/Pagina';
import { PanelBotones } from './rapido/PanelBotones';

type Modo = 'rapido' | 'avanzado';
const CLAVE_MODO = 'configurador-diseno:modo';

function leerModo(): Modo {
  try {
    return localStorage.getItem(CLAVE_MODO) === 'avanzado' ? 'avanzado' : 'rapido';
  } catch {
    return 'rapido';
  }
}

export function App() {
  const { config, setConfig, reiniciar } = useConfig();
  const [modo, setModoEstado] = useState<Modo>(leerModo);
  const [indice, setIndice] = useState(0);
  const [pasoRapido, setPasoRapido] = useState<'inicio' | 'botones'>('inicio');
  const panel = useRef<HTMLElement>(null);
  const paso = PASOS[indice];
  const Componente = paso.componente;

  const setModo = (m: Modo) => {
    setModoEstado(m);
    try {
      localStorage.setItem(CLAVE_MODO, m);
    } catch {
      // sin almacenamiento: el modo dura la sesión
    }
  };

  useEffect(() => {
    panel.current?.scrollTo({ top: 0 });
  }, [indice]);

  const ir = (i: number) => setIndice(Math.max(0, Math.min(PASOS.length - 1, i)));
  const progreso = Math.round(((indice + 1) / PASOS.length) * 100);

  if (modo === 'rapido') {
    return (
      <>
        <EstilosVisualesGlobales />
        {pasoRapido === 'inicio' ? (
          <Inicio
            config={config}
            onAvanzado={() => setModo('avanzado')}
            onComenzar={(k) => {
              // El diseño que estaba a la vista pasa a ser el de la página, con un botón que combina.
              setConfig((c) => {
                const conEstilo = aplicarCombinacion(c, k);
                return { ...conEstilo, botones: { ...conEstilo.botones, diseno: DISENO_POR_ESTILO[k.estilo] } };
              });
              setPasoRapido('botones');
              window.scrollTo({ top: 0 });
            }}
          />
        ) : (
          <PanelBotones
            config={config}
            setConfig={setConfig}
            onAtras={() => setPasoRapido('inicio')}
            onSeguir={() => {
              // Hasta que estén los próximos paneles, se sigue en el modo avanzado desde el movimiento.
              setIndice(PASOS.findIndex((p) => p.id === 'movimiento'));
              setModo('avanzado');
            }}
          />
        )}
      </>
    );
  }

  return (
    <div className="app">
      <EstilosVisualesGlobales />
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
            onClick={() => {
              setPasoRapido('inicio');
              setModo('rapido');
            }}
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
