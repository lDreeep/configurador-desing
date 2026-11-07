// Qué opciones se recomiendan según lo que la persona va a hacer (tipo de proyecto).
// Es DATOS: los paneles muestran primero estas opciones, con el sello «Recomendado», y el resto abajo.
// Nada se esconde: la recomendación ordena, no limita. Los tests verifican que cada id exista.

import type { CategoriaId } from './galeria/base';
import type { BotonDisenoId, CajaPresetId, EstiloId, LayoutId, TipoProyecto } from './tipos';

export interface Recomendados {
  /** Cómo se nombra el proyecto en frases como «Recomendados para tu …». */
  para: string;
  /** Por qué se recomiendan, en una frase. */
  porque: string;
  layouts: LayoutId[];
  estilos: EstiloId[];
  botones: BotonDisenoId[];
  cajas: CajaPresetId[];
  componentes: Partial<Record<CategoriaId, string[]>>;
}

/** Lo que sirve en casi cualquier proyecto; cada tipo lo pisa donde tiene algo más específico. */
const BASE: Recomendados['componentes'] = {
  boton_sec: ['contorno', 'tonal', 'fantasma', 'link_flecha'],
  boton_icono: ['fantasma', 'tonal', 'contorno', 'con_punto'],
  campo: ['contorno', 'flotante', 'relleno', 'con_icono'],
  selector: ['pildora', 'ios', 'subrayado'],
  interruptor: ['clasico', 'material', 'iconos'],
  casilla: ['cuadrada', 'rebote', 'chip'],
  deslizador: ['clasico', 'burbuja', 'escalonado'],
  nav_movil: ['clasica', 'indicador', 'pildora', 'flotante'],
  nav_web: ['clasica', 'subrayado', 'pastilla', 'flotante'],
  etiqueta: ['suave', 'punto', 'contorno'],
  aviso: ['tarjeta', 'barra', 'oscura'],
  cargando: ['anillo', 'esqueleto', 'linea'],
  progreso: ['fina', 'pasos', 'circular'],
  acordeon: ['lineas', 'mas_menos', 'tarjetas'],
  avatar: ['circulo', 'apilados', 'estado'],
  tooltip: ['oscuro', 'flecha', 'claro'],
  modal: ['centrada', 'hoja', 'alerta'],
  metrica: ['simple', 'sparkline', 'icono', 'meta'],
  grafico: ['barras', 'linea_suave', 'area', 'dona'],
  tabla: ['lineas', 'pastillas', 'tarjeta'],
  desplegable: ['clasico', 'tilde', 'pildora'],
  buscador: ['simple', 'pildora', 'acento'],
  paginacion: ['numeros', 'acento', 'texto'],
  migas: ['chevron', 'barra', 'volver'],
  pasos: ['circulos', 'barras', 'puntos'],
  vacio: ['centrado', 'color', 'punteado'],
};

const con = (extra: Recomendados['componentes']) => ({ ...BASE, ...extra });

