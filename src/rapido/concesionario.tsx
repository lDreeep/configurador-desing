// Plantilla aprobada: catálogo Tracción. Imágenes ilustrativas generadas con IA.
// Los modelos y la consulta son muestras locales; no se envían datos.
import { useId, useRef, useState, type CSSProperties } from 'react';
import { BotonPrincipal } from '../componentes/BotonPrincipal';
import type { Config } from '../tipos';
import './concesionario.css';

export const MODELOS_CONCESIONARIO = [
  { id: 'utv', nombre: 'UTV', titulo: 'Dos plazas para salir acompañado', descripcion: 'Techo, jaula y espacio para llevar tu equipo.', plazas: '2', traccion: '4 × 4', uso: 'Recreativo', detalle: 'Cabina abierta de dos plazas, volante y neumáticos para terreno irregular.', alt: 'UTV azul de dos plazas con techo y jaula, ilustración generada con IA' },
  { id: 'adventure', nombre: 'Adventure', titulo: 'Una moto para seguir después del asfalto', descripcion: 'Parabrisas alto y una postura pensada para el recorrido.', plazas: '2', traccion: 'Trasera', uso: 'Mixto', detalle: 'Moto de turismo con parabrisas, asiento doble y ruedas para recorridos mixtos.', alt: 'Moto adventure azul con parabrisas alto, ilustración generada con IA' },
  { id: 'enduro', nombre: 'Enduro', titulo: 'Menos carrocería para moverte en tierra', descripcion: 'Asiento angosto, despeje alto y neumáticos con tacos.', plazas: '1', traccion: 'Trasera', uso: 'Tierra', detalle: 'Moto de enduro con guardabarros alto y posición de manejo erguida.', alt: 'Moto enduro azul con neumáticos de tacos, ilustración generada con IA' },
] as const;

function Vehiculo({ indice, principal = false }: { indice: number; principal?: boolean }) {
  return <div className="au-mot-vehiculo">
    <img src="/fotos/traccion-vehiculos.png" width={916} height={1717}
      style={{ '--mot-fila': indice } as CSSProperties}
      alt={MODELOS_CONCESIONARIO[indice].alt} loading={principal ? 'eager' : 'lazy'} decoding="async" />
  </div>;
}

export function Concesionario({ c, marca }: { c: Config; marca?: string }) {
  const [seleccion, setSeleccion] = useState(0);
  const [consulta, setConsulta] = useState(false);
  const [modeloConsulta, setModeloConsulta] = useState('');
  const prefijo = useId();
  const catalogo = useRef<HTMLElement>(null);
  const contacto = useRef<HTMLElement>(null);
  const modelo = MODELOS_CONCESIONARIO[seleccion];
  const m = marca || 'Tracción';
  const ir = (elemento: HTMLElement | null) => elemento?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start',
  });
  const elegir = (indice: number) => { setSeleccion(indice); ir(catalogo.current); };
  return <div className="au au-mot">
    <header className="au-nav au-mot-nav">
      <span className="au-marca">{m}</span>
      <nav aria-label="Secciones de la concesionaria de ejemplo">
        <button type="button" onClick={() => elegir(1)}>Motos</button>
        <button type="button" onClick={() => elegir(0)}>UTV</button>
        <button type="button" onClick={() => ir(contacto.current)}>Pruebas</button>
      </nav>
      <BotonPrincipal config={c} onClick={() => ir(contacto.current)}>Consultar un modelo</BotonPrincipal>
    </header>
    <section className="au-mot-hero">
      <div className="au-mot-intro">
        <h2 className="pg-titulo au-mot-h1">Motos y UTV para elegir tu próximo recorrido.</h2>
        <p className="au-lead">Compará modelos y encontrá el vehículo para tu forma de manejar.</p>
        <BotonPrincipal config={c} onClick={() => ir(catalogo.current)}>Explorar modelos</BotonPrincipal>
      </div>
      <div className="au-mot-portada">
        <span className="au-mot-silueta" aria-hidden="true">UTV</span>
        <Vehiculo indice={0} principal />
      </div>
    </section>
    <section className="au-mot-catalogo" ref={catalogo} aria-label="Catálogo de ejemplo">
      <div className="au-mot-selector" role="group" aria-label="Elegí una categoría">
        {MODELOS_CONCESIONARIO.map((item, i) => <button type="button" key={item.id}
          aria-pressed={seleccion === i} aria-controls={prefijo + '-modelo'} onClick={() => { setSeleccion(i); setConsulta(false); }}>
          {item.nombre}
        </button>)}
      </div>
      <div className="au-mot-modelo" id={prefijo + '-modelo'}>
        <Vehiculo indice={seleccion} />
        <div className="au-mot-ficha">
          <div aria-live="polite" aria-atomic="true">
            <h3 className="au-h2">{modelo.titulo}</h3>
            <p>{modelo.descripcion}</p>
            <dl className="au-mot-datos">
              <div><dt>Plazas</dt><dd>{modelo.plazas}</dd></div>
              <div><dt>Tracción</dt><dd>{modelo.traccion}</dd></div>
              <div><dt>Uso</dt><dd>{modelo.uso}</dd></div>
            </dl>
          </div>
          <details key={modelo.id} className="au-mot-detalle">
            <summary>Ver ficha del modelo</summary>
            <p>{modelo.detalle} Los datos son ilustrativos y no corresponden a un vehículo a la venta.</p>
          </details>
        </div>
      </div>
    </section>
    <section className="au-mot-prueba" ref={contacto} aria-labelledby={prefijo + '-prueba'}>
      <h3 className="au-h2" id={prefijo + '-prueba'}>Tu próxima salida empieza con una prueba.</h3>
      <div>
        <BotonPrincipal config={c} onClick={() => { setModeloConsulta(modelo.nombre); setConsulta(true); }}>Consultar una prueba</BotonPrincipal>
        {consulta && <p className="au-mot-respuesta" role="status">Elegiste {modeloConsulta}. En una web publicada, este botón abriría la consulta con la concesionaria. Esta muestra no envía datos ni reserva una prueba.</p>}
      </div>
    </section>
    <footer className="au-pie">
      <span className="au-pie-marca">{m}</span>
      <button type="button" onClick={() => ir(catalogo.current)}>Ver modelos</button>
      <button type="button" onClick={() => ir(contacto.current)}>Consultar una prueba</button>
      <span className="au-pie-creditos">Plantilla de muestra. Vehículos e imágenes ilustrativos generados con IA; no representan stock ni especificaciones comerciales.</span>
    </footer>
  </div>;
}
