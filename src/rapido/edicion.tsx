import { createContext } from 'react';
import type { Config, AjusteElemento } from '../tipos';
export interface Edicion {
  editando: boolean; pantalla: string; seleccionado: string | null;
  config: Config; seleccionar: (categoria: string, id: string) => void;
}
export const EdicionContexto = createContext<Edicion | null>(null);
export const claveElemento = (pantalla: string, categoria: string, nombre: string) =>
  [pantalla, categoria, nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '_')].join(':');
export function resolverElemento(config: Config, id: string): Config {
  const ajuste = config.elementos?.[id];
  if (!ajuste) return config;
  return { ...config,
    botones: { ...config.botones, ...ajuste.botones },
    cajas: ajuste.cajas ?? config.cajas,
    componentes: { ...config.componentes, ...ajuste.componentes },
  };
}
export function guardarAjuste(base: Config, id: string, categoria: string, siguiente: Config): Config {
  const ajuste: AjusteElemento = { categoria };
  if (categoria === 'boton' || categoria === 'color_boton') ajuste.botones = siguiente.botones;
  else if (categoria === 'caja') ajuste.cajas = siguiente.cajas;
  else {
    const clave = categoria as keyof Config['componentes'];
    const diseno = siguiente.componentes[clave];
    if (diseno) ajuste.componentes = { [categoria]: diseno };
  }
  return { ...base, elementos: { ...base.elementos, [id]: ajuste } };
}
