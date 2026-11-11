# Molde

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

Abrí la dirección que muestra la terminal. Molde es la pantalla principal: empezá desde la
portada y elegí Proyecto, Rubro, Color, Layout y Estilo. Después podés sumar piezas,
tipografía, entrada y las rondas propias de tu proyecto. Cada idea se muestra en el lienzo;
en celular, tocala y confirmá con «Usar».

Las fichas permiten volver a una ronda y abrir sus «Ajustes finos». Al terminar, descargá
el DESIGN.md y la página en HTML. El diseño y las rondas elegidas se guardan en este navegador.
Las rutas son #/inicio, #/proyecto, #/color…; los enlaces anteriores se migran a Molde.
Dale el DESIGN.md a tu IA con la instrucción: «Construí esta app siguiendo el DESIGN.md».

## Desarrollo

- `npm run dev`: servidor local.
- `npm test`: tests (Vitest).
- `npm run typecheck` y `npm run lint`: TypeScript y ESLint.
- `npm run test:e2e`: pruebas de Molde en Playwright: recorrido táctil a 390 px y recorrido de landing y dashboard en escritorio y celular, con axe en cada ronda.
- `npm run build`: build de producción en `dist/`.
- `npm run peso`: build y control del JS inicial (tiene que quedar debajo de 250 kB).

## Publicarlo

`npm run build` genera una web estática en `dist/` que se puede subir a Vercel, Netlify o
GitHub Pages sin configuración extra.

## Documentación

- [`DESIGN.md`](./DESIGN.md): especificación del formato exportado y documento vivo del proyecto.
- [`CLAUDE.md`](./CLAUDE.md): cómo está organizado el código y reglas para trabajar con IA.

## Vista previa y descargas

El lienzo usa la misma configuración y los mismos tokens que el exportador.
El HTML incorpora estilos y fotos para abrirlo sin conexión, salvo las fuentes externas.
Las interacciones de las muestras son locales: no envían datos ni realizan compras.
