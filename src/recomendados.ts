// Qué opciones se recomiendan según lo que la persona va a hacer (tipo de proyecto).
// Es DATOS: los paneles muestran primero estas opciones, con el sello «Recomendado», y el resto abajo.
// Nada se esconde: la recomendación ordena, no limita. Los tests verifican que cada id exista.

import type { FamiliaId } from './familias';
import type { CategoriaId } from './galeria/base';
import type { BotonDisenoId, CajaPresetId, EstiloId, LayoutId, PaletaId, TipoProyecto } from './tipos';

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
  calendario: ['clasico', 'circulos', 'eventos'],
  carrusel: ['clasico', 'asoma', 'barras'],
  pie: ['columnas', 'newsletter', 'simple'],
  formulario: ['apilado', 'recorrido_movil', 'editorial_abierto', 'tarjetas'],
  subir: ['zona', 'boton', 'fila'],
  producto: ['clasica', 'ficha_editorial', 'pedido_rapido', 'sin_caja'],
  notificaciones: ['clasica', 'punto', 'lineas'],
  usuario: ['clasico', 'solo_avatar', 'cabecera_color'],
  acceso: ['tarjeta', 'centrado', 'dividido'],
  wizard: ['circulos', 'barra', 'pestanas'],
  reserva: ['pastillas', 'cuadros', 'franja'],
};

const con = (extra: Recomendados['componentes']) => ({ ...BASE, ...extra });

