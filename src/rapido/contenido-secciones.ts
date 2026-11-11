// Contenido de muestra de las secciones (`src/secciones.ts`) para los tres tipos que las usan.
// Sigue a `contenido-tipo.ts`: misma marca inventada, datos concretos, sin eslóganes ni relleno.
// Beneficios y preguntas no están acá: salen del contenido de la página (`items` y `preguntas`).

import type { TipoConSecciones } from '../secciones';

export interface ContenidoSecciones {
  beneficios: { titulo: string };
  pasos: { titulo: string; items: { titulo: string; texto: string }[] };
  precios: {
    titulo: string;
    nota: string;
    /** Tres planes; `destacado` es el índice del más elegido. */
    planes: { nombre: string; para: string; precio: string; periodo: string; cta: string }[];
    destacado: number;
    /** Un renglón por característica; un valor por plan: texto, o true/false si lo incluye o no. */
    filas: { nombre: string; valores: (string | boolean)[] }[];
  };
  testimonios: { titulo: string; citas: { texto: string; nombre: string; rol: string }[] };
  preguntas: { titulo: string };
  equipo: { titulo: string; bajada: string; personas: { nombre: string; rol: string }[] };
  numeros: { titulo: string; cifras: { valor: string; texto: string }[] };
  contacto: { titulo: string; bajada: string; direccion: string; horario: string; telefono: string; mail: string; enviar: string; enviado: string };
}

