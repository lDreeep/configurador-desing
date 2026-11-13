import { renderToStaticMarkup } from 'react-dom/server';
import { parse } from 'yaml';
import { aplicarTipo, configInicial, normalizar } from './estado';
import { generarDesignMd } from './export/generarDesignMd';
import { elegir, valorDeFicha } from './molde/recorrido';
import { CONTENIDO_SECCIONES } from './rapido/contenido-secciones';
import { Pagina } from './rapido/Pagina';
import { rondaPorClave, RONDA_SECCIONES, SIN_SECCIONES, type ClaveRonda } from './rondas';
import {
  combinarSecciones,
  DISENOS_SECCION,
  limpiarSecciones,
  LISTA_DISENOS_SECCION,
  LISTA_SECCIONES,
  SECCIONES,
  SECCIONES_RECOMENDADAS,
  seccionDe,
  TIPOS_CON_SECCIONES,
  type SeccionDisenoId,
} from './secciones';
import { SECCION_DE_DISENO } from './secciones-base';
import type { Config, TipoProyecto } from './tipos';

const con = (tipo: TipoProyecto, secciones: SeccionDisenoId[]): Config => {
  const c = aplicarTipo(configInicial(), tipo);
  return { ...c, visual: { ...c.visual, secciones } };
};
const html = (c: Config) => renderToStaticMarkup(<Pagina config={c} />);

