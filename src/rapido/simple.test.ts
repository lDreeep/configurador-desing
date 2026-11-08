import { PRESETS, aplicarPreset } from './presets';
import { configInicial, normalizar } from '../estado';
import { guardarAjuste, resolverElemento, claveElemento } from './edicion';
import { generarDesignMd } from '../export/generarDesignMd';
import { BOTONES } from '../botones-disenos';
import { CATEGORIAS } from '../galeria';
import { parse } from 'yaml';

describe('recorrido simplificado', () => {
  it('cada combinación precarga diseños válidos para todas las categorías', () => {
    for (const preset of PRESETS) {
      const config = aplicarPreset(configInicial(), preset);
      expect(BOTONES[config.botones.diseno as keyof typeof BOTONES]).toBeDefined();
      for (const [categoria, diseno] of Object.entries(config.componentes)) {
        expect(CATEGORIAS[categoria as keyof typeof CATEGORIAS].disenos[diseno!]).toBeDefined();
      }
      expect(config.proyecto.tipo).toBe(preset.tipo);
      expect(config.elementos).toEqual({});
    }
  });
  it('la edición individual no altera el grupo y sobrevive al guardado', () => {
    const base = aplicarPreset(configInicial(), PRESETS[0]);
    const id = claveElemento('portada', 'boton', 'Explorar modelos');
    const siguiente = { ...base, botones: { ...base.botones, diseno: 'contorno' as const } };
    const editada = guardarAjuste(base, id, 'boton', siguiente);
    expect(editada.botones).toEqual(base.botones);
    expect(resolverElemento(editada, id).botones.diseno).toBe('contorno');
    expect(resolverElemento(editada, 'otro').botones).toEqual(base.botones);
    const recuperada = normalizar(JSON.parse(JSON.stringify(editada)));
    expect(resolverElemento(recuperada, id).botones.diseno).toBe('contorno');
    const md = generarDesignMd(recuperada);
    expect(md).toContain('## 22. Ajustes por elemento');
    expect(md).toContain(id);
    expect(md).toContain('data-elemento-id');
    expect(md).toContain('[data-elemento-id="portada:boton:explorar_modelos"]');
    for (const match of md.matchAll(/\x60\x60\x60yaml\n([\s\S]*?)\n\x60\x60\x60/g)) expect(() => parse(match[1])).not.toThrow();
    expect(generarDesignMd(base)).not.toContain('## 22.');
  });
});
