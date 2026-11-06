// Botón secundario (se elige viéndolo al lado del principal) y botones de icono.

import { useContext } from 'react';
import { BotonPrincipal } from '../componentes/BotonPrincipal';
import { type Categoria, GaleriaContexto, reanimar } from './base';
import { Icono } from './iconos';

function MuestraSecundario({ clase }: { clase: string; id: string }) {
  const config = useContext(GaleriaContexto);
  return (
    <div className="cm-par">
      {config && <BotonPrincipal config={config}>Empezar</BotonPrincipal>}
      <button type="button" className={clase} onClick={(e) => reanimar(e.currentTarget, 'toque')}>
        <span className="cm-ico">
          <Icono nombre="inicio" tamano={16} />
        </span>
        Ver más
      </button>
    </div>
  );
}

export const BOTON_SEC: Categoria = {
  id: 'boton_sec',
  nombre: 'Botón secundario',
  singular: 'botón secundario',
  descripcion: 'Cada uno aparece al lado de tu botón principal, para que veas cuál combina.',
  estructura: '<button class="cm-boton_sec cm-boton_sec-DISEÑO"><span class="cm-ico">(icono opcional)</span>Texto</button> — va al lado del botón principal; al tocar se reinicia la clase .toque.',
  anchoCelda: 300,
  base: `& { position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: var(--boton-alto); padding: 0 var(--boton-padding);
  border-radius: var(--radio-boton); border: none; background: transparent; color: var(--color-texto); cursor: pointer; white-space: nowrap;
  font-family: var(--fuente-texto); font-size: var(--boton-texto); font-weight: 600; text-transform: var(--boton-mayusculas); letter-spacing: var(--boton-espaciado);
  transition: background-color var(--duracion-media) ease, color var(--duracion-media) ease, border-color var(--duracion-media) ease, transform var(--duracion-rapida) ease, box-shadow var(--duracion-media) ease; }
& .cm-ico { display: none; }
&:focus-visible { outline: 3px solid var(--color-texto); outline-offset: 3px; }
&.toque { animation: cm-sec-toque 300ms var(--curva-entrada); }
@keyframes cm-sec-toque { 40% { transform: scale(.94); } }
@media (prefers-reduced-motion: reduce) { & { transition: none; animation: none !important; } }`,
  disenos: {
    contorno: { nombre: 'Contorno', descripcion: 'Borde fino; el más usado', css: `& { border: 1.5px solid var(--color-borde); } &:hover { border-color: var(--color-texto); }` },
    contorno_grueso: { nombre: 'Contorno marcado', descripcion: 'Borde del color del texto', css: `& { border: 2px solid var(--color-texto); } &:hover { background: var(--color-texto); color: var(--color-fondo); }` },
    fantasma: { nombre: 'Fantasma', descripcion: 'Solo texto; aparece un fondo al pasar', css: `&:hover { background: var(--color-superficie); }` },
    tonal: { nombre: 'Tonal', descripcion: 'Fondo suave del acento', css: `& { background: color-mix(in srgb, var(--color-acento) 14%, var(--color-fondo)); } &:hover { background: color-mix(in srgb, var(--color-acento) 24%, var(--color-fondo)); }` },
    superficie: { nombre: 'Superficie', descripcion: 'Fondo gris claro, sin borde', css: `& { background: var(--color-superficie); } &:hover { filter: brightness(.96); }` },
    subrayado: { nombre: 'Subrayado', descripcion: 'Texto con línea que crece', css: `& { padding: 0 4px; border-radius: 0; background: linear-gradient(currentColor, currentColor) no-repeat 0 80% / 100% 1.5px; } &:hover { background-size: 100% 3px; }` },
    link_flecha: { nombre: 'Link con flecha', descripcion: 'Texto y una flecha que avanza', css: `& { padding: 0 4px; } &::after { content: '→'; transition: transform 240ms var(--curva-entrada); } &:hover::after { transform: translateX(5px); }` },
    punteado: { nombre: 'Punteado', descripcion: 'Borde de guiones, informal', css: `& { border: 2px dashed var(--color-texto-suave); } &:hover { border-style: solid; border-color: var(--color-texto); }` },
    vidrio: { nombre: 'Vidrio', descripcion: 'Translúcido con desenfoque', css: `& { background: color-mix(in srgb, var(--color-fondo) 40%, transparent); border: 1px solid color-mix(in srgb, var(--color-texto) 20%, transparent); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }` },
    con_icono: { nombre: 'Con icono', descripcion: 'Un icono en círculo antes del texto', css: `& { padding-left: 6px; } & .cm-ico { display: grid; place-items: center; width: calc(var(--boton-alto) - 12px); aspect-ratio: 1; border-radius: 50%; background: var(--color-superficie); } &:hover .cm-ico { background: var(--color-acento); color: var(--color-sobre-acento); }` },
    elevado: { nombre: 'Elevado claro', descripcion: 'Blanco con sombra suave', css: `& { background: var(--color-superficie-alta); box-shadow: 0 2px 8px rgba(0,0,0,.12); } &:hover { box-shadow: 0 6px 16px rgba(0,0,0,.16); transform: translateY(-1px); }` },
    neobrutal: { nombre: 'Neobrutal claro', descripcion: 'Borde y sombra sólida, sin color', css: `& { background: var(--color-fondo); border: 2px solid var(--color-texto); box-shadow: 3px 3px 0 var(--color-texto); } &:hover { transform: translate(-1px, -1px); box-shadow: 4px 4px 0 var(--color-texto); }` },
    pildora: { nombre: 'Píldora contorno', descripcion: 'Redondo con borde fino', css: `& { border-radius: 999px; border: 1.5px solid var(--color-borde); } &:hover { border-color: var(--color-acento); color: var(--color-acento); }` },
    mayusculas: { nombre: 'Mayúsculas finas', descripcion: 'Chico, espaciado, sin caja', css: `& { font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; } &:hover { color: var(--color-acento); }` },
  },
  Muestra: MuestraSecundario,
};

