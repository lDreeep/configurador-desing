// Secciones de la página (PLAN.md tarea D12; la idea «catálogo de secciones» de DESIGN.md §10).
// Es DATOS: qué secciones puede llevar una landing, un sitio o un portfolio debajo de su portada,
// con dos diseños cada una y la estructura que se exporta en §22.
//
// Reglas:
// - La persona elige cuáles van y en qué orden: el orden es el orden en que las fue eligiendo.
// - Va un diseño por sección. Elegir el otro diseño de una sección ya puesta lo cambia sin moverla
//   de lugar; elegir el mismo la saca (`combinarSecciones`).
// - Cuando hay secciones elegidas, reemplazan al argumento genérico del layout (`layout_argumento`).
// - Quien las dibuja es `src/rapido/secciones.tsx`, solo con los tokens de `sistema.ts`.

import type { TipoProyecto } from './tipos';

export type SeccionId = 'beneficios' | 'pasos' | 'precios' | 'testimonios' | 'preguntas' | 'equipo' | 'numeros' | 'contacto';

export type SeccionDisenoId =
  | 'beneficios_renglones'
  | 'beneficios_destacado'
  | 'pasos_fila'
  | 'pasos_escalera'
  | 'precios_planes'
  | 'precios_tabla'
  | 'testimonios_cita'
  | 'testimonios_tres'
  | 'preguntas_acordeon'
  | 'preguntas_abiertas'
  | 'equipo_retratos'
  | 'equipo_lista'
  | 'numeros_fila'
  | 'numeros_protagonista'
  | 'contacto_formulario'
  | 'contacto_datos';

export interface Seccion {
  nombre: string;
  /** Qué resuelve la sección: para qué la querría alguien en su página. */
  descripcion: string;
}

export interface DisenoSeccion {
  seccion: SeccionId;
  /** Nombre del diseño, sin el de la sección («En renglones»). */
  nombre: string;
  descripcion: string;
  /** Cómo se arma, para el export (§22) y para quien construya la página. Dice qué pasa en celular. */
  estructura: string;
}

export const SECCIONES: Record<SeccionId, Seccion> = {
  beneficios: { nombre: 'Beneficios', descripcion: 'Qué se lleva la persona, punto por punto.' },
  pasos: { nombre: 'Cómo funciona', descripcion: 'Los pasos desde que escriben hasta que lo tienen.' },
  precios: { nombre: 'Precios', descripcion: 'Los planes o paquetes, con lo que incluye cada uno.' },
  testimonios: { nombre: 'Testimonios', descripcion: 'Lo que dicen quienes ya lo usaron.' },
  preguntas: { nombre: 'Preguntas frecuentes', descripcion: 'Las dudas de siempre, respondidas.' },
  equipo: { nombre: 'Equipo', descripcion: 'Quiénes están detrás.' },
  numeros: { nombre: 'Números', descripcion: 'Dos o tres cifras que respaldan lo que se promete.' },
  contacto: { nombre: 'Contacto', descripcion: 'Cómo escribir, llamar o llegar.' },
};

