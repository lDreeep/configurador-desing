// Carga de fuentes a pedido: cada familia se pide a Google Fonts recién cuando algo la muestra.
// Antes se pedían las 33 juntas al arrancar (`urlGoogleFonts`); ahora la portada pide solo las suyas.
// Los pedidos del mismo momento se juntan en un solo <link>.

import { useEffect } from 'react';
import { FUENTES } from './catalogo';
import type { FuenteId } from './tipos';

/** Las que usa la interfaz misma (estilos.css) y el CSS de algunos diseños: van siempre. */
export const FUENTES_BASE: FuenteId[] = ['inter', 'space_grotesk', 'jetbrains_mono'];

/** Cada fuente pedida, con una promesa que se cumple cuando llegó su hoja de estilos. */
const pedidas = new Map<FuenteId, Promise<void>>();
let pendientes: FuenteId[] = [];
let avisarLote: () => void = () => {};
let loteActual: Promise<void> = Promise.resolve();

export const urlDeFuentes = (ids: FuenteId[]) =>
  'https://fonts.googleapis.com/css2?' +
  ids.map((id) => `family=${FUENTES[id].nombre.replace(/ /g, '+')}:wght@${FUENTES[id].pesos.join(';')}`).join('&') +
  '&display=swap';

function enviar() {
  const ids = pendientes;
  const avisar = avisarLote;
  pendientes = [];
  if (ids.length === 0 || typeof document === 'undefined') return avisar();
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = urlDeFuentes(ids);
  link.onload = link.onerror = () => avisar();
  document.head.appendChild(link);
}

/** Pide las fuentes que todavía no se pidieron. Se puede llamar muchas veces: cada una se pide una sola vez. */
export function pedirFuentes(ids: (FuenteId | undefined)[]) {
  const nuevas = ids.filter((id): id is FuenteId => !!id && id in FUENTES && !pedidas.has(id));
  if (nuevas.length === 0) return;
  if (pendientes.length === 0) {
    const lote = new Promise<void>((r) => (avisarLote = r));
    queueMicrotask(enviar);
    loteActual = lote;
  }
  for (const id of nuevas) pedidas.set(id, loteActual);
  pendientes.push(...nuevas);
}

const PORPILA = new Map(Object.entries(FUENTES).map(([id, f]) => [f.pila, id as FuenteId]));
/** La fuente del catálogo que corresponde a una pila CSS (`"Inter", system-ui, sans-serif`). */
export const fuenteDePila = (pila: string | undefined) => (pila ? PORPILA.get(pila) : undefined);

/** Pide las fuentes al montar el componente o cuando cambian. */
export function useFuentes(ids: (FuenteId | undefined)[]) {
  const clave = ids.join(',');
  useEffect(() => {
    pedirFuentes(ids);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave]);
}

/** Espera a que el navegador tenga las fuentes (con un tope, para no trabar nada si la red tarda). */
export function esperarFuentes(ids: FuenteId[], topeMs = 800): Promise<void> {
  pedirFuentes(ids);
  if (typeof document === 'undefined' || !document.fonts) return Promise.resolve();
  const cargas = ids.map((id) =>
    (pedidas.get(id) ?? Promise.resolve())
      .then(() => document.fonts.load(`400 1em ${FUENTES[id].pila}`))
      .catch(() => undefined),
  );
  return Promise.race([Promise.all(cargas).then(() => undefined), new Promise<void>((r) => setTimeout(r, topeMs))]);
}
