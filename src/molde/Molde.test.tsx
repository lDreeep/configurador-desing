// @vitest-environment jsdom
import { act, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { useConfig } from '../estado';
import { Molde } from './Molde';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/** Molde con la config real (guardada en localStorage) y el paso en memoria, como lo monta App. */
function ConUbicacion({ inicial }: { inicial: string }) {
  const { config, setConfig, reiniciar } = useConfig();
  const [paso, setPaso] = useState(inicial);
  return (
    <>
      <output data-paso>{paso}</output>
      <Molde config={config} setConfig={setConfig} reiniciar={reiniciar} paso={paso} ir={(p) => setPaso(p)} />
    </>
  );
}

let raiz: Root;
let caja: HTMLDivElement;
const montar = async (paso = 'inicio') => {
  caja = document.createElement('div');
  document.body.append(caja);
  raiz = createRoot(caja);
  await act(async () => raiz.render(<ConUbicacion inicial={paso} />));
  await act(() => new Promise((r) => setTimeout(r, 40)));
};
const desmontar = () => {
  act(() => raiz.unmount());
  caja.remove();
};
const pasoActual = () => caja.querySelector('[data-paso]')!.textContent;
const ideas = () => [...caja.querySelectorAll<HTMLButtonElement>('.molde-idea')];
const idea = (texto: string) => ideas().find((b) => b.textContent!.startsWith(texto))!;
const fichas = () => [...caja.querySelectorAll('.molde-ficha')].map((f) => f.textContent);
const vistaPrevia = () => caja.querySelector('.molde-prev .pg');
const conBoton = (texto: string) => [...caja.querySelectorAll('button')].find((b) => b.textContent === texto)!;

/** Un evento de puntero de mouse (jsdom no trae PointerEvent). */
function puntero(el: Element, tipo: string, init: MouseEventInit = {}) {
  const e = new MouseEvent(tipo, { bubbles: true, cancelable: true, ...init });
  Object.defineProperty(e, 'pointerType', { value: 'mouse' });
  Object.defineProperty(e, 'pointerId', { value: 1 });
  act(() => void el.dispatchEvent(e));
}
const clic = async (el: HTMLElement) => {
  await act(async () => el.click());
  await act(() => new Promise((r) => setTimeout(r, 40)));
};

beforeEach(() => localStorage.clear());
afterEach(desmontar);

describe('Molde (C2)', () => {
  it('con mouse: pasar muestra la idea en la página, clic o arrastrar al centro la elige', async () => {
    await montar();
    await clic(conBoton('Empezar'));
    expect(pasoActual()).toBe('proyecto');
    expect(ideas().length).toBeLessThanOrEqual(6);

    puntero(idea('Tienda'), 'pointerover');
    expect(vistaPrevia()).not.toBeNull();
    expect(idea('Tienda').classList.contains('viva')).toBe(true);
    puntero(idea('Tienda'), 'pointerout');
    expect(vistaPrevia()).toBeNull();

    await clic(idea('Tienda'));
    expect(pasoActual()).toBe('color');
    expect(fichas()).toEqual(['ProyectoTienda']);

    // Arrastrar una idea hasta el centro también la elige.
    const b = ideas()[1];
    const [ox, oy] = [parseFloat(b.style.getPropertyValue('--x')), parseFloat(b.style.getPropertyValue('--y'))];
    puntero(b, 'pointerdown', { clientX: 500, clientY: 500, button: 0 });
    puntero(b, 'pointermove', { clientX: 500 - ox / 2, clientY: 500 - oy / 2 });
    puntero(b, 'pointerup', { clientX: 500 - ox, clientY: 500 - oy });
    await act(() => new Promise((r) => setTimeout(r, 40)));
    expect(pasoActual()).toBe('layout');
    expect(fichas()).toHaveLength(2);
  });

  it('con teclado: las ideas son botones, el foco muestra y Enter (clic del botón) elige', async () => {
    await montar('proyecto');
    for (const b of ideas()) expect(b.getAttribute('type')).toBe('button');
    act(() => idea('Landing').focus());
    expect(vistaPrevia()).not.toBeNull();
    await clic(idea('Landing'));
    expect(pasoActual()).toBe('color');
    // Al cambiar de ronda el foco va a la pregunta, y de ahí Tab llega a las ideas.
    expect(document.activeElement?.classList.contains('molde-pregunta')).toBe(true);
    act(() => ideas()[0].focus());
    await clic(ideas()[0]);
    await clic(ideas()[0]);
    expect(pasoActual()).toBe('estilo');
    await clic(ideas()[0]);
    expect(pasoActual()).toBe('piezas');
    expect(fichas().map((f) => f!.replace(/^(Proyecto|Color|Layout|Estilo).*/, '$1'))).toEqual(['Proyecto', 'Color', 'Layout', 'Estilo']);
    // Con las cuatro obligatorias se puede terminar.
    await clic(conBoton('Terminar'));
    expect(pasoActual()).toBe('listo');
    expect(conBoton('Descargar DESIGN.md')).toBeTruthy();
  });

  it('las flechas muestran las ideas de a 6', async () => {
    await montar('proyecto');
    const antes = ideas().map((b) => b.textContent);
    await clic(caja.querySelector<HTMLButtonElement>('[aria-label="Más ideas"]')!);
    const despues = ideas().map((b) => b.textContent);
    expect(despues.length).toBeGreaterThan(0);
    expect(despues).not.toEqual(antes);
  });

  it('lo elegido sobrevive a recargar', async () => {
    await montar('proyecto');
    await clic(idea('Tienda'));
    await clic(ideas()[2]);
    const elegido = fichas();
    desmontar();
    await montar('layout');
    expect(fichas()).toEqual(elegido);
    expect(pasoActual()).toBe('layout');
    expect(caja.querySelector('.molde-base .pg')).not.toBeNull();
    // «Empezar de cero» es lo único que vacía la página.
    window.confirm = () => true;
    await clic(conBoton('Empezar de cero'));
    expect(fichas()).toEqual([]);
    expect(caja.querySelector('.molde-base .pg')).toBeNull();
    expect(pasoActual()).toBe('inicio');
  });

  it('un paso sin proyecto vuelve a Proyecto', async () => {
    await montar('estilo');
    expect(pasoActual()).toBe('proyecto');
  });
});
