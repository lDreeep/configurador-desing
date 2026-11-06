// Catálogo de opciones del configurador. Para sumar una opción, agregá una
// entrada acá: los pasos, la vista previa y el export la toman solos.
// Cualquier cambio de ids o valores tiene que reflejarse en DESIGN.md (§3, §5).

import { ESTADOS_CLAROS, ESTADOS_OSCUROS, type Roles } from './color';
import type {
  AparicionId,
  BordesId,
  BotonEstiloId,
  BotonTamano,
  CambioId,
  Densidad,
  DireccionId,
  ElevacionId,
  EscalaId,
  EspaciadoTitulos,
  FuenteId,
  HoverId,
  MovimientoId,
  PaletaId,
  PatronNav,
  Pantalla,
  PresionarId,
  RadioId,
  TipoProyecto,
} from './tipos';

// ---------- Color ----------

export interface Paleta {
  nombre: string;
  modo: 'claro' | 'oscuro';
  roles: Roles;
  estados: { exito: string; aviso: string; error: string; info: string };
}

const claro = (nombre: string, roles: Roles, estados = ESTADOS_CLAROS): Paleta => ({ nombre, modo: 'claro', roles, estados });
const oscuro = (nombre: string, roles: Roles, estados = ESTADOS_OSCUROS): Paleta => ({ nombre, modo: 'oscuro', roles, estados });

