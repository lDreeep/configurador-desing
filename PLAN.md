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

| Modelo | Usalo para | No lo uses para |
|---|---|---|
| **Fable 5.2** | Decidir cómo se ve y cómo se mueve algo que todavía no existe: la portada, el lenguaje de movimiento, layouts nuevos, el árbol de ramas. Tareas donde el resultado se juzga a ojo. | Cargar datos, tareas con receta. Es el más caro. |
| **Opus 5.5** | Arquitectura y cambios que cruzan muchos archivos: el motor de rondas, el estado, el export a HTML, rendimiento. Revisión final de lo que hicieron otros. | Sumar entradas a un catálogo siguiendo un patrón. |
| **Sonnet 5.5** | Implementar algo bien especificado: un catálogo nuevo con su CSS siguiendo ejemplos, una ronda nueva sobre el motor ya hecho, tests, arreglos de accesibilidad y celular. | Decidir diseño desde cero o reestructurar el estado. |
| **Haiku 5.5** | Trabajo mecánico con lista cerrada: cargar datos de una tabla, etiquetar, renombrar, actualizar documentación, correr verificaciones. | Cualquier cosa que pida criterio visual o que no tenga un test que la frene. |
| **Codex** (u otro agente de código) | Las tareas marcadas **«apta para Codex»**: especificación cerrada, verificación automática y sin criterio visual. | Tareas que piden cargar una skill de `.claude/skills/` (Codex no las usa) o juzgar a ojo. |

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
| Layouts genéricos | 21 | 33 | `src/estilos-visuales.ts`, `src/rapido/Pagina.tsx` |
| Plantillas de autor | 13 | 13 | `src/rapido/autor*.tsx` |
| Familias de UI (botón + caja + piezas) | 10 | 18 | `src/familias.ts` |
| Combinaciones de letra | 10 (33 fuentes) | 20 | `src/catalogo.ts` |
| Fondos con textura (quietos) | 21 | 21 | `src/fondos.ts` |
| **Fondos animados** | 0 | 16 | nuevo `src/fondos-animados.ts` |
| Entradas de la página | 5 | 12 | `src/catalogo.ts` (aparición) |
| **Efectos de scroll combinables** | 0 (hay secciones fijas en 7 layouts) | 14, en 4 zonas | nuevo `src/scroll.ts` |
| Rondas propias por rama | 0 | 2 a 4 por tipo | nuevo `src/rondas/ramas.ts` |

`CLAUDE.md` dice «24 layouts» y el código tiene 34: la tarea G4 lo corrige.

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

- [ ] **B2 · Partir la carga inicial** — Opus 5.5 · depende de B1
  - La primera visita baja unos 1,9 MB. Cargar con `lazy` las plantillas de autor (`src/rapido/Pagina.tsx` las importa todas), separar el CSS por panel y pedir cada fuente recién cuando se muestra (`urlGoogleFonts` en `src/catalogo.ts` las pide todas juntas).
  - Listo cuando: el JS inicial pesa menos de 250 KB sin comprimir y la portada no parpadea al cargar.
  - **Parcial (2026-11-11):** JS inicial de 442 a 302 KB (94 KB comprimido); CSS inicial de 166 a 89 KB; hojas de fuentes de la portada de 212 a 42 KB; el título de la portada ya no cambia de alto al cargar. Plantillas de autor (`rapido/autores.tsx`), diseños de botón (`botones-carga.tsx`), esquemas, estructuras de layout (`export/estructuras-layout.ts`) y el CSS del prototipo y de tres paneles bajan aparte; las fuentes se piden de a una (`fuentes.ts`). Falta: React ocupa ~140 KB y el resto es lo que la portada muestra (CSS de los 20 estilos, paletas, fondos, layouts genéricos, cajas). Bajar de 250 KB pide separar el CSS de los estilos o las cajas de sus datos; queda abierto.

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

