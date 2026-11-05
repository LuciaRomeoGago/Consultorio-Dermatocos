/** Cálculos de horarios y WhatsApp que comparten la web y el panel. Sin dependencias: los prueba scripts/selfcheck.ts. */

export interface Ocupado {
  hora: string;
  minutos: number;
}

export const toMin = (hora: string) => {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
};

export const toHora = (min: number) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

export const overlaps = (a: Ocupado, b: Ocupado) =>
  toMin(a.hora) < toMin(b.hora) + b.minutos && toMin(b.hora) < toMin(a.hora) + a.minutos;

/** Horarios de inicio donde entra un turno de `minutos` sin pisar ninguno de `busy`. */
export const freeSlots = (slots: string[], minutos: number, busy: Ocupado[]) =>
  slots.filter((hora) => !busy.some((b) => overlaps({ hora, minutos }, b)));

/** Huecos libres del día (de al menos `min` minutos) entre la apertura y el cierre, en horas. */
export function gaps(busy: Ocupado[], open: number, close: number, min = 30) {
  const out: { desde: string; hasta: string }[] = [];
  let cur = open * 60;
  for (const b of [...busy].sort((x, y) => toMin(x.hora) - toMin(y.hora))) {
    const start = toMin(b.hora);
    if (start - cur >= min) out.push({ desde: toHora(cur), hasta: toHora(start) });
    cur = Math.max(cur, start + b.minutos);
  }
  if (close * 60 - cur >= min) out.push({ desde: toHora(cur), hasta: toHora(close * 60) });
  return out;
}

/**
 * Número de celular argentino en el formato de wa.me (549 + área + número).
 * shortcut: no saca el "15" de los números escritos a la vieja usanza (249 15 …); si hace falta, sumarlo acá.
 */
export function waPhone(raw: string) {
  let d = raw.replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  if (d.startsWith('549')) return d;
  if (d.startsWith('54')) return `549${d.slice(2)}`;
  if (d.startsWith('0')) d = d.slice(1);
  return `549${d}`;
}

/** Seña para confirmar un turno web: se descuenta del total y vence si no llega a tiempo. */
export const SENA = { porcentaje: 0.25, minutos: 30 };

export const senaDe = (precio: number) => Math.round(precio * SENA.porcentaje);

/** Turno web que se quedó sin seña: deja de ocupar el horario (igual que turno_vencido en schema.sql). */
export const vencido = (t: { origen: string; estado: string; sena_recibida: boolean; creado: string }, ahora = Date.now()) =>
  t.origen === 'web' && t.estado === 'por_confirmar' && !t.sena_recibida && ahora - Date.parse(t.creado) > SENA.minutos * 60_000;

/** Hasta qué hora hay tiempo de mandar la seña. */
export const venceA = (creado: string) => new Date(Date.parse(creado) + SENA.minutos * 60_000);

export const waTo = (phone: string, text: string) => `https://wa.me/${waPhone(phone)}?text=${encodeURIComponent(text)}`;
