```yaml
formato: design-md
version_formato: 0.9.2
generado_por: configurador-diseno
fecha: 2026-11-13
idioma: es
modo: proyecto
```

# Depósito Sur: DESIGN.md

> dashboard · técnico

## 1. Instrucciones para la IA

Este archivo describe una web o app que tenés que construir. Fue generado
por un configurador visual a partir de decisiones de una persona.

**Antes de aplicar todo, mostrá una maqueta.** Armá primero una maqueta de
cómo va a quedar (una página HTML estática o una captura, con las pantallas
principales y los componentes de este archivo ya aplicados: colores, tipografía,
botones, cajas, campos, navegación y estados como avisos o ventanas). Mostrásela
a la persona y esperá su visto bueno o sus cambios. Recién después aplicá el
diseño completo. Si es una app que ya existe, la maqueta muestra esas mismas
pantallas con el diseño nuevo, para comparar el antes y el después.

1. Leé el archivo completo antes de escribir código.
2. Los bloques YAML son la fuente de verdad. Usá esos valores exactos.
3. Las notas (`nota:` / `notas:`) son palabras literales de la persona y
   tienen prioridad sobre el valor del mismo bloque.
4. Implementá los tokens de la sección 16 como variables CSS (o el
   equivalente de tu stack) y usalos siempre. No uses colores, radios,
   tipografías ni duraciones sueltos.
5. Si un valor es `sin_definir`, usá el `por_defecto` de esa sección; si no
   hay, preguntá antes de inventar. Si es `libre`, decidí vos de forma
   coherente con la sección 5 y contá qué elegiste.
6. No agregues pantallas ni funcionalidades que no estén en las secciones
   3 y 4. Si creés que falta algo importante, proponelo antes de hacerlo.
7. La sección 14 (accesibilidad) no se negocia, aunque otra sección
   parezca contradecirla.
8. Revisá la sección 18 y empezá por preguntar lo que esté pendiente
   y bloquee el trabajo.
9. Al terminar, listá cualquier decisión que hayas tenido que tomar por
   tu cuenta.
10. La sección 19 define el layout y, si hay, el estilo visual: aplicá su
   CSS tal cual (las clases .pg-* son nombres de referencia: usalas o
   mapealas a tus componentes) y respetá sus reglas.
11. Si hay sección 20, todas las cards, paneles y bloques usan esa caja
   (su CSS y sus tokens --caja-*), aunque el estilo de la 19 diga otra cosa.
12. La sección 21 trae campos, controles y navegación: respetá su estructura
   HTML y su CSS (incluidas las animaciones al escribir y al cambiar).

## 2. Proyecto

Dashboard interno para revisar las ventas de un distribuidor.

```yaml
modo: proyecto
nombre: "Depósito Sur"
tipo: dashboard
rubro: "ventas"
descripcion: "Dashboard interno para revisar las ventas de un distribuidor."
objetivo_principal: "Detectar caídas de ventas y revisar pedidos"
publico:
  quienes: "Analistas y responsables comerciales"
  contexto: "Uso en Argentina, en escritorio y celular."
  nivel_tecnico: bajo
plataformas: [web_movil, web_escritorio]
idioma_contenido: es
stack_preferido: libre
```

## 3. Estructura

4 pantallas. Navegación: menú lateral en escritorio y menú hamburguesa en celular.

```yaml
navegacion:
  patron: menu_lateral
  patron_movil: hamburguesa
  items: ["Resumen", "Reportes", "Usuarios", "Ajustes"]
pantallas:
  - id: resumen_6z
    nombre: "Resumen"
    proposito: "Métricas clave de un vistazo"
    secciones: [indicadores, grafico_principal, alertas]
    accion_principal: "Exportar"
  - id: reportes_70
    nombre: "Reportes"
    proposito: "Analizar en detalle"
    secciones: [filtros, tabla]
    accion_principal: "Descargar reporte"
  - id: usuarios_71
    nombre: "Usuarios"
    proposito: "Gestionar quién accede"
    secciones: [buscador, tabla_de_usuarios]
    accion_principal: "Invitar usuario"
  - id: ajustes_72
    nombre: "Ajustes"
    proposito: "Configuración general"
    secciones: [preferencias]
    accion_principal: "Guardar cambios"
```

## 4. Funcionalidades

Intención funcional: la IA decide la implementación salvo que se indique otra cosa.

```yaml
acciones_clave:
  - "Filtrar ventas por fecha"
  - "Revisar pedidos"
  - "Exportar el informe filtrado"
datos: sin_definir
usuarios:
  requiere_cuenta: si
integraciones: []
fuera_de_alcance:
  - "Implementar servicios externos sin confirmar proveedor y credenciales"
datos_de_ejemplo: si
```

## 5. Dirección visual

Técnico: denso y preciso, tipo panel.

```yaml
direccion: tecnico
palabras_clave: [preciso, ordenado, eficiente]
anti_referencias: []
```

## 6. Color

Paleta marina naval, modo oscuro y también modo claro (los tokens del modo claro están en la sección 16). Todos los pares de texto y fondo pasan contraste AA.

```yaml
paleta: marina_naval
modo: oscuro
roles:
  fondo: "#0A1226"
  superficie: "#111D3A"
  superficie_alta: "#182850"
  borde: "#29407A"
  texto: "#E8EEFF"
  texto_suave: "#9CAEDB"
  acento: "#7DA2FF"
  sobre_acento: "#0A1530"
  acento_suave: "#1C2949"
estados:
  exito: "#4ADE80"
  aviso: "#FBBF24"
  error: "#F87171"
  info: "#93C5FD"
uso_del_acento: minimo
modo_alterno:
  modo: claro
  cuando: sigue la preferencia del sistema (prefers-color-scheme) y se puede forzar con data-tema="claro" en <html>; incluí un interruptor para cambiarlo
  roles:
    fondo: "#FCFDFF"
    superficie: "#F0F1F4"
    superficie_alta: "#FEFEFF"
    borde: "#CBCDD2"
    texto: "#080E1E"
    texto_suave: "#656974"
    acento: "#6482CC"
    sobre_acento: "#111111"
  contraste_aa: pasa
```

## 7. Tipografía

Inter para títulos, Inter para texto.

```yaml
familias:
  titulos: "\"Inter\", system-ui, sans-serif"
  texto: "\"Inter\", system-ui, sans-serif"
fuente_origen: google_fonts
escala:
  display: { tamano: 40px, interlineado: 1.05, peso: 600 }
  h1: { tamano: 33px, interlineado: 1.1, peso: 600 }
  h2: { tamano: 28px, interlineado: 1.2, peso: 500 }
  h3: { tamano: 23px, interlineado: 1.3, peso: 500 }
  cuerpo: { tamano: 16px, interlineado: 1.5, peso: 400 }
  pequeno: { tamano: 14px, interlineado: 1.45, peso: 400 }
  etiqueta: { tamano: 12px, interlineado: 1.3, peso: 600 }
peso_titulos: 600
espaciado_titulos: apretado   # -0.03em
contraste_tamanos: sutil
proporcion_escala: 1.2
largo_de_linea_max: 70ch
```

## 8. Espaciado y layout

```yaml
unidad_base: 4px
escala: [4, 8, 12, 16, 24, 32, 48, 64, 96]
densidad: compacta
padding_componente: 12px
ancho_maximo_contenido: 1200px
grilla:
  columnas: 12
  separacion: 24px
  margen_lateral: { movil: 16px, escritorio: 32px }
```

## 9. Forma

Radio apenas suave.

```yaml
radio:
  pequeno: 4px
  medio: 6px
  grande: 10px
  boton: 6px
bordes:
  uso: sutil
  componente: "1px solid #29407A"
elevacion:
  estilo: plana
  nivel_1: "none"
  nivel_2: "none"
  nivel_3: "0 12px 32px rgba(0,0,0,.24)"
```

## 10. Componentes

Botón principal «Metal oscuro» (grafito con brillo metálico); al tocarlo: destello de luz. Su CSS está abajo: usalo tal cual. Tamaño normal. El resto de los componentes usa los valores por defecto del formato.

```yaml
botones:
  diseno: metal_oscuro
  clases: "bt bt-metal_oscuro bt-ef-brillo"
  al_tocar: brillo
  estilo: relleno
  color: acento
  color_fondo: "#7DA2FF"
  color_texto: "#0A1530"
  variantes: [primario, secundario, fantasma, peligro]
  primario: "fondo --color-acento, texto --color-sobre-acento"
  secundario: "fondo transparente, borde --color-borde, texto --color-texto"
  tamano: normal
  alto: 48px
  padding_horizontal: 20px
  texto: 15px
  mayusculas: no
  icono: ninguno
  estados: [normal, hover, presionado, foco, deshabilitado, cargando]
  regla: "un solo botón primario visible por pantalla"
inputs: { estilo: borde_completo, etiqueta: arriba, ayuda_y_error: debajo }
cards: { fondo: superficie, borde: "1px solid #29407A", sombra: "--sombra-1" }
estados_especiales:
  vacio: "texto + acción"
  cargando: esqueleto
  error: "mensaje claro + cómo resolverlo + reintentar"
```

```css
/* Botón principal. Requiere los tokens de la sección 16 (--boton-color, --boton-sobre, --boton-*). */
.boton-principal {
  position: relative; isolation: isolate; display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  min-height: var(--boton-alto); padding: 0 var(--boton-padding); border-radius: var(--radio-boton);
  font-family: var(--fuente-texto); font-size: var(--boton-texto); font-weight: 600; white-space: nowrap;
  text-transform: var(--boton-mayusculas); letter-spacing: var(--boton-espaciado); cursor: pointer;
  transition: transform var(--duracion-rapida) var(--curva-entrada), box-shadow var(--duracion-rapida) var(--curva-entrada),
    filter var(--duracion-rapida) ease, background-color var(--duracion-media) ease, color var(--duracion-media) ease;
}
.boton-principal:focus-visible { outline: 3px solid var(--color-texto); outline-offset: 3px; }
.boton-principal.bt-ef-onda::after { content: ''; position: absolute; left: var(--x, 50%); top: var(--y, 50%); width: 12px; height: 12px; border-radius: 50%; background: currentColor; opacity: 0; transform: translate(-50%, -50%) scale(0); pointer-events: none; }
.boton-principal.bt-ef-onda.toque::after { animation: bt-onda 650ms ease-out; }
@keyframes bt-onda { from { opacity: .35; transform: translate(-50%, -50%) scale(0); } to { opacity: 0; transform: translate(-50%, -50%) scale(28); } }
.boton-principal.bt-ef-hundir.toque { animation: bt-hundir 320ms var(--curva-entrada); }
@keyframes bt-hundir { 35% { transform: scale(.92); } 70% { transform: scale(1.03); } }
.boton-principal.bt-ef-gelatina.toque { animation: bt-gelatina 600ms ease; }
@keyframes bt-gelatina { 30% { transform: scale(1.18, .82); } 45% { transform: scale(.88, 1.12); } 60% { transform: scale(1.06, .94); } 80% { transform: scale(.98, 1.02); } }
.boton-principal.bt-ef-rebote.toque { animation: bt-rebote 520ms cubic-bezier(.3,1.6,.5,1); }
@keyframes bt-rebote { 40% { transform: translateY(-10px) rotate(0deg); } }
.boton-principal.bt-ef-pulso.toque { animation: bt-pulso 600ms ease-out; }
@keyframes bt-pulso { from { box-shadow: 0 0 0 0 color-mix(in srgb, var(--boton-color) 60%, transparent); } to { box-shadow: 0 0 0 16px transparent; } }
.boton-principal.bt-ef-aplastar.toque { animation: bt-aplastar 360ms ease; }
@keyframes bt-aplastar { 35% { transform: scale(1.06, .8); } 70% { transform: scale(.98, 1.04); } }
.boton-principal.bt-ef-brillo.toque { animation: bt-brillo 420ms ease; }
@keyframes bt-brillo { 30% { filter: brightness(1.5) saturate(1.2); } }
.boton-principal.bt-ef-temblor.toque { animation: bt-temblor 360ms linear; }
@keyframes bt-temblor { 15% { transform: translateX(-4px) rotate(-2deg); } 30% { transform: translateX(4px) rotate(2deg); } 45% { transform: translateX(-3px); } 60% { transform: translateX(3px); } 75% { transform: translateX(-1px); } }
.boton-principal.bt-ef-latido.toque { animation: bt-latido 560ms ease; }
@keyframes bt-latido { 15% { transform: scale(1.12); } 30% { transform: scale(1); } 45% { transform: scale(1.08); } 60% { transform: scale(1); } }
.boton-principal.bt-ef-estallido.toque { animation: bt-estallido 520ms ease-out; }
@keyframes bt-estallido {
  0% { box-shadow: 0 0 0 0 var(--boton-color), 0 0 0 0 var(--boton-color), 0 0 0 0 var(--boton-color), 0 0 0 0 var(--boton-color), 0 0 0 0 var(--boton-color), 0 0 0 0 var(--boton-color); }
  60% { box-shadow: 0 -26px 0 -3px var(--boton-color), 24px -14px 0 -3px var(--boton-color), 26px 12px 0 -3px var(--boton-color), 0 26px 0 -3px var(--boton-color), -26px 12px 0 -3px var(--boton-color), -24px -14px 0 -3px var(--boton-color); }
  100% { box-shadow: 0 -34px 0 -6px transparent, 32px -18px 0 -6px transparent, 34px 16px 0 -6px transparent, 0 34px 0 -6px transparent, -34px 16px 0 -6px transparent, -32px -18px 0 -6px transparent; }
}
@media (prefers-reduced-motion: reduce) { .boton-principal, .boton-principal::before, .boton-principal::after { animation: none !important; transition: none !important; } }
.boton-principal { background: linear-gradient(180deg, #4A4D55, #23252B 50%, #15171C); color: #F3F4F6; border: 1px solid #000; box-shadow: inset 0 1px 0 rgba(255,255,255,.25), 0 4px 10px rgba(0,0,0,.35); }
.boton-principal:hover { background: linear-gradient(180deg, #555963, #2A2C33 50%, #1A1C21); }
```

## 11. Iconos e imágenes

Iconos Lucide en estilo trazo. Un solo juego de iconos en toda la interfaz: no mezclar librerías.

```yaml
iconos:
  libreria: lucide
  estilo: trazo
  grosor: 1.75
  tamano: 20px
  regla: "un icono solo lleva aria-label; con texto al lado es decorativo (aria-hidden)"
```

## 12. Movimiento

100 ms, seco y preciso. Se siente ágil.

```yaml
nivel: rapido
duraciones:
  rapida: 80ms
  media: 120ms
  lenta: 200ms
curvas:
  entrada: "cubic-bezier(.2,0,0,1)"
  salida: "cubic-bezier(.4,0,1,1)"
que_se_anima:
  hover_botones: oscurecer
  al_presionar: hundir
  aparicion_listas: fundido
  cambio_de_pantalla: fundido
respetar_movimiento_reducido: si
```

La entrada usa `pv-aparicion-fundido` en la raíz y `pv-bloque` en cada pieza. El scroll usa las clases declaradas en la raíz `.pg`, dentro de un contenedor desplazable. La barra requiere `<div class="scroll-barra" aria-hidden="true"></div>` como primer hijo.

```css

.pv-aparicion-fundido .pv-bloque { animation: pv-fundido var(--duracion-media) var(--curva-entrada) both; animation-delay: 0ms !important; }
@keyframes pv-fundido { from { opacity: 0; } to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .pv-bloque { animation: none !important; transition: none !important; } }
```

## 13. Contenido y tono

Los textos de la interfaz suenan neutra, tratan a la persona de vos y son de largo medio.

```yaml
voz: neutra
tratamiento: vos
largo_de_textos: medio
idioma: es
```

## 14. Accesibilidad

Mínimos que no se negocian.

```yaml
nivel: AA
reglas:
  - "Contraste de texto 4.5:1 (3:1 en texto de 24px o más)"
  - "Áreas táctiles de al menos 44×44px"
  - "Foco visible en todo elemento interactivo"
  - "Todo se puede usar con teclado"
  - "Botones y links reales; nada de divs clickeables"
  - "Imágenes con texto alternativo; iconos solos con aria-label"
  - "Formularios con label visible asociado a cada campo"
  - "El color nunca es la única forma de transmitir información"
  - "Respetar prefers-reduced-motion"
```

## 15. Responsive

```yaml
enfoque: movil_primero
cortes:
  movil: 0
  tableta: 768px
  escritorio: 1024px
  ancho: 1440px
comportamientos:
  navegacion_en_movil: hamburguesa
  tablas_en_movil: cards
```

## 16. Tokens

Generado a partir de las secciones anteriores. Si hay diferencias, ganan los bloques YAML.

