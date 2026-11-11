import { lazy, Suspense, useEffect } from 'react';
import { DISENO_POR_ESTILO } from './botones-disenos';
import { useConfig } from './estado';
import { BarraPasos, PasoContexto } from './rapido/BarraPasos';
import { aplicarCombinacion } from './rapido/combinar';
import { Inicio } from './rapido/Inicio';
import { EstilosVisualesGlobales } from './rapido/Pagina';
import { useUbicacion, type PasoRapido } from './navegacion';

// La portada carga sola; el resto se descarga aparte (y en segundo plano mientras se mira la portada).
const cargar = {
  tipo: () => import('./rapido/PanelTipo'),
  botones: () => import('./rapido/PanelBotones'),
  cajas: () => import('./rapido/PanelCajas'),
  galeria: () => import('./rapido/PanelGaleria'),
  movimiento: () => import('./rapido/PanelMovimiento'),
  prototipo: () => import('./rapido/Prototipo'),
  paquete: () => import('./rapido/PanelPaquete'),
  listo: () => import('./rapido/PanelListo'),
  estilosGaleria: () => import('./galeria/EstilosGaleria'),
  avanzado: () => import('./ModoAvanzado'),
};
const PanelTipo = lazy(() => cargar.tipo().then((m) => ({ default: m.PanelTipo })));
const PanelBotones = lazy(() => cargar.botones().then((m) => ({ default: m.PanelBotones })));
const PanelCajas = lazy(() => cargar.cajas().then((m) => ({ default: m.PanelCajas })));
const PanelGaleria = lazy(() => cargar.galeria().then((m) => ({ default: m.PanelGaleria })));
const PanelMovimiento = lazy(() => cargar.movimiento().then((m) => ({ default: m.PanelMovimiento })));
const PanelPaquete = lazy(() => cargar.paquete().then((m) => ({ default: m.PanelPaquete })));
const Prototipo = lazy(() => cargar.prototipo().then((m) => ({ default: m.Prototipo })));
const PanelListo = lazy(() => cargar.listo().then((m) => ({ default: m.PanelListo })));
const EstilosGaleria = lazy(cargar.estilosGaleria);
const ModoAvanzado = lazy(cargar.avanzado);

function Cargando() {
  return (
    <div className="cargando-panel" role="status">
      Cargando…
    </div>
  );
}

