// Contenido de muestra de las páginas según el tipo de proyecto (cuando la persona todavía no
// escribió el suyo). Sigue las reglas de texto de la skill design-taste-frontend: el título dice
// qué es y para quién, la bajada trae un dato concreto, los botones son verbo + objeto, sin
// eslóganes, sin «no X sino Y» y sin palabras de relleno («fácil», «potente», «sin vueltas»).

import type { TipoProyecto } from '../tipos';

export interface ContenidoTipo {
  marca: string;
  titular: string;
  bajada: string;
  items: { titulo: string; texto: string }[];
  nav: string[];
  cta: string;
  ctaSecundario: string;
  /** Una línea para el cierre de la página. */
  cierre: string;
}

export const CONTENIDO_TIPO: Record<TipoProyecto, ContenidoTipo> = {
  landing: {
    marca: 'Estudio Norte',
    titular: 'Diseño de marca para negocios de barrio',
    bajada: 'Logo, carta y redes en tres semanas. El precio queda cerrado el primer día.',
    items: [
      { titulo: 'Logo y paleta', texto: 'Dos propuestas y una ronda de cambios.' },
      { titulo: 'Carta y señalética', texto: 'Listas para imprimir en la imprenta que elijas.' },
      { titulo: 'Plantillas para redes', texto: 'Doce plantillas que editás desde el celular.' },
      { titulo: 'Entrega en archivos abiertos', texto: 'Te quedás con todo, sin pagar licencias.' },
    ],
    nav: ['Trabajos', 'Servicios', 'Precios'],
    cta: 'Pedir presupuesto',
    ctaSecundario: 'Ver trabajos',
    cierre: 'Contanos qué vendés y te mandamos un presupuesto en el día.',
  },
  sitio: {
    marca: 'Fundación Río',
    titular: 'Talleres gratuitos de oficios en Rosario',
    bajada: 'Carpintería, electricidad y cocina para mayores de 16. Las inscripciones abren cada marzo y agosto.',
    items: [
      { titulo: 'Carpintería', texto: 'Martes y jueves, de 18 a 21.' },
      { titulo: 'Electricidad', texto: 'Con certificado al terminar.' },
      { titulo: 'Cocina', texto: 'Los sábados, en el comedor del barrio.' },
      { titulo: 'Cómo ayudar', texto: 'Donaciones de herramientas y horas de docencia.' },
    ],
    nav: ['Talleres', 'Inscripción', 'Ayudar'],
    cta: 'Inscribirme a un taller',
    ctaSecundario: 'Ver horarios',
    cierre: 'Las inscripciones de agosto abren el lunes 3.',
  },
  tienda: {
    marca: 'Lana Sur',
    titular: 'Lana merino teñida a mano en la Patagonia',
    bajada: 'Ovillos de 100 g en 24 colores. Envío gratis desde $ 50.000 a todo el país.',
    items: [
      { titulo: 'Ovillos', texto: 'Desde $ 9.800.' },
      { titulo: 'Kits para tejer', texto: 'Lana, agujas y el patrón impreso.' },
      { titulo: 'Agujas de madera', texto: 'De lenga, hechas en El Bolsón.' },
      { titulo: 'Patrones', texto: 'Gratis con cada compra.' },
    ],
    nav: ['Ovillos', 'Kits', 'Patrones'],
    cta: 'Ver los colores',
    ctaSecundario: 'Armar un kit',
    cierre: 'Si el color no es el que esperabas, lo cambiás sin cargo.',
  },
  app_web: {
    marca: 'Turnero',
    titular: 'Agenda de turnos para consultorios',
    bajada: 'Tus pacientes reservan por WhatsApp y vos ves el día en una pantalla. Un mes de prueba sin tarjeta.',
    items: [
      { titulo: 'Reservas por WhatsApp', texto: 'El paciente elige horario desde un link.' },
      { titulo: 'Recordatorio automático', texto: 'Un mensaje 24 horas antes del turno.' },
      { titulo: 'Varios profesionales', texto: 'Cada uno con su agenda y sus horarios.' },
      { titulo: 'Historial del paciente', texto: 'Notas y archivos en la misma ficha.' },
    ],
    nav: ['Funciones', 'Precios', 'Ayuda'],
    cta: 'Probar un mes',
    ctaSecundario: 'Ver precios',
    cierre: 'Configurarlo lleva una tarde. Si te trabás, te ayudamos por chat.',
  },
  app_movil: {
    marca: 'Ruta',
    titular: 'Rutas para correr cerca de tu casa',
    bajada: 'Más de 3.000 recorridos en Buenos Aires, con distancia, desnivel y dónde cargar agua.',
    items: [
      { titulo: 'Recorridos guardados', texto: 'Funcionan sin conexión.' },
      { titulo: 'Ritmo por kilómetro', texto: 'Te avisa por los auriculares.' },
      { titulo: 'Salidas en grupo', texto: 'Sumate a las del sábado en tu barrio.' },
      { titulo: 'Tu semana', texto: 'Kilómetros y tiempos en un solo gráfico.' },
    ],
    nav: ['Rutas', 'Grupos', 'Descargar'],
    cta: 'Descargar la app',
    ctaSecundario: 'Ver rutas',
    cierre: 'Gratis para iPhone y Android.',
  },
  dashboard: {
    marca: 'Panel',
    titular: 'Ventas, stock y cobranzas de tu negocio en una pantalla',
    bajada: 'Se conecta con tu facturador y se actualiza cada cinco minutos.',
    items: [
      { titulo: 'Ventas del día', texto: 'Comparadas con el mismo día del mes pasado.' },
      { titulo: 'Stock bajo', texto: 'Los productos que conviene reponer esta semana.' },
      { titulo: 'Cobranzas', texto: 'Quién debe y desde cuándo.' },
      { titulo: 'Reportes', texto: 'En Excel o PDF, para tu contador.' },
    ],
    nav: ['Ventas', 'Stock', 'Clientes'],
    cta: 'Conectar mi facturador',
    ctaSecundario: 'Ver un ejemplo',
    cierre: 'Tus datos quedan en tu cuenta; podés exportarlos cuando quieras.',
  },
  portfolio: {
    marca: 'Inés Paz',
    titular: 'Fotografía de producto para marcas chicas',
    bajada: 'Fondo, luz y retoque para tu tienda online. Entrego 20 fotos en una semana.',
    items: [
      { titulo: 'Cerámica Barro', texto: 'Catálogo de otoño, 2026.' },
      { titulo: 'Café Lumen', texto: 'Empaques y redes.' },
      { titulo: 'Lana Sur', texto: 'Ovillos sobre fondo de color.' },
      { titulo: 'Brote', texto: 'Cosmética natural, en estudio.' },
    ],
    nav: ['Trabajos', 'Sobre mí', 'Contacto'],
    cta: 'Pedir una sesión',
    ctaSecundario: 'Ver trabajos',
    cierre: 'Tomo dos marcas por mes. Escribime para ver fechas.',
  },
  blog: {
    marca: 'Cuaderno',
    titular: 'Notas sobre cocina de estación',
    bajada: 'Una receta nueva cada jueves, con lo que hay en la verdulería esa semana.',
    items: [
      { titulo: 'Zapallo asado con miel', texto: '25 minutos, para cuatro.' },
      { titulo: 'Qué comprar en noviembre', texto: 'La lista de la verdulería.' },
      { titulo: 'Pan de campo en casa', texto: 'Sin batidora, con 12 horas de leudado.' },
      { titulo: 'Conservas de tomate', texto: 'Para tener salsa todo el invierno.' },
    ],
    nav: ['Recetas', 'Estaciones', 'Suscribirme'],
    cta: 'Recibir la receta del jueves',
    ctaSecundario: 'Ver recetas',
    cierre: 'Un email por semana. Te das de baja con un clic.',
  },
};
