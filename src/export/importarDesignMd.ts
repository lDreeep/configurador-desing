import { parse } from 'yaml';
import { ESTILOS, LAYOUTS } from '../estilos-visuales';
import { FONDOS } from '../fondos';
import * as catalogo from '../catalogo';
import { configInicial, normalizar } from '../estado';
import { BOTONES, EFECTOS_TOQUE, efectoDe } from '../botones-disenos';
import { CAJAS, OPCIONES_CAJA } from '../cajas-disenos';
import { CATEGORIAS } from '../galeria';
import { generarDesignMd } from './generarDesignMd';

type Mapa = Record<string, unknown>;
const mapa = (x: unknown): Mapa => x && typeof x === 'object' && !Array.isArray(x) ? x as Mapa : {};
const texto = (x: unknown) => typeof x === 'string' && x !== 'sin_definir' ? x : '';
const lista = (x: unknown) => Array.isArray(x) ? x : [];
const textos = (x: unknown) => lista(x).filter((s): s is string => typeof s === 'string');
const claves = <T extends object>(o: T) => Object.keys(o) as (keyof T & string)[];
const propia = (obj: object, clave: string) => Object.prototype.hasOwnProperty.call(obj, clave);
function opcion<K extends string, D extends string>(x: unknown, opciones: Record<K, unknown>, inicial: D): K | D {
  return typeof x === 'string' && propia(opciones, x) ? x as K : inicial;
}

function bloques(md: string) {
  const datos: Record<number, Mapa> = {};
  const errores = new Set<number>();
  let seccion = 0;
  for (const parte of md.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').matchAll(/^## (\d+)\. [^\n]*|^```([^\n]*)\n([\s\S]*?)\n```[ \t]*$/gm)) {
    if (parte[1]) seccion = Number(parte[1]);
    else if (parte[2] === 'yaml') {
      try {
        const valor = parse(parte[3], { maxAliasCount: 0 });
        datos[seccion] = { ...datos[seccion], ...mapa(valor) };
      } catch { errores.add(seccion); }
    }
  }
  return { datos, errores };
}

