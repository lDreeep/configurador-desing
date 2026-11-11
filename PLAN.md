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

- [ ] **C5 · Reemplazar el recorrido y retirar lo viejo** — Sonnet 5.5 · ChatGPT: Sol · depende de C3, C4 y E2
  - Antes de borrar, que liste qué va a borrar y lo apruebe quien dirige.
  - `src/App.tsx` pasa a montar Molde. Borrar los paneles del modo rápido y `ModoAvanzado.tsx` que ya no se usen; conservar `Prototipo.tsx` si C4 lo reutiliza.
  - Listo cuando: no quedan imports muertos y el build pasa.

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
  - Hecha: catálogo en `src/secciones.ts` (8 secciones × 2 diseños, con su `estructura`), contenido de muestra en `src/rapido/contenido-secciones.ts` y dibujo en `src/rapido/secciones.tsx` + `secciones.css`. `visual.secciones` en `Config` (lo limpia `normalizar`). La ronda `RONDA_SECCIONES` (`src/rondas/ramas.ts`) elige varias: el orden de la página es el orden en que se eligen; en Molde la página va sola hasta la sección que se mira. Las secciones reemplazan al argumento del layout. Export: §22, formato 0.9.0, decisión D92. Tests en `src/secciones.test.tsx`. Pendiente: no se pueden reordenar sin sacar y volver a elegir; el export a HTML (F1) tiene que incluir `secciones.css`; de los 20 estilos solo se revisaron a ojo tres (sin estilo, neobrutalismo y terminal), a 1440 y 390 px.

- [x] **D13 · Ronda Rubro** — Sonnet 5.5 · ChatGPT: Sol · depende de D1 y D10 (conviene en la misma sesión que F1)
  - Guardar el rubro en `Config` (lo limpia `normalizar`), sacar «Rubro» de `rondasPendientes()` y ponerla después de Proyecto (decisión D88). Con el rubro en `Config`, `COLOR`, `LAYOUT`, `ESTILO` y `PIEZAS` de `src/rondas/comunes.ts` pasan `conRubro(…)` a `primeroRecomendados` (lo que dejó pendiente D10). La página usa el contenido de muestra del rubro.
  - Listo cuando: elegir un rubro cambia las 6 primeras opciones de esas rondas y el contenido de la página, con test.
  - Hecha: ronda obligatoria Rubro, persistencia y limpieza al cambiar de tipo, recomendaciones y contenido de muestra. Los estilos conservan el filtro de contraste AA. Pruebas para los 39 rubros y recorrido actualizado.

- [x] **D14 · Ronda de lectura del blog** — Sonnet 5.5 · ChatGPT: Sol · depende de D11
  - La ronda «Lectura (ancho y tamaño)» de la tabla 7.1, que D11 dejó afuera. Seguir el patrón de Densidad (`src/rondas/comunes.ts`).
  - Listo cuando: cambia el ancho y el tamaño del texto en la página en vivo y llena su lugar en el export.
  - Hecha: `LECTURA` sigue el patrón de Densidad, con seis combinaciones en `LECTURAS` (50/60/70ch × 16/20px). `visual.lectura` se normaliza y solo se aplica a blogs. Página y export §7 comparten los tokens de `sistemaDeDiseno` y `CSS_LECTURA`; el ancho se adapta al celular. Formato 0.9.2. Tests en `src/lectura.test.tsx`.

### Tanda 4: portada y descarga

- [ ] **E1 · Portada: más vida y scroll fluido (en la maqueta)** — Fable 5.2 · ChatGPT: no (falta solo la aprobación) · sin dependencias
  - Rehacer la portada de `maqueta/molde-2.html` según la sección 8. Se aprueba en la maqueta antes de portarla.
  - Listo cuando: quien dirige el proyecto la aprueba.
  - Estado: hecha en la maqueta (scroll cuadro a cuadro, 15 capas armadas una sola vez, piezas que vuelan al lienzo, título que cambia, botón que se acerca al mouse y cierre con el botón latiendo). Falta la aprobación.
  - **Cambios por la revisión (2026-11-11):** (1) las flechas, «Ver otras» y las descargas se veían en la portada porque su `display` le ganaba a `hidden`: arreglado con `[hidden] { display: none !important }`. (2) Se sacaron las piezas que giraban alrededor del botón y se apartaban del mouse, y las ondas. En su lugar, **linterna de estilos**: de fondo, una página apagada del tamaño del lienzo; una lente que sigue al cursor la muestra con otro color y otras piezas (mismo tipo y layout), con su nombre abajo («Neobrutal · Durazno»). El estilo cambia junto con la palabra del título. En celular la lente pasea sola; con movimiento reducido queda quieta. El título y «Bajá…» llevan velo. Midió 60 cuadros por segundo a 1440 × 900. Las otras ideas de fondo quedan en `DESIGN.md` §10 (Ideas sueltas). Falta la aprobación.
  - Para E2: la lente en el sitio real tiene que usar `Pagina` con la `Config` de muestra y bajar aparte (el JS inicial está en el límite).

