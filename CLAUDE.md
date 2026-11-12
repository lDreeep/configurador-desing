# CLAUDE.md

Molde: un configurador visual de diseño, una web donde la persona elige cómo se ve y qué hace su app,
y descarga un `DESIGN.md` que cualquier IA puede usar para construirla.

## Antes de tocar nada

**Leé `DESIGN.md`.** Es la especificación del archivo que exporta este proyecto y el documento
vivo del proyecto (decisiones, pruebas, backlog). Si el código y `DESIGN.md` no coinciden,
gana `DESIGN.md`: avisá la diferencia, no la corrijas en silencio.

## Comandos

- `npm run dev`: servidor local
- `npm test`: tests (vitest)
- `npm run typecheck`: TypeScript
- `npm run lint`: ESLint
- `npm run build`: build de producción en `dist/`
- `npm run peso`: build y control del JS inicial (tiene que quedar debajo de 250 kB; ver «Carga inicial»)
- `npm run test:e2e`: prueba de Molde con toques a 390 px (Playwright; levanta vite sola).

En GitHub, `.github/workflows/validar.yml` corre lint, typecheck, tests, build y el control del concesionario en cada PR y en `main`.

Antes de dar una tarea por terminada: `npm run typecheck && npm test`.

## Estructura

| Archivo | Qué hace |
|---|---|
| `src/catalogo.ts` | Todas las opciones (direcciones, paletas, fuentes, radios, movimientos, tipos, plantillas de pantallas). Es **datos**, no UI. |
| `src/tipos.ts` | Modelo `Config`: lo que la persona eligió. |
| `src/estado.ts` | Estado inicial, guardado en `localStorage`, `aplicarDireccion`, `aplicarTipo`. |
| `src/export/sistema.ts` | Deriva tokens y valores de diseño desde `Config`. **Lo usan la vista previa y el export**: lo que se ve es lo que se exporta. También la paleta opuesta (`paletaAlterna`, claro ↔ oscuro). |
| `src/export/extras.ts` | Salidas extra del paso final: `tokensJson` (W3C Design Tokens), `tokensCss` y `promptCorto`. |
| `src/export/generarDesignMd.ts` | Arma el `DESIGN.md` exportado. `VERSION_FORMATO` tiene que coincidir con `DESIGN.md`. |
| `src/pasos/pasos.tsx` | Registro `PASOS`: cada paso del configurador (componente, resumen, placeholder de la nota). |
| `src/estilos-visuales.ts` | Estilos visuales y layouts. El CSS de cada estilo está en `estilos-css.ts` y sus palabras clave y reglas en `estilos-reglas.ts` (bajan aparte); el CSS se exporta tal cual en §19. |
| `src/botones-disenos.ts` | Los 80 diseños del panel de botones (aspecto, hover y animación al tocar, en CSS), sus familias (`FAMILIAS_BOTON`) y los experimentales. Se exporta tal cual en §10. |
| `src/cajas.ts` | Parámetros de caja, los tokens `--caja-*` y la regla `.caja`. Los 44 diseños (`CAJAS`) y los nombres de las opciones están en `cajas-disenos.ts`, que al cargarse los registra para `paramsDe`. Se exporta en §20. |
| `src/galeria/` | Galería de componentes por categoría (37: formularios completos, inicio de sesión, formularios en pasos, reserva de turnos, subir archivos, campos, selectores, desplegables, buscadores, controles, navegación, migas, paginación, pasos, detalles, pantallas vacías, datos…; desplegables a vacías en `nuevos.tsx`, calendarios, carruseles y pies en `nuevos2.tsx`, formularios completos, inicio de sesión y subir archivos en `formularios.tsx`, formularios en pasos y reservas en `formularios2.tsx`, productos, notificaciones y menú de usuario en `nuevos3.tsx`; diseños extra para categorías existentes en `mas-disenos.ts`): estructura fija + diseños en CSS. Se exporta en §21. |
| `src/fondos.ts` | Los 21 fondos con textura (CSS puro: gradientes y SVG; el CSS está en `fondos-css.ts`). Se aplican a `.pg-media` y `.pg-fondo-area` con la clase `fondo-<id>` en la página; se exportan en §19. Nunca va texto directo sobre un fondo: velo o tarjeta sólida. |
| `src/componentes/BotonPrincipal.tsx` | El botón principal con el diseño elegido; lo usan todas las vistas. |
| `src/rapido/` | Motor compartido de páginas, conservado bajo su ruta original: `Pagina.tsx`, `pagina.css`, layouts, plantillas de autor y concesionario, `autores.tsx`, `hoja.ts`, `hoja-pagina.ts`, secciones, contenido, fotos, demos y `esquemas.tsx`. `combinar.ts` conserva las combinaciones y códigos usados por ajustes, enlaces anteriores y tests. Los paneles del recorrido viejo fueron retirados en C5. |
| `src/secciones.ts` | Las 8 secciones de la página (beneficios, cómo funciona, precios, testimonios, preguntas, equipo, números, contacto) con 2 diseños cada una y su `estructura` para el export (§22). Es **datos**. Solo landing, sitio y portfolio. Las dibuja `src/rapido/secciones.tsx` + `secciones.css` con el contenido de `src/rapido/contenido-secciones.ts`; la ronda está en `src/rondas/ramas.ts`. |
| `src/familias.ts` | Familias de UI (todo neobrutal, todo vidrio, líneas finas…) y `paqueteN(estilo, n)`: el paquete n-ésimo coherente para un estilo, con un diseño por categoría, botón y caja. Lo usa la ronda Piezas. Un test verifica que todos los ids existan. |
| `src/rubros.ts` | Los 39 rubros por tipo de proyecto, con su contenido de muestra. Es **datos**; los largos de texto no pasan los de `contenido-tipo.ts` (lo verifica el test). |
| `src/recomendados.ts` | Qué layouts, estilos, botones, cajas y componentes se recomiendan para cada tipo de proyecto. Es **datos**; las rondas los muestran primero (nunca esconden el resto). |
| `src/estilos.css` | Estilos de la interfaz (`--ui-*`) y de la vista previa (`.pv-*`, solo tokens exportados). |
| `src/molde/` | Recorrido principal montado por `App.tsx`: `Molde.tsx` (hasta 5 pasos agrupados, lienzo y vista previa usables que recogen las ideas al tocarlos, fichas Ajustar y final a pantalla completa con descarga en una ventana), `Portada.tsx` + `portada.css` (portada E2, carga aparte), `recorrido.ts` (`rondasDelRecorrido`, `despuesDe`, rondas elegidas y ajustes), `Ajustes.tsx` (controles reutilizados de `PASOS`, carga aparte) y `molde.css`. Rutas `#/inicio`, `#/<ronda>` y `#/listo`. |
| `src/rondas/` | Rondas de Molde: `ronda.ts` (tipo `Ronda`), `comunes.ts` (las de cualquier proyecto), `ramas.ts` (las de cada tipo de proyecto) e `index.ts` (`rondasDe(config)`, conservado para las fichas); `pasos.ts` agrupa Qué es → Estructura → Estilo → Color → Lo propio (`pasosDe`, `rondasDeAjustar`, `pasoDeRonda`); `admite-layout.ts` filtra por las capacidades de los 46 layouts, sin entrar en la carga inicial. `comunes.ts` aplica valores por defecto sin pisar elecciones manuales y filtra Color por AA con el estilo elegido. Es **datos**, sin UI. |
| `src/fondos-animados.ts` | Los 16 fondos animados (CSS, y el JS mínimo de `luz_cursor`). Datos base en `fondos-animados-base.ts`. Se exportan en §19. |
| `src/scroll.ts` | Los 14 efectos de scroll combinables, uno por zona de la página. Es **datos**; datos base en `scroll-base.ts`. Se exportan en §12. |
| `src/navegacion.ts` | Ronda en la URL y localStorage, historial Atrás/Adelante y migración de rutas y ubicaciones anteriores (`rapido`, `detallado`, `avanzado`, `molde`) a `#/<ronda>`. |
| `src/ErrorBoundary.tsx` | Red de seguridad en la raíz: si una parte se rompe, muestra un aviso en vez de una pantalla en blanco. |
| `src/rapido/concesionario.tsx` | Plantilla de catálogo «Tracción» (aprobada). Sus modelos y su consulta son muestras locales; la foto está en `public/fotos/traccion-vehiculos.webp`. |
| `src/componentes/toque.tsx` | Piezas chicas que usan el botón principal y la página, y van en la carga inicial. `ui.tsx` tiene el resto, que usan los ajustes finos. |
| `src/botones-carga.tsx`, `src/botones-por-estilo.ts` | Los 80 diseños de botón bajan aparte. `botones-por-estilo.ts` dice qué diseño se propone para cada estilo y es lo único que necesita la portada. |
| `src/fuentes.ts` | Carga de fuentes a pedido: cada familia se pide a Google Fonts cuando algo la muestra. |
| `src/color.ts` | Contraste WCAG 2.x, mezcla y derivación de paletas personalizadas. |
| `src/compatibilidad.ts` | Auditoría paleta × estilo (A3): arma el sistema de diseño real para cualquier par y mide el contraste de los textos. |
| `src/pasos/visual.tsx`, `src/pasos/PasoExportar.tsx` | Controles reutilizados por los ajustes finos: dirección, color, tipografía, forma, botones y movimiento (`visual.tsx`), y exportar (`PasoExportar.tsx`). |
| `src/export/estructuras-layout.ts` | Cómo se arma cada layout de `LAYOUTS` para el export (§19). Al sumar un layout, sumar acá su estructura; TypeScript avisa si falta. |
| `src/export/aparicion.ts` | Reutiliza las reglas y los keyframes de `estilos.css` para la aparición de los elementos en el export. |
| `e2e/molde-tactil.e2e.mjs`, `scripts/` | Prueba de Molde en celular (`npm run test:e2e`): recorrido corto, gesto táctil real sobre lienzo y vista previa con ideas abiertas, botón de muestra y descargas desde la esquina, con y sin movimiento reducido; `e2e/punta-a-punta.e2e.mjs` prueba landing y dashboard con axe en escritorio y celular, y `scripts/peso-inicial.mjs` (`npm run peso`) y `scripts/comprobar-concesionario.mjs` (CI). |

