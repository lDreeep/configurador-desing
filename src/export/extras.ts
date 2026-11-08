// Salidas extra del export: tokens en JSON (formato W3C Design Tokens, lo leen Figma con Tokens Studio,
// Style Dictionary y otros), tokens.css suelto y un prompt corto para pegar directo en una IA.
// El DESIGN.md sigue siendo la salida completa: estas son versiones parciales del mismo sistema.

import { BOTONES } from '../botones-disenos';
import { CAJAS } from '../cajas';
import { APARICIONES, CAMBIOS, MOVIMIENTOS } from '../catalogo';
import { ESTILOS, LAYOUTS } from '../estilos-visuales';
import { CATEGORIAS, type CategoriaId } from '../galeria';
import type { Config } from '../tipos';
import { type Sistema, sistemaDeDiseno, tokensCss } from './sistema';

type Token = { $type: string; $value: unknown; $description?: string };
type Grupo = { [k: string]: Token | Grupo };

const colores = (roles: Record<string, string>): Grupo =>
  Object.fromEntries(Object.entries(roles).map(([k, v]) => [k, { $type: 'color', $value: v }]));

/** Curva CSS `cubic-bezier(a,b,c,d)` → [a,b,c,d]; `linear` → [0,0,1,1]. */
function curva(css: string): number[] {
  const m = css.match(/cubic-bezier\(([^)]+)\)/);
  return m ? m[1].split(',').map((x) => Number(x.trim())) : [0, 0, 1, 1];
}

export function tokensJson(c: Config, s: Sistema = sistemaDeDiseno(c)): string {
  const px = (n: number) => ({ $type: 'dimension', $value: `${n}px` });
  const doc: Grupo = {
    color: {
      ...colores({ ...s.paleta.roles, acento_suave: s.tokens['--color-acento-suave'] }),
      estado: colores(s.paleta.estados),
      boton: colores({ fondo: s.colorBoton.fondo, texto: s.colorBoton.sobre }),
      ...(s.alterna ? { [`modo_${s.alterna.paleta.modo}`]: colores(s.alterna.paleta.roles) } : {}),
    },
    fuente: {
      titulos: { $type: 'fontFamily', $value: s.titulos.pila.split(',').map((x) => x.trim().replace(/^['"]|['"]$/g, '')) },
      texto: { $type: 'fontFamily', $value: s.texto.pila.split(',').map((x) => x.trim().replace(/^['"]|['"]$/g, '')) },
      peso_titulos: { $type: 'fontWeight', $value: s.pesoTitulos },
      peso_subtitulos: { $type: 'fontWeight', $value: s.pesoSubtitulos },
    },
    tamano: Object.fromEntries(Object.entries(s.escala).map(([k, n]) => [k, px(n.tamano)])),
    interlineado: Object.fromEntries(Object.entries(s.escala).map(([k, n]) => [k, { $type: 'number', $value: n.interlineado }])),
    espacio: Object.fromEntries(s.espacios.map((e, i) => [String(i + 1), px(e)])),
    radio: { pequeno: px(s.radio.pequeno), medio: px(s.radio.medio), grande: px(s.radio.grande), boton: px(s.radio.boton) },
    boton: { alto: px(s.boton.alto), padding: px(s.boton.padding), texto: px(s.boton.texto) },
    duracion: {
      rapida: { $type: 'duration', $value: `${s.mov.rapida}ms` },
      media: { $type: 'duration', $value: `${s.mov.media}ms` },
      lenta: { $type: 'duration', $value: `${s.mov.lenta}ms` },
    },
    curva: {
      entrada: { $type: 'cubicBezier', $value: curva(s.mov.curvaEntrada) },
      salida: { $type: 'cubicBezier', $value: curva(s.mov.curvaSalida) },
    },
  };
  return JSON.stringify(doc, null, 2) + '\n';
}

export { tokensCss };

/** Versión corta para pegar en un chat. Pierde el CSS de cada pieza: el DESIGN.md es mejor. */
export function promptCorto(c: Config, s: Sistema = sistemaDeDiseno(c)): string {
  const r = s.paleta.roles;
  const v = c.visual;
  const piezas = (Object.keys(CATEGORIAS) as CategoriaId[])
    .filter((id) => c.componentes[id])
    .map((id) => `${CATEGORIAS[id].nombre.toLowerCase()}: ${CATEGORIAS[id].disenos[c.componentes[id]!]?.nombre ?? '—'}`);
  const lineas = [
    'Diseñá la interfaz con este sistema visual:',
    `- Estilo: ${v.estilo !== 'clasico' ? `${ESTILOS[v.estilo].nombre} (${ESTILOS[v.estilo].descripcion})` : 'clásico, sin decoración especial'}. Layout: ${LAYOUTS[v.layout].nombre} (${LAYOUTS[v.layout].descripcion}).`,
    `- Colores (${s.paleta.modo}): fondo ${r.fondo}, superficie ${r.superficie}, borde ${r.borde}, texto ${r.texto}, texto suave ${r.texto_suave}, acento ${r.acento} con texto ${r.sobre_acento} encima.`,
    ...(s.alterna ? [`- Modo ${s.alterna.paleta.modo} también: fondo ${s.alterna.paleta.roles.fondo}, texto ${s.alterna.paleta.roles.texto}, acento ${s.alterna.paleta.roles.acento}; seguí prefers-color-scheme y sumá un interruptor.`] : []),
    `- Letra: ${s.titulos.nombre} para títulos (peso ${s.pesoTitulos}) y ${s.texto.nombre} para texto, de Google Fonts.`,
    `- Esquinas: ${s.radio.medio}px en cards, ${s.radio.boton}px en botones.`,
    `- Botón principal: ${c.botones.diseno !== 'ninguno' ? `${BOTONES[c.botones.diseno].nombre} (${BOTONES[c.botones.diseno].descripcion})` : 'relleno simple'}, color ${s.colorBoton.fondo}, alto ${s.boton.alto}px.`,
    `- Cajas: ${c.cajas.preset !== 'ninguno' ? `${CAJAS[c.cajas.preset].nombre} (${CAJAS[c.cajas.preset].descripcion})` : 'superficie con borde sutil'}.`,
    ...(piezas.length ? [`- Componentes: ${piezas.join('; ')}.`] : []),
    `- Movimiento: ${MOVIMIENTOS[v.movimiento].nombre.toLowerCase()} (${s.mov.media}ms); el contenido aparece con ${APARICIONES[v.aparicion].nombre.toLowerCase()}; entre pantallas, ${CAMBIOS[v.cambio].nombre.toLowerCase()}.`,
    '- Reglas: contraste AA (4,5:1 en texto), áreas táctiles de 44px, foco visible, respetá prefers-reduced-motion y no uses solo el color para dar información.',
    'Antes de construir, mostrame una maqueta de la pantalla principal para aprobarla.',
  ];
  return lineas.join('\n');
}
