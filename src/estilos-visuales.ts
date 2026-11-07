// Estilos visuales (movimientos estéticos) y layouts de página.
// Cada estilo trae sus paletas, fuentes, forma, botones y movimiento compatibles (las "reglas"),
// más el CSS que le da su textura. Ese CSS se usa en la vista previa Y se exporta tal cual (DESIGN.md §19).
//
// En el CSS, `&` es la raíz de la página. Las clases .pg-* son nombres de referencia:
//   .pg-nav  .pg-marca  .pg-hero  .pg-titulo  .pg-bajada  .pg-etiqueta  .pg-card  .pg-card-titulo
//   .pg-media  .pg-boton (primario)  .pg-boton-sec  .pg-deco (decoración, con hijos .a .b .c)
// Para sumar un estilo: agregalo acá; los tests verifican que sus paletas y fuentes existan.

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
  palabrasClave: string[];
  /** Reglas que la IA tiene que respetar para que el estilo se sostenga. */
  reglas: string[];
  paletas: PaletaId[];
  fuentes: [FuenteId, FuenteId][];
  pesoTitulos: number;
  radio: RadioId;
  elevacion: ElevacionId;
  bordes: BordesId;
  boton: BotonEstiloId;
  movimiento: MovimientoId;
  direccionBase: DireccionId;
  css: string;
}

