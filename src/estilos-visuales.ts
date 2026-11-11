// Estilos visuales (movimientos estéticos) y layouts de página.
// Cada estilo trae sus paletas, fuentes, forma, botones y movimiento compatibles (las "reglas"),
// más el CSS que le da su textura (en estilos-css.ts) y las reglas para la IA (en estilos-reglas.ts),
// que bajan aparte de la carga inicial.
// Ese CSS se usa en la vista previa Y se exporta tal cual (DESIGN.md §19).
//
// En el CSS, `&` es la raíz de la página. Las clases .pg-* son nombres de referencia:
//   .pg-nav  .pg-marca  .pg-hero  .pg-titulo  .pg-bajada  .pg-etiqueta  .pg-card  .pg-card-titulo
//   .pg-media  .pg-boton (primario)  .pg-boton-sec  .pg-deco (decoración, con hijos .a .b .c)
// Para sumar un estilo: agregalo acá, su CSS en estilos-css.ts y sus reglas en estilos-reglas.ts; los tests verifican que sus paletas y fuentes existan.

import type {
  BordesId,
  BotonEstiloId,
  DireccionId,
  ElevacionId,
  EstiloId,
  FuenteId,
  LayoutId,
  MovimientoId,
  PaletaId,
  RadioId,
} from './tipos';

export interface EstiloVisual {
  nombre: string;
  descripcion: string;
  paletas: PaletaId[];
  fuentes: [FuenteId, FuenteId][];
  pesoTitulos: number;
  radio: RadioId;
  elevacion: ElevacionId;
  bordes: BordesId;
  boton: BotonEstiloId;
  movimiento: MovimientoId;
  direccionBase: DireccionId;
}

