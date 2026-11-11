import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { ErrorBoundary } from './ErrorBoundary';
import { FUENTES_BASE, pedirFuentes } from './fuentes';
import { cargarHojaPagina } from './rapido/hoja';
import './estilos.css';
import './rapido/pagina.css';
import './rapido/demo.css';

// Las fuentes de la interfaz van ya; las del catálogo se piden cuando algo las muestra (fuentes.ts).
pedirFuentes(FUENTES_BASE);

// La hoja de la página (CSS de estilos y fondos) baja aparte; se dibuja cuando llegó, así la
// portada sale entera de una vez y no cambia de aspecto al cargar. Si falla, se dibuja igual.
const dibujar = () =>
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
cargarHojaPagina().then(dibujar, dibujar);
