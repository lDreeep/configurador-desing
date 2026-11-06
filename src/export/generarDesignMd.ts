// Genera el DESIGN.md exportado según la especificación (DESIGN.md §3, versión del formato abajo).
// Si cambiás la salida, actualizá la especificación y su historial de cambios.

import { ESTILOS_BOTON, INTEGRACIONES, PATRONES_NAV, TAMANOS_BOTON } from '../catalogo';
import type { BotonEstiloId } from '../tipos';
import type { Config } from '../tipos';
import { paresDeContraste } from '../color';
import { paletaActiva, sistemaDeDiseno, tokensCss } from './sistema';

export const VERSION_FORMATO = '0.2.0';

const q = (s: string) => JSON.stringify(s);
const valor = (s: string) => (s.trim() ? q(s.trim()) : 'sin_definir');
const lista = (xs: string[], sangria = '  ') =>
  xs.length ? '\n' + xs.map((x) => `${sangria}- ${q(x)}`).join('\n') : ' []';
const ids = (xs: string[]) => `[${xs.join(', ')}]`;
const yaml = (cuerpo: string) => '```yaml\n' + cuerpo.trim() + '\n```';
const nota = (c: Config, paso: keyof Config['notas']) => {
  const n = c.notas[paso]?.trim();
  return n ? `\nnota: ${q(n)}` : '';
};

const PRIMARIO: Record<BotonEstiloId, string> = {
  relleno: 'fondo --color-acento, texto --color-sobre-acento',
  contorno: 'fondo transparente, borde 2px --color-acento, texto --color-acento',
  tonal: 'fondo --color-acento-suave, texto --color-texto',
  elevado: 'fondo --color-acento, texto --color-sobre-acento, sombra --sombra-2',
  sombra_dura: 'fondo --color-acento, texto --color-sobre-acento, borde 2px --color-texto, sombra sólida 4px 4px 0 --color-texto',
};

export const INSTRUCCIONES_IA = `Este archivo describe una web o app que tenés que construir. Fue generado
por un configurador visual a partir de decisiones de una persona.

1. Leé el archivo completo antes de escribir código.
2. Los bloques YAML son la fuente de verdad. Usá esos valores exactos.
3. Las notas (\`nota:\` / \`notas:\`) son palabras literales de la persona y
   tienen prioridad sobre el valor del mismo bloque.
4. Implementá los tokens de la sección 16 como variables CSS (o el
   equivalente de tu stack) y usalos siempre. No uses colores, radios,
   tipografías ni duraciones sueltos.
5. Si un valor es \`sin_definir\`, usá el \`por_defecto\` de esa sección; si no
   hay, preguntá antes de inventar. Si es \`libre\`, decidí vos de forma
   coherente con la sección 5 y contá qué elegiste.
6. No agregues pantallas ni funcionalidades que no estén en las secciones
   3 y 4. Si creés que falta algo importante, proponelo antes de hacerlo.
7. La sección 14 (accesibilidad) no se negocia, aunque otra sección
   parezca contradecirla.
8. Revisá la sección 18 y empezá por preguntar lo que esté pendiente
   y bloquee el trabajo.
9. Al terminar, listá cualquier decisión que hayas tenido que tomar por
   tu cuenta.`;

export const REGLAS_ACCESIBILIDAD = [
  'Contraste de texto 4.5:1 (3:1 en texto de 24px o más)',
  'Áreas táctiles de al menos 44×44px',
  'Foco visible en todo elemento interactivo',
  'Todo se puede usar con teclado',
  'Botones y links reales; nada de divs clickeables',
  'Imágenes con texto alternativo; iconos solos con aria-label',
  'Formularios con label visible asociado a cada campo',
  'El color nunca es la única forma de transmitir información',
  'Respetar prefers-reduced-motion',
];

export interface Pendiente {
  seccion: number;
  campo: string;
  bloquea: boolean;
}