export const ESTILOS: Record<EstiloId, EstiloVisual> = {
  suizo: {
    nombre: 'Suizo',
    descripcion: 'Grilla estricta, tipografía enorme, rojo y negro',
    paletas: ['suizo_rojo', 'grafito', 'alto_contraste', 'mono_rojo', 'mono_azul', 'contraste_azul'],
    fuentes: [['archivo', 'inter'], ['inter', 'inter'], ['bebas_neue', 'inter']],
    pesoTitulos: 800, radio: 'recto', elevacion: 'plana', bordes: 'sutil', boton: 'relleno', movimiento: 'rapido',
    direccionBase: 'audaz',
  },
  bauhaus: {
    nombre: 'Bauhaus',
    descripcion: 'Círculos, triángulos y colores primarios',
    paletas: ['bauhaus', 'alto_contraste'],
    fuentes: [['outfit', 'dm_sans'], ['sora', 'inter'], ['poiret_one', 'outfit']],
    pesoTitulos: 700, radio: 'recto', elevacion: 'plana', bordes: 'marcado', boton: 'relleno', movimiento: 'sutil',
    direccionBase: 'jugueton',
  },
  memphis: {
    nombre: 'Memphis',
    descripcion: 'Ochentoso: lunares, zigzags y colores pop',
    paletas: ['memphis', 'caramelo', 'neon_magenta', 'frutal_sandia'],
    fuentes: [['unbounded', 'nunito'], ['syne', 'dm_sans'], ['anton', 'nunito']],
    pesoTitulos: 700, radio: 'suave', elevacion: 'dura', bordes: 'marcado', boton: 'sombra_dura', movimiento: 'expresivo',
    direccionBase: 'jugueton',
  },
  neobrutalismo: {
    nombre: 'Neobrutalismo',
    descripcion: 'Bordes negros gruesos, sombras sólidas, colores planos',
    paletas: ['alto_contraste', 'caramelo', 'memphis'],
    fuentes: [['archivo', 'ibm_plex_sans'], ['space_grotesk', 'inter'], ['anton', 'work_sans']],
    pesoTitulos: 800, radio: 'apenas_suave', elevacion: 'dura', bordes: 'marcado', boton: 'sombra_dura', movimiento: 'rapido',
    direccionBase: 'brutalista',
  },
  vidrio: {
    nombre: 'Vidrio',
    descripcion: 'Paneles translúcidos sobre manchas de color',
    paletas: ['vidrio', 'oceano', 'marina_abismo', 'pastel_lila'],
    fuentes: [['outfit', 'plus_jakarta'], ['sora', 'inter'], ['manrope', 'manrope']],
    pesoTitulos: 600, radio: 'suave', elevacion: 'suave', bordes: 'sutil', boton: 'relleno', movimiento: 'sutil',
    direccionBase: 'audaz',
  },
  clay: {
    nombre: 'Clay',
    descripcion: 'Formas infladas y blanditas, como de plastilina',
    paletas: ['arcilla', 'lavanda', 'menta', 'pastel_rosa', 'pastel_celeste'],
    fuentes: [['nunito', 'nunito'], ['quicksand', 'nunito'], ['dm_sans', 'dm_sans']],
    pesoTitulos: 800, radio: 'pildora', elevacion: 'marcada', bordes: 'ninguno', boton: 'elevado', movimiento: 'expresivo',
    direccionBase: 'calido',
  },
  retro_os: {
    nombre: 'Sistema retro',
    descripcion: 'Ventanas con biseles, como una computadora de los 90',
    paletas: ['retro_gris'],
    fuentes: [['vt323', 'ibm_plex_sans'], ['space_mono', 'space_mono'], ['vt323', 'space_mono']],
    pesoTitulos: 400, radio: 'recto', elevacion: 'plana', bordes: 'ninguno', boton: 'relleno', movimiento: 'minimo',
    direccionBase: 'tecnico',
  },
  terminal: {
    nombre: 'Terminal',
    descripcion: 'Fósforo sobre negro, líneas de escaneo y cursor',
    paletas: ['fosforo_verde', 'fosforo_ambar', 'mono_verde', 'contraste_amarillo'],
    fuentes: [['jetbrains_mono', 'jetbrains_mono'], ['vt323', 'jetbrains_mono'], ['space_mono', 'jetbrains_mono']],
    pesoTitulos: 700, radio: 'recto', elevacion: 'plana', bordes: 'sutil', boton: 'contorno', movimiento: 'rapido',
    direccionBase: 'tecnico',
  },
  editorial: {
    nombre: 'Editorial',
    descripcion: 'Como una revista impresa: filetes, columnas y serif',
    paletas: ['papel', 'arena', 'grafito', 'tierra_ocre', 'tierra_cuero'],
    fuentes: [['instrument_serif', 'source_serif'], ['playfair', 'lora'], ['dm_serif', 'inter']],
    pesoTitulos: 400, radio: 'recto', elevacion: 'plana', bordes: 'ninguno', boton: 'contorno', movimiento: 'sutil',
    direccionBase: 'editorial',
  },
  art_deco: {
    nombre: 'Art déco',
    descripcion: 'Dorado sobre negro, simetría y líneas dobles',
    paletas: ['noche_dorada', 'tierra_barro', 'frutal_mandarina'],
    fuentes: [['poiret_one', 'inter'], ['playfair', 'lora'], ['dm_serif', 'source_serif']],
    pesoTitulos: 400, radio: 'recto', elevacion: 'plana', bordes: 'sutil', boton: 'contorno', movimiento: 'sutil',
    direccionBase: 'lujoso',
  },
  y2k: {
    nombre: 'Y2K',
    descripcion: 'Cromo, destellos y burbujas del 2000',
    paletas: ['cromo', 'lavanda'],
    fuentes: [['syne', 'manrope'], ['unbounded', 'dm_sans'], ['outfit', 'outfit']],
    pesoTitulos: 800, radio: 'pildora', elevacion: 'marcada', bordes: 'sutil', boton: 'elevado', movimiento: 'expresivo',
    direccionBase: 'jugueton',
  },
  organico: {
    nombre: 'Orgánico',
    descripcion: 'Formas de gota, grano y tonos tierra',
    paletas: ['arena', 'menta', 'coral_calido', 'terracota', 'oliva', 'tierra_musgo', 'marina_espuma'],
    fuentes: [['fraunces', 'dm_sans'], ['lora', 'nunito'], ['fraunces', 'work_sans']],
    pesoTitulos: 600, radio: 'pildora', elevacion: 'suave', bordes: 'ninguno', boton: 'relleno', movimiento: 'sutil',
    direccionBase: 'calido',
  },
  minimal_tecnico: {
    nombre: 'Minimal tecnológico',
    descripcion: 'Líneas finas, mucho aire y detalles de código',
    paletas: ['azul_electrico', 'grafito', 'alto_contraste', 'mono_azul', 'marina_costa', 'contraste_cian'],
    fuentes: [['inter', 'inter'], ['manrope', 'inter'], ['ibm_plex_sans', 'ibm_plex_sans']],
    pesoTitulos: 600, radio: 'apenas_suave', elevacion: 'plana', bordes: 'sutil', boton: 'relleno', movimiento: 'rapido',
    direccionBase: 'tecnico',
  },
  oscuro_precision: {
    nombre: 'Oscuro de precisión',
    descripcion: 'Fondo casi negro, bordes que brillan y degradés sutiles',
    paletas: ['oceano', 'tinta_y_lima', 'vidrio', 'medianoche_violeta', 'bosque_noche', 'marina_naval', 'neon_cian', 'mono_naranja', 'pastel_menta', 'frutal_arandano'],
    fuentes: [['inter', 'inter'], ['sora', 'inter'], ['space_grotesk', 'ibm_plex_sans']],
    pesoTitulos: 600, radio: 'suave', elevacion: 'plana', bordes: 'sutil', boton: 'relleno', movimiento: 'rapido',
    direccionBase: 'tecnico',
  },
  producto_amable: {
    nombre: 'Producto amable',
    descripcion: 'Redondeado, colores suaves y formas simples',
    paletas: ['lavanda', 'menta', 'coral_calido', 'durazno', 'uva', 'cielo', 'frutal_limon', 'neon_limon'],
    fuentes: [['plus_jakarta', 'plus_jakarta'], ['nunito', 'nunito'], ['outfit', 'dm_sans']],
    pesoTitulos: 700, radio: 'pildora', elevacion: 'suave', bordes: 'ninguno', boton: 'relleno', movimiento: 'sutil',
    direccionBase: 'jugueton',
  },
  periodico: {
    nombre: 'Diario',
    descripcion: 'Columnas, filetes finos y titulares de diario',
    paletas: ['papel', 'alto_contraste', 'retro_gris', 'contraste_magenta'],
    fuentes: [['playfair', 'source_serif'], ['libre_baskerville', 'lora'], ['dm_serif', 'source_serif']],
    pesoTitulos: 800, radio: 'recto', elevacion: 'plana', bordes: 'sutil', boton: 'contorno', movimiento: 'minimo',
    direccionBase: 'editorial',
  },
  japones: {
    nombre: 'Calma japonesa',
    descripcion: 'Mucho vacío, asimetría y tonos naturales',
    paletas: ['arena', 'papel', 'menta', 'oliva', 'pastel_rosa'],
    fuentes: [['cormorant', 'work_sans'], ['instrument_serif', 'dm_sans'], ['lora', 'work_sans']],
    pesoTitulos: 400, radio: 'apenas_suave', elevacion: 'plana', bordes: 'sutil', boton: 'contorno', movimiento: 'sutil',
    direccionBase: 'calmo',
  },
  dopamina: {
    nombre: 'Dopamina',
    descripcion: 'Colores saturados, formas grandes y mucha energía',
    paletas: ['caramelo', 'memphis', 'coral_calido', 'rosa_chicle', 'frutal_sandia', 'neon_magenta', 'neon_rosa'],
    fuentes: [['unbounded', 'dm_sans'], ['bricolage', 'nunito'], ['syne', 'outfit']],
    pesoTitulos: 800, radio: 'pildora', elevacion: 'suave', bordes: 'ninguno', boton: 'relleno', movimiento: 'expresivo',
    direccionBase: 'jugueton',
  },
  lujo: {
    nombre: 'Lujo sobrio',
    descripcion: 'Oscuro, dorado discreto y tipografía fina',
    paletas: ['noche_dorada', 'vino', 'grafito', 'arena'],
    fuentes: [['cormorant', 'manrope'], ['playfair', 'inter'], ['poiret_one', 'manrope']],
    pesoTitulos: 500, radio: 'recto', elevacion: 'plana', bordes: 'sutil', boton: 'contorno', movimiento: 'sutil',
    direccionBase: 'lujoso',
  },
  cyber: {
    nombre: 'Cyber',
    descripcion: 'Neón sobre negro, cortes en diagonal y líneas de escaneo',
    paletas: ['tinta_y_lima', 'fosforo_verde', 'vidrio', 'carbon_coral', 'neon_rosa', 'contraste_amarillo'],
    fuentes: [['space_grotesk', 'jetbrains_mono'], ['unbounded', 'ibm_plex_sans'], ['silkscreen', 'jetbrains_mono']],
    pesoTitulos: 700, radio: 'recto', elevacion: 'plana', bordes: 'marcado', boton: 'relleno', movimiento: 'rapido',
    direccionBase: 'tecnico',
  },
};