## Carga inicial

La entrada carga React, estado y navegación; Molde, la portada y los ajustes se cargan aparte (PLAN.md B2). Un módulo entra
entero en un solo archivo de JS: si la portada usa una función de un archivo grande, se lleva todo
el archivo. Por eso el CSS de estilos y fondos, las reglas, los diseños de caja, el contenido de
muestra y la mayoría de los layouts viven en archivos aparte. Antes de sumar datos grandes a un
archivo que usa la portada (`catalogo.ts`, `estilos-visuales.ts`, `Pagina.tsx`, `Portada.tsx`,
`App.tsx`), corré `npm run peso`.

## Reglas

- **Opciones nuevas van en `catalogo.ts`** (o en `estilos-visuales.ts` si son estilos o layouts). No escribas opciones a mano dentro de un componente.
- **La vista previa no usa colores ni medidas propios**: solo los tokens `--color-*`, `--texto-*`, `--espacio-*`, `--radio-*`, `--sombra-*`, `--duracion-*`, `--curva-*`.
- **Todo cambio en la salida del export** actualiza `DESIGN.md` (§3, y §5 si cambia un paso), sube la versión según §7 y se anota en §12. También `VERSION_FORMATO`.
- **Texto del color de acento**: usá `--color-acento-texto` (no `--color-acento`) cuando el acento es color de letra; `--color-acento` queda para fondos, bordes y marcas.
- **Paletas nuevas pasan contraste AA**: lo verifica `generarDesignMd.test.ts`.
- **Accesibilidad**: botones y links reales, `label` en cada campo, áreas táctiles de 44px, foco visible.
- **Textos de la interfaz en español rioplatense** (vos). Claves YAML del export en español sin tildes.
- Respetá los estados de `DESIGN.md` §5: no implementes algo `[futuro]` sin que te lo pidan.

