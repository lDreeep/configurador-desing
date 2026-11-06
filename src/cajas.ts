// Cajas y contenedores (cards, paneles, bloques). Cada diseño base fija los parámetros;
// después cada parámetro se ajusta por separado. Se resuelve a tokens --caja-* y una regla .caja
// que se usan en el configurador y se exportan tal cual (DESIGN.md §20).

import { mezclar } from './color';
import type { Paleta } from './catalogo';
import type { CajaPresetId, Config } from './tipos';

export type CajaFondo = 'superficie' | 'fondo' | 'acento_suave' | 'acento' | 'degradado' | 'puntos' | 'grano' | 'lineas';
export type CajaBordeEstilo = 'solid' | 'dashed' | 'dotted' | 'double';
export type CajaBordeColor = 'borde' | 'texto' | 'acento';
export type CajaSombra = 'ninguna' | 'suave' | 'marcada' | 'dura' | 'brillo' | 'interna' | 'relieve';
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

const base: ParamsCaja = {
  fondo: 'superficie', transparencia: 0, desenfoque: 0, bordeGrosor: 0, bordeEstilo: 'solid', bordeColor: 'borde',
  radio: 'heredar', sombra: 'ninguna', relleno: 'normal', hover: 'nada', forma: 'normal',
};
const p = (cambios: Partial<ParamsCaja>): ParamsCaja => ({ ...base, ...cambios });

export interface CajaPreset {
  nombre: string;
  descripcion: string;
  params: ParamsCaja;
}

export const CAJAS: Record<CajaPresetId, CajaPreset> = {
  superficie: { nombre: 'Superficie', descripcion: 'Fondo apenas distinto, sin bordes', params: p({}) },
  contorno: { nombre: 'Contorno fino', descripcion: 'Solo una línea suave', params: p({ fondo: 'fondo', bordeGrosor: 1 }) },
  elevada: { nombre: 'Elevada', descripcion: 'Sombra difusa, flota apenas', params: p({ fondo: 'fondo', sombra: 'suave', hover: 'elevar' }) },
  flotante: { nombre: 'Flotante', descripcion: 'Sombra marcada, se despega', params: p({ fondo: 'fondo', sombra: 'marcada', radio: '20', hover: 'elevar' }) },
  vidrio: { nombre: 'Vidrio', descripcion: 'Translúcida con desenfoque', params: p({ transparencia: 55, desenfoque: 16, bordeGrosor: 1, radio: '20', sombra: 'suave' }) },
  velo: { nombre: 'Velo', descripcion: 'Casi transparente, sin desenfoque', params: p({ transparencia: 75, bordeGrosor: 1, bordeEstilo: 'solid' }) },
  neobrutal: { nombre: 'Neobrutal', descripcion: 'Borde negro y sombra sólida', params: p({ fondo: 'fondo', bordeGrosor: 2, bordeColor: 'texto', sombra: 'dura', radio: '6', hover: 'elevar' }) },
  neumorfica: { nombre: 'Neumórfica', descripcion: 'En relieve, del mismo color que el fondo', params: p({ fondo: 'fondo', sombra: 'relieve', radio: '20' }) },
  hundida: { nombre: 'Hundida', descripcion: 'Como tallada hacia adentro', params: p({ sombra: 'interna', radio: '20' }) },
  punteada: { nombre: 'Punteada', descripcion: 'Borde de puntos, informal', params: p({ fondo: 'fondo', bordeGrosor: 2, bordeEstilo: 'dotted', bordeColor: 'texto' }) },
  rayada: { nombre: 'Línea cortada', descripcion: 'Borde de guiones, de borrador', params: p({ fondo: 'fondo', bordeGrosor: 2, bordeEstilo: 'dashed', bordeColor: 'acento' }) },
  doble: { nombre: 'Línea doble', descripcion: 'Marco doble, clásico', params: p({ fondo: 'fondo', bordeGrosor: 4, bordeEstilo: 'double', bordeColor: 'acento', radio: '0' }) },
  cabecera: { nombre: 'Con cabecera', descripcion: 'Franja de color arriba', params: p({ fondo: 'fondo', bordeGrosor: 1, forma: 'cabecera', sombra: 'suave' }) },
  barra: { nombre: 'Barra lateral', descripcion: 'Línea de color a la izquierda', params: p({ forma: 'barra_lateral', radio: '6' }) },
  cortada: { nombre: 'Esquina cortada', descripcion: 'Una esquina en diagonal', params: p({ forma: 'esquina_cortada', radio: '0', fondo: 'acento_suave' }) },
  ticket: { nombre: 'Ticket', descripcion: 'Muescas a los costados, como una entrada', params: p({ forma: 'ticket', fondo: 'acento_suave', radio: '12' }) },
  brillo: { nombre: 'Borde que brilla', descripcion: 'Halo del color de acento', params: p({ fondo: 'fondo', bordeGrosor: 1, bordeColor: 'acento', sombra: 'brillo', radio: '20', hover: 'brillo' }) },
  degradado: { nombre: 'Degradado sutil', descripcion: 'Pasa suave hacia el acento', params: p({ fondo: 'degradado', radio: '20', hover: 'inclinar' }) },
  puntos: { nombre: 'Trama de puntos', descripcion: 'Textura de puntos finos', params: p({ fondo: 'puntos', bordeGrosor: 1 }) },
  papel: { nombre: 'Papel con grano', descripcion: 'Textura de papel', params: p({ fondo: 'grano', sombra: 'suave', radio: '6' }) },
  cuaderno: { nombre: 'Cuaderno', descripcion: 'Renglones de fondo', params: p({ fondo: 'lineas', bordeGrosor: 1, radio: '6' }) },
  acento: { nombre: 'Bloque de color', descripcion: 'Relleno del acento, texto claro', params: p({ fondo: 'acento', radio: '20', hover: 'escala' }) },
  editorial: { nombre: 'Sin caja', descripcion: 'Solo un filete arriba, como una revista', params: p({ forma: 'filete', fondo: 'fondo' }) },
};

