import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { bookingPage } from '../data/content';
import { site } from '../data/site';
import { findTreatment } from '../data/treatments';
import type { Treatment } from '../data/types';
import { freeSlots, gaps, toMin, vencido, venceA, waTo, type Ocupado } from '../lib/agenda';
import { formatPrice, parseMeta } from '../lib/format';
import { dayKey, DEFAULT_MINUTES, timeSlots } from '../lib/schedule';
import { useAdmin } from './Admin';
import { db, type Turno } from './db';
import { Badge, Check, Dialog, ErrorNote, Icon, Toast, type Tone } from './ui';
import { addDays, conWhatsApp, devuelveSena, diaLargo, msg, parseDia, senaDeTurno } from './util';

const options = bookingPage.order.map(findTreatment).filter((t): t is Treatment => !!t);
const minutesOf = (t: Treatment) => parseMeta(t.meta)?.minutes ?? DEFAULT_MINUTES;
const { open, close, days: workDays } = site.schedule;
const isWorkDay = (d: Date) => workDays.includes(d.getDay());
const monday = (d: Date) => addDays(d, -((d.getDay() + 6) % 7));
const weekday = new Intl.DateTimeFormat('es-AR', { weekday: 'short' });

const hhmm = (d: Date) => d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
/** Ocupa el horario: ni cancelado ni con la seña vencida. */
const ocupa = (t: Turno) => t.estado !== 'cancelado' && !vencido(t);
const esperaSena = (t: Turno) => t.origen === 'web' && t.estado === 'por_confirmar' && !t.sena_recibida;

const ESTADO: Record<Turno['estado'], [string, Tone]> = {
  por_confirmar: ['Por confirmar', 'warn'],
  confirmado: ['Confirmado', 'ok'],
  cancelado: ['Cancelado', 'danger'],
};

/** Próximos días de atención desde hoy, para elegir dónde dar o mover un turno. */
const nextDays = (count: number) => {
  const out: Date[] = [];
  for (let d = new Date(); out.length < count; d = addDays(d, 1)) if (isWorkDay(d)) out.push(d);
  return out;
};

type Open = { kind: 'nuevo'; dia?: string; hora?: string } | { kind: 'reprogramar'; turno: Turno } | { kind: 'cancelar'; turno: Turno };

