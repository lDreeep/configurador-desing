import { useMemo, useState } from 'react';
import type { Config } from '../tipos';
import { Pagina } from './Pagina';
import { Esquema } from './esquemas';
import { aplicarPreset, PRESETS } from './presets';
import './simple.css';

export function InicioSimple({ config, onElegir, onAvanzado, onDetallado }: {
  config: Config; onElegir: (config: Config) => void; onAvanzado: () => void; onDetallado: () => void;
}) {
  const [indice, setIndice] = useState(0);
  const [verTodas, setVerTodas] = useState(false);
  const preset = PRESETS[indice];
  const muestra = useMemo(() => aplicarPreset(config, preset), [config, preset]);
  const mover = (delta: number) => setIndice(i => (i + delta + PRESETS.length) % PRESETS.length);
  return <div className="simple-inicio">
    <header className="simple-cabecera">
      <a href="#contenido-simple" className="simple-saltar">Saltar al diseño</a>
      <div><span className="simple-marca">Configurador</span><h1>Elegí una combinación. Hacela tuya.</h1>
      <p>Todo ya combina. Probalo y cambiá solamente lo que quieras.</p></div>
      <div className="simple-acciones"><button type="button" onClick={onDetallado}>Elegir paso a paso</button>
      <button type="button" onClick={onAvanzado}>Configuración avanzada</button></div>
    </header>
    <section className="simple-selector" aria-label="Combinaciones preparadas">
      <div aria-live="polite" aria-atomic="true"><span>{indice + 1} de {PRESETS.length}</span>
      <h2>{preset.nombre}</h2><p>{preset.descripcion}</p></div>
      <div className="simple-acciones">
        <button type="button" aria-label="Combinación anterior" onClick={() => mover(-1)}>Anterior</button>
        <button type="button" aria-label="Combinación siguiente" onClick={() => mover(1)}>Siguiente</button>
        <button type="button" aria-expanded={verTodas} onClick={() => setVerTodas(!verTodas)}>Ver todas</button>
        <button type="button" className="simple-principal" onClick={() => onElegir(muestra)}>Probar esta combinación</button>
      </div>
    </section>
    {verTodas && <div className="simple-presets" role="group" aria-label="Todas las combinaciones">
      {PRESETS.map((p, i) => <button key={p.id} type="button" aria-pressed={indice === i}
        onClick={() => { setIndice(i); setVerTodas(false); }}>
        <Esquema id={p.layout} /><strong>{p.nombre}</strong><span>{p.descripcion}</span>
      </button>)}
    </div>}
    <div id="contenido-simple" className="simple-preview"><Pagina config={muestra} /></div>
  </div>;
}
