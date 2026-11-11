// @ts-expect-error: import de texto de Vite (el proyecto no carga los tipos de vite/client).
import doc from '../DESIGN.md?raw';
import { describe, expect, it } from 'vitest';
import { estilosPara, fallasDe, LISTA_ESTILOS, LISTA_PALETAS, paresDe, pasaAA } from './compatibilidad';
import { ESTILOS } from './estilos-visuales';
import type { EstiloId, PaletaId } from './tipos';

/**
 * Pares declarados compatibles en `ESTILOS[id].paletas` que hoy no pasan AA.
 * Si arreglás uno, sacalo de acá (el test avisa cuando un par de esta lista empieza a pasar).
 */
const FALLAS_CONOCIDAS: string[] = [
  // El estilo pinta la página de #008080 y el texto de las secciones fuera del hero y las tarjetas
  // (por ejemplo, el «recorrido») queda sobre ese verde: 4.40:1 el texto y 2.65:1 el texto suave.
  'retro_os/retro_gris',
];

describe('auditoría paleta × estilo', () => {
  const inicio = performance.now();
  const resultados = LISTA_ESTILOS.flatMap((estilo) =>
    LISTA_PALETAS.map((paleta) => ({ estilo, paleta, fallas: fallasDe(paleta, estilo) })),
  );
  const duracion = performance.now() - inicio;
  const fallan = resultados.filter((x) => x.fallas.length > 0);

  it('recorre todos los pares en menos de 10 s', () => {
    expect(resultados.length).toBe(LISTA_ESTILOS.length * LISTA_PALETAS.length);
    expect(duracion).toBeLessThan(10_000);
  });

  it('mide texto, texto suave y botón principal en cada par', () => {
    const nombres = paresDe('papel', 'editorial').map((p) => p.nombre);
    expect(nombres).toContain('Texto sobre fondo');
    expect(nombres).toContain('Texto suave sobre fondo');
    expect(nombres.some((n) => n.startsWith('Texto del botón principal'))).toBe(true);
  });

  it('los pares que cada estilo declara compatibles pasan AA (salvo las fallas conocidas)', () => {
    for (const e of LISTA_ESTILOS) {
      for (const p of ESTILOS[e].paletas) {
        const clave = `${e}/${p}`;
        const fallas = fallasDe(p, e);
        if (FALLAS_CONOCIDAS.includes(clave)) {
          expect(fallas.length, `${clave} ya pasa: sacalo de FALLAS_CONOCIDAS`).toBeGreaterThan(0);
        } else {
          expect(fallas.map((f) => `${f.nombre} ${f.valor.toFixed(2)}`), clave).toEqual([]);
        }
      }
    }
  });

  it('detecta lo que pinta el CSS del estilo: texto suave claro sobre las tarjetas amarillas del neobrutalismo', () => {
    expect(pasaAA('alto_contraste', 'neobrutalismo')).toBe(true);
    const fallas = fallasDe('medianoche_violeta', 'neobrutalismo');
    expect(fallas.some((f) => f.nombre.startsWith('Texto suave sobre tarjeta'))).toBe(true);
  });

  it('la cantidad de pares que no pasan está anotada en DESIGN.md §9', () => {
    const m = (doc as string).match(/Auditoría paleta × estilo[^:]*: (\d+) de (\d+) pares no pasan/);
    expect(m, 'falta la línea de la auditoría en DESIGN.md §9').not.toBeNull();
    expect([Number(m![1]), Number(m![2])]).toEqual([fallan.length, resultados.length]);
  });

  describe('estilosPara', () => {
    it('nunca ofrece un estilo que no pasa AA y no deja ninguna paleta sin estilos', () => {
      for (const p of LISTA_PALETAS) {
        const lista = estilosPara(p);
        expect(lista.length, p).toBeGreaterThan(0);
        for (const e of lista) expect(pasaAA(p, e), `${p} × ${e}`).toBe(true);
        expect(new Set(lista).size).toBe(lista.length);
      }
    });

    it('incluye todos los que pasan, con los compatibles primero', () => {
      for (const p of LISTA_PALETAS) {
        const lista = estilosPara(p);
        expect(lista.length).toBe(LISTA_ESTILOS.filter((e) => pasaAA(p, e)).length);
        const declara = lista.map((e) => ESTILOS[e].paletas.includes(p));
        const primerNo = declara.indexOf(false);
        if (primerNo >= 0) expect(declara.slice(primerNo).every((x) => !x), p).toBe(true);
      }
    });

    it('ejemplo: con «papel» arranca por los estilos que la declaran', () => {
      const lista = estilosPara('papel' satisfies PaletaId);
      const declaran = LISTA_ESTILOS.filter((e) => ESTILOS[e].paletas.includes('papel') && pasaAA('papel', e));
      expect(lista.slice(0, declaran.length).sort()).toEqual([...declaran].sort() as EstiloId[]);
    });
  });
});
