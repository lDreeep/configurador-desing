# Plan de Molde

Plan para convertir el configurador actual en **Molde**: una página que arranca en blanco, un
botón que explota en ideas, y cada idea elegida se queda en la página. Está escrito para que
cada tarea la pueda hacer un modelo distinto, en una sesión aparte.

- **Qué se construye:** lo que muestra `maqueta/molde-2.html` (abrila en un navegador antes de empezar).
- **Qué no cambia:** el archivo exportado sigue siendo un `DESIGN.md` según la especificación de `DESIGN.md`.
- **Reglas del repo:** `CLAUDE.md`. Si este plan y `DESIGN.md` se contradicen, gana `DESIGN.md`: avisá.

---

## 1. Cómo usar este plan

1. Elegí una tarea de la sección 5 cuya columna «Depende de» ya esté hecha.
2. Abrí una sesión nueva con el modelo indicado y pegá esto, cambiando el código de la tarea:

   > Leé `CLAUDE.md`, `DESIGN.md` y `PLAN.md`. Hacé solo la tarea **C2** de `PLAN.md`, respetando
   > su «Listo cuando». No hagas otras tareas ni cambies cosas fuera de los archivos que nombra.
   > Al terminar corré `npm run typecheck && npm test`, marcá la tarea como hecha en `PLAN.md`
   > y contame qué quedó pendiente.

3. Revisá el resultado, mergeá, y pasá a la siguiente.

Cada tarea termina con `npm run typecheck && npm test` en verde y con su casilla marcada en la
sección 5. Las tareas de una misma tanda (sección 6) no se pisan y pueden ir en paralelo.

---

## 2. Qué modelo para qué

La regla general: **cuanto más ambigua es la tarea y más caro es equivocarse, más capaz el modelo.**
Si la tarea tiene una lista cerrada y un test que la verifica, alcanza con uno barato.

| Modelo | Equivalente en ChatGPT | Usalo para | No lo uses para |
|---|---|---|---|
| **Fable 5.2** | ninguno: dejala en Claude | Decidir cómo se ve y cómo se mueve algo que todavía no existe: la portada, el lenguaje de movimiento, layouts nuevos, el árbol de ramas. Tareas donde el resultado se juzga a ojo. | Cargar datos, tareas con receta. Es el más caro. |
| **Opus 5.5** | **Astra** | Arquitectura y cambios que cruzan muchos archivos: el motor de rondas, el estado, el export a HTML, rendimiento. Revisión final de lo que hicieron otros. | Sumar entradas a un catálogo siguiendo un patrón. |
| **Sonnet 5.5** | **Sol** | Implementar algo bien especificado: un catálogo nuevo con su CSS siguiendo ejemplos, una ronda nueva sobre el motor ya hecho, tests, arreglos de accesibilidad y celular. | Decidir diseño desde cero o reestructurar el estado. |
| **Haiku 5.5** | **Terra** (o **Luna** si es solo texto o datos) | Trabajo mecánico con lista cerrada: cargar datos de una tabla, etiquetar, renombrar, actualizar documentación, correr verificaciones. | Cualquier cosa que pida criterio visual o que no tenga un test que la frene. |
| **Codex** (u otro agente de código) | corre con Astra, Sol, Terra o Luna: usá la columna de al lado | Las tareas marcadas **«apta para Codex»**: especificación cerrada, verificación automática y sin criterio visual. | Tareas que piden cargar una skill de `.claude/skills/` (Codex no las usa) o juzgar a ojo. |

**Equivalentes en ChatGPT (2026-11-11):** de más a menos capaz, Astra → Sol → Terra → Luna
(precios de referencia por millón de tokens, entrada/salida: Astra $10/$50, Sol $2/$10, Terra $1/$5,
Luna $0,10/$0,50). Los datos salen mayormente de sitios que no son de OpenAI: revisá qué modelos
tiene tu plan antes de repartir. Para ahorrar Claude, las tareas de Sonnet y Haiku pueden ir a Sol y
Terra; las de Fable y la revisión final (G5) quedan en Claude. Cada tarea pendiente de la sección 5
dice «ChatGPT: …» con el que alcanza.

Nota sobre Codex: no lo probé en este repo. La tarea A1 le deja un `AGENTS.md` que apunta a
`CLAUDE.md` y a este plan, que es el archivo que ese agente lee al arrancar.

**Dónde se ahorra:** las tandas 3 y 5 (catálogo y documentación) son la mayor parte del
volumen y van casi enteras con Sonnet y Haiku. De las 32 tareas, 18 son de Sonnet o Haiku,
11 de Opus y 3 de Fable; D6 y D7 arrancan con Opus y siguen con Sonnet.

---

## 3. Qué hay hoy y a dónde hay que llegar

El catálogo real ya es bastante más grande que el de la maqueta. Buena parte de «más opciones»
es conectar lo que existe al recorrido nuevo; el resto es catálogo que hoy no existe.

| Qué | Hoy | Meta | Dónde vive |
|---|---|---|---|
| Tipos de proyecto | 8 | 8 (no cambian) | `src/tipos.ts`, `src/catalogo.ts` |
| **Rubros** (para qué es) | 0 | 39 | nuevo `src/rubros.ts` |
| Paletas | 32 | 60 | `src/catalogo.ts` |
| Estilos visuales | 20 | 20 | `src/estilos-visuales.ts` |
| Layouts genéricos | 33 | 33 | `src/estilos-visuales.ts`, `src/rapido/Pagina.tsx` |
| Plantillas de autor | 13 | 13 | `src/rapido/autor*.tsx` |
| Familias de UI (botón + caja + piezas) | 10 | 18 | `src/familias.ts` |
| Combinaciones de letra | 10 (33 fuentes) | 20 | `src/catalogo.ts` |
| Fondos con textura (quietos) | 21 | 21 | `src/fondos.ts` |
| **Fondos animados** | 0 | 16 | nuevo `src/fondos-animados.ts` |
| Entradas de la página | 5 | 12 | `src/catalogo.ts` (aparición) |
| **Efectos de scroll combinables** | 0 (hay secciones fijas en 7 layouts) | 14, en 4 zonas | nuevo `src/scroll.ts` |
| Rondas propias por rama | 0 | 2 a 4 por tipo | nuevo `src/rondas/ramas.ts` |

Los layouts reales son 46: 33 genéricos y 13 de autor (`LAYOUTS` en `src/estilos-visuales.ts`). `CLAUDE.md` ya no cita una cantidad (la corrigió G4).

---

## 4. Decisiones ya tomadas

Las aprobó quien dirige el proyecto mirando las maquetas. La tarea A2 las pasa a `DESIGN.md` §8.

1. **Nombre:** la herramienta se llama **Molde**. Falta verificar marca y dominio.
2. **Un solo lienzo:** la página de la persona está siempre en pantalla; el marco (gris yeso, tinta berenjena, rosa silicona) no cambia con el estilo elegido.
3. **Rondas de ideas:** el botón del centro explota en opciones, de a 6 como máximo, con flechas para ver más.
4. **Ver antes de elegir:** pasar el mouse muestra la idea en toda la página y la opción se vuelve translúcida. Clic o arrastrar al centro la elige. En celular: un toque muestra y «Usar» confirma.
5. **Nunca vuelve a blanco:** lo elegido queda. Solo «Empezar de cero» vacía la página.
6. **Sin modo avanzado aparte:** lo elegido queda como fichas; tocar una vuelve a abrir esa ronda y sus ajustes finos.
7. **Ramas:** cada tipo de proyecto ve sus propias rondas y recomendaciones, no todo el catálogo. Una landing ve fondo animado y scroll; un sistema de stock ve estadísticas.
8. **Scroll combinable:** se puede elegir más de un efecto de scroll, uno por zona (sección 7.4).
9. **Portada:** casi en blanco, con piezas en movimiento; al bajar se arman páginas al azar y «Empezar» sube y queda fijo.
10. **Descarga:** `DESIGN.md` y, además, la página armada en **HTML**.

Orden de las rondas (las cinco primeras son obligatorias; el resto son ideas opcionales y
la persona puede terminar cuando quiera):

`Proyecto → Rubro → Color → Layout → Estilo` · `Piezas · Letra · Entrada · rondas de la rama` · `Ajustar → Descargar`

---

## 5. Tareas

Estado: `[ ]` pendiente · `[x]` hecha. Marcala al terminar.

### Tanda 1: preparación

- [x] **A1 · `AGENTS.md` para otros agentes** — Haiku 5.5 · apta para Codex · sin dependencias
  - Crear `AGENTS.md` en la raíz: tres líneas que manden a leer `CLAUDE.md`, `DESIGN.md` y `PLAN.md`, más los comandos de `CLAUDE.md`.
  - Listo cuando: el archivo existe y no duplica contenido de `CLAUDE.md`.

- [x] **A2 · Anotar las decisiones en `DESIGN.md`** — Sonnet 5.5 · sin dependencias
  - Pasar las 10 decisiones de la sección 4 a `DESIGN.md` §8 (una fila cada una, con el formato de la tabla), y a §10 un resumen de este plan con link a `PLAN.md`.
  - No tocar §3 ni la versión del formato: todavía no cambia la salida.
  - Listo cuando: §8 tiene las filas nuevas numeradas a continuación de D78.

- [x] **A3 · Auditoría de paleta × estilo** — Opus 5.5 · sin dependencias
  - Hoy cada estilo declara sus paletas compatibles (`ESTILOS[id].paletas`). El recorrido nuevo elige color **antes** que estilo, así que hay que saber qué pasa con cualquier par.
  - Escribir un test que arme el sistema de diseño (`src/export/sistema.ts`) para cada par paleta × estilo y verifique contraste AA en texto, texto secundario y botón principal.
  - Entregar: el test, y una función `estilosPara(paleta)` que ordene los estilos (compatibles primero) y excluya los que no pasan.
  - Listo cuando: el test corre en menos de 10 s y documenta en `DESIGN.md` §9 cuántos pares no pasan.

### Tanda 2: base técnica y motor (en este orden)

- [x] **B1 · Paso en la URL y guardado** — Opus 5.5 · sin dependencias
  - El paso actual vive solo en memoria (`src/App.tsx`): Atrás del navegador saca del sitio y recargar vuelve al inicio. Llevarlo a `location.hash` y a `localStorage`.
  - Listo cuando: Atrás y Adelante del navegador mueven entre pasos, y recargar deja a la persona donde estaba. Con test.

