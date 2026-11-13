# H5 · Revisión del archivo como entrada para otra IA

Fecha: 2026-11-13. Base: `88b7b90` (main actualizado). Formato: 0.9.2.

## Método y alcance

Se generaron tres archivos reales con `generarDesignMd`, usando las mismas rondas de
Molde (Proyecto, Rubro, Layout, Estilo y Color) y sus valores por defecto I2. Después
se completó la intención del proyecto, como puede hacerse en Ajustar. La landing
elige tres secciones y el dashboard pide ambos modos. Los negocios son ficticios.

Reproducir desde la raíz, con las dependencias instaladas:

```sh
node scripts/h5-exportar.mjs
```

Cada carpeta guarda `config.json`, `DESIGN.md` y `PEDIDO.md`. La fecha se fija al
2026-11-13. El script normaliza cada config, comprueba modo y versión y parsea todos
los bloques YAML (21 en landing, 20 en dashboard y tienda). No modifica el exportador.

Esta es una revisión de lectura por Codex, actuando como IA receptora del archivo;
no es una ejecución independiente en Claude y ChatGPT. No se construyeron apps,
no hubo aprobación de maquetas y no se midió similitud visual ni cumplimiento real
de accesibilidad. Las respuestas siguientes son el análisis de esta revisión,
no transcripciones atribuidas a otros modelos. P1–P3 del registro original siguen
sin ejecutarse. Una segunda IA puede recibir únicamente DESIGN.md + PEDIDO.md;
no debería necesitar el código de Molde para resolver el encargo.

## Casos y primera respuesta de la IA receptora

| Caso | Elecciones | Qué alcanza para construir la maqueta | Qué preguntaría antes de la app completa |
|---|---|---|---|
| [Landing Turno Sur](landing/DESIGN.md), [pedido](landing/PEDIDO.md) | producto_digital; hero_partido; producto_amable; azul_electrico; beneficios, preguntas y contacto | Tokens, fuentes, cajas, campos y composición del hero | ¿El CTA es pedir demo o Empezar ahora? ¿Uso solo las tres secciones de §22 o también precios/testimonios/recorrido? ¿A qué dirección llega el contacto y qué mensaje confirma el envío? Faltan contenido aprobado, datos de contacto y recursos de marca. |
| [Dashboard Depósito Sur](dashboard/DESIGN.md), [pedido](dashboard/PEDIDO.md) | ventas; bento; minimal_tecnico; marina_naval; claro y oscuro | Navegación lateral/hamburguesa, cuatro pantallas de plantilla, tokens de ambos modos | ¿Qué define ventas, moneda, zona horaria, período y comparación? ¿Cuál es el origen de datos, formato de exportación y modelo de permisos? ¿Gestionar/invitar usuarios forma parte del alcance? Falta cómo abrir pedidos: no hay pantalla de detalle en §3. |
| [Tienda Taller Arcilla](tienda/DESIGN.md), [pedido](tienda/PEDIDO.md) | artesanias; mosaico; editorial; arcilla | Inicio, catálogo, producto y carrito; tratamiento visual y piezas de producto | ¿Checkout dentro del sitio o externo? ¿Proveedor de pago, moneda, variantes, stock, envío e impuestos? ¿Cómo se confirma o recupera un pago fallido? ¿El argumento de landing de §19 se agrega al catálogo? Faltan fotos, precios y políticas reales. |

En los tres casos haría primero una maqueta con datos claramente marcados como muestra,
como exige §1. No implementaría integraciones reales ni afirmaría que la app está lista.
Para la landing esperaría resolver el orden y el CTA antes de cerrar esa maqueta.

## Hallazgos verificables

Las referencias son secciones de los archivos exportados en esta carpeta.

