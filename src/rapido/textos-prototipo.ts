// Textos del prototipo según lo que la persona va a hacer: una tienda muestra productos y carrito,
// un dashboard métricas, un portfolio proyectos. La estructura de las pantallas es la misma.

import type { TipoProyecto } from '../tipos';

type Metrica = { etq: string; valor: string; cambio: string; meta: string };

export interface TextosPrototipo {
  /** Nombres de las 5 pantallas: portada, explorar, crear, panel, ayuda. */
  pantallas: [string, string, string, string, string];
  explorar: { titulo: string; sub: string; buscar: string; filtros: [string, string, string]; temas: string[]; items: [string, string][]; texto: string; progreso: string; accion: string };
  crear: { titulo: string; sub: string; plan: [string, string]; rango: string; principal: string; secundario: string };
  panel: { titulo: string; sub: string; principal: string; secundario: string; metricas: [Metrica, Metrica, Metrica]; grafico: string };
  ayuda: { faqs: [string, string][]; dudas: string; dudasSub: string };
}

const SUB_CREAR = 'Probá el formulario: guardá para ver la carga y el aviso, o eliminá para ver la ventana.';

export const TEXTOS_PROTOTIPO: Record<TipoProyecto, TextosPrototipo> = {
  landing: {
    pantallas: ['Inicio', 'Servicios', 'Contacto', 'Resultados', 'Preguntas'],
    explorar: { titulo: 'Servicios', sub: 'Todo lo que hacemos, en un vistazo.', buscar: 'Buscá un servicio…', filtros: ['Todos', 'Populares', 'Nuevos'], temas: ['Diseño', 'Marketing', 'Web', 'Consultoría'], items: [['Plan inicial', 'Nuevo'], ['Plan completo', 'Popular'], ['Mantenimiento', '20% off'], ['Asesoría', 'Popular']], texto: 'Te acompañamos de punta a punta.', progreso: 'Cupos del mes', accion: 'Ver detalle' },
    crear: { titulo: 'Contacto', sub: SUB_CREAR, plan: ['Mensual', 'Anual · 2 meses gratis'], rango: 'Presupuesto', principal: 'Enviar', secundario: 'Borrar' },
    panel: { titulo: 'Resultados', sub: 'Lo que logramos con nuestros clientes.', principal: 'Quiero lo mismo', secundario: 'Ver casos', metricas: [{ etq: 'Clientes', valor: '320', cambio: '▲ 18% este año', meta: '80%' }, { etq: 'Proyectos', valor: '1.240', cambio: '▲ 9% este año', meta: '62%' }, { etq: 'Satisfacción', valor: '4,9 / 5', cambio: '▲ 0,2 puntos', meta: '96%' }], grafico: 'Consultas por mes' },
    ayuda: { faqs: [['¿Cuánto tarda?', 'Entre dos y cuatro semanas según el plan.'], ['¿Puedo cancelar?', 'Sí, sin costo y en cualquier momento.'], ['¿Trabajan con empresas grandes?', 'Sí, y también con emprendimientos.']], dudas: '¿Seguís con dudas?', dudasSub: 'Respondemos en menos de una hora.' },
  },
  sitio: {
    pantallas: ['Inicio', 'Áreas', 'Contacto', 'Novedades', 'Preguntas'],
    explorar: { titulo: 'Áreas', sub: 'Conocé lo que hace cada equipo.', buscar: 'Buscá en el sitio…', filtros: ['Todas', 'Servicios', 'Proyectos'], temas: ['Institucional', 'Equipo', 'Prensa', 'Trabajá con nosotros'], items: [['Consultoría', 'Nuevo'], ['Capacitación', 'Popular'], ['Investigación', 'Destacado'], ['Comunidad', 'Popular']], texto: 'Un equipo dedicado a cada área.', progreso: 'Inscripciones', accion: 'Conocer más' },
    crear: { titulo: 'Contacto', sub: SUB_CREAR, plan: ['Persona', 'Empresa'], rango: 'Cantidad de personas', principal: 'Enviar consulta', secundario: 'Borrar' },
    panel: { titulo: 'Novedades', sub: 'Nuestro año en números.', principal: 'Leer el informe', secundario: 'Ver prensa', metricas: [{ etq: 'Personas alcanzadas', valor: '12.400', cambio: '▲ 22% vs. año anterior', meta: '74%' }, { etq: 'Proyectos activos', valor: '38', cambio: '▲ 5 nuevos', meta: '60%' }, { etq: 'Voluntarios', valor: '210', cambio: '▲ 14%', meta: '84%' }], grafico: 'Actividad por mes' },
    ayuda: { faqs: [['¿Dónde están?', 'En el centro, y atendemos también en línea.'], ['¿Cómo me sumo?', 'Desde Contacto, eligiendo «Persona».'], ['¿Tienen informes públicos?', 'Sí, en Novedades.']], dudas: '¿Querés hablar con alguien?', dudasSub: 'Te respondemos en el día.' },
  },
  tienda: {
    pantallas: ['Inicio', 'Productos', 'Carrito', 'Mis compras', 'Ayuda'],
    explorar: { titulo: 'Productos', sub: 'Buscá, filtrá y guardá lo que te guste.', buscar: 'Buscá un producto…', filtros: ['Todo', 'Nuevos', 'Ofertas'], temas: ['Remeras', 'Buzos', 'Accesorios', 'Calzado'], items: [['Remera básica · $ 12.900', 'Nuevo'], ['Buzo oversize · $ 34.500', 'Popular'], ['Gorra · $ 9.800', '20% off'], ['Zapatillas · $ 89.000', 'Últimas']], texto: 'Envío gratis desde $ 50.000.', progreso: 'Stock disponible', accion: 'Agregar al carrito' },
    crear: { titulo: 'Carrito', sub: 'Completá el envío: confirmá para ver la carga y el aviso, o vaciá el carrito para ver la ventana.', plan: ['Envío a domicilio', 'Retiro en local'], rango: 'Propina para el repartidor', principal: 'Confirmar compra', secundario: 'Vaciar carrito' },
    panel: { titulo: 'Mis compras', sub: 'Tus pedidos y lo que ahorraste.', principal: 'Seguir comprando', secundario: 'Ver pedidos', metricas: [{ etq: 'Pedidos', valor: '14', cambio: '▲ 2 este mes', meta: '70%' }, { etq: 'Ahorraste', valor: '$ 18.400', cambio: '▲ con ofertas', meta: '55%' }, { etq: 'Puntos', valor: '2.350', cambio: '▲ 350 nuevos', meta: '78%' }], grafico: 'Compras por mes' },
    ayuda: { faqs: [['¿Cuánto tarda el envío?', 'De 24 a 72 horas hábiles.'], ['¿Puedo cambiar un producto?', 'Sí, tenés 30 días para cambiarlo.'], ['¿Qué medios de pago aceptan?', 'Tarjetas, transferencia y efectivo al retirar.']], dudas: '¿Problemas con tu pedido?', dudasSub: 'Escribinos y lo resolvemos hoy.' },
  },
  app_web: {
    pantallas: ['Inicio', 'Proyectos', 'Nuevo', 'Resumen', 'Ayuda'],
    explorar: { titulo: 'Proyectos', sub: 'Todos tus proyectos y su avance.', buscar: 'Buscá un proyecto o tarea…', filtros: ['Todos', 'Activos', 'Archivados'], temas: ['Diseño', 'Desarrollo', 'Marketing', 'Ventas'], items: [['Rediseño web', 'En curso'], ['App de pedidos', 'Nuevo'], ['Campaña de verano', 'Atrasado'], ['Onboarding', 'En curso']], texto: '12 tareas · 3 personas.', progreso: 'Avance', accion: 'Abrir' },
    crear: { titulo: 'Nuevo proyecto', sub: SUB_CREAR, plan: ['Privado', 'Compartido con el equipo'], rango: 'Horas estimadas', principal: 'Crear proyecto', secundario: 'Descartar' },
    panel: { titulo: 'Resumen', sub: 'Cómo viene el equipo esta semana.', principal: 'Nueva tarea', secundario: 'Ver reportes', metricas: [{ etq: 'Tareas cerradas', valor: '86', cambio: '▲ 12% vs. semana anterior', meta: '72%' }, { etq: 'En curso', valor: '24', cambio: '▼ 3 menos', meta: '48%' }, { etq: 'Horas registradas', valor: '312', cambio: '▲ 6%', meta: '81%' }], grafico: 'Tareas cerradas por día' },
    ayuda: { faqs: [['¿Cómo invito a alguien?', 'Desde Nuevo, eligiendo «Compartido con el equipo».'], ['¿Puedo exportar mis datos?', 'Sí, en CSV desde Resumen.'], ['¿Hay app para celular?', 'Sí, para iPhone y Android.']], dudas: '¿Necesitás ayuda?', dudasSub: 'Soporte en línea de 9 a 21.' },
  },
  app_movil: {
    pantallas: ['Inicio', 'Buscar', 'Agregar', 'Actividad', 'Perfil'],
    explorar: { titulo: 'Buscar', sub: 'Encontrá lo que querés en segundos.', buscar: 'Buscá lugares, personas…', filtros: ['Todo', 'Cerca', 'Guardados'], temas: ['Comida', 'Salidas', 'Deportes', 'Cultura'], items: [['Café de la esquina', 'A 300 m'], ['Clase de yoga', 'Hoy'], ['Feria del barrio', 'Gratis'], ['Cine al aire libre', 'Popular']], texto: '4,8 ★ · 120 opiniones.', progreso: 'Lugares ocupados', accion: 'Guardar' },
    crear: { titulo: 'Agregar', sub: SUB_CREAR, plan: ['Solo yo', 'Con amigos'], rango: 'Distancia máxima', principal: 'Publicar', secundario: 'Eliminar' },
    panel: { titulo: 'Actividad', sub: 'Tu semana en la app.', principal: 'Nuevo plan', secundario: 'Ver historial', metricas: [{ etq: 'Pasos', valor: '48.230', cambio: '▲ 12% vs. semana anterior', meta: '72%' }, { etq: 'Planes', valor: '6', cambio: '▲ 2 más', meta: '60%' }, { etq: 'Racha', valor: '9 días', cambio: '▲ récord', meta: '90%' }], grafico: 'Actividad de la semana' },
    ayuda: { faqs: [['¿Cómo cambio mi foto?', 'Desde Perfil, tocando tu foto.'], ['¿Puedo usarla sin conexión?', 'Sí, lo guardado se ve sin internet.'], ['¿Cómo borro mi cuenta?', 'En Perfil › Ajustes › Cuenta.']], dudas: '¿Algo no anda?', dudasSub: 'Contanos y lo arreglamos.' },
  },
  dashboard: {
    pantallas: ['Inicio', 'Clientes', 'Cargar', 'Métricas', 'Ayuda'],
    explorar: { titulo: 'Clientes', sub: 'Buscá, filtrá y segmentá tu base.', buscar: 'Buscá por nombre o email…', filtros: ['Todos', 'Activos', 'En riesgo'], temas: ['Mayoristas', 'Minoristas', 'Nuevos', 'Inactivos'], items: [['Distribuidora Sur', 'Activo'], ['Almacén Norte', 'Nuevo'], ['Kiosco Centro', 'En riesgo'], ['Mercado Oeste', 'Activo']], texto: 'Última compra: hace 3 días.', progreso: 'Cupo de crédito usado', accion: 'Ver ficha' },
    crear: { titulo: 'Cargar venta', sub: SUB_CREAR, plan: ['Contado', 'Cuenta corriente'], rango: 'Descuento', principal: 'Guardar venta', secundario: 'Anular' },
    panel: { titulo: 'Métricas', sub: 'Así se ven tus números del mes.', principal: 'Nueva venta', secundario: 'Exportar reporte', metricas: [{ etq: 'Ventas del mes', valor: '$ 48.230', cambio: '▲ 12,4% vs. mes anterior', meta: '72%' }, { etq: 'Clientes nuevos', valor: '128', cambio: '▲ 8% vs. mes anterior', meta: '64%' }, { etq: 'Ticket promedio', valor: '$ 3.120', cambio: '▲ 3,1% vs. mes anterior', meta: '81%' }], grafico: 'Ventas de la semana' },
    ayuda: { faqs: [['¿Cada cuánto se actualizan los datos?', 'Cada cinco minutos.'], ['¿Puedo exportar los reportes?', 'Sí, en Excel o PDF.'], ['¿Quién puede ver los números?', 'Solo las personas con permiso de administrador.']], dudas: '¿Un número no cierra?', dudasSub: 'Lo revisamos con vos.' },
  },
  portfolio: {
    pantallas: ['Inicio', 'Trabajos', 'Contacto', 'Clientes', 'Sobre mí'],
    explorar: { titulo: 'Trabajos', sub: 'Una selección de proyectos recientes.', buscar: 'Buscá un proyecto…', filtros: ['Todos', 'Marca', 'Editorial'], temas: ['Identidad', 'Editorial', 'Packaging', 'Web'], items: [['Identidad Café Lumen', '2026'], ['Revista Norte', 'Destacado'], ['Packaging Brote', 'Premiado'], ['Web Estudio Faro', '2025']], texto: 'Dirección de arte y diseño.', progreso: 'Agenda del trimestre', accion: 'Ver proyecto' },
    crear: { titulo: 'Contacto', sub: SUB_CREAR, plan: ['Proyecto puntual', 'Trabajo continuo'], rango: 'Presupuesto', principal: 'Enviar', secundario: 'Borrar' },
    panel: { titulo: 'Clientes', sub: 'Algunos números de estos años.', principal: 'Trabajemos juntos', secundario: 'Descargar CV', metricas: [{ etq: 'Proyectos', valor: '86', cambio: '▲ 14 este año', meta: '70%' }, { etq: 'Clientes', valor: '42', cambio: '▲ de 6 países', meta: '58%' }, { etq: 'Premios', valor: '5', cambio: '▲ 2 este año', meta: '50%' }], grafico: 'Proyectos por año' },
    ayuda: { faqs: [['¿Trabajás a distancia?', 'Sí, con clientes de todo el mundo.'], ['¿Cuánto tarda una identidad?', 'Entre cuatro y seis semanas.'], ['¿Hacés solo diseño?', 'También dirección de arte y fotografía.']], dudas: '¿Tenés un proyecto?', dudasSub: 'Contame y te respondo esta semana.' },
  },
  blog: {
    pantallas: ['Inicio', 'Artículos', 'Escribir', 'Lectores', 'Acerca'],
    explorar: { titulo: 'Artículos', sub: 'Lo último que publicamos.', buscar: 'Buscá un tema o artículo…', filtros: ['Todo', 'Recientes', 'Más leídos'], temas: ['Cultura', 'Tecnología', 'Viajes', 'Opinión'], items: [['Diez libros para el verano', 'Nuevo'], ['Cómo trabajar menos', 'Más leído'], ['Un mes en Japón', 'Destacado'], ['El futuro del papel', 'Opinión']], texto: '6 min de lectura · por Ana López.', progreso: 'Leído', accion: 'Leer' },
    crear: { titulo: 'Escribir', sub: SUB_CREAR, plan: ['Borrador', 'Publicar ahora'], rango: 'Minutos de lectura', principal: 'Publicar', secundario: 'Descartar' },
    panel: { titulo: 'Lectores', sub: 'Cómo te leen este mes.', principal: 'Nuevo artículo', secundario: 'Ver estadísticas', metricas: [{ etq: 'Lecturas', valor: '48.230', cambio: '▲ 12% vs. mes anterior', meta: '72%' }, { etq: 'Suscriptores', valor: '2.140', cambio: '▲ 180 nuevos', meta: '64%' }, { etq: 'Tiempo de lectura', valor: '5:40', cambio: '▲ 20 s', meta: '81%' }], grafico: 'Lecturas por día' },
    ayuda: { faqs: [['¿Cómo me suscribo?', 'Dejá tu email abajo de cualquier artículo.'], ['¿Puedo escribir para el blog?', 'Sí, mandanos tu propuesta.'], ['¿Cada cuánto publican?', 'Dos veces por semana.']], dudas: '¿Querés colaborar?', dudasSub: 'Escribinos con tu idea.' },
  },
};
