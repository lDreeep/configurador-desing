import { useEffect, useState } from 'react';
import { DIRECCIONES, NAV_SUGERIDA, PLANTILLAS_PANTALLAS } from './catalogo';
import type { Config, DireccionId, Pantalla, TipoProyecto } from './tipos';

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

export function configInicial(): Config {
  const d = DIRECCIONES.calmo;
  const [patron, patronMovil] = NAV_SUGERIDA.app_web;
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
      direccion: 'calmo',
      antiReferencias: [],
      paleta: d.paleta,
      fuenteTitulos: d.fuenteTitulos,
      fuenteTexto: d.fuenteTexto,
      radio: d.radio,
      movimiento: d.movimiento,
    },
    notas: {},
    notasGenerales: '',
  };
}

/** Elegir una dirección precarga color, tipografía, forma y movimiento (DESIGN.md §5). */
export function aplicarDireccion(c: Config, id: DireccionId): Config {
  const d = DIRECCIONES[id];
  return {
    ...c,
    visual: {
      ...c.visual,
      direccion: id,
      paleta: d.paleta,
      fuenteTitulos: d.fuenteTitulos,
      fuenteTexto: d.fuenteTexto,
      radio: d.radio,
      movimiento: d.movimiento,
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

function leer(): Config | null {
  try {
    const crudo = localStorage.getItem(CLAVE);
    if (!crudo) return null;
    const guardado = JSON.parse(crudo) as Partial<Config>;
    const base = configInicial();
    // Mezcla superficial por bloque: tolera configs guardadas con versiones anteriores.
    return {
      ...base,
      ...guardado,
      proyecto: { ...base.proyecto, ...guardado.proyecto },
      estructura: { ...base.estructura, ...guardado.estructura },
      funciones: { ...base.funciones, ...guardado.funciones },
      visual: { ...base.visual, ...guardado.visual },
      notas: { ...guardado.notas },
    };
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
