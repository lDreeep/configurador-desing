import { normalizar } from '../estado';
import type { Config } from '../tipos';
import type { ClaveRonda } from '../rondas';

export interface Favorito {
  id: string;
  nombre: string;
  config: Config;
  elegidas: ClaveRonda[];
}

const clave = 'molde:favoritos:v1';
export function leerFavoritos(): Favorito[] {
  const datos: unknown = JSON.parse(localStorage.getItem(clave) ?? '[]');
  if (!Array.isArray(datos)) throw new Error('No se pudo leer la lista.');
  return datos.map(f => {
    if (!f?.config || typeof f.id !== 'string' || typeof f.nombre !== 'string' || !Array.isArray(f.elegidas))
      throw new Error('No se pudo leer un favorito.');
    return { ...f, config: normalizar(f.config) };
  });
}

export function guardarFavorito(nombre: string, config: Config, elegidas: ReadonlySet<ClaveRonda>) {
  const lista = leerFavoritos();
  if (!nombre.trim()) throw new Error('Escribí un nombre.');
  if (lista.length >= 10) throw new Error('Ya guardaste diez favoritos.');
  lista.push({ id: crypto.randomUUID(), nombre: nombre.trim(), config, elegidas: [...elegidas] });
  localStorage.setItem(clave, JSON.stringify(lista));
  return lista;
}

export function borrarFavorito(id: string) {
  const lista = leerFavoritos().filter(f => f.id !== id);
  localStorage.setItem(clave, JSON.stringify(lista));
  return lista;
}
