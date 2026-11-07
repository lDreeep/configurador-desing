import { alternativaUI, normalizarDecisiones, type DecisionesUI, type DecisionId } from '../decisiones';
import type { Config } from '../tipos';

export function tokensDecisiones(c: Config): Record<string, string> {
  const d = normalizarDecisiones(c.decisiones);
  const valor = (id: DecisionId, base: string) => alternativaUI(d, id).valor ?? base;
  return {
    '--contenido-ancho': valor('ancho', '1200px'),
    '--grilla-separacion': valor('separacion', '24px'),
    '--seccion-separacion': valor('secciones', '64px'),
    '--margen-movil': valor('margen', '16px'),
    '--texto-interlineado': valor('interlineado', '1.5'),
    '--texto-linea': valor('linea', '70ch'),
    '--fila-alto': valor('filas', '56px'),
    '--foco-grosor': valor('foco', '2px'),
    '--imagen-proporcion': valor('proporcion', '4 / 3'),
    '--imagen-ajuste': valor('encuadre', 'cover'),
  };
}

/** Clases declarativas; las mismas se exportan para reproducir las elecciones. */
export function clasesDecisiones(d: DecisionesUI): string {
  return ['diseno-ui', ...Object.entries(d).filter(([, v]) => v !== 'heredar').map(([k, v]) => `du-${k}-${v}`)].join(' ');
}

