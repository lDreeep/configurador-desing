// Deriva todos los valores de diseño a partir de la configuración.
// La vista previa y el export usan esta MISMA función: lo que se ve es lo que se exporta.

import {
  DIRECCIONES,
  ESCALAS,
  ESPACIADOS_TITULOS,
  FACTOR_DENSIDAD,
  FUENTES,
  MOVIMIENTOS,
  PALETAS,
  RADIOS,
  TAMANOS_BOTON,
  type Paleta,
} from '../catalogo';
import { asegurarContraste, derivarRoles, ESTADOS_CLAROS, ESTADOS_OSCUROS, esHex, esOscuro, mezclar, paresDeContraste, rolesInvertidos, textoSobre } from '../color';
import { pesoDisponible } from '../estado';
import { paramsDe, tokensDeCaja } from '../cajas';
import type { Config } from '../tipos';

export { contraste } from '../color';

export interface NivelTipo {
  tamano: number;
  interlineado: number;
  peso: number;
}

/** La paleta en uso: una del catálogo o la personalizada, ya derivada. */
export function paletaActiva(c: Config): Paleta {
  if (c.visual.paleta !== 'personalizada') return PALETAS[c.visual.paleta];
  const pp = c.visual.paletaPersonalizada;
  const roles = derivarRoles(pp.fondo, pp.texto, pp.acento, pp.manual);
  const oscuro = esOscuro(roles.fondo);
  return { nombre: 'Personalizada', modo: oscuro ? 'oscuro' : 'claro', roles, estados: oscuro ? ESTADOS_OSCUROS : ESTADOS_CLAROS };
}

/** La paleta opuesta a la activa (si es clara, la oscura; si es oscura, la clara). */
export function paletaAlterna(c: Config): Paleta {
  const p = paletaActiva(c);
  const oscura = p.modo === 'claro';
  return { nombre: `${p.nombre} (${oscura ? 'oscuro' : 'claro'})`, modo: oscura ? 'oscuro' : 'claro', roles: rolesInvertidos(p.roles), estados: oscura ? ESTADOS_OSCUROS : ESTADOS_CLAROS };
}

/** La misma config, pero mostrando la paleta opuesta (para verla en el prototipo). */
export function conPaletaAlterna(c: Config): Config {
  const r = paletaAlterna(c).roles;
  return { ...c, visual: { ...c.visual, ambosModos: false, paleta: 'personalizada', paletaPersonalizada: { fondo: r.fondo, texto: r.texto, acento: r.acento, manual: r } } };
}

const rgbDe = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(',');

