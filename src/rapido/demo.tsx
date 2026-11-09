// Piezas animadas compartidas por las páginas de muestra (criterios de las skills stageshow y
// landing-page-design): un guion en bucle que corre solo a la vista, el puntero que mide su
// objetivo, la frase que se enciende palabra por palabra al bajar y las preguntas desplegables.
// Con movimiento reducido todo queda quieto en el cuadro que cuenta la historia.

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';

export const quieto = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export type Beat = { objetivo: string; clic?: boolean; dura: number };

/** Corre un guion en bucle mientras la escena está a la vista. Con movimiento reducido (o fuera de
 *  pantalla) muestra el cuadro de reposo, que es el que cuenta la historia solo. */
export function useGuion(beats: Beat[], poster: number, bucle = true) {
  const terminado = useRef(false);
  const ref = useRef<HTMLDivElement>(null);
  // Lo que se ve antes de entrar en pantalla: el resultado si es un bucle (o con movimiento
  // reducido); el comienzo si la historia se cuenta una sola vez, así no retrocede a la vista.
  const [paso, setPaso] = useState(() => (bucle || quieto() ? poster : 0));
  const [vuelta, setVuelta] = useState(0);
  const [activo, setActivo] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || quieto() || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setActivo(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (activo && !terminado.current) setPaso(0);
    else if (bucle || terminado.current) setPaso(poster);
  }, [activo, poster]);
  useEffect(() => {
    if (!activo || terminado.current) return;
    if (!bucle && paso + 1 >= beats.length) {
      terminado.current = true;
      return;
    }
    const t = window.setTimeout(() => {
      setPaso((p) => {
        if (p + 1 >= beats.length) setVuelta((v) => v + 1);
        return (p + 1) % beats.length;
      });
    }, beats[paso].dura);
    return () => window.clearTimeout(t);
  }, [activo, paso, beats, bucle]);
  return { ref, paso, vuelta, activo, beat: beats[paso] };
}

/** El puntero: mide el objetivo (data-objetivo) dentro de la escena; nunca posiciones a mano. */
export function Cursor({ escena, beat, paso, dedo = false, activo }: { escena: RefObject<HTMLElement>; beat: Beat; paso: number; dedo?: boolean; activo: boolean }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  useLayoutEffect(() => {
    const raiz = escena.current;
    if (!raiz) return;
    const medir = () => {
      const t = raiz.querySelector<HTMLElement>(`[data-objetivo="${beat.objetivo}"]`);
      if (!t) return;
      const r = raiz.getBoundingClientRect();
      const o = t.getBoundingClientRect();
      const sx = raiz.offsetWidth ? r.width / raiz.offsetWidth : 1;
      setPos({ x: (o.left - r.left + o.width * 0.55) / sx, y: (o.top - r.top + o.height * 0.6) / sx });
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(raiz);
    return () => ro.disconnect();
  }, [escena, beat.objetivo, paso]);
  if (!pos || !activo) return null;
  return (
    <span className={`au3-cursor ${dedo ? 'es-dedo' : ''}`} style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }} aria-hidden="true">
      {beat.clic && <i key={paso} className="au3-onda" />}
      {dedo ? (
        <b className={beat.clic ? `au3-toca t${paso % 2}` : ''} />
      ) : (
        <svg className={beat.clic ? `au3-pulsa p${paso % 2}` : ''} width="18" height="22" viewBox="0 0 18 22">
          <path d="M1.5 1.5v16.2l4.1-3.9 2.8 6.4 3-1.3-2.8-6.3h5.8z" fill="#111" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

/** Frase grande que se enciende palabra por palabra al bajar (una sola vez). */
export function FraseRevelada({ texto, clase = '' }: { texto: string; clase?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const palabras = texto.split(' ');
  const [n, setN] = useState(0);
  useEffect(() => {
    if (quieto()) {
      setN(palabras.length);
      return;
    }
    let raf = 0;
    const calc = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const p = (vh * 0.85 - r.top) / (r.height + vh * 0.35);
      const v = Math.max(0, Math.min(palabras.length, Math.round(p * palabras.length * 1.2)));
      setN((x) => Math.max(x, v));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(calc);
    };
    document.addEventListener('scroll', on, { capture: true, passive: true });
    window.addEventListener('resize', on);
    calc();
    return () => {
      document.removeEventListener('scroll', on, { capture: true });
      window.removeEventListener('resize', on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [palabras.length]);
  return (
    <p ref={ref} className={`au3-frase ${clase}`}>
      <span className="au-oculto">{texto}</span>
      <span aria-hidden="true">
        {palabras.map((w, i) => (
          <span key={i} className={i < n ? 'on' : ''}>
            {w}{' '}
          </span>
        ))}
      </span>
    </p>
  );
}

export function Preguntas({ titulo = 'Preguntas frecuentes', items, clase = '' }: { titulo?: string; items: [string, string][]; clase?: string }) {
  return (
    <section className={`au3-faq ${clase}`} aria-label={titulo}>
      <h3 className="au-h2">{titulo}</h3>
      <div>
        {items.map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

