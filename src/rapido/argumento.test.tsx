import { renderToStaticMarkup } from 'react-dom/server';
import { configInicial } from '../estado';
import { generarDesignMd } from '../export/generarDesignMd';
import { CONTENIDO_TIPO } from './contenido-tipo';
import { Pagina } from './Pagina';

describe('argumento de landing (D77)', () => {
  it('cada tipo de proyecto trae prueba, frase y preguntas', () => {
    for (const [tipo, k] of Object.entries(CONTENIDO_TIPO)) {
      expect(k.prueba, tipo).toBeTruthy();
      expect(k.frase.split(' ').length, tipo).toBeGreaterThan(8);
      expect(k.preguntas.length, tipo).toBeGreaterThanOrEqual(4);
    }
  });
  it('las páginas genéricas muestran prueba, frase y preguntas; el export lo describe', () => {
    const c = configInicial();
    c.visual.layout = 'hero_partido';
    const html = renderToStaticMarkup(<Pagina config={c} />);
    expect(html).toContain('pg-prueba');
    expect(html).toContain('au3-frase');
    expect(html).toContain('<details');
    expect(generarDesignMd(c)).toContain('layout_argumento:');
  });
  it('la app con menú lateral y las plantillas de autor no llevan el argumento genérico', () => {
    const c = configInicial();
    c.visual.layout = 'app_lateral';
    expect(renderToStaticMarkup(<Pagina config={c} />)).not.toContain('pg-arg');
    expect(generarDesignMd(c)).not.toContain('layout_argumento:');
  });
});
