/** Las fotos se exportan de Figma en WebP, con el nombre de su clave (10 caracteres). */
/** También acepta una URL completa: las fotos que se suben desde el panel viven en Supabase. */
export const img = (key: string) => (key.includes(':') || key.includes('/') ? key : `/img/${key}.webp`);

export const formatPrice = (value: number) => `$${value.toLocaleString('es-AR')}`;

export const priceLabel = (value: number | null) => (value === null ? 'Consultar' : formatPrice(value));

/** Saca duración y precio del texto "45 min · $60.000". Devuelve null si dice "Consultá…". */
export function parseMeta(meta: string): { minutes: number; price: number } | null {
  const match = meta.match(/(\d+)\s*min\s*·\s*\$([\d.]+)/);
  if (!match) return null;
  return { minutes: Number(match[1]), price: Number(match[2].replace(/\./g, '')) };
}