export function Agenda() {
  const { refresh } = useAdmin();
  const [day, setDay] = useState(() => new Date());
  const [week, setWeek] = useState<Turno[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dialog, setDialog] = useState<Open | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const mon = monday(day);
  const monKey = dayKey(mon);
  const load = useCallback(async () => {
    const { data, error } = await db.from('turnos').select('*').gte('dia', monKey).lte('dia', dayKey(addDays(parseDia(monKey), 4))).order('hora');
    if (error) setError('No se pudo cargar la agenda.');
    else setWeek(data as Turno[]);
  }, [monKey]);
  useEffect(() => {
    load();
    // Cada minuto: entran los turnos nuevos de la web y se liberan las señas vencidas.
    const timer = setInterval(load, 60_000);
    return () => clearInterval(timer);
  }, [load]);

  const done = (text: string) => {
    setDialog(null);
    setToast(text);
    load();
    refresh();
  };

  const key = dayKey(day);
  const dayTurnos = week.filter((t) => t.dia === key);
  const activos = dayTurnos.filter(ocupa);
  const libres = (d: Date) => (isWorkDay(d) ? freeSlots(timeSlots(60), 60, week.filter((t) => t.dia === dayKey(d) && ocupa(t))).length : 0);
  const rows = [
    ...dayTurnos.map((t) => ({ hora: t.hora, turno: t })),
    ...(isWorkDay(day) ? gaps(activos, open, close) : []).map((g) => ({ hora: g.desde, gap: g })),
  ].sort((a, b) => toMin(a.hora) - toMin(b.hora));

  const confirmar = (t: Turno) =>
    conWhatsApp(
      true,
      async () => {
        const sena = esperaSena(t) ? senaDeTurno(t) : null;
        const { error } = await db.from('turnos').update({ estado: 'confirmado', sena_recibida: t.sena_recibida || esperaSena(t) }).eq('id', t.id);
        if (error) throw error;
        done(sena ? `Seña de ${t.nombre} recibida: turno confirmado.` : `Turno de ${t.nombre} confirmado.`);
        return waTo(t.telefono, msg.confirmar(t, sena));
      },
      setError,
    );

  return (
    <div className="adm-page">
      <header className="adm-head">
        <div>
          <p className="adm-eyebrow">{diaLargo(key)}</p>
          <h1 className="adm-title">agenda</h1>
        </div>
        <div className="adm-head__actions">
          <div className="adm-segment">
            <button type="button" className="adm-icon-btn" onClick={() => setDay(addDays(day, -1))} aria-label="Día anterior">
              <Icon name="left" size={18} />
            </button>
            <button type="button" className="chip chip--s" aria-pressed={key === dayKey(new Date())} onClick={() => setDay(new Date())}>
              Hoy
            </button>
            <button type="button" className="adm-icon-btn" onClick={() => setDay(addDays(day, 1))} aria-label="Día siguiente">
              <Icon name="right" size={18} />
            </button>
          </div>
          <button type="button" className="btn btn--primary adm-btn-add" onClick={() => setDialog({ kind: 'nuevo' })}>
            <Icon name="plus" size={18} />
            <span>Dar turno</span>
          </button>
        </div>
      </header>

      <div className="adm-week" role="group" aria-label="Semana">
        {[0, 1, 2, 3, 4].map((i) => {
          const d = addDays(mon, i);
          const n = week.filter((t) => t.dia === dayKey(d) && ocupa(t)).length;
          const free = libres(d);
          return (
            <button type="button" key={i} className="adm-week__day" aria-pressed={dayKey(d) === key} onClick={() => setDay(d)}>
              <span className="adm-week__name">
                {weekday.format(d).replace('.', '')} {d.getDate()}
              </span>
              <span className="adm-week__meta">
                <span>{n === 1 ? '1 turno' : `${n} turnos`}</span>
                <span>{free === 0 ? 'completo' : `${free} libres`}</span>
              </span>
            </button>
          );
        })}
      </div>

      <ErrorNote text={error} />

      {!isWorkDay(day) ? (
        <p className="adm-empty">No hay atención este día.</p>
      ) : (
        <ul className="adm-list" aria-label={`Turnos del ${diaLargo(key)}`}>
          {rows.map((row) =>
            'gap' in row && row.gap ? (
              <li key={`g${row.hora}`} className="adm-row adm-row--free">
                <span className="adm-row__time">{row.gap.desde}</span>
                <span className="adm-row__main">Libre hasta las {row.gap.hasta}</span>
                <button type="button" className="btn btn--soft btn--s" onClick={() => setDialog({ kind: 'nuevo', dia: key, hora: row.gap!.desde })}>
                  <Icon name="plus" size={16} /> Dar turno acá
                </button>
              </li>
            ) : (
              'turno' in row &&
              row.turno && (
                <TurnoRow key={row.turno.id} t={row.turno} onConfirm={confirmar} onMove={(turno) => setDialog({ kind: 'reprogramar', turno })} onCancel={(turno) => setDialog({ kind: 'cancelar', turno })} />
              )
            ),
          )}
        </ul>
      )}
      <p className="adm-note">
        {site.hours}. Los turnos de la web esperan la seña 30 minutos; si no llega, el horario se libera solo.
      </p>

      {dialog?.kind === 'nuevo' && <NuevoTurno dia={dialog.dia} hora={dialog.hora} onClose={() => setDialog(null)} onDone={done} />}
      {dialog?.kind === 'reprogramar' && <Reprogramar turno={dialog.turno} onClose={() => setDialog(null)} onDone={done} />}
      {dialog?.kind === 'cancelar' && <Cancelar turno={dialog.turno} onClose={() => setDialog(null)} onDone={done} />}
      {toast && <Toast text={toast} onDone={() => setToast(null)} />}
    </div>
  );
}