- [ ] **C3 · Versión táctil y sin movimiento** — Sonnet 5.5 · depende de C2
  - En pantallas táctiles: un toque muestra, aparecen «Usar» y «Ver otras». Áreas táctiles de 44 px. Con `prefers-reduced-motion`, todo aparece sin animación y sigue funcionando.
  - Listo cuando: un test de Playwright recorre las rondas obligatorias a 390 px con toques.

- [ ] **C4 · Fichas con ajustes finos (el modo avanzado fundido)** — Opus 5.5 · depende de C2
  - Tocar una ficha reabre su ronda y muestra «Ajustes finos»: los controles que hoy están en el modo avanzado para ese tema (`src/pasos/pasos.tsx`, `src/pasos/visual.tsx`), por ejemplo paleta personalizada en Color o peso y espaciado en Letra.
  - Listo cuando: todo lo que se podía ajustar en `src/ModoAvanzado.tsx` se puede ajustar desde alguna ficha. Entregar una tabla de equivalencias en el PR.

- [ ] **C5 · Reemplazar el recorrido y retirar lo viejo** — Sonnet 5.5 · depende de C3, C4 y E2
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

- [ ] **D3 · 12 layouts genéricos nuevos** — Fable 5.2
  - Diseñar e implementar los 12 de la sección 7.5 en `src/estilos-visuales.ts` y `src/rapido/Pagina.tsx`. Cargar antes la skill `frontend-design`; cada uno necesita una idea propia, no una variación de `hero_partido`.
  - Cada layout nuevo va **al final** de la lista para no romper los códigos compartidos.
  - Listo cuando: cada layout se ve bien con los 20 estilos a 1440 px y a 390 px, y tiene su `estructura` escrita para el export.

- [x] **D4 · 8 familias de UI nuevas** — Sonnet 5.5
  - Sumar a `src/familias.ts` las de la sección 7.6, armadas **solo con diseños que ya existen** (botones, cajas y galería). No escribir CSS nuevo.
  - Listo cuando: pasa el test que verifica que todos los ids existen.

- [x] **D5 · 10 combinaciones de letra nuevas** — Haiku 5.5 · apta para Codex
  - Sumar a `COMBINACIONES` en `src/catalogo.ts` diez pares con las 33 fuentes que ya están cargadas. Consultar `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "consulta" --domain typography` para elegir pares.
  - Listo cuando: no hay pares repetidos y cada par usa pesos que la fuente tiene.
  - Hecha: 10 pares nuevos al final de `COMBINACIONES` (14 → 24), sin fuentes nuevas ni cambios en el export. Test en `src/export/generarDesignMd.test.ts` (sin pares ni nombres repetidos; ambas fuentes tienen peso 400).

- [ ] **D6 · Fondos animados** — Opus 5.5 (motor y 4 fondos) y después Sonnet 5.5 (los otros 12)
  - Crear `src/fondos-animados.ts` con los 16 de la sección 7.7. Solo CSS, salvo «luz que sigue al cursor». Los seis de `maqueta/molde-2.html` sirven de referencia.
  - Reglas: usan los tokens `--color-*`; cada uno tiene versión quieta para `prefers-reduced-motion`; nunca va texto directo sobre el fondo (velo o tarjeta sólida, como en `src/fondos.ts`).
  - Listo cuando: cada fondo corre a 60 cuadros por segundo en una laptop común y tiene su CSS listo para exportar.

- [ ] **D7 · Efectos de scroll combinables** — Opus 5.5 (motor y 4 efectos) y después Sonnet 5.5 (los otros 10)
  - Crear `src/scroll.ts` con los 14 de la sección 7.4, en 4 zonas. Usar CSS scroll-driven animations como ya hace el proyecto (decisión D72), con versión quieta.
  - La persona puede combinar hasta 3, **uno por zona**; el motor rechaza dos de la misma zona.
  - En la vista previa, la página se baja sola para mostrar el efecto.
  - Listo cuando: cualquier combinación válida funciona junta y hay un test de las reglas de combinación.