```css
:root {
  --color-fondo: #0A1226;
  --color-superficie: #111D3A;
  --color-superficie-alta: #182850;
  --color-borde: #29407A;
  --color-texto: #E8EEFF;
  --color-texto-suave: #9CAEDB;
  --color-acento: #7DA2FF;
  --color-sobre-acento: #0A1530;
  --color-acento-suave: #1C2949;
  --color-acento-texto: #7DA2FF;
  --color-exito: #4ADE80;
  --color-aviso: #FBBF24;
  --color-error: #F87171;
  --color-info: #93C5FD;
  --fuente-titulos: "Inter", system-ui, sans-serif;
  --fuente-texto: "Inter", system-ui, sans-serif;
  --titulos-peso: 600;
  --subtitulos-peso: 500;
  --titulos-espaciado: -0.03em;
  --texto-display: 40px;
  --texto-h1: 33px;
  --texto-h2: 28px;
  --texto-h3: 23px;
  --texto-cuerpo: 16px;
  --texto-pequeno: 14px;
  --texto-etiqueta: 12px;
  --espacio-1: 4px;
  --espacio-2: 8px;
  --espacio-3: 12px;
  --espacio-4: 16px;
  --espacio-5: 24px;
  --espacio-6: 32px;
  --espacio-7: 48px;
  --espacio-8: 64px;
  --espacio-9: 96px;
  --padding-componente: 12px;
  --ancho-max: 1200px;
  --radio-pequeno: 4px;
  --radio-medio: 6px;
  --radio-grande: 10px;
  --radio-boton: 6px;
  --borde-componente: 1px solid #29407A;
  --sombra-1: none;
  --sombra-2: none;
  --sombra-3: 0 12px 32px rgba(0,0,0,.24);
  --boton-color: #7DA2FF;
  --boton-sobre: #0A1530;
  --boton-alto: 48px;
  --boton-padding: 20px;
  --boton-texto: 15px;
  --boton-mayusculas: none;
  --boton-espaciado: 0em;
  --duracion-rapida: 80ms;
  --duracion-media: 120ms;
  --duracion-lenta: 200ms;
  --curva-entrada: cubic-bezier(.2,0,0,1);
  --curva-salida: cubic-bezier(.4,0,1,1);
  --caja-fondo: #E8EEFF;
  --caja-borde: none;
  --caja-radio: 20px;
  --caja-sombra: none;
  --caja-padding: 22px;
  --caja-desenfoque: none;
  --caja-texto: #0A1226;
  --caja-texto-suave: #42495C;
  --caja-color-marca: #7DA2FF;
}

/* Modo claro: sigue al sistema y se puede forzar con data-tema="claro" en <html>. */
@media (prefers-color-scheme: light) {
  :root:not([data-tema="oscuro"]) {
    --color-fondo: #FCFDFF;
    --color-superficie: #F0F1F4;
    --color-superficie-alta: #FEFEFF;
    --color-borde: #CBCDD2;
    --color-texto: #080E1E;
    --color-texto-suave: #656974;
    --color-acento: #6482CC;
    --color-sobre-acento: #111111;
    --color-acento-suave: #E4E9F7;
    --color-acento-texto: #4B629B;
    --color-exito: #1F7A4D;
    --color-aviso: #9A4A06;
    --color-error: #C2272D;
    --color-info: #1D5FA8;
    --borde-componente: 1px solid #CBCDD2;
    --sombra-3: 0 12px 32px rgba(8,14,30,.24);
    --boton-color: #6482CC;
    --boton-sobre: #111111;
    --caja-fondo: #080E1E;
    --caja-texto: #FCFDFF;
    --caja-texto-suave: #BFC1C7;
    --caja-color-marca: #6482CC;
  }
}
:root[data-tema="claro"] {
  --color-fondo: #FCFDFF;
  --color-superficie: #F0F1F4;
  --color-superficie-alta: #FEFEFF;
  --color-borde: #CBCDD2;
  --color-texto: #080E1E;
  --color-texto-suave: #656974;
  --color-acento: #6482CC;
  --color-sobre-acento: #111111;
  --color-acento-suave: #E4E9F7;
  --color-acento-texto: #4B629B;
  --color-exito: #1F7A4D;
  --color-aviso: #9A4A06;
  --color-error: #C2272D;
  --color-info: #1D5FA8;
  --borde-componente: 1px solid #CBCDD2;
  --sombra-3: 0 12px 32px rgba(8,14,30,.24);
  --boton-color: #6482CC;
  --boton-sobre: #111111;
  --caja-fondo: #080E1E;
  --caja-texto: #FCFDFF;
  --caja-texto-suave: #BFC1C7;
  --caja-color-marca: #6482CC;
}

@media (prefers-reduced-motion: reduce) {
  :root { --duracion-rapida: 0ms; --duracion-media: 0ms; --duracion-lenta: 0ms; }
}
```

## 17. Notas generales

```yaml
notas:
  - "Proyecto ficticio para auditar el export. No inventes testimonios, precios ni métricas como si fueran reales."
```

## 18. Pendientes

Nada bloquea el trabajo. Igual conviene confirmar las preguntas sugeridas.

```yaml
sin_definir:
  - { seccion: 4, campo: datos, bloquea: no }
  - { seccion: 11, campo: logo, bloquea: no }
preguntas_sugeridas:
  - "¿Cómo se registran e ingresan los usuarios (email y contraseña, Google, link mágico)?"
  - "¿Qué datos reales se muestran en cada pantalla? Mientras tanto, usá datos de ejemplo realistas."
```

## 19. Estilo visual y layout

Estilo minimal tecnológico (líneas finas, mucho aire y detalles de código) sobre el layout «Bento». El CSS de abajo le da la textura: usalo tal cual.

```yaml
layout: bento
layout_estructura: "Grilla de 4 columnas: el bloque principal (título, bajada, botones) ocupa 3×2, un visual alto 1×2 y cards de 1 o 2 columnas debajo. En celular, 2 columnas."
layout_argumento: "Debajo de los botones del hero, una línea de prueba (un dato, un puntaje o quiénes lo usan). El visual del hero es el producto en acción: una ventana con datos reales y una historia corta con cursor (toca una fila, la acción queda hecha, sube una barra y asoma un aviso sobre el borde), que corre solo a la vista y queda quieta en el resultado con movimiento reducido. Después de la composición, antes del cierre: una frase grande (beneficio en dos líneas o más) cuyas palabras pasan de color suave a pleno una por una al bajar; un testimonio con nombre, rol y resultado concreto (nunca inventado en un producto real); y 4 a 6 preguntas frecuentes desplegables con <details>. El cierre repite la misma acción del hero."
fondo: ninguno
estilo: minimal_tecnico
estilo_palabras_clave: [preciso, limpio, producto digital]
estilo_reglas:
  - "Bordes de 1px en lugar de sombras; las sombras, si hay, casi invisibles"
  - "Mucho espacio en blanco y una sola columna de lectura en el hero"
  - "Etiquetas y números en monoespaciada, chicas y en mayúsculas"
  - "Un solo acento, usado en el botón principal y en detalles mínimos"
```

```css
/* Clases de referencia: .pg (raíz de la página), .pg-nav, .pg-marca, .pg-hero, .pg-titulo, .pg-bajada,
   .pg-etiqueta, .pg-card, .pg-card-titulo, .pg-media, .pg-boton, .pg-boton-sec, .pg-deco (.a .b .c) */
.pg .pg-titulo { letter-spacing: -0.035em; }
.pg .pg-etiqueta { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; }
.pg .pg-etiqueta::before { content: '// '; color: var(--color-acento-texto); }
.pg .pg-card { background: var(--color-fondo); border: 1px solid var(--color-borde); box-shadow: none; }
.pg .pg-card:hover { border-color: var(--color-texto-suave); }
.pg .pg-media { background-color: var(--color-superficie); border: 1px solid var(--color-borde); background-image: radial-gradient(var(--color-borde) 1px, transparent 1px); background-size: 16px 16px; }
.pg .pg-deco { background-image: linear-gradient(var(--color-borde) 1px, transparent 1px); background-size: 100% 96px; opacity: .35; mask-image: linear-gradient(transparent, #000 30%, transparent); -webkit-mask-image: linear-gradient(transparent, #000 30%, transparent); }
```

## 20. Cajas y contenedores

Todas las cards, paneles y bloques usan la caja «Invertida» (oscura sobre claro (o al revés)).

```yaml
diseno_base: invertida
clases: "caja caja-forma-normal caja-hover-escala"
fondo: invertido
transparencia: 0%
desenfoque: 0px
contorno: { grosor: 0px, linea: solid, color: borde }
esquinas: 20px
sombra: ninguna
espacio_interno: normal
forma: normal
al_pasar_el_mouse: escala
ajustado_a_mano: []
```

```css
/* Requiere los tokens --caja-* de la sección 16. */
.caja {
  background: var(--caja-fondo); border: var(--caja-borde); border-radius: var(--caja-radio); box-shadow: var(--caja-sombra);
  padding: var(--caja-padding); color: var(--caja-texto); backdrop-filter: var(--caja-desenfoque); -webkit-backdrop-filter: var(--caja-desenfoque);
  --color-texto-suave: var(--caja-texto-suave);
  transition: transform var(--duracion-media) var(--curva-entrada), box-shadow var(--duracion-media) var(--curva-entrada), border-color var(--duracion-rapida) ease, filter var(--duracion-media) ease;
}
.caja.caja-forma-cabecera { border-top: 8px solid var(--caja-color-marca); }
.caja.caja-forma-barra_lateral { border-left: 5px solid var(--caja-color-marca); }
.caja.caja-forma-esquina_cortada { clip-path: polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%); }
.caja.caja-forma-ticket { -webkit-mask: radial-gradient(circle 11px at 0 50%, transparent 98%, #000) left / 51% 100% no-repeat, radial-gradient(circle 11px at 100% 50%, transparent 98%, #000) right / 51% 100% no-repeat; mask: radial-gradient(circle 11px at 0 50%, transparent 98%, #000) left / 51% 100% no-repeat, radial-gradient(circle 11px at 100% 50%, transparent 98%, #000) right / 51% 100% no-repeat; }
.caja.caja-forma-filete { background: transparent; border: none; border-top: 1px solid var(--color-texto); border-radius: 0; box-shadow: none; padding-left: 0; padding-right: 0; }
.caja.caja-hover-elevar:hover { transform: translateY(-4px); }
.caja.caja-hover-borde:hover { border-color: var(--caja-color-marca); outline: 2px solid var(--caja-color-marca); outline-offset: -2px; }
.caja.caja-hover-escala:hover { transform: scale(1.025); }
.caja.caja-hover-inclinar:hover { transform: perspective(900px) rotateX(4deg) rotateY(-5deg); }
.caja.caja-hover-brillo:hover { filter: brightness(1.06); box-shadow: 0 0 0 1px var(--caja-color-marca), 0 0 36px color-mix(in srgb, var(--caja-color-marca) 45%, transparent); }
@media (prefers-reduced-motion: reduce) { .caja { transition: none; } .caja:hover { transform: none; } }
```

## 21. Componentes de interfaz

Campos, controles y navegación elegidos en el configurador. Cada uno trae su estructura HTML de referencia y su CSS real.

