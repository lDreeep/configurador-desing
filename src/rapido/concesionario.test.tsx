import { renderToStaticMarkup } from 'react-dom/server';
import { Concesionario, MODELOS_CONCESIONARIO } from './concesionario';
import { aplicarCombinacion, codigo, decodificar } from './combinar';
import { configInicial } from '../estado';
import { RECETAS_AUTOR, MARCAS_AUTOR } from '../estilos-visuales';
import { generarDesignMd } from '../export/generarDesignMd';

describe('plantilla de concesionario', () => {
  const receta = { layout: 'autor_concesionario' as const, ...RECETAS_AUTOR.autor_concesionario! };
  it('conserva el código compartido y exporta la composición real', () => {
    expect(decodificar(codigo(receta))).toEqual(receta);
    const md = generarDesignMd(aplicarCombinacion(configInicial(), receta));
    expect(md).toContain('layout: autor_concesionario');
    expect(md).toContain('.au-mot-hero');
    expect(md).toContain('aria-pressed');
    expect(MARCAS_AUTOR.autor_concesionario).toBe('Tracción');
  });
  it('renderiza los controles, las imágenes identificadas y una marca propia', () => {
    const html = renderToStaticMarkup(<Concesionario c={configInicial()} marca="Mi concesionaria" />);
    expect(html).toContain('Mi concesionaria');
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('Ver ficha del modelo');
    expect(html).toContain('generada con IA');
    for (const modelo of MODELOS_CONCESIONARIO) expect(html).toContain(modelo.nombre);
  });
});