describe('secciones de la página (D12)', () => {
  it('hay 8 secciones con 3 diseños cada una, con nombre, descripción y estructura para el export', () => {
    expect(LISTA_SECCIONES).toHaveLength(8);
    expect(LISTA_DISENOS_SECCION).toHaveLength(24);
    for (const s of LISTA_SECCIONES) {
      const disenos = LISTA_DISENOS_SECCION.filter((id) => seccionDe(id) === s);
      expect(disenos, s).toHaveLength(3);
      for (const id of disenos) expect(id.startsWith(`${s}_`), id).toBe(true);
      expect(SECCIONES[s].nombre && SECCIONES[s].descripcion, s).toBeTruthy();
    }
    for (const id of LISTA_DISENOS_SECCION) {
      const d = DISENOS_SECCION[id];
      expect(d.nombre && d.descripcion, id).toBeTruthy();
      expect(d.estructura.length, id).toBeGreaterThan(200);
      // La estructura dice qué pasa en celular: es lo que la IA suele inventar.
      expect(d.estructura, id).toMatch(/celular/i);
    }
    expect(new Set(LISTA_DISENOS_SECCION.map((id) => DISENOS_SECCION[id].nombre + seccionDe(id))).size).toBe(24);
  });

  it('las piden landing, sitio y portfolio, con 6 recomendadas que existen y no repiten sección', () => {
    expect([...TIPOS_CON_SECCIONES]).toEqual(['landing', 'sitio', 'portfolio']);
    for (const tipo of TIPOS_CON_SECCIONES) {
      const rec = SECCIONES_RECOMENDADAS[tipo];
      expect(rec, tipo).toHaveLength(6);
      for (const id of rec) expect(DISENOS_SECCION[id], id).toBeTruthy();
      expect(new Set(rec.map(seccionDe)).size, tipo).toBe(6);
      expect(rondaPorClave(con(tipo, []), 'secciones'), tipo).toBeTruthy();
      expect(RONDA_SECCIONES.opciones(con(tipo, [])).slice(0, 6).map((o) => o.id), tipo).toEqual(rec);
    }
    for (const tipo of ['tienda', 'app_web', 'app_movil', 'dashboard', 'blog'] as const) expect(rondaPorClave(con(tipo, []), 'secciones'), tipo).toBeUndefined();
  });

  it('elegir suma al final, el otro diseño cambia sin mover y el mismo saca', () => {
    let l = combinarSecciones([], 'precios_planes');
    l = combinarSecciones(l, 'equipo_lista');
    l = combinarSecciones(l, 'contacto_datos');
    expect(l).toEqual(['precios_planes', 'equipo_lista', 'contacto_datos']);
    l = combinarSecciones(l, 'precios_tabla');
    expect(l).toEqual(['precios_tabla', 'equipo_lista', 'contacto_datos']);
    l = combinarSecciones(l, 'equipo_lista');
    expect(l).toEqual(['precios_tabla', 'contacto_datos']);
    // Con las 8 puestas no entra una novena: solo se cambia de diseño.
    const todas = LISTA_SECCIONES.map((s) => `${s}_${LISTA_DISENOS_SECCION.find((id) => seccionDe(id) === s)!.slice(s.length + 1)}` as SeccionDisenoId);
    expect(combinarSecciones(todas, 'numeros_protagonista')).toHaveLength(8);
  });

  it('una lista guardada se limpia: ids que no existen afuera y una sola vez cada sección', () => {
    expect(limpiarSecciones(['precios_planes', 'no_existe', 7, 'precios_tabla', 'equipo_lista'])).toEqual(['precios_tabla', 'equipo_lista']);
    expect(limpiarSecciones(undefined)).toEqual([]);
    expect(normalizar({ visual: { secciones: ['x', 'contacto_datos'] } } as unknown as Partial<Config>).visual.secciones).toEqual(['contacto_datos']);
    expect(normalizar({}).visual.secciones).toEqual([]);
  });

  it('la ronda elige varias, la ficha las nombra en orden y «Sin secciones» las saca', () => {
    let r = { config: con('landing', []), elegidas: new Set<ClaveRonda>(['proyecto']) as ReadonlySet<ClaveRonda> };
    expect(RONDA_SECCIONES.maximo).toBe(8);
    expect(valorDeFicha(r.config, RONDA_SECCIONES)).toBe('Sin secciones');
    r = elegir(r.config, r.elegidas, RONDA_SECCIONES, 'testimonios_cita');
    r = elegir(r.config, r.elegidas, RONDA_SECCIONES, 'precios_planes');
    expect(r.elegidas.has('secciones')).toBe(true);
    expect(r.config.visual.secciones).toEqual(['testimonios_cita', 'precios_planes']);
    expect(valorDeFicha(r.config, RONDA_SECCIONES)).toBe('Testimonios: una cita grande + Precios: tres planes');
    r = elegir(r.config, r.elegidas, RONDA_SECCIONES, SIN_SECCIONES);
    expect(r.config.visual.secciones).toEqual([]);
    // Cambiar a un tipo sin secciones conserva la lista (por si vuelve), pero la ronda ya no está.
    const tienda = aplicarTipo(con('landing', ['precios_planes']), 'tienda');
    expect(tienda.visual.secciones).toEqual(['precios_planes']);
    expect(html(tienda)).not.toContain('pg-secciones');
  });

  it('cada diseño se dibuja con el contenido de los tres tipos, en el orden elegido', () => {
    for (const tipo of TIPOS_CON_SECCIONES) {
      for (const id of LISTA_DISENOS_SECCION) {
        const h = html(con(tipo, [id]));
        expect(h, `${tipo}/${id}`).toContain(`pg-sec-${id}`);
        expect(h, `${tipo}/${id}`).toContain(`data-seccion="${seccionDe(id)}"`);
      }
      const h = html(con(tipo, ['contacto_datos', 'precios_tabla', 'numeros_fila']));
      const pos = ['contacto', 'precios', 'numeros'].map((s) => h.indexOf(`data-seccion="${s}"`));
      expect(pos[0]).toBeGreaterThan(0);
      expect(pos, tipo).toEqual([...pos].sort((a, b) => a - b));
      const m = CONTENIDO_SECCIONES[tipo];
      expect(m.precios.planes).toHaveLength(3);
      for (const f of m.precios.filas) expect(f.valores, f.nombre).toHaveLength(3);
      expect(m.testimonios.citas).toHaveLength(3);
      expect(m.numeros.cifras).toHaveLength(3);
    }
  });

  it('con secciones no va el argumento del layout; sin secciones la página queda como antes', () => {
    const sin = html(con('landing', []));
    expect(sin).toContain('pg-arg');
    expect(sin).not.toContain('pg-secciones');
    const conSec = html(con('landing', ['preguntas_acordeon']));
    expect(conSec).not.toContain('class="pg-arg"');
    expect(conSec).toContain('pg-cierre');
  });

  it('accesibilidad: cada sección tiene nombre, la tabla es una tabla y cada campo tiene su label', () => {
    const h = html(con('landing', LISTA_DISENOS_SECCION.filter((_, i) => i % 2 === 1).slice(0, 8)));
    expect(h.match(/<section[^>]*aria-labelledby=/g)).toHaveLength(8);
    const tabla = html(con('sitio', ['precios_tabla']));
    expect(tabla).toMatch(/<caption/);
    expect(tabla.match(/scope="col"/g)).toHaveLength(3);
    expect(tabla).toContain('scope="row"');
    const form = html(con('portfolio', ['contacto_formulario']));
    const fors = [...form.matchAll(/<label for="([^"]+)"/g)].map((x) => x[1]);
    expect(fors).toHaveLength(3);
    for (const f of fors) expect(form).toContain(`id="${f}"`);
    expect(form).toContain('role="status"');
  });

  it('el export las describe en §22, en orden, y solo si el tipo las lleva', () => {
    const md = generarDesignMd(con('landing', ['numeros_protagonista', 'precios_tabla', 'contacto_formulario']));
    const parte = md.split('## 22. Secciones de la página')[1];
    expect(parte).toBeTruthy();
    const datos = parse(parte.split('```yaml')[1].split('```')[0]) as { orden: string[]; secciones: { id: string; diseno: string; estructura: string }[] };
    expect(datos.orden).toEqual(['numeros', 'precios', 'contacto']);
    expect(datos.secciones.map((s) => s.diseno)).toEqual(['numeros_protagonista', 'precios_tabla', 'contacto_formulario']);
    expect(datos.secciones[1].estructura).toBe(DISENOS_SECCION.precios_tabla.estructura);
    // Las secciones reemplazan al argumento genérico.
    expect(md).not.toContain('layout_argumento');
    expect(generarDesignMd(con('landing', []))).toContain('layout_argumento');
    expect(generarDesignMd(con('landing', []))).not.toContain('## 22.');
    expect(generarDesignMd(con('tienda', ['precios_tabla']))).not.toContain('## 22.');
  });

  it('la base liviana (secciones-base.ts, la que usa la portada) coincide con el catálogo', () => {
    expect(Object.keys(SECCION_DE_DISENO).sort()).toEqual([...LISTA_DISENOS_SECCION].sort());
    for (const id of LISTA_DISENOS_SECCION) expect(SECCION_DE_DISENO[id], id).toBe(DISENOS_SECCION[id].seccion);
  });
});
