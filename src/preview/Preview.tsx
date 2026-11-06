import { useMemo, useState, type CSSProperties } from 'react';
import { sistemaDeDiseno } from '../export/sistema';
import type { Config } from '../tipos';
import { IconoFlecha } from '../pasos/visual';

const humanizar = (s: string) => {
  const t = s.replace(/_/g, ' ');
  return t.charAt(0).toUpperCase() + t.slice(1);
};

/** Vista previa en vivo. Usa los mismos tokens que el export. */
export function Preview({ config }: { config: Config }) {
  const s = useMemo(() => sistemaDeDiseno(config), [config]);
  const [dispositivo, setDispositivo] = useState<'escritorio' | 'celular'>('escritorio');
  const [activa, setActiva] = useState(0);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [repeticion, setRepeticion] = useState(0);

  const pantallas = config.estructura.pantallas;
  const indice = Math.min(activa, Math.max(0, pantallas.length - 1));
  const pantalla = pantallas[indice];
  const patron = dispositivo === 'celular' ? config.estructura.patronMovil : config.estructura.patron;
  const marca = config.proyecto.nombre.trim() || 'Tu proyecto';
  const items = pantallas.slice(0, dispositivo === 'celular' && patron === 'pestanas_abajo' ? 5 : 6);

  const irA = (i: number) => {
    setActiva(i);
    setMenuAbierto(false);
  };

  const navItems = (
    <>
      {items.map((p, i) => (
        <button
          key={p.id}
          type="button"
          className="pv-nav-item"
          aria-current={i === indice ? 'page' : undefined}
          onClick={() => irA(i)}
        >
          {p.nombre}
        </button>
      ))}
    </>
  );

  const nav = (() => {
    switch (patron) {
      case 'barra_superior':
        return (
          <nav className="pv-nav pv-nav-superior" aria-label="Navegación de la vista previa">
            <span className="pv-marca">{marca}</span>
            <div className="pv-nav-items">{navItems}</div>
          </nav>
        );
      case 'menu_lateral':
        return (
          <nav className="pv-nav pv-nav-lateral" aria-label="Navegación de la vista previa">
            <span className="pv-marca">{marca}</span>
            {navItems}
          </nav>
        );
      case 'pestanas_abajo':
        return (
          <nav className="pv-nav pv-nav-pestanas" aria-label="Navegación de la vista previa">
            {navItems}
          </nav>
        );
      case 'hamburguesa':
        return (
          <nav className="pv-nav pv-nav-superior" aria-label="Navegación de la vista previa">
            <span className="pv-marca">{marca}</span>
            <button
              type="button"
              className="pv-hamburguesa"
              aria-expanded={menuAbierto}
              aria-label="Abrir menú"
              onClick={() => setMenuAbierto(!menuAbierto)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            {menuAbierto && <div className="pv-menu-desplegable">{navItems}</div>}
          </nav>
        );
      case 'sin_navegacion':
        return (
          <header className="pv-nav pv-nav-superior">
            <span className="pv-marca">{marca}</span>
          </header>
        );
    }
  })();

  const estilo = { ...s.tokens } as CSSProperties;
  const layout = patron === 'menu_lateral' ? 'pv-fila' : patron === 'pestanas_abajo' ? 'pv-col-inversa' : 'pv-col';

  return (
    <section className="preview" aria-label="Vista previa en vivo">
      <div className="preview-barra">
        <span className="preview-titulo">Vista previa en vivo</span>
        <button type="button" className="boton fantasma chico" onClick={() => setRepeticion((n) => n + 1)}>
          Repetir animación
        </button>
        <div className="segmentado" role="group" aria-label="Dispositivo">
          {(['escritorio', 'celular'] as const).map((d) => (
            <button key={d} type="button" aria-pressed={dispositivo === d} onClick={() => setDispositivo(d)}>
              {d === 'escritorio' ? 'Computadora' : 'Celular'}
            </button>
          ))}
        </div>
      </div>
      <div className={`pv-marco pv-${dispositivo}`}>
        <div
          className={`pv ${layout} pv-hover-${config.visual.hover} pv-presionar-${config.visual.presionar} pv-cambio-${config.visual.cambio} pv-aparicion-${config.visual.aparicion}`}
          style={estilo}
        >
          {nav}
          <main className="pv-contenido" key={`${pantalla?.id ?? 'vacia'}-${config.visual.movimiento}-${config.visual.cambio}-${config.visual.aparicion}-${repeticion}`}>
            {pantalla ? (
              <>
                <div className="pv-encabezado">
                  <h3 className="pv-h1">{pantalla.nombre}</h3>
                  {pantalla.proposito && <p className="pv-suave">{pantalla.proposito}</p>}
                </div>
                <div className="pv-bloques">
                  {pantalla.secciones.slice(0, 5).map((sec, i) => (
                    <div key={sec + i} className="pv-bloque" style={{ animationDelay: `${i * 60}ms` }}>
                      <span className="pv-etiqueta">Bloque {i + 1}</span>
                      <span className="pv-bloque-titulo">{humanizar(sec)}</span>
                    </div>
                  ))}
                </div>
                <div className="pv-botones">
                  {pantalla.accionPrincipal && (
                    <button type="button" className={`pv-boton pv-primario est-${config.botones.estilo}`}>
                      {config.botones.icono === 'izquierda' && <IconoFlecha />}
                      {pantalla.accionPrincipal}
                      {config.botones.icono === 'derecha' && <IconoFlecha />}
                    </button>
                  )}
                  <button type="button" className={`pv-boton pv-secundario est-${config.botones.estilo}`}>
                    Ver más
                  </button>
                </div>
              </>
            ) : (
              <p className="pv-suave">Agregá una pantalla para ver la vista previa.</p>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}
