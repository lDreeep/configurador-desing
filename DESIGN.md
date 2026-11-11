# DESIGN.md: especificación del formato

> **Versión del formato:** 0.8.8 (borrador)
> **Última actualización:** 2026-11-06
> **Estado:** configurador en v0.2 (10 pasos + export): 8 direcciones, 13 paletas + personalizada, 23 fuentes, botones y movimiento detallados. Falta la primera ronda de pruebas con IA (§9).

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
version_formato: 0.8.8
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
| 19 | Estilo visual y layout | Estructura de la página y textura del estilo, con su CSS | obligatoria (desde 0.3.0) |
| 20 | Cajas y contenedores | Cómo son todas las cards, paneles y bloques, con su CSS | solo si se eligió una caja |
| 21 | Componentes de interfaz | Campos, controles y navegación, con estructura HTML y CSS | solo si se eligió alguno |

---

### §0. Encabezado

Ver [§2.5](#25-encabezado-obligatorio). Va al principio, antes del título del proyecto.

---

### §1. Instrucciones para la IA

**Dos modos** (campo `modo` en el encabezado y en §2), según si la persona describió su proyecto:

| Modo | Cuándo | Qué le dice a la IA |
|---|---|---|
| `proyecto` | Hay descripción, objetivo o acciones clave | Construir esa app siguiendo el archivo (texto de abajo) |
| `sistema_de_diseno` | No se describió nada del proyecto (lo normal en el modo rápido) | El archivo es un sistema de diseño: **A)** aplicarlo a una app o web existente conservando su contenido y funcionamiento, o **B)** construir lo que la persona explique en su mensaje. Si no está claro, preguntar primero. Las pantallas y funciones de §3 y §4 pasan a ser solo de referencia, y §18 no marca pendientes que bloqueen. |


**Texto fijo**, igual en todos los exports de la misma versión. El configurador no lo modifica. Es lo que reemplaza a una skill: viaja adentro del archivo.

Texto actual (v0.6.0; la 0.3.0 sumó la regla 10, la 0.5.0 la 11 y la 0.6.0 la 12):

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
10. La sección 19 define el layout y, si hay, el estilo visual: aplicá su
   CSS tal cual (las clases .pg-* son nombres de referencia: usalas o
   mapealas a tus componentes) y respetá sus reglas.
11. Si hay sección 20, todas las cards, paneles y bloques usan esa caja
   (su CSS y sus tokens --caja-*), aunque el estilo de la 19 diga otra cosa.
12. La sección 21 trae campos, controles y navegación: respetá su estructura
   HTML y su CSS (incluidas las animaciones al escribir y al cambiar).
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

Valores precargados por dirección (v0.2.0). La fuente de verdad es `src/catalogo.ts` (`DIRECCIONES`):

| Dirección | Paleta | Tipografía (títulos + texto, peso) | Tamaños | Radio | Sombras · bordes | Botón | Movimiento | Densidad |
|---|---|---|---|---|---|---|---|---|
| calmo | azul_electrico | inter + inter, 700 | sutil | suave | suave · ninguno | relleno | sutil | aireada |
| audaz | tinta_y_lima | space_grotesk + inter, 700 | dramatico | recto | plana · sutil | relleno | expresivo | normal |
| tecnico | bosque | manrope + inter, 600 | sutil | apenas_suave | plana · sutil | relleno | rapido | compacta |
| calido | coral_calido | fraunces + dm_sans, 600 | medio | pildora | suave · ninguno | relleno | sutil | aireada |
| lujoso | noche_dorada | playfair + inter, 500 | dramatico | recto | plana · sutil | contorno | sutil | aireada |
| jugueton | caramelo | unbounded + nunito, 700 | dramatico | pildora | dura · marcado | sombra_dura | expresivo | normal |
| editorial | papel | instrument_serif + source_serif, 400 | extremo | recto | plana · sutil | contorno | sutil | aireada |
| brutalista | alto_contraste | archivo + ibm_plex_sans, 800 | extremo | recto | dura · marcado | sombra_dura | rapido | normal |

---

### §6. Color

**Responde:** qué colores hay y para qué se usa cada uno. Se definen **por rol**, no por nombre ("acento", no "azul").

```yaml
paleta: azul_electrico            # id del catálogo (13) | personalizada
modo: claro                       # claro | oscuro | ambos
modo_por_defecto: claro           # si modo: ambos
personalizada:                    # solo si paleta: personalizada
  base: { fondo: "#FFFFFF", texto: "#121826", acento: "#2F5BFF" }
  ajustados_a_mano: [borde]       # roles que la persona cambió; el resto se calculó desde la base
roles:
  fondo:           "#FFFFFF"
  superficie:      "#F2F4F8"      # cards, barras, zonas agrupadas
  superficie_alta: "#FFFFFF"      # modales, menús flotantes
  borde:           "#C9D0DE"
  texto:           "#121826"
  texto_suave:     "#5B6474"      # secundario, ayudas
  acento:          "#2F5BFF"      # acción principal, links, foco
  sobre_acento:    "#FFFFFF"      # texto encima del acento
  acento_suave:    "#DCE4FF"      # acento mezclado al 16% con el fondo (botón tonal, resaltados)
  # token --color-acento-texto: el acento corregido para usarse como TEXTO (4.5:1 sobre fondo, superficie y acento suave)
estados:
  exito:   "#1F7A4D"
  aviso:   "#B45309"
  error:   "#C2272D"
  info:    "#2F5BFF"
uso_del_acento: moderado          # minimo | moderado | generoso
modo_alterno:                     # solo si la persona pidió los dos modos
  modo: oscuro                    # el opuesto al de la paleta
  cuando: sigue prefers-color-scheme y se fuerza con data-tema="oscuro" en <html>; con interruptor
  roles: { fondo: "#14161C", … }  # los 8 roles, derivados de la paleta (ver reglas)
  contraste_aa: pasa              # pasa | revisar          # minimo | moderado | generoso
nota: "el azul un poco menos frío"
```

