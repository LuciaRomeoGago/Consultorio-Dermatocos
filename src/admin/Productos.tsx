import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { img, priceLabel } from '../lib/format';
import { useAdmin } from './Admin';
import { db, disponible, loadInventario, type Inventario, type Producto } from './db';
import { Badge, Check, Dialog, ErrorNote, Icon, Toast } from './ui';
import { errText } from './util';

type Filtro = 'todo' | 'productos' | 'rutinas';

export function Productos() {
  const { refresh } = useAdmin();
  const [inv, setInv] = useState<Inventario | null>(null);
  const [filtro, setFiltro] = useState<Filtro>('todo');
  const [q, setQ] = useState('');
  const [borrar, setBorrar] = useState<Producto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(() => loadInventario().then(setInv, () => setError('No se pudieron cargar los productos.')), []);
  useEffect(() => {
    load();
  }, [load]);

  if (!inv) return <div className="adm-page"><ErrorNote text={error} /></div>;

  const term = q.trim().toLowerCase();
  const list = inv.productos.filter((p) => (filtro === 'todo' || (filtro === 'rutinas') === p.es_rutina) && (!term || p.name.toLowerCase().includes(term)));
  const n = (f: Filtro) => inv.productos.filter((p) => f === 'todo' || (f === 'rutinas') === p.es_rutina).length;

  return (
    <div className="adm-page">
      <header className="adm-head">
        <div>
          <p className="adm-eyebrow">Lo que se ve en la tienda</p>
          <h1 className="adm-title">productos</h1>
        </div>
        <div className="adm-head__actions">
          <label className="adm-search">
            <Icon name="search" size={18} />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar producto" aria-label="Buscar producto" />
          </label>
          <Link to="rutina" className="btn btn--secondary adm-hide-m">
            <Icon name="plus" size={18} /> Nueva rutina
          </Link>
          <Link to="nuevo" className="btn btn--primary adm-btn-add">
            <Icon name="plus" size={18} />
            <span>Nuevo producto</span>
          </Link>
        </div>
      </header>

      <div className="chips adm-filters" role="group" aria-label="Filtrar">
        {(['todo', 'productos', 'rutinas'] as Filtro[]).map((f) => (
          <button type="button" key={f} className="chip chip--s" aria-pressed={filtro === f} onClick={() => setFiltro(f)}>
            {f[0].toUpperCase() + f.slice(1)} <small>{n(f)}</small>
          </button>
        ))}
      </div>

      <div className="adm-grid">
        {list.map((p) => {
          const libre = disponible(inv, p.id);
          const min = inv.stock.find((s) => s.id === p.id)?.stock_min ?? 0;
          return (
            <article key={p.id} className="adm-prod" data-hidden={!p.visible}>
              <Link to={p.id} className="adm-prod__photo" aria-label={`Editar ${p.name}`}>
                <img src={img(p.img)} alt="" data-full={p.es_rutina} />
                {p.hover_img && <img className="adm-prod__est" src={img(p.hover_img)} alt="" />}
                <span className="adm-prod__word">{p.word}</span>
              </Link>
              <p className="adm-prod__row">
                <strong>{p.name}</strong>
                <span>{priceLabel(p.price)}</span>
              </p>
              <p className="adm-prod__cat">{p.es_rutina ? `Rutina · ${inv.rutinas.filter((r) => r.rutina_id === p.id).length} productos` : p.category}</p>
              <div className="adm-prod__foot">
                {!p.visible ? (
                  <Badge>Oculto</Badge>
                ) : p.es_rutina ? (
                  <Badge tone="lila">Alcanza para {Math.max(libre, 0)}</Badge>
                ) : libre <= 0 ? (
                  <Badge tone="danger" dot>
                    Sin stock
                  </Badge>
                ) : libre <= min ? (
                  <Badge tone="warn" dot>
                    Poco stock · {libre}
                  </Badge>
                ) : (
                  <Badge>{libre} en stock</Badge>
                )}
                <Link to={p.id} className="adm-icon-btn adm-icon-btn--white" aria-label={`Editar ${p.name}`}>
                  <Icon name="edit" size={16} />
                </Link>
                <button type="button" className="adm-icon-btn adm-icon-btn--white" onClick={() => setBorrar(p)} aria-label={`Eliminar ${p.name}`}>
                  <Icon name="trash" size={16} />
                </button>
              </div>
            </article>
          );
        })}
      </div>
      <Link to="rutina" className="btn btn--secondary btn--full adm-only-m">
        <Icon name="plus" size={18} /> Nueva rutina
      </Link>

      {borrar && (
        <Eliminar
          p={borrar}
          inv={inv}
          onClose={() => setBorrar(null)}
          onDone={(t) => {
            setBorrar(null);
            setToast(t);
            load();
            refresh();
          }}
        />
      )}
      {toast && <Toast text={toast} onDone={() => setToast(null)} />}
    </div>
  );
}

