// Las rondas que ve todo proyecto: Proyecto → Rubro → Color → Layout → Estilo (obligatorias)
// y Piezas · Letra · Entrada (opcionales). Las propias de cada tipo están en ramas.ts.

import { DISENO_POR_ESTILO } from '../botones-por-estilo';
import { APARICIONES, COMBINACIONES, FUENTES, MOVIMIENTOS, PALETAS, TIPOS_PROYECTO } from '../catalogo';
import { estilosPara, LISTA_ESTILOS } from '../compatibilidad';
import { aplicarTipo } from '../estado';
import { ESTILOS, LAYOUTS } from '../estilos-visuales';
import { aplicarPaquete, FAMILIAS, paqueteN } from '../familias';
import { RECOMENDADOS } from '../recomendados';
import type { AparicionId, Config, EstiloId, FuenteId, LayoutId, PaletaId, TipoProyecto } from '../tipos';
import { primeroRecomendados, type Ronda, type RondaPendiente } from './ronda';

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

/** Rubro (para qué es): necesita `src/rubros.ts`, que llega con la tarea D1. */
export const RUBRO_PENDIENTE: RondaPendiente = { clave: 'rubro', ficha: 'Rubro', pregunta: '¿Para qué es?', tarea: 'D1' };

export const COLOR: Ronda = {
  clave: 'color',
  ficha: 'Color',
  pregunta: '¿Qué colores?',
  obligatoria: true,
  // Se elige antes que el estilo: van primero las paletas que declaran los estilos recomendados para el tipo.
  // (D10 suma las recomendaciones por rubro.)
  opciones: (c) => {
    const rec = recs(c).estilos.flatMap((e) => ESTILOS[e].paletas);
    return primeroRecomendados(LISTA_PALETAS, rec).map(({ id, recomendada }) => ({
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
    primeroRecomendados(LISTA_LAYOUTS, recs(c).layouts).map(({ id, recomendada }) => ({
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
  return primeroRecomendados(usables, rec);
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
      const p = paqueteN(c.visual.estilo, n);
      const f = FAMILIAS[p.familia];
      return { id: String(n), nombre: p.variante ? `${f.nombre} ${p.variante + 1}` : f.nombre, descripcion: f.descripcion, recomendada: n < 3 };
    }),
  aplicar: (c, id) => aplicarPaquete(c, paqueteN(c.visual.estilo, Number(id))),
  elegida: (c) => {
    for (let n = 0; n < CANTIDAD_PAQUETES; n++) {
      const p = paqueteN(c.visual.estilo, n);
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
