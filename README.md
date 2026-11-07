# Configurador de diseño

Elegí cómo se ve y qué hace tu web o app, paso a paso y con vista previa en vivo, y descargá un
**`DESIGN.md`**: un solo archivo con todo (pantallas, funciones, color, tipografía, forma,
movimiento, accesibilidad y tokens CSS) que podés darle a Claude, Claude Code, v0, Lovable o la
IA que uses para que construya tu proyecto sin inventar decisiones de diseño.

## Usarlo

```bash
npm install
```

```bash
npm run dev
```

Abrí la dirección que muestra la terminal, recorré los 13 pasos del modo rápido (o los 11 del avanzado) y en **Exportar** descargá o
copiá tu `DESIGN.md`. Después, en tu IA: *"Construí esta app siguiendo el DESIGN.md"*.

## Publicarlo

`npm run build` genera una web estática en `dist/` que se puede subir a Vercel, Netlify o
GitHub Pages sin configuración extra.

## Documentación

- [`DESIGN.md`](./DESIGN.md): especificación del formato exportado y documento vivo del proyecto.
- [`CLAUDE.md`](./CLAUDE.md): cómo está organizado el código y reglas para trabajar con IA.

## Sistema UI

El paso **Sistema UI**, después de Cajas, permite ajustar 23 decisiones en seis
grupos: composición, lectura, formularios, datos, respuesta e imágenes. Buscá una
decisión, elegí una alternativa y probala en la muestra de escritorio o celular.
El formulario, la selección de filas y la confirmación son demostraciones locales.
Las preferencias se guardan en este navegador y se incluyen en `DESIGN.md` (§22,
formato 0.9.0), con sus tokens y CSS. Las decisiones de comportamiento se describen
para que la IA las implemente en el proyecto final.

Para verificar el proyecto: `npm run typecheck`, `npm test` y `npm run build`.