**Reglas del formato:**
- Todos los pares texto/fondo cumplen **contraste 4.5:1** (3:1 para texto de 24px o más, y para el acento usado como link o contorno sobre el fondo). Las paletas del catálogo lo cumplen siempre (lo verifican los tests).
- **Paleta personalizada:** la persona elige fondo, texto y acento; superficie, superficie alta, borde, texto suave y texto sobre acento se calculan para que combinen y pasen contraste. Puede ajustar cualquiera a mano. Si un par no pasa, el configurador lo muestra en vivo, **deja exportar igual** y lo anota en §18 con su valor; la IA lo corrige respetando §14.
- Los colores de estado nunca se distinguen solo por el tono: llevan icono o texto.
- **Modo alterno (claro ↔ oscuro):** se deriva de la paleta elegida, no se elige aparte: el fondo nuevo sale del texto original, el texto nuevo del fondo original y el acento se corrige hasta tener 3:1 sobre el fondo nuevo. Así conserva el carácter de la paleta. Los tests verifican que la versión opuesta de cada paleta del catálogo pase todos los pares. En §16 sus tokens van en `@media (prefers-color-scheme: …)` y en `:root[data-tema="…"]`.
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
peso_titulos: 700                 # ajustado a los pesos que tiene la fuente
espaciado_titulos: apretado       # apretado (-0.03em) | normal (0em) | amplio (0.04em)
contraste_tamanos: medio          # sutil (1.2) | medio (1.25) | dramatico (1.333) | extremo (1.5)
proporcion_escala: 1.25           # cómo se generó la escala (informativo)
largo_de_linea_max: 70ch
nota: "títulos más grandes de lo normal"
```

- El configurador genera la escala a partir de 16px y la proporción de `contraste_tamanos`; la persona elige entre 4 opciones, no número por número.
- Catálogo: 23 fuentes de Google Fonts en 6 categorías (sans, geométricas, serif, display, mono, redondeadas) y 10 combinaciones recomendadas. Cualquier par se puede combinar.
- Si la fuente de títulos no tiene el peso pedido, se usa el más cercano disponible y se exporta ese.
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
  uso: sutil                      # ninguno | sutil (1px --color-borde) | marcado (2px --color-texto)
  componente: "1px solid #C9D0DE" # borde de cards y bloques
elevacion:                        # sombras
  estilo: suave                   # plana | suave | marcada | dura (sombra sólida desplazada)
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
  diseno: neon                    # ninguno | uno de los 50 del panel (ver src/botones-disenos.ts)
  clases: "bt bt-neon bt-ef-pulso"
  al_tocar: pulso                 # onda | hundir | gelatina | rebote | pulso | aplastar | brillo | temblor | latido | estallido | propio
  estilo: relleno                 # estilo simple, se usa si diseno: ninguno (relleno | contorno | tonal | elevado | sombra_dura)
  color: acento                   # acento | texto | "#7C3AED"
  color_fondo: "#2F5BFF"          # valor ya resuelto (token --boton-color)
  color_texto: "#FFFFFF"          # elegido para pasar contraste (token --boton-sobre)
  variantes: [primario, secundario, fantasma, peligro]
  primario: "fondo --color-acento, texto --color-sobre-acento"   # se describe según el estilo
  secundario: "fondo transparente, borde --color-borde, texto --color-texto"
  tamano: normal                  # compacto (44px) | normal (48px) | grande (56px); nunca menos de 44px
  alto: 48px
  padding_horizontal: 20px
  texto: 15px
  mayusculas: no
  icono: ninguno                  # ninguno | izquierda | derecha
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

- Si hay `diseno`, la sección sigue con un bloque `css` con **el CSS real del botón principal** (selector `.boton-principal`): la base común, la animación al tocar y el aspecto del diseño. Solo usa tokens de §16.
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
nivel: sutil                      # minimo | rapido | sutil | expresivo (precarga los efectos de abajo)
duraciones:
  rapida: 120ms                   # hover, foco
  media: 160ms                    # aparición de elementos, cambios de estado
  lenta: 280ms                    # modales, transiciones de pantalla
curvas:
  entrada: "cubic-bezier(.2,.7,.3,1)"
  salida:  "cubic-bezier(.4,0,1,1)"
que_se_anima:
  hover_botones: elevar           # nada | oscurecer | brillo | elevar | escalar | sombra | desplazar
  al_presionar: hundir            # nada | hundir
  aparicion_listas: escalonada    # nada | fundido | subir | escalonada | zoom
  cambio_de_pantalla: fundido     # nada | fundido | deslizar | subir | zoom
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

### §19. Estilo visual y layout

**Responde:** cómo se arma la página y qué textura tiene. Es lo que más aleja el resultado del diseño "promedio".

```yaml
layout: bento                     # hero_partido | bento | revista | tipografico | cinta | apiladas | indice | panel_fijo | mosaico | minimo | app_lateral | horizontal
layout_estructura: "Grilla de 4 columnas: el bloque principal ocupa 3×2…"   # descripción para reproducirlo
# También admite autor_concesionario: vehículo recortado, selector UTV/Adventure/Enduro,
# ficha desplegable y consulta simulada; incluye el CSS real de la composición.
estilo: bauhaus                   # clasico | suizo | bauhaus | memphis | neobrutalismo | vidrio | clay | retro_os | terminal | editorial | art_deco | y2k | organico
estilo_palabras_clave: [geométrico, constructivo, primario]
estilo_reglas:
  - "Formas geométricas puras como decoración"
```

Si hay estilo, sigue un bloque `css` con **el CSS real** del estilo. Las clases `.pg-*` son nombres de referencia (`.pg` es la raíz de la página; `.pg-card`, `.pg-titulo`, `.pg-boton`, `.pg-deco` con hijos `.a .b .c`…): la IA las usa tal cual o las mapea a sus componentes. Ese CSS solo usa los tokens de §16 y colores decorativos propios (`--deco-1/2/3`, nunca para texto).

- Fuente de verdad: `src/estilos-visuales.ts`. Cada estilo trae sus **reglas de compatibilidad**: paletas, pares de fuentes, forma, sombras, bordes, botón y movimiento que lo sostienen.
- En el modo rápido, cada combinación (estilo × layout × paleta × tipografía) tiene un **código de 5 caracteres** (por ejemplo `11E71`) que se puede compartir como link (`#c=11E71`). Las paletas pasan de 36: las de la 37 en adelante usan 2 caracteres y el código empieza con `+` (por ejemplo `+110AE71`); los códigos viejos siguen valiendo.

---

### §20. Cajas y contenedores

**Responde:** cómo son todas las cards, paneles y bloques. Se elige un diseño base (29 en `src/cajas.ts`) y se ajusta cada parámetro.

```yaml
diseno_base: vidrio               # superficie | contorno | elevada | flotante | vidrio | velo | neobrutal | neumorfica | hundida | punteada | rayada | doble | cabecera | barra | cortada | ticket | brillo | degradado | puntos | papel | cuaderno | acento | editorial
clases: "caja caja-forma-normal caja-hover-nada"
fondo: superficie                 # superficie | fondo | acento_suave | acento | degradado | puntos | grano | lineas
transparencia: 55%                # 0 = opaca, 90 = casi transparente
desenfoque: 16px                  # desenfoque de lo que está detrás (efecto vidrio)
contorno: { grosor: 1px, linea: solid, color: borde }   # linea: solid | dashed | dotted | double; color: borde | texto | acento
esquinas: 20px                    # o heredar (= --radio-medio)
sombra: suave                     # ninguna | suave | marcada | dura | brillo | interna | relieve
espacio_interno: normal           # compacto (14px) | normal (22px) | amplio (34px)
forma: normal                     # normal | cabecera | barra_lateral | esquina_cortada | ticket | filete
al_pasar_el_mouse: nada           # nada | elevar | borde | escala | inclinar | brillo
ajustado_a_mano: [transparencia]  # parámetros cambiados sobre el diseño base
```

Sigue un bloque `css` con la regla `.caja` y sus modificadores (`.caja-forma-*`, `.caja-hover-*`). Los valores resueltos van como tokens `--caja-fondo`, `--caja-borde`, `--caja-radio`, `--caja-sombra`, `--caja-padding`, `--caja-desenfoque`, `--caja-texto`, `--caja-texto-suave`, `--caja-color-marca` en §16. La transparencia se resuelve con `color-mix(... transparent)`, así funciona sobre cualquier fondo.

- Con fondo `acento` y poca transparencia, el texto de la caja pasa a `sobre_acento` para mantener el contraste.
- La caja de §20 tiene prioridad sobre el aspecto de las cards que traiga el estilo de §19 (regla 11).

---

### §21. Componentes de interfaz

**Responde:** cómo son los campos, controles y la navegación. Sale de la galería (`src/galeria/`): cada categoría tiene una **estructura HTML fija** y diseños que solo cambian el CSS.

```yaml
campo:
  diseno: flotante
  nombre: "Etiqueta flotante"
  descripcion: "La etiqueta está adentro y sube al escribir"
  clases: "cm-campo cm-campo-flotante"
  estructura: "<div class=\"cm-campo cm-campo-flotante\">…</div> — al escribir, se reinicia la clase .escribiendo en .cm-caja."
nav_movil:
  diseno: burbuja
  …
```

Categorías (20):

| Grupo | Categorías (diseños) |
|---|---|
| Botones | `boton_sec` (14, se muestra junto al principal), `boton_icono` (10) |
| Formularios | `campo` (30), `selector` (12, tipo slide, chico y grande), `interruptor` (14), `casilla` (14), `deslizador` (14) |
| Navegación | `nav_movil` (18), `nav_web` (17) |
| Detalles | `etiqueta` (10), `aviso` (8), `cargando` (10), `progreso` (8), `acordeon` (6), `avatar` (6), `tooltip` (6), `modal` (6) |
| Datos | `metrica` (10), `grafico` (10), `tabla` (6) |

