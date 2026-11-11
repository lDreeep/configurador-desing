// Diseño de botón que se propone para cada estilo. Separado de botones-disenos.ts (que es grande
// y se carga aparte) porque lo usa la portada al elegir un diseño.

import type { BotonDisenoId, EstiloId } from './tipos';

/** Diseño de botón que se propone para cada estilo visual (después se cambia en el panel). */
export const DISENO_POR_ESTILO: Record<EstiloId, BotonDisenoId> = {
  suizo: 'solido',
  bauhaus: 'empujable',
  memphis: 'sticker',
  neobrutalismo: 'sombra_dura',
  vidrio: 'vidrio',
  clay: 'clay',
  retro_os: 'bisel',
  terminal: 'terminal',
  editorial: 'subrayado',
  art_deco: 'doble',
  y2k: 'cromo',
  organico: 'pildora',
  minimal_tecnico: 'solido',
  oscuro_precision: 'brillo_borde',
  producto_amable: 'pildora',
  periodico: 'subrayado',
  japones: 'contorno',
  dopamina: 'almohada',
  lujo: 'doble',
  cyber: 'neon',
};
