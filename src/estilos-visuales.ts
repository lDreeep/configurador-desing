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
& .pg-titulo::before { content: '> '; color: var(--color-acento-texto); }
& .pg-titulo::after { content: '_'; color: var(--color-acento-texto); animation: pg-cursor 1s steps(1) infinite; }
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
& .pg-bajada::first-letter { float: left; font-family: var(--fuente-titulos); font-size: 3.4em; line-height: 0.85; padding-right: 8px; font-style: normal; color: var(--color-acento-texto); }
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
& .pg-deco > span::before { content: '\\2726'; position: absolute; color: var(--color-acento-texto); }
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
    paletas: ['arena', 'menta', 'coral_calido', 'terracota', 'oliva'],
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
& .pg-etiqueta::before { content: '// '; color: var(--color-acento-texto); }
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
    paletas: ['oceano', 'tinta_y_lima', 'vidrio', 'medianoche_violeta', 'bosque_noche'],
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
    paletas: ['lavanda', 'menta', 'coral_calido', 'durazno', 'uva', 'cielo'],
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
  periodico: {
    nombre: 'Diario',
    descripcion: 'Columnas, filetes finos y titulares de diario',
    palabrasClave: ['informativo', 'clásico', 'denso'],
    reglas: [
      'Titulares en serif grande y apretado; texto en columnas angostas',
      'Filetes (líneas finas) separan secciones en lugar de cajas',
      'Casi sin color: tinta sobre papel, el acento solo en una etiqueta o un link',
      'Fechas y secciones en mayúsculas chicas',
    ],
    paletas: ['papel', 'alto_contraste', 'retro_gris'],
    fuentes: [['playfair', 'source_serif'], ['libre_baskerville', 'lora'], ['dm_serif', 'source_serif']],
    pesoTitulos: 800, radio: 'recto', elevacion: 'plana', bordes: 'sutil', boton: 'contorno', movimiento: 'minimo',
    direccionBase: 'editorial',
    css: `
& .pg-titulo { letter-spacing: -0.02em; line-height: 0.98; }
& .pg-nav { border-bottom: 3px double var(--color-texto); }
& .pg-etiqueta { font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; border-top: 1px solid var(--color-texto); border-bottom: 1px solid var(--color-texto); padding: 3px 0; }
& .pg-card { background: var(--color-fondo); box-shadow: none; border-radius: 0; border-top: 1px solid var(--color-texto); }
& .pg-bajada { column-count: 2; column-gap: 24px; column-rule: 1px solid var(--color-borde); }
& .pg-media { background: repeating-linear-gradient(0deg, var(--color-borde) 0 1px, transparent 1px 6px), var(--color-superficie); filter: grayscale(1); border-radius: 0; }
`,
  },
  japones: {
    nombre: 'Calma japonesa',
    descripcion: 'Mucho vacío, asimetría y tonos naturales',
    palabrasClave: ['sereno', 'esencial', 'natural'],
    reglas: [
      'El espacio vacío es protagonista: márgenes enormes y pocos elementos',
      'Composición asimétrica, nada perfectamente centrado',
      'Tonos naturales apagados y un solo acento tipo sello',
      'Líneas finísimas, sin sombras, animaciones lentas y suaves',
    ],
    paletas: ['arena', 'papel', 'menta', 'oliva'],
    fuentes: [['cormorant', 'work_sans'], ['instrument_serif', 'dm_sans'], ['lora', 'work_sans']],
    pesoTitulos: 400, radio: 'apenas_suave', elevacion: 'plana', bordes: 'sutil', boton: 'contorno', movimiento: 'sutil',
    direccionBase: 'calmo',
    css: `
& { --deco-1: #B23A2E; }
& .pg-titulo { font-weight: 400; letter-spacing: 0.01em; }
& .pg-hero { padding-top: 12vh; }
& .pg-card { background: var(--color-fondo); box-shadow: none; border: none; border-left: 1px solid var(--color-borde); border-radius: 0; }
& .pg-etiqueta { letter-spacing: 0.3em; font-size: 11px; color: var(--color-texto-suave); }
& .pg-media { background: var(--color-superficie); border-radius: 0; box-shadow: inset 0 0 0 1px var(--color-borde); }
& .pg-deco .a { position: absolute; top: 14%; right: 12%; width: 56px; height: 56px; border-radius: 50%; background: var(--deco-1); opacity: .85; }
`,
  },
  dopamina: {
    nombre: 'Dopamina',
    descripcion: 'Colores saturados, formas grandes y mucha energía',
    palabrasClave: ['alegre', 'vibrante', 'joven'],
    reglas: [
      'Varios colores saturados juntos, sin miedo',
      'Formas grandes y redondeadas, como stickers',
      'Títulos enormes y gruesos; botones en píldora',
      'Movimiento con rebote al tocar y al aparecer',
    ],
    paletas: ['caramelo', 'memphis', 'coral_calido', 'rosa_chicle'],
    fuentes: [['unbounded', 'dm_sans'], ['bricolage', 'nunito'], ['syne', 'outfit']],
    pesoTitulos: 800, radio: 'pildora', elevacion: 'suave', bordes: 'ninguno', boton: 'relleno', movimiento: 'expresivo',
    direccionBase: 'jugueton',
    css: `
& { --deco-1: #FF5FA2; --deco-2: #FFD23F; --deco-3: #3BCEAC; --deco-4: #7B5CFF; }
& .pg-card:nth-child(4n+1) { background: color-mix(in srgb, var(--deco-1) 22%, var(--color-fondo)); }
& .pg-card:nth-child(4n+2) { background: color-mix(in srgb, var(--deco-2) 30%, var(--color-fondo)); }
& .pg-card:nth-child(4n+3) { background: color-mix(in srgb, var(--deco-3) 25%, var(--color-fondo)); }
& .pg-card:nth-child(4n) { background: color-mix(in srgb, var(--deco-4) 20%, var(--color-fondo)); }
& .pg-card { border-radius: 28px; }
& .pg-media { border-radius: 40px; background: radial-gradient(circle at 25% 30%, var(--deco-2) 0 22%, transparent 23%), radial-gradient(circle at 75% 70%, var(--deco-3) 0 26%, transparent 27%), var(--deco-1); }
& .pg-deco .a { position: absolute; top: 8%; right: 6%; width: 90px; height: 90px; border-radius: 50%; background: var(--deco-2); }
& .pg-deco .b { position: absolute; bottom: 10%; left: 4%; width: 70px; height: 70px; border-radius: 22px; background: var(--deco-4); transform: rotate(14deg); }
`,
  },
  lujo: {
    nombre: 'Lujo sobrio',
    descripcion: 'Oscuro, dorado discreto y tipografía fina',
    palabrasClave: ['exclusivo', 'elegante', 'premium'],
    reglas: [
      'Fondo oscuro profundo; el dorado solo en detalles finos',
      'Serif fina y grande, mucho espacio entre letras en etiquetas',
      'Nada de sombras marcadas ni colores vivos',
      'Animaciones lentas, que aparecen con calma',
    ],
    paletas: ['noche_dorada', 'vino', 'grafito', 'arena'],
    fuentes: [['cormorant', 'manrope'], ['playfair', 'inter'], ['poiret_one', 'manrope']],
    pesoTitulos: 500, radio: 'recto', elevacion: 'plana', bordes: 'sutil', boton: 'contorno', movimiento: 'sutil',
    direccionBase: 'lujoso',
    css: `
& .pg-titulo { font-weight: 400; letter-spacing: 0.01em; }
& .pg-etiqueta { letter-spacing: 0.32em; text-transform: uppercase; font-size: 11px; color: var(--color-acento-texto); }
& .pg-card { background: var(--color-fondo); box-shadow: none; border: 1px solid color-mix(in srgb, var(--color-acento) 35%, transparent); border-radius: 0; }
& .pg-boton { letter-spacing: 0.16em; text-transform: uppercase; font-size: 13px; }
& .pg-media { border-radius: 0; background: linear-gradient(160deg, color-mix(in srgb, var(--color-acento) 30%, var(--color-superficie)), var(--color-superficie) 60%); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-acento) 40%, transparent); }
& .pg-deco { background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-acento) 30%, transparent), transparent) center 72px / 100% 1px no-repeat; }
`,
  },
  cyber: {
    nombre: 'Cyber',
    descripcion: 'Neón sobre negro, cortes en diagonal y líneas de escaneo',
    palabrasClave: ['futurista', 'gamer', 'tecnológico'],
    reglas: [
      'Fondo negro con un solo neón fuerte; nada de pasteles',
      'Esquinas cortadas en diagonal en lugar de redondeadas',
      'Etiquetas en monoespaciada y mayúsculas',
      'Brillos y líneas de escaneo muy sutiles; nunca sobre el texto largo',
    ],
    paletas: ['tinta_y_lima', 'fosforo_verde', 'vidrio', 'carbon_coral'],
    fuentes: [['space_grotesk', 'jetbrains_mono'], ['unbounded', 'ibm_plex_sans'], ['silkscreen', 'jetbrains_mono']],
    pesoTitulos: 700, radio: 'recto', elevacion: 'plana', bordes: 'marcado', boton: 'relleno', movimiento: 'rapido',
    direccionBase: 'tecnico',
    css: `
& .pg-titulo { text-transform: uppercase; letter-spacing: 0.02em; text-shadow: 0 0 18px color-mix(in srgb, var(--color-acento) 45%, transparent); }
& .pg-etiqueta { font-family: 'JetBrains Mono', ui-monospace, monospace; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-acento-texto); }
& .pg-card { border-radius: 0; background: var(--color-superficie); border: 1px solid color-mix(in srgb, var(--color-acento) 45%, var(--color-borde)); clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px)); box-shadow: none; }
& .pg-boton { clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px)); border-radius: 0; }
& .pg-media { border-radius: 0; background: repeating-linear-gradient(0deg, color-mix(in srgb, var(--color-acento) 14%, transparent) 0 1px, transparent 1px 4px), linear-gradient(135deg, color-mix(in srgb, var(--color-acento) 30%, var(--color-superficie)), var(--color-superficie)); clip-path: polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 28px 100%, 0 calc(100% - 28px)); }
& .pg-deco { background: repeating-linear-gradient(0deg, rgba(255,255,255,.025) 0 1px, transparent 1px 3px); }
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
  hero_partido: { nombre: 'Hero partido', descripcion: 'Texto a un lado, visual grande al otro', estructura: 'Barra superior; hero en 2 columnas (texto 55% con título, bajada y botones; visual 45%); debajo, fila de 3–4 cards. En celular, una columna. Después, una sección «recorrido» con scroll interactivo: a la izquierda 4 pasos de texto (cada uno de unos 70vh); a la derecha un visual fijo (position: sticky) con 4 capas que cambian a medida que se baja, una por paso, con CSS scroll-driven animations (view-timeline-name en cada paso, timeline-scope en la sección, animation-timeline en cada capa) y una barrita de progreso; en celular el visual queda arriba y los pasos pasan por debajo. Envolverlo en @supports (animation-timeline: view()) y @media (prefers-reduced-motion: no-preference): sin soporte se ve el primer visual quieto. El contenedor no puede tener overflow: hidden (usar clip).' },
  bento: { nombre: 'Bento', descripcion: 'Grilla de bloques de distintos tamaños', estructura: 'Grilla de 4 columnas: el bloque principal (título, bajada, botones) ocupa 3×2, un visual alto 1×2 y cards de 1 o 2 columnas debajo. En celular, 2 columnas.' },
  revista: { nombre: 'Revista', descripcion: 'Columnas asimétricas, número grande y cita', estructura: 'Tres columnas asimétricas: número enorme en el color de acento, título con etiqueta arriba, y columna angosta con bajada y botones; debajo, una cita grande en cursiva separada por un filete.' },
  tipografico: { nombre: 'Afiche tipográfico', descripcion: 'El título ocupa toda la pantalla', estructura: 'El título ocupa todo el ancho, gigante y apretado; abajo, separado por un filete, la bajada a la izquierda y los botones a la derecha. Navegación mínima. Después, una sección «recorrido» con scroll interactivo: a la izquierda 4 pasos de texto (cada uno de unos 70vh); a la derecha un visual fijo (position: sticky) con 4 capas que cambian a medida que se baja, una por paso, con CSS scroll-driven animations (view-timeline-name en cada paso, timeline-scope en la sección, animation-timeline en cada capa) y una barrita de progreso; en celular el visual queda arriba y los pasos pasan por debajo. Envolverlo en @supports (animation-timeline: view()) y @media (prefers-reduced-motion: no-preference): sin soporte se ve el primer visual quieto. El contenedor no puede tener overflow: hidden (usar clip).' },
  cinta: { nombre: 'Cinta en movimiento', descripcion: 'Una franja de texto que corre sin parar', estructura: 'Hero centrado; debajo, una franja inclinada del color de acento con texto en mayúsculas que se desplaza en loop (se detiene con movimiento reducido); después, fila de cards.' },
  apiladas: { nombre: 'Tarjetas apiladas', descripcion: 'Tarjetas superpuestas y giradas', estructura: 'Hero en 2 columnas: texto a la izquierda; a la derecha, 3 cards superpuestas, levemente giradas y con sombra fuerte.' },
  indice: { nombre: 'Índice', descripcion: 'Lista numerada tipo tabla de contenidos', estructura: '2 columnas: título, bajada y botones a la izquierda; a la derecha, lista numerada con filetes entre filas y una flecha; al pasar el mouse, la fila se corre y toma el color de acento.' },
  panel_fijo: { nombre: 'Panel fijo', descripcion: 'Un panel de color fijo y el contenido al lado', estructura: 'Pantalla partida: panel del color de acento a la izquierda con marca y título grande; a la derecha, bajada, botones y cards en columna. En celular, el panel queda arriba.' },
  mosaico: { nombre: 'Mosaico', descripcion: 'Muchas piezas visuales de alturas distintas', estructura: 'Hero centrado corto; debajo, mosaico tipo masonry de 3 columnas que alterna visuales de distintas alturas y cards.' },
  minimo: { nombre: 'Mínimo centrado', descripcion: 'Casi nada en pantalla, mucho aire', estructura: 'Todo centrado en una sola pantalla: etiqueta con la marca, título mediano, bajada y botones, con muchísimo espacio alrededor. Después, una sección «recorrido» con scroll interactivo: a la izquierda 4 pasos de texto (cada uno de unos 70vh); a la derecha un visual fijo (position: sticky) con 4 capas que cambian a medida que se baja, una por paso, con CSS scroll-driven animations (view-timeline-name en cada paso, timeline-scope en la sección, animation-timeline en cada capa) y una barrita de progreso; en celular el visual queda arriba y los pasos pasan por debajo. Envolverlo en @supports (animation-timeline: view()) y @media (prefers-reduced-motion: no-preference): sin soporte se ve el primer visual quieto. El contenedor no puede tener overflow: hidden (usar clip).' },
  app_lateral: { nombre: 'App con menú lateral', descripcion: 'Menú a la izquierda e indicadores', estructura: 'Menú lateral de 220px con la sección activa resaltada; contenido con cabecera (título y botones), fila de 3 indicadores grandes y un bloque de gráfico. En celular, el menú pasa arriba.' },
  horizontal: { nombre: 'Paneles horizontales', descripcion: 'Bloques que se recorren de costado', estructura: 'Hero arriba; debajo, una fila de paneles con scroll horizontal y snap, cada uno con etiqueta, título, texto y un visual. Con scroll interactivo: la sección mide unos 300vh, la fila de paneles queda fija (position: sticky) y se desplaza de costado a medida que se baja (animation-timeline sobre un view-timeline de la sección, rango contain); sin soporte o con movimiento reducido, la fila se desliza con el dedo como siempre.' },
  galeria: { nombre: 'Galería de productos', descripcion: 'Grilla de productos con foto, nombre y precio', estructura: 'Barra superior; cabecera corta con título a la izquierda y botones a la derecha; debajo, grilla de 4 columnas de productos (foto cuadrada, nombre, detalle y precio en negrita). En celular, 2 columnas.' },
  precios: { nombre: 'Planes y precios', descripcion: 'Tres planes lado a lado, el del medio destacado', estructura: 'Hero centrado con título y bajada; debajo, 3 cards de planes en fila (nombre, precio grande, 3 beneficios con tilde y botón); la del medio más alta, con borde de acento y la etiqueta «Más elegido». En celular, una debajo de la otra.' },
  portada_video: { nombre: 'Portada con video', descripcion: 'Un video o foto a pantalla completa con el título encima', estructura: 'Visual a todo el ancho y casi toda la altura (video en loop sin sonido o foto), con un degradado oscuro abajo; encima, título, bajada y botones en blanco abajo a la izquierda y un botón redondo de «play»; debajo, fila de cards. Después, una sección «recorrido» con scroll interactivo: a la izquierda 4 pasos de texto (cada uno de unos 70vh); a la derecha un visual fijo (position: sticky) con 4 capas que cambian a medida que se baja, una por paso, con CSS scroll-driven animations (view-timeline-name en cada paso, timeline-scope en la sección, animation-timeline en cada capa) y una barrita de progreso; en celular el visual queda arriba y los pasos pasan por debajo. Envolverlo en @supports (animation-timeline: view()) y @media (prefers-reduced-motion: no-preference): sin soporte se ve el primer visual quieto. El contenedor no puede tener overflow: hidden (usar clip).' },
  blog_lateral: { nombre: 'Blog con barra lateral', descripcion: 'Lista de artículos y una columna al costado', estructura: 'Barra superior; cabecera con etiqueta, título y bajada; debajo, 2 columnas: a la izquierda (70%) la lista de artículos (miniatura, tema, título, resumen y minutos de lectura) separados por filetes; a la derecha (30%) una card «Sobre el blog» con botones, chips de temas y una caja para suscribirse. En celular, la columna lateral va abajo.' },
  equipo: { nombre: 'Equipo y testimonios', descripcion: 'Las personas detrás y lo que dicen los clientes', estructura: 'Barra superior; hero centrado con título y bajada; grilla de 4 personas (foto redonda, nombre y rol); debajo, 3 testimonios en cards con la cita entre comillas grandes, nombre y estrellas; al final, los botones centrados. En celular, 2 personas por fila y testimonios en columna.' },
  fondo_protagonista: { nombre: 'Fondo protagonista', descripcion: 'Un fondo con textura a todo el ancho, título encima y una tarjeta flotante', estructura: 'El fondo con textura ocupa casi toda la pantalla (capa decorativa detrás); abajo a la izquierda, etiqueta, título grande y bajada en blanco sobre un velo oscuro que asegura el contraste; a la derecha, una tarjeta flotante con una acción concreta (reservar, elegir fecha, comprar) y el botón principal. En celular la tarjeta va debajo del título. Después, una sección «recorrido» con scroll interactivo: a la izquierda 4 pasos de texto (cada uno de unos 70vh); a la derecha un visual fijo (position: sticky) con 4 capas que cambian a medida que se baja, una por paso, con CSS scroll-driven animations (view-timeline-name en cada paso, timeline-scope en la sección, animation-timeline en cada capa) y una barrita de progreso; en celular el visual queda arriba y los pasos pasan por debajo. Envolverlo en @supports (animation-timeline: view()) y @media (prefers-reduced-motion: no-preference): sin soporte se ve el primer visual quieto. El contenedor no puede tener overflow: hidden (usar clip).' },
  tarjeta_sobre_fondo: { nombre: 'Tarjeta sobre fondo', descripcion: 'Una tarjeta clara centrada sobre un fondo con textura', estructura: 'El fondo con textura cubre todo; en el centro, una tarjeta del color de fondo con sombra, que lleva la marca, el título, la bajada, una lista corta y los botones. Todo el texto va dentro de la tarjeta.' },
  editorial_fondo: { nombre: 'Editorial con fondo', descripcion: 'Texto en una columna clara y el fondo como una lámina al costado', estructura: 'Dos columnas: a la izquierda, sobre el fondo de la página, etiqueta, título serif grande, bajada y botones con mucho aire; a la derecha, el fondo con textura como una lámina grande con una pequeña ficha encima (dato, precio o fecha). Debajo, una fila de cards. Después, una sección «recorrido» con scroll interactivo: a la izquierda 4 pasos de texto (cada uno de unos 70vh); a la derecha un visual fijo (position: sticky) con 4 capas que cambian a medida que se baja, una por paso, con CSS scroll-driven animations (view-timeline-name en cada paso, timeline-scope en la sección, animation-timeline en cada capa) y una barrita de progreso; en celular el visual queda arriba y los pasos pasan por debajo. Envolverlo en @supports (animation-timeline: view()) y @media (prefers-reduced-motion: no-preference): sin soporte se ve el primer visual quieto. El contenedor no puede tener overflow: hidden (usar clip).' },
  widgets_fondo: { nombre: 'Widgets sobre fondo', descripcion: 'Tarjetas de datos flotando sobre un fondo, como una app', estructura: 'El fondo con textura cubre la sección; encima, una grilla de tarjetas translúcidas: una grande con un número protagonista, una con la acción principal y dos chicas con datos. El texto va siempre dentro de las tarjetas.' },
  autor_panaderia: { nombre: 'De autor: panadería', descripcion: 'Foto del horno a sangre, la carta con precios y el horario enorme', estructura: 'Plantilla de autor para un negocio de mostrador. Hero en dos columnas: a la izquierda el título (qué es y dónde), una línea con el dato concreto (a qué hora sale el pan) y dos botones; a la derecha una foto real del producto a sangre, sin nada encima. La carta como lista con nombre, detalle, puntos guía, precio y hora, nunca como tarjetas. Una sección del proceso con texto y tres fotos de tamaños distintos en una grilla de 12 columnas. Una franja del color de acento con el horario en tipografía gigante y la dirección (calle y barrio). Pie con los créditos de las fotos.' },
  autor_finanzas: { nombre: 'De autor: app financiera', descripcion: 'El celular con la app real como protagonista sobre vidrio acanalado', estructura: 'Plantilla de autor para software. Fondo oscuro de vidrio acanalado con un resplandor del acento que se desvanece hacia abajo. Hero: título de una idea concreta, el dato (cómo funciona y cuánto rinde) y dos botones; al costado un celular levemente girado con la interfaz real hecha en HTML (saldo con centavos chicos, accesos, ahorro con barra, movimientos con lo que va al ahorro). Las funciones como pedazos de la app (una notificación, una meta con barra, un gráfico de línea), con tamaños distintos, nunca íconos en tarjetas. Una tabla de costos con números grandes. Sin fotos: en software la interfaz es la imagen.' },
  autor_portfolio: { nombre: 'De autor: portfolio de estudio', descripcion: 'Un índice de proyectos en tipografía grande y fotos en grilla asimétrica', estructura: 'Plantilla de autor para un estudio. Título enorme a lo ancho con la especialidad; abajo, una línea con a quién le trabajan y un botón. El índice de proyectos como lista con nombre en tipografía grande, servicio y año; al pasar el mouse el nombre se corre y aparece la foto del proyecto flotando. Las fotos en una grilla de 12 columnas con tamaños distintos. Cierre en fondo invertido con una frase y el contacto. Pie con los créditos de las fotos.' },
  autor_festival: { nombre: 'De autor: festival', descripcion: 'El nombre gigante sobre manchas de calor y la grilla de artistas', estructura: 'Plantilla de autor para un evento. Fondo violeta noche con manchas de calor (imagen térmica: radiales de amarillo a magenta, desenfocados). Arriba la fecha y el lugar en una línea, el nombre del evento enorme (15% del ancho) y dos botones. La grilla de artistas en tipografía de mayor a menor en tres filas en mayúsculas, separadas con barras de color. Entradas como tabla con la preventa agotada tachada.' },
  autor_correr: { nombre: 'De autor: app para correr', descripcion: 'Un mapa con la ruta sobre curvas de nivel y los datos encima', estructura: 'Plantilla de autor para una app. Hero en dos columnas: el título (qué hace y dónde), la bajada con un dato y dos botones; al lado un mapa grande con curvas de nivel (SVG), la ruta dibujada en el color de acento, inicio y fin marcados, canillas de agua y los datos (km, desnivel) en pastillas abajo. Una franja con el total de la semana en número enorme y un gráfico de barras por día. Tres rutas cercanas con su trazado en miniatura.' },
  autor_cafeteria: { nombre: 'De autor: cafetería', descripcion: 'Foto del espresso, la pizarra de precios y el origen del mes', estructura: 'Plantilla de autor para una cafetería. Hero partido: foto real del oficio a sangre (el espresso saliendo) y el texto con horario y un dato concreto. La carta como pizarra oscura en dos columnas con letra mono, nombre y precio con línea punteada. El café del mes con su origen, notas y precio de la bolsa, y tres fotos del tueste en una grilla de tamaños distintos.' },
  autor_floreria: { nombre: 'De autor: florería', descripcion: 'Collage de fotos superpuestas y un selector de plan que cambia el precio', estructura: 'Plantilla de autor para una suscripción. Hero en dos columnas: título, bajada con cuándo compran y entregan, un botón; al lado un collage de tres fotos superpuestas con sombra suave. Una franja con «¿Cada cuánto?», un selector de frecuencia en píldora que cambia el precio grande, y qué trae el ramo de esta semana.' },
  autor_refugio: { nombre: 'De autor: refugio de montaña', descripcion: 'El paisaje a sangre con la barra de reserva y las habitaciones por su vista', estructura: 'Plantilla de autor para un alojamiento. Hero con el paisaje a sangre y un velo arriba y abajo; el título en blanco abajo a la izquierda; apoyada sobre la foto, una barra de reserva (llegada, salida, huéspedes y botón). Las habitaciones en tres columnas (la primera más ancha) con foto vertical, nombre, para quiénes y precio por noche. Cómo llegar: foto del camino y la distancia en tipografía grande.' },
};

/** CSS de un estilo con `&` reemplazado por el selector de raíz dado. */
export const cssDeEstilo = (id: EstiloId, raiz: string) =>
  ESTILOS[id].css
    .trim()
    .replace(/&/g, raiz);

/** La combinación con la que se diseñó cada plantilla de autor; sobre ella la persona cambia lo que quiera. */
export const RECETAS_AUTOR: Partial<Record<LayoutId, { estilo: EstiloId; paleta: PaletaId; titulos: FuenteId; texto: FuenteId; fondo: 'ninguno' }>> = {
  autor_panaderia: { estilo: 'organico', paleta: 'arena', titulos: 'fraunces', texto: 'work_sans', fondo: 'ninguno' },
  autor_finanzas: { estilo: 'oscuro_precision', paleta: 'tinta_y_lima', titulos: 'sora', texto: 'inter', fondo: 'ninguno' },
  autor_portfolio: { estilo: 'editorial', paleta: 'papel', titulos: 'instrument_serif', texto: 'inter', fondo: 'ninguno' },
  autor_festival: { estilo: 'oscuro_precision', paleta: 'medianoche_violeta', titulos: 'unbounded', texto: 'inter', fondo: 'ninguno' },
  autor_correr: { estilo: 'minimal_tecnico', paleta: 'azul_electrico', titulos: 'space_grotesk', texto: 'inter', fondo: 'ninguno' },
  autor_cafeteria: { estilo: 'editorial', paleta: 'arena', titulos: 'dm_serif', texto: 'work_sans', fondo: 'ninguno' },
  autor_floreria: { estilo: 'japones', paleta: 'menta', titulos: 'cormorant', texto: 'work_sans', fondo: 'ninguno' },
  autor_refugio: { estilo: 'lujo', paleta: 'noche_dorada', titulos: 'cormorant', texto: 'manrope', fondo: 'ninguno' },
};
export const esAutor = (l: LayoutId) => l.startsWith('autor_');

/** La marca de ejemplo de cada plantilla de autor (se usa si la persona no escribió el nombre de su proyecto). */
export const MARCAS_AUTOR: Partial<Record<LayoutId, string>> = {
  autor_panaderia: 'Horno Thames', autor_finanzas: 'Moneda', autor_portfolio: 'Estudio Ferro', autor_festival: 'Infrarrojo',
  autor_correr: 'Ruta', autor_cafeteria: 'Tueste', autor_floreria: 'Flores de Estación', autor_refugio: 'Refugio Lenga',
};
