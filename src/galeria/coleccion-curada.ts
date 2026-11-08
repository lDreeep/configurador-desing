// Patrones propios: las variantes cambian la composición, no solo el tratamiento del borde.
import type { CategoriaId, DisenoComp } from './base';

export const COLECCION_CURADA: Partial<Record<CategoriaId, Record<string, DisenoComp>>> = {
  formulario: {
    expediente: {
      nombre: 'Expediente', descripcion: 'Cabecera de ficha y secciones numeradas en una columna, para gestión',
      css: `& { counter-reset: expediente; border: 1px solid var(--color-borde); border-radius: var(--radio-grande); overflow: hidden; gap: 0; background: var(--color-fondo); }
& .cm-fo-cab { padding: 24px; background: var(--color-superficie); border-bottom: 1px solid var(--color-borde); }
& .cm-fo-seccion { padding: 20px 24px; border-bottom: 1px solid var(--color-borde); }
& .cm-fo-sec-titulo { display: flex; align-items: center; gap: 10px; color: var(--color-texto); font-size: 14px; text-transform: none; letter-spacing: 0; }
& .cm-fo-sec-titulo::before { counter-increment: expediente; content: counter(expediente, decimal-leading-zero); color: var(--color-acento-texto); font-variant-numeric: tabular-nums; }
& .cm-fo-grupo { padding-top: 8px; }
& .cm-fo-acciones { padding: 16px 24px; background: var(--color-superficie); }`,
    },
    editorial_abierto: {
      nombre: 'Editorial abierto', descripcion: 'Títulos grandes, campos subrayados y mucho aire, para propuestas y contacto',
      css: `& { gap: 28px; padding: 8px; }
& .cm-fo-titulo { font-size: 28px; line-height: 1.15; max-width: 18ch; }
& .cm-fo-seccion { gap: 16px; padding-top: 20px; border-top: 2px solid var(--color-texto); }
& .cm-fo-sec-titulo { text-transform: none; letter-spacing: 0; font-family: var(--fuente-titulos); font-size: 20px; color: var(--color-texto); }
& input, & select, & textarea { border-width: 0 0 1px; border-radius: 0; padding-inline: 2px; background: transparent; }
& .cm-fo-grupo { gap: 18px; }
& .cm-fo-acciones { justify-content: flex-start; }
& .cm-fo-guardar { min-width: 55%; }`,
    },
    panel_operativo: {
      nombre: 'Panel operativo', descripcion: 'Pares de campos, cabeceras de sección y acciones en un pie diferenciado',
      css: `& { border: 1px solid var(--color-borde); border-radius: var(--radio-medio); background: var(--color-fondo); padding: 16px; gap: 16px; }
& .cm-fo-cab { padding-bottom: 12px; border-bottom: 1px solid var(--color-borde); }
& .cm-fo-sec-titulo { padding: 8px 10px; border-radius: var(--radio-pequeno); background: var(--color-superficie); color: var(--color-texto); }
& .cm-fo-grupo { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
& .cm-fo-fila { min-width: 0; }
& .cm-fo-fila:has(.cm-fo-segmento), & .cm-fo-switch, & .cm-fo-accion, & .cm-fo-nota-campo { grid-column: 1 / -1; }
& .cm-fo-acciones { padding-top: 16px; border-top: 1px solid var(--color-borde); }
@container (max-width: 350px) { & .cm-fo-grupo { grid-template-columns: 1fr; } }`,
    },
    recorrido_movil: {
      nombre: 'Recorrido móvil', descripcion: 'Una columna, bloques de lectura cortos y acción principal a todo el ancho',
      css: `& { max-width: 380px; padding: 20px; border-radius: var(--radio-grande); background: var(--color-superficie); gap: 24px; }
& .cm-fo-titulo { font-size: 24px; line-height: 1.2; }
& .cm-fo-seccion { padding: 16px; border: 1px solid var(--color-borde); border-radius: var(--radio-medio); background: var(--color-fondo); gap: 12px; }
& .cm-fo-sec-titulo { text-transform: none; letter-spacing: 0; color: var(--color-texto); font-size: 15px; }
& .cm-fo-acciones { flex-direction: column-reverse; }
& .cm-fo-acciones button { width: 100%; min-height: 48px; }
& .cm-fo-cancelar { border: none; }
& input, & select, & textarea { font-size: 16px; }`,
    },
  },
  nav_web: {
    lateral_espacios: {
      nombre: 'Espacios de trabajo', descripcion: 'Marca arriba y secciones en bloques verticales, para herramientas y gestión',
      css: `& { flex-direction: column; align-items: stretch; justify-content: flex-start; width: 180px; min-width: 0; padding: 16px 10px; gap: 24px; border: 1px solid var(--color-borde); border-radius: var(--radio-medio); }
& .cm-marca { padding: 0 10px 16px; border-bottom: 1px solid var(--color-borde); }
& .cm-items { display: flex; flex-direction: column; gap: 8px; }
& .cm-item { justify-content: flex-start; min-height: 48px; padding-inline: 12px; border-radius: var(--radio-pequeno); }
& .cm-ico { display: inline-flex; }
& .cm-item[aria-current] { color: var(--color-acento-texto); background: var(--color-acento-suave); box-shadow: inset 3px 0 0 var(--color-acento-texto); }
& .cm-item:hover:not([aria-current]) { background: var(--color-fondo); }`,
    },
    cabecera_doble: {
      nombre: 'Cabecera en dos niveles', descripcion: 'La marca tiene su propia fila; las secciones ocupan una segunda franja',
      css: `& { flex-direction: column; align-items: stretch; padding: 16px 12px 0; gap: 16px; border: 1px solid var(--color-borde); border-radius: var(--radio-medio) var(--radio-medio) 0 0; }
& .cm-marca { align-self: flex-start; padding-inline: 8px; font-size: 20px; }
& .cm-items { border-top: 1px solid var(--color-borde); padding-top: 6px; }
& .cm-item { min-height: 48px; padding-inline: 6px; border-bottom: 3px solid transparent; }
& .cm-item[aria-current] { border-bottom-color: var(--color-acento-texto); }
& .cm-item:hover { background: var(--color-acento-suave); }`,
    },
    indice_numerado: {
      nombre: 'Índice numerado', descripcion: 'Números y separadores para una navegación de estudio, portfolio o revista',
      css: `& { flex-direction: column; align-items: stretch; gap: 20px; background: var(--color-fondo); padding: 16px; border: 1px solid var(--color-borde); }
& .cm-items { counter-reset: indice; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 16px; }
& .cm-item { justify-content: flex-start; min-height: 54px; padding: 8px 0; border-top: 1px solid var(--color-borde); gap: 12px; }
& .cm-item::before { counter-increment: indice; content: counter(indice, decimal-leading-zero); font-size: 11px; color: var(--color-texto-suave); font-variant-numeric: tabular-nums; }
& .cm-item[aria-current] { color: var(--color-acento-texto); }
& .cm-item[aria-current]::after { content: '↗'; margin-left: auto; }`,
    },
    muelle_iconos: {
      nombre: 'Muelle de secciones', descripcion: 'Marca centrada y botones con icono sobre texto dentro de una banda flotante',
      css: `& { flex-direction: column; gap: 12px; border: none; background: transparent; padding: 10px; }
& .cm-items { gap: 4px; padding: 6px; border: 1px solid var(--color-borde); border-radius: var(--radio-grande); background: var(--color-superficie); box-shadow: var(--sombra-2); }
& .cm-item { flex-direction: column; gap: 6px; padding: 10px 12px; min-height: 64px; border-radius: var(--radio-medio); font-size: 12px; }
& .cm-ico { display: inline-flex; }
& .cm-item[aria-current] { background: var(--color-fondo); color: var(--color-acento-texto); box-shadow: var(--sombra-1); }`,
    },
  },
  producto: {
    ficha_editorial: {
      nombre: 'Ficha editorial', descripcion: 'Imagen vertical, nombre protagonista y detalles separados por filetes',
      css: `& { max-width: 300px; border: none; border-radius: 0; background: transparent; overflow: visible; }
& .cm-pr-foto { aspect-ratio: 3 / 4; border-radius: var(--radio-pequeno); }
& .cm-pr-info { padding: 16px 0 0; gap: 10px; }
& .cm-pr-nombre { font-size: 22px; line-height: 1.15; font-weight: var(--titulos-peso); }
& .cm-pr-precio { padding-block: 10px; border-block: 1px solid var(--color-borde); }
& .cm-pr-boton { background: transparent; color: var(--color-texto); border: 1px solid var(--color-texto); }`,
    },
    catalogo_detallado: {
      nombre: 'Catálogo detallado', descripcion: 'Imagen al costado y datos de compra en una columna, para comparar productos',
      css: `& { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); max-width: 440px; align-items: stretch; }
& .cm-pr-foto { aspect-ratio: auto; min-height: 240px; }
& .cm-pr-info { min-width: 0; padding: 16px; gap: 8px; }
& .cm-pr-nombre { font-size: 18px; }
& .cm-pr-estrellas { font-size: 11px; letter-spacing: 0; }
& .cm-pr-precio { flex-wrap: wrap; }
& .cm-pr-boton { margin-top: auto; }
@container (max-width: 330px) { & { grid-template-columns: 1fr; } & .cm-pr-foto { aspect-ratio: 4 / 3; min-height: 0; } }`,
    },
    escaparate: {
      nombre: 'Escaparate', descripcion: 'Imagen apaisada y pie dividido: información a la izquierda, precio a la derecha',
      css: `& { max-width: 340px; border-radius: var(--radio-grande); }
& .cm-pr-foto { aspect-ratio: 4 / 3; }
& .cm-pr-info { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px 12px; padding: 18px; }
& .cm-pr-cat, & .cm-pr-nombre, & .cm-pr-estrellas { grid-column: 1; }
& .cm-pr-precio { grid-column: 2; grid-row: 1 / 4; flex-direction: column; align-items: flex-end; justify-content: center; gap: 4px; }
& .cm-pr-opciones, & .cm-pr-disponible, & .cm-pr-boton, & .cm-pr-confirmacion { grid-column: 1 / -1; }`,
    },
    pedido_rapido: {
      nombre: 'Pedido rápido', descripcion: 'Ficha compacta con imagen corta y variantes de compra bien visibles',
      css: `& { max-width: 300px; border: 1px solid var(--color-borde); border-radius: var(--radio-medio); }
& .cm-pr-foto { aspect-ratio: 16 / 9; }
& .cm-pr-info { gap: 8px; padding: 16px; }
& .cm-pr-opciones { padding-block: 12px; border-block: 1px solid var(--color-borde); }
& .cm-pr-boton { min-height: 48px; }
& .cm-pr-disponible { display: inline-flex; gap: 6px; align-items: center; }`,
    },
  },
};
