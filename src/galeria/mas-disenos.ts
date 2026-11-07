// Más diseños para categorías que ya existen. Se suman a cada categoría en `index.ts`
// (después de los originales, así el primero de cada lista sigue siendo el mismo).

import type { CategoriaId, DisenoComp } from './base';

const pista = (css: string) => `& input::-webkit-slider-runnable-track { ${css} }
& input::-moz-range-track { ${css} }`;
const perilla = (css: string) => `& input::-webkit-slider-thumb { ${css} }
& input::-moz-range-thumb { ${css} }`;

export const MAS_DISENOS: Partial<Record<CategoriaId, Record<string, DisenoComp>>> = {
  interruptor: {
    lineas: { nombre: 'Con texto adentro', descripcion: 'Dice «SÍ» o «NO» dentro de la pista', css: `& .cm-pista { width: 62px; } & .cm-pista::before { content: 'NO'; position: absolute; right: 9px; top: 50%; transform: translateY(-50%); font: 800 10px var(--fuente-texto); color: var(--color-texto); } & input:checked + .cm-pista::before { content: 'SÍ'; right: auto; left: 10px; color: var(--color-sobre-acento); } & input:checked + .cm-pista .cm-perilla { transform: translateX(32px); }` },
    contorno: { nombre: 'Contorno', descripcion: 'Pista vacía con borde; se rellena al activarse', css: `& .cm-pista { background: transparent; box-shadow: inset 0 0 0 2px var(--color-texto-suave); } & .cm-perilla { background: var(--color-texto-suave); box-shadow: none; transform: scale(.75); } & input:checked + .cm-pista { box-shadow: inset 0 0 0 2px var(--color-acento); } & input:checked + .cm-pista .cm-perilla { background: var(--color-sobre-acento); transform: translateX(22px) scale(1); }` },
    pequeno: { nombre: 'Chico', descripcion: 'Más bajo y finito, para listas densas', css: `& .cm-pista { width: 38px; height: 20px; } & .cm-perilla { width: 14px; height: 14px; } & input:checked + .cm-pista .cm-perilla { transform: translateX(18px); }` },
    brillo: { nombre: 'Con brillo', descripcion: 'Al activarse, la pista brilla con el acento', css: `& input:checked + .cm-pista { box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-acento) 22%, transparent), 0 0 18px color-mix(in srgb, var(--color-acento) 60%, transparent); }` },
    estirado: { nombre: 'Se estira', descripcion: 'La perilla se alarga mientras viaja', css: `& .cm-perilla { transition: transform var(--duracion-lenta) var(--curva-entrada), width var(--duracion-media) ease; } & input:active + .cm-pista .cm-perilla { width: 32px; }` },
  },
  casilla: {
    circulo_lleno: { nombre: 'Círculo lleno', descripcion: 'Redonda que se llena desde el centro', css: `& .cm-marca { border-radius: 50%; } & input:checked + .cm-marca { animation: cm-cas-lleno var(--duracion-lenta) var(--curva-entrada); } @keyframes cm-cas-lleno { from { box-shadow: inset 0 0 0 11px var(--color-fondo); } }` },
    tachar_suave: { nombre: 'Atenúa el texto', descripcion: 'Al marcar, el texto se pone gris', css: `& input:checked ~ .cm-txt { color: var(--color-texto-suave); }` },
    tarjeta: { nombre: 'Tarjeta', descripcion: 'Toda la fila es una tarjeta que se marca', css: `& { padding: 10px 12px; border: 1.5px solid var(--color-borde); border-radius: var(--radio-medio); } &:has(input:checked) { border-color: var(--color-acento); background: color-mix(in srgb, var(--color-acento) 8%, var(--color-fondo)); }` },
    cuadrada_grande: { nombre: 'Grande', descripcion: 'Más grande y fácil de tocar', css: `& .cm-marca { width: 30px; height: 30px; border-radius: 9px; } & svg { width: 20px; height: 20px; } & { font-size: 16px; }` },
    oscura: { nombre: 'Marca oscura', descripcion: 'Se marca con el color del texto, no con el acento', css: `& input:checked + .cm-marca { background: var(--color-texto); border-color: var(--color-texto); } & svg { stroke: var(--color-fondo); }` },
  },
  deslizador: {
    contorno: { nombre: 'Perilla hueca', descripcion: 'La perilla es un aro del color de acento', css: `${perilla('background: var(--color-fondo); border-width: 4px; box-shadow: none;')}` },
    cuadrado: { nombre: 'Cuadrado', descripcion: 'Pista y perilla rectas', css: `${pista('border-radius: 0; height: 8px;')}
${perilla('border-radius: 3px; width: 14px; height: 26px; margin-top: -9px; background: var(--color-acento); border: none;')}` },
    tonal: { nombre: 'Tonal', descripcion: 'La pista vacía es un tono suave del acento', css: `${pista('height: 10px; background: linear-gradient(to right, var(--color-acento) var(--valor), color-mix(in srgb, var(--color-acento) 18%, var(--color-fondo)) var(--valor));')}
${perilla('margin-top: -6px; border: none; background: var(--color-acento); box-shadow: 0 0 0 4px var(--color-fondo), 0 1px 6px rgba(0,0,0,.25);')}` },
    oscuro: { nombre: 'Oscuro', descripcion: 'Relleno del color del texto, perilla blanca', css: `${pista('height: 6px; background: linear-gradient(to right, var(--color-texto) var(--valor), var(--color-borde) var(--valor));')}
${perilla('border-color: var(--color-texto);')}` },
  },
  etiqueta: {
    pildora_icono: { nombre: 'Con tilde', descripcion: 'Una tilde adelante, para estados confirmados', css: `&::before { content: '✓'; font-weight: 800; color: var(--color-acento-texto); }` },
    degradado: { nombre: 'Degradado', descripcion: 'Fondo con degradado del acento', css: `& { background: linear-gradient(90deg, var(--color-acento), color-mix(in srgb, var(--color-acento) 55%, var(--color-texto))); color: var(--color-sobre-acento); }` },
    subrayada: { nombre: 'Subrayada', descripcion: 'Sin fondo, con una línea gruesa abajo', css: `& { background: transparent; border-radius: 0; padding: 2px 2px; box-shadow: inset 0 -3px 0 color-mix(in srgb, var(--color-acento) 55%, transparent); }` },
    grande: { nombre: 'Grande', descripcion: 'Más alta y con letra más grande, para filtros', css: `& { padding: 8px 14px; font-size: 14px; font-weight: 600; border: 1.5px solid var(--color-borde); background: var(--color-fondo); }` },
    neon: { nombre: 'Neón', descripcion: 'Borde y texto que brillan', css: `& { background: transparent; color: var(--color-acento-texto); box-shadow: inset 0 0 0 1.5px var(--color-acento), 0 0 10px color-mix(in srgb, var(--color-acento) 50%, transparent); }` },
  },
  cargando: {
    rebote: { nombre: 'Pelotita', descripcion: 'Una pelota que rebota y se aplasta', css: `& span:first-child { display: block; width: 16px; height: 16px; border-radius: 50%; background: currentColor; animation: cm-pelota 700ms cubic-bezier(.5,0,.5,1) infinite alternate; } @keyframes cm-pelota { from { transform: translateY(-16px) scaleY(1.05); } to { transform: translateY(12px) scale(1.25, .75); } }` },
    giro_doble: { nombre: 'Doble anillo', descripcion: 'Dos anillos que giran en sentidos opuestos', css: `& { width: 44px; height: 44px; } &::before, &::after { content: ''; position: absolute; border-radius: 50%; border: 3px solid transparent; } &::before { inset: 0; border-top-color: currentColor; border-bottom-color: currentColor; animation: cm-girar-k 1s linear infinite; } &::after { inset: 9px; border-left-color: currentColor; border-right-color: currentColor; animation: cm-girar-k 700ms linear infinite reverse; } @keyframes cm-girar-k { to { transform: rotate(360deg); } }` },
    texto: { nombre: 'Texto que late', descripcion: 'La palabra «Cargando» con tres puntos', css: `& { width: auto; height: auto; font: 700 14px var(--fuente-texto); } &::before { content: 'Cargando'; } &::after { content: '…'; display: inline-block; width: 1.2em; overflow: hidden; vertical-align: bottom; animation: cm-puntitos 1.2s steps(4) infinite; } @keyframes cm-puntitos { from { width: 0; } to { width: 1.2em; } }` },
    cubo: { nombre: 'Cuadrado que gira', descripcion: 'Un cuadrado que da vueltas', css: `& span:first-child { display: block; width: 24px; height: 24px; border-radius: 4px; background: currentColor; animation: cm-cubo 1.2s ease-in-out infinite; } @keyframes cm-cubo { 50% { transform: rotate(180deg) scale(.7); border-radius: 50%; } 100% { transform: rotate(360deg); } }` },
    reloj: { nombre: 'Reloj', descripcion: 'Una aguja que da la vuelta', css: `& { width: 40px; height: 40px; border-radius: 50%; border: 3px solid currentColor; } &::after { content: ''; position: absolute; left: calc(50% - 1.5px); top: 6px; width: 3px; height: 14px; border-radius: 2px; background: currentColor; transform-origin: 50% 100%; animation: cm-girar-k 1.4s linear infinite; } @keyframes cm-girar-k { to { transform: rotate(360deg); } }` },
  },
  metrica: {
    centrada: { nombre: 'Centrada', descripcion: 'Todo al medio, para un número solo', css: `& { align-items: center; text-align: center; }` },
    contorno: { nombre: 'Contorno', descripcion: 'Sin fondo, con borde fino', css: `& { background: transparent; border: 1.5px solid var(--color-borde); }` },
    degradado: { nombre: 'Degradado suave', descripcion: 'Un degradado del acento muy leve', css: `& { background: linear-gradient(140deg, color-mix(in srgb, var(--color-acento) 16%, var(--color-fondo)), var(--color-superficie) 70%); }` },
    grande: { nombre: 'Número enorme', descripcion: 'Solo el número, gigante', css: `& .cm-m-valor { font-size: 46px; letter-spacing: -0.03em; } & .cm-m-cambio { order: -1; align-self: flex-start; }` },
    vidrio: { nombre: 'Vidrio', descripcion: 'Translúcida con desenfoque', css: `& { background: color-mix(in srgb, var(--color-fondo) 55%, transparent); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1px solid color-mix(in srgb, var(--color-texto) 12%, transparent); }` },
  },
  selector: {
    pastillas: { nombre: 'Pastillas sueltas', descripcion: 'Cada opción en su pastilla, sin fondo común', css: `& { background: transparent; gap: 6px; padding: 0; } & .cm-ind { display: none; } & button { border: 1.5px solid var(--color-borde); } & button[aria-checked='true'] { background: var(--color-texto); color: var(--color-fondo); border-color: var(--color-texto); }` },
    sombra_dura: { nombre: 'Sombra dura', descripcion: 'La marca tiene sombra sólida corrida', css: `& { background: var(--color-superficie); } & .cm-ind { background: var(--color-fondo); box-shadow: 3px 3px 0 var(--color-texto); border: 1.5px solid var(--color-texto); }` },
    degradado: { nombre: 'Degradado', descripcion: 'La marca es un degradado del acento', css: `& .cm-ind { background: linear-gradient(120deg, var(--color-acento), color-mix(in srgb, var(--color-acento) 50%, var(--color-texto))); } & button[aria-checked='true'] { color: var(--color-sobre-acento); }` },
    linea_arriba: { nombre: 'Línea arriba', descripcion: 'Una línea arriba marca la opción, estilo pestaña', css: `& { background: transparent; border-radius: 0; border-top: 1px solid var(--color-borde); padding: 0; } & .cm-ind { top: -1px; bottom: auto; left: 0; width: calc(100% / var(--n)); height: 3px; border-radius: 0; background: var(--color-acento); box-shadow: none; } & button { border-radius: 0; }` },
  },
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
    oscura: { nombre: 'Oscura', descripcion: 'Ventana oscura sobre cualquier fondo', css: `& .cm-ventana { background: #17191F; color: #F1F2F4; } & .cm-ventana-txt { color: #B8BCC6; } & .cm-ventana-acciones button { color: #F1F2F4; border-color: #3A3E48; } & .cm-ventana-acciones .cm-primario { color: var(--boton-sobre); }` },
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