export const PALETAS: Record<PaletaId, Paleta> = {
  azul_electrico: claro('Azul eléctrico', {
    fondo: '#FFFFFF', superficie: '#F2F4F8', superficie_alta: '#FFFFFF', borde: '#C9D0DE',
    texto: '#121826', texto_suave: '#5B6474', acento: '#2F5BFF', sobre_acento: '#FFFFFF',
  }),
  bosque: claro('Bosque', {
    fondo: '#F7F8F4', superficie: '#E9EDE3', superficie_alta: '#FFFFFF', borde: '#C3CBBA',
    texto: '#17251C', texto_suave: '#4F5E53', acento: '#1F7A4D', sobre_acento: '#FFFFFF',
  }),
  coral_calido: claro('Coral cálido', {
    fondo: '#FFF8F4', superficie: '#FBE9DF', superficie_alta: '#FFFFFF', borde: '#E8C6B4',
    texto: '#2A1712', texto_suave: '#6E4D44', acento: '#C2410C', sobre_acento: '#FFFFFF',
  }),
  caramelo: claro('Caramelo', {
    fondo: '#FFF9EC', superficie: '#FFEFC7', superficie_alta: '#FFFFFF', borde: '#EBD39B',
    texto: '#1F1A3D', texto_suave: '#554E72', acento: '#6D28D9', sobre_acento: '#FFFFFF',
  }),
  papel: claro('Papel y tinta roja', {
    fondo: '#FBFAF7', superficie: '#F1EFE9', superficie_alta: '#FFFFFF', borde: '#D6D2C8',
    texto: '#1B1B1B', texto_suave: '#5E5C57', acento: '#B4232C', sobre_acento: '#FFFFFF',
  }),
  alto_contraste: claro('Alto contraste', {
    fondo: '#FFFFFF', superficie: '#F0F0F0', superficie_alta: '#FFFFFF', borde: '#000000',
    texto: '#000000', texto_suave: '#4A4A4A', acento: '#FF5A1F', sobre_acento: '#000000',
  }),
  lavanda: claro('Lavanda', {
    fondo: '#FAF8FF', superficie: '#EFEAFB', superficie_alta: '#FFFFFF', borde: '#D3CAEE',
    texto: '#1E1636', texto_suave: '#5B5275', acento: '#6741D9', sobre_acento: '#FFFFFF',
  }),
  arena: claro('Arena', {
    fondo: '#F8F4EC', superficie: '#EDE6D8', superficie_alta: '#FFFFFF', borde: '#D5CAB4',
    texto: '#2B2620', texto_suave: '#5F574B', acento: '#8A5A2B', sobre_acento: '#FFFFFF',
  }),
  grafito: claro('Grafito', {
    fondo: '#FFFFFF', superficie: '#F4F4F5', superficie_alta: '#FFFFFF', borde: '#D4D4D8',
    texto: '#18181B', texto_suave: '#52525B', acento: '#18181B', sobre_acento: '#FFFFFF',
  }),
  menta: claro('Menta', {
    fondo: '#F5FBF8', superficie: '#E2F3EA', superficie_alta: '#FFFFFF', borde: '#B9DCC9',
    texto: '#0F2A1F', texto_suave: '#44604F', acento: '#0F766E', sobre_acento: '#FFFFFF',
  }),
  tinta_y_lima: oscuro('Tinta y lima', {
    fondo: '#0E0F12', superficie: '#1A1C22', superficie_alta: '#23262E', borde: '#3A3E48',
    texto: '#F3F4F6', texto_suave: '#A0A6B2', acento: '#C6F24E', sobre_acento: '#0E0F12',
  }),
  noche_dorada: oscuro('Noche dorada', {
    fondo: '#0F0E0C', superficie: '#1C1A16', superficie_alta: '#26231D', borde: '#3D382E',
    texto: '#F5F0E6', texto_suave: '#B3A994', acento: '#D4AF6A', sobre_acento: '#1A1405',
  }),
  oceano: oscuro('Océano', {
    fondo: '#0B1220', superficie: '#131C2E', superficie_alta: '#1A2540', borde: '#2A3756',
    texto: '#E8EEF9', texto_suave: '#9AA8C2', acento: '#38BDF8', sobre_acento: '#06202E',
  }),
  suizo_rojo: claro('Suizo rojo', {
    fondo: '#F4F4F0', superficie: '#E6E6E0', superficie_alta: '#FFFFFF', borde: '#B9B9B0',
    texto: '#111111', texto_suave: '#46463F', acento: '#D70A16', sobre_acento: '#FFFFFF',
  }),
  bauhaus: claro('Bauhaus', {
    fondo: '#F2EBDD', superficie: '#E6DCC6', superficie_alta: '#FBF7EF', borde: '#1A1A1A',
    texto: '#1A1A1A', texto_suave: '#4A4337', acento: '#1F3F99', sobre_acento: '#FFFFFF',
  }, { exito: '#1B6B42', aviso: '#8A4504', error: '#B3201A', info: '#1F3F99' }),
  memphis: claro('Memphis', {
    fondo: '#FFF6EA', superficie: '#FFE3EE', superficie_alta: '#FFFFFF', borde: '#1B1B3A',
    texto: '#1B1B3A', texto_suave: '#4E4A6B', acento: '#D11E63', sobre_acento: '#FFFFFF',
  }),
  vidrio: oscuro('Vidrio nocturno', {
    fondo: '#0D0B1E', superficie: '#1A1733', superficie_alta: '#241F45', borde: '#3A3466',
    texto: '#F4F2FF', texto_suave: '#B0A9D6', acento: '#9D8CFF', sobre_acento: '#0D0B1E',
  }),
  arcilla: claro('Arcilla', {
    fondo: '#EEF1FA', superficie: '#F8F9FE', superficie_alta: '#FFFFFF', borde: '#D3D8EA',
    texto: '#2B2D42', texto_suave: '#585C77', acento: '#5B5BD6', sobre_acento: '#FFFFFF',
  }),
  retro_gris: claro('Retro gris', {
    fondo: '#D4D0C8', superficie: '#E4E1DB', superficie_alta: '#FFFFFF', borde: '#808080',
    texto: '#000000', texto_suave: '#333333', acento: '#000080', sobre_acento: '#FFFFFF',
  }, { exito: '#0B5A33', aviso: '#6B3A00', error: '#8E1B1B', info: '#000080' }),
  fosforo_verde: oscuro('Fósforo verde', {
    fondo: '#050805', superficie: '#0C140C', superficie_alta: '#122012', borde: '#235223',
    texto: '#B8F5B8', texto_suave: '#74C274', acento: '#39FF14', sobre_acento: '#050805',
  }),
  fosforo_ambar: oscuro('Fósforo ámbar', {
    fondo: '#0A0700', superficie: '#161000', superficie_alta: '#211800', borde: '#4D3A0A',
    texto: '#FFD58A', texto_suave: '#C99A3E', acento: '#FFB000', sobre_acento: '#0A0700',
  }),
  cromo: claro('Cromo Y2K', {
    fondo: '#EDEBFA', superficie: '#DDD9F6', superficie_alta: '#FFFFFF', borde: '#A9A2DA',
    texto: '#1A1440', texto_suave: '#463F6E', acento: '#4B12C8', sobre_acento: '#FFFFFF',
  }),
};

