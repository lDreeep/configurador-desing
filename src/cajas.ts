// Cajas y contenedores (cards, paneles, bloques). Cada diseño base fija los parámetros;
// después cada parámetro se ajusta por separado. Se resuelve a tokens --caja-* y una regla .caja
// que se usan en el configurador y se exportan tal cual (DESIGN.md §20).

import { mezclar } from './color';
import type { Paleta } from './catalogo';
import type { CajaPresetId, Config } from './tipos';

export type CajaFondo = 'superficie' | 'fondo' | 'acento_suave' | 'acento' | 'invertido' | 'degradado' | 'puntos' | 'grano' | 'lineas';
export type CajaBordeEstilo = 'solid' | 'dashed' | 'dotted' | 'double';
export type CajaBordeColor = 'borde' | 'texto' | 'acento';
export type CajaSombra = 'ninguna' | 'suave' | 'marcada' | 'dura' | 'color' | 'brillo' | 'interna' | 'relieve';
export type CajaRelleno = 'compacto' | 'normal' | 'amplio';
export type CajaHover = 'nada' | 'elevar' | 'borde' | 'escala' | 'inclinar' | 'brillo';
export type CajaForma = 'normal' | 'cabecera' | 'barra_lateral' | 'esquina_cortada' | 'ticket' | 'filete';
export type CajaRadio = 'heredar' | '0' | '6' | '12' | '20' | '28' | '40';

export interface ParamsCaja {
  fondo: CajaFondo;
  /** 0 = opaca; 90 = casi transparente. */
  transparencia: number;
  /** Desenfoque de lo que está detrás, en px (efecto vidrio). */
  desenfoque: number;
  bordeGrosor: number;
  bordeEstilo: CajaBordeEstilo;
  bordeColor: CajaBordeColor;
  radio: CajaRadio;
  sombra: CajaSombra;
  relleno: CajaRelleno;
  hover: CajaHover;
  forma: CajaForma;
}

export interface CajaPreset {
  nombre: string;
  descripcion: string;
  params: ParamsCaja;
}

// Los 44 diseños base (CAJAS) y los nombres de cada opción (OPCIONES_CAJA) están en cajas-disenos.ts,
// que no va en la carga inicial: baja con la hoja de la página (rapido/hoja-pagina.ts) y con los
// paneles y el export. Al cargarse, registra los diseños para `paramsDe`.
let disenos: Record<CajaPresetId, CajaPreset> | null = null;
export const registrarCajas = (c: Record<CajaPresetId, CajaPreset>) => void (disenos = c);

const RUIDO =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.12'/%3E%3C/svg%3E\")";

const conAlfa = (color: string, transparencia: number) =>
  transparencia > 0 ? `color-mix(in srgb, ${color} ${100 - transparencia}%, transparent)` : color;

/** Tokens --caja-* resueltos para una paleta. */
export function tokensDeCaja(x: ParamsCaja, paleta: Paleta, radioMedio: number): Record<string, string> {
  const r = paleta.roles;
  const t = Math.max(0, Math.min(90, x.transparencia));
  const colorBase =
    x.fondo === 'fondo' ? r.fondo : x.fondo === 'acento_suave' ? mezclar(r.fondo, r.acento, 0.14) : x.fondo === 'acento' ? r.acento : x.fondo === 'invertido' ? r.texto : r.superficie;
  const capa = conAlfa(colorBase, t);
  const fondo = {
    superficie: capa,
    fondo: capa,
    acento_suave: capa,
    acento: capa,
    invertido: capa,
    degradado: `linear-gradient(135deg, ${conAlfa(r.superficie, t)}, ${conAlfa(mezclar(r.superficie, r.acento, 0.18), t)})`,
    puntos: `radial-gradient(${conAlfa(mezclar(r.superficie, r.texto, 0.22), t)} 1px, transparent 1.5px) 0 0 / 12px 12px, ${capa}`,
    grano: `${RUIDO}, ${capa}`,
    lineas: `repeating-linear-gradient(180deg, transparent 0 27px, ${conAlfa(mezclar(r.superficie, r.acento, 0.25), t)} 27px 28px), ${capa}`,
  }[x.fondo];
  const colorBorde = x.bordeColor === 'texto' ? r.texto : x.bordeColor === 'acento' ? r.acento : r.borde;
  const grosor = x.bordeEstilo === 'double' ? Math.max(3, x.bordeGrosor) : x.bordeGrosor;
  const sombraRgb = paleta.modo === 'oscuro' ? '0,0,0' : '20,20,30';
  const sombra = {
    ninguna: 'none',
    suave: `0 4px 18px rgba(${sombraRgb},.10)`,
    marcada: `0 22px 48px rgba(${sombraRgb},.22)`,
    dura: `6px 6px 0 ${r.texto}`,
    color: `7px 7px 0 ${r.acento}`,
    brillo: `0 0 0 1px ${conAlfa(r.acento, 50)}, 0 0 28px ${conAlfa(r.acento, 60)}`,
    interna: `inset 4px 4px 10px rgba(${sombraRgb},.16), inset -4px -4px 10px rgba(255,255,255,${paleta.modo === 'oscuro' ? '.04' : '.7'})`,
    relieve: `8px 8px 18px rgba(${sombraRgb},.16), -8px -8px 18px rgba(255,255,255,${paleta.modo === 'oscuro' ? '.05' : '.8'})`,
  }[x.sombra];
  const radio = x.radio === 'heredar' ? `${radioMedio}px` : `${x.radio}px`;
  const relleno = { compacto: '14px', normal: '22px', amplio: '34px' }[x.relleno];
  const sobreAcento = x.fondo === 'acento' && t < 40;
  const invertida = x.fondo === 'invertido' && t < 40;
  return {
    '--caja-fondo': fondo,
    '--caja-borde': grosor > 0 ? `${grosor}px ${x.bordeEstilo} ${colorBorde}` : 'none',
    '--caja-radio': radio,
    '--caja-sombra': sombra,
    '--caja-padding': relleno,
    '--caja-desenfoque': x.desenfoque > 0 ? `blur(${x.desenfoque}px)` : 'none',
    '--caja-texto': sobreAcento ? r.sobre_acento : invertida ? r.fondo : r.texto,
    '--caja-texto-suave': sobreAcento ? r.sobre_acento : invertida ? mezclar(r.fondo, r.texto, 0.25) : r.texto_suave,
    '--caja-color-marca': r.acento,
  };
}

