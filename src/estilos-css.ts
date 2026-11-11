// El CSS de cada estilo visual (sus datos y reglas están en estilos-visuales.ts). En el CSS,
// `&` es la raíz de la página; las clases .pg-* están explicadas en estilos-visuales.ts.
// Este archivo no va en la carga inicial: lo usan la hoja de la página (rapido/hoja-pagina.ts)
// y el export (§19), que bajan aparte.

import type { ESTILOS } from './estilos-visuales';

type Id = keyof typeof ESTILOS;

export const CSS_ESTILOS: Record<Id, string> = {
  suizo: `
& { --deco-1: var(--color-acento); }
& .pg-titulo { letter-spacing: -0.045em; line-height: 0.92; }
& .pg-etiqueta { text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; }
& .pg-card { border-top: 4px solid var(--color-texto); background: transparent; box-shadow: none; border-radius: 0; }
& .pg-media { background: var(--color-acento); }
& .pg-deco { background-image: repeating-linear-gradient(90deg, transparent 0 calc(100% / 12 - 1px), rgba(0,0,0,.06) calc(100% / 12 - 1px) calc(100% / 12)); }
`,
  bauhaus: `
& { --deco-1: #D7261E; --deco-2: #F2B705; --deco-3: #1F3F99; }
& .pg-card { border: 3px solid var(--color-texto); border-radius: 0; }
& .pg-card:nth-child(3n+1) { border-top: 14px solid var(--deco-1); }
& .pg-card:nth-child(3n+2) { border-top: 14px solid var(--deco-2); }
& .pg-card:nth-child(3n+3) { border-top: 14px solid var(--deco-3); }
& .pg-media { background: var(--deco-2); border: 3px solid var(--color-texto); position: relative; overflow: hidden; }
& .pg-media::before { content: ''; position: absolute; width: 60%; aspect-ratio: 1; border-radius: 50%; background: var(--deco-1); left: -10%; bottom: -20%; }
& .pg-media::after { content: ''; position: absolute; width: 0; height: 0; border-left: 70px solid transparent; border-right: 70px solid transparent; border-bottom: 120px solid var(--deco-3); right: 12%; top: 14%; }
& .pg-deco .a { position: absolute; width: 140px; aspect-ratio: 1; border-radius: 50%; background: var(--deco-1); top: 8%; right: 6%; opacity: .9; }
& .pg-deco .b { position: absolute; width: 90px; height: 90px; background: var(--deco-3); bottom: 10%; right: 18%; }
& .pg-deco .c { position: absolute; width: 0; height: 0; border-left: 50px solid transparent; border-right: 50px solid transparent; border-bottom: 86px solid var(--deco-2); bottom: 30%; left: 4%; }
`,
  memphis: `
& { --deco-1: #00B3A6; --deco-2: #FFD23F; --deco-3: #7B5CFF; }
& .pg-card:nth-child(odd) { transform: rotate(-1.2deg); }
& .pg-card:nth-child(even) { transform: rotate(1deg); }
& .pg-media { background-color: var(--deco-2); background-image: radial-gradient(var(--color-texto) 2.5px, transparent 3px); background-size: 18px 18px; border: 2px solid var(--color-texto); box-shadow: 6px 6px 0 var(--deco-3); }
& .pg-deco .a { position: absolute; width: 160px; height: 40px; top: 12%; right: 8%; background: linear-gradient(135deg, var(--deco-1) 25%, transparent 25%) -20px 0, linear-gradient(225deg, var(--deco-1) 25%, transparent 25%) -20px 0; background-size: 40px 40px; }
& .pg-deco .b { position: absolute; width: 90px; aspect-ratio: 1; border-radius: 50%; border: 10px solid var(--deco-3); bottom: 12%; left: 5%; }
& .pg-deco .c { position: absolute; width: 120px; height: 120px; background-image: radial-gradient(var(--deco-1) 3px, transparent 3.5px); background-size: 16px 16px; bottom: 25%; right: 4%; }
`,
  neobrutalismo: `
& { --deco-1: #FFD23F; --deco-2: #7BDFF2; --deco-3: #B8F2A0; }
& .pg-card { border: 3px solid var(--color-texto); box-shadow: 6px 6px 0 var(--color-texto); }
& .pg-card:nth-child(3n+1) { background: var(--deco-1); }
& .pg-card:nth-child(3n+2) { background: var(--deco-2); }
& .pg-card:nth-child(3n+3) { background: var(--deco-3); }
& .pg-card, & .pg-card .pg-etiqueta { color: #111111; }
& .pg-media { background: var(--color-acento); border: 3px solid var(--color-texto); box-shadow: 8px 8px 0 var(--color-texto); }
& .pg-etiqueta { display: inline-block; align-self: flex-start; background: var(--color-fondo); border: 2px solid var(--color-texto); padding: 2px 8px; }
`,
  vidrio: `
& { --deco-1: #FF5CA8; --deco-2: #4CC9F0; --deco-3: #7B5CFF; }
& .pg-card, & .pg-nav { background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.16); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); }
& .pg-media { background: linear-gradient(135deg, rgba(255,255,255,.16), rgba(255,255,255,.04)); border: 1px solid rgba(255,255,255,.2); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); }
& .pg-deco > span { position: absolute; border-radius: 50%; filter: blur(70px); opacity: .55; }
& .pg-deco .a { width: 380px; height: 380px; background: var(--deco-1); top: -8%; right: 5%; }
& .pg-deco .b { width: 320px; height: 320px; background: var(--deco-2); bottom: 0; left: -5%; }
& .pg-deco .c { width: 260px; height: 260px; background: var(--deco-3); top: 40%; left: 45%; }
`,
  clay: `
& { --deco-1: #FFB4C8; --deco-2: #A6E3E9; --deco-3: #CDB4FF; }
& .pg-card { border: none; border-radius: 28px; background: var(--color-superficie); box-shadow: inset 6px 6px 12px rgba(255,255,255,.85), inset -8px -8px 16px rgba(0,0,0,.06), 14px 18px 36px rgba(43,45,66,.14); }
& .pg-media { border-radius: 36px; background: var(--deco-3); box-shadow: inset 10px 10px 20px rgba(255,255,255,.6), inset -12px -12px 24px rgba(0,0,0,.1), 18px 24px 44px rgba(43,45,66,.18); }
& .pg-boton { box-shadow: inset 4px 4px 8px rgba(255,255,255,.35), inset -4px -4px 8px rgba(0,0,0,.18), 8px 10px 22px rgba(43,45,66,.22); border: none; }
& .pg-deco .a { position: absolute; width: 110px; aspect-ratio: 1; border-radius: 50%; background: var(--deco-1); top: 10%; right: 8%; box-shadow: inset 8px 8px 16px rgba(255,255,255,.6), inset -10px -10px 20px rgba(0,0,0,.1); }
& .pg-deco .b { position: absolute; width: 70px; aspect-ratio: 1; border-radius: 50%; background: var(--deco-2); bottom: 14%; left: 6%; box-shadow: inset 6px 6px 12px rgba(255,255,255,.6), inset -8px -8px 16px rgba(0,0,0,.1); }
`,
  retro_os: `
& { background: #008080; }
& .pg-card, & .pg-media, & .pg-nav { background: var(--color-fondo); border: 2px solid; border-color: #FFFFFF #404040 #404040 #FFFFFF; box-shadow: 1px 1px 0 #000; border-radius: 0; }
& .pg-card { padding-top: 34px !important; position: relative; }
& .pg-card::before { content: ''; position: absolute; left: 3px; right: 3px; top: 3px; height: 22px; background: linear-gradient(90deg, var(--color-acento), #1084D0); }
& .pg-hero { background: var(--color-fondo); border: 2px solid; border-color: #FFFFFF #404040 #404040 #FFFFFF; padding: 24px; }
& .pg-boton, & .pg-boton-sec { border-radius: 0; border: 2px solid; border-color: #FFFFFF #404040 #404040 #FFFFFF; box-shadow: 1px 1px 0 #000; }
& .pg-boton-sec { background: var(--color-fondo); color: var(--color-texto); }
& .pg-boton:active, & .pg-boton-sec:active { border-color: #404040 #FFFFFF #FFFFFF #404040; }
& .pg-media { background-image: linear-gradient(45deg, #C0C0C0 25%, transparent 25%, transparent 75%, #C0C0C0 75%), linear-gradient(45deg, #C0C0C0 25%, transparent 25%, transparent 75%, #C0C0C0 75%); background-size: 16px 16px; background-position: 0 0, 8px 8px; }
`,
  terminal: `
& .pg-titulo, & .pg-marca { text-shadow: 0 0 12px color-mix(in srgb, var(--color-acento) 55%, transparent); }
& .pg-titulo::before { content: '> '; color: var(--color-acento-texto); }
& .pg-titulo::after { content: '_'; color: var(--color-acento-texto); animation: pg-cursor 1s steps(1) infinite; }
@keyframes pg-cursor { 50% { opacity: 0; } }
& .pg-card { border: 1px dashed var(--color-borde); background: transparent; box-shadow: none; }
& .pg-media { background: repeating-linear-gradient(0deg, var(--color-superficie) 0 3px, transparent 3px 6px); border: 1px solid var(--color-borde); }
& .pg-deco { background: repeating-linear-gradient(0deg, rgba(255,255,255,.035) 0 1px, transparent 1px 3px); z-index: 3; }
`,
  editorial: `
& .pg-card { background: transparent; box-shadow: none; border: none; border-top: 1px solid var(--color-texto); border-radius: 0; padding-left: 0 !important; padding-right: 0 !important; }
& .pg-bajada { font-style: italic; }
& .pg-bajada::first-letter { float: left; font-family: var(--fuente-titulos); font-size: 3.4em; line-height: 0.85; padding-right: 8px; font-style: normal; color: var(--color-acento-texto); }
& .pg-etiqueta { font-style: italic; text-transform: none; letter-spacing: 0; font-weight: 400; }
& .pg-media { background: var(--color-superficie); border: 1px solid var(--color-texto); }
& .pg-nav { border-bottom: 3px double var(--color-texto); }
`,
  art_deco: `
& .pg-titulo, & .pg-marca { text-transform: uppercase; letter-spacing: 0.12em; }
& .pg-hero { text-align: center; align-items: center; }
& .pg-card { border: 3px double var(--color-acento); background: transparent; box-shadow: none; text-align: center; align-items: center; }
& .pg-media { border: 3px double var(--color-acento); background: repeating-conic-gradient(from 0deg at 50% 100%, color-mix(in srgb, var(--color-acento) 26%, transparent) 0deg 4deg, transparent 4deg 12deg); }
& .pg-deco { background: repeating-conic-gradient(from 0deg at 50% 0%, color-mix(in srgb, var(--color-acento) 7%, transparent) 0deg 3deg, transparent 3deg 9deg); }
& .pg-boton, & .pg-boton-sec { letter-spacing: 0.14em; text-transform: uppercase; }
`,
  y2k: `
& { --deco-1: #FF6FD8; --deco-2: #3EE6FF; --deco-3: #B9B9D9; }
& .pg-titulo { background: linear-gradient(100deg, var(--color-texto) 30%, var(--color-acento)); -webkit-background-clip: text; background-clip: text; color: transparent; }
& .pg-boton { background-image: linear-gradient(180deg, rgba(255,255,255,.45), rgba(255,255,255,0) 50%); }
& .pg-media { background: radial-gradient(circle at 30% 30%, #FFFFFF, var(--deco-3) 40%, var(--deco-2) 75%, var(--deco-1)); border-radius: 999px; }
& .pg-deco > span::before { content: '\\2726'; position: absolute; color: var(--color-acento-texto); }
& .pg-deco .a::before { top: 10%; right: 10%; font-size: 48px; }
& .pg-deco .b::before { top: 55%; left: 4%; font-size: 30px; }
& .pg-deco .c::before { bottom: 8%; right: 30%; font-size: 22px; }
& .pg-deco > span { position: absolute; inset: 0; }
`,
  organico: `
& { --deco-1: #C9A27E; --deco-2: #9DB89A; --deco-3: #E8C9A9; }
& .pg-media { border-radius: 58% 42% 46% 54% / 52% 44% 56% 48%; background: var(--deco-2); }
& .pg-card { border-radius: 32px 32px 32px 8px; }
& .pg-deco { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.07'/%3E%3C/svg%3E"); z-index: 3; }
& .pg-deco .a { position: absolute; width: 220px; height: 200px; border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%; background: var(--deco-3); top: 6%; right: -40px; opacity: .7; }
& .pg-deco .b { position: absolute; width: 140px; height: 160px; border-radius: 45% 55% 40% 60% / 55% 45% 60% 40%; background: var(--deco-1); bottom: 8%; left: -30px; opacity: .45; }
`,
  minimal_tecnico: `
& .pg-titulo { letter-spacing: -0.035em; }
& .pg-etiqueta { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; }
& .pg-etiqueta::before { content: '// '; color: var(--color-acento-texto); }
& .pg-card { background: var(--color-fondo); border: 1px solid var(--color-borde); box-shadow: none; }
& .pg-card:hover { border-color: var(--color-texto-suave); }
& .pg-media { background-color: var(--color-superficie); border: 1px solid var(--color-borde); background-image: radial-gradient(var(--color-borde) 1px, transparent 1px); background-size: 16px 16px; }
& .pg-deco { background-image: linear-gradient(var(--color-borde) 1px, transparent 1px); background-size: 100% 96px; opacity: .35; mask-image: linear-gradient(transparent, #000 30%, transparent); -webkit-mask-image: linear-gradient(transparent, #000 30%, transparent); }
`,
  oscuro_precision: `
& .pg-titulo { letter-spacing: -0.03em; }
& .pg-card { background: linear-gradient(180deg, var(--color-superficie-alta), var(--color-superficie)); border: 1px solid var(--color-borde); box-shadow: inset 0 1px 0 rgba(255,255,255,.06); }
& .pg-card:hover { border-color: color-mix(in srgb, var(--color-acento) 50%, var(--color-borde)); }
& .pg-boton { box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-acento) 60%, transparent), 0 8px 24px -8px var(--color-acento); }
& .pg-media { background: radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--color-acento) 45%, transparent), transparent 70%), var(--color-superficie); border: 1px solid var(--color-borde); }
& .pg-deco { background: radial-gradient(ellipse 60% 40% at 50% 0%, color-mix(in srgb, var(--color-acento) 22%, transparent), transparent 70%); }
`,
  producto_amable: `
& { --deco-1: color-mix(in srgb, var(--color-acento) 30%, #FFFFFF); --deco-2: #FFD9A8; --deco-3: #BFE8D4; }
& .pg-card { border-radius: 24px; box-shadow: 0 1px 2px rgba(0,0,0,.04); }
& .pg-card:nth-child(3n+1) { background: color-mix(in srgb, var(--deco-1) 35%, var(--color-fondo)); }
& .pg-card:nth-child(3n+2) { background: color-mix(in srgb, var(--deco-2) 35%, var(--color-fondo)); }
& .pg-card:nth-child(3n) { background: color-mix(in srgb, var(--deco-3) 40%, var(--color-fondo)); }
& .pg-media { border-radius: 32px; background: radial-gradient(circle at 30% 35%, var(--deco-2) 0 18%, transparent 19%), radial-gradient(circle at 70% 60%, var(--deco-3) 0 24%, transparent 25%), var(--deco-1); }
& .pg-etiqueta { border-radius: 999px; padding: 4px 12px; background: color-mix(in srgb, var(--color-acento) 14%, transparent); color: var(--color-texto); }
`,
  periodico: `
& .pg-titulo { letter-spacing: -0.02em; line-height: 0.98; }
& .pg-nav { border-bottom: 3px double var(--color-texto); }
& .pg-etiqueta { font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; border-top: 1px solid var(--color-texto); border-bottom: 1px solid var(--color-texto); padding: 3px 0; }
& .pg-card { background: var(--color-fondo); box-shadow: none; border-radius: 0; border-top: 1px solid var(--color-texto); }
& .pg-bajada { column-count: 2; column-gap: 24px; column-rule: 1px solid var(--color-borde); }
& .pg-media { background: repeating-linear-gradient(0deg, var(--color-borde) 0 1px, transparent 1px 6px), var(--color-superficie); filter: grayscale(1); border-radius: 0; }
`,
  japones: `
& { --deco-1: #B23A2E; }
& .pg-titulo { font-weight: 400; letter-spacing: 0.01em; }
& .pg-hero { padding-top: 12vh; }
& .pg-card { background: var(--color-fondo); box-shadow: none; border: none; border-left: 1px solid var(--color-borde); border-radius: 0; }
& .pg-etiqueta { letter-spacing: 0.3em; font-size: 11px; color: var(--color-texto-suave); }
& .pg-media { background: var(--color-superficie); border-radius: 0; box-shadow: inset 0 0 0 1px var(--color-borde); }
& .pg-deco .a { position: absolute; top: 14%; right: 12%; width: 56px; height: 56px; border-radius: 50%; background: var(--deco-1); opacity: .85; }
`,
  dopamina: `
& { --deco-1: #FF5FA2; --deco-2: #FFD23F; --deco-3: #3BCEAC; --deco-4: #7B5CFF; }
& .pg-card:nth-child(4n+1) { background: color-mix(in srgb, var(--deco-1) 22%, var(--color-fondo)); }
& .pg-card:nth-child(4n+2) { background: color-mix(in srgb, var(--deco-2) 30%, var(--color-fondo)); }
& .pg-card:nth-child(4n+3) { background: color-mix(in srgb, var(--deco-3) 25%, var(--color-fondo)); }
& .pg-card:nth-child(4n) { background: color-mix(in srgb, var(--deco-4) 20%, var(--color-fondo)); }
& .pg-card { border-radius: 28px; }
& .pg-media { border-radius: 40px; background: radial-gradient(circle at 25% 30%, var(--deco-2) 0 22%, transparent 23%), radial-gradient(circle at 75% 70%, var(--deco-3) 0 26%, transparent 27%), var(--deco-1); }
& .pg-deco .a { position: absolute; top: 8%; right: 6%; width: 90px; height: 90px; border-radius: 50%; background: var(--deco-2); }
& .pg-deco .b { position: absolute; bottom: 10%; left: 4%; width: 70px; height: 70px; border-radius: 22px; background: var(--deco-4); transform: rotate(14deg); }
`,
  lujo: `
& .pg-titulo { font-weight: 400; letter-spacing: 0.01em; }
& .pg-etiqueta { letter-spacing: 0.32em; text-transform: uppercase; font-size: 11px; color: var(--color-acento-texto); }
& .pg-card { background: var(--color-fondo); box-shadow: none; border: 1px solid color-mix(in srgb, var(--color-acento) 35%, transparent); border-radius: 0; }
& .pg-boton { letter-spacing: 0.16em; text-transform: uppercase; font-size: 13px; }
& .pg-media { border-radius: 0; background: linear-gradient(160deg, color-mix(in srgb, var(--color-acento) 30%, var(--color-superficie)), var(--color-superficie) 60%); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-acento) 40%, transparent); }
& .pg-deco { background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-acento) 30%, transparent), transparent) center 72px / 100% 1px no-repeat; }
`,
  cyber: `
& .pg-titulo { text-transform: uppercase; letter-spacing: 0.02em; text-shadow: 0 0 18px color-mix(in srgb, var(--color-acento) 45%, transparent); }
& .pg-etiqueta { font-family: 'JetBrains Mono', ui-monospace, monospace; text-transform: uppercase; letter-spacing: 0.12em; color: var(--color-acento-texto); }
& .pg-card { border-radius: 0; background: var(--color-superficie); border: 1px solid color-mix(in srgb, var(--color-acento) 45%, var(--color-borde)); clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px)); box-shadow: none; }
& .pg-boton { clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px)); border-radius: 0; }
& .pg-media { border-radius: 0; background: repeating-linear-gradient(0deg, color-mix(in srgb, var(--color-acento) 14%, transparent) 0 1px, transparent 1px 4px), linear-gradient(135deg, color-mix(in srgb, var(--color-acento) 30%, var(--color-superficie)), var(--color-superficie)); clip-path: polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 28px 100%, 0 calc(100% - 28px)); }
& .pg-deco { background: repeating-linear-gradient(0deg, rgba(255,255,255,.025) 0 1px, transparent 1px 3px); }
`,
};

/** CSS de un estilo con `&` reemplazado por el selector de raíz dado. */
export const cssDeEstilo = (id: Id, raiz: string) => CSS_ESTILOS[id].trim().replace(/&/g, raiz);
