// Los 39 rubros (PLAN.md §7.2): dentro de cada tipo de proyecto, a qué se dedica el negocio.
// Es **datos**: cada rubro trae su contenido de muestra (marca inventada, título, bajada, dos
// botones y tres ítems) en español rioplatense y con datos creíbles. Los largos no pasan los de
// `rapido/contenido-tipo.ts` (lo verifica `rubros.test.ts`) para que ninguna página se rompa.

import type { TipoProyecto } from './tipos';

export interface ContenidoRubro {
  marca: string;
  titular: string;
  bajada: string;
  cta: string;
  ctaSecundario: string;
  items: [{ titulo: string; texto: string }, { titulo: string; texto: string }, { titulo: string; texto: string }];
}

export interface Rubro {
  id: string;
  nombre: string;
  tipo: TipoProyecto;
  contenido: ContenidoRubro;
}

const r = (
  id: string,
  nombre: string,
  tipo: TipoProyecto,
  marca: string,
  titular: string,
  bajada: string,
  cta: string,
  ctaSecundario: string,
  items: [string, string][],
): Rubro => ({
  id,
  nombre,
  tipo,
  contenido: {
    marca,
    titular,
    bajada,
    cta,
    ctaSecundario,
    items: items.map(([titulo, texto]) => ({ titulo, texto })) as ContenidoRubro['items'],
  },
});

