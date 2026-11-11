import type { AparicionId } from '../tipos';
import estilos from '../estilos.css?raw';

/** Reutiliza las reglas y los keyframes de la vista previa. */
export function cssDeAparicion(id: AparicionId): string {
  if (id === 'nada') return '';
  const reglas = estilos.match(/[^{}]+\{[^{}]*\}/g) ?? [];
  const seleccion = reglas.filter((regla) => regla.trim().startsWith(`.pv-aparicion-${id} `));
  const nombres = seleccion.join('\n').match(/pv-[a-z-]+(?= var|;)/g) ?? [];
  const keyframes = estilos.match(/@keyframes [\w-]+\s*\{(?:[^{}]|\{[^{}]*\})*\}/g) ?? [];
  return [...seleccion, ...keyframes.filter((regla) => nombres.some((nombre) => regla.startsWith(`@keyframes ${nombre} `))),
    '@media (prefers-reduced-motion: reduce) { .pv-bloque { animation: none !important; transition: none !important; } }',
  ].join('\n');
}