- [ ] **E2 · Portar la portada** — Opus 5.5 · ChatGPT: Astra, con revisión a ojo · depende de E1 y C2
  - Ojo: el JS inicial está en 249,7 kB (límite 250, `npm run peso`). Lo que sume la portada tiene que bajar aparte.
  - Llevar la portada aprobada a `src/molde/`, con páginas reales del catálogo.
  - Listo cuando: el scroll va a 60 cuadros por segundo y «Empezar» funciona en cualquier punto.

- [x] **F1 · Formato 0.9.1: campos nuevos en el export** — Sonnet 5.5 · ChatGPT: Sol · depende de D1, D6, D7 y D8
  - La 0.9.0 ya la usaron D11 y D12: esta tarea sube a **0.9.1**.
  - Sumar al export, como campos opcionales: `rubro` (§2), fondo animado (§19), efectos de scroll y su combinación (§12) y las entradas nuevas (§12), cada uno con su CSS.
  - Seguir la regla de `CLAUDE.md`: actualizar `DESIGN.md` §3, §5 y §12, `VERSION_FORMATO` en `src/export/generarDesignMd.ts`, y tests.
  - Listo cuando: un archivo 0.9.0 sigue siendo válido y el ejemplo de `DESIGN.md` §6 está en 0.9.1.
  - Hecha: campos opcionales, CSS real de entradas y scroll, 16 fondos y JS solo para luz_cursor. Configuraciones anteriores conservan sus valores por defecto. La selección de fondo animado en la interfaz sigue pendiente.

- [ ] **F2 · Descargar la página en HTML** — Opus 5.5 · ChatGPT: Astra · depende de C2 y F1
  - Generar un `.html` autocontenido con la página armada: tokens, CSS del estilo, layout, piezas, fondo, entrada y scroll. Es el «`preview.html`» pendiente en `DESIGN.md` §5.
  - Listo cuando: el archivo abre sin internet (salvo las fuentes) y se ve igual que el lienzo. Con test.

- [ ] **F3 · Pantalla de descarga** — Sonnet 5.5 · ChatGPT: Sol · depende de F2
  - Los dos botones arriba, el archivo como protagonista y el resumen plegado, como en `maqueta/molde.html`.
  - Listo cuando: «Descargar» se ve sin scrollear a 1440 px y a 390 px.

### Tanda 5: calidad y cierre

- [ ] **G1 · Tests del recorrido en el CI** — Sonnet 5.5 · ChatGPT: Terra · apta para Codex · depende de C5
  - Playwright: una landing y un dashboard de punta a punta, en escritorio y celular, más axe en cada ronda. Sumarlo a `.github/workflows/`.
- [ ] **G2 · Accesibilidad y celular** — Sonnet 5.5 · ChatGPT: Sol (pegale la lista: no carga la skill `impeccable`) · depende de C5
  - Pasada con la skill `impeccable` («audit»): 44 px, foco visible, un solo `h1`, un solo `main`, contraste del marco en claro y oscuro.
- [x] **G3 · Red de seguridad** — Sonnet 5.5 · apta para Codex · sin dependencias
  - `ErrorBoundary` en la raíz, ESLint con la configuración recomendada de React y TypeScript, y arreglar el error de consola `ERR_INVALID_URL` que aparece después de elegir el tipo de proyecto.
- [x] **G4 · Documentación al día** — Haiku 5.5 · ChatGPT: Terra o Luna · apta para Codex · depende de C5
  - `README.md` (habla de «9 pasos»), `CLAUDE.md` (estructura nueva y cantidades reales), orden cronológico de `DESIGN.md` §12, favicon y metadatos en `index.html`, y pasar `public/fotos/traccion-vehiculos.png` (1,8 MB) a webp.
  - Hecha: `README.md` con el recorrido real (5 pasos en el simple, 10 en el avanzado) y los comandos; `CLAUDE.md` con los módulos que faltaban y las cantidades reales (37 categorías de galería); `DESIGN.md` §12 ordenado por versión, más reciente arriba, y el segundo 0.1.0 pasado a 0.1.1 (era un cambio sin formato); favicon SVG (`public/favicon.svg`) y metadatos en `index.html` sin nombre de marca hasta que se confirme Molde; foto de `concesionario` pasada a webp (1,8 MB → 355 kB, mismo tamaño). Quedan para C5: el recorrido que describe el README y la estructura de `src/molde/` cuando Molde pase a la raíz.
- [ ] **G5 · Revisión final** — Opus 5.5 · ChatGPT: no (queda en Claude) · depende de todo
  - `/code-review` sobre el diff completo antes de mergear a `main`.

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
| 11 | G5 · revisión final | Opus 5.5 | — (queda en Claude) | — |

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