export const RUBROS: Rubro[] = [
  // Landing
  r('producto_digital', 'Producto digital', 'landing', 'Cuadra', 'Tus gastos compartidos, al día y sin planillas', 'Cargás un ticket con una foto y la cuenta se reparte sola. Gratis hasta 5 personas.', 'Probar gratis', 'Ver cómo es', [
    ['Foto del ticket', 'Lee el total y los ítems en segundos.'],
    ['Cuentas claras', 'Cada uno ve cuánto debe y a quién.'],
    ['Pagos por Mercado Pago', 'Saldás la deuda con un solo toque.'],
  ]),
  r('servicio_profesional', 'Servicio profesional', 'landing', 'Lemos Contad.', 'Contadora para monotributistas y pequeños comercios', 'Liquidación mensual, facturas y reclamos ante ARCA por $ 38.000 fijos al mes.', 'Pedir una consulta', 'Ver planes', [
    ['Monotributo al día', 'Recategorización y pagos sin sobresaltos.'],
    ['Facturación', 'Emitimos tus facturas cada mes.'],
    ['Respuesta en 24 horas', 'Escribinos por WhatsApp y te contestamos.'],
  ]),
  r('evento', 'Evento', 'landing', 'Foro Andino', 'Foro Andino 2027: tecnología y diseño en Mendoza', 'Dos días, 24 charlas y 6 talleres en el Espacio Le Parc, del 14 al 15 de mayo.', 'Sacar mi entrada', 'Ver programa', [
    ['24 charlas', 'Con oradores de Argentina, Chile y Uruguay.'],
    ['6 talleres', 'Cupos de 30 personas, con práctica.'],
    ['Entrada desde $ 45.000', 'Hay descuento para estudiantes.'],
  ]),
  r('curso', 'Curso', 'landing', 'Aula Abierta', 'Aprendé Excel desde cero en 6 semanas', 'Clases en vivo los martes a las 19 y grabaciones para ver cuando puedas. Cupo de 40.', 'Anotarme al curso', 'Ver temario', [
    ['Clases en vivo', 'Los martes de 19 a 21, con consultas.'],
    ['Ejercicios reales', 'Planillas de gastos, stock y ventas.'],
    ['Certificado', 'Al terminar recibís el diploma digital.'],
  ]),
  r('app_descargar', 'App para descargar', 'landing', 'Mateo', 'Mateo: la app para pedir el mate del día', 'Pedí en tu café de barrio sin hacer cola. Disponible para iPhone y Android.', 'Descargar la app', 'Ver cafés', [
    ['Pedí sin cola', 'Elegís, pagás y retirás en el local.'],
    ['Puntos por compra', 'Cada diez cafés, uno va por la casa.'],
    ['Más de 300 cafés', 'En Buenos Aires, Córdoba y Rosario.'],
  ]),
  r('lista_espera', 'Lista de espera', 'landing', 'Brisa', 'Brisa llega en marzo: anotate en la lista', 'Un purificador de aire silencioso para ambientes de hasta 30 m². Los primeros 500 tienen 20% off.', 'Sumarme a la lista', 'Ver el equipo', [
    ['Silencioso', 'Menos de 28 decibeles en uso normal.'],
    ['Filtro lavable', 'Cada filtro dura hasta dos años.'],
    ['Precio de lanzamiento', '$ 189.000 para los primeros 500.'],
  ]),

  // Sitio
  r('estudio_empresa', 'Estudio o empresa', 'sitio', 'Tapia & Vera', 'Estudio de arquitectura en Córdoba desde 2009', 'Casas, oficinas y reformas. Entregamos 42 obras en 15 años con planos y dirección propia.', 'Contar mi proyecto', 'Ver obras', [
    ['Casas nuevas', 'Desde el terreno hasta la llave.'],
    ['Reformas', 'Ampliaciones y cocinas para vivir mejor.'],
    ['Dirección de obra', 'Visitas semanales y control de gastos.'],
  ]),
  r('restaurante', 'Restaurante', 'sitio', 'La Parrilla 9', 'Parrilla de barrio en Palermo, abierta desde 1998', 'Cortes de la casa, achuras y postres caseros. Abrimos de martes a domingo, de 20 a 00.', 'Reservar una mesa', 'Ver la carta', [
    ['Cortes a la parrilla', 'Vacío, ojo de bife y entraña.'],
    ['Menú del mediodía', 'Plato, bebida y postre por $ 14.500.'],
    ['Salón para 60', 'Cumpleaños y reuniones con menú cerrado.'],
  ]),
  r('inmobiliaria', 'Inmobiliaria', 'sitio', 'Hogar Sur', 'Inmobiliaria en Bahía Blanca: alquileres y ventas', '128 propiedades publicadas. Tasamos tu casa gratis en 48 horas y sin compromiso.', 'Tasar mi propiedad', 'Ver avisos', [
    ['Alquileres', 'Con garantía propietaria o seguro de caución.'],
    ['Ventas', 'Fotos profesionales y difusión en portales.'],
    ['Administración', 'Cobramos y liquidamos cada mes.'],
  ]),
  r('organizacion_social', 'Organización social', 'sitio', 'Manos Unidas', 'Merendero y apoyo escolar en Villa Lugano', 'Cada semana damos 220 meriendas y ayuda con la tarea a 80 chicos y chicas del barrio.', 'Quiero colaborar', 'Conocer más', [
    ['Merienda diaria', 'De lunes a viernes, a las 16.'],
    ['Apoyo escolar', 'Voluntarios que acompañan las tareas.'],
    ['Donaciones', 'Alimentos, útiles y ropa de abrigo.'],
  ]),
  r('consultorio', 'Consultorio', 'sitio', 'Dra. Quiroga', 'Odontología general y estética en Godoy Cruz', 'Turnos de lunes a sábado. Trabajamos con obras sociales y prepagas, con atención de urgencias.', 'Pedir un turno', 'Tratamientos', [
    ['Limpieza y control', 'Una revisión completa cada seis meses.'],
    ['Ortodoncia', 'Brackets y alineadores transparentes.'],
    ['Urgencias', 'Atención el mismo día si hay dolor.'],
  ]),
  r('gimnasio', 'Gimnasio', 'sitio', 'Fuerza 24', 'Gimnasio de barrio en Quilmes, abierto de 6 a 23', 'Musculación, funcional y spinning con profes en sala. Primera clase gratis, sin matrícula.', 'Probar una clase', 'Ver horarios', [
    ['Musculación', 'Sala de 400 m² con profes en cada turno.'],
    ['Funcional', 'Clases de 45 minutos, hasta 15 personas.'],
    ['Plan desde $ 28.000', 'Sin matrícula y sin permanencia.'],
  ]),

  // Tienda
  r('ropa', 'Ropa', 'tienda', 'Hilo Norte', 'Remeras de algodón peinado hechas en Tucumán', 'Talles del XS al XXL y cuatro colores de temporada. Cambios gratis dentro de los 30 días.', 'Comprar ahora', 'Ver talles', [
    ['Algodón peinado', 'Suave y sin pelusa después del lavado.'],
    ['Talles reales', 'Tabla de medidas para elegir bien.'],
    ['Cambios gratis', 'Si no te queda, la cambiás sin costo.'],
  ]),
  r('comida_almacen', 'Comida y almacén', 'tienda', 'Almacén Zeta', 'Productos regionales con envío a todo el país', 'Yerba, dulces, quesos y vinos de 40 productores. Armamos cajas para regalar desde $ 32.000.', 'Armar mi caja', 'Productores', [
    ['Cajas para regalar', 'Con tarjeta escrita a mano.'],
    ['Productores chicos', 'Cada producto tiene su historia.'],
    ['Envío en 72 horas', 'A todo el país, en packaging frío.'],
  ]),
  r('artesanias', 'Artesanías', 'tienda', 'Barro y Fuego', 'Cerámica de autor hecha a mano en Mar del Plata', 'Tazas, platos y macetas únicas. Se hacen por tandas de 30 piezas y se agotan rápido.', 'Ver la tanda', 'Cómo se hacen', [
    ['Piezas únicas', 'Cada taza lleva una firma en la base.'],
    ['Esmalte sin plomo', 'Aptas para microondas y lavavajillas.'],
    ['Pedidos a medida', 'Vajilla completa para tu casa o local.'],
  ]),
  r('electronica', 'Electrónica', 'tienda', 'Voltio', 'Auriculares y cargadores con 12 meses de garantía', 'Más de 400 productos en stock. Envío en el día en CABA si comprás antes de las 14.', 'Ver ofertas', 'Comparar', [
    ['Garantía oficial', 'Doce meses y repuesto sin vueltas.'],
    ['Cuotas sin interés', 'Hasta 6 con tarjetas seleccionadas.'],
    ['Retiro en el local', 'Sin costo, con aviso por WhatsApp.'],
  ]),
  r('productos_digitales', 'Productos digitales', 'tienda', 'PlantiViva', 'Plantillas de Notion y Excel para organizar tu negocio', '62 plantillas listas para usar. Pagás una vez y las descargás al instante, para siempre.', 'Comprar plantillas', 'Ver gratuitas', [
    ['Descarga inmediata', 'Te llegan al mail apenas pagás.'],
    ['Pago único', 'Sin suscripción y con actualizaciones.'],
    ['Soporte por mail', 'Respondemos dudas en un día hábil.'],
  ]),

  // App web
  r('turnos_reservas', 'Turnos y reservas', 'app_web', 'Turnero', 'Agenda de turnos para peluquerías y consultorios', 'Tus clientes reservan solos y reciben un recordatorio por WhatsApp 24 horas antes.', 'Crear mi agenda', 'Ver demo', [
    ['Reservas online', 'Cada cliente elige día y horario.'],
    ['Recordatorios', 'Bajan las ausencias hasta un 40%.'],
    ['Agenda por profesional', 'Cada uno ve solo sus turnos.'],
  ]),
  r('stock', 'Stock', 'app_web', 'Stockeo', 'Control de stock para comercios con más de un local', 'Sabés qué hay en cada depósito y qué falta reponer. Importás tu planilla en 5 minutos.', 'Cargar mi stock', 'Cómo funciona', [
    ['Varios depósitos', 'Stock por local y movimientos entre ellos.'],
    ['Alertas de faltante', 'Te avisa antes de quedarte sin nada.'],
    ['Código de barras', 'Escaneás desde el celular o la lectora.'],
  ]),
  r('clientes', 'Clientes', 'app_web', 'Contacta', 'Seguimiento de clientes para equipos de ventas chicos', 'Cada consulta con su historial y su próximo paso. Nadie se olvida de responder.', 'Empezar gratis', 'Ver el tablero', [
    ['Ficha de cada cliente', 'Mensajes, llamadas y presupuestos.'],
    ['Recordatorios', 'Te avisa cuándo volver a escribir.'],
    ['Importa tus contactos', 'Desde Excel o Google Contactos.'],
  ]),
  r('facturacion', 'Facturación', 'app_web', 'Factura Ya', 'Facturación electrónica conectada a ARCA', 'Emití facturas A, B y C en 30 segundos y mandalas por mail. Plan desde $ 9.900 por mes.', 'Emitir mi factura', 'Ver precios', [
    ['Facturas A, B y C', 'Con CAE al instante y copia por mail.'],
    ['Cobros pendientes', 'Ves quién te debe y desde cuándo.'],
    ['Reporte para el contador', 'Un solo archivo con todo el mes.'],
  ]),
  r('tareas_proyectos', 'Tareas y proyectos', 'app_web', 'Tablero', 'Tareas y proyectos para equipos de hasta 15 personas', 'Cada tarea con responsable y fecha. Todo el equipo ve qué viene esta semana.', 'Crear un proyecto', 'Ver ejemplo', [
    ['Tablero por columnas', 'Pendiente, en curso y terminado.'],
    ['Responsables y fechas', 'Cada tarea tiene dueño y vencimiento.'],
    ['Comentarios', 'La charla queda junto a la tarea.'],
  ]),

  // App para celular
  r('finanzas_movil', 'Finanzas', 'app_movil', 'Billetera', 'Controlá tus gastos del mes desde el celular', 'Anotás cada gasto en dos toques y ves cuánto te queda hasta el día de cobro.', 'Crear mi cuenta', 'Ver el resumen', [
    ['Gastos por categoría', 'Comida, transporte y salidas.'],
    ['Metas de ahorro', 'Definí un monto y seguí el avance.'],
    ['Avisos de vencimiento', 'Tarjeta, alquiler y servicios.'],
  ]),
  r('entrenamiento', 'Entrenamiento', 'app_movil', 'Pulso', 'Rutinas de entrenamiento para hacer en casa', 'Planes de 20 a 40 minutos, sin equipo. Anotás cada serie y ves tu progreso por semana.', 'Empezar hoy', 'Ver rutinas', [
    ['Rutinas guiadas', 'Con video de cada ejercicio.'],
    ['Seguimiento', 'Peso, series y repeticiones al día.'],
    ['Plan semanal', 'Se adapta a los días que tenés.'],
  ]),
  r('pedidos_envios', 'Pedidos y envíos', 'app_movil', 'Cadete', 'Pedí y seguí tu envío en tiempo real', 'Mirás en el mapa dónde está tu pedido. Entregas en menos de 45 minutos dentro de la ciudad.', 'Hacer un pedido', 'Seguir envío', [
    ['Seguimiento en mapa', 'Ves el recorrido del repartidor.'],
    ['Avisos de estado', 'Preparando, en camino y entregado.'],
    ['Pago en la app', 'Con tarjeta, QR o efectivo.'],
  ]),
  r('habitos', 'Hábitos', 'app_movil', 'Racha', 'Armá hábitos chicos y no cortes la racha', 'Elegí hasta tres hábitos por día. Un recordatorio suave te avisa a la hora que quieras.', 'Armar mi primer hábito', 'Estadísticas', [
    ['Racha diaria', 'Contás cuántos días seguidos llevás.'],
    ['Recordatorios', 'A la hora que vos elijas.'],
    ['Resumen semanal', 'Mirás qué cumpliste y qué no.'],
  ]),
  r('comunidad', 'Comunidad', 'app_movil', 'Vecinos', 'La app de tu barrio: avisos, ofertas y ayuda', 'Más de 2.300 vecinos de Villa Urquiza ya la usan para prestarse cosas y recomendar oficios.', 'Unirme al barrio', 'Ver avisos', [
    ['Avisos del barrio', 'Cortes, ferias y reuniones.'],
    ['Oficios de confianza', 'Recomendados por tus vecinos.'],
    ['Préstamos', 'Pedí una escalera y devolvela.'],
  ]),

  // Dashboard
  r('ventas', 'Ventas', 'dashboard', 'Panel Ventas', 'Ventas del mes: $ 4,2 millones, un 12% más que abril', 'Mirá qué productos y qué vendedores mueven los números. Los datos se actualizan cada hora.', 'Exportar el informe', 'Elegir fechas', [
    ['Ventas por día', 'Con la comparación del mes anterior.'],
    ['Productos más vendidos', 'Los diez que más ingresos dejan.'],
    ['Ticket promedio', '$ 18.400 por compra, 5% más que antes.'],
  ]),
  r('operaciones', 'Operaciones', 'dashboard', 'Panel Op.', 'Operaciones: 94% de pedidos entregados a tiempo', 'Seguí pedidos, demoras y reclamos de los tres depósitos. Alertas cuando algo se retrasa.', 'Ver demoras', 'Elegir local', [
    ['Pedidos del día', '312 preparados y 18 en demora.'],
    ['Tiempo de entrega', 'Promedio de 38 horas puerta a puerta.'],
    ['Reclamos abiertos', '7 sin responder hace más de un día.'],
  ]),
  r('visitas_sitio', 'Visitas de un sitio', 'dashboard', 'Panel Web', 'Visitas del sitio: 18.420 esta semana', 'De dónde llega la gente, qué páginas lee y cuántas terminan una compra.', 'Ver las páginas', 'Elegir fechas', [
    ['Visitas por día', 'Pico de lunes a las 11 de la mañana.'],
    ['Origen del tráfico', 'Google, redes y links directos.'],
    ['Conversión', '2,8% de las visitas compra algo.'],
  ]),
  r('finanzas_dashboard', 'Finanzas', 'dashboard', 'Panel Caja', 'Caja del mes: entraron $ 6,8 millones y salieron $ 5,1', 'Ves cuánto entra, cuánto sale y cuánto te queda para los próximos 30 días.', 'Cargar un movimiento', 'Ver el flujo', [
    ['Ingresos y egresos', 'Por semana y por categoría.'],
    ['Cuentas por cobrar', '$ 1,3 millones vence esta semana.'],
    ['Proyección a 30 días', 'Según tus gastos fijos y ventas.'],
  ]),

  // Portfolio
  r('diseno', 'Diseño', 'portfolio', 'Julia Pardo', 'Diseño gráfico e identidad para marcas chicas', 'Trabajo con cafés, estudios y emprendimientos. Tengo lugar para dos proyectos nuevos en marzo.', 'Escribirme', 'Ver proyectos', [
    ['Identidad de marca', 'Logo, colores y tipografías.'],
    ['Packaging', 'Etiquetas y cajas listas para imprimir.'],
    ['Redes sociales', 'Piezas y plantillas editables.'],
  ]),
  r('fotografia', 'Fotografía', 'portfolio', 'Tomás Rey', 'Fotografía de producto y gastronomía en Rosario', 'Sesiones en estudio o en tu local. Entrego 20 fotos editadas en 5 días hábiles.', 'Pedir presupuesto', 'Ver galería', [
    ['Producto', 'Fondo blanco y fotos con ambiente.'],
    ['Gastronomía', 'Platos y cartas completas.'],
    ['Retratos de equipo', 'Para tu sitio y perfiles de redes.'],
  ]),
  r('desarrollo', 'Desarrollo', 'portfolio', 'Lucas Vidal', 'Desarrollador web: sitios rápidos y fáciles de mantener', 'Hago sitios y tiendas con React y Node. Entrego en 4 semanas y dejo todo documentado.', 'Hablemos', 'Ver trabajos', [
    ['Sitios a medida', 'Rápidos, accesibles y bien posicionados.'],
    ['Tiendas online', 'Con pagos y envíos integrados.'],
    ['Mantenimiento', 'Cambios y mejoras por hora.'],
  ]),
  r('arquitectura', 'Arquitectura', 'portfolio', 'Estudio Cal', 'Arquitectura residencial en el sur del GBA', '14 casas construidas entre 2018 y 2025. Proyectamos con luz natural y materiales de la zona.', 'Consultar por mi obra', 'Ver obras', [
    ['Casa Lomas', '180 m², hormigón visto y patio central.'],
    ['Casa Ribera', '95 m² sobre pilotes, frente al río.'],
    ['Reforma Alberdi', 'De PH antiguo a vivienda luminosa.'],
  ]),

  // Blog
  r('revista', 'Revista', 'blog', 'Pliego', 'Revista digital de cultura y ciudad, desde Córdoba', 'Crónicas, entrevistas y guías de barrio cada semana. Más de 600 notas publicadas.', 'Leer lo último', 'Ver secciones', [
    ['Crónicas', 'Historias largas de la ciudad.'],
    ['Entrevistas', 'Conversaciones con artistas locales.'],
    ['Guías', 'Dónde comer, ver y escuchar este mes.'],
  ]),
  r('newsletter', 'Newsletter', 'blog', 'La Posta', 'Newsletter semanal de economía para no economistas', 'Cada jueves a las 8, cinco minutos de lectura. Más de 12.000 personas la reciben.', 'Suscribirme gratis', 'Leer un número', [
    ['Cada jueves', 'Llega a tu mail a las 8 de la mañana.'],
    ['Cinco minutos', 'Lo que pasó y por qué importa.'],
    ['Archivo abierto', 'Todos los números, gratis y sin registro.'],
  ]),
  r('documentacion', 'Documentación', 'blog', 'Docs Vela', 'Documentación de Vela: guías y referencia de la API', 'Empezá en 10 minutos con un ejemplo completo. Cada guía trae código para copiar y pegar.', 'Empezar a usarla', 'Ver la API', [
    ['Primeros pasos', 'Instalación y primer ejemplo.'],
    ['Guías por tema', 'Autenticación, pagos y webhooks.'],
    ['Referencia de la API', 'Cada endpoint con su respuesta.'],
  ]),
  r('podcast', 'Podcast', 'blog', 'Sobremesa', 'Sobremesa: charlas largas sobre oficios y vidas', '84 episodios de una hora, uno cada martes. Con transcripción para leerlos si preferís.', 'Escuchar el último', 'Ver episodios', [
    ['Un episodio por semana', 'Todos los martes en tu app favorita.'],
    ['Invitados de oficio', 'Panaderas, luthiers y electricistas.'],
    ['Transcripción', 'Texto completo de cada episodio.'],
  ]),
];

export const rubrosDe = (tipo: TipoProyecto): Rubro[] => RUBROS.filter((x) => x.tipo === tipo);

export const rubroPorId = (id: string): Rubro | undefined => RUBROS.find((x) => x.id === id);
