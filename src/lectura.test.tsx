import { renderToStaticMarkup } from 'react-dom/server';
import { parse } from 'yaml';
import { LECTURAS, TIPOS_PROYECTO } from './catalogo';
import { aplicarTipo, configInicial, normalizar } from './estado';
import { generarDesignMd } from './export/generarDesignMd';
import { sistemaDeDiseno } from './export/sistema';
import { CSS_LECTURA } from './lectura';
import { elegir, valorDeFicha } from './molde/recorrido';
import { Pagina } from './rapido/Pagina';
import { cssDePagina } from './rapido/hoja-pagina';
import { LECTURA } from './rondas/comunes';
import { rondaPorClave, rondasPendientes } from './rondas';
import type { Config, LecturaId, TipoProyecto } from './tipos';

const blog = () => aplicarTipo(configInicial(), 'blog');
const tipografia = (c: Config) => {
  const md = generarDesignMd(c, '2026-11-11');
  return parse(md.split('## 7. Tipografía')[1].match(/```yaml\n([\s\S]*?)```/)![1]);
};

describe('lectura del blog (D14)', () => {
  it('ofrece la ronda opcional solo en blog y deja de estar pendiente', () => {
    for (const tipo of Object.keys(TIPOS_PROYECTO) as TipoProyecto[]) {
      const c = aplicarTipo(configInicial(), tipo);
      expect(Boolean(rondaPorClave(c, 'lectura')), tipo).toBe(tipo === 'blog');
      expect(rondasPendientes(c).some((r) => r.clave === 'lectura')).toBe(false);
    }
    expect(LECTURA.obligatoria).toBe(false);
    expect(LECTURA.elegida(blog())).toBeNull();
    expect(LECTURA.opciones(blog())).toHaveLength(6);
  });

  it('cada elección cambia el lienzo y se guarda en la ficha sin pisar otras decisiones', () => {
    const base = blog();
    for (const o of LECTURA.opciones(base)) {
      const c = elegir(base, new Set(), LECTURA, o.id).config;
      const l = LECTURAS[o.id as LecturaId];
      expect(c).toEqual({ ...base, visual: { ...base.visual, lectura: o.id } });
      expect(LECTURA.elegida(c)).toBe(o.id);
      expect(valorDeFicha(c, LECTURA)).toBe(o.nombre);
      const html = renderToStaticMarkup(<Pagina config={c} />);
      expect(html).toContain('pg-lectura');
      expect(html).toContain(`--ancho-lectura:${l.ancho}ch`);
      expect(html).toContain(`--texto-lectura:${l.tamano}px`);
      expect(l.tamano).toBeGreaterThanOrEqual(16);
    }
    expect(cssDePagina()).toContain(CSS_LECTURA);
    expect(LECTURA.aplicar(base, 'toString')).toBe(base);
  });

  it('normaliza estados viejos o inválidos y conserva las elecciones válidas', () => {
    const base = blog();
    const { lectura: _lectura, ...vieja } = base.visual;
    expect(normalizar({ ...base, visual: vieja as Config['visual'] }).visual.lectura).toBeNull();
    for (const id of [undefined, null, 5, {}, 'desconocida', 'toString', '__proto__']) {
      expect(normalizar({ ...base, visual: { ...base.visual, lectura: id as LecturaId } }).visual.lectura).toBeNull();
    }
    for (const id of Object.keys(LECTURAS)) {
      const c = LECTURA.aplicar(base, id);
      expect(normalizar(JSON.parse(JSON.stringify(c)))).toEqual(c);
    }
  });

  it('exporta en §7 los mismos valores y CSS que usa el lienzo, con tokens en §16', () => {
    for (const id of Object.keys(LECTURAS)) {
      const c = LECTURA.aplicar(blog(), id);
      const s = sistemaDeDiseno(c);
      const yaml = tipografia(c);
      expect(yaml.lectura).toEqual({ ancho_maximo: s.tokens['--ancho-lectura'], tamano: s.tokens['--texto-lectura'], interlineado: 1.6 });
      expect(yaml.largo_de_linea_max).toBe(s.tokens['--ancho-lectura']);
      const md = generarDesignMd(c);
      expect(md).toContain(CSS_LECTURA);
      expect(md).toContain(`--texto-lectura: ${yaml.lectura.tamano};`);
      // La escala de la UI y los títulos conservan sus tamaños.
      expect(yaml.escala.cuerpo.tamano).toBe('16px');
    }
  });

  it('sin elegir conserva el export anterior; cambiar de tipo desactiva la lectura', () => {
    const c = LECTURA.aplicar(blog(), '70_20');
    for (const config of [blog(), aplicarTipo(c, 'dashboard')]) {
      expect(tipografia(config).lectura).toBeUndefined();
      expect(tipografia(config).largo_de_linea_max).toBe('70ch');
      expect(sistemaDeDiseno(config).tokens['--texto-lectura']).toBeUndefined();
      expect(renderToStaticMarkup(<Pagina config={config} />)).not.toContain('pg-lectura');
    }
    expect(LECTURA.elegida(aplicarTipo(aplicarTipo(c, 'dashboard'), 'blog'))).toBe('70_20');
  });
});
