import { useEffect, useRef, useSyncExternalStore } from 'react';
import { configInicial } from '../estado';
import { Pagina } from '../rapido/Pagina';
import { COLOR, ESTILO, LAYOUT, PIEZAS, PROYECTO } from '../rondas/comunes';
import './portada.css';

const rondas = [PROYECTO, COLOR, LAYOUT, ESTILO, PIEZAS];
const muestras = [
  { tipo: 'tienda', layout: 'galeria' },
  { tipo: 'dashboard', layout: 'app_lateral' },
  { tipo: 'blog', layout: 'blog_lateral' },
].flatMap(({ tipo, layout }, pagina) => {
  let config = configInicial();
  return rondas.map((ronda) => {
    const opciones = ronda.opciones(config);
    const id = ronda === PROYECTO ? tipo : ronda === LAYOUT ? layout : undefined;
    const opcion = opciones.find((o) => o.id === id) ?? opciones[pagina];
    config = ronda.aplicar(config, opcion.id);
    return { config, ficha: ronda.ficha, nombre: opcion.nombre };
  });
});

const palabras = ['página', 'tienda', 'landing', 'app', 'portfolio', 'sistema'];
const fantasma = LAYOUT.aplicar(PROYECTO.aplicar(configInicial(), 'tienda'), 'galeria');
const estilosLente = ESTILO.opciones(fantasma).slice(0, 3).map((estilo, i) => {
  const base = ESTILO.aplicar(fantasma, estilo.id);
  const paleta = COLOR.opciones(base)[i + 1];
  const config = COLOR.aplicar(base, paleta.id);
  return { config: PIEZAS.aplicar(config, String(i)), nombre: estilo.nombre + ' · ' + paleta.nombre };
});
const anclas = [[.5, .5], [.3, .62], [.62, .4], [.26, .72], [.74, .3]];
const limitar = (v: number) => Math.max(0, Math.min(1, v));
const suave = (v: number) => v * v * (3 - 2 * v);
const movimiento = () => window.matchMedia?.('(prefers-reduced-motion: reduce)');
function suscribir(aviso: () => void) {
  const consulta = movimiento();
  consulta?.addEventListener('change', aviso);
  return () => consulta?.removeEventListener('change', aviso);
}