export interface Layout {
  nombre: string;
  descripcion: string;
}

/** Cómo se arma cada layout, para la IA, vive en `export/estructuras-layout.ts` (solo lo usa el export). */
export const LAYOUTS: Record<LayoutId, Layout> = {
  hero_partido: { nombre: 'Hero partido', descripcion: 'Texto a un lado, visual grande al otro' },
  bento: { nombre: 'Bento', descripcion: 'Grilla de bloques de distintos tamaños' },
  revista: { nombre: 'Revista', descripcion: 'Columnas asimétricas, número grande y cita' },
  tipografico: { nombre: 'Afiche tipográfico', descripcion: 'El título ocupa toda la pantalla' },
  cinta: { nombre: 'Cinta en movimiento', descripcion: 'Una franja de texto que corre sin parar' },
  apiladas: { nombre: 'Tarjetas apiladas', descripcion: 'Tarjetas superpuestas y giradas' },
  indice: { nombre: 'Índice', descripcion: 'Lista numerada tipo tabla de contenidos' },
  panel_fijo: { nombre: 'Panel fijo', descripcion: 'Un panel de color fijo y el contenido al lado' },
  mosaico: { nombre: 'Mosaico', descripcion: 'Muchas piezas visuales de alturas distintas' },
  minimo: { nombre: 'Mínimo centrado', descripcion: 'Casi nada en pantalla, mucho aire' },
  app_lateral: { nombre: 'App con menú lateral', descripcion: 'Menú a la izquierda e indicadores' },
  horizontal: { nombre: 'Paneles horizontales', descripcion: 'Bloques que se recorren de costado' },
  galeria: { nombre: 'Galería de productos', descripcion: 'Grilla de productos con foto, nombre y precio' },
  precios: { nombre: 'Planes y precios', descripcion: 'Tres planes lado a lado, el del medio destacado' },
  portada_video: { nombre: 'Portada con video', descripcion: 'Un video o foto a pantalla completa con el título encima' },
  blog_lateral: { nombre: 'Blog con barra lateral', descripcion: 'Lista de artículos y una columna al costado' },
  equipo: { nombre: 'Equipo y testimonios', descripcion: 'Las personas detrás y lo que dicen los clientes' },
  fondo_protagonista: { nombre: 'Fondo protagonista', descripcion: 'Un fondo con textura a todo el ancho, título encima y una tarjeta flotante' },
  tarjeta_sobre_fondo: { nombre: 'Tarjeta sobre fondo', descripcion: 'Una tarjeta clara centrada sobre un fondo con textura' },
  editorial_fondo: { nombre: 'Editorial con fondo', descripcion: 'Texto en una columna clara y el fondo como una lámina al costado' },
  widgets_fondo: { nombre: 'Widgets sobre fondo', descripcion: 'Tarjetas de datos flotando sobre un fondo, como una app' },
  autor_panaderia: { nombre: 'De autor: panadería', descripcion: 'Foto del horno a sangre, la carta con precios y el horario enorme' },
  autor_finanzas: { nombre: 'De autor: app financiera', descripcion: 'El celular con la app real como protagonista sobre vidrio acanalado' },
  autor_portfolio: { nombre: 'De autor: portfolio de estudio', descripcion: 'Un índice de proyectos en tipografía grande y fotos en grilla asimétrica' },
  autor_festival: { nombre: 'De autor: festival', descripcion: 'El nombre gigante sobre manchas de calor y la grilla de artistas' },
  autor_correr: { nombre: 'De autor: app para correr', descripcion: 'Un mapa con la ruta sobre curvas de nivel y los datos encima' },
  autor_cafeteria: { nombre: 'De autor: cafetería', descripcion: 'Foto del espresso, la pizarra de precios y el origen del mes' },
  autor_floreria: { nombre: 'De autor: florería', descripcion: 'Collage de fotos superpuestas y un selector de plan que cambia el precio' },
  autor_refugio: { nombre: 'De autor: refugio de montaña', descripcion: 'El paisaje a sangre con la barra de reserva y las habitaciones por su vista' },
  autor_concesionario: { nombre: 'De autor: motos y UTV', descripcion: 'Vehículo protagonista, selector de categorías y ficha técnica desplegable' },
  autor_turnos: { nombre: 'De autor: turnos online', descripcion: 'La agenda real en una demo animada: se toma un turno y sale el recordatorio' },
  autor_curso: { nombre: 'De autor: curso online', descripcion: 'El reproductor con la clase avanzando y un antes y después que se desliza' },
  autor_restaurante: { nombre: 'De autor: restaurante', descripcion: 'Un celular reservando mesa en tres toques y la carta como lista con precios' },
  autor_gimnasio: { nombre: 'De autor: estudio de entrenamiento', descripcion: 'La grilla de clases con cupos: se reserva la de las 19 y se llena' },
  linea_tiempo: { nombre: 'Línea de tiempo', descripcion: 'Una línea que baja por la página y termina en el botón' },
  antes_despues: { nombre: 'Antes y después', descripcion: 'Dos versiones superpuestas y una barra que se arrastra para compararlas' },
  mapa_lista: { nombre: 'Mapa con lista', descripcion: 'La lista de lugares a un lado y el mapa con sus marcas al otro' },
  carta: { nombre: 'Carta de restaurante', descripcion: 'Una hoja impresa con nombres, precios y un talón para reservar' },
  agenda_semanal: { nombre: 'Agenda semanal', descripcion: 'La semana en columnas, los turnos como bloques y la hora de ahora marcada' },
  tablero: { nombre: 'Tablero de columnas', descripcion: 'Tarjetas que pasan de una columna a otra, con una a medio mover' },
  muro: { nombre: 'Muro de publicaciones', descripcion: 'Publicaciones de la gente en columnas, con una caja para escribir arriba' },
  documentacion: { nombre: 'Documentación con índice', descripcion: 'Menú de temas, la nota al medio y el índice de la página al costado' },
  link_bio: { nombre: 'Link en bio', descripcion: 'Quién sos y una pila de links grandes para tocar con el pulgar' },
  compra_unica: { nombre: 'Compra en una sola página', descripcion: 'Datos, entrega y pago en una columna, con el pedido siempre a la vista' },
  portada_buscador: { nombre: 'Portada con buscador', descripcion: 'El buscador es el protagonista y los resultados cuelgan de él' },
  partida_scroll: { nombre: 'Pantalla partida', descripcion: 'Dos mitades que se recorren por separado: el texto de un lado, las imágenes del otro' },
};

