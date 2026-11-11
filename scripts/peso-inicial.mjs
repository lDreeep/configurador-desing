// Revisa cuánto JS baja la primera visita (PLAN.md B2): el que pide dist/index.html, más lo que
// ese archivo importa sin `import()`. Correr después de `npm run build`. Falla si pasa el límite.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const LIMITE = 250_000;
const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const html = readFileSync(join(dist, 'index.html'), 'utf8');
const entrada = html.match(/<script[^>]+src="\.\/(assets\/[^"]+\.js)"/)?.[1];
if (!entrada) throw new Error('No encontré el JS de entrada en dist/index.html (¿corriste npm run build?).');

const vistos = new Set();
const pendientes = [entrada];
while (pendientes.length) {
  const archivo = pendientes.pop();
  if (vistos.has(archivo)) continue;
  vistos.add(archivo);
  const codigo = readFileSync(join(dist, archivo), 'utf8');
  // Solo los imports estáticos («import … from "./x.js"»); los import() bajan después.
  for (const m of codigo.matchAll(/(?:^|[;}])\s*import\s*(?:[\w{},*\s$]+from\s*)?["']\.\/([^"']+\.js)["']/g)) pendientes.push(`assets/${m[1]}`);
}
const total = [...vistos].reduce((n, a) => n + readFileSync(join(dist, a)).length, 0);
console.log(`JS inicial: ${(total / 1000).toFixed(1)} kB en ${vistos.size} archivo(s) (límite ${LIMITE / 1000} kB).`);
if (total >= LIMITE) {
  console.error('Pasa el límite: llevá a carga aparte lo que la portada no usa (ver PLAN.md B2).');
  process.exit(1);
}
