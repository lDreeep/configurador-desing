# CLAUDE.md

Configurador visual de diseño: una web donde la persona elige cómo se ve y qué hace su app,
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
| `src/preview/Preview.tsx` | Vista previa en vivo del modo avanzado. Usa solo variables CSS de `sistema.ts`. |
| `src/estilos-visuales.ts` | Estilos visuales y layouts. El CSS de cada estilo está en `estilos-css.ts` y sus palabras clave y reglas en `estilos-reglas.ts` (bajan aparte); el CSS se exporta tal cual en §19. |
| `src/botones-disenos.ts` | Los 80 diseños del panel de botones (aspecto, hover y animación al tocar, en CSS), sus familias (`FAMILIAS_BOTON`) y los experimentales. Se exporta tal cual en §10. |
| `src/cajas.ts` | Parámetros de caja, los tokens `--caja-*` y la regla `.caja`. Los 44 diseños (`CAJAS`) y los nombres de las opciones están en `cajas-disenos.ts`, que al cargarse los registra para `paramsDe`. Se exporta en §20. |
| `src/galeria/` | Galería de componentes por categoría (38: formularios completos, inicio de sesión, formularios en pasos, reserva de turnos, subir archivos, campos, selectores, desplegables, buscadores, controles, navegación, migas, paginación, pasos, detalles, pantallas vacías, datos…; desplegables a vacías en `nuevos.tsx`, calendarios, carruseles y pies en `nuevos2.tsx`, formularios completos, inicio de sesión y subir archivos en `formularios.tsx`, formularios en pasos y reservas en `formularios2.tsx`, productos, notificaciones y menú de usuario en `nuevos3.tsx`; diseños extra para categorías existentes en `mas-disenos.ts`): estructura fija + diseños en CSS. Se exporta en §21. |
| `src/fondos.ts` | Los 21 fondos con textura (CSS puro: gradientes y SVG; el CSS está en `fondos-css.ts`). Se aplican a `.pg-media` y `.pg-fondo-area` con la clase `fondo-<id>` en la página; se exportan en §19. Nunca va texto directo sobre un fondo: velo o tarjeta sólida. |
| `src/componentes/BotonPrincipal.tsx` | El botón principal con el diseño elegido; lo usan todas las vistas. |
| `src/rapido/` | Modo rápido: `Inicio.tsx` (página entera que cambia de diseño sola; Comenzar fijo en el centro; después se elige a mano, cambiando solo layout o solo estilo), `esquemas.tsx` (esquemas de cada layout), `BarraPasos.tsx` (barra de pasos y `usePaso()` con «Paso N de M»; el orden está en `App.tsx`), `PanelTipo.tsx`, `PanelPaquete.tsx` (paso «Tu UI»: todas las piezas a la vez en un mosaico que encastra (`Mosaico`: cada pieza mide su alto y ocupa esas filas) y «Otra combinación»; el recorrido simple es Diseño → Proyecto → Tu UI → Prototipo → Descargar, y los demás paneles son el modo detallado), `PanelBotones.tsx`, `PanelCajas.tsx`, `PanelGaleria.tsx` (panel genérico de la galería), `PanelMovimiento.tsx` (ritmo, aparición y cambio de pantalla con demos), `Prototipo.tsx` (app de prueba con todo lo elegido, vista claro/oscuro y «Editar»: cada pieza se toca, el resto se desenfoca y se cambia con flechas; `opcionesDe()` da las opciones de cada pieza), `PanelListo.tsx`, `combinar.ts` (combinaciones, candados, códigos), `Pagina.tsx` (la página y los tres layouts genéricos de la carga inicial; los demás genéricos en `layouts1.tsx`; los 12 de la tanda D3 —línea de tiempo, antes y después, mapa con lista, carta, agenda, tablero, muro, documentación, link en bio, compra, buscador y pantalla partida— están en `layouts2.tsx` + `layouts2.css`), `autores.tsx` (carga a pedido de `layouts1`, `layouts2` y las plantillas de autor), `hoja.ts` + `hoja-pagina.ts` (la hoja de la página: CSS de estilos, fondos y scroll, contenido de muestra y diseños de caja, que bajan aparte y `Pagina` espera), `autor.tsx` + `autor.css` (plantillas de autor: una página diseñada para un negocio concreto, con su receta en `RECETAS_AUTOR`; más en `autor2.tsx`, y en `autor3.tsx` + `autor3.css` las landings con demo animada; las piezas animadas compartidas — `useGuion`, `Cursor`, `FraseRevelada`, `Preguntas` — están en `demo.tsx` y las usan también las estructuras genéricas y las plantillas viejas), `fotos.ts` (fotos reales con autor y licencia, en `public/fotos/`), `pagina.css`. |
| `src/familias.ts` | Familias de UI (todo neobrutal, todo vidrio, líneas finas…) y `paqueteN(estilo, n)`: el paquete n-ésimo coherente para un estilo, con un diseño por categoría, botón y caja. Lo usa el paso «Tu UI». Un test verifica que todos los ids existan. |
| `src/rubros.ts` | Los 39 rubros por tipo de proyecto, con su contenido de muestra. Es **datos**; los largos de texto no pasan los de `contenido-tipo.ts` (lo verifica el test). |
| `src/recomendados.ts` | Qué layouts, estilos, botones, cajas y componentes se recomiendan para cada tipo de proyecto. Es **datos**; los paneles los muestran primero (nunca esconden el resto). `src/rapido/textos-prototipo.ts` tiene los textos del prototipo por tipo. |
| `src/ModoAvanzado.tsx` | El modo avanzado entero (pasos + vista previa). Se carga aparte con `lazy`, igual que los paneles del modo rápido (ver `cargar` en `App.tsx`); la portada (`Inicio`) es lo único que va en la carga inicial. |
| `src/estilos.css` | Estilos de la interfaz (`--ui-*`) y de la vista previa (`.pv-*`, solo tokens exportados). |

## Carga inicial

La primera visita baja solo React, la portada y lo que ella dibuja (PLAN.md B2). Un módulo entra
entero en un solo archivo de JS: si la portada usa una función de un archivo grande, se lleva todo
el archivo. Por eso el CSS de estilos y fondos, las reglas, los diseños de caja, el contenido de
muestra y la mayoría de los layouts viven en archivos aparte. Antes de sumar datos grandes a un
archivo que usa la portada (`catalogo.ts`, `estilos-visuales.ts`, `Pagina.tsx`, `Inicio.tsx`,
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
4. Si afecta lo visual: token en `sistema.ts` y uso en `Preview.tsx` / `.pv-*`.
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
