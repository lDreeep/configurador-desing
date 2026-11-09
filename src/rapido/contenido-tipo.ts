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
  /** Prueba junto a la promesa (landing-page-design): un dato, un puntaje o quiénes lo usan. */
  prueba: string;
  /** La frase grande que se enciende al bajar: el beneficio en dos líneas o más. */
  frase: string;
  /** Opcional: nunca se inventa en la página de un producto real. */
  testimonio?: { texto: string; nombre: string; rol: string };
  /** Las objeciones típicas, respondidas. */
  preguntas: [string, string][];
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
    prueba: '4,9 en Google · 212 negocios de barrio con marca nueva',
    frase: 'Un negocio que se ve bien en la vidriera, en la carta y en el celular vende más.',
    testimonio: { texto: '«En tres semanas teníamos logo, carta y las plantillas de Instagram. Las ventas del mostrador subieron un 18%.»', nombre: 'Marina Costa', rol: 'Dueña de Panadería Costa, Caballito' },
    preguntas: [
      ['¿Cuánto cuesta?', 'Te pasamos un precio cerrado el primer día. No hay extras por rondas de cambios dentro de lo acordado.'],
      ['¿Cuánto tarda?', 'Tres semanas desde que nos mandás la información de tu negocio.'],
      ['¿Me quedo con los archivos?', 'Sí. Te entregamos todo en archivos abiertos y sin licencias que pagar.'],
      ['¿Y si no me gusta ninguna propuesta?', 'Hacemos una tercera sin cargo. Si tampoco te convence, te devolvemos la seña.'],
    ],
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
    prueba: '1.480 egresados desde 2014 · el 63% consiguió trabajo en el oficio',
    frase: 'Aprender un oficio cambia lo que una familia puede proyectar para el año que viene.',
    testimonio: { texto: '«Terminé electricidad en diciembre y en febrero ya tenía clientes en el barrio.»', nombre: 'Diego Ramírez', rol: 'Egresado 2025, taller de electricidad' },
    preguntas: [
      ['¿Hay que pagar algo?', 'No. Los talleres y los materiales son gratis.'],
      ['¿Qué necesito para inscribirme?', 'Tener 16 años o más y tu DNI. No hace falta experiencia.'],
      ['¿Entregan certificado?', 'Sí, con el aval del Ministerio de Trabajo de la provincia.'],
      ['¿Cómo puedo ayudar?', 'Donando herramientas, materiales o algunas horas para dar clases.'],
    ],
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
    prueba: '4,8 de 5 en 1.317 opiniones · envíos a todo el país en 72 horas',
    frase: 'Cada ovillo se tiñe a mano en tandas chicas. Ningún color sale igual dos veces.',
    testimonio: { texto: '«Pedí el kit de gorro sin haber tejido nunca. El patrón se entiende y la lana es una caricia.»', nombre: 'Julieta Moreno', rol: 'Compró en octubre, Neuquén' },
    preguntas: [
      ['¿Cuánto tarda el envío?', 'Entre 2 y 4 días hábiles. Desde $ 50.000 es gratis.'],
      ['¿Puedo cambiar un color?', 'Sí, sin cargo y dentro de los 30 días.'],
      ['¿La lana pica?', 'No. Es merino de fibra fina: se puede usar sobre la piel.'],
      ['¿Cómo la lavo?', 'A mano, con agua fría y jabón neutro. Se seca en plano.'],
    ],
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
    prueba: 'Lo usan 1.243 consultorios · 31% menos ausencias en promedio',
    frase: 'Menos llamadas, menos huecos en la agenda y más tiempo para tus pacientes.',
    testimonio: { texto: '«Pasé de 11 ausencias por mes a 3. La recepción dejó de vivir en el teléfono.»', nombre: 'Paula Ferreyra', rol: 'Kinesióloga, Rosario' },
    preguntas: [
      ['¿Mis pacientes tienen que bajar una app?', 'No. Reservan desde un link que se abre en cualquier navegador o desde WhatsApp.'],
      ['¿Necesito tarjeta para probar?', 'No. El primer mes es gratis y no pedimos tarjeta.'],
      ['¿Puedo bloquear días?', 'Sí. Vacaciones y feriados desaparecen del link al instante.'],
      ['¿Puedo cancelar cuando quiera?', 'Sí, desde tu cuenta, y te llevás tu agenda en Excel.'],
    ],
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
    prueba: '4,7 en App Store · 86.400 corredores en Buenos Aires',
    frase: 'Salir a correr es más fácil cuando ya sabés por dónde ir y dónde cargar agua.',
    testimonio: { texto: '«Me mudé a Palermo y en una semana ya tenía tres recorridos favoritos.»', nombre: 'Tomás Herrera', rol: 'Corre 25 km por semana' },
    preguntas: [
      ['¿Es gratis?', 'Sí. La versión paga suma planes de entrenamiento, pero las rutas son gratis.'],
      ['¿Funciona sin datos?', 'Sí. Descargás la ruta antes de salir y la seguís sin conexión.'],
      ['¿Sirve para caminar?', 'Sí. Podés filtrar por recorridos llanos y cortos.'],
      ['¿Se conecta con mi reloj?', 'Con Garmin, Apple Watch y la mayoría de los relojes con GPS.'],
    ],
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
    prueba: 'Conectado a 9 facturadores · 2.380 comercios lo miran cada mañana',
    frase: 'Saber qué vendiste ayer, qué falta reponer y quién te debe, antes de abrir la persiana.',
    testimonio: { texto: '«Dejé de armar planillas los domingos. Mi contador recibe el reporte solo.»', nombre: 'Andrés Villalba', rol: 'Ferretería Villalba, Mar del Plata' },
    preguntas: [
      ['¿Con qué facturadores funciona?', 'Con los nueve más usados en Argentina, incluido el de AFIP.'],
      ['¿Mis datos están seguros?', 'Se guardan cifrados y nunca se comparten. Los podés exportar cuando quieras.'],
      ['¿Cuánto tarda en configurarse?', 'Unos diez minutos. Conectás el facturador y el panel se arma solo.'],
      ['¿Lo puedo ver desde el celular?', 'Sí, el panel se adapta a cualquier pantalla.'],
    ],
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
    prueba: '47 marcas fotografiadas desde 2021 · entregas en 7 días',
    frase: 'Una buena foto de producto responde lo que el cliente no puede tocar.',
    testimonio: { texto: '«Con las fotos nuevas la tienda online vendió el doble en el lanzamiento de otoño.»', nombre: 'Carolina Ibáñez', rol: 'Cerámica Barro' },
    preguntas: [
      ['¿Cuánto cuesta una sesión?', 'Depende de la cantidad de productos. Te paso un precio cerrado antes de empezar.'],
      ['¿Tengo que estar en la sesión?', 'No hace falta. Me mandás los productos y te muestro las pruebas en vivo.'],
      ['¿Puedo usar las fotos en publicidad?', 'Sí, la licencia incluye redes, web y anuncios.'],
      ['¿Hacés retoque?', 'Sí, el retoque de las 20 fotos está incluido.'],
    ],
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
    prueba: '18.900 personas reciben la receta cada jueves',
    frase: 'Cocinar con lo que hay en la verdulería es más barato, más rico y más fácil de lo que parece.',
    testimonio: { texto: '«Es el único mail que abro apenas llega. Ya cocinamos la mitad de las recetas.»', nombre: 'Silvina Ortiz', rol: 'Suscriptora desde 2024' },
    preguntas: [
      ['¿Cuántos mails mandan?', 'Uno por semana, los jueves a la mañana.'],
      ['¿Es gratis?', 'Sí, las recetas son gratis para siempre.'],
      ['¿Las recetas sirven para principiantes?', 'Sí. Cada una dice el tiempo y qué tan difícil es.'],
      ['¿Cómo me doy de baja?', 'Con un clic al pie de cualquier mail.'],
    ],
  },
};
