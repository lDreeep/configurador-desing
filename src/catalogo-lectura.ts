// Esta parte del catálogo baja con las rondas, separada de la portada (B2).
import { lecturaDe } from './lectura-base';
import type { LecturaId } from './tipos';

export const LECTURAS = /* @__PURE__ */ crearLecturas();

function crearLecturas() {
  const nombres: Record<LecturaId, string> = {
    '60_16': 'Equilibrada', '60_20': 'Equilibrada, letra grande',
    '50_16': 'Columna estrecha', '50_20': 'Estrecha, letra grande',
    '70_16': 'Columna ancha', '70_20': 'Ancha, letra grande',
  };
  return Object.fromEntries(Object.entries(nombres).map(([id, nombre]) => {
    const tokens = lecturaDe(id)!;
    const ancho = parseFloat(tokens['--ancho-lectura']);
    const tamano = parseFloat(tokens['--texto-lectura']);
    return [id, { nombre, ancho, tamano }];
  })) as Record<LecturaId, { nombre: string; ancho: number; tamano: number }>;
}