export function calcularPendientes(c: Config): { sinDefinir: Pendiente[]; preguntas: string[] } {
  const sinDefinir: Pendiente[] = [];
  const falta = (cond: boolean, seccion: number, campo: string, bloquea: boolean) => {
    if (cond) sinDefinir.push({ seccion, campo, bloquea });
  };
  const p = c.proyecto;
  falta(!p.nombre.trim(), 2, 'nombre', false);
  falta(!p.descripcion.trim(), 2, 'descripcion', true);
  falta(!p.objetivo.trim(), 2, 'objetivo_principal', true);
  falta(!p.publicoQuienes.trim(), 2, 'publico.quienes', false);
  falta(c.estructura.pantallas.length === 0, 3, 'pantallas', true);
  c.estructura.pantallas.forEach((s) => falta(!s.accionPrincipal.trim(), 3, `pantallas.${s.id}.accion_principal`, false));
  falta(c.funciones.acciones.length === 0, 4, 'acciones_clave', true);
  sinDefinir.push({ seccion: 4, campo: 'datos', bloquea: false });
  paresDeContraste(paletaActiva(c).roles)
    .filter((x) => !x.pasa)
    .forEach((x) => sinDefinir.push({ seccion: 6, campo: `contraste: ${x.nombre} (${x.valor.toFixed(1)}, mínimo ${x.minimo})`, bloquea: false }));
  sinDefinir.push({ seccion: 11, campo: 'logo', bloquea: false });

  const preguntas: string[] = [];
  const integ = c.funciones.integraciones;
  if (integ.includes('pagos')) preguntas.push('¿Con qué proveedor de pagos y qué medios aceptan?');
  if (integ.includes('whatsapp'))
    preguntas.push('¿Los mensajes por WhatsApp se mandan solos o los dispara una persona? ¿Alcanza con un link con el mensaje armado?');
  if (integ.includes('email')) preguntas.push('¿Qué emails se mandan y en qué momento?');
  if (integ.includes('calendario')) preguntas.push('¿Con qué calendario se sincroniza (Google, Outlook…)?');
  if (c.funciones.requiereCuenta !== 'no') preguntas.push('¿Cómo se registran e ingresan los usuarios (email y contraseña, Google, link mágico)?');
  if (c.estructura.pantallas.length > 0) preguntas.push('¿Qué datos reales se muestran en cada pantalla? Mientras tanto, usá datos de ejemplo realistas.');
  return { sinDefinir, preguntas };
}