// ---------- Tipografía ----------

export type CategoriaFuente = 'sans' | 'geometrica' | 'serif' | 'display' | 'mono' | 'redondeada';

export const CATEGORIAS_FUENTE: Record<CategoriaFuente, string> = {
  sans: 'Sans',
  geometrica: 'Geométricas',
  serif: 'Serif',
  display: 'Display',
  mono: 'Mono',
  redondeada: 'Redondeadas',
};

export interface Fuente {
  nombre: string;
  pila: string;
  categoria: CategoriaFuente;
  pesos: number[];
  descripcion: string;
}

const f = (nombre: string, respaldo: string, categoria: CategoriaFuente, pesos: number[], descripcion: string): Fuente => ({
  nombre,
  pila: `"${nombre}", ${respaldo}`,
  categoria,
  pesos,
  descripcion,
});
const SANS = 'system-ui, sans-serif';
const SERIF = 'Georgia, serif';
const MONO = 'ui-monospace, monospace';
const P4_8 = [400, 500, 600, 700, 800];
const P4_7 = [400, 500, 600, 700];

export const FUENTES: Record<FuenteId, Fuente> = {
  inter: f('Inter', SANS, 'sans', P4_8, 'Neutra y muy legible'),
  dm_sans: f('DM Sans', SANS, 'sans', P4_8, 'Suave y amable'),
  manrope: f('Manrope', SANS, 'sans', P4_8, 'Moderna, un poco técnica'),
  plus_jakarta: f('Plus Jakarta Sans', SANS, 'sans', P4_8, 'Fresca, de producto digital'),
  work_sans: f('Work Sans', SANS, 'sans', P4_8, 'Clara, con carácter de afiche'),
  ibm_plex_sans: f('IBM Plex Sans', SANS, 'sans', P4_7, 'Corporativa con personalidad'),
  archivo: f('Archivo', SANS, 'sans', P4_8, 'Robusta, ideal en negrita'),
  outfit: f('Outfit', SANS, 'geometrica', P4_8, 'Geométrica y limpia'),
  sora: f('Sora', SANS, 'geometrica', P4_8, 'Geométrica, tecnológica'),
  space_grotesk: f('Space Grotesk', SANS, 'geometrica', P4_7, 'Geométrica, con rarezas'),
  syne: f('Syne', SANS, 'display', P4_8, 'Expresiva, de estudio creativo'),
  bricolage: f('Bricolage Grotesque', SANS, 'display', P4_8, 'Grotesca con personalidad'),
  unbounded: f('Unbounded', SANS, 'display', P4_8, 'Ancha y juguetona'),
  fraunces: f('Fraunces', SERIF, 'serif', P4_8, 'Serif cálida y blanda'),
  playfair: f('Playfair Display', SERIF, 'serif', P4_8, 'Elegante, de alto contraste'),
  lora: f('Lora', SERIF, 'serif', P4_7, 'Serif para leer largo'),
  dm_serif: f('DM Serif Display', SERIF, 'serif', [400], 'Títulos con mucho estilo'),
  instrument_serif: f('Instrument Serif', SERIF, 'serif', [400], 'Editorial, finita y fina'),
  source_serif: f('Source Serif 4', SERIF, 'serif', P4_8, 'Serif sobria y versátil'),
  jetbrains_mono: f('JetBrains Mono', MONO, 'mono', P4_8, 'Monoespaciada de programador'),
  space_mono: f('Space Mono', MONO, 'mono', [400, 700], 'Mono retro, con carácter'),
  nunito: f('Nunito', SANS, 'redondeada', P4_8, 'Redondeada y simpática'),
  quicksand: f('Quicksand', SANS, 'redondeada', P4_7, 'Redondeada y liviana'),
  bebas_neue: f('Bebas Neue', SANS, 'display', [400], 'Condensada en mayúsculas, de afiche'),
  anton: f('Anton', SANS, 'display', [400], 'Condensada y pesada, impacto'),
  vt323: f('VT323', MONO, 'mono', [400], 'Pixelada, de terminal vieja'),
  poiret_one: f('Poiret One', SANS, 'display', [400], 'Art déco, fina y geométrica'),
};

