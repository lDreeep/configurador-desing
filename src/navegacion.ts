// Ronda de Molde en la URL y localStorage. Migra rutas del recorrido anterior.
import { useCallback, useEffect, useRef, useState } from 'react';

export type Modo = 'molde';
export interface Ubicacion { modo: Modo; paso: string; detallado: false; }
export const INICIO: Ubicacion = { modo: 'molde', paso: 'inicio', detallado: false };
export const CLAVE_UBICACION = 'configurador-diseno:ubicacion';
const CLAVE_MODO = 'configurador-diseno:modo';
const ubicacion = (paso: string): Ubicacion => ({ modo: 'molde', paso, detallado: false });
const esPasoMolde = (p: string) => /^[a-z_]{1,30}(:[a-z_]{1,30})?$/.test(p);
const RAPIDO: Record<string, string> = {
  inicio: 'inicio', tipo: 'proyecto', paquete: 'piezas', botones: 'piezas', botones_mas: 'piezas',
  cajas: 'estilo', formularios: 'galeria:formulario', navegacion: 'layout', elementos: 'piezas',
  datos: 'galeria:tabla', movimiento: 'entrada', prototipo: 'listo', listo: 'listo',
};
const AVANZADO: Record<string, string> = {
  proyecto: 'proyecto', estructura: 'layout', funciones: 'proyecto', direccion: 'estilo',
  color: 'color', tipografia: 'letra', forma: 'estilo', botones: 'piezas', movimiento: 'entrada', exportar: 'listo',
};
export function aHash(u: Ubicacion): string { return '#/' + u.paso; }
export function desdeHash(hash: string): Ubicacion | null {
  if (esLinkConCodigo(hash)) return INICIO;
  const partes = hash.replace(/^#/, '').split('/');
  if (partes[0] !== '' || partes.length < 2 || partes.length > 3) return null;
  const [, prefijo, paso] = partes;
  if (partes.length === 2) {
    if (['rapido', 'detallado', 'avanzado', 'molde'].includes(prefijo)) return null;
    return esPasoMolde(prefijo) ? ubicacion(prefijo) : null;
  }
  if (prefijo === 'molde') return esPasoMolde(paso) ? ubicacion(paso) : null;
  const mapa = prefijo === 'avanzado' ? AVANZADO : prefijo === 'rapido' || prefijo === 'detallado' ? RAPIDO : {};
  const equivalente = Object.prototype.hasOwnProperty.call(mapa, paso) ? mapa[paso] : null;
  return equivalente ? ubicacion(equivalente) : null;
}
export const esLinkConCodigo = (hash: string) => /^#?c=[+~]?[0-9a-z]+$/i.test(hash);

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
      const u = JSON.parse(crudo) as { modo?: string; paso?: unknown };
      if (typeof u?.paso === 'string') {
        const prefijo = u.modo === 'molde' ? 'molde' : u.modo === 'avanzado' ? 'avanzado' : 'rapido';
        const desde = desdeHash('#/' + prefijo + '/' + u.paso);
        if (desde) return desde;
      }
    }
    if (almacen?.getItem(CLAVE_MODO) === 'avanzado') return ubicacion('proyecto');
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
    const url = aHash(actual.current.u);
    history.replaceState({ orden: actual.current.orden } satisfies EstadoHistorial, '', url);
    const alMoverse = () => {
      const u = desdeHash(location.hash);
      if (!u) return;
      history.replaceState(history.state, '', aHash(u));
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