function MuestraIcono({ clase }: { clase: string; id: string }) {
  return (
    <div className="cm-fila-iconos">
      {[
        ['corazon', 'Me gusta'],
        ['buscar', 'Buscar'],
        ['mas', 'Agregar'],
        ['ajustes', 'Ajustes'],
      ].map(([ic, nombre]) => (
        <button key={ic} type="button" className={clase} aria-label={nombre} onClick={(e) => {
          e.currentTarget.toggleAttribute('data-activo');
          reanimar(e.currentTarget, 'toque');
        }}>
          <Icono nombre={ic} tamano={20} />
        </button>
      ))}
    </div>
  );
}

export const BOTON_ICONO: Categoria = {
  id: 'boton_icono',
  nombre: 'Botones de icono',
  singular: 'botón de icono',
  descripcion: 'Tocalos: se marcan como activos y responden.',
  estructura: '<button class="cm-boton_icono cm-boton_icono-DISEÑO" aria-label="Nombre">(icono)</button> — con data-activo cuando está prendido; al tocar se reinicia .toque.',
  anchoCelda: 260,
  base: `& { position: relative; display: inline-grid; place-items: center; width: 44px; height: 44px; border: none; border-radius: 50%; background: transparent; color: var(--color-texto); cursor: pointer;
  transition: background-color var(--duracion-media) ease, color var(--duracion-media) ease, transform var(--duracion-media) var(--curva-entrada), box-shadow var(--duracion-media) ease; }
&:focus-visible { outline: 3px solid var(--color-acento); outline-offset: 2px; }
&[data-activo] { color: var(--color-acento); }
&.toque { animation: cm-ico-toque 340ms cubic-bezier(.3,1.6,.5,1); }
@keyframes cm-ico-toque { 40% { transform: scale(.85); } }
@media (prefers-reduced-motion: reduce) { & { transition: none; animation: none !important; } }`,
  disenos: {
    relleno: { nombre: 'Círculo relleno', descripcion: 'Fondo de acento', css: `& { background: var(--color-acento); color: var(--color-sobre-acento); } &[data-activo] { color: var(--color-sobre-acento); box-shadow: 0 0 0 3px var(--color-fondo), 0 0 0 5px var(--color-acento); }` },
    contorno: { nombre: 'Círculo contorno', descripcion: 'Borde fino', css: `& { border: 1.5px solid var(--color-borde); } &[data-activo] { border-color: var(--color-acento); }` },
    cuadrado: { nombre: 'Cuadrado suave', descripcion: 'Esquinas redondeadas y fondo gris', css: `& { border-radius: 12px; background: var(--color-superficie); } &[data-activo] { background: color-mix(in srgb, var(--color-acento) 18%, var(--color-superficie)); }` },
    fantasma: { nombre: 'Fantasma', descripcion: 'Sin fondo; aparece al pasar', css: `&:hover { background: var(--color-superficie); }` },
    tonal: { nombre: 'Tonal', descripcion: 'Fondo suave del acento', css: `& { background: color-mix(in srgb, var(--color-acento) 14%, var(--color-fondo)); } &[data-activo] { background: var(--color-acento); color: var(--color-sobre-acento); }` },
    flotante: { nombre: 'Flotante', descripcion: 'Grande con sombra, como el botón de acción', css: `& { width: 56px; height: 56px; border-radius: 18px; background: var(--color-acento); color: var(--color-sobre-acento); box-shadow: 0 8px 20px color-mix(in srgb, var(--color-acento) 40%, transparent); } &:hover { transform: translateY(-2px); } &[data-activo] { color: var(--color-sobre-acento); transform: rotate(45deg); }` },
    neobrutal: { nombre: 'Neobrutal', descripcion: 'Borde negro y sombra sólida', css: `& { border-radius: 8px; border: 2px solid var(--color-texto); background: var(--color-fondo); box-shadow: 3px 3px 0 var(--color-texto); } &[data-activo] { background: var(--color-acento); color: var(--color-sobre-acento); transform: translate(2px, 2px); box-shadow: 1px 1px 0 var(--color-texto); }` },
    vidrio: { nombre: 'Vidrio', descripcion: 'Translúcido', css: `& { background: color-mix(in srgb, var(--color-fondo) 45%, transparent); border: 1px solid color-mix(in srgb, var(--color-texto) 18%, transparent); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }` },
    con_punto: { nombre: 'Con aviso', descripcion: 'Un punto de notificación arriba', css: `& { background: var(--color-superficie); } &::after { content: ''; position: absolute; top: 8px; right: 9px; width: 9px; height: 9px; border-radius: 50%; background: var(--color-error); box-shadow: 0 0 0 2px var(--color-superficie); } &[data-activo]::after { transform: scale(0); transition: transform var(--duracion-media) ease; }` },
    gira: { nombre: 'Gira al pasar', descripcion: 'El icono da un giro', css: `& { border: 1.5px solid var(--color-borde); } & svg { transition: transform 500ms var(--curva-entrada); } &:hover svg { transform: rotate(180deg); }` },
  },
  Muestra: MuestraIcono,
};
