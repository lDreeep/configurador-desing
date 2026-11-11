import { lazy, Suspense, useEffect, useState } from 'react';
import { useConfig } from './estado';
import { useUbicacion } from './navegacion';
const Molde = lazy(() => import('./molde/Molde').then((m) => ({ default: m.Molde })));
export function App() {
  const { config, setConfig, reiniciar } = useConfig();
  const [codigo] = useState(() => window.location.hash.match(/^#c=([+~]?[0-9a-z]+)$/i)?.[1]);
  useEffect(() => {
    if (!codigo) return;
    let activo = true;
    void import('./rapido/combinar').then(({ decodificar, aplicarCombinacion }) => {
      const combinacion = decodificar(codigo);
      if (activo && combinacion) setConfig((c) => aplicarCombinacion(c, combinacion));
    });
    return () => { activo = false; };
  }, [codigo, setConfig]);
  const { ubicacion, ir } = useUbicacion();
  return <Suspense fallback={<div className="cargando-panel" role="status">Cargando…</div>}>
    <Molde config={config} setConfig={setConfig} reiniciar={reiniciar} paso={ubicacion.paso}
      ir={(paso, atras, reemplazar) => ir({ modo: 'molde', paso, detallado: false }, atras, reemplazar)} />
  </Suspense>;
}
