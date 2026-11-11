// Opciones de las rondas de iconos y tono (D11), con sus textos. Van aparte de `catalogo.ts` para no
// bajar con la portada (CLAUDE.md, «Carga inicial»): solo las usan las rondas y el export.

import type { EstiloIconos, LargoTextos, LibreriaIconos, Tratamiento, VozTexto } from './tipos';

/** Iconos (ronda D11, §11): cada opción es una librería con su estilo. */
export interface OpcionIconos {
  nombre: string;
  descripcion: string;
  libreria: LibreriaIconos;
  estilo: EstiloIconos;
  grosor: number;
}
export const ICONOS: Record<string, OpcionIconos> = {
  lucide_trazo: { nombre: 'Lucide, trazo', descripcion: 'Líneas finas y redondeadas, las más neutras', libreria: 'lucide', estilo: 'trazo', grosor: 1.75 },
  heroicons_trazo: { nombre: 'Heroicons, trazo', descripcion: 'Líneas parejas y simples, de aire técnico', libreria: 'heroicons', estilo: 'trazo', grosor: 1.5 },
  heroicons_relleno: { nombre: 'Heroicons, relleno', descripcion: 'Formas llenas, se leen bien chicas', libreria: 'heroicons', estilo: 'relleno', grosor: 0 },
  phosphor_trazo: { nombre: 'Phosphor, trazo', descripcion: 'Líneas con carácter, algo más amables', libreria: 'phosphor', estilo: 'trazo', grosor: 1.5 },
  phosphor_relleno: { nombre: 'Phosphor, relleno', descripcion: 'Formas llenas y redondeadas', libreria: 'phosphor', estilo: 'relleno', grosor: 0 },
  phosphor_duotono: { nombre: 'Phosphor, duotono', descripcion: 'Dos tonos: contorno y una mancha de color', libreria: 'phosphor', estilo: 'duotono', grosor: 1.5 },
  material_trazo: { nombre: 'Material Symbols, trazo', descripcion: 'El estilo de Android, en contorno', libreria: 'material_symbols', estilo: 'trazo', grosor: 2 },
  material_relleno: { nombre: 'Material Symbols, relleno', descripcion: 'El estilo de Android, lleno y firme', libreria: 'material_symbols', estilo: 'relleno', grosor: 0 },
};

/** Tono de los textos (ronda D11, §13): cada opción es una voz, un tratamiento y un largo, con una frase de muestra. */
export interface OpcionTono {
  nombre: string;
  voz: VozTexto;
  tratamiento: Tratamiento;
  largo: LargoTextos;
  ejemplo: string;
}
export const TONOS: Record<string, OpcionTono> = {
  cercano: { nombre: 'Cercano y corto', voz: 'cercana', tratamiento: 'vos', largo: 'corto', ejemplo: 'Listo, ya reservaste tu turno. ¡Te esperamos!' },
  divertido: { nombre: 'Divertido', voz: 'divertida', tratamiento: 'vos', largo: 'corto', ejemplo: '¡Turno guardado! Ahora sí, a relajarse.' },
  neutro: { nombre: 'Neutro y claro', voz: 'neutra', tratamiento: 'vos', largo: 'medio', ejemplo: 'Tu reserva quedó confirmada. Te enviamos los detalles por mail.' },
  neutro_tu: { nombre: 'Neutro de tú', voz: 'neutra', tratamiento: 'tu', largo: 'medio', ejemplo: 'Tu reserva ha sido confirmada. Te enviaremos los detalles por correo.' },
  formal: { nombre: 'Formal', voz: 'formal', tratamiento: 'usted', largo: 'medio', ejemplo: 'Su reserva fue confirmada. Le enviaremos los detalles por correo.' },
  explicativo: { nombre: 'Explicativo', voz: 'neutra', tratamiento: 'vos', largo: 'detallado', ejemplo: 'Reservaste el martes a las 10:00. Podés cambiarlo hasta 24 horas antes desde «Mis turnos».' },
};
