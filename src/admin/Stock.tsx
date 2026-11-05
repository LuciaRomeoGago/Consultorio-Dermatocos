import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { waTo } from '../lib/agenda';
import { img } from '../lib/format';
import { dayKey } from '../lib/schedule';
import { useAdmin } from './Admin';
import { componentes, db, disponible, loadInventario, type Inventario, type Reserva, type StockRow } from './db';
import { Badge, Dialog, ErrorNote, Icon, Toast } from './ui';
import { diaCorto, errText, msg } from './util';

type Filtro = 'todos' | 'reponer' | 'sin';
const estado = (s: StockRow) => (s.disponible <= 0 ? 0 : s.disponible <= s.stock_min ? 1 : 2);
const ESTADO = [
  ['Sin stock', 'danger'],
  ['Poco stock', 'warn'],
  ['Bien', 'ok'],
] as const;

export function Stock() {
  const { refresh } = useAdmin();
  const [inv, setInv] = useState<Inventario | null>(null);
  const [esperando, setEsperando] = useState<Reserva[]>([]);
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<StockRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [i, r] = await Promise.all([loadInventario(), db.from('reservas').select('*, reserva_items(*)').eq('estado', 'esperando_stock')]);
      if (r.error) throw r.error;
      setInv(i);
      setEsperando(r.data as Reserva[]);
    } catch {
      setError('No se pudo cargar el stock.');
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  if (!inv) return <div className="adm-page"><ErrorNote text={error} /></div>;

  const rows = [...inv.stock].sort((a, b) => estado(a) - estado(b) || a.name.localeCompare(b.name));
  const reponer = rows.filter((s) => estado(s) < 2);
  const sin = rows.filter((s) => estado(s) === 0);
  const term = q.trim().toLowerCase();
  const list = (filtro === 'reponer' ? reponer : filtro === 'sin' ? sin : rows).filter((s) => !term || s.name.toLowerCase().includes(term));
  const conReserva = sin.filter((s) => esperando.some((r) => r.reserva_items.some((i) => i.producto_id && componentes(inv, i.producto_id).includes(s.id))));

  return (
    <div className="adm-page">
      <header className="adm-head">
        <div>
          <p className="adm-eyebrow">Productos sueltos · las rutinas se calculan con sus productos</p>
          <h1 className="adm-title">stock</h1>
        </div>
        <label className="adm-search">
          <Icon name="search" size={18} />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar producto" aria-label="Buscar producto" />
        </label>
      </header>

      {reponer.length > 0 && (
        <p className="adm-callout adm-callout--warn adm-banner">
          <Icon name="alert" size={20} />
          <span>
            {reponer.length === 1 ? '1 producto para reponer.' : `${reponer.length} productos para reponer.`}
            {conReserva.length > 0 && ` ${conReserva.map((s) => s.name).join(', ')} no tiene stock y hay reservas esperando.`}
          </span>
          {filtro !== 'reponer' && (
            <button type="button" className="btn btn--link" onClick={() => setFiltro('reponer')}>
              Ver solo esos
            </button>
          )}
        </p>
      )}

      <div className="chips adm-filters" role="group" aria-label="Filtrar">
        {(
          [
            ['todos', 'Todos', rows.length],
            ['reponer', 'Para reponer', reponer.length],
            ['sin', 'Sin stock', sin.length],
          ] as const
        ).map(([id, label, n]) => (
          <button type="button" key={id} className="chip chip--s" aria-pressed={filtro === id} onClick={() => setFiltro(id)}>
            {label} <small>{n}</small>
          </button>
        ))}
      </div>

      <ul className="adm-list adm-stock">
        <li className="adm-row adm-row--head" aria-hidden="true">
          <span className="adm-row__who">Producto</span>
          <span>En stock</span>
          <span>Reservado</span>
          <span>Mínimo</span>
          <span>Estado</span>
          <span>Último ingreso</span>
          <span />
        </li>
        {list.map((s) => {
          const e = estado(s);
          return (
            <li key={s.id} className="adm-row">
              <span className="adm-row__who adm-row__prod">
                <img src={img(s.img)} alt="" />
                <span>
                  <strong>{s.name}</strong>
                  <small>{s.category}</small>
                </span>
              </span>
              <span className="adm-stock__n" data-tone={ESTADO[e][1]}>
                {s.stock}
              </span>
              <span>{s.reservado ? `${s.reservado} u.` : '—'}</span>
              <span>{s.stock_min}</span>
              <span>
                <Badge tone={ESTADO[e][1]} dot>
                  {ESTADO[e][0]}
                  <span className="adm-only-m"> · {s.disponible}</span>
                </Badge>
              </span>
              <span className="adm-hide-m">{s.ultimo_ingreso ? diaCorto(s.ultimo_ingreso) : '—'}</span>
              <span className="adm-row__actions">
                <button type="button" className={`btn btn--s ${e < 2 ? 'btn--soft' : 'btn--ghost'}`} onClick={() => setOpen(s)} aria-label={`Restockear ${s.name}`}>
                  <Icon name="plus" size={16} />
                  <span className="adm-hide-m">Restockear</span>
                </button>
              </span>
            </li>
          );
        })}
      </ul>

      {open && (
        <Restock
          s={open}
          inv={inv}
          esperando={esperando}
          onClose={() => setOpen(null)}
          onDone={(t) => {
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

function Restock({ s, inv, esperando, onClose, onDone }: { s: StockRow; inv: Inventario; esperando: Reserva[]; onClose: () => void; onDone: (t: string) => void }) {
  const [unidades, setUnidades] = useState(6);
  const [fecha, setFecha] = useState(dayKey(new Date()));
  const [nota, setNota] = useState('');
  const [marcar, setMarcar] = useState<number[] | null>(null);
  const [listas, setListas] = useState<Reserva[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Reservas que esperan este producto, y si con el ingreso quedan completas.
  const afectadas = esperando
    .filter((r) => r.reserva_items.some((i) => i.producto_id && componentes(inv, i.producto_id).includes(s.id)))
    .map((r) => ({
      r,
      completa: r.reserva_items.every((i) => !i.producto_id || componentes(inv, i.producto_id).every((c) => disponible(inv, c, { [s.id]: unidades }) >= 0)),
    }));
  const elegidas = marcar ?? afectadas.filter((a) => a.completa).map((a) => a.r.id);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!Number.isInteger(unidades) || unidades < 1) return setError('Poné cuántas unidades entraron.');
    setSaving(true);
    const { error } = await db.rpc('registrar_ingreso', { p_producto: s.id, p_unidades: unidades, p_fecha: fecha, p_nota: nota });
    if (error) {
      setSaving(false);
      return setError(errText(error));
    }
    if (elegidas.length) {
      const up = await db.from('reservas').update({ estado: 'lista' }).in('id', elegidas);
      if (up.error) setError('Se cargó el stock, pero no se pudieron actualizar las reservas.');
    }
    setSaving(false);
    onDone(`Entraron ${unidades} ${s.name}.${elegidas.length ? ` ${elegidas.length === 1 ? 'Una reserva quedó lista' : `${elegidas.length} reservas quedaron listas`} para retirar.` : ''}`);
    const done = afectadas.filter((a) => elegidas.includes(a.r.id)).map((a) => a.r);
    if (done.length) setListas(done);
    else onClose();
  };

  if (listas) {
    return (
      <Dialog title="Avisales que ya pueden retirar" sub="Cada botón abre WhatsApp con el mensaje listo." onClose={onClose} footer={<button type="button" className="btn btn--primary" onClick={onClose}>Listo</button>}>
        <ul className="adm-items">
          {listas.map((r) => (
            <li key={r.id}>
              <span>
                <strong>
                  #{r.id} · {r.nombre}
                </strong>
                <small>{r.reserva_items.length} productos</small>
              </span>
              <a className="btn btn--secondary btn--s" href={waTo(r.telefono, msg.lista(r))} target="_blank" rel="noreferrer">
                <Icon name="wa" size={16} /> Avisar
              </a>
            </li>
          ))}
        </ul>
      </Dialog>
    );
  }

  return (
    <Dialog
      title="Restockear"
      sub="Cargá lo que llegó. El stock y las reservas se actualizan solos."
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" form="restock" className="btn btn--primary" disabled={saving}>
            Registrar ingreso
          </button>
        </>
      }
    >
      <form id="restock" className="adm-form" onSubmit={onSubmit} noValidate>
        <div className="adm-card adm-card--row">
          <img src={img(s.img)} alt="" />
          <span>
            <strong>{s.name}</strong>
            <small>
              {s.stock} en stock{s.reservado ? ` · ${s.reservado} reservado` : ''}
            </small>
          </span>
        </div>
        <div className="adm-cols">
          <label className="field">
            <span className="adm-label">Unidades que entran</span>
            <input type="number" min={1} value={unidades} onChange={(e) => setUnidades(Number(e.target.value))} autoFocus />
          </label>
          <label className="field">
            <span className="adm-label">Fecha</span>
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </label>
        </div>
        <label className="field">
          <span className="adm-label">Nota (opcional)</span>
          <input value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Ej.: pedido a Mira Dror, lote 2611" maxLength={300} />
        </label>
        <dl className="adm-summary">
          <div>
            <dt>Stock</dt>
            <dd>
              {s.stock} → {s.stock + (unidades || 0)}
            </dd>
          </div>
          <div>
            <dt>Reservado</dt>
            <dd>{s.reservado} u.</dd>
          </div>
          <div>
            <dt>Para vender</dt>
            <dd>{Math.max(0, s.disponible + (unidades || 0))}</dd>
          </div>
        </dl>
        {afectadas.length > 0 && (
          <fieldset className="adm-field">
            <legend>Reservas esperando este producto</legend>
            {afectadas.map(({ r, completa }) => (
              <label key={r.id} className="adm-check adm-check--card">
                <input
                  type="checkbox"
                  checked={elegidas.includes(r.id)}
                  disabled={!completa}
                  onChange={(e) => setMarcar(e.target.checked ? [...elegidas, r.id] : elegidas.filter((x) => x !== r.id))}
                />
                <span>
                  #{r.id} · {r.nombre}
                  <small>{completa ? 'Pasa a “Lista para retirar”. Después te dejo el botón para avisarle.' : 'Todavía le falta otro producto.'}</small>
                </span>
              </label>
            ))}
          </fieldset>
        )}
        <ErrorNote text={error} />
      </form>
    </Dialog>
  );
}
