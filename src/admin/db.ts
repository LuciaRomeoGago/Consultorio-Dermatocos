import { createClient } from '@supabase/supabase-js';
import type { Category } from '../data/types';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Cliente con la sesión de la profesional. Solo lo usa el panel, que se carga aparte del sitio. */
export const supabase = url && key ? createClient(url, key) : null;
export const db = supabase!;

export type EstadoTurno = 'por_confirmar' | 'confirmado' | 'cancelado';

export interface Turno {
  id: number;
  dia: string;
  hora: string;
  minutos: number;
  tratamiento: string;
  nombre: string;
  telefono: string;
  email: string | null;
  nota: string | null;
  estado: EstadoTurno;
  origen: 'web' | 'admin';
  motivo: string | null;
  sena_recibida: boolean;
  creado: string;
}

export type EstadoReserva = 'nueva' | 'esperando_stock' | 'lista' | 'retirada' | 'cancelada';

export interface ReservaItem {
  id: number;
  producto_id: string | null;
  nombre: string;
  precio: number | null;
  qty: number;
}

export interface Reserva {
  id: number;
  nombre: string;
  telefono: string;
  email: string | null;
  comentario: string | null;
  pago: 'transferencia' | 'efectivo';
  pago_recibido: boolean;
  estado: EstadoReserva;
  total: number;
  creado: string;
  reserva_items: ReservaItem[];
}

export interface Producto {
  id: string;
  slug: string;
  word: string;
  name: string;
  subtitle: string;
  price: number | null;
  category: Category;
  img: string;
  hover_img: string | null;
  es_rutina: boolean;
  stock: number;
  stock_min: number;
  visible: boolean;
  ultimo_ingreso: string | null;
}

export interface StockRow {
  id: string;
  slug: string;
  name: string;
  category: Category;
  img: string;
  stock: number;
  stock_min: number;
  ultimo_ingreso: string | null;
  reservado: number;
  disponible: number;
}

export interface RutinaItem {
  rutina_id: string;
  producto_id: string;
}

/** Lo que hace falta para saber cuántas unidades quedan de cada cosa. */
export async function loadInventario() {
  const [p, s, r] = await Promise.all([
    db.from('productos').select('*').order('creado'),
    db.from('v_stock').select('*'),
    db.from('rutina_items').select('*'),
  ]);
  const error = p.error ?? s.error ?? r.error;
  if (error) throw error;
  return { productos: p.data as Producto[], stock: s.data as StockRow[], rutinas: r.data as RutinaItem[] };
}

export type Inventario = Awaited<ReturnType<typeof loadInventario>>;

/** Productos sueltos que compromete un producto (una rutina compromete los suyos). */
export const componentes = (inv: Inventario, id: string) => {
  const items = inv.rutinas.filter((r) => r.rutina_id === id).map((r) => r.producto_id);
  return items.length ? items : [id];
};

/** Unidades libres; para una rutina, las del producto que menos tiene. `extra` simula un ingreso. */
export function disponible(inv: Inventario, id: string, extra: Record<string, number> = {}) {
  const libres = componentes(inv, id).map((c) => {
    const s = inv.stock.find((x) => x.id === c);
    return (s?.disponible ?? 0) + (extra[c] ?? 0);
  });
  return Math.min(...libres);
}
