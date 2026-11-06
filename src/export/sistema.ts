// Deriva todos los valores de diseño a partir de la configuración.
// La vista previa y el export usan esta MISMA función: lo que se ve es lo que se exporta.

import { DIRECCIONES, FACTOR_DENSIDAD, FUENTES, MOVIMIENTOS, PALETAS, RADIOS } from '../catalogo';
import type { Config } from '../tipos';

export interface NivelTipo {
  tamano: number;
  interlineado: number;
  peso: number;
}

export function sistemaDeDiseno(c: Config) {
  const dir = DIRECCIONES[c.visual.direccion];
  const paleta = PALETAS[c.visual.paleta];
  const radio = RADIOS[c.visual.radio];
  const mov = MOVIMIENTOS[c.visual.movimiento];
  const titulos = FUENTES[c.visual.fuenteTitulos];
  const texto = FUENTES[c.visual.fuenteTexto];

  const r = dir.escala;
  const t = (pasos: number) => Math.round(16 * Math.pow(r, pasos));
  const escala: Record<string, NivelTipo> = {
    display: { tamano: t(5), interlineado: 1.1, peso: 700 },
    h1: { tamano: t(4), interlineado: 1.15, peso: 700 },
    h2: { tamano: t(3), interlineado: 1.2, peso: 600 },
    h3: { tamano: t(2), interlineado: 1.3, peso: 600 },
    cuerpo: { tamano: 16, interlineado: 1.5, peso: 400 },
    pequeno: { tamano: 14, interlineado: 1.45, peso: 400 },
    etiqueta: { tamano: 12, interlineado: 1.3, peso: 600 },
  };

  const espacios = [4, 8, 12, 16, 24, 32, 48, 64, 96];
  const factor = FACTOR_DENSIDAD[dir.densidad];
  const sombraBase = paleta.sombra;
  const elevacion =
    dir.elevacion === 'plana'
      ? { nivel_1: 'none', nivel_2: 'none', nivel_3: `0 12px 32px rgba(${sombraBase},.24)` }
      : dir.elevacion === 'suave'
        ? {
            nivel_1: `0 1px 2px rgba(${sombraBase},.06)`,
            nivel_2: `0 4px 16px rgba(${sombraBase},.08)`,
            nivel_3: `0 12px 32px rgba(${sombraBase},.12)`,
          }
        : {
            nivel_1: `0 2px 4px rgba(${sombraBase},.12)`,
            nivel_2: `0 8px 24px rgba(${sombraBase},.16)`,
            nivel_3: `0 20px 48px rgba(${sombraBase},.22)`,
          };

  const tokens: Record<string, string> = {
    '--color-fondo': paleta.roles.fondo,
    '--color-superficie': paleta.roles.superficie,
    '--color-superficie-alta': paleta.roles.superficie_alta,
    '--color-borde': paleta.roles.borde,
    '--color-texto': paleta.roles.texto,
    '--color-texto-suave': paleta.roles.texto_suave,
    '--color-acento': paleta.roles.acento,
    '--color-sobre-acento': paleta.roles.sobre_acento,
    '--color-exito': paleta.estados.exito,
    '--color-aviso': paleta.estados.aviso,
    '--color-error': paleta.estados.error,
    '--color-info': paleta.estados.info,
    '--fuente-titulos': titulos.pila,
    '--fuente-texto': texto.pila,
    ...Object.fromEntries(Object.entries(escala).map(([k, v]) => [`--texto-${k}`, `${v.tamano}px`])),
    ...Object.fromEntries(espacios.map((e, i) => [`--espacio-${i + 1}`, `${e}px`])),
    '--padding-componente': `${Math.round(16 * factor)}px`,
    '--ancho-max': '1200px',
    '--radio-pequeno': `${radio.pequeno}px`,
    '--radio-medio': `${radio.medio}px`,
    '--radio-grande': `${radio.grande}px`,
    '--radio-boton': `${radio.boton}px`,
    '--sombra-1': elevacion.nivel_1,
    '--sombra-2': elevacion.nivel_2,
    '--sombra-3': elevacion.nivel_3,
    '--duracion-rapida': `${mov.rapida}ms`,
    '--duracion-media': `${mov.media}ms`,
    '--duracion-lenta': `${mov.lenta}ms`,
    '--curva-entrada': mov.curvaEntrada,
    '--curva-salida': mov.curvaSalida,
  };

  return { dir, paleta, radio, mov, titulos, texto, escala, espacios, factor, elevacion, tokens };
}

export type Sistema = ReturnType<typeof sistemaDeDiseno>;

export function tokensCss(s: Sistema): string {
  const lineas = Object.entries(s.tokens).map(([k, v]) => `  ${k}: ${v};`);
  return [
    ':root {',
    ...lineas,
    '}',
    '',
    '@media (prefers-reduced-motion: reduce) {',
    '  :root { --duracion-rapida: 0ms; --duracion-media: 0ms; --duracion-lenta: 0ms; }',
    '}',
  ].join('\n');
}

// --- Contraste (WCAG 2.x) ---

function luminancia(hex: string): number {
  const n = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255);
  const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contraste(a: string, b: string): number {
  const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}