- [x] **B2 · Partir la carga inicial** — Opus 5.5 · depende de B1
  - La primera visita baja unos 1,9 MB. Cargar con `lazy` las plantillas de autor (`src/rapido/Pagina.tsx` las importa todas), separar el CSS por panel y pedir cada fuente recién cuando se muestra (`urlGoogleFonts` en `src/catalogo.ts` las pide todas juntas).
  - Listo cuando: el JS inicial pesa menos de 250 KB sin comprimir y la portada no parpadea al cargar.
  - **Parcial (2026-11-11):** JS inicial de 442 a 302 KB (94 KB comprimido); CSS inicial de 166 a 89 KB; hojas de fuentes de la portada de 212 a 42 KB; el título de la portada ya no cambia de alto al cargar. Plantillas de autor (`rapido/autores.tsx`), diseños de botón (`botones-carga.tsx`), esquemas, estructuras de layout (`export/estructuras-layout.ts`) y el CSS del prototipo y de tres paneles bajan aparte; las fuentes se piden de a una (`fuentes.ts`). Falta: React ocupa ~140 KB y el resto es lo que la portada muestra (CSS de los 20 estilos, paletas, fondos, layouts genéricos, cajas). Bajar de 250 KB pide separar el CSS de los estilos o las cajas de sus datos; queda abierto.
  - **Hecho (2026-11-11):** JS inicial de 337 a 248 kB (80 kB comprimido), con React incluido; `npm run peso` lo controla (`scripts/peso-inicial.mjs`, falla desde 250 kB). Se separó de sus datos lo que la portada no usa: el CSS de los estilos (`estilos-css.ts`), sus palabras clave y reglas (`estilos-reglas.ts`), el CSS de los fondos (`fondos-css.ts`) y los 44 diseños de caja (`cajas-disenos.ts`, que se registran para `paramsDe`). Ese CSS, el contenido de muestra y los diseños de caja bajan juntos en la hoja de la página (`rapido/hoja.ts` + `hoja-pagina.ts`): `main.tsx` la pide y dibuja recién cuando llegó, y `Pagina` la espera (suspende), así nunca se ve una página sin su estilo. 18 layouts genéricos pasaron a `rapido/layouts1.tsx` y los 12 de D3 (`layouts2.tsx` con su CSS) también bajan aparte, por el mismo mecanismo que las plantillas de autor (`autores.tsx`: `layoutListo`, `precargarLayouts`); en la carga inicial quedan hero partido, bento y mínimo, y la primera muestra de la portada siempre sale de ahí. También bajan aparte la lista «Ver todos los layouts» (`ListaLayouts.tsx`) y los textos de los pasos de galería (ahora en `PanelGaleria.tsx`); `animarToque` e `IconoFlecha` están en `componentes/toque.tsx` para no arrastrar `ui.tsx`. Sin polyfill de modulepreload. El `DESIGN.md` exportado no cambia (comparado byte a byte en 20 combinaciones). Los tests cargan la hoja y los layouts en `src/test-setup.ts`. Margen: ~2 kB; `catalogo.ts` (28 kB) entra entero, así que cualquier opción nueva ahí suma a la carga inicial.
  - **Al mergear D7, D11 y D12 (2026-11-11):** el JS inicial volvió a 288 kB. Se recuperó: las secciones (`rapido/secciones.tsx` + CSS) bajan recién cuando se elige la primera (`precargarSecciones` en `Pagina.tsx`), y la portada y el estado usan solo `scroll-base.ts` y `secciones-base.ts` (ids, zonas y cómo limpiar una lista); el catálogo entero sigue en `scroll.ts` y `secciones.ts`, que los reexportan (un test verifica que coinciden). Queda en 249,7 kB: casi en el límite, lo próximo que entre a la carga inicial lo pasa.

- [x] **C1 · Modelo de rondas y ramas** — Opus 5.5 · depende de A3
  - Crear `src/rondas/`: el tipo `Ronda` (clave, nombre de ficha, pregunta, opciones según la config, cómo se aplica a `Config`, si es obligatoria), `rondasDe(config)` y `ramas.ts` con las rondas propias de cada tipo de proyecto (tabla de la sección 7.1). Es **datos**, sin UI.
  - Reutilizar `src/recomendados.ts` para ordenar opciones y `src/familias.ts` para las piezas.
  - Listo cuando: hay tests que verifican que cada tipo devuelve sus rondas, que cada opción existe en el catálogo y que cambiar de tipo conserva color, estilo, piezas y letra.
  - Hecho en `src/rondas/` (`ronda.ts`, `comunes.ts`, `ramas.ts`, `index.ts`). Las rondas que piden catálogo nuevo (Rubro → D1, fondo animado → D6, scroll → D7, secciones → D12, densidad y lectura → D11) quedan en `rondasPendientes()` y `rondasDe()` no las devuelve hasta que existan. Estilo usa `estilosPara` (A3).

- [x] **C2 · Lienzo y explosión de ideas** — Opus 5.5 · depende de C1
  - Portar la interacción de `maqueta/molde-2.html` a React en `src/molde/`: lienzo con capa base y capa de vista previa, explosión desde el botón, de a 6 con flechas, vista previa al pasar el mouse con la opción translúcida, elegir con clic o arrastrando al centro, fichas abajo.
  - El lienzo usa `Pagina` (`src/rapido/Pagina.tsx`) con la `Config` real, no el HTML de muestra de la maqueta.
  - Las opciones son botones reales: con teclado, el foco muestra y Enter elige.
  - Listo cuando: se puede recorrer Proyecto → Color → Layout → Estilo con mouse y con teclado, y lo elegido sobrevive a recargar.
  - Hecho en `src/molde/` (`Molde.tsx`, `recorrido.ts`, `molde.css`), en `#/molde/<ronda>` mientras convive con el modo rápido (C5 lo pasa a la raíz). La ronda abierta va en la URL (Atrás vuelve a la anterior) y las rondas elegidas en `localStorage` (`molde:elegidas`); la config, como siempre, en `estado.ts`. Al terminar baja el `DESIGN.md` real; el HTML queda para F2. Quedan para otras tareas: la portada animada (E2), «Usar» y «Ver otras» en pantallas táctiles (C3), los ajustes finos de cada ficha (C4) y «Sorprendeme» (§7.9). Las rondas de galería muestran la idea en la ficha pero `Pagina` todavía no dibuja esos componentes.

- [x] **C3 · Versión táctil y sin movimiento** — Sonnet 5.5 · depende de C2
  - En pantallas táctiles: un toque muestra, aparecen «Usar» y «Ver otras». Áreas táctiles de 44 px. Con `prefers-reduced-motion`, todo aparece sin animación y sigue funcionando.
  - Listo cuando: un test de Playwright recorre las rondas obligatorias a 390 px con toques.
  - Hecho en `src/molde/Molde.tsx` (toque → vista previa + «Usar» y «Ver otras»; con mouse o Enter se elige directo) y `molde.css`. Con `prefers-reduced-motion` ya no había animaciones que frenar: se verificó que todo aparece y funciona. Test: `npm run test:e2e` (`e2e/molde-tactil.e2e.mjs`, levanta vite solo; recorre las 4 rondas a 390 px con toques, con y sin movimiento reducido, y revisa áreas de 44 px). G1 lo puede mover al CI.

- [x] **C4 · Fichas con ajustes finos (el modo avanzado fundido)** — Opus 5.5 · depende de C2
  - Tocar una ficha reabre su ronda y muestra «Ajustes finos»: los controles que hoy están en el modo avanzado para ese tema (`src/pasos/pasos.tsx`, `src/pasos/visual.tsx`), por ejemplo paleta personalizada en Color o peso y espaciado en Letra.
  - Listo cuando: todo lo que se podía ajustar en `src/ModoAvanzado.tsx` se puede ajustar desde alguna ficha. Entregar una tabla de equivalencias en el PR.
  - Hecho en `src/molde/Ajustes.tsx` (se carga aparte) y `AJUSTES` en `src/molde/recorrido.ts`. En una ronda ya elegida, el pie muestra «Ajustes finos»: abre al costado (abajo en celular) los pasos de `PASOS` de ese tema con su nota, y la página queda entera a la vista y cambia en vivo. Un test verifica que cada paso de `PASOS` está en una sola ficha. Dirección va en una versión para Molde (`AjustesDireccion`: sensación y anti-referencias, sin pisar color, letra ni forma) y de Exportar solo las notas generales (`NotasGenerales`). Equivalencias: Proyecto → proyecto (tipo, nombre, descripción, objetivo, público, plataformas), qué hace y notas generales · Layout → pantallas y navegación · Color → paleta, personalizada, cada color a mano, contraste · Estilo → dirección, anti-referencias y forma (esquinas, sombras, bordes) · Piezas → botones (estilo, tamaño, mayúsculas, icono) · Letra → combinación, escala, fuentes, peso y espaciado · Entrada → movimiento (nivel, hover, presionar, aparición, cambio de pantalla). Lo que el modo avanzado elegía en Dirección y ya es ronda (estilo y layout) se elige en su ronda.

- [x] **C5 · Reemplazar el recorrido y retirar lo viejo** — Sonnet 5.5 · ChatGPT: Sol · depende de C3, C4 y E2
  - Antes de borrar, que liste qué va a borrar y lo apruebe quien dirige.
  - `src/App.tsx` pasa a montar Molde. Borrar los paneles del modo rápido y `ModoAvanzado.tsx` que ya no se usen; conservar `Prototipo.tsx` si C4 lo reutiliza.
  - Listo cuando: no quedan imports muertos y el build pasa.
  - Hecha (2026-11-11), con retiro de 20 archivos aprobado en el chat: App monta solo Molde; se conservan Pagina, el catálogo, combinaciones y los controles de PASOS usados por ajustes finos. Rutas canónicas #/<ronda>, con migración de enlaces y ubicaciones anteriores. README y CLAUDE actualizados. Pasan typecheck, 198 tests, peso (201,6 kB) y e2e con y sin movimiento reducido, incluidas descargas, migración, recarga y Atrás/Adelante.

