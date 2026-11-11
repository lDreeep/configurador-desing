import { rubrosDe, rubroPorId } from '../rubros';
// Las rondas que ve todo proyecto: Proyecto → Rubro → Color → Layout → Estilo (obligatorias)
// y Piezas · Letra · Entrada (opcionales). Las propias de cada tipo están en ramas.ts.

import { DISENO_POR_ESTILO } from '../botones-por-estilo';
import { APARICIONES, COMBINACIONES, DENSIDADES, DIRECCIONES, FUENTES, ICONOS, MOVIMIENTOS, PALETAS, TIPOS_PROYECTO, TONOS } from '../catalogo';
import { estilosPara, LISTA_ESTILOS } from '../compatibilidad';
import { aplicarTipo } from '../estado';
import { ESTILOS, LAYOUTS } from '../estilos-visuales';
import { aplicarPaquete, FAMILIAS, familiasPara, paqueteN } from '../familias';
import { conRubro, recomendadosDeRubro, RECOMENDADOS, RECOMENDADOS_D11 } from '../recomendados';
import type { AparicionId, Config, Densidad, EstiloId, FuenteId, LayoutId, PaletaId, TipoProyecto } from '../tipos';
import { primeroRecomendados, type Ronda } from './ronda';

const LISTA_PALETAS = Object.keys(PALETAS) as PaletaId[];
const LISTA_LAYOUTS = Object.keys(LAYOUTS) as LayoutId[];
const LISTA_TIPOS = Object.keys(TIPOS_PROYECTO) as TipoProyecto[];
const recs = (c: Config) => RECOMENDADOS[c.proyecto.tipo];
const muestrasDe = (p: PaletaId) => {
  const r = PALETAS[p].roles;
  return [r.fondo, r.superficie, r.acento, r.texto];
};

export const PROYECTO: Ronda = {
  clave: 'proyecto',
  ficha: 'Proyecto',
  pregunta: '¿Qué vas a hacer?',
  obligatoria: true,
  opciones: () => LISTA_TIPOS.map((id) => ({ id, nombre: TIPOS_PROYECTO[id].nombre, descripcion: TIPOS_PROYECTO[id].descripcion, recomendada: false })),
  // aplicarTipo cambia el proyecto y sus pantallas; el color, el estilo, las piezas y la letra quedan.
  aplicar: (c, id) => aplicarTipo(c, id as TipoProyecto),
  elegida: (c) => c.proyecto.tipo,
};

export const RUBRO: Ronda = {
  clave: 'rubro', ficha: 'Rubro', pregunta: '¿Para qué es?', obligatoria: true,
  opciones: (c) => rubrosDe(c.proyecto.tipo).map((r) => ({ id: r.id, nombre: r.nombre, recomendada: false })),
  aplicar: (c, id) => rubroPorId(id)?.tipo === c.proyecto.tipo ? { ...c, proyecto: { ...c.proyecto, rubro: id } } : c,
  elegida: (c) => c.proyecto.rubro ?? null,
};
const recRubro = (c: Config) => recomendadosDeRubro(c.proyecto.rubro);
const paqueteDe = (c: Config, n: number) => paqueteN(c.visual.estilo, n, recRubro(c) ? conRubro(recRubro(c)?.familias, familiasPara(c.visual.estilo)) : undefined);

export const COLOR: Ronda = {
  clave: 'color',
  ficha: 'Color',
  pregunta: '¿Qué colores?',
  obligatoria: true,
  // Se elige antes que el estilo: van primero las paletas que declaran los estilos recomendados para el tipo.
  // D13 antepone las recomendaciones del rubro.
  opciones: (c) => {
    const rec = recs(c).estilos.flatMap((e) => ESTILOS[e].paletas);
    return primeroRecomendados(LISTA_PALETAS, conRubro(recRubro(c)?.paletas, rec)).map(({ id, recomendada }) => ({
      id,
      nombre: PALETAS[id].nombre,
      descripcion: `Modo ${PALETAS[id].modo}`,
      recomendada,
      muestras: muestrasDe(id),
    }));
  },
  aplicar: (c, id) => ({ ...c, visual: { ...c.visual, paleta: id as PaletaId } }),
  elegida: (c) => (c.visual.paleta === 'personalizada' ? null : c.visual.paleta),
};

export const LAYOUT: Ronda = {
  clave: 'layout',
  ficha: 'Layout',
  pregunta: '¿Cómo se ordena la página?',
  obligatoria: true,
  opciones: (c) =>
    primeroRecomendados(LISTA_LAYOUTS, conRubro(recRubro(c)?.layouts, recs(c).layouts)).map(({ id, recomendada }) => ({
      id,
      nombre: LAYOUTS[id].nombre,
      descripcion: LAYOUTS[id].descripcion,
      recomendada,
    })),
  // Las plantillas de autor traen su receta (estilo, colores, letra) en el modo rápido; en Molde el color
  // y el estilo ya se eligieron antes, así que acá solo cambia el layout.
  aplicar: (c, id) => ({ ...c, visual: { ...c.visual, layout: id as LayoutId } }),
  elegida: (c) => c.visual.layout,
};

