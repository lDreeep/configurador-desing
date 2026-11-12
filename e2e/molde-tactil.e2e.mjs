// Recorrido táctil de Molde (PLAN.md C3 e I3): a 390 px, con toques, el recorrido corto
// (Qué es → Estructura → Estilo → Color → Lo propio), con y sin `prefers-reduced-motion`.
// Uso: `npm run test:e2e` (levanta vite solo). Instalar Chromium con `npx playwright install chromium`.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import assert from 'node:assert/strict';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const PUERTO = 5199;
const URL_BASE = `http://localhost:${PUERTO}/`;

const vite = join(dirname(require.resolve('vite/package.json')), 'bin/vite.js');
const servidor = spawn(process.execPath, [vite, '--port', String(PUERTO), '--strictPort'], { stdio: 'ignore', windowsHide: true });
const cerrar = () => servidor.kill();
process.on('exit', cerrar);

async function esperarServidor() {
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(URL_BASE, { signal: AbortSignal.timeout(1000) })).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error('vite no arrancó');
}

// I4: gesto real de Chromium (no cambiar scrollTop ni despachar touchmove desde el DOM).
// Se empieza en una parte libre del lienzo, con las ideas abiertas encima de la página.
async function usarPagina(page, selector) {
  const capa = page.locator(selector);
  // La vista se abre con clip-path: esperar a que el lienzo quede expuesto al dedo.
  await page.waitForTimeout(700);
  const pregunta = page.locator('.molde-pregunta');
  assert.equal(await pregunta.getAttribute('aria-expanded'), 'true');
  assert.equal(await capa.evaluate((el) => !!el.closest('[inert], [aria-hidden="true"]')), false);
  const hash = new URL(page.url()).hash;
  const config = await page.evaluate(() => localStorage.getItem('configurador-diseno:v1'));
  const inicio = await capa.evaluate((el) => {
    const b = el.getBoundingClientRect();
    for (let y = b.bottom - 30; y > b.top + 180; y -= 20) {
      for (const x of [b.left + 20, b.right - 20, b.left + b.width / 2]) {
        if (el.contains(document.elementFromPoint(x, y))) return { x, y, scroll: el.scrollTop };
      }
    }
    return null;
  });
  if (!inicio) {
    await page.screenshot({ path: 'dist/i4-gesto-fallo.png' });
    console.log(await capa.evaluate((el) => ({ selector: el.className, caja: el.getBoundingClientRect().toJSON(), clip: getComputedStyle(el).clipPath, raiz: el.closest('.molde').className, puntos: [200, 400, 600].map((y) => document.elementFromPoint(30, y)?.outerHTML.slice(0, 180)) })));
  }
  assert.ok(inicio, `sin espacio para scrollear ${selector} con las ideas abiertas`);
  const sesion = await page.context().newCDPSession(page);
  try {
    await sesion.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: inicio.x, y: inicio.y }] });
    for (let i = 1; i <= 10; i++) {
      await sesion.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: inicio.x, y: inicio.y - i * 18 }] });
      await page.waitForTimeout(20);
    }
    await sesion.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  } finally {
    await sesion.detach();
  }
  await page.waitForFunction(({ selector, scroll }) => document.querySelector(selector).scrollTop > scroll + 20, { selector, scroll: inicio.scroll });
  assert.equal(await pregunta.getAttribute('aria-expanded'), 'false', 'el gesto recoge las ideas');
  assert.equal(await page.locator('.molde-ideas').getAttribute('inert'), '');

  // El botón de la muestra recibe el toque y ejecuta su animación sin navegar ni elegir la ronda.
  const boton = capa.locator('.pg-boton').first();
  await boton.scrollIntoViewIfNeeded();
  // Esperar el fin de la inercia del gesto: un toque durante la inercia solo frena el scroll.
  await capa.evaluate((el) => new Promise((resolve) => {
    let anterior = el.scrollTop;
    let quietos = 0;
    const medir = () => {
      quietos = Math.abs(el.scrollTop - anterior) < 1 ? quietos + 1 : 0;
      anterior = el.scrollTop;
      if (quietos >= 4) resolve();
      else setTimeout(medir, 50);
    };
    medir();
  }));
  await boton.tap();
  assert.ok(await boton.evaluate((el) => el.classList.contains('toque')), 'el botón de muestra no respondió');
  assert.equal(new URL(page.url()).hash, hash);
  assert.equal(await page.evaluate(() => localStorage.getItem('configurador-diseno:v1')), config);
  if (selector === '.molde-prev') assert.ok(await capa.locator('.pg').count(), 'se perdió la vista previa al tocarla');
  await pregunta.tap();
  assert.equal(await pregunta.getAttribute('aria-expanded'), 'true', 'se pueden volver a abrir las ideas');
  await page.waitForTimeout(700);
}

