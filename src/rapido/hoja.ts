// Carga a pedido de la hoja de la página (hoja-pagina.ts: CSS de estilos, fondos y scroll).
// main.tsx la pide antes de dibujar, así la primera pantalla ya sale con todo su CSS. Al llegar se
// inserta en el <body> antes de #root: queda después de todas las hojas del <head> (también las que
// bajan más tarde con cada panel) y antes de los <style> que dibuja React, como cuando iba adentro.
// `Pagina` espera la hoja (suspende) para no mostrarse nunca sin su estilo.

type Hoja = typeof import('./hoja-pagina');

let modulo: Hoja | null = null;
let lista = false;
let promesa: Promise<void> | null = null;

export function cargarHojaPagina(): Promise<void> {
  if (!promesa) {
    promesa = import('./hoja-pagina').then((m) => {
      if (typeof document !== 'undefined') {
        const el = document.createElement('style');
        el.dataset.hoja = 'pagina';
        el.textContent = m.cssDePagina();
        document.body.insertBefore(el, document.getElementById('root'));
      }
      modulo = m;
      lista = true;
    });
    // Si falla (sin red), se puede volver a pedir.
    promesa.catch(() => (promesa = null));
  }
  return promesa;
}

export const hojaLista = () => lista;

/** Suspende hasta que llegue la hoja (va dentro de un <Suspense>). */
export function useHojaPagina() {
  if (!lista) throw cargarHojaPagina();
}

/** Los datos que bajan con la hoja (el contenido de muestra). Si no llegaron, suspende. */
export function datosDeHoja(): Hoja {
  if (!modulo) throw cargarHojaPagina();
  return modulo;
}
