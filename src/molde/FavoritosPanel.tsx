import { useEffect, useRef, useState } from 'react';
import type { Config } from '../tipos';
import type { ClaveRonda } from '../rondas';
import { Pagina } from '../rapido/Pagina';
import { borrarFavorito, guardarFavorito, leerFavoritos, type Favorito } from './favoritos';
import './favoritos.css';

interface Props {
  config: Config;
  elegidas: ReadonlySet<ClaveRonda>;
  abrir: (f: Favorito) => void;
  cerrar: () => void;
}

export default function Favoritos({ config, elegidas, abrir, cerrar }: Props) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [lista, setLista] = useState<Favorito[]>([]);
  const [nombre, setNombre] = useState('');
  const [aviso, setAviso] = useState('');
  const [ids, seleccionar] = useState<string[]>([]);
  useEffect(() => {
    dialogo.current?.showModal();
    function actualizar() {
      try { setLista(leerFavoritos()); }
      catch { setAviso('No se pudieron leer los favoritos de este navegador.'); }
    }
    actualizar();
    window.addEventListener('storage', actualizar);
    return () => window.removeEventListener('storage', actualizar);
  }, []);
  const seleccion = lista.filter(f => ids.includes(f.id));
  function cambiar(accion: () => Favorito[], mensaje: string) {
    try {
      setLista(accion());
      setAviso(mensaje);
      return true;
    } catch {
      setAviso('No se pudo guardar el cambio. Revisá el espacio disponible y el límite de diez favoritos.');
      return false;
    }
  }
  return <dialog ref={dialogo} className="favoritos" aria-labelledby="favoritos-titulo" onClose={cerrar}>
    <header><h2 id="favoritos-titulo">Favoritos</h2><button onClick={() => dialogo.current?.close()}>Cerrar</button></header>
    <form onSubmit={e => {
      e.preventDefault();
      if (cambiar(() => guardarFavorito(nombre, config, elegidas), 'Favorito guardado.')) setNombre('');
    }}>
      <label>Nombre del diseño <input value={nombre} onChange={e => setNombre(e.target.value)} maxLength={80} /></label>
      <button disabled={!nombre.trim() || lista.length >= 10}>Guardar</button>
    </form>
    <p>{lista.length} de 10 favoritos</p>
    <div role="status">{aviso}</div>
    {lista.length > 0 && <fieldset><legend>Elegí dos diseños para comparar</legend>
      {lista.map(f => <div className="favorito-fila" key={f.id}>
        <label><input type="checkbox" checked={ids.includes(f.id)} disabled={seleccion.length >= 2 && !ids.includes(f.id)}
          onChange={e => seleccionar(e.target.checked ? [...seleccion.map(s => s.id), f.id] : ids.filter(id => id !== f.id))} /> {f.nombre}</label>
        <button aria-label={'Abrir ' + f.nombre} onClick={() => abrir(f)}>Abrir</button>
        <button aria-label={'Borrar ' + f.nombre} onClick={() => cambiar(() => borrarFavorito(f.id), 'Favorito borrado.')}>Borrar</button>
      </div>)}
    </fieldset>}
    {seleccion.length === 2 && <div className="favoritos-comparacion">
      {seleccion.map(f => <section key={f.id} aria-label={f.nombre}><h3>{f.nombre}</h3><div {...{ inert: '' }}><Pagina config={f.config} /></div></section>)}
    </div>}
  </dialog>;
}
