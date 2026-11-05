import { listedProducts, products } from '../data/products';
import type { Category } from '../data/types';
import { hasBackend, rpc } from './api';

interface Row {
  slug: string;
  word: string;
  name: string;
  subtitle: string;
  price: number | null;
  category: Category;
  img: string;
  hover_img: string | null;
  es_rutina: boolean;
  visible: boolean;
  disponible: number;
}

/**
 * Pisa el catálogo de data/products.ts con lo que se carga en el panel: precio, stock, fotos y productos nuevos.
 * Las fichas largas (detalles, rutinas, sugerencias) siguen saliendo del código.
 */
export async function loadCatalog() {
  if (!hasBackend) return;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 4000);
  try {
    const rows = await rpc<Row[]>('catalogo', {}, ctrl.signal);
    const seen = new Set(rows.map((r) => r.slug));
    for (const r of rows) {
      const fields = {
        word: r.word,
        name: r.name,
        subtitle: r.subtitle,
        price: r.price,
        category: r.category,
        img: r.img,
        hoverImg: r.hover_img ?? r.img,
        inStock: r.disponible > 0,
        listed: r.visible,
      };
      const known = products.find((p) => p.slug === r.slug);
      if (known) Object.assign(known, fields);
      else products.push({ slug: r.slug, fullBleed: r.es_rutina, ...fields });
    }
    // Lo borrado en el panel deja de listarse, pero sigue existiendo para los textos que lo nombran.
    for (const p of products) if (!seen.has(p.slug)) p.listed = false;
    listedProducts.splice(0, listedProducts.length, ...products.filter((p) => p.listed));
  } catch {
    // Sin conexión con la base se muestra el catálogo del código.
  } finally {
    clearTimeout(timer);
  }
}
