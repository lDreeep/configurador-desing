import { renderToStaticMarkup } from 'react-dom/server';
import { aplicarTipo, configInicial } from '../estado';
import { LAYOUTS, llevaArgumento } from '../estilos-visuales';
import { ESTRUCTURA_LAYOUT } from '../export/estructuras-layout';
import { TIPOS_PROYECTO } from '../catalogo';
import type { LayoutId, TipoProyecto } from '../tipos';
import { ESQUEMAS } from './esquemas';
import { Pagina } from './Pagina';

const NUEVOS: [LayoutId, string][] = [
  ['linea_tiempo', 'pg-lt'],
  ['antes_despues', 'pg-ad'],
  ['mapa_lista', 'pg-ml'],
  ['carta', 'pg-carta'],
  ['agenda_semanal', 'pg-ag'],
  ['tablero', 'pg-tb'],
  ['muro', 'pg-muro'],
  ['documentacion', 'pg-doc'],
  ['link_bio', 'pg-lb'],
  ['compra_unica', 'pg-co'],
  ['portada_buscador', 'pg-bq'],
  ['partida_scroll', 'pg-ps'],
];

describe('layouts genéricos de la tanda D3', () => {
  it('cada uno tiene nombre, esquema y estructura para el export', () => {
    for (const [id] of NUEVOS) {
      expect(LAYOUTS[id].nombre, id).toBeTruthy();
      expect(ESQUEMAS[id].length, id).toBeGreaterThan(3);
      expect(ESTRUCTURA_LAYOUT[id].length, id).toBeGreaterThan(200);
      // La estructura dice qué pasa en celular: es lo que la IA suele inventar.
      expect(ESTRUCTURA_LAYOUT[id], id).toMatch(/celular/i);
    }
  });

  it('se dibujan con el contenido de cualquier tipo de proyecto', () => {
    for (const tipo of Object.keys(TIPOS_PROYECTO) as TipoProyecto[]) {
      for (const [id, clase] of NUEVOS) {
        const c = aplicarTipo(configInicial(), tipo);
        c.visual.layout = id;
        const html = renderToStaticMarkup(<Pagina config={c} />);
        expect(html, `${id} ${tipo}`).toContain(clase);
        // Un solo título principal por página y ningún campo sin nombre.
        expect(html.match(/class="pg-titulo"/g)?.length, `${id} ${tipo}`).toBe(1);
        for (const campo of html.match(/<input[^>]*>/g) ?? []) {
          const conNombre = /aria-label=|id="/.test(campo) || new RegExp(`<label[^>]*>(?:(?!</label>).)*${campo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 's').test(html);
          expect(conNombre, `${id}: ${campo}`).toBe(true);
        }
      }
    }
  });

  it('las pantallas de app y las páginas de un solo fin no llevan el argumento de landing', () => {
    const sin = NUEVOS.map(([id]) => id).filter((id) => !llevaArgumento(id));
    expect(sin).toEqual(['mapa_lista', 'agenda_semanal', 'tablero', 'documentacion', 'link_bio', 'compra_unica']);
    const c = configInicial();
    c.visual.layout = 'link_bio';
    const html = renderToStaticMarkup(<Pagina config={c} />);
    expect(html).not.toContain('pg-arg');
    expect(html).not.toContain('pg-cierre');
  });
});