/** Los estilos que se ofrecen con la paleta elegida (A3: ninguno que no pase AA), los recomendados para el tipo primero. */
function estilosOfrecidos(c: Config): { id: EstiloId; recomendada: boolean }[] {
  const p = c.visual.paleta;
  const usables = p === 'personalizada' ? LISTA_ESTILOS : estilosPara(p);
  const rec = recs(c).estilos.filter((e) => p === 'personalizada' || ESTILOS[e].paletas.includes(p));
  return primeroRecomendados(usables, conRubro(recRubro(c)?.estilos, rec));
}

export const ESTILO: Ronda = {
  clave: 'estilo',
  ficha: 'Estilo',
  pregunta: '¿Qué estilo?',
  obligatoria: true,
  opciones: (c) =>
    estilosOfrecidos(c).map(({ id, recomendada }) => ({
      id,
      nombre: ESTILOS[id].nombre,
      descripcion: ESTILOS[id].descripcion,
      // Sin sello si la paleta elegida no está entre las que el estilo declara: se puede, pero no es su receta.
      recomendada: recomendada || (c.visual.paleta !== 'personalizada' && ESTILOS[id].paletas.includes(c.visual.paleta)),
    })),
  // El estilo trae forma, movimiento, botón y letra; el color ya está elegido y no se toca.
  // Si la persona ya eligió letra o piezas, tampoco se pisan.
  aplicar: (c, id, ctx) => {
    const e = ESTILOS[id as EstiloId];
    const m = MOVIMIENTOS[e.movimiento];
    const letraElegida = ctx?.elegidas.has('letra');
    const piezasElegidas = ctx?.elegidas.has('piezas');
    return {
      ...c,
      visual: {
        ...c.visual,
        estilo: id as EstiloId,
        direccion: e.direccionBase,
        fuenteTitulos: letraElegida ? c.visual.fuenteTitulos : e.fuentes[0][0],
        fuenteTexto: letraElegida ? c.visual.fuenteTexto : e.fuentes[0][1],
        pesoTitulos: letraElegida ? c.visual.pesoTitulos : e.pesoTitulos,
        radio: e.radio,
        elevacion: e.elevacion,
        bordes: e.bordes,
        movimiento: e.movimiento,
        hover: e.boton === 'sombra_dura' ? 'desplazar' : m.hover,
        presionar: m.presionar === 'nada' && e.movimiento !== 'minimo' ? 'hundir' : m.presionar,
      },
      botones: { ...c.botones, estilo: e.boton, diseno: piezasElegidas ? c.botones.diseno : DISENO_POR_ESTILO[id as EstiloId] },
    };
  },
  elegida: (c) => (c.visual.estilo === 'clasico' ? null : c.visual.estilo),
};

/** Cuántos paquetes de piezas se ofrecen (dos tandas de 6). */
export const CANTIDAD_PAQUETES = 12;

export const PIEZAS: Ronda = {
  clave: 'piezas',
  ficha: 'Piezas',
  pregunta: '¿Qué botones, cajas y piezas?',
  obligatoria: false,
  // Cada opción es un paquete coherente de familias.ts para el estilo elegido: botón, caja y una pieza por categoría.
  opciones: (c) =>
    Array.from({ length: CANTIDAD_PAQUETES }, (_, n) => {
      const p = paqueteDe(c, n);
      const f = FAMILIAS[p.familia];
      return { id: String(n), nombre: p.variante ? `${f.nombre} ${p.variante + 1}` : f.nombre, descripcion: f.descripcion, recomendada: n < (recRubro(c) ? 6 : 3) };
    }),
  aplicar: (c, id) => aplicarPaquete(c, paqueteDe(c, Number(id))),
  elegida: (c) => {
    for (let n = 0; n < CANTIDAD_PAQUETES; n++) {
      const p = paqueteDe(c, n);
      const iguales = p.boton === c.botones.diseno && p.caja === c.cajas.preset && Object.entries(p.componentes).every(([k, v]) => c.componentes[k as keyof typeof c.componentes] === v);
      if (iguales) return String(n);
    }
    return null;
  },
};

const idLetra = (t: FuenteId, x: FuenteId) => `${t}+${x}`;