export function generarDesignMd(c: Config, fecha = new Date().toISOString().slice(0, 10)): string {
  const s = sistemaDeDiseno(c);
  const p = c.proyecto;
  const e = c.estructura;
  const f = c.funciones;
  const { sinDefinir, preguntas } = calcularPendientes(c);
  const titulo = p.nombre.trim() || 'Proyecto sin nombre';
  const nav = e.pantallas.map((x) => x.nombre).slice(0, 6);

  const secciones: string[] = [];
  const add = (n: number, nombre: string, prosa: string, cuerpo?: string) =>
    secciones.push([`## ${n}. ${nombre}`, prosa, cuerpo ? yaml(cuerpo) : ''].filter(Boolean).join('\n\n'));

  add(1, 'Instrucciones para la IA', INSTRUCCIONES_IA);

  add(
    2,
    'Proyecto',
    p.descripcion.trim() || 'La persona todavía no describió el proyecto (ver sección 18).',
    `
nombre: ${valor(p.nombre)}
tipo: ${p.tipo}
descripcion: ${valor(p.descripcion)}
objetivo_principal: ${valor(p.objetivo)}
publico:
  quienes: ${valor(p.publicoQuienes)}
  contexto: ${valor(p.publicoContexto)}
  nivel_tecnico: ${p.nivelTecnico}
plataformas: ${ids(p.plataformas)}
idioma_contenido: es
stack_preferido: libre${nota(c, 'proyecto')}`,
  );

  const pantallasYaml = e.pantallas.length
    ? e.pantallas
        .map(
          (x) => `  - id: ${x.id}
    nombre: ${q(x.nombre)}
    proposito: ${valor(x.proposito)}
    secciones: ${ids(x.secciones)}
    accion_principal: ${valor(x.accionPrincipal)}`,
        )
        .join('\n')
    : '';
  add(
    3,
    'Estructura',
    `${e.pantallas.length} ${e.pantallas.length === 1 ? 'pantalla' : 'pantallas'}. Navegación: ${PATRONES_NAV[e.patron].nombre.toLowerCase()} en escritorio y ${PATRONES_NAV[e.patronMovil].nombre.toLowerCase()} en celular.`,
    `
navegacion:
  patron: ${e.patron}
  patron_movil: ${e.patronMovil}
  items: ${e.patron === 'sin_navegacion' ? '[]' : `[${nav.map(q).join(', ')}]`}
pantallas:${pantallasYaml ? '\n' + pantallasYaml : ' []'}${nota(c, 'estructura')}`,
  );

  add(
    4,
    'Funcionalidades',
    'Intención funcional: la IA decide la implementación salvo que se indique otra cosa.',
    `
acciones_clave:${lista(f.acciones)}
datos: sin_definir
usuarios:
  requiere_cuenta: ${f.requiereCuenta}
integraciones: ${ids(f.integraciones)}
fuera_de_alcance:${lista(f.fueraDeAlcance)}
datos_de_ejemplo: si${nota(c, 'funciones')}`,
  );

  add(
    5,
    'Dirección visual',
    `${s.dir.nombre}: ${s.dir.descripcion.toLowerCase()}.`,
    `
direccion: ${c.visual.direccion}
palabras_clave: [${s.dir.palabrasClave.join(', ')}]
anti_referencias:${lista(c.visual.antiReferencias)}${nota(c, 'direccion')}`,
  );

  const r = s.paleta.roles;
  const est = s.paleta.estados;
  const pp = c.visual.paletaPersonalizada;
  const esPersonalizada = c.visual.paleta === 'personalizada';
  const fallas = s.contrastes.filter((x) => !x.pasa);
  const manuales = Object.keys(pp.manual).filter((k) => pp.manual[k as keyof typeof pp.manual]);
  add(
    6,
    'Color',
    `${esPersonalizada ? 'Paleta personalizada' : `Paleta ${s.paleta.nombre.toLowerCase()}`}, modo ${s.paleta.modo}. ` +
      (fallas.length
        ? `Atención: ${fallas.length} ${fallas.length === 1 ? 'par no pasa' : 'pares no pasan'} contraste AA (ver sección 18); la sección 14 tiene prioridad.`
        : 'Todos los pares de texto y fondo pasan contraste AA.'),
    `
paleta: ${c.visual.paleta}
modo: ${s.paleta.modo}${
      esPersonalizada
        ? `
personalizada:
  base: { fondo: ${q(pp.fondo)}, texto: ${q(pp.texto)}, acento: ${q(pp.acento)} }
  ajustados_a_mano: ${ids(manuales)}`
        : ''
    }
roles:
  fondo: ${q(r.fondo)}
  superficie: ${q(r.superficie)}
  superficie_alta: ${q(r.superficie_alta)}
  borde: ${q(r.borde)}
  texto: ${q(r.texto)}
  texto_suave: ${q(r.texto_suave)}
  acento: ${q(r.acento)}
  sobre_acento: ${q(r.sobre_acento)}
  acento_suave: ${q(s.tokens['--color-acento-suave'])}
estados:
  exito: ${q(est.exito)}
  aviso: ${q(est.aviso)}
  error: ${q(est.error)}
  info: ${q(est.info)}
uso_del_acento: ${s.dir.usoDelAcento}${nota(c, 'color')}`,
  );

  const esc = Object.entries(s.escala)
    .map(([k, v]) => `  ${k}: { tamano: ${v.tamano}px, interlineado: ${v.interlineado}, peso: ${v.peso} }`)
    .join('\n');
  add(
    7,
    'Tipografía',
    `${s.titulos.nombre} para títulos, ${s.texto.nombre} para texto.`,
    `
familias:
  titulos: ${q(s.titulos.pila)}
  texto: ${q(s.texto.pila)}
fuente_origen: google_fonts
escala:
${esc}
peso_titulos: ${s.pesoTitulos}
espaciado_titulos: ${c.visual.espaciadoTitulos}   # ${s.espaciadoTitulos}
contraste_tamanos: ${c.visual.escala}
proporcion_escala: ${s.proporcion}
largo_de_linea_max: 70ch${nota(c, 'tipografia')}`,
  );

  add(
    8,
    'Espaciado y layout',
    '',
    `
unidad_base: 4px
escala: [${s.espacios.join(', ')}]
densidad: ${s.dir.densidad}
padding_componente: ${Math.round(16 * s.factor)}px
ancho_maximo_contenido: 1200px
grilla:
  columnas: 12
  separacion: 24px
  margen_lateral: { movil: 16px, escritorio: 32px }`,
  );

  add(
    9,
    'Forma',
    `Radio ${s.radio.nombre.toLowerCase()}.`,
    `
radio:
  pequeno: ${s.radio.pequeno}px
  medio: ${s.radio.medio}px
  grande: ${s.radio.grande}px
  boton: ${s.radio.boton}px
bordes:
  uso: ${c.visual.bordes}
  componente: ${q(s.bordeBloque)}
elevacion:
  estilo: ${c.visual.elevacion}
  nivel_1: ${q(s.elevacion.nivel_1)}
  nivel_2: ${q(s.elevacion.nivel_2)}
  nivel_3: ${q(s.elevacion.nivel_3)}${nota(c, 'forma')}`,
  );

  const b = c.botones;
  add(
    10,
    'Componentes',
    `Botones ${ESTILOS_BOTON[b.estilo].nombre.toLowerCase()}, tamaño ${TAMANOS_BOTON[b.tamano].nombre.toLowerCase()}. El resto de los componentes usa los valores por defecto del formato.`,
    `
botones:
  estilo: ${b.estilo}
  variantes: [primario, secundario, fantasma, peligro]
  primario: ${q(PRIMARIO[b.estilo])}
  secundario: "fondo transparente, borde --color-borde, texto --color-texto"
  tamano: ${b.tamano}
  alto: ${s.boton.alto}px
  padding_horizontal: ${s.boton.padding}px
  texto: ${s.boton.texto}px
  mayusculas: ${b.mayusculas ? 'si' : 'no'}
  icono: ${b.icono}
  estados: [normal, hover, presionado, foco, deshabilitado, cargando]
  regla: "un solo botón primario visible por pantalla"
inputs: { estilo: borde_completo, etiqueta: arriba, ayuda_y_error: debajo }
cards: { fondo: superficie, borde: ${q(s.bordeBloque)}, sombra: "--sombra-1" }
estados_especiales:
  vacio: "texto + acción"
  cargando: esqueleto
  error: "mensaje claro + cómo resolverlo + reintentar"${nota(c, 'botones')}`,
  );

  add(
    12,
    'Movimiento',
    s.mov.descripcion,
    `
nivel: ${c.visual.movimiento}
duraciones:
  rapida: ${s.mov.rapida}ms
  media: ${s.mov.media}ms
  lenta: ${s.mov.lenta}ms
curvas:
  entrada: ${q(s.mov.curvaEntrada)}
  salida: ${q(s.mov.curvaSalida)}
que_se_anima:
  hover_botones: ${c.visual.hover}
  al_presionar: ${c.visual.presionar}
  aparicion_listas: ${c.visual.aparicion}
  cambio_de_pantalla: ${c.visual.cambio}
respetar_movimiento_reducido: si${nota(c, 'movimiento')}`,
  );

  add(
    14,
    'Accesibilidad',
    'Mínimos que no se negocian.',
    `
nivel: AA
reglas:${lista(REGLAS_ACCESIBILIDAD)}`,
  );

  const movilPrimero = p.plataformas.includes('web_movil') || p.tipo === 'app_movil';
  add(
    15,
    'Responsive',
    '',
    `
enfoque: ${movilPrimero ? 'movil_primero' : 'escritorio_primero'}
cortes:
  movil: 0
  tableta: 768px
  escritorio: 1024px
  ancho: 1440px
comportamientos:
  navegacion_en_movil: ${e.patronMovil}
  tablas_en_movil: cards`,
  );

  secciones.push(
    `## 16. Tokens\n\nGenerado a partir de las secciones anteriores. Si hay diferencias, ganan los bloques YAML.\n\n\`\`\`css\n${tokensCss(s)}\n\`\`\``,
  );

  const notasGen = c.notasGenerales
    .split('\n')
    .map((x) => x.trim())
    .filter(Boolean);
  if (notasGen.length) add(17, 'Notas generales', '', `notas:${lista(notasGen)}`);

  const pend = sinDefinir.length
    ? sinDefinir.map((x) => `  - { seccion: ${x.seccion}, campo: ${/^[a-z0-9_.]+$/.test(x.campo) ? x.campo : q(x.campo)}, bloquea: ${x.bloquea ? 'si' : 'no'} }`).join('\n')
    : '';
  add(
    18,
    'Pendientes',
    sinDefinir.some((x) => x.bloquea)
      ? 'Hay pendientes que bloquean: preguntá por ellos antes de empezar.'
      : 'Nada bloquea el trabajo. Igual conviene confirmar las preguntas sugeridas.',
    `
sin_definir:${pend ? '\n' + pend : ' []'}
preguntas_sugeridas:${lista(preguntas)}`,
  );

  const encabezado = yaml(`
formato: design-md
version_formato: ${VERSION_FORMATO}
generado_por: configurador-diseno
fecha: ${fecha}
idioma: es`);

  const integracionesTxt = f.integraciones.map((i) => INTEGRACIONES[i] ?? i).join(', ');
  const resumen = `> ${p.tipo.replace('_', ' ')} · ${s.dir.nombre.toLowerCase()}${integracionesTxt ? ` · integra ${integracionesTxt}` : ''}`;

  return [encabezado, `# ${titulo}: DESIGN.md`, resumen, ...secciones].join('\n\n') + '\n';
}
