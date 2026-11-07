// Esquemas de cada layout (wireframes): dónde va la navegación, el texto, el visual y las cards.
// Se usan para elegir layout de un vistazo, antes de pensar en colores o estilos.

import type { LayoutId } from '../tipos';

type Tipo = 'n' | 't' | 'a' | 'c' | 'b';
type Caja = [number, number, number, number, Tipo];

const nav: Caja = [4, 4, 92, 5, 'n'];
const fila = (y: number): Caja[] => [[6, y, 27, 11, 'c'], [37, y, 27, 11, 'c'], [68, y, 26, 11, 'c']];

export const ESQUEMAS: Record<LayoutId, Caja[]> = {
  hero_partido: [nav, [6, 16, 42, 6, 't'], [6, 24, 34, 3, 't'], [6, 30, 16, 5, 'b'], [56, 14, 38, 26, 'a'], ...fila(46)],
  bento: [nav, [4, 13, 64, 28, 'c'], [8, 30, 30, 5, 't'], [70, 13, 26, 28, 'a'], [4, 44, 42, 15, 'c'], [48, 44, 22, 15, 'c'], [72, 44, 24, 15, 'c']],
  revista: [nav, [6, 14, 13, 16, 'a'], [23, 15, 40, 7, 't'], [23, 24, 28, 3, 't'], [68, 15, 26, 3, 't'], [68, 20, 22, 3, 't'], [68, 26, 14, 5, 'b'], [23, 34, 70, 3, 't'], ...fila(46)],
  tipografico: [[4, 4, 26, 5, 'n'], [6, 14, 88, 11, 't'], [6, 27, 66, 11, 't'], [6, 46, 88, 1, 'n'], [6, 50, 34, 3, 't'], [72, 49, 22, 6, 'b']],
  cinta: [nav, [24, 14, 52, 7, 't'], [32, 24, 36, 3, 't'], [42, 30, 16, 5, 'b'], [0, 38, 100, 6, 'a'], ...fila(48)],
  apiladas: [nav, [6, 18, 38, 6, 't'], [6, 26, 30, 3, 't'], [6, 32, 16, 5, 'b'], [56, 14, 28, 18, 'c'], [64, 22, 28, 18, 'c'], [58, 32, 28, 18, 'a']],
  indice: [nav, [6, 16, 38, 6, 't'], [6, 24, 30, 3, 't'], [6, 30, 16, 5, 'b'], [52, 14, 44, 1, 'n'], [52, 18, 44, 6, 't'], [52, 27, 44, 6, 't'], [52, 36, 44, 6, 't'], [52, 45, 44, 6, 't']],
  panel_fijo: [[0, 0, 40, 64, 'a'], [4, 6, 14, 4, 't'], [4, 42, 30, 8, 't'], [46, 8, 44, 3, 't'], [46, 14, 16, 5, 'b'], [46, 24, 48, 10, 'c'], [46, 37, 48, 10, 'c'], [46, 50, 48, 10, 'c']],
  mosaico: [nav, [28, 13, 44, 6, 't'], [42, 21, 16, 4, 'b'], [6, 29, 28, 20, 'a'], [6, 51, 28, 11, 'c'], [36, 29, 28, 11, 'c'], [36, 42, 28, 20, 'a'], [66, 29, 28, 14, 'a'], [66, 45, 28, 17, 'c']],
  minimo: [[4, 4, 14, 4, 'n'], [42, 20, 16, 2, 't'], [26, 25, 48, 6, 't'], [32, 34, 36, 3, 't'], [42, 41, 16, 5, 'b']],
  app_lateral: [[0, 0, 22, 64, 'n'], [3, 5, 14, 3, 't'], [3, 12, 16, 4, 'a'], [3, 19, 14, 3, 't'], [3, 25, 14, 3, 't'], [26, 5, 34, 5, 't'], [80, 5, 16, 5, 'b'], [26, 15, 22, 12, 'c'], [50, 15, 22, 12, 'c'], [74, 15, 22, 12, 'c'], [26, 31, 70, 28, 'a']],
  horizontal: [nav, [6, 14, 42, 6, 't'], [6, 22, 32, 3, 't'], [6, 28, 16, 5, 'b'], [6, 38, 30, 22, 'c'], [38, 38, 30, 22, 'c'], [70, 38, 30, 22, 'c']],
};

/** Miniatura del esquema de un layout. */
export function Esquema({ id }: { id: LayoutId }) {
  return (
    <svg className="esquema" viewBox="0 0 100 64" aria-hidden="true">
      <rect width="100" height="64" rx="3" className="esq-fondo" />
      {ESQUEMAS[id].map(([x, y, w, h, t], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx={t === 'b' ? 2.5 : 1.5} className={`esq-${t}`} />
      ))}
    </svg>
  );
}
