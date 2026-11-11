// Dónde está la persona en el configurador (modo y paso), guardado en la URL y en localStorage.
// La URL lleva el paso en el hash (`#/rapido/tipo`, `#/detallado/cajas`, `#/avanzado/color`,
// `#/molde/color`), así
// Atrás y Adelante del navegador mueven entre pasos; localStorage lo recuerda si se vuelve sin hash.

import { useCallback, useEffect, useRef, useState } from 'react';

export type Modo = 'rapido' | 'avanzado' | 'molde';

/** Pasos del recorrido simple (sirven en los dos recorridos del modo rápido). */
export const PASOS_SIMPLES = ['inicio', 'tipo', 'paquete', 'prototipo', 'listo'] as const;
/** Pasos que solo tiene el recorrido detallado (pieza por pieza). */
export const PASOS_DETALLADOS = ['botones', 'botones_mas', 'cajas', 'formularios', 'navegacion', 'elementos', 'datos', 'movimiento'] as const;
export type PasoRapido = (typeof PASOS_SIMPLES)[number] | (typeof PASOS_DETALLADOS)[number];

export interface Ubicacion {
  modo: Modo;
  /** Paso del modo rápido, id de un paso del modo avanzado (`PASOS` en `pasos/pasos.tsx`) o, en Molde,
   *  la clave de la ronda abierta (`src/rondas/`), `inicio` o `listo`. */
  paso: string;
  /** En el modo rápido: recorrido pieza por pieza. */
  detallado: boolean;
}

export const INICIO: Ubicacion = { modo: 'rapido', paso: 'inicio', detallado: false };
export const CLAVE_UBICACION = 'configurador-diseno:ubicacion';
/** Clave vieja: solo guardaba el modo. Se lee para no perder a quien ya estaba en el avanzado. */
const CLAVE_MODO = 'configurador-diseno:modo';

const esPasoRapido = (p: string): p is PasoRapido =>
  (PASOS_SIMPLES as readonly string[]).includes(p) || (PASOS_DETALLADOS as readonly string[]).includes(p);
const esDetallado = (p: string) => (PASOS_DETALLADOS as readonly string[]).includes(p);
// Los ids del modo avanzado se validan por forma: la lista vive en el bundle del avanzado, que se carga aparte.
const esIdAvanzado = (p: string) => /^[a-z_]{1,30}$/.test(p);
// En Molde, la clave de una ronda (`color`, `galeria:producto`): también por forma, Molde la valida contra sus rondas.
const esPasoMolde = (p: string) => /^[a-z_]{1,30}(:[a-z_]{1,30})?$/.test(p);

export function aHash(u: Ubicacion): string {
  if (u.modo === 'avanzado') return `#/avanzado/${u.paso}`;
  if (u.modo === 'molde') return `#/molde/${u.paso}`;
  if (u.paso === 'inicio') return '#/inicio';
  return `#/${u.detallado ? 'detallado' : 'rapido'}/${u.paso}`;
}

