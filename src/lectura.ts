// Reglas compartidas por la página y §7 del export. Solo se activan en un blog con lectura elegida.
export const CSS_LECTURA = `.pg.pg-lectura .pg-bajada,
.pg.pg-lectura .pg-card-texto,
.pg.pg-lectura .pg-rc-paso p {
  display: block;
  font-size: var(--texto-lectura);
  line-height: 1.6;
  max-inline-size: min(100%, var(--ancho-lectura));
  overflow-wrap: anywhere;
}
.pg.pg-lectura .pg-blog-lista {
  font-size: var(--texto-lectura);
  inline-size: 100%;
  max-inline-size: var(--ancho-lectura);
  min-inline-size: 0;
}`;