Desde 0.8.2, las muestras de **formularios completos** y **productos** incluyen
comportamientos de referencia en `estructura`, además de su CSS:

- Formulario: nombre y contacto obligatorios, error junto al campo con
  `aria-invalid`/`aria-describedby`, foco en el primer error, estado ocupado,
  confirmación en `role="status"`, adjunto y limpieza. La muestra simula el guardado
  localmente y lo dice; el proyecto final debe conectar la operación real.
- Producto: ilustración propia de muestra (reemplazable por fotografía), favoritos,
  color, talle, disponibilidad y confirmación al agregar/quitar. Cada instancia
  usa identificadores y grupos de radio únicos. Si falta talle, se anuncia el
  problema y se enfoca el selector. Las fichas «Mínima» conservan su carácter de
  exhibición, sin controles de compra.
- La estructura y los estados usan clases `cm-fo-error`, `cm-fo-resultado`,
  `cm-pr-ilustracion`, `cm-pr-opciones`, `cm-pr-colores`, `cm-pr-talle`,
  `cm-pr-error`, `cm-pr-disponible`, `cm-pr-confirmacion`. Su CSS viaja en §21.
- Se agregan 12 diseños propios, sin copiar referencias de marcas, en
  `src/galeria/coleccion-curada.ts`: formularios `expediente`, `editorial_abierto`,
  `panel_operativo`, `recorrido_movil`; navegación web `lateral_espacios`,
  `cabecera_doble`, `indice_numerado`, `muelle_iconos`; productos `ficha_editorial`,
  `catalogo_detallado`, `escaparate`, `pedido_rapido`. Los ids anteriores se conservan.
- La galería permite comparar hasta tres diseños de una misma categoría con
  contenido idéntico. La comparación es una herramienta de elección: no cambia
  el formato exportado ni agrega pasos. Al cambiar de categoría se limpia.

