import { site } from '../data/site';
import { treatments } from '../data/treatments';
import { senaDe } from '../lib/agenda';
import { formatPrice, parseMeta } from '../lib/format';
import type { Reserva, Turno } from './db';

const largo = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
const corto = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short' });

/** "2026-11-04" → Date local (sin el corrimiento de zona horaria de new Date("2026-11-04")). */
export const parseDia = (dia: string) => {
  const [y, m, d] = dia.split('-').map(Number);
  return new Date(y, m - 1, d);
};
export const diaLargo = (dia: string) => largo.format(parseDia(dia));
export const diaCorto = (dia: string) => corto.format(parseDia(dia));
export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/** Seña que corresponde a un turno de la web (los turnos que da la profesional no llevan). */
export function senaDeTurno(t: Turno) {
  if (t.origen !== 'web') return null;
  const meta = treatments.find((x) => x.name === t.tratamiento)?.meta;
  const precio = meta ? parseMeta(meta)?.price : undefined;
  return precio ? senaDe(precio) : null;
}

/** La seña se devuelve si cancela la profesional o si la paciente avisa con 24 hs o más. */
export function devuelveSena(t: Turno, porPaciente: boolean, ahora = new Date()) {
  const [h, m] = t.hora.split(':').map(Number);
  const inicio = parseDia(t.dia);
  inicio.setHours(h, m);
  return !porPaciente || inicio.getTime() - ahora.getTime() >= 24 * 3600_000;
}

const primerNombre = (nombre: string) => nombre.trim().split(/\s+/)[0];
const lugar = `${site.address}, ${site.city.split(',')[0]}`;

export const msg = {
  confirmar: (t: Turno, sena: number | null = null) =>
    `Hola ${primerNombre(t.nombre)}! ${sena ? `Recibí tu seña de ${formatPrice(sena)}. ` : ''}Te confirmo tu turno de ${t.tratamiento} el ${diaLargo(t.dia)} a las ${t.hora} hs en ${lugar}. Si necesitás cambiarlo, avisame por acá. Jazmín`,
  reprogramar: (t: Turno) =>
    `Hola ${primerNombre(t.nombre)}! Tu turno de ${t.tratamiento} pasó al ${diaLargo(t.dia)} a las ${t.hora} hs, en ${lugar}. Cualquier cosa avisame. Jazmín`,
  cancelar: (t: Turno, porPaciente: boolean, sena: string) =>
    porPaciente
      ? `Hola ${primerNombre(t.nombre)}! Cancelé tu turno de ${t.tratamiento} del ${diaLargo(t.dia)} a las ${t.hora} hs, como me pediste.${sena} Cuando quieras elegí otro en ${location.origin}/reservas. Jazmín`
      : `Hola ${primerNombre(t.nombre)}, perdón: no voy a poder atenderte el ${diaLargo(t.dia)} a las ${t.hora} hs.${sena} Elegí otro turno en ${location.origin}/reservas o respondeme y lo buscamos juntas. Jazmín`,
  lista: (r: Reserva) =>
    `Hola ${primerNombre(r.nombre)}! Tu pedido #${r.id} ya está listo para retirar en ${lugar}. ${site.hours}.${r.pago === 'transferencia' && !r.pago_recibido ? ' Si todavía no hiciste la transferencia, te paso los datos por acá.' : ''} Jazmín`,
  hola: (nombre: string, sobre: string) => `Hola ${primerNombre(nombre)}! Te escribo por ${sobre}. Jazmín`,
};

/** Mensaje legible para los errores de la base (los `raise exception` de schema.sql y los de red). */
export function errText(e: unknown) {
  const m = e instanceof Error || (typeof e === 'object' && e && 'message' in e) ? String((e as { message: string }).message) : '';
  if (m.includes('horario_ocupado')) return 'Ese horario ya está ocupado. Elegí otro.';
  if (m.includes('duplicate key') && m.includes('slug')) return 'Ya hay un producto con ese nombre.';
  if (m.includes('estado_invalido')) return 'La reserva ya cambió de estado. Recargá la página.';
  if (m.includes('sin_permiso') || m.includes('row-level security')) return 'Tu cuenta no tiene permiso para hacer esto.';
  if (m.includes('Failed to fetch')) return 'No hay conexión. Probá de nuevo en un rato.';
  return 'No se pudo guardar. Probá de nuevo.';
}

/**
 * Corre `task` y, si devuelve un link, lo abre en WhatsApp.
 * La pestaña se abre antes de esperar a la base: si se abre después, el celular la bloquea como ventana emergente.
 */
export async function conWhatsApp(abrir: boolean, task: () => Promise<string | null>, onError: (m: string) => void) {
  const tab = abrir ? window.open('', '_blank') : null;
  try {
    const url = await task();
    if (url && tab) tab.location.href = url;
    else tab?.close();
    return true;
  } catch (e) {
    tab?.close();
    onError(errText(e));
    return false;
  }
}

export const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