export const DISENOS_SECCION: Record<SeccionDisenoId, DisenoSeccion> = {
  beneficios_renglones: {
    seccion: 'beneficios',
    nombre: 'En renglones',
    descripcion: 'Una lista a todo el ancho: el beneficio a la izquierda, en letra de título, y su explicación a la derecha.',
    estructura:
      'Título de la sección arriba a la izquierda. Debajo, una lista (`<ul>`) de renglones a todo el ancho separados por una línea fina del color de borde: cada renglón es una grilla de 2 columnas (1fr y 1,4fr) con el beneficio en la fuente de títulos (24 a 36 px) a la izquierda y su explicación en texto secundario a la derecha, alineados arriba. Sin tarjetas, sin iconos y sin numerar. En celular, una columna: la explicación baja debajo del beneficio.',
  },
  beneficios_destacado: {
    seccion: 'beneficios',
    nombre: 'Uno adelante',
    descripcion: 'El beneficio principal ocupa un bloque grande del color de acento suave; los demás van al costado, chicos.',
    estructura:
      'Grilla de 2 columnas (1,2fr y 1fr). A la izquierda, un bloque con fondo del color de acento suave, radio grande y mucho espacio interno: arriba el título de la sección en texto chico y abajo, pegado al borde inferior, el primer beneficio en la fuente de títulos (32 a 56 px) con su explicación. A la derecha, los demás beneficios apilados como tarjetas del sistema (`.pg-card`), cada una con título y una línea de texto. El bloque grande mide el alto de la columna derecha. En celular, una columna: primero el bloque grande.',
  },
  pasos_fila: {
    seccion: 'pasos',
    nombre: 'En fila',
    descripcion: 'Los pasos de izquierda a derecha, unidos por una línea con el número de cada uno.',
    estructura:
      'Título de la sección y, debajo, una lista ordenada (`<ol>`) en columnas iguales. Una línea fina horizontal cruza toda la fila a la altura de los números; cada paso tiene su número en un círculo de 44 px con el fondo de la página y borde del color de acento, apoyado sobre la línea, y debajo el nombre del paso (fuente de títulos) y una línea de texto. Los números se justifican porque el contenido es una secuencia. En celular, una columna: la línea pasa a ser vertical, a la izquierda, y los pasos quedan uno debajo del otro.',
  },
  pasos_escalera: {
    seccion: 'pasos',
    nombre: 'Escalera',
    descripcion: 'Cada paso arranca más a la derecha que el anterior, con el número enorme al costado.',
    estructura:
      'Título de la sección a la izquierda. Lista ordenada (`<ol>`) vertical donde cada paso se corre a la derecha respecto del anterior (margen izquierdo de 0, 12% y 24% del ancho), como escalones. Cada paso es una fila: el número en la fuente de títulos, muy grande (56 a 104 px) y del color de acento (`--color-acento-texto`), y a su derecha el nombre del paso y su texto, con una línea fina arriba. En celular, sin corrimiento: todos alineados a la izquierda y el número baja a 48 px.',
  },
  precios_planes: {
    seccion: 'precios',
    nombre: 'Tres planes',
    descripcion: 'Tres columnas, una por plan; el más elegido va marcado y es el único con el botón principal.',
    estructura:
      'Título y una línea de aclaración. Debajo, 3 tarjetas del sistema (`.pg-card`) del mismo alto en columnas iguales: nombre del plan, para quién es, precio grande en la fuente de títulos con el período al lado en texto chico, lista de lo que incluye (`<ul>` con una marca de tilde decorativa por ítem) y el botón al pie de la tarjeta. El plan más elegido lleva borde de 2 px del color de acento, una etiqueta «El más elegido» arriba y el botón principal; los otros dos, el botón secundario. En celular, una columna, con el plan más elegido primero.',
  },
  precios_tabla: {
    seccion: 'precios',
    nombre: 'Tabla comparativa',
    descripcion: 'Una tabla: los planes en columnas y cada característica en un renglón, para comparar de un vistazo.',
    estructura:
      'Título y una línea de aclaración. Debajo, una tabla real (`<table>` con `<caption>` oculta a la vista, `<th scope="col">` para cada plan y `<th scope="row">` para cada característica). El encabezado de cada plan tiene el nombre y el precio en la fuente de títulos. Las celdas dicen «Sí», «No» o el valor (por ejemplo «2 rondas»); nunca solo un icono. La columna del plan más elegido tiene fondo del color de acento suave de arriba a abajo. Renglones separados por una línea fina; sin rayado. La tabla no lleva botones: se pide con el botón principal de la página. En celular, la tabla queda dentro de una región con scroll horizontal (`role="region"`, `aria-label`, `tabindex="0"`) y la primera columna queda fija.',
  },
  testimonios_cita: {
    seccion: 'testimonios',
    nombre: 'Una cita grande',
    descripcion: 'Un solo testimonio, en letra de título y a todo el ancho, con quien lo dijo debajo.',
    estructura:
      'Un `<figure>` a todo el ancho, alineado a la izquierda, sin tarjeta: la cita (`<blockquote>`) en la fuente de títulos (28 a 56 px, renglones de hasta 32 caracteres de ancho, interlineado 1,15) y debajo el `<figcaption>` con un círculo de 44 px con las iniciales (fondo de acento), el nombre en negrita y el rol en texto secundario. A la izquierda de la cita, una barra vertical de 4 px del color de acento del alto de la cita. En celular, igual, con la cita en 26 px.',
  },
  testimonios_tres: {
    seccion: 'testimonios',
    nombre: 'Tres voces',
    descripcion: 'Tres testimonios cortos lado a lado, separados por líneas, sin tarjetas.',
    estructura:
      'Título de la sección y, debajo, 3 columnas iguales separadas por una línea fina vertical. Cada columna es un `<figure>`: la cita (`<blockquote>`, 18 a 20 px, texto principal) arriba y, pegado abajo, el nombre en negrita con el rol en texto secundario. Las tres terminan a la misma altura. Sin tarjetas, sin comillas gigantes y sin estrellas. En celular, una columna: las líneas pasan a ser horizontales.',
  },
  preguntas_acordeon: {
    seccion: 'preguntas',
    nombre: 'Se abren al tocar',
    descripcion: 'El título a la izquierda y las preguntas a la derecha; cada una se abre para ver su respuesta.',
    estructura:
      'Grilla de 2 columnas (1fr y 2fr): a la izquierda el título de la sección, que queda fijo mientras se recorren las preguntas (`position: sticky`); a la derecha, una pregunta por renglón con `<details>` y `<summary>` (área táctil de 44 px, foco visible), separadas por una línea fina, con un signo «+» a la derecha que gira a «×» al abrir. La respuesta aparece debajo en texto secundario, con un máximo de 60 caracteres por renglón. En celular, una columna: el título arriba, sin quedar fijo.',
  },
  preguntas_abiertas: {
    seccion: 'preguntas',
    nombre: 'Todas a la vista',
    descripcion: 'Preguntas y respuestas ya abiertas, en dos columnas: se leen sin tocar nada.',
    estructura:
      'Título de la sección arriba. Debajo, una lista de definiciones (`<dl>`) en 2 columnas con bastante espacio entre sí: cada pregunta (`<dt>`) en la fuente de títulos (20 a 24 px) y su respuesta (`<dd>`) debajo en texto secundario. Cada par tiene una línea fina arriba. Nada se abre ni se cierra. En celular, una columna.',
  },
  equipo_retratos: {
    seccion: 'equipo',
    nombre: 'Retratos',
    descripcion: 'Una grilla de retratos con el nombre y el rol de cada persona debajo.',
    estructura:
      'Título de la sección y una línea de presentación. Debajo, grilla de 4 columnas: cada persona es un `<figure>` con su retrato arriba (proporción 4:5, radio medio, `object-fit: cover`; mientras no haya foto, un bloque del color de acento suave con las iniciales grandes en la fuente de títulos) y debajo el nombre en negrita y el rol en texto secundario. Sin redes sociales ni biografías. En celular, 2 columnas.',
  },
  equipo_lista: {
    seccion: 'equipo',
    nombre: 'Lista de nombres',
    descripcion: 'Sin fotos: cada nombre en letra grande, con su rol al costado, como los créditos de una película.',
    estructura:
      'Título de la sección a la izquierda. Debajo, una lista (`<ul>`) de renglones a todo el ancho separados por una línea fina: el nombre en la fuente de títulos (26 a 44 px) a la izquierda y el rol en texto secundario alineado a la derecha, sobre la misma línea de base. Sin fotos ni avatares. En celular, el rol baja debajo del nombre, alineado a la izquierda.',
  },
  numeros_fila: {
    seccion: 'numeros',
    nombre: 'En fila',
    descripcion: 'Tres cifras del mismo tamaño, una al lado de la otra, cada una con su explicación.',
    estructura:
      'Una lista de definiciones (`<dl>`) en 3 columnas iguales separadas por una línea fina vertical, con una línea fina arriba y otra abajo de toda la fila. En cada columna, la cifra en la fuente de títulos (40 a 72 px, números tabulares) y debajo una oración corta que dice qué mide, en texto secundario. En el HTML la explicación es el `<dt>` y la cifra el `<dd>`, aunque la cifra se vea primero. Las cifras no cuentan solas ni se animan. En celular, una columna, con las líneas horizontales.',
  },
  numeros_protagonista: {
    seccion: 'numeros',
    nombre: 'Una cifra protagonista',
    descripcion: 'Una cifra gigante con su frase ocupa la mitad; las otras dos acompañan, chicas, al costado.',
    estructura:
      'Grilla de 2 columnas (1,5fr y 1fr), alineadas abajo. A la izquierda, la cifra principal en la fuente de títulos, enorme (72 a 168 px, interlineado 0,9) y del color de acento (`--color-acento-texto`), con su oración debajo en texto de 18 a 22 px. A la derecha, las otras dos cifras apiladas (28 a 40 px), cada una con su oración y una línea fina arriba. En celular, una columna: primero la cifra principal.',
  },
  contacto_formulario: {
    seccion: 'contacto',
    nombre: 'Con formulario',
    descripcion: 'A la izquierda, a quién le escriben y cuándo responde; a la derecha, un formulario corto.',
    estructura:
      'Grilla de 2 columnas iguales. A la izquierda: título de la sección, una línea que dice en cuánto tiempo se responde y, debajo, la dirección, el horario, el teléfono y el mail como texto (teléfono y mail son links `tel:` y `mailto:`). A la derecha, dentro de una tarjeta del sistema (`.pg-card`), un `<form>` con 3 campos, cada uno con su `<label>` visible arriba: nombre, mail (`type="email"`) y mensaje (`<textarea>` de 4 renglones), y el botón principal a todo el ancho. Campos de 44 px de alto como mínimo, con borde del color de borde y foco visible del color de acento. Al enviar, la confirmación aparece debajo del botón en un `role="status"`. En celular, una columna: primero el texto, después el formulario.',
  },
  contacto_datos: {
    seccion: 'contacto',
    nombre: 'Datos a la vista',
    descripcion: 'Sin formulario: el mail en letra enorme para tocar y, debajo, dirección, horario y teléfono.',
    estructura:
      'Título de la sección en texto chico y, debajo, el mail como un link `mailto:` en la fuente de títulos, muy grande (28 a 72 px, se corta por palabra si no entra), subrayado con una línea de 2 px del color de acento. Debajo, 3 columnas con una línea fina arriba: dirección (`<address>`), horario y teléfono (link `tel:`), cada una con su nombre en texto secundario y el dato en texto principal. Los links tienen área táctil de 44 px y foco visible. En celular, una columna.',
  },
};