export function importarDesignMd(md: string) {
  const { datos, errores } = bloques(md);
  const sec = (n: number) => datos[n] ?? {};
  const cab = sec(0);
  if (cab.formato !== 'design-md' || !['0.8.8','0.8.9','0.9.0','0.9.1','0.9.2'].includes(texto(cab.version_formato)))
    throw new Error('Elegí un DESIGN.md de Molde entre las versiones 0.8.8 y 0.9.2.');
  if (!datos[2] && !datos[19]) throw new Error('No se encontró el proyecto ni el diseño de la página.');

  const c = configInicial();
  const p = sec(2), publico = mapa(p.publico);
  Object.assign(c.proyecto, {
    nombre: texto(p.nombre), tipo: opcion(p.tipo, catalogo.TIPOS_PROYECTO, c.proyecto.tipo),
    rubro: texto(p.rubro) || undefined, descripcion: texto(p.descripcion), objetivo: texto(p.objetivo_principal),
    publicoQuienes: texto(publico.quienes), publicoContexto: texto(publico.contexto),
    nivelTecnico: opcion(publico.nivel_tecnico, { bajo:1, medio:1, alto:1 }, 'bajo'),
  });
  if (Array.isArray(p.plataformas)) c.proyecto.plataformas = textos(p.plataformas);
  const e = sec(3), nav = mapa(e.navegacion);
  c.estructura.patron = opcion(nav.patron, catalogo.PATRONES_NAV, c.estructura.patron);
  c.estructura.patronMovil = opcion(nav.patron_movil, catalogo.PATRONES_NAV, c.estructura.patronMovil);
  if (Array.isArray(e.pantallas)) {
    c.estructura.pantallas = e.pantallas.map(mapa).map(s => ({
      id: texto(s.id), nombre: texto(s.nombre), proposito: texto(s.proposito),
      secciones: textos(s.secciones), accionPrincipal: texto(s.accion_principal),
    }));
    c.estructura.editadas = true;
  }
  const f = sec(4);
  c.funciones.acciones = textos(f.acciones_clave);
  c.funciones.integraciones = textos(f.integraciones);
  c.funciones.fueraDeAlcance = textos(f.fuera_de_alcance);
  c.funciones.requiereCuenta = opcion(mapa(f.usuarios).requiere_cuenta, { si:1, no:1, opcional:1 }, c.funciones.requiereCuenta);
  const v = c.visual, color = sec(6), tip = sec(7), forma = sec(9);
  v.direccion = opcion(sec(5).direccion, catalogo.DIRECCIONES, v.direccion);
  v.antiReferencias = textos(sec(5).anti_referencias);
  v.paleta = color.paleta === 'personalizada' ? 'personalizada' : opcion(color.paleta, catalogo.PALETAS, 'azul_electrico');
  v.ambosModos = !!color.modo_alterno;
  const personalizada = mapa(color.personalizada), base = mapa(personalizada.base);
  const hex = (x: unknown) => typeof x === 'string' && /^#[\da-f]{6}$/i.test(x);
  for (const k of ['fondo','texto','acento'] as const) if (hex(base[k])) v.paletaPersonalizada[k] = String(base[k]);
  for (const k of textos(personalizada.ajustados_a_mano)) {
    const valor = mapa(color.roles)[k];
    if (propia(catalogo.PALETAS.azul_electrico.roles,k) && hex(valor)) Object.assign(v.paletaPersonalizada.manual, { [k]: valor });
  }
  for (const [clave, familia] of [['fuenteTitulos','titulos'],['fuenteTexto','texto']] as const)
    v[clave] = claves(catalogo.FUENTES).find(id => catalogo.FUENTES[id].pila === mapa(tip.familias)[familia]) ?? v[clave];
  if (typeof tip.peso_titulos === 'number' && Number.isFinite(tip.peso_titulos)) v.pesoTitulos = tip.peso_titulos;
  v.espaciadoTitulos = opcion(tip.espaciado_titulos, catalogo.ESPACIADOS_TITULOS, v.espaciadoTitulos);
  v.escala = opcion(tip.contraste_tamanos, catalogo.ESCALAS, v.escala);
  const lectura = mapa(tip.lectura);
  v.lectura = claves(catalogo.LECTURAS).find(id => lectura.ancho_maximo === catalogo.LECTURAS[id].ancho+'ch' && lectura.tamano === catalogo.LECTURAS[id].tamano+'px') ?? null;
  v.densidad = claves(catalogo.DENSIDADES).find(id => id === sec(8).densidad) ?? null;
  v.radio = claves(catalogo.RADIOS).find(id => ['medio','boton','grande','pequeno'].every(k => mapa(forma.radio)[k] === mapa(catalogo.RADIOS[id])[k]+'px')) ?? v.radio;
  v.elevacion = opcion(mapa(forma.elevacion).estilo, catalogo.ELEVACIONES, v.elevacion);
  v.bordes = opcion(mapa(forma.bordes).uso, catalogo.BORDES, v.bordes);
  const b = mapa(sec(10).botones);
  c.botones.diseno = b.diseno === 'ninguno' ? 'ninguno' : opcion(b.diseno,BOTONES,'ninguno');
  c.botones.estilo = opcion(b.estilo,catalogo.ESTILOS_BOTON,c.botones.estilo);
  c.botones.tamano = opcion(b.tamano,catalogo.TAMANOS_BOTON,c.botones.tamano);
  c.botones.mayusculas = b.mayusculas === 'si';
  c.botones.icono = opcion(b.icono,{ ninguno:1, izquierda:1, derecha:1 },'ninguno');
  if (b.color === 'acento' || b.color === 'texto' || hex(b.color)) c.botones.color = String(b.color);
  if (c.botones.diseno !== 'ninguno' && (b.al_tocar !== efectoDe(c.botones.diseno,'del_diseno') || /^ {2}al_tocar: [^\n]*# elegida aparte/m.test(md)))
    c.botones.efecto = opcion(b.al_tocar, EFECTOS_TOQUE, 'del_diseno');
  const i = mapa(sec(11).iconos), tono = sec(13);
  if (i.libreria) Object.assign(c,{ iconos: { libreria: i.libreria, estilo: i.estilo, grosor: typeof i.grosor === 'number' ? i.grosor : 2 } });
  if (tono.voz) Object.assign(c,{ tono: { voz: tono.voz, tratamiento: tono.tratamiento, largo: tono.largo_de_textos } });
  const mov = sec(12), anim = mapa(mov.que_se_anima);
  v.movimiento = opcion(mov.nivel,catalogo.MOVIMIENTOS,v.movimiento);
  v.hover = opcion(anim.hover_botones,catalogo.HOVERS,v.hover);
  v.presionar = opcion(anim.al_presionar,catalogo.PRESIONAR,v.presionar);
  v.aparicion = opcion(anim.aparicion_listas,catalogo.APARICIONES,v.aparicion);
  v.cambio = opcion(anim.cambio_de_pantalla,catalogo.CAMBIOS,v.cambio);
  Object.assign(v, {
    scroll: lista(mapa(mov.scroll).efectos).map(x => mapa(x).id),
    secciones: lista(sec(22).secciones).map(x => mapa(x).diseno),
    layout: opcion(sec(19).layout, LAYOUTS, v.layout),
    fondo: opcion(sec(19).fondo, FONDOS, 'ninguno'),
    estilo: opcion(sec(19).estilo, ESTILOS, 'clasico'),
    fondoAnimado: texto(sec(19).fondo_animado) || 'ninguno',
  });
  const caja = sec(20), borde = mapa(caja.contorno);
  c.cajas.preset = opcion(caja.diseno_base,CAJAS,'ninguno');
  const valores: Mapa = { ...caja, bordeGrosor: borde.grosor, bordeEstilo: borde.linea, bordeColor: borde.color,
    radio: texto(caja.esquinas).replace(/px$/,''), relleno: caja.espacio_interno, hover: caja.al_pasar_el_mouse };
  for (const k of textos(caja.ajustado_a_mano)) {
    if (['transparencia','desenfoque','bordeGrosor'].includes(k)) {
      const n = parseFloat(String(valores[k]));
      if (Number.isFinite(n)) Object.assign(c.cajas.ajustes,{ [k]:n });
    } else if (propia(OPCIONES_CAJA,k) && propia(mapa(OPCIONES_CAJA)[k] as object,String(valores[k])))
      Object.assign(c.cajas.ajustes,{ [k]: valores[k] });
  }
  for (const k of claves(CATEGORIAS)) {
    const id = texto(mapa(sec(21)[k]).diseno);
    if (propia(CATEGORIAS[k].disenos,id)) c.componentes[k] = id;
  }
  for (const [n,k] of [[2,'proyecto'],[3,'estructura'],[4,'funciones'],[5,'direccion'],[6,'color'],[7,'tipografia'],[9,'forma'],[10,'botones'],[12,'movimiento']] as const)
    if (typeof sec(n).nota === 'string') c.notas[k] = String(sec(n).nota);
  c.notasGenerales = textos(sec(17).notas).join('\n');
  const config = normalizar(c);
  const actual = bloques(generarDesignMd(config)).datos;
  for (const n of [2,3,4,5,6,7,8,9,10,11,12,13,17,19,20,21,22]) {
    if (JSON.stringify(actual[n]) !== JSON.stringify(datos[n])) errores.add(n);
  }
  return { config, avisos: [...errores].sort((a,b) => a-b) };
}