- [x] **D8 · 7 entradas nuevas** — Sonnet 5.5 · apta para Codex
  - Sumar a la aparición (`AparicionId` en `src/tipos.ts`, opciones en `src/catalogo.ts`) las de la sección 7.8. Se reproducen solo en su ronda y al terminar.
  - Listo cuando: cada entrada tiene su CSS con tokens `--duracion-*` y `--curva-*`.

- [ ] **D9 · Rondas de rama con catálogo existente** — Sonnet 5.5
  - Conectar a `src/rondas/ramas.ts` las categorías de la galería que le tocan a cada tipo (sección 7.1): tarjetas de producto para tienda, gráficos y tablas para dashboard, barra inferior para app de celular, etc.
  - Listo cuando: cada tipo tiene sus rondas propias funcionando con datos reales.
  - Ya hecho en C1: `rondaDeGaleria` arma la ronda de cualquier categoría de la galería con sus recomendados, y `RAMAS` conecta las de §7.1. Queda revisar los textos de cada pregunta y que las recomendadas de `recomendados.ts` alcancen para 6 por ronda.

- [x] **D10 · Recomendaciones por rubro** — Sonnet 5.5 · depende de D1 y D2
  - Extender `src/recomendados.ts`: para cada rubro, qué paletas, layouts, estilos y familias aparecen primero. Las primeras 6 de cada ronda salen de acá.
  - Listo cuando: un test verifica que cada rubro tiene al menos 6 recomendados por ronda y que todos existen.
  - Hecha: `RECOMENDADOS_RUBRO` (6 paletas, 6 layouts, 6 estilos y 6 familias por rubro), `recomendadosDeRubro` y `conRubro` al final de `src/recomendados.ts`; tests en `src/rubros.test.ts`. Pendiente (lo cierra la tarea que sume la ronda Rubro): `Config` todavía no guarda el rubro, así que `COLOR`, `LAYOUT`, `ESTILO` y `PIEZAS` en `src/rondas/comunes.ts` aún no leen estas listas; con el rubro en `Config` alcanza con pasar `conRubro(rec.paletas, …)` a `primeroRecomendados`.

- [ ] **D11 · Ideas nuevas como rondas opcionales** — Sonnet 5.5 · depende de C4
  - Sumar las rondas de la sección 7.9 que ya tienen formato definido en `DESIGN.md` §3 y nunca se implementaron: iconos (§11), tono de los textos (§13) y densidad (§8).
  - Listo cuando: cada una llena su sección del export y `DESIGN.md` §5 pasa su estado a hecho.

- [ ] **D12 · Secciones de la página** — Fable 5.2 · depende de D3
  - Ronda nueva para landing, sitio y portfolio: elegir qué secciones lleva la página (precios, testimonios, preguntas frecuentes, contacto, equipo) y en qué orden. Es la idea «catálogo de secciones» de `DESIGN.md` §10.
  - Listo cuando: hay 8 secciones con 2 variantes cada una y el export las describe en §3.

### Tanda 4: portada y descarga

- [ ] **E1 · Portada: más vida y scroll fluido (en la maqueta)** — Fable 5.2 · sin dependencias
  - Rehacer la portada de `maqueta/molde-2.html` según la sección 8. Se aprueba en la maqueta antes de portarla.
  - Listo cuando: quien dirige el proyecto la aprueba.
  - Estado: hecha en la maqueta (scroll cuadro a cuadro, 15 capas armadas una sola vez, piezas que vuelan al lienzo, título que cambia, botón que se acerca al mouse y cierre con el botón latiendo). Falta la aprobación.

- [ ] **E2 · Portar la portada** — Opus 5.5 · depende de E1 y C2
  - Llevar la portada aprobada a `src/molde/`, con páginas reales del catálogo.
  - Listo cuando: el scroll va a 60 cuadros por segundo y «Empezar» funciona en cualquier punto.

