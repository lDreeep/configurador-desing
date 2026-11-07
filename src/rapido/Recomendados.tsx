// Encabezados de la fila «Recomendados para tu …» y del resto, para usar dentro de cualquier grilla.

import { RECOMENDADOS } from '../recomendados';
import type { TipoProyecto } from '../tipos';

export function TituloRecomendados({ tipo, explicar = false }: { tipo: TipoProyecto; explicar?: boolean }) {
  const r = RECOMENDADOS[tipo];
  return (
    <div className="rec-titulo" role="presentation">
      <span className="rec-titulo-texto">★ Recomendados para tu {r.para}</span>
      {explicar && <span className="rec-porque">{r.porque}</span>}
    </div>
  );
}

export function TituloResto({ texto = 'Todas las demás opciones' }: { texto?: string }) {
  return (
    <div className="rec-titulo rec-resto" role="presentation">
      <span className="rec-titulo-texto">{texto}</span>
    </div>
  );
}

export const SelloRecomendado = () => (
  <span className="rec-sello" aria-label="Recomendado">
    ★
  </span>
);