Los gráficos siguen la guía de visualización del proyecto: una serie por color (los de partes de un total usan pasos de luminosidad de un mismo tono, con leyenda y valores), marcas finas, extremos de 4px redondeados apoyados en la base, líneas de 2px, grilla tenue, textos con los colores de texto y un tooltip (`<title>`) en cada marca. Los estados de las tablas llevan punto + texto, nunca solo color. Sigue un bloque `css` con la base de cada categoría y el diseño elegido. Las barras de navegación usan `--i` (pestaña activa) y `--n` (cantidad) para mover sus indicadores.

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
| 5. Color | §6 | `[v0.2]` hecho | 13 paletas (claras y oscuras) · paleta personalizada (fondo, texto, acento + ajuste a mano) con contraste en vivo · `[futuro]` modo claro y oscuro a la vez |
| 6. Tipografía | §7 | `[v0.2]` hecho | 23 fuentes con filtro por categoría, 10 combinaciones, peso y espaciado de títulos, contraste de tamaños (4 niveles) |
| 7. Forma | §9 | `[v0.2]` hecho | 4 radios, 4 sombras (incluida la dura), 3 bordes, con mini vista previa |
| 7b. Botones | §10 (botones) | `[v0.2]` hecho | 5 estilos, 3 tamaños, mayúsculas, icono; cada opción con su botón de muestra |
| 8. Espaciado | §8 | `[v0.2]` | Densidad con vista previa |
| 9. Componentes | §10 | `[v0.3]` | Estilo de inputs, cards, indicador de navegación · `[futuro]` estados especiales con vista previa |
| 10. Movimiento | §12 | `[v0.2]` hecho | 4 niveles + hover (7), al presionar (2), aparición (5) y cambio de pantalla (5), cada uno por separado; «Repetir animación» en la vista previa |
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
| Verificación automática de contraste | `[v0.2]` hecho (en vivo en el paso de color y anotada en §18) |
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
version_formato: 0.8.1
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
| D14 | 2026-11-06 | Paleta personalizada con 3 colores base (fondo, texto, acento) y el resto calculado, con ajuste a mano opcional | Elegir 8 colores desde cero casi siempre termina en algo que no combina o no se lee | Pedir los 8 roles siempre |
| D15 | 2026-11-06 | Un contraste que no pasa no bloquea el export: se avisa y se anota en §18 | Bloquear frustra; la IA puede corregirlo con §14 como regla | Bloquear el export (lo que decía la v0.1.0) |
| D16 | 2026-11-06 | Botones como paso propio, antes de Movimiento | Es lo que más se toca y lo que más carácter da; mezclado con Forma quedaba escondido | Meterlos en Forma o Componentes |
| D17 | 2026-11-06 | Los niveles de movimiento precargan cada efecto, que después se ajusta por separado | Mismo criterio que las direcciones (D5): coherente por defecto, fino si se quiere | Solo niveles, o solo efectos sueltos |
| D18 | 2026-11-06 | Las fuentes se cargan todas desde Google Fonts al abrir el configurador | Cada opción se ve con su forma real; una sola petición | Cargar cada fuente al elegirla (la lista se vería con la fuente equivocada) |
| D19 | 2026-11-06 | Cada paso muestra lo esencial y guarda el resto en «Ver opciones avanzadas» (se recuerda por paso) | Había demasiada información a la vista; lo avanzado sigue a un clic | Un interruptor global de modo avanzado |
| D20 | 2026-11-06 | Los botones de muestra se animan al tocarlos (en las opciones y en la vista previa) | Una animación de click solo se puede elegir viéndola | Describirla con texto |
| D21 | 2026-11-06 | Se suma un **modo rápido** visual (galerías para deslizar y tocar) que edita la misma configuración que el modo actual, que pasa a ser el **modo avanzado** | Elegir viendo es más intuitivo; un solo modelo de datos evita dos productos | Reemplazar el modo actual |
| D22 | 2026-11-06 | Se suma la dimensión **estilo visual** (movimiento estético) con reglas de compatibilidad, además de layouts independientes | Es lo que cambia "otra paleta" por "otro mundo visual"; las reglas evitan combinaciones feas | Azar total entre todas las opciones |
| D23 | 2026-11-06 | El CSS de cada estilo se escribe una sola vez y se usa en la vista previa y en el export (§19) | La IA copia en vez de interpretar; lo que se ve es lo que se exporta | Describir las texturas con palabras |
| D24 | 2026-11-06 | Entrar al modo rápido no pisa una config armada a mano: la combinación se aplica recién al deslizar o al elegir «Me gusta esta» | Cambiar de modo no debe borrar trabajo | Aplicar siempre la combinación visible |
| D25 | 2026-11-06 | El catálogo crece con referencias externas traducidas a entradas de datos (estilos, layouts, componentes), no con diseños hechos a mano | Combinar dimensiones multiplica las opciones; cada entrada nueva multiplica todo lo demás | Dibujar páginas una por una |
| D26 | 2026-11-06 | El inicio es la página entera (sin marco) con contenido propio del producto, y cambia de diseño solo; se puede pausar | El producto se demuestra a sí mismo; pausar es obligatorio por accesibilidad (contenido que cambia solo) | Pantalla con marco para deslizar a mano (etapa 2 original) |
| D27 | 2026-11-06 | «Comenzar» guarda el diseño que estaba a la vista y propone un botón que combina con ese estilo | Lo que se eligió sin darse cuenta ya es una decisión válida | Volver a elegir el estilo después |
| D28 | 2026-11-06 | Los diseños de botón son entradas de datos con su CSS (aspecto + hover + animación al tocar); se exportan tal cual | Mismo criterio que los estilos (D23): la IA copia | Combinar a mano forma × textura × animación |
| D29 | 2026-11-06 | El color del botón es un token propio (`--boton-color` / `--boton-sobre`); el texto se elige solo para pasar contraste | Permite botones de otro color sin romper la paleta | Atar el botón siempre al acento |
| D30 | 2026-11-06 | Una sola transición entre diseños (el nuevo entra deslizándose y enfocándose, el anterior se va difuminándose) | Varias transiciones distintas no combinaban entre sí; una sola se siente natural | Transición al azar entre cinco |
| D31 | 2026-11-06 | «Comenzar» es fijo en el centro y no cambia de aspecto; la página de atrás es solo fondo hasta tocarlo | Tiene que estar siempre en el mismo lugar; un botón que cambia con cada diseño se pierde | Usar el botón de cada diseño |
| D32 | 2026-11-06 | Al comenzar, la misma página se despliega en modo elección: se detiene, aparecen flechas y el botón central baja y pasa a «Elegir este diseño» | Continuidad: lo que estabas viendo es lo que empezás a elegir | Ir a otra pantalla para elegir |
| D33 | 2026-11-06 | Cajas como paso propio con diseño base + ajustes por parámetro; la caja elegida gana sobre las cards del estilo | Las cajas son la mitad de cualquier interfaz; mismo criterio que direcciones y movimiento (D5, D17) | Dejarlas atadas al estilo |
| D34 | 2026-11-06 | El modo rápido es el producto principal; el avanzado queda para ajustes finos al final | Es lo que la persona disfruta usar y lo que le deja un sistema claro (botones, paleta, cajas, componentes) | Llevar a todos por el avanzado |
| D35 | 2026-11-06 | La galería se organiza por categorías con estructura HTML fija y diseños que solo cambian el CSS | Sumar diseños es sumar datos; la IA recibe estructura + CSS reproducibles | Un componente React distinto por diseño |
| D36 | 2026-11-06 | Las referencias externas se convierten en entradas con la skill `agregar-diseno-desde-referencia` | Que cada entrada nueva salga con la misma calidad (solo tokens, accesible, sin marcas) | Copiar el código de cada sitio |
| D37 | 2026-11-06 | Primera ampliación grande del catálogo hecha por Claude a partir de patrones conocidos (sin copiar sitios): 50 botones, 30 campos, 14 interruptores, 14 casillas, 14 deslizadores, 18 barras inferiores, 17 navegaciones web, 29 cajas, 33 fuentes | Llenar la base rápido con lo conocido; lo distintivo vendrá de referencias reales (D25, D36) | Esperar a tener referencias para todo |
| D38 | 2026-11-06 | El botón secundario se elige viéndolo junto al principal | Los botones van de a pares; elegirlos sueltos no muestra si combinan | Elegir el secundario por separado |
| D39 | 2026-11-06 | En dashboards y apps web, el panel de datos aparece antes que los formularios | Es lo central de esos proyectos | Mismo orden para todos |
| D40 | 2026-11-06 | Cada categoría nueva arranca con 6 a 14 diseños; se amplía después | Primero cubrir todos los elementos, después la profundidad de cada uno | Completar una categoría antes de empezar otra |
| D41 | 2026-11-06 | Antes de descargar, un prototipo navegable usa todas las elecciones juntas y permite cambiarlas ahí mismo | Lo que se elige por separado tiene que probarse en conjunto; corregir en contexto es más fácil que volver paso por paso | Descargar directamente después del último panel |
| D42 | 2026-11-06 | En celular, el prototipo es un smartphone con proporciones reales (390 × 844), barra de estado, isla y barra de inicio, y el contenido se adapta como app (barra superior fija, carruseles, botones a lo ancho, tabla como lista, una columna); abierto desde un teléfono ocupa la pantalla sin marco | Así se evalúa de verdad cómo se ve la app en un teléfono | Mostrar el diseño de escritorio achicado |
| D44 | 2026-11-07 | En el inicio, en modo elección, se puede cambiar solo el layout o solo el estilo, y ver todos los layouts como esquemas para saltar directo | Antes había que pasar combinaciones al azar hasta encontrar la estructura buscada | Un paso extra «Elegí el layout» (más pasos en el modo rápido) |
| D45 | 2026-11-07 | Paso «Movimiento» en el modo rápido (antes del prototipo), con demos que se repiten solas; también en el editor del prototipo | El movimiento solo existía en el modo avanzado y no se veía | Animaciones de fondo en bucle infinito: distraen y van contra prefers-reduced-motion |
| D46 | 2026-11-07 | Modo claro/oscuro: el opuesto se deriva de la paleta y se ve en el prototipo; incluirlo en el archivo es opcional (`visual.ambosModos`) | Casi toda app pide los dos modos y armarlo a mano rompe el contraste | Elegir una segunda paleta del catálogo (no garantiza que combinen) |
| D47 | 2026-11-07 | Salidas extra en el paso final: tokens.json (formato W3C Design Tokens), tokens.css y un prompt corto | Figma (Tokens Studio) y Style Dictionary leen el JSON; el prompt corto sirve cuando no se puede adjuntar | Exportar código React/Tailwind: depende del proyecto de cada persona y duplica lo que la IA ya hace con el DESIGN.md |
| D48 | 2026-11-07 | Estilos «Minimal tecnológico», «Oscuro de precisión» y «Producto amable» en vez de presets con nombres de marcas | Cubren lo que se busca al decir «como tal producto» sin copiar marcas (regla legal de §1) | Presets con nombre de empresas reales |
| D49 | 2026-11-07 | Recomendados según el tipo de proyecto (`src/recomendados.ts`): cada panel muestra primero «★ Recomendados para tu …» y abajo todas las demás opciones; al elegir el tipo, si el layout o el estilo no le quedan bien, se ofrecen hasta 3 alternativas en miniatura (o seguir con el propio); el prototipo usa textos del tipo (productos y carrito, métricas, trabajos…) | Que la herramienta guíe hacia lo que funciona para cada proyecto sin quitar opciones | Filtrar y mostrar solo lo recomendado (achica las posibilidades) |
| D50 | 2026-11-07 | El modo rápido ofrece los 8 tipos de proyecto (suma sitio con secciones, portfolio y blog) | Son proyectos muy comunes y tienen recomendaciones propias | — |
| D51 | 2026-11-07 | En los pasos con pestañas, «Siguiente» avanza de a una pestaña (con «Paso 5 · 2 de 5: Selectores» arriba) y solo en la última pasa al paso siguiente; «Volver» retrocede de a una y al volver desde el paso siguiente se entra por la última | Era fácil tocar «Seguir» abajo sin ver las otras pestañas y saltearse categorías enteras | Obligar a elegir en cada pestaña (frena a quien no le importa ese detalle) |
| D52 | 2026-11-07 | Barra de pasos fija arriba en el modo rápido: todos los pasos a la vista, el actual marcado, los hechos con ✓ y cualquiera se toca para ir directo; la numeración («Paso 6 de 12 · Formularios») sale del orden real según el tipo de proyecto | La numeración a mano se desordenaba (había «Paso 3 · segunda parte») y no se veía cuánto faltaba | Solo un número de paso sin poder saltar |
| D53 | 2026-11-07 | En el celular, el pie usa textos cortos («‹ Volver», «Siguiente ›») en un renglón, la barra de pasos muestra solo números salvo el actual y el prototipo deja cambiar claro/oscuro | El pie ocupaba dos renglones y tapaba contenido | — |
| D54 | 2026-11-07 | La portada carga sola; paneles, prototipo, exportación, CSS de la galería y modo avanzado se bajan aparte, en segundo plano a los 2,5 s de abrir | La primera carga pasó de 145 KB a 84 KB comprimidos | Cargar todo junto |
| D55 | 2026-11-07 | Botones por familias (mismo aspecto, otra animación al pasar): cada familia muestra uno y «Ver variantes» despliega el resto; los 16 más llamativos van en «Experimentales», plegado; la animación al tocar se elige aparte y se combina con cualquier diseño (`botones.efecto`) | 80 botones juntos abrumaban; ahora la vista inicial muestra 53 y nada se pierde | Esconder los experimentales del todo |
| D56 | 2026-11-07 | Revisión de accesibilidad con axe en todos los pasos: `<main>` en el modo rápido, capas ocultas del inicio con `inert`, h1 en el modo elección, etiquetas únicas en las navegaciones de ejemplo, token `--color-acento-texto` y estados de datos mezclados con el texto para pasar 4.5:1 en cualquier paleta | axe marcaba contraste y estructura según la paleta que saliera | — |
| D57 | 2026-11-07 | 6 categorías nuevas en la galería, con 8 diseños cada una: menús desplegables y buscadores (paso Formularios), migas de pan, paginación y pasos (paso Navegación), pantallas vacías (paso Detalles); se ven también en el prototipo y tienen recomendados por tipo | Son piezas que casi toda app necesita y la IA las inventaba sin guía | Sumarlas como pasos nuevos (alarga el recorrido) |
| D58 | 2026-11-07 | 5 estilos más (20 en total): Diario, Calma japonesa, Dopamina, Lujo sobrio y Cyber, con sus reglas, paletas, letras y botón | Cubren pedidos frecuentes («como un diario», «minimalista japonés», «colorido», «de lujo», «gamer») sin copiar marcas | — |
| D59 | 2026-11-07 | 32 diseños más en categorías que tenían pocos (avisos, barras de progreso, acordeones, avatares, tooltips, ventanas y tablas), en `src/galeria/mas-disenos.ts`; se suman al final de cada categoría sin pisar ninguno (lo verifica un test) | Varias categorías tenían solo 6 opciones | — |
| D60 | 2026-11-07 | 3 layouts más (15 en total): Galería de productos, Planes y precios y Portada con video, con su esquema y recomendados por tipo | Tiendas, servicios con suscripción y marcas visuales los piden mucho | — |
| D61 | 2026-11-07 | Calendarios (9 diseños, en Formularios), carruseles (8, en Detalles) y pies de página (9, en Navegación); también dentro del prototipo. 2 layouts más (17): Blog con barra lateral y Equipo y testimonios | Piezas que casi todo sitio necesita | — |
| D62 | 2026-11-07 | 10 paletas más (32 en total: Durazno, Cielo, Uva, Oliva, Rosa chicle, Terracota, Medianoche violeta, Bosque de noche, Carbón y coral, Vino), sumadas a los estilos que combinan; 19 diseños más en etiquetas, cargas, métricas y selectores | Más variedad de color y de piezas chicas; todas las paletas pasan AA también en su versión opuesta | — |
| D63 | 2026-11-07 | «Formularios completos» (14 diseños: Clásico apilado, Lista agrupada tipo ajustes del celular, Secciones en tarjetas, Etiqueta al costado, Títulos al costado, Subrayado, Campos rellenos, Etiqueta adentro, Por pasos numerados, Compacto, Oscuro, Vidrio, Botones a lo ancho, Neobrutal) como primera pestaña de Formularios, y «Subir archivos» (8 diseños) como última; el formulario elegido se ve en la pantalla de carga del prototipo | La persona carga datos de algo (un cliente, un vehículo, un pedido) y quiere ver la pantalla entera, no solo los campos sueltos; el estilo «Lista agrupada» sale de su app de guardería | — |
| D64 | 2026-11-07 | Tarjetas de producto (8, en Detalles), notificaciones (8) y menú de usuario (8, en Navegación); 14 diseños más en interruptores, casillas y deslizadores | Piezas típicas de tiendas y apps con cuenta, y más variedad en controles | — |
| D65 | 2026-11-07 | El formulario completo cambia de contenido según el tipo de proyecto (checkout en tienda, registro en app de celular, alta de cliente en dashboard, presupuesto en web, propuesta en blog); 6 diseños más de formulario (20 en total) e «Inicio de sesión» (10 diseños) como segunda pestaña de Formularios | Ver la pantalla con datos de su propio proyecto ayuda a elegir; el login es una pantalla que casi toda app necesita | — |
| D66 | 2026-11-07 | Formularios en pasos (8 diseños) y reserva de turnos (8) en el paso Formularios; 15 cajas más (44 en total); 8 diseños más de navegación | Registros largos y turnos son de lo más pedido; más variedad en cards y barras | — |
| D67 | 2026-11-08 | 21 fondos con textura (`src/fondos.ts`): fieltro, vidrio acanalado, térmico, agua, grafito, paisaje de un tono, plano técnico, semitono, grano, pasto, tramado, papel, curvas de nivel, cielo, mosaico de píxeles, lente, punteado, grilla de cuadraditos, foto desenfocada, iridiscente e impresionista. Son CSS puro (gradientes y SVG generados), los que pueden usan la paleta; se eligen en el inicio («Fondo ‹ ›») y en el editor del prototipo, viajan en el código de la combinación (6.º carácter) y se exportan en §19. Se suman 4 composiciones que los lucen, con el texto siempre sobre un velo o una tarjeta sólida | Los diseños planos se ven genéricos; un fondo con textura le da carácter y es lo que más se nota en una portada | Fotos o imágenes de stock: pesan, tienen derechos y no se adaptan a la paleta |
| D68 | 2026-11-08 | Skills de diseño en el repo: `frontend-design` (Anthropic, Apache 2.0) y `ui-ux-pro-max` (copiada del repo de la guardería). Primera aplicación: el visual del hero deja de ser un bloque de color y pasa a ser una escena (ventana del producto con datos del proyecto y dos avisos), y las cards llevan un ícono en vez de «01/02/03» | Las páginas de muestra se veían planas y genéricas | — |
| D69 | 2026-11-08 | Se suma la skill `design-taste-frontend` (taste-skill 2.5.1, MIT) en `.claude/skills/`, a pedido; `.claude` va en `.vercelignore` para no subir sus 40 MB al deploy | La persona la eligió para mejorar el diseño de las páginas | — |
| D70 | 2026-11-08 | Las 21 páginas de muestra siguen la skill `design-taste-frontend`: contenido de muestra por tipo de proyecto (`src/rapido/contenido-tipo.ts`; título que dice qué es y para quién, un dato concreto, botones verbo + objeto, sin eslóganes), visuales que nunca quedan vacíos (escena del producto en el hero, fondos con textura en fotos de producto, artículos, personas y mosaico), un fragmento de interfaz en cada tarjeta, sin etiquetas de relleno sobre los títulos, sin numeración que no es secuencia, una sola entrada animada (el hero) y un cierre con pie en fondo invertido en todas | Las páginas se veían planas y con recursos típicos de las generadas por IA | Copiar los scripts de la skill (están hechos para sitios terminados con fotos reales) |
| D71 | 2026-11-08 | Se suman las skills `impeccable`, `web-design-guidelines`, `web-design-engineer` y `shadcn` en `.claude/skills/` (además de `frontend-design` y `design-taste-frontend`, ya instaladas) | La persona las eligió para mejorar y auditar el diseño | — |
| D72 | 2026-11-08 | Scroll interactivo en las páginas de muestra, con CSS scroll-driven animations (sin librerías): sección «Recorrido» (4 pasos y un visual fijo que cambia con cada uno) en Hero partido, Afiche tipográfico, Portada con video, Mínimo, Fondo protagonista y Editorial con fondo; galería horizontal que avanza al bajar en Paneles horizontales; el visual del hero se aleja al salir. Todo dentro de @supports y prefers-reduced-motion. La raíz de la página pasa de overflow hidden a clip y la portada deja de ser un contenedor de scroll, para que sticky y las líneas de tiempo funcionen. Pulido de Vercel: text-wrap balance/pretty y números tabulares | Pedido de la persona; la skill impeccable lo recomienda solo cuando el scroll cuenta algo (acá, los pasos de cómo funciona) | Librerías como GSAP ScrollTrigger: suman peso y no se exportan como CSS |
| D73 | 2026-11-08 | «Plantillas de autor»: páginas diseñadas una por una para un negocio concreto (panadería con fotos reales, app financiera con su interfaz como protagonista, portfolio de estudio con índice y grilla de fotos), en `src/rapido/autor.tsx` y `autor.css`. Cada una tiene una receta (estilo, paleta, letra) con la que se diseñó (`RECETAS_AUTOR`); sobre ella la persona cambia lo que quiera y todo entra por tokens. Aparecen primero en «Ver todos los layouts» y en la rotación de la portada. Las fotos son de Wikimedia Commons (CC0, CC BY, CC BY-SA, dominio público), tomadas de la biblioteca curada de taste-skill, con autor y licencia en el pie | Las combinaciones estilo × layout con contenido genérico seguían viéndose «de IA»; una página pensada para un negocio concreto tiene de dónde sacar personalidad | Más combinaciones genéricas |
| D74 | 2026-11-08 | 5 plantillas de autor más (8 en total): festival (nombre gigante sobre manchas de calor y cartel de artistas), app para correr (mapa con la ruta sobre curvas de nivel), cafetería (foto del espresso y pizarra de precios), florería (collage y selector de plan que cambia el precio) y refugio de montaña (paisaje a sangre con barra de reserva), en `src/rapido/autor2.tsx` | Más variedad de páginas con personalidad, a pedido | — |
| D75 | 2026-11-09 | Recorrido simple por defecto en 5 pasos: Diseño → Proyecto → **Tu UI** → Prototipo → Descargar. «Tu UI» (`src/rapido/PanelPaquete.tsx`) muestra todas las piezas a la vez, funcionando, armadas como un paquete coherente de una familia (`src/familias.ts`: clásica, suave, líneas finas, editorial, tonal, neobrutal, vidrio, oscura, neón, retro; cada estilo tiene sus 3 familias preferidas); «Otra combinación ›» cambia todo a la vez. Los 12 pasos de siempre quedan como **modo detallado** (link «Usar el modo detallado»). En el prototipo, «Editar» vuelve tocable cada pieza: al tocarla el resto se desenfoca, aparecen flechas a los costados y una barra con Diseño ‹ › y Animación ‹ ›, Cancelar y Confirmar. El archivo exportado no cambia | Elegir de a una pieza en 12 pasos era demasiado; la persona quiere la variedad con la facilidad de elegir combinaciones enteras y retocar al final | Esconder opciones o quitar el modo pieza por pieza |
| D76 | 2026-11-09 | 4 plantillas de autor «landing que convierte» (13 en total), en `src/rapido/autor3.tsx` y `autor3.css`: turnos online para consultorios, curso online, restaurante y estudio de entrenamiento. Aplican las skills `landing-page-design` (una sola acción repetida arriba y al final, titular con resultado, prueba al lado de la promesa, frase grande que se enciende palabra por palabra al bajar, tres pasos, precios con reversión de riesgo, preguntas desplegables) y `stageshow` (el producto como protagonista en una demo animada con cursor o dedo donde pasa una sola cosa con causa visible: guardar un turno, terminar una clase, reservar mesa, reservar cupo; ventana recortada contra el borde y un satélite sobre el borde; palabras reales solo donde mira el ojo y barras en el resto; la demo corre solo a la vista y con movimiento reducido queda quieta en el resultado). Extras interactivos: selector mensual/anual, comparador antes y después, selector de frecuencia que cambia el precio | Pedido de más opciones de landing con mejor visual usando las dos skills nuevas | Copiar el kit entero de stageshow (se escribió una versión chica con los tokens del configurador) |
| D77 | 2026-11-09 | Mejora de todas las páginas con las skills `landing-page-design` y `stageshow`. Estructuras genéricas (todas menos app con menú lateral): línea de prueba bajo los botones del hero; la ventana del hero pasa a ser una demo con cursor (toca una fila, la acción queda hecha, sube la barra, asoma el aviso; el reinicio lo causa cambiar de período); antes del cierre, sección «argumento» con frase que se enciende palabra por palabra, testimonio con nombre (con la letra y la tarjeta del estilo elegido) y preguntas frecuentes. Cada tipo de proyecto tiene su prueba, frase, testimonio y preguntas en `contenido-tipo.ts`; la portada del configurador no lleva testimonio porque es un producto real. Plantillas de autor anteriores: prueba en el hero de todas (menos Tracción), frase que se enciende en panadería, finanzas, portfolio, correr, cafetería, florería y refugio; preguntas y cierre con la misma acción en florería y refugio; el celular de finanzas cuenta solo cómo llega un pago y sube el ahorro, y la ruta de correr se dibuja al entrar en pantalla (una sola vez; con movimiento reducido quedan en el resultado). Las piezas animadas están en `src/rapido/demo.tsx`. Arreglado de paso: el visual del recorrido tenía un botón enfocable dentro de un bloque oculto para lectores de pantalla (ahora `inert`) | Las páginas terminaban enseguida y el producto se mostraba quieto; las skills piden prueba junto a la promesa, objeciones respondidas y el producto en acción | Rehacer cada layout por separado |
| D78 | 2026-11-09 | «Tu UI» como un único mosaico que encastra: todas las piezas en una sola grilla de filas de 4px donde cada pieza mide su alto real y ocupa justo esas filas (`grid-auto-flow: dense`), así las chicas rellenan el lugar junto a las grandes. Sin cortes por sección (cada pieza dice qué es en su etiqueta), cabecera y márgenes más chicos, y en el celular las piezas chicas van de a dos. La página pasó de 7.000 a 4.400 px de alto en la compu. El archivo exportado no cambia | La pantalla se veía muy grande y con huecos; la persona la imaginaba toda junta, encastrada | Columnas CSS (no permiten piezas que ocupen dos columnas) |
| D79 | 2026-11-11 | **Nombre: Molde.** La herramienta pasa a llamarse Molde (ver `PLAN.md`). Falta verificar marca y dominio | Nombre corto que describe lo que hace: la página se moldea con las ideas elegidas | Mantener «configurador» |
| D80 | 2026-11-11 | **Un solo lienzo:** la página de la persona está siempre en pantalla; el marco (gris yeso, tinta berenjena, rosa silicona) no cambia con el estilo elegido | Que se vea qué cambia con cada elección, sin que el marco compita con el diseño | Una pantalla distinta por paso |
| D81 | 2026-11-11 | **Rondas de ideas:** el botón del centro explota en opciones, de a 6 como máximo, con flechas para ver más | Pocas opciones a la vez se comparan mejor que un catálogo entero | Grillas largas con todo el catálogo |
| D82 | 2026-11-11 | **Ver antes de elegir:** pasar el mouse muestra la idea en toda la página y la opción se vuelve translúcida; clic o arrastrar al centro la elige. En celular: un toque muestra y «Usar» confirma | Elegir viendo el resultado real, no una miniatura | Elegir y recién después ver |
| D83 | 2026-11-11 | **Nunca vuelve a blanco:** lo elegido queda; solo «Empezar de cero» vacía la página | Evita perder trabajo por un clic | Reiniciar al cambiar de ronda |
| D84 | 2026-11-11 | **Sin modo avanzado aparte:** lo elegido queda como fichas; tocar una vuelve a abrir esa ronda y sus ajustes finos | Un solo recorrido en vez de dos modos | Mantener modo rápido y avanzado separados |
| D85 | 2026-11-11 | **Ramas:** cada tipo de proyecto ve sus propias rondas y recomendaciones, no todo el catálogo (una landing ve fondo animado y scroll; un sistema de stock ve estadísticas) | Cada proyecto necesita decisiones distintas | Mismas rondas para todos |
| D86 | 2026-11-11 | **Scroll combinable:** se puede elegir más de un efecto de scroll, uno por zona (`PLAN.md` §7.4) | Los efectos de zonas distintas no se pisan y dan más combinaciones | Un único efecto por página |
| D87 | 2026-11-11 | **Portada:** casi en blanco, con piezas en movimiento; al bajar se arman páginas al azar y «Empezar» sube y queda fijo | Mostrar el producto en acción sin texto de más | Portada con explicación larga |
| D88 | 2026-11-11 | **Descarga:** `DESIGN.md` y, además, la página armada en HTML. Orden de rondas: Proyecto → Rubro → Color → Layout → Estilo (obligatorias), luego Piezas · Letra · Entrada · rondas de la rama (opcionales), y Ajustar → Descargar | La persona se lleva algo que ya puede abrir, y puede terminar cuando quiera | Solo `DESIGN.md` |
| D89 | 2026-11-11 | Motor de scroll combinable (`src/scroll.ts`, tarea D7): cada efecto tiene zona, CSS y versión quieta; se combinan hasta 3, uno por zona. Elegir uno de una zona ocupada lo reemplaza, elegir uno ya puesto lo saca y, si pasan de 3, sale el más viejo. Solo animan `opacity`, `translate`, `scale`, `filter` y `clip-path` como propiedades sueltas, dentro de @supports y prefers-reduced-motion. En Molde la ronda Scroll queda abierta para sumar efectos («Seguir» pasa a la siguiente) y la página se baja sola. Por ahora 4 efectos (uno por zona); el export los suma en F1 | Con propiedades sueltas, un efecto no pisa el `transform` del estilo ni la animación de la entrada, y dos efectos de zonas distintas nunca animan el mismo elemento (lo verifica un test) | Rechazar el clic cuando la zona está ocupada (obliga a sacar a mano); librerías de scroll (D72) |
| D43 | 2026-11-06 | Si la persona no describe un proyecto, el archivo se exporta como sistema de diseño (`modo: sistema_de_diseno`): sirve para mejorar una app existente o para construir lo que se explique junto con el archivo; la pantalla final ofrece un mensaje para copiar para cada caso | El modo rápido no pide detalles del proyecto; tratar las pantallas de ejemplo como obligatorias llevaba a la IA a construir una app genérica | Obligar a completar el proyecto antes de exportar |