/** Parámetros en uso (los del diseño base elegido, con los ajustes encima). */
export function paramsDe(c: Config): ParamsCaja | null {
  if (c.cajas.preset === 'ninguno') return null;
  if (!disenos) throw new Error('Los diseños de caja (cajas-disenos.ts) todavía no se cargaron.');
  return { ...disenos[c.cajas.preset].params, ...c.cajas.ajustes };
}

/** Clases de una caja con estos parámetros. */
export const clasesDeCaja = (x: ParamsCaja) => `caja caja-forma-${x.forma} caja-hover-${x.hover}`;

/** CSS de la caja; `&` es el selector de la caja. Usa solo los tokens --caja-* y los de la paleta. */
export const CSS_CAJA = `& {
  background: var(--caja-fondo); border: var(--caja-borde); border-radius: var(--caja-radio); box-shadow: var(--caja-sombra);
  padding: var(--caja-padding); color: var(--caja-texto); backdrop-filter: var(--caja-desenfoque); -webkit-backdrop-filter: var(--caja-desenfoque);
  --color-texto-suave: var(--caja-texto-suave);
  transition: transform var(--duracion-media) var(--curva-entrada), box-shadow var(--duracion-media) var(--curva-entrada), border-color var(--duracion-rapida) ease, filter var(--duracion-media) ease;
}
&.caja-forma-cabecera { border-top: 8px solid var(--caja-color-marca); }
&.caja-forma-barra_lateral { border-left: 5px solid var(--caja-color-marca); }
&.caja-forma-esquina_cortada { clip-path: polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%); }
&.caja-forma-ticket { -webkit-mask: radial-gradient(circle 11px at 0 50%, transparent 98%, #000) left / 51% 100% no-repeat, radial-gradient(circle 11px at 100% 50%, transparent 98%, #000) right / 51% 100% no-repeat; mask: radial-gradient(circle 11px at 0 50%, transparent 98%, #000) left / 51% 100% no-repeat, radial-gradient(circle 11px at 100% 50%, transparent 98%, #000) right / 51% 100% no-repeat; }
&.caja-forma-filete { background: transparent; border: none; border-top: 1px solid var(--color-texto); border-radius: 0; box-shadow: none; padding-left: 0; padding-right: 0; }
&.caja-hover-elevar:hover { transform: translateY(-4px); }
&.caja-hover-borde:hover { border-color: var(--caja-color-marca); outline: 2px solid var(--caja-color-marca); outline-offset: -2px; }
&.caja-hover-escala:hover { transform: scale(1.025); }
&.caja-hover-inclinar:hover { transform: perspective(900px) rotateX(4deg) rotateY(-5deg); }
&.caja-hover-brillo:hover { filter: brightness(1.06); box-shadow: 0 0 0 1px var(--caja-color-marca), 0 0 36px color-mix(in srgb, var(--caja-color-marca) 45%, transparent); }
@media (prefers-reduced-motion: reduce) { & { transition: none; } &:hover { transform: none; } }`;