### Tanda 3: más opciones (en paralelo, todas dependen de C1)

- [x] **D1 · Rubros** — Sonnet 5.5
  - Crear `src/rubros.ts` con los 39 rubros de la sección 7.2: id, nombre, tipo al que pertenece y contenido de muestra (marca inventada, título, bajada, dos botones, tres ítems), en español rioplatense y con datos creíbles.
  - Listo cuando: un test verifica que cada tipo tiene al menos 4 rubros y que ningún texto supera el largo de los actuales en `src/rapido/contenido-tipo.ts`.
  - Hecho en `src/rubros.ts` (`RUBROS`, `rubrosDe`, `rubroPorId`) con `src/rubros.test.ts`. Todavía no se conecta a la ronda Rubro (sale de `rondasPendientes()` en otra tarea).

- [x] **D2 · 28 paletas nuevas** — Sonnet 5.5
  - Sumar a `PALETAS` en `src/catalogo.ts` hasta llegar a 60, repartidas como en la sección 7.3. Cada una tiene que pasar el test de contraste AA de `src/export/generarDesignMd.test.ts`.
  - Listo cuando: el test de contraste pasa y cada paleta nueva está en al menos un estilo compatible.

- [x] **D3 · 12 layouts genéricos nuevos** — Fable 5.2
  - Diseñar e implementar los 12 de la sección 7.5 en `src/estilos-visuales.ts` y `src/rapido/Pagina.tsx`. Cargar antes la skill `frontend-design`; cada uno necesita una idea propia, no una variación de `hero_partido`.
  - Cada layout nuevo va **al final** de la lista para no romper los códigos compartidos.
  - Listo cuando: cada layout se ve bien con los 20 estilos a 1440 px y a 390 px, y tiene su `estructura` escrita para el export.
  - Hecho en `src/rapido/layouts2.tsx` + `layouts2.css` (los monta `Pagina.tsx`), con su esquema, su `estructura` y recomendados por tipo. Como los layouts pasan de 36, los códigos de combinación suman el prefijo `~` (los viejos siguen valiendo). Formato 0.8.9. Suman 32 KB de JS y 34 KB de CSS a la carga inicial (queda en 334 y 123 KB): B2 puede pasarlos a `lazy` como hizo con las plantillas de autor.

- [x] **D4 · 8 familias de UI nuevas** — Sonnet 5.5
  - Sumar a `src/familias.ts` las de la sección 7.6, armadas **solo con diseños que ya existen** (botones, cajas y galería). No escribir CSS nuevo.
  - Listo cuando: pasa el test que verifica que todos los ids existen.

- [x] **D5 · 10 combinaciones de letra nuevas** — Haiku 5.5 · apta para Codex
  - Sumar a `COMBINACIONES` en `src/catalogo.ts` diez pares con las 33 fuentes que ya están cargadas. Consultar `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "consulta" --domain typography` para elegir pares.
  - Listo cuando: no hay pares repetidos y cada par usa pesos que la fuente tiene.
  - Hecha: 10 pares nuevos al final de `COMBINACIONES` (14 → 24), sin fuentes nuevas ni cambios en el export. Test en `src/export/generarDesignMd.test.ts` (sin pares ni nombres repetidos; ambas fuentes tienen peso 400).

- [x] **D6 · Fondos animados** — Opus 5.5 (motor y 4 fondos) y después Sonnet 5.5 (los otros 12)
  - Crear `src/fondos-animados.ts` con los 16 de la sección 7.7. Solo CSS, salvo «luz que sigue al cursor». Los seis de `maqueta/molde-2.html` sirven de referencia.
  - Reglas: usan los tokens `--color-*`; cada uno tiene versión quieta para `prefers-reduced-motion`; nunca va texto directo sobre el fondo (velo o tarjeta sólida, como en `src/fondos.ts`).
  - Listo cuando: cada fondo corre a 60 cuadros por segundo en una laptop común y tiene su CSS listo para exportar.
  - Hecho en `src/fondos-animados.ts` (los 16, motor incluido) con `src/fondos-animados.test.ts`. `cssDeFondoAnimado(id, selector)` da la capa, el fondo, sus `@keyframes` y la versión quieta; la clase es `fondo-animado fa-<id>`. Solo se mueven `::before` y `::after` con `transform` y `opacity` (lo verifica el test), y los 16 midieron 60 cuadros por segundo a 1440×900 en Chromium. La luz que sigue al cursor usa `seguirCursor` (y `JS_LUZ_CURSOR` para el export). Todavía no hay campo en `Config` ni ronda: «Fondo animado» sigue en `rondasPendientes()` hasta F1, que suma el campo al export.

- [x] **D7 · Efectos de scroll combinables** — Opus 5.5 (motor y 4 efectos) y después Sonnet 5.5 (los otros 10)
  - Crear `src/scroll.ts` con los 14 de la sección 7.4, en 4 zonas. Usar CSS scroll-driven animations como ya hace el proyecto (decisión D72), con versión quieta.
  - La persona puede combinar hasta 3, **uno por zona**; el motor rechaza dos de la misma zona.
  - En la vista previa, la página se baja sola para mostrar el efecto.
  - Listo cuando: cualquier combinación válida funciona junta y hay un test de las reglas de combinación.
  - **Parte de Opus hecha (2026-11-11):** motor y 4 efectos, uno por zona, en `src/scroll.ts` (Se aleja, Frase que se enciende, Corre de costado, Barra de progreso), con `src/scroll.test.tsx`. `visual.scroll` en `Config` (lo limpia `normalizar`), clases `scroll-<id>` en `Pagina` y la ronda Scroll en `src/rondas/ramas.ts` (elige varios: `maximo` y `marcadas` en `Ronda`). En Molde la ronda queda abierta, «Seguir» pasa a la siguiente y la página se baja sola. Decisión D89.
  - **Parte de Sonnet hecha (2026-11-11):** los 10 que faltaban están en `EFECTOS_SCROLL` (14 en total, `SCROLL_PENDIENTES` quedó vacía). Fuera de las propiedades sueltas del motor, tres usan otra cosa porque no hay otra forma: «Subrayado que se dibuja» anima `background-size`, «El fondo cambia de color por sección» anima `background-color` y «Número que cuenta» anima un `@property` entero. Ojo: las plantillas de autor no tienen `.pg-hero` ni `.pg-fila`, así que ahí solo funcionan los efectos de la zona Página. «Número que cuenta» y «Zoom a una imagen» actúan solo donde haya «Cómo funciona» o mosaicos/galerías. No los probé en un navegador real, solo con `src/scroll.test.tsx`. El export queda para F1.

- [x] **D8 · 7 entradas nuevas** — Sonnet 5.5 · apta para Codex
  - Sumar a la aparición (`AparicionId` en `src/tipos.ts`, opciones en `src/catalogo.ts`) las de la sección 7.8. Se reproducen solo en su ronda y al terminar.
  - Listo cuando: cada entrada tiene su CSS con tokens `--duracion-*` y `--curva-*`.

- [x] **D9 · Rondas de rama con catálogo existente** — Sonnet 5.5
  - Conectar a `src/rondas/ramas.ts` las categorías de la galería que le tocan a cada tipo (sección 7.1): tarjetas de producto para tienda, gráficos y tablas para dashboard, barra inferior para app de celular, etc.
  - Listo cuando: cada tipo tiene sus rondas propias funcionando con datos reales.
  - Ya hecho en C1: `rondaDeGaleria` arma la ronda de cualquier categoría de la galería con sus recomendados, y `RAMAS` conecta las de §7.1. D9: `recomendados.ts` suma las recomendadas que faltaban para que cada ronda de galería de cada rama tenga al menos 6 (test en `rondas.test.ts`); las preguntas de `ramas.ts` se revisaron y quedan como están.

- [x] **D10 · Recomendaciones por rubro** — Sonnet 5.5 · depende de D1 y D2
  - Extender `src/recomendados.ts`: para cada rubro, qué paletas, layouts, estilos y familias aparecen primero. Las primeras 6 de cada ronda salen de acá.
  - Listo cuando: un test verifica que cada rubro tiene al menos 6 recomendados por ronda y que todos existen.
  - Hecha: `RECOMENDADOS_RUBRO` (6 paletas, 6 layouts, 6 estilos y 6 familias por rubro), `recomendadosDeRubro` y `conRubro` al final de `src/recomendados.ts`; tests en `src/rubros.test.ts`. Pendiente (lo cierra la tarea que sume la ronda Rubro): `Config` todavía no guarda el rubro, así que `COLOR`, `LAYOUT`, `ESTILO` y `PIEZAS` en `src/rondas/comunes.ts` aún no leen estas listas; con el rubro en `Config` alcanza con pasar `conRubro(rec.paletas, …)` a `primeroRecomendados`.

- [x] **D11 · Ideas nuevas como rondas opcionales** — Sonnet 5.5 · depende de C4
  - Sumar las rondas de la sección 7.9 que ya tienen formato definido en `DESIGN.md` §3 y nunca se implementaron: iconos (§11), tono de los textos (§13) y densidad (§8).
  - Listo cuando: cada una llena su sección del export y `DESIGN.md` §5 pasa su estado a hecho.
  - Hecha: rondas `iconos`, `tono` y `densidad` en `src/rondas/comunes.ts` (opciones en `catalogo.ts`: `ICONOS`, `TONOS`, `DENSIDADES`; recomendadas en `RECOMENDADOS_D11`). `Config` suma `iconos`, `tono` y `visual.densidad`; el export llena §11, §13 (solo si se eligieron) y §8. Formato 0.9.0, decisión D91. La ronda `lectura` del blog sigue pendiente (no era parte de esta tarea).

