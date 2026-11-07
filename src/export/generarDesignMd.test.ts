import { parse } from 'yaml';
import { aplicarDireccion, aplicarMovimiento, configInicial, normalizar, pesoDisponible } from '../estado';
import { derivarRoles, paresDeContraste } from '../color';
import { COMBINACIONES, DIRECCIONES, FUENTES, PALETAS } from '../catalogo';
import type { Config } from '../tipos';
import { contraste } from './sistema';
import { generarDesignMd, VERSION_FORMATO } from './generarDesignMd';

const bloquesYaml = (md: string) => [...md.matchAll(/```yaml\n([\s\S]*?)\n```/g)].map((m) => m[1]);
const titulos = (md: string) => [...md.matchAll(/^## (\d+)\. (.+)$/gm)].map((m) => Number(m[1]));

function configCompleta(): Config {
  const c = configInicial();
  return {
    ...c,
    proyecto: {
      ...c.proyecto,
      nombre: 'Barbería Sur',
      descripcion: 'Una app para manejar los turnos de mi barbería.',
      objetivo: 'Que reservar un turno lleve segundos',
      publicoQuienes: 'El dueño y dos empleados',
    },
    funciones: { ...c.funciones, acciones: ['Reservar un turno', 'Ver la agenda: "hoy"'], integraciones: ['whatsapp'] },
    notas: { direccion: 'calmo, pero que no parezca un banco', color: 'el azul "menos" frío' },
    notasGenerales: 'Que se sienta rápida\n\nMás que linda',
  };
}

describe('generarDesignMd', () => {
  it('incluye las secciones obligatorias en orden', () => {
    const n = titulos(generarDesignMd(configCompleta()));
    for (const obligatoria of [1, 2, 3, 4, 5, 6, 7, 9, 12, 14, 15, 16, 18]) expect(n).toContain(obligatoria);
    expect([...n].sort((a, b) => a - b)).toEqual(n);
  });

  it('todos los bloques YAML son válidos', () => {
    const md = generarDesignMd(configCompleta());
    const bloques = bloquesYaml(md);
    expect(bloques.length).toBeGreaterThan(10);
    for (const b of bloques) expect(() => parse(b)).not.toThrow();
  });

  it('lleva el encabezado con la versión del formato', () => {
    const [encabezado] = bloquesYaml(generarDesignMd(configCompleta()));
    expect(parse(encabezado)).toMatchObject({ formato: 'design-md', version_formato: VERSION_FORMATO });
  });

  it('exporta las notas literales, también con comillas', () => {
    const md = generarDesignMd(configCompleta());
    const color = parse(bloquesYaml(md).find((b) => b.startsWith('paleta:'))!);
    expect(color.nota).toBe('el azul "menos" frío');
    const notas = parse(bloquesYaml(md).find((b) => b.startsWith('notas:'))!);
    expect(notas.notas).toEqual(['Que se sienta rápida', 'Más que linda']);
  });

  it('marca sin_definir y pendientes que bloquean cuando el proyecto está a medias', () => {
    const c = configInicial();
    c.proyecto.descripcion = 'Una app de turnos';
    const md = generarDesignMd(c);
    const proyecto = parse(bloquesYaml(md).find((b) => b.startsWith('modo:'))!);
    expect(proyecto.modo).toBe('proyecto');
    expect(proyecto.objetivo_principal).toBe('sin_definir');
    const pendientes = parse(bloquesYaml(md).find((b) => b.startsWith('sin_definir:'))!);
    expect(pendientes.sin_definir).toContainEqual({ seccion: 4, campo: 'acciones_clave', bloquea: 'si' });
    expect(md).toContain('Este archivo describe una web o app que tenés que construir');
    expect(md).toContain('Antes de aplicar todo, mostrá una maqueta.');
  });

  it('sin proyecto descripto, se exporta como sistema de diseño para aplicar o para lo que la persona explique', () => {
    const md = generarDesignMd(configInicial());
    const [encabezado] = bloquesYaml(md);
    expect(parse(encabezado).modo).toBe('sistema_de_diseno');
    expect(md).toContain('# Sistema de diseño: DESIGN.md');
    expect(md).toContain('A. **Mejorar algo que ya existe.**');
    expect(md).toContain('B. **Construir algo nuevo.**');
    expect(md).toContain('son solo de referencia');
    expect(md).toContain('Antes de aplicar todo, mostrá una maqueta.');
    const pendientes = parse(bloquesYaml(md).find((b) => b.startsWith('sin_definir:'))!);
    expect(pendientes.sin_definir.some((x: { bloquea: string }) => x.bloquea === 'si')).toBe(false);
    expect(pendientes.preguntas_sugeridas[0]).toContain('Aplico este diseño');
  });

  it('los tokens CSS coinciden con la paleta elegida', () => {
    const c = aplicarDireccion(configCompleta(), 'audaz');
    const md = generarDesignMd(c);
    expect(md).toContain(`--color-acento: ${PALETAS.tinta_y_lima.roles.acento};`);
    expect(md).toContain('--radio-boton: 0px;');
  });
});

describe('catálogo', () => {
  it('todas las paletas pasan contraste en todos los pares', () => {
    for (const [id, p] of Object.entries(PALETAS)) {
      for (const par of paresDeContraste(p.roles)) expect(par.valor, `${id}: ${par.nombre}`).toBeGreaterThanOrEqual(par.minimo);
      for (const [e, color] of Object.entries(p.estados))
        expect(contraste(color, p.roles.fondo), `${id} estado ${e}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('las direcciones y combinaciones usan fuentes que existen', () => {
    for (const d of Object.values(DIRECCIONES)) {
      expect(FUENTES[d.fuenteTitulos]).toBeDefined();
      expect(FUENTES[d.fuenteTexto]).toBeDefined();
    }
    for (const x of COMBINACIONES) expect(FUENTES[x.titulos] && FUENTES[x.texto]).toBeTruthy();
  });

  it('cada dirección genera un export válido', () => {
    for (const id of Object.keys(DIRECCIONES) as (keyof typeof DIRECCIONES)[]) {
      const md = generarDesignMd(aplicarDireccion(configCompleta(), id));
      for (const b of bloquesYaml(md)) expect(() => parse(b)).not.toThrow();
    }
  });
});

describe('paleta personalizada', () => {
  it('con fondo, texto y acento razonables, los colores calculados pasan contraste', () => {
    const casos: [string, string, string][] = [
      ['#FFFFFF', '#111111', '#E11D48'],
      ['#FDF6E3', '#2B2B2B', '#2AA198'],
      ['#0A0A0A', '#F5F5F5', '#FACC15'],
      ['#101828', '#E5E7EB', '#7C3AED'],
      ['#FFFFFF', '#1F2937', '#808080'],
    ];
    for (const [fondo, texto, acento] of casos) {
      const r = derivarRoles(fondo, texto, acento);
      const textos = paresDeContraste(r).filter((p) => p.minimo === 4.5);
      for (const p of textos) expect(p.valor, `${fondo}/${texto}/${acento}: ${p.nombre}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('respeta los ajustes manuales y avisa si no pasan contraste', () => {
    const c = configInicial();
    c.visual.paleta = 'personalizada';
    c.visual.paletaPersonalizada = { fondo: '#FFFFFF', texto: '#111111', acento: '#FFE600', manual: { sobre_acento: '#FFFFFF' } };
    const md = generarDesignMd(c);
    const color = parse(bloquesYaml(md).find((b) => b.startsWith('paleta:'))!);
    expect(color.paleta).toBe('personalizada');
    expect(color.roles.sobre_acento).toBe('#FFFFFF');
    expect(color.personalizada.ajustados_a_mano).toEqual(['sobre_acento']);
    const pend = parse(bloquesYaml(md).find((b) => b.startsWith('sin_definir:'))!);
    expect(pend.sin_definir.some((p: { seccion: number }) => p.seccion === 6)).toBe(true);
  });
});

describe('tipografía, botones y movimiento', () => {
  it('ajusta el peso al disponible en la fuente', () => {
    expect(pesoDisponible('instrument_serif', 700)).toBe(400);
    expect(pesoDisponible('space_mono', 600)).toBe(700);
    expect(pesoDisponible('inter', 600)).toBe(600);
  });

  it('exporta botones y cada efecto de movimiento', () => {
    let c = aplicarMovimiento(configCompleta(), 'expresivo');
    c = { ...c, botones: { estilo: 'tonal', tamano: 'grande', mayusculas: true, icono: 'derecha', diseno: 'ninguno', color: 'acento', efecto: 'del_diseno' }, visual: { ...c.visual, hover: 'brillo' } };
    const md = generarDesignMd(c);
    const comp = parse(bloquesYaml(md).find((b) => b.startsWith('botones:'))!);
    expect(comp.botones).toMatchObject({ estilo: 'tonal', tamano: 'grande', alto: '56px', mayusculas: 'si', icono: 'derecha' });
    const mov = parse(bloquesYaml(md).find((b) => b.startsWith('nivel:'))!);
    expect(mov.que_se_anima).toEqual({ hover_botones: 'brillo', al_presionar: 'hundir', aparicion_listas: 'escalonada', cambio_de_pantalla: 'deslizar' });
    expect(md).toContain('--boton-mayusculas: uppercase;');
  });

  it('una config guardada con la versión anterior se abre sin romperse', () => {
    const vieja = { visual: { direccion: 'calmo', paleta: 'azul_electrico', fuenteTitulos: 'inter', fuenteTexto: 'inter', radio: 'suave', movimiento: 'sutil' } };
    const c = normalizar(vieja as never);
    expect(c.botones.estilo).toBeDefined();
    expect(c.visual.hover).toBeDefined();
    expect(() => generarDesignMd(c)).not.toThrow();
  });
});

describe('modo rápido: estilos, layouts y códigos', () => {
  it('cada estilo usa paletas y fuentes que existen', async () => {
    const { ESTILOS } = await import('../estilos-visuales');
    for (const [id, e] of Object.entries(ESTILOS)) {
      for (const p of e.paletas) expect(PALETAS[p], `${id} paleta ${p}`).toBeDefined();
      for (const [t, x] of e.fuentes) expect(FUENTES[t] && FUENTES[x], `${id} fuentes ${t}/${x}`).toBeTruthy();
      expect(e.css).toContain('&');
    }
  });

  it('cada estilo × layout genera un export válido con su CSS en la sección 19', async () => {
    const { ESTILOS, LAYOUTS } = await import('../estilos-visuales');
    const { aplicarCombinacion } = await import('../rapido/combinar');
    for (const estilo of Object.keys(ESTILOS) as (keyof typeof ESTILOS)[]) {
      for (const layout of Object.keys(LAYOUTS) as (keyof typeof LAYOUTS)[]) {
        const e = ESTILOS[estilo];
        const c = aplicarCombinacion(configCompleta(), { estilo, layout, paleta: e.paletas[0], titulos: e.fuentes[0][0], texto: e.fuentes[0][1] });
        const md = generarDesignMd(c);
        for (const b of bloquesYaml(md)) expect(() => parse(b)).not.toThrow();
        const s19 = parse(bloquesYaml(md).find((b) => b.startsWith('layout:'))!);
        expect(s19).toMatchObject({ layout, estilo });
        expect(md).toContain('## 19. Estilo visual y layout');
        expect(md).not.toContain('&');
      }
    }
  });

  it('el código de una combinación vuelve a la misma combinación', async () => {
    const { codigo, decodificar, combinacionAlAzar } = await import('../rapido/combinar');
    for (let i = 0; i < 200; i++) {
      const k = combinacionAlAzar(null, new Set());
      expect(decodificar(codigo(k))).toEqual(k);
    }
    expect(decodificar('ZZZZZ')).toBeNull();
  });

  it('los candados mantienen lo fijado y el resto respeta las reglas del estilo', async () => {
    const { combinacionAlAzar } = await import('../rapido/combinar');
    const { ESTILOS } = await import('../estilos-visuales');
    let k = combinacionAlAzar(null, new Set());
    for (let i = 0; i < 100; i++) {
      const n = combinacionAlAzar(k, new Set(['estilo', 'tipografia'] as const));
      expect(n.estilo).toBe(k.estilo);
      expect([n.titulos, n.texto]).toEqual([k.titulos, k.texto]);
      expect(ESTILOS[n.estilo].paletas).toContain(n.paleta);
      k = n;
    }
  });
});

describe('panel de botones', () => {
  it('cada diseño de botón genera un export válido con su CSS', async () => {
    const { BOTONES } = await import('../botones-disenos');
    for (const id of Object.keys(BOTONES) as (keyof typeof BOTONES)[]) {
      const c = configCompleta();
      c.botones = { ...c.botones, diseno: id, color: '#7C3AED' };
      const md = generarDesignMd(c);
      for (const b of bloquesYaml(md)) expect(() => parse(b)).not.toThrow();
      const comp = parse(bloquesYaml(md).find((b) => b.startsWith('botones:'))!);
      expect(comp.botones).toMatchObject({ diseno: id, color: '#7C3AED', color_fondo: '#7C3AED' });
      expect(md).toContain(`.boton-principal`);
      expect(md).toContain('--boton-color: #7C3AED;');
    }
  });

  it('el texto sobre un color propio de botón siempre pasa contraste', async () => {
    const { sistemaDeDiseno } = await import('./sistema');
    for (const color of ['#2F5BFF', '#7C3AED', '#DB2777', '#EA580C', '#16A34A', '#0891B2', '#FFE600', '#808080']) {
      const c = configCompleta();
      c.botones = { ...c.botones, color };
      const s = sistemaDeDiseno(c);
      expect(contraste(s.colorBoton.sobre, s.colorBoton.fondo), color).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('cada estilo propone un diseño de botón que existe', async () => {
    const { BOTONES, DISENO_POR_ESTILO } = await import('../botones-disenos');
    const { ESTILOS } = await import('../estilos-visuales');
    for (const e of Object.keys(ESTILOS) as (keyof typeof ESTILOS)[]) expect(BOTONES[DISENO_POR_ESTILO[e]]).toBeDefined();
  });
});

describe('panel de cajas', () => {
  it('cada diseño de caja genera un export válido con sus tokens y su CSS', async () => {
    const { CAJAS } = await import('../cajas');
    for (const id of Object.keys(CAJAS) as (keyof typeof CAJAS)[]) {
      const c = configCompleta();
      c.cajas = { preset: id, ajustes: {} };
      const md = generarDesignMd(c);
      for (const b of bloquesYaml(md)) expect(() => parse(b)).not.toThrow();
      expect(md).toContain('## 20. Cajas y contenedores');
      expect(md).toContain('--caja-fondo:');
      const s20 = parse(bloquesYaml(md).find((b) => b.startsWith('diseno_base:'))!);
      expect(s20.diseno_base).toBe(id);
    }
  });

  it('los ajustes se suman al diseño base y quedan anotados', () => {
    const c = configCompleta();
    c.cajas = { preset: 'vidrio', ajustes: { transparencia: 80, bordeEstilo: 'dashed', forma: 'ticket' } };
    const md = generarDesignMd(c);
    const s20 = parse(bloquesYaml(md).find((b) => b.startsWith('diseno_base:'))!);
    expect(s20).toMatchObject({ transparencia: '80%', forma: 'ticket', desenfoque: '16px' });
    expect(s20.ajustado_a_mano).toEqual(['transparencia', 'bordeEstilo', 'forma']);
    expect(md).toContain('color-mix(in srgb');
  });

  it('sin caja elegida no hay sección 20', () => {
    expect(generarDesignMd(configCompleta())).not.toContain('## 20.');
  });
});

describe('galería de componentes', () => {
  it('cada diseño de cada categoría genera un export válido con su CSS', async () => {
    const { CATEGORIAS } = await import('../galeria');
    for (const [cat, def] of Object.entries(CATEGORIAS)) {
      for (const d of Object.keys(def.disenos)) {
        const c = configCompleta();
        c.componentes = { [cat]: d };
        const md = generarDesignMd(c);
        for (const b of bloquesYaml(md)) expect(() => parse(b)).not.toThrow();
        const s21 = parse(bloquesYaml(md).find((b) => b.startsWith(`${cat}:`))!);
        expect(s21[cat].diseno, `${cat}/${d}`).toBe(d);
        if (def.disenos[d].css) expect(md).toContain(`.cm-${cat}.cm-${cat}-${d}`);
        else expect(md).toContain(`.cm-${cat} {`);
        expect(md).not.toMatch(/(^|[^&])&(?![a-z#])/m);
      }
    }
  });

  it('cada categoría tiene al menos 6 diseños y un CSS base', async () => {
    const { CATEGORIAS } = await import('../galeria');
    for (const def of Object.values(CATEGORIAS)) {
      expect(Object.keys(def.disenos).length).toBeGreaterThanOrEqual(6);
      expect(def.base).toContain('&');
    }
  });
});

describe('límites del código de combinación', () => {
  it('cada lista entra en un solo carácter del código (máximo 36)', async () => {
    const { ESTILOS, LAYOUTS } = await import('../estilos-visuales');
    for (const [nombre, n] of Object.entries({ estilos: Object.keys(ESTILOS).length, layouts: Object.keys(LAYOUTS).length, paletas: Object.keys(PALETAS).length, fuentes: Object.keys(FUENTES).length }))
      expect(n, nombre).toBeLessThanOrEqual(36);
  });

  it('el texto de una caja invertida pasa contraste', async () => {
    const { tokensDeCaja, CAJAS } = await import('../cajas');
    for (const p of Object.values(PALETAS)) {
      const t = tokensDeCaja(CAJAS.invertida.params, p, 14);
      expect(contraste(t['--caja-texto'], p.roles.texto)).toBeGreaterThanOrEqual(4.5);
      expect(contraste(t['--caja-texto-suave'], p.roles.texto)).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe('colores propios', () => {
  it('lee códigos pegados y arma fondo, texto y acento legibles', async () => {
    const { hexesDeTexto, baseDesdeColores } = await import('../color');
    expect(hexesDeTexto('mis colores: #1a1a2e, e94560 y #fff')).toEqual(['#1A1A2E', '#E94560', '#FFFFFF']);
    const b = baseDesdeColores(['#1A1A2E', '#E94560', '#F5F5F5']);
    expect(b).toEqual({ fondo: '#F5F5F5', texto: '#1A1A2E', acento: '#E94560' });
    for (const cs of [['#FFD23F'], ['#0B1026', '#39FF14'], ['#F2B705', '#D7261E', '#1F3F99', '#F2EBDD']]) {
      const x = baseDesdeColores(cs);
      expect(contraste(x.texto, x.fondo), cs.join()).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe('modo claro y oscuro', () => {
  it('la versión opuesta de cada paleta pasa contraste en todos los pares', async () => {
    const { rolesInvertidos, esOscuro } = await import('../color');
    for (const [id, p] of Object.entries(PALETAS)) {
      const r = rolesInvertidos(p.roles);
      expect(esOscuro(r.fondo), `${id} cambia de modo`).toBe(p.modo === 'claro');
      for (const par of paresDeContraste(r)) expect(par.pasa, `${id} invertida: ${par.nombre} (${par.valor.toFixed(2)})`).toBe(true);
    }
  });

  it('con ambos modos, el export suma los roles del modo opuesto y sus tokens', () => {
    const c = configCompleta();
    const md = generarDesignMd({ ...c, visual: { ...c.visual, ambosModos: true } });
    for (const b of bloquesYaml(md)) expect(() => parse(b)).not.toThrow();
    expect(md).toContain('modo_alterno:');
    expect(md).toMatch(/@media \(prefers-color-scheme: (dark|light)\)/);
    expect(md).toMatch(/:root\[data-tema="(oscuro|claro)"\]/);
    expect(generarDesignMd(c)).not.toContain('modo_alterno:');
  });
});

describe('otros formatos', () => {
  it('tokens.json es JSON válido y cada token tiene $type y $value', async () => {
    const { tokensJson } = await import('./extras');
    const c = configCompleta();
    const doc = JSON.parse(tokensJson({ ...c, visual: { ...c.visual, ambosModos: true } }));
    let hojas = 0;
    const recorrer = (g: Record<string, unknown>, ruta: string) => {
      for (const [k, v] of Object.entries(g)) {
        const x = v as Record<string, unknown>;
        if ('$value' in x) {
          hojas++;
          expect(typeof x.$type, `${ruta}.${k}`).toBe('string');
        } else recorrer(x, `${ruta}.${k}`);
      }
    };
    recorrer(doc, '');
    expect(hojas).toBeGreaterThan(30);
    expect(Object.keys(doc.color).some((k) => k.startsWith('modo_'))).toBe(true);
  });

  it('el prompt corto lleva los colores y las reglas de accesibilidad', async () => {
    const { promptCorto } = await import('./extras');
    const c = configCompleta();
    const t = promptCorto(c);
    expect(t).toContain(PALETAS[c.visual.paleta as keyof typeof PALETAS].roles.acento);
    expect(t).toContain('44px');
    expect(t.split('\n').length).toBeLessThan(16);
  });
});

describe('recomendados por tipo de proyecto', () => {
  it('cada id recomendado existe en su catálogo', async () => {
    const { RECOMENDADOS } = await import('../recomendados');
    const { BOTONES } = await import('../botones-disenos');
    const { CAJAS } = await import('../cajas');
    const { ESTILOS, LAYOUTS } = await import('../estilos-visuales');
    const { CATEGORIAS } = await import('../galeria');
    for (const [tipo, r] of Object.entries(RECOMENDADOS)) {
      for (const id of r.layouts) expect(LAYOUTS[id], `${tipo} layout ${id}`).toBeDefined();
      for (const id of r.estilos) expect(ESTILOS[id], `${tipo} estilo ${id}`).toBeDefined();
      for (const id of r.botones) expect(BOTONES[id], `${tipo} botón ${id}`).toBeDefined();
      for (const id of r.cajas) expect(CAJAS[id], `${tipo} caja ${id}`).toBeDefined();
      for (const [cat, ids] of Object.entries(r.componentes)) {
        const disenos = CATEGORIAS[cat as keyof typeof CATEGORIAS].disenos as Record<string, unknown>;
        for (const id of ids!) expect(disenos[id], `${tipo} ${cat} ${id}`).toBeDefined();
      }
    }
  });
});

describe('familias de botones', () => {
  it('cada botón está una sola vez entre familias, sueltos y experimentales', async () => {
    const { BOTONES, FAMILIAS_BOTON, EXPERIMENTALES } = await import('../botones-disenos');
    const vistos = [...FAMILIAS_BOTON.flatMap((f) => f.ids), ...EXPERIMENTALES];
    for (const id of vistos) expect(BOTONES[id], id).toBeDefined();
    expect(new Set(vistos).size).toBe(vistos.length);
  });

  it('la animación al tocar elegida aparte llega al export', () => {
    const c = configCompleta();
    const md = generarDesignMd({ ...c, botones: { ...c.botones, diseno: 'solido', efecto: 'gelatina' } });
    const comp = parse(bloquesYaml(md).find((b) => b.startsWith('botones:'))!);
    expect(comp.botones.al_tocar).toBe('gelatina');
    expect(comp.botones.clases).toContain('bt-ef-gelatina');
  });
});

describe('acento como texto', () => {
  it('--color-acento-texto se lee a 4.5:1 sobre fondo y superficie en todas las paletas', async () => {
    const { sistemaDeDiseno } = await import('./sistema');
    for (const id of Object.keys(PALETAS)) {
      const c = configCompleta();
      const s = sistemaDeDiseno({ ...c, visual: { ...c.visual, paleta: id as keyof typeof PALETAS } });
      const t = s.tokens['--color-acento-texto'];
      expect(contraste(t, s.paleta.roles.fondo), `${id} fondo`).toBeGreaterThanOrEqual(4.5);
      expect(contraste(t, s.paleta.roles.superficie), `${id} superficie`).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe('más diseños', () => {
  it('ningún diseño sumado pisa uno que ya existía', async () => {
    const { MAS_DISENOS } = await import('../galeria/mas-disenos');
    const { CATEGORIAS } = await import('../galeria');
    for (const [cat, extra] of Object.entries(MAS_DISENOS)) {
      for (const [id, d] of Object.entries(extra!)) expect(CATEGORIAS[cat as keyof typeof CATEGORIAS].disenos[id], `${cat}.${id}`).toBe(d);
    }
  });
});
