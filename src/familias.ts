// Familias de UI: grupos de diseños que van juntos (todo neobrutal, todo vidrio, todo de líneas
// finas…). Un «paquete» es una familia aplicada a todas las categorías a la vez, así no se arman
// mezclas raras. Cada categoría tiene una lista de candidatos en orden de preferencia; las variantes
// de un mismo paquete eligen otro candidato de la lista, sin salir de la familia.

import type { BotonDisenoId, CajaPresetId, Config, EstiloId } from './tipos';
import { CATEGORIAS, type CategoriaId, DISENO_INICIAL } from './galeria';
import { BOTONES } from './botones-disenos';
import { CAJAS } from './cajas';

export type FamiliaId = 'clasica' | 'suave' | 'minimal' | 'editorial' | 'tonal' | 'neobrutal' | 'vidrio' | 'oscura' | 'neon' | 'retro';

export interface Familia {
  nombre: string;
  descripcion: string;
  botones: BotonDisenoId[];
  cajas: CajaPresetId[];
  /** Candidatos por categoría. Lo que no está usa los genéricos de la familia o el diseño inicial. */
  piezas: Partial<Record<CategoriaId, string[]>>;
  /** Palabras que se prueban en cualquier categoría que no esté en `piezas` (por ejemplo «neobrutal»). */
  genericos: string[];
}