/** Ruta del archivo en el bucket "productos", si la foto se subió desde el panel. */
export const storagePath = (url: string | null) => url?.split('/object/public/productos/')[1] ?? null;

export function Eliminar({ p, inv, onClose, onDone }: { p: Producto; inv: Inventario; onClose: () => void; onDone: (t: string) => void }) {
  const [reservas, setReservas] = useState<{ reserva_id: number; reservas: { nombre: string } }[] | null>(null);
  const [ocultar, setOcultar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const enRutinas = inv.rutinas.filter((r) => r.producto_id === p.id).map((r) => inv.productos.find((x) => x.id === r.rutina_id)?.name);

  useEffect(() => {
    db.from('reserva_items')
      .select('reserva_id, reservas!inner(nombre, estado)')
      .eq('producto_id', p.id)
      .in('reservas.estado', ['nueva', 'esperando_stock', 'lista'])
      .then(({ data }) => setReservas((data ?? []) as unknown as { reserva_id: number; reservas: { nombre: string } }[]));
  }, [p.id]);

  const save = async () => {
    if (ocultar) {
      const { error } = await db.from('productos').update({ visible: false }).eq('id', p.id);
      if (error) return setError(errText(error));
      return onDone(`${p.name} ya no se ve en la tienda.`);
    }
    const { error } = await db.from('productos').delete().eq('id', p.id);
    if (error) return setError(errText(error));
    const files = [storagePath(p.img), storagePath(p.hover_img)].filter((x): x is string => !!x);
    if (files.length) await db.storage.from('productos').remove(files); // si falla, quedan fotos sueltas en el bucket; no rompe nada
    onDone(`${p.name} eliminado.`);
  };

  return (
    <Dialog
      kind="modal"
      title={`¿Eliminar ${p.name}?`}
      sub={`Se borra de la tienda junto con ${p.es_rutina ? 'su foto' : 'sus dos fotos'}. No se puede deshacer.`}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Volver
          </button>
          <button type="button" className={`btn ${ocultar ? 'btn--primary' : 'btn--danger'}`} onClick={save} disabled={reservas === null}>
            {ocultar ? 'Ocultar producto' : 'Eliminar producto'}
          </button>
        </>
      }
    >
      {(reservas?.length || enRutinas.length) ? (
        <div className="adm-callout adm-callout--warn">
          <Icon name="alert" size={18} />
          <div>
            {!!reservas?.length && (
              <p>
                <strong>Está en {reservas.length === 1 ? '1 reserva activa' : `${reservas.length} reservas activas`}</strong>:{' '}
                {reservas.map((r) => `#${r.reserva_id} · ${r.reservas.nombre}`).join(', ')}. La reserva se mantiene; avisale si no vas a tenerlo.
              </p>
            )}
            {enRutinas.length > 0 && <p>Forma parte de: {enRutinas.join(', ')}. Si lo eliminás, sale de esa rutina.</p>}
          </div>
        </div>
      ) : null}
      <fieldset className="adm-field">
        <Check radio name="borrar" checked={!ocultar} onChange={() => setOcultar(false)} label="Eliminar definitivamente" sub="Desaparece del panel y de la tienda." />
        <Check radio name="borrar" checked={ocultar} onChange={() => setOcultar(true)} label="Solo ocultarlo de la tienda" sub="Queda guardado acá y lo podés volver a mostrar." />
      </fieldset>
      <ErrorNote text={error} />
    </Dialog>
  );
}