function TurnoRow({ t, onConfirm, onMove, onCancel }: { t: Turno; onConfirm: (t: Turno) => void; onMove: (t: Turno) => void; onCancel: (t: Turno) => void }) {
  const late = vencido(t);
  const sena = senaDeTurno(t);
  const [label, tone]: [string, Tone] = late
    ? ['Seña vencida', 'gray']
    : esperaSena(t)
      ? [`Seña hasta ${hhmm(venceA(t.creado))}`, 'warn']
      : ESTADO[t.estado];
  const off = t.estado === 'cancelado' || late;
  return (
    <li className="adm-row" data-off={off}>
      <span className="adm-row__time">{t.hora}</span>
      <span className="adm-row__who">
        <strong>{t.nombre}</strong>
        <small>
          {t.telefono} · {t.origen === 'web' ? 'reservó en la web' : 'lo diste vos'}
        </small>
      </span>
      <span className="adm-row__main">
        {t.tratamiento}
        <small>
          {t.minutos} min{sena ? ` · seña ${formatPrice(sena)}${t.sena_recibida ? ' recibida' : ''}` : ''}
          {t.nota ? ` · ${t.nota}` : ''}
          {off && t.motivo ? ` · ${t.motivo}` : ''}
        </small>
      </span>
      <span className="adm-row__state">
        <Badge tone={tone} dot>
          {label}
        </Badge>
      </span>
      <span className="adm-row__actions">
        {t.estado === 'por_confirmar' && (
          <button type="button" className="btn btn--soft btn--s" onClick={() => onConfirm(t)}>
            {esperaSena(t) ? 'Seña recibida' : 'Confirmar'}
          </button>
        )}
        {t.estado !== 'cancelado' && !late && (
          <>
            <button type="button" className="btn btn--ghost btn--s" onClick={() => onMove(t)}>
              Reprogramar
            </button>
            <button type="button" className="btn btn--ghost btn--s" onClick={() => onCancel(t)}>
              Cancelar
            </button>
          </>
        )}
        <a className="adm-icon-btn adm-icon-btn--line" href={waTo(t.telefono, msg.hola(t.nombre, `tu turno del ${diaLargo(t.dia)}`))} target="_blank" rel="noreferrer" aria-label={`Escribirle a ${t.nombre} por WhatsApp`}>
          <Icon name="wa" size={18} />
        </a>
      </span>
    </li>
  );
}

