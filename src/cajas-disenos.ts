// Los diseños base de caja y los nombres de cada opción (los tipos, los tokens y la regla .caja
// están en cajas.ts). No va en la carga inicial: lo importan la hoja de la página, los paneles y el
// export. Al cargarse registra los diseños en cajas.ts para `paramsDe`.

import {
  type CajaBordeColor,
  type CajaBordeEstilo,
  type CajaForma,
  type CajaFondo,
  type CajaHover,
  type CajaPreset,
  type CajaRadio,
  type CajaRelleno,
  type CajaSombra,
  type ParamsCaja,
  registrarCajas,
} from './cajas';
import type { CajaPresetId } from './tipos';

const base: ParamsCaja = {
  fondo: 'superficie', transparencia: 0, desenfoque: 0, bordeGrosor: 0, bordeEstilo: 'solid', bordeColor: 'borde',
  radio: 'heredar', sombra: 'ninguna', relleno: 'normal', hover: 'nada', forma: 'normal',
};
const p = (cambios: Partial<ParamsCaja>): ParamsCaja => ({ ...base, ...cambios });

export const CAJAS: Record<CajaPresetId, CajaPreset> = {
  superficie: { nombre: 'Superficie', descripcion: 'Fondo apenas distinto, sin bordes', params: p({}) },
  contorno: { nombre: 'Contorno fino', descripcion: 'Solo una línea suave', params: p({ fondo: 'fondo', bordeGrosor: 1 }) },
  elevada: { nombre: 'Elevada', descripcion: 'Sombra difusa, flota apenas', params: p({ fondo: 'fondo', sombra: 'suave', hover: 'elevar' }) },
  flotante: { nombre: 'Flotante', descripcion: 'Sombra marcada, se despega', params: p({ fondo: 'fondo', sombra: 'marcada', radio: '20', hover: 'elevar' }) },
  vidrio: { nombre: 'Vidrio', descripcion: 'Translúcida con desenfoque', params: p({ transparencia: 55, desenfoque: 16, bordeGrosor: 1, radio: '20', sombra: 'suave' }) },
  velo: { nombre: 'Velo', descripcion: 'Casi transparente, sin desenfoque', params: p({ transparencia: 75, bordeGrosor: 1, bordeEstilo: 'solid' }) },
  neobrutal: { nombre: 'Neobrutal', descripcion: 'Borde negro y sombra sólida', params: p({ fondo: 'fondo', bordeGrosor: 2, bordeColor: 'texto', sombra: 'dura', radio: '6', hover: 'elevar' }) },
  neumorfica: { nombre: 'Neumórfica', descripcion: 'En relieve, del mismo color que el fondo', params: p({ fondo: 'fondo', sombra: 'relieve', radio: '20' }) },
  hundida: { nombre: 'Hundida', descripcion: 'Como tallada hacia adentro', params: p({ sombra: 'interna', radio: '20' }) },
  punteada: { nombre: 'Punteada', descripcion: 'Borde de puntos, informal', params: p({ fondo: 'fondo', bordeGrosor: 2, bordeEstilo: 'dotted', bordeColor: 'texto' }) },
  rayada: { nombre: 'Línea cortada', descripcion: 'Borde de guiones, de borrador', params: p({ fondo: 'fondo', bordeGrosor: 2, bordeEstilo: 'dashed', bordeColor: 'acento' }) },
  doble: { nombre: 'Línea doble', descripcion: 'Marco doble, clásico', params: p({ fondo: 'fondo', bordeGrosor: 4, bordeEstilo: 'double', bordeColor: 'acento', radio: '0' }) },
  cabecera: { nombre: 'Con cabecera', descripcion: 'Franja de color arriba', params: p({ fondo: 'fondo', bordeGrosor: 1, forma: 'cabecera', sombra: 'suave' }) },
  barra: { nombre: 'Barra lateral', descripcion: 'Línea de color a la izquierda', params: p({ forma: 'barra_lateral', radio: '6' }) },
  cortada: { nombre: 'Esquina cortada', descripcion: 'Una esquina en diagonal', params: p({ forma: 'esquina_cortada', radio: '0', fondo: 'acento_suave' }) },
  ticket: { nombre: 'Ticket', descripcion: 'Muescas a los costados, como una entrada', params: p({ forma: 'ticket', fondo: 'acento_suave', radio: '12' }) },
  brillo: { nombre: 'Borde que brilla', descripcion: 'Halo del color de acento', params: p({ fondo: 'fondo', bordeGrosor: 1, bordeColor: 'acento', sombra: 'brillo', radio: '20', hover: 'brillo' }) },
  degradado: { nombre: 'Degradado sutil', descripcion: 'Pasa suave hacia el acento', params: p({ fondo: 'degradado', radio: '20', hover: 'inclinar' }) },
  puntos: { nombre: 'Trama de puntos', descripcion: 'Textura de puntos finos', params: p({ fondo: 'puntos', bordeGrosor: 1 }) },
  papel: { nombre: 'Papel con grano', descripcion: 'Textura de papel', params: p({ fondo: 'grano', sombra: 'suave', radio: '6' }) },
  cuaderno: { nombre: 'Cuaderno', descripcion: 'Renglones de fondo', params: p({ fondo: 'lineas', bordeGrosor: 1, radio: '6' }) },
  acento: { nombre: 'Bloque de color', descripcion: 'Relleno del acento, texto claro', params: p({ fondo: 'acento', radio: '20', hover: 'escala' }) },
  editorial: { nombre: 'Sin caja', descripcion: 'Solo un filete arriba, como una revista', params: p({ forma: 'filete', fondo: 'fondo' }) },
  sombra_color: { nombre: 'Sombra de color', descripcion: 'Sombra sólida del color de acento', params: p({ fondo: 'fondo', bordeGrosor: 2, bordeColor: 'texto', sombra: 'color', radio: '12', hover: 'elevar' }) },
  cristal_color: { nombre: 'Cristal de color', descripcion: 'Vidrio teñido del acento', params: p({ fondo: 'acento_suave', transparencia: 40, desenfoque: 14, bordeGrosor: 1, bordeColor: 'acento', radio: '20' }) },
  sello: { nombre: 'Sello', descripcion: 'Doble borde punteado de color', params: p({ fondo: 'acento_suave', bordeGrosor: 2, bordeEstilo: 'dashed', bordeColor: 'acento', sombra: 'interna', radio: '12' }) },
  invertida: { nombre: 'Invertida', descripcion: 'Oscura sobre claro (o al revés)', params: p({ fondo: 'invertido', radio: '20', hover: 'escala' }) },
  gruesa: { nombre: 'Borde grueso', descripcion: 'Contorno pesado y redondo', params: p({ fondo: 'fondo', bordeGrosor: 4, bordeColor: 'texto', radio: '28' }) },
  flotante_vidrio: { nombre: 'Vidrio flotante', descripcion: 'Vidrio fuerte con sombra marcada', params: p({ transparencia: 65, desenfoque: 24, bordeGrosor: 1, sombra: 'marcada', radio: '28', hover: 'elevar' }) },
  pildora_suave: { nombre: 'Píldora suave', descripcion: 'Muy redondeada, con aire y que crece al pasar', params: p({ radio: '40', relleno: 'amplio', hover: 'escala' }) },
  compacta: { nombre: 'Compacta', descripcion: 'Contorno fino y poco espacio, para listas densas', params: p({ fondo: 'fondo', bordeGrosor: 1, relleno: 'compacto', radio: '6' }) },
  acento_borde: { nombre: 'Tonal con borde', descripcion: 'Fondo suave del acento con su borde', params: p({ fondo: 'acento_suave', bordeGrosor: 2, bordeColor: 'acento', radio: '12', hover: 'borde' }) },
  inclina: { nombre: 'Se inclina', descripcion: 'Sombra marcada; se inclina al pasar el mouse', params: p({ fondo: 'fondo', sombra: 'marcada', radio: '12', hover: 'inclinar' }) },
  cabecera_vidrio: { nombre: 'Vidrio con cabecera', descripcion: 'Translúcida con una franja de color arriba', params: p({ forma: 'cabecera', transparencia: 50, desenfoque: 14, bordeGrosor: 1, radio: '20' }) },
  ticket_punteado: { nombre: 'Cupón', descripcion: 'Muescas y borde de guiones, como un cupón', params: p({ forma: 'ticket', fondo: 'fondo', bordeGrosor: 2, bordeEstilo: 'dashed', bordeColor: 'texto', radio: '12' }) },
  invertida_brillo: { nombre: 'Oscura que brilla', descripcion: 'Invertida con halo del acento', params: p({ fondo: 'invertido', sombra: 'brillo', radio: '12', hover: 'brillo' }) },
  puntos_color: { nombre: 'Puntos con borde de color', descripcion: 'Trama de puntos y contorno del acento', params: p({ fondo: 'puntos', bordeGrosor: 2, bordeColor: 'acento', radio: '20' }) },
  renglones: { nombre: 'Anotador', descripcion: 'Renglones con un filete arriba', params: p({ fondo: 'lineas', forma: 'filete' }) },
  grano_dura: { nombre: 'Afiche', descripcion: 'Grano, borde negro y sombra dura, recta', params: p({ fondo: 'grano', bordeGrosor: 2, bordeColor: 'texto', sombra: 'dura', radio: '0' }) },
  degradado_vidrio: { nombre: 'Degradado translúcido', descripcion: 'Degradado del acento con desenfoque', params: p({ fondo: 'degradado', transparencia: 30, desenfoque: 12, radio: '28', hover: 'elevar' }) },
  barra_acento: { nombre: 'Nota destacada', descripcion: 'Barra lateral sobre fondo de acento suave', params: p({ forma: 'barra_lateral', fondo: 'acento_suave', radio: '12', hover: 'borde' }) },
  cortada_contorno: { nombre: 'Corte con contorno', descripcion: 'Esquina cortada con borde del texto', params: p({ forma: 'esquina_cortada', fondo: 'fondo', bordeGrosor: 2, bordeColor: 'texto', radio: '0' }) },
  aire: { nombre: 'Mucho aire', descripcion: 'Espacio interno amplio, borde fino y sombra apenas', params: p({ fondo: 'fondo', relleno: 'amplio', bordeGrosor: 1, radio: '28', sombra: 'suave' }) },
  hundida_color: { nombre: 'Hundida de color', descripcion: 'Tallada hacia adentro, tono del acento', params: p({ fondo: 'acento_suave', sombra: 'interna', radio: '12' }) },
};

