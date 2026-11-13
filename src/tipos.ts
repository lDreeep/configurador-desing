// Modelo de datos del configurador. Cada campo se corresponde con una
// clave del DESIGN.md exportado (ver DESIGN.md §3).

export type TipoProyecto =
  | 'landing'
  | 'sitio'
  | 'tienda'
  | 'app_web'
  | 'app_movil'
  | 'dashboard'
  | 'portfolio'
  | 'blog';

export type PatronNav =
  | 'barra_superior'
  | 'menu_lateral'
  | 'pestanas_abajo'
  | 'hamburguesa'
  | 'sin_navegacion';

export type DireccionId =
  | 'calmo'
  | 'audaz'
  | 'tecnico'
  | 'calido'
  | 'lujoso'
  | 'jugueton'
  | 'editorial'
  | 'brutalista';

export type PaletaId =
  | 'azul_electrico'
  | 'tinta_y_lima'
  | 'bosque'
  | 'coral_calido'
  | 'noche_dorada'
  | 'caramelo'
  | 'papel'
  | 'alto_contraste'
  | 'lavanda'
  | 'oceano'
  | 'arena'
  | 'grafito'
  | 'menta'
  | 'suizo_rojo'
  | 'bauhaus'
  | 'memphis'
  | 'vidrio'
  | 'arcilla'
  | 'retro_gris'
  | 'fosforo_verde'
  | 'fosforo_ambar'
  | 'cromo'
  | 'durazno'
  | 'cielo'
  | 'uva'
  | 'oliva'
  | 'rosa_chicle'
  | 'terracota'
  | 'medianoche_violeta'
  | 'bosque_noche'
  | 'carbon_coral'
  | 'vino'
  | 'pastel_rosa'
  | 'pastel_celeste'
  | 'pastel_lila'
  | 'pastel_menta'
  | 'tierra_ocre'
  | 'tierra_cuero'
  | 'tierra_barro'
  | 'tierra_musgo'
  | 'neon_rosa'
  | 'neon_cian'
  | 'neon_limon'
  | 'neon_magenta'
  | 'mono_rojo'
  | 'mono_azul'
  | 'mono_verde'
  | 'mono_naranja'
  | 'contraste_amarillo'
  | 'contraste_cian'
  | 'contraste_azul'
  | 'contraste_magenta'
  | 'marina_espuma'
  | 'marina_costa'
  | 'marina_abismo'
  | 'marina_naval'
  | 'frutal_sandia'
  | 'frutal_limon'
  | 'frutal_arandano'
  | 'frutal_mandarina';

export type FuenteId =
  | 'inter'
  | 'dm_sans'
  | 'manrope'
  | 'plus_jakarta'
  | 'work_sans'
  | 'ibm_plex_sans'
  | 'archivo'
  | 'outfit'
  | 'sora'
  | 'space_grotesk'
  | 'syne'
  | 'bricolage'
  | 'unbounded'
  | 'fraunces'
  | 'playfair'
  | 'lora'
  | 'dm_serif'
  | 'instrument_serif'
  | 'source_serif'
  | 'jetbrains_mono'
  | 'space_mono'
  | 'nunito'
  | 'quicksand'
  | 'bebas_neue'
  | 'anton'
  | 'vt323'
  | 'poiret_one'
  | 'lexend'
  | 'rubik'
  | 'cormorant'
  | 'libre_baskerville'
  | 'caveat'
  | 'silkscreen';

export type EstiloId =
  | 'suizo'
  | 'bauhaus'
  | 'memphis'
  | 'neobrutalismo'
  | 'vidrio'
  | 'clay'
  | 'retro_os'
  | 'terminal'
  | 'editorial'
  | 'art_deco'
  | 'y2k'
  | 'organico'
  | 'minimal_tecnico'
  | 'oscuro_precision'
  | 'producto_amable'
  | 'periodico'
  | 'japones'
  | 'dopamina'
  | 'lujo'
  | 'cyber';