- [ ] **F1 · Formato 0.9.0: campos nuevos en el export** — Sonnet 5.5 · depende de D1, D6, D7 y D8
  - Sumar al export, como campos opcionales: `rubro` (§2), fondo animado (§19), efectos de scroll y su combinación (§12) y las entradas nuevas (§12), cada uno con su CSS.
  - Seguir la regla de `CLAUDE.md`: actualizar `DESIGN.md` §3, §5 y §12, `VERSION_FORMATO` en `src/export/generarDesignMd.ts`, y tests.
  - Listo cuando: un archivo 0.8.8 sigue siendo válido y el ejemplo de `DESIGN.md` §6 está en 0.9.0.

- [ ] **F2 · Descargar la página en HTML** — Opus 5.5 · depende de C2 y F1
  - Generar un `.html` autocontenido con la página armada: tokens, CSS del estilo, layout, piezas, fondo, entrada y scroll. Es el «`preview.html`» pendiente en `DESIGN.md` §5.
  - Listo cuando: el archivo abre sin internet (salvo las fuentes) y se ve igual que el lienzo. Con test.

- [ ] **F3 · Pantalla de descarga** — Sonnet 5.5 · depende de F2
  - Los dos botones arriba, el archivo como protagonista y el resumen plegado, como en `maqueta/molde.html`.
  - Listo cuando: «Descargar» se ve sin scrollear a 1440 px y a 390 px.

### Tanda 5: calidad y cierre

- [ ] **G1 · Tests del recorrido en el CI** — Sonnet 5.5 · apta para Codex · depende de C5
  - Playwright: una landing y un dashboard de punta a punta, en escritorio y celular, más axe en cada ronda. Sumarlo a `.github/workflows/`.
- [ ] **G2 · Accesibilidad y celular** — Sonnet 5.5 · depende de C5
  - Pasada con la skill `impeccable` («audit»): 44 px, foco visible, un solo `h1`, un solo `main`, contraste del marco en claro y oscuro.
- [x] **G3 · Red de seguridad** — Sonnet 5.5 · apta para Codex · sin dependencias
  - `ErrorBoundary` en la raíz, ESLint con la configuración recomendada de React y TypeScript, y arreglar el error de consola `ERR_INVALID_URL` que aparece después de elegir el tipo de proyecto.
- [ ] **G4 · Documentación al día** — Haiku 5.5 · apta para Codex · depende de C5
  - `README.md` (habla de «9 pasos»), `CLAUDE.md` (estructura nueva y cantidades reales), orden cronológico de `DESIGN.md` §12, favicon y metadatos en `index.html`, y pasar `public/fotos/traccion-vehiculos.png` (1,8 MB) a webp.
- [ ] **G5 · Revisión final** — Opus 5.5 · depende de todo
  - `/code-review` sobre el diff completo antes de mergear a `main`.

---

## 6. Orden y paralelismo

| Tanda | Tareas | En paralelo | Modelos |
|---|---|---|---|
| 1 | A1, A2, A3, G3, E1 | todas | Haiku, Sonnet, Opus, Fable |
| 2 | B1 → B2 → C1 → C2 → C3 y C4 | solo C3 con C4 | Opus, Sonnet |
| 3 | D1 a D12 | todas (D10 después de D1 y D2; D11 después de C4; D12 después de D3) | Sonnet, Haiku, Opus, Fable |
| 4 | E2, F1 → F2 → F3 | E2 con F1 | Opus, Sonnet |
| 5 | C5, G1, G2, G4 → G5 | G1, G2 y G4 | Sonnet, Haiku, Opus |

La tanda 3 puede arrancar apenas termina C1, sin esperar al resto de la tanda 2.

---

## 7. Listas para las tareas de catálogo

### 7.1 Rondas propias de cada tipo

| Tipo | Rondas propias | Catálogo que usa |
|---|---|---|
| Landing | Fondo animado · Scroll · Secciones | D6, D7, D12 |
| Sitio con secciones | Fondo animado · Scroll · Secciones · Pie de página | D6, D7, D12, galería `pie` |
| Portfolio | Fondo animado · Scroll · Galería de trabajos | D6, D7, galería `carrusel` |
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
