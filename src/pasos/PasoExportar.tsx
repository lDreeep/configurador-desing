import { useMemo, useState } from 'react';
import { Campo, Seccion } from '../componentes/ui';
import { calcularPendientes, generarDesignMd } from '../export/generarDesignMd';
import type { PropsPaso } from './pasos';

const NOMBRES_SECCION: Record<number, string> = { 2: 'Proyecto', 3: 'Pantallas', 4: 'Qué hace', 11: 'Iconos e imágenes' };
const NOMBRES_CAMPO: Record<string, string> = {
  nombre: 'Nombre del proyecto',
  descripcion: 'Qué es el proyecto',
  objetivo_principal: 'Objetivo principal',
  'publico.quienes': 'Quién lo usa',
  pantallas: 'Pantallas',
  acciones_clave: 'Acciones clave',
  datos: 'Qué datos maneja (lo resuelve la IA preguntando)',
  logo: 'Logo',
};

export function PasoExportar({ config, setConfig }: PropsPaso) {
  const md = useMemo(() => generarDesignMd(config), [config]);
  const { sinDefinir } = useMemo(() => calcularPendientes(config), [config]);
  const [aviso, setAviso] = useState('');

  const nombreArchivo = 'DESIGN.md';
  const descargar = () => {
    const url = URL.createObjectURL(new Blob([md], { type: 'text/markdown;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    a.click();
    URL.revokeObjectURL(url);
    setAviso('Descargado. Pasáselo a tu IA junto con lo que querés que construya.');
  };
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(md);
      setAviso('Copiado. Pegalo en el chat de tu IA.');
    } catch {
      setAviso('No pude copiar automáticamente. Usá "Descargar".');
    }
  };

  const bloqueantes = sinDefinir.filter((p) => p.bloquea);
  const nombreDe = (campo: string) =>
    NOMBRES_CAMPO[campo] ?? (campo.startsWith('pantallas.') ? `Acción principal de "${campo.split('.')[1].replace(/_[a-z0-9]+$/, '')}"` : campo);

  return (
    <Seccion titulo="Tu DESIGN.md" ayuda="Un solo archivo con todo: cómo se ve, qué hace y cómo lo tiene que usar la IA.">
      {bloqueantes.length > 0 && (
        <div className="alerta" role="status">
          <strong>Faltan cosas importantes.</strong> Podés exportar igual: la IA va a preguntar por ellas antes de empezar.
          <ul>
            {bloqueantes.map((p) => (
              <li key={p.campo}>
                {NOMBRES_SECCION[p.seccion] ?? `Sección ${p.seccion}`}: {nombreDe(p.campo)}
              </li>
            ))}
          </ul>
        </div>
      )}
      <Campo
        etiqueta="Notas generales (una por línea)"
        valor={config.notasGenerales}
        onCambiar={(v) => setConfig((x) => ({ ...x, notasGenerales: v }))}
        multilinea
        placeholder="Ej.: Quiero que se sienta rápida, más que linda."
      />
      <div className="fila">
        <button type="button" className="boton primario" onClick={descargar}>
          Descargar DESIGN.md
        </button>
        <button type="button" className="boton secundario" onClick={copiar}>
          Copiar
        </button>
      </div>
      <p className="ayuda" role="status" aria-live="polite">
        {aviso}
      </p>
      <div className="grupo">
        <div className="grupo-titulo">Cómo usarlo</div>
        <ol className="como-usar">
          <li>Abrí Claude, Claude Code, v0, Lovable o la IA que uses.</li>
          <li>Adjuntá o pegá el archivo.</li>
          <li>
            Escribí qué querés: "Construí esta app siguiendo el DESIGN.md". Si no describiste un proyecto, el archivo sale como sistema de diseño: pedile que lo aplique a tu app existente, o contale qué construir.
          </li>
        </ol>
      </div>
      <pre className="codigo" tabIndex={0} aria-label="Contenido del DESIGN.md">
        {md}
      </pre>
    </Seccion>
  );
}
