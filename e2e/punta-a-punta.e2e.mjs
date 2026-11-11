// Recorrido completo de Molde para una landing y un dashboard (PLAN.md G1), en escritorio (1440 px, mouse,
// tema claro) y celular (390 px, toques, tema oscuro). En cada ronda se audita con axe (WCAG 2 A y AA),
// se cuenta un solo h1 y un solo main, y (G2) en celular todo control mide 44 px y en escritorio el foco se ve.
// Uso: `npm run test:e2e` (levanta vite solo). Capturas finales en screenshots/punta-a-punta/.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import assert from 'node:assert/strict';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const PUERTO = 5200;
const URL_BASE = `http://localhost:${PUERTO}/`;
const MAX_RONDAS = 30;

const vite = join(dirname(require.resolve('vite/package.json')), 'bin/vite.js');
const servidor = spawn(process.execPath, [vite, '--port', String(PUERTO), '--strictPort'], { stdio: 'ignore', windowsHide: true });
const cerrar = () => servidor.kill();
process.on('exit', cerrar);

const TIPOS = [
  { id: 'landing', nombre: 'Landing' },
  { id: 'dashboard', nombre: 'Dashboard' },
];
const VIEWPORTS = [
  { nombre: 'escritorio', ancho: 1440, alto: 900, touch: false, esquema: 'light' },
  { nombre: 'celular', ancho: 390, alto: 844, touch: true, esquema: 'dark' },
];

async function esperarServidor() {
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(URL_BASE, { signal: AbortSignal.timeout(1000) })).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error('vite no arrancó');
}

// Espera a que terminen las transiciones y animaciones que tienen fin: axe tiene que medir lo que queda en
// pantalla, no un fundido a medias. No cuentan las que se repiten siempre (el latido del botón) ni las que
// van atadas al scroll (ViewTimeline/ScrollTimeline), que no terminan con el tiempo.
async function esperarQuieto(page) {
  await page.waitForFunction(() =>
    document
      .getAnimations()
      .every((a) => a.playState !== 'running' || a.effect?.getComputedTiming().iterations === Infinity || !(a.timeline instanceof DocumentTimeline)),
  );
}

// Axe en la pantalla actual, más un solo h1 y un solo main (G2). Un fallo indica la ronda y las reglas que no pasan.
async function auditar(page, etiqueta) {
  await esperarQuieto(page);
  // La página de muestra (.pg) trae sus propios títulos: son el diseño, no la interfaz.
  const marcas = await page.evaluate(() => { const fuera = (q) => [...document.querySelectorAll(q)].filter((e) => !e.closest('.pg')).length; return { h1: fuera('h1'), main: fuera('main, [role=main]') }; });
  assert.deepEqual(marcas, { h1: 1, main: 1 }, `h1 y main en «${etiqueta}»`);
  const resultado = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  const fallos = resultado.violations.map((v) => ({
    ronda: etiqueta,
    regla: v.id,
    impacto: v.impact,
    nodos: v.nodes.slice(0, 3).map((n) => n.target.join(' ')),
  }));
  assert.deepEqual(fallos, [], `axe en «${etiqueta}»`);
}

// Un toque (o clic) elige la primera idea; en celular el toque solo la muestra y hay que confirmar con «Usar».
async function elegirPrimeraIdea(page, touch, filtro) {
  const idea = filtro ? page.locator('.molde-idea', { hasText: filtro }).first() : page.locator('.molde-idea').first();
  if (touch) {
    await idea.tap();
    await page.getByRole('button', { name: 'Usar', exact: true }).tap();
  } else {
    await idea.click();
  }
}

// En celular, todo control de la interfaz que se toca mide al menos 44 px (G2). Los de la página de
// muestra (.pg) no cuentan: son el diseño que se elige, no la interfaz.
async function revisarAreasTactiles(page, etiqueta) {
  const chicos = await page
    .locator('.molde :is(button, a[href], select, textarea, input:not([type=hidden], [type=checkbox], [type=radio]), summary, [role=button])')
    .evaluateAll((bs) =>
      bs
        .filter((b) => b.getClientRects().length && getComputedStyle(b).visibility !== 'hidden' && !b.closest('.pg, [aria-hidden=true], [inert]'))
        .map((b) => [b.textContent.trim().slice(0, 30) || b.getAttribute('aria-label'), Math.round(b.getBoundingClientRect().width), Math.round(b.getBoundingClientRect().height)])
        .filter(([, w, h]) => w < 44 || h < 44),
    );
  assert.deepEqual(chicos, [], `áreas de menos de 44 px en «${etiqueta}»`);
}

// En escritorio, recorrer con Tab: cada control que recibe el foco lo muestra (contorno o sombra) (G2).
async function revisarFoco(page, etiqueta) {
  await page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
  const sinFoco = [];
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('Tab');
    const f = await page.evaluate(() => {
      const e = document.activeElement;
      if (!e || e === document.body) return null;
      const cs = getComputedStyle(e);
      const visible = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== 'none';
      return visible ? '' : `${e.tagName.toLowerCase()} ${(e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 30)}`;
    });
    if (f === null) break;
    if (f) sinFoco.push(f);
  }
  assert.deepEqual(sinFoco, [], `foco invisible en «${etiqueta}»`);
}

