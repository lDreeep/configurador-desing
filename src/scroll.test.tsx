import { renderToStaticMarkup } from 'react-dom/server';
import { configInicial, normalizar } from './estado';
import { Pagina } from './rapido/Pagina';
import { RONDA_SCROLL, SIN_SCROLL } from './rondas';
import { ELEMENTO_SCROLL, ZONA_DE_SCROLL } from './scroll-base';
import {
  combinarScroll,
  cssDeScroll,
  EFECTOS_SCROLL,
  limpiarScroll,
  MAX_SCROLL,
  problemaScroll,
  SCROLL_PENDIENTES,
  scrollValido,
  ZONAS_SCROLL,
  type ScrollId,
  type ZonaScroll,
} from './scroll';
import type { Config } from './tipos';

const IDS = Object.keys(EFECTOS_SCROLL) as ScrollId[];
const conScroll = (scroll: ScrollId[]): Config => {
  const c = configInicial();
  return { ...c, visual: { ...c.visual, scroll } };
};

/** Todas las combinaciones válidas (subconjuntos de hasta 3, uno por zona). */
function combinacionesValidas(): ScrollId[][] {
  const salida: ScrollId[][] = [[]];
  for (const id of IDS) for (const c of [...salida]) if (scrollValido([...c, id])) salida.push([...c, id]);
  return salida;
}