| D67 | 2026-11-07 | Se amplían las categorías existentes con 12 composiciones propias para formularios, navegación y productos; las muestras permiten validar, adjuntar y probar una compra simulada | Mejorar la calidad y la variedad visible conservando el recorrido actual | Agregar un panel de decisiones transversales |
| D68 | 2026-11-07 | Comparación opcional de hasta tres diseños dentro de cada categoría, con el mismo contenido | Facilitar la evaluación sin depender de recordar muestras anteriores | Abrir un recorrido nuevo para comparar |

---

Decisión 2026-11-08: plantilla «Tracción» aprobada a partir de una maqueta visual. Se suma autor_concesionario con receta azul eléctrico, Archivo y Work Sans, selector de vehículos, ficha y consulta simulada. Se conserva el orden de los layouts existentes para mantener los códigos compartidos. Las imágenes son ilustraciones generadas con IA, identificadas como tales.

## 9. Registro de pruebas

Cada vez que pasamos un export por una IA, se anota acá. Es lo que valida (o corrige) el formato.

| # | Fecha | Versión | Proyecto de prueba | IA | Respetó | Ignoró o inventó | Cambio que generó |
|---|---|---|---|---|---|---|---|
| P1 | | 0.2.0 | Barbería (app web, calmo) | | | | |
| P2 | | 0.2.0 | Landing de producto (audaz) | | | | |
| P3 | | 0.2.0 | Dashboard interno (técnico) | | | | |

