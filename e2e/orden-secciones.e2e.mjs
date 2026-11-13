import { createServer } from 'vite';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const server = await createServer({ server: { port: 5203, strictPort: true } });
await server.listen();
const browser = await chromium.launch({ headless: true });
try {
  const { aplicarTipo, configInicial } = await server.ssrLoadModule('/src/estado.ts');
  for (const width of [1440, 390]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, hasTouch: true });
    const page = await ctx.newPage();
    const c = aplicarTipo(configInicial(), 'landing');
    c.visual.secciones = ['beneficios_renglones', 'precios_planes', 'contacto_datos'];
    await page.addInitScript((c) => { localStorage.setItem('configurador-diseno:v1', JSON.stringify(c)); localStorage.setItem('molde:elegidas', JSON.stringify(['proyecto', 'secciones'])); }, c);
    await page.goto('http://localhost:5203/#/secciones');
    await page.locator('.molde-orden summary').click();
    const handle = page.getByRole('button', { name: /^Arrastrar Contacto/ });
    const destination = page.locator('[data-orden-seccion="beneficios_renglones"]');
    const from = await handle.boundingBox();
    const to = await destination.boundingBox();
    if (width === 390) {
      const session = await ctx.newCDPSession(page);
      await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: from.x + 22, y: from.y + 22 }] });
      await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: to.x + 22, y: to.y + 22 }] });
      await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await session.detach();
    } else {
      await page.mouse.move(from.x + 22, from.y + 22);
      await page.mouse.down();
      await page.mouse.move(to.x + 22, to.y + 22, { steps: 8 });
      await page.mouse.up();
    }
    await page.waitForFunction(() => JSON.parse(localStorage.getItem('configurador-diseno:v1')).visual.secciones[0] === 'contacto_datos');
    const bajar = page.getByRole('button', { name: /^Bajar Contacto/ });
    await bajar.focus();
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => JSON.parse(localStorage.getItem('configurador-diseno:v1')).visual.secciones[1] === 'contacto_datos');
    const box = await bajar.boundingBox();
    assert.ok(box.width >= 44 && box.height >= 44);
    await page.screenshot({ path: `screenshots/h8-${width}.png` });
    console.log(`PASS H8 ${width}: arrastre, teclado, persistencia y 44 px`);
    await ctx.close();
  }
} finally { await browser.close(); await server.close(); }
