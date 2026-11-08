import { useEffect, useState } from 'react';
import { DIRECCIONES, FUENTES, MOVIMIENTOS, NAV_SUGERIDA, PALETAS, PLANTILLAS_PANTALLAS } from './catalogo';
import { ESTILOS, LAYOUTS } from './estilos-visuales';
import { FONDOS } from './fondos';
import type { Config, DireccionId, FuenteId, MovimientoId, Pantalla, TipoProyecto } from './tipos';

const CLAVE = 'configurador-diseno:v1';

let contador = 0;
export const nuevoId = (base: string) =>
  `${base
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '') || 'pantalla'}_${(++contador).toString(36)}`;

export const pantallasDePlantilla = (tipo: TipoProyecto): Pantalla[] =>
  PLANTILLAS_PANTALLAS[tipo].map((p) => ({ ...p, secciones: [...p.secciones], id: nuevoId(p.nombre) }));

/** El peso disponible en la fuente más cercano al pedido. */
export const pesoDisponible = (fuente: FuenteId, peso: number) =>
  FUENTES[fuente].pesos.reduce((a, b) => (Math.abs(b - peso) < Math.abs(a - peso) ? b : a));

/** Valores visuales que propone una dirección (DESIGN.md §5). */
function visualDeDireccion(id: DireccionId) {
  const d = DIRECCIONES[id];
  const m = MOVIMIENTOS[d.movimiento];
  return {
    direccion: id,
    estilo: 'clasico' as const,
    paleta: d.paleta,
    fuenteTitulos: d.fuenteTitulos,
    fuenteTexto: d.fuenteTexto,
    pesoTitulos: d.pesoTitulos,
    espaciadoTitulos: d.espaciadoTitulos,
    escala: d.escala,
    radio: d.radio,
    elevacion: d.elevacion,
    bordes: d.bordes,
    movimiento: d.movimiento,
    hover: d.boton === 'sombra_dura' ? ('desplazar' as const) : m.hover,
    presionar: m.presionar,
    aparicion: m.aparicion,
    cambio: m.cambio,
  };
}

export function configInicial(): Config {
  const [patron, patronMovil] = NAV_SUGERIDA.app_web;
  const r = PALETAS.azul_electrico.roles;
  return {
    proyecto: {
      nombre: '',
      tipo: 'app_web',
      descripcion: '',
      objetivo: '',
      publicoQuienes: '',
      publicoContexto: '',
      nivelTecnico: 'bajo',
      plataformas: ['web_movil', 'web_escritorio'],
    },
    estructura: { patron, patronMovil, pantallas: pantallasDePlantilla('app_web'), editadas: false },
    funciones: { acciones: [], integraciones: [], fueraDeAlcance: [], requiereCuenta: 'si' },
    visual: {
      ...visualDeDireccion('calmo'),
      ambosModos: false,
      fondo: 'ninguno',
      layout: 'hero_partido',
      antiReferencias: [],
      paletaPersonalizada: { fondo: r.fondo, texto: r.texto, acento: r.acento, manual: {} },
    },
    botones: { estilo: DIRECCIONES.calmo.boton, tamano: 'normal', mayusculas: false, icono: 'ninguno', diseno: 'ninguno', color: 'acento', efecto: 'del_diseno' },
    cajas: { preset: 'ninguno', ajustes: {} },
    componentes: {},
    notas: {},
    notasGenerales: '',
  };
}

/** Elegir una dirección precarga color, tipografía, forma, botones y movimiento. */
export function aplicarDireccion(c: Config, id: DireccionId): Config {
  return {
    ...c,
    visual: { ...c.visual, ...visualDeDireccion(id) },
    botones: { ...c.botones, estilo: DIRECCIONES[id].boton },
  };
}

/** Elegir un nivel de movimiento precarga cada efecto; después se ajustan por separado. */
export function aplicarMovimiento(c: Config, id: MovimientoId): Config {
  const m = MOVIMIENTOS[id];
  return {
    ...c,
    visual: {
      ...c.visual,
      movimiento: id,
      hover: c.botones.estilo === 'sombra_dura' && m.hover !== 'oscurecer' ? 'desplazar' : m.hover,
      presionar: m.presionar,
      aparicion: m.aparicion,
      cambio: m.cambio,
    },
  };
}

/** Cambiar el tipo de proyecto sugiere pantallas y navegación, salvo que ya se hayan editado. */
export function aplicarTipo(c: Config, tipo: TipoProyecto): Config {
  const proyecto = { ...c.proyecto, tipo };
  if (c.estructura.editadas) return { ...c, proyecto };
  const [patron, patronMovil] = NAV_SUGERIDA[tipo];
  return { ...c, proyecto, estructura: { patron, patronMovil, pantallas: pantallasDePlantilla(tipo), editadas: false } };
}

/** Une una config guardada (quizás de una versión anterior) con los valores por defecto actuales. */
export function normalizar(guardado: Partial<Config>): Config {
  const base = configInicial();
  const visual = { ...base.visual, ...guardado.visual };
  // Ids que ya no existen en el catálogo vuelven al valor por defecto.
  if (!(visual.direccion in DIRECCIONES)) visual.direccion = base.visual.direccion;
  if (visual.paleta !== 'personalizada' && !(visual.paleta in PALETAS)) visual.paleta = base.visual.paleta;
  if (!(visual.fuenteTitulos in FUENTES)) visual.fuenteTitulos = base.visual.fuenteTitulos;
  if (!(visual.fuenteTexto in FUENTES)) visual.fuenteTexto = base.visual.fuenteTexto;
  if (visual.estilo !== 'clasico' && !(visual.estilo in ESTILOS)) visual.estilo = 'clasico';
  if (!(visual.layout in LAYOUTS)) visual.layout = base.visual.layout;
  if (visual.fondo !== 'ninguno' && !(visual.fondo in FONDOS)) visual.fondo = 'ninguno';
  visual.paletaPersonalizada = { ...base.visual.paletaPersonalizada, ...visual.paletaPersonalizada };
  return {
    ...base,
    ...guardado,
    proyecto: { ...base.proyecto, ...guardado.proyecto },
    estructura: { ...base.estructura, ...guardado.estructura },
    funciones: { ...base.funciones, ...guardado.funciones },
    visual,
    botones: { ...base.botones, ...guardado.botones },
    cajas: { ...base.cajas, ...guardado.cajas },
    componentes: { ...guardado.componentes },
    notas: { ...guardado.notas },
  };
}

function leer(): Config | null {
  try {
    const crudo = localStorage.getItem(CLAVE);
    return crudo ? normalizar(JSON.parse(crudo) as Partial<Config>) : null;
  } catch {
    return null;
  }
}

export function useConfig() {
  const [config, setConfig] = useState<Config>(() => leer() ?? configInicial());
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(config));
    } catch {
      // Sin almacenamiento disponible (modo privado, etc.): el configurador sigue funcionando.
    }
  }, [config]);
  const reiniciar = () => setConfig(configInicial());
  return { config, setConfig, reiniciar };
}