- [x] **D12 · Secciones de la página** — Fable 5.2 · depende de D3
  - Ronda nueva para landing, sitio y portfolio: elegir qué secciones lleva la página (precios, testimonios, preguntas frecuentes, contacto, equipo) y en qué orden. Es la idea «catálogo de secciones» de `DESIGN.md` §10.
  - Listo cuando: hay 8 secciones con 2 variantes cada una y el export las describe en §3.
  - Hecha: catálogo en `src/secciones.ts` (8 secciones × 2 diseños, con su `estructura`), contenido de muestra en `src/rapido/contenido-secciones.ts` y dibujo en `src/rapido/secciones.tsx` + `secciones.css`. `visual.secciones` en `Config` (lo limpia `normalizar`). La ronda `RONDA_SECCIONES` (`src/rondas/ramas.ts`) elige varias: el orden de la página es el orden en que se eligen; en Molde la página va sola hasta la sección que se mira. Las secciones reemplazan al argumento del layout. Export: §22, formato 0.9.0, decisión D92. Tests en `src/secciones.test.tsx`. Resuelto en H8: se pueden reordenar sin sacar y volver a elegir; pendiente original conservado como registro: no se podían reordenar; el export a HTML (F1) tiene que incluir `secciones.css`; de los 20 estilos solo se revisaron a ojo tres (sin estilo, neobrutalismo y terminal), a 1440 y 390 px.

- [x] **D13 · Ronda Rubro** — Sonnet 5.5 · ChatGPT: Sol · depende de D1 y D10 (conviene en la misma sesión que F1)
  - Guardar el rubro en `Config` (lo limpia `normalizar`), sacar «Rubro» de `rondasPendientes()` y ponerla después de Proyecto (decisión D88). Con el rubro en `Config`, `COLOR`, `LAYOUT`, `ESTILO` y `PIEZAS` de `src/rondas/comunes.ts` pasan `conRubro(…)` a `primeroRecomendados` (lo que dejó pendiente D10). La página usa el contenido de muestra del rubro.
  - Listo cuando: elegir un rubro cambia las 6 primeras opciones de esas rondas y el contenido de la página, con test.
  - Hecha: ronda obligatoria Rubro, persistencia y limpieza al cambiar de tipo, recomendaciones y contenido de muestra. Los estilos conservan el filtro de contraste AA. Pruebas para los 39 rubros y recorrido actualizado.

- [x] **D14 · Ronda de lectura del blog** — Sonnet 5.5 · ChatGPT: Sol · depende de D11
  - La ronda «Lectura (ancho y tamaño)» de la tabla 7.1, que D11 dejó afuera. Seguir el patrón de Densidad (`src/rondas/comunes.ts`).
  - Listo cuando: cambia el ancho y el tamaño del texto en la página en vivo y llena su lugar en el export.
  - Hecha: `LECTURA` sigue el patrón de Densidad, con seis combinaciones en `LECTURAS` (50/60/70ch × 16/20px). `visual.lectura` se normaliza y solo se aplica a blogs. Página y export §7 comparten los tokens de `sistemaDeDiseno` y `CSS_LECTURA`; el ancho se adapta al celular. Formato 0.9.2. Tests en `src/lectura.test.tsx`.

### Tanda 4: portada y descarga

- [x] **E1 · Portada: más vida y scroll fluido (en la maqueta)** — Fable 5.2 · revisión visual aprobada · sin dependencias
  - Rehacer la portada de `maqueta/molde-2.html` según la sección 8. Se aprueba en la maqueta antes de portarla.
  - Listo cuando: quien dirige el proyecto la aprueba.
  - Estado: hecha en la maqueta (scroll cuadro a cuadro, 15 capas armadas una sola vez, piezas que vuelan al lienzo, título que cambia, botón que se acerca al mouse y cierre con el botón latiendo).
  - **Cambios por la revisión (2026-11-11):** (1) las flechas, «Ver otras» y las descargas se veían en la portada porque su `display` le ganaba a `hidden`: arreglado con `[hidden] { display: none !important }`. (2) Se sacaron las piezas que giraban alrededor del botón y se apartaban del mouse, y las ondas. En su lugar, **linterna de estilos**: de fondo, una página apagada del tamaño del lienzo; una lente que sigue al cursor la muestra con otro color y otras piezas (mismo tipo y layout), con su nombre abajo («Neobrutal · Durazno»). El estilo cambia junto con la palabra del título. En celular la lente pasea sola; con movimiento reducido queda quieta. El título y «Bajá…» llevan velo. Midió 60 cuadros por segundo a 1440 × 900. Las otras ideas de fondo quedan en `DESIGN.md` §10 (Ideas sueltas).
  - Aprobación delegada (2026-11-11): portada revisada a 1440 × 900 y 390 × 844. «Empezar» abrió el recorrido después de bajar en ambos tamaños.
  - Para E2: la lente en el sitio real tiene que usar `Pagina` con la `Config` de muestra y bajar aparte (el JS inicial está en el límite).

- [x] **E2 · Portar la portada** — Opus 5.5 · ChatGPT: Astra, con revisión a ojo · depende de E1 y C2
  - Ojo: el JS inicial está en 249,7 kB (límite 250, `npm run peso`). Lo que sume la portada tiene que bajar aparte.
  - Llevar la portada aprobada a `src/molde/`, con páginas reales del catálogo.
  - Listo cuando: el scroll va a 60 cuadros por segundo y «Empezar» funciona en cualquier punto.
  - Hecha en `#/molde/inicio` con la linterna de la maqueta revisada y tres páginas reales (tienda, dashboard y blog). El módulo de portada se carga aparte. Prueba sobre el build con `node e2e/portada.e2e.mjs` (Playwright): «Empezar» al inicio, en el medio, al final y con movimiento reducido. En Chrome, 59,7 fps a 1440 × 900 y 60,0 fps a 390 × 844 emulado. JS inicial: 249,2 kB.

- [x] **F1 · Formato 0.9.1: campos nuevos en el export** — Sonnet 5.5 · ChatGPT: Sol · depende de D1, D6, D7 y D8
  - La 0.9.0 ya la usaron D11 y D12: esta tarea sube a **0.9.1**.
  - Sumar al export, como campos opcionales: `rubro` (§2), fondo animado (§19), efectos de scroll y su combinación (§12) y las entradas nuevas (§12), cada uno con su CSS.
  - Seguir la regla de `CLAUDE.md`: actualizar `DESIGN.md` §3, §5 y §12, `VERSION_FORMATO` en `src/export/generarDesignMd.ts`, y tests.
  - Listo cuando: un archivo 0.9.0 sigue siendo válido y el ejemplo de `DESIGN.md` §6 está en 0.9.1.
  - Hecha: campos opcionales, CSS real de entradas y scroll, 16 fondos y JS solo para luz_cursor. Configuraciones anteriores conservan sus valores por defecto. La selección de fondo animado en la interfaz sigue pendiente.

- [x] **F2 · Descargar la página en HTML** — Opus 5.5 · ChatGPT: Astra · depende de C2 y F1
  - Generar un `.html` autocontenido con la página armada: tokens, CSS del estilo, layout, piezas, fondo, entrada y scroll. Es el «`preview.html`» pendiente en `DESIGN.md` §5.
  - Listo cuando: el archivo abre sin internet (salvo las fuentes) y se ve igual que el lienzo. Con test.
  - Implementada en Molde. «Descargar HTML» guarda el lienzo con sus estilos y fotos incorporadas. Verificado en Chrome sin conexión con la plantilla de concesionario y con test de exportación.

- [x] **F3 · Pantalla de descarga** — Sonnet 5.5 · ChatGPT: Sol · depende de F2
  - Los dos botones arriba, el archivo como protagonista y el resumen plegado, como en `maqueta/molde.html`.
  - Listo cuando: «Descargar» se ve sin scrollear a 1440 px y a 390 px.
  - Hecha: ambas descargas arriba, DESIGN.md con scroll propio y resumen plegado con acceso a cada ronda. Verificada visualmente a 1440 × 900 y 390 × 844. El e2e comprueba visibilidad, ambas descargas y regreso a editar, con y sin movimiento reducido. TypeScript, 192 tests, lint y peso (249,2 kB) pasan. La rama incorpora los commits de F2, todavía ausentes de main.

### Tanda 5: calidad y cierre

- [x] **G1 · Tests del recorrido en el CI** — Sonnet 5.5 · ChatGPT: Terra · apta para Codex · depende de C5
  - Playwright: una landing y un dashboard de punta a punta, en escritorio y celular, más axe en cada ronda. Sumarlo a `.github/workflows/`.
  - Hecha: `e2e/punta-a-punta.e2e.mjs` recorre Molde desde el inicio hasta «Tu molde está listo» con Landing y Dashboard, a 1440 px (mouse) y 390 px (toques). Audita con axe (WCAG 2 A y AA) el inicio, cada ronda y la pantalla final, y en celular revisa áreas de 44 px. Corre en `npm run test:e2e` (junto con `molde-tactil`) y en `.github/workflows/validar.yml`, que sube las capturas. `@axe-core/playwright` 4.10.2 pasa a devDependency. Axe encontró dos fallos reales de contraste y se corrigieron en `src/molde/molde.css`: la idea «viva» dejó de atenuarse con opacity y el contador «1 de N» tiene fondo propio. Limitación: axe revisa la primera idea de cada ronda, no todas las paletas.
- [x] **G2 · Accesibilidad y celular** — Sonnet 5.5 · ChatGPT: Sol (pegale la lista: no carga la skill `impeccable`) · depende de C5
  - Pasada con la skill `impeccable` («audit»): 44 px, foco visible, un solo `h1`, un solo `main`, contraste del marco en claro y oscuro.
  - Hecha (2026-11-11): auditoría del recorrido entero (portada, cada ronda de una landing, ajustes finos de Color y pantalla final) a 1440 y 390 px, en claro y oscuro, con axe, conteo de `h1` y `main`, foco con Tab y tamaño de todos los controles. Un solo `h1` y un solo `main` en cada pantalla y foco visible en todo: ya estaban bien. Los colores del marco pasan AA (botón principal 4,87 en claro y 6,48 en oscuro). Corregido: los chips de filtro de los ajustes finos medían 36 px de alto (ahora 44, `estilos.css`); la marca y «Empezar de cero» llevan el fondo del marco para que la página que se baja sola nunca quede detrás de su texto (`molde.css`). El e2e de G1 fallaba en `main` porque axe medía las ideas a mitad de su fundido: ahora espera a que terminen las animaciones con fin (no las infinitas ni las de scroll). `e2e/punta-a-punta.e2e.mjs` suma lo de G2 para que no vuelva: un `h1` y un `main` por pantalla, 44 px en todo control de la interfaz en celular, foco visible con Tab en escritorio, y el celular corre en tema oscuro (escritorio en claro).