export const LISTA_SECCIONES = Object.keys(SECCIONES) as SeccionId[];
export const LISTA_DISENOS_SECCION = Object.keys(DISENOS_SECCION) as SeccionDisenoId[];

/** Tipos de proyecto que arman su página con secciones (PLAN.md §7.9). */
export const TIPOS_CON_SECCIONES = ['landing', 'sitio', 'portfolio'] as const satisfies readonly TipoProyecto[];
export type TipoConSecciones = (typeof TIPOS_CON_SECCIONES)[number];
export const llevaSecciones = (tipo: TipoProyecto): tipo is TipoConSecciones => (TIPOS_CON_SECCIONES as readonly string[]).includes(tipo);

/**
 * Las que se ofrecen primero a cada tipo, en un orden que ya funciona como página
 * (de la promesa a la prueba y de la prueba al contacto).
 */
export const SECCIONES_RECOMENDADAS: Record<TipoConSecciones, SeccionDisenoId[]> = {
  landing: ['beneficios_renglones', 'pasos_fila', 'testimonios_cita', 'precios_planes', 'preguntas_acordeon', 'contacto_formulario'],
  sitio: ['numeros_fila', 'beneficios_destacado', 'equipo_retratos', 'testimonios_tres', 'preguntas_abiertas', 'contacto_datos'],
  portfolio: ['pasos_escalera', 'testimonios_cita', 'precios_tabla', 'numeros_protagonista', 'equipo_lista', 'contacto_datos'],
};

