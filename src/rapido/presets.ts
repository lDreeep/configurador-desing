import { DISENO_POR_ESTILO } from '../botones-disenos';
import { aplicarTipo } from '../estado';
import { ESTILOS, LAYOUTS, RECETAS_AUTOR } from '../estilos-visuales';
import { DISENO_INICIAL, type CategoriaId } from '../galeria';
import { RECOMENDADOS } from '../recomendados';
import type { Config, LayoutId, TipoProyecto, EstiloId } from '../tipos';
import { aplicarCombinacion } from './combinar';

export interface Preset { id: string; nombre: string; descripcion: string; tipo: TipoProyecto; layout: LayoutId; estilo?: EstiloId; }
export const PRESETS: Preset[] = [
  { id: 'traccion', nombre: 'Motos y UTV', descripcion: 'Catálogo con vehículo protagonista y ficha técnica.', tipo: 'tienda', layout: 'autor_concesionario' },
  { id: 'tueste', nombre: 'Cafetería', descripcion: 'Fotos del oficio y una carta para recorrer.', tipo: 'landing', layout: 'autor_cafeteria' },
  { id: 'flores', nombre: 'Flores por suscripción', descripcion: 'Collage y planes con frecuencia a elección.', tipo: 'tienda', layout: 'autor_floreria' },
  { id: 'lenga', nombre: 'Refugio de montaña', descripcion: 'Paisaje, habitaciones y consulta de fechas.', tipo: 'sitio', layout: 'autor_refugio' },
  { id: 'horno', nombre: 'Panadería de barrio', descripcion: 'Horno, carta del día y horarios.', tipo: 'landing', layout: 'autor_panaderia' },
  { id: 'ferro', nombre: 'Estudio creativo', descripcion: 'Trabajos en una composición editorial.', tipo: 'portfolio', layout: 'autor_portfolio' },
  { id: 'festival', nombre: 'Festival de música', descripcion: 'Cartel de artistas y entradas.', tipo: 'landing', layout: 'autor_festival' },
  { id: 'moneda', nombre: 'App financiera', descripcion: 'Interfaz del producto y datos de ejemplo.', tipo: 'app_web', layout: 'autor_finanzas' },
  { id: 'ruta', nombre: 'App para correr', descripcion: 'Mapas, recorridos y actividad semanal.', tipo: 'app_movil', layout: 'autor_correr' },
  { id: 'gestion', nombre: 'Panel de gestión', descripcion: 'Tablas, métricas y formularios listos para probar.', tipo: 'dashboard', layout: 'app_lateral', estilo: 'minimal_tecnico' },
  { id: 'tienda', nombre: 'Tienda de productos', descripcion: 'Catálogo, carrito y controles que combinan.', tipo: 'tienda', layout: 'galeria', estilo: 'producto_amable' },
  { id: 'revista', nombre: 'Revista digital', descripcion: 'Lectura, artículos y navegación editorial.', tipo: 'blog', layout: 'blog_lateral', estilo: 'editorial' },
];
export function aplicarPreset(config: Config, preset: Preset): Config {
  const receta = RECETAS_AUTOR[preset.layout];
  const estilo = receta?.estilo ?? preset.estilo ?? 'minimal_tecnico';
  const e = ESTILOS[estilo];
  const next = aplicarCombinacion(aplicarTipo(config, preset.tipo), {
    layout: preset.layout, estilo, paleta: receta?.paleta ?? e.paletas[0],
    titulos: receta?.titulos ?? e.fuentes[0][0], texto: receta?.texto ?? e.fuentes[0][1], fondo: 'ninguno',
  });
  const recomendados = RECOMENDADOS[preset.tipo];
  const componentes = { ...DISENO_INICIAL };
  for (const categoria of Object.keys(recomendados.componentes) as CategoriaId[]) {
    componentes[categoria] = recomendados.componentes[categoria]?.[0] ?? DISENO_INICIAL[categoria];
  }
  return { ...next, botones: { ...next.botones, diseno: DISENO_POR_ESTILO[estilo], color: 'acento', efecto: 'del_diseno' },
    cajas: { preset: recomendados.cajas[0], ajustes: {} }, componentes, elementos: {} };
}
export const nombreLayout = (preset: Preset) => LAYOUTS[preset.layout].nombre;
