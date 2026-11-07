// Más diseños para categorías que ya existen. Se suman a cada categoría en `index.ts`
// (después de los originales, así el primero de cada lista sigue siendo el mismo).

import type { CategoriaId, DisenoComp } from './base';

export const MAS_DISENOS: Partial<Record<CategoriaId, Record<string, DisenoComp>>> = {
  aviso: {
    contorno: { nombre: 'Contorno', descripcion: 'Sin sombra, con borde fino', css: `& { box-shadow: none; border: 1.5px solid var(--color-borde); background: var(--color-fondo); }` },
    pildora: { nombre: 'Píldora oscura', descripcion: 'Compacto y redondo, como un mensaje del celular', css: `& { align-items: center; border-radius: 999px; padding: 8px 8px 8px 10px; background: var(--color-texto); color: var(--color-fondo); } & .cm-aviso-texto span { display: none; } & .cm-aviso-x { margin: 0; color: var(--color-fondo); border-radius: 999px; } & .cm-aviso-x:hover { background: color-mix(in srgb, var(--color-fondo) 18%, transparent); }` },
    icono_grande: { nombre: 'Icono grande', descripcion: 'El icono en un cuadro de color suave', css: `& .cm-aviso-ico { width: 44px; height: 44px; border-radius: 12px; background: color-mix(in srgb, var(--color-exito) 16%, var(--color-fondo)); color: color-mix(in srgb, var(--color-exito) 78%, var(--color-texto)); }` },
    costado: { nombre: 'Entra de costado', descripcion: 'Se desliza desde la derecha', css: `&.cm-entra { animation-name: cm-aviso-costado; animation-duration: 480ms; } @keyframes cm-aviso-costado { from { opacity: 0; transform: translateX(40px); } }` },
    rebote: { nombre: 'Con rebote', descripcion: 'Aparece con un saltito', css: `&.cm-entra { animation: cm-aviso-rebote 600ms cubic-bezier(.3,1.6,.5,1) both; } @keyframes cm-aviso-rebote { from { opacity: 0; transform: scale(.6); } }` },
  },
  progreso: {
    contorno: { nombre: 'Con contorno', descripcion: 'La barra va dentro de un borde', css: `& .cm-pista { height: 14px; background: transparent; border: 1.5px solid var(--color-texto); } & .cm-relleno { inset: 2px auto 2px 2px; width: calc(var(--p) - 4px); }` },
    escalones: { nombre: 'En bloques', descripcion: 'Se llena de a bloques, como una batería', css: `& .cm-pista { height: 12px; border-radius: 3px; } & .cm-relleno { border-radius: 3px; -webkit-mask: repeating-linear-gradient(90deg, #000 0 10%, transparent 10% 12%); mask: repeating-linear-gradient(90deg, #000 0 10%, transparent 10% 12%); }` },
    tonal: { nombre: 'Tonal', descripcion: 'La pista es un tono suave del mismo color', css: `& .cm-pista { height: 10px; background: color-mix(in srgb, var(--color-acento) 18%, var(--color-fondo)); }` },
    neon: { nombre: 'Neón', descripcion: 'El relleno brilla', css: `& .cm-pista { overflow: visible; } & .cm-relleno { box-shadow: 0 0 12px var(--color-acento), 0 0 2px var(--color-acento); }` },
    cuadrada: { nombre: 'Recta', descripcion: 'Sin esquinas redondeadas, más técnica', css: `& .cm-pista, & .cm-relleno { border-radius: 0; } & .cm-pista { height: 6px; }` },
  },
  acordeon: {
    contorno: { nombre: 'Cajas con borde', descripcion: 'Cada pregunta en su caja, separadas', css: `& { gap: 8px; } & details { border: 1.5px solid var(--color-borde); border-radius: var(--radio-medio); padding: 0 12px; } & details + details { border-top: 1.5px solid var(--color-borde); } & details[open] { border-color: var(--color-texto); }` },
    flecha_izquierda: { nombre: 'Flecha a la izquierda', descripcion: 'La flecha va antes de la pregunta', css: `& summary { justify-content: flex-end; flex-direction: row-reverse; } & summary::after { transform: rotate(-45deg); margin-right: 4px; } & details[open] summary::after { transform: rotate(45deg) translate(-2px, -2px); } & .cm-resp { padding-left: 30px; }` },
    oscuro: { nombre: 'Oscuro', descripcion: 'Bloque oscuro con la abierta resaltada', css: `& { background: #15171C; border-radius: var(--radio-medio); padding: 4px 14px; color: #F1F2F4; } & .cm-resp { color: #B8BCC6; } & details + details { border-top-color: #2A2D35; }` },
    sombra: { nombre: 'Tarjetas con sombra', descripcion: 'Separadas y flotando apenas', css: `& { gap: 10px; } & details { padding: 0 14px; border-radius: var(--radio-medio); background: var(--color-fondo); box-shadow: 0 2px 10px rgba(0,0,0,.08); } & details + details { border-top: none; } & details[open] { box-shadow: 0 8px 22px rgba(0,0,0,.12); }` },
    neobrutal: { nombre: 'Neobrutal', descripcion: 'Bordes negros y sombra dura', css: `& { gap: 10px; } & details { border: 2px solid var(--color-texto); box-shadow: 4px 4px 0 var(--color-texto); padding: 0 12px; background: var(--color-fondo); } & details + details { border-top: 2px solid var(--color-texto); } & details[open] summary { color: var(--color-acento-texto); }` },
  },
  avatar: {
    gota: { nombre: 'Gotas', descripcion: 'Formas orgánicas en vez de círculos', css: `& .cm-av { border-radius: 58% 42% 46% 54% / 52% 44% 56% 48%; }` },
    degradado: { nombre: 'Anillo degradado', descripcion: 'Un anillo de degradado alrededor', css: `& .cm-av { box-shadow: 0 0 0 2px var(--color-fondo); background-clip: padding-box; outline: 2px solid transparent; } & .cm-av::before { content: ''; position: absolute; inset: -4px; border-radius: inherit; background: conic-gradient(var(--color-acento), #FF8A00, #FF3D7F, var(--color-acento)); z-index: -1; } & { isolation: isolate; }` },
    pastel: { nombre: 'Pasteles', descripcion: 'Cada uno con un color suave distinto', css: `& .cm-av:nth-child(1) { background: #FFD6E0; color: #5A1A2E; } & .cm-av:nth-child(2) { background: #CDEBFF; color: #0F3550; } & .cm-av:nth-child(3) { background: #D9F5D6; color: #1C4419; }` },
    neobrutal: { nombre: 'Neobrutal', descripcion: 'Borde negro y sombra dura', css: `& .cm-av { border-radius: 8px; border: 2px solid var(--color-texto); box-shadow: 3px 3px 0 var(--color-texto); }` },
  },
  tooltip: {
    pildora: { nombre: 'Píldora suave', descripcion: 'Redondo, del tono del acento', css: `& .cm-tip { border-radius: 999px; padding: 6px 12px; background: color-mix(in srgb, var(--color-acento) 16%, var(--color-fondo)); color: var(--color-texto); box-shadow: 0 4px 12px rgba(0,0,0,.08); }` },
    escala: { nombre: 'Crece', descripcion: 'Aparece creciendo desde el botón', css: `& .cm-tip { transform: translate(-50%, 6px) scale(.6); transform-origin: bottom center; } &:hover .cm-tip, &:focus-within .cm-tip { transform: translate(-50%, 0) scale(1); }` },
    mono: { nombre: 'Atajo de teclado', descripcion: 'Con letra de código, para atajos', css: `& .cm-tip { font-family: 'JetBrains Mono', ui-monospace, monospace; font-weight: 500; border-radius: 6px; border: 1px solid color-mix(in srgb, var(--color-fondo) 25%, transparent); }` },
    neobrutal: { nombre: 'Neobrutal', descripcion: 'Borde negro y sombra dura', css: `& .cm-tip { border-radius: 0; background: var(--color-acento); color: var(--color-sobre-acento); border: 2px solid var(--color-texto); box-shadow: 3px 3px 0 var(--color-texto); }` },
  },
  modal: {
    oscura: { nombre: 'Oscura', descripcion: 'Ventana oscura sobre cualquier fondo', css: `& .cm-ventana { background: #17191F; color: #F1F2F4; } & .cm-ventana-txt { color: #B8BCC6; } & .cm-ventana-acciones button { color: #F1F2F4; border-color: #3A3E48; }` },
    centrada_icono: { nombre: 'Centrada con icono', descripcion: 'Todo al medio, con icono arriba', css: `& .cm-ventana { align-items: center; text-align: center; } & .cm-ventana-ico { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; background: color-mix(in srgb, var(--color-acento) 16%, var(--color-fondo)); color: var(--color-acento-texto); } & .cm-ventana-acciones { justify-content: center; width: 100%; } & .cm-ventana-acciones button { flex: 1; }` },
    desenfoque: { nombre: 'Fondo desenfocado', descripcion: 'Lo de atrás se desenfoca en vez de oscurecerse', css: `& .cm-fondo-modal { background: color-mix(in srgb, var(--color-fondo) 35%, transparent); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }` },
    arriba: { nombre: 'Desde arriba', descripcion: 'Baja desde arriba, como un aviso importante', css: `& .cm-ventana { top: 14px; transform: translateX(-50%); } & .cm-ventana.cm-entra { animation-name: cm-modal-arriba; } @keyframes cm-modal-arriba { from { opacity: 0; transform: translate(-50%, -30px); } }` },
  },
  tabla: {
    compacta: { nombre: 'Compacta', descripcion: 'Filas bajas para ver muchos datos', css: `& td { padding: 6px 10px; border-top: 1px solid var(--color-borde); } & th { padding: 6px 10px; } & tbody tr:hover td { background: var(--color-superficie); }` },
    resaltada: { nombre: 'Fila resaltada', descripcion: 'La fila bajo el mouse se marca con el acento', css: `& td { border-top: 1px solid var(--color-borde); } & tbody tr:hover td { background: color-mix(in srgb, var(--color-acento) 10%, var(--color-fondo)); } & tbody tr:hover td:first-child { box-shadow: inset 3px 0 0 var(--color-acento); }` },
    separadas: { nombre: 'Filas separadas', descripcion: 'Cada fila es una tarjetita', css: `& { border-spacing: 0 6px; } & td { background: var(--color-superficie); } & td:first-child { border-radius: var(--radio-pequeno) 0 0 var(--radio-pequeno); } & td:last-child { border-radius: 0 var(--radio-pequeno) var(--radio-pequeno) 0; } & tbody tr:hover td { background: var(--color-borde); }` },
    neobrutal: { nombre: 'Neobrutal', descripcion: 'Bordes negros gruesos', css: `& { border: 2px solid var(--color-texto); box-shadow: 4px 4px 0 var(--color-texto); } & th { background: var(--color-acento); color: var(--color-sobre-acento); border-bottom: 2px solid var(--color-texto); } & td { border-top: 1px solid var(--color-texto); } & tbody tr:hover td { background: var(--color-superficie); }` },
  },
};