/** URL de Google Fonts que carga todo el catálogo (para mostrar cada fuente con su forma real). */
export const urlGoogleFonts = () =>
  'https://fonts.googleapis.com/css2?' +
  Object.values(FUENTES)
    .map((x) => `family=${x.nombre.replace(/ /g, '+')}:wght@${x.pesos.join(';')}`)
    .join('&') +
  '&display=swap';

export const COMBINACIONES: { nombre: string; titulos: FuenteId; texto: FuenteId }[] = [
  { nombre: 'Neutra', titulos: 'inter', texto: 'inter' },
  { nombre: 'Tech', titulos: 'space_grotesk', texto: 'inter' },
  { nombre: 'Cálida', titulos: 'fraunces', texto: 'dm_sans' },
  { nombre: 'Elegante', titulos: 'playfair', texto: 'inter' },
  { nombre: 'Editorial', titulos: 'instrument_serif', texto: 'source_serif' },
  { nombre: 'Juguetona', titulos: 'unbounded', texto: 'nunito' },
  { nombre: 'Creativa', titulos: 'syne', texto: 'manrope' },
  { nombre: 'Moderna', titulos: 'bricolage', texto: 'plus_jakarta' },
  { nombre: 'Developer', titulos: 'jetbrains_mono', texto: 'ibm_plex_sans' },
  { nombre: 'Robusta', titulos: 'archivo', texto: 'work_sans' },
];

export const ESCALAS: Record<EscalaId, { nombre: string; descripcion: string; proporcion: number }> = {
  sutil: { nombre: 'Sutil', descripcion: 'Títulos apenas más grandes', proporcion: 1.2 },
  medio: { nombre: 'Medio', descripcion: 'Jerarquía clara', proporcion: 1.25 },
  dramatico: { nombre: 'Dramático', descripcion: 'Títulos grandes, mucho contraste', proporcion: 1.333 },
  extremo: { nombre: 'Extremo', descripcion: 'Títulos enormes, tipo afiche', proporcion: 1.5 },
};

export const ESPACIADOS_TITULOS: Record<EspaciadoTitulos, { nombre: string; descripcion: string; valor: string }> = {
  apretado: { nombre: 'Apretado', descripcion: 'Letras juntas, compacto', valor: '-0.03em' },
  normal: { nombre: 'Normal', descripcion: 'El de la fuente', valor: '0em' },
  amplio: { nombre: 'Amplio', descripcion: 'Aireado, elegante', valor: '0.04em' },
};

// ---------- Forma ----------

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