Validación técnica del catálogo (0.8.2, 2026-11-07): TypeScript, Vitest y build;
recorrido con Chromium en escritorio y celular, paleta clara y oscura. Se prueban
validación/limpieza de formulario, comparación y límite de tres, navegación,
color/talle/favoritos/carrito simulado y descarga con las elecciones. Estas pruebas
no reemplazan las pruebas con IA de P1–P3 ni una auditoría WCAG completa.

Auditoría paleta × estilo (2026-11-11, `src/compatibilidad.test.ts`): 92 de 1200 pares no pasan
AA (60 paletas × 20 estilos). Se arma el sistema de `sistema.ts` para cada par y se mide texto y
texto suave sobre fondo y tarjetas, y el texto del botón principal, con los colores que el CSS
de cada estilo pone debajo del texto. Fallan: Sistema retro con las 60 (pinta la página de
`#008080` y el texto de las secciones fuera del hero y las tarjetas queda encima: 4.40:1 el texto
y 2.65:1 el suave con `retro_gris`, su única paleta declarada) y Neobrutalismo con las 24 paletas
oscuras y 8 claras (azul eléctrico, bosque, papel, arcilla, cielo, pastel celeste, marina espuma y marina costa: texto suave sobre sus tarjetas amarillas, celestes y verdes). Los demás pares
declarados en `ESTILOS[id].paletas` pasan. `estilosPara(paleta)` ordena los estilos (los que
declaran la paleta primero) y saca los que no pasan; hasta que se arregle, Sistema retro no se
ofrece con ninguna paleta. No mide el brillo del botón Y2K ni los fondos con textura.

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

