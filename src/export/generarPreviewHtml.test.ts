// @vitest-environment jsdom
import { generarPreviewHtml } from './generarPreviewHtml';

it('exporta el lienzo con CSS, tokens, contenido escapado y fotos embebidas', async () => {
  const hoja = document.createElement('style');
  hoja.textContent = '.pg { color: var(--texto) }';
  document.head.append(hoja);
  const pagina = document.createElement('div');
  pagina.className = 'pg';
  pagina.style.setProperty('--texto', 'red');
  pagina.innerHTML = '<h2></h2><img src="/fotos/demo.png">';
  pagina.firstChild!.textContent = '<script>hola</script>';
  const fetchImagen = vi.spyOn(globalThis, 'fetch');
  try {
    // FileReader usa el Blob de la ventana, también en jsdom.
    fetchImagen.mockResolvedValue({ ok: true, blob: async () => new Blob(['foto'], { type: 'image/png' }) } as Response);
    const html = await generarPreviewHtml(pagina, 'Mi tienda');
    const doc = new DOMParser().parseFromString(html, 'text/html');
    expect(doc.title).toBe('Mi tienda');
    expect(Array.from(doc.querySelectorAll('style'), (el) => el.textContent).join('')).toContain('var(--texto)');
    expect(doc.querySelector<HTMLElement>('.pg')?.style.getPropertyValue('--texto')).toBe('red');
    expect(doc.querySelector('img')?.src).toMatch(/^data:image\/png;base64,/);
    expect(doc.querySelector('script')).toBeNull();
    expect(pagina.querySelector('img')?.getAttribute('src')).toBe('/fotos/demo.png');
  } finally {
    fetchImagen.mockRestore();
    hoja.remove();
  }
});
