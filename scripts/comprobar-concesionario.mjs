// Verificación en Chromium dentro de GitHub Actions; no requiere un checkout local.
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';

const server = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4173'], { stdio: 'inherit' });
let browser;
try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    try { ready = (await fetch('http://127.0.0.1:4173')).ok; } catch {}
    if (ready) break;
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  assert(ready, 'El servidor de preview no inició');
  browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:4173');
  await page.getByRole('button', { name: 'Comenzar', exact: true }).click();
  await page.getByRole('button', { name: 'Ver todos los layouts', exact: true }).click();
  await page.getByRole('button', { name: /De autor: motos y UTV/ }).click();
  await page.waitForTimeout(1200);
  const template = page.locator('.au-mot').last();
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
    const audit = await new AxeBuilder({ page }).include('.au-mot').withTags(['wcag2a', 'wcag2aa']).analyze();
    assert.deepEqual(audit.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target) })), [], 'Accesibilidad a ' + width + 'px');
    await template.screenshot({ path: 'screenshots/concesionario/' + width + '.png' });
  }
  assert.deepEqual(errors, []);
  console.log('PASS: selector, fichas, consulta simulada, imágenes, 5 anchos, axe y consola.');
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
