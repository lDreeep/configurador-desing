import { TIPOS_RUBRO } from '../rubros-base';
import { IDS_FONDOS_ANIMADOS } from '../fondos-animados-base';
import { parse } from 'yaml';
import { renderToStaticMarkup } from 'react-dom/server';
import { configInicial, normalizar, aplicarTipo } from '../estado';
import { RUBROS } from '../rubros';
import { FAMILIAS } from '../familias';
import { RECOMENDADOS_RUBRO } from '../recomendados';
import { RUBRO, COLOR, LAYOUT, ESTILO, PIEZAS } from '../rondas/comunes';
import { contenido, Pagina } from '../rapido/Pagina';
import { cargarHojaPagina } from '../rapido/hoja';
import { generarDesignMd, VERSION_FORMATO } from './generarDesignMd';
import { cssDeAparicion } from './aparicion';
import { APARICIONES } from '../catalogo';
import type { AparicionId } from '../tipos';
import { FONDOS_ANIMADOS, type FondoAnimadoId } from '../fondos-animados';
import { EFECTOS_SCROLL, type ScrollId } from '../scroll';

const bloques = (md: string) => [...md.matchAll(/```yaml\n([\s\S]*?)\n```/g)].map((m) => parse(m[1]));

describe('F1 y D13', () => {
  it('los identificadores de validación coinciden con los catálogos completos', () => {
    expect(TIPOS_RUBRO).toEqual(Object.fromEntries(RUBROS.map((r) => [r.id, r.tipo])));
    expect([...IDS_FONDOS_ANIMADOS].sort()).toEqual(Object.keys(FONDOS_ANIMADOS).sort());
    const c = configInicial();
    c.proyecto.rubro = 'no_existe';
    c.visual.fondoAnimado = 'no_existe' as never;
    const limpia = normalizar(c);
    expect(limpia.proyecto.rubro).toBeUndefined();
    expect(limpia.visual.fondoAnimado).toBe('ninguno');
  });
  it('acepta configuraciones 0.9.0 sin los campos nuevos', () => {
    const anterior = configInicial();
    delete anterior.proyecto.rubro;
    delete anterior.visual.fondoAnimado;
    const c = normalizar(anterior);
    expect(c.visual.fondoAnimado).toBe('ninguno');
    expect(() => generarDesignMd(c)).not.toThrow();
    const md = generarDesignMd(c);
    expect(md).toContain(`version_formato: ${VERSION_FORMATO}`);
    expect(md).not.toContain('fondo_animado:');
    expect(md).not.toContain('\nrubro:');
  });

  it('cada entrada exporta reglas, sus keyframes y movimiento reducido', () => {
    for (const id of Object.keys(APARICIONES) as AparicionId[]) {
      const css = cssDeAparicion(id);
      if (id === 'nada') { expect(css).toBe(''); continue; }
      expect(css, id).toContain(`.pv-aparicion-${id}`);
      expect(css, id).toContain('prefers-reduced-motion');
      for (const nombre of css.match(/pv-[a-z-]+(?= var|;)/g) ?? []) expect(css, id).toContain(`@keyframes ${nombre}`);
    }
  });

  it('exporta los 16 fondos y JS solo para luz_cursor', () => {
    for (const id of Object.keys(FONDOS_ANIMADOS) as FondoAnimadoId[]) {
      const c = configInicial(); c.visual.fondoAnimado = id;
      const md = generarDesignMd(c);
      expect(md).toContain(`fondo_animado: ${id}`);
      expect(md).toContain(`.fondo-animado.fa-${id}`);
      expect(md.includes('```js')).toBe(id === 'luz_cursor');
      bloques(md);
    }
  });

  it('exporta cada efecto de scroll disponible con su CSS', () => {
    for (const id of Object.keys(EFECTOS_SCROLL) as ScrollId[]) {
      const c = configInicial(); c.visual.scroll = [id];
      const md = generarDesignMd(c);
      expect(md).toContain(`id: ${id}`);
      expect(md).toContain(`.pg.scroll-${id}`);
      expect(md).toContain('uno_por_zona: si');
      bloques(md);
    }
  });

  it('cada rubro ordena las primeras seis opciones y cambia la página', async () => {
    await cargarHojaPagina();
    for (const r of RUBROS) {
      const c = RUBRO.aplicar(aplicarTipo(configInicial(), r.tipo), r.id);
      const rec = RECOMENDADOS_RUBRO[r.id];
      expect(COLOR.opciones(c).slice(0,6).map((o) => o.id)).toEqual(rec.paletas);
      expect(LAYOUT.opciones(c).slice(0,6).map((o) => o.id)).toEqual(rec.layouts);
      const disponibles = ESTILO.opciones(c).map((o) => o.id);
      const compatibles = rec.estilos.filter((id) => disponibles.includes(id));
      expect(disponibles.slice(0, compatibles.length)).toEqual(compatibles);
      expect(PIEZAS.opciones(c).slice(0,6).map((o) => o.nombre)).toEqual(rec.familias.map((id) => FAMILIAS[id].nombre));
      expect(contenido(c)).toMatchObject(r.contenido);
      const html = renderToStaticMarkup(<Pagina config={c} />);
      expect(html).toContain(r.contenido.titular);
      const proyecto = bloques(generarDesignMd(c)).find((b) => b.tipo);
      expect(proyecto.rubro).toBe(r.id);
      expect(normalizar(JSON.parse(JSON.stringify(c))).proyecto.rubro).toBe(r.id);
      const otroTipo = r.tipo === 'landing' ? 'tienda' : 'landing';
      expect(aplicarTipo(c, otroTipo).proyecto.rubro).toBeUndefined();
    }
  });

  it('G5: cambiar a un tipo sin ronda Scroll ni Fondo animado no arrastra esas elecciones al export', () => {
    const landing = aplicarTipo(configInicial(), 'landing');
    landing.visual.scroll = ['se_aleja', 'barra_progreso'] as ScrollId[];
    landing.visual.fondoAnimado = IDS_FONDOS_ANIMADOS[0];
    expect(aplicarTipo(landing, 'sitio').visual.scroll).toHaveLength(2);
    const dash = aplicarTipo(landing, 'dashboard');
    expect(dash.visual.scroll).toEqual([]);
    expect(dash.visual.fondoAnimado).toBe('ninguno');
    const md = generarDesignMd(dash);
    expect(md).not.toContain('fondo_animado:');
    expect(md).not.toContain('uno_por_zona');
  });
});