/** Layouts que son una pantalla de app o una página de un solo fin: no llevan el argumento de landing. */
const SIN_ARGUMENTO: LayoutId[] = ['app_lateral', 'mapa_lista', 'agenda_semanal', 'tablero', 'documentacion', 'link_bio', 'compra_unica'];
/** Si el layout lleva, después de su composición, la frase, el testimonio y las preguntas (§19 `layout_argumento`). */
export const llevaArgumento = (l: LayoutId) => !l.startsWith('autor_') && !SIN_ARGUMENTO.includes(l);

/** La combinación con la que se diseñó cada plantilla de autor; sobre ella la persona cambia lo que quiera. */
export const RECETAS_AUTOR: Partial<Record<LayoutId, { estilo: EstiloId; paleta: PaletaId; titulos: FuenteId; texto: FuenteId; fondo: 'ninguno' }>> = {
  autor_panaderia: { estilo: 'organico', paleta: 'arena', titulos: 'fraunces', texto: 'work_sans', fondo: 'ninguno' },
  autor_finanzas: { estilo: 'oscuro_precision', paleta: 'tinta_y_lima', titulos: 'sora', texto: 'inter', fondo: 'ninguno' },
  autor_portfolio: { estilo: 'editorial', paleta: 'papel', titulos: 'instrument_serif', texto: 'inter', fondo: 'ninguno' },
  autor_festival: { estilo: 'oscuro_precision', paleta: 'medianoche_violeta', titulos: 'unbounded', texto: 'inter', fondo: 'ninguno' },
  autor_correr: { estilo: 'minimal_tecnico', paleta: 'azul_electrico', titulos: 'space_grotesk', texto: 'inter', fondo: 'ninguno' },
  autor_cafeteria: { estilo: 'editorial', paleta: 'arena', titulos: 'dm_serif', texto: 'work_sans', fondo: 'ninguno' },
  autor_floreria: { estilo: 'japones', paleta: 'menta', titulos: 'cormorant', texto: 'work_sans', fondo: 'ninguno' },
  autor_concesionario: { estilo: 'minimal_tecnico', paleta: 'azul_electrico', titulos: 'archivo', texto: 'work_sans', fondo: 'ninguno' },
  autor_refugio: { estilo: 'lujo', paleta: 'noche_dorada', titulos: 'cormorant', texto: 'manrope', fondo: 'ninguno' },
  autor_turnos: { estilo: 'producto_amable', paleta: 'bosque', titulos: 'manrope', texto: 'manrope', fondo: 'ninguno' },
  autor_curso: { estilo: 'editorial', paleta: 'coral_calido', titulos: 'bricolage', texto: 'dm_sans', fondo: 'ninguno' },
  autor_restaurante: { estilo: 'lujo', paleta: 'vino', titulos: 'playfair', texto: 'manrope', fondo: 'ninguno' },
  autor_gimnasio: { estilo: 'neobrutalismo', paleta: 'durazno', titulos: 'anton', texto: 'work_sans', fondo: 'ninguno' },
};
export const esAutor = (l: LayoutId) => l.startsWith('autor_');

/** La marca de ejemplo de cada plantilla de autor (se usa si la persona no escribió el nombre de su proyecto). */
export const MARCAS_AUTOR: Partial<Record<LayoutId, string>> = {
  autor_panaderia: 'Horno Thames', autor_finanzas: 'Moneda', autor_portfolio: 'Estudio Ferro', autor_festival: 'Infrarrojo',
  autor_concesionario: 'Tracción', autor_correr: 'Ruta', autor_cafeteria: 'Tueste', autor_floreria: 'Flores de Estación', autor_refugio: 'Refugio Lenga',
  autor_turnos: 'Turnera', autor_curso: 'Encuadre', autor_restaurante: 'Brasa', autor_gimnasio: 'Pulso',
};
