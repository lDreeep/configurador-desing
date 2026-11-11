import { describe, expect, it } from 'vitest';
import { CONTENIDO_TIPO } from './rapido/contenido-tipo';
import { RUBROS, rubrosDe } from './rubros';
import type { TipoProyecto } from './tipos';

const TIPOS = Object.keys(CONTENIDO_TIPO) as TipoProyecto[];

// Largo máximo de cada campo entre los textos actuales de contenido-tipo.ts.
const max = (xs: string[]) => Math.max(...xs.map((s) => s.length));
const cs = Object.values(CONTENIDO_TIPO);
const LIMITE = {
  marca: max(cs.map((c) => c.marca)),
  titular: max(cs.map((c) => c.titular)),
  bajada: max(cs.map((c) => c.bajada)),
  cta: max(cs.map((c) => c.cta)),
  ctaSecundario: max(cs.map((c) => c.ctaSecundario)),
  itemTitulo: max(cs.flatMap((c) => c.items.map((i) => i.titulo))),
  itemTexto: max(cs.flatMap((c) => c.items.map((i) => i.texto))),
};

describe('rubros', () => {
  it('son 39, con ids únicos', () => {
    expect(RUBROS).toHaveLength(39);
    expect(new Set(RUBROS.map((r) => r.id)).size).toBe(39);
  });

  it.each(TIPOS)('el tipo %s tiene al menos 4 rubros', (tipo) => {
    expect(rubrosDe(tipo).length).toBeGreaterThanOrEqual(4);
  });

  it('cada rubro tiene su contenido completo y tres ítems', () => {
    for (const r of RUBROS) {
      const c = r.contenido;
      for (const t of [r.nombre, c.marca, c.titular, c.bajada, c.cta, c.ctaSecundario]) expect(t.trim()).not.toBe('');
      expect(c.items).toHaveLength(3);
    }
  });

  it('ningún texto supera el largo de los actuales', () => {
    for (const r of RUBROS) {
      const c = r.contenido;
      const donde = (campo: string) => `${r.id}.${campo}`;
      expect([donde('marca'), c.marca.length <= LIMITE.marca]).toEqual([donde('marca'), true]);
      expect([donde('titular'), c.titular.length <= LIMITE.titular]).toEqual([donde('titular'), true]);
      expect([donde('bajada'), c.bajada.length <= LIMITE.bajada]).toEqual([donde('bajada'), true]);
      expect([donde('cta'), c.cta.length <= LIMITE.cta]).toEqual([donde('cta'), true]);
      expect([donde('ctaSecundario'), c.ctaSecundario.length <= LIMITE.ctaSecundario]).toEqual([donde('ctaSecundario'), true]);
      c.items.forEach((i, n) => {
        expect([donde(`item${n}.titulo`), i.titulo.length <= LIMITE.itemTitulo]).toEqual([donde(`item${n}.titulo`), true]);
        expect([donde(`item${n}.texto`), i.texto.length <= LIMITE.itemTexto]).toEqual([donde(`item${n}.texto`), true]);
      });
    }
  });
});

describe('recomendados por rubro', () => {
  it('cada rubro tiene recomendados y no sobra ninguno', async () => {
    const { RECOMENDADOS_RUBRO } = await import('./recomendados');
    expect(Object.keys(RECOMENDADOS_RUBRO).sort()).toEqual(RUBROS.map((r) => r.id).sort());
  });

  it('cada rubro tiene al menos 6 recomendados por ronda, sin repetir, y todos existen', async () => {
    const { RECOMENDADOS_RUBRO } = await import('./recomendados');
    const { PALETAS } = await import('./catalogo');
    const { ESTILOS, LAYOUTS } = await import('./estilos-visuales');
    const { FAMILIAS } = await import('./familias');
    for (const r of RUBROS) {
      const rec = RECOMENDADOS_RUBRO[r.id];
      const rondas = [
        ['paletas', rec.paletas, PALETAS],
        ['layouts', rec.layouts, LAYOUTS],
        ['estilos', rec.estilos, ESTILOS],
        ['familias', rec.familias, FAMILIAS],
      ] as const;
      for (const [nombre, ids, catalogo] of rondas) {
        expect(ids.length, `${r.id} ${nombre}`).toBeGreaterThanOrEqual(6);
        expect(new Set(ids).size, `${r.id} ${nombre} repetidos`).toBe(ids.length);
        for (const id of ids) expect((catalogo as Record<string, unknown>)[id], `${r.id} ${nombre} ${id}`).toBeDefined();
      }
    }
  });

  it('conRubro pone primero lo del rubro y no repite', async () => {
    const { conRubro } = await import('./recomendados');
    expect(conRubro(['b', 'a'], ['a', 'c'])).toEqual(['b', 'a', 'c']);
    expect(conRubro(undefined, ['a'])).toEqual(['a']);
  });
});