export type LayoutId =
  | 'hero_partido'
  | 'bento'
  | 'revista'
  | 'tipografico'
  | 'cinta'
  | 'apiladas'
  | 'indice'
  | 'panel_fijo'
  | 'mosaico'
  | 'minimo'
  | 'app_lateral'
  | 'horizontal'
  | 'galeria'
  | 'precios'
  | 'portada_video'
  | 'blog_lateral'
  | 'equipo'
  | 'fondo_protagonista'
  | 'tarjeta_sobre_fondo'
  | 'editorial_fondo'
  | 'widgets_fondo'
  | 'autor_panaderia'
  | 'autor_finanzas'
  | 'autor_portfolio'
  | 'autor_festival'
  | 'autor_correr'
  | 'autor_cafeteria'
  | 'autor_floreria'
  | 'autor_refugio'
  | 'autor_concesionario'
  | 'autor_turnos'
  | 'autor_curso'
  | 'autor_restaurante'
  | 'autor_gimnasio'
  | 'linea_tiempo'
  | 'antes_despues'
  | 'mapa_lista'
  | 'carta'
  | 'agenda_semanal'
  | 'tablero'
  | 'muro'
  | 'documentacion'
  | 'link_bio'
  | 'compra_unica'
  | 'portada_buscador'
  | 'partida_scroll';

export type EscalaId = 'sutil' | 'medio' | 'dramatico' | 'extremo';
export type EspaciadoTitulos = 'apretado' | 'normal' | 'amplio';
export type RadioId = 'recto' | 'apenas_suave' | 'suave' | 'pildora';
export type ElevacionId = 'plana' | 'suave' | 'marcada' | 'dura';
export type BordesId = 'ninguno' | 'sutil' | 'marcado';
export type MovimientoId = 'minimo' | 'rapido' | 'sutil' | 'expresivo';
export type CursorId = 'normal' | 'punto' | 'anillo' | 'cruz';
export type HoverId = 'nada' | 'oscurecer' | 'brillo' | 'elevar' | 'escalar' | 'sombra' | 'desplazar';
export type PresionarId = 'nada' | 'hundir';
export type AparicionId =
  | 'nada' | 'fundido' | 'subir' | 'escalonada' | 'zoom'
  | 'enfoque' | 'rebote' | 'destape' | 'giro' | 'maquina' | 'costados' | 'desde_boton';
export type CambioId = 'nada' | 'fundido' | 'deslizar' | 'subir' | 'zoom';
export type BotonDisenoId =
  | 'solido'
  | 'pildora'
  | 'tonal'
  | 'degradado'
  | 'brillo_barrido'
  | 'flecha'
  | 'grano'
  | 'contorno'
  | 'relleno_abajo'
  | 'subrayado'
  | 'doble'
  | 'desplazado'
  | 'borde_animado'
  | 'circulo'
  | 'sombra_dura'
  | 'empujable'
  | 'neumorfico'
  | 'clay'
  | 'vidrio'
  | 'neon'
  | 'cromo'
  | 'sticker'
  | 'bisel'
  | 'terminal'
  | 'gradiente_borde'
  | 'sombra_color'
  | 'sombra_larga'
  | 'neon_encendido'
  | 'texto_sube'
  | 'cortina'
  | 'diagonal'
  | 'circulo_flecha'
  | 'esquinas'
  | 'banderin'
  | 'hexagonal'
  | 'pixel'
  | 'extruido'
  | 'vidrio_ahumado'
  | 'aurora'
  | 'holografico'
  | 'hormigas'
  | 'a_mano'
  | 'tinta'
  | 'respira'
  | 'link_flecha'
  | 'doble_capa'
  | 'synthwave'
  | 'acuoso'
  | 'estallido'
  | 'tembloroso'
  | 'contorno_doble_color'
  | 'relleno_lateral'
  | 'centro_expande'
  | 'subrayado_relleno'
  | 'sombra_suave_color'
  | 'plano_cuadrado'
  | 'gota'
  | 'pestana'
  | 'contorno_grueso'
  | 'contorno_redondo_icono'
  | 'tres_d_lateral'
  | 'teclado'
  | 'almohada'
  | 'esmerilado'
  | 'metal_oscuro'
  | 'oro'
  | 'tiza'
  | 'papel_recortado'
  | 'cinta'
  | 'luz_neon_tubo'
  | 'brillo_borde'
  | 'magnetico'
  | 'deslizar_icono'
  | 'gira_borde'
  | 'onda_continua'
  | 'mac_clasico'
  | 'arcade'
  | 'gameboy'
  | 'web_2000'
  | 'minimal_texto';

