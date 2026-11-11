// Valores mínimos que comparten estado y tokens; los nombres de la ronda no bajan en la portada.
export function lecturaDe(id: unknown) {
  const m = typeof id === 'string' && /^(50|60|70)_(16|20)$/.exec(id);
  return m ? { '--ancho-lectura': `${m[1]}ch`, '--texto-lectura': `${m[2]}px` } : null;
}
