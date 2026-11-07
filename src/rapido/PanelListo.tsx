// Modo rápido, último paso: resumen y descarga del DESIGN.md, sin pasar por el modo avanzado.

import { usePaso } from './BarraPasos';
import { useMemo, useState, type CSSProperties } from 'react';
import { BOTONES } from '../botones-disenos';
import { CAJAS } from '../cajas';
import { BotonPrincipal } from '../componentes/BotonPrincipal';
import { ESTILOS, LAYOUTS } from '../estilos-visuales';
import { esSistemaDeDiseno, generarDesignMd } from '../export/generarDesignMd';
import { promptCorto, tokensCss, tokensJson } from '../export/extras';
import { sistemaDeDiseno } from '../export/sistema';
import { CATEGORIAS, type CategoriaId } from '../galeria';
import type { Config } from '../tipos';

export function PanelListo(props: { config: Config; onAtras: () => void; onAvanzado: () => void; onInicio: () => void }) {
  const c = props.config;
  const s = sistemaDeDiseno(c);
  const md = useMemo(() => generarDesignMd(c), [c]);
  const [aviso, setAviso] = useState('');
  const sistema = esSistemaDeDiseno(c);
  const mensajes = sistema
    ? [
        { titulo: 'Para mejorar una app o web que ya tenés', texto: 'Aplicá este sistema de diseño (DESIGN.md adjunto) a mi app. Mantené el contenido, las pantallas y el funcionamiento; cambiá solo cómo se ve y cómo se comporta.' },
        { titulo: 'Para construir algo nuevo', texto: 'Con este sistema de diseño (DESIGN.md adjunto), construí: [contá acá qué querés hacer, para quién y qué tiene que poder hacer la persona].' },
      ]
    : [{ titulo: 'Para construir tu proyecto', texto: 'Construí esta app siguiendo el DESIGN.md adjunto. Empezá por preguntarme lo que esté pendiente en la sección 18.' }];
  const copiarMensaje = async (t: string) => {
    try {
      await navigator.clipboard.writeText(t);
      setAviso('Mensaje copiado. Pegalo en tu IA junto con el archivo.');
    } catch {
      setAviso('No pude copiar automáticamente: seleccioná el texto y copialo a mano.');
    }
  };
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

  const bajar = (contenido: string, nombre: string, tipo: string) => {
    const url = URL.createObjectURL(new Blob([contenido], { type: `${tipo};charset=utf-8` }));
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    a.click();
    URL.revokeObjectURL(url);
  };
  const descargar = () => {
    bajar(md, 'DESIGN.md', 'text/markdown');
    setAviso('Descargado. Pasáselo a tu IA junto con lo que querés que construya.');
  };
  const corto = useMemo(() => promptCorto(c), [c]);
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
          <span className="pg-etiqueta">{usePaso()}</span>
          <h1 className="pg-titulo">Tu diseño está listo</h1>
          <p className="pg-bajada">
            Descargá el archivo y dáselo a la IA que uses (Claude, v0, Lovable…), junto con tu app o con lo que querés construir. Lleva cada elección con su CSS real, así la IA copia en vez de adivinar.
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
        <section className="pl-uso" aria-label="Cómo usarlo">
          <h2 className="pl-uso-titulo">{sistema ? 'Cómo usarlo: elegí uno de estos mensajes' : 'Cómo usarlo'}</h2>
          {sistema && (
            <p className="pl-uso-ayuda">
              Como no contaste qué vas a hacer, el archivo sale como <strong>sistema de diseño</strong>: sirve para mejorar una app o web que ya tenés, o para construir algo nuevo que expliques en el mismo mensaje. Si no aclarás, la IA te va a preguntar.
            </p>
          )}
          <div className="pl-mensajes">
            {mensajes.map((m) => (
              <div key={m.titulo} className="pl-mensaje pg-card">
                <span className="pl-mensaje-titulo">{m.titulo}</span>
                <p className="pl-mensaje-texto">{m.texto}</p>
                <button type="button" className="pb-pie-atras" onClick={() => copiarMensaje(m.texto)}>
                  Copiar mensaje
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="pl-uso" aria-labelledby="pl-extras">
          <h2 id="pl-extras" className="pl-uso-titulo">Otros formatos</h2>
          <div className="pl-mensajes">
            <div className="pl-mensaje pg-card">
              <span className="pl-mensaje-titulo">Prompt corto</span>
              <p className="pl-mensaje-texto">
                Para pegar directo en un chat, sin adjuntar nada. Lleva colores, letra, formas y movimiento, pero no el CSS de cada pieza: con el DESIGN.md el resultado se parece mucho más a lo que elegiste.
              </p>
              <details className="pl-detalle">
                <summary>Ver el texto</summary>
                <pre className="pl-pre">{corto}</pre>
              </details>
              <button type="button" className="pb-pie-atras" onClick={() => copiarMensaje(corto)}>
                Copiar prompt corto
              </button>
            </div>
            <div className="pl-mensaje pg-card">
              <span className="pl-mensaje-titulo">Tokens para Figma y código</span>
              <p className="pl-mensaje-texto">
                <strong>tokens.json</strong> en el formato estándar de design tokens (lo importan Tokens Studio para Figma y Style Dictionary). <strong>tokens.css</strong> con las variables listas para pegar en tu proyecto.
              </p>
              <div className="pl-botones-extra">
                <button type="button" className="pb-pie-atras" onClick={() => { bajar(tokensJson(c, s), 'tokens.json', 'application/json'); setAviso('Descargado tokens.json.'); }}>
                  Descargar tokens.json
                </button>
                <button type="button" className="pb-pie-atras" onClick={() => { bajar(tokensCss(s) + '\n', 'tokens.css', 'text/css'); setAviso('Descargado tokens.css.'); }}>
                  Descargar tokens.css
                </button>
              </div>
            </div>
          </div>
        </section>
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
