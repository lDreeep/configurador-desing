// Catálogo de opciones del configurador. Para sumar una opción, agregá una
// entrada acá: los pasos, la vista previa y el export la toman solos.
// Cualquier cambio de ids o valores tiene que reflejarse en DESIGN.md (§3, §5).

import type {
  Densidad,
  DireccionId,
  FuenteId,
  MovimientoId,
  PaletaId,
  PatronNav,
  Pantalla,
  RadioId,
  TipoProyecto,
} from './tipos';

export interface Paleta {
  nombre: string;
  modo: 'claro' | 'oscuro';
  roles: {
    fondo: string;
    superficie: string;
    superficie_alta: string;
    borde: string;
    texto: string;
    texto_suave: string;
    acento: string;
    sobre_acento: string;
  };
  estados: { exito: string; aviso: string; error: string; info: string };
  sombra: string; // color base de las sombras, en "r,g,b"
}

export const PALETAS: Record<PaletaId, Paleta> = {
  azul_electrico: {
    nombre: 'Azul eléctrico',
    modo: 'claro',
    roles: {
      fondo: '#FFFFFF',
      superficie: '#F2F4F8',
      superficie_alta: '#FFFFFF',
      borde: '#C9D0DE',
      texto: '#121826',
      texto_suave: '#5B6474',
      acento: '#2F5BFF',
      sobre_acento: '#FFFFFF',
    },
    estados: { exito: '#1F7A4D', aviso: '#B45309', error: '#C2272D', info: '#2F5BFF' },
    sombra: '18,24,38',
  },
  tinta_y_lima: {
    nombre: 'Tinta y lima',
    modo: 'oscuro',
    roles: {
      fondo: '#0E0F12',
      superficie: '#1A1C22',
      superficie_alta: '#23262E',
      borde: '#3A3E48',
      texto: '#F3F4F6',
      texto_suave: '#A0A6B2',
      acento: '#C6F24E',
      sobre_acento: '#0E0F12',
    },
    estados: { exito: '#4ADE80', aviso: '#FBBF24', error: '#F87171', info: '#93C5FD' },
    sombra: '0,0,0',
  },
  bosque: {
    nombre: 'Bosque',
    modo: 'claro',
    roles: {
      fondo: '#F7F8F4',
      superficie: '#E9EDE3',
      superficie_alta: '#FFFFFF',
      borde: '#C3CBBA',
      texto: '#17251C',
      texto_suave: '#4F5E53',
      acento: '#1F7A4D',
      sobre_acento: '#FFFFFF',
    },
    estados: { exito: '#1F7A4D', aviso: '#B45309', error: '#B42318', info: '#1D5FA8' },
    sombra: '23,37,28',
  },
  coral_calido: {
    nombre: 'Coral cálido',
    modo: 'claro',
    roles: {
      fondo: '#FFF8F4',
      superficie: '#FBE9DF',
      superficie_alta: '#FFFFFF',
      borde: '#E8C6B4',
      texto: '#2A1712',
      texto_suave: '#6E4D44',
      acento: '#C2410C',
      sobre_acento: '#FFFFFF',
    },
    estados: { exito: '#1F7A4D', aviso: '#9A5B00', error: '#B42318', info: '#1D5FA8' },
    sombra: '42,23,18',
  },
};

export interface Fuente {
  nombre: string;
  pila: string;
  descripcion: string;
}

export const FUENTES: Record<FuenteId, Fuente> = {
  inter: { nombre: 'Inter', pila: 'Inter, system-ui, sans-serif', descripcion: 'Neutra y muy legible' },
  space_grotesk: {
    nombre: 'Space Grotesk',
    pila: '"Space Grotesk", Inter, sans-serif',
    descripcion: 'Geométrica, con carácter',
  },
  fraunces: { nombre: 'Fraunces', pila: 'Fraunces, Georgia, serif', descripcion: 'Serif editorial y cálida' },
  dm_sans: { nombre: 'DM Sans', pila: '"DM Sans", system-ui, sans-serif', descripcion: 'Redondeada y amable' },
};