export const esDisenoSeccion = (id: unknown): id is SeccionDisenoId => typeof id === 'string' && id in DISENOS_SECCION;
export const seccionDe = (id: SeccionDisenoId): SeccionId => DISENOS_SECCION[id].seccion;
/** «Precios: tres planes», para fichas y para el export. */
export const nombreDeDiseno = (id: SeccionDisenoId) => `${SECCIONES[seccionDe(id)].nombre}: ${DISENOS_SECCION[id].nombre.toLowerCase()}`;

/** Deja una lista guardada en una lista válida: ids que existen y una sola vez cada sección (gana la última, en el lugar de la primera). */
export function limpiarSecciones(ids: readonly unknown[] | undefined): SeccionDisenoId[] {
  const salida: SeccionDisenoId[] = [];
  for (const id of ids ?? []) {
    if (!esDisenoSeccion(id)) continue;
    const i = salida.findIndex((x) => seccionDe(x) === seccionDe(id));
    if (i >= 0) salida[i] = id;
    else salida.push(id);
  }
  return salida;
}

/**
 * Elegir un diseño: si ya estaba, la sección sale; si la sección estaba con el otro diseño, cambia
 * de diseño sin moverse; si no estaba, entra al final. El orden de la lista es el de la página.
 */
export function combinarSecciones(actual: readonly SeccionDisenoId[], id: SeccionDisenoId): SeccionDisenoId[] {
  const limpio = limpiarSecciones(actual);
  if (limpio.includes(id)) return limpio.filter((x) => x !== id);
  return limpiarSecciones([...limpio, id]);
}
