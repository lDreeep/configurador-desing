import { configInicial } from '../estado';
import { rondaPorClave, rondasDe, type ClaveRonda } from '../rondas';
import type { Config } from '../tipos';
import { PASOS } from '../pasos/pasos';
import { AJUSTES, CLAVE_ELEGIDAS, elegir, guardarElegidas, INICIO_MOLDE, leerElegidas, LISTO_MOLDE, resolverPaso, rondasDelRecorrido, siguiente, valorDeFicha } from './recorrido';

const memoria = () => {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k), m };
};

/** Elige la primera opción (o la indicada) de una ronda. */
function paso(c: Config, elegidas: ReadonlySet<ClaveRonda>, clave: ClaveRonda, id?: string) {
  const r = rondaPorClave(c, clave)!;
  return elegir(c, elegidas, r, id ?? r.opciones(c)[0].id);
}

describe('recorrido de Molde (C2)', () => {
  it('recorrido corto (I3): Qué es → Estructura → Estilo → Color → Lo propio, y después «listo»', () => {
    let s = { config: configInicial(), elegidas: new Set<ClaveRonda>() as ReadonlySet<ClaveRonda>, siguiente: '' };
    expect(siguiente(s.config, s.elegidas)).toBe('proyecto');
    s = paso(s.config, s.elegidas, 'proyecto', 'tienda');
    expect(s.siguiente).toBe('rubro');
    s = paso(s.config, s.elegidas, 'rubro');
    expect(s.siguiente).toBe('layout');
    s = paso(s.config, s.elegidas, 'layout');
    expect(s.siguiente).toBe('estilo');
    s = paso(s.config, s.elegidas, 'estilo');
    expect(s.siguiente).toBe('color');
    s = paso(s.config, s.elegidas, 'color', 'menta');
    expect(s.config.visual.paleta).toBe('menta');
    expect(s.siguiente).toBe('galeria:producto');
    // Lo que el recorrido no pregunta se ajusta sin moverse de su ficha, y no hace falta para terminar.
    expect(paso(s.config, s.elegidas, 'letra').siguiente).toBe('letra');
    for (const r of rondasDelRecorrido(s.config)) if (!s.elegidas.has(r.clave)) s = paso(s.config, s.elegidas, r.clave);
    expect(s.siguiente).toBe(LISTO_MOLDE);
    expect(siguiente(s.config, s.elegidas)).toBe(LISTO_MOLDE);
    expect(s.elegidas.has('letra')).toBe(false);
  });

  it('cambiar de proyecto conserva lo común y vuelve a pedir lo de la rama', () => {
    let s = paso(configInicial(), new Set(), 'proyecto', 'tienda');
    for (const k of ['color', 'layout', 'estilo', 'galeria:producto'] as const) s = paso(s.config, s.elegidas, k);
    expect(s.elegidas.has('galeria:producto')).toBe(true);
    const otro = paso(s.config, s.elegidas, 'proyecto', 'dashboard');
    expect([...otro.elegidas].sort()).toEqual(['color', 'estilo', 'layout', 'proyecto']);
    expect(otro.config.visual.paleta).toBe(s.config.visual.paleta);
    expect(otro.config.visual.estilo).toBe(s.config.visual.estilo);
    expect(otro.siguiente).toBe('rubro');
  });

  it('un paso de la URL que no corresponde se corrige', () => {
    const c = configInicial();
    expect(resolverPaso(c, new Set(), 'color').paso).toBe('proyecto');
    expect(resolverPaso(c, new Set(), 'cualquiera').paso).toBe(INICIO_MOLDE);
    expect(resolverPaso(c, new Set(), LISTO_MOLDE).paso).toBe(INICIO_MOLDE);
    expect(resolverPaso(c, new Set(['proyecto']), INICIO_MOLDE).paso).toBe('rubro');
    expect(resolverPaso(c, new Set(['proyecto']), LISTO_MOLDE).paso).toBe('rubro');
    expect(resolverPaso(c, new Set(['proyecto']), 'letra').ronda?.clave).toBe('letra');
    // Una ronda de otra rama no existe para este tipo.
    expect(resolverPaso(c, new Set(['proyecto']), 'galeria:producto').paso).toBe('rubro');
  });

  it('lo elegido se guarda y se vuelve a leer', () => {
    const a = memoria();
    guardarElegidas(new Set<ClaveRonda>(['proyecto', 'color']), a);
    expect([...leerElegidas(a)]).toEqual(['proyecto', 'color']);
    guardarElegidas(new Set(), a);
    expect(a.m.has(CLAVE_ELEGIDAS)).toBe(false);
    a.setItem(CLAVE_ELEGIDAS, '{roto');
    expect(leerElegidas(a).size).toBe(0);
  });

  it('la ficha muestra el nombre de lo elegido', () => {
    const s = paso(configInicial(), new Set(), 'proyecto', 'tienda');
    expect(valorDeFicha(s.config, rondaPorClave(s.config, 'proyecto')!)).toBe('Tienda');
  });

  it('scroll (D7): se eligen varios efectos, la ficha los nombra a todos y la ronda no se marca hasta elegir', () => {
    let r = paso(configInicial(), new Set(), 'proyecto', 'landing');
    for (const k of ['color', 'layout', 'estilo'] as ClaveRonda[]) r = paso(r.config, r.elegidas, k);
    const scroll = rondaPorClave(r.config, 'scroll')!;
    expect(scroll.maximo).toBe(3);
    r = elegir(r.config, r.elegidas, scroll, 'se_aleja');
    r = elegir(r.config, r.elegidas, scroll, 'barra_progreso');
    expect(r.elegidas.has('scroll')).toBe(true);
    expect(valorDeFicha(r.config, scroll)).toBe('Se aleja + Barra de progreso');
    r = elegir(r.config, r.elegidas, scroll, 'ninguno');
    expect(valorDeFicha(r.config, scroll)).toBe('Sin efectos');
  });
});

describe('ajustes finos de las fichas (C4)', () => {
  it('todo paso del modo avanzado se ajusta desde alguna ficha, y una sola vez', () => {
    const cubiertos = Object.values(AJUSTES).flat();
    expect(new Set(cubiertos).size).toBe(cubiertos.length);
    expect([...cubiertos].sort()).toEqual(PASOS.map((p) => p.id).sort());
  });

  it('cada ficha con ajustes es una ronda que todo proyecto ve', () => {
    const comunes = rondasDe(configInicial()).map((r) => r.clave);
    for (const clave of Object.keys(AJUSTES)) expect(comunes).toContain(clave);
  });
});
