import { useCallback, useEffect, useState } from 'react';
import { waTo } from '../lib/agenda';
import { formatPrice, img, priceLabel } from '../lib/format';
import { useAdmin } from './Admin';
import { componentes, db, disponible, loadInventario, type EstadoReserva, type Inventario, type Reserva } from './db';
import { Badge, Check, Dialog, ErrorNote, Icon, Toast, type Tone } from './ui';
import { conWhatsApp, diaCorto, errText, msg } from './util';

export const ESTADO_RESERVA: Record<EstadoReserva, [string, Tone]> = {
  nueva: ['Nueva', 'lila'],
  esperando_stock: ['Esperando stock', 'warn'],
  lista: ['Lista para retirar', 'ok'],
  retirada: ['Retirada', 'gray'],
  cancelada: ['Cancelada', 'danger'],
};
const FILTROS: [EstadoReserva | 'todas', string][] = [
  ['todas', 'Todas'],
  ['nueva', 'Nuevas'],
  ['esperando_stock', 'Esperando stock'],
  ['lista', 'Listas para retirar'],
  ['retirada', 'Retiradas'],
];
const PASOS: EstadoReserva[] = ['nueva', 'esperando_stock', 'lista', 'retirada'];

const fecha = (iso: string) => {
  const d = new Date(iso);
  return `${diaCorto(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`)}, ${d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`;
};

/** La reserva se puede entregar si ningún producto que compromete quedó en negativo (ya cuenta sus propias unidades). */
export const completa = (inv: Inventario, r: Reserva) =>
  r.reserva_items.every((i) => !i.producto_id || componentes(inv, i.producto_id).every((c) => disponible(inv, c) >= 0));

export function Reservas() {
  const { refresh } = useAdmin();
  const [rows, setRows] = useState<Reserva[]>([]);
  const [inv, setInv] = useState<Inventario | null>(null);
  const [filtro, setFiltro] = useState<EstadoReserva | 'todas'>('todas');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [r, i] = await Promise.all([db.from('reservas').select('*, reserva_items(*)').order('id', { ascending: false }).limit(300), loadInventario()]);
      if (r.error) throw r.error;
      setRows(r.data as Reserva[]);
      setInv(i);
    } catch {
      setError('No se pudieron cargar las reservas.');
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const changed = (text: string) => {
    setToast(text);
    load();
    refresh();
  };

  const term = q.trim().toLowerCase().replace('#', '');
  const visible = rows.filter((r) => (filtro === 'todas' ? r.estado !== 'cancelada' : r.estado === filtro) && (!term || r.nombre.toLowerCase().includes(term) || String(r.id).includes(term)));
  const count = (e: EstadoReserva | 'todas') => rows.filter((r) => (e === 'todas' ? r.estado !== 'cancelada' : r.estado === e)).length;
  const selected = rows.find((r) => r.id === open);
  const thumb = (id: string | null) => inv?.productos.find((p) => p.id === id)?.img;

  return (
    <div className="adm-page">
      <header className="adm-head">
        <div>
          <p className="adm-eyebrow">Pedidos de la tienda · se retiran en el consultorio</p>
          <h1 className="adm-title">reservas</h1>
        </div>
        <label className="adm-search">
          <Icon name="search" size={18} />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nombre o N°" aria-label="Buscar reserva" />
        </label>
      </header>

      <div className="chips adm-filters" role="group" aria-label="Filtrar por estado">
        {FILTROS.map(([id, label]) => (
          <button type="button" key={id} className="chip chip--s" aria-pressed={filtro === id} onClick={() => setFiltro(id)}>
            {label} <small>{count(id)}</small>
          </button>
        ))}
      </div>

      <ErrorNote text={error} />
      {visible.length === 0 ? (
        <p className="adm-empty">No hay reservas acá.</p>
      ) : (
        <ul className="adm-list">
          {visible.map((r) => {
            const [label, tone] = ESTADO_RESERVA[r.estado];
            return (
              <li key={r.id}>
                <button type="button" className="adm-row adm-row--button" data-off={r.estado === 'retirada'} onClick={() => setOpen(r.id)}>
                  <span className="adm-row__time">#{r.id}</span>
                  <span className="adm-row__who">
                    <strong>{r.nombre}</strong>
                    <small>{fecha(r.creado)}</small>
                  </span>
                  <span className="adm-row__main adm-row__products">
                    <span className="adm-thumbs">
                      {r.reserva_items.slice(0, 3).map((i) => {
                        const src = thumb(i.producto_id);
                        return src ? <img key={i.id} src={img(src)} alt="" /> : null;
                      })}
                    </span>
                    <span className="adm-ellipsis">{r.reserva_items.map((i) => (i.qty > 1 ? `${i.qty} × ${i.nombre}` : i.nombre)).join(', ')}</span>
                  </span>
                  <span className="adm-row__total">{formatPrice(r.total)}</span>
                  <span className="adm-row__pay">
                    {r.pago === 'transferencia' ? 'Transferencia' : 'Efectivo'}
                    <small data-warn={r.pago === 'transferencia' && !r.pago_recibido && r.estado !== 'retirada'}>
                      {r.pago === 'transferencia' ? (r.pago_recibido ? 'recibida' : 'a confirmar') : r.estado === 'retirada' ? 'cobrado' : 'al retirar'}
                    </small>
                  </span>
                  <span className="adm-row__state">
                    <Badge tone={tone} dot>
                      {label}
                    </Badge>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {selected && inv && <Detalle r={selected} inv={inv} onClose={() => setOpen(null)} onChanged={changed} />}
      {toast && <Toast text={toast} onDone={() => setToast(null)} />}
    </div>
  );
}

function Detalle({ r, inv, onClose, onChanged }: { r: Reserva; inv: Inventario; onClose: () => void; onChanged: (t: string) => void }) {
  const [error, setError] = useState<string | null>(null);
  const activa = ['nueva', 'esperando_stock', 'lista'].includes(r.estado);
  const ok = completa(inv, r);
  const paso = PASOS.indexOf(r.estado);

  const update = async (fields: Partial<Reserva>, text: string) => {
    const { error } = await db.from('reservas').update(fields).eq('id', r.id);
    if (error) return setError(errText(error));
    onChanged(text);
  };

  const lista = () =>
    conWhatsApp(
      true,
      async () => {
        const { error } = await db.from('reservas').update({ estado: 'lista' }).eq('id', r.id);
        if (error) throw error;
        onChanged(`La reserva #${r.id} quedó lista para retirar.`);
        return waTo(r.telefono, msg.lista(r));
      },
      setError,
    );

  const retirada = async () => {
    const { error } = await db.rpc('marcar_retirada', { p_id: r.id });
    if (error) return setError(errText(error));
    onClose();
    onChanged(`Reserva #${r.id} entregada. Se descontó del stock.`);
  };

  const cancelar = () => {
    if (window.confirm(`¿Cancelar la reserva #${r.id} de ${r.nombre}? Los productos vuelven a quedar libres.`)) {
      onClose();
      update({ estado: 'cancelada' }, `Reserva #${r.id} cancelada.`);
    }
  };

  return (
    <Dialog
      title={`Reserva #${r.id}`}
      sub={`${r.nombre} · ${fecha(r.creado)}`}
      onClose={onClose}
      footer={
        <>
          {activa && (
            <button type="button" className="btn btn--ghost adm-push" onClick={cancelar}>
              Cancelar reserva
            </button>
          )}
          <a className="btn btn--secondary" href={waTo(r.telefono, msg.hola(r.nombre, `tu pedido #${r.id}`))} target="_blank" rel="noreferrer">
            <Icon name="wa" size={18} /> WhatsApp
          </a>
          {r.estado === 'lista' ? (
            <button type="button" className="btn btn--primary" onClick={retirada}>
              Marcar retirada
            </button>
          ) : (
            activa && (
              <button type="button" className="btn btn--primary" onClick={lista} disabled={!ok}>
                Lista para retirar
              </button>
            )
          )}
        </>
      }
    >
      {r.estado !== 'cancelada' && (
        <ol className="adm-steps" aria-label="Estado del pedido">
          {PASOS.map((p, i) => (
            <li key={p} data-state={i < paso ? 'done' : i === paso ? 'on' : ''}>
              {i < paso && <Icon name="check" size={14} />}
              {ESTADO_RESERVA[p][0]}
            </li>
          ))}
        </ol>
      )}

      <ul className="adm-items">
        {r.reserva_items.map((i) => {
          const p = inv.productos.find((x) => x.id === i.producto_id);
          const libre = i.producto_id ? Math.min(...componentes(inv, i.producto_id).map((c) => disponible(inv, c))) : 0;
          return (
            <li key={i.id}>
              {p ? <img src={img(p.img)} alt="" /> : <span className="adm-items__ph" />}
              <span>
                <strong>{i.nombre}</strong>
                {!i.producto_id ? (
                  <small>Ya no está en el catálogo</small>
                ) : activa && libre < 0 ? (
                  <Badge tone="warn">Falta stock</Badge>
                ) : (
                  <small>
                    {activa ? 'Disponible' : ''} · {i.qty} u.
                  </small>
                )}
              </span>
              <b>{i.precio === null ? priceLabel(null) : formatPrice(i.precio * i.qty)}</b>
            </li>
          );
        })}
        <li className="adm-items__total">
          <span>Total · retiro sin costo</span>
          <b>{formatPrice(r.total)}</b>
        </li>
      </ul>

      <div className="adm-cards2">
        <div className="adm-card">
          <strong>Contacto</strong>
          <span>{r.telefono}</span>
          {r.email && <small>{r.email}</small>}
        </div>
        <div className="adm-card">
          <strong>Pago</strong>
          <span>{r.pago === 'transferencia' ? 'Transferencia' : 'Efectivo al retirar'}</span>
          {r.pago === 'transferencia' && <small data-warn={!r.pago_recibido}>{r.pago_recibido ? 'Recibida' : 'Todavía no la recibiste'}</small>}
        </div>
      </div>

      {r.comentario && (
        <blockquote className="adm-callout adm-callout--quote">
          <strong>Comentario de la paciente</strong>“{r.comentario}”
        </blockquote>
      )}

      {r.pago === 'transferencia' && r.estado !== 'cancelada' && (
        <Check checked={r.pago_recibido} onChange={(v) => update({ pago_recibido: v }, v ? 'Transferencia marcada como recibida.' : 'Transferencia marcada como pendiente.')} label="Recibí la transferencia" />
      )}

      {activa && !ok && (
        <p className="adm-callout adm-callout--warn">
          <Icon name="alert" size={18} /> Falta stock de algún producto. Cuando cargues el ingreso en Stock, la podés pasar a “Lista para retirar”.
        </p>
      )}
      <ErrorNote text={error} />
    </Dialog>
  );
}