- [x] **G3 · Red de seguridad** — Sonnet 5.5 · apta para Codex · sin dependencias
  - `ErrorBoundary` en la raíz, ESLint con la configuración recomendada de React y TypeScript, y arreglar el error de consola `ERR_INVALID_URL` que aparece después de elegir el tipo de proyecto.
- [x] **G4 · Documentación al día** — Haiku 5.5 · ChatGPT: Terra o Luna · apta para Codex · depende de C5
  - `README.md` (habla de «9 pasos»), `CLAUDE.md` (estructura nueva y cantidades reales), orden cronológico de `DESIGN.md` §12, favicon y metadatos en `index.html`, y pasar `public/fotos/traccion-vehiculos.png` (1,8 MB) a webp.
  - Hecha: `README.md` con el recorrido real (5 pasos en el simple, 10 en el avanzado) y los comandos; `CLAUDE.md` con los módulos que faltaban y las cantidades reales (37 categorías de galería); `DESIGN.md` §12 ordenado por versión, más reciente arriba, y el segundo 0.1.0 pasado a 0.1.1 (era un cambio sin formato); favicon SVG (`public/favicon.svg`) y metadatos en `index.html` sin nombre de marca hasta que se confirme Molde; foto de `concesionario` pasada a webp (1,8 MB → 355 kB, mismo tamaño). Quedan para C5: el recorrido que describe el README y la estructura de `src/molde/` cuando Molde pase a la raíz.
- [x] **G5 · Revisión final** — Opus 5.5 · ChatGPT: no (queda en Claude) · depende de todo
  - `/code-review` sobre el diff completo antes de mergear a `main`.
  - Hecha (2026-11-11): `/code-review` de `main` contra `DESIGN.md`. `VERSION_FORMATO` (0.9.2), el encabezado y §2, §7 (lectura solo en blog), §12 (scroll), §19 (fondo animado, `layout_argumento`) y §22 coinciden con la especificación. Corregido: cambiar a un tipo sin ronda Scroll ni Fondo animado ya no arrastra esas elecciones a la página y al export (D93, test en `f1-d13.test.tsx`); el único aviso de lint (`demo.tsx`). Abierto para decidir: §11 y §8 difieren en algunas claves del ejemplo de §3 (Q7). Chequeos: typecheck, 199 tests, lint sin avisos, peso 201,7 kB y e2e en verde. En la nube el e2e necesita `CHROMIUM_PATH=/opt/pw-browsers/chromium` (el Playwright del proyecto no trae su navegador).

---

## 6. Orden y paralelismo

| Tanda | Tareas | En paralelo | Modelos |
|---|---|---|---|
| 1 | A1, A2, A3, G3, E1 | todas | Haiku, Sonnet, Opus, Fable |
| 2 | B1 → B2 → C1 → C2 → C3 y C4 | solo C3 con C4 | Opus, Sonnet |
| 3 | D1 a D12 | todas (D10 después de D1 y D2; D11 después de C4; D12 después de D3) | Sonnet, Haiku, Opus, Fable |
| 4 | E2, F1 → F2 → F3 (D13 con F1, D14 cuando quieras) | E2 con F1 | Opus, Sonnet |
| 5 | C5, G1, G2, G4 → G5 | G1, G2 y G4 | Sonnet, Haiku, Opus |

La tanda 3 puede arrancar apenas termina C1, sin esperar al resto de la tanda 2.

### Lo que falta, en orden (2026-11-11)

| Paso | Tarea | Claude | ChatGPT | Va en paralelo con |
|---|---|---|---|---|
| 1 | E1 · aprobar la portada en la maqueta | quien dirige | quien dirige | 2 y 3 |
| 2 | F1 + D13 · export 0.9.1 y ronda Rubro | Sonnet 5.5 | Sol | 1 y 3 |
| 3 | D14 · ronda de lectura del blog | Sonnet 5.5 | Sol | 1 y 2 (después de F1 si las dos tocan el export a la vez) |
| 4 | E2 · portar la portada (después de E1) | Opus 5.5 | Astra, con revisión a ojo | 5 |
| 5 | F2 · página en HTML (después de F1) | Opus 5.5 | Astra | 4 |
| 6 | F3 · pantalla de descarga (después de F2) | Sonnet 5.5 | Sol | — |
| 7 | C5 · Molde en la raíz y borrar lo viejo (después de E2) | Sonnet 5.5 | Sol | — |
| 8 | G1 · tests en el CI (después de C5) | Sonnet 5.5 | Terra | 9 y 10 |
| 9 | G2 · accesibilidad y celular (después de C5) | Sonnet 5.5 | Sol | 8 y 10 |
| 10 | G4 · documentación al día (después de C5) | Haiku 5.5 | Terra o Luna | 8 y 9 |
| 11 | ~~G5 · revisión final~~ (hecha) | Opus 5.5 | — (queda en Claude) | — |

Entre paso y paso, el merge de las ramas y su revisión van con Claude (Opus 5.5).

---

## 7. Listas para las tareas de catálogo

### 7.1 Rondas propias de cada tipo

| Tipo | Rondas propias | Catálogo que usa |
|---|---|---|
| Landing | Fondo animado · Scroll · Secciones | D6, D7, D12 |
| Sitio con secciones | Fondo animado · Scroll · Secciones · Pie de página | D6, D7, D12, galería `pie` |
| Portfolio | Fondo animado · Scroll · Secciones · Galería de trabajos | D6, D7, D12, galería `carrusel` |
| Tienda | Tarjeta de producto · Carrito y compra · Buscador y filtros | galería `producto`, `formulario`, `buscador` |
| App web | Navegación · Formularios · Tablas · Pantallas vacías | galería `nav_web`, `formulario`, `tabla`, `vacio` |
| App para celular | Barra inferior · Formularios · Avisos | galería `nav_movil`, `campo`, `aviso` |
| Dashboard | Métricas · Gráficos · Tablas · Densidad | galería `metrica`, `grafico`, `tabla`, D11 |
| Blog o revista | Lectura (ancho y tamaño) · Índice · Suscripción | D11, galería `migas`, `acceso` |

### 7.2 Rubros (39)

| Tipo | Rubros |
|---|---|
| Landing | producto digital · servicio profesional · evento · curso · app para descargar · lista de espera |
| Sitio | estudio o empresa · restaurante · inmobiliaria · organización social · consultorio · gimnasio |
| Tienda | ropa · comida y almacén · artesanías · electrónica · productos digitales |
| App web | turnos y reservas · stock · clientes · facturación · tareas y proyectos |
| App para celular | finanzas · entrenamiento · pedidos y envíos · hábitos · comunidad |
| Dashboard | ventas · operaciones · visitas de un sitio · finanzas |
| Portfolio | diseño · fotografía · desarrollo · arquitectura |
| Blog | revista · newsletter · documentación · podcast |

### 7.3 Paletas nuevas (28)

Siete grupos de cuatro, cada grupo con dos claras y dos oscuras:
pastel · tierra · neón · monocromo con un acento · alto contraste · marina · frutal.

### 7.4 Efectos de scroll (14, uno por zona, hasta 3 a la vez)

| Zona | Efectos |
|---|---|
| Portada | se aleja · se queda fija y cambia · capas a distinta velocidad · el título se parte en dos |
| Texto | frase que se enciende · palabras que suben · número que cuenta · subrayado que se dibuja |
| Galería | corre de costado · tarjetas que se apilan · zoom a una imagen · aparecen de a una |
| Página | barra de progreso · el fondo cambia de color por sección |

### 7.5 Layouts genéricos nuevos (12)

línea de tiempo · antes y después · mapa con lista · carta de restaurante · agenda semanal ·
tablero de columnas · muro de publicaciones · documentación con índice · link en bio ·
compra en una sola página · portada con buscador · pantalla partida con scroll independiente.

### 7.6 Familias de UI nuevas (8)

pastel · monocroma · líneas dobles · recortada (esquinas en diagonal) · relieve · etiqueta de precio ·
terminal · papel.

### 7.7 Fondos animados (16)

Ya en la maqueta: aurora · puntos que corren · franjas · burbujas · piso en perspectiva · brillo que pasa.
Nuevos: grano que vibra · ondas de agua · puntos unidos · degradé que gira · cuadrícula que late ·
lluvia de líneas · manchas de tinta · cinta de texto · luz que sigue al cursor · formas que flotan.

### 7.8 Entradas (12)

Ya existen: nada · fundido · subir · escalonada · zoom.
Nuevas: se enfocan · caen con rebote · se destapan · giran · título a máquina · desde los costados ·
se despliega desde el botón.

### 7.9 Ideas nuevas

| Idea | Tarea | Para quién |
|---|---|---|
| Iconos, tono de los textos, densidad | D11 | todos |
| Secciones de la página | D12 | landing, sitio, portfolio |
| «Sorprendeme»: una combinación coherente al azar | sumar a C2 | todos |
| Link para compartir lo armado | sumar a B1 (el estado ya va en la URL) | todos |
| Guardar favoritos y comparar dos | después de C5 | todos |
| Importar un `DESIGN.md` para seguir editándolo | después de F1 (está pendiente en `DESIGN.md` §5) | todos |
| Efecto al pasar el mouse por las tarjetas | ronda nueva con los 7 hover que ya existen | landing, tienda, portfolio |
| Cursor propio | después de D6 | landing, portfolio |

---

## 8. Especificación de la portada (tarea E1)

**Qué anda mal hoy en `maqueta/molde-2.html`:**

- **Es plana:** título, texto y botón centrados sobre un fondo liso. Las piezas en órbita son lo único que se mueve y no reaccionan a nada.
- **El scroll va a los saltos:** la página cambia por pasos fijos (uno cada 55 % de pantalla). En cada paso se reemplaza la página entera y se repite el mismo círculo que se abre. Entre paso y paso, bajar no mueve nada, así que no se siente que el scroll controle la animación.

**Qué tiene que pasar:**

