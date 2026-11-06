// Utilidades de color: contraste WCAG 2.x, mezcla y derivación de paletas personalizadas.

import type { RolColor } from './tipos';

export const esHex = (s: string) => /^#[0-9a-fA-F]{6}$/.test(s);

const rgb = (hex: string) => {
  const n = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
};
const aHex = (c: number[]) => '#' + c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('').toUpperCase();

export function luminancia(hex: string): number {
  const lin = (v: number) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  };
  const [r, g, b] = rgb(hex);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contraste(a: string, b: string): number {
  const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

/** Mezcla `a` con `b`: t=0 devuelve a, t=1 devuelve b. */
export function mezclar(a: string, b: string, t: number): string {
  const [x, y] = [rgb(a), rgb(b)];
  return aHex(x.map((v, i) => v + (y[i] - v) * t));
}

export const esOscuro = (hex: string) => luminancia(hex) < 0.18;

/** Acerca `color` a `hacia` hasta lograr el contraste mínimo contra `fondo`. */
export function asegurarContraste(color: string, fondo: string, hacia: string, minimo = 4.5): string {
  let c = color;
  for (let t = 0.1; contraste(c, fondo) < minimo && t <= 1; t += 0.1) c = mezclar(color, hacia, t);
  return c;
}

/** El mejor color de texto (blanco o casi negro) para escribir sobre `fondo`. */
export const textoSobre = (fondo: string) => (contraste('#FFFFFF', fondo) >= contraste('#111111', fondo) ? '#FFFFFF' : '#111111');

export type Roles = Record<RolColor, string>;

export const ESTADOS_CLAROS = { exito: '#1F7A4D', aviso: '#9A4A06', error: '#C2272D', info: '#1D5FA8' };
export const ESTADOS_OSCUROS = { exito: '#4ADE80', aviso: '#FBBF24', error: '#F87171', info: '#93C5FD' };

/** Calcula los 8 roles a partir de fondo, texto y acento, y aplica los ajustes manuales. */
export function derivarRoles(fondo: string, texto: string, acento: string, manual: Partial<Roles> = {}): Roles {
  const oscuro = esOscuro(fondo);
  const superficie = mezclar(fondo, texto, oscuro ? 0.07 : 0.05);
  const base: Roles = {
    fondo,
    superficie,
    superficie_alta: oscuro ? mezclar(fondo, texto, 0.12) : mezclar(fondo, '#FFFFFF', 0.6),
    borde: mezclar(fondo, texto, oscuro ? 0.22 : 0.2),
    texto,
    texto_suave: asegurarContraste(mezclar(texto, fondo, 0.38), superficie, texto),
    acento,
    sobre_acento: textoSobre(acento),
  };
  const limpio = Object.fromEntries(Object.entries(manual).filter(([, v]) => v && esHex(v)));
  return { ...base, ...limpio };
}

export interface ParContraste {
  nombre: string;
  texto: string;
  fondo: string;
  minimo: number;
  valor: number;
  pasa: boolean;
}

export function paresDeContraste(r: Roles): ParContraste[] {
  const pares: [string, string, string, number][] = [
    ['Texto sobre fondo', r.texto, r.fondo, 4.5],
    ['Texto sobre superficie', r.texto, r.superficie, 4.5],
    ['Texto suave sobre fondo', r.texto_suave, r.fondo, 4.5],
    ['Texto suave sobre superficie', r.texto_suave, r.superficie, 4.5],
    ['Texto del botón principal', r.sobre_acento, r.acento, 4.5],
    ['Acento sobre fondo (links, contornos)', r.acento, r.fondo, 3],
  ];
  return pares.map(([nombre, texto, fondo, minimo]) => {
    const valor = contraste(texto, fondo);
    return { nombre, texto, fondo, minimo, valor, pasa: valor >= minimo };
  });
}
