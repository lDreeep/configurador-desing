---
name: agregar-diseno-desde-referencia
description: Convierte una referencia (captura, link o descripción de un botón, caja, campo, barra de navegación, estilo de página, layout…) en una o más entradas del catálogo del configurador, con su CSS hecho solo con tokens. Usar cuando la persona pasa una captura o un link y dice que quiere sumarlo a la base de diseños.
---

# Agregar un diseño desde una referencia

La base de diseños crece con referencias reales (Godly, Awwwards, Mobbin, Dribbble, Uiverse, capturas propias…). Esta skill las convierte en entradas del catálogo **sin copiar marcas**: se toma el patrón y se rehace.

## 1. Entender la referencia

- Mirá la captura o la página. Si es un link, pedí una captura si no podés verla.
- Escribí en una línea **qué patrón** tiene y **en qué categoría** cae:

| Categoría | Dónde vive | Qué es una entrada |
|---|---|---|
| Estilo visual | `src/estilos-visuales.ts` → `ESTILOS` | paletas, fuentes, reglas y CSS de textura (`.pg-*`) |
| Layout de página | `src/estilos-visuales.ts` → `LAYOUTS` + `src/rapido/Pagina.tsx` + `src/rapido/pagina.css` | estructura de la página |
| Botón | `src/botones-disenos.ts` → `BOTONES` | aspecto + hover + efecto al tocar |
| Caja / contenedor | `src/cajas.ts` → `CAJAS` | combinación de parámetros (o un parámetro nuevo) |
| Campo, interruptor, casilla, deslizador, barra inferior, navegación web | `src/galeria/*.tsx` → `disenos` de la categoría | CSS sobre la estructura HTML fija de la categoría |
| Categoría nueva (tablas, gráficos, tarjetas de métricas…) | archivo nuevo en `src/galeria/` + registro en `src/galeria/index.ts` + panel en `src/App.tsx` | estructura, base y al menos 8 diseños |

- Si una referencia tiene varias cosas (por ejemplo, un botón y una barra), hacé una entrada por cada una.

## 2. Escribir la entrada

- **Solo tokens:** `--color-*`, `--radio-*`, `--fuente-*`, `--duracion-*`, `--curva-*`, `--boton-*`, `--caja-*`. Nada de colores sueltos, salvo decorativos que nunca lleven texto (por ejemplo, el gris de un bisel retro).
- **Se tiene que ver bien con cualquier paleta**, clara u oscura. Probalo mentalmente con `tinta_y_lima` (oscura) y `azul_electrico` (clara).
- **Accesible:** foco visible, áreas de 44px, contraste de texto 4.5:1, y animaciones que se apagan con `prefers-reduced-motion`.
- **Nombre en español y descripción de una línea** que diga lo que se ve o lo que hace ("Se hunde al tocar", "La perilla se estira").
- **Nada de marcas:** ni nombres de empresas ni copias exactas de un sitio. Si el código viene de Uiverse o CodePen (licencia MIT), dejá un comentario con la fuente.

## 3. Verificar

```bash
npm run typecheck && npm test
```

Los tests recorren todas las entradas: cada una tiene que generar un `DESIGN.md` válido.

## 4. Registrar

- En `DESIGN.md` §9 (registro de pruebas) o §8 (decisiones), si corresponde.
- En `DESIGN.md` §10, la referencia usada en "Fuentes para ampliar el catálogo", si es una fuente nueva.
- Al terminar, contale a la persona qué entradas sumaste, en qué panel aparecen y qué tomaste de la referencia.