export const LETRA: Ronda = {
  clave: 'letra',
  ficha: 'Letra',
  pregunta: '¿Qué letra?',
  obligatoria: false,
  // Primero las combinaciones del estilo elegido, después las del catálogo (sin repetir).
  opciones: (c) => {
    const delEstilo = c.visual.estilo === 'clasico' ? [] : ESTILOS[c.visual.estilo].fuentes.map(([t, x]) => ({ t, x, nombre: undefined as string | undefined }));
    const catalogo = COMBINACIONES.map((k) => ({ t: k.titulos, x: k.texto, nombre: k.nombre as string | undefined }));
    const vistas = new Set<string>();
    return [...delEstilo.map((k) => ({ ...k, recomendada: true })), ...catalogo.map((k) => ({ ...k, recomendada: false }))]
      .filter((k) => !vistas.has(idLetra(k.t, k.x)) && vistas.add(idLetra(k.t, k.x)))
      .map((k) => ({
        id: idLetra(k.t, k.x),
        nombre: k.nombre ?? (k.t === k.x ? FUENTES[k.t].nombre : `${FUENTES[k.t].nombre} + ${FUENTES[k.x].nombre}`),
        descripcion: `${FUENTES[k.t].nombre} + ${FUENTES[k.x].nombre}`,
        recomendada: k.recomendada,
      }));
  },
  aplicar: (c, id) => {
    const [t, x] = id.split('+') as [FuenteId, FuenteId];
    return { ...c, visual: { ...c.visual, fuenteTitulos: t, fuenteTexto: x } };
  },
  elegida: (c) => idLetra(c.visual.fuenteTitulos, c.visual.fuenteTexto),
};

export const ENTRADA: Ronda = {
  clave: 'entrada',
  ficha: 'Entrada',
  pregunta: '¿Cómo aparece la página?',
  obligatoria: false,
  // D8 suma 7 entradas nuevas a APARICIONES; esta ronda las toma solas.
  // Va primero la que trae el movimiento del estilo.
  opciones: (c) =>
    primeroRecomendados(Object.keys(APARICIONES) as AparicionId[], [MOVIMIENTOS[c.visual.movimiento].aparicion]).map(({ id, recomendada }) => ({
      id,
      nombre: APARICIONES[id].nombre,
      descripcion: APARICIONES[id].descripcion,
      recomendada,
    })),
  aplicar: (c, id) => ({ ...c, visual: { ...c.visual, aparicion: id as AparicionId } }),
  elegida: (c) => c.visual.aparicion,
};

// ---------- Rondas opcionales de D11 (iconos, tono y densidad: DESIGN.md §11, §13 y §8) ----------

export const ICONOS_RONDA: Ronda = {
  clave: 'iconos',
  ficha: 'Iconos',
  pregunta: '¿Qué iconos?',
  obligatoria: false,
  opciones: (c) =>
    primeroRecomendados(Object.keys(ICONOS), RECOMENDADOS_D11[c.proyecto.tipo].iconos).map(({ id, recomendada }) => ({
      id,
      nombre: ICONOS[id].nombre,
      descripcion: ICONOS[id].descripcion,
      recomendada,
    })),
  aplicar: (c, id) => ({ ...c, iconos: { libreria: ICONOS[id].libreria, estilo: ICONOS[id].estilo, grosor: ICONOS[id].grosor } }),
  elegida: (c) => (c.iconos ? (Object.keys(ICONOS).find((k) => ICONOS[k].libreria === c.iconos!.libreria && ICONOS[k].estilo === c.iconos!.estilo) ?? null) : null),
};

export const TONO: Ronda = {
  clave: 'tono',
  ficha: 'Tono',
  pregunta: '¿Cómo se escriben los textos?',
  obligatoria: false,
  // La descripción es una frase de ejemplo, para que se vea cómo suena.
  opciones: (c) =>
    primeroRecomendados(Object.keys(TONOS), RECOMENDADOS_D11[c.proyecto.tipo].tonos).map(({ id, recomendada }) => ({
      id,
      nombre: TONOS[id].nombre,
      descripcion: `«${TONOS[id].ejemplo}»`,
      recomendada,
    })),
  aplicar: (c, id) => ({ ...c, tono: { voz: TONOS[id].voz, tratamiento: TONOS[id].tratamiento, largo: TONOS[id].largo } }),
  elegida: (c) => (c.tono ? (Object.keys(TONOS).find((k) => TONOS[k].voz === c.tono!.voz && TONOS[k].tratamiento === c.tono!.tratamiento && TONOS[k].largo === c.tono!.largo) ?? null) : null),
};

const LISTA_DENSIDADES = Object.keys(DENSIDADES) as Densidad[];

export const DENSIDAD: Ronda = {
  clave: 'densidad',
  ficha: 'Densidad',
  pregunta: '¿Cuánta información entra en pantalla?',
  obligatoria: false,
  // Van primero las del tipo de proyecto y la que ya trae la dirección del estilo.
  opciones: (c) =>
    primeroRecomendados(LISTA_DENSIDADES, [...RECOMENDADOS_D11[c.proyecto.tipo].densidades, DIRECCIONES[c.visual.direccion].densidad]).map(({ id, recomendada }) => ({
      id,
      nombre: DENSIDADES[id].nombre,
      descripcion: DENSIDADES[id].descripcion,
      recomendada,
    })),
  aplicar: (c, id) => ({ ...c, visual: { ...c.visual, densidad: id as Densidad } }),
  elegida: (c) => c.visual.densidad,
};
