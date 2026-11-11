// Los 80 diseños de botón (botones-disenos.ts) bajan aparte: la portada no los necesita la primera vez.
// Este módulo, chico, es lo único que va en la carga inicial: pide el archivo, avisa cuando llegó
// y pone su CSS en la página. Mientras no llegó, el botón principal se ve con su estilo simple.

import { useEffect, useReducer } from 'react';
import type { BotonDisenoId } from './tipos';

type ModuloBotones = typeof import('./botones-disenos');

let modulo: ModuloBotones | null = null;
let promesa: Promise<ModuloBotones> | null = null;
const oyentes = new Set<() => void>();

export function cargarBotones(): Promise<ModuloBotones> {
  promesa ??= import('./botones-disenos').then((m) => {
    modulo = m;
    for (const f of oyentes) f();
    return m;
  });
  return promesa;
}

/** El archivo de botones si ya llegó (sin pedirlo). */
export const botonesCargados = () => modulo;

/** El archivo de botones; lo pide si hace falta y vuelve a dibujar cuando llega. */
export function useBotones(pedir = true): ModuloBotones | null {
  const [, redibujar] = useReducer((x: number) => x + 1, 0);
  useEffect(() => {
    if (modulo || !pedir) return;
    oyentes.add(redibujar);
    void cargarBotones();
    return () => void oyentes.delete(redibujar);
  }, [pedir]);
  return modulo;
}

/** El CSS de todos los diseños de botón, en cuanto llega su archivo. */
export function EstilosBotones() {
  const B = useBotones();
  if (!B) return null;
  const css = [
    B.CSS_BASE_BOTON.replace(/&/g, '.bt'),
    ...(Object.keys(B.BOTONES) as BotonDisenoId[]).map((id) => B.BOTONES[id].css.replace(/&/g, `.bt.bt-${id}`)),
  ];
  return <style>{css.join('\n')}</style>;
}