export interface Radio {
  nombre: string;
  descripcion: string;
  pequeno: number;
  medio: number;
  grande: number;
  boton: number;
}

export const RADIOS: Record<RadioId, Radio> = {
  recto: { nombre: 'Recto', descripcion: '0 px · preciso, serio', pequeno: 0, medio: 0, grande: 0, boton: 0 },
  apenas_suave: { nombre: 'Apenas suave', descripcion: '6 px · técnico, ordenado', pequeno: 4, medio: 6, grande: 10, boton: 6 },
  suave: { nombre: 'Suave', descripcion: '14 px · amable, moderno', pequeno: 6, medio: 14, grande: 20, boton: 14 },
  pildora: { nombre: 'Píldora', descripcion: 'Botones redondos · cercano', pequeno: 8, medio: 20, grande: 28, boton: 999 },
};

export interface Movimiento {
  nombre: string;
  descripcion: string;
  rapida: number;
  media: number;
  lenta: number;
  curvaEntrada: string;
  curvaSalida: string;
  hoverBotones: 'nada' | 'elevar' | 'escalar';
  aparicionListas: 'nada' | 'fundido' | 'escalonada';
  cambioDePantalla: 'nada' | 'fundido' | 'deslizar';
}

export const MOVIMIENTOS: Record<MovimientoId, Movimiento> = {
  minimo: {
    nombre: 'Mínimo',
    descripcion: 'Sin animación. Los cambios son instantáneos.',
    rapida: 0,
    media: 0,
    lenta: 0,
    curvaEntrada: 'linear',
    curvaSalida: 'linear',
    hoverBotones: 'nada',
    aparicionListas: 'nada',
    cambioDePantalla: 'nada',
  },
  sutil: {
    nombre: 'Sutil',
    descripcion: '160 ms, suave al frenar. Se nota sin distraer.',
    rapida: 120,
    media: 160,
    lenta: 280,
    curvaEntrada: 'cubic-bezier(.2,.7,.3,1)',
    curvaSalida: 'cubic-bezier(.4,0,1,1)',
    hoverBotones: 'elevar',
    aparicionListas: 'escalonada',
    cambioDePantalla: 'fundido',
  },
  expresivo: {
    nombre: 'Expresivo',
    descripcion: '420 ms con rebote. Tiene personalidad.',
    rapida: 180,
    media: 420,
    lenta: 560,
    curvaEntrada: 'cubic-bezier(.3,1.6,.5,1)',
    curvaSalida: 'cubic-bezier(.5,0,.75,0)',
    hoverBotones: 'escalar',
    aparicionListas: 'escalonada',
    cambioDePantalla: 'deslizar',
  },
};

export interface Direccion {
  nombre: string;
  descripcion: string;
  palabrasClave: string[];
  paleta: PaletaId;
  fuenteTitulos: FuenteId;
  fuenteTexto: FuenteId;
  radio: RadioId;
  movimiento: MovimientoId;
  densidad: Densidad;
  /** Proporción de la escala tipográfica (cuánto crece cada nivel). */
  escala: number;
  usoDelAcento: 'minimo' | 'moderado' | 'generoso';
  elevacion: 'plana' | 'suave' | 'marcada';
}

