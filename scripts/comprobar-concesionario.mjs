// Verificación en Chromium dentro de GitHub Actions; no requiere un checkout local.
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { build, preview } from 'vite';
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const outDir = await mkdtemp(join(tmpdir(), 'concesionario-'));
let server;
let browser;
try {
  // El lienzo de Molde es inerte. Probar la misma página fuera del editor permite usar sus controles.
  await build({ build: { outDir, rollupOptions: { input: 'scripts/concesionario.html' } } });
  server = await preview({ build: { outDir }, preview: { host: '127.0.0.1', port: 0 } });
  browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(new URL('scripts/concesionario.html', server.resolvedUrls.local[0]).href);
  const template = page.locator('.au-mot');
  await template.waitFor();
  await template.getByRole('button', { name: 'Adventure', exact: true }).click();
  assert.equal(await template.getByRole('button', { name: 'Adventure', exact: true }).getAttribute('aria-pressed'), 'true');
  assert.equal(await template.getByRole('heading', { name: 'Una moto para seguir después del asfalto' }).count(), 1);
  await template.locator('summary').click();
  assert(await template.locator('details').evaluate(element => element.open));
  await template.getByRole('button', { name: 'Enduro', exact: true }).click();
  assert.equal(await template.getByRole('heading', { name: 'Menos carrocería para moverte en tierra' }).count(), 1);
  await template.getByRole('button', { name: 'Consultar una prueba', exact: true }).first().click();
  assert((await template.getByRole('status').textContent()).includes('Elegiste Enduro'));
  await template.getByRole('button', { name: 'UTV', exact: true }).last().click();
  await mkdir('screenshots/concesionario', { recursive: true });
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.waitForTimeout(200);
    await template.locator('img').first().evaluate(async image => { await image.decode(); });
    assert(await template.locator('img').first().evaluate(image => image.naturalWidth > 0), 'La imagen debe cargar');
    const overflow = await template.evaluate(element => element.scrollWidth > element.clientWidth + 1);
    assert(!overflow, 'La plantilla desborda a ' + width + 'px');
    await template.screenshot({ path: 'screenshots/concesionario/' + width + '.png' });
    const audit = await new AxeBuilder({ page }).include('.au-mot').withTags(['wcag2a', 'wcag2aa']).analyze();
    assert.deepEqual(audit.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target) })), [], 'Accesibilidad a ' + width + 'px');
  }
  assert.deepEqual(errors, []);
  console.log('PASS: selector, fichas, consulta simulada, imágenes, 5 anchos, axe y consola.');
} finally {
  await browser?.close();
  if (server) await new Promise(resolve => server.httpServer.close(resolve));
  await rm(outDir, { recursive: true, force: true });
}