## Cómo sumar un paso nuevo (de punta a punta)

1. Campos nuevos en `Config` (`tipos.ts`) y valor inicial en `configInicial()` (`estado.ts`).
2. Opciones en `catalogo.ts`.
3. Componente del paso y entrada en `PASOS` (`pasos.tsx`).
4. Si afecta lo visual: token en `sistema.ts` y uso en `Pagina.tsx` y el lienzo de Molde.
5. Sección en `generarDesignMd.ts` y test en `generarDesignMd.test.ts`.
6. `DESIGN.md`: §3 (formato), §5 (estado → `[MVP]` hecho), §8 (decisión), §12 (versión).

## Diseñar páginas y composiciones

Antes de crear o rehacer un layout, una composición o un estilo, cargá la skill `frontend-design`
(`.claude/skills/`): pide una idea propia para cada caso y evita los recursos genéricos (cards
numeradas 01/02/03, etiquetas en mayúsculas sobre todo, la misma sombra en todas las cajas,
animaciones de entrada en cada sección). Para revisar si una página se ve genérica o «hecha por IA», `design-taste-frontend` (taste-skill, MIT)
tiene listas de errores típicos y referencias de heroes, secciones, fondos y tarjetas
(`references/`). Ojo: sus reglas de fotos reales y «una sección por pantalla» son para sitios
de empresas terminados, no para las muestras del configurador; tomá sus criterios, no sus scripts.
Para datos concretos (combinaciones de letras, paletas por
rubro, reglas de UX) consultá `ui-ux-pro-max`:
`python3 .claude/skills/ui-ux-pro-max/scripts/search.py "consulta" --domain typography`.

