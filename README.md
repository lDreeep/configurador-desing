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

Abrí la dirección que muestra la terminal, completá los 9 pasos y en **Exportar** descargá o
copiá tu `DESIGN.md`. Después, en tu IA: *"Construí esta app siguiendo el DESIGN.md"*.

## Publicarlo

`npm run build` genera una web estática en `dist/` que se puede subir a Vercel, Netlify o
GitHub Pages sin configuración extra.

## Documentación

- [`DESIGN.md`](./DESIGN.md): especificación del formato exportado y documento vivo del proyecto.
- [`CLAUDE.md`](./CLAUDE.md): cómo está organizado el código y reglas para trabajar con IA.

## Comparar y probar diseños

En cada categoría de la galería podés marcar **Comparar** en hasta tres opciones
y verlas juntas con el mismo contenido. Elegir una aplica ese diseño; cambiar de
categoría limpia la comparación. No se agregan pasos al recorrido.

Los formularios completos permiten probar campos obligatorios, adjuntos, guardado
simulado y limpieza. Las tarjetas de producto permiten elegir color y talle,
marcar favoritos y simular agregar/quitar del carrito. No se envían datos ni se
realizan compras. Las elecciones se exportan en `DESIGN.md` con su estructura y CSS.