export const ELEVACIONES: Record<ElevacionId, { nombre: string; descripcion: string }> = {
  plana: { nombre: 'Plana', descripcion: 'Sin sombras, todo al mismo nivel' },
  suave: { nombre: 'Suave', descripcion: 'Sombras difusas y livianas' },
  marcada: { nombre: 'Marcada', descripcion: 'Las cards flotan claramente' },
  dura: { nombre: 'Dura', descripcion: 'Sombra sólida desplazada, estilo brutalista' },
};

export const BORDES: Record<BordesId, { nombre: string; descripcion: string }> = {
  ninguno: { nombre: 'Sin bordes', descripcion: 'Se separa con color de fondo' },
  sutil: { nombre: 'Sutiles', descripcion: 'Línea fina y clara' },
  marcado: { nombre: 'Marcados', descripcion: 'Línea gruesa del color del texto' },
};

// ---------- Botones ----------

export const ESTILOS_BOTON: Record<BotonEstiloId, { nombre: string; descripcion: string }> = {
  relleno: { nombre: 'Relleno', descripcion: 'Color de acento sólido' },
  contorno: { nombre: 'Contorno', descripcion: 'Solo el borde, liviano' },
  tonal: { nombre: 'Tonal', descripcion: 'Fondo suave del acento' },
  elevado: { nombre: 'Elevado', descripcion: 'Relleno con sombra' },
  sombra_dura: { nombre: 'Sombra dura', descripcion: 'Borde y sombra sólida, brutalista' },
};

export const TAMANOS_BOTON: Record<BotonTamano, { nombre: string; descripcion: string; alto: number; padding: number; texto: number }> = {
  compacto: { nombre: 'Compacto', descripcion: '44 px de alto', alto: 44, padding: 14, texto: 14 },
  normal: { nombre: 'Normal', descripcion: '48 px de alto', alto: 48, padding: 20, texto: 15 },
  grande: { nombre: 'Grande', descripcion: '56 px de alto', alto: 56, padding: 28, texto: 17 },
};

// ---------- Movimiento ----------

export interface Movimiento {
  nombre: string;
  descripcion: string;
  rapida: number;
  media: number;
  lenta: number;
  curvaEntrada: string;
  curvaSalida: string;
  hover: HoverId;
  presionar: PresionarId;
  aparicion: AparicionId;
  cambio: CambioId;
}

export const MOVIMIENTOS: Record<MovimientoId, Movimiento> = {
  minimo: {
    nombre: 'Mínimo',
    descripcion: 'Sin animación. Los cambios son instantáneos.',
    rapida: 0, media: 0, lenta: 0,
    curvaEntrada: 'linear', curvaSalida: 'linear',
    hover: 'oscurecer', presionar: 'nada', aparicion: 'nada', cambio: 'nada',
  },
  rapido: {
    nombre: 'Rápido',
    descripcion: '100 ms, seco y preciso. Se siente ágil.',
    rapida: 80, media: 120, lenta: 200,
    curvaEntrada: 'cubic-bezier(.2,0,0,1)', curvaSalida: 'cubic-bezier(.4,0,1,1)',
    hover: 'oscurecer', presionar: 'hundir', aparicion: 'fundido', cambio: 'fundido',
  },
  sutil: {
    nombre: 'Sutil',
    descripcion: '160 ms, suave al frenar. Se nota sin distraer.',
    rapida: 120, media: 160, lenta: 280,
    curvaEntrada: 'cubic-bezier(.2,.7,.3,1)', curvaSalida: 'cubic-bezier(.4,0,1,1)',
    hover: 'elevar', presionar: 'hundir', aparicion: 'escalonada', cambio: 'fundido',
  },
  expresivo: {
    nombre: 'Expresivo',
    descripcion: '420 ms con rebote. Tiene personalidad.',
    rapida: 180, media: 420, lenta: 560,
    curvaEntrada: 'cubic-bezier(.3,1.6,.5,1)', curvaSalida: 'cubic-bezier(.5,0,.75,0)',
    hover: 'escalar', presionar: 'hundir', aparicion: 'escalonada', cambio: 'deslizar',
  },
};

