// CSS de toda la galería de componentes. Va aparte para que la portada no lo cargue.

import { cssGaleria } from '.';

const css = cssGaleria();

export default function EstilosGaleria() {
  return <style>{css}</style>;
}
