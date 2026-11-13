// H12: elección por UI, CSS real, persistencia, HTML exportado y fallbacks.
// Ejecutar: node e2e/interacciones.e2e.mjs
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { chromium } from 'playwright';
const server = await createServer({ server: { port: 5204, strictPort: true } });
await server.listen();
let browser;
try {
  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || undefined });
  const { configInicial, aplicarTipo } = await server.ssrLoadModule('/src/estado.ts');
  const c = aplicarTipo(configInicial(), 'landing');
  c.proyecto.nombre = 'Prueba de interacciones';
  c.proyecto.rubro = 'producto_digital';
  c.visual.layout = 'bento';
  c.visual.aparicion = 'nada';
  c.cajas = { preset: 'superficie', ajustes: { hover: 'inclinar' } };
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.addInitScript((c) => {
    if (!localStorage.getItem('configurador-diseno:v1')) {
      localStorage.setItem('configurador-diseno:v1', JSON.stringify(c));
      localStorage.setItem('molde:elegidas', JSON.stringify(['proyecto', 'rubro', 'layout', 'estilo', 'color', 'scroll']));
    }
  }, c);
  await page.goto('http://localhost:5204/#/hover_tarjetas');
  await page.locator('.molde-idea').filter({ hasText: /^Elevar/ }).click();
  await page.locator('.molde-idea').filter({ hasText: /^Anillo/ }).click();
  await page.waitForURL('**/#/listo');
  await page.locator('.molde-base .pg').waitFor();
  const root = page.locator('.molde-base .pg');
  const card = root.locator('.pg-card').first();
  await card.hover();
  await page.waitForTimeout(350);
  assert.equal(await card.evaluate((el) => getComputedStyle(el).translate), '0px -2px');
  assert.match(await root.evaluate((el) => getComputedStyle(el).cursor), /data:image\/svg\+xml/);
  assert.equal(await root.locator('.pg-boton').first().evaluate((el) => getComputedStyle(el).cursor), 'pointer');
  await page.reload();
  await page.locator('.molde-base .pg.tarjetas-hover-elevar.cursor-anillo').waitFor();
  // La opción Nada también neutraliza el borde del hover del preset.
  await card.evaluate((el) => {
    el.classList.add('caja', 'caja-hover-borde');
    el.style.setProperty('--caja-borde', '1px solid rgb(100, 100, 100)');
  });

  // Las clases provienen del catálogo y la hoja ya trae todas sus reglas.
  for (const id of ['nada', 'oscurecer', 'brillo', 'elevar', 'escalar', 'sombra', 'desplazar']) {
    await root.evaluate((el, id) => {
      el.classList.remove(...[...el.classList].filter((c) => c.startsWith('tarjetas-hover-')));
      el.classList.add(`tarjetas-hover-${id}`);
    }, id);
    await card.hover();
    await page.waitForTimeout(350);
    const css = await card.evaluate((el) => ({ transform: getComputedStyle(el).transform, translate: getComputedStyle(el).translate, scale: getComputedStyle(el).scale, filter: getComputedStyle(el).filter, shadow: getComputedStyle(el).boxShadow }));
    if (id === 'nada') {
      assert.equal(css.transform, 'none');
      assert.equal(await card.evaluate((el) => getComputedStyle(el).outlineStyle), 'none');
      await card.evaluate((el) => { el.style.transform = 'rotate(3deg)'; });
      assert.notEqual(await card.evaluate((el) => getComputedStyle(el).transform), 'none');
      await card.evaluate((el) => { el.style.removeProperty('transform'); });
    }
    if (id === 'oscurecer') assert.match(css.filter, /brightness\(0.9\)/);
    if (id === 'brillo') assert.match(css.filter, /brightness\(1.12\)/);
    if (id === 'elevar') assert.equal(css.translate, '0px -2px');
    if (id === 'escalar') assert.equal(css.scale, '1.06');
    if (id === 'sombra') assert.notEqual(css.shadow, 'none');
    if (id === 'desplazar') assert.equal(css.translate, '-2px -2px');
  }
  for (const id of ['normal', 'punto', 'anillo', 'cruz']) {
    await root.evaluate((el, id) => {
      el.classList.remove(...[...el.classList].filter((c) => c.startsWith('cursor-')));
      el.classList.add(`cursor-${id}`);
    }, id);
    const cursor = await root.evaluate((el) => getComputedStyle(el).cursor);
    if (id === 'normal') assert.equal(cursor, 'auto');
    else assert.match(cursor, /data:image\/svg\+xml/);
    assert.equal(await root.locator('.pg-boton').first().evaluate((el) => getComputedStyle(el).cursor), 'pointer');
  }
  await page.reload();
  await root.waitFor();
  const html = await page.evaluate(async () => {
    const { generarPreviewHtml } = await import('/src/export/generarPreviewHtml.ts');
    return generarPreviewHtml(document.querySelector('.molde-base .pg'), 'Prueba H12');
  });
  const offline = await ctx.newPage();
  await offline.route('**/*', (route) => route.abort());
  await offline.setContent(html);
  const exported = offline.locator('.pg');
  await exported.locator('.pg-card').first().hover();
  await offline.waitForTimeout(350);
  assert.equal(await exported.locator('.pg-card').first().evaluate((el) => getComputedStyle(el).translate), '0px -2px');
  assert.match(await exported.evaluate((el) => getComputedStyle(el).cursor), /data:image\/svg\+xml/);
  await offline.close();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await card.hover();
  assert.equal(await root.evaluate((el) => getComputedStyle(el).cursor), 'auto');
  assert.equal(await card.evaluate((el) => getComputedStyle(el).translate), 'none');
  assert.equal(await card.evaluate((el) => getComputedStyle(el).scale), 'none');
  assert.equal(await card.evaluate((el) => getComputedStyle(el).filter), 'none');
  await page.screenshot({ path: 'screenshots/h12-escritorio.png' });
  await ctx.close();

  const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const movil = await touch.newPage();
  c.visual.cursor = 'cruz';
  c.visual.hoverTarjetas = 'escalar';
  await movil.addInitScript((c) => {
    localStorage.setItem('configurador-diseno:v1', JSON.stringify(c));
    localStorage.setItem('molde:elegidas', JSON.stringify(['proyecto', 'rubro', 'layout', 'estilo', 'color']));
  }, c);
  await movil.goto('http://localhost:5204/#/listo');
  const pagina = movil.locator('.molde-base .pg');
  await pagina.waitFor();
  assert.equal(await pagina.evaluate((el) => getComputedStyle(el).cursor), 'auto');
  await pagina.locator('.pg-card').first().tap();
  assert.equal(await pagina.locator('.pg-card').first().evaluate((el) => getComputedStyle(el).scale), 'none');
  await movil.screenshot({ path: 'screenshots/h12-celular.png' });
  await touch.close();
  console.log('PASS H12: rondas, siete hover, cursor, controles nativos, persistencia, HTML sin red, tacto y movimiento reducido');
} finally { await browser?.close(); await server.close(); }
