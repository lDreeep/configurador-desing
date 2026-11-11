// Ramas: las rondas propias de cada tipo de proyecto (PLAN.md §7.1). Una landing ve fondo animado
// y scroll; un dashboard, métricas y gráficos. Es DATOS: la tabla de abajo es la fuente.
//
// Las que salen de la galería ya funcionan (opciones de `CATEGORIAS`, recomendadas de `recomendados.ts`).
// Las que piden catálogo nuevo quedan anotadas con su tarea y `rondasDe` no las devuelve hasta que existan.

import { CATEGORIAS } from '../galeria';
import type { CategoriaId } from '../galeria/base';
import { RECOMENDADOS } from '../recomendados';
import type { TipoProyecto } from '../tipos';
import { primeroRecomendados, type ClaveRama, type Ronda, type RondaPendiente } from './ronda';

/** Una ronda de rama: de la galería (ya hay catálogo) o pendiente de una tarea del plan. */
export type EntradaRama =
  | { galeria: CategoriaId; ficha: string; pregunta: string }
  | { pendiente: Exclude<ClaveRama, `galeria:${string}`>; ficha: string; pregunta: string; tarea: string };

const FONDO_ANIMADO: EntradaRama = { pendiente: 'fondo_animado', ficha: 'Fondo animado', pregunta: '¿Se mueve el fondo?', tarea: 'D6' };
const SCROLL: EntradaRama = { pendiente: 'scroll', ficha: 'Scroll', pregunta: '¿Qué pasa al bajar?', tarea: 'D7' };
const SECCIONES: EntradaRama = { pendiente: 'secciones', ficha: 'Secciones', pregunta: '¿Qué secciones lleva y en qué orden?', tarea: 'D12' };

export const RAMAS: Record<TipoProyecto, EntradaRama[]> = {
  landing: [FONDO_ANIMADO, SCROLL, SECCIONES],
  sitio: [FONDO_ANIMADO, SCROLL, SECCIONES, { galeria: 'pie', ficha: 'Pie de página', pregunta: '¿Cómo cierra cada página?' }],
  portfolio: [FONDO_ANIMADO, SCROLL, { galeria: 'carrusel', ficha: 'Galería de trabajos', pregunta: '¿Cómo se muestran tus trabajos?' }],
  tienda: [
    { galeria: 'producto', ficha: 'Tarjeta de producto', pregunta: '¿Cómo se ve cada producto?' },
    { galeria: 'formulario', ficha: 'Carrito y compra', pregunta: '¿Cómo se completa la compra?' },
    { galeria: 'buscador', ficha: 'Buscador y filtros', pregunta: '¿Cómo se busca en la tienda?' },
  ],
  app_web: [
    { galeria: 'nav_web', ficha: 'Navegación', pregunta: '¿Cómo se pasa de una pantalla a otra?' },
    { galeria: 'formulario', ficha: 'Formularios', pregunta: '¿Cómo se cargan los datos?' },
    { galeria: 'tabla', ficha: 'Tablas', pregunta: '¿Cómo se ven las listas de datos?' },
    { galeria: 'vacio', ficha: 'Pantallas vacías', pregunta: '¿Qué se ve cuando todavía no hay nada?' },
  ],
  app_movil: [
    { galeria: 'nav_movil', ficha: 'Barra inferior', pregunta: '¿Cómo es la barra de abajo?' },
    { galeria: 'campo', ficha: 'Formularios', pregunta: '¿Cómo son los campos para escribir?' },
    { galeria: 'aviso', ficha: 'Avisos', pregunta: '¿Cómo avisa la app que algo pasó?' },
  ],
  dashboard: [
    { galeria: 'metrica', ficha: 'Métricas', pregunta: '¿Cómo se muestran los números clave?' },
    { galeria: 'grafico', ficha: 'Gráficos', pregunta: '¿Qué gráficos?' },
    { galeria: 'tabla', ficha: 'Tablas', pregunta: '¿Cómo se ven las tablas?' },
    { pendiente: 'densidad', ficha: 'Densidad', pregunta: '¿Cuánta información entra en pantalla?', tarea: 'D11' },
  ],
  blog: [
    { pendiente: 'lectura', ficha: 'Lectura', pregunta: '¿Qué ancho y tamaño de letra para leer?', tarea: 'D11' },
    { galeria: 'migas', ficha: 'Índice', pregunta: '¿Cómo se ubica quien lee?' },
    { galeria: 'acceso', ficha: 'Suscripción', pregunta: '¿Cómo se suscriben?' },
  ],
};

/** La ronda de una categoría de la galería: sus diseños, los recomendados para el tipo primero. */
export function rondaDeGaleria(cat: CategoriaId, ficha: string, pregunta: string): Ronda {
  return {
    clave: `galeria:${cat}`,
    ficha,
    pregunta,
    obligatoria: false,
    opciones: (c) => {
      const disenos = CATEGORIAS[cat].disenos;
      return primeroRecomendados(Object.keys(disenos), RECOMENDADOS[c.proyecto.tipo].componentes[cat] ?? []).map(({ id, recomendada }) => ({
        id,
        nombre: disenos[id].nombre,
        descripcion: disenos[id].descripcion,
        recomendada,
      }));
    },
    aplicar: (c, id) => ({ ...c, componentes: { ...c.componentes, [cat]: id } }),
    elegida: (c) => c.componentes[cat] ?? null,
  };
}

/** Las rondas de la rama de un tipo que ya se pueden usar. */
export function rondasDeRama(tipo: TipoProyecto): Ronda[] {
  return RAMAS[tipo].flatMap((e) => ('galeria' in e ? [rondaDeGaleria(e.galeria, e.ficha, e.pregunta)] : []));
}

/** Las rondas de la rama que todavía esperan su catálogo. */
export function pendientesDeRama(tipo: TipoProyecto): RondaPendiente[] {
  return RAMAS[tipo].flatMap((e) => ('pendiente' in e ? [{ clave: e.pendiente, ficha: e.ficha, pregunta: e.pregunta, tarea: e.tarea }] : []));
}
