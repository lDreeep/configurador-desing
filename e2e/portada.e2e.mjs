// E2. Después de npm run build, con Playwright instalado: node e2e/portada.e2e.mjs
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { preview } from 'vite';

const { chromium } = createRequire(import.meta.url)('playwright');
const servidor = await preview({ preview: { host: '127.0.0.1', port: 0 } });
let browser;
try {
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
  for (const movil of [false, true]) {
    const viewport = movil ? { width: 390, height: 844 } : { width: 1440, height: 900 };
    const contexto = await browser.newContext({ viewport, hasTouch: movil, isMobile: movil });
    const pagina = await contexto.newPage();
    const errores = [];
    pagina.on('pageerror', (e) => errores.push(e.message));
    await pagina.goto(servidor.resolvedUrls.local[0] + '#/inicio');
    await pagina.locator('.portada-lente .pg:visible').waitFor();
    const scroll = pagina.locator('.portada-scroll');
    const boton = pagina.getByRole('button', { name: 'Empezar', exact: true });
    await pagina.evaluate(() => document.fonts.ready);
    const medida = await scroll.evaluate((el) => new Promise((resolve) => {
      const distancia = el.scrollHeight - el.clientHeight;
      const tiempos = [];
      function cuadro(t) {
        tiempos.push(t);
        const transcurrido = t - tiempos[0];
        el.scrollTop = distancia * Math.min(transcurrido / 6000, 1);
        if (transcurrido < 6000) requestAnimationFrame(cuadro);
        else {
          const deltas = tiempos.slice(1).map((v, i) => v - tiempos[i]).sort((a, b) => a - b);
          resolve({ fps: ((tiempos.length - 1) * 1000 / transcurrido).toFixed(1), p95ms: deltas[Math.floor(deltas.length * .95)].toFixed(1) });
        }
      }
      requestAnimationFrame(cuadro);
    }));
    console.log(viewport, medida);
    for (const [progreso, fase] of [[1, 'fin'], [.48, 'demo'], [0, 'inicio']]) {
      await scroll.evaluate((el, p) => { el.scrollTop = (el.scrollHeight - el.clientHeight) * p; }, progreso);
      await pagina.locator('.molde-portada[data-fase="' + fase + '"]').waitFor();
      if (movil) await boton.tap();
      else await boton.click();
      await pagina.waitForURL('**/#/proyecto');
      await pagina.goBack();
      await scroll.waitFor();
    }
    await pagina.emulateMedia({ reducedMotion: 'reduce' });
    await scroll.waitFor({ state: 'detached' });
    assert.equal(await pagina.locator('.portada-lente .pg:visible').count(), 1);
    await boton.focus();
    await pagina.keyboard.press('Enter');
    await pagina.waitForURL('**/#/proyecto');
    assert.deepEqual(errores, []);
    await contexto.close();
  }
} finally {
  await browser?.close();
  await new Promise((resolve) => servidor.httpServer.close(resolve));
}
