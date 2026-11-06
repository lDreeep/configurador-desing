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
  | 'cromo';

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
  | 'poiret_one';

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
  | 'organico';

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
  | 'horizontal';

export type EscalaId = 'sutil' | 'medio' | 'dramatico' | 'extremo';
export type EspaciadoTitulos = 'apretado' | 'normal' | 'amplio';
export type RadioId = 'recto' | 'apenas_suave' | 'suave' | 'pildora';
export type ElevacionId = 'plana' | 'suave' | 'marcada' | 'dura';
export type BordesId = 'ninguno' | 'sutil' | 'marcado';
export type MovimientoId = 'minimo' | 'rapido' | 'sutil' | 'expresivo';
export type HoverId = 'nada' | 'oscurecer' | 'brillo' | 'elevar' | 'escalar' | 'sombra' | 'desplazar';
export type PresionarId = 'nada' | 'hundir';
export type AparicionId = 'nada' | 'fundido' | 'subir' | 'escalonada' | 'zoom';
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
  | 'terminal';

export type BotonEstiloId = 'relleno' | 'contorno' | 'tonal' | 'elevado' | 'sombra_dura';
export type BotonTamano = 'compacto' | 'normal' | 'grande';
export type BotonIcono = 'ninguno' | 'izquierda' | 'derecha';
export type Densidad = 'compacta' | 'normal' | 'aireada';
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
    presionar: PresionarId;
    aparicion: AparicionId;
    cambio: CambioId;
  };
  botones: {
    estilo: BotonEstiloId;
    tamano: BotonTamano;
    mayusculas: boolean;
    icono: BotonIcono;
    /** Diseño elegido en el panel de botones; 'ninguno' usa el estilo simple de arriba. */
    diseno: BotonDisenoId | 'ninguno';
    /** 'acento' (de la paleta), 'texto' (monocromo) o un color hex propio. */
    color: string;
  };
  notas: Partial<Record<PasoId, string>>;
  notasGenerales: string;
}
