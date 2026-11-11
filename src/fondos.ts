// Fondos con textura para que los diseños no se vean planos: fieltro, vidrio acanalado, térmico,
// agua, grafito, paisaje de un tono, plano técnico, semitono, grano, pasto, tramado, papel,
// curvas de nivel, cielo, mosaico de píxeles, lente, punteado, grilla de cuadraditos,
// foto desenfocada, iridiscente e impresionista.
//
// Todo es CSS: gradientes y SVG generados por código (sin fotos ni archivos). Los que pueden usan
// los colores de la paleta (--color-acento, --color-texto…); los que tienen un color propio
// (cielo, pasto, plano…) lo dicen en su descripción. En el CSS, `&` es la capa de fondo:
// un elemento vacío, decorativo (aria-hidden), detrás del contenido. Nunca va texto encima sin
// un velo o una tarjeta que asegure el contraste.
//
// Acá están los datos de cada fondo; su CSS está en fondos-css.ts, que baja aparte con el resto
// de la hoja de la página (rapido/hoja.ts), así no pesa en la carga inicial.

export type FondoId =
  | 'fieltro'
  | 'vidrio_acanalado'
  | 'termico'
  | 'agua'
  | 'grafito'
  | 'paisaje'
  | 'plano'
  | 'semitono'
  | 'grano'
  | 'pasto'
  | 'tramado'
  | 'papel'
  | 'curvas_nivel'
  | 'cielo'
  | 'pixeles'
  | 'lente'
  | 'punteado'
  | 'grilla_cuadrados'
  | 'desenfocado'
  | 'iridiscente'
  | 'impresionista';

export interface Fondo {
  nombre: string;
  descripcion: string;
  /** true si usa los colores de la paleta; false si tiene un color propio. */
  dePaleta: boolean;
  /** Si es oscuro, el texto encima va claro (y al revés). */
  oscuro: boolean;
}

export const FONDOS: Record<FondoId, Fondo> = {
  fieltro: {
    nombre: 'Fieltro',
    descripcion: 'Tela suave con pelusa, del tono del acento',
    dePaleta: true,
    oscuro: true,
  },
  vidrio_acanalado: {
    nombre: 'Vidrio acanalado',
    descripcion: 'Como mirar a través de un vidrio de canaletas',
    dePaleta: true,
    oscuro: true,
  },
  termico: {
    nombre: 'Térmico',
    descripcion: 'Manchas de calor, como una cámara infrarroja (colores propios)',
    dePaleta: false,
    oscuro: true,
  },
  agua: {
    nombre: 'Agua',
    descripcion: 'Reflejos de luz en el fondo de una pileta (colores propios)',
    dePaleta: false,
    oscuro: false,
  },
  grafito: {
    nombre: 'Grafito moteado',
    descripcion: 'Gris casi negro con motas, como piedra',
    dePaleta: false,
    oscuro: true,
  },
  paisaje: {
    nombre: 'Paisaje de un tono',
    descripcion: 'Montañas en capas, todas del color de acento',
    dePaleta: true,
    oscuro: false,
  },
  plano: {
    nombre: 'Plano técnico',
    descripcion: 'Grilla blanca sobre azul, como un plano (colores propios)',
    dePaleta: false,
    oscuro: true,
  },
  semitono: {
    nombre: 'Semitono',
    descripcion: 'Puntos de imprenta que se desvanecen',
    dePaleta: true,
    oscuro: false,
  },
  grano: {
    nombre: 'Degradado con grano',
    descripcion: 'Degradé de colores con textura de película',
    dePaleta: true,
    oscuro: true,
  },
  pasto: {
    nombre: 'Pasto',
    descripcion: 'Césped visto desde arriba, con florcitas (colores propios)',
    dePaleta: false,
    oscuro: true,
  },
  tramado: {
    nombre: 'Tramado',
    descripcion: 'Tramas de puntos como una imagen de computadora vieja',
    dePaleta: true,
    oscuro: true,
  },
  papel: {
    nombre: 'Papel',
    descripcion: 'Papel viejo con fibras y manchitas',
    dePaleta: false,
    oscuro: false,
  },
  curvas_nivel: {
    nombre: 'Curvas de nivel',
    descripcion: 'Líneas de mapa topográfico sobre el acento',
    dePaleta: true,
    oscuro: true,
  },
  cielo: {
    nombre: 'Cielo con nubes',
    descripcion: 'Cielo celeste con nubes blancas (colores propios)',
    dePaleta: false,
    oscuro: false,
  },
  pixeles: {
    nombre: 'Mosaico de píxeles',
    descripcion: 'Cuadrados grandes de distintos tonos del acento',
    dePaleta: true,
    oscuro: false,
  },
  lente: {
    nombre: 'Lente distorsionada',
    descripcion: 'Anillos y bordes de color, como mirar por una lupa',
    dePaleta: true,
    oscuro: true,
  },
  punteado: {
    nombre: 'Degradado punteado',
    descripcion: 'Puntitos que se van juntando, como dibujado a mano',
    dePaleta: true,
    oscuro: false,
  },
  grilla_cuadrados: {
    nombre: 'Grilla de cuadraditos',
    descripcion: 'Cuadraditos que se oscurecen hacia abajo',
    dePaleta: true,
    oscuro: false,
  },
  desenfocado: {
    nombre: 'Foto desenfocada',
    descripcion: 'Manchas suaves, como una foto fuera de foco',
    dePaleta: true,
    oscuro: false,
  },
  iridiscente: {
    nombre: 'Forma iridiscente',
    descripcion: 'Un aro tornasolado sobre gris claro',
    dePaleta: false,
    oscuro: false,
  },
  impresionista: {
    nombre: 'Impresionista',
    descripcion: 'Pinceladas de agua y nenúfares, como un cuadro (colores propios)',
    dePaleta: false,
    oscuro: false,
  },
};

/** El selector que pintan los fondos dentro de la página: los visuales y las áreas de fondo. */
export const SELECTOR_FONDO = (id: FondoId) => `.pg.pg.fondo-${id} :is(.pg-media, .pg-fondo-area)`;
