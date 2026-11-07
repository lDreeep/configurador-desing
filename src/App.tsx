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
import { PanelCajas } from './rapido/PanelCajas';
import { PanelGaleria } from './rapido/PanelGaleria';
import { PanelListo } from './rapido/PanelListo';
import { PanelTipo } from './rapido/PanelTipo';
import { PanelMovimiento } from './rapido/PanelMovimiento';
import { Prototipo } from './rapido/Prototipo';

type Modo = 'rapido' | 'avanzado';
type PasoRapido = 'inicio' | 'tipo' | 'botones' | 'botones_mas' | 'cajas' | 'formularios' | 'navegacion' | 'elementos' | 'datos' | 'movimiento' | 'prototipo' | 'listo';
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
  const [pasoRapido, setPasoRapido] = useState<PasoRapido>('inicio');
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

  const irRapido = (p: PasoRapido) => {
    setPasoRapido(p);
    window.scrollTo({ top: 0 });
  };
  const alAvanzado = (paso: string) => {
    setIndice(Math.max(0, PASOS.findIndex((p) => p.id === paso)));
    setModo('avanzado');
  };

  if (modo === 'rapido') {
    const comun = { config, setConfig };
    // En dashboards y apps web, los datos van antes que los formularios.
    const esDatos = config.proyecto.tipo === 'dashboard' || config.proyecto.tipo === 'app_web';
    const navPrimero = config.proyecto.tipo === 'app_movil' ? (['nav_movil', 'nav_web'] as const) : (['nav_web', 'nav_movil'] as const);
    return (
      <>
        <EstilosVisualesGlobales />
        {pasoRapido === 'inicio' && (
          <Inicio
            config={config}
            onAvanzado={() => setModo('avanzado')}
            onElegir={(k) => {
              // El diseño elegido pasa a ser el de la página, con un botón que combina.
              setConfig((c) => {
                const conEstilo = aplicarCombinacion(c, k);
                return { ...conEstilo, botones: { ...conEstilo.botones, diseno: DISENO_POR_ESTILO[k.estilo] } };
              });
              irRapido('tipo');
            }}
          />
        )}
        {pasoRapido === 'tipo' && <PanelTipo {...comun} onAtras={() => irRapido('inicio')} onSeguir={() => irRapido('botones')} />}
        {pasoRapido === 'botones' && <PanelBotones {...comun} onAtras={() => irRapido('tipo')} onSeguir={() => irRapido('botones_mas')} />}
        {pasoRapido === 'botones_mas' && (
          <PanelGaleria
            {...comun}
            paso="Paso 3 · segunda parte"
            titulo="Combiná tus botones"
            bajada="Casi nunca hay un solo botón: al lado del principal suele ir uno secundario, y en toda app hay botones de icono. Cada secundario aparece junto a tu principal para que veas cuál combina."
            categorias={['boton_sec', 'boton_icono']}
            atras="Volver al botón principal"
            onAtras={() => irRapido('botones')}
            onSeguir={() => irRapido('cajas')}
          />
        )}
        {pasoRapido === 'cajas' && <PanelCajas {...comun} onAtras={() => irRapido('botones_mas')} onSeguir={() => irRapido(esDatos ? 'datos' : 'formularios')} />}
        {pasoRapido === 'formularios' && (
          <PanelGaleria
            {...comun}
            paso="Paso 5"
            titulo="Elegí tus formularios"
            bajada="Campos de texto, selectores tipo slide, interruptores, casillas y deslizadores. Escribí, tocá y arrastrá cada uno: todos usan tus colores y tu letra."
            categorias={['campo', 'selector', 'interruptor', 'casilla', 'deslizador']}
            atras={esDatos ? 'Volver a los datos' : 'Volver a las cajas'}
            onAtras={() => irRapido(esDatos ? 'datos' : 'cajas')}
            onSeguir={() => irRapido('navegacion')}
          />
        )}
        {pasoRapido === 'navegacion' && (
          <PanelGaleria
            {...comun}
            paso="Paso 6"
            titulo="Elegí tu navegación"
            bajada={
              config.proyecto.tipo === 'app_movil'
                ? 'Como es una app para celular, arrancamos por las barras inferiores. Tocá las pestañas para ver cómo marcan la activa.'
                : 'Barras superiores, flotantes y menús laterales, y también las barras inferiores para cuando se vea en el celular.'
            }
            categorias={[...navPrimero]}
            atras="Volver a los formularios"
            onAtras={() => irRapido('formularios')}
            onSeguir={() => irRapido('elementos')}
          />
        )}
        {pasoRapido === 'elementos' && (
          <PanelGaleria
            {...comun}
            paso="Paso 7"
            titulo="Elegí los detalles"
            bajada="Las piezas chicas que aparecen en toda app: etiquetas, avisos, cargas, progreso, preguntas frecuentes, avatares, ayudas y ventanas."
            categorias={['etiqueta', 'aviso', 'cargando', 'progreso', 'acordeon', 'avatar', 'tooltip', 'modal']}
            atras="Volver a la navegación"
            onAtras={() => irRapido('navegacion')}
            onSeguir={() => irRapido(esDatos ? 'movimiento' : 'datos')}
          />
        )}
        {pasoRapido === 'datos' && (
          <PanelGaleria
            {...comun}
            paso={esDatos ? 'Paso 5' : 'Paso 8'}
            titulo="Elegí cómo mostrar datos"
            bajada="Tarjetas de métricas, gráficos y tablas para dashboards y estadísticas. Pasá el mouse por los gráficos para ver cada dato."
            categorias={['metrica', 'grafico', 'tabla']}
            atras={esDatos ? 'Volver a las cajas' : 'Volver a los detalles'}
            onAtras={() => irRapido(esDatos ? 'cajas' : 'elementos')}
            onSeguir={() => irRapido(esDatos ? 'formularios' : 'movimiento')}
          />
        )}
        {pasoRapido === 'movimiento' && (
          <PanelMovimiento {...comun} paso="Paso 9" onAtras={() => irRapido(esDatos ? 'elementos' : 'datos')} onSeguir={() => irRapido('prototipo')} />
        )}
        {pasoRapido === 'prototipo' && (
          <Prototipo {...comun} onAtras={() => irRapido('movimiento')} onListo={() => irRapido('listo')} />
        )}
        {pasoRapido === 'listo' && (
          <PanelListo config={config} onAtras={() => irRapido('prototipo')} onAvanzado={() => alAvanzado('exportar')} onInicio={() => irRapido('inicio')} />
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
