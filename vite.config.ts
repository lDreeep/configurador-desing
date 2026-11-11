import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  // Sin el polyfill de modulepreload (1,3 kB en la carga inicial): todos los navegadores actuales lo
  // traen, y sin él solo se pierde la precarga, no la carga (PLAN.md B2).
  build: { modulePreload: { polyfill: false } },
  test: { globals: true, environment: 'node', setupFiles: ['src/test-setup.ts'] },
});
