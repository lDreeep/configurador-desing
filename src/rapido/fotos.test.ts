import { describe, expect, it } from 'vitest';
import { FOTOS } from './fotos';

// Una miniatura (lqip) mal formada hace que el navegador tire ERR_INVALID_URL al pintarla.
describe('fotos', () => {
  it('cada lqip es un WebP válido y completo', () => {
    for (const [id, f] of Object.entries(FOTOS)) {
      if (!f.lqip) continue; // sin miniatura es válido: el componente no la usa
      const m = /^data:image\/webp;base64,([A-Za-z0-9+/]+={0,2})$/.exec(f.lqip);
      expect(m, `${id}: formato`).not.toBeNull();
      const bin = atob(m![1]);
      const b = Uint8Array.from(bin, (c) => c.charCodeAt(0));
      expect(bin.slice(0, 4), id).toBe('RIFF');
      const declarado = new DataView(b.buffer).getUint32(4, true) + 8;
      expect(declarado, `${id}: tamaño declarado`).toBe(b.length);
    }
  });
});