```yaml
boton_sec:
  diseno: oscuro
  nombre: "Oscuro"
  descripcion: "Relleno del color del texto"
  clases: "cm-boton_sec cm-boton_sec-oscuro"
  estructura: "<button class=\"cm-boton_sec cm-boton_sec-oscuro\"><span class=\"cm-ico\">(icono opcional)</span>Texto</button> — va al lado del botón principal; al tocar se reinicia la clase .toque."
boton_icono:
  diseno: oscuro
  nombre: "Oscuro"
  descripcion: "Fondo del color del texto"
  clases: "cm-boton_icono cm-boton_icono-oscuro"
  estructura: "<button class=\"cm-boton_icono cm-boton_icono-oscuro\" aria-label=\"Nombre\">(icono)</button> — con data-activo cuando está prendido; al tocar se reinicia .toque."
campo:
  diseno: contorno
  nombre: "Contorno"
  descripcion: "Borde fino; al enfocar se marca con un anillo"
  clases: "cm-campo cm-campo-contorno"
  estructura: "<div class=\"cm-campo cm-campo-contorno\"><label class=\"cm-etq\" for=\"x\">Etiqueta</label><div class=\"cm-caja\"><span class=\"cm-icono\">(icono opcional)</span><input id=\"x\" placeholder=\"…\"><span class=\"cm-linea\"></span></div><span class=\"cm-ayuda\">Texto de ayuda</span></div> — al escribir, se agrega y reinicia la clase .escribiendo en .cm-caja."
selector:
  diseno: oscuro
  nombre: "Oscuro"
  descripcion: "Fondo oscuro, marca clara"
  clases: "cm-selector cm-selector-oscuro"
  estructura: "<div class=\"cm-selector cm-selector-oscuro\" role=\"radiogroup\" style=\"--i: 0; --n: 2\"><span class=\"cm-ind\"></span><button role=\"radio\" aria-checked=\"true\">Mensual</button><button role=\"radio\" aria-checked=\"false\">Anual</button></div> — agregar .cm-grande para la versión grande; --i es la opción elegida."
interruptor:
  diseno: clasico
  nombre: "Clásico"
  descripcion: "Pastilla con perilla blanca"
  clases: "cm-interruptor cm-interruptor-clasico"
  estructura: "<label class=\"cm-interruptor cm-interruptor-clasico\"><input type=\"checkbox\" role=\"switch\"><span class=\"cm-pista\"><span class=\"cm-perilla\"></span></span><span class=\"cm-txt\">Texto</span></label>"
casilla:
  diseno: oscura
  nombre: "Marca oscura"
  descripcion: "Se marca con el color del texto, no con el acento"
  clases: "cm-casilla cm-casilla-oscura"
  estructura: "<label class=\"cm-casilla cm-casilla-oscura\"><input type=\"checkbox\"><span class=\"cm-marca\"><svg viewBox=\"0 0 24 24\"><path d=\"M5 12.5l4.5 4.5L19 7.5\"/></svg></span><span class=\"cm-txt\">Texto</span></label>"
deslizador:
  diseno: oscuro
  nombre: "Oscuro"
  descripcion: "Relleno del color del texto, perilla blanca"
  clases: "cm-deslizador cm-deslizador-oscuro"
  estructura: "<div class=\"cm-deslizador cm-deslizador-oscuro\" style=\"--valor: 40%\"><label class=\"cm-etq\" for=\"x\"><span>Etiqueta</span><output>40%</output></label><input id=\"x\" type=\"range\" min=\"0\" max=\"100\"></div> — al mover, actualizar --valor (porcentaje) y el output."
nav_movil:
  diseno: oscura
  nombre: "Oscura"
  descripcion: "Barra oscura con la activa encendida"
  clases: "cm-nav_movil cm-nav_movil-oscura"
  estructura: "<nav class=\"cm-nav_movil cm-nav_movil-oscura\" style=\"--i: 0; --n: 5\"><span class=\"cm-ind\"></span><button class=\"cm-item\" aria-current=\"page\"><span class=\"cm-ico\">(icono)</span><span class=\"cm-lbl\">Inicio</span></button>…</nav> — --i es el índice de la pestaña activa y --n la cantidad."
nav_web:
  diseno: oscura
  nombre: "Oscura"
  descripcion: "Barra oscura con texto claro"
  clases: "cm-nav_web cm-nav_web-oscura"
  estructura: "<nav class=\"cm-nav_web cm-nav_web-oscura\" style=\"--i: 0; --n: 4\"><span class=\"cm-marca\">Marca</span><div class=\"cm-items\"><span class=\"cm-ind\"></span><button class=\"cm-item\" aria-current=\"page\"><span class=\"cm-ico\">(icono)</span><span class=\"cm-lbl\">Inicio</span></button>…</div></nav>"
etiqueta:
  diseno: suave
  nombre: "Suave"
  descripcion: "Fondo tenue del acento"
  clases: "cm-etiqueta cm-etiqueta-suave"
  estructura: "<span class=\"cm-etiqueta cm-etiqueta-suave\">Nuevo</span>"
aviso:
  diseno: oscura
  nombre: "Oscura"
  descripcion: "Fondo oscuro, texto claro"
  clases: "cm-aviso cm-aviso-oscura"
  estructura: "<div class=\"cm-aviso cm-aviso-oscura cm-entra\" role=\"status\"><span class=\"cm-aviso-ico\">(icono)</span><span class=\"cm-aviso-texto\"><strong>Título</strong><span>Detalle</span></span><button class=\"cm-aviso-x\" aria-label=\"Cerrar\">×</button></div> — la clase .cm-entra dispara la animación de entrada."
cargando:
  diseno: anillo
  nombre: "Anillo"
  descripcion: "El clásico que gira"
  clases: "cm-cargando cm-cargando-anillo"
  estructura: "<div class=\"cm-cargando cm-cargando-anillo\" role=\"status\" aria-label=\"Cargando\"><span></span><span></span><span></span></div>"
progreso:
  diseno: fina
  nombre: "Fina"
  descripcion: "Línea delgada y redondeada"
  clases: "cm-progreso cm-progreso-fina"
  estructura: "<div class=\"cm-progreso cm-progreso-fina\" style=\"--p: 64%\"><div class=\"cm-etq\"><span>Texto</span><span>64%</span></div><div class=\"cm-pista\" role=\"progressbar\" aria-valuenow=\"64\"><span class=\"cm-relleno\"></span></div></div>"
acordeon:
  diseno: oscuro
  nombre: "Oscuro"
  descripcion: "Bloque oscuro con la abierta resaltada"
  clases: "cm-acordeon cm-acordeon-oscuro"
  estructura: "<div class=\"cm-acordeon cm-acordeon-oscuro\"><details><summary>Pregunta</summary><div class=\"cm-resp\">Respuesta</div></details>…</div>"
avatar:
  diseno: circulo
  nombre: "Círculos"
  descripcion: "Uno al lado del otro"
  clases: "cm-avatar cm-avatar-circulo"
  estructura: "<div class=\"cm-avatar cm-avatar-circulo\"><span class=\"cm-av\" data-estado=\"activo\">AL</span>…<span class=\"cm-av cm-mas\">+3</span></div>"
tooltip:
  diseno: oscuro
  nombre: "Oscuro"
  descripcion: "Fondo del color del texto"
  clases: "cm-tooltip cm-tooltip-oscuro"
  estructura: "<span class=\"cm-tooltip cm-tooltip-oscuro\"><button aria-describedby=\"t\">Botón</button><span id=\"t\" role=\"tooltip\" class=\"cm-tip\">Ayuda</span></span>"
modal:
  diseno: oscura
  nombre: "Oscura"
  descripcion: "Ventana oscura sobre cualquier fondo"
  clases: "cm-modal cm-modal-oscura"
  estructura: "<div class=\"cm-modal cm-modal-oscura\"><div class=\"cm-fondo-modal\"></div><div class=\"cm-ventana cm-entra\" role=\"dialog\" aria-modal=\"true\"><span class=\"cm-ventana-ico\">(icono)</span><strong>Título</strong><span class=\"cm-ventana-txt\">Texto</span><span class=\"cm-ventana-acciones\"><button>Cancelar</button><button class=\"cm-primario\">Guardar</button></span></div></div>"
metrica:
  diseno: oscura
  nombre: "Oscura"
  descripcion: "Fondo oscuro con mini gráfico"
  clases: "cm-metrica cm-metrica-oscura"
  estructura: "<div class=\"cm-metrica cm-metrica-oscura\"><span class=\"cm-m-ico\">(icono)</span><span class=\"cm-m-etq\">Etiqueta</span><span class=\"cm-m-valor\">$ 48.230</span><span class=\"cm-m-cambio\">▲ 12,4% vs. mes anterior</span><svg class=\"cm-m-spark\">…</svg><span class=\"cm-m-meta\"><span class=\"cm-m-meta-relleno\" style=\"--p: 72%\"></span></span><span class=\"cm-m-meta-txt\">72% de la meta</span></div> — las partes opcionales se muestran según el diseño."
grafico:
  diseno: barras
  nombre: "Barras"
  descripcion: "Columnas con la punta redondeada"
  clases: "cm-grafico cm-grafico-barras"
  estructura: "<figure class=\"cm-grafico cm-grafico-barras\"><figcaption>Título</figcaption><svg role=\"img\" aria-label=\"Resumen del dato\">…marcas .cm-g-marca con <title> para el tooltip…</svg></figure> — una serie por color; leyenda si hay más de una; grilla tenue."
tabla:
  diseno: lineas
  nombre: "Con líneas"
  descripcion: "Filas separadas por líneas finas"
  clases: "cm-tabla cm-tabla-lineas"
  estructura: "<table class=\"cm-tabla cm-tabla-lineas\"><thead><tr><th>Cliente</th><th>Estado</th><th class=\"cm-num\">Monto</th></tr></thead><tbody><tr><td>…</td><td><span class=\"cm-t-estado\" data-estado=\"pagado\">Pagado</span></td><td class=\"cm-num\">…</td></tr></tbody></table>"
desplegable:
  diseno: oscuro
  nombre: "Oscuro"
  descripcion: "Lista oscura sobre cualquier fondo"
  clases: "cm-desplegable cm-desplegable-oscuro"
  estructura: "<div class=\"cm-desplegable cm-desplegable-oscuro\" data-abierto><button class=\"cm-d-boton\" aria-haspopup=\"listbox\" aria-expanded=\"true\">Más nuevos <svg class=\"cm-chev\">…</svg></button><ul class=\"cm-d-lista\" role=\"listbox\"><li role=\"option\" aria-selected=\"true\">Más nuevos</li>…</ul></div> — data-abierto mientras la lista está abierta."
buscador:
  diseno: simple
  nombre: "Simple"
  descripcion: "Caja con borde y lista flotante"
  clases: "cm-buscador cm-buscador-simple"
  estructura: "<div class=\"cm-buscador cm-buscador-simple\"><label class=\"cm-b-caja\"><svg class=\"cm-b-ico\">…</svg><input type=\"search\" aria-autocomplete=\"list\"><kbd class=\"cm-b-atajo\">⌘K</kbd></label><ul class=\"cm-b-sugerencias\" role=\"listbox\"><li class=\"cm-b-titulo\">Sugerencias</li><li role=\"option\" aria-selected=\"true\"><svg class=\"cm-b-ico\">…</svg>Zapatillas urbanas</li>…</ul></div>"
paginacion:
  diseno: numeros
  nombre: "Números"
  descripcion: "Simple: la página actual resaltada"
  clases: "cm-paginacion cm-paginacion-numeros"
  estructura: "<nav class=\"cm-paginacion cm-paginacion-numeros\" aria-label=\"Paginación\"><button class=\"cm-p-flecha\" aria-label=\"Página anterior\">‹<span class=\"cm-p-flecha-txt\">Anterior</span></button><span class=\"cm-p-info\">Página 2 de 10</span><button class=\"cm-p-num\" aria-current=\"page\">2</button>…<span class=\"cm-p-puntos\">…</span><button class=\"cm-p-flecha\">…›</button></nav> — .cm-p-info y .cm-p-flecha-txt se muestran o no según el diseño."
migas:
  diseno: barra
  nombre: "Barra"
  descripcion: "Separadas con /"
  clases: "cm-migas cm-migas-barra"
  estructura: "<nav class=\"cm-migas cm-migas-barra\" aria-label=\"Estás en\"><ol><li><a href=\"/\">Inicio</a></li><li><a href=\"/catalogo\">Catálogo</a></li><li aria-current=\"page\">Zapatillas urbanas</li></ol></nav> — el separador lo pone el CSS."
pasos:
  diseno: circulos
  nombre: "Círculos con línea"
  descripcion: "Números unidos por una línea que se pinta"
  clases: "cm-pasos cm-pasos-circulos"
  estructura: "<ol class=\"cm-pasos cm-pasos-circulos\" style=\"--i: 1; --n: 4\"><li data-estado=\"hecho\"><button><span class=\"cm-ps-num\">✓</span><span class=\"cm-ps-txt\">Carrito</span></button></li><li data-estado=\"actual\" aria-current=\"step\">…</li><li data-estado=\"pendiente\">…</li></ol> — --i es el paso actual y --n la cantidad."
vacio:
  diseno: centrado
  nombre: "Centrado"
  descripcion: "Icono, texto y botón al medio"
  clases: "cm-vacio cm-vacio-centrado"
  estructura: "<div class=\"cm-vacio cm-vacio-centrado\"><span class=\"cm-v-ilus\"><svg>…</svg></span><div class=\"cm-v-texto\"><strong class=\"cm-v-tit\">Todavía no hay pedidos</strong><p class=\"cm-v-txt\">Cuando alguien compre, lo vas a ver acá.</p></div><button class=\"cm-v-boton\">Compartir mi tienda</button></div>"
calendario:
  diseno: oscuro
  nombre: "Oscuro"
  descripcion: "Fondo oscuro, días claros"
  clases: "cm-calendario cm-calendario-oscuro"
  estructura: "<div class=\"cm-calendario cm-calendario-oscuro\"><div class=\"cm-c-cabeza\"><button class=\"cm-c-flecha\" aria-label=\"Mes anterior\">‹</button><strong class=\"cm-c-titulo\">noviembre 2026</strong><button class=\"cm-c-flecha\">›</button></div><div class=\"cm-c-grilla\"><span class=\"cm-c-sem\">Lu</span>…<button class=\"cm-c-dia\" aria-pressed=\"true\" data-hoy data-evento data-en-rango data-fin-rango data-fuera>14</button>…</div></div> — data-hoy (hoy), data-evento (tiene algo), data-en-rango y data-fin-rango (para elegir un rango), data-fuera (días de otro mes)."
carrusel:
  diseno: clasico
  nombre: "Clásico"
  descripcion: "Flechas a los costados y puntos abajo"
  clases: "cm-carrusel cm-carrusel-clasico"
  estructura: "<div class=\"cm-carrusel cm-carrusel-clasico\" style=\"--i: 0; --n: 4\" role=\"region\" aria-roledescription=\"carrusel\"><div class=\"cm-k-ventana\"><div class=\"cm-k-pista\"><div class=\"cm-k-slide\" data-activo><strong>Título</strong><span>Detalle</span></div>…</div></div><button class=\"cm-k-flecha cm-k-prev\">‹</button><button class=\"cm-k-flecha cm-k-next\">›</button><div class=\"cm-k-puntos\"><button aria-current=\"true\"></button>…</div></div> — --i es la diapositiva actual."
pie:
  diseno: oscuro
  nombre: "Oscuro"
  descripcion: "Fondo oscuro, texto claro"
  clases: "cm-pie cm-pie-oscuro"
  estructura: "<footer class=\"cm-pie cm-pie-oscuro\"><div class=\"cm-f-arriba\"><div class=\"cm-f-marca\"><strong>Marca</strong><p>Frase</p></div><div class=\"cm-f-cols\"><div class=\"cm-f-col\"><strong>Producto</strong><a>…</a></div>…</div><form class=\"cm-f-news\"><label>Recibí las novedades</label><div class=\"cm-f-news-fila\"><input type=\"email\"><button>Suscribirme</button></div></form></div><div class=\"cm-f-legal\"><span>© 2026 Marca</span><span class=\"cm-f-redes\"><a aria-label=\"Instagram\">IG</a>…</span></div><span class=\"cm-f-gigante\" aria-hidden=\"true\">Marca</span></footer> — .cm-f-gigante y .cm-f-news se muestran o no según el diseño."
formulario:
  diseno: oscuro
  nombre: "Oscuro"
  descripcion: "Fondo oscuro, campos un poco más claros"
  clases: "cm-formulario cm-formulario-oscuro"
  estructura: "<form class=\"cm-formulario cm-formulario-oscuro\"><header class=\"cm-fo-cab\"><strong class=\"cm-fo-titulo\">Título</strong><span class=\"cm-fo-ayuda\">Ayuda</span></header><section class=\"cm-fo-seccion\"><span class=\"cm-fo-sec-titulo\">Sección</span><div class=\"cm-fo-grupo\"><label class=\"cm-fo-fila\"><span class=\"cm-fo-etq\">Nombre</span><input></label>…<div class=\"cm-fo-fila\"><span class=\"cm-fo-etq\">Modo</span><span class=\"cm-fo-segmento\" style=\"--i: 0; --n: 3\"><span class=\"cm-fo-seg-ind\"></span><button aria-pressed=\"true\">Mensual</button>…</span></div><button class=\"cm-fo-fila cm-fo-switch\" role=\"switch\" aria-checked=\"true\"><span class=\"cm-fo-etq\">Activo</span><span class=\"cm-fo-perilla\"></span></button><button class=\"cm-fo-fila cm-fo-accion\"><svg/>Sacar foto</button><label class=\"cm-fo-fila cm-fo-nota-campo\"><span class=\"cm-fo-etq\">Observaciones</span><textarea></textarea></label></div><span class=\"cm-fo-nota\">Nota</span></section>…<div class=\"cm-fo-acciones\"><button type=\"reset\" class=\"cm-fo-cancelar\">Limpiar</button><button type=\"submit\" class=\"cm-fo-guardar\">Guardar</button></div><p class=\"cm-fo-resultado\" role=\"status\"></p></form> — Usar ids únicos asociados con label y nombres de campo. Nombre y contacto son obligatorios. Al enviar, validar y mostrar .cm-fo-error junto al campo (aria-invalid y aria-describedby), enfocando el primer error. Deshabilitar Guardar mientras procesa y anunciar carga, éxito o error en .cm-fo-resultado. Limpiar es type=\"reset\". Adjuntar abre un input type=\"file\" y muestra el nombre seleccionado. La galería simula guardado; en la app, conectar la operación real sin simular resultados."
subir:
  diseno: oscuro
  nombre: "Oscuro"
  descripcion: "Zona oscura con borde claro"
  clases: "cm-subir cm-subir-oscuro"
  estructura: "<div class=\"cm-subir cm-subir-oscuro\"><label class=\"cm-s-zona\" data-encima><span class=\"cm-s-ico\"><svg/></span><span class=\"cm-s-txt\"><strong>Arrastrá un archivo…</strong><span>Fotos o PDF</span></span><span class=\"cm-s-boton\">Elegir archivo</span><input type=\"file\" multiple></label><ul class=\"cm-s-lista\"><li><span class=\"cm-s-nombre\">comprobante.pdf</span><span class=\"cm-s-barra\"><span></span></span><button aria-label=\"Quitar\">×</button></li></ul></div> — data-encima mientras se arrastra un archivo encima."
producto:
  diseno: clasica
  nombre: "Clásica"
  descripcion: "Foto, datos y botón a lo ancho"
  clases: "cm-producto cm-producto-clasica"
  estructura: "<article class=\"cm-producto cm-producto-clasica\"><div class=\"cm-pr-foto\"><img class=\"cm-pr-ilustracion\" src=\"producto.webp\" alt=\"Descripción del producto\"><span class=\"cm-pr-etq\">−20%</span><button type=\"button\" class=\"cm-pr-fav\" aria-label=\"Guardar en favoritos\" aria-pressed=\"false\">♡</button></div><div class=\"cm-pr-info\"><span class=\"cm-pr-cat\">Categoría</span><strong class=\"cm-pr-nombre\">Producto</strong><span class=\"cm-pr-estrellas\" aria-label=\"4 de 5 estrellas, 128 opiniones\">★★★★☆ (128)</span><span class=\"cm-pr-precio\"><b>$ 34.500</b><s>$ 43.100</s></span><div class=\"cm-pr-opciones\"><fieldset class=\"cm-pr-colores\"><legend>Color</legend><label><input type=\"radio\" name=\"color\" value=\"acento\"><span class=\"cm-pr-muestra-color\" aria-hidden=\"true\"></span>Acento</label>…</fieldset><div class=\"cm-pr-talle\"><label for=\"talle\">Talle</label><select id=\"talle\"><option value=\"\">Elegí</option>…</select></div><span class=\"cm-pr-error\" id=\"error-talle\" role=\"status\"></span></div><span class=\"cm-pr-disponible\">Disponible</span><button type=\"button\" class=\"cm-pr-boton\">Agregar al carrito</button><span class=\"cm-pr-confirmacion\" role=\"status\"></span></div></article> — Usar ids y names únicos por instancia. Seleccionar color actualiza --producto-tono y la imagen de variante; seleccionar talle habilita agregar; si falta, anunciar error y enfocar el selector con aria-invalid y aria-describedby. Favoritos usa aria-pressed. Agregar/quitar actualiza el carrito real del proyecto y anuncia el resultado. La galería solo lo simula."
notificaciones:
  diseno: oscura
  nombre: "Oscura"
  descripcion: "Panel oscuro"
  clases: "cm-notificaciones cm-notificaciones-oscura"
  estructura: "<div class=\"cm-notificaciones cm-notificaciones-oscura\"><button class=\"cm-n-boton\" aria-expanded=\"true\" aria-label=\"Notificaciones, 3 nuevas\"><svg/><span class=\"cm-n-num\">3</span></button><div class=\"cm-n-panel\"><div class=\"cm-n-cab\"><strong>Notificaciones</strong><button>Marcar leídas</button></div><ul><li data-nueva><span class=\"cm-n-ico\">N</span><span class=\"cm-n-txt\"><b>Nuevo pedido</b><span>Hace 2 min</span></span></li>…</ul></div></div>"
usuario:
  diseno: oscuro
  nombre: "Oscuro"
  descripcion: "Menú oscuro"
  clases: "cm-usuario cm-usuario-oscuro"
  estructura: "<div class=\"cm-usuario cm-usuario-oscuro\"><button class=\"cm-u-boton\" aria-expanded=\"true\" aria-haspopup=\"menu\"><span class=\"cm-u-av\">AL</span><span class=\"cm-u-nombre\">Ana López</span><span class=\"cm-u-chev\">▾</span></button><div class=\"cm-u-menu\" role=\"menu\"><div class=\"cm-u-cab\"><b>Ana López</b><span>ana@ejemplo.com</span></div><button role=\"menuitem\" class=\"cm-u-item\">Mi perfil</button>…<button role=\"menuitem\" class=\"cm-u-item cm-u-salir\">Cerrar sesión</button></div></div>"
acceso:
  diseno: oscuro
  nombre: "Oscuro"
  descripcion: "Tarjeta oscura"
  clases: "cm-acceso cm-acceso-oscuro"
  estructura: "<form class=\"cm-acceso cm-acceso-oscuro\"><div class=\"cm-ac-lado\"><strong>Marca</strong><span>Frase</span></div><div class=\"cm-ac-cuerpo\"><span class=\"cm-ac-marca\"><span class=\"cm-ac-logo\">T</span> Marca</span><strong class=\"cm-ac-titulo\">Entrá a tu cuenta</strong><span class=\"cm-ac-sub\">…</span><button class=\"cm-ac-social\">Recibir un enlace por email</button><span class=\"cm-ac-o\">o</span><label class=\"cm-ac-campo\"><span>Email</span><input type=\"email\"></label><label class=\"cm-ac-campo\"><span>Contraseña</span><span class=\"cm-ac-clave\"><input type=\"password\"><button class=\"cm-ac-ver\">Ver</button></span></label><span class=\"cm-ac-fila\"><label class=\"cm-ac-recordar\"><input type=\"checkbox\"> Recordarme</label><a>¿Olvidaste tu contraseña?</a></span><button type=\"submit\" class=\"cm-ac-entrar\">Entrar</button><span class=\"cm-ac-pie\">¿No tenés cuenta? <a>Registrate</a></span></div></form> — .cm-ac-lado (panel de marca) solo se ve en algunos diseños."
wizard:
  diseno: oscuro
  nombre: "Oscuro"
  descripcion: "Tarjeta oscura"
  clases: "cm-wizard cm-wizard-oscuro"
  estructura: "<form class=\"cm-wizard cm-wizard-oscuro\" style=\"--i: 0; --n: 3\"><ol class=\"cm-wz-pasos\"><li data-estado=\"actual\" aria-current=\"step\"><span class=\"cm-wz-num\">1</span><span class=\"cm-wz-nombre\">Tus datos</span></li>…</ol><span class=\"cm-wz-barra\"><span></span></span><span class=\"cm-wz-cuenta\">Paso 1 de 3</span><div class=\"cm-wz-cuerpo\"><strong class=\"cm-wz-titulo\">Tus datos</strong><label class=\"cm-wz-campo\"><span>Nombre</span><input></label>…</div><div class=\"cm-wz-acciones\"><button class=\"cm-wz-atras\">Atrás</button><button type=\"submit\" class=\"cm-wz-siguiente\">Siguiente</button></div></form> — --i es el paso actual; la barra, los pasos y la cuenta se muestran o no según el diseño."
reserva:
  diseno: oscuro
  nombre: "Oscuro"
  descripcion: "Tarjeta oscura"
  clases: "cm-reserva cm-reserva-oscuro"
  estructura: "<div class=\"cm-reserva cm-reserva-oscuro\"><strong class=\"cm-rs-titulo\">Elegí un turno</strong><div class=\"cm-rs-dias\" role=\"group\"><button aria-pressed=\"true\"><span class=\"cm-rs-dsem\">Mar</span><span class=\"cm-rs-dnum\">11</span></button>…</div><div class=\"cm-rs-horas\" role=\"group\"><button aria-pressed=\"true\">10:30</button><button disabled>12:00</button>…</div><div class=\"cm-rs-resumen\"><span>Mar 11 · 10:30 hs</span><small>45 minutos · Servicio</small></div><button class=\"cm-rs-confirmar\">Confirmar turno</button></div> — los horarios ocupados van con disabled."
```