export const ESTILOS: Record<EstiloId, EstiloVisual> = {
  suizo: {
    nombre: 'Suizo',
    descripcion: 'Grilla estricta, tipografía enorme, rojo y negro',
    palabrasClave: ['racional', 'preciso', 'tipográfico'],
    reglas: [
      'Todo alineado a la izquierda sobre una grilla visible de 12 columnas',
      'Títulos enormes, muy apretados, en peso fuerte',
      'Sin sombras ni esquinas redondeadas',
      'El rojo se usa poco y en bloques sólidos',
    ],
    paletas: ['suizo_rojo', 'grafito', 'alto_contraste'],
    fuentes: [['archivo', 'inter'], ['inter', 'inter'], ['bebas_neue', 'inter']],
    pesoTitulos: 800, radio: 'recto', elevacion: 'plana', bordes: 'sutil', boton: 'relleno', movimiento: 'rapido',
    direccionBase: 'audaz',
    css: `
& { --deco-1: var(--color-acento); }
& .pg-titulo { letter-spacing: -0.045em; line-height: 0.92; }
& .pg-etiqueta { text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; }
& .pg-card { border-top: 4px solid var(--color-texto); background: transparent; box-shadow: none; border-radius: 0; }
& .pg-media { background: var(--color-acento); }
& .pg-deco { background-image: repeating-linear-gradient(90deg, transparent 0 calc(100% / 12 - 1px), rgba(0,0,0,.06) calc(100% / 12 - 1px) calc(100% / 12)); }
`,
  },
  bauhaus: {
    nombre: 'Bauhaus',
    descripcion: 'Círculos, triángulos y colores primarios',
    palabrasClave: ['geométrico', 'constructivo', 'primario'],
    reglas: [
      'Formas geométricas puras (círculo, cuadrado, triángulo) como decoración',
      'Solo colores primarios más negro y crema',
      'Bordes negros gruesos, sin sombras difusas',
      'Tipografía geométrica',
    ],
    paletas: ['bauhaus', 'alto_contraste'],
    fuentes: [['outfit', 'dm_sans'], ['sora', 'inter'], ['poiret_one', 'outfit']],
    pesoTitulos: 700, radio: 'recto', elevacion: 'plana', bordes: 'marcado', boton: 'relleno', movimiento: 'sutil',
    direccionBase: 'jugueton',
    css: `
& { --deco-1: #D7261E; --deco-2: #F2B705; --deco-3: #1F3F99; }
& .pg-card { border: 3px solid var(--color-texto); border-radius: 0; }
& .pg-card:nth-child(3n+1) { border-top: 14px solid var(--deco-1); }
& .pg-card:nth-child(3n+2) { border-top: 14px solid var(--deco-2); }
& .pg-card:nth-child(3n+3) { border-top: 14px solid var(--deco-3); }
& .pg-media { background: var(--deco-2); border: 3px solid var(--color-texto); position: relative; overflow: hidden; }
& .pg-media::before { content: ''; position: absolute; width: 60%; aspect-ratio: 1; border-radius: 50%; background: var(--deco-1); left: -10%; bottom: -20%; }
& .pg-media::after { content: ''; position: absolute; width: 0; height: 0; border-left: 70px solid transparent; border-right: 70px solid transparent; border-bottom: 120px solid var(--deco-3); right: 12%; top: 14%; }
& .pg-deco .a { position: absolute; width: 140px; aspect-ratio: 1; border-radius: 50%; background: var(--deco-1); top: 8%; right: 6%; opacity: .9; }
& .pg-deco .b { position: absolute; width: 90px; height: 90px; background: var(--deco-3); bottom: 10%; right: 18%; }
& .pg-deco .c { position: absolute; width: 0; height: 0; border-left: 50px solid transparent; border-right: 50px solid transparent; border-bottom: 86px solid var(--deco-2); bottom: 30%; left: 4%; }
`,
  },
  memphis: {
    nombre: 'Memphis',
    descripcion: 'Ochentoso: lunares, zigzags y colores pop',
    palabrasClave: ['pop', 'divertido', 'ochentoso'],
    reglas: [
      'Patrones de lunares y zigzag como fondo de bloques',
      'Contornos negros y sombras sólidas desplazadas',
      'Mezcla de 3 colores pop con fondo claro',
      'Los elementos pueden estar levemente rotados',
    ],
    paletas: ['memphis', 'caramelo'],
    fuentes: [['unbounded', 'nunito'], ['syne', 'dm_sans'], ['anton', 'nunito']],
    pesoTitulos: 700, radio: 'suave', elevacion: 'dura', bordes: 'marcado', boton: 'sombra_dura', movimiento: 'expresivo',
    direccionBase: 'jugueton',
    css: `
& { --deco-1: #00B3A6; --deco-2: #FFD23F; --deco-3: #7B5CFF; }
& .pg-card:nth-child(odd) { transform: rotate(-1.2deg); }
& .pg-card:nth-child(even) { transform: rotate(1deg); }
& .pg-media { background-color: var(--deco-2); background-image: radial-gradient(var(--color-texto) 2.5px, transparent 3px); background-size: 18px 18px; border: 2px solid var(--color-texto); box-shadow: 6px 6px 0 var(--deco-3); }
& .pg-deco .a { position: absolute; width: 160px; height: 40px; top: 12%; right: 8%; background: linear-gradient(135deg, var(--deco-1) 25%, transparent 25%) -20px 0, linear-gradient(225deg, var(--deco-1) 25%, transparent 25%) -20px 0; background-size: 40px 40px; }
& .pg-deco .b { position: absolute; width: 90px; aspect-ratio: 1; border-radius: 50%; border: 10px solid var(--deco-3); bottom: 12%; left: 5%; }
& .pg-deco .c { position: absolute; width: 120px; height: 120px; background-image: radial-gradient(var(--deco-1) 3px, transparent 3.5px); background-size: 16px 16px; bottom: 25%; right: 4%; }
`,
  },
  neobrutalismo: {
    nombre: 'Neobrutalismo',
    descripcion: 'Bordes negros gruesos, sombras sólidas, colores planos',
    palabrasClave: ['directo', 'crudo', 'atrevido'],
    reglas: [
      'Todo tiene borde negro de 2–3px',
      'Sombras sólidas desplazadas, nunca difusas',
      'Colores planos y saturados, sin degradados',
      'Al pasar el mouse, los elementos se "despegan" corriéndose en diagonal',
    ],
    paletas: ['alto_contraste', 'caramelo', 'memphis'],
    fuentes: [['archivo', 'ibm_plex_sans'], ['space_grotesk', 'inter'], ['anton', 'work_sans']],
    pesoTitulos: 800, radio: 'apenas_suave', elevacion: 'dura', bordes: 'marcado', boton: 'sombra_dura', movimiento: 'rapido',
    direccionBase: 'brutalista',
    css: `
& { --deco-1: #FFD23F; --deco-2: #7BDFF2; --deco-3: #B8F2A0; }
& .pg-card { border: 3px solid var(--color-texto); box-shadow: 6px 6px 0 var(--color-texto); }
& .pg-card:nth-child(3n+1) { background: var(--deco-1); }
& .pg-card:nth-child(3n+2) { background: var(--deco-2); }
& .pg-card:nth-child(3n+3) { background: var(--deco-3); }
& .pg-card, & .pg-card .pg-etiqueta { color: #111111; }
& .pg-media { background: var(--color-acento); border: 3px solid var(--color-texto); box-shadow: 8px 8px 0 var(--color-texto); }
& .pg-etiqueta { display: inline-block; align-self: flex-start; background: var(--color-fondo); border: 2px solid var(--color-texto); padding: 2px 8px; }
`,
  },
  vidrio: {
    nombre: 'Vidrio',
    descripcion: 'Paneles translúcidos sobre manchas de color',
    palabrasClave: ['etéreo', 'moderno', 'luminoso'],
    reglas: [
      'Fondo oscuro con 2 o 3 manchas de color muy desenfocadas',
      'Cards translúcidas con desenfoque de fondo (backdrop-filter) y borde fino claro',
      'Texto siempre claro y con buen contraste sobre el vidrio',
      'Sombras suaves, esquinas redondeadas',
    ],
    paletas: ['vidrio', 'oceano'],
    fuentes: [['outfit', 'plus_jakarta'], ['sora', 'inter'], ['manrope', 'manrope']],
    pesoTitulos: 600, radio: 'suave', elevacion: 'suave', bordes: 'sutil', boton: 'relleno', movimiento: 'sutil',
    direccionBase: 'audaz',
    css: `
& { --deco-1: #FF5CA8; --deco-2: #4CC9F0; --deco-3: #7B5CFF; }
& .pg-card, & .pg-nav { background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.16); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); }
& .pg-media { background: linear-gradient(135deg, rgba(255,255,255,.16), rgba(255,255,255,.04)); border: 1px solid rgba(255,255,255,.2); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); }
& .pg-deco > span { position: absolute; border-radius: 50%; filter: blur(70px); opacity: .55; }
& .pg-deco .a { width: 380px; height: 380px; background: var(--deco-1); top: -8%; right: 5%; }
& .pg-deco .b { width: 320px; height: 320px; background: var(--deco-2); bottom: 0; left: -5%; }
& .pg-deco .c { width: 260px; height: 260px; background: var(--deco-3); top: 40%; left: 45%; }
`,
  },
  clay: {
    nombre: 'Clay',
    descripcion: 'Formas infladas y blanditas, como de plastilina',
    palabrasClave: ['blando', 'amigable', 'táctil'],
    reglas: [
      'Esquinas muy redondeadas en todo',
      'Volumen con sombra interna clara arriba y oscura abajo, más sombra externa suave',
      'Colores pastel, sin bordes',
      'Animaciones con rebote',
    ],
    paletas: ['arcilla', 'lavanda', 'menta'],
    fuentes: [['nunito', 'nunito'], ['quicksand', 'nunito'], ['dm_sans', 'dm_sans']],
    pesoTitulos: 800, radio: 'pildora', elevacion: 'marcada', bordes: 'ninguno', boton: 'elevado', movimiento: 'expresivo',
    direccionBase: 'calido',
    css: `
& { --deco-1: #FFB4C8; --deco-2: #A6E3E9; --deco-3: #CDB4FF; }
& .pg-card { border: none; border-radius: 28px; background: var(--color-superficie); box-shadow: inset 6px 6px 12px rgba(255,255,255,.85), inset -8px -8px 16px rgba(0,0,0,.06), 14px 18px 36px rgba(43,45,66,.14); }
& .pg-media { border-radius: 36px; background: var(--deco-3); box-shadow: inset 10px 10px 20px rgba(255,255,255,.6), inset -12px -12px 24px rgba(0,0,0,.1), 18px 24px 44px rgba(43,45,66,.18); }
& .pg-boton { box-shadow: inset 4px 4px 8px rgba(255,255,255,.35), inset -4px -4px 8px rgba(0,0,0,.18), 8px 10px 22px rgba(43,45,66,.22); border: none; }
& .pg-deco .a { position: absolute; width: 110px; aspect-ratio: 1; border-radius: 50%; background: var(--deco-1); top: 10%; right: 8%; box-shadow: inset 8px 8px 16px rgba(255,255,255,.6), inset -10px -10px 20px rgba(0,0,0,.1); }
& .pg-deco .b { position: absolute; width: 70px; aspect-ratio: 1; border-radius: 50%; background: var(--deco-2); bottom: 14%; left: 6%; box-shadow: inset 6px 6px 12px rgba(255,255,255,.6), inset -8px -8px 16px rgba(0,0,0,.1); }
`,
  },
  retro_os: {
    nombre: 'Sistema retro',
    descripcion: 'Ventanas con biseles, como una computadora de los 90',
    palabrasClave: ['nostálgico', 'pixelado', 'ventanas'],
    reglas: [
      'Paneles como ventanas: barra de título de color y bordes biselados (claro arriba-izquierda, oscuro abajo-derecha)',
      'Botones biselados que se "hunden" al presionar',
      'Sin esquinas redondeadas ni sombras difusas',
      'Títulos en fuente pixelada; texto en una sans legible',
    ],
    paletas: ['retro_gris'],
    fuentes: [['vt323', 'ibm_plex_sans'], ['space_mono', 'space_mono'], ['vt323', 'space_mono']],
    pesoTitulos: 400, radio: 'recto', elevacion: 'plana', bordes: 'ninguno', boton: 'relleno', movimiento: 'minimo',
    direccionBase: 'tecnico',
    css: `
& { background: #008080; }
& .pg-card, & .pg-media, & .pg-nav { background: var(--color-fondo); border: 2px solid; border-color: #FFFFFF #404040 #404040 #FFFFFF; box-shadow: 1px 1px 0 #000; border-radius: 0; }
& .pg-card { padding-top: 34px !important; position: relative; }
& .pg-card::before { content: ''; position: absolute; left: 3px; right: 3px; top: 3px; height: 22px; background: linear-gradient(90deg, var(--color-acento), #1084D0); }
& .pg-hero { background: var(--color-fondo); border: 2px solid; border-color: #FFFFFF #404040 #404040 #FFFFFF; padding: 24px; }
& .pg-boton, & .pg-boton-sec { border-radius: 0; border: 2px solid; border-color: #FFFFFF #404040 #404040 #FFFFFF; box-shadow: 1px 1px 0 #000; }
& .pg-boton-sec { background: var(--color-fondo); color: var(--color-texto); }
& .pg-boton:active, & .pg-boton-sec:active { border-color: #404040 #FFFFFF #FFFFFF #404040; }
& .pg-media { background-image: linear-gradient(45deg, #C0C0C0 25%, transparent 25%, transparent 75%, #C0C0C0 75%), linear-gradient(45deg, #C0C0C0 25%, transparent 25%, transparent 75%, #C0C0C0 75%); background-size: 16px 16px; background-position: 0 0, 8px 8px; }
`,
  },
  terminal: {
    nombre: 'Terminal',
    descripcion: 'Fósforo sobre negro, líneas de escaneo y cursor',
    palabrasClave: ['hacker', 'técnico', 'retro'],
    reglas: [
      'Todo en fuente monoespaciada',
      'Un solo color de texto brillante sobre negro, con un leve resplandor',
      'Líneas de escaneo horizontales muy sutiles sobre la pantalla',
      'Los títulos llevan un prompt "> " y un cursor que parpadea',
    ],
    paletas: ['fosforo_verde', 'fosforo_ambar'],
    fuentes: [['jetbrains_mono', 'jetbrains_mono'], ['vt323', 'jetbrains_mono'], ['space_mono', 'jetbrains_mono']],
    pesoTitulos: 700, radio: 'recto', elevacion: 'plana', bordes: 'sutil', boton: 'contorno', movimiento: 'rapido',
    direccionBase: 'tecnico',
    css: `
& .pg-titulo, & .pg-marca { text-shadow: 0 0 12px color-mix(in srgb, var(--color-acento) 55%, transparent); }
& .pg-titulo::before { content: '> '; color: var(--color-acento); }
& .pg-titulo::after { content: '_'; color: var(--color-acento); animation: pg-cursor 1s steps(1) infinite; }
@keyframes pg-cursor { 50% { opacity: 0; } }
& .pg-card { border: 1px dashed var(--color-borde); background: transparent; box-shadow: none; }
& .pg-media { background: repeating-linear-gradient(0deg, var(--color-superficie) 0 3px, transparent 3px 6px); border: 1px solid var(--color-borde); }
& .pg-deco { background: repeating-linear-gradient(0deg, rgba(255,255,255,.035) 0 1px, transparent 1px 3px); z-index: 3; }
`,
  },
  editorial: {
    nombre: 'Editorial',
    descripcion: 'Como una revista impresa: filetes, columnas y serif',
    palabrasClave: ['culto', 'pausado', 'impreso'],
    reglas: [
      'Filetes (líneas finas) separan las secciones en lugar de cards con fondo',
      'Títulos serif grandes; bajada en cursiva',
      'Letra capital en el primer párrafo',
      'Mucho aire y columnas de texto angostas',
    ],
    paletas: ['papel', 'arena', 'grafito'],
    fuentes: [['instrument_serif', 'source_serif'], ['playfair', 'lora'], ['dm_serif', 'inter']],
    pesoTitulos: 400, radio: 'recto', elevacion: 'plana', bordes: 'ninguno', boton: 'contorno', movimiento: 'sutil',
    direccionBase: 'editorial',
    css: `
& .pg-card { background: transparent; box-shadow: none; border: none; border-top: 1px solid var(--color-texto); border-radius: 0; padding-left: 0 !important; padding-right: 0 !important; }
& .pg-bajada { font-style: italic; }
& .pg-bajada::first-letter { float: left; font-family: var(--fuente-titulos); font-size: 3.4em; line-height: 0.85; padding-right: 8px; font-style: normal; color: var(--color-acento); }
& .pg-etiqueta { font-style: italic; text-transform: none; letter-spacing: 0; font-weight: 400; }
& .pg-media { background: var(--color-superficie); border: 1px solid var(--color-texto); }
& .pg-nav { border-bottom: 3px double var(--color-texto); }
`,
  },
  art_deco: {
    nombre: 'Art déco',
    descripcion: 'Dorado sobre negro, simetría y líneas dobles',
    palabrasClave: ['elegante', 'simétrico', 'glamoroso'],
    reglas: [
      'Composición simétrica y centrada',
      'Marcos dorados de línea doble',
      'Títulos en mayúsculas con mucho espaciado entre letras',
      'Abanicos y rayos como decoración, muy sutiles',
    ],
    paletas: ['noche_dorada'],
    fuentes: [['poiret_one', 'inter'], ['playfair', 'lora'], ['dm_serif', 'source_serif']],
    pesoTitulos: 400, radio: 'recto', elevacion: 'plana', bordes: 'sutil', boton: 'contorno', movimiento: 'sutil',
    direccionBase: 'lujoso',
    css: `
& .pg-titulo, & .pg-marca { text-transform: uppercase; letter-spacing: 0.12em; }
& .pg-hero { text-align: center; align-items: center; }
& .pg-card { border: 3px double var(--color-acento); background: transparent; box-shadow: none; text-align: center; align-items: center; }
& .pg-media { border: 3px double var(--color-acento); background: repeating-conic-gradient(from 0deg at 50% 100%, color-mix(in srgb, var(--color-acento) 26%, transparent) 0deg 4deg, transparent 4deg 12deg); }
& .pg-deco { background: repeating-conic-gradient(from 0deg at 50% 0%, color-mix(in srgb, var(--color-acento) 7%, transparent) 0deg 3deg, transparent 3deg 9deg); }
& .pg-boton, & .pg-boton-sec { letter-spacing: 0.14em; text-transform: uppercase; }
`,
  },
  y2k: {
    nombre: 'Y2K',
    descripcion: 'Cromo, destellos y burbujas del 2000',
    palabrasClave: ['futurista', 'brillante', 'dosmilero'],
    reglas: [
      'Brillos metálicos tipo cromo en los botones',
      'Destellos (estrellas de 4 puntas) como decoración',
      'Formas de píldora y burbuja',
      'Títulos con degradado entre el texto y el acento (siempre legible)',
    ],
    paletas: ['cromo', 'lavanda'],
    fuentes: [['syne', 'manrope'], ['unbounded', 'dm_sans'], ['outfit', 'outfit']],
    pesoTitulos: 800, radio: 'pildora', elevacion: 'marcada', bordes: 'sutil', boton: 'elevado', movimiento: 'expresivo',
    direccionBase: 'jugueton',
    css: `
& { --deco-1: #FF6FD8; --deco-2: #3EE6FF; --deco-3: #B9B9D9; }
& .pg-titulo { background: linear-gradient(100deg, var(--color-texto) 30%, var(--color-acento)); -webkit-background-clip: text; background-clip: text; color: transparent; }
& .pg-boton { background-image: linear-gradient(180deg, rgba(255,255,255,.45), rgba(255,255,255,0) 50%); }
& .pg-media { background: radial-gradient(circle at 30% 30%, #FFFFFF, var(--deco-3) 40%, var(--deco-2) 75%, var(--deco-1)); border-radius: 999px; }
& .pg-deco > span::before { content: '\\2726'; position: absolute; color: var(--color-acento); }
& .pg-deco .a::before { top: 10%; right: 10%; font-size: 48px; }
& .pg-deco .b::before { top: 55%; left: 4%; font-size: 30px; }
& .pg-deco .c::before { bottom: 8%; right: 30%; font-size: 22px; }
& .pg-deco > span { position: absolute; inset: 0; }
`,
  },
  organico: {
    nombre: 'Orgánico',
    descripcion: 'Formas de gota, grano y tonos tierra',
    palabrasClave: ['natural', 'cálido', 'artesanal'],
    reglas: [
      'Formas irregulares tipo gota en lugar de rectángulos',
      'Textura de grano muy sutil sobre el fondo',
      'Tonos tierra y verdes apagados',
      'Serif suave en títulos',
    ],
    paletas: ['arena', 'menta', 'coral_calido'],
    fuentes: [['fraunces', 'dm_sans'], ['lora', 'nunito'], ['fraunces', 'work_sans']],
    pesoTitulos: 600, radio: 'pildora', elevacion: 'suave', bordes: 'ninguno', boton: 'relleno', movimiento: 'sutil',
    direccionBase: 'calido',
    css: `
& { --deco-1: #C9A27E; --deco-2: #9DB89A; --deco-3: #E8C9A9; }
& .pg-media { border-radius: 58% 42% 46% 54% / 52% 44% 56% 48%; background: var(--deco-2); }
& .pg-card { border-radius: 32px 32px 32px 8px; }
& .pg-deco { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.07'/%3E%3C/svg%3E"); z-index: 3; }
& .pg-deco .a { position: absolute; width: 220px; height: 200px; border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%; background: var(--deco-3); top: 6%; right: -40px; opacity: .7; }
& .pg-deco .b { position: absolute; width: 140px; height: 160px; border-radius: 45% 55% 40% 60% / 55% 45% 60% 40%; background: var(--deco-1); bottom: 8%; left: -30px; opacity: .45; }
`,
  },
  minimal_tecnico: {
    nombre: 'Minimal tecnológico',
    descripcion: 'Líneas finas, mucho aire y detalles de código',
    palabrasClave: ['preciso', 'limpio', 'producto digital'],
    reglas: [
      'Bordes de 1px en lugar de sombras; las sombras, si hay, casi invisibles',
      'Mucho espacio en blanco y una sola columna de lectura en el hero',
      'Etiquetas y números en monoespaciada, chicas y en mayúsculas',
      'Un solo acento, usado en el botón principal y en detalles mínimos',
    ],
    paletas: ['azul_electrico', 'grafito', 'alto_contraste'],
    fuentes: [['inter', 'inter'], ['manrope', 'inter'], ['ibm_plex_sans', 'ibm_plex_sans']],
    pesoTitulos: 600, radio: 'apenas_suave', elevacion: 'plana', bordes: 'sutil', boton: 'relleno', movimiento: 'rapido',
    direccionBase: 'tecnico',
    css: `
& .pg-titulo { letter-spacing: -0.035em; }
& .pg-etiqueta { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; }
& .pg-etiqueta::before { content: '// '; color: var(--color-acento); }
& .pg-card { background: var(--color-fondo); border: 1px solid var(--color-borde); box-shadow: none; }
& .pg-card:hover { border-color: var(--color-texto-suave); }
& .pg-media { background-color: var(--color-superficie); border: 1px solid var(--color-borde); background-image: radial-gradient(var(--color-borde) 1px, transparent 1px); background-size: 16px 16px; }
& .pg-deco { background-image: linear-gradient(var(--color-borde) 1px, transparent 1px); background-size: 100% 96px; opacity: .35; mask-image: linear-gradient(transparent, #000 30%, transparent); -webkit-mask-image: linear-gradient(transparent, #000 30%, transparent); }
`,
  },
  oscuro_precision: {
    nombre: 'Oscuro de precisión',
    descripcion: 'Fondo casi negro, bordes que brillan y degradés sutiles',
    palabrasClave: ['nocturno', 'premium', 'herramienta'],
    reglas: [
      'Fondo casi negro; las superficies se separan con bordes de 1px más claros, no con sombras',
      'Un resplandor suave del acento detrás del hero, nunca detrás del texto largo',
      'Títulos sólidos, apretados y en peso medio; el brillo queda para bordes y botones',
      'Animaciones cortas y precisas; nada rebota',
    ],
    paletas: ['oceano', 'tinta_y_lima', 'vidrio'],
    fuentes: [['inter', 'inter'], ['sora', 'inter'], ['space_grotesk', 'ibm_plex_sans']],
    pesoTitulos: 600, radio: 'suave', elevacion: 'plana', bordes: 'sutil', boton: 'relleno', movimiento: 'rapido',
    direccionBase: 'tecnico',
    css: `
& .pg-titulo { letter-spacing: -0.03em; }
& .pg-card { background: linear-gradient(180deg, var(--color-superficie-alta), var(--color-superficie)); border: 1px solid var(--color-borde); box-shadow: inset 0 1px 0 rgba(255,255,255,.06); }
& .pg-card:hover { border-color: color-mix(in srgb, var(--color-acento) 50%, var(--color-borde)); }
& .pg-boton { box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-acento) 60%, transparent), 0 8px 24px -8px var(--color-acento); }
& .pg-media { background: radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--color-acento) 45%, transparent), transparent 70%), var(--color-superficie); border: 1px solid var(--color-borde); }
& .pg-deco { background: radial-gradient(ellipse 60% 40% at 50% 0%, color-mix(in srgb, var(--color-acento) 22%, transparent), transparent 70%); }
`,
  },
  producto_amable: {
    nombre: 'Producto amable',
    descripcion: 'Redondeado, colores suaves y formas simples',
    palabrasClave: ['cercano', 'simple', 'para todos'],
    reglas: [
      'Esquinas bien redondeadas en todo, botones en píldora',
      'Fondos de color muy suaves para separar secciones y cards',
      'Formas simples de colores como ilustración, nunca fotos de stock',
      'Textos cortos y cálidos; títulos grandes pero no apretados',
    ],
    paletas: ['lavanda', 'menta', 'coral_calido'],
    fuentes: [['plus_jakarta', 'plus_jakarta'], ['nunito', 'nunito'], ['outfit', 'dm_sans']],
    pesoTitulos: 700, radio: 'pildora', elevacion: 'suave', bordes: 'ninguno', boton: 'relleno', movimiento: 'sutil',
    direccionBase: 'jugueton',
    css: `
& { --deco-1: color-mix(in srgb, var(--color-acento) 30%, #FFFFFF); --deco-2: #FFD9A8; --deco-3: #BFE8D4; }
& .pg-card { border-radius: 24px; box-shadow: 0 1px 2px rgba(0,0,0,.04); }
& .pg-card:nth-child(3n+1) { background: color-mix(in srgb, var(--deco-1) 35%, var(--color-fondo)); }
& .pg-card:nth-child(3n+2) { background: color-mix(in srgb, var(--deco-2) 35%, var(--color-fondo)); }
& .pg-card:nth-child(3n) { background: color-mix(in srgb, var(--deco-3) 40%, var(--color-fondo)); }
& .pg-media { border-radius: 32px; background: radial-gradient(circle at 30% 35%, var(--deco-2) 0 18%, transparent 19%), radial-gradient(circle at 70% 60%, var(--deco-3) 0 24%, transparent 25%), var(--deco-1); }
& .pg-etiqueta { border-radius: 999px; padding: 4px 12px; background: color-mix(in srgb, var(--color-acento) 14%, transparent); color: var(--color-texto); }
`,
  },
};

