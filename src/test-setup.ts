// En los tests, la hoja de la página (hoja.ts) y los layouts que bajan aparte (autores.tsx) se
// cargan antes, así `Pagina` se dibuja entera con renderToStaticMarkup en vez de quedarse en el «cargando».
import { precargarLayouts } from './rapido/autores';
import { cargarHojaPagina } from './rapido/hoja';

await Promise.all([cargarHojaPagina(), precargarLayouts()]);