export const FAMILIAS: Record<FamiliaId, Familia> = {
  clasica: {
    nombre: 'Clásica',
    descripcion: 'Lo de siempre, bien hecho: rellenos sólidos, bordes suaves y nada que distraiga',
    botones: ['solido', 'flecha', 'relleno_abajo'],
    cajas: ['superficie', 'elevada', 'contorno'],
    genericos: ['clasico', 'clasica'],
    piezas: {
      boton_sec: ['contorno', 'tonal', 'link_flecha'], boton_icono: ['fantasma', 'tonal', 'con_punto'],
      campo: ['contorno', 'flotante', 'con_icono'], selector: ['pildora', 'ios', 'separado'], interruptor: ['clasico', 'material', 'iconos'],
      casilla: ['cuadrada', 'rebote', 'tarjeta'], deslizador: ['clasico', 'burbuja', 'escalonado'],
      nav_movil: ['clasica', 'indicador', 'flotante'], nav_web: ['clasica', 'subrayado', 'pastilla'],
      etiqueta: ['suave', 'punto'], aviso: ['tarjeta', 'barra'], cargando: ['anillo', 'esqueleto'], progreso: ['fina', 'pasos'],
      acordeon: ['lineas', 'mas_menos'], avatar: ['circulo', 'apilados'], tooltip: ['oscuro', 'flecha'], modal: ['centrada', 'alerta'],
      metrica: ['simple', 'sparkline', 'meta'], grafico: ['barras', 'linea_suave', 'area'], tabla: ['lineas', 'pastillas'],
      desplegable: ['clasico', 'tilde'], buscador: ['simple', 'acento'], paginacion: ['numeros', 'acento'], migas: ['chevron', 'barra'],
      pasos: ['circulos', 'barras'], vacio: ['centrado', 'color'], calendario: ['clasico', 'eventos'], carrusel: ['clasico', 'barras'],
      pie: ['columnas', 'newsletter'], formulario: ['apilado', 'tarjetas', 'etiqueta_dentro'], subir: ['zona', 'boton'],
      producto: ['clasica', 'sombra'], notificaciones: ['clasica', 'punto'], usuario: ['clasico', 'cabecera_color'],
      acceso: ['tarjeta', 'centrado'], wizard: ['circulos', 'barra'], reserva: ['pastillas', 'cuadros'],
    },
  },
  suave: {
    nombre: 'Suave y redonda',
    descripcion: 'Todo en píldora, colores amables y respuestas con rebote',
    botones: ['pildora', 'almohada', 'acuoso', 'gota'],
    cajas: ['pildora_suave', 'elevada', 'flotante'],
    genericos: ['pildora', 'redonda', 'suave', 'burbuja'],
    piezas: {
      boton_sec: ['pildora', 'pastilla_suave', 'tonal'], boton_icono: ['tonal', 'flotante', 'rebota'],
      campo: ['pildora', 'relleno', 'flotante'], selector: ['gota', 'pildora', 'acento'], interruptor: ['liquido', 'elastico', 'clasico'],
      casilla: ['redonda', 'rebote', 'circulo_lleno'], deslizador: ['burbuja', 'grueso', 'pastilla'],
      nav_movil: ['pildora', 'burbuja', 'gota', 'flotante'], nav_web: ['pastilla', 'flotante'],
      etiqueta: ['suave', 'pildora_icono'], aviso: ['pildora', 'rebote', 'icono_grande'], cargando: ['puntos', 'rebote', 'dona'],
      progreso: ['gruesa', 'tonal', 'circular'], acordeon: ['tarjetas', 'sombra'], avatar: ['pastel', 'anillo', 'gota'],
      tooltip: ['pildora', 'rebote'], modal: ['hoja', 'centrada_icono'], metrica: ['pastilla', 'icono', 'centrada'],
      grafico: ['dona', 'barras', 'anillo'], tabla: ['separadas', 'pastillas'], desplegable: ['pildora', 'escala'],
      buscador: ['pildora', 'grande'], paginacion: ['acento', 'puntos'], migas: ['pastillas', 'volver'], pasos: ['puntos', 'circulos'],
      vacio: ['flota', 'color', 'tarjeta'], calendario: ['circulos', 'tonal'], carrusel: ['asoma', 'escala'], pie: ['tarjeta', 'centrado'],
      formulario: ['pastel', 'lista_agrupada', 'relleno'], subir: ['tonal', 'foto'], producto: ['sombra', 'al_pasar'],
      notificaciones: ['pulso', 'acento'], usuario: ['solo_avatar', 'cabecera_color'], acceso: ['pildora', 'centrado'],
      wizard: ['puntos', 'conversacional'], reserva: ['tonal', 'pastillas'],
    },
  },
  minimal: {
    nombre: 'Líneas finas',
    descripcion: 'Contornos de 1px, mucho aire y un solo acento: técnica y precisa',
    botones: ['contorno', 'plano_cuadrado', 'minimal_texto', 'teclado'],
    cajas: ['contorno', 'compacta', 'aire'],
    genericos: ['contorno', 'fino', 'fina', 'lineas', 'cuadrado', 'cuadrada'],
    piezas: {
      boton_sec: ['contorno_recto', 'contorno', 'fantasma'], boton_icono: ['cuadrado_contorno', 'contorno', 'fantasma'],
      campo: ['contorno', 'esquinas', 'linea_izquierda', 'prefijo'], selector: ['cuadrado', 'contorno', 'linea_arriba'],
      interruptor: ['cuadrado', 'pequeno', 'contorno'], casilla: ['cuadrada', 'dibujada', 'cruz'], deslizador: ['fino', 'regla', 'cuadrado'],
      nav_movil: ['linea_abajo', 'linea_superior', 'puntos'], nav_web: ['caja_activa', 'contorno', 'punto', 'segmentada'],
      etiqueta: ['contorno', 'mono', 'cuadrada'], aviso: ['contorno', 'barra'], cargando: ['linea', 'barras'], progreso: ['fina', 'cuadrada'],
      acordeon: ['lineas', 'flecha_izquierda'], avatar: ['contorno', 'cuadrado'], tooltip: ['mono', 'flecha'], modal: ['lateral', 'arriba'],
      metrica: ['borde', 'contorno', 'sparkline'], grafico: ['linea', 'barras_horizontales', 'lollipop'], tabla: ['compacta', 'lineas', 'grilla'],
      desplegable: ['contorno', 'tilde'], buscador: ['comando', 'simple'], paginacion: ['cuadros', 'grupo'], migas: ['barra', 'chevron'],
      pasos: ['cuadrados', 'texto'], vacio: ['punteado', 'lateral'], calendario: ['compacto', 'rango'], carrusel: ['numeros', 'abajo'],
      pie: ['simple', 'columnas'], formulario: ['en_linea', 'lateral', 'compacto'], subir: ['fila', 'minimo'], producto: ['minimal', 'horizontal'],
      notificaciones: ['lineas', 'punto'], usuario: ['lineas', 'cuadrado'], acceso: ['sin_caja', 'subrayado'], wizard: ['pestanas', 'lateral'],
      reserva: ['lista', 'sin_caja'],
    },
  },
  editorial: {
    nombre: 'Editorial',
    descripcion: 'Como una revista: subrayados, filetes, serif y nada de cajas',
    botones: ['subrayado', 'link_flecha', 'doble', 'texto_sube'],
    cajas: ['editorial', 'papel', 'renglones'],
    genericos: ['editorial', 'subrayado', 'lineas', 'texto'],
    piezas: {
      boton_sec: ['subrayado', 'subrayado_crece', 'mayusculas'], boton_icono: ['subrayado', 'fantasma'],
      campo: ['subrayado', 'leyenda', 'invisible', 'doble_linea'], selector: ['editorial', 'subrayado'], interruptor: ['lineas', 'si_no'],
      casilla: ['tachar', 'tachar_suave', 'dibujada'], deslizador: ['fino', 'regla'], nav_movil: ['linea_abajo', 'solo_activa_texto'],
      nav_web: ['editorial', 'crece', 'mayusculas', 'resaltador'], etiqueta: ['subrayada', 'sello', 'contorno'], aviso: ['barra', 'costado'],
      cargando: ['texto', 'linea'], progreso: ['fina', 'pasos'], acordeon: ['numerado', 'grande', 'lineas'], avatar: ['circulo', 'contorno'],
      tooltip: ['claro', 'flecha'], modal: ['lateral', 'desenfoque'], metrica: ['grande', 'hero', 'borde'], grafico: ['linea', 'barras_resaltada'],
      tabla: ['lineas', 'encabezado'], desplegable: ['tilde', 'contorno'], buscador: ['subrayado', 'grande'], paginacion: ['texto', 'subrayado'],
      migas: ['mayusculas', 'punto'], pasos: ['texto', 'circulos'], vacio: ['grande', 'centrado'], calendario: ['compacto', 'tonal'],
      carrusel: ['fundido', 'numeros'], pie: ['gigante', 'simple'], formulario: ['editorial_abierto', 'subrayado', 'conversacional', 'papel'],
      subir: ['minimo', 'fila'], producto: ['ficha_editorial', 'minimal'], notificaciones: ['lineas', 'sin_borde'], usuario: ['lineas', 'clasico'],
      acceso: ['subrayado', 'sin_caja'], wizard: ['conversacional', 'pestanas'], reserva: ['franja', 'lista'],
    },
  },
  tonal: {
    nombre: 'Tonal de color',
    descripcion: 'Fondos suaves del color principal y marcas bien de color',
    botones: ['tonal', 'sombra_suave_color', 'relleno_lateral', 'centro_expande'],
    cajas: ['acento_borde', 'barra_acento', 'hundida_color'],
    genericos: ['tonal', 'acento', 'color', 'degradado'],
    piezas: {
      boton_sec: ['tonal', 'contorno_acento', 'pastilla_suave'], boton_icono: ['tonal', 'relleno', 'se_rellena'],
      campo: ['relleno', 'degradado_suave', 'resplandor'], selector: ['acento', 'degradado'], interruptor: ['material', 'iconos', 'brillo'],
      casilla: ['suave', 'chip', 'estrella'], deslizador: ['tonal', 'degradado', 'grueso'], nav_movil: ['rellena', 'fondo_desliza', 'cuadrado'],
      nav_web: ['acento', 'pastilla', 'resaltador'], etiqueta: ['solida', 'degradado', 'suave'], aviso: ['tonal', 'icono_grande'],
      cargando: ['dona', 'pulso'], progreso: ['tonal', 'degradado'], acordeon: ['resaltado', 'tarjetas'], avatar: ['anillo', 'degradado'],
      tooltip: ['acento', 'pildora'], modal: ['centrada_icono', 'alerta'], metrica: ['acento', 'degradado', 'icono'],
      grafico: ['area', 'barras_resaltada', 'mapa_calor'], tabla: ['resaltada', 'pastillas'], desplegable: ['acento', 'tilde'],
      buscador: ['acento', 'pildora'], paginacion: ['acento', 'puntos'], migas: ['pastillas', 'flechas'], pasos: ['flechas', 'barras'],
      vacio: ['color', 'tarjeta'], calendario: ['tonal', 'eventos'], carrusel: ['asoma', 'barras'], pie: ['acento', 'newsletter'],
      formulario: ['cabecera_color', 'tarjetas', 'numerado'], subir: ['tonal', 'boton'], producto: ['precio_foto', 'catalogo_detallado'],
      notificaciones: ['acento', 'pulso'], usuario: ['cabecera_color', 'clasico'], acceso: ['cabecera', 'dividido'], wizard: ['barra', 'circulos'],
      reserva: ['tonal', 'cuadros'],
    },
  },
  neobrutal: {
    nombre: 'Neobrutal',
    descripcion: 'Bordes negros gruesos, sombras sólidas y colores sin miedo',
    botones: ['sombra_dura', 'empujable', 'sticker', 'tres_d_lateral'],
    cajas: ['neobrutal', 'gruesa', 'sombra_color', 'grano_dura'],
    genericos: ['neobrutal', 'sombra_dura', 'sombra_dura_gris'],
    piezas: { boton_sec: ['neobrutal', 'sombra_dura_gris', 'contorno_grueso'], campo: ['neobrutal', 'tarjeta'], formulario: ['neobrutal', 'expediente'] },
  },
  vidrio: {
    nombre: 'Vidrio',
    descripcion: 'Superficies translúcidas con desenfoque, livianas y luminosas',
    botones: ['vidrio', 'esmerilado', 'vidrio_ahumado'],
    cajas: ['vidrio', 'flotante_vidrio', 'cristal_color', 'cabecera_vidrio'],
    genericos: ['vidrio', 'desenfoque', 'vidrio_oscuro'],
    piezas: { boton_sec: ['vidrio', 'vidrio_oscuro'], modal: ['desenfoque', 'vidrio'] },
  },
  oscura: {
    nombre: 'Oscura',
    descripcion: 'Piezas oscuras de alto contraste, sobrias y nocturnas',
    botones: ['metal_oscuro', 'solido', 'brillo_borde'],
    cajas: ['invertida', 'invertida_brillo', 'hundida'],
    genericos: ['oscuro', 'oscura', 'lateral_oscura'],
    piezas: { boton_sec: ['oscuro', 'gris_solido'], nav_web: ['oscura', 'lateral_oscura'], acordeon: ['oscuro'] },
  },
  neon: {
    nombre: 'Neón',
    descripcion: 'Brillos del color de acento, ideal para fondos oscuros y gamer',
    botones: ['neon', 'neon_encendido', 'luz_neon_tubo', 'gira_borde'],
    cajas: ['brillo', 'invertida_brillo', 'degradado_vidrio'],
    genericos: ['neon', 'brillo', 'resplandor', 'neon_contorno'],
    piezas: { boton_sec: ['neon_contorno'], campo: ['resplandor', 'se_dibuja'] },
  },
  retro: {
    nombre: 'Retro',
    descripcion: 'Biseles de los 90, píxeles y ventanas de escritorio',
    botones: ['bisel', 'mac_clasico', 'pixel', 'web_2000'],
    cajas: ['doble', 'sello', 'cuaderno'],
    genericos: ['retro', 'retro_bisel', 'terminal', 'maquina'],
    piezas: { boton_sec: ['retro_bisel'], campo: ['retro', 'terminal', 'maquina'] },
  },
};

