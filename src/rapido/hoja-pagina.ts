// La hoja de la página: el CSS de los 20 estilos, los fondos con textura y los efectos de scroll,
// cada uno limitado a su clase, el contenido de muestra por tipo de proyecto y los diseños de caja. Baja aparte de la
// carga inicial (la pide hoja.ts).

// Los diseños de caja: al cargarse quedan registrados para `paramsDe` (cajas.ts).
import '../cajas-disenos';
import { cssDeEstilo } from '../estilos-css';
import { ESTILOS } from '../estilos-visuales';
import { cssDeFondo } from '../fondos-css';
import { FONDOS, type FondoId, SELECTOR_FONDO } from '../fondos';
import { claseScroll, cssDeScroll, EFECTOS_SCROLL, type ScrollId } from '../scroll';
import type { EstiloId } from '../tipos';
import { FONDOS_AUTO } from './Pagina';

export { rubroPorId } from '../rubros';

export { CONTENIDO_TIPO } from './contenido-tipo';

export function cssDePagina(): string {
  const estilos = (Object.keys(ESTILOS) as Exclude<EstiloId, 'clasico'>[]).map((id) => cssDeEstilo(id, `.pg.estilo-${id}`));
  // Los fondos van después de los estilos: si se elige uno, gana sobre el visual del estilo.
  const auto = FONDOS_AUTO.map((id) => cssDeFondo(id, `.pg.pg .pg-media.fa-${id}`));
  const fondos = (Object.keys(FONDOS) as FondoId[]).map((id) => cssDeFondo(id, SELECTOR_FONDO(id)));
  // Los efectos de scroll, cada uno limitado a su clase en la raíz (scroll.ts).
  const scroll = (Object.keys(EFECTOS_SCROLL) as ScrollId[]).map((id) => cssDeScroll(id, `.pg.${claseScroll(id)}`));
  return [...estilos, ...auto, ...fondos, ...scroll].join('\n');
}