/** Días de atención y horarios libres donde entra un turno de `minutos` (sin contarse a sí mismo al reprogramar). */
function SlotPicker({ dia, hora, minutos, exclude, onDia, onHora }: { dia: string; hora: string | null; minutos: number; exclude?: number; onDia: (d: string) => void; onHora: (h: string) => void }) {
  const [busy, setBusy] = useState<Ocupado[] | null>(null);
  useEffect(() => {
    setBusy(null);
    db.from('turnos')
      .select('id, hora, minutos, estado, origen, sena_recibida, creado')
      .eq('dia', dia)
      .neq('estado', 'cancelado')
      .then(({ data }) => setBusy(((data ?? []) as Turno[]).filter((t) => t.id !== exclude && !vencido(t))));
  }, [dia, exclude]);

  const now = new Date();
  const today = dayKey(now);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const slots = busy ? freeSlots(timeSlots(minutos, 30), minutos, busy).filter((h) => dia !== today || toMin(h) > nowMin) : [];

  return (
    <>
      <fieldset className="adm-field">
        <legend>Día</legend>
        <div className="chips">
          {nextDays(10).map((d) => (
            <button type="button" key={dayKey(d)} className="chip chip--s" aria-pressed={dayKey(d) === dia} onClick={() => onDia(dayKey(d))}>
              {weekday.format(d).replace('.', '')} {d.getDate()}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="adm-field">
        <legend>Horarios libres</legend>
        {busy === null ? (
          <p className="adm-hint">Buscando horarios…</p>
        ) : slots.length === 0 ? (
          <p className="adm-hint">No queda lugar para {minutos} min ese día.</p>
        ) : (
          <div className="chips">
            {slots.map((h) => (
              <button type="button" key={h} className="chip chip--s" aria-pressed={h === hora} onClick={() => onHora(h)}>
                {h}
              </button>
            ))}
          </div>
        )}
        <p className="adm-hint">Solo aparecen los horarios donde entra el tratamiento completo.</p>
      </fieldset>
    </>
  );
}

function NuevoTurno({ dia, hora, onClose, onDone }: { dia?: string; hora?: string; onClose: () => void; onDone: (t: string) => void }) {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [slug, setSlug] = useState(options[0].slug);
  const [d, setD] = useState(dia && parseDia(dia) >= parseDia(dayKey(new Date())) ? dia : dayKey(nextDays(1)[0]));
  const [h, setH] = useState<string | null>(hora ?? null);
  const [nota, setNota] = useState('');
  const [wa, setWa] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const treatment = options.find((t) => t.slug === slug)!;
  const minutos = minutesOf(treatment);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (nombre.trim().length < 2) return setError('Escribí el nombre de la paciente.');
    if (telefono.replace(/\D/g, '').length < 8) return setError('Revisá el WhatsApp.');
    if (!h) return setError('Elegí un horario.');
    conWhatsApp(
      wa,
      async () => {
        const row = { dia: d, hora: h, minutos, tratamiento: treatment.name, nombre: nombre.trim(), telefono: telefono.trim(), nota: nota.trim() || null, estado: 'confirmado', origen: 'admin' };
        const { data, error } = await db.from('turnos').insert(row).select().single();
        if (error) throw error;
        onDone(`Turno guardado: ${nombre.trim()}, ${diaLargo(d)} a las ${h}.`);
        return waTo(telefono, msg.confirmar(data as Turno));
      },
      setError,
    );
  };

  return (
    <Dialog
      title="Dar turno"
      sub="Para pacientes que te escriben por WhatsApp o vienen al consultorio."
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" form="nuevo-turno" className="btn btn--primary">
            {wa && <Icon name="wa" size={18} />} Guardar turno
          </button>
        </>
      }
    >
      <form id="nuevo-turno" className="adm-form" onSubmit={onSubmit} noValidate>
        <div className="field">
          <label htmlFor="t-nombre">Paciente</label>
          <input id="t-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre y apellido" autoFocus />
        </div>
        <div className="field">
          <label htmlFor="t-tel">WhatsApp</label>
          <input id="t-tel" type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+54 9 249 …" />
        </div>
        <div className="field">
          <label htmlFor="t-trat">Tratamiento</label>
          <select
            id="t-trat"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setH(null); // cambia la duración, cambian los horarios posibles
            }}
          >
            {options.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>
          <p className="adm-hint">{minutos} min · se bloquea ese tiempo en la agenda.</p>
        </div>
        <SlotPicker
          dia={d}
          hora={h}
          minutos={minutos}
          onDia={(x) => {
            setD(x);
            setH(null);
          }}
          onHora={setH}
        />
        <div className="field">
          <label htmlFor="t-nota">Nota (opcional)</label>
          <input id="t-nota" value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Ej.: primera vez, piel sensible" />
        </div>
        <Check checked={wa} onChange={setWa} label="Abrir WhatsApp con la confirmación" sub="Se abre el chat con día, hora y dirección; vos tocás enviar." />
        <ErrorNote text={error} />
      </form>
    </Dialog>
  );
}

