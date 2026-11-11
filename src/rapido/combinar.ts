// Combinaciones del modo rápido: estilo × layout × paleta × tipografía, al azar pero con reglas.
// Cada combinación tiene un código de 4 caracteres para volver a ella o compartirla.

import { FUENTES, MOVIMIENTOS, PALETAS } from '../catalogo';
import { esAutor, ESTILOS, LAYOUTS, RECETAS_AUTOR } from '../estilos-visuales';
import type { Config, EstiloId, FuenteId, LayoutId, PaletaId } from '../tipos';
import { FONDOS, type FondoId } from '../fondos';

export interface Combinacion {
  estilo: EstiloId;
  layout: LayoutId;
  paleta: PaletaId;
  titulos: FuenteId;
  texto: FuenteId;
  /** Fondo con textura; si no viene, el de cada estilo. */
  fondo?: FondoId | 'ninguno';
}

export type Candado = 'estilo' | 'layout' | 'paleta' | 'tipografia';

const LISTA_ESTILOS = Object.keys(ESTILOS) as EstiloId[];
const LISTA_LAYOUTS = Object.keys(LAYOUTS) as LayoutId[];
const LISTA_PALETAS = Object.keys(PALETAS) as PaletaId[];
const LISTA_FUENTES = Object.keys(FUENTES) as FuenteId[];
export const LISTA_FONDOS = Object.keys(FONDOS) as FondoId[];
/** Layouts pensados para lucir un fondo con textura: siempre llevan uno. */
export const LAYOUTS_CON_FONDO: LayoutId[] = ['fondo_protagonista', 'tarjeta_sobre_fondo', 'editorial_fondo', 'widgets_fondo', 'portada_video'];

const alAzar = <T,>(xs: readonly T[], distinto?: T): T => {
  const opciones = xs.length > 1 && distinto !== undefined ? xs.filter((x) => x !== distinto) : xs;
  return opciones[Math.floor(Math.random() * opciones.length)];
};

/** Nueva combinación al azar. Lo que tiene candado se mantiene; el resto respeta las reglas del estilo. */
export function combinacionAlAzar(actual: Combinacion | null, candados: Set<Candado>): Combinacion {
  const estilo = actual && candados.has('estilo') ? actual.estilo : alAzar(LISTA_ESTILOS, actual?.estilo);
  const e = ESTILOS[estilo];
  const layout = actual && candados.has('layout') ? actual.layout : alAzar(LISTA_LAYOUTS, actual?.layout);
  const paleta = actual && candados.has('paleta') ? actual.paleta : alAzar(e.paletas, actual?.estilo === estilo ? actual.paleta : undefined);
  const [titulos, texto] =
    actual && candados.has('tipografia')
      ? [actual.titulos, actual.texto]
      : alAzar(e.fuentes, actual?.estilo === estilo ? e.fuentes.find((f) => f[0] === actual.titulos && f[1] === actual.texto) : undefined);
  // Las plantillas de autor salen seguido en la muestra, y siempre con la receta con la que se diseñaron.
  const autor = candados.size === 0 && Math.random() < 0.3 ? alAzar(LISTA_LAYOUTS.filter(esAutor), actual?.layout) : null;
  if (autor) return { layout: autor, ...RECETAS_AUTOR[autor]! };
  // Las composiciones con fondo siempre llevan uno; el resto, a veces (para mostrar la variedad).
  const fondo: FondoId | 'ninguno' = LAYOUTS_CON_FONDO.includes(layout) || Math.random() < 0.35 ? alAzar(LISTA_FONDOS, actual?.fondo as FondoId | undefined) : 'ninguno';
  return { estilo, layout, paleta, titulos, texto, fondo };
}

/** Aplica una combinación a la config: lo mismo que el modo avanzado puede ajustar después. */
export function aplicarCombinacion(c: Config, k: Combinacion): Config {
  const e = ESTILOS[k.estilo];
  const m = MOVIMIENTOS[e.movimiento];
  return {
    ...c,
    visual: {
      ...c.visual,
      estilo: k.estilo,
      layout: k.layout,
      direccion: e.direccionBase,
      paleta: k.paleta,
      fuenteTitulos: k.titulos,
      fuenteTexto: k.texto,
      pesoTitulos: e.pesoTitulos,
      radio: e.radio,
      elevacion: e.elevacion,
      bordes: e.bordes,
      movimiento: e.movimiento,
      hover: e.boton === 'sombra_dura' ? 'desplazar' : m.hover,
      presionar: m.presionar === 'nada' && e.movimiento !== 'minimo' ? 'hundir' : m.presionar,
      aparicion: m.aparicion,
      cambio: m.cambio,
      fondo: k.fondo ?? c.visual.fondo ?? 'ninguno',
    },
    botones: { ...c.botones, estilo: e.boton },
  };
}

/** La combinación que describe la config actual (si tiene estilo). */
export function combinacionDe(c: Config): Combinacion | null {
  const v = c.visual;
  if (v.estilo === 'clasico' || v.paleta === 'personalizada') return null;
  return { estilo: v.estilo, layout: v.layout, paleta: v.paleta, titulos: v.fuenteTitulos, texto: v.fuenteTexto, fondo: v.fondo };
}

const b36 = (i: number) => i.toString(36).toUpperCase();

/**
 * Un carácter por lista (base 36). Las paletas pasan de 36: las de índice 36 o más van con dos
 * caracteres y el código empieza con «+», así los códigos viejos (sin «+») siguen valiendo.
 */
export function codigo(k: Combinacion): string {
  const p = LISTA_PALETAS.indexOf(k.paleta);
  const larga = p >= 36;
  const cuerpo = [
    LISTA_ESTILOS.indexOf(k.estilo),
    LISTA_LAYOUTS.indexOf(k.layout),
    p,
    LISTA_FUENTES.indexOf(k.titulos),
    LISTA_FUENTES.indexOf(k.texto),
    ...(k.fondo && k.fondo !== 'ninguno' ? [LISTA_FONDOS.indexOf(k.fondo)] : []),
  ]
    .map((n, i) => (i === 2 && larga ? b36(n).padStart(2, '0') : b36(n)))
    .join('');
  return larga ? `+${cuerpo}` : cuerpo;
}

export function decodificar(cod: string): Combinacion | null {
  const larga = cod.trim().startsWith('+');
  const limpio = cod.trim().toUpperCase().replace(/[^0-9A-Z]/g, '');
  const extra = larga ? 1 : 0;
  if (limpio.length !== 5 + extra && limpio.length !== 6 + extra) return null;
  const n = limpio.split('').map((ch) => parseInt(ch, 36));
  const [e, l] = n;
  const p = larga ? n[2] * 36 + n[3] : n[2];
  const [t, x, f] = n.slice(3 + extra);
  const k = { estilo: LISTA_ESTILOS[e], layout: LISTA_LAYOUTS[l], paleta: LISTA_PALETAS[p], titulos: LISTA_FUENTES[t], texto: LISTA_FUENTES[x] };
  if (!Object.values(k).every(Boolean)) return null;
  const fondo = f === undefined ? 'ninguno' : LISTA_FONDOS[f];
  return fondo ? { ...(k as Combinacion), fondo } : null;
}

/** Cuántas combinaciones distintas permiten las reglas (para mostrar). */
export function totalCombinaciones(): number {
  return LISTA_ESTILOS.reduce((n, id) => n + ESTILOS[id].paletas.length * ESTILOS[id].fuentes.length * LISTA_LAYOUTS.length, 0);
}
