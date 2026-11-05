import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { findProduct } from '../data/products';
import type { Product } from '../data/types';

export interface CartLine {
  slug: string;
  qty: number;
}

type Action =
  | { type: 'add'; slug: string; qty?: number }
  | { type: 'set'; slug: string; qty: number }
  | { type: 'remove'; slug: string }
  | { type: 'clear' };

const STORAGE_KEY = 'js-pedido';
const MAX_QTY = 10;

function reducer(lines: CartLine[], action: Action): CartLine[] {
  switch (action.type) {
    case 'add': {
      const qty = action.qty ?? 1;
      const existing = lines.find((l) => l.slug === action.slug);
      if (existing) {
        return lines.map((l) => (l.slug === action.slug ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l));
      }
      return [...lines, { slug: action.slug, qty: Math.min(MAX_QTY, qty) }];
    }
    case 'set':
      if (action.qty < 1) return lines.filter((l) => l.slug !== action.slug);
      return lines.map((l) => (l.slug === action.slug ? { ...l, qty: Math.min(MAX_QTY, action.qty) } : l));
    case 'remove':
      return lines.filter((l) => l.slug !== action.slug);
    case 'clear':
      return [];
  }
}

function load(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    // Se descartan productos que ya no existen en el catálogo.
    return parsed.filter((l): l is CartLine => typeof l?.slug === 'string' && typeof l?.qty === 'number' && !!findProduct(l.slug));
  } catch {
    return [];
  }
}

export interface CartItem extends CartLine {
  product: Product;
}

interface CartValue {
  items: CartItem[];
  count: number;
  /** Suma de los productos con precio. Los "Consultar" no suman. */
  subtotal: number;
  hasUnpriced: boolean;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, [], load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Sin almacenamiento disponible, el pedido vive solo en memoria.
    }
  }, [lines]);

  const value = useMemo<CartValue>(() => {
    const items = lines.flatMap((l) => {
      const product = findProduct(l.slug);
      return product ? [{ ...l, product }] : [];
    });
    return {
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((sum, i) => sum + (i.product.price ?? 0) * i.qty, 0),
      hasUnpriced: items.some((i) => i.product.price === null),
      add: (slug, qty) => dispatch({ type: 'add', slug, qty }),
      setQty: (slug, qty) => dispatch({ type: 'set', slug, qty }),
      remove: (slug) => dispatch({ type: 'remove', slug }),
      clear: () => dispatch({ type: 'clear' }),
    };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart tiene que usarse dentro de <CartProvider>');
  return ctx;
}