/** Qué familias le quedan bien a cada estilo, en orden. El resto se ofrece después. */
const FAMILIAS_POR_ESTILO: Partial<Record<EstiloId | 'clasico', FamiliaId[]>> = {
  suizo: ['minimal', 'editorial', 'neobrutal'],
  bauhaus: ['neobrutal', 'tonal', 'clasica'],
  memphis: ['neobrutal', 'suave', 'tonal'],
  neobrutalismo: ['neobrutal', 'tonal', 'retro'],
  vidrio: ['vidrio', 'suave', 'neon'],
  clay: ['suave', 'tonal', 'clasica'],
  retro_os: ['retro', 'neobrutal', 'minimal'],
  terminal: ['retro', 'neon', 'minimal'],
  editorial: ['editorial', 'minimal', 'clasica'],
  periodico: ['editorial', 'minimal', 'retro'],
  art_deco: ['editorial', 'oscura', 'minimal'],
  y2k: ['neon', 'vidrio', 'suave'],
  organico: ['suave', 'editorial', 'tonal'],
  japones: ['editorial', 'minimal', 'suave'],
  minimal_tecnico: ['minimal', 'clasica', 'oscura'],
  oscuro_precision: ['oscura', 'neon', 'minimal'],
  producto_amable: ['suave', 'tonal', 'clasica'],
  dopamina: ['suave', 'neobrutal', 'tonal'],
  lujo: ['editorial', 'oscura', 'minimal'],
  cyber: ['neon', 'oscura', 'retro'],
  clasico: ['clasica', 'suave', 'minimal'],
};