export const DIRECCIONES: Record<DireccionId, Direccion> = {
  calmo: {
    nombre: 'Calmo y claro',
    descripcion: 'Mucho aire, poco ruido',
    palabrasClave: ['claro', 'aireado', 'confiable'],
    paleta: 'azul_electrico',
    fuenteTitulos: 'inter',
    fuenteTexto: 'inter',
    radio: 'suave',
    movimiento: 'sutil',
    densidad: 'aireada',
    escala: 1.2,
    usoDelAcento: 'moderado',
    elevacion: 'suave',
  },
  audaz: {
    nombre: 'Audaz',
    descripcion: 'Contraste alto, títulos grandes',
    palabrasClave: ['contundente', 'moderno', 'con energía'],
    paleta: 'tinta_y_lima',
    fuenteTitulos: 'space_grotesk',
    fuenteTexto: 'inter',
    radio: 'recto',
    movimiento: 'expresivo',
    densidad: 'normal',
    escala: 1.333,
    usoDelAcento: 'generoso',
    elevacion: 'plana',
  },
  tecnico: {
    nombre: 'Técnico',
    descripcion: 'Denso y preciso, tipo panel',
    palabrasClave: ['preciso', 'ordenado', 'eficiente'],
    paleta: 'bosque',
    fuenteTitulos: 'inter',
    fuenteTexto: 'inter',
    radio: 'apenas_suave',
    movimiento: 'minimo',
    densidad: 'compacta',
    escala: 1.2,
    usoDelAcento: 'minimo',
    elevacion: 'plana',
  },
  calido: {
    nombre: 'Cálido',
    descripcion: 'Cercano, redondeado, amable',
    palabrasClave: ['cercano', 'amable', 'humano'],
    paleta: 'coral_calido',
    fuenteTitulos: 'fraunces',
    fuenteTexto: 'dm_sans',
    radio: 'pildora',
    movimiento: 'sutil',
    densidad: 'aireada',
    escala: 1.25,
    usoDelAcento: 'moderado',
    elevacion: 'suave',
  },
};

export const TIPOS_PROYECTO: Record<TipoProyecto, { nombre: string; descripcion: string }> = {
  landing: { nombre: 'Landing', descripcion: 'Una página que presenta y convierte' },
  sitio: { nombre: 'Sitio web', descripcion: 'Varias páginas informativas' },
  tienda: { nombre: 'Tienda', descripcion: 'Catálogo, carrito y compra' },
  app_web: { nombre: 'App web', descripcion: 'Herramienta con cuentas y datos' },
  app_movil: { nombre: 'App móvil', descripcion: 'Pensada para el celular' },
  dashboard: { nombre: 'Dashboard', descripcion: 'Métricas y gestión interna' },
  portfolio: { nombre: 'Portfolio', descripcion: 'Mostrar trabajos propios' },
  blog: { nombre: 'Blog', descripcion: 'Artículos y contenido' },
};

export const PATRONES_NAV: Record<PatronNav, { nombre: string; descripcion: string }> = {
  barra_superior: { nombre: 'Barra superior', descripcion: 'Sitios y apps simples' },
  menu_lateral: { nombre: 'Menú lateral', descripcion: 'Apps con muchas secciones' },
  pestanas_abajo: { nombre: 'Pestañas abajo', descripcion: 'Pensado para el celular' },
  hamburguesa: { nombre: 'Menú hamburguesa', descripcion: 'Todo escondido en un botón' },
  sin_navegacion: { nombre: 'Sin navegación', descripcion: 'Una sola página con scroll' },
};

export const INTEGRACIONES: Record<string, string> = {
  pagos: 'Pagos',
  email: 'Email',
  whatsapp: 'WhatsApp',
  mapas: 'Mapas',
  calendario: 'Calendario',
  analitica: 'Analítica',
};

export const PLATAFORMAS: Record<string, string> = {
  web_movil: 'Web en celular',
  web_escritorio: 'Web en computadora',
  ios: 'iOS',
  android: 'Android',
};

type PlantillaPantalla = Omit<Pantalla, 'id'>;

const p = (nombre: string, proposito: string, secciones: string[], accionPrincipal: string): PlantillaPantalla => ({
  nombre,
  proposito,
  secciones,
  accionPrincipal,
});

