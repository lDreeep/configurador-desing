// Combinaciones del modo rápido: estilo × layout × paleta × tipografía, al azar pero con reglas.
// Cada combinación tiene un código de 4 caracteres para volver a ella o compartirla.

import { FUENTES, MOVIMIENTOS, PALETAS } from '../catalogo';
import { ESTILOS, LAYOUTS } from '../estilos-visuales';
import type { Config, EstiloId, FuenteId, LayoutId, PaletaId } from '../tipos';

export interface Combinacion {
  estilo: EstiloId;
  layout: LayoutId;
  paleta: PaletaId;
  titulos: FuenteId;
  texto: FuenteId;
}

export type Candado = 'estilo' | 'layout' | 'paleta' | 'tipografia';

const LISTA_ESTILOS = Object.keys(ESTILOS) as EstiloId[];
const LISTA_LAYOUTS = Object.keys(LAYOUTS) as LayoutId[];
const LISTA_PALETAS = Object.keys(PALETAS) as PaletaId[];
const LISTA_FUENTES = Object.keys(FUENTES) as FuenteId[];

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
  return { estilo, layout, paleta, titulos, texto };
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
    },
    botones: { ...c.botones, estilo: e.boton },
  };
}

/** La combinación que describe la config actual (si tiene estilo). */
export function combinacionDe(c: Config): Combinacion | null {
  const v = c.visual;
  if (v.estilo === 'clasico' || v.paleta === 'personalizada') return null;
  return { estilo: v.estilo, layout: v.layout, paleta: v.paleta, titulos: v.fuenteTitulos, texto: v.fuenteTexto };
}

const b36 = (i: number) => i.toString(36).toUpperCase();

export function codigo(k: Combinacion): string {
  return [
    LISTA_ESTILOS.indexOf(k.estilo),
    LISTA_LAYOUTS.indexOf(k.layout),
    LISTA_PALETAS.indexOf(k.paleta),
    LISTA_FUENTES.indexOf(k.titulos),
    LISTA_FUENTES.indexOf(k.texto),
  ]
    .map(b36)
    .join('');
}

export function decodificar(cod: string): Combinacion | null {
  const limpio = cod.trim().toUpperCase().replace(/[^0-9A-Z]/g, '');
  if (limpio.length !== 5) return null;
  const [e, l, p, t, x] = limpio.split('').map((ch) => parseInt(ch, 36));
  const k = { estilo: LISTA_ESTILOS[e], layout: LISTA_LAYOUTS[l], paleta: LISTA_PALETAS[p], titulos: LISTA_FUENTES[t], texto: LISTA_FUENTES[x] };
  return Object.values(k).every(Boolean) ? (k as Combinacion) : null;
}

/** Cuántas combinaciones distintas permiten las reglas (para mostrar). */
export function totalCombinaciones(): number {
  return LISTA_ESTILOS.reduce((n, id) => n + ESTILOS[id].paletas.length * ESTILOS[id].fuentes.length * LISTA_LAYOUTS.length, 0);
}
