// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { OrdenSecciones } from './OrdenSecciones';
import type { SeccionDisenoId } from '../secciones-base';

it('reordena con botones y arrastre sin perder diseños; conserva el foco', async () => {
  const caja = document.createElement('div');
  document.body.append(caja);
  const root = createRoot(caja);
  let lista: SeccionDisenoId[] = ['beneficios_renglones', 'contacto_datos', 'precios_tabla'];
  const render = () => root.render(<OrdenSecciones lista={lista} onCambiar={(nueva) => { lista = nueva; render(); }} />);
  try {
    await act(render);
    const botones = () => [...caja.querySelectorAll<HTMLButtonElement>('button')];
    expect(botones().find((b) => b.getAttribute('aria-label')?.startsWith('Subir Beneficios'))?.disabled).toBe(true);
    const bajar = botones().find((b) => b.getAttribute('aria-label')?.startsWith('Bajar Beneficios'))!;
    bajar.focus();
    await act(() => bajar.click());
    expect(lista).toEqual(['contacto_datos', 'beneficios_renglones', 'precios_tabla']);
    expect(document.activeElement).toBe(bajar);
    const manija = botones().find((b) => b.getAttribute('aria-label')?.startsWith('Arrastrar Precios'))!;
    const destino = caja.querySelector('[data-orden-seccion="contacto_datos"]')!;
    const original = document.elementFromPoint;
    document.elementFromPoint = () => destino;
    try {
      await act(() => {
        manija.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, button: 0 }));
        manija.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }));
      });
    } finally { document.elementFromPoint = original; }
    expect(lista).toEqual(['precios_tabla', 'contacto_datos', 'beneficios_renglones']);
    expect(caja.querySelector('[role="status"]')?.textContent).toContain('posición 1 de 3');
  } finally {
    await act(() => root.unmount());
    caja.remove();
  }
});
