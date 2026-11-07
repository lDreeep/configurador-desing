import { parse } from 'yaml';
import { DECISIONES_UI, GRUPOS_UI, IDS_DECISIONES, decisionesIniciales, normalizarDecisiones } from './decisiones';
import { configInicial, normalizar } from './estado';
import { generarDesignMd } from './export/generarDesignMd';
import { sistemaDeDiseno } from './export/sistema';
import { clasesDecisiones } from './export/decisiones';
import { CATEGORIAS, completarComponentes, DISENO_INICIAL } from './galeria';

describe('decisiones transversales de UI', () => {
  it('cada alternativa puede elegirse, guardarse y exportarse sin YAML inválido', () => {
    const base = configInicial();
    expect(IDS_DECISIONES).toHaveLength(23);
    for (const id of IDS_DECISIONES) {
      expect(GRUPOS_UI).toContain(DECISIONES_UI[id].grupo);
      expect(new Set(DECISIONES_UI[id].opciones.map(o => o.id)).size).toBe(DECISIONES_UI[id].opciones.length);
      for (const opcion of DECISIONES_UI[id].opciones) {
        const config = normalizar(JSON.parse(JSON.stringify({ ...base, decisiones: { ...base.decisiones, [id]: opcion.id } })));
        expect(config.decisiones[id]).toBe(opcion.id);
        const md = generarDesignMd(config);
        const bloques = [...md.matchAll(/```yaml\n([\s\S]*?)\n```/g)].map(m => parse(m[1]));
        const decisiones = bloques.find(b => b.decisiones);
        expect(decisiones.decisiones[id.replace(/[A-Z]/g, letra => '_' + letra.toLowerCase())].valor).toBe(opcion.id);
        if (opcion.id !== 'heredar') expect(decisiones.clases).toContain(`du-${id}-${opcion.id}`);
        expect(md).not.toMatch(/undefined|NaN/);
      }
    }
  });

  it('migra configuraciones anteriores y rechaza decisiones desconocidas sin perder las válidas', () => {
    expect(normalizar({}).decisiones).toEqual(decisionesIniciales());
    expect(normalizarDecisiones(null)).toEqual(decisionesIniciales());
    expect(normalizarDecisiones({ ancho: 'retirado', densidad: 'compacta', tablaMovil: 'desplazar' })).toMatchObject({ ancho: 'heredar', densidad: 'compacta', tablaMovil: 'desplazar' });
    const c = configInicial();
    c.visual.movimiento = 'retirado' as never;
    expect(() => generarDesignMd(normalizar(c))).not.toThrow();
  });

  it('los tokens y las secciones de layout y tipografía reflejan las elecciones', () => {
    const c = configInicial();
    c.decisiones = { ...c.decisiones, ancho: 'lectura', densidad: 'compacta', cuerpo: 'grande', interlineado: 'amplio', linea: 'corta', margen: 'generoso', tablaMovil: 'desplazar' };
    const s = sistemaDeDiseno(c);
    expect(s.tokens).toMatchObject({ '--ancho-max': '760px', '--contenido-ancho': '760px', '--texto-cuerpo': '20px', '--texto-interlineado': '1.8', '--texto-linea': '45ch', '--margen-movil': '32px', '--padding-componente': '12px' });
    expect(s.escala.cuerpo.interlineado).toBe(1.8);
    const md = generarDesignMd(c);
    expect(md).toContain('ancho_maximo_contenido: 760px');
    expect(md).toContain('tablas_en_movil: scroll_horizontal');
    expect(md).toContain('densidad: compacta');
    expect(clasesDecisiones(c.decisiones)).not.toContain('heredar');
  });

  it('al saltar pasos, materializa exactamente los componentes que el prototipo muestra', () => {
    const c = configInicial();
    c.componentes.campo = Object.keys(CATEGORIAS.campo.disenos)[1];
    const efectivo = completarComponentes(c);
    expect(efectivo.componentes.campo).toBe(c.componentes.campo);
    expect(Object.keys(efectivo.componentes)).toHaveLength(Object.keys(CATEGORIAS).length);
    expect(efectivo.componentes.tabla).toBe(DISENO_INICIAL.tabla);
    expect(generarDesignMd(efectivo)).toContain('## 21. Componentes de interfaz');
    expect(c.componentes.tabla).toBeUndefined();
  });
});