export function sistemaDeDiseno(c: Config) {
  const v = c.visual;
  const dir = DIRECCIONES[v.direccion];
  const paleta = paletaActiva(c);
  const r = paleta.roles;
  const radio = RADIOS[v.radio];
  const mov = MOVIMIENTOS[v.movimiento];
  const titulos = FUENTES[v.fuenteTitulos];
  const texto = FUENTES[v.fuenteTexto];
  const pesoTitulos = pesoDisponible(v.fuenteTitulos, v.pesoTitulos);
  const pesoSubtitulos = pesoDisponible(v.fuenteTitulos, Math.max(400, pesoTitulos - 100));
  const espaciadoTitulos = ESPACIADOS_TITULOS[v.espaciadoTitulos].valor;
  const proporcion = ESCALAS[v.escala].proporcion;
  const boton = TAMANOS_BOTON[c.botones.tamano];

  const t = (pasos: number) => Math.round(16 * Math.pow(proporcion, pasos));
  const escala: Record<string, NivelTipo> = {
    display: { tamano: t(5), interlineado: 1.05, peso: pesoTitulos },
    h1: { tamano: t(4), interlineado: 1.1, peso: pesoTitulos },
    h2: { tamano: t(3), interlineado: 1.2, peso: pesoSubtitulos },
    h3: { tamano: t(2), interlineado: 1.3, peso: pesoSubtitulos },
    cuerpo: { tamano: 16, interlineado: 1.5, peso: 400 },
    pequeno: { tamano: 14, interlineado: 1.45, peso: 400 },
    etiqueta: { tamano: 12, interlineado: 1.3, peso: 600 },
  };

  const espacios = [4, 8, 12, 16, 24, 32, 48, 64, 96];
  const factor = FACTOR_DENSIDAD[dir.densidad];
  const sombra = esOscuro(r.fondo) ? '0,0,0' : rgbDe(r.texto);
  const elevacion = {
    plana: { nivel_1: 'none', nivel_2: 'none', nivel_3: `0 12px 32px rgba(${sombra},.24)` },
    suave: {
      nivel_1: `0 1px 2px rgba(${sombra},.06)`,
      nivel_2: `0 4px 16px rgba(${sombra},.08)`,
      nivel_3: `0 12px 32px rgba(${sombra},.12)`,
    },
    marcada: {
      nivel_1: `0 2px 6px rgba(${sombra},.12)`,
      nivel_2: `0 10px 28px rgba(${sombra},.18)`,
      nivel_3: `0 24px 56px rgba(${sombra},.24)`,
    },
    dura: { nivel_1: `3px 3px 0 ${r.texto}`, nivel_2: `5px 5px 0 ${r.texto}`, nivel_3: `8px 8px 0 ${r.texto}` },
  }[v.elevacion];
  const bordeBloque = { ninguno: 'none', sutil: `1px solid ${r.borde}`, marcado: `2px solid ${r.texto}` }[v.bordes];

  const colorBoton =
    c.botones.color === 'texto'
      ? { fondo: r.texto, sobre: r.fondo }
      : esHex(c.botones.color)
        ? { fondo: c.botones.color, sobre: textoSobre(c.botones.color) }
        : { fondo: r.acento, sobre: r.sobre_acento };

  const tokens: Record<string, string> = {
    '--color-fondo': r.fondo,
    '--color-superficie': r.superficie,
    '--color-superficie-alta': r.superficie_alta,
    '--color-borde': r.borde,
    '--color-texto': r.texto,
    '--color-texto-suave': r.texto_suave,
    '--color-acento': r.acento,
    '--color-sobre-acento': r.sobre_acento,
    '--color-acento-suave': mezclar(r.fondo, r.acento, 0.16),
    // El acento usado como TEXTO (links, etiquetas): corregido para leerse a 4.5:1 sobre fondo, superficie y acento suave.
    '--color-acento-texto': asegurarContraste(asegurarContraste(asegurarContraste(r.acento, r.fondo, r.texto), r.superficie, r.texto), mezclar(r.fondo, r.acento, 0.16), r.texto),
    '--color-exito': paleta.estados.exito,
    '--color-aviso': paleta.estados.aviso,
    '--color-error': paleta.estados.error,
    '--color-info': paleta.estados.info,
    '--fuente-titulos': titulos.pila,
    '--fuente-texto': texto.pila,
    '--titulos-peso': String(pesoTitulos),
    '--subtitulos-peso': String(pesoSubtitulos),
    '--titulos-espaciado': espaciadoTitulos,
    ...Object.fromEntries(Object.entries(escala).map(([k, n]) => [`--texto-${k}`, `${n.tamano}px`])),
    ...Object.fromEntries(espacios.map((e, i) => [`--espacio-${i + 1}`, `${e}px`])),
    '--padding-componente': `${Math.round(16 * factor)}px`,
    '--ancho-max': '1200px',
    '--radio-pequeno': `${radio.pequeno}px`,
    '--radio-medio': `${radio.medio}px`,
    '--radio-grande': `${radio.grande}px`,
    '--radio-boton': `${radio.boton}px`,
    '--borde-componente': bordeBloque,
    '--sombra-1': elevacion.nivel_1,
    '--sombra-2': elevacion.nivel_2,
    '--sombra-3': elevacion.nivel_3,
    '--boton-color': colorBoton.fondo,
    '--boton-sobre': colorBoton.sobre,
    '--boton-alto': `${boton.alto}px`,
    '--boton-padding': `${boton.padding}px`,
    '--boton-texto': `${boton.texto}px`,
    '--boton-mayusculas': c.botones.mayusculas ? 'uppercase' : 'none',
    '--boton-espaciado': c.botones.mayusculas ? '0.06em' : '0em',
    '--duracion-rapida': `${mov.rapida}ms`,
    '--duracion-media': `${mov.media}ms`,
    '--duracion-lenta': `${mov.lenta}ms`,
    '--curva-entrada': mov.curvaEntrada,
    '--curva-salida': mov.curvaSalida,
  };
  const caja = paramsDe(c);
  if (caja) Object.assign(tokens, tokensDeCaja(caja, paleta, radio.medio));

  return {
    dir, paleta, radio, mov, titulos, texto, pesoTitulos, pesoSubtitulos, espaciadoTitulos, proporcion,
    boton, colorBoton, caja, escala, espacios, factor, elevacion, bordeBloque, tokens,
    contrastes: paresDeContraste(r),
    alterna: (v.ambosModos ? alternaDe(c, tokens) : null) as Alterna | null,
  };
}

/** Tokens que cambian en el modo opuesto (solo colores y lo que depende de ellos). */
export interface Alterna { paleta: Paleta; tokens: Record<string, string>; contrastes: ReturnType<typeof paresDeContraste> }

function alternaDe(c: Config, tokens: Record<string, string>): Alterna {
  const paleta = paletaAlterna(c);
  const otros: Record<string, string> = sistemaDeDiseno(conPaletaAlterna(c)).tokens;
  const cambian = Object.fromEntries(Object.entries(otros).filter(([k, v]) => tokens[k] !== v));
  return { paleta, tokens: cambian, contrastes: paresDeContraste(paleta.roles) };
}

export type Sistema = ReturnType<typeof sistemaDeDiseno>;

function bloqueAlterno(s: Sistema): string[] {
  const a = s.alterna!;
  const modo = a.paleta.modo;
  const otro = modo === 'oscuro' ? 'claro' : 'oscuro';
  const lineas = Object.entries(a.tokens).map(([k, v]) => `    ${k}: ${v};`);
  return [
    `/* Modo ${modo}: sigue al sistema y se puede forzar con data-tema="${modo}" en <html>. */`,
    `@media (prefers-color-scheme: ${modo === 'oscuro' ? 'dark' : 'light'}) {`,
    `  :root:not([data-tema="${otro}"]) {`,
    ...lineas,
    '  }',
    '}',
    `:root[data-tema="${modo}"] {`,
    ...lineas.map((l) => l.slice(2)),
    '}',
    '',
  ];
}

export function tokensCss(s: Sistema): string {
  const lineas = Object.entries(s.tokens).map(([k, v]) => `  ${k}: ${v};`);
  return [
    ':root {',
    ...lineas,
    '}',
    '',
    ...(s.alterna ? bloqueAlterno(s) : []),
    '@media (prefers-reduced-motion: reduce) {',
    '  :root { --duracion-rapida: 0ms; --duracion-media: 0ms; --duracion-lenta: 0ms; }',
    '}',
  ].join('\n');
}