/** Pantallas sugeridas por tipo de proyecto. La persona puede editarlas. */
export const PLANTILLAS_PANTALLAS: Record<TipoProyecto, PlantillaPantalla[]> = {
  landing: [
    p('Inicio', 'Presentar la propuesta y conseguir el contacto', ['hero', 'beneficios', 'como_funciona', 'testimonios', 'precios', 'preguntas_frecuentes', 'contacto'], 'Empezar ahora'),
  ],
  sitio: [
    p('Inicio', 'Presentar quiénes son y qué ofrecen', ['hero', 'servicios_destacados', 'contacto'], 'Contactar'),
    p('Servicios', 'Detallar lo que ofrecen', ['lista_de_servicios'], 'Pedir presupuesto'),
    p('Nosotros', 'Generar confianza', ['historia', 'equipo'], 'Contactar'),
    p('Contacto', 'Que puedan escribir o llegar', ['formulario', 'mapa'], 'Enviar mensaje'),
  ],
  tienda: [
    p('Inicio', 'Mostrar productos destacados', ['hero', 'categorias', 'destacados'], 'Ver catálogo'),
    p('Catálogo', 'Explorar y filtrar productos', ['filtros', 'grilla_de_productos'], 'Agregar al carrito'),
    p('Producto', 'Decidir la compra', ['galeria', 'detalle', 'relacionados'], 'Agregar al carrito'),
    p('Carrito', 'Revisar antes de pagar', ['items', 'resumen'], 'Ir a pagar'),
  ],
  app_web: [
    p('Inicio', 'Ver el estado general de un vistazo', ['resumen', 'actividad_reciente'], 'Crear nuevo'),
    p('Listado', 'Ver y gestionar los elementos principales', ['buscador', 'lista'], 'Crear nuevo'),
    p('Ajustes', 'Configurar la cuenta', ['perfil', 'preferencias'], 'Guardar cambios'),
  ],
  app_movil: [
    p('Inicio', 'Lo más importante, al abrir', ['resumen', 'accesos_rapidos'], 'Crear nuevo'),
    p('Listado', 'Ver los elementos principales', ['buscador', 'lista'], 'Crear nuevo'),
    p('Perfil', 'Cuenta y preferencias', ['datos', 'preferencias'], 'Guardar cambios'),
  ],
  dashboard: [
    p('Resumen', 'Métricas clave de un vistazo', ['indicadores', 'grafico_principal', 'alertas'], 'Exportar'),
    p('Reportes', 'Analizar en detalle', ['filtros', 'tabla'], 'Descargar reporte'),
    p('Usuarios', 'Gestionar quién accede', ['buscador', 'tabla_de_usuarios'], 'Invitar usuario'),
    p('Ajustes', 'Configuración general', ['preferencias'], 'Guardar cambios'),
  ],
  portfolio: [
    p('Inicio', 'Presentarse en una frase', ['hero', 'proyectos_destacados'], 'Ver proyectos'),
    p('Proyectos', 'Mostrar el trabajo', ['grilla_de_proyectos'], 'Ver proyecto'),
    p('Sobre mí', 'Contar quién sos', ['biografia', 'experiencia'], 'Contactar'),
    p('Contacto', 'Que te escriban', ['formulario'], 'Enviar mensaje'),
  ],
  blog: [
    p('Inicio', 'Mostrar lo último', ['destacado', 'lista_de_articulos'], 'Leer artículo'),
    p('Artículo', 'Leer cómodo', ['titulo', 'cuerpo', 'relacionados'], 'Suscribirse'),
    p('Categorías', 'Explorar por tema', ['lista_de_categorias'], 'Ver categoría'),
  ],
};

/** Patrones de navegación recomendados por tipo [escritorio, celular]. */
export const NAV_SUGERIDA: Record<TipoProyecto, [PatronNav, PatronNav]> = {
  landing: ['sin_navegacion', 'sin_navegacion'],
  sitio: ['barra_superior', 'hamburguesa'],
  tienda: ['barra_superior', 'hamburguesa'],
  app_web: ['menu_lateral', 'pestanas_abajo'],
  app_movil: ['pestanas_abajo', 'pestanas_abajo'],
  dashboard: ['menu_lateral', 'hamburguesa'],
  portfolio: ['barra_superior', 'hamburguesa'],
  blog: ['barra_superior', 'hamburguesa'],
};

export const FACTOR_DENSIDAD: Record<Densidad, number> = { compacta: 0.75, normal: 1, aireada: 1.25 };
