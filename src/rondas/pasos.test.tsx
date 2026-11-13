import { renderToStaticMarkup } from 'react-dom/server';
import { TIPOS_PROYECTO } from '../catalogo';
import { configInicial } from '../estado';
import { LAYOUTS, llevaArgumento } from '../estilos-visuales';
import { Pagina } from '../rapido/Pagina';
import type { Config, LayoutId, TipoProyecto } from '../tipos';
import { PROYECTO } from './comunes';
import { ADMITE_LAYOUT, clavesPropias, MAX_PASOS, pasoDeRonda, pasosDe, rondasDe, rondasDeAjustar } from './index';

const TIPOS = Object.keys(TIPOS_PROYECTO) as TipoProyecto[];
const LISTA_LAYOUTS = Object.keys(LAYOUTS) as LayoutId[];
const con = (tipo: TipoProyecto, layout: LayoutId): Config => {
  const c = PROYECTO.aplicar(configInicial(), tipo);
  return { ...c, visual: { ...c.visual, layout } };
};

describe('pasos del recorrido corto (I1)', () => {
  it('cubre los 8 tipos y los 46 layouts: nunca más de 5 pasos, y los 4 primeros siempre', () => {
    expect(TIPOS).toHaveLength(8);
    expect(LISTA_LAYOUTS).toHaveLength(46);
    for (const tipo of TIPOS)
      for (const layout of LISTA_LAYOUTS) {
        const pasos = pasosDe(con(tipo, layout));
        expect(pasos.length, `${tipo}/${layout}`).toBeLessThanOrEqual(MAX_PASOS);
        expect(pasos.slice(0, 4).map((p) => p.id), `${tipo}/${layout}`).toEqual(['que_es', 'estructura', 'estilo', 'color']);
        for (const p of pasos) expect(p.rondas.length, `${tipo}/${layout}/${p.id}`).toBeGreaterThan(0);
      }
  });

  it('cada ronda va en un solo lugar: un paso o «Ajustar», y rondasDe sigue entera para las fichas', () => {
    for (const tipo of TIPOS)
      for (const layout of LISTA_LAYOUTS) {
        const c = con(tipo, layout);
        const enPasos = pasosDe(c).flatMap((p) => p.rondas.map((r) => r.clave));
        const ajustar = rondasDeAjustar(c).map((r) => r.clave);
        expect(new Set(enPasos).size).toBe(enPasos.length);
        expect(enPasos.filter((k) => ajustar.includes(k))).toEqual([]);
        for (const k of rondasDe(c).map((r) => r.clave)) expect([...enPasos, ...ajustar], `${tipo}/${layout}`).toContain(k);
      }
  });

  it('letra, piezas, iconos, tono, entrada y densidad dejan de ser pasos', () => {
    const ajustar = rondasDeAjustar(con('landing', 'hero_partido')).map((r) => r.clave);
    for (const k of ['letra', 'piezas', 'iconos', 'tono', 'entrada', 'densidad'] as const) expect(ajustar).toContain(k);
    expect(pasoDeRonda(con('landing', 'hero_partido'), 'letra')).toBeNull();
    expect(pasoDeRonda(con('landing', 'hero_partido'), 'rubro')?.id).toBe('que_es');
  });

  it('un layout sin fondo no ofrece fondo animado; uno con fondo sí (landing)', () => {
    for (const layout of LISTA_LAYOUTS)
      expect(clavesPropias(con('landing', layout)).includes('fondo_animado'), layout).toBe(ADMITE_LAYOUT[layout].fondo);
  });

  it('scroll y secciones siguen lo que admite el layout', () => {
    for (const layout of LISTA_LAYOUTS) {
      const pasos = pasosDe(con('landing', layout));
      const claves = pasos.flatMap((p) => p.rondas.map((r) => r.clave));
      expect(claves.includes('scroll'), layout).toBe(ADMITE_LAYOUT[layout].scroll);
      expect(claves.includes('secciones'), layout).toBe(ADMITE_LAYOUT[layout].secciones);
      // H12 agrega hover y cursor opcionales incluso cuando el layout no tiene scroll.
      expect(pasos.length, layout).toBe(5);
    }
    // Secciones solo para landing, sitio y portfolio.
    for (const tipo of ['tienda', 'app_web', 'app_movil', 'dashboard', 'blog'] as const)
      expect(pasosDe(con(tipo, 'hero_partido'))[1].rondas.map((r) => r.clave)).toEqual(['layout']);
  });

  it('la tabla coincide con lo que dibuja la página', () => {
    for (const layout of LISTA_LAYOUTS) {
      const html = renderToStaticMarkup(<Pagina config={con('landing', layout)} />);
      expect(/pg-media|pg-fondo-area/.test(html), `${layout}: fondo`).toBe(ADMITE_LAYOUT[layout].fondo);
      expect(ADMITE_LAYOUT[layout].secciones, `${layout}: secciones`).toBe(llevaArgumento(layout));
    }
  });
});