export function App() {
  const { config, setConfig, reiniciar } = useConfig();
  // Modo, paso y recorrido viven en la URL (#/rapido/tipo) y en localStorage: ver navegacion.ts.
  const { ubicacion, atras: volviendo, ir } = useUbicacion();
  const modo = ubicacion.modo;
  const pasoRapido = (modo === 'rapido' ? ubicacion.paso : 'inicio') as PasoRapido;
  // Recorrido simple (diseño → proyecto → tu UI → prototipo) o detallado (pieza por pieza).
  const detallado = ubicacion.detallado;

  // Al volver a un paso con pestañas, se entra por la última (la que se vio justo antes).
  const irRapido = (p: PasoRapido, atras = false, conDetalle = detallado) => {
    ir({ modo: 'rapido', paso: p, detallado: p === 'inicio' ? false : conDetalle }, atras);
    window.scrollTo({ top: 0 });
  };
  const alAvanzado = (paso: string) => ir({ modo: 'avanzado', paso, detallado: false });

  // Mientras se mira la portada, se bajan en segundo plano los pasos siguientes.
  useEffect(() => {
    const t = window.setTimeout(() => {
      for (const k of ['tipo', 'paquete', 'botones', 'cajas', 'galeria', 'estilosGaleria', 'movimiento', 'prototipo', 'listo'] as const) void cargar[k]();
    }, 2500);
    return () => window.clearTimeout(t);
  }, []);

  if (modo === 'rapido') {
    const comun = { config, setConfig };
    // En dashboards y apps web, los datos van antes que los formularios.
    const esDatos = config.proyecto.tipo === 'dashboard' || config.proyecto.tipo === 'app_web';
    const navPrimero = config.proyecto.tipo === 'app_movil' ? (['nav_movil', 'nav_web'] as const) : (['nav_web', 'nav_movil'] as const);
    // El orden de los pasos depende del tipo de proyecto; la numeración sale de acá.
    const NOMBRES: Record<PasoRapido, string> = {
      inicio: 'Diseño', tipo: 'Proyecto', botones: 'Botón principal', botones_mas: 'Más botones', cajas: 'Cajas',
      formularios: 'Formularios', navegacion: 'Navegación', elementos: 'Detalles', datos: 'Datos',
      movimiento: 'Movimiento', paquete: 'Tu UI', prototipo: 'Prototipo', listo: 'Descargar',
    };
    const orden: PasoRapido[] = !detallado ? ['inicio', 'tipo', 'paquete', 'prototipo', 'listo'] : [
      'inicio', 'tipo', 'botones', 'botones_mas', 'cajas',
      ...(esDatos ? (['datos', 'formularios', 'navegacion', 'elementos'] as const) : (['formularios', 'navegacion', 'elementos', 'datos'] as const)),
      'movimiento', 'prototipo', 'listo',
    ];
    const pasos = orden.map((id) => ({ id, nombre: NOMBRES[id] }));
    const n = orden.indexOf(pasoRapido);
    const etiqueta = pasoRapido === 'listo' ? `Último paso · ${n + 1} de ${orden.length}` : `Paso ${n + 1} de ${orden.length} · ${NOMBRES[pasoRapido]}`;
    return (
      <PasoContexto.Provider value={etiqueta}>
      <div className={`rapido ${pasoRapido === 'prototipo' ? 'rapido-alto-fijo' : ''}`}>
        <EstilosVisualesGlobales />
        {pasoRapido !== 'inicio' && <BarraPasos config={config} pasos={pasos} actual={pasoRapido} onIr={(p) => irRapido(p, orden.indexOf(p) < n)} />}
        <main className="rapido-main">
        <Suspense fallback={<Cargando />}>
        {pasoRapido !== 'inicio' && <EstilosGaleria />}
        {pasoRapido === 'inicio' && (
          <Inicio
            config={config}
            onAvanzado={() => alAvanzado('proyecto')}
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
        {pasoRapido === 'tipo' && <PanelTipo {...comun} onAtras={() => irRapido('inicio', true)} onSeguir={() => irRapido(detallado ? 'botones' : 'paquete')} />}
        {pasoRapido === 'paquete' && (
          <PanelPaquete
            {...comun}
            onAtras={() => irRapido('tipo', true)}
            onSeguir={() => irRapido('prototipo')}
            onDetallado={() => irRapido('botones', false, true)}
          />
        )}
        {pasoRapido === 'botones' && <PanelBotones {...comun} onAtras={() => irRapido('tipo', true)} onSeguir={() => irRapido('botones_mas')} />}
        {pasoRapido === 'botones_mas' && (
          <PanelGaleria
            {...comun}
            alFinal={volviendo}
            titulo="Combiná tus botones"
            bajada="Casi nunca hay un solo botón: al lado del principal suele ir uno secundario, y en toda app hay botones de icono. Cada secundario aparece junto a tu principal para que veas cuál combina."
            categorias={['boton_sec', 'boton_icono']}
            atras="Volver al botón principal"
            onAtras={() => irRapido('botones', true)}
            onSeguir={() => irRapido('cajas')}
          />
        )}
        {pasoRapido === 'cajas' && <PanelCajas {...comun} onAtras={() => irRapido('botones_mas', true)} onSeguir={() => irRapido(esDatos ? 'datos' : 'formularios')} />}
        {pasoRapido === 'formularios' && (
          <PanelGaleria
            {...comun}
            alFinal={volviendo}
            titulo="Elegí tus formularios"
            bajada="Primero el formulario completo (cómo se ve una pantalla para cargar datos), después cada pieza: campos, selectores, menús, buscadores, calendarios, interruptores, casillas, deslizadores y subida de archivos."
            categorias={['formulario', 'acceso', 'wizard', 'reserva', 'campo', 'selector', 'desplegable', 'buscador', 'calendario', 'interruptor', 'casilla', 'deslizador', 'subir']}
            atras={esDatos ? 'Volver a los datos' : 'Volver a las cajas'}
            onAtras={() => irRapido(esDatos ? 'datos' : 'cajas', true)}
            onSeguir={() => irRapido('navegacion')}
          />
        )}
        {pasoRapido === 'navegacion' && (
          <PanelGaleria
            {...comun}
            alFinal={volviendo}
            titulo="Elegí tu navegación"
            bajada={
              config.proyecto.tipo === 'app_movil'
                ? 'Como es una app para celular, arrancamos por las barras inferiores. Tocá las pestañas para ver cómo marcan la activa.'
                : 'Barras superiores, flotantes y menús laterales, y también las barras inferiores para cuando se vea en el celular.'
            }
            categorias={[...navPrimero, 'migas', 'paginacion', 'pasos', 'notificaciones', 'usuario', 'pie']}
            atras="Volver a los formularios"
            onAtras={() => irRapido('formularios', true)}
            onSeguir={() => irRapido('elementos')}
          />
        )}
        {pasoRapido === 'elementos' && (
          <PanelGaleria
            {...comun}
            alFinal={volviendo}
            titulo="Elegí los detalles"
            bajada="Las piezas chicas que aparecen en toda app: etiquetas, avisos, cargas, progreso, preguntas frecuentes, avatares, ayudas y ventanas."
            categorias={['etiqueta', 'aviso', 'cargando', 'progreso', 'acordeon', 'avatar', 'tooltip', 'modal', 'vacio', 'carrusel', 'producto']}
            atras="Volver a la navegación"
            onAtras={() => irRapido('navegacion', true)}
            onSeguir={() => irRapido(esDatos ? 'movimiento' : 'datos')}
          />
        )}
        {pasoRapido === 'datos' && (
          <PanelGaleria
            {...comun}
            alFinal={volviendo}
            titulo="Elegí cómo mostrar datos"
            bajada="Tarjetas de métricas, gráficos y tablas para dashboards y estadísticas. Pasá el mouse por los gráficos para ver cada dato."
            categorias={['metrica', 'grafico', 'tabla']}
            atras={esDatos ? 'Volver a las cajas' : 'Volver a los detalles'}
            onAtras={() => irRapido(esDatos ? 'cajas' : 'elementos', true)}
            onSeguir={() => irRapido(esDatos ? 'formularios' : 'movimiento')}
          />
        )}
        {pasoRapido === 'movimiento' && (
          <PanelMovimiento {...comun} onAtras={() => irRapido(esDatos ? 'elementos' : 'datos', true)} onSeguir={() => irRapido('prototipo')} />
        )}
        {pasoRapido === 'prototipo' && (
          <Prototipo {...comun} onAtras={() => irRapido(detallado ? 'movimiento' : 'paquete', true)} onListo={() => irRapido('listo')} />
        )}
        {pasoRapido === 'listo' && (
          <PanelListo config={config} onAtras={() => irRapido('prototipo', true)} onAvanzado={() => alAvanzado('exportar')} onInicio={() => irRapido('inicio')} />
        )}
        </Suspense>
        </main>
      </div>
      </PasoContexto.Provider>
    );
  }

  return (
    <Suspense fallback={<Cargando />}>
      <ModoAvanzado
        config={config}
        setConfig={setConfig}
        reiniciar={reiniciar}
        paso={ubicacion.paso}
        onPaso={alAvanzado}
        onRapido={() => irRapido('inicio')}
      />
    </Suspense>
  );
}