export const HOVERS: Record<HoverId, { nombre: string; descripcion: string }> = {
  nada: { nombre: 'Nada', descripcion: 'El botón no cambia' },
  oscurecer: { nombre: 'Oscurecer', descripcion: 'Cambia apenas el tono' },
  brillo: { nombre: 'Brillo', descripcion: 'Se ilumina un poco' },
  elevar: { nombre: 'Elevar', descripcion: 'Sube y gana sombra' },
  escalar: { nombre: 'Agrandar', descripcion: 'Crece un poco' },
  sombra: { nombre: 'Sombra', descripcion: 'Solo aparece la sombra' },
  desplazar: { nombre: 'Desplazar', descripcion: 'Se corre en diagonal, ideal con sombra dura' },
};

export const PRESIONAR: Record<PresionarId, { nombre: string; descripcion: string }> = {
  nada: { nombre: 'Nada', descripcion: 'Sin respuesta al tocar' },
  hundir: { nombre: 'Hundir', descripcion: 'Se achica al tocar, se siente físico' },
};

export const APARICIONES: Record<AparicionId, { nombre: string; descripcion: string }> = {
  nada: { nombre: 'Nada', descripcion: 'Aparece de golpe' },
  fundido: { nombre: 'Fundido', descripcion: 'Aparece transparente y se completa' },
  subir: { nombre: 'Subir', descripcion: 'Sube un poco mientras aparece' },
  escalonada: { nombre: 'Escalonada', descripcion: 'Sube uno detrás del otro' },
  zoom: { nombre: 'Zoom', descripcion: 'Crece desde un poco más chico' },
};

export const CAMBIOS: Record<CambioId, { nombre: string; descripcion: string }> = {
  nada: { nombre: 'Nada', descripcion: 'Cambio instantáneo' },
  fundido: { nombre: 'Fundido', descripcion: 'Se desvanece y aparece' },
  deslizar: { nombre: 'Deslizar', descripcion: 'Entra desde el costado' },
  subir: { nombre: 'Subir', descripcion: 'Entra desde abajo' },
  zoom: { nombre: 'Zoom', descripcion: 'Se acerca levemente' },
};

// ---------- Direcciones ----------

export interface Direccion {
  nombre: string;
  descripcion: string;
  palabrasClave: string[];
  paleta: PaletaId;
  fuenteTitulos: FuenteId;
  fuenteTexto: FuenteId;
  pesoTitulos: number;
  espaciadoTitulos: EspaciadoTitulos;
  escala: EscalaId;
  radio: RadioId;
  elevacion: ElevacionId;
  bordes: BordesId;
  boton: BotonEstiloId;
  movimiento: MovimientoId;
  densidad: Densidad;
  usoDelAcento: 'minimo' | 'moderado' | 'generoso';
}