export const CONTENIDO_SECCIONES: Record<TipoConSecciones, ContenidoSecciones> = {
  landing: {
    beneficios: { titulo: 'Qué te llevás' },
    pasos: {
      titulo: 'Cómo trabajamos',
      items: [
        { titulo: 'Nos contás tu negocio', texto: 'Una charla de 40 minutos, en el local o por videollamada.' },
        { titulo: 'Elegís entre dos propuestas', texto: 'Te las mostramos aplicadas a tu vidriera y a tu carta.' },
        { titulo: 'Recibís todo listo', texto: 'Archivos abiertos y una guía de uso de dos páginas.' },
      ],
    },
    precios: {
      titulo: 'Precios cerrados',
      nota: 'En pesos, con IVA. La mitad al empezar y la mitad al entregar.',
      planes: [
        { nombre: 'Logo', para: 'Para arrancar', precio: '$ 380.000', periodo: 'pago único', cta: 'Pedir Logo' },
        { nombre: 'Marca completa', para: 'Para un local a la calle', precio: '$ 720.000', periodo: 'pago único', cta: 'Pedir Marca completa' },
        { nombre: 'Marca y redes', para: 'Para vender también por Instagram', precio: '$ 940.000', periodo: 'pago único', cta: 'Pedir Marca y redes' },
      ],
      destacado: 1,
      filas: [
        { nombre: 'Logo y paleta', valores: [true, true, true] },
        { nombre: 'Rondas de cambios', valores: ['1 ronda', '2 rondas', '2 rondas'] },
        { nombre: 'Carta y señalética', valores: [false, true, true] },
        { nombre: 'Plantillas para redes', valores: [false, false, '12 plantillas'] },
        { nombre: 'Entrega', valores: ['1 semana', '3 semanas', '4 semanas'] },
      ],
    },
    testimonios: {
      titulo: 'Negocios que ya cambiaron',
      citas: [
        { texto: '«En tres semanas teníamos logo, carta y las plantillas de Instagram. Las ventas del mostrador subieron un 18%.»', nombre: 'Marina Costa', rol: 'Panadería Costa, Caballito' },
        { texto: '«Me dieron un precio el primer día y fue lo que pagué. Venía de dos presupuestos que se duplicaron.»', nombre: 'Raúl Benítez', rol: 'Ferretería El Tornillo, Lanús' },
        { texto: '«Las plantillas las edito yo desde el celular. Ya no dependo de nadie para publicar la promo del día.»', nombre: 'Sol Aguirre', rol: 'Heladería Nieve, Rosario' },
      ],
    },
    preguntas: { titulo: 'Preguntas frecuentes' },
    equipo: {
      titulo: 'Quiénes somos',
      bajada: 'Cuatro personas. Quien te atiende el primer día es quien diseña tu marca.',
      personas: [
        { nombre: 'Lucía Ferrari', rol: 'Dirección de diseño' },
        { nombre: 'Tomás Ibarra', rol: 'Identidad y señalética' },
        { nombre: 'Carla Méndez', rol: 'Redes y plantillas' },
        { nombre: 'Julián Ortiz', rol: 'Producción e imprenta' },
      ],
    },
    numeros: {
      titulo: 'En números',
      cifras: [
        { valor: '212', texto: 'negocios de barrio con marca nueva desde 2019.' },
        { valor: '3 semanas', texto: 'desde la primera charla hasta la entrega.' },
        { valor: '4,9', texto: 'de 5 en Google, con 164 opiniones.' },
      ],
    },
    contacto: {
      titulo: 'Pedí tu presupuesto',
      bajada: 'Respondemos en el día, de lunes a viernes.',
      direccion: 'Av. Rivadavia 5120, Caballito, Buenos Aires',
      horario: 'Lunes a viernes, de 10 a 18',
      telefono: '11 5555-0142',
      mail: 'hola@estudionorte.example',
      enviar: 'Pedir presupuesto',
      enviado: 'Listo, recibimos tu pedido. Te escribimos hoy.',
    },
  },
  sitio: {
    beneficios: { titulo: 'Qué se aprende' },
    pasos: {
      titulo: 'Cómo inscribirse',
      items: [
        { titulo: 'Elegí un taller', texto: 'Carpintería, electricidad o cocina. Podés anotarte en uno por cuatrimestre.' },
        { titulo: 'Completá el formulario', texto: 'Con tu DNI alcanza. Lleva cinco minutos.' },
        { titulo: 'Vení a la primera clase', texto: 'Te damos las herramientas y la ropa de trabajo.' },
      ],
    },
    precios: {
      titulo: 'Formas de ayudar',
      nota: 'Los talleres son gratis porque hay gente que aporta. Podés darte de baja cuando quieras.',
      planes: [
        { nombre: 'Vecino', para: 'Cubre los materiales de una clase', precio: '$ 6.000', periodo: 'por mes', cta: 'Aportar como Vecino' },
        { nombre: 'Padrino', para: 'Cubre la beca de un estudiante', precio: '$ 18.000', periodo: 'por mes', cta: 'Aportar como Padrino' },
        { nombre: 'Taller', para: 'Para comercios y empresas', precio: '$ 90.000', periodo: 'por mes', cta: 'Aportar como Taller' },
      ],
      destacado: 1,
      filas: [
        { nombre: 'Informe de en qué se usó', valores: ['Anual', 'Cada 4 meses', 'Cada 4 meses'] },
        { nombre: 'Recibo para deducir de Ganancias', valores: [true, true, true] },
        { nombre: 'Invitación a la muestra de fin de año', valores: [false, true, true] },
        { nombre: 'Tu nombre en el taller', valores: [false, false, true] },
        { nombre: 'Egresados para entrevistar', valores: [false, false, 'Hasta 5 por año'] },
      ],
    },
    testimonios: {
      titulo: 'Lo que cuentan los egresados',
      citas: [
        { texto: '«Terminé electricidad en diciembre y en febrero ya tenía clientes en el barrio.»', nombre: 'Diego Ramírez', rol: 'Egresado 2025, electricidad' },
        { texto: '«Entré sin saber agarrar un serrucho. Hoy armo muebles a medida con mi hermana.»', nombre: 'Noelia Vera', rol: 'Egresada 2024, carpintería' },
        { texto: '«Con el curso de cocina pasé de ayudante a encargada del comedor de la escuela.»', nombre: 'Estela Godoy', rol: 'Egresada 2023, cocina' },
      ],
    },
    preguntas: { titulo: 'Preguntas frecuentes' },
    equipo: {
      titulo: 'Quiénes enseñan',
      bajada: 'Docentes que viven del oficio que enseñan.',
      personas: [
        { nombre: 'Héctor Salinas', rol: 'Carpintería' },
        { nombre: 'Mónica Luna', rol: 'Electricidad' },
        { nombre: 'Rubén Acosta', rol: 'Cocina' },
        { nombre: 'Paula Giménez', rol: 'Coordinación e inscripciones' },
      ],
    },
    numeros: {
      titulo: 'Desde 2014',
      cifras: [
        { valor: '1.480', texto: 'personas terminaron un taller.' },
        { valor: '63%', texto: 'consiguió trabajo en su oficio antes del año.' },
        { valor: '$ 0', texto: 'es lo que paga cada estudiante, materiales incluidos.' },
      ],
    },
    contacto: {
      titulo: 'Escribinos',
      bajada: 'Respondemos de lunes a viernes, en menos de dos días.',
      direccion: 'Bv. Seguí 2450, Rosario, Santa Fe',
      horario: 'Lunes a viernes, de 9 a 13 y de 17 a 21',
      telefono: '341 555-0188',
      mail: 'talleres@fundacionrio.example',
      enviar: 'Enviar consulta',
      enviado: 'Recibimos tu consulta. Te respondemos antes de dos días hábiles.',
    },
  },
  portfolio: {
    beneficios: { titulo: 'Trabajos recientes' },
    pasos: {
      titulo: 'Cómo es una sesión',
      items: [
        { titulo: 'Me mandás los productos', texto: 'Por correo o los paso a buscar si estás en Córdoba capital.' },
        { titulo: 'Fotografío en el estudio', texto: 'Un día de trabajo. Te mando tres pruebas para ajustar la luz.' },
        { titulo: 'Recibís 20 fotos retocadas', texto: 'A los siete días, en tamaño para tienda y para redes.' },
      ],
    },
    precios: {
      titulo: 'Sesiones',
      nota: 'En pesos, factura C. El envío de vuelta de los productos está incluido.',
      planes: [
        { nombre: 'Media sesión', para: 'Hasta 5 productos', precio: '$ 160.000', periodo: 'por sesión', cta: 'Reservar media sesión' },
        { nombre: 'Sesión', para: 'Hasta 12 productos', precio: '$ 290.000', periodo: 'por sesión', cta: 'Reservar una sesión' },
        { nombre: 'Catálogo', para: 'Hasta 40 productos', precio: '$ 780.000', periodo: 'por catálogo', cta: 'Reservar un catálogo' },
      ],
      destacado: 1,
      filas: [
        { nombre: 'Fotos retocadas', valores: ['10 fotos', '20 fotos', '80 fotos'] },
        { nombre: 'Fondo de color a elección', valores: [true, true, true] },
        { nombre: 'Fotos de ambiente', valores: [false, '4 fotos', '12 fotos'] },
        { nombre: 'Recortes para redes', valores: [false, true, true] },
        { nombre: 'Entrega', valores: ['5 días', '7 días', '15 días'] },
      ],
    },
    testimonios: {
      titulo: 'Marcas con las que trabajé',
      citas: [
        { texto: '«Cambiamos las fotos de la tienda un lunes. Esa semana vendimos el doble de tazas.»', nombre: 'Clara Ibáñez', rol: 'Cerámica Barro' },
        { texto: '«Entregó en siete días, como dijo, y los colores de la lana son los reales.»', nombre: 'Julieta Moreno', rol: 'Lana Sur' },
        { texto: '«Entendió el producto antes de sacar la cámara. No tuve que explicar nada dos veces.»', nombre: 'Bruno Sosa', rol: 'Café Lumen' },
      ],
    },
    preguntas: { titulo: 'Preguntas frecuentes' },
    equipo: {
      titulo: 'Con quién trabajo',
      bajada: 'El estudio soy yo. Para los catálogos grandes sumo a estas tres personas.',
      personas: [
        { nombre: 'Inés Paz', rol: 'Fotografía y dirección' },
        { nombre: 'Marcos Leiva', rol: 'Retoque de color' },
        { nombre: 'Ana Quiroga', rol: 'Estilismo y utilería' },
        { nombre: 'Fede Roldán', rol: 'Asistencia de luces' },
      ],
    },
    numeros: {
      titulo: 'Desde 2021',
      cifras: [
        { valor: '47', texto: 'marcas fotografiadas, casi todas de menos de diez personas.' },
        { valor: '7 días', texto: 'entre la sesión y las fotos listas.' },
        { valor: '2', texto: 'marcas nuevas por mes, para llegar bien a cada una.' },
      ],
    },
    contacto: {
      titulo: 'Reservá una fecha',
      bajada: 'Tomo dos marcas por mes. Contesto en el día.',
      direccion: 'Estudio en Güemes, Córdoba capital',
      horario: 'Martes a sábado, de 10 a 17',
      telefono: '351 555-0127',
      mail: 'hola@inespaz.example',
      enviar: 'Consultar fechas',
      enviado: 'Recibí tu consulta. Te contesto hoy con las fechas libres.',
    },
  },
};
