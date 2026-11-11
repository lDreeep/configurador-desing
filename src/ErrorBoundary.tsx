import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props { children: ReactNode }
interface Estado { error: Error | null }

/** Red de seguridad: si algo se rompe al dibujar, se avisa en vez de dejar la pantalla en blanco. */
export class ErrorBoundary extends Component<Props, Estado> {
  state: Estado = { error: null };

  static getDerivedStateFromError(error: Error): Estado {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <main role="alert" style={{ maxWidth: 480, margin: '15vh auto', padding: 24, font: '16px/1.5 system-ui, sans-serif' }}>
        <h1 style={{ fontSize: 24 }}>Algo salió mal</h1>
        <p>Se rompió esta pantalla. Tu trabajo guardado sigue intacto: recargá la página para seguir.</p>
        <button type="button" onClick={() => location.reload()} style={{ minHeight: 44, padding: '0 20px' }}>
          Recargar
        </button>
      </main>
    );
  }
}
