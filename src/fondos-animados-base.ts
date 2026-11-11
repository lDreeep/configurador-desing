// Identificadores para validar el estado sin cargar el CSS.
export const IDS_FONDOS_ANIMADOS = [
  "aurora",
  "puntos_corren",
  "franjas",
  "burbujas",
  "piso_perspectiva",
  "brillo_pasa",
  "grano_vibra",
  "ondas_agua",
  "puntos_unidos",
  "degrade_gira",
  "cuadricula_late",
  "lluvia_lineas",
  "manchas_tinta",
  "cinta_texto",
  "luz_cursor",
  "formas_flotan"
] as const;
export type FondoAnimadoId = typeof IDS_FONDOS_ANIMADOS[number];