export interface Layout {
  nombre: string;
  descripcion: string;
  /** Cómo se arma, para que la IA lo reproduzca. */
  estructura: string;
}

export const LAYOUTS: Record<LayoutId, Layout> = {
  hero_partido: { nombre: 'Hero partido', descripcion: 'Texto a un lado, visual grande al otro', estructura: 'Barra superior; hero en 2 columnas (texto 55% con título, bajada y botones; visual 45%); debajo, fila de 3–4 cards. En celular, una columna.' },
  bento: { nombre: 'Bento', descripcion: 'Grilla de bloques de distintos tamaños', estructura: 'Grilla de 4 columnas: el bloque principal (título, bajada, botones) ocupa 3×2, un visual alto 1×2 y cards de 1 o 2 columnas debajo. En celular, 2 columnas.' },
  revista: { nombre: 'Revista', descripcion: 'Columnas asimétricas, número grande y cita', estructura: 'Tres columnas asimétricas: número enorme en el color de acento, título con etiqueta arriba, y columna angosta con bajada y botones; debajo, una cita grande en cursiva separada por un filete.' },
  tipografico: { nombre: 'Afiche tipográfico', descripcion: 'El título ocupa toda la pantalla', estructura: 'El título ocupa todo el ancho, gigante y apretado; abajo, separado por un filete, la bajada a la izquierda y los botones a la derecha. Navegación mínima.' },
  cinta: { nombre: 'Cinta en movimiento', descripcion: 'Una franja de texto que corre sin parar', estructura: 'Hero centrado; debajo, una franja inclinada del color de acento con texto en mayúsculas que se desplaza en loop (se detiene con movimiento reducido); después, fila de cards.' },
  apiladas: { nombre: 'Tarjetas apiladas', descripcion: 'Tarjetas superpuestas y giradas', estructura: 'Hero en 2 columnas: texto a la izquierda; a la derecha, 3 cards superpuestas, levemente giradas y con sombra fuerte.' },
  indice: { nombre: 'Índice', descripcion: 'Lista numerada tipo tabla de contenidos', estructura: '2 columnas: título, bajada y botones a la izquierda; a la derecha, lista numerada con filetes entre filas y una flecha; al pasar el mouse, la fila se corre y toma el color de acento.' },
  panel_fijo: { nombre: 'Panel fijo', descripcion: 'Un panel de color fijo y el contenido al lado', estructura: 'Pantalla partida: panel del color de acento a la izquierda con marca y título grande; a la derecha, bajada, botones y cards en columna. En celular, el panel queda arriba.' },
  mosaico: { nombre: 'Mosaico', descripcion: 'Muchas piezas visuales de alturas distintas', estructura: 'Hero centrado corto; debajo, mosaico tipo masonry de 3 columnas que alterna visuales de distintas alturas y cards.' },
  minimo: { nombre: 'Mínimo centrado', descripcion: 'Casi nada en pantalla, mucho aire', estructura: 'Todo centrado en una sola pantalla: etiqueta con la marca, título mediano, bajada y botones, con muchísimo espacio alrededor.' },
  app_lateral: { nombre: 'App con menú lateral', descripcion: 'Menú a la izquierda e indicadores', estructura: 'Menú lateral de 220px con la sección activa resaltada; contenido con cabecera (título y botones), fila de 3 indicadores grandes y un bloque de gráfico. En celular, el menú pasa arriba.' },
  horizontal: { nombre: 'Paneles horizontales', descripcion: 'Bloques que se recorren de costado', estructura: 'Hero arriba; debajo, una fila de paneles con scroll horizontal y snap, cada uno con etiqueta, título, texto y un visual.' },
};

/** CSS de un estilo con `&` reemplazado por el selector de raíz dado. */
export const cssDeEstilo = (id: EstiloId, raiz: string) =>
  ESTILOS[id].css
    .trim()
    .replace(/&/g, raiz);
