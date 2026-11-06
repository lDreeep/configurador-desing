# DESIGN.md: especificación del formato

> **Versión del formato:** 0.1.0 (borrador)
> **Última actualización:** 2026-11-06
> **Estado:** MVP del configurador construido (9 pasos + export). Falta la primera ronda de pruebas con IA (§9).

Este documento define **qué archivo exporta el configurador** y **cómo lo tiene que leer una IA** para construir una web o una app. Es también el documento vivo del proyecto: acá se registran las decisiones, lo que aprendemos en las pruebas y lo que falta hacer.

---

## Índice

0. [Cómo usar y mantener este documento](#0-cómo-usar-y-mantener-este-documento)
1. [Qué es y principios](#1-qué-es-y-principios)
2. [Reglas generales del formato](#2-reglas-generales-del-formato)
3. [Estructura del archivo exportado, sección por sección](#3-estructura-del-archivo-exportado-sección-por-sección)
4. [Prioridades y resolución de conflictos](#4-prioridades-y-resolución-de-conflictos)
5. [Del configurador al archivo: qué paso llena cada sección](#5-del-configurador-al-archivo-qué-paso-llena-cada-sección)
6. [Ejemplo completo exportado](#6-ejemplo-completo-exportado)
7. [Cómo evoluciona este formato](#7-cómo-evoluciona-este-formato)
8. [Registro de decisiones](#8-registro-de-decisiones)
9. [Registro de pruebas](#9-registro-de-pruebas)
10. [Backlog e ideas](#10-backlog-e-ideas)
11. [Preguntas abiertas](#11-preguntas-abiertas)
12. [Historial de cambios](#12-historial-de-cambios)

---

## 0. Cómo usar y mantener este documento

Hay **dos archivos distintos** que se llaman igual. Conviene no confundirlos:

| | Este documento | El archivo exportado |
|---|---|---|
| Qué es | La especificación del formato, y el documento vivo del proyecto | Lo que descarga cada usuario al terminar el configurador |
| Quién lo escribe | Nosotros (con ayuda de la IA) | El configurador, automáticamente |
| Para qué | Definir qué lleva el export y cómo evoluciona | Que una IA construya una app concreta |
| Dónde vive | En el repo del configurador | En el proyecto del usuario |

### Cómo se retroalimenta

Este documento mejora con un ciclo corto que se repite siempre igual:

1. **Construimos o probamos algo.** Un paso del configurador, una opción nueva, un export pasado por una IA.
2. **Anotamos lo que pasó.** En [§9 Registro de pruebas](#9-registro-de-pruebas) si fue una prueba; en [§8 Registro de decisiones](#8-registro-de-decisiones) si decidimos algo.
3. **Si hace falta, cambiamos el formato.** Se edita la sección afectada en §3, se sube la versión según [§7](#7-cómo-evoluciona-este-formato) y se anota en [§12](#12-historial-de-cambios).
4. **Lo que no entra ahora va a [§10 Backlog](#10-backlog-e-ideas)** y lo que no sabemos responder va a [§11 Preguntas abiertas](#11-preguntas-abiertas).

### Instrucciones para la IA que mantiene este documento

Si sos una IA trabajando en el repo del configurador:

- **Leé este documento antes de tocar** el export, el catálogo de opciones o cualquier paso del configurador.
- **Si cambiás el código del export, actualizá §3** para que el documento y el código digan lo mismo. Si no coinciden, gana este documento: avisá la diferencia en vez de adaptar el documento en silencio.
- **Al terminar una tarea, proponé las entradas** que correspondan en §8, §9, §10, §11 o §12. Escribilas vos si te lo pidieron; si no, sugerilas al final de tu respuesta.
- **No borres entradas de los registros** (§8, §9, §12). Si algo quedó obsoleto, marcalo como `[reemplazado por …]`.
- **Respetá los estados** de §5 (`[MVP]`, `[v0.2]`, `[futuro]`, `[idea]`). No implementes algo `[futuro]` sin que te lo pidan.
- **Si una decisión no está escrita acá, preguntá** antes de inventarla, y después registrala en §8.

---

## 1. Qué es y principios

### Qué es

Un archivo Markdown que describe **cómo se ve** y **qué hace** una web o app, con el detalle suficiente para que una IA la construya sin inventar decisiones de diseño. Lo genera el configurador visual a partir de lo que la persona elige y de las notas que escribe.

### Principios

1. **Un solo archivo, autosuficiente.** Lleva adentro sus propias instrucciones para la IA. Tiene que funcionar pegado en cualquier IA (Claude, Claude Code, v0, Lovable, Bolt…) sin nada más.
2. **Valores exactos más intención.** Cada decisión va con su valor concreto (`#2F5BFF`, `14px`, `160ms`) y, si existe, con la intención de la persona ("calmo, pero que no parezca un banco"). El valor evita que la IA interprete; la intención la guía donde el valor no alcanza.
3. **Lo que no se definió se dice.** Nada se rellena en silencio. Si la persona no eligió algo, el archivo lo marca como `sin_definir` y la IA sabe que tiene que preguntar o usar el valor por defecto declarado.
4. **Legible para personas y para máquinas.** Prosa breve para entender y bloques YAML con los valores exactos. El configurador tiene que poder **volver a importar** su propio archivo para seguir editándolo.
5. **Coherencia antes que cantidad.** Es mejor un sistema chico que combina que cien opciones sueltas. El formato se organiza en tokens (valores base) que el resto de las secciones reutiliza.
6. **Accesible por defecto.** Las reglas de accesibilidad son parte del formato, no una opción.
7. **Crece sin romperse.** Las secciones nuevas se agregan sin cambiar el significado de las que ya existen (ver §7).

---

## 2. Reglas generales del formato

### 2.1 Estructura de cada sección

Cada sección del archivo exportado sigue siempre el mismo molde:

````markdown
## 6. Color

Una o dos frases que explican la decisión en lenguaje humano.

```yaml
modo: claro
acento: "#2F5BFF"
nota: "el azul un poco menos frío"
```
````

- **Título:** `## <número>. <Nombre>`, con exactamente los nombres y números de §3. La IA y el importador se guían por ellos.
- **Prosa:** opcional, corta (máximo 3 frases). Explica, no agrega valores nuevos.
- **Bloque YAML:** obligatorio en las secciones que tienen valores. Es la fuente de verdad.

### 2.2 Valores especiales

| Valor | Significa | Qué hace la IA |
|---|---|---|
| `sin_definir` | La persona no eligió nada | Usa el `por_defecto` de la sección si existe; si no, pregunta. Lo anota en §18 del export. |
| `libre` | La persona eligió explícitamente "que decida la IA" | Decide, de forma coherente con la dirección visual, y explica qué eligió. |
| `ninguno` | Se eligió no tenerlo (por ejemplo, sin modo oscuro) | No lo implementa. |

### 2.3 Notas

- Cualquier bloque puede tener un campo `nota:` (texto) o `notas:` (lista).
- Las notas son **texto literal de la persona**. El configurador no las reescribe.
- Una nota **tiene prioridad** sobre el valor del mismo bloque (ver §4).

### 2.4 Convenciones de valores

| Tipo | Formato | Ejemplo |
|---|---|---|
| Color | Hex de 6 dígitos, entre comillas | `"#2F5BFF"` |
| Medida | Número con unidad, `px` o `rem` | `14px`, `1.5rem` |
| Duración | Milisegundos | `160ms` |
| Curva | `cubic-bezier(...)` o palabra clave CSS | `cubic-bezier(.2,.7,.3,1)` |
| Tipografía | Nombre de Google Fonts más pila de respaldo | `"Inter, system-ui, sans-serif"` |
| Listas | Lista YAML | `[Inicio, Turnos]` |
| Identificadores | `minusculas_con_guion_bajo` | `pestanas_abajo` |

- Las claves YAML van en español, sin tildes ni eñes (`pestanas`, `tipografia`), para evitar problemas al importar.
- Los textos visibles para el usuario final (nombres de pantallas, botones) sí llevan tildes.

### 2.5 Encabezado obligatorio

Todo archivo exportado empieza con este bloque, que permite saber con qué versión del formato se generó:

```yaml
formato: design-md
version_formato: 0.1.0
generado_por: configurador-diseno
fecha: 2026-11-06
idioma: es
```

---

## 3. Estructura del archivo exportado, sección por sección

Orden fijo. Las marcadas **(obligatoria)** siempre aparecen, aunque sea con valores `sin_definir`. Las demás aparecen solo si el configurador las tiene implementadas (ver §5).

| # | Sección | Responde a | |
|---|---|---|---|
| 0 | Encabezado | Con qué se generó | obligatoria |
| 1 | Instrucciones para la IA | Cómo usar este archivo | obligatoria |
| 2 | Proyecto | Qué es | obligatoria |
| 3 | Estructura | Qué pantallas tiene y cómo se navega | obligatoria |
| 4 | Funcionalidades | Qué hace | obligatoria |
| 5 | Dirección visual | Qué sensación transmite | obligatoria |
| 6 | Color | Paleta y roles | obligatoria |
| 7 | Tipografía | Familias y escala | obligatoria |
| 8 | Espaciado y layout | Ritmo, grilla, anchos | |
| 9 | Forma | Radios, bordes, sombras | obligatoria |
| 10 | Componentes | Cómo es cada pieza de UI | |
| 11 | Iconos e imágenes | Estilo visual de apoyo | |
| 12 | Movimiento | Animaciones y transiciones | obligatoria |
| 13 | Contenido y tono | Cómo se escribe | |
| 14 | Accesibilidad | Mínimos que no se negocian | obligatoria |
| 15 | Responsive | Cómo se adapta | obligatoria |
| 16 | Tokens | Todo lo anterior como variables CSS | obligatoria |
| 17 | Notas generales | Lo que la persona quiere decir fuera de los pasos | |
| 18 | Pendientes | Lo que no se definió | obligatoria |

---

### §0. Encabezado

Ver [§2.5](#25-encabezado-obligatorio). Va al principio, antes del título del proyecto.

---

### §1. Instrucciones para la IA

**Texto fijo**, igual en todos los exports de la misma versión. El configurador no lo modifica. Es lo que reemplaza a una skill: viaja adentro del archivo.

Texto actual (v0.1.0):

```markdown
## 1. Instrucciones para la IA

Este archivo describe una web o app que tenés que construir. Fue generado
por un configurador visual a partir de decisiones de una persona.

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
```

---

### §2. Proyecto

**Responde:** qué es, para quién y para qué.

```yaml
nombre: "Barbería Sur"            # texto | sin_definir
tipo: app_web                     # landing | sitio | tienda | app_web | app_movil | dashboard | portfolio | blog
descripcion: "..."                # 1 a 3 frases, palabras de la persona
objetivo_principal: "..."         # la UNA cosa que tiene que lograr
publico:
  quienes: "..."                  # quién lo usa
  contexto: "..."                 # dónde y cómo (en el celular, apurados, en la oficina…)
  nivel_tecnico: bajo             # bajo | medio | alto
plataformas: [web_movil, web_escritorio]   # web_movil | web_escritorio | ios | android
idioma_contenido: es
stack_preferido: libre            # libre | nextjs | react_vite | html_css | astro | otro: "..."
nota: ""
```

- `objetivo_principal` es obligatorio aunque el resto quede sin definir: ordena todas las decisiones de jerarquía.
- `stack_preferido: libre` es el valor por defecto. Solo se completa si la persona lo sabe.

---

### §3. Estructura

**Responde:** qué pantallas o páginas hay, qué tiene cada una y cómo se pasa de una a otra.

```yaml
navegacion:
  patron: barra_superior          # barra_superior | menu_lateral | pestanas_abajo | hamburguesa | sin_navegacion
  patron_movil: pestanas_abajo    # puede diferir del de escritorio
  items: [Inicio, Turnos, Clientes, Ajustes]
  item_destacado: Turnos          # opcional: un ítem con peso visual extra
pantallas:
  - id: turnos
    nombre: "Turnos"
    proposito: "Ver y gestionar los turnos del día"
    secciones: [encabezado_con_fecha, lista_de_turnos, boton_nuevo_turno]
    accion_principal: "Reservar turno"
    nota: ""
  - id: clientes
    nombre: "Clientes"
    proposito: "..."
    secciones: [...]
    accion_principal: "..."
flujos:
  - nombre: "Reservar un turno"
    pasos: [turnos, elegir_horario, confirmar]
```

- **Una sola `accion_principal` por pantalla.** Es la que lleva el botón primario (ver §10).
- Para landings y sitios, `pantallas` son páginas y `secciones` son los bloques (hero, beneficios, precios, testimonios, preguntas frecuentes, contacto…). El catálogo de secciones de landing es un ítem del backlog (§10).

---

### §4. Funcionalidades

**Responde:** qué hace. Es la parte de "un poco lo que haría".

```yaml
acciones_clave:                   # 3 a 6, en orden de importancia
  - "Reservar un turno eligiendo día y horario"
  - "Ver la agenda del día"
datos:                            # qué información maneja
  - entidad: Turno
    campos: [cliente, servicio, fecha, hora, estado]
  - entidad: Cliente
    campos: [nombre, telefono, notas]
usuarios:
  requiere_cuenta: si             # si | no | opcional
  roles: [dueno, empleado]        # o [] si no hay roles
integraciones: [whatsapp]         # pagos | email | whatsapp | mapas | calendario | analitica | otra: "..."
fuera_de_alcance:                 # lo que NO hay que hacer, tan importante como lo que sí
  - "Pagos online"
datos_de_ejemplo: si              # si: la IA usa datos de ejemplo realistas; no: deja vacíos
nota: ""
```

- `fuera_de_alcance` evita que la IA agregue cosas por su cuenta.
- El configurador **no pretende diseñar el backend**. Esta sección describe intención funcional; la IA decide la implementación salvo que la persona indique otra cosa.

---

### §5. Dirección visual

**Responde:** qué sensación transmite. Es la decisión que ordena todas las demás.

```yaml
direccion: calmo                  # calmo | audaz | tecnico | calido | lujoso | jugueton | editorial | libre
palabras_clave: [claro, confiable, aireado]   # 3 a 5
referencias:                      # opcional: sitios o apps que le gustan
  - url: "https://..."
    que_le_gusta: "el uso del espacio"
anti_referencias:                 # opcional: lo que NO quiere parecer
  - "un banco"
  - "una plantilla genérica de SaaS"
nota: "calmo, pero que no parezca un banco"
```

- Elegir una `direccion` en el configurador **precarga** valores coherentes en §6 a §12. Si después la persona cambia algo, gana lo que cambió.
- Las `anti_referencias` son muy útiles y casi ninguna herramienta las pide.

Valores precargados por dirección (v0.1.0, catálogo inicial):

| Dirección | Paleta | Tipografía | Radio | Movimiento | Densidad |
|---|---|---|---|---|---|
| calmo | azul_electrico | inter | 14px | sutil | aireada |
| audaz | tinta_y_lima | space_grotesk + inter | 0px | expresivo | normal |
| tecnico | bosque | inter | 6px | minimo | compacta |
| calido | coral_calido | fraunces + inter | píldora | sutil | aireada |

---

### §6. Color

**Responde:** qué colores hay y para qué se usa cada uno. Se definen **por rol**, no por nombre ("acento", no "azul").

```yaml
paleta: azul_electrico            # id del catálogo | personalizada
modo: claro                       # claro | oscuro | ambos
modo_por_defecto: claro           # si modo: ambos
roles:
  fondo:           "#FFFFFF"
  superficie:      "#F2F4F8"      # cards, barras, zonas agrupadas
  superficie_alta: "#FFFFFF"      # modales, menús flotantes
  borde:           "#C9D0DE"
  texto:           "#121826"
  texto_suave:     "#5B6474"      # secundario, ayudas
  acento:          "#2F5BFF"      # acción principal, links, foco
  sobre_acento:    "#FFFFFF"      # texto encima del acento
estados:
  exito:   "#1F7A4D"
  aviso:   "#B45309"
  error:   "#C2272D"
  info:    "#2F5BFF"
oscuro:                           # solo si modo: ambos | oscuro
  fondo: "#0E0F12"
  # …mismos roles
uso_del_acento: moderado          # minimo | moderado | generoso
nota: "el azul un poco menos frío"
```

**Reglas del formato:**
- Todos los pares texto/fondo cumplen **contraste 4.5:1** (3:1 para texto de 24px o más). El configurador lo verifica antes de exportar; si una combinación personalizada no pasa, avisa y no exporta sin confirmación.
- Los colores de estado nunca se distinguen solo por el tono: llevan icono o texto.
- `uso_del_acento` le dice a la IA cuánto color poner: `minimo` es solo el botón primario y el foco; `generoso` incluye fondos de sección y encabezados.

---

### §7. Tipografía

```yaml
familias:
  titulos: "Space Grotesk, Inter, sans-serif"
  texto:   "Inter, system-ui, sans-serif"
  mono:    "ui-monospace, Menlo, monospace"   # solo si hace falta
fuente_origen: google_fonts       # google_fonts | sistema | propia
escala:                           # tamaño / interlineado / peso
  display: { tamano: 48px, interlineado: 1.1,  peso: 700 }
  h1:      { tamano: 36px, interlineado: 1.15, peso: 700 }
  h2:      { tamano: 28px, interlineado: 1.2,  peso: 600 }
  h3:      { tamano: 22px, interlineado: 1.3,  peso: 600 }
  cuerpo:  { tamano: 16px, interlineado: 1.5,  peso: 400 }
  pequeno: { tamano: 14px, interlineado: 1.45, peso: 400 }
  etiqueta:{ tamano: 12px, interlineado: 1.3,  peso: 600, mayusculas: si, espaciado: 0.06em }
proporcion_escala: 1.25           # cómo se generó la escala (informativo)
largo_de_linea_max: 70ch
nota: "títulos más grandes de lo normal"
```

- El configurador genera la escala a partir de un tamaño base y una proporción; la persona elige entre 3 opciones de "contraste de tamaños" (sutil, medio, dramático), no número por número.
- El cuerpo nunca baja de 16px en pantallas móviles.

---

### §8. Espaciado y layout

```yaml
unidad_base: 4px
escala: [4, 8, 12, 16, 24, 32, 48, 64, 96]   # en px
densidad: aireada                 # compacta | normal | aireada
ancho_maximo_contenido: 1200px
grilla:
  columnas: 12
  separacion: 24px
  margen_lateral: { movil: 16px, escritorio: 32px }
espacio_entre_secciones: 96px     # para landings y sitios
nota: ""
```

- La `densidad` multiplica la escala de paddings internos: compacta ×0.75, normal ×1, aireada ×1.25.

---

### §9. Forma

```yaml
radio:
  pequeno: 6px                    # inputs, chips, badges
  medio:   14px                   # cards, botones
  grande:  20px                   # modales, contenedores grandes
  boton:   14px                   # o 999px para píldora
bordes:
  grosor: 1px
  uso: sutil                      # ninguno | sutil | marcado
elevacion:                        # sombras
  estilo: suave                   # plana | suave | marcada
  nivel_1: "0 1px 2px rgba(18,24,38,.06)"
  nivel_2: "0 4px 16px rgba(18,24,38,.08)"
  nivel_3: "0 12px 32px rgba(18,24,38,.12)"
nota: "cards suaves, pero inputs rectos"
```

---

### §10. Componentes

**Responde:** cómo es cada pieza. Todo usa los tokens de §6 a §9; acá solo se definen variantes, estados y reglas de uso.

```yaml
botones:
  variantes: [primario, secundario, fantasma, peligro]
  primario: { fondo: acento, texto: sobre_acento }
  secundario: { fondo: transparente, borde: borde, texto: texto }
  alto_minimo: 44px
  estados: [normal, hover, presionado, foco, deshabilitado, cargando]
  regla: "un solo botón primario visible por pantalla"
inputs:
  estilo: borde_completo          # borde_completo | solo_linea_inferior | relleno
  etiqueta: arriba                # arriba | flotante
  ayuda_y_error: debajo
cards:
  estilo: superficie              # superficie | borde | elevada
  padding: 16px
navegacion:
  indicador_activo: texto_y_peso  # texto_y_peso | subrayado | fondo | pastilla
modales:
  uso: solo_confirmaciones        # solo_confirmaciones | libre | ninguno
listas_y_tablas:
  estilo: filas_separadas         # filas_separadas | cebra | cards_en_movil
avisos:
  tipo: toast_abajo               # toast_abajo | toast_arriba | banner
estados_especiales:
  vacio: "ilustración simple + texto + acción"
  cargando: esqueleto             # esqueleto | spinner
  error: "mensaje claro + cómo resolverlo + reintentar"
nota: ""
```

- **Estados vacío, cargando y error son obligatorios** en cualquier pantalla que muestre datos. Es lo que más olvidan las IA.

---

### §11. Iconos e imágenes

```yaml
iconos:
  libreria: lucide                # lucide | heroicons | phosphor | material_symbols | libre
  estilo: trazo                   # trazo | relleno | duotono
  grosor: 1.75
  tamano: 20px
imagenes:
  tipo: fotografia                # fotografia | ilustracion | 3d | ninguna | libre
  tratamiento: natural            # natural | duotono | blanco_y_negro
  proporcion_por_defecto: "4:3"
emojis_en_ui: no
logo: sin_definir                 # sin_definir | texto | archivo: "logo.svg"
nota: ""
```

---

### §12. Movimiento

```yaml
nivel: sutil                      # minimo | sutil | expresivo
duraciones:
  rapida: 120ms                   # hover, foco
  media: 160ms                    # aparición de elementos, cambios de estado
  lenta: 280ms                    # modales, transiciones de pantalla
curvas:
  entrada: "cubic-bezier(.2,.7,.3,1)"
  salida:  "cubic-bezier(.4,0,1,1)"
que_se_anima:
  hover_botones: elevar           # nada | elevar | oscurecer | escalar
  aparicion_listas: escalonada    # nada | fundido | escalonada
  cambio_de_pantalla: fundido     # nada | fundido | deslizar
  modales: fundido_y_escala
no_animar: ["formularios mientras se escribe"]
respetar_movimiento_reducido: si  # fijo en "si": no se puede desactivar
nota: "nada que rebote en formularios"
```

- `respetar_movimiento_reducido` siempre es `si`: con `prefers-reduced-motion`, las animaciones se reducen a fundidos cortos o se quitan.
- En el configurador cada opción se **ve en movimiento** en la vista previa, no se describe.

---

### §13. Contenido y tono

```yaml
voz: cercana                      # formal | neutra | cercana | divertida
tratamiento: vos                  # vos | tu | usted
largo_de_textos: corto            # corto | medio | detallado
formato:
  fecha: "mar 12 nov"
  hora: "24h"
  moneda: "ARS"
  separador_decimal: ","
ejemplos_de_microcopy:            # opcional, palabras de la persona
  boton_principal: "Reservar turno"
  estado_vacio: "Todavía no hay turnos hoy"
palabras_prohibidas: []
nota: ""
```

---

### §14. Accesibilidad

Sección **fija con mínimos que no se negocian**. La persona puede subir el nivel, no bajarlo.

```yaml
nivel: AA                         # AA (mínimo) | AAA
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
extras: []                        # lo que la persona agregue
```

---

### §15. Responsive

```yaml
enfoque: movil_primero            # movil_primero | escritorio_primero
cortes:
  movil: 0
  tableta: 768px
  escritorio: 1024px
  ancho: 1440px
comportamientos:
  navegacion_en_movil: pestanas_abajo
  tablas_en_movil: cards          # cards | scroll_horizontal
  grillas: "1 columna en móvil, 2 en tableta, 3-4 en escritorio"
nota: ""
```

---

### §16. Tokens

Todo lo anterior como **variables CSS listas para copiar**. Lo genera el configurador; nadie lo escribe a mano. Si hay diferencia entre este bloque y los YAML anteriores, **ganan los YAML** (y es un bug del configurador).

```css
:root {
  /* Color */
  --color-fondo: #FFFFFF;
  --color-superficie: #F2F4F8;
  --color-superficie-alta: #FFFFFF;
  --color-borde: #C9D0DE;
  --color-texto: #121826;
  --color-texto-suave: #5B6474;
  --color-acento: #2F5BFF;
  --color-sobre-acento: #FFFFFF;
  --color-exito: #1F7A4D;
  --color-aviso: #B45309;
  --color-error: #C2272D;

  /* Tipografía */
  --fuente-titulos: "Space Grotesk", Inter, sans-serif;
  --fuente-texto: Inter, system-ui, sans-serif;
  --texto-display: 48px;
  --texto-h1: 36px;
  --texto-h2: 28px;
  --texto-h3: 22px;
  --texto-cuerpo: 16px;
  --texto-pequeno: 14px;
  --texto-etiqueta: 12px;

  /* Espaciado */
  --espacio-1: 4px;  --espacio-2: 8px;  --espacio-3: 12px;
  --espacio-4: 16px; --espacio-5: 24px; --espacio-6: 32px;
  --espacio-7: 48px; --espacio-8: 64px; --espacio-9: 96px;
  --ancho-max: 1200px;

  /* Forma */
  --radio-pequeno: 6px;
  --radio-medio: 14px;
  --radio-grande: 20px;
  --radio-boton: 14px;
  --sombra-1: 0 1px 2px rgba(18,24,38,.06);
  --sombra-2: 0 4px 16px rgba(18,24,38,.08);
  --sombra-3: 0 12px 32px rgba(18,24,38,.12);

  /* Movimiento */
  --duracion-rapida: 120ms;
  --duracion-media: 160ms;
  --duracion-lenta: 280ms;
  --curva-entrada: cubic-bezier(.2,.7,.3,1);
  --curva-salida: cubic-bezier(.4,0,1,1);
}

@media (prefers-reduced-motion: reduce) {
  :root { --duracion-rapida: 0ms; --duracion-media: 0ms; --duracion-lenta: 0ms; }
}
```

- Los nombres de las variables son **parte del formato** y no cambian sin versión mayor (§7).
- `[v0.2]` Exportar también como `tailwind.config` y como tokens JSON (formato W3C Design Tokens).

---

### §17. Notas generales

Texto libre de la persona que no corresponde a ningún paso. Se exporta tal cual.

```yaml
notas:
  - "Quiero que se sienta rápida, más que linda."
```

---

### §18. Pendientes

**Lo genera el configurador automáticamente**: lista todo lo que quedó en `sin_definir` y las preguntas que la IA debería hacer antes de empezar.

```yaml
sin_definir:
  - seccion: 11
    campo: logo
    bloquea: no
  - seccion: 4
    campo: integraciones
    bloquea: si
preguntas_sugeridas:
  - "¿Los recordatorios por WhatsApp son automáticos o los manda el dueño?"
```

- `bloquea: si` significa que la IA no debería avanzar con esa parte sin una respuesta.

---

## 4. Prioridades y resolución de conflictos

Cuando dos cosas se contradicen, la IA sigue este orden (gana la de arriba):

1. **§14 Accesibilidad.**
2. **Notas de la persona** (`nota:` / `notas:`), empezando por la del mismo bloque.
3. **Valores explícitos** en los bloques YAML.
4. **Valores precargados por la dirección visual** (§5) que la persona no tocó.
5. **Valores `por_defecto`** del formato.
6. **Criterio de la IA**, solo donde dice `libre` o no hay nada. Y lo informa.

Ejemplo: §12 dice `hover_botones: elevar` pero la nota dice "nada que se mueva en los botones de pagar". Gana la nota para esos botones; el resto sigue el valor.

---

## 5. Del configurador al archivo: qué paso llena cada sección

Este es el plan de construcción. Estados: `[MVP]` primera versión · `[v0.2]` siguiente · `[futuro]` más adelante · `[idea]` sin decidir.

| Paso del configurador | Llena | Estado | Cómo se elige |
|---|---|---|---|
| 1. ¿Qué es tu proyecto? | §2, §4 (parcial) | `[MVP]` hecho | Tipo con tarjetas visuales; nombre, descripción y objetivo como texto corto |
| 2. Pantallas y navegación | §3 | `[MVP]` hecho | Plantillas por tipo de proyecto (se agregan o quitan pantallas); patrón de navegación con vista previa |
| 3. Qué hace | §4 | `[MVP]` hecho | Acciones clave como texto; integraciones con casillas; "fuera de alcance" |
| 4. Dirección visual | §5, precarga §6–§12 | `[MVP]` hecho | 4 direcciones con vista previa; anti-referencias como texto |
| 5. Color | §6 | `[MVP]` hecho | 4 paletas del catálogo · `[v0.2]` paleta personalizada con verificación de contraste · `[v0.2]` modo oscuro |
| 6. Tipografía | §7 | `[MVP]` hecho | 4 fuentes, elegidas por separado para títulos y texto · `[v0.2]` contraste de tamaños (sutil/medio/dramático) |
| 7. Forma | §9 | `[MVP]` hecho | 4 radios · `[v0.2]` sombras y bordes |
| 8. Espaciado | §8 | `[v0.2]` | Densidad con vista previa |
| 9. Componentes | §10 | `[v0.2]` | Estilo de inputs, cards, indicador de navegación · `[futuro]` estados especiales con vista previa |
| 10. Movimiento | §12 | `[MVP]` hecho | 3 niveles que se ven en movimiento · `[v0.2]` qué se anima, uno por uno |
| 11. Iconos e imágenes | §11 | `[v0.2]` | Librerías con muestra |
| 12. Contenido y tono | §13 | `[v0.2]` | Voz y tratamiento con frases de ejemplo |
| 13. Revisar y exportar | §17, §18, genera §1, §14, §15, §16 | `[MVP]` hecho | Resumen, notas generales, lista de pendientes, descarga |

**Funciones transversales:**

| Función | Estado |
|---|---|
| Nota de texto en cada paso | `[MVP]` hecho |
| Vista previa en vivo que refleja todo lo elegido (computadora y celular) | `[MVP]` hecho |
| Descargar `DESIGN.md` | `[MVP]` hecho |
| Copiar el contenido al portapapeles | `[MVP]` hecho |
| Guardar el progreso en el navegador | `[MVP]` hecho |
| **Importar un `DESIGN.md` para seguir editándolo** | `[v0.2]`. Clave para iterar: el archivo es a la vez salida y entrada. |
| Verificación automática de contraste | `[v0.2]` |
| Exportar `preview.html` con la vista previa del estilo | `[v0.2]` |
| Exportar tokens como Tailwind y JSON | `[v0.2]` |
| Opción "que decida la IA" (`libre`) en cada paso | `[v0.2]` |
| Proponer dirección a partir de una descripción (con IA, necesita API key) | `[futuro]` |
| Extraer paleta y tipografía de una URL de referencia | `[idea]` |

---

## 6. Ejemplo completo exportado

Así se vería un archivo real generado por el MVP. Las secciones `[v0.2]` aparecen con valores por defecto para mostrar el formato completo.

````markdown
```yaml
formato: design-md
version_formato: 0.1.0
generado_por: configurador-diseno
fecha: 2026-11-06
idioma: es
```

# Barbería Sur: DESIGN.md

## 1. Instrucciones para la IA

(texto fijo de §1)

## 2. Proyecto

App para que una barbería de barrio gestione sus turnos desde el celular.

```yaml
nombre: "Barbería Sur"
tipo: app_web
descripcion: "Una app para manejar los turnos de mi barbería sin usar más el cuaderno."
objetivo_principal: "Que reservar y ver los turnos del día lleve segundos"
publico:
  quienes: "El dueño y dos empleados"
  contexto: "En el celular, entre cliente y cliente, con poco tiempo"
  nivel_tecnico: bajo
plataformas: [web_movil, web_escritorio]
idioma_contenido: es
stack_preferido: libre
```

## 3. Estructura

```yaml
navegacion:
  patron: barra_superior
  patron_movil: pestanas_abajo
  items: [Inicio, Turnos, Clientes, Ajustes]
  item_destacado: Turnos
pantallas:
  - id: inicio
    nombre: "Inicio"
    proposito: "Ver de un vistazo el próximo turno y cuántos quedan hoy"
    secciones: [proximo_turno, resumen_del_dia]
    accion_principal: "Reservar turno"
  - id: turnos
    nombre: "Turnos"
    proposito: "Ver y gestionar los turnos por día"
    secciones: [selector_de_dia, lista_de_turnos]
    accion_principal: "Reservar turno"
  - id: clientes
    nombre: "Clientes"
    proposito: "Buscar un cliente y ver su historial"
    secciones: [buscador, lista_de_clientes]
    accion_principal: "Agregar cliente"
  - id: ajustes
    nombre: "Ajustes"
    proposito: "Horarios de atención y servicios"
    secciones: [horarios, servicios_y_precios]
    accion_principal: "Guardar cambios"
flujos:
  - nombre: "Reservar un turno"
    pasos: [turnos, elegir_cliente, elegir_servicio, elegir_horario, confirmar]
```

## 4. Funcionalidades

```yaml
acciones_clave:
  - "Reservar un turno en menos de 15 segundos"
  - "Ver la agenda del día"
  - "Mandar recordatorio por WhatsApp"
datos:
  - entidad: Turno
    campos: [cliente, servicio, fecha, hora, estado]
  - entidad: Cliente
    campos: [nombre, telefono, notas]
  - entidad: Servicio
    campos: [nombre, duracion, precio]
usuarios:
  requiere_cuenta: si
  roles: [dueno, empleado]
integraciones: [whatsapp]
fuera_de_alcance:
  - "Pagos online"
  - "Reservas hechas por los propios clientes"
datos_de_ejemplo: si
nota: "el recordatorio puede ser un link de WhatsApp con el mensaje armado, no hace falta API"
```

## 5. Dirección visual

```yaml
direccion: calmo
palabras_clave: [claro, rapido, confiable]
anti_referencias: ["un banco", "una app de turnos médicos"]
nota: "calmo, pero que no parezca un banco"
```

## 6. Color

```yaml
paleta: azul_electrico
modo: claro
roles:
  fondo: "#FFFFFF"
  superficie: "#F2F4F8"
  superficie_alta: "#FFFFFF"
  borde: "#C9D0DE"
  texto: "#121826"
  texto_suave: "#5B6474"
  acento: "#2F5BFF"
  sobre_acento: "#FFFFFF"
estados: { exito: "#1F7A4D", aviso: "#B45309", error: "#C2272D", info: "#2F5BFF" }
uso_del_acento: moderado
```

## 7. Tipografía

```yaml
familias:
  titulos: "Inter, system-ui, sans-serif"
  texto: "Inter, system-ui, sans-serif"
fuente_origen: google_fonts
escala:
  h1: { tamano: 32px, interlineado: 1.15, peso: 700 }
  h2: { tamano: 24px, interlineado: 1.2, peso: 600 }
  cuerpo: { tamano: 16px, interlineado: 1.5, peso: 400 }
  pequeno: { tamano: 14px, interlineado: 1.45, peso: 400 }
nota: "las horas de los turnos bien grandes, es lo que más miro"
```

## 8. Espaciado y layout

```yaml
unidad_base: 4px
densidad: aireada
ancho_maximo_contenido: 960px
```

## 9. Forma

```yaml
radio: { pequeno: 6px, medio: 14px, grande: 20px, boton: 14px }
bordes: { grosor: 1px, uso: sutil }
elevacion: { estilo: suave }
```

## 10. Componentes

```yaml
botones: { variantes: [primario, secundario, fantasma, peligro], alto_minimo: 44px }
estados_especiales: { vacio: "texto + acción", cargando: esqueleto, error: "mensaje + reintentar" }
```

## 11. Iconos e imágenes

```yaml
iconos: { libreria: lucide, estilo: trazo }
imagenes: { tipo: ninguna }
logo: texto
```

## 12. Movimiento

```yaml
nivel: sutil
duraciones: { rapida: 120ms, media: 160ms, lenta: 280ms }
que_se_anima: { hover_botones: elevar, aparicion_listas: escalonada, cambio_de_pantalla: fundido }
respetar_movimiento_reducido: si
nota: "nada que rebote en formularios"
```

## 13. Contenido y tono

```yaml
voz: cercana
tratamiento: vos
largo_de_textos: corto
formato: { fecha: "mar 12 nov", hora: "24h", moneda: "ARS" }
```

## 14. Accesibilidad

(reglas fijas de §14, nivel AA)

## 15. Responsive

```yaml
enfoque: movil_primero
comportamientos: { navegacion_en_movil: pestanas_abajo, tablas_en_movil: cards }
```

## 16. Tokens

(bloque CSS generado)

## 17. Notas generales

```yaml
notas:
  - "Quiero que se sienta rápida, más que linda."
```

## 18. Pendientes

```yaml
sin_definir:
  - { seccion: 11, campo: logo, bloquea: no }
preguntas_sugeridas:
  - "¿Cuántos días hacia adelante se pueden reservar turnos?"
```
````

---

## 7. Cómo evoluciona este formato

### Versionado

El formato usa versiones `MAYOR.MENOR.PARCHE`:

| Cambio | Sube | Ejemplos |
|---|---|---|
| Se rompe algo que ya existía | **MAYOR** (1.0.0 → 2.0.0) | Renombrar una clave, cambiar un número de sección, cambiar el nombre de una variable CSS |
| Se agrega algo sin romper nada | **MENOR** (0.1.0 → 0.2.0) | Sección nueva, campo nuevo, valor nuevo en una lista de opciones |
| Se aclara sin cambiar el significado | **PARCHE** (0.1.0 → 0.1.1) | Mejor redacción, un ejemplo más, corregir un error de tipeo |

Mientras estemos en `0.x`, los cambios mayores están permitidos pero se registran igual.

### Reglas para agregar cosas

1. **Campos nuevos siempre opcionales**, con un `por_defecto` definido. Así los archivos viejos siguen siendo válidos.
2. **Secciones nuevas al final** (§19, §20…), o en una posición nueva solo con cambio mayor.
3. **Valores nuevos en listas cerradas** (`tipo`, `direccion`, etc.) se agregan; nunca se reutiliza un nombre con otro significado.
4. **Todo cambio en §1 (Instrucciones para la IA)** se prueba antes con al menos 2 IA distintas (ver §9), porque es lo que más impacta en el resultado.

### Proceso de cambio

1. **Detectar.** Una prueba falla, falta algo, o aparece una necesidad nueva. Se anota en §9 o §10.
2. **Proponer.** Se escribe el cambio en §11 como pregunta abierta, o directamente en §3 si es chico.
3. **Probar.** Si afecta cómo la IA construye, se generan 3 exports distintos y se pasan por al menos 2 IA.
4. **Adoptar.** Se edita §3 (y §5 si cambia el configurador), se sube la versión y se anota en §8 y §12.

### Señales de que el formato tiene que cambiar

- La IA ignora sistemáticamente un campo → el campo está mal ubicado, mal nombrado o es ambiguo.
- La persona escribe la misma nota en muchos proyectos → falta una opción en el configurador.
- La IA pregunta siempre lo mismo → falta un campo o un `por_defecto`.
- Un campo nunca se completa → sobra, o va en otro paso.

---

## 8. Registro de decisiones

Formato: fecha · decisión · por qué · alternativas descartadas.

| # | Fecha | Decisión | Por qué | Descartado |
|---|---|---|---|---|
| D1 | 2026-11-06 | El producto es una web pública que exporta un archivo; no un repo que el usuario descarga | Menos fricción: link → elegir → descargar → usar en cualquier IA | Repo starter obligatorio; configurador abierto por Claude |
| D2 | 2026-11-06 | Un solo archivo Markdown con YAML adentro | Lo lee bien una persona, una IA y el importador del configurador | Prompt de texto plano (se diluye); varios archivos (más fricción) |
| D3 | 2026-11-06 | Las instrucciones para la IA van dentro del archivo (§1) | Hace innecesaria una skill y funciona en cualquier IA | Skill de Claude Code como requisito |
| D4 | 2026-11-06 | El configurador no usa IA en el MVP | Gratis, rápido, predecible; la vista previa es CSS | Generar el diseño con IA en cada paso |
| D5 | 2026-11-06 | Se elige primero una dirección visual que precarga el resto | Evita combinaciones que no combinan ("Frankenstein") | Elegir cada parámetro desde cero |
| D6 | 2026-11-06 | Las notas de la persona tienen prioridad sobre los valores | Son la intención; el valor es una aproximación | Notas como comentario informativo |
| D7 | 2026-11-06 | El archivo incluye qué hace la app (§2–§4), no solo cómo se ve | Sin eso la IA sabe pintar pero no qué construir | Archivo solo de diseño visual |
| D8 | 2026-11-06 | Claves YAML en español sin tildes | El público es hispanohablante; sin tildes evita errores de importación | Claves en inglés |
| D9 | 2026-11-06 | Las opciones del configurador viven en un catálogo de datos | Agregar opciones no requiere programar pantallas | Opciones escritas a mano en cada componente |
| D10 | 2026-11-06 | Stack: Vite + React + TypeScript, sin backend; web estática | Gratis de publicar, rápido, sin servidor que mantener | Next.js (no hace falta servidor) |
| D11 | 2026-11-06 | La vista previa y el export derivan de la misma función (`sistemaDeDiseno`) | Garantiza que lo que se ve es lo que se exporta | Calcular la vista previa por separado |
| D12 | 2026-11-06 | En el MVP, §8 y §10 se exportan con valores derivados o por defecto; §11 y §13 no se exportan todavía | Le dan contexto útil a la IA sin agregar pasos; §11 y §13 necesitan su propio paso | Exportar todas las secciones con `sin_definir` |
| D13 | 2026-11-06 | El paso de color muestra el contraste de los pares principales; las paletas del catálogo se verifican en los tests | Adelanta parte de la verificación `[v0.2]` sin costo | Esperar a tener paleta personalizada |

---

## 9. Registro de pruebas

Cada vez que pasamos un export por una IA, se anota acá. Es lo que valida (o corrige) el formato.

| # | Fecha | Versión | Proyecto de prueba | IA | Respetó | Ignoró o inventó | Cambio que generó |
|---|---|---|---|---|---|---|---|
| P1 | | 0.1.0 | Barbería (app web, calmo) | | | | |
| P2 | | 0.1.0 | Landing de producto (audaz) | | | | |
| P3 | | 0.1.0 | Dashboard interno (técnico) | | | | |

**Qué mirar en cada prueba:**
- ¿Usó los tokens o metió colores y medidas sueltos?
- ¿Respetó las notas?
- ¿Agregó pantallas o funciones que no estaban?
- ¿Implementó los estados vacío, cargando y error?
- ¿Preguntó lo de §18 antes de empezar?
- ¿Cumplió accesibilidad (contraste, foco, áreas táctiles)?
- ¿El resultado se parece a la vista previa del configurador?

---

## 10. Backlog e ideas

Lo que todavía no tiene lugar en §5. Se mueve allá cuando se decide hacerlo.

- **Catálogo de secciones de landing**: hero, beneficios, precios, testimonios, preguntas frecuentes, contacto, cada una con variantes visuales.
- **Plantillas de estructura por tipo de proyecto**: que elegir "tienda" ya proponga pantallas típicas.
- **Más direcciones visuales**: lujoso, juguetón, editorial.
- **Catálogo de animaciones** con vista previa de cada una.
- **Comparar dos versiones** lado a lado antes de exportar.
- **Compartir un link** con la configuración, para pedir opinión.
- **Galería de exports de ejemplo** que se pueden abrir y modificar.
- **Starter opcional para Claude Code**: template que ya lee los tokens (para usuarios avanzados, no requisito; ver D1 y D3).
- **Skills internas para construir el configurador**, cuando aparezcan tareas repetidas: `agregar-bloque` (sumar un parámetro de punta a punta) y `revisar-export` (validar un archivo generado).
- **Validador del formato**: un script que verifica que un `DESIGN.md` cumple esta especificación.

---

## 11. Preguntas abiertas

| # | Pregunta | Contexto | Estado |
|---|---|---|---|
| Q1 | ¿Cuántos pasos tiene el MVP como máximo antes de que la gente abandone? | §5 tiene 8 pasos `[MVP]` | Abierta. Probar con usuarios reales. |
| Q2 | ¿El paso de "qué hace" va antes o después del diseño visual? | Antes da contexto al diseño; después engancha más rápido con lo visual | Abierta. Hoy: antes. |
| Q3 | ¿Conviene exportar además un JSON separado para máquinas? | Hoy el YAML dentro del Markdown cumple esa función | Abierta. Decidir al hacer el importador. |
| Q4 | ¿Cómo se maneja un proyecto con más de una dirección visual (por ejemplo, landing audaz y app calma)? | El formato asume una sola | Abierta. |
| Q5 | ¿El configurador va en español solamente o bilingüe? | Las claves están en español (D8) | Abierta. |
| Q6 | ¿Usamos `si`/`no` o `true`/`false` en el YAML? | Con YAML 1.2 `si`/`no` son texto; un lector YAML 1.1 lee `no` como `false`. Para una IA da igual; para importadores de terceros, no | Abierta. Decidir al hacer el importador (v0.2). |

---

## 12. Historial de cambios

| Versión | Fecha | Cambios |
|---|---|---|
| 0.1.0 | 2026-11-06 | Primera versión del formato: 19 secciones, reglas generales, prioridades, plan del configurador, ejemplo completo y registros. |
| 0.1.0 | 2026-11-06 | Sin cambios de formato. Primer configurador implementado (D10 a D13); el export cumple §3 según D12. |
