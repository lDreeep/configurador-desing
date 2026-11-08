import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4174'], { stdio: 'inherit' });
let browser;
try {
  let listo = false;
  for (let i = 0; i < 100; i++) {
    try { listo = (await fetch('http://127.0.0.1:4174')).ok; } catch {}
    if (listo) break;
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  assert(listo);
  browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce', acceptDownloads: true });
  const page = await context.newPage();
  const errores = [];
  page.on('pageerror', error => errores.push(error.message));
  await page.goto('http://127.0.0.1:4174');
  assert.equal(await page.getByRole('heading', { name: 'Elegí una combinación. Hacela tuya.' }).count(), 1);
  await page.getByRole('button', { name: 'Combinación siguiente' }).click();
  await page.getByRole('button', { name: 'Combinación anterior' }).click();
  await page.getByRole('button', { name: 'Probar esta combinación' }).click();
  await page.getByRole('heading', { name: 'Probá tu combinación' }).waitFor();
  assert.equal(await page.getByRole('navigation', { name: 'Pasos', exact: true }).count(), 0);
  await page.getByRole('button', { name: 'Editar', exact: true }).click();
  const principal = page.locator('.proto-contenido').getByRole('button', { name: 'Explorar modelos', exact: true });
  const otro = page.locator('.proto-contenido').getByRole('button', { name: 'Consultar un modelo', exact: true });
  const claseOriginal = await principal.getAttribute('class');
  const claseOtro = await otro.getAttribute('class');
  await principal.click();
  const editor = page.getByRole('complementary', { name: 'Cambiar elementos' });
  assert.equal(await editor.getByRole('button', { name: 'Este elemento', exact: true }).getAttribute('aria-pressed'), 'true');
  await editor.getByRole('button', { name: 'Opción siguiente', exact: true }).click();
  assert.notEqual(await principal.getAttribute('class'), claseOriginal);
  assert.equal(await otro.getAttribute('class'), claseOtro);
  await page.getByRole('button', { name: 'Deshacer', exact: true }).click();
  assert.equal(await principal.getAttribute('class'), claseOriginal);
  await editor.getByRole('button', { name: 'Todo el grupo', exact: true }).click();
  await editor.getByRole('button', { name: 'Opción siguiente', exact: true }).click();
  assert.notEqual(await otro.getAttribute('class'), claseOtro);
  await page.getByRole('button', { name: 'Terminar edición', exact: true }).click();
  await mkdir('screenshots/concesionario', { recursive: true });
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.screenshot({ path: 'screenshots/concesionario/recorrido-simple-' + width + '.png', fullPage: true });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), 'Desborde a ' + width);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole('button', { name: 'Editar', exact: true }).click();
  await page.screenshot({ path: 'screenshots/concesionario/editor-simple.png', fullPage: true });
  await editor.getByLabel('¿Qué querés cambiar?').selectOption('paleta');
  await editor.getByRole('button', { name: 'Opción siguiente', exact: true }).click();
  await page.getByRole('button', { name: 'Terminar edición', exact: true }).click();
  await page.getByRole('button', { name: 'Descargar diseño', exact: true }).click();
  await page.getByRole('button', { name: /Descargar DESIGN.md/ }).waitFor();
  assert.deepEqual(errores, []);
  console.log('PASS: combinación directa, edición individual y grupal, deshacer, paleta, descarga y tres anchos.');
} finally { await browser?.close(); server.kill('SIGTERM'); }
