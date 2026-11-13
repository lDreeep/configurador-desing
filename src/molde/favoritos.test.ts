// @vitest-environment jsdom
import { beforeEach, expect, it } from 'vitest';
import { configInicial } from '../estado';
import { guardarFavorito, leerFavoritos, borrarFavorito } from './favoritos';

beforeEach(() => localStorage.clear());

it('permite abrir la configuración guardada con su recorrido y borrarla', () => {
  const config = configInicial();
  const [f] = guardarFavorito(' Mi diseño ', config, new Set(['proyecto']));
  expect(leerFavoritos()[0]).toMatchObject({ nombre: 'Mi diseño', config, elegidas: ['proyecto'] });
  borrarFavorito(f.id);
  expect(leerFavoritos()).toEqual([]);
});

it('conserva los diez diseños al alcanzar el límite', () => {
  const config = configInicial();
  for (let i = 0; i < 10; i++) guardarFavorito(String(i), config, new Set());
  expect(() => guardarFavorito('Otro', config, new Set())).toThrow();
  expect(leerFavoritos()).toHaveLength(10);
});