```css
/* Componentes. Requieren los tokens de la sección 16. */
/* Botón secundario */
.cm-boton_sec { position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: var(--boton-alto); padding: 0 var(--boton-padding);
  border-radius: var(--radio-boton); border: none; background: transparent; color: var(--color-texto); cursor: pointer; white-space: nowrap;
  font-family: var(--fuente-texto); font-size: var(--boton-texto); font-weight: 600; text-transform: var(--boton-mayusculas); letter-spacing: var(--boton-espaciado);
  transition: background-color var(--duracion-media) ease, color var(--duracion-media) ease, border-color var(--duracion-media) ease, transform var(--duracion-rapida) ease, box-shadow var(--duracion-media) ease; }
.cm-boton_sec .cm-ico { display: none; }
.cm-boton_sec:focus-visible { outline: 3px solid var(--color-texto); outline-offset: 3px; }
.cm-boton_sec.toque { animation: cm-sec-toque 300ms var(--curva-entrada); }
@keyframes cm-sec-toque { 40% { transform: scale(.94); } }
@media (prefers-reduced-motion: reduce) { .cm-boton_sec { transition: none; animation: none !important; } }
.cm-boton_sec.cm-boton_sec-oscuro { background: var(--color-texto); color: var(--color-fondo); } .cm-boton_sec.cm-boton_sec-oscuro:hover { filter: brightness(1.15); }

/* Botones de icono */
.cm-boton_icono { position: relative; display: inline-grid; place-items: center; width: 44px; height: 44px; border: none; border-radius: 50%; background: transparent; color: var(--color-texto); cursor: pointer;
  transition: background-color var(--duracion-media) ease, color var(--duracion-media) ease, transform var(--duracion-media) var(--curva-entrada), box-shadow var(--duracion-media) ease; }
.cm-boton_icono:focus-visible { outline: 3px solid var(--color-acento); outline-offset: 2px; }
.cm-boton_icono[data-activo] { color: var(--color-acento-texto); }
.cm-boton_icono.toque { animation: cm-ico-toque 340ms cubic-bezier(.3,1.6,.5,1); }
@keyframes cm-ico-toque { 40% { transform: scale(.85); } }
@media (prefers-reduced-motion: reduce) { .cm-boton_icono { transition: none; animation: none !important; } }
.cm-boton_icono.cm-boton_icono-oscuro { background: var(--color-texto); color: var(--color-fondo); } .cm-boton_icono.cm-boton_icono-oscuro[data-activo] { background: var(--color-acento); color: var(--color-sobre-acento); }

/* Campos de texto */
.cm-campo { position: relative; display: flex; flex-direction: column; gap: 6px; width: 100%; max-width: 320px; font-family: var(--fuente-texto); color: var(--color-texto); }
.cm-campo .cm-etq { font-size: 14px; font-weight: 600; }
.cm-campo .cm-caja { position: relative; display: flex; align-items: center; gap: 8px; min-height: 48px; padding: 0 14px; border-radius: var(--radio-pequeno);
  transition: border-color var(--duracion-rapida) ease, box-shadow var(--duracion-media) var(--curva-entrada), background-color var(--duracion-media) ease, transform var(--duracion-rapida) ease; }
.cm-campo input { flex: 1; min-width: 0; border: none; outline: none; background: transparent; font: inherit; font-size: 16px; color: inherit; padding: 12px 0; caret-color: var(--color-acento); }
.cm-campo input::placeholder { color: var(--color-texto-suave); opacity: 0.85; }
.cm-campo .cm-icono { display: none; color: var(--color-texto-suave); transition: color var(--duracion-rapida) ease; }
.cm-campo .cm-linea { display: none; }
.cm-campo .cm-ayuda { font-size: 12.5px; color: var(--color-texto-suave); }
@keyframes cm-tecla { 40% { transform: scale(1.012); } }
@keyframes cm-tecla-brillo { 40% { box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-acento) 30%, transparent), 0 0 26px color-mix(in srgb, var(--color-acento) 45%, transparent); } }
@media (prefers-reduced-motion: reduce) { .cm-campo .cm-caja, .cm-campo .cm-linea, .cm-campo .cm-etq { transition: none !important; animation: none !important; } }
.cm-campo.cm-campo-contorno .cm-caja { border: 1.5px solid var(--color-borde); background: var(--color-fondo); }
.cm-campo.cm-campo-contorno .cm-caja:focus-within { border-color: var(--color-acento); box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-acento) 28%, transparent); }

/* Selectores (slide) */
.cm-selector { position: relative; display: inline-grid; grid-template-columns: repeat(var(--n), 1fr); padding: 4px; border-radius: 999px; background: color-mix(in srgb, var(--color-texto) 9%, var(--color-fondo)); font-family: var(--fuente-texto); }
.cm-selector .cm-ind { position: absolute; top: 4px; bottom: 4px; left: 4px; width: calc((100% - 8px) / var(--n)); border-radius: 999px; background: var(--color-fondo); box-shadow: 0 1px 4px rgba(0,0,0,.14); transform: translateX(calc(var(--i) * 100%)); transition: transform var(--duracion-lenta) var(--curva-entrada); }
.cm-selector button { position: relative; z-index: 1; min-height: 36px; padding: 0 16px; border: none; border-radius: 999px; background: transparent; color: var(--color-texto-suave); font: inherit; font-size: 14px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: color var(--duracion-media) ease; }
.cm-selector button[aria-checked='true'] { color: var(--color-texto); }
.cm-selector button:focus-visible { outline: 2px solid var(--color-acento); outline-offset: 1px; }
.cm-selector.cm-grande button { min-height: 48px; padding: 0 22px; font-size: 16px; }
@media (prefers-reduced-motion: reduce) { .cm-selector .cm-ind, .cm-selector button { transition: none !important; } }
.cm-selector.cm-selector-oscuro { background: #111318; } .cm-selector.cm-selector-oscuro .cm-ind { background: #FFFFFF; } .cm-selector.cm-selector-oscuro button { color: #9CA3AF; } .cm-selector.cm-selector-oscuro button[aria-checked='true'] { color: #111318; }

/* Interruptores */
.cm-interruptor { position: relative; display: inline-flex; align-items: center; gap: 12px; min-height: 44px; cursor: pointer; font-family: var(--fuente-texto); color: var(--color-texto); font-size: 15px; }
.cm-interruptor input { position: absolute; opacity: 0; width: 1px; height: 1px; }
.cm-interruptor .cm-pista { position: relative; flex-shrink: 0; width: 52px; height: 30px; border-radius: 999px; background: color-mix(in srgb, var(--color-texto) 24%, var(--color-fondo)); transition: background-color var(--duracion-media) ease, box-shadow var(--duracion-media) ease; }
.cm-interruptor .cm-perilla { position: absolute; top: 3px; left: 3px; width: 24px; height: 24px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 1px 3px rgba(0,0,0,.3);
  transition: transform var(--duracion-media) var(--curva-entrada), width var(--duracion-rapida) ease, background-color var(--duracion-media) ease; }
.cm-interruptor input:checked + .cm-pista { background: var(--color-acento); }
.cm-interruptor input:checked + .cm-pista .cm-perilla { transform: translateX(22px); }
.cm-interruptor input:focus-visible + .cm-pista { outline: 3px solid var(--color-acento); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { .cm-interruptor .cm-pista, .cm-interruptor .cm-perilla { transition: none !important; } }


/* Casillas */
.cm-casilla { position: relative; display: flex; align-items: center; gap: 12px; min-height: 40px; cursor: pointer; font-family: var(--fuente-texto); color: var(--color-texto); font-size: 15px; }
.cm-casilla input { position: absolute; opacity: 0; width: 1px; height: 1px; }
.cm-casilla .cm-marca { flex-shrink: 0; display: grid; place-items: center; width: 22px; height: 22px; border: 2px solid var(--color-borde); border-radius: 6px; background: var(--color-fondo);
  transition: background-color var(--duracion-media) ease, border-color var(--duracion-media) ease, transform var(--duracion-media) var(--curva-entrada); }
.cm-casilla svg { width: 16px; height: 16px; fill: none; stroke: var(--color-sobre-acento); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 24; stroke-dashoffset: 24; transition: stroke-dashoffset var(--duracion-lenta) var(--curva-entrada); }
.cm-casilla input:checked + .cm-marca { background: var(--color-acento); border-color: var(--color-acento); }
.cm-casilla input:checked + .cm-marca svg { stroke-dashoffset: 0; }
.cm-casilla input:focus-visible + .cm-marca { outline: 3px solid var(--color-acento); outline-offset: 2px; }
.cm-casilla .cm-txt { transition: color var(--duracion-media) ease; }
@media (prefers-reduced-motion: reduce) { .cm-casilla .cm-marca, .cm-casilla svg, .cm-casilla .cm-txt { transition: none !important; animation: none !important; } }
.cm-casilla.cm-casilla-oscura input:checked + .cm-marca { background: var(--color-texto); border-color: var(--color-texto); } .cm-casilla.cm-casilla-oscura svg { stroke: var(--color-fondo); }

/* Deslizadores */
.cm-deslizador { position: relative; display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 320px; font-family: var(--fuente-texto); color: var(--color-texto); }
.cm-deslizador .cm-etq { display: flex; justify-content: space-between; font-size: 14px; font-weight: 600; }
.cm-deslizador output { font-variant-numeric: tabular-nums; color: var(--color-texto-suave); }
.cm-deslizador input { -webkit-appearance: none; appearance: none; width: 100%; height: 30px; margin: 0; background: transparent; cursor: pointer; }
.cm-deslizador input:focus { outline: none; }
.cm-deslizador input::-webkit-slider-runnable-track { height: 6px; border-radius: 999px; background: linear-gradient(to right, var(--color-acento) var(--valor), var(--color-borde) var(--valor)); }
.cm-deslizador input::-moz-range-track { height: 6px; border-radius: 999px; background: linear-gradient(to right, var(--color-acento) var(--valor), var(--color-borde) var(--valor)); }
.cm-deslizador input::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 22px; height: 22px; margin-top: -8px; border-radius: 50%; background: #FFFFFF; border: 2px solid var(--color-acento); box-shadow: 0 1px 4px rgba(0,0,0,.25); transition: transform var(--duracion-rapida) var(--curva-entrada); }
.cm-deslizador input::-moz-range-thumb { -webkit-appearance: none; appearance: none; width: 22px; height: 22px; margin-top: -8px; border-radius: 50%; background: #FFFFFF; border: 2px solid var(--color-acento); box-shadow: 0 1px 4px rgba(0,0,0,.25); transition: transform var(--duracion-rapida) var(--curva-entrada); }
.cm-deslizador input::-moz-range-thumb { margin-top: 0; }
.cm-deslizador input:active::-webkit-slider-thumb { transform: scale(1.2); }
.cm-deslizador input:active::-moz-range-thumb { transform: scale(1.2); }
.cm-deslizador input:focus-visible::-webkit-slider-thumb { outline: 3px solid var(--color-acento); outline-offset: 2px; }
.cm-deslizador input:focus-visible::-moz-range-thumb { outline: 3px solid var(--color-acento); outline-offset: 2px; }
.cm-deslizador.cm-deslizador-oscuro input::-webkit-slider-runnable-track { height: 6px; background: linear-gradient(to right, var(--color-texto) var(--valor), var(--color-borde) var(--valor)); }
.cm-deslizador.cm-deslizador-oscuro input::-moz-range-track { height: 6px; background: linear-gradient(to right, var(--color-texto) var(--valor), var(--color-borde) var(--valor)); }
.cm-deslizador.cm-deslizador-oscuro input::-webkit-slider-thumb { border-color: var(--color-texto); }
.cm-deslizador.cm-deslizador-oscuro input::-moz-range-thumb { border-color: var(--color-texto); }

/* Barras inferiores (celular) */
.cm-nav_movil { position: relative; display: grid; grid-template-columns: repeat(var(--n), minmax(0, 1fr)); align-items: center; padding: 6px 4px calc(6px + env(safe-area-inset-bottom, 0px)); background: var(--color-superficie); border-top: 1px solid var(--color-borde); font-family: var(--fuente-texto); }
.cm-nav_movil .cm-ind { display: none; }
.cm-nav_movil .cm-item { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; min-height: 52px; padding: 4px 0; border: none; background: none; cursor: pointer; color: var(--color-texto-suave); font: inherit; font-size: 11px; font-weight: 600;
  transition: color var(--duracion-rapida) ease, transform var(--duracion-media) var(--curva-entrada); }
.cm-nav_movil .cm-ico { display: inline-flex; transition: transform var(--duracion-media) var(--curva-entrada), color var(--duracion-rapida) ease, background-color var(--duracion-media) ease; }
.cm-nav_movil .cm-item[aria-current] { color: var(--color-texto); }
.cm-nav_movil .cm-item[aria-current] .cm-ico { color: var(--color-acento-texto); }
.cm-nav_movil .cm-item:focus-visible { outline: 2px solid var(--color-acento); outline-offset: -2px; border-radius: 10px; }
@media (prefers-reduced-motion: reduce) { .cm-nav_movil *, .cm-nav_movil { transition: none !important; animation: none !important; } }
.cm-nav_movil.cm-nav_movil-oscura { background: #111318; border-top-color: #111318; }
.cm-nav_movil.cm-nav_movil-oscura .cm-item { color: #8A8F99; }
.cm-nav_movil.cm-nav_movil-oscura .cm-item[aria-current] { color: #FFFFFF; }
.cm-nav_movil.cm-nav_movil-oscura .cm-item[aria-current] .cm-ico { color: #FFFFFF; filter: drop-shadow(0 0 6px var(--color-acento)); }

/* Navegación web */
.cm-nav_web { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 10px 16px; background: var(--color-superficie); border-bottom: 1px solid var(--color-borde); font-family: var(--fuente-texto); color: var(--color-texto); }
.cm-nav_web .cm-marca { font-family: var(--fuente-titulos); font-weight: var(--titulos-peso); font-size: 16px; }
.cm-nav_web .cm-items { position: relative; display: grid; grid-template-columns: repeat(var(--n), minmax(0, 1fr)); gap: 0; }
.cm-nav_web .cm-ind { display: none; }
.cm-nav_web .cm-item { position: relative; z-index: 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-height: 44px; padding: 0 12px; border: none; background: none; cursor: pointer; color: var(--color-texto-suave); font: inherit; font-size: 14px; font-weight: 600; white-space: nowrap; transition: color var(--duracion-rapida) ease; }
.cm-nav_web .cm-ico { display: none; }
.cm-nav_web .cm-item[aria-current] { color: var(--color-texto); }
.cm-nav_web .cm-item:focus-visible { outline: 2px solid var(--color-acento); outline-offset: -2px; border-radius: 8px; }
@media (prefers-reduced-motion: reduce) { .cm-nav_web *, .cm-nav_web { transition: none !important; } }
.cm-nav_web.cm-nav_web-oscura { background: #111318; border-bottom-color: #111318; color: #FFFFFF; }
.cm-nav_web.cm-nav_web-oscura .cm-item { color: #9CA3AF; }
.cm-nav_web.cm-nav_web-oscura .cm-item[aria-current] { color: #FFFFFF; }
.cm-nav_web.cm-nav_web-oscura .cm-ind { display: block; position: absolute; bottom: -10px; left: 0; width: calc(100% / var(--n)); height: 2px; background: var(--color-acento); transform: translateX(calc(var(--i) * 100%)); transition: transform var(--duracion-lenta) var(--curva-entrada); }

/* Etiquetas y chips */
.cm-etiqueta { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px; font-family: var(--fuente-texto); font-size: 12px; font-weight: 700; line-height: 1.4; color: var(--color-texto); background: var(--color-superficie); white-space: nowrap; }
.cm-etiqueta.cm-etiqueta-suave { background: color-mix(in srgb, var(--color-acento) 16%, var(--color-fondo)); }

/* Avisos */
.cm-aviso { display: flex; align-items: flex-start; gap: 12px; width: 100%; max-width: 340px; padding: 14px 14px 14px 16px; border-radius: var(--radio-medio); background: var(--color-superficie-alta); color: var(--color-texto); font-family: var(--fuente-texto); box-shadow: 0 8px 24px rgba(0,0,0,.14); }
.cm-aviso .cm-aviso-ico { flex-shrink: 0; display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; background: var(--color-exito); color: var(--color-fondo); }
.cm-aviso .cm-aviso-texto { flex: 1; display: flex; flex-direction: column; gap: 2px; font-size: 14px; }
.cm-aviso .cm-aviso-texto span { color: var(--color-texto-suave); font-size: 13px; }
.cm-aviso .cm-aviso-x { flex-shrink: 0; width: 32px; height: 32px; margin: -6px -6px 0 0; border: none; border-radius: 8px; background: transparent; color: var(--color-texto-suave); font-size: 20px; line-height: 1; cursor: pointer; }
.cm-aviso .cm-aviso-x:hover { background: var(--color-superficie); }
.cm-aviso.cm-entra { animation: cm-aviso-entra 420ms var(--curva-entrada) both; }
@keyframes cm-aviso-entra { from { opacity: 0; transform: translateY(12px) scale(.97); } }
@media (prefers-reduced-motion: reduce) { .cm-aviso *, .cm-aviso { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition: none !important; } }
.cm-aviso.cm-aviso-oscura { background: #15171C; color: #FFFFFF; } .cm-aviso.cm-aviso-oscura .cm-aviso-texto span { color: #B8BDC7; } .cm-aviso.cm-aviso-oscura .cm-aviso-x { color: #B8BDC7; } .cm-aviso.cm-aviso-oscura .cm-aviso-x:hover { background: rgba(255,255,255,.1); }

/* Cargando */
.cm-cargando { position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 6px; width: 56px; height: 56px; color: var(--color-acento-texto); }
.cm-cargando span { display: none; }
@media (prefers-reduced-motion: reduce) { .cm-cargando *, .cm-cargando { animation-duration: 3s !important; } }
.cm-cargando.cm-cargando-anillo { width: 40px; height: 40px; border-radius: 50%; border: 4px solid color-mix(in srgb, currentColor 22%, transparent); border-top-color: currentColor; animation: cm-girar 800ms linear infinite; } @keyframes cm-girar { to { transform: rotate(360deg); } }

/* Barras de progreso */
.cm-progreso { display: flex; flex-direction: column; gap: 8px; width: 100%; max-width: 320px; font-family: var(--fuente-texto); color: var(--color-texto); }
.cm-progreso .cm-etq { display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; }
.cm-progreso .cm-etq span:last-child { color: var(--color-texto-suave); font-variant-numeric: tabular-nums; }
.cm-progreso .cm-pista { position: relative; height: 8px; border-radius: 999px; background: var(--color-superficie); overflow: hidden; }
.cm-progreso .cm-relleno { position: absolute; inset: 0 auto 0 0; width: var(--p); border-radius: inherit; background: var(--color-acento); animation: cm-llenar 1100ms var(--curva-entrada) both; }
.cm-progreso .cm-relleno.cm-anima { animation: cm-llenar 1100ms var(--curva-entrada) both; }
@keyframes cm-llenar { from { width: 0; } }
@media (prefers-reduced-motion: reduce) { .cm-progreso *, .cm-progreso { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition: none !important; } }


/* Acordeones */
.cm-acordeon { display: flex; flex-direction: column; width: 100%; max-width: 360px; font-family: var(--fuente-texto); color: var(--color-texto); }
.cm-acordeon summary { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 48px; padding: 10px 4px; font-weight: 600; font-size: 15px; cursor: pointer; list-style: none; }
.cm-acordeon summary::-webkit-details-marker { display: none; }
.cm-acordeon summary::after { content: ''; flex-shrink: 0; width: 9px; height: 9px; border-right: 2px solid currentColor; border-bottom: 2px solid currentColor; transform: rotate(45deg) translateY(-3px); transition: transform var(--duracion-media) var(--curva-entrada); }
.cm-acordeon details[open] summary::after { transform: rotate(-135deg) translateY(-3px); }
.cm-acordeon summary:focus-visible { outline: 2px solid var(--color-acento); outline-offset: 2px; border-radius: 6px; }
.cm-acordeon .cm-resp { padding: 0 4px 14px; font-size: 14px; color: var(--color-texto-suave); }
.cm-acordeon details[open] .cm-resp { animation: cm-abrir var(--duracion-lenta) var(--curva-entrada); }
@keyframes cm-abrir { from { opacity: 0; transform: translateY(-6px); } }
.cm-acordeon details + details { border-top: 1px solid var(--color-borde); }
@media (prefers-reduced-motion: reduce) { .cm-acordeon *, .cm-acordeon { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition: none !important; } }
.cm-acordeon.cm-acordeon-oscuro { background: #15171C; border-radius: var(--radio-medio); padding: 4px 14px; color: #F1F2F4; } .cm-acordeon.cm-acordeon-oscuro .cm-resp { color: #B8BCC6; } .cm-acordeon.cm-acordeon-oscuro details + details { border-top-color: #2A2D35; }

/* Avatares */
.cm-avatar { display: flex; align-items: center; gap: 8px; font-family: var(--fuente-texto); }
.cm-avatar .cm-av { position: relative; display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; background: var(--color-acento); color: var(--color-sobre-acento); font-size: 15px; font-weight: 700; }
.cm-avatar .cm-av:nth-child(2) { background: color-mix(in srgb, var(--color-texto) 88%, var(--color-acento)); color: var(--color-fondo); }
.cm-avatar .cm-av:nth-child(3) { background: var(--color-superficie); color: var(--color-texto); }
.cm-avatar .cm-mas { background: var(--color-texto) !important; color: var(--color-fondo) !important; font-size: 13px; }


/* Tooltips */
.cm-tooltip { position: relative; display: inline-flex; font-family: var(--fuente-texto); padding-top: 44px; }
.cm-tooltip button { min-height: 40px; padding: 0 14px; border: 1.5px solid var(--color-borde); border-radius: 10px; background: var(--color-fondo); color: var(--color-texto); font: inherit; font-size: 14px; font-weight: 600; cursor: pointer; }
.cm-tooltip button:focus-visible { outline: 2px solid var(--color-acento); outline-offset: 2px; }
.cm-tooltip .cm-tip { position: absolute; left: 50%; top: 0; transform: translate(-50%, 4px); padding: 6px 10px; border-radius: 8px; background: var(--color-texto); color: var(--color-fondo); font-size: 12.5px; font-weight: 600; white-space: nowrap; pointer-events: none; opacity: 0;
  transition: opacity var(--duracion-media) ease, transform var(--duracion-media) var(--curva-entrada); }
.cm-tooltip:hover .cm-tip, .cm-tooltip:focus-within .cm-tip { opacity: 1; transform: translate(-50%, 0); }


/* Ventanas */
.cm-modal { position: relative; width: 100%; height: 230px; border-radius: 12px; overflow: hidden; background: var(--color-superficie); font-family: var(--fuente-texto); color: var(--color-texto); }
.cm-modal .cm-fondo-modal { position: absolute; inset: 0; background: rgba(10, 10, 14, 0.45); }
.cm-modal .cm-ventana { position: absolute; left: 50%; top: 50%; width: min(260px, 86%); transform: translate(-50%, -50%); display: flex; flex-direction: column; gap: 6px; padding: 18px; border-radius: var(--radio-grande); background: var(--color-superficie-alta); box-shadow: 0 18px 40px rgba(0,0,0,.28); }
.cm-modal .cm-ventana-ico { display: none; }
.cm-modal .cm-ventana-txt { font-size: 13px; color: var(--color-texto-suave); }
.cm-modal .cm-ventana-acciones { display: flex; justify-content: flex-end; gap: 8px; margin-top: 10px; }
.cm-modal .cm-ventana-acciones button { min-height: 38px; padding: 0 14px; border-radius: var(--radio-boton); border: 1.5px solid var(--color-borde); background: transparent; color: var(--color-texto); font: inherit; font-size: 13px; font-weight: 700; cursor: pointer; }
.cm-modal .cm-ventana-acciones .cm-primario { background: var(--boton-color); color: var(--boton-sobre); border-color: transparent; }
.cm-modal .cm-ventana.cm-entra { animation: cm-modal-entra 380ms var(--curva-entrada) both; }
@keyframes cm-modal-entra { from { opacity: 0; transform: translate(-50%, -46%) scale(.94); } }
@media (prefers-reduced-motion: reduce) { .cm-modal *, .cm-modal { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition: none !important; } }
.cm-modal.cm-modal-oscura .cm-ventana { background: #17191F; color: #F1F2F4; } .cm-modal.cm-modal-oscura .cm-ventana-txt { color: #B8BCC6; } .cm-modal.cm-modal-oscura .cm-ventana-acciones button { color: #F1F2F4; border-color: #3A3E48; } .cm-modal.cm-modal-oscura .cm-ventana-acciones .cm-primario { color: var(--boton-sobre); }

/* Tarjetas de métricas */
.cm-metrica { display: flex; flex-direction: column; gap: 4px; width: 100%; max-width: 280px; padding: 18px; border-radius: var(--radio-medio); background: var(--color-superficie); color: var(--color-texto); font-family: var(--fuente-texto); }
.cm-metrica .cm-m-ico, .cm-metrica .cm-m-spark, .cm-metrica .cm-m-meta, .cm-metrica .cm-m-meta-txt { display: none; }
.cm-metrica .cm-m-etq { font-size: 13px; color: var(--color-texto-suave); font-weight: 600; }
.cm-metrica .cm-m-valor { font-family: var(--fuente-titulos); font-weight: var(--titulos-peso); font-size: 30px; line-height: 1.1; letter-spacing: var(--titulos-espaciado); font-variant-numeric: tabular-nums; }
.cm-metrica .cm-m-cambio { font-size: 12.5px; font-weight: 700; color: color-mix(in srgb, var(--color-exito) 78%, var(--color-texto)); }
.cm-metrica .cm-m-spark { width: 100%; height: 36px; margin-top: 6px; color: var(--color-acento-texto); }
.cm-metrica .cm-m-meta { position: relative; height: 6px; margin-top: 10px; border-radius: 3px; background: color-mix(in srgb, var(--color-texto) 12%, transparent); overflow: hidden; }
.cm-metrica .cm-m-meta-relleno { position: absolute; inset: 0 auto 0 0; width: var(--p); border-radius: 3px; background: var(--color-acento); }
.cm-metrica .cm-m-meta-txt { font-size: 12px; color: var(--color-texto-suave); }
.cm-metrica.cm-metrica-oscura { background: #15171C; color: #FFFFFF; } .cm-metrica.cm-metrica-oscura .cm-m-etq { color: #B8BDC7; } .cm-metrica.cm-metrica-oscura .cm-m-cambio { color: #4ADE80; } .cm-metrica.cm-metrica-oscura .cm-m-spark { display: block; color: #FFFFFF; }

/* Gráficos */
.cm-grafico { display: flex; flex-direction: column; gap: 8px; width: 100%; max-width: 340px; margin: 0; font-family: var(--fuente-texto); color: var(--color-texto); }
.cm-grafico figcaption { font-size: 13px; font-weight: 700; }
.cm-grafico svg { width: 100%; height: auto; overflow: visible; }
.cm-grafico .cm-g-grilla line { stroke: var(--color-borde); stroke-width: 1; }
.cm-grafico text { font-family: var(--fuente-texto); font-size: 10px; fill: var(--color-texto-suave); }
.cm-grafico .cm-g-dato { font-size: 11px; font-weight: 700; fill: var(--color-texto); }
.cm-grafico .cm-g-etq { font-size: 11px; fill: var(--color-texto); }
.cm-grafico .cm-g-centro { font-family: var(--fuente-titulos); font-size: 17px; font-weight: 700; fill: var(--color-texto); }
.cm-grafico .cm-g-marca { fill: var(--color-acento); transition: opacity var(--duracion-rapida) ease; cursor: default; }
.cm-grafico .cm-g-tenue { fill: color-mix(in srgb, var(--color-texto) 22%, var(--color-fondo)); }
.cm-grafico svg:hover .cm-g-marca { opacity: 0.45; }
.cm-grafico svg .cm-g-marca:hover { opacity: 1; }
.cm-grafico .cm-g-barra, .cm-grafico .cm-g-barra-h { stroke: var(--color-fondo); stroke-width: 2px; paint-order: stroke; transform-box: fill-box; }
.cm-grafico .cm-g-barra { transform-origin: bottom; animation: cm-g-crece 700ms var(--curva-entrada) both; }
.cm-grafico .cm-g-barra-h { transform-origin: left; animation: cm-g-crece-h 700ms var(--curva-entrada) both; }
@keyframes cm-g-crece { from { transform: scaleY(0); } }
@keyframes cm-g-crece-h { from { transform: scaleX(0); } }
.cm-grafico .cm-g-linea { fill: none; stroke: var(--color-acento); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; animation: cm-g-dibuja 900ms var(--curva-entrada) both; }
@keyframes cm-g-dibuja { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
.cm-grafico .cm-g-area { fill: color-mix(in srgb, var(--color-acento) 18%, transparent); }
.cm-grafico .cm-g-punto { fill: var(--color-acento); stroke: var(--color-fondo); stroke-width: 2; }
.cm-grafico .cm-g-objetivo { fill: transparent; }
.cm-grafico .cm-g-objetivo:hover { fill: color-mix(in srgb, var(--color-acento) 18%, transparent); }
.cm-grafico .cm-g-tallo { stroke: var(--color-acento); stroke-width: 2; stroke-linecap: round; }
.cm-grafico .cm-g-seg { fill: none; stroke-width: 18; }
.cm-grafico .cm-g-pista { fill: none; stroke: var(--color-superficie); stroke-width: 18; }
.cm-grafico .cm-g-s1 { stroke: var(--color-acento); fill: var(--color-acento); }
.cm-grafico .cm-g-s2 { stroke: color-mix(in srgb, var(--color-acento) 55%, var(--color-fondo)); fill: color-mix(in srgb, var(--color-acento) 55%, var(--color-fondo)); }
.cm-grafico .cm-g-s3 { stroke: color-mix(in srgb, var(--color-acento) 25%, var(--color-fondo)); fill: color-mix(in srgb, var(--color-acento) 25%, var(--color-fondo)); }
.cm-grafico .cm-g-seg.cm-g-marca { fill: none; }
.cm-grafico .cm-g-celda { fill: color-mix(in srgb, var(--color-acento) calc(12% + var(--v) * 88%), var(--color-fondo)); }
@media (prefers-reduced-motion: reduce) { .cm-grafico *, .cm-grafico { animation: none !important; transition: none !important; } }


/* Tablas */
.cm-tabla { width: 100%; border-collapse: separate; border-spacing: 0; font-family: var(--fuente-texto); font-size: 13.5px; color: var(--color-texto); }
.cm-tabla th { text-align: left; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--color-texto-suave); padding: 8px 10px; }
.cm-tabla td { padding: 11px 10px; }
.cm-tabla .cm-num { text-align: right; font-variant-numeric: tabular-nums; }
.cm-tabla tbody tr { transition: background-color var(--duracion-rapida) ease; }
.cm-tabla .cm-t-estado { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; }
.cm-tabla .cm-t-estado::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
.cm-tabla .cm-t-estado[data-estado='pagado'] { color: color-mix(in srgb, var(--color-exito) 78%, var(--color-texto)); }
.cm-tabla .cm-t-estado[data-estado='pendiente'] { color: color-mix(in srgb, var(--color-aviso) 78%, var(--color-texto)); }
.cm-tabla .cm-t-estado[data-estado='vencido'] { color: color-mix(in srgb, var(--color-error) 78%, var(--color-texto)); }
.cm-tabla.cm-tabla-lineas td { border-top: 1px solid var(--color-borde); } .cm-tabla.cm-tabla-lineas tbody tr:hover { background: var(--color-superficie); }

/* Menús desplegables */
.cm-desplegable { position: relative; display: inline-block; font-family: var(--fuente-texto); font-size: 14px; }
.cm-desplegable .cm-d-boton { display: inline-flex; align-items: center; gap: 6px; min-height: 44px; padding: 0 14px; border: 1px solid var(--color-borde); border-radius: var(--radio-medio); background: var(--color-fondo); color: var(--color-texto); font: inherit; font-weight: 600; cursor: pointer; }
.cm-desplegable .cm-d-etq { color: var(--color-texto-suave); font-weight: 500; }
.cm-desplegable .cm-chev { transition: transform var(--duracion-media) var(--curva-entrada); }
.cm-desplegable[data-abierto] .cm-chev { transform: rotate(180deg); }
.cm-desplegable .cm-d-boton:focus-visible, .cm-desplegable li:focus-visible { outline: 2px solid var(--color-acento); outline-offset: 2px; }
.cm-desplegable .cm-d-lista { position: absolute; z-index: 5; top: calc(100% + 6px); left: 0; min-width: 100%; margin: 0; padding: 6px; list-style: none; border-radius: var(--radio-medio); background: var(--color-superficie-alta, var(--color-fondo)); border: 1px solid var(--color-borde); box-shadow: 0 12px 32px rgba(0,0,0,.14); animation: cm-d-entra var(--duracion-media) var(--curva-entrada) both; transform-origin: top left; }
.cm-desplegable li { display: flex; align-items: center; min-height: 40px; padding: 0 12px; border-radius: calc(var(--radio-medio) * .6); color: var(--color-texto); white-space: nowrap; cursor: pointer; }
.cm-desplegable li:hover { background: var(--color-superficie); }
.cm-desplegable li[aria-selected='true'] { font-weight: 700; }
@keyframes cm-d-entra { from { opacity: 0; transform: translateY(-6px); } }
@media (prefers-reduced-motion: reduce) { .cm-desplegable, .cm-desplegable * { animation: none !important; transition: none !important; } }
.cm-desplegable.cm-desplegable-oscuro .cm-d-lista { background: #15171C; border-color: #2A2D35; } .cm-desplegable.cm-desplegable-oscuro li { color: #E8E9EC; } .cm-desplegable.cm-desplegable-oscuro li:hover { background: #23262E; } .cm-desplegable.cm-desplegable-oscuro li[aria-selected='true'] { color: #FFFFFF; }

/* Buscadores */
.cm-buscador { position: relative; width: 100%; max-width: 340px; font-family: var(--fuente-texto); font-size: 14px; }
.cm-buscador .cm-b-caja { display: flex; align-items: center; gap: 8px; min-height: 46px; padding: 0 12px; border: 1px solid var(--color-borde); border-radius: var(--radio-medio); background: var(--color-fondo); color: var(--color-texto-suave); cursor: text; transition: border-color var(--duracion-media) ease, box-shadow var(--duracion-media) ease; }
.cm-buscador .cm-b-caja:focus-within { border-color: var(--color-acento); box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-acento) 22%, transparent); }
.cm-buscador input { flex: 1; min-width: 0; height: 44px; border: none; outline: none; background: transparent; color: var(--color-texto); font: inherit; }
.cm-buscador input::-webkit-search-cancel-button { display: none; }
.cm-buscador .cm-b-atajo { padding: 2px 6px; border-radius: 6px; border: 1px solid var(--color-borde); font: 600 11px/1.4 var(--fuente-texto); color: var(--color-texto-suave); }
.cm-buscador .cm-b-sugerencias { position: absolute; z-index: 5; top: calc(100% + 6px); left: 0; right: 0; margin: 0; padding: 6px; list-style: none; border-radius: var(--radio-medio); background: var(--color-superficie-alta, var(--color-fondo)); border: 1px solid var(--color-borde); box-shadow: 0 12px 32px rgba(0,0,0,.14); animation: cm-d-entra var(--duracion-media) var(--curva-entrada) both; }
.cm-buscador .cm-b-titulo { padding: 6px 10px 4px; font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--color-texto-suave); }
.cm-buscador li[role='option'] { display: flex; align-items: center; gap: 10px; min-height: 40px; padding: 0 10px; border-radius: calc(var(--radio-medio) * .6); color: var(--color-texto); cursor: pointer; }
.cm-buscador li[role='option'] .cm-b-ico { color: var(--color-texto-suave); }
.cm-buscador li[role='option']:hover, .cm-buscador li[aria-selected='true'] { background: var(--color-superficie); }
@keyframes cm-d-entra { from { opacity: 0; transform: translateY(-6px); } }
@media (prefers-reduced-motion: reduce) { .cm-buscador, .cm-buscador * { animation: none !important; transition: none !important; } }


/* Paginación */
.cm-paginacion { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 4px; font-family: var(--fuente-texto); font-size: 14px; }
.cm-paginacion button { display: inline-grid; place-items: center; min-width: 40px; height: 40px; padding: 0 10px; border: 1px solid transparent; border-radius: var(--radio-pequeno); background: transparent; color: var(--color-texto); font: inherit; font-weight: 600; cursor: pointer; transition: background var(--duracion-rapida) ease, color var(--duracion-rapida) ease; }
.cm-paginacion button:hover:not(:disabled) { background: var(--color-superficie); }
.cm-paginacion button:disabled { opacity: .4; cursor: default; }
.cm-paginacion button:focus-visible { outline: 2px solid var(--color-acento); outline-offset: 2px; }
.cm-paginacion .cm-p-num[aria-current] { background: var(--color-texto); color: var(--color-fondo); }
.cm-paginacion .cm-p-flecha { font-size: 18px; }
.cm-paginacion .cm-p-flecha-txt, .cm-paginacion .cm-p-info { display: none; }
.cm-paginacion .cm-p-puntos { min-width: 24px; text-align: center; color: var(--color-texto-suave); }
@media (prefers-reduced-motion: reduce) { .cm-paginacion, .cm-paginacion * { animation: none !important; transition: none !important; } }


/* Migas de pan */
.cm-migas { font-family: var(--fuente-texto); font-size: 14px; }
.cm-migas ol { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; margin: 0; padding: 0; list-style: none; }
.cm-migas li { display: inline-flex; align-items: center; gap: 8px; color: var(--color-texto-suave); }
.cm-migas a { display: inline-flex; align-items: center; min-height: 32px; color: var(--color-texto-suave); text-decoration: none; border-radius: 4px; }
.cm-migas a:hover { color: var(--color-texto); text-decoration: underline; text-underline-offset: 3px; }
.cm-migas a:focus-visible { outline: 2px solid var(--color-acento); outline-offset: 2px; }
.cm-migas li[aria-current] { color: var(--color-texto); font-weight: 600; }
.cm-migas li + li::before { content: '/'; color: var(--color-borde); }


/* Pasos */
.cm-pasos { position: relative; display: grid; grid-template-columns: repeat(var(--n), 1fr); margin: 0; padding: 0; list-style: none; font-family: var(--fuente-texto); font-size: 13px; }
.cm-pasos li { position: relative; display: flex; justify-content: center; }
.cm-pasos li + li::before { content: ''; position: absolute; top: 18px; right: calc(50% + 22px); left: calc(-50% + 22px); height: 2px; background: var(--color-borde); transition: background var(--duracion-lenta) var(--curva-entrada); }
.cm-pasos li[data-estado='hecho'] + li::before, .cm-pasos li[data-estado='actual']::before { background: var(--color-acento); }
.cm-pasos button { display: flex; flex-direction: column; align-items: center; gap: 6px; min-height: 44px; padding: 0 4px; border: none; background: transparent; color: var(--color-texto-suave); font: inherit; cursor: pointer; }
.cm-pasos button:focus-visible { outline: 2px solid var(--color-acento); outline-offset: 2px; border-radius: 6px; }
.cm-pasos .cm-ps-num { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 999px; border: 2px solid var(--color-borde); background: var(--color-fondo); color: var(--color-texto-suave); font-weight: 700; transition: all var(--duracion-media) var(--curva-entrada); }
.cm-pasos li[data-estado='hecho'] .cm-ps-num { border-color: var(--color-acento); background: var(--color-acento); color: var(--color-sobre-acento); }
.cm-pasos li[data-estado='actual'] .cm-ps-num { border-color: var(--color-acento); color: var(--color-acento-texto); box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-acento) 20%, transparent); }
.cm-pasos li[data-estado='actual'] button, .cm-pasos li[data-estado='hecho'] button { color: var(--color-texto); }
.cm-pasos li[data-estado='actual'] .cm-ps-txt { font-weight: 700; }
@media (prefers-reduced-motion: reduce) { .cm-pasos, .cm-pasos * { animation: none !important; transition: none !important; } }


/* Pantallas vacías */
.cm-vacio { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 24px 16px; text-align: center; font-family: var(--fuente-texto); color: var(--color-texto); }
.cm-vacio .cm-v-ilus { display: grid; place-items: center; width: 72px; height: 72px; border-radius: 999px; background: var(--color-superficie); color: var(--color-texto-suave); }
.cm-vacio .cm-v-texto { display: flex; flex-direction: column; gap: 4px; }
.cm-vacio .cm-v-tit { font-family: var(--fuente-titulos); font-size: 17px; }
.cm-vacio .cm-v-txt { margin: 0; color: var(--color-texto-suave); font-size: 14px; max-width: 28ch; }
.cm-vacio .cm-v-boton { min-height: 44px; padding: 0 18px; border: none; border-radius: var(--radio-boton); background: var(--boton-color); color: var(--boton-sobre); font: inherit; font-weight: 700; cursor: pointer; }
.cm-vacio .cm-v-boton:focus-visible { outline: 2px solid var(--color-acento); outline-offset: 2px; }


/* Calendarios */
.cm-calendario { box-sizing: border-box; width: 100%; max-width: 300px; padding: 12px; border-radius: var(--radio-grande); background: var(--color-superficie-alta, var(--color-fondo)); border: 1px solid var(--color-borde); font-family: var(--fuente-texto); color: var(--color-texto); box-shadow: 0 8px 24px rgba(0,0,0,.08); }
.cm-calendario .cm-c-cabeza { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.cm-calendario .cm-c-titulo { font-size: 15px; text-transform: capitalize; }
.cm-calendario .cm-c-flecha { width: 36px; height: 36px; border: none; border-radius: 10px; background: transparent; color: var(--color-texto); font-size: 20px; cursor: pointer; }
.cm-calendario .cm-c-flecha:hover { background: var(--color-superficie); }
.cm-calendario .cm-c-grilla { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 2px; }
.cm-calendario .cm-c-sem { display: grid; place-items: center; height: 28px; font-size: 11px; font-weight: 700; color: var(--color-texto-suave); text-transform: uppercase; }
.cm-calendario .cm-c-dia { position: relative; display: grid; place-items: center; aspect-ratio: 1; min-width: 0; min-height: 30px; padding: 0; border: none; border-radius: 10px; background: transparent; color: var(--color-texto); font: inherit; font-size: 13.5px; font-variant-numeric: tabular-nums; cursor: pointer; transition: background var(--duracion-rapida) ease, color var(--duracion-rapida) ease; }
.cm-calendario .cm-c-dia:hover:not(:disabled) { background: var(--color-superficie); }
.cm-calendario .cm-c-dia[data-fuera] { color: var(--color-texto-suave); opacity: .45; cursor: default; }
.cm-calendario .cm-c-dia[data-hoy] { font-weight: 800; box-shadow: inset 0 0 0 1.5px var(--color-borde); }
.cm-calendario .cm-c-dia[aria-pressed='true'] { background: var(--color-acento); color: var(--color-sobre-acento); font-weight: 700; }
.cm-calendario .cm-c-dia:focus-visible, .cm-calendario .cm-c-flecha:focus-visible { outline: 2px solid var(--color-acento); outline-offset: 1px; }
@media (prefers-reduced-motion: reduce) { .cm-calendario, .cm-calendario * { animation: none !important; transition: none !important; } }
.cm-calendario.cm-calendario-oscuro { background: #15171C; border-color: #2A2D35; color: #F1F2F4; } .cm-calendario.cm-calendario-oscuro .cm-c-flecha, .cm-calendario.cm-calendario-oscuro .cm-c-dia { color: #F1F2F4; } .cm-calendario.cm-calendario-oscuro .cm-c-sem { color: #9CA3AF; } .cm-calendario.cm-calendario-oscuro .cm-c-dia:hover:not(:disabled), .cm-calendario.cm-calendario-oscuro .cm-c-flecha:hover { background: #23262E; } .cm-calendario.cm-calendario-oscuro .cm-c-dia[data-fuera] { color: #9CA3AF; } .cm-calendario.cm-calendario-oscuro .cm-c-dia[aria-pressed='true'] { color: var(--color-sobre-acento); }

/* Carruseles */
.cm-carrusel { position: relative; width: 100%; max-width: 380px; font-family: var(--fuente-texto); }
.cm-carrusel .cm-k-ventana { overflow: hidden; border-radius: var(--radio-grande); }
.cm-carrusel .cm-k-pista { display: flex; transform: translateX(calc(var(--i) * -100%)); transition: transform var(--duracion-lenta) var(--curva-entrada); }
.cm-carrusel .cm-k-slide { flex: 0 0 100%; display: flex; flex-direction: column; justify-content: flex-end; gap: 4px; height: 170px; padding: 18px; color: var(--color-sobre-acento); background: var(--color-acento); }
.cm-carrusel .cm-k-slide:nth-child(2) { background: color-mix(in srgb, var(--color-acento) 22%, var(--color-texto)); color: var(--color-fondo); }
.cm-carrusel .cm-k-slide:nth-child(3) { background: color-mix(in srgb, var(--color-acento) 18%, var(--color-fondo)); color: var(--color-texto); }
.cm-carrusel .cm-k-slide:nth-child(4) { background: var(--color-texto); color: var(--color-fondo); }
.cm-carrusel .cm-k-slide strong { font-family: var(--fuente-titulos); font-size: 22px; line-height: 1.1; }
.cm-carrusel .cm-k-slide span { font-size: 13.5px; }
.cm-carrusel .cm-k-flecha { position: absolute; top: 85px; transform: translateY(-50%); width: 40px; height: 40px; border: none; border-radius: 999px; background: color-mix(in srgb, var(--color-fondo) 88%, transparent); color: var(--color-texto); font-size: 22px; line-height: 1; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,.15); }
.cm-carrusel .cm-k-prev { left: 8px; } .cm-carrusel .cm-k-next { right: 8px; }
.cm-carrusel .cm-k-cuenta { display: none; }
.cm-carrusel .cm-k-puntos { display: flex; justify-content: center; gap: 2px; margin-top: 8px; }
.cm-carrusel .cm-k-puntos button { width: 24px; height: 24px; border: none; background: transparent; cursor: pointer; display: grid; place-items: center; }
.cm-carrusel .cm-k-puntos button::after { content: ''; width: 8px; height: 8px; border-radius: 999px; background: var(--color-borde); transition: width var(--duracion-media) var(--curva-entrada), background var(--duracion-media) ease; }
.cm-carrusel .cm-k-puntos button[aria-current]::after { background: var(--color-acento); }
.cm-carrusel button:focus-visible { outline: 2px solid var(--color-acento); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { .cm-carrusel, .cm-carrusel * { animation: none !important; transition: none !important; } }


/* Pies de página */
.cm-pie { position: relative; width: 100%; padding: 22px; border-top: 1px solid var(--color-borde); background: var(--color-fondo); color: var(--color-texto); font-family: var(--fuente-texto); font-size: 13px; overflow: hidden; }
.cm-pie .cm-f-arriba { display: flex; flex-wrap: wrap; gap: 20px 32px; }
.cm-pie .cm-f-marca { flex: 1 1 140px; display: flex; flex-direction: column; gap: 6px; }
.cm-pie .cm-f-marca strong { font-family: var(--fuente-titulos); font-size: 17px; }
.cm-pie .cm-f-marca p { margin: 0; color: var(--color-texto-suave); max-width: 24ch; }
.cm-pie .cm-f-cols { flex: 2 1 260px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.cm-pie .cm-f-col { display: flex; flex-direction: column; gap: 2px; }
.cm-pie .cm-f-col strong { font-size: 12px; margin-bottom: 4px; }
.cm-pie a { display: inline-flex; align-items: center; min-height: 28px; color: var(--color-texto-suave); text-decoration: none; }
.cm-pie a:hover { color: var(--color-texto); text-decoration: underline; text-underline-offset: 3px; }
.cm-pie a:focus-visible, .cm-pie button:focus-visible, .cm-pie input:focus-visible { outline: 2px solid var(--color-acento); outline-offset: 2px; }
.cm-pie .cm-f-news { display: none; flex: 1 1 100%; flex-direction: column; gap: 6px; }
.cm-pie .cm-f-news label { font-weight: 700; }
.cm-pie .cm-f-news-fila { display: flex; gap: 8px; }
.cm-pie .cm-f-news input { flex: 1; min-width: 0; height: 40px; padding: 0 12px; border: 1px solid var(--color-borde); border-radius: var(--radio-medio); background: var(--color-fondo); color: var(--color-texto); font: inherit; }
.cm-pie .cm-f-news button { height: 40px; padding: 0 14px; border: none; border-radius: var(--radio-boton); background: var(--boton-color); color: var(--boton-sobre); font: inherit; font-weight: 700; cursor: pointer; }
.cm-pie .cm-f-legal { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 8px; margin-top: 18px; padding-top: 12px; border-top: 1px solid var(--color-borde); color: var(--color-texto-suave); font-size: 12px; }
.cm-pie .cm-f-redes { display: flex; gap: 6px; }
.cm-pie .cm-f-redes a { justify-content: center; width: 32px; height: 32px; border-radius: 999px; background: var(--color-superficie); font-size: 11px; font-weight: 700; color: var(--color-texto); }
.cm-pie .cm-f-gigante { display: none; }
.cm-pie.cm-pie-oscuro { background: #121418; color: #F1F2F4; border-top: none; } .cm-pie.cm-pie-oscuro a, .cm-pie.cm-pie-oscuro .cm-f-marca p, .cm-pie.cm-pie-oscuro .cm-f-legal { color: #B8BCC6; } .cm-pie.cm-pie-oscuro a:hover { color: #FFFFFF; } .cm-pie.cm-pie-oscuro .cm-f-legal { border-top-color: #2A2D35; } .cm-pie.cm-pie-oscuro .cm-f-redes a { background: #23262E; color: #F1F2F4; }

/* Formularios completos */
.cm-formulario { display: flex; flex-direction: column; gap: 18px; width: 100%; max-width: 480px; font-family: var(--fuente-texto); font-size: 14px; color: var(--color-texto); text-align: left; }
.cm-formulario .cm-fo-cab { display: flex; flex-direction: column; gap: 2px; }
.cm-formulario .cm-fo-titulo { font-family: var(--fuente-titulos); font-weight: var(--titulos-peso); font-size: 20px; }
.cm-formulario .cm-fo-ayuda, .cm-formulario .cm-fo-nota { font-size: 12.5px; color: var(--color-texto-suave); }
.cm-formulario .cm-fo-seccion { display: flex; flex-direction: column; gap: 8px; }
.cm-formulario .cm-fo-sec-titulo { font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--color-texto-suave); }
.cm-formulario .cm-fo-grupo { display: flex; flex-direction: column; gap: 12px; }
.cm-formulario .cm-fo-fila { display: flex; flex-direction: column; gap: 6px; width: 100%; font: inherit; color: inherit; text-align: left; }
.cm-formulario .cm-fo-etq { font-weight: 600; font-size: 13px; }
.cm-formulario input, .cm-formulario select, .cm-formulario textarea { width: 100%; min-width: 0; min-height: 44px; padding: 0 12px; border: 1px solid var(--color-borde); border-radius: var(--radio-medio); background: var(--color-fondo); color: var(--color-texto); font: inherit; box-sizing: border-box; }
.cm-formulario textarea { padding: 10px 12px; min-height: 64px; resize: vertical; }
.cm-formulario input:focus, .cm-formulario select:focus, .cm-formulario textarea:focus { outline: none; border-color: var(--color-acento); box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-acento) 22%, transparent); }
.cm-formulario .cm-fo-segmento { position: relative; display: grid; grid-template-columns: repeat(var(--n), 1fr); padding: 3px; border-radius: var(--radio-medio); background: var(--color-superficie); }
.cm-formulario .cm-fo-seg-ind { position: absolute; top: 3px; bottom: 3px; left: 3px; width: calc((100% - 6px) / var(--n)); border-radius: calc(var(--radio-medio) * .75); background: var(--color-fondo); box-shadow: 0 1px 3px rgba(0,0,0,.15); transform: translateX(calc(var(--i) * 100%)); transition: transform var(--duracion-media) var(--curva-entrada); }
.cm-formulario .cm-fo-segmento button { position: relative; min-height: 44px; border: none; background: transparent; color: var(--color-texto-suave); font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; }
.cm-formulario .cm-fo-segmento button[aria-pressed='true'] { color: var(--color-texto); }
.cm-formulario .cm-fo-switch { flex-direction: row; justify-content: space-between; align-items: center; min-height: 44px; border: none; background: transparent; padding: 0; cursor: pointer; }
.cm-formulario .cm-fo-perilla { position: relative; flex: none; width: 46px; height: 28px; border-radius: 999px; background: var(--color-borde); transition: background var(--duracion-media) ease; }
.cm-formulario .cm-fo-perilla::after { content: ''; position: absolute; top: 3px; left: 3px; width: 22px; height: 22px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 1px 3px rgba(0,0,0,.25); transition: transform var(--duracion-media) var(--curva-entrada); }
.cm-formulario .cm-fo-switch[aria-checked='true'] .cm-fo-perilla { background: var(--color-acento); }
.cm-formulario .cm-fo-switch[aria-checked='true'] .cm-fo-perilla::after { transform: translateX(18px); }
.cm-formulario .cm-fo-accion { flex-direction: row; align-items: center; gap: 10px; min-height: 44px; padding: 0 12px; border: 1.5px dashed var(--color-borde); border-radius: var(--radio-medio); background: transparent; color: var(--color-acento-texto); font-weight: 700; cursor: pointer; }
.cm-formulario .cm-fo-acciones { display: flex; justify-content: flex-end; gap: 10px; }
.cm-formulario .cm-fo-acciones button { min-height: 46px; padding: 0 18px; border-radius: var(--radio-boton); font: inherit; font-weight: 700; cursor: pointer; }
.cm-formulario .cm-fo-cancelar { border: 1.5px solid var(--color-borde); background: transparent; color: var(--color-texto); }
.cm-formulario .cm-fo-guardar { border: none; background: var(--boton-color); color: var(--boton-sobre); }
.cm-formulario .cm-fo-fila { box-sizing: border-box; }
.cm-formulario input[hidden] { display: none; }
.cm-formulario .cm-fo-fila:has(.cm-fo-error) { flex-wrap: wrap; }
.cm-formulario .cm-fo-error { flex-basis: 100%; display: block; font-size: 12px; line-height: 1.5; border-inline-start: 3px solid var(--color-error); padding-inline-start: 8px; color: inherit; }
.cm-formulario .cm-fo-resultado { margin: 0; font-size: 12px; line-height: 1.5; color: inherit; }
.cm-formulario .cm-fo-guardar:disabled { opacity: .65; cursor: wait; }
.cm-formulario button:focus-visible { outline: 2px solid var(--color-acento-texto); outline-offset: 2px; }
@media (pointer: coarse) { .cm-formulario input, .cm-formulario select, .cm-formulario textarea { font-size: 16px; min-height: 44px; } }
@media (prefers-reduced-motion: reduce) { .cm-formulario, .cm-formulario * { animation: none !important; transition: none !important; } }
.cm-formulario.cm-formulario-oscuro { padding: 20px; border-radius: var(--radio-grande); background: #15171C; color: #F1F2F4; } .cm-formulario.cm-formulario-oscuro .cm-fo-ayuda, .cm-formulario.cm-formulario-oscuro .cm-fo-nota, .cm-formulario.cm-formulario-oscuro .cm-fo-sec-titulo { color: #A9AFBA; } .cm-formulario.cm-formulario-oscuro input, .cm-formulario.cm-formulario-oscuro select, .cm-formulario.cm-formulario-oscuro textarea { background: #1F2229; border-color: #343844; color: #F1F2F4; } .cm-formulario.cm-formulario-oscuro .cm-fo-segmento { background: #1F2229; } .cm-formulario.cm-formulario-oscuro .cm-fo-seg-ind { background: #343844; } .cm-formulario.cm-formulario-oscuro .cm-fo-segmento button { color: #A9AFBA; } .cm-formulario.cm-formulario-oscuro .cm-fo-segmento button[aria-pressed='true'] { color: #FFFFFF; } .cm-formulario.cm-formulario-oscuro .cm-fo-perilla { background: #3A3E48; } .cm-formulario.cm-formulario-oscuro .cm-fo-cancelar { color: #F1F2F4; border-color: #3A3E48; } .cm-formulario.cm-formulario-oscuro .cm-fo-accion { border-color: #3A3E48; color: #F1F2F4; }

/* Subir archivos */
.cm-subir { display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 380px; font-family: var(--fuente-texto); color: var(--color-texto); font-size: 13.5px; }
.cm-subir .cm-s-zona { position: relative; display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 22px 16px; border: 2px dashed var(--color-borde); border-radius: var(--radio-grande); background: var(--color-fondo); text-align: center; cursor: pointer; transition: border-color var(--duracion-media) ease, background var(--duracion-media) ease; }
.cm-subir .cm-s-zona:hover, .cm-subir .cm-s-zona[data-encima] { border-color: var(--color-acento); background: color-mix(in srgb, var(--color-acento) 7%, var(--color-fondo)); }
.cm-subir .cm-s-zona:focus-within { outline: 2px solid var(--color-acento); outline-offset: 2px; }
.cm-subir .cm-s-zona input { position: absolute; width: 1px; height: 1px; opacity: 0; }
.cm-subir .cm-s-ico { display: grid; place-items: center; width: 52px; height: 52px; border-radius: 50%; background: var(--color-superficie); color: var(--color-acento-texto); }
.cm-subir .cm-s-txt { display: flex; flex-direction: column; gap: 2px; }
.cm-subir .cm-s-txt span { color: var(--color-texto-suave); font-size: 12.5px; }
.cm-subir .cm-s-boton { display: none; }
.cm-subir .cm-s-lista { display: flex; flex-direction: column; gap: 6px; margin: 0; padding: 0; list-style: none; }
.cm-subir .cm-s-lista li { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 2px 8px; padding: 8px 6px 8px 12px; border-radius: var(--radio-medio); background: var(--color-superficie); }
.cm-subir .cm-s-nombre { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600; }
.cm-subir .cm-s-barra { grid-column: 1; grid-row: 2; height: 4px; border-radius: 2px; background: var(--color-borde); overflow: hidden; }
.cm-subir .cm-s-barra span { display: block; height: 100%; width: 100%; background: var(--color-acento); animation: cm-s-carga 1.4s var(--curva-entrada) both; }
@keyframes cm-s-carga { from { width: 0; } }
.cm-subir .cm-s-lista button { grid-row: 1 / 3; grid-column: 2; width: 36px; height: 36px; border: none; border-radius: 8px; background: transparent; color: var(--color-texto-suave); font-size: 20px; cursor: pointer; }
.cm-subir .cm-s-lista button:hover { background: var(--color-borde); }
.cm-subir .cm-s-lista button:focus-visible { outline: 2px solid var(--color-acento); }
@media (prefers-reduced-motion: reduce) { .cm-subir, .cm-subir * { animation: none !important; transition: none !important; } }
.cm-subir.cm-subir-oscuro .cm-s-zona { background: #15171C; border-color: #3A3E48; color: #F1F2F4; } .cm-subir.cm-subir-oscuro .cm-s-zona:hover, .cm-subir.cm-subir-oscuro .cm-s-zona[data-encima] { background: #1C1F26; } .cm-subir.cm-subir-oscuro .cm-s-txt span { color: #A9AFBA; } .cm-subir.cm-subir-oscuro .cm-s-ico { background: #23262E; color: #F1F2F4; }

/* Tarjetas de producto */
.cm-producto { display: flex; flex-direction: column; width: 100%; max-width: 260px; border-radius: var(--radio-grande); background: var(--color-fondo); border: 1px solid var(--color-borde); overflow: hidden; font-family: var(--fuente-texto); color: var(--color-texto); }
.cm-producto .cm-pr-foto { position: relative; aspect-ratio: 1; background: radial-gradient(circle at 35% 40%, color-mix(in srgb, var(--color-acento) 45%, var(--color-fondo)) 0 28%, transparent 29%), color-mix(in srgb, var(--color-acento) 14%, var(--color-superficie)); }
.cm-producto .cm-pr-etq { position: absolute; top: 10px; left: 10px; padding: 3px 8px; border-radius: 999px; background: var(--color-texto); color: var(--color-fondo); font-size: 12px; font-weight: 800; }
.cm-producto .cm-pr-fav { position: absolute; top: 8px; right: 8px; width: 44px; height: 44px; border: none; border-radius: 50%; background: var(--color-fondo); color: var(--color-texto); font-size: 18px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,.12); }
.cm-producto .cm-pr-fav[aria-pressed='true'] { color: var(--color-acento-texto); }
.cm-producto .cm-pr-info { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px 14px; }
.cm-producto .cm-pr-cat { font-size: 11.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--color-texto-suave); }
.cm-producto .cm-pr-nombre { font-family: var(--fuente-titulos); font-size: 16px; }
.cm-producto .cm-pr-estrellas { font-size: 13px; color: var(--color-acento-texto); letter-spacing: 1px; }
.cm-producto .cm-pr-estrellas small { color: var(--color-texto-suave); letter-spacing: 0; }
.cm-producto .cm-pr-precio { display: flex; align-items: baseline; gap: 8px; margin-top: 2px; }
.cm-producto .cm-pr-precio b { font-size: 18px; }
.cm-producto .cm-pr-precio s { font-size: 13px; color: var(--color-texto-suave); }
.cm-producto .cm-pr-boton { margin-top: 8px; min-height: 44px; border: none; border-radius: var(--radio-boton); background: var(--boton-color); color: var(--boton-sobre); font: inherit; font-weight: 700; cursor: pointer; }
.cm-producto .cm-pr-ilustracion { display: block; width: 100%; height: 100%; position: absolute; inset: 0; object-fit: contain; transition: transform var(--duracion-media) var(--curva-entrada); }
.cm-producto:hover .cm-pr-ilustracion { transform: scale(1.04); }
.cm-producto .cm-pr-opciones { display: flex; flex-wrap: wrap; gap: 8px 16px; align-items: end; margin-top: 8px; }
.cm-producto .cm-pr-colores { border: 0; padding: 0; margin: 0; display: flex; gap: 0; min-width: 0; }
.cm-producto .cm-pr-colores legend, .cm-producto .cm-pr-talle label { font-size: 12px; color: var(--color-texto-suave); padding: 0; }
.cm-producto .cm-pr-colores label { position: relative; display: grid; place-items: center; width: 44px; height: 44px; cursor: pointer; }
.cm-producto .cm-pr-colores input { position: absolute; inset: 0; opacity: 0; margin: 0; width: 100%; height: 100%; cursor: pointer; }
.cm-producto .cm-pr-muestra-color { width: 22px; height: 22px; border-radius: 50%; background: var(--muestra-color, var(--color-acento)); border: 1px solid var(--color-texto-suave); }
.cm-producto .cm-pr-colores input:checked + .cm-pr-muestra-color { outline: 2px solid var(--color-texto); outline-offset: 3px; }
.cm-producto .cm-pr-colores input:focus-visible + .cm-pr-muestra-color { outline: 3px solid var(--color-acento-texto); outline-offset: 4px; }
.cm-producto .cm-pr-talle { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 68px; }
.cm-producto .cm-pr-talle select { min-height: 44px; width: 100%; border: 1px solid var(--color-borde); border-radius: var(--radio-pequeno); padding: 0 8px; background: var(--color-fondo); color: var(--color-texto); font: inherit; font-size: 16px; }
.cm-producto .cm-pr-disponible { font-size: 12px; color: var(--color-texto-suave); margin-top: 8px; }
.cm-producto .cm-pr-error, .cm-producto .cm-pr-confirmacion { font-size: 12px; line-height: 1.5; color: var(--color-texto); }
.cm-producto .cm-pr-error { flex-basis: 100%; border-inline-start: 3px solid var(--color-error); padding-inline-start: 8px; }
.cm-producto .cm-pr-confirmacion:empty { display: none; }
.cm-producto .cm-pr-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
.cm-producto button:focus-visible, .cm-producto select:focus-visible { outline: 2px solid var(--color-acento-texto); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { .cm-producto, .cm-producto * { animation: none !important; transition: none !important; } }


/* Notificaciones */
.cm-notificaciones { position: relative; display: inline-block; font-family: var(--fuente-texto); color: var(--color-texto); font-size: 13.5px; }
.cm-notificaciones .cm-n-boton { position: relative; display: grid; place-items: center; width: 44px; height: 44px; border: 1px solid var(--color-borde); border-radius: 50%; background: var(--color-fondo); color: var(--color-texto); cursor: pointer; }
.cm-notificaciones .cm-n-num { position: absolute; top: -4px; right: -4px; min-width: 20px; height: 20px; padding: 0 5px; border-radius: 999px; background: #D9264F; color: #FFFFFF; font: 800 11px/20px var(--fuente-texto); box-shadow: 0 0 0 2px var(--color-fondo); }
.cm-notificaciones .cm-n-panel { position: absolute; z-index: 5; top: calc(100% + 8px); right: 0; width: 270px; border-radius: var(--radio-grande); background: var(--color-superficie-alta, var(--color-fondo)); border: 1px solid var(--color-borde); box-shadow: 0 14px 36px rgba(0,0,0,.16); overflow: hidden; animation: cm-n-entra var(--duracion-media) var(--curva-entrada) both; transform-origin: top right; }
@keyframes cm-n-entra { from { opacity: 0; transform: translateY(-6px) scale(.97); } }
.cm-notificaciones .cm-n-cab { display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; border-bottom: 1px solid var(--color-borde); }
.cm-notificaciones .cm-n-cab button { min-height: 32px; border: none; background: transparent; color: var(--color-acento-texto); font: inherit; font-size: 12.5px; font-weight: 700; cursor: pointer; }
.cm-notificaciones ul { margin: 0; padding: 4px; list-style: none; }
.cm-notificaciones li { position: relative; display: flex; gap: 10px; align-items: center; padding: 10px; border-radius: calc(var(--radio-medio) * .8); }
.cm-notificaciones li[data-nueva] { background: color-mix(in srgb, var(--color-acento) 7%, transparent); }
.cm-notificaciones li[data-nueva]::after { content: ''; position: absolute; right: 12px; width: 8px; height: 8px; border-radius: 50%; background: var(--color-acento); }
.cm-notificaciones .cm-n-ico { display: grid; place-items: center; flex: none; width: 34px; height: 34px; border-radius: 50%; background: var(--color-superficie); font-weight: 800; }
.cm-notificaciones .cm-n-txt { display: flex; flex-direction: column; }
.cm-notificaciones .cm-n-txt span { font-size: 12px; color: var(--color-texto-suave); }
.cm-notificaciones button:focus-visible { outline: 2px solid var(--color-acento); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { .cm-notificaciones, .cm-notificaciones * { animation: none !important; transition: none !important; } }
.cm-notificaciones.cm-notificaciones-oscura .cm-n-panel { background: #15171C; border-color: #2A2D35; color: #F1F2F4; } .cm-notificaciones.cm-notificaciones-oscura .cm-n-cab { border-bottom-color: #2A2D35; } .cm-notificaciones.cm-notificaciones-oscura .cm-n-cab button { color: #F1F2F4; } .cm-notificaciones.cm-notificaciones-oscura .cm-n-txt span { color: #A9AFBA; } .cm-notificaciones.cm-notificaciones-oscura .cm-n-ico { background: #23262E; } .cm-notificaciones.cm-notificaciones-oscura li[data-nueva] { background: #1C1F26; }

/* Menú de usuario */
.cm-usuario { position: relative; display: inline-block; font-family: var(--fuente-texto); color: var(--color-texto); font-size: 14px; }
.cm-usuario .cm-u-boton { display: inline-flex; align-items: center; gap: 8px; min-height: 44px; padding: 4px 12px 4px 4px; border: 1px solid var(--color-borde); border-radius: 999px; background: var(--color-fondo); color: var(--color-texto); font: inherit; font-weight: 600; cursor: pointer; }
.cm-usuario .cm-u-av { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 50%; background: var(--color-acento); color: var(--color-sobre-acento); font-size: 12px; font-weight: 800; }
.cm-usuario .cm-u-chev { font-size: 12px; color: var(--color-texto-suave); }
.cm-usuario .cm-u-menu { position: absolute; z-index: 5; top: calc(100% + 8px); right: 0; display: flex; flex-direction: column; width: 220px; padding: 6px; border-radius: var(--radio-grande); background: var(--color-superficie-alta, var(--color-fondo)); border: 1px solid var(--color-borde); box-shadow: 0 14px 36px rgba(0,0,0,.16); animation: cm-n-entra var(--duracion-media) var(--curva-entrada) both; transform-origin: top right; }
@keyframes cm-n-entra { from { opacity: 0; transform: translateY(-6px) scale(.97); } }
.cm-usuario .cm-u-cab { display: flex; flex-direction: column; padding: 8px 10px 10px; margin-bottom: 4px; border-bottom: 1px solid var(--color-borde); }
.cm-usuario .cm-u-cab span { font-size: 12.5px; color: var(--color-texto-suave); }
.cm-usuario .cm-u-item { display: flex; align-items: center; min-height: 40px; padding: 0 10px; border: none; border-radius: calc(var(--radio-medio) * .7); background: transparent; color: var(--color-texto); font: inherit; text-align: left; cursor: pointer; }
.cm-usuario .cm-u-item:hover { background: var(--color-superficie); }
.cm-usuario .cm-u-salir { margin-top: 4px; color: color-mix(in srgb, var(--color-error) 80%, var(--color-texto)); }
.cm-usuario button:focus-visible { outline: 2px solid var(--color-acento); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { .cm-usuario, .cm-usuario * { animation: none !important; transition: none !important; } }
.cm-usuario.cm-usuario-oscuro .cm-u-menu { background: #15171C; border-color: #2A2D35; } .cm-usuario.cm-usuario-oscuro .cm-u-cab { border-bottom-color: #2A2D35; color: #F1F2F4; } .cm-usuario.cm-usuario-oscuro .cm-u-cab span { color: #A9AFBA; } .cm-usuario.cm-usuario-oscuro .cm-u-item { color: #F1F2F4; } .cm-usuario.cm-usuario-oscuro .cm-u-item:hover { background: #23262E; } .cm-usuario.cm-usuario-oscuro .cm-u-salir { color: #FF8FA3; }

/* Inicio de sesión */
.cm-acceso { display: flex; width: 100%; max-width: 380px; border-radius: var(--radio-grande); background: var(--color-fondo); border: 1px solid var(--color-borde); box-shadow: 0 12px 32px rgba(0,0,0,.08); overflow: hidden; font-family: var(--fuente-texto); color: var(--color-texto); font-size: 14px; }
.cm-acceso .cm-ac-lado { display: none; }
.cm-acceso .cm-ac-cuerpo { flex: 1; display: flex; flex-direction: column; gap: 12px; padding: 24px; }
.cm-acceso .cm-ac-marca { display: inline-flex; align-items: center; gap: 8px; font-weight: 800; }
.cm-acceso .cm-ac-logo { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 8px; background: var(--color-acento); color: var(--color-sobre-acento); font-size: 14px; }
.cm-acceso .cm-ac-titulo { font-family: var(--fuente-titulos); font-weight: var(--titulos-peso); font-size: 24px; line-height: 1.15; margin-top: 6px; }
.cm-acceso .cm-ac-sub { margin-top: -6px; color: var(--color-texto-suave); }
.cm-acceso .cm-ac-social { min-height: 44px; border: 1px solid var(--color-borde); border-radius: var(--radio-boton); background: var(--color-fondo); color: var(--color-texto); font: inherit; font-weight: 600; cursor: pointer; }
.cm-acceso .cm-ac-o { display: flex; align-items: center; gap: 10px; color: var(--color-texto-suave); font-size: 12px; }
.cm-acceso .cm-ac-o::before, .cm-acceso .cm-ac-o::after { content: ''; flex: 1; height: 1px; background: var(--color-borde); }
.cm-acceso .cm-ac-campo { display: flex; flex-direction: column; gap: 6px; font-weight: 600; font-size: 13px; }
.cm-acceso .cm-ac-clave { position: relative; display: flex; }
.cm-acceso input[type='email'], .cm-acceso input[type='password'], .cm-acceso input[type='text'] { width: 100%; min-height: 44px; padding: 0 12px; border: 1px solid var(--color-borde); border-radius: var(--radio-medio); background: var(--color-fondo); color: var(--color-texto); font: inherit; font-weight: 400; box-sizing: border-box; }
.cm-acceso .cm-ac-clave input { padding-right: 76px; }
.cm-acceso input:focus { outline: none; border-color: var(--color-acento); box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-acento) 22%, transparent); }
.cm-acceso .cm-ac-ver { position: absolute; right: 4px; top: 4px; bottom: 4px; padding: 0 10px; border: none; border-radius: calc(var(--radio-medio) * .7); background: var(--color-superficie); color: var(--color-texto); font: inherit; font-size: 12.5px; font-weight: 700; cursor: pointer; }
.cm-acceso .cm-ac-fila { display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 13px; }
.cm-acceso .cm-ac-recordar { display: inline-flex; align-items: center; gap: 6px; min-height: 32px; }
.cm-acceso .cm-ac-recordar input { width: 16px; height: 16px; accent-color: var(--color-acento); }
.cm-acceso a { color: var(--color-acento-texto); font-weight: 600; text-decoration: none; }
.cm-acceso a:hover { text-decoration: underline; text-underline-offset: 3px; }
.cm-acceso .cm-ac-entrar { min-height: 48px; border: none; border-radius: var(--radio-boton); background: var(--boton-color); color: var(--boton-sobre); font: inherit; font-weight: 800; font-size: 15px; cursor: pointer; }
.cm-acceso .cm-ac-pie { text-align: center; color: var(--color-texto-suave); font-size: 13px; }
.cm-acceso button:focus-visible, .cm-acceso a:focus-visible { outline: 2px solid var(--color-acento); outline-offset: 2px; }
.cm-acceso.cm-acceso-oscuro { background: #15171C; border-color: #2A2D35; color: #F1F2F4; } .cm-acceso.cm-acceso-oscuro .cm-ac-sub, .cm-acceso.cm-acceso-oscuro .cm-ac-pie, .cm-acceso.cm-acceso-oscuro .cm-ac-o { color: #A9AFBA; } .cm-acceso.cm-acceso-oscuro input[type='email'], .cm-acceso.cm-acceso-oscuro input[type='password'], .cm-acceso.cm-acceso-oscuro input[type='text'], .cm-acceso.cm-acceso-oscuro .cm-ac-social { background: #1F2229; border-color: #343844; color: #F1F2F4; } .cm-acceso.cm-acceso-oscuro .cm-ac-ver { background: #343844; color: #F1F2F4; } .cm-acceso.cm-acceso-oscuro .cm-ac-o::before, .cm-acceso.cm-acceso-oscuro .cm-ac-o::after { background: #343844; } .cm-acceso.cm-acceso-oscuro a { color: #C9D4FF; }

/* Formularios en pasos */
.cm-wizard { display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 420px; padding: 20px; border-radius: var(--radio-grande); background: var(--color-fondo); border: 1px solid var(--color-borde); font-family: var(--fuente-texto); font-size: 14px; color: var(--color-texto); box-sizing: border-box; }
.cm-wizard .cm-wz-pasos { display: grid; grid-template-columns: repeat(var(--n), 1fr); margin: 0; padding: 0; list-style: none; }
.cm-wizard .cm-wz-pasos li { position: relative; display: flex; flex-direction: column; align-items: center; gap: 4px; font-size: 12px; color: var(--color-texto-suave); }
.cm-wizard .cm-wz-pasos li + li::before { content: ''; position: absolute; top: 14px; right: calc(50% + 18px); left: calc(-50% + 18px); height: 2px; background: var(--color-borde); }
.cm-wizard .cm-wz-pasos li[data-estado='hecho'] + li::before, .cm-wizard .cm-wz-pasos li[data-estado='actual']::before { background: var(--color-acento); }
.cm-wizard .cm-wz-num { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; border: 2px solid var(--color-borde); background: var(--color-fondo); font-weight: 800; font-size: 12px; transition: all var(--duracion-media) var(--curva-entrada); }
.cm-wizard li[data-estado='hecho'] .cm-wz-num { background: var(--color-acento); border-color: var(--color-acento); color: var(--color-sobre-acento); }
.cm-wizard li[data-estado='actual'] .cm-wz-num { border-color: var(--color-acento); color: var(--color-acento-texto); }
.cm-wizard li[data-estado='actual'] { color: var(--color-texto); font-weight: 700; }
.cm-wizard .cm-wz-barra, .cm-wizard .cm-wz-cuenta { display: none; }
.cm-wizard .cm-wz-barra { height: 6px; border-radius: 3px; background: var(--color-superficie); overflow: hidden; }
.cm-wizard .cm-wz-barra span { display: block; height: 100%; width: calc((var(--i) + 1) / var(--n) * 100%); background: var(--color-acento); transition: width var(--duracion-lenta) var(--curva-entrada); }
.cm-wizard .cm-wz-cuenta { font-size: 12px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--color-texto-suave); }
.cm-wizard .cm-wz-cuerpo { display: flex; flex-direction: column; gap: 12px; min-height: 150px; animation: cm-wz-entra var(--duracion-lenta) var(--curva-entrada) both; }
@keyframes cm-wz-entra { from { opacity: 0; transform: translateX(14px); } }
.cm-wizard .cm-wz-titulo { font-family: var(--fuente-titulos); font-weight: var(--titulos-peso); font-size: 20px; }
.cm-wizard .cm-wz-ayuda { color: var(--color-texto-suave); }
.cm-wizard .cm-wz-campo { display: flex; flex-direction: column; gap: 6px; font-weight: 600; font-size: 13px; }
.cm-wizard input, .cm-wizard select, .cm-wizard textarea { width: 100%; min-height: 44px; padding: 0 12px; border: 1px solid var(--color-borde); border-radius: var(--radio-medio); background: var(--color-fondo); color: var(--color-texto); font: inherit; font-weight: 400; box-sizing: border-box; }
.cm-wizard textarea { padding: 10px 12px; min-height: 60px; }
.cm-wizard input:focus, .cm-wizard select:focus, .cm-wizard textarea:focus { outline: none; border-color: var(--color-acento); box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-acento) 22%, transparent); }
.cm-wizard .cm-wz-acciones { display: flex; justify-content: space-between; gap: 10px; }
.cm-wizard .cm-wz-acciones button { min-height: 46px; padding: 0 20px; border-radius: var(--radio-boton); font: inherit; font-weight: 700; cursor: pointer; }
.cm-wizard .cm-wz-atras { border: 1.5px solid var(--color-borde); background: transparent; color: var(--color-texto); }
.cm-wizard .cm-wz-atras:disabled { opacity: .4; cursor: default; }
.cm-wizard .cm-wz-siguiente { border: none; background: var(--boton-color); color: var(--boton-sobre); }
.cm-wizard button:focus-visible { outline: 2px solid var(--color-acento); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { .cm-wizard, .cm-wizard * { animation: none !important; transition: none !important; } }
.cm-wizard.cm-wizard-oscuro { background: #15171C; border-color: #2A2D35; color: #F1F2F4; } .cm-wizard.cm-wizard-oscuro .cm-wz-pasos li { color: #A9AFBA; } .cm-wizard.cm-wizard-oscuro li[data-estado='actual'] { color: #FFFFFF; } .cm-wizard.cm-wizard-oscuro .cm-wz-num { background: #15171C; border-color: #3A3E48; } .cm-wizard.cm-wizard-oscuro li[data-estado='actual'] .cm-wz-num { color: #FFFFFF; } .cm-wizard.cm-wizard-oscuro .cm-wz-ayuda { color: #A9AFBA; } .cm-wizard.cm-wizard-oscuro input, .cm-wizard.cm-wizard-oscuro select, .cm-wizard.cm-wizard-oscuro textarea { background: #1F2229; border-color: #343844; color: #F1F2F4; } .cm-wizard.cm-wizard-oscuro .cm-wz-atras { color: #F1F2F4; border-color: #3A3E48; } .cm-wizard.cm-wizard-oscuro .cm-wz-pasos li + li::before { background: #3A3E48; }

/* Reserva de turnos */
.cm-reserva { display: flex; flex-direction: column; gap: 14px; width: 100%; max-width: 400px; padding: 18px; border-radius: var(--radio-grande); background: var(--color-fondo); border: 1px solid var(--color-borde); font-family: var(--fuente-texto); color: var(--color-texto); font-size: 14px; box-sizing: border-box; }
.cm-reserva .cm-rs-titulo { font-family: var(--fuente-titulos); font-weight: var(--titulos-peso); font-size: 18px; }
.cm-reserva .cm-rs-dias { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px; }
.cm-reserva .cm-rs-dias button { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 8px 0; border: 1px solid var(--color-borde); border-radius: var(--radio-medio); background: var(--color-fondo); color: var(--color-texto); font: inherit; cursor: pointer; }
.cm-reserva .cm-rs-dsem { font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--color-texto-suave); }
.cm-reserva .cm-rs-dnum { font-size: 18px; font-weight: 800; }
.cm-reserva .cm-rs-dias button[aria-pressed='true'] { background: var(--color-acento); border-color: var(--color-acento); color: var(--color-sobre-acento); }
.cm-reserva .cm-rs-dias button[aria-pressed='true'] .cm-rs-dsem { color: var(--color-sobre-acento); }
.cm-reserva .cm-rs-horas { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; }
.cm-reserva .cm-rs-horas button { min-height: 40px; border: 1px solid var(--color-borde); border-radius: 999px; background: var(--color-fondo); color: var(--color-texto); font: inherit; font-weight: 600; font-variant-numeric: tabular-nums; cursor: pointer; transition: background var(--duracion-rapida) ease; }
.cm-reserva .cm-rs-horas button:hover:not(:disabled) { background: var(--color-superficie); }
.cm-reserva .cm-rs-horas button:disabled { color: var(--color-texto-suave); text-decoration: line-through; opacity: .55; cursor: default; }
.cm-reserva .cm-rs-horas button[aria-pressed='true'] { background: var(--color-texto); border-color: var(--color-texto); color: var(--color-fondo); }
.cm-reserva .cm-rs-resumen { display: flex; flex-direction: column; gap: 2px; padding: 10px 12px; border-radius: var(--radio-medio); background: var(--color-superficie); font-weight: 700; }
.cm-reserva .cm-rs-resumen small { font-weight: 400; color: var(--color-texto-suave); }
.cm-reserva .cm-rs-confirmar { min-height: 48px; border: none; border-radius: var(--radio-boton); background: var(--boton-color); color: var(--boton-sobre); font: inherit; font-weight: 800; cursor: pointer; }
.cm-reserva button:focus-visible { outline: 2px solid var(--color-acento); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { .cm-reserva, .cm-reserva * { animation: none !important; transition: none !important; } }
.cm-reserva.cm-reserva-oscuro { background: #15171C; border-color: #2A2D35; color: #F1F2F4; } .cm-reserva.cm-reserva-oscuro .cm-rs-dias button, .cm-reserva.cm-reserva-oscuro .cm-rs-horas button { background: #1F2229; border-color: #343844; color: #F1F2F4; } .cm-reserva.cm-reserva-oscuro .cm-rs-dias button[aria-pressed='true'] { background: var(--color-acento); border-color: var(--color-acento); color: var(--color-sobre-acento); } .cm-reserva.cm-reserva-oscuro .cm-rs-dias button[aria-pressed='true'] .cm-rs-dsem { color: var(--color-sobre-acento); } .cm-reserva.cm-reserva-oscuro .cm-rs-dsem, .cm-reserva.cm-reserva-oscuro .cm-rs-resumen small { color: #A9AFBA; } .cm-reserva.cm-reserva-oscuro .cm-rs-horas button:disabled { color: #8A909C; } .cm-reserva.cm-reserva-oscuro .cm-rs-horas button[aria-pressed='true'] { background: #F1F2F4; color: #15171C; } .cm-reserva.cm-reserva-oscuro .cm-rs-resumen { background: #1F2229; }
```
