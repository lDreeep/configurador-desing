import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { FUENTES_BASE, pedirFuentes } from './fuentes';
import './estilos.css';
import './rapido/pagina.css';
import './rapido/demo.css';

// Las fuentes de la interfaz van ya; las del catálogo se piden cuando algo las muestra (fuentes.ts).
pedirFuentes(FUENTES_BASE);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