export function Portada({ empezar }: { empezar: () => void }) {
  const raiz = useRef<HTMLDivElement>(null);
  const quieta = useSyncExternalStore(suscribir, () => movimiento()?.matches ?? false);

  useEffect(() => {
    const el = raiz.current!;
    if (quieta || !window.requestAnimationFrame) return;
    const buscar = (clase: string) => el.querySelector<HTMLElement>(clase)!;
    const scroll = buscar('.portada-scroll');
    const lienzo = buscar('.portada-lienzo');
    const titulo = buscar('.molde-centro');
    const boton = buscar('.molde-empezar');
    const palabra = buscar('.portada-palabra');
    const vuelo = buscar('.portada-vuelo');
    const capas = Array.from(lienzo.children) as HTMLElement[];
    const linterna = buscar('.portada-linterna');
    const lente = buscar('.portada-lente');
    const variantes = Array.from(lente.children) as HTMLElement[];
    const etiqueta = buscar('.portada-etiqueta');
    const aro = buscar('.portada-aro');
    let lx = 0, ly = 0, radio = 0;
    const fichas = Array.from(buscar('.portada-fichas').children) as HTMLElement[];
    let ancho = 0, alto = 0, recorrido = 1;
    let caja = lienzo.getBoundingClientRect();
    let objetivo = 0, progreso = 0, raf = 0, anterior = -2;
    let grupoAnterior = -2, ultimaFicha = -2;
    let cursor: { x: number; y: number } | null = null;
    function medir() {
      ancho = el.clientWidth;
      alto = el.clientHeight;
      caja = lienzo.getBoundingClientRect();
      radio = Math.min(caja.width, caja.height) * (ancho < 600 ? .3 : .24);
      aro.style.width = aro.style.height = radio * 2 + 'px';
      lx = caja.width * .72;
      ly = caja.height * .34;
      recorrido = Math.max(1, scroll.scrollHeight - scroll.clientHeight);
      alBajar();
    }
    function alBajar() {
      objetivo = limitar(scroll.scrollTop / recorrido);
      if (!raf) raf = requestAnimationFrame(cuadro);
    }
    function cuadro(t: number) {
      raf = 0;
      progreso += (objetivo - progreso) * .15;
      if (Math.abs(objetivo - progreso) < .0002) progreso = objetivo;
      const salida = limitar(progreso / .06);
      const e = suave(salida);
      const fin = limitar((progreso - .94) / .06);
      const fase = fin > .5 ? 'fin' : progreso > .006 ? 'demo' : 'inicio';
      if (el.dataset.fase !== fase) el.dataset.fase = fase;
      titulo.style.opacity = String(1 - salida);
      titulo.style.transform = `translate(-50%, calc(-50% - ${salida * 70}px))`;
      const cx = ancho / 2, cy = alto * .64;
      const dx = cursor ? cursor.x - cx : 0, dy = cursor ? cursor.y - cy : 0;
      const atraer = progreso < .006 && Math.hypot(dx, dy) < 165;
      boton.style.transform = atraer ? `translate(${dx * .14}px, ${dy * .14}px)` : '';
      linterna.style.opacity = String(1 - e);
      if (salida < 1) {
        const ox = cursor ? cursor.x - caja.left : caja.width * (.5 + .3 * Math.sin(t * .00037));
        const oy = cursor ? cursor.y - caja.top : caja.height * (.42 + .22 * Math.sin(t * .00053 + 1));
        lx += (ox - lx) * .15;
        ly += (oy - ly) * .15;
        lente.style.clipPath = `circle(${radio}px at ${lx}px ${ly}px)`;
        aro.style.transform = `translate(${lx - radio}px,${ly - radio}px)`;
        etiqueta.style.transform = `translate(${lx}px,${ly + radio + 8}px) translateX(-50%)`;
      }

      const posicion = (progreso - .06) / .88 * capas.length;
      const indice = Math.max(-1, Math.min(capas.length - 1, Math.floor(posicion)));
      const u = limitar(posicion - indice);
      if (indice !== anterior) {
        capas.forEach((capa, i) => {
          capa.style.visibility = i === indice || i === indice - 1 ? 'visible' : '';
          if (i === indice - 1) capa.style.clipPath = '';
        });
        if (indice >= 0) vuelo.textContent = muestras[indice].nombre;
        anterior = indice;
      }
      lienzo.style.opacity = String(1 - fin);
      if (indice >= 0) {
        const [ax, ay] = anclas[indice % rondas.length];
        const radio = Math.hypot(Math.max(ax, 1 - ax) * caja.width, Math.max(ay, 1 - ay) * caja.height);
        capas[indice].style.clipPath = `circle(${radio * suave(limitar((u - .3) / .7))}px at ${ax * 100}% ${ay * 100}%)`;
        const v = suave(limitar(u / .42));
        const x = (ancho - 80) * (1 - v) + (caja.left + caja.width * ax) * v;
        const y = (caja.top + 32) * (1 - v) + (caja.top + caja.height * ay) * v - Math.sin(v * Math.PI) * 70;
        vuelo.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%) scale(${.55 + v * .45})`;
      }
      vuelo.style.opacity = indice < 0 ? '0' : String(Math.min(limitar(u / .08), limitar((.72 - u) / .22)));
      const grupo = Math.floor(indice / rondas.length);
      const ultima = fin > .5 ? -1 : indice - (u < .42 ? 1 : 0);
      if (grupo !== grupoAnterior || ultima !== ultimaFicha) {
        fichas.forEach((ficha, i) => { ficha.hidden = Math.floor(i / rondas.length) !== grupo || i > ultima; });
        grupoAnterior = grupo;
        ultimaFicha = ultima;
      }
      if (salida < 1 || progreso !== objetivo) raf = requestAnimationFrame(cuadro);
    }
    function mover(ev: PointerEvent) {
      if (ev.pointerType === 'mouse') cursor = { x: ev.clientX, y: ev.clientY };
    }
    function salir() { cursor = null; }
    let n = 0;
    const reloj = window.setInterval(() => {
      if (document.hidden || progreso >= .006) return;
      n++;
      palabra.textContent = palabras[n % palabras.length];
      const variante = n % variantes.length;
      variantes.forEach((capa, i) => { capa.hidden = i !== variante; });
      etiqueta.textContent = estilosLente[variante].nombre;
    }, 2400);
    medir();
    scroll.addEventListener('scroll', alBajar, { passive: true });
    el.addEventListener('pointermove', mover);
    el.addEventListener('pointerleave', salir);
    window.addEventListener('resize', medir);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(reloj);
      scroll.removeEventListener('scroll', alBajar);
      el.removeEventListener('pointermove', mover);
      el.removeEventListener('pointerleave', salir);
      window.removeEventListener('resize', medir);
    };
  }, [quieta]);

  return <div className="molde-portada" ref={raiz} key={String(quieta)}>
    <div className="molde-lienzo portada-linterna" aria-hidden="true" {...{ inert: '' }}>
      <div className="molde-capa portada-fantasma"><Pagina config={fantasma} /></div>
      <div className="portada-lente">
        {estilosLente.map(({ config, nombre }, i) => <div className="molde-capa" hidden={i !== 0} key={nombre}><Pagina config={config} /></div>)}
      </div>
      <i className="portada-aro" />
      <span className="portada-etiqueta">{estilosLente[0].nombre}</span>
    </div>
    {!quieta && <>
      <div className="molde-lienzo portada-lienzo" aria-hidden="true" {...{ inert: '' }}>
        {muestras.map(({ config }, i) => <div key={i} className="molde-capa"><Pagina config={config} /></div>)}
      </div>
      <div className="portada-scroll" tabIndex={0} role="region" aria-label="Recorré las páginas de muestra"><div /></div>
      <p className="portada-bajar">Bajá para ver cómo se arma ↓</p>
      <p className="portada-cierre">Ahora armá la tuya</p>
      <span className="portada-vuelo" aria-hidden="true" />
      <div className="portada-fichas" aria-hidden="true">{muestras.map((m, i) => <span key={i} hidden>{m.ficha}<b>{m.nombre}</b></span>)}</div>
    </>}
    <div className="molde-centro">
      <h1>Armá el diseño<br />de tu <span className="portada-palabra">página</span></h1>
      <p>Del botón salen ideas. Las que elegís se quedan en la página, y al final te la llevás armada.</p>
    </div>
    <button type="button" className="molde-empezar" onClick={empezar}>Empezar</button>
  </div>;
}