export const OPCIONES_CAJA = {
  fondo: { superficie: 'Superficie', fondo: 'Igual al fondo', acento_suave: 'Acento suave', acento: 'Acento', invertido: 'Invertido', degradado: 'Degradado', puntos: 'Puntos', grano: 'Grano', lineas: 'Renglones' } as Record<CajaFondo, string>,
  bordeEstilo: { solid: 'Continua', dashed: 'Guiones', dotted: 'Puntos', double: 'Doble' } as Record<CajaBordeEstilo, string>,
  bordeColor: { borde: 'Suave', texto: 'Fuerte', acento: 'Acento' } as Record<CajaBordeColor, string>,
  radio: { heredar: 'Como el resto', 0: 'Recta', 6: '6', 12: '12', 20: '20', 28: '28', 40: '40' } as Record<CajaRadio, string>,
  sombra: { ninguna: 'Ninguna', suave: 'Suave', marcada: 'Marcada', dura: 'Dura', color: 'De color', brillo: 'Brillo', interna: 'Hundida', relieve: 'Relieve' } as Record<CajaSombra, string>,
  relleno: { compacto: 'Compacto', normal: 'Normal', amplio: 'Amplio' } as Record<CajaRelleno, string>,
  hover: { nada: 'Nada', elevar: 'Se eleva', borde: 'Borde de color', escala: 'Crece', inclinar: 'Se inclina', brillo: 'Brilla' } as Record<CajaHover, string>,
  forma: { normal: 'Normal', cabecera: 'Cabecera', barra_lateral: 'Barra lateral', esquina_cortada: 'Esquina cortada', ticket: 'Ticket', filete: 'Solo filete' } as Record<CajaForma, string>,
};

registrarCajas(CAJAS);