export const RECOMENDADOS: Record<TipoProyecto, Recomendados> = {
  landing: {
    para: 'página web',
    porque: 'Una página que presenta algo vive del primer impacto: título grande, un botón que se note y secciones claras.',
    layouts: ['autor_turnos', 'autor_curso', 'autor_gimnasio', 'autor_concesionario', 'autor_festival', 'autor_panaderia', 'autor_refugio', 'fondo_protagonista', 'hero_partido', 'tarjeta_sobre_fondo', 'portada_video', 'precios', 'equipo', 'cinta', 'bento', 'antes_despues', 'linea_tiempo', 'partida_scroll', 'link_bio'],
    estilos: ['producto_amable', 'neobrutalismo', 'suizo', 'vidrio', 'minimal_tecnico'],
    botones: ['flecha', 'pildora', 'degradado', 'brillo_barrido', 'sombra_dura', 'circulo_flecha'],
    cajas: ['elevada', 'contorno', 'acento', 'degradado', 'sombra_color'],
    componentes: con({
      nav_web: ['flotante', 'cabecera_doble', 'vidrio', 'subrayado'],
      boton_sec: ['contorno', 'link_flecha', 'subrayado_crece', 'pildora'],
      acordeon: ['lineas', 'mas_menos', 'grande'],
      avatar: ['apilados', 'circulo', 'anillo'],
      aviso: ['desde_arriba', 'tarjeta', 'oscura'],
    }),
  },
  sitio: {
    para: 'sitio institucional',
    porque: 'Un sitio con varias secciones necesita orden: navegación clara, textos que se lean bien y botones sobrios.',
    layouts: ['autor_restaurante', 'autor_gimnasio', 'autor_concesionario', 'autor_refugio', 'autor_cafeteria', 'hero_partido', 'equipo', 'revista', 'indice', 'precios', 'apiladas', 'carta', 'mapa_lista', 'linea_tiempo', 'portada_buscador'],
    estilos: ['editorial', 'suizo', 'organico', 'minimal_tecnico'],
    botones: ['solido', 'contorno', 'flecha', 'subrayado', 'link_flecha', 'tonal'],
    cajas: ['contorno', 'superficie', 'editorial', 'cabecera', 'barra'],
    componentes: con({
      nav_web: ['cabecera_doble', 'clasica', 'editorial', 'subrayado'],
      boton_sec: ['contorno', 'link_flecha', 'subrayado', 'mayusculas'],
      acordeon: ['lineas', 'numerado', 'mas_menos'],
      pie: ['columnas', 'newsletter', 'simple', 'centrado', 'acento', 'oscuro'],
    }),
  },
  tienda: {
    para: 'tienda',
    porque: 'En una tienda manda el producto: botones de compra que inviten a tocar, cards de producto limpias y avisos de «agregado».',
    layouts: ['autor_concesionario', 'autor_floreria', 'autor_cafeteria', 'autor_panaderia', 'galeria', 'editorial_fondo', 'mosaico', 'hero_partido', 'fondo_protagonista', 'bento', 'compra_unica', 'portada_buscador', 'carta'],
    estilos: ['producto_amable', 'editorial', 'lujo', 'dopamina', 'clay', 'neobrutalismo'],
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
      buscador: ['pildora', 'grande', 'acento', 'simple', 'subrayado', 'vidrio'],
      formulario: ['tarjetas', 'numerado', 'etiqueta_dentro', 'apilado', 'pastel', 'dos_columnas'],
      carrusel: ['asoma', 'clasico', 'numeros'],
      producto: ['escaparate', 'pedido_rapido', 'catalogo_detallado', 'ficha_editorial', 'clasica', 'horizontal'],
      pie: ['newsletter', 'columnas', 'acento'],
      pasos: ['circulos', 'flechas', 'barras'],
      paginacion: ['acento', 'numeros', 'puntos'],
    }),
  },
  app_web: {
    para: 'app web',
    porque: 'Una herramienta se usa todos los días: tiene que ser clara y rápida, con formularios cómodos y estados bien marcados.',
    layouts: ['autor_turnos', 'autor_finanzas', 'app_lateral', 'panel_fijo', 'bento', 'indice', 'agenda_semanal', 'tablero', 'mapa_lista'],
    estilos: ['minimal_tecnico', 'oscuro_precision', 'vidrio', 'producto_amable'],
    botones: ['solido', 'tonal', 'contorno', 'teclado', 'plano_cuadrado', 'flecha'],
    cajas: ['contorno', 'superficie', 'cabecera', 'elevada', 'hundida'],
    componentes: con({
      nav_web: ['lateral_espacios', 'lateral', 'muelle_iconos', 'segmentada', 'lateral_compacta', 'lateral_oscura'],
      campo: ['contorno', 'flotante', 'con_icono', 'prefijo'],
      selector: ['ios', 'pildora', 'cuadrado'],
      interruptor: ['clasico', 'material', 'cuadrado'],
      modal: ['centrada', 'lateral', 'alerta'],
      tabla: ['lineas', 'pastillas', 'cebra', 'encabezado', 'compacta', 'grilla'],
      cargando: ['esqueleto', 'anillo', 'linea'],
      buscador: ['comando', 'simple', 'pildora'],
      formulario: ['panel_operativo', 'expediente', 'lista_agrupada', 'en_linea', 'compacto', 'dos_columnas'],
      subir: ['fila', 'zona', 'boton'],
      calendario: ['rango', 'eventos', 'compacto'],
      desplegable: ['tilde', 'clasico', 'contorno'],
      vacio: ['punteado', 'lateral', 'color', 'centrado', 'tarjeta', 'grande'],
    }),
  },
  app_movil: {
    para: 'app de celular',
    porque: 'En el celular todo se toca con el pulgar: barra de abajo, botones grandes, controles que respondan al toque y hojas que suben.',
    layouts: ['autor_correr', 'autor_finanzas', 'widgets_fondo', 'apiladas', 'minimo', 'bento', 'hero_partido', 'link_bio', 'muro'],
    estilos: ['producto_amable', 'dopamina', 'clay', 'vidrio', 'oscuro_precision'],
    botones: ['pildora', 'almohada', 'empujable', 'acuoso', 'clay', 'respira'],
    cajas: ['elevada', 'flotante', 'superficie', 'vidrio', 'neumorfica'],
    componentes: con({
      nav_movil: ['indicador', 'flotante', 'central', 'expandible', 'gota', 'puntos'],
      boton_icono: ['flotante', 'tonal', 'con_punto', 'rebota'],
      interruptor: ['clasico', 'liquido', 'elastico', 'iconos'],
      casilla: ['redonda', 'rebote', 'tachar'],
      deslizador: ['grueso', 'burbuja', 'pastilla'],
      selector: ['ios', 'gota', 'pildora'],
      modal: ['hoja', 'alerta', 'centrada'],
      campo: ['relleno', 'pildora', 'flotante', 'grande', 'hundido', 'con_icono'],
      cargando: ['puntos', 'anillo', 'esqueleto'],
      migas: ['volver', 'chevron', 'pastillas'],
      formulario: ['recorrido_movil', 'lista_agrupada', 'barra_fija', 'tarjetas'],
      acceso: ['sin_caja', 'centrado', 'pildora'],
      wizard: ['puntos', 'conversacional', 'barra'],
      reserva: ['franja', 'tonal', 'pastillas'],
      aviso: ['tarjeta', 'desde_arriba', 'tonal', 'pildora', 'icono_grande', 'barra'],
      notificaciones: ['punto', 'pulso', 'clasica'],
      usuario: ['solo_avatar', 'clasico', 'cabecera_color'],
      subir: ['foto', 'tonal', 'zona'],
      calendario: ['circulos', 'eventos', 'tonal'],
      carrusel: ['asoma', 'barras', 'escala'],
      pasos: ['puntos', 'barras', 'circulos'],
      paginacion: ['puntos', 'texto', 'acento'],
      vacio: ['grande', 'flota', 'color'],
    }),
  },
  dashboard: {
    para: 'dashboard',
    porque: 'Un dashboard es para leer números rápido: menú lateral, métricas arriba, gráficos sobrios y tablas fáciles de escanear.',
    layouts: ['app_lateral', 'bento', 'panel_fijo', 'tablero', 'agenda_semanal'],
    estilos: ['oscuro_precision', 'minimal_tecnico', 'vidrio', 'suizo'],
    botones: ['solido', 'tonal', 'plano_cuadrado', 'contorno', 'teclado', 'flecha'],
    cajas: ['contorno', 'superficie', 'cabecera', 'barra', 'vidrio'],
    componentes: con({
      nav_web: ['lateral_espacios', 'lateral', 'lateral_oscura', 'segmentada'],
      metrica: ['sparkline', 'meta', 'pastilla', 'borde', 'hero', 'simple'],
      grafico: ['barras_resaltada', 'linea_suave', 'area', 'barras_horizontales', 'mapa_calor', 'linea'],
      tabla: ['pastillas', 'lineas', 'cebra', 'encabezado', 'compacta', 'grilla'],
      selector: ['ios', 'cuadrado', 'pildora'],
      etiqueta: ['punto', 'suave', 'mono'],
      cargando: ['esqueleto', 'linea', 'anillo'],
      progreso: ['fina', 'circular', 'pasos'],
      buscador: ['comando', 'simple', 'subrayado'],
      formulario: ['expediente', 'panel_operativo', 'compacto', 'lista_agrupada'],
      acceso: ['dividido', 'tarjeta', 'oscuro'],
      wizard: ['lateral', 'circulos', 'pestanas'],
      reserva: ['lista', 'cuadros', 'sin_caja'],
      paginacion: ['cuadros', 'grupo', 'texto'],
      desplegable: ['tilde', 'contorno', 'clasico'],
      vacio: ['lateral', 'punteado', 'centrado'],
    }),
  },
  portfolio: {
    para: 'portfolio',
    porque: 'En un portfolio lo importante es el trabajo: tipografía con carácter, mucho aire, imágenes grandes y botones discretos.',
    layouts: ['autor_portfolio', 'editorial_fondo', 'tipografico', 'galeria', 'revista', 'mosaico', 'tarjeta_sobre_fondo', 'minimo', 'partida_scroll', 'link_bio', 'linea_tiempo'],
    estilos: ['suizo', 'editorial', 'japones', 'art_deco', 'bauhaus', 'cyber'],
    botones: ['subrayado', 'link_flecha', 'texto_sube', 'minimal_texto', 'circulo_flecha', 'contorno'],
    cajas: ['editorial', 'contorno', 'papel', 'invertida', 'gruesa'],
    componentes: con({
      nav_web: ['indice_numerado', 'editorial', 'crece', 'punto'],
      boton_sec: ['subrayado', 'subrayado_crece', 'link_flecha', 'mayusculas'],
      etiqueta: ['contorno', 'mono', 'cuadrada'],
      campo: ['subrayado', 'invisible', 'grande', 'leyenda'],
      avatar: ['circulo', 'contorno', 'anillo'],
      migas: ['mayusculas', 'punto', 'barra'],
      pie: ['gigante', 'simple', 'centrado'],
      producto: ['minimal', 'sin_caja', 'al_pasar'],
      carrusel: ['fundido', 'numeros', 'abajo', 'clasico', 'asoma', 'escala'],
      paginacion: ['texto', 'subrayado', 'numeros'],
    }),
  },
  blog: {
    para: 'blog',
    porque: 'Un blog es para leer: buena tipografía, columnas cómodas, etiquetas de tema y autores visibles.',
    layouts: ['blog_lateral', 'revista', 'indice', 'tipografico', 'minimo', 'documentacion', 'muro', 'portada_buscador'],
    estilos: ['editorial', 'periodico', 'organico', 'japones', 'suizo'],
    botones: ['subrayado', 'link_flecha', 'contorno', 'solido', 'tinta', 'subrayado_relleno'],
    cajas: ['editorial', 'papel', 'contorno', 'cuaderno', 'barra'],
    componentes: con({
      nav_web: ['editorial', 'clasica', 'crece', 'subrayado'],
      etiqueta: ['suave', 'contorno', 'sello', 'mono'],
      avatar: ['circulo', 'anillo', 'apilados'],
      acordeon: ['lineas', 'numerado', 'grande'],
      campo: ['subrayado', 'contorno', 'cuaderno'],
      buscador: ['subrayado', 'grande', 'simple'],
      migas: ['mayusculas', 'chevron', 'punto', 'barra', 'flecha', 'pastillas'],
      acceso: ['centrado', 'sin_caja', 'tarjeta', 'cabecera', 'subrayado', 'pildora'],
      paginacion: ['texto', 'numeros', 'subrayado'],
    }),
  },
};