export function familiasPara(estilo: EstiloId | 'clasico'): FamiliaId[] {
  const primero = FAMILIAS_POR_ESTILO[estilo] ?? ['clasica'];
  const resto = (Object.keys(FAMILIAS) as FamiliaId[]).filter((f) => !primero.includes(f));
  return [...primero, ...resto];
}

export interface Paquete {
  familia: FamiliaId;
  variante: number;
  boton: BotonDisenoId;
  caja: CajaPresetId;
  componentes: Partial<Record<CategoriaId, string>>;
}

const existe = (cat: CategoriaId, id: string) => id in CATEGORIAS[cat].disenos;

/** El paquete número `n` para un estilo: recorre sus familias y, al dar la vuelta, la siguiente variante. */
export function paqueteN(estilo: EstiloId | 'clasico', n: number): Paquete {
  const fams = familiasPara(estilo);
  // Las 3 familias que mejor le quedan al estilo se repiten más (con otra variante) antes que el resto.
  const preferidas = fams.slice(0, 3);
  const orden = [...preferidas, ...preferidas, ...fams.slice(3), ...preferidas];
  const familia = orden[n % orden.length];
  const variante = Math.floor(n / orden.length) + orden.slice(0, n % orden.length).filter((f) => f === familia).length;
  const f = FAMILIAS[familia];
  const elegir = <T,>(xs: T[]) => xs[variante % xs.length];
  const componentes: Partial<Record<CategoriaId, string>> = {};
  for (const cat of Object.keys(CATEGORIAS) as CategoriaId[]) {
    const propios = (f.piezas[cat] ?? []).filter((id) => existe(cat, id));
    const genericos = f.genericos.filter((id) => existe(cat, id));
    const candidatos = propios.length ? propios : genericos;
    componentes[cat] = candidatos.length ? elegir(candidatos) : DISENO_INICIAL[cat];
  }
  return {
    familia,
    variante,
    boton: elegir(f.botones.filter((b) => b in BOTONES)),
    caja: elegir(f.cajas.filter((k) => k in CAJAS)),
    componentes,
  };
}

/** Aplica un paquete: botón, cajas y todas las piezas a la vez. */
export function aplicarPaquete(c: Config, p: Paquete): Config {
  return { ...c, botones: { ...c.botones, diseno: p.boton }, cajas: { preset: p.caja, ajustes: {} }, componentes: { ...c.componentes, ...p.componentes } };
}
