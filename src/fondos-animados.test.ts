import { describe, expect, it } from 'vitest';
import { cssDeFondoAnimado, FONDOS_ANIMADOS, type FondoAnimadoId, JS_LUZ_CURSOR, SELECTOR_FONDO_ANIMADO } from './fondos-animados';

const ids = Object.keys(FONDOS_ANIMADOS) as FondoAnimadoId[];

describe('fondos animados', () => {
  it('son los 16 de PLAN.md §7.7, seis de la maqueta', () => {
    expect(ids).toHaveLength(16);
    expect(ids.filter((id) => FONDOS_ANIMADOS[id].deLaMaqueta)).toHaveLength(6);
    expect(new Set(ids.map((id) => FONDOS_ANIMADOS[id].nombre)).size).toBe(16);
  });

  it('solo la luz que sigue al cursor usa JS', () => {
    expect(ids.filter((id) => FONDOS_ANIMADOS[id].js)).toEqual(['luz_cursor']);
    expect(JS_LUZ_CURSOR).toContain('.fa-luz_cursor');
    expect(JS_LUZ_CURSOR).toContain('prefers-reduced-motion');
  });

  it.each(ids)('%s: colores solo de la paleta', (id) => {
    const f = FONDOS_ANIMADOS[id];
    const css = f.css + f.keyframes + (f.quieto ?? '');
    // Fuera de los SVG (que son máscaras en blanco y negro), nada de hex, rgb ni hsl propios.
    const sinSvg = css.replace(/url\("data:[^"]*"\)/g, '');
    expect(sinSvg).not.toMatch(/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i);
    expect(css).toMatch(/var\(--color-/);
  });

  it.each(ids)('%s: se mueve con transform u opacity, y sus animaciones existen', (id) => {
    const f = FONDOS_ANIMADOS[id];
    const usadas = [...f.css.matchAll(/animation:\s*(fa-[\w-]+)/g)].map((m) => m[1]);
    const definidas = [...f.keyframes.matchAll(/@keyframes\s+(fa-[\w-]+)/g)].map((m) => m[1]);
    if (f.js) expect(f.css).toMatch(/transition:\s*transform/);
    else expect(usadas.length).toBeGreaterThan(0);
    for (const a of usadas) expect(definidas, a).toContain(a);
    // Dentro de los keyframes solo se animan propiedades que no obligan a repintar.
    const props = [...f.keyframes.matchAll(/[{;]\s*([a-z-]+)\s*:/g)].map((m) => m[1]);
    for (const p of props) expect(['transform', 'opacity'], `${id}: ${p}`).toContain(p);
  });

  it.each(ids)('%s: CSS listo para exportar, con versión quieta', (id) => {
    const css = cssDeFondoAnimado(id);
    const sel = SELECTOR_FONDO_ANIMADO(id);
    expect(css).not.toContain('&');
    expect(css).toContain(`${sel}::before`);
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*animation: none !important/);
    expect(css.split('{').length).toBe(css.split('}').length);
    expect(cssDeFondoAnimado(id, '.otra')).toContain('.otra::before');
  });
});
