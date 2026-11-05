import { site } from '../data/site';

/** Duración por defecto cuando el tratamiento dice "Consultá duración y precio". */
export const DEFAULT_MINUTES = 60;

/** Próximos días de atención, a partir de mañana. */
export function nextWorkingDays(count: number, from = new Date()): Date[] {
  const days: Date[] = [];
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  while (days.length < count) {
    d.setDate(d.getDate() + 1);
    if (site.schedule.days.includes(d.getDay())) days.push(new Date(d));
  }
  return days;
}

/** Horarios de inicio en los que entra un turno de `minutes` antes del cierre. */
export function timeSlots(minutes: number, step = 60): string[] {
  const slots: string[] = [];
  const { open, close } = site.schedule;
  for (let m = open * 60; m + minutes <= close * 60; m += step) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    slots.push(`${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`);
  }
  return slots;
}

const longFormat = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });

export const formatLongDay = (d: Date) => longFormat.format(d);

/** Clave estable de un día (AAAA-MM-DD) para usar en el estado y en keys. */
export const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
