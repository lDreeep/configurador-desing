import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { ErrorBoundary } from './ErrorBoundary';
import { urlGoogleFonts } from './catalogo';
import './estilos.css';
import './rapido/pagina.css';
import './rapido/autor.css';
import './rapido/autor3.css';

// Carga todas las fuentes del catálogo para que cada opción se vea con su forma real.
const fuentes = document.createElement('link');
fuentes.rel = 'stylesheet';
fuentes.href = urlGoogleFonts();
document.head.appendChild(fuentes);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