export const DIRECCIONES: Record<DireccionId, Direccion> = {
  calmo: {
    nombre: 'Calmo y claro', descripcion: 'Mucho aire, poco ruido', palabrasClave: ['claro', 'aireado', 'confiable'],
    paleta: 'azul_electrico', fuenteTitulos: 'inter', fuenteTexto: 'inter', pesoTitulos: 700, espaciadoTitulos: 'apretado',
    escala: 'sutil', radio: 'suave', elevacion: 'suave', bordes: 'ninguno', boton: 'relleno', movimiento: 'sutil',
    densidad: 'aireada', usoDelAcento: 'moderado',
  },
  audaz: {
    nombre: 'Audaz', descripcion: 'Contraste alto, títulos grandes', palabrasClave: ['contundente', 'moderno', 'con energía'],
    paleta: 'tinta_y_lima', fuenteTitulos: 'space_grotesk', fuenteTexto: 'inter', pesoTitulos: 700, espaciadoTitulos: 'apretado',
    escala: 'dramatico', radio: 'recto', elevacion: 'plana', bordes: 'sutil', boton: 'relleno', movimiento: 'expresivo',
    densidad: 'normal', usoDelAcento: 'generoso',
  },
  tecnico: {
    nombre: 'Técnico', descripcion: 'Denso y preciso, tipo panel', palabrasClave: ['preciso', 'ordenado', 'eficiente'],
    paleta: 'bosque', fuenteTitulos: 'manrope', fuenteTexto: 'inter', pesoTitulos: 600, espaciadoTitulos: 'normal',
    escala: 'sutil', radio: 'apenas_suave', elevacion: 'plana', bordes: 'sutil', boton: 'relleno', movimiento: 'rapido',
    densidad: 'compacta', usoDelAcento: 'minimo',
  },
  calido: {
    nombre: 'Cálido', descripcion: 'Cercano, redondeado, amable', palabrasClave: ['cercano', 'amable', 'humano'],
    paleta: 'coral_calido', fuenteTitulos: 'fraunces', fuenteTexto: 'dm_sans', pesoTitulos: 600, espaciadoTitulos: 'normal',
    escala: 'medio', radio: 'pildora', elevacion: 'suave', bordes: 'ninguno', boton: 'relleno', movimiento: 'sutil',
    densidad: 'aireada', usoDelAcento: 'moderado',
  },
  lujoso: {
    nombre: 'Lujoso', descripcion: 'Oscuro, sobrio, detalles dorados', palabrasClave: ['exclusivo', 'sobrio', 'elegante'],
    paleta: 'noche_dorada', fuenteTitulos: 'playfair', fuenteTexto: 'inter', pesoTitulos: 500, espaciadoTitulos: 'normal',
    escala: 'dramatico', radio: 'recto', elevacion: 'plana', bordes: 'sutil', boton: 'contorno', movimiento: 'sutil',
    densidad: 'aireada', usoDelAcento: 'minimo',
  },
  jugueton: {
    nombre: 'Juguetón', descripcion: 'Colorido, redondo, con rebote', palabrasClave: ['divertido', 'colorido', 'liviano'],
    paleta: 'caramelo', fuenteTitulos: 'unbounded', fuenteTexto: 'nunito', pesoTitulos: 700, espaciadoTitulos: 'normal',
    escala: 'dramatico', radio: 'pildora', elevacion: 'dura', bordes: 'marcado', boton: 'sombra_dura', movimiento: 'expresivo',
    densidad: 'normal', usoDelAcento: 'generoso',
  },
  editorial: {
    nombre: 'Editorial', descripcion: 'Como una revista: tipografía primero', palabrasClave: ['culto', 'pausado', 'tipográfico'],
    paleta: 'papel', fuenteTitulos: 'instrument_serif', fuenteTexto: 'source_serif', pesoTitulos: 400, espaciadoTitulos: 'apretado',
    escala: 'extremo', radio: 'recto', elevacion: 'plana', bordes: 'sutil', boton: 'contorno', movimiento: 'sutil',
    densidad: 'aireada', usoDelAcento: 'minimo',
  },
  brutalista: {
    nombre: 'Brutalista', descripcion: 'Crudo, bordes negros, sin adornos', palabrasClave: ['directo', 'crudo', 'honesto'],
    paleta: 'alto_contraste', fuenteTitulos: 'archivo', fuenteTexto: 'ibm_plex_sans', pesoTitulos: 800, espaciadoTitulos: 'apretado',
    escala: 'extremo', radio: 'recto', elevacion: 'dura', bordes: 'marcado', boton: 'sombra_dura', movimiento: 'rapido',
    densidad: 'normal', usoDelAcento: 'generoso',
  },
};

// ---------- Proyecto y estructura ----------

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
