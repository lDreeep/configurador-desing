import { renderToStaticMarkup } from 'react-dom/server';
import { configInicial } from '../estado';
import { esAutor, LAYOUTS } from '../estilos-visuales';
import type { LayoutId } from '../tipos';
import { autorListo, PLANTILLAS_AUTOR, precargarAutores } from './autores';
import { Pagina } from './Pagina';

describe('plantillas de autor cargadas a pedido (B2)', () => {
  it('cada layout de autor tiene su archivo y su componente', async () => {
    const autores = (Object.keys(LAYOUTS) as LayoutId[]).filter(esAutor);
    expect(Object.keys(PLANTILLAS_AUTOR).sort()).toEqual([...autores].sort());
    await precargarAutores();
    for (const id of autores) expect(autorListo(id), id).toBe(true);
  });

  it('ya cargadas, se dibujan de una (sin el «cargando»)', async () => {
    await precargarAutores();
    for (const id of Object.keys(PLANTILLAS_AUTOR) as LayoutId[]) {
      const c = configInicial();
      c.visual.layout = id;
      const html = renderToStaticMarkup(<Pagina config={c} />);
      expect(html, id).not.toContain('pg-autor-cargando');
      expect(html, id).toMatch(/class="[^"]*\bau/);
    }
  });
});