1. **El scroll maneja la animación, cuadro a cuadro.** Cada píxel que se baja avanza algo. Nada de reemplazar el HTML mientras se baja: las páginas se arman una vez al cargar y después solo se mueven con `transform`, `opacity` y `clip-path`.
2. **La página se arma por piezas.** Las piezas que giran alrededor del botón vuelan a su lugar: el botón de muestra se vuelve el botón de la página, la paleta la pinta, el esquema acomoda las cajas. Es la misma idea que el producto, mostrada sin texto.
3. **Movimiento suavizado.** La posición animada persigue a la del scroll con un pequeño retraso, para que no tiemble con la rueda del mouse.
4. **Tres páginas distintas en un recorrido corto** (unas cuatro pantallas de alto), y al final el lienzo queda en blanco de nuevo con el botón latiendo.
5. **El primer pantallazo tiene que tener gracia sin bajar:** el título cambia una palabra sola («tu tienda», «tu landing», «tu sistema»), las piezas se apartan del cursor, y el botón se acerca un poco cuando el mouse está cerca.
6. **«Empezar» sube y queda fijo** apenas se empieza a bajar, como ahora.
7. **Con `prefers-reduced-motion`:** la portada queda quieta, sin recorrido ni piezas en movimiento.

**Listo cuando:** bajar despacio y bajar rápido se sienten igual de continuos, y en celular funciona con el dedo.

---

## 9. Después del plan (tanda H)

Con G5 mergeada, el plan de Molde queda cerrado. La tanda H es lo que sigue: ordenar, publicar,
probar con personas y recién después sumar cosas. Cada tarea trae el pedido listo para pegar
(igual que en la sección 1: una sesión nueva por tarea, desde `main` actualizado).

**Al final de todo pedido sumá esto** (es lo que evitó que se rompieran el peso y los e2e):

> Arrancá desde `main` actualizado. Antes de terminar corré `npm run typecheck`, `npm test`,
> `npm run lint`, `npm run peso` y `npm run test:e2e`. Marcá la tarea en `PLAN.md`, subí la rama y
> pasame el link del PR.

| Orden | Tarea | Claude | ChatGPT | Depende de |
|---|---|---|---|---|
| 1 | H1 · Limpiar ramas | Haiku 5.5 | Terra | G5 |
| 2 | H2 · Publicar el sitio | Sonnet 5.5 | Sol | G5 |
| 3 | H3 · Probar en celulares reales | quien dirige (+ Sonnet para arreglos) | Sol para arreglos | H2 |
| 4 | H4 · Pruebas con personas | quien dirige (+ Opus para la síntesis) | Astra para la síntesis | H2 |
| 5 | H5 · Probar el `DESIGN.md` con otras IA | Sonnet 5.5 | Sol | H2 |
| 6 | H6 · Plan nuevo con lo aprendido | Opus 5.5 | Astra | H3, H4 y H5 |
| — | H7 a H12 · Backlog (opcionales) | ver cada una | ver cada una | H6 decide cuáles |

- [x] **H1 · Limpiar ramas** — Haiku 5.5 · ChatGPT: Terra
  - Borrar las ramas ya mergeadas y decidir qué hacer con `codex/plantilla-traccion` y `codex/recorrido-simple` (anteriores a C5).
  - Pedido:
    > Leé `CLAUDE.md` y `PLAN.md`. Hacé H1: listá las ramas remotas y separalas en (a) ya mergeadas en `main`
    > y (b) sin mergear. Para cada una de (b), contame en dos líneas qué cambia y si sigue teniendo sentido
    > después de C5 (que retiró el recorrido viejo). **No borres nada**: pasame la lista con tu recomendación
    > y esperá mi OK.
  - Hecha (2026-11-11), sin borrar nada. Remotas: 36 ya están en `main` (las `ccr-*`, `claude/*` y `codex/*` salvo las dos de abajo). Sin mergear, 4 commits cada una:
    - `codex/plantilla-traccion`: la plantilla Tracción y su script de concesionario ya están en `main`; la rama vuelve a agregar el PNG de 1,8 MB que G4 pasó a webp. Recomendación: borrar.
    - `codex/recorrido-simple`: toca `App.tsx`, `Prototipo.tsx` e `InicioSimple.tsx`, que C5 retiró. Recomendación: borrar.
    - Pendiente el OK para borrar las dos y las 36 mergeadas.

- [x] **H2 · Publicar el sitio** — Sonnet 5.5 · ChatGPT: Sol
  - Molde online con una URL fija, que se actualice sola con cada merge a `main`. `vite.config.ts` ya usa `base: './'`.
  - Pedido:
    > Leé `CLAUDE.md` y `PLAN.md`. Hacé H2: sumá un workflow en `.github/workflows/` que, en cada push a
    > `main` y solo si pasa `validar.yml`, haga `npm run build` y publique `dist/` en GitHub Pages. Revisá que
    > las fotos de `public/fotos/`, las fuentes y las rutas `#/…` funcionen bajo la subcarpeta del repositorio.
    > Explicame qué tengo que activar yo en Settings → Pages. Anotá la URL en `README.md`.

- [x] **H3 · Probar en celulares reales** — quien dirige · arreglos con Sonnet 5.5 / Sol
  - Hecha (2026-11-13): quien dirige completó el recorrido y llegó a descargar en un Google Pixel 9 Pro XL, sin problemas observados. Navegador y versión no informados. No hicieron falta arreglos. La prueba cubre ese equipo; no se informó una prueba en iPhone ni en un celular viejo o de gama baja. Registro en `DESIGN.md` §9.
  - Abrir la URL de H2 en tu celular y en uno viejo o barato si podés: Android y iPhone. Anotá todo: lento, se traba, no se lee, el toque no responde, las fuentes tardan.
  - Pedido para los arreglos (pegando tu lista):
    > Leé `CLAUDE.md` y `PLAN.md`. Hacé H3: abajo va la lista de problemas que vi en celulares reales
    > (modelo, navegador y qué pasó). Reproducí cada uno con Playwright emulando el equipo, corregilo y
    > sumá una comprobación al e2e cuando se pueda. Lo que no puedas reproducir, decímelo.
    > [tu lista]

- [x] **H4 · Pruebas con personas** — quien dirige · síntesis con Opus 5.5 / Astra
  - Hecha el 2026-11-13 con notas grupales de tres personas. Síntesis y propuestas en `DESIGN.md` §9, preguntas abiertas Q8 y Q9 en §11.
  - 3 a 5 personas que nunca lo vieron, cada una con una idea de proyecto propia. Mirá sin ayudar y anotá: dónde dudan, qué no entienden, qué eligen sin pensar, si llegan a descargar, y qué opinan del resultado.
  - Pedido para la síntesis (pegando tus notas):
    > Leé `CLAUDE.md`, `DESIGN.md` y `PLAN.md`. Hacé H4: abajo van mis notas de pruebas con personas.
    > Ordená los problemas por cuántas personas los tuvieron y cuánto les costó. Para cada uno proponé un
    > arreglo concreto y qué tan grande es. Anotá las pruebas en `DESIGN.md` §9 y las preguntas que queden en §11.
    > No cambies código.
    > [tus notas]

- [x] **H5 · Probar el `DESIGN.md` con otras IA** — Sonnet 5.5 · ChatGPT: Sol
  - El producto es el archivo: hay que ver si una IA construye bien la app con él.
  - Pedido:
    > Leé `CLAUDE.md`, `DESIGN.md` y `PLAN.md`. Hacé H5: generá tres `DESIGN.md` con Molde (una landing, un
    > dashboard y una tienda) usando `generarDesignMd` con configs variadas. Para cada uno, escribí el pedido
    > que le daría una persona a otra IA para construir la app. Después revisá el archivo como si fueras esa
    > IA: qué datos faltan, qué es ambiguo, qué se contradice. Proponé los cambios al formato y anotá todo en
    > `DESIGN.md` §9 (prueba) y §10 (cambios propuestos). No cambies el formato todavía.
  - Hecha (2026-11-13): tres exports 0.9.2 con configs y pedidos reproducibles en `pruebas/h5/`, script `scripts/h5-exportar.mjs` y revisión por Codex como IA receptora. Hallazgos H5-1 a H5-7 en `DESIGN.md` §9; propuestas en §10, sin cambiar el formato. No se construyeron apps ni se ejecutó la ampliación opcional con dos IA independientes.
  - Mejor todavía: probalo vos con dos IA distintas (Claude y ChatGPT) y pegá lo que construyeron junto con el pedido.

- [x] **H6 · Plan nuevo con lo aprendido** — Opus 5.5 · ChatGPT: Astra
  - Hecha el 2026-11-13. La tanda J en §10 recoge las pruebas H3–H5 y decide el destino de H7–H12.
  - Pedido:
    > Leé `CLAUDE.md`, `DESIGN.md` (sobre todo §9, §10 y §11) y `PLAN.md`. Hacé H6: con los resultados de
    > H3, H4 y H5, armá el plan siguiente en `PLAN.md` §10, con el mismo formato que la sección 5 (código,
    > modelo de Claude, modelo de ChatGPT, «Listo cuando», dependencias y pedido listo para pegar).
    > Priorizá lo que trabó a las personas por encima de las ideas nuevas. Justificá en una línea por qué
    > entra o no cada idea del backlog (H7 a H12).

### Backlog (opcionales: H6 decide cuáles van y en qué orden)

