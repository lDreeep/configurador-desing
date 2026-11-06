import { parse } from 'yaml';
import { aplicarDireccion, configInicial } from '../estado';
import { PALETAS } from '../catalogo';
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

  it('marca sin_definir y pendientes que bloquean cuando falta información', () => {
    const md = generarDesignMd(configInicial());
    const proyecto = parse(bloquesYaml(md).find((b) => b.startsWith('nombre:'))!);
    expect(proyecto.objetivo_principal).toBe('sin_definir');
    const pendientes = parse(bloquesYaml(md).find((b) => b.startsWith('sin_definir:'))!);
    expect(pendientes.sin_definir).toContainEqual({ seccion: 4, campo: 'acciones_clave', bloquea: 'si' });
  });

  it('los tokens CSS coinciden con la paleta elegida', () => {
    const c = aplicarDireccion(configCompleta(), 'audaz');
    const md = generarDesignMd(c);
    expect(md).toContain(`--color-acento: ${PALETAS.tinta_y_lima.roles.acento};`);
    expect(md).toContain('--radio-boton: 0px;');
  });
});

describe('catálogo de paletas', () => {
  it('todas pasan contraste AA en los pares principales', () => {
    for (const [id, p] of Object.entries(PALETAS)) {
      const r = p.roles;
      expect(contraste(r.texto, r.fondo), `${id} texto/fondo`).toBeGreaterThanOrEqual(4.5);
      expect(contraste(r.texto_suave, r.superficie), `${id} texto_suave/superficie`).toBeGreaterThanOrEqual(4.5);
      expect(contraste(r.sobre_acento, r.acento), `${id} sobre_acento/acento`).toBeGreaterThanOrEqual(4.5);
      for (const [e, color] of Object.entries(p.estados))
        expect(contraste(color, r.fondo), `${id} estado ${e}`).toBeGreaterThanOrEqual(4.5);
    }
  });
});