async function recorrer(browser, reducedMotion) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2, reducedMotion: reducedMotion ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  page.setDefaultTimeout(15000);
  const errores = [];
  page.on('pageerror', (e) => errores.push(e.message));
  await page.goto(URL_BASE);
  await page.getByRole('button', { name: 'Empezar', exact: true }).tap();

  const rondas = [];
  for (let i = 0; i < 12 && !page.url().endsWith('/listo'); i++) {
    const ronda = await page.evaluate(() => location.hash.replace('#/', ''));
    console.log(`táctil${reducedMotion ? ' reduce' : ''}: ${ronda}`);
    rondas.push(ronda);
    const ideas = page.locator('.molde-idea');
    await ideas.first().waitFor();
    await page.waitForTimeout(reducedMotion ? 50 : 500);

    if (ronda === 'color') await usarPagina(page, '.molde-base');

    // Áreas táctiles de al menos 44 px (los botones de la página de muestra son el diseño, no la interfaz).
    for (const caja of await page.locator('.molde button:visible').evaluateAll((bs) => bs.filter((b) => !b.closest('.pg')).map((b) => [b.textContent.trim().slice(0, 20), b.getBoundingClientRect().height, b.getBoundingClientRect().width]))) {
      assert.ok(caja[1] >= 44 && caja[2] >= 44 || caja[0] === '', `botón chico en ${ronda}: ${caja}`);
    }

    // Un toque muestra la idea y aparecen «Usar» y «Ver otras»; todavía no se eligió.
    await ideas.first().tap();
    await page.getByRole('button', { name: 'Usar', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Ver otras', exact: true }).waitFor();
    assert.ok(await page.locator('.molde-prev .pg').count(), `sin vista previa en ${ronda}`);
    assert.ok(page.url().endsWith('/' + ronda), `el toque no tiene que elegir (${ronda})`);

    if (ronda === 'color') await usarPagina(page, '.molde-prev');

    // «Ver otras» descarta la vista y deja ver más ideas; se vuelve a tocar y se usa.
    await page.getByRole('button', { name: 'Ver otras', exact: true }).tap();
    assert.equal(await page.getByRole('button', { name: 'Usar', exact: true }).count(), 0);
    await page.waitForTimeout(reducedMotion ? 50 : 300);
    await page.locator('.molde-idea').first().tap();
    await page.getByRole('button', { name: 'Usar', exact: true }).tap();
    await page.waitForTimeout(300);
    // Las rondas de elegir varias (secciones, scroll) quedan abiertas: sigue el botón de la bandeja.
    if (page.url().endsWith('/' + ronda)) await page.locator('.molde-final .molde-btn').last().tap();
    await page.waitForFunction((r) => !location.hash.endsWith('/' + r), ronda);
  }
  // I3: el recorrido corto tiene 5 pasos como máximo, y arranca por Proyecto, Rubro y Layout.
  assert.deepEqual(rondas.slice(0, 3), ['proyecto', 'rubro', 'layout']);
  assert.ok(rondas.includes('estilo') && rondas.includes('color'), rondas.join());
  assert.ok(rondas.indexOf('estilo') < rondas.indexOf('color'), 'Estilo debe ir antes de Color');
  await page.waitForFunction(() => location.hash.endsWith('/listo'));
  // Final: la página entera y «Descargar» en la esquina, que abre la ventana de descarga.
  assert.equal(await page.locator('.molde-idea').count(), 0);
  assert.equal(await page.locator('.molde-pie').count(), 0);
  assert.ok(await page.locator('.molde-base .pg').isVisible());
  const esquina = page.getByRole('button', { name: 'Descargar', exact: true });
  const cajaEsquina = await esquina.boundingBox();
  assert.ok(cajaEsquina && cajaEsquina.width >= 44 && cajaEsquina.height >= 44);
  assert.ok(cajaEsquina.x + cajaEsquina.width <= 390 && cajaEsquina.y + cajaEsquina.height <= 844, 'Descargar fuera de pantalla');
  await page.locator('.molde-base').evaluate((el) => { el.scrollTop += 200; });
  assert.deepEqual(await esquina.boundingBox(), cajaEsquina, 'Descargar debe quedarse en la esquina al scrollear');
  await page.getByRole('button', { name: 'Descargar', exact: true }).tap();
  await page.getByRole('button', { name: 'Descargar DESIGN.md' }).waitFor();
  // F3: ambas descargas completas dentro del primer pantallazo, en celular y escritorio.
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await page.locator('.molde-descarga').waitFor();
    for (const name of ['Descargar DESIGN.md', 'Descargar HTML']) {
      const boton = page.getByRole('button', { name, exact: true });
      const caja = await boton.boundingBox();
      assert.ok(caja && caja.y >= 0 && caja.y + caja.height <= page.viewportSize().height, name + ' fuera de pantalla a ' + width);
      const [descarga] = await Promise.all([page.waitForEvent('download'), boton.tap()]);
      assert.equal(descarga.suggestedFilename(), name.endsWith('HTML') ? 'preview.html' : 'DESIGN.md');
      assert.equal(await descarga.failure(), null);
    }
    assert.equal(await page.locator('.molde-resumen').getAttribute('open'), null);
    assert.ok(await page.locator('.molde-archivo pre').evaluate(el => el.scrollHeight > el.clientHeight));
    assert.ok(await page.locator('.molde-descarga').evaluate(el => el.scrollWidth <= el.clientWidth));
    await page.screenshot({ path: 'dist/descarga-' + width + (reducedMotion ? '-reduce' : '') + '.png' });
  }
  await page.locator('.molde-resumen summary').click();
  await page.locator('.molde-resumen .molde-ficha').first().click();
  await page.waitForFunction(() => location.hash.endsWith('/proyecto'));
  assert.deepEqual(errores, []);
  // C5: las rutas anteriores llegan a Molde, y recargar conserva la ronda y el diseño.
  const configAntes = await page.evaluate(() => localStorage.getItem('configurador-diseno:v1'));
  for (const [vieja, nueva] of [['#/molde/color', '#/color'], ['#/avanzado/tipografia', '#/letra'], ['#/detallado/cajas', '#/estilo']]) {
    await page.goto(URL_BASE + vieja);
    await page.waitForFunction((hash) => location.hash === hash, nueva);
    await page.locator('.molde').waitFor();
    await page.reload();
    await page.waitForFunction((hash) => location.hash === hash, nueva);
    assert.equal(await page.evaluate(() => localStorage.getItem('configurador-diseno:v1')), configAntes);
  }
  await page.goBack();
  await page.waitForFunction(() => location.hash === '#/letra');
  await page.goForward();
  await page.waitForFunction(() => location.hash === '#/estilo');
  // Ubicación guardada de la app anterior, entrando sin hash.
  await page.evaluate(() => localStorage.setItem('configurador-diseno:ubicacion', JSON.stringify({ modo: 'avanzado', paso: 'color' })));
  await page.goto(URL_BASE);
  await page.waitForFunction(() => location.hash === '#/color');
  assert.deepEqual(errores, []);
  await ctx.close();
}

try {
  await esperarServidor();
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  await recorrer(browser, false);
  console.log('ok: recorrido táctil a 390 px');
  await recorrer(browser, true);
  console.log('ok: recorrido táctil a 390 px con movimiento reducido');
  await browser.close();
} finally {
  cerrar();
}