### Plan del modo rápido (decidido, ver D21)

| Etapa | Qué | Estado |
|---|---|---|
| 1 | Opciones avanzadas plegables y botones que se animan al tocarlos | `[v0.2]` hecho |
| 2 | **Elegí tu página:** pantalla completa para deslizar entre 12 layouts × 12 estilos, con candados y código por combinación | `[v0.3]` hecho |
| 3 | **Panel de botones:** 24 diseños tocables en 6 categorías, con su animación de click; color, tamaño, icono y mayúsculas | `[v0.4]` hecho |
| 3b | **Panel de cajas y contenedores:** 23 diseños base y 11 ajustes (fondo, transparencia, desenfoque, contorno, línea, color, esquinas, sombra, espacio, forma, hover) | `[v0.5]` hecho |
| 2b | **¿Qué vas a hacer?** (página, tienda, app web, app para celular, dashboard): define el tipo y el orden de los paneles | `[v0.6]` hecho |
| 4 | **Panel de formularios:** 16 campos (con animación al enfocar y al escribir), 8 interruptores, 8 casillas, 8 deslizadores | `[v0.6]` hecho |
| 4b | **Panel de navegación:** 10 barras inferiores para celular y 9 navegaciones web (superiores, flotantes y laterales), con su animación al cambiar | `[v0.6]` hecho |
| 4c | **Listo:** resumen y descarga del DESIGN.md desde el modo rápido | `[v0.6]` hecho |
| 3c | **Combinación de botones:** botón secundario junto al principal y botones de icono | `[v0.6]` hecho |
| 4f | **Selectores tipo slide** (chicos y grandes) | `[v0.6]` hecho |
| 4g | **Detalles:** etiquetas, avisos, carga, progreso, acordeones, avatares, tooltips, ventanas | `[v0.6]` hecho |
| 4d | **Datos y métricas:** tarjetas de métricas, 10 tipos de gráfico, tablas; en dashboards y apps web va antes que los formularios | `[v0.6]` hecho |
| 5b | **Prototipo final:** una app que funciona con todo lo elegido (portada, panel, explorar, crear, ayuda), en computadora y celular, con modo edición para cambiar cada elemento antes de descargar | `[v0.6]` hecho |
| 4h | Más elementos: menús desplegables, buscadores, calendarios, paginación, migas de pan, pasos (stepper), estados vacíos, carruseles, footers | `[futuro]` |
| 4e | **¿Para qué es?** (rubro) + biblioteca de secciones: el borrador se reacomoda según el uso | `[v0.7]` |
| 5 | Paleta y tipografía en modo rápido, aplicadas en vivo a la página elegida | `[v0.3]` |
| 6 | **Inicio a pantalla completa:** la página entera es la publicidad del producto y cambia de diseño sola cada 4 s (deslizar + difuminar); «Comenzar» fijo en el centro; al tocarlo, la misma página pasa a elegirse a mano con flechas y «Elegir este diseño» | `[v0.5]` hecho |

