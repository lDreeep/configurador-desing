// Registro de todas las categorías de la galería, en el orden en que aparecen.

import { type Categoria, type CategoriaId, cssBaseDe, cssDisenoDe } from './base';
import { BOTON_ICONO, BOTON_SEC } from './botones-extra';
import { CAMPOS } from './campos';
import { CASILLAS, DESLIZADORES, INTERRUPTORES } from './controles';
import { GRAFICOS_CAT, METRICAS, TABLAS } from './datos';
import { ACORDEONES, AVATARES, AVISOS, CARGANDO, ETIQUETAS, MODALES, PROGRESO, TOOLTIPS } from './elementos';
import { NAV_MOVIL, NAV_WEB } from './navegacion';
import { SELECTOR } from './selector';

export const CATEGORIAS: Record<CategoriaId, Categoria> = {
  boton_sec: BOTON_SEC,
  boton_icono: BOTON_ICONO,
  campo: CAMPOS,
  selector: SELECTOR,
  interruptor: INTERRUPTORES,
  casilla: CASILLAS,
  deslizador: DESLIZADORES,
  nav_movil: NAV_MOVIL,
  nav_web: NAV_WEB,
  etiqueta: ETIQUETAS,
  aviso: AVISOS,
  cargando: CARGANDO,
  progreso: PROGRESO,
  acordeon: ACORDEONES,
  avatar: AVATARES,
  tooltip: TOOLTIPS,
  modal: MODALES,
  metrica: METRICAS,
  grafico: GRAFICOS_CAT,
  tabla: TABLAS,
};

/** El primer diseño de cada categoría: el que se usa si la persona no eligió otro. */
export const DISENO_INICIAL = Object.fromEntries(
  (Object.keys(CATEGORIAS) as CategoriaId[]).map((id) => [id, Object.keys(CATEGORIAS[id].disenos)[0]]),
) as Record<CategoriaId, string>;

/** CSS de toda la galería (base de cada categoría y cada diseño), para montarlo una vez. */
export function cssGaleria(): string {
  return (Object.values(CATEGORIAS) as Categoria[])
    .flatMap((c) => [cssBaseDe(c), ...Object.keys(c.disenos).filter((d) => c.disenos[d].css).map((d) => cssDisenoDe(c, d))])
    .join('\n');
}

export type { Categoria, CategoriaId };
