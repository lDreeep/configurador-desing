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

export type DireccionId = 'calmo' | 'audaz' | 'tecnico' | 'calido';
export type PaletaId = 'azul_electrico' | 'tinta_y_lima' | 'bosque' | 'coral_calido';
export type FuenteId = 'inter' | 'space_grotesk' | 'fraunces' | 'dm_sans';
export type RadioId = 'recto' | 'apenas_suave' | 'suave' | 'pildora';
export type MovimientoId = 'minimo' | 'sutil' | 'expresivo';
export type Densidad = 'compacta' | 'normal' | 'aireada';
export type NivelTecnico = 'bajo' | 'medio' | 'alto';
export type SiNo = 'si' | 'no' | 'opcional';

export type PasoId =
  | 'proyecto'
  | 'estructura'
  | 'funciones'
  | 'direccion'
  | 'color'
  | 'tipografia'
  | 'forma'
  | 'movimiento'
  | 'exportar';

export interface Pantalla {
  id: string;
  nombre: string;
  proposito: string;
  secciones: string[];
  accionPrincipal: string;
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
    antiReferencias: string[];
    paleta: PaletaId;
    fuenteTitulos: FuenteId;
    fuenteTexto: FuenteId;
    radio: RadioId;
    movimiento: MovimientoId;
  };
  notas: Partial<Record<PasoId, string>>;
  notasGenerales: string;
}
