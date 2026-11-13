import { renderToStaticMarkup } from 'react-dom/server';
import { parse } from 'yaml';
import { CURSORES, HOVERS, TIPOS_PROYECTO } from './catalogo';
import { aplicarTipo, configInicial, normalizar } from './estado';
import { cssCursor, cssHoverTarjetas } from './interacciones';
import { clasesInteracciones } from './interacciones-base';
import { generarDesignMd, VERSION_FORMATO } from './export/generarDesignMd';
import { cargarHojaPagina } from './rapido/hoja';
import { Pagina } from './rapido/Pagina';
import { rondasDe } from './rondas';
import { RONDA_CURSOR, RONDA_HOVER_TARJETAS } from './rondas/ramas';
import type { Config, CursorId, HoverId, TipoProyecto } from './tipos';

const bloques = (md: string) => [...md.matchAll(/```yaml\n([\s\S]*?)\n```/g)].map((m) => parse(m[1]));
const con = (tipo: TipoProyecto = 'landing') => aplicarTipo(configInicial(), tipo);

it('H12 solo ofrece dos rondas opcionales para landing, tienda y portfolio', () => {
  for (const tipo of Object.keys(TIPOS_PROYECTO) as TipoProyecto[]) {
    const rondas = rondasDe(con(tipo)).filter((r) => ['hover_tarjetas', 'cursor'].includes(r.clave));
    expect(rondas.length, tipo).toBe(['landing', 'tienda', 'portfolio'].includes(tipo) ? 2 : 0);
    expect(rondas.every((r) => !r.obligatoria)).toBe(true);
  }
  expect(RONDA_HOVER_TARJETAS.opciones(con())).toHaveLength(7);
  expect(RONDA_CURSOR.opciones(con())).toHaveLength(4);
});

it('migra configs anteriores sin cambiar su aspecto y descarta ids inválidos', () => {
  const anterior = con();
  const { hoverTarjetas: _hover, cursor: _cursor, ...visual } = anterior.visual;
  const normal = normalizar({ ...anterior, visual } as Config);
  expect(normal.visual.hoverTarjetas).toBeNull();
  expect(normal.visual.cursor).toBeNull();
  expect(clasesInteracciones(normal)).toEqual([]);
  const invalida = normalizar({ ...anterior, visual: { ...anterior.visual, cursor: 'roto', hoverTarjetas: '__proto__' } } as unknown as Config);
  expect(invalida.visual.cursor).toBeNull();
  expect(invalida.visual.hoverTarjetas).toBeNull();
  const md = generarDesignMd(normal);
  expect(md).not.toContain('tarjetas:\n');
  expect(md).not.toContain('cursor:\n');
});

it('los efectos son independientes del botón, se guardan y §12 lleva el CSS compartido', async () => {
  await cargarHojaPagina();
  for (const tipo of ['landing', 'tienda', 'portfolio'] as const) {
    for (const id of Object.keys(HOVERS) as HoverId[]) {
      const c = RONDA_HOVER_TARJETAS.aplicar(con(tipo), id);
      expect(c.visual.hover).toBe(con(tipo).visual.hover);
      expect(normalizar(JSON.parse(JSON.stringify(c))).visual.hoverTarjetas).toBe(id);
      const md = generarDesignMd(c);
      expect(bloques(md)[0].version_formato).toBe(VERSION_FORMATO);
      expect(bloques(md).find((b) => b.tarjetas)?.tarjetas).toMatchObject({ al_pasar_el_mouse: id, clase: `tarjetas-hover-${id}` });
      expect(md).toContain(cssHoverTarjetas(id));
      expect(renderToStaticMarkup(<Pagina config={c} />)).toContain(`tarjetas-hover-${id}`);
    }
    for (const id of Object.keys(CURSORES) as CursorId[]) {
      const c = RONDA_CURSOR.aplicar(con(tipo), id);
      expect(normalizar(JSON.parse(JSON.stringify(c))).visual.cursor).toBe(id);
      const md = generarDesignMd(c);
      expect(bloques(md).find((b) => b.cursor)?.cursor).toMatchObject({ estilo: id, tactil_y_movimiento_reducido: 'normal' });
      expect(md).toContain(cssCursor(id));
      expect(renderToStaticMarkup(<Pagina config={c} />)).toContain(`cursor-${id}`);
    }
  }
});

it('cambiar de tipo no filtra estas elecciones a apps o sitios; volver las conserva', () => {
  const c = RONDA_CURSOR.aplicar(RONDA_HOVER_TARJETAS.aplicar(con(), 'elevar'), 'anillo');
  for (const tipo of ['app_web', 'app_movil', 'dashboard', 'blog', 'sitio'] as const) {
    const otra = aplicarTipo(c, tipo);
    expect(clasesInteracciones(otra)).toEqual([]);
    expect(generarDesignMd(otra)).not.toContain('tarjetas:\n');
    expect(generarDesignMd(otra)).not.toContain('cursor:\n');
    expect(clasesInteracciones(aplicarTipo(otra, 'landing'))).toEqual(['tarjetas-hover-elevar', 'cursor-anillo']);
  }
});
