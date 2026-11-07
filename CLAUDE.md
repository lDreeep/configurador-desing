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
- `npm run build`: build de producción en `dist/`

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
| `src/estilos-visuales.ts` | Estilos visuales (con su CSS y reglas) y layouts. El CSS se exporta tal cual en §19. |
| `src/botones-disenos.ts` | Los 80 diseños del panel de botones (aspecto, hover y animación al tocar, en CSS), sus familias (`FAMILIAS_BOTON`) y los experimentales. Se exporta tal cual en §10. |
| `src/cajas.ts` | Los 29 diseños de caja, sus parámetros, los tokens `--caja-*` y la regla `.caja`. Se exporta en §20. |
| `src/galeria/` | Galería de componentes por categoría (26: campos, selectores, desplegables, buscadores, controles, navegación, migas, paginación, pasos, detalles, pantallas vacías, datos…; las últimas 6 en `nuevos.tsx`): estructura fija + diseños en CSS. Se exporta en §21. |
| `src/componentes/BotonPrincipal.tsx` | El botón principal con el diseño elegido; lo usan todas las vistas. |
| `src/rapido/` | Modo rápido: `Inicio.tsx` (página entera que cambia de diseño sola; Comenzar fijo en el centro; después se elige a mano, cambiando solo layout o solo estilo), `esquemas.tsx` (esquemas de cada layout), `BarraPasos.tsx` (barra de pasos y `usePaso()` con «Paso N de M»; el orden está en `App.tsx`), `PanelTipo.tsx`, `PanelBotones.tsx`, `PanelCajas.tsx`, `PanelGaleria.tsx` (panel genérico de la galería), `PanelMovimiento.tsx` (ritmo, aparición y cambio de pantalla con demos), `Prototipo.tsx` (app de prueba con todo lo elegido, modo edición y vista claro/oscuro), `PanelListo.tsx`, `combinar.ts` (combinaciones, candados, códigos), `Pagina.tsx` (los 12 layouts), `pagina.css`. |
| `src/recomendados.ts` | Qué layouts, estilos, botones, cajas y componentes se recomiendan para cada tipo de proyecto. Es **datos**; los paneles los muestran primero (nunca esconden el resto). `src/rapido/textos-prototipo.ts` tiene los textos del prototipo por tipo. |
| `src/ModoAvanzado.tsx` | El modo avanzado entero (pasos + vista previa). Se carga aparte con `lazy`, igual que los paneles del modo rápido (ver `cargar` en `App.tsx`); la portada (`Inicio`) es lo único que va en la carga inicial. |
| `src/estilos.css` | Estilos de la interfaz (`--ui-*`) y de la vista previa (`.pv-*`, solo tokens exportados). |

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

## Sumar diseños a la base

Usá la skill `agregar-diseno-desde-referencia` (`.claude/skills/`): convierte capturas o links en entradas del catálogo.

## Al terminar una tarea

Proponé las entradas que correspondan en `DESIGN.md`: §8 decisiones, §9 pruebas, §10 backlog,
§11 preguntas abiertas, §12 historial. Si te lo pidieron, escribilas vos.
