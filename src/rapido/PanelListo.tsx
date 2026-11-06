// Modo rápido, último paso: resumen y descarga del DESIGN.md, sin pasar por el modo avanzado.

import { useMemo, useState, type CSSProperties } from 'react';
import { BOTONES } from '../botones-disenos';
import { CAJAS } from '../cajas';
import { BotonPrincipal } from '../componentes/BotonPrincipal';
import { ESTILOS, LAYOUTS } from '../estilos-visuales';
import { generarDesignMd } from '../export/generarDesignMd';
import { sistemaDeDiseno } from '../export/sistema';
import { CATEGORIAS, type CategoriaId } from '../galeria';
import type { Config } from '../tipos';

export function PanelListo(props: { config: Config; onAtras: () => void; onAvanzado: () => void; onInicio: () => void }) {
  const c = props.config;
  const s = sistemaDeDiseno(c);
  const md = useMemo(() => generarDesignMd(c), [c]);
  const [aviso, setAviso] = useState('');
  const estilo = c.visual.estilo !== 'clasico' ? `estilo-${c.visual.estilo}` : '';

  const filas: [string, string][] = [
    ['Estilo', c.visual.estilo !== 'clasico' ? ESTILOS[c.visual.estilo].nombre : 'Clásico'],
    ['Layout', LAYOUTS[c.visual.layout].nombre],
    ['Colores', s.paleta.nombre],
    ['Tipografía', `${s.titulos.nombre} + ${s.texto.nombre}`],
    ['Botón', c.botones.diseno !== 'ninguno' ? BOTONES[c.botones.diseno].nombre : 'Simple'],
    ['Cajas', c.cajas.preset !== 'ninguno' ? CAJAS[c.cajas.preset].nombre : 'Por defecto'],
    ...(Object.keys(CATEGORIAS) as CategoriaId[])
      .filter((id) => c.componentes[id])
      .map((id) => [CATEGORIAS[id].nombre, CATEGORIAS[id].disenos[c.componentes[id]!]?.nombre ?? '—'] as [string, string]),
  ];

  const descargar = () => {
    const url = URL.createObjectURL(new Blob([md], { type: 'text/markdown;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'DESIGN.md';
    a.click();
    URL.revokeObjectURL(url);
    setAviso('Descargado. Pasáselo a tu IA junto con lo que querés que construya.');
  };
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(md);
      setAviso('Copiado. Pegalo en el chat de tu IA.');
    } catch {
      setAviso('No pude copiar automáticamente. Usá «Descargar».');
    }
  };

  return (
    <div className={`panel-botones panel-listo pg ${estilo}`} style={s.tokens as CSSProperties}>
      <div className="pb-contenido pl-contenido">
        <header className="pb-cabecera">
          <span className="pg-etiqueta">Último paso</span>
          <h1 className="pg-titulo">Tu diseño está listo</h1>
          <p className="pg-bajada">
            Descargá el archivo y dáselo a la IA que uses (Claude, v0, Lovable…) con lo que querés construir. Lleva cada elección con su CSS real, así la IA copia en vez de adivinar.
          </p>
        </header>
        <dl className="pl-resumen pg-card">
          {filas.map(([k, v]) => (
            <div key={k} className="pl-fila">
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <div className="pl-acciones">
          <BotonPrincipal config={c} onClick={descargar}>
            Descargar DESIGN.md
          </BotonPrincipal>
          <button type="button" className="pb-pie-atras" onClick={copiar}>
            Copiar
          </button>
          <button type="button" className="pb-pie-atras" onClick={props.onAvanzado}>
            Ajustar detalles en el modo avanzado
          </button>
        </div>
        <p className="pl-aviso" role="status" aria-live="polite">
          {aviso}
        </p>
      </div>
      <footer className="pb-pie">
        <button type="button" className="pb-pie-atras" onClick={props.onAtras}>
          Volver
        </button>
        <span className="pb-pie-estado" />
        <button type="button" className="pb-pie-atras" onClick={props.onInicio}>
          Empezar otro diseño
        </button>
      </footer>
    </div>
  );
}
