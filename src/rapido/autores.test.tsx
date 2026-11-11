import { renderToStaticMarkup } from 'react-dom/server';
import { configInicial } from '../estado';
import { esAutor, LAYOUTS } from '../estilos-visuales';
import type { LayoutId } from '../tipos';
import { LAYOUTS_APARTE, layoutListo, PLANTILLAS_AUTOR, precargarLayouts } from './autores';
import { Pagina } from './Pagina';

describe('layouts cargados a pedido (B2)', () => {
  it('cada layout de autor tiene su archivo y su componente', async () => {
    const autores = (Object.keys(LAYOUTS) as LayoutId[]).filter(esAutor);
    expect(Object.keys(PLANTILLAS_AUTOR).sort()).toEqual([...autores].sort());
    await precargarLayouts();
    for (const id of autores) expect(layoutListo(id), id).toBe(true);
  });

  it('los layouts aparte existen en el catálogo', () => {
    for (const id of Object.keys(LAYOUTS_APARTE)) expect(LAYOUTS[id as LayoutId], id).toBeDefined();
  });

  it('ya cargados, se dibujan de una (sin el «cargando»)', async () => {
    await precargarLayouts();
    for (const id of Object.keys(PLANTILLAS_AUTOR) as LayoutId[]) {
      const c = configInicial();
      c.visual.layout = id;
      const html = renderToStaticMarkup(<Pagina config={c} />);
      expect(html, id).not.toContain('pg-autor-cargando');
      expect(html, id).toMatch(/class="[^"]*\bau/);
    }
    for (const id of Object.keys(LAYOUTS_APARTE) as LayoutId[]) {
      const c = configInicial();
      c.visual.layout = id;
      const html = renderToStaticMarkup(<Pagina config={c} />);
      expect(html, id).not.toContain('pg-autor-cargando');
      expect(html, id).toContain('pg-card');
    }
  });
});
