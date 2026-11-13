import { describe, expect, it } from 'vitest';
// @ts-expect-error: import de texto de Vite, como en compatibilidad.test.ts.
import landing from '../../pruebas/h5/landing/DESIGN.md?raw';
// @ts-expect-error: import de texto de Vite, como en compatibilidad.test.ts.
import tienda from '../../pruebas/h5/tienda/DESIGN.md?raw';
// @ts-expect-error: import de texto de Vite, como en compatibilidad.test.ts.
import dashboard from '../../pruebas/h5/dashboard/DESIGN.md?raw';
import configLanding from '../../pruebas/h5/landing/config.json';
import configTienda from '../../pruebas/h5/tienda/config.json';
import configDashboard from '../../pruebas/h5/dashboard/config.json';
import type { Config } from '../tipos';
import { DIRECCIONES } from '../catalogo';
import { aplicarDireccion, configInicial } from '../estado';
import { generarDesignMd, VERSION_FORMATO } from './generarDesignMd';
import { importarDesignMd } from './importarDesignMd';
import type { DireccionId } from '../tipos';

describe('importar DESIGN.md', () => {
  it.each([['landing', landing, configLanding], ['tienda', tienda, configTienda], ['dashboard', dashboard, configDashboard]] as const)('recupera el archivo real de H5: %s', (_, archivo, original) => {
    const md = archivo.replace(/\r\n/g,'\n');
    const { config, avisos } = importarDesignMd(md);
    expect(avisos).toEqual([]);

    // H5 guardó estas configs con JSON.stringify; el JSON pierde los tipos literales del catálogo.
    const configDeReferencia = original as unknown as Config;
    expect(generarDesignMd(config, '2026-11-13')).toBe(generarDesignMd(configDeReferencia, '2026-11-13'));
  });
  it.each(Object.keys(DIRECCIONES) as DireccionId[])('ida y vuelta exacta: %s', id => {
    const c = aplicarDireccion(configInicial(), id);
    c.visual.ambosModos = true;
    c.visual.paleta = 'personalizada';
    c.visual.paletaPersonalizada.manual.borde = '#888888';
    c.cajas = { preset:'papel', ajustes:{ bordeGrosor:3, radio:'12' } };
    c.notas.color = 'Un "gris" suave';
    const md = generarDesignMd(c);
    expect(generarDesignMd(importarDesignMd(md).config)).toBe(md);
  });
  it('recupera las interacciones de tarjetas y cursor del formato actual', () => {
    const c = configInicial();
    c.proyecto.tipo = 'landing';
    c.visual.hoverTarjetas = 'elevar';
    c.visual.cursor = 'anillo';
    const md = generarDesignMd(c);
    const { config, avisos } = importarDesignMd(md);
    expect(avisos).toEqual([]);
    expect(config.visual).toMatchObject({ hoverTarjetas: 'elevar', cursor: 'anillo' });
    expect(generarDesignMd(config)).toBe(md);
  });
  it.each(['0.8.8','0.8.9','0.9.0','0.9.1','0.9.2','0.9.3'])('acepta encabezados históricos y secciones opcionales ausentes: %s', version => {
    const md = generarDesignMd(configInicial()).replace('version_formato: '+VERSION_FORMATO,'version_formato: '+version);
    expect(importarDesignMd(md).config.visual.layout).toBe('hero_partido');
  });
  it('rechaza versiones desconocidas y recupera campos ilegibles con aviso', () => {
    const md = generarDesignMd(configInicial());
    expect(() => importarDesignMd(md.replace('version_formato: '+VERSION_FORMATO,'version_formato: 2.0.0'))).toThrow();
    const r = importarDesignMd(md.replace('layout: hero_partido','layout: inexistente'));
    expect(r.config.visual.layout).toBe('hero_partido');
    expect(r.avisos).toContain(19);
  });
});