- [x] **H7 · Probar los otros fondos de la portada** — Claude Fable 5.2 (u Opus 5.5) · ChatGPT: no (es criterio visual)
  - Pedido:
    > Leé `CLAUDE.md`, `PLAN.md` y la entrada «Fondos interactivos para la portada de Molde» de `DESIGN.md`
    > §10. Cargá la skill `frontend-design`. Hacé H7: armá `maqueta/fondos.html` con la portada actual y un
    > selector para cambiar entre la linterna (la de hoy), la retícula que se curva, el campo de letras y el
    > muestrario de colores. Cumplí las reglas de esa entrada (celular, movimiento reducido, velo, 60 cuadros
    > por segundo) y medí cada uno. No toques `src/`: elijo yo mirándolos.
  - Hecho 2026-11-13: `maqueta/fondos.html` (selector abajo; `#reticula`, `#letras`, `#colores` abren directo).
    Falta que quien dirige elija mirándolos. Medido con Chromium sin pantalla, 4 s por fondo, el peor segundo:

    | Fondo | 1440 × 900 | 390 × 844 | 390 × 844, procesador 4 veces más lento |
    |---|---|---|---|
    | Linterna (hoy) | 60 c/s · 0,05 ms por cuadro | 60 c/s · 0,05 ms | 60 c/s · 0,14 ms |
    | Retícula | 60 c/s · 0,15 ms | 60 c/s · 0,09 ms | 60 c/s · 0,32 ms |
    | Campo de letras | 60 c/s · 0,36 ms | 60 c/s · 0,21 ms | 36 a 42 c/s · 1,2 ms (dos corridas) |
    | Muestrario | 60 c/s · 0,46 ms | 60 c/s · 0,22 ms | 58 c/s · 0,82 ms |

    Con `prefers-reduced-motion` ninguno pide `requestAnimationFrame` (0 en los cuatro). El campo de letras
    dibuja cada «Aa» una sola vez y la copia: dibujando texto en cada cuadro daba 49 c/s en escritorio. Su
    caída en el celular lento no viene del código (1,2 ms) sino de pintar muchas copias con transparencia:
    medirlo en un celular real antes de elegirlo. El velo del título es una caja difuminada en vez del óvalo
    de la portada de hoy, que en celular deja las puntas del párrafo sobre el fondo. La maqueta usa datos
    copiados del catálogo y una página de muestra propia: llevar uno a `src/` es otra tarea (y `npm run peso`).

- [x] **H8 · Reordenar las secciones arrastrando** — Sonnet 5.5 · ChatGPT: Sol
  - Hecha (2026-11-13): lista plegable con arrastre de manijas (mouse y dedo), botones Subir/Bajar de 44 px, foco estable y aviso de posición. Persiste el orden, conserva diseños y lo usa en §22. Tests unitarios y e2e propio a 1440/390 px.
  - Pedido:
    > Leé `CLAUDE.md`, `DESIGN.md` y `PLAN.md`. Hacé H8: en la ronda Secciones (`src/rondas/ramas.ts`,
    > `src/molde/Molde.tsx`) permití cambiar el orden de las secciones elegidas sin sacarlas, arrastrando las
    > fichas y también con teclado (botones «subir» y «bajar», 44 px, con `aria-label`). El orden sale en §22
    > del export como hoy. Test de `combinarSecciones` y del orden en el export.

- [ ] **H9 · Más diseños por sección** — Claude Fable 5.2 · ChatGPT: no
  - Pedido:
    > Leé `CLAUDE.md`, `DESIGN.md` y `PLAN.md`. Cargá la skill `frontend-design`. Hacé H9: sumá un tercer
    > diseño a cada una de las 8 secciones de `src/secciones.ts`, cada uno con una idea propia (nada de
    > cards numeradas 01/02/03 ni la misma sombra en todo), dibujado en `src/rapido/secciones.tsx` +
    > `secciones.css` solo con tokens. Revisalos con al menos 6 estilos a 1440 y 390 px. Seguí la regla de
    > `CLAUDE.md` para cambios en el export (§22, versión y §12).

- [x] **H10 · Guardar favoritos y comparar dos** — Opus 5.5 · ChatGPT: Astra
  - Pedido:
    > Leé `CLAUDE.md`, `DESIGN.md` y `PLAN.md`. Hacé H10: en la pantalla final de Molde, «Guardar» guarda la
    > config actual con un nombre en `localStorage` (hasta 10). Una lista permite abrir, borrar y elegir dos
    > para ver lado a lado (dos `Pagina` con su config, en celular una arriba de la otra). Cuidá el peso: todo
    > esto baja aparte. Tests de guardar, abrir y borrar, y una prueba e2e de comparar.

- [x] **H11 · Importar un `DESIGN.md` para seguir editándolo** — Opus 5.5 · ChatGPT: Astra
  - Está como pendiente en `DESIGN.md` §5.
  - Pedido:
    > Leé `CLAUDE.md`, `DESIGN.md` y `PLAN.md`. Hacé H11: en la portada, «Abrir un DESIGN.md» lee un archivo
    > exportado por Molde y reconstruye la `Config` (lo que no se pueda leer queda con el valor inicial y se
    > avisa). Tiene que aceptar desde la versión 0.8.8 hasta la actual. Test de ida y vuelta: para muchas
    > configs, exportar → importar → exportar da el mismo archivo. Actualizá §5 y §12 de `DESIGN.md`.

- [ ] **H12 · Efecto al pasar el mouse por las tarjetas y cursor propio** — Sonnet 5.5 · ChatGPT: Sol
  - Las dos ideas de §7.9 que quedaron sin hacer.
  - Pedido:
    > Leé `CLAUDE.md`, `DESIGN.md` y `PLAN.md` (§7.9). Hacé H12: sumá dos rondas opcionales para landing,
    > tienda y portfolio: «Al pasar el mouse» (con los 7 hover que ya existen, aplicados a las tarjetas) y
    > «Cursor» (4 opciones en CSS, con versión normal en pantallas táctiles y con movimiento reducido).
    > Cada una llena su lugar en el export, con su CSS. Seguí la regla de `CLAUDE.md` para cambios en el export.

**Arreglo chico pendiente** (cualquiera, de paso): el aviso de lint en `src/rapido/demo.tsx:32`
(`useEffect` sin la dependencia `bucle`).

---

## 10. Recorrido corto (tanda I) — aprobada por quien dirige (2026-11-11)

**Por qué (2026-11-11):** quien dirige probó Molde publicado. El punto de partida le gusta, pero una
landing recorre 14 rondas (10 comunes + 3 de la rama + densidad) y son demasiadas. Pedido: menos
pasos, más englobados, y que cada persona vea solo lo que le sirve según su proyecto y su layout.
La portada sigue verde pero queda como está por ahora (H7 espera).

**Qué cambia respecto de §4:** cambia el orden de las rondas y se refuerza la 7 (ramas): ya no alcanza
con el tipo de proyecto, también filtra el layout. Además, dos pedidos nuevos de quien dirige:

- **La página se usa mientras se arma.** Hoy el lienzo está apagado a propósito (`inert` en
  `Molde.tsx`, «es una muestra, así que no se navega por dentro»). Tiene que poder scrollearse,
  navegarse y responder a los toques mientras la persona elige. Esto toca la decisión 3: las ideas
  ya no pueden tapar el centro de la página (ver I3).
- **Al final se ve la página terminada**, entera y usable, con un botón «Descargar» en una esquina
  que lleva a la ventana de descarga (`DESIGN.md` y HTML). Hoy `#/listo` esconde la página y muestra
  directo los archivos.

Las decisiones 1, 2, 4 a 6 y 8 a 10 siguen igual.

### Los pasos nuevos (5 como máximo, 4 para la mayoría)

| Paso | Engloba (rondas de hoy) | Quién lo ve |
|---|---|---|
| 1 · Qué es | Proyecto + Rubro (el rubro aparece en la misma pantalla al elegir el tipo) | todos |
| 2 · Estructura | Layout + Secciones | todos; Secciones solo landing, sitio y portfolio |
| 3 · Estilo | Estilo, que deja puestos letra, piezas, iconos, entrada y densidad coherentes | todos |
| 4 · Color | Color | todos |
| 5 · Lo propio | Las rondas de la rama juntas en una sola pantalla (landing: fondo animado + scroll; tienda: producto, compra y buscador…) | solo si el tipo **y el layout** tienen algo para mostrar |

Después: `Descargar`. Letra, Piezas, Iconos, Tono, Entrada y Densidad **dejan de ser pasos**: salen
resueltos del estilo, el tipo y el rubro (los recomendados que ya existen) y se cambian desde las
fichas, como hoy los ajustes finos. No se borra ningún catálogo ni cambia el export.

### Tareas

- [x] **I1 · Datos: pasos agrupados y filtro por layout** — Opus 5.5 · ChatGPT: Astra · hecha 2026-11-11: `src/rondas/pasos.ts` (`pasosDe`, `rondasDeAjustar`, `pasoDeRonda`) y `src/rondas/admite-layout.ts` (fondo, scroll y secciones de los 46 layouts; `fondo` medido sobre la página dibujada). Fondo animado sigue pendiente de D6 en `ramas.ts`, así que hoy «Lo propio» de landing trae solo scroll.
  - `src/rondas/`: un tipo `Paso` que agrupa rondas, y `pasosDe(config)` que devuelve solo los que aplican.
    `Layout` hoy solo tiene nombre y descripción: sumar qué admite cada uno (fondo, scroll, secciones)
    en un archivo aparte que no entre en la carga inicial. Tests: ningún tipo pasa de 5 pasos; un layout
    sin fondo no ofrece fondo animado.
  - Listo cuando: `pasosDe` cubre los 8 tipos y los 46 layouts, y `rondasDe` sigue andando para las fichas.
- [x] **I2 · Valores por defecto de lo que ya no se pregunta** — Sonnet 5.5 · ChatGPT: Sol · depende de I1
  - Al elegir estilo, tipo o rubro se llenan letra, piezas, iconos, tono, entrada y densidad con el primer
    recomendado, sin pisar lo que la persona cambió a mano (`ContextoRonda.elegidas`). Test: el export de
    un recorrido de 4 pasos no deja ninguna sección vacía.
  - Hecho: `conValoresPorDefecto` en `src/rondas/comunes.ts`; lo llaman `PROYECTO`, `RUBRO` y `ESTILO` al aplicar (solo con `ctx`). No marca las rondas como elegidas. Tests en `rondas.test.ts`.