export const RECOMENDADOS: Record<TipoProyecto, Recomendados> = {
  landing: {
    para: 'página web',
    porque: 'Una página que presenta algo vive del primer impacto: título grande, un botón que se note y secciones claras.',
    layouts: ['hero_partido', 'cinta', 'bento', 'tipografico'],
    estilos: ['producto_amable', 'neobrutalismo', 'suizo', 'vidrio', 'minimal_tecnico'],
    botones: ['flecha', 'pildora', 'degradado', 'brillo_barrido', 'sombra_dura', 'circulo_flecha'],
    cajas: ['elevada', 'contorno', 'acento', 'degradado', 'sombra_color'],
    componentes: con({
      nav_web: ['flotante', 'vidrio', 'subrayado', 'pastilla'],
      boton_sec: ['contorno', 'link_flecha', 'subrayado_crece', 'pildora'],
      acordeon: ['lineas', 'mas_menos', 'grande'],
      avatar: ['apilados', 'circulo', 'anillo'],
      aviso: ['desde_arriba', 'tarjeta', 'oscura'],
    }),
  },
  sitio: {
    para: 'sitio institucional',
    porque: 'Un sitio con varias secciones necesita orden: navegación clara, textos que se lean bien y botones sobrios.',
    layouts: ['hero_partido', 'revista', 'indice', 'apiladas'],
    estilos: ['editorial', 'suizo', 'organico', 'minimal_tecnico'],
    botones: ['solido', 'contorno', 'flecha', 'subrayado', 'link_flecha', 'tonal'],
    cajas: ['contorno', 'superficie', 'editorial', 'cabecera', 'barra'],
    componentes: con({
      nav_web: ['clasica', 'crece', 'editorial', 'subrayado'],
      boton_sec: ['contorno', 'link_flecha', 'subrayado', 'mayusculas'],
      acordeon: ['lineas', 'numerado', 'mas_menos'],
    }),
  },
  tienda: {
    para: 'tienda',
    porque: 'En una tienda manda el producto: botones de compra que inviten a tocar, cards de producto limpias y avisos de «agregado».',
    layouts: ['mosaico', 'hero_partido', 'bento', 'horizontal'],
    estilos: ['producto_amable', 'editorial', 'clay', 'neobrutalismo', 'organico'],
    botones: ['pildora', 'solido', 'relleno_abajo', 'sombra_suave_color', 'almohada', 'deslizar_icono'],
    cajas: ['elevada', 'superficie', 'flotante', 'ticket', 'sombra_color'],
    componentes: con({
      boton_sec: ['contorno', 'pildora', 'superficie', 'con_icono'],
      boton_icono: ['con_punto', 'contador', 'se_rellena', 'flotante'],
      etiqueta: ['solida', 'suave', 'sello', 'colgante'],
      aviso: ['tarjeta', 'desde_arriba', 'temporizador'],
      casilla: ['chip', 'estrella', 'redonda'],
      selector: ['pildora', 'separado', 'acento'],
      deslizador: ['grueso', 'burbuja', 'clasico'],
      nav_movil: ['central', 'indicador', 'pildora', 'burbuja'],
      modal: ['hoja', 'lateral', 'centrada'],
      progreso: ['pasos', 'fina', 'gruesa'],
      buscador: ['pildora', 'grande', 'acento'],
      pasos: ['circulos', 'flechas', 'barras'],
      paginacion: ['acento', 'numeros', 'puntos'],
    }),
  },
  app_web: {
    para: 'app web',
    porque: 'Una herramienta se usa todos los días: tiene que ser clara y rápida, con formularios cómodos y estados bien marcados.',
    layouts: ['app_lateral', 'panel_fijo', 'bento', 'indice'],
    estilos: ['minimal_tecnico', 'oscuro_precision', 'vidrio', 'producto_amable'],
    botones: ['solido', 'tonal', 'contorno', 'teclado', 'plano_cuadrado', 'flecha'],
    cajas: ['contorno', 'superficie', 'cabecera', 'elevada', 'hundida'],
    componentes: con({
      nav_web: ['lateral', 'lateral_compacta', 'segmentada', 'lateral_oscura'],
      campo: ['contorno', 'flotante', 'con_icono', 'prefijo'],
      selector: ['ios', 'pildora', 'cuadrado'],
      interruptor: ['clasico', 'material', 'cuadrado'],
      modal: ['centrada', 'lateral', 'alerta'],
      tabla: ['lineas', 'pastillas', 'cebra'],
      cargando: ['esqueleto', 'anillo', 'linea'],
      buscador: ['comando', 'simple', 'pildora'],
      desplegable: ['tilde', 'clasico', 'contorno'],
      vacio: ['punteado', 'lateral', 'color'],
    }),
  },
  app_movil: {
    para: 'app de celular',
    porque: 'En el celular todo se toca con el pulgar: barra de abajo, botones grandes, controles que respondan al toque y hojas que suben.',
    layouts: ['apiladas', 'minimo', 'bento', 'hero_partido'],
    estilos: ['producto_amable', 'clay', 'vidrio', 'oscuro_precision', 'memphis'],
    botones: ['pildora', 'almohada', 'empujable', 'acuoso', 'clay', 'respira'],
    cajas: ['elevada', 'flotante', 'superficie', 'vidrio', 'neumorfica'],
    componentes: con({
      nav_movil: ['indicador', 'flotante', 'central', 'expandible', 'gota'],
      boton_icono: ['flotante', 'tonal', 'con_punto', 'rebota'],
      interruptor: ['clasico', 'liquido', 'elastico', 'iconos'],
      casilla: ['redonda', 'rebote', 'tachar'],
      deslizador: ['grueso', 'burbuja', 'pastilla'],
      selector: ['ios', 'gota', 'pildora'],
      modal: ['hoja', 'alerta', 'centrada'],
      campo: ['relleno', 'pildora', 'flotante', 'grande'],
      cargando: ['puntos', 'anillo', 'esqueleto'],
      migas: ['volver', 'chevron', 'pastillas'],
      pasos: ['puntos', 'barras', 'circulos'],
      paginacion: ['puntos', 'texto', 'acento'],
      vacio: ['grande', 'flota', 'color'],
    }),
  },
  dashboard: {
    para: 'dashboard',
    porque: 'Un dashboard es para leer números rápido: menú lateral, métricas arriba, gráficos sobrios y tablas fáciles de escanear.',
    layouts: ['app_lateral', 'bento', 'panel_fijo'],
    estilos: ['oscuro_precision', 'minimal_tecnico', 'vidrio', 'suizo'],
    botones: ['solido', 'tonal', 'plano_cuadrado', 'contorno', 'teclado', 'flecha'],
    cajas: ['contorno', 'superficie', 'cabecera', 'barra', 'vidrio'],
    componentes: con({
      nav_web: ['lateral', 'lateral_oscura', 'lateral_compacta', 'segmentada'],
      metrica: ['sparkline', 'meta', 'pastilla', 'borde', 'hero'],
      grafico: ['barras_resaltada', 'linea_suave', 'area', 'barras_horizontales', 'mapa_calor'],
      tabla: ['pastillas', 'lineas', 'cebra', 'encabezado'],
      selector: ['ios', 'cuadrado', 'pildora'],
      etiqueta: ['punto', 'suave', 'mono'],
      cargando: ['esqueleto', 'linea', 'anillo'],
      progreso: ['fina', 'circular', 'pasos'],
      buscador: ['comando', 'simple', 'subrayado'],
      paginacion: ['cuadros', 'grupo', 'texto'],
      desplegable: ['tilde', 'contorno', 'clasico'],
      vacio: ['lateral', 'punteado', 'centrado'],
    }),
  },
  portfolio: {
    para: 'portfolio',
    porque: 'En un portfolio lo importante es el trabajo: tipografía con carácter, mucho aire, imágenes grandes y botones discretos.',
    layouts: ['tipografico', 'revista', 'mosaico', 'minimo', 'horizontal'],
    estilos: ['suizo', 'editorial', 'art_deco', 'bauhaus', 'y2k'],
    botones: ['subrayado', 'link_flecha', 'texto_sube', 'minimal_texto', 'circulo_flecha', 'contorno'],
    cajas: ['editorial', 'contorno', 'papel', 'invertida', 'gruesa'],
    componentes: con({
      nav_web: ['editorial', 'crece', 'punto', 'resaltador'],
      boton_sec: ['subrayado', 'subrayado_crece', 'link_flecha', 'mayusculas'],
      etiqueta: ['contorno', 'mono', 'cuadrada'],
      campo: ['subrayado', 'invisible', 'grande', 'leyenda'],
      avatar: ['circulo', 'contorno', 'anillo'],
      migas: ['mayusculas', 'punto', 'barra'],
      paginacion: ['texto', 'subrayado', 'numeros'],
    }),
  },
  blog: {
    para: 'blog',
    porque: 'Un blog es para leer: buena tipografía, columnas cómodas, etiquetas de tema y autores visibles.',
    layouts: ['revista', 'indice', 'tipografico', 'minimo'],
    estilos: ['editorial', 'organico', 'suizo', 'retro_os'],
    botones: ['subrayado', 'link_flecha', 'contorno', 'solido', 'tinta', 'subrayado_relleno'],
    cajas: ['editorial', 'papel', 'contorno', 'cuaderno', 'barra'],
    componentes: con({
      nav_web: ['editorial', 'clasica', 'crece', 'subrayado'],
      etiqueta: ['suave', 'contorno', 'sello', 'mono'],
      avatar: ['circulo', 'anillo', 'apilados'],
      acordeon: ['lineas', 'numerado', 'grande'],
      campo: ['subrayado', 'contorno', 'cuaderno'],
      buscador: ['subrayado', 'grande', 'simple'],
      migas: ['mayusculas', 'chevron', 'punto'],
      paginacion: ['texto', 'numeros', 'subrayado'],
    }),
  },
};

/** Ids recomendados primero (en el orden de la recomendación) y después el resto, en su orden original. */
export function ordenar<T extends string>(todos: T[], recomendados: readonly string[] = []): { recomendados: T[]; resto: T[] } {
  const rec = recomendados.filter((id): id is T => (todos as string[]).includes(id));
  return { recomendados: rec, resto: todos.filter((id) => !rec.includes(id)) };
}