Requisito transversal: el export suma **el CSS real** de cada componente elegido (formato 0.3), para que la IA copie en vez de interpretar.

### Fuentes para ampliar el catálogo (ver D25)

- **Páginas:** Godly, Awwwards, SiteInspire, Land-book, Lapa Ninja, One Page Love, Minimal Gallery, brutalistwebsites.com.
- **Apps y flujos:** Mobbin (pago), Refero.
- **Componentes con código abierto:** Uiverse.io (MIT), CodePen (pens públicos MIT), Codrops, Animista, 98.css / XP.css / NES.css.
- **Tipografía:** Google Fonts, Fontshare, Velvetyne, Uncut.wtf; Fonts In Use para combinaciones.
- **Color:** Coolors, Happy Hues.
- Regla: inspirarse en el patrón y rehacerlo; nunca copiar el diseño de una marca. Revisar la licencia de cada recurso y atribuir el código MIT.
- Próximos estilos candidatos: risografía, japonés minimal, cyberpunk, skeumorfismo, collage, acid/rave, pixel art, escandinavo.

### Plan Molde (decidido, ver D79 a D88)

Convertir el configurador en **Molde**: página en blanco, un botón que explota en ideas y cada idea elegida se queda en la página. El plan completo, con tareas por modelo, dependencias y tandas, está en [`PLAN.md`](PLAN.md). Resumen: preparación (`AGENTS.md`, decisiones, auditoría paleta × estilo), base técnica (paso en la URL, carga partida), motor de rondas y ramas, catálogo nuevo (rubros, paletas, layouts, familias, fondos animados, scroll), portada y descarga en HTML. Mientras no cambie la salida, el formato no cambia.

### Ideas sueltas

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
| 0.8.8 | 2026-11-09 | §19 suma `layout_argumento` (opcional) en los layouts de página que no son de autor: prueba bajo los botones, hero con el producto en acción, frase que se enciende al bajar, testimonio y preguntas frecuentes. Compatible. |
| 0.8.7 | 2026-11-09 | §19 acepta 4 layouts de autor más: `autor_turnos`, `autor_curso`, `autor_restaurante` y `autor_gimnasio` (landings con demo animada del producto). Sin campos nuevos. |
| 0.8.6 | 2026-11-08 | §19 admite autor_concesionario e incluye el CSS real de su composición. Sin campos obligatorios nuevos. |
| 0.8.5 | 2026-11-08 | §19 acepta los layouts de autor `autor_panaderia`, `autor_finanzas` y `autor_portfolio`, con su estructura detallada (composición, contenido real, tratamiento de imagen). |
| 0.8.4 | 2026-11-08 | §19: `layout_estructura` de 7 layouts describe su sección con scroll interactivo (recorrido con visual fijo que cambia por paso, o galería horizontal que avanza al bajar), cómo hacerla con CSS scroll-driven animations y su versión quieta. |
| 0.8.3 | 2026-11-08 | §19 suma `fondo` (uno de 21 fondos con textura, o `ninguno`), `fondo_descripcion`, `fondo_uso`, `fondo_texto_encima` y un bloque `css` con el fondo aplicado a `.fondo-capa`. 4 layouts nuevos pensados para el fondo: `fondo_protagonista`, `tarjeta_sobre_fondo`, `editorial_fondo`, `widgets_fondo`. |
| 0.8.2 | 2026-11-07 | Sin nuevas secciones ni campos de configuración: 12 diseños en §21, estructuras de formulario/producto con estados e instrucciones de interacción y CSS correspondiente. Comparación opcional en la galería. Los exports anteriores siguen siendo válidos. |
| 0.1.0 | 2026-11-06 | Primera versión del formato: 19 secciones, reglas generales, prioridades, plan del configurador, ejemplo completo y registros. |
| 0.1.0 | 2026-11-06 | Sin cambios de formato. Primer configurador implementado (D10 a D13); el export cumple §3 según D12. |
| 0.2.0 | 2026-11-06 | Cambios que no rompen nada: §6 suma `paleta: personalizada`, el bloque `personalizada` y el rol `acento_suave`; un contraste que no pasa se anota en §18 en vez de bloquear (D15). §7 suma `peso_titulos`, `espaciado_titulos` y `contraste_tamanos` (4 niveles). §9 suma `elevacion: dura` y `bordes.componente`. §10 suma `botones.estilo`, `tamano`, `alto`, `padding_horizontal`, `texto`, `mayusculas` e `icono`. §12 suma el nivel `rapido`, `al_presionar` y más valores en `hover_botones`, `aparicion_listas` y `cambio_de_pantalla`. §5 pasa de 4 a 8 direcciones. Tokens nuevos en §16: `--color-acento-suave`, `--titulos-peso`, `--subtitulos-peso`, `--titulos-espaciado`, `--borde-componente`, `--boton-*`. |
| 0.3.0 | 2026-11-06 | Sección nueva §19 (estilo visual y layout, con el CSS real del estilo) y regla 10 en las instrucciones para la IA. 9 paletas y 4 fuentes nuevas para los estilos. Compatible: un archivo 0.2.0 sigue siendo válido (sin §19 equivale a `estilo: clasico`). |
| 0.4.0 | 2026-11-06 | §10 suma `botones.diseno`, `clases`, `al_tocar`, `color`, `color_fondo` y `color_texto`, más el bloque `css` del botón principal. §16 suma `--boton-color` y `--boton-sobre`. Compatible. |
| 0.5.0 | 2026-11-06 | Sección nueva §20 (cajas y contenedores, con su CSS) y regla 11 en las instrucciones. §16 suma los tokens `--caja-*`. Compatible. |
| 0.6.0 | 2026-11-06 | Sección nueva §21 (componentes de interfaz con estructura y CSS) y regla 12. Compatible. |
| 0.6.1 | 2026-11-06 | Sin cambios de formato: más valores en listas existentes (`al_tocar` suma temblor, latido y estallido; cajas suman `fondo: invertido` y `sombra: color`). |
| 0.6.2 | 2026-11-06 | Sin cambios de formato: §21 suma 14 categorías nuevas (las claves nuevas son opcionales). |
| 0.7.0 | 2026-11-06 | Campo `modo` (`proyecto` \| `sistema_de_diseno`) en el encabezado y en §2, y variante de las instrucciones de §1 para el modo sistema de diseño. Compatible: un archivo sin `modo` equivale a `proyecto`. |
| 0.8.1 | 2026-11-07 | §10: `al_tocar` puede ser una animación elegida aparte del diseño (se anota la del diseño en un comentario) y `clases` lleva esa `bt-ef-*`. §16 suma `--color-acento-texto` (el acento usado como texto, siempre a 4.5:1); los componentes de §21 lo usan en lugar de `--color-acento` para texto. |
| 0.8.0 | 2026-11-07 | §6 suma `modo_alterno` (roles del modo opuesto) y §16 sus tokens con `prefers-color-scheme` y `data-tema`, cuando la persona pide los dos modos. §19 tiene 3 estilos nuevos. |
| 0.7.1 | 2026-11-06 | Las instrucciones de §1 (en los dos modos) empiezan pidiendo a la IA una maqueta de cómo va a quedar, para que la persona la apruebe antes de aplicar todo. |
