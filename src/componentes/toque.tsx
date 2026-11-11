// Piezas chicas que usan el botón principal y la página: van en la carga inicial sin arrastrar
// el resto de ui.tsx (que solo usan los paneles).

/**
 * Reinicia la animación de "toque" en los botones que haya dentro de `el` (o en `el` mismo).
 * Con `evento`, la onda sale desde el punto tocado.
 */
export function animarToque(el: HTMLElement, evento?: { clientX: number; clientY: number; detail?: number }) {
  const botones = el.matches('.pv-boton, .bt') ? [el] : Array.from(el.querySelectorAll<HTMLElement>('.pv-boton, .bt'));
  for (const b of botones) {
    if (evento && evento.detail !== 0) {
      const r = b.getBoundingClientRect();
      b.style.setProperty('--x', `${evento.clientX - r.left}px`);
      b.style.setProperty('--y', `${evento.clientY - r.top}px`);
    } else {
      b.style.removeProperty('--x');
      b.style.removeProperty('--y');
    }
    b.classList.remove('toque');
    void b.offsetWidth; // fuerza el reinicio de la animación
    b.classList.add('toque');
  }
}

/** Flecha → para botones y links. */
export function IconoFlecha() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
