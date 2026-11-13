import { ICONOS_VALIDOS, TONOS_VALIDOS } from '../catalogo';
import { ICONOS, TONOS } from '../catalogo-textos';
import { APARICIONES, COMBINACIONES, FUENTES, PALETAS, TIPOS_PROYECTO } from '../catalogo';
import { pasaAA } from '../compatibilidad';
import { configInicial } from '../estado';
import { ESTILOS, LAYOUTS } from '../estilos-visuales';
import { CATEGORIAS } from '../galeria';
import type { Config, EstiloId, TipoProyecto } from '../tipos';
import { generarDesignMd } from '../export/generarDesignMd';
import { COLOR, DENSIDAD, ENTRADA, ESTILO, ICONOS_RONDA, LETRA, PIEZAS, PROYECTO, RUBRO, TONO } from './comunes';
import { COMUNES, faltanObligatorias, RAMAS, rondasDe, rondasPendientes, type ClaveRonda } from './index';

const TIPOS = Object.keys(TIPOS_PROYECTO) as TipoProyecto[];
const conTipo = (tipo: TipoProyecto): Config => PROYECTO.aplicar(configInicial(), tipo);

describe('rondas de Molde (C1)', () => {
  it('cada tipo devuelve las comunes en orden y después las de su rama', () => {
    for (const tipo of TIPOS) {
      const claves = rondasDe(conTipo(tipo)).map((r) => r.clave);
      expect(claves.slice(0, COMUNES.length), tipo).toEqual(['proyecto', 'rubro', 'color', 'layout', 'estilo', 'piezas', 'letra', 'entrada', 'iconos', 'tono']);
      const deRama = RAMAS[tipo].map((e) => ('galeria' in e ? `galeria:${e.galeria}` : 'ronda' in e ? e.ronda.clave : null)).filter(Boolean);
      // La densidad (D11) es para todos: va al final si la rama no la trae.
      expect(claves.slice(COMUNES.length), tipo).toEqual(deRama.includes('densidad') ? deRama : [...deRama, 'densidad']);
      expect(new Set(claves).size, `${tipo}: claves repetidas`).toBe(claves.length);
    }
  });

  it('las ramas siguen la tabla 7.1 de PLAN.md', () => {
    const fichas = (t: TipoProyecto) => RAMAS[t].map((e) => e.ficha);
    expect(fichas('landing')).toEqual(['Fondo animado', 'Scroll', 'Secciones', 'Al pasar el mouse', 'Cursor']);
    expect(fichas('tienda')).toEqual(['Tarjeta de producto', 'Carrito y compra', 'Buscador y filtros', 'Al pasar el mouse', 'Cursor']);
    expect(fichas('dashboard')).toEqual(['Métricas', 'Gráficos', 'Tablas', 'Densidad']);
    for (const t of TIPOS) expect(RAMAS[t].length, t).toBeGreaterThanOrEqual(2);
    // Lo que todavía no existe queda anotado con su tarea.
    expect(fichas('portfolio')).toEqual(['Fondo animado', 'Scroll', 'Secciones', 'Galería de trabajos', 'Al pasar el mouse', 'Cursor']);
    expect(rondasPendientes(conTipo('landing')).map((p) => p.tarea)).toEqual(['D6']);
    expect(rondasPendientes(conTipo('tienda')).map((p) => p.clave)).toEqual([]);
  });

  it('las cinco primeras son obligatorias y el resto opcional', () => {
    const c = conTipo('landing');
    expect(rondasDe(c).filter((r) => r.obligatoria).map((r) => r.clave)).toEqual(['proyecto', 'rubro', 'color', 'layout', 'estilo']);
    expect(faltanObligatorias(c, new Set<ClaveRonda>(['proyecto', 'color'])).map((r) => r.clave)).toEqual(['rubro', 'layout', 'estilo']);
  });

  it('cada opción de cada ronda existe en el catálogo y, aplicada, queda elegida', () => {
    for (const tipo of TIPOS) {
      const base = conTipo(tipo);
      for (const r of rondasDe(base)) {
        const ops = r.opciones(base);
        expect(ops.length, `${tipo}/${r.clave}`).toBeGreaterThan(0);
        expect(new Set(ops.map((o) => o.id)).size, `${tipo}/${r.clave}: ids repetidos`).toBe(ops.length);
        // Recomendadas primero: ninguna recomendada después de una que no lo es.
        const primeraNo = ops.findIndex((o) => !o.recomendada);
        if (primeraNo >= 0) expect(ops.slice(primeraNo).some((o) => o.recomendada), `${tipo}/${r.clave}: orden`).toBe(false);
        for (const o of ops) {
          const c = r.aplicar(base, o.id);
          expect(r.elegida(c), `${tipo}/${r.clave}/${o.id}`).toBe(o.id);
        }
      }
    }
  });

  it('cada ronda de rama de la galería tiene al menos 6 recomendadas (D9)', () => {
    for (const tipo of TIPOS) {
      const base = conTipo(tipo);
      for (const r of rondasDe(base).filter((x) => x.clave.startsWith('galeria:'))) {
        const ops = r.opciones(base);
        expect(ops.filter((o) => o.recomendada).length, `${tipo}/${r.clave}`).toBeGreaterThanOrEqual(Math.min(6, ops.length));
      }
    }
  });

  it('los ids apuntan a cosas reales del catálogo', () => {
    const c = conTipo('dashboard');
    for (const o of COLOR.opciones(c)) expect(o.id in PALETAS).toBe(true);
    for (const o of ESTILO.opciones(c)) expect(o.id in ESTILOS).toBe(true);
    for (const o of LETRA.opciones(c)) for (const f of o.id.split('+')) expect(f in FUENTES, o.id).toBe(true);
    expect(LETRA.opciones(c).length).toBeGreaterThanOrEqual(COMBINACIONES.length);
    for (const r of rondasDe(c)) {
      if (r.clave === 'layout') for (const o of r.opciones(c)) expect(o.id in LAYOUTS).toBe(true);
      if (r.clave === 'entrada') for (const o of r.opciones(c)) expect(o.id in APARICIONES).toBe(true);
      if (r.clave.startsWith('galeria:')) {
        const cat = r.clave.slice('galeria:'.length) as keyof typeof CATEGORIAS;
        for (const o of r.opciones(c)) expect(o.id in CATEGORIAS[cat].disenos, `${cat}/${o.id}`).toBe(true);
      }
    }
  });

  it('estilo se ofrece según el color elegido y nunca uno que no pase AA (A3)', () => {
    for (const paleta of Object.keys(PALETAS) as (keyof typeof PALETAS)[]) {
      const c = COLOR.aplicar(conTipo('landing'), paleta);
      const ops = ESTILO.opciones(c);
      expect(ops.length, paleta).toBeGreaterThan(0);
      for (const o of ops) expect(pasaAA(paleta, o.id as EstiloId), `${paleta} × ${o.id}`).toBe(true);
    }
  });

  it('Color después de Estilo ofrece todas y solo las paletas que pasan AA (I4)', () => {
    const paletas = Object.keys(PALETAS) as (keyof typeof PALETAS)[];
    const base = conTipo('landing');
    // Solo estilos alcanzables en el recorrido: retro_os no pasa AA con ninguna paleta (A3).
    for (const { id } of ESTILO.opciones(base)) {
      const c = ESTILO.aplicar(base, id, { elegidas: new Set<ClaveRonda>(['proyecto', 'rubro']) });
      const opciones = COLOR.opciones(c);
      expect(opciones.length, id).toBeGreaterThan(0);
      expect(opciones.map((o) => o.id).sort(), id).toEqual(paletas.filter((p) => pasaAA(p, id as EstiloId)).sort());
      for (const op of opciones) {
        const elegida = COLOR.aplicar(c, op.id);
        expect(elegida.visual.estilo).toBe(id);
        expect(pasaAA(elegida.visual.paleta as keyof typeof PALETAS, id as EstiloId), `${id}/${op.id}`).toBe(true);
      }
    }
    const brutal = ESTILO.aplicar(base, 'neobrutalismo');
    expect(COLOR.opciones(brutal).some((o) => o.id === 'papel')).toBe(false);
  });

  it('elegir estilo no cambia el color, ni la letra o las piezas si ya se eligieron', () => {
    let c = COLOR.aplicar(conTipo('landing'), 'papel');
    c = LETRA.aplicar(c, 'fraunces+dm_sans');
    c = PIEZAS.aplicar(c, '2');
    const piezas = { boton: c.botones.diseno, caja: c.cajas.preset, comp: c.componentes };
    const d = ESTILO.aplicar(c, 'editorial', { elegidas: new Set<ClaveRonda>(['color', 'letra', 'piezas']) });
    expect(d.visual.paleta).toBe('papel');
    expect([d.visual.fuenteTitulos, d.visual.fuenteTexto]).toEqual(['fraunces', 'dm_sans']);
    expect({ boton: d.botones.diseno, caja: d.cajas.preset, comp: d.componentes }).toEqual(piezas);
    // Sin letra elegida, el estilo trae la suya.
    const e = ESTILO.aplicar(c, 'editorial', { elegidas: new Set<ClaveRonda>(['color']) });
    expect([e.visual.fuenteTitulos, e.visual.fuenteTexto]).toEqual(ESTILOS.editorial.fuentes[0]);
    expect(e.visual.paleta).toBe('papel');
  });

  it('cambiar de tipo conserva color, estilo, piezas y letra', () => {
    let c = conTipo('landing');
    c = COLOR.aplicar(c, 'oceano');
    c = ESTILO.aplicar(c, 'vidrio');
    c = LETRA.aplicar(c, 'sora+inter');
    c = PIEZAS.aplicar(c, '4');
    for (const tipo of TIPOS) {
      const d = PROYECTO.aplicar(c, tipo);
      expect(d.proyecto.tipo).toBe(tipo);
      expect(COLOR.elegida(d), tipo).toBe('oceano');
      expect(ESTILO.elegida(d), tipo).toBe('vidrio');
      expect(LETRA.elegida(d), tipo).toBe('sora+inter');
      expect(PIEZAS.elegida(d), tipo).toBe('4');
      // Las rondas cambian con el tipo; las elegidas de antes siguen ahí.
      expect(rondasDe(d).map((r) => r.clave)).toContain('estilo');
    }
  });

  it('iconos, tono y densidad (D11): están en todos los tipos, son opcionales y cambian solo su campo', () => {
    for (const tipo of TIPOS) {
      const base = conTipo(tipo);
      for (const clave of ['iconos', 'tono', 'densidad'] as const) {
        const r = rondasDe(base).find((x) => x.clave === clave);
        expect(r, `${tipo}/${clave}`).toBeDefined();
        expect(r!.obligatoria).toBe(false);
        expect(r!.opciones(base).some((o) => o.recomendada), `${tipo}/${clave}: sin recomendadas`).toBe(true);
      }
    }
    const base = conTipo('app_web');
    const c = rondasDe(base).find((x) => x.clave === 'tono')!.aplicar(base, 'formal');
    expect(c.tono).toEqual({ voz: 'formal', tratamiento: 'usted', largo: 'medio' });
    expect({ ...c, tono: null }).toEqual(base);
    expect(rondasPendientes(conTipo('dashboard')).map((p) => p.clave)).toEqual([]);
  });

  it('las combinaciones válidas de iconos y tono (catalogo.ts, las que usa normalizar) coinciden con las opciones', () => {
    expect([...ICONOS_VALIDOS].sort()).toEqual([...new Set(Object.values(ICONOS).map((o) => `${o.libreria}/${o.estilo}`))].sort());
    expect([...TONOS_VALIDOS].sort()).toEqual([...new Set(Object.values(TONOS).map((o) => `${o.voz}/${o.tratamiento}/${o.largo}`))].sort());
  });

  describe('valores por defecto de lo que ya no se pregunta (I2)', () => {
    const ninguna = { elegidas: new Set<ClaveRonda>() };
    const primera = (r: typeof PIEZAS, c: Config) => r.elegida(c) === r.opciones(c)[0].id;

    it('elegir estilo llena piezas, entrada, iconos, tono y densidad con la primera recomendada', () => {
      for (const tipo of TIPOS) {
        const base = conTipo(tipo);
        const c = ESTILO.aplicar(base, ESTILO.opciones(base)[0].id, ninguna);
        for (const r of [PIEZAS, ENTRADA, ICONOS_RONDA, TONO, DENSIDAD]) expect(primera(r, c), `${tipo}/${r.clave}`).toBe(true);
        expect(c.iconos && c.tono).toBeTruthy();
      }
    });

    it('elegir tipo o rubro también los llena', () => {
      const c = PROYECTO.aplicar(configInicial(), 'tienda', ninguna);
      expect(primera(TONO, c) && primera(ICONOS_RONDA, c)).toBe(true);
      const r = RUBRO.aplicar(c, RUBRO.opciones(c)[0].id, ninguna);
      expect(primera(PIEZAS, r)).toBe(true);
    });

    it('no pisa lo que la persona eligió a mano', () => {
      const base = conTipo('landing');
      const elegidas = new Set<ClaveRonda>(['letra', 'piezas', 'iconos', 'tono', 'entrada', 'densidad']);
      const rec = ICONOS_RONDA.opciones(base).slice(-1)[0].id;
      const mano = { ...ICONOS_RONDA.aplicar(base, rec), visual: { ...base.visual, densidad: 'compacta' as const, aparicion: 'giro' as const } };
      const c = ESTILO.aplicar(mano, ESTILO.opciones(mano)[0].id, { elegidas });
      expect(c.iconos).toEqual(mano.iconos);
      expect(c.visual.densidad).toBe('compacta');
      expect(c.visual.aparicion).toBe('giro');
      expect(c.tono).toEqual(mano.tono);
    });

    it('un recorrido de 4 pasos exporta un DESIGN.md sin secciones vacías', () => {
      for (const tipo of TIPOS) {
        let c = PROYECTO.aplicar(configInicial(), tipo, ninguna);
        const e = new Set<ClaveRonda>(['proyecto']);
        for (const r of [RUBRO, COLOR, ESTILO]) {
          c = r.aplicar(c, r.opciones(c)[0].id, { elegidas: e });
          e.add(r.clave);
        }
        const md = generarDesignMd(c, '2026-01-01');
        expect(md, tipo).not.toMatch(/undefined|\[object Object\]|\bnull\b/);
        for (const trozo of md.split(/^## /m).slice(1)) expect(trozo.split('\n').slice(1).join('').trim().length, `${tipo}: ${trozo.slice(0, 30)}`).toBeGreaterThan(0);
      }
    });
  });
});
