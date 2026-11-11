// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { aHash, CLAVE_UBICACION, desdeHash, guardar, INICIO, leerGuardada, ubicacionInicial, useUbicacion, type Ubicacion } from './navegacion';

// React avisa si `act` corre fuera de un entorno de test que lo declare.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const memoria = () => {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), m };
};

describe('ubicación en la URL', () => {
  it('ida y vuelta entre ubicación y hash', () => {
    const casos: Ubicacion[] = [
      INICIO,
      { modo: 'rapido', paso: 'tipo', detallado: false },
      { modo: 'rapido', paso: 'prototipo', detallado: true },
      { modo: 'rapido', paso: 'cajas', detallado: true },
      { modo: 'avanzado', paso: 'color', detallado: false },
      { modo: 'molde', paso: 'color', detallado: false },
      { modo: 'molde', paso: 'galeria:producto', detallado: false },
    ];
    for (const u of casos) expect(desdeHash(aHash(u)), aHash(u)).toEqual(u);
  });

  it('rechaza hashes que no son ubicaciones', () => {
    for (const h of ['', '#', '#/', '#/rapido/nada', '#/rapido', '#/avanzado/<script>', '#/molde/', '#/molde/a:b:c', '#/molde/<x>', '#/otro/tipo', '#seccion']) expect(desdeHash(h), h).toBeNull();
  });

  it('un link con el código de un diseño abre la portada aunque haya algo guardado', () => {
    const a = memoria();
    guardar({ modo: 'rapido', paso: 'prototipo', detallado: false }, a);
    expect(ubicacionInicial('#c=1A2B3', a)).toEqual(INICIO);
  });

  it('un paso del recorrido detallado siempre es detallado', () => {
    expect(desdeHash('#/rapido/cajas')).toEqual({ modo: 'rapido', paso: 'cajas', detallado: true });
  });

  it('la URL manda; sin URL, lo guardado; sin nada, la portada', () => {
    const a = memoria();
    expect(ubicacionInicial('', a)).toEqual(INICIO);
    guardar({ modo: 'rapido', paso: 'paquete', detallado: false }, a);
    expect(ubicacionInicial('', a)).toEqual({ modo: 'rapido', paso: 'paquete', detallado: false });
    expect(ubicacionInicial('#/avanzado/forma', a)).toEqual({ modo: 'avanzado', paso: 'forma', detallado: false });
  });

  it('lo guardado roto o viejo no rompe', () => {
    const a = memoria();
    a.setItem(CLAVE_UBICACION, '{roto');
    expect(leerGuardada(a)).toBeNull();
    a.setItem(CLAVE_UBICACION, JSON.stringify({ modo: 'rapido', paso: 'no_existe' }));
    expect(leerGuardada(a)).toBeNull();
    // Antes solo se guardaba el modo.
    const b = memoria();
    b.setItem('configurador-diseno:modo', 'avanzado');
    expect(leerGuardada(b)).toEqual({ modo: 'avanzado', paso: 'proyecto', detallado: false });
  });
});

describe('useUbicacion con el historial del navegador', () => {
  let ultimo: ReturnType<typeof useUbicacion>;
  function Sonda() {
    ultimo = useUbicacion();
    return <p>{aHash(ultimo.ubicacion)}</p>;
  }
  const esperarPopstate = () => new Promise<void>((r) => window.addEventListener('popstate', () => setTimeout(r, 0), { once: true }));

  it('Atrás y Adelante mueven entre pasos, y recargar deja donde estaba', async () => {
    localStorage.clear();
    history.replaceState(null, '', '/');
    window.scrollTo = () => {};
    const div = document.createElement('div');
    let raiz = createRoot(div);
    act(() => raiz.render(<Sonda />));
    expect(location.hash).toBe('#/inicio');

    act(() => ultimo.ir({ modo: 'rapido', paso: 'tipo', detallado: false }));
    act(() => ultimo.ir({ modo: 'rapido', paso: 'paquete', detallado: false }));
    expect(location.hash).toBe('#/rapido/paquete');

    const atras = esperarPopstate();
    history.back();
    await act(() => atras);
    expect(ultimo.ubicacion.paso).toBe('tipo');
    expect(ultimo.atras).toBe(true);

    const adelante = esperarPopstate();
    history.forward();
    await act(() => adelante);
    expect(ultimo.ubicacion.paso).toBe('paquete');
    expect(ultimo.atras).toBe(false);

    // Recargar: se desmonta y se vuelve a montar con la misma URL.
    act(() => raiz.unmount());
    raiz = createRoot(div);
    act(() => raiz.render(<Sonda />));
    expect(ultimo.ubicacion).toEqual({ modo: 'rapido', paso: 'paquete', detallado: false });

    // Entrar sin hash (otra pestaña, link guardado): sigue desde lo guardado.
    act(() => raiz.unmount());
    history.replaceState(null, '', '/');
    raiz = createRoot(div);
    act(() => raiz.render(<Sonda />));
    expect(location.hash).toBe('#/rapido/paquete');
    act(() => raiz.unmount());
  });
});
