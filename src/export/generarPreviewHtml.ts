import { JS_LUZ_CURSOR } from '../fondos-animados';

async function imagenEmbebida(url: string) {
  const respuesta = await fetch(url);
  if (!respuesta.ok) throw new Error('No se pudo cargar una imagen de la página.');
  const blob = await respuesta.blob();
  return new Promise<string>((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = () => resolve(String(lector.result));
    lector.onerror = () => reject(lector.error);
    lector.readAsDataURL(blob);
  });
}

/** Captura el mismo árbol y la cascada que ya dibujaron el lienzo, incluidas sus hojas lazy. */
export async function generarPreviewHtml(pagina: HTMLElement, titulo: string) {
  const origen = pagina.ownerDocument;
  const doc = origen.implementation.createHTMLDocument(titulo || 'Vista previa');
  doc.documentElement.lang = 'es';
  doc.head.insertAdjacentHTML('afterbegin', '<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">');
  for (const hoja of Array.from(origen.styleSheets)) {
    if (hoja.disabled) continue;
    if (hoja.href && new URL(hoja.href).hostname === 'fonts.googleapis.com') {
      doc.head.append(doc.importNode(hoja.ownerNode!, true));
      continue;
    }
    const estilo = doc.createElement('style');
    estilo.media = hoja.media?.mediaText || 'all';
    estilo.textContent = Array.from(hoja.cssRules, (r) => r.cssText).join('\n').replace(/<\/style/gi, '<\\/style');
    doc.head.append(estilo);
  }
  const copia = doc.importNode(pagina, true);
  const imagenes = new Map<string, Promise<string>>();
  await Promise.all(Array.from(copia.querySelectorAll('img'), async (img) => {
    const src = img.getAttribute('src');
    if (!src || src.startsWith('data:')) return;
    const url = new URL(src, origen.baseURI).href;
    if (!imagenes.has(url)) imagenes.set(url, imagenEmbebida(url));
    img.src = await imagenes.get(url)!;
    img.removeAttribute('srcset');
  }));
  doc.body.append(copia);
  if (copia.querySelector('.fa-luz_cursor')) {
    const script = doc.createElement('script');
    script.textContent = JS_LUZ_CURSOR;
    doc.body.append(script);
  }
  return '<!doctype html>\n' + doc.documentElement.outerHTML;
}