describe('efectos de scroll (D7)', () => {
  it('el catálogo y los pendientes suman los 14 de PLAN.md §7.4, en 4 zonas', () => {
    expect(IDS.length + SCROLL_PENDIENTES.length).toBe(14);
    const porZona = (z: ZonaScroll) => IDS.filter((id) => EFECTOS_SCROLL[id].zona === z).length + SCROLL_PENDIENTES.filter((p) => p.zona === z).length;
    expect(Object.keys(ZONAS_SCROLL).map((z) => porZona(z as ZonaScroll))).toEqual([4, 4, 4, 2]);
    // Hay al menos uno por zona: se puede armar una combinación de 3.
    for (const z of Object.keys(ZONAS_SCROLL)) expect(IDS.some((id) => EFECTOS_SCROLL[id].zona === z), z).toBe(true);
    const nombres = [...IDS.map((id) => EFECTOS_SCROLL[id].nombre), ...SCROLL_PENDIENTES.map((p) => p.nombre)];
    expect(new Set(nombres).size).toBe(nombres.length);
  });

  it('el motor rechaza dos de la misma zona, más de 3 e ids que no existen', () => {
    const [a, b, c, d] = (Object.keys(ZONAS_SCROLL) as ZonaScroll[]).map((z) => IDS.find((id) => EFECTOS_SCROLL[id].zona === z)!);
    expect(problemaScroll([])).toBeNull();
    expect(problemaScroll([a, b, c])).toBeNull();
    expect(problemaScroll([a, b, c, d])).toMatch(/hasta 3/);
    expect(problemaScroll([a, 'inventado'])).toMatch(/No existe/);
    // Un efecto de una zona más otro de la misma zona: hace falta un segundo efecto en alguna zona.
    expect(problemaScroll([a, a])).toMatch(/uno por zona/);
    for (const x of IDS)
      for (const y of IDS) if (x !== y && EFECTOS_SCROLL[x].zona === EFECTOS_SCROLL[y].zona) expect(scrollValido([x, y]), `${x}+${y}`).toBe(false);
  });

  it('combinar: suma, saca, reemplaza al de su zona y nunca pasa de 3', () => {
    const [a, b, c, d] = (Object.keys(ZONAS_SCROLL) as ZonaScroll[]).map((z) => IDS.find((id) => EFECTOS_SCROLL[id].zona === z)!);
    expect(combinarScroll([], a)).toEqual([a]);
    expect(combinarScroll([a, b], a)).toEqual([b]);
    expect(combinarScroll([a, b, c], d)).toEqual([b, c, d]);
    // Desde cualquier combinación válida, elegir cualquier efecto deja una combinación válida con ese efecto al final.
    for (const comb of combinacionesValidas())
      for (const id of IDS) {
        const r = combinarScroll(comb, id);
        expect(scrollValido(r), `${comb}+${id}`).toBe(true);
        if (!comb.includes(id)) expect(r[r.length - 1]).toBe(id);
        else expect(r).not.toContain(id);
      }
  });

  it('limpiar arregla lo guardado y normalizar lo usa', () => {
    expect(limpiarScroll(undefined)).toEqual([]);
    expect(limpiarScroll(['nada', 3, 'se_aleja', 'barra_progreso'])).toEqual(['se_aleja', 'barra_progreso']);
    const guardado = { visual: { ...configInicial().visual, scroll: ['se_aleja', 'inventado'] as ScrollId[] } };
    expect(normalizar(guardado).visual.scroll).toEqual(['se_aleja']);
    expect(normalizar({}).visual.scroll).toEqual([]);
  });

  it('cada efecto tiene su CSS con tokens, versión quieta y cambia solo propiedades sueltas', () => {
    const keyframes = new Set<string>();
    for (const id of IDS) {
      const e = EFECTOS_SCROLL[id];
      const css = cssDeScroll(id, '.pg.scroll-x');
      expect(css, id).toMatch(/^@supports \(animation-timeline: view\(\)\) \{\n@media \(prefers-reduced-motion: no-preference\) \{/);
      expect(css, id).not.toContain('&');
      expect(css, id).toMatch(/animation-timeline: (view|scroll)\(/);
      expect(e.quieto.length, id).toBeGreaterThan(10);
      // Sin colores sueltos: solo tokens de la paleta.
      expect(e.css, id).not.toMatch(/#[0-9a-f]{3,8}\b|rgba?\(/i);
      // No pisa el transform del estilo: anima translate, scale, opacity, filter o clip-path.
      expect(e.css, id).not.toMatch(/\btransform:/);
      for (const k of e.css.matchAll(/@keyframes ([\w-]+)/g)) {
        expect(keyframes.has(k[1]), `${id}: @keyframes ${k[1]} repetido`).toBe(false);
        keyframes.add(k[1]);
      }
    }
  });

  it('cualquier combinación válida funciona junta: cada efecto anima elementos distintos', () => {
    const selectores = (id: ScrollId) => [...EFECTOS_SCROLL[id].css.matchAll(/^& (.+?) \{/gm)].map((m) => m[1]);
    for (const comb of combinacionesValidas()) {
      const todos = comb.flatMap(selectores);
      expect(new Set(todos).size, comb.join('+')).toBe(todos.length);
    }
  });

  it('la página lleva una clase por efecto y dibuja la barra solo si se eligió', () => {
    for (const comb of combinacionesValidas()) {
      const html = renderToStaticMarkup(<Pagina config={conScroll(comb)} />);
      const clases = html.match(/^<div class="([^"]+)"/)![1].split(' ');
      for (const id of IDS) expect(clases.includes(`scroll-${id}`), `${comb} / ${id}`).toBe(comb.includes(id));
      // La barra va primera dentro de la página, antes de la decoración.
      expect(/^<div class="[^"]+"[^>]*><div class="scroll-barra" aria-hidden="true">/.test(html), comb.join('+')).toBe(comb.includes('barra_progreso'));
    }
  });

  it('la ronda Scroll suma efectos, reemplaza en la zona y «Sin efectos» vacía', () => {
    let c = configInicial();
    c = RONDA_SCROLL.aplicar(c, 'se_aleja');
    c = RONDA_SCROLL.aplicar(c, 'barra_progreso');
    expect(c.visual.scroll).toEqual(['se_aleja', 'barra_progreso']);
    expect(RONDA_SCROLL.marcadas!(c)).toEqual(['se_aleja', 'barra_progreso']);
    expect(RONDA_SCROLL.maximo).toBe(MAX_SCROLL);
    c = RONDA_SCROLL.aplicar(c, SIN_SCROLL);
    expect(c.visual.scroll).toEqual([]);
    expect(RONDA_SCROLL.elegida(c)).toBe(SIN_SCROLL);
  });

  it('la base liviana (scroll-base.ts, la que usa la portada) coincide con el catálogo', () => {
    expect(Object.keys(ZONA_DE_SCROLL).sort()).toEqual(Object.keys(EFECTOS_SCROLL).sort());
    for (const [id, e] of Object.entries(EFECTOS_SCROLL)) {
      expect(ZONA_DE_SCROLL[id as ScrollId], id).toBe(e.zona);
      expect(ELEMENTO_SCROLL[id as ScrollId], id).toBe(e.elemento);
    }
  });
});