/** Lee el hash; `null` si no es una ubicación válida. */
export function desdeHash(hash: string): Ubicacion | null {
  // Un link con el código de un diseño (`#c=XXXXX`, ver Inicio.tsx) abre la portada con ese diseño.
  if (esLinkConCodigo(hash)) return INICIO;
  const [, prefijo, paso] = hash.replace(/^#/, '').split('/');
  if (prefijo === 'inicio' && paso === undefined) return INICIO;
  if (!paso) return null;
  if (prefijo === 'avanzado') return esIdAvanzado(paso) ? { modo: 'avanzado', paso, detallado: false } : null;
  if (prefijo === 'molde') return esPasoMolde(paso) ? { modo: 'molde', paso, detallado: false } : null;
  if ((prefijo === 'rapido' || prefijo === 'detallado') && esPasoRapido(paso)) {
    return { modo: 'rapido', paso, detallado: prefijo === 'detallado' || esDetallado(paso) };
  }
  return null;
}

export const esLinkConCodigo = (hash: string) => /^#?c=[0-9a-z]+$/i.test(hash);

type Almacen = Pick<Storage, 'getItem' | 'setItem'>;

function almacenDelNavegador(): Almacen | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

export function leerGuardada(almacen: Almacen | null = almacenDelNavegador()): Ubicacion | null {
  try {
    const crudo = almacen?.getItem(CLAVE_UBICACION);
    if (crudo) {
      const u = JSON.parse(crudo) as Partial<Ubicacion>;
      if (typeof u?.paso === 'string') {
        const modo = u.modo === 'avanzado' || u.modo === 'molde' ? u.modo : 'rapido';
        const desde = desdeHash(aHash({ modo, paso: u.paso, detallado: !!u.detallado }));
        if (desde) return desde;
      }
    }
    if (almacen?.getItem(CLAVE_MODO) === 'avanzado') return { modo: 'avanzado', paso: 'proyecto', detallado: false };
  } catch {
    // guardado roto o sin almacenamiento: se arranca de la portada
  }
  return null;
}

export function guardar(u: Ubicacion, almacen: Almacen | null = almacenDelNavegador()) {
  try {
    almacen?.setItem(CLAVE_UBICACION, JSON.stringify(u));
    almacen?.setItem(CLAVE_MODO, u.modo);
  } catch {
    // sin almacenamiento: la ubicación dura la sesión (sigue en la URL)
  }
}

/** La URL manda; si no dice nada, lo guardado; si no hay nada, la portada. */
export function ubicacionInicial(hash: string, almacen: Almacen | null = almacenDelNavegador()): Ubicacion {
  return desdeHash(hash) ?? leerGuardada(almacen) ?? INICIO;
}

/** Posición de cada entrada en el historial, para saber si un Atrás/Adelante fue para atrás. */
interface EstadoHistorial {
  orden: number;
}
const ordenDe = (s: unknown) => (typeof (s as EstadoHistorial | null)?.orden === 'number' ? (s as EstadoHistorial).orden : 0);

/**
 * La ubicación actual, sincronizada con la URL y localStorage.
 * `ir` suma una entrada al historial; Atrás/Adelante del navegador la cambian y `atras` dice hacia dónde fue.
 */
export function useUbicacion() {
  const [estado, setEstado] = useState(() => ({
    u: ubicacionInicial(typeof location === 'undefined' ? '' : location.hash),
    atras: false,
  }));
  // Lo actual, para los manejadores (sin depender del render).
  const actual = useRef({ u: estado.u, orden: 0 });

  useEffect(() => {
    // La entrada de llegada queda con la ubicación real (corrige un hash inválido o vacío).
    actual.current.orden = ordenDe(history.state);
    // Un link con código queda como está: la portada lo lee de la URL.
    const url = esLinkConCodigo(location.hash) ? location.hash : aHash(actual.current.u);
    history.replaceState({ orden: actual.current.orden } satisfies EstadoHistorial, '', url);
    const alMoverse = () => {
      const u = desdeHash(location.hash);
      if (!u) return;
      const orden = ordenDe(history.state);
      const atras = orden < actual.current.orden;
      actual.current = { u, orden };
      setEstado({ u, atras });
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('popstate', alMoverse);
    return () => window.removeEventListener('popstate', alMoverse);
  }, []);

  useEffect(() => guardar(estado.u), [estado.u]);

  // `reemplazar` corrige la entrada actual sin sumar historial (un paso que no correspondía).
  const ir = useCallback((u: Ubicacion, atras = false, reemplazar = false) => {
    if (reemplazar) {
      history.replaceState({ orden: actual.current.orden } satisfies EstadoHistorial, '', aHash(u));
      actual.current = { ...actual.current, u };
    } else if (aHash(u) !== aHash(actual.current.u)) {
      const orden = actual.current.orden + 1;
      history.pushState({ orden } satisfies EstadoHistorial, '', aHash(u));
      actual.current = { u, orden };
    } else {
      actual.current = { ...actual.current, u };
    }
    setEstado({ u, atras });
  }, []);

  return { ubicacion: estado.u, atras: estado.atras, ir };
}