function Reprogramar({ turno, onClose, onDone }: { turno: Turno; onClose: () => void; onDone: (t: string) => void }) {
  const [d, setD] = useState(parseDia(turno.dia) >= parseDia(dayKey(new Date())) ? turno.dia : dayKey(nextDays(1)[0]));
  const [h, setH] = useState<string | null>(null);
  const [wa, setWa] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const save = () => {
    if (!h) return setError('Elegí el nuevo horario.');
    conWhatsApp(
      wa,
      async () => {
        const { data, error } = await db.from('turnos').update({ dia: d, hora: h, estado: 'confirmado' }).eq('id', turno.id).select().single();
        if (error) throw error;
        onDone(`Turno de ${turno.nombre} movido al ${diaLargo(d)} a las ${h}.`);
        return waTo(turno.telefono, msg.reprogramar(data as Turno));
      },
      setError,
    );
  };

  return (
    <Dialog
      kind="modal"
      title="Reprogramar turno"
      sub={`${turno.nombre} · ${turno.tratamiento} · ${turno.minutos} min. Hoy: ${diaLargo(turno.dia)} a las ${turno.hora}.`}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Volver
          </button>
          <button type="button" className="btn btn--primary" onClick={save}>
            Reprogramar
          </button>
        </>
      }
    >
      <div className="adm-form">
        <SlotPicker
          dia={d}
          hora={h}
          minutos={turno.minutos}
          exclude={turno.id}
          onDia={(x) => {
            setD(x);
            setH(null);
          }}
          onHora={setH}
        />
        {h && (
          <p className="adm-callout">
            <Icon name="cal" size={18} /> Pasa del {diaLargo(turno.dia)} a las {turno.hora} al {diaLargo(d)} a las {h}.
          </p>
        )}
        <Check checked={wa} onChange={setWa} label={`Abrir WhatsApp con el aviso para ${turno.nombre.split(' ')[0]}`} />
        <ErrorNote text={error} />
      </div>
    </Dialog>
  );
}

const MOTIVOS = ['La paciente no puede venir', 'No puedo atender ese día', 'Otro motivo'];

function Cancelar({ turno, onClose, onDone }: { turno: Turno; onClose: () => void; onDone: (t: string) => void }) {
  const [motivo, setMotivo] = useState(MOTIVOS[0]);
  const [wa, setWa] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const porPaciente = motivo !== MOTIVOS[1];
  const sena = turno.sena_recibida ? senaDeTurno(turno) : null;
  const devuelve = devuelveSena(turno, porPaciente);
  const senaTexto = sena ? (devuelve ? ` Te devuelvo la seña de ${formatPrice(sena)}.` : ' Como faltan menos de 24 hs, la seña no se devuelve.') : '';

  const save = () =>
    conWhatsApp(
      wa,
      async () => {
        const { error } = await db.from('turnos').update({ estado: 'cancelado', motivo }).eq('id', turno.id);
        if (error) throw error;
        onDone(`Turno de ${turno.nombre} cancelado. El horario quedó libre en la web.`);
        return waTo(turno.telefono, msg.cancelar(turno, porPaciente, senaTexto));
      },
      setError,
    );

  return (
    <Dialog
      kind="modal"
      title={`¿Cancelar el turno de ${turno.nombre.split(' ')[0]}?`}
      sub={`${diaLargo(turno.dia)} a las ${turno.hora} · ${turno.tratamiento}`}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Volver
          </button>
          <button type="button" className="btn btn--danger" onClick={save}>
            Cancelar turno
          </button>
        </>
      }
    >
      <div className="adm-form">
        <fieldset className="adm-field">
          <legend>Motivo</legend>
          {MOTIVOS.map((m) => (
            <Check key={m} radio name="motivo" checked={motivo === m} onChange={() => setMotivo(m)} label={m} />
          ))}
        </fieldset>
        {sena && (
          <p className={`adm-callout${devuelve ? '' : ' adm-callout--warn'}`}>
            <Icon name="alert" size={18} />
            {devuelve
              ? `Corresponde devolverle la seña de ${formatPrice(sena)}${porPaciente ? ': avisó con 24 hs o más.' : '.'}`
              : `Faltan menos de 24 hs: la seña de ${formatPrice(sena)} no se devuelve.`}
          </p>
        )}
        <Check checked={wa} onChange={setWa} label={`Abrir WhatsApp con el aviso para ${turno.nombre.split(' ')[0]}`} sub="El mensaje va escrito con el link para elegir otro turno." />
        <ErrorNote text={error} />
      </div>
    </Dialog>
  );
}