| ID / prioridad | Evidencia | Riesgo al recibir solo el archivo | Cambio propuesto (sin aplicar) |
|---|---|---|---|
| H5-1 / alta | Landing §2 pide demo, §3 dice `accion_principal: Empezar ahora`. §3 incluye como_funciona, testimonios y precios; §22 ordena solo beneficios, preguntas y contacto y prohíbe agregar otras. §19 todavía describe un recorrido de cuatro pasos después del hero. | Dos implementaciones pueden obedecer bloques distintos y producir páginas diferentes. | Derivar CTA y estructura efectiva de la elección final; declarar la prioridad de §22 sobre las partes inferiores de §19 y §3. |
| H5-2 / alta | Dashboard §3 incluye Usuarios e Invitar usuario; §4 solo pide filtrar ventas, revisar pedidos y exportar. Tienda §3 termina con Ir a pagar sin describir checkout ni retorno. | La IA debe decidir permisos, pantallas o flujos que §1 le prohíbe agregar por cuenta propia. | Distinguir pantallas de plantilla y confirmadas; vincular acciones con destinos, roles, estados y resultados. Confirmar alcance antes de construir. |
| H5-3 / alta | Los tres §4 escriben `datos: sin_definir`; §18 los marca `bloquea: no` y dice Nada bloquea el trabajo. Tienda pregunta proveedor; dashboard pregunta login, pero las preguntas no tienen campo de bloqueo asociado. | Se puede aprobar una maqueta, pero no una tienda con pagos ni un panel privado operativo. La regla §1.5 pide preguntar cualquier sin_definir, mientras §1.8 destaca solo bloqueantes. | Separar pendientes para maqueta y para implementación, con motivo y criterio de resolución; permitir declarar modelo de datos, permisos y contratos de integración. |
| H5-4 / media | Dashboard y tienda §19 `layout_argumento` piden prueba, demo del producto, frase, testimonio y FAQ. §3 pide catálogo/producto/carrito y §17 prohíbe inventar testimonios o métricas reales. | Una IA puede convertir el catálogo en una landing o inventar prueba social. | Exportar argumento solo si corresponde al tipo y al alcance; representar contenido faltante de forma explícita. |
| H5-5 / alta | §1 exige tokens y aplicar CSS tal cual; §21 trae valores propios como `.cm-tooltip button { min-height: 40px }` y `.cm-u-item { min-height: 40px }`; §14 exige 44×44. §19 trae radios/colores propios y §20 exige que todas las cajas usen la caja elegida. | Copiar CSS literalmente no garantiza el sistema ni las áreas táctiles. La prioridad de accesibilidad sí está declarada en §1.7; falta cómo corregir estas excepciones sin apartarse de la instrucción de copia literal. | Alinear CSS exportado con tokens y mínimos; documentar precedencia entre base, estilo, cajas y componentes, incluyendo excepciones. No se afirma una falla WCAG medida: son mínimos CSS insuficientes para garantizarla. |
| H5-6 / media | §21 exporta también reserva de turnos, formularios en pasos, acceso y otras piezas que no aparecen entre las acciones de estos proyectos. | Confundir una biblioteca de piezas disponibles con funcionalidades obligatorias, sobre todo cuando tienda dice que no requiere cuenta. | Marcar explícitamente catálogo opcional frente a componentes usados, o exportar solo el subconjunto aplicable. |
| H5-7 / media | §15 fija responsive general; §19 describe una composición, pero no asigna layout por cada pantalla del dashboard o tienda. §4 no vincula estados de error/vacío/carga con una acción concreta. | La IA inventa el resto de pantallas y su comportamiento adaptativo. | Agregar asociaciones opcionales pantalla → layout/piezas y contratos de estados; conservar compatibilidad con archivos anteriores. |

## Diferencias con la especificación y límites

La pregunta abierta Q7 de DESIGN.md ya registra la diferencia de §8
(`padding_componente` en el export frente a `espacio_entre_secciones` en el ejemplo)
y de iconos en §11. Las tres muestras confirman `padding_componente`; no se corrigió
la especificación ni el código. El caso relleno de iconos no fue cubierto por estas
tres configs: no se presenta como verificado aquí. La compatibilidad YAML 1.1/1.2 de
`si`/`no` sigue siendo Q6; el parseo de esta prueba usa la dependencia `yaml` del repo.

Los pedidos no agregan stack ni servicios para disimular faltantes. `stack_preferido:
libre` es una decisión delegada válida; `datos: sin_definir` es información ausente.
Los controles automáticos del repo comprueban regresiones, no que una IA externa
respete el archivo. Próximo ensayo: entregar cada pareja export + pedido a Claude
y ChatGPT, guardar modelo/fecha/respuesta/maqueta y comparar tokens, notas, alcance,
preguntas previas, estados, teclado, 390 px y similitud con el lienzo. Eso queda
pendiente como ampliación opcional de H5, sin atribuir resultados inexistentes.

## Controles del cambio

- `npm run typecheck`: pasó.
- `npm test`: 210 tests pasaron al repetir sin build simultáneo. El primer intento
  falló esperando 200 ms la carga diferida de Ajustes en `Molde.test.tsx:223`.
- `npm run lint`: pasó.
- `npm run peso`: pasó, JS inicial 201,7 kB (límite 250 kB).
- `npm run test:e2e`: ejecutado; falla reproducible en dos intentos con Vite activo
  en `e2e/molde-tactil.e2e.mjs:85`, «el botón de muestra no respondió», durante el
  recorrido con movimiento reducido. El recorrido táctil normal a 390 px pasa.
  El script exige observar la clase `toque`; esta revisión no determina si la falla
  está en el producto o en esa observación. No se alteró ni relajó el test.
- Regeneración de muestras: hashes idénticos en una segunda generación; 61 bloques
  YAML válidos. `git diff --check` sin errores.

No hay diferencias con main en `src/`, `e2e/`, dependencias ni configuración:
H5 agrega evidencia y documentación, y un script de reproducción. El fallo e2e
queda visible para el cierre de calidad; los controles no se presentan como todos verdes.