/** CSS compartido: se monta en las vistas y se incluye sin reinterpretar en §22. */
export const CSS_DECISIONES = `
.diseno-ui { --du-padding: var(--padding-componente); line-height: var(--texto-interlineado); }
.diseno-ui :where(input, select, textarea, button, a):focus-visible { outline: var(--foco-grosor) solid var(--color-acento-texto); outline-offset: 3px; }
.diseno-ui.du-foco-doble :where(input, select, textarea, button, a):focus-visible { box-shadow: 0 0 0 3px var(--color-fondo), 0 0 0 6px var(--color-acento-texto); }
.diseno-ui :where(.du-parrafo, .pg-bajada) { max-inline-size: var(--texto-linea); line-height: var(--texto-interlineado); }
.diseno-ui :where(.du-parrafo, .du-campo, .du-tabla) { font-size: var(--texto-cuerpo); }
.diseno-ui .du-superficie { padding: var(--du-padding); border: var(--borde-componente); border-radius: var(--radio-medio); background: var(--color-superficie); box-shadow: var(--sombra-1); }
.diseno-ui .du-grilla { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--grilla-separacion); }
.diseno-ui .du-campo { display: grid; gap: 8px; margin-block-end: 16px; }
.diseno-ui .du-campo label { font-weight: 600; }
.diseno-ui .du-ayuda { color: var(--color-texto-suave); font-size: var(--texto-pequeno); }
.diseno-ui .du-campo :where(input, select) { box-sizing: border-box; width: 100%; min-width: 0; min-height: 44px; padding: 12px; border: 1px solid var(--color-borde); border-radius: var(--radio-pequeno); background: var(--color-fondo); color: var(--color-texto); font: inherit; }
.diseno-ui.du-etiquetas-lateral .du-campo { grid-template-columns: minmax(110px, 1fr) minmax(0, 2fr); align-items: start; }
.diseno-ui.du-etiquetas-lateral .du-campo > :not(label) { grid-column: 2; }
.diseno-ui.du-ayuda-antes .du-ayuda { order: -1; }
.diseno-ui.du-ayuda-antes .du-campo label { order: -2; }
.diseno-ui .du-error { color: var(--color-texto); border-inline-start: 3px solid var(--color-error); padding-inline-start: 8px; font-size: var(--texto-pequeno); }
.diseno-ui .du-acciones { display: flex; flex-wrap: wrap; gap: 12px; }
.diseno-ui .du-acciones button { min-height: 44px; border-radius: var(--radio-boton); padding: 12px 20px; font: inherit; cursor: pointer; }
.diseno-ui .du-primario { background: var(--boton-color); color: var(--boton-sobre); border: 1px solid var(--boton-color); }
.diseno-ui .du-secundario { background: var(--color-superficie); color: var(--color-texto); border: 1px solid var(--color-borde); }
.diseno-ui .du-tabla-area { overflow-x: auto; }
.diseno-ui .du-tabla { width: 100%; border-collapse: collapse; }
.diseno-ui .du-tabla :where(th, td) { text-align: start; height: var(--fila-alto); padding: 0 12px; }
.diseno-ui .du-tabla th { color: var(--color-texto-suave); }
.diseno-ui.du-bandas-lineas .du-tabla tr { border-bottom: 1px solid var(--color-borde); }
.diseno-ui.du-bandas-alternadas .du-tabla tbody tr:nth-child(odd) { background: var(--color-acento-suave); }
.diseno-ui .du-tabla input { width: 24px; height: 24px; accent-color: var(--color-acento-texto); }
.diseno-ui .du-tabla label { display: flex; align-items: center; min-width: 44px; min-height: 44px; }
.diseno-ui .du-foto { display: block; width: 100%; aspect-ratio: var(--imagen-proporcion); object-fit: var(--imagen-ajuste); border-radius: var(--radio-medio); background: var(--color-acento-suave); }
.diseno-ui .du-respuesta { padding: 16px; border: 1px solid var(--color-acento-texto); border-radius: var(--radio-medio); background: var(--color-superficie); color: var(--color-texto); }
.diseno-ui.du-feedback-flotante .du-respuesta { position: absolute; inset-inline-end: 16px; inset-block-end: 16px; max-width: min(320px, calc(100% - 32px)); box-sizing: border-box; box-shadow: var(--sombra-2); z-index: 3; }
.diseno-ui.du-alineacion-centro :where(.du-encabezado, .pg-hero, .pg-split-texto) { text-align: center; align-items: center; }
.diseno-ui.du-alineacion-centro :where(.du-encabezado, .pg-hero, .pg-split-texto) .pg-acciones { justify-content: center; }
.diseno-ui.du-alineacion-inicio :where(.du-encabezado, .pg-hero, .pg-split-texto) { text-align: start; align-items: flex-start; }
.diseno-ui.du-alineacion-inicio :where(.du-encabezado, .pg-hero, .pg-split-texto) .pg-acciones { justify-content: flex-start; }
.diseno-ui[class*="du-ancho-"].pgp .pg-contenido { box-sizing: border-box; width: 100%; max-width: var(--contenido-ancho); margin-inline: auto; }
.diseno-ui[class*="du-ancho-"] .pg-contenido { max-width: var(--contenido-ancho); }
.diseno-ui[class*="du-secciones-"] .pg-contenido { gap: var(--seccion-separacion); }
.diseno-ui[class*="du-separacion-"] :where(.pg-fila, .pg-bento) { gap: var(--grilla-separacion); }
.diseno-ui[class*="du-cuerpo-"] .pg-bajada { font-size: var(--texto-cuerpo); }
.diseno-ui[class*="du-proporcion-"] .pg-media { min-height: 0; aspect-ratio: var(--imagen-proporcion); }
.diseno-ui :where(.pg-media img, .du-foto) { object-fit: var(--imagen-ajuste); }

@container decisiones (max-width: 600px) {
  .diseno-ui .du-grilla { grid-template-columns: 1fr; }
  .diseno-ui.du-etiquetas-lateral .du-campo { grid-template-columns: 1fr; }
  .diseno-ui.du-etiquetas-lateral .du-campo > :not(label) { grid-column: 1; }
  .diseno-ui.du-botonesMovil-completo :where(.du-acciones, .pg-acciones) { flex-direction: column; align-items: stretch; }
  .diseno-ui.du-botonesMovil-completo :where(.du-acciones, .pg-acciones) > * { width: 100%; box-sizing: border-box; }
  .diseno-ui.du-tablaMovil-tarjetas .du-tabla thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
  .diseno-ui.du-tablaMovil-tarjetas .du-tabla :where(tbody, tr, td) { display: block; height: auto; }
  .diseno-ui.du-tablaMovil-tarjetas .du-tabla tr { padding: 12px; margin-block: 12px; border: 1px solid var(--color-borde); border-radius: var(--radio-medio); }
  .diseno-ui.du-tablaMovil-tarjetas .du-tabla td { padding: 8px; }
  .diseno-ui.du-tablaMovil-tarjetas .du-tabla td::before { content: attr(data-etiqueta); display: inline-block; min-width: 40%; color: var(--color-texto-suave); }
}
@container (max-width: 600px) {
  .diseno-ui[class*="du-margen-"] .pg-contenido { padding-inline: var(--margen-movil); }
  .diseno-ui.du-botonesMovil-completo .pg-acciones { flex-direction: column; width: 100%; }
  .diseno-ui.du-botonesMovil-completo .pg-acciones > * { width: 100%; box-sizing: border-box; }
}
`;
