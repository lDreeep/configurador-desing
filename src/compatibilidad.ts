// Auditoría paleta × estilo (PLAN.md, tarea A3).
// Cada estilo declara sus paletas compatibles (`ESTILOS[id].paletas`), pero el recorrido nuevo elige
// color ANTES que estilo. Acá se arma el sistema de diseño real (`sistemaDeDiseno`) para cualquier par
// y se miden los colores sobre los que de verdad queda el texto cuando el CSS del estilo los cambia
// (tarjetas de color fijo, vidrio translúcido, fondo de página propio, botón de contorno o tonal).
// Es datos y cálculo, sin UI.

import { PALETAS } from './catalogo';
import { contraste, mezclar } from './color';
import { configInicial } from './estado';
import { ESTILOS } from './estilos-visuales';
import { sistemaDeDiseno } from './export/sistema';
import type { Config, EstiloId, PaletaId } from './tipos';

export const LISTA_ESTILOS = Object.keys(ESTILOS) as EstiloId[];
export const LISTA_PALETAS = Object.keys(PALETAS) as PaletaId[];

/** Mínimo AA para texto normal. */
export const MINIMO_AA = 4.5;

export interface ParAuditado {
  nombre: string;
  texto: string;
  fondo: string;
  valor: number;
  pasa: boolean;
}

/**
 * Lo que el CSS de un estilo (`ESTILOS[id].css`) cambia debajo del texto. Si un estilo nuevo pinta
 * un fondo detrás de texto con un color que no sale de los tokens, se anota acá para que la auditoría lo vea.
 */
interface SuperficiesDeEstilo {
  /** Fondo propio de la página (`& { background: … }`), si no es `--color-fondo`. */
  pagina?: string;
  /** Fondos de las tarjetas (`.pg-card`), en función de los roles. Por defecto, `--color-superficie`. */
  tarjetas?: (r: Record<string, string>) => string[];
  /** Color fijo del texto principal dentro de las tarjetas, si el estilo lo fija. */
  textoTarjeta?: string;
}

const SUPERFICIES: Partial<Record<EstiloId, SuperficiesDeEstilo>> = {
  suizo: { tarjetas: (r) => [r.fondo] },
  neobrutalismo: { tarjetas: () => ['#FFD23F', '#7BDFF2', '#B8F2A0'], textoTarjeta: '#111111' },
  vidrio: { tarjetas: (r) => [mezclar(r.fondo, '#FFFFFF', 0.07)] },
  retro_os: { pagina: '#008080', tarjetas: (r) => [r.fondo] },
  terminal: { tarjetas: (r) => [r.fondo] },
  oscuro_precision: { tarjetas: (r) => [r.superficie_alta, r.superficie] },
};

/** La config con la paleta y lo que el estilo fija (botón, forma, movimiento), como al elegirlo. */
export function configCon(paleta: PaletaId, estilo: EstiloId, base: Config = configInicial()): Config {
  const e = ESTILOS[estilo];
  return {
    ...base,
    visual: {
      ...base.visual,
      estilo,
      paleta,
      direccion: e.direccionBase,
      fuenteTitulos: e.fuentes[0][0],
      fuenteTexto: e.fuentes[0][1],
      pesoTitulos: e.pesoTitulos,
      radio: e.radio,
      elevacion: e.elevacion,
      bordes: e.bordes,
      movimiento: e.movimiento,
    },
    botones: { ...base.botones, estilo: e.boton },
  };
}

/** Los pares de texto y fondo que quedan en pantalla con esta paleta y este estilo. */
export function paresDe(paleta: PaletaId, estilo: EstiloId): ParAuditado[] {
  const c = configCon(paleta, estilo);
  const s = sistemaDeDiseno(c);
  const r = s.paleta.roles;
  const sup = SUPERFICIES[estilo] ?? {};
  const pares: [string, string, string][] = [
    ['Texto sobre fondo', r.texto, r.fondo],
    ['Texto suave sobre fondo', r.texto_suave, r.fondo],
  ];
  if (sup.pagina) {
    pares.push(['Texto sobre el fondo propio de la página', r.texto, sup.pagina]);
    pares.push(['Texto suave sobre el fondo propio de la página', r.texto_suave, sup.pagina]);
  }
  for (const t of sup.tarjetas?.(r) ?? [r.superficie]) {
    pares.push([`Texto sobre tarjeta ${t}`, sup.textoTarjeta ?? r.texto, t]);
    pares.push([`Texto suave sobre tarjeta ${t}`, r.texto_suave, t]);
  }
  // Botón principal según su estilo (mismas reglas que `.pv-primario.est-*` en estilos.css).
  const b = s.colorBoton;
  if (c.botones.estilo === 'contorno') pares.push(['Texto del botón principal (contorno)', r.texto, r.fondo]);
  else if (c.botones.estilo === 'tonal') pares.push(['Texto del botón principal (tonal)', r.texto, mezclar(r.fondo, b.fondo, 0.16)]);
  else pares.push(['Texto del botón principal', b.sobre, b.fondo]);

  return pares.map(([nombre, texto, fondo]) => {
    const valor = contraste(texto, fondo);
    return { nombre, texto, fondo, valor, pasa: valor >= MINIMO_AA };
  });
}

/** Los pares que no llegan a AA (vacío si el par paleta × estilo se puede usar). */
export function fallasDe(paleta: PaletaId, estilo: EstiloId): ParAuditado[] {
  return paresDe(paleta, estilo).filter((p) => !p.pasa);
}

export const pasaAA = (paleta: PaletaId, estilo: EstiloId) => fallasDe(paleta, estilo).length === 0;

/**
 * Los estilos que se pueden ofrecer con una paleta ya elegida: primero los que la declaran
 * compatible, después el resto, en el orden del catálogo. Excluye los que no pasan AA con ella.
 */
export function estilosPara(paleta: PaletaId): EstiloId[] {
  const usables = LISTA_ESTILOS.filter((e) => pasaAA(paleta, e));
  const compatibles = usables.filter((e) => ESTILOS[e].paletas.includes(paleta));
  return [...compatibles, ...usables.filter((e) => !compatibles.includes(e))];
}
