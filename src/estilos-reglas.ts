// Las palabras clave y las reglas de cada estilo visual: lo que la IA tiene que respetar para que
// el estilo se sostenga (sus datos están en estilos-visuales.ts). Solo las usa el export (§19),
// así que no van en la carga inicial.

import type { ESTILOS } from './estilos-visuales';

export interface ReglasEstilo {
  palabrasClave: string[];
  /** Reglas que la IA tiene que respetar para que el estilo se sostenga. */
  reglas: string[];
}

export const REGLAS_ESTILOS: Record<keyof typeof ESTILOS, ReglasEstilo> = {
  suizo: {
    palabrasClave: ['racional', 'preciso', 'tipográfico'],
    reglas: [
      'Todo alineado a la izquierda sobre una grilla visible de 12 columnas',
      'Títulos enormes, muy apretados, en peso fuerte',
      'Sin sombras ni esquinas redondeadas',
      'El rojo se usa poco y en bloques sólidos',
    ],
  },
  bauhaus: {
    palabrasClave: ['geométrico', 'constructivo', 'primario'],
    reglas: [
      'Formas geométricas puras (círculo, cuadrado, triángulo) como decoración',
      'Solo colores primarios más negro y crema',
      'Bordes negros gruesos, sin sombras difusas',
      'Tipografía geométrica',
    ],
  },
  memphis: {
    palabrasClave: ['pop', 'divertido', 'ochentoso'],
    reglas: [
      'Patrones de lunares y zigzag como fondo de bloques',
      'Contornos negros y sombras sólidas desplazadas',
      'Mezcla de 3 colores pop con fondo claro',
      'Los elementos pueden estar levemente rotados',
    ],
  },
  neobrutalismo: {
    palabrasClave: ['directo', 'crudo', 'atrevido'],
    reglas: [
      'Todo tiene borde negro de 2–3px',
      'Sombras sólidas desplazadas, nunca difusas',
      'Colores planos y saturados, sin degradados',
      'Al pasar el mouse, los elementos se "despegan" corriéndose en diagonal',
    ],
  },
  vidrio: {
    palabrasClave: ['etéreo', 'moderno', 'luminoso'],
    reglas: [
      'Fondo oscuro con 2 o 3 manchas de color muy desenfocadas',
      'Cards translúcidas con desenfoque de fondo (backdrop-filter) y borde fino claro',
      'Texto siempre claro y con buen contraste sobre el vidrio',
      'Sombras suaves, esquinas redondeadas',
    ],
  },
  clay: {
    palabrasClave: ['blando', 'amigable', 'táctil'],
    reglas: [
      'Esquinas muy redondeadas en todo',
      'Volumen con sombra interna clara arriba y oscura abajo, más sombra externa suave',
      'Colores pastel, sin bordes',
      'Animaciones con rebote',
    ],
  },
  retro_os: {
    palabrasClave: ['nostálgico', 'pixelado', 'ventanas'],
    reglas: [
      'Paneles como ventanas: barra de título de color y bordes biselados (claro arriba-izquierda, oscuro abajo-derecha)',
      'Botones biselados que se "hunden" al presionar',
      'Sin esquinas redondeadas ni sombras difusas',
      'Títulos en fuente pixelada; texto en una sans legible',
    ],
  },
  terminal: {
    palabrasClave: ['hacker', 'técnico', 'retro'],
    reglas: [
      'Todo en fuente monoespaciada',
      'Un solo color de texto brillante sobre negro, con un leve resplandor',
      'Líneas de escaneo horizontales muy sutiles sobre la pantalla',
      'Los títulos llevan un prompt "> " y un cursor que parpadea',
    ],
  },
  editorial: {
    palabrasClave: ['culto', 'pausado', 'impreso'],
    reglas: [
      'Filetes (líneas finas) separan las secciones en lugar de cards con fondo',
      'Títulos serif grandes; bajada en cursiva',
      'Letra capital en el primer párrafo',
      'Mucho aire y columnas de texto angostas',
    ],
  },
  art_deco: {
    palabrasClave: ['elegante', 'simétrico', 'glamoroso'],
    reglas: [
      'Composición simétrica y centrada',
      'Marcos dorados de línea doble',
      'Títulos en mayúsculas con mucho espaciado entre letras',
      'Abanicos y rayos como decoración, muy sutiles',
    ],
  },
  y2k: {
    palabrasClave: ['futurista', 'brillante', 'dosmilero'],
    reglas: [
      'Brillos metálicos tipo cromo en los botones',
      'Destellos (estrellas de 4 puntas) como decoración',
      'Formas de píldora y burbuja',
      'Títulos con degradado entre el texto y el acento (siempre legible)',
    ],
  },
  organico: {
    palabrasClave: ['natural', 'cálido', 'artesanal'],
    reglas: [
      'Formas irregulares tipo gota en lugar de rectángulos',
      'Textura de grano muy sutil sobre el fondo',
      'Tonos tierra y verdes apagados',
      'Serif suave en títulos',
    ],
  },
  minimal_tecnico: {
    palabrasClave: ['preciso', 'limpio', 'producto digital'],
    reglas: [
      'Bordes de 1px en lugar de sombras; las sombras, si hay, casi invisibles',
      'Mucho espacio en blanco y una sola columna de lectura en el hero',
      'Etiquetas y números en monoespaciada, chicas y en mayúsculas',
      'Un solo acento, usado en el botón principal y en detalles mínimos',
    ],
  },
  oscuro_precision: {
    palabrasClave: ['nocturno', 'premium', 'herramienta'],
    reglas: [
      'Fondo casi negro; las superficies se separan con bordes de 1px más claros, no con sombras',
      'Un resplandor suave del acento detrás del hero, nunca detrás del texto largo',
      'Títulos sólidos, apretados y en peso medio; el brillo queda para bordes y botones',
      'Animaciones cortas y precisas; nada rebota',
    ],
  },
  producto_amable: {
    palabrasClave: ['cercano', 'simple', 'para todos'],
    reglas: [
      'Esquinas bien redondeadas en todo, botones en píldora',
      'Fondos de color muy suaves para separar secciones y cards',
      'Formas simples de colores como ilustración, nunca fotos de stock',
      'Textos cortos y cálidos; títulos grandes pero no apretados',
    ],
  },
  periodico: {
    palabrasClave: ['informativo', 'clásico', 'denso'],
    reglas: [
      'Titulares en serif grande y apretado; texto en columnas angostas',
      'Filetes (líneas finas) separan secciones en lugar de cajas',
      'Casi sin color: tinta sobre papel, el acento solo en una etiqueta o un link',
      'Fechas y secciones en mayúsculas chicas',
    ],
  },
  japones: {
    palabrasClave: ['sereno', 'esencial', 'natural'],
    reglas: [
      'El espacio vacío es protagonista: márgenes enormes y pocos elementos',
      'Composición asimétrica, nada perfectamente centrado',
      'Tonos naturales apagados y un solo acento tipo sello',
      'Líneas finísimas, sin sombras, animaciones lentas y suaves',
    ],
  },
  dopamina: {
    palabrasClave: ['alegre', 'vibrante', 'joven'],
    reglas: [
      'Varios colores saturados juntos, sin miedo',
      'Formas grandes y redondeadas, como stickers',
      'Títulos enormes y gruesos; botones en píldora',
      'Movimiento con rebote al tocar y al aparecer',
    ],
  },
  lujo: {
    palabrasClave: ['exclusivo', 'elegante', 'premium'],
    reglas: [
      'Fondo oscuro profundo; el dorado solo en detalles finos',
      'Serif fina y grande, mucho espacio entre letras en etiquetas',
      'Nada de sombras marcadas ni colores vivos',
      'Animaciones lentas, que aparecen con calma',
    ],
  },
  cyber: {
    palabrasClave: ['futurista', 'gamer', 'tecnológico'],
    reglas: [
      'Fondo negro con un solo neón fuerte; nada de pasteles',
      'Esquinas cortadas en diagonal en lugar de redondeadas',
      'Etiquetas en monoespaciada y mayúsculas',
      'Brillos y líneas de escaneo muy sutiles; nunca sobre el texto largo',
    ],
  },
};