async function recorrer(browser, tipo, vp) {
  const etiquetaBase = `${tipo.id} · ${vp.nombre} · ${vp.esquema === 'dark' ? 'oscuro' : 'claro'}`;
  const ctx = await browser.newContext({
    viewport: { width: vp.ancho, height: vp.alto },
    hasTouch: vp.touch,
    isMobile: vp.touch,
    deviceScaleFactor: vp.touch ? 2 : 1,
    colorScheme: vp.esquema,
  });
  const page = await ctx.newPage();
  const errores = [];
  page.on('pageerror', (e) => errores.push(e.message));

  if (process.env.E2E_LENTO) await page.route(/Portada/, async (r) => { await new Promise((ok) => setTimeout(ok, 3000)); await r.continue(); });
  await page.goto(URL_BASE);
  const empezar = page.getByRole('button', { name: 'Empezar', exact: true });
  await empezar.waitFor();
  // La portada baja aparte: mientras tanto Molde muestra un «Empezar» provisorio sin h1. En un CI
  // lento ese botón aparece antes que la portada, así que se espera su título.
  await page.locator('h1').first().waitFor();
  await auditar(page, `${etiquetaBase} · inicio`);
  if (vp.touch) await revisarAreasTactiles(page, `${etiquetaBase} · inicio`);
  else await revisarFoco(page, `${etiquetaBase} · inicio`);
  if (vp.touch) await empezar.tap();
  else await empezar.click();

  // Primera ronda: el tipo de proyecto. Después, cada ronda hasta la pantalla final.
  await page.waitForFunction(() => location.hash === '#/proyecto');
  await page.locator('.molde-idea').first().waitFor();
  await page.waitForTimeout(900);
  await auditar(page, `${etiquetaBase} · proyecto`);
  await elegirPrimeraIdea(page, vp.touch, tipo.nombre);
  await page.waitForFunction(() => location.hash !== '#/proyecto');

  const rondas = [];
  for (let i = 0; i < MAX_RONDAS && !page.url().endsWith('/listo'); i++) {
    const hashAntes = await page.evaluate(() => location.hash);
    const ronda = hashAntes.replace(/^#\//, '');
    if (ronda === 'proyecto') {
      // Todavía en Proyecto: el tipo no quedó elegido. Se corta en vez de dar vueltas.
      throw new Error(`no se pudo elegir ${tipo.nombre} en Proyecto`);
    }
    rondas.push(ronda);
    await page.locator('.molde-idea').first().waitFor();
    await page.waitForTimeout(900);
    const etiqueta = `${etiquetaBase} · ${ronda}`;
    await auditar(page, etiqueta);
    if (vp.touch) await revisarAreasTactiles(page, etiqueta);
    else if (rondas.length === 1) await revisarFoco(page, etiqueta);

    await elegirPrimeraIdea(page, vp.touch);
    // Las rondas de elegir varias quedan abiertas y sigue el botón de la bandeja («Siguiente» o «Terminar»);
    // las demás pasan solas a la siguiente.
    await page.waitForTimeout(400);
    if ((await page.evaluate(() => location.hash)) === hashAntes) {
      await page.locator('.molde-final .molde-btn').last().click();
      await page.waitForFunction((h) => location.hash !== h, hashAntes);
    }
  }

  assert.ok(page.url().endsWith('/listo'), `${etiquetaBase}: no llegó a la pantalla final en ${MAX_RONDAS} rondas (${rondas.join(', ')})`);
  // I3: al final queda la página entera y «Descargar» en la esquina, que abre la ventana de descarga.
  await page.getByRole('button', { name: 'Descargar', exact: true }).waitFor();
  await page.waitForTimeout(900);
  await auditar(page, `${etiquetaBase} · página terminada`);
  await page.getByRole('button', { name: 'Descargar', exact: true }).click();
  await page.getByRole('heading', { name: 'Tu molde está listo', exact: true }).waitFor();
  await page.waitForTimeout(900);
  await auditar(page, `${etiquetaBase} · listo`);
  if (vp.touch) await revisarAreasTactiles(page, `${etiquetaBase} · listo`);
  else await revisarFoco(page, `${etiquetaBase} · listo`);

  // La descarga de DESIGN.md llega completa y la vista previa tiene contenido.
  const [descarga] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Descargar DESIGN.md', exact: true }).click()]);
  assert.equal(descarga.suggestedFilename(), 'DESIGN.md');
  assert.equal(await descarga.failure(), null);
  assert.ok((await page.locator('.molde-archivo pre').textContent()).trim().length > 200, 'DESIGN.md vacío en la vista previa');

  await mkdir('screenshots/punta-a-punta', { recursive: true });
  await page.screenshot({ path: `screenshots/punta-a-punta/${tipo.id}-${vp.nombre}.png`, fullPage: false });
  assert.deepEqual(errores, [], `errores de página en ${etiquetaBase}`);
  console.log(`ok: ${etiquetaBase} (${rondas.length} rondas: ${rondas.join(', ')})`);
  await ctx.close();
}

try {
  await esperarServidor();
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  for (const tipo of TIPOS) {
    for (const vp of VIEWPORTS) await recorrer(browser, tipo, vp);
  }
  await browser.close();
  console.log('PASS: landing y dashboard de punta a punta, en escritorio y celular, con axe en cada ronda.');
} finally {
  cerrar();
}