Otras skills de diseño instaladas en `.claude/skills/`:
- `impeccable` (pbakaus, Apache 2.0): critica, audita y pule UI («audit», «polish», «bolder», «typeset»…). Su lanzador baja un programa desde GitHub la primera vez que se usa.
- `web-design-guidelines` (Vercel): auditoría contra más de 100 reglas de interfaz; lee las reglas actualizadas de internet y deja una copia en `guias-copia-local.md`.
- `web-design-engineer` (ConardLi, MIT): recetas para páginas, dashboards y prototipos en HTML/CSS/React.
- `landing-page-design` (Elaya, MIT): estructura, textos de conversión y reglas visuales para landing pages. Sus valores fijos (escala de letra, radios, fondos) son para una landing terminada: en el configurador mandan los tokens que elige la persona; tomá su criterio de estructura y textos.
- `stageshow` (Benji Taylor, MIT): interfaces de producto simuladas (ventanas, celulares, paneles, cursor animado) para los «hero» y tarjetas de las plantillas de muestra, y para mostrar el configurador en acción en la portada. Su kit es React + CSS como el nuestro; si se usa, copiar solo las piezas necesarias a `src/` (no los íconos de apps reales de `assets/`, que no son MIT) y respetar los tokens del configurador.
- `figma-designer` (Elaya, MIT): solo para trabajar dentro de Figma con el MCP de Figma; este proyecto no lo usa.
- `shadcn` (shadcn/ui, MIT): solo aplica a proyectos con shadcn/ui; este configurador no lo usa, sirve como referencia de componentes.

## Sumar diseños a la base

Usá la skill `agregar-diseno-desde-referencia` (`.claude/skills/`): convierte capturas o links en entradas del catálogo.

## Al terminar una tarea

Proponé las entradas que correspondan en `DESIGN.md`: §8 decisiones, §9 pruebas, §10 backlog,
§11 preguntas abiertas, §12 historial. Si te lo pidieron, escribilas vos.