export const OPCIONES_CAJA = {
  fondo: { superficie: 'Superficie', fondo: 'Igual al fondo', acento_suave: 'Acento suave', acento: 'Acento', degradado: 'Degradado', puntos: 'Puntos', grano: 'Grano', lineas: 'Renglones' } as Record<CajaFondo, string>,
  bordeEstilo: { solid: 'Continua', dashed: 'Guiones', dotted: 'Puntos', double: 'Doble' } as Record<CajaBordeEstilo, string>,
  bordeColor: { borde: 'Suave', texto: 'Fuerte', acento: 'Acento' } as Record<CajaBordeColor, string>,
  radio: { heredar: 'Como el resto', 0: 'Recta', 6: '6', 12: '12', 20: '20', 28: '28', 40: '40' } as Record<CajaRadio, string>,
  sombra: { ninguna: 'Ninguna', suave: 'Suave', marcada: 'Marcada', dura: 'Dura', brillo: 'Brillo', interna: 'Hundida', relieve: 'Relieve' } as Record<CajaSombra, string>,
  relleno: { compacto: 'Compacto', normal: 'Normal', amplio: 'Amplio' } as Record<CajaRelleno, string>,
  hover: { nada: 'Nada', elevar: 'Se eleva', borde: 'Borde de color', escala: 'Crece', inclinar: 'Se inclina', brillo: 'Brilla' } as Record<CajaHover, string>,
  forma: { normal: 'Normal', cabecera: 'Cabecera', barra_lateral: 'Barra lateral', esquina_cortada: 'Esquina cortada', ticket: 'Ticket', filete: 'Solo filete' } as Record<CajaForma, string>,
};

const RUIDO =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.12'/%3E%3C/svg%3E\")";

const conAlfa = (color: string, transparencia: number) =>
  transparencia > 0 ? `color-mix(in srgb, ${color} ${100 - transparencia}%, transparent)` : color;

/** Tokens --caja-* resueltos para una paleta. */
export function tokensDeCaja(x: ParamsCaja, paleta: Paleta, radioMedio: number): Record<string, string> {
  const r = paleta.roles;
  const t = Math.max(0, Math.min(90, x.transparencia));
  const colorBase =
    x.fondo === 'fondo' ? r.fondo : x.fondo === 'acento_suave' ? mezclar(r.fondo, r.acento, 0.14) : x.fondo === 'acento' ? r.acento : r.superficie;
  const capa = conAlfa(colorBase, t);
  const fondo = {
    superficie: capa,
    fondo: capa,
    acento_suave: capa,
    acento: capa,
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
    brillo: `0 0 0 1px ${conAlfa(r.acento, 50)}, 0 0 28px ${conAlfa(r.acento, 60)}`,
    interna: `inset 4px 4px 10px rgba(${sombraRgb},.16), inset -4px -4px 10px rgba(255,255,255,${paleta.modo === 'oscuro' ? '.04' : '.7'})`,
    relieve: `8px 8px 18px rgba(${sombraRgb},.16), -8px -8px 18px rgba(255,255,255,${paleta.modo === 'oscuro' ? '.05' : '.8'})`,
  }[x.sombra];
  const radio = x.radio === 'heredar' ? `${radioMedio}px` : `${x.radio}px`;
  const relleno = { compacto: '14px', normal: '22px', amplio: '34px' }[x.relleno];
  const sobreAcento = x.fondo === 'acento' && t < 40;
  return {
    '--caja-fondo': fondo,
    '--caja-borde': grosor > 0 ? `${grosor}px ${x.bordeEstilo} ${colorBorde}` : 'none',
    '--caja-radio': radio,
    '--caja-sombra': sombra,
    '--caja-padding': relleno,
    '--caja-desenfoque': x.desenfoque > 0 ? `blur(${x.desenfoque}px)` : 'none',
    '--caja-texto': sobreAcento ? r.sobre_acento : r.texto,
    '--caja-texto-suave': sobreAcento ? r.sobre_acento : r.texto_suave,
    '--caja-color-marca': r.acento,
  };
}

/** Parámetros en uso (los del diseño base elegido, con los ajustes encima). */
export const paramsDe = (c: Config): ParamsCaja | null => (c.cajas.preset === 'ninguno' ? null : { ...CAJAS[c.cajas.preset].params, ...c.cajas.ajustes });

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