export type CajaPresetId =
  | 'superficie'
  | 'contorno'
  | 'elevada'
  | 'flotante'
  | 'vidrio'
  | 'velo'
  | 'neobrutal'
  | 'neumorfica'
  | 'hundida'
  | 'punteada'
  | 'rayada'
  | 'doble'
  | 'cabecera'
  | 'barra'
  | 'cortada'
  | 'ticket'
  | 'brillo'
  | 'degradado'
  | 'puntos'
  | 'papel'
  | 'cuaderno'
  | 'acento'
  | 'editorial'
  | 'sombra_color'
  | 'cristal_color'
  | 'sello'
  | 'invertida'
  | 'gruesa'
  | 'flotante_vidrio'
  | 'pildora_suave'
  | 'compacta'
  | 'acento_borde'
  | 'inclina'
  | 'cabecera_vidrio'
  | 'ticket_punteado'
  | 'invertida_brillo'
  | 'puntos_color'
  | 'renglones'
  | 'grano_dura'
  | 'degradado_vidrio'
  | 'barra_acento'
  | 'cortada_contorno'
  | 'aire'
  | 'hundida_color';

export type BotonEstiloId = 'relleno' | 'contorno' | 'tonal' | 'elevado' | 'sombra_dura';
export type BotonTamano = 'compacto' | 'normal' | 'grande';
export type BotonIcono = 'ninguno' | 'izquierda' | 'derecha';
export type Densidad = 'compacta' | 'normal' | 'aireada';
export type LibreriaIconos = 'lucide' | 'heroicons' | 'phosphor' | 'material_symbols';
export type EstiloIconos = 'trazo' | 'relleno' | 'duotono';
export type VozTexto = 'formal' | 'neutra' | 'cercana' | 'divertida';
export type Tratamiento = 'vos' | 'tu' | 'usted';
export type LargoTextos = 'corto' | 'medio' | 'detallado';
export type NivelTecnico = 'bajo' | 'medio' | 'alto';
export type SiNo = 'si' | 'no' | 'opcional';

export type RolColor =
  | 'fondo'
  | 'superficie'
  | 'superficie_alta'
  | 'borde'
  | 'texto'
  | 'texto_suave'
  | 'acento'
  | 'sobre_acento';

export type PasoId =
  | 'proyecto'
  | 'estructura'
  | 'funciones'
  | 'direccion'
  | 'color'
  | 'tipografia'
  | 'forma'
  | 'botones'
  | 'movimiento'
  | 'exportar';

export interface Pantalla {
  id: string;
  nombre: string;
  proposito: string;
  secciones: string[];
  accionPrincipal: string;
}

export interface PaletaPersonalizada {
  fondo: string;
  texto: string;
  acento: string;
  /** Roles ajustados a mano; los que no están se calculan a partir de fondo, texto y acento. */
  manual: Partial<Record<RolColor, string>>;
}

