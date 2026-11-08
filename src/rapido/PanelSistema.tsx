import { PasoSistema } from '../pasos/PasoSistema';
import { usePaso } from './BarraPasos';
import type { PropsPaso } from '../pasos/pasos';
export function PanelSistema(props: PropsPaso & { onAtras: () => void; onSeguir: () => void }) {
  return <div className="panel-sistema"><p className="sistema-paso">{usePaso()}</p><PasoSistema config={props.config} setConfig={props.setConfig} /><footer className="sistema-pie"><button type="button" onClick={props.onAtras}>‹ Volver a las cajas</button><button className="sistema-seguir" type="button" onClick={props.onSeguir}>Seguir con mi sistema ›</button></footer></div>;
}