- [x] **I3 · Interfaz del recorrido corto** — Fable 5.2 (u Opus 5.5) · ChatGPT: no (criterio visual) · depende de I1 · hecha 2026-11-11
  - `src/molde/Molde.tsx`: recorrer `pasosDe`, mostrar «paso 2 de 4», pasos con más de una ronda en una
    sola pantalla, y las fichas de lo no preguntado bajo «Ajustar». Rutas viejas (`#/letra`…) siguen
    abriendo su ficha (`navegacion.ts`). Revisar `npm run peso`.
  - **Página usable:** sacar `inert` del lienzo y mover las ideas a un lugar que no tape la página (una
    bandeja abajo o al costado, que se pueda achicar). Sigue valiendo «ver antes de elegir»: la vista
    previa de una idea también se puede scrollear. Los links y formularios de la muestra no sacan a la
    persona de Molde ni envían nada. Cuidar el foco y el orden de tabulación (la página ya no es
    `aria-hidden`).
  - **Final:** al terminar el último paso se muestra la página a pantalla completa, sin ideas ni
    bandeja, con un botón fijo «Descargar» en una esquina (44 px, visible sobre cualquier estilo) y
    «Seguir editando». El botón abre la ventana de descarga de hoy (`molde-descarga`).
  - Antes de programar: maqueta de la bandeja y del final en `maqueta/`, a 1440 y 390 px, para que
    quien dirige elija mirando.
  - Hecho: `Molde.tsx` recorre `pasosDe` (la pregunta dice «Paso 2 de 5 · Estructura») y `recorrido.ts`
    suma `rondasDelRecorrido` y `despuesDe`; las fichas de lo no preguntado van bajo «Ajustar», en el pie.
    El lienzo ya no es `inert`: se scrollea y se toca, los links y formularios no navegan ni envían, y la
    vista previa se abre donde está la página. Final: página entera, «Descargar» (abre `molde-descarga`
    como ventana) y «Seguir editando».
  - **Decisión de quien dirige (2026-11-12), en vez de la bandeja:** la página queda siempre en grande y
    las ideas siguen saliendo del centro, encima de ella (se mantiene la decisión 3, con arrastrar al
    centro). Al scrollear o tocar la página, las ideas se recogen arriba, en el botón de la pregunta;
    tocarlo las vuelve a abrir. No hubo maqueta en `maqueta/`: se eligió mirando la versión programada.
  - **Resuelto en I4 (se conserva el pendiente original como registro):** `DESIGN.md` §5, §8 y §12 y `CLAUDE.md`; sumar al e2e scrollear la página y tocar un
    botón de la muestra. Con Estilo antes que Color, la ronda Color no filtra las paletas que no pasan AA
    con el estilo ya elegido (antes Estilo filtraba por paleta): revisarlo en los datos (`comunes.ts`).
- [x] **I4 · Cierre** — Sonnet 5.5 · ChatGPT: Sol · depende de I2 e I3
  - e2e táctil con el recorrido nuevo: scrollear la página con una ronda abierta, tocar un botón de la
    muestra, llegar al final y descargar desde el botón de la esquina. `DESIGN.md` §5, §8 (decisión)
    y §12; `CLAUDE.md` (estructura).
  - Hecha 2026-11-11: e2e con gesto táctil real sobre lienzo y vista previa, ideas que se recogen y
    reabren, respuesta del botón de muestra sin cambiar ronda ni configuración, final y descargas
    DESIGN.md/HTML desde la esquina, con y sin movimiento reducido. Capas aisladas para que la base
    no intercepte los toques de la vista previa. Color filtra por AA con el estilo elegido, con test
    de regresión; prueba de arrastre espera dos cuadros en vez de un tiempo fijo. Documentación en
    DESIGN.md §5, D94–D95 y §12, y estructura en CLAUDE.md. Verificados typecheck, 210 tests, lint,
    peso (201,7 kB de 250 kB) y test:e2e (incluye landing/dashboard con axe en escritorio y celular).

**Orden con la tanda H:** I1 → I2 e I3 en paralelo → I4. H3 (celulares) y H5 (el archivo con otras IA)
pueden ir ya. **H4 (pruebas con personas) va después de I4**: no tiene sentido probar un recorrido
que se va a cambiar. H7 (fondos de la portada) y el resto del backlog, después de H6.

### Tanda J · Explorar la muestra, llegar al resultado y construir desde el export

En H4, a las tres personas les gustó navegar por Molde. La traba apareció **dentro de la muestra**: la barra y varios botones impedían ver cómo quedaba el diseño en otros contenidos. Algunas personas sintieron largo el recorrido. Las notas grupales no identifican los controles concretos ni cuántas llegaron a descargar. Por eso J1 atiende la exploración, J2 prueba un atajo y J3 observa ambos cambios. H3 aporta una descarga exitosa en un Pixel 9 Pro XL. H5 aporta una lectura de tres archivos 0.9.2 por Codex; queda por medir qué construyen otras IA con ellos. Evidencia en [DESIGN.md §9](DESIGN.md#9-registro-de-pruebas).

- [ ] **J1 · Navegar y probar la página de muestra** — Claude Sonnet 5.5 · ChatGPT Sol · depende de H4 e I4
  - Caso para reproducir: al validar H6 desde `43d8e03`, el recorrido táctil de 390 px pasó con movimiento normal. Con movimiento reducido, dos corridas fallaron en Color con «el botón de muestra no respondió» (`usarPagina` en `e2e/molde-tactil.e2e.mjs`). Determiná si falla la interacción o su comprobación; H4 no identificó ese control concreto.
  - Listo cuando: en una landing y un dashboard, la barra muestra la sección o vista indicada y el botón principal produce una respuesta visible acorde a su acción. Una prueba e2e verifica con teclado y toque que se conservan el paso y las elecciones.
  - Pedido listo para pegar:
    > Leé CLAUDE.md, DESIGN.md §9 (H4) y PLAN.md §10. Hacé J1. Relevá los destinos y controles que dibujan las muestras de landing y dashboard. Conectá la barra con contenido del lienzo y los botones con acciones locales, sin enviar formularios ni salir de Molde. Probá también volver a elegir una idea después de explorar.

- [ ] **J2 · Ver el resultado desde Estructura** — Claude Sonnet 5.5 · ChatGPT Sol · depende de J1
  - Listo cuando: desde Estructura se puede abrir el resultado, descargar con las elecciones actuales y retomar la edición. Un e2e cubre el atajo y otro conserva el recorrido completo.
  - Pedido listo para pegar:
    > Leé CLAUDE.md, DESIGN.md §9 (H4) y PLAN.md §10. Hacé J2. Probá «Ver resultado» al completar Estructura. Reutilizá el final, la descarga y los valores recomendados. Verificá que «Seguir editando» recupere lo elegido y que siga siendo posible recorrer todos los pasos.

- [ ] **J3 · Observar exploración y descarga** — quien dirige · síntesis con Claude Opus 5.5 / ChatGPT Astra · depende de J1 y J2 publicados
  - Listo cuando: hay notas por persona de tres sesiones que permiten responder Q8 y Q9 o precisar qué falta. Quedan identificados los equipos probados y se decide si conservar o ajustar el atajo.
  - Pedido listo para pegar:
    > Leé DESIGN.md §9 y §11 y PLAN.md §10. Hacé J3 con estas notas: [pegá las tres sesiones]. Para cada persona registrá proyecto, control y destino esperado, respuesta observada, momento en que quiso ver el resultado, descarga y opinión. Procurá incluir un iPhone y un Android de gama baja para ampliar H3. Indicá la cobertura real y registrá los resultados en §9.

- [ ] **J4 · Alinear el export con el proyecto elegido** — Claude Opus 5.5 · ChatGPT Astra · depende de H5; abordar después de J1 y J2
  - Listo cuando: las tres configs de H5 tienen pruebas que verifican coherencia de CTA, secciones, destinos, alcance y pendientes. La tienda y el dashboard describen su propio tipo. El catálogo distingue piezas disponibles de las usadas.
  - Pedido listo para pegar:
    > Leé CLAUDE.md, DESIGN.md §3 y §10 y pruebas/h5/README.md. Hacé J4. Resolvé H5-1 a H5-4 y H5-6. Derivá el CTA y la estructura efectivos una sola vez. Distinguí las pantallas confirmadas de las de plantilla y declará los destinos desconocidos. En §18 separá lo que impide maquetar de los datos, permisos e integraciones pendientes para implementar. Regenerá los tres casos y actualizá la especificación y versión según §7.

- [ ] **J5 · Resolver las contradicciones entre el CSS y los tokens** — Claude Sonnet 5.5 · ChatGPT Sol · depende de J4
  - Listo cuando: el export explica la precedencia de las reglas y una muestra construida con el CSS exportado conserva el diseño y tiene controles táctiles de al menos 44 px. Se registra la resolución de Q7.
  - Pedido listo para pegar:
    > Leé CLAUDE.md, DESIGN.md §3, §10 y Q7 y PLAN.md §10. Hacé J5 sobre los casos de H5-5. Contrastá CSS literal, tokens y cajas. Corregí los mínimos de 40 px y documentá la precedencia. Revisá grosor de iconos y espaciado contra la especificación. Verificá medidas y foco en navegador, regenerá los ejemplos y actualizá la versión y el historial.

- [ ] **J6 · Construir con los tres pedidos de H5** — quien dirige con Claude y ChatGPT independientes · síntesis con Claude Opus 5.5 / ChatGPT Astra · depende de J4 y J5
  - Listo cuando: quedan los pedidos, respuestas y maquetas de landing, dashboard y tienda de ambas IA, con una comparación por caso y una decisión sobre H5-7.
  - Pedido listo para pegar:
    > Leé DESIGN.md §9, pruebas/h5/README.md y PLAN.md §10. Hacé J6. Pasá a cada IA el mismo export actualizado y el pedido de cada caso. Guardá lo que construyó cada una. Compará CTA, navegación, tokens, estados y funciones inventadas con el lienzo y el pedido. Registrá en §9 si hace falta asociar layouts, piezas y estados por pantalla (H5-7), con un ejemplo concreto.

**Decisiones sobre el backlog H7–H12**

| Idea | Decisión para esta tanda |
|---|---|
| H7 · Fondos de portada | Postergar. La dificultad observada apareció al explorar la muestra, después de la portada. |
| H8 · Reordenar secciones | Postergar. H4 registró problemas para abrir contenido; no se reportó dificultad para cambiar el orden. |
| H9 · Más diseños por sección | Postergar. J1 permite evaluar los diseños existentes en otras vistas antes de ampliar el catálogo. |
| H10 · Favoritos y comparación | Postergar. La comparación guardada resolvería otra necesidad; en H4 se quiso explorar una misma elección. |
| H11 · Importar un DESIGN.md | Postergar hasta validar el export en J6. Los cambios de alcance y destinos de J4 afectan qué podría reconstruir el importador. |
| H12 · Hover y cursor | Postergar. Sumar dos rondas aumentaría las decisiones cuando algunas personas ya sintieron largo el recorrido. |