export interface Config {
  proyecto: {
    nombre: string;
    tipo: TipoProyecto;
    rubro?: string;
    descripcion: string;
    objetivo: string;
    publicoQuienes: string;
    publicoContexto: string;
    nivelTecnico: NivelTecnico;
    plataformas: string[];
  };
  estructura: {
    patron: PatronNav;
    patronMovil: PatronNav;
    pantallas: Pantalla[];
    /** true cuando la persona editó las pantallas: ya no se reemplazan al cambiar el tipo. */
    editadas: boolean;
  };
  funciones: {
    acciones: string[];
    integraciones: string[];
    fueraDeAlcance: string[];
    requiereCuenta: SiNo;
  };
  visual: {
    direccion: DireccionId;
    /** Estilo visual (movimiento estético). 'clasico' = sin estilo especial. */
    estilo: EstiloId | 'clasico';
    layout: LayoutId;
    antiReferencias: string[];
    paleta: PaletaId | 'personalizada';
    paletaPersonalizada: PaletaPersonalizada;
    fuenteTitulos: FuenteId;
    fuenteTexto: FuenteId;
    pesoTitulos: number;
    espaciadoTitulos: EspaciadoTitulos;
    escala: EscalaId;
    radio: RadioId;
    elevacion: ElevacionId;
    bordes: BordesId;
    movimiento: MovimientoId;
    hover: HoverId;
    /** H12: null conserva el hover de las cajas y el cursor del navegador. */
    hoverTarjetas: HoverId | null;
    cursor: CursorId | null;
    presionar: PresionarId;
    aparicion: AparicionId;
    cambio: CambioId;
    /** Fondo con textura para los visuales y las composiciones ('ninguno' = el de cada estilo). */
    fondo: import('./fondos').FondoId | 'ninguno';
    /** Efectos de scroll combinados: hasta 3, uno por zona (`scroll.ts`). Vacío = la página no reacciona al bajar. */
    scroll: import('./scroll').ScrollId[];
    /** Secciones de la página, en orden, con el diseño de cada una (`secciones.ts`). Solo landing, sitio y portfolio. Vacío = el argumento del layout. */
    secciones: import('./secciones').SeccionDisenoId[];
    fondoAnimado?: import('./fondos-animados').FondoAnimadoId | 'ninguno';
    /** true: el archivo incluye también la versión opuesta de la paleta (claro ↔ oscuro). */
    ambosModos: boolean;
    /** Densidad elegida (ronda D11); null = la de la dirección visual. */
    densidad: Densidad | null;
    /** Preset de lectura del blog (D14); null = sin elección. */
    lectura: LecturaId | null;
  };
  /** Iconos (ronda D11, §11 del export); null = no se eligió y la sección no se exporta. */
  iconos: { libreria: LibreriaIconos; estilo: EstiloIconos; grosor: number } | null;
  /** Tono de los textos (ronda D11, §13 del export); null = no se eligió y la sección no se exporta. */
  tono: { voz: VozTexto; tratamiento: Tratamiento; largo: LargoTextos } | null;
  botones: {
    estilo: BotonEstiloId;
    tamano: BotonTamano;
    mayusculas: boolean;
    icono: BotonIcono;
    /** Diseño elegido en el panel de botones; 'ninguno' usa el estilo simple de arriba. */
    diseno: BotonDisenoId | 'ninguno';
    /** 'acento' (de la paleta), 'texto' (monocromo) o un color hex propio. */
    color: string;
    /** Animación al tocar: la del diseño elegido o una elegida aparte (se combina con cualquier diseño). */
    efecto: import('./botones-disenos').EfectoToque | 'del_diseno';
  };
  /** Cajas y contenedores (panel del modo rápido). 'ninguno' = las cards por defecto del formato. */
  cajas: {
    preset: CajaPresetId | 'ninguno';
    ajustes: Partial<import('./cajas').ParamsCaja>;
  };
  /** Diseño elegido por categoría de la galería (campo, interruptor, barra inferior…). */
  componentes: Partial<Record<import('./galeria/base').CategoriaId, string>>;
  notas: Partial<Record<PasoId, string>>;
  notasGenerales: string;
}

export type LecturaId = '50_16' | '60_16' | '70_16' | '50_20' | '60_20' | '70_20';