/** Ids recomendados primero (en el orden de la recomendación) y después el resto, en su orden original. */
export function ordenar<T extends string>(todos: T[], recomendados: readonly string[] = []): { recomendados: T[]; resto: T[] } {
  const rec = recomendados.filter((id): id is T => (todos as string[]).includes(id));
  return { recomendados: rec, resto: todos.filter((id) => !rec.includes(id)) };
}

// ─── Recomendados por rubro (PLAN.md D10) ─────────────────────────────────────────────────────────
// Dentro de un tipo, cada rubro tiene su propio gusto: un consultorio pide colores calmos y un
// restaurante, calidez. Cada rubro da 6 opciones por ronda (color, layout, estilo y familia de piezas);
// `rondas/` las pone primero y después van las del tipo y el resto del catálogo. Es DATOS: la
// recomendación ordena, no limita. Los tests verifican que cada id exista y que haya al menos 6.

export interface RecomendadosRubro {
  paletas: PaletaId[];
  layouts: LayoutId[];
  estilos: EstiloId[];
  familias: FamiliaId[];
}

const rb = (paletas: PaletaId[], layouts: LayoutId[], estilos: EstiloId[], familias: FamiliaId[]): RecomendadosRubro => ({ paletas, layouts, estilos, familias });

export const RECOMENDADOS_RUBRO: Record<string, RecomendadosRubro> = {
  // Landing
  producto_digital: rb(['azul_electrico', 'tinta_y_lima', 'medianoche_violeta', 'vidrio', 'grafito', 'contraste_cian'], ['hero_partido', 'bento', 'fondo_protagonista', 'cinta', 'precios', 'minimo'], ['producto_amable', 'minimal_tecnico', 'vidrio', 'oscuro_precision', 'cyber', 'suizo'], ['clasica', 'minimal', 'vidrio', 'tonal', 'oscura', 'monocroma']),
  servicio_profesional: rb(['papel', 'marina_naval', 'grafito', 'azul_electrico', 'mono_azul', 'oliva'], ['hero_partido', 'equipo', 'precios', 'apiladas', 'tarjeta_sobre_fondo', 'minimo'], ['suizo', 'editorial', 'minimal_tecnico', 'producto_amable', 'periodico', 'organico'], ['clasica', 'minimal', 'editorial', 'tonal', 'monocroma', 'papel']),
  evento: rb(['neon_magenta', 'memphis', 'tinta_y_lima', 'noche_dorada', 'rosa_chicle', 'contraste_amarillo'], ['autor_festival', 'fondo_protagonista', 'portada_video', 'cinta', 'tipografico', 'tarjeta_sobre_fondo'], ['dopamina', 'neobrutalismo', 'y2k', 'memphis', 'cyber', 'bauhaus'], ['neobrutal', 'neon', 'retro', 'suave', 'recortada', 'precio']),
  curso: rb(['azul_electrico', 'menta', 'durazno', 'caramelo', 'cielo', 'frutal_limon'], ['autor_curso', 'hero_partido', 'precios', 'equipo', 'apiladas', 'bento'], ['producto_amable', 'organico', 'clay', 'dopamina', 'editorial', 'suizo'], ['suave', 'clasica', 'tonal', 'pastel', 'editorial', 'minimal']),
  app_descargar: rb(['vidrio', 'medianoche_violeta', 'azul_electrico', 'coral_calido', 'neon_cian', 'pastel_lila'], ['hero_partido', 'widgets_fondo', 'bento', 'fondo_protagonista', 'cinta', 'apiladas'], ['producto_amable', 'vidrio', 'clay', 'dopamina', 'oscuro_precision', 'cyber'], ['suave', 'vidrio', 'tonal', 'clasica', 'oscura', 'pastel']),
  lista_espera: rb(['tinta_y_lima', 'noche_dorada', 'grafito', 'neon_limon', 'contraste_cian', 'mono_verde'], ['minimo', 'fondo_protagonista', 'tipografico', 'tarjeta_sobre_fondo', 'hero_partido', 'cinta'], ['minimal_tecnico', 'oscuro_precision', 'neobrutalismo', 'cyber', 'suizo', 'terminal'], ['minimal', 'oscura', 'neon', 'monocroma', 'terminal', 'neobrutal']),

  // Sitio
  estudio_empresa: rb(['suizo_rojo', 'grafito', 'papel', 'marina_naval', 'mono_azul', 'alto_contraste'], ['hero_partido', 'equipo', 'indice', 'revista', 'precios', 'apiladas'], ['suizo', 'minimal_tecnico', 'editorial', 'bauhaus', 'periodico', 'producto_amable'], ['minimal', 'editorial', 'clasica', 'monocroma', 'lineas_dobles', 'papel']),
  restaurante: rb(['tierra_ocre', 'terracota', 'vino', 'caramelo', 'noche_dorada', 'oliva'], ['autor_restaurante', 'autor_cafeteria', 'fondo_protagonista', 'galeria', 'tarjeta_sobre_fondo', 'hero_partido'], ['organico', 'editorial', 'lujo', 'art_deco', 'japones', 'periodico'], ['editorial', 'papel', 'retro', 'clasica', 'lineas_dobles', 'suave']),
  inmobiliaria: rb(['marina_costa', 'arena', 'papel', 'bosque', 'marina_naval', 'cielo'], ['galeria', 'mosaico', 'hero_partido', 'tarjeta_sobre_fondo', 'precios', 'equipo'], ['editorial', 'suizo', 'lujo', 'minimal_tecnico', 'organico', 'producto_amable'], ['clasica', 'editorial', 'minimal', 'monocroma', 'papel', 'lineas_dobles']),
  organizacion_social: rb(['bosque', 'coral_calido', 'tierra_musgo', 'menta', 'arena', 'frutal_mandarina'], ['autor_refugio', 'hero_partido', 'fondo_protagonista', 'equipo', 'galeria', 'apiladas'], ['organico', 'producto_amable', 'editorial', 'clay', 'dopamina', 'periodico'], ['suave', 'clasica', 'tonal', 'pastel', 'editorial', 'papel']),
  consultorio: rb(['menta', 'cielo', 'marina_espuma', 'pastel_celeste', 'pastel_menta', 'lavanda'], ['autor_turnos', 'hero_partido', 'equipo', 'apiladas', 'precios', 'minimo'], ['producto_amable', 'organico', 'minimal_tecnico', 'japones', 'clay', 'suizo'], ['suave', 'clasica', 'tonal', 'pastel', 'minimal', 'monocroma']),
  gimnasio: rb(['contraste_amarillo', 'carbon_coral', 'neon_limon', 'mono_naranja', 'fosforo_verde', 'alto_contraste'], ['autor_gimnasio', 'fondo_protagonista', 'portada_video', 'cinta', 'precios', 'equipo'], ['neobrutalismo', 'dopamina', 'oscuro_precision', 'cyber', 'bauhaus', 'y2k'], ['neobrutal', 'oscura', 'neon', 'recortada', 'precio', 'terminal']),

  // Tienda
  ropa: rb(['rosa_chicle', 'durazno', 'caramelo', 'pastel_rosa', 'terracota', 'tierra_cuero'], ['galeria', 'mosaico', 'editorial_fondo', 'hero_partido', 'fondo_protagonista', 'bento'], ['editorial', 'lujo', 'dopamina', 'producto_amable', 'art_deco', 'clay'], ['editorial', 'suave', 'pastel', 'clasica', 'papel', 'monocroma']),
  comida_almacen: rb(['frutal_mandarina', 'terracota', 'oliva', 'caramelo', 'tierra_ocre', 'frutal_limon'], ['autor_panaderia', 'autor_cafeteria', 'galeria', 'mosaico', 'hero_partido', 'bento'], ['organico', 'producto_amable', 'clay', 'dopamina', 'periodico', 'editorial'], ['suave', 'clasica', 'papel', 'retro', 'precio', 'pastel']),
  artesanias: rb(['tierra_ocre', 'tierra_barro', 'arcilla', 'tierra_musgo', 'arena', 'terracota'], ['autor_floreria', 'galeria', 'mosaico', 'editorial_fondo', 'tarjeta_sobre_fondo', 'revista'], ['organico', 'japones', 'editorial', 'clay', 'art_deco', 'periodico'], ['papel', 'editorial', 'suave', 'lineas_dobles', 'retro', 'relieve']),
  electronica: rb(['grafito', 'azul_electrico', 'neon_cian', 'mono_azul', 'cromo', 'contraste_azul'], ['bento', 'galeria', 'mosaico', 'hero_partido', 'autor_concesionario', 'fondo_protagonista'], ['minimal_tecnico', 'oscuro_precision', 'cyber', 'vidrio', 'producto_amable', 'suizo'], ['minimal', 'oscura', 'vidrio', 'neon', 'monocroma', 'precio']),
  productos_digitales: rb(['azul_electrico', 'lavanda', 'uva', 'neon_magenta', 'pastel_lila', 'medianoche_violeta'], ['bento', 'hero_partido', 'galeria', 'precios', 'cinta', 'mosaico'], ['producto_amable', 'dopamina', 'minimal_tecnico', 'vidrio', 'clay', 'y2k'], ['tonal', 'suave', 'clasica', 'vidrio', 'pastel', 'minimal']),

  // App web
  turnos_reservas: rb(['menta', 'azul_electrico', 'cielo', 'marina_espuma', 'pastel_menta', 'lavanda'], ['autor_turnos', 'app_lateral', 'panel_fijo', 'indice', 'bento', 'apiladas'], ['producto_amable', 'minimal_tecnico', 'organico', 'clay', 'suizo', 'vidrio'], ['clasica', 'suave', 'tonal', 'minimal', 'pastel', 'monocroma']),
  stock: rb(['grafito', 'oliva', 'mono_azul', 'alto_contraste', 'cromo', 'contraste_azul'], ['app_lateral', 'panel_fijo', 'indice', 'bento', 'horizontal', 'apiladas'], ['minimal_tecnico', 'oscuro_precision', 'suizo', 'terminal', 'periodico', 'bauhaus'], ['minimal', 'clasica', 'monocroma', 'terminal', 'lineas_dobles', 'oscura']),
  clientes: rb(['azul_electrico', 'marina_costa', 'lavanda', 'menta', 'papel', 'mono_azul'], ['app_lateral', 'panel_fijo', 'bento', 'indice', 'widgets_fondo', 'apiladas'], ['producto_amable', 'minimal_tecnico', 'suizo', 'vidrio', 'organico', 'clay'], ['clasica', 'tonal', 'suave', 'minimal', 'monocroma', 'pastel']),
  facturacion: rb(['papel', 'marina_naval', 'grafito', 'mono_azul', 'oliva', 'suizo_rojo'], ['app_lateral', 'panel_fijo', 'indice', 'autor_finanzas', 'bento', 'horizontal'], ['minimal_tecnico', 'suizo', 'periodico', 'oscuro_precision', 'editorial', 'bauhaus'], ['clasica', 'minimal', 'lineas_dobles', 'monocroma', 'papel', 'precio']),
  tareas_proyectos: rb(['azul_electrico', 'tinta_y_lima', 'uva', 'menta', 'coral_calido', 'carbon_coral'], ['panel_fijo', 'app_lateral', 'bento', 'indice', 'horizontal', 'widgets_fondo'], ['producto_amable', 'minimal_tecnico', 'neobrutalismo', 'oscuro_precision', 'dopamina', 'vidrio'], ['clasica', 'tonal', 'neobrutal', 'minimal', 'suave', 'oscura']),

  // App para celular
  finanzas_movil: rb(['marina_abismo', 'noche_dorada', 'bosque_noche', 'mono_verde', 'medianoche_violeta', 'azul_electrico'], ['autor_finanzas', 'widgets_fondo', 'apiladas', 'minimo', 'bento', 'horizontal'], ['oscuro_precision', 'producto_amable', 'vidrio', 'minimal_tecnico', 'clay', 'lujo'], ['oscura', 'vidrio', 'tonal', 'clasica', 'minimal', 'monocroma']),
  entrenamiento: rb(['carbon_coral', 'neon_limon', 'contraste_amarillo', 'mono_naranja', 'frutal_mandarina', 'fosforo_verde'], ['autor_correr', 'widgets_fondo', 'apiladas', 'bento', 'hero_partido', 'minimo'], ['dopamina', 'neobrutalismo', 'oscuro_precision', 'cyber', 'y2k', 'clay'], ['neobrutal', 'oscura', 'neon', 'suave', 'recortada', 'tonal']),
  pedidos_envios: rb(['frutal_mandarina', 'coral_calido', 'caramelo', 'azul_electrico', 'frutal_limon', 'durazno'], ['widgets_fondo', 'apiladas', 'bento', 'hero_partido', 'minimo', 'horizontal'], ['producto_amable', 'dopamina', 'clay', 'neobrutalismo', 'organico', 'vidrio'], ['suave', 'clasica', 'tonal', 'neobrutal', 'precio', 'pastel']),
  habitos: rb(['pastel_menta', 'pastel_rosa', 'lavanda', 'menta', 'frutal_sandia', 'cielo'], ['widgets_fondo', 'minimo', 'apiladas', 'bento', 'hero_partido', 'horizontal'], ['clay', 'producto_amable', 'organico', 'dopamina', 'japones', 'vidrio'], ['pastel', 'suave', 'tonal', 'minimal', 'relieve', 'clasica']),
  comunidad: rb(['coral_calido', 'rosa_chicle', 'uva', 'frutal_arandano', 'neon_rosa', 'lavanda'], ['widgets_fondo', 'apiladas', 'bento', 'hero_partido', 'minimo', 'horizontal'], ['dopamina', 'producto_amable', 'clay', 'y2k', 'vidrio', 'neobrutalismo'], ['suave', 'neon', 'tonal', 'pastel', 'vidrio', 'neobrutal']),

  // Dashboard
  ventas: rb(['grafito', 'marina_naval', 'azul_electrico', 'mono_verde', 'tinta_y_lima', 'noche_dorada'], ['app_lateral', 'bento', 'panel_fijo', 'autor_finanzas', 'indice', 'widgets_fondo'], ['oscuro_precision', 'minimal_tecnico', 'vidrio', 'suizo', 'producto_amable', 'cyber'], ['oscura', 'minimal', 'vidrio', 'tonal', 'monocroma', 'clasica']),
  operaciones: rb(['grafito', 'oliva', 'mono_naranja', 'alto_contraste', 'contraste_azul', 'carbon_coral'], ['panel_fijo', 'app_lateral', 'bento', 'indice', 'horizontal', 'widgets_fondo'], ['oscuro_precision', 'minimal_tecnico', 'terminal', 'suizo', 'bauhaus', 'cyber'], ['oscura', 'terminal', 'minimal', 'monocroma', 'lineas_dobles', 'clasica']),
  visitas_sitio: rb(['azul_electrico', 'medianoche_violeta', 'marina_costa', 'vidrio', 'neon_cian', 'mono_azul'], ['app_lateral', 'bento', 'panel_fijo', 'indice', 'widgets_fondo', 'apiladas'], ['oscuro_precision', 'vidrio', 'minimal_tecnico', 'producto_amable', 'cyber', 'suizo'], ['vidrio', 'oscura', 'minimal', 'tonal', 'neon', 'monocroma']),
  finanzas_dashboard: rb(['marina_abismo', 'noche_dorada', 'bosque_noche', 'grafito', 'marina_naval', 'mono_verde'], ['autor_finanzas', 'app_lateral', 'bento', 'panel_fijo', 'indice', 'horizontal'], ['oscuro_precision', 'minimal_tecnico', 'lujo', 'suizo', 'vidrio', 'art_deco'], ['oscura', 'minimal', 'lineas_dobles', 'monocroma', 'vidrio', 'clasica']),

  // Portfolio
  diseno: rb(['alto_contraste', 'contraste_amarillo', 'memphis', 'suizo_rojo', 'neon_magenta', 'bauhaus'], ['autor_portfolio', 'tipografico', 'mosaico', 'galeria', 'editorial_fondo', 'revista'], ['suizo', 'bauhaus', 'editorial', 'neobrutalismo', 'dopamina', 'art_deco'], ['editorial', 'monocroma', 'neobrutal', 'lineas_dobles', 'recortada', 'minimal']),
  fotografia: rb(['grafito', 'papel', 'mono_azul', 'noche_dorada', 'cromo', 'alto_contraste'], ['galeria', 'mosaico', 'editorial_fondo', 'horizontal', 'autor_portfolio', 'minimo'], ['japones', 'editorial', 'minimal_tecnico', 'suizo', 'lujo', 'periodico'], ['minimal', 'monocroma', 'editorial', 'papel', 'lineas_dobles', 'oscura']),
  desarrollo: rb(['fosforo_verde', 'tinta_y_lima', 'grafito', 'contraste_cian', 'fosforo_ambar', 'medianoche_violeta'], ['autor_portfolio', 'bento', 'tipografico', 'minimo', 'indice', 'tarjeta_sobre_fondo'], ['terminal', 'minimal_tecnico', 'cyber', 'oscuro_precision', 'retro_os', 'suizo'], ['terminal', 'oscura', 'minimal', 'neon', 'monocroma', 'retro']),
  arquitectura: rb(['arena', 'grafito', 'papel', 'tierra_musgo', 'mono_rojo', 'alto_contraste'], ['galeria', 'editorial_fondo', 'mosaico', 'autor_portfolio', 'tipografico', 'minimo'], ['suizo', 'japones', 'editorial', 'bauhaus', 'minimal_tecnico', 'art_deco'], ['minimal', 'monocroma', 'editorial', 'lineas_dobles', 'papel', 'recortada']),

  // Blog
  revista: rb(['papel', 'arena', 'tierra_ocre', 'mono_rojo', 'caramelo', 'vino'], ['revista', 'blog_lateral', 'editorial_fondo', 'tipografico', 'indice', 'hero_partido'], ['editorial', 'periodico', 'suizo', 'art_deco', 'organico', 'lujo'], ['editorial', 'papel', 'lineas_dobles', 'clasica', 'monocroma', 'minimal']),
  newsletter: rb(['papel', 'caramelo', 'durazno', 'oliva', 'lavanda', 'pastel_celeste'], ['minimo', 'blog_lateral', 'tipografico', 'apiladas', 'hero_partido', 'indice'], ['editorial', 'minimal_tecnico', 'periodico', 'organico', 'producto_amable', 'japones'], ['papel', 'editorial', 'minimal', 'suave', 'pastel', 'clasica']),
  documentacion: rb(['papel', 'grafito', 'mono_azul', 'azul_electrico', 'oliva', 'alto_contraste'], ['indice', 'blog_lateral', 'app_lateral', 'panel_fijo', 'minimo', 'horizontal'], ['minimal_tecnico', 'suizo', 'periodico', 'terminal', 'oscuro_precision', 'editorial'], ['minimal', 'clasica', 'monocroma', 'terminal', 'lineas_dobles', 'papel']),
  podcast: rb(['medianoche_violeta', 'noche_dorada', 'coral_calido', 'neon_magenta', 'uva', 'carbon_coral'], ['blog_lateral', 'hero_partido', 'fondo_protagonista', 'tarjeta_sobre_fondo', 'cinta', 'tipografico'], ['dopamina', 'editorial', 'y2k', 'oscuro_precision', 'cyber', 'organico'], ['oscura', 'neon', 'suave', 'retro', 'editorial', 'tonal']),
};

/** Lo que un rubro recomienda, o `undefined` si el id no existe. */
export function recomendadosDeRubro(rubro: string | null | undefined): RecomendadosRubro | undefined {
  return rubro ? RECOMENDADOS_RUBRO[rubro] : undefined;
}

/** Las recomendaciones del rubro van primero y después las del tipo, sin repetir (las primeras 6 de cada ronda). */
export function conRubro<T extends string>(delRubro: readonly T[] | undefined, delTipo: readonly T[]): T[] {
  return [...new Set([...(delRubro ?? []), ...delTipo])];
}
