import { createServer } from 'vite';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { parse } from 'yaml';

// Reproducir desde la raíz: node scripts/h5-exportar.mjs
// Fecha fija: las muestras son evidencia de la revisión, no una descarga de hoy.
const servidor = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { configInicial, normalizar } = await servidor.ssrLoadModule('/src/estado.ts');
  const { PROYECTO, RUBRO, LAYOUT, ESTILO, COLOR } = await servidor.ssrLoadModule('/src/rondas/comunes.ts');
  const { generarDesignMd, VERSION_FORMATO } = await servidor.ssrLoadModule('/src/export/generarDesignMd.ts');
  const casos = [
    { id: 'landing', nombre: 'Turno Sur', descripcion: 'Landing de una app de turnos para barberías.', objetivo: 'Pedir una demostración', publico: 'Dueños de barberías de Argentina', acciones: ['Conocer los beneficios', 'Pedir una demostración por email'], integraciones: ['email'], cuenta: 'no', variante: 0 },
    { id: 'dashboard', nombre: 'Depósito Sur', descripcion: 'Dashboard interno para revisar las ventas de un distribuidor.', objetivo: 'Detectar caídas de ventas y revisar pedidos', publico: 'Analistas y responsables comerciales', acciones: ['Filtrar ventas por fecha', 'Revisar pedidos', 'Exportar el informe filtrado'], integraciones: [], cuenta: 'si', variante: 1 },
    { id: 'tienda', nombre: 'Taller Arcilla', descripcion: 'Tienda de piezas de cerámica hechas a mano.', objetivo: 'Comprar piezas con envío dentro de Argentina', publico: 'Personas que compran objetos para su casa desde el celular', acciones: ['Buscar productos', 'Elegir variante y cantidad', 'Agregar al carrito', 'Pagar el pedido'], integraciones: ['pagos', 'email'], cuenta: 'no', variante: 2 },
  ];
  for (const caso of casos) {
    const ctx = { elegidas: new Set() };
    let c = PROYECTO.aplicar(configInicial(), caso.id, ctx);
    c = RUBRO.aplicar(c, ({ landing: 'producto_digital', dashboard: 'ventas', tienda: 'artesanias' })[caso.id], ctx);
    c = LAYOUT.aplicar(c, LAYOUT.opciones(c)[caso.variante].id, ctx);
    c = ESTILO.aplicar(c, ESTILO.opciones(c)[caso.variante].id, ctx);
    c = COLOR.aplicar(c, COLOR.opciones(c)[caso.variante].id, ctx);
    c.proyecto = { ...c.proyecto, nombre: caso.nombre, descripcion: caso.descripcion, objetivo: caso.objetivo, publicoQuienes: caso.publico, publicoContexto: 'Uso en Argentina, en escritorio y celular.' };
    c.funciones = { ...c.funciones, acciones: caso.acciones, integraciones: caso.integraciones, requiereCuenta: caso.cuenta, fueraDeAlcance: ['Implementar servicios externos sin confirmar proveedor y credenciales'] };
    if (caso.id === 'landing') c.visual.secciones = ['beneficios_renglones', 'preguntas_acordeon', 'contacto_formulario'];
    if (caso.id === 'dashboard') c.visual.ambosModos = true;
    c.notasGenerales = 'Proyecto ficticio para auditar el export. No inventes testimonios, precios ni métricas como si fueran reales.';
    c = normalizar(c);
    const md = generarDesignMd(c, '2026-11-13');
    const bloques = [...md.matchAll(/```yaml\n([\s\S]*?)\n```/g)].map((m) => parse(m[1]));
    assert.equal(bloques[0].version_formato, VERSION_FORMATO);
    assert.equal(bloques[0].modo, 'proyecto');
    assert.ok(md.includes(`tipo: ${caso.id}`));
    const carpeta = resolve('pruebas/h5', caso.id);
    await mkdir(carpeta, { recursive: true });
    await writeFile(resolve(carpeta, 'config.json'), JSON.stringify(c, null, 2) + '\n');
    await writeFile(resolve(carpeta, 'DESIGN.md'), md);
    await writeFile(resolve(carpeta, 'PEDIDO.md'), `Adjunto el DESIGN.md de ${caso.nombre}. Quiero construir lo que describe: ${caso.descripcion} El objetivo es ${caso.objetivo.toLowerCase()}. Leé el archivo completo, preguntame primero lo pendiente que bloquee y mostrame la maqueta que pide §1 antes de implementar todo. Respetá los tokens, las notas, las pantallas y la accesibilidad. Explicá las decisiones que tengas que tomar y distinguí datos de muestra de datos reales.\n`);
    console.log(`${caso.id}: ${bloques.length} bloques YAML válidos; layout=${c.visual.layout}; estilo=${c.visual.estilo}; paleta=${c.visual.paleta}`);
  }
} finally {
  await servidor.close();
}
