import { useState, type CSSProperties } from 'react';
import { useSearchParams } from 'react-router-dom';
import { NotSureCard } from '../components/NotSureCard';
import { ProductCard } from '../components/ProductCard';
import { Rich } from '../components/Rich';
import { shopPage as page } from '../data/content';
import { categories, listedProducts } from '../data/products';
import type { Category, Product } from '../data/types';
import { img } from '../lib/format';
import './Tienda.css';

const isCategory = (value: string | null): value is Category => categories.includes(value as Category);

type Sort = 'destacados' | 'menor precio' | 'mayor precio';
const sorts: Sort[] = ['destacados', 'menor precio', 'mayor precio'];

/** En celular Figma muestra la grilla en otro orden: "lifting" sube antes de "defensa" y "luz" baja después de "calma". */
const mobileFirst = ['emulsion-limpieza-suave', 'acqua-di-jojoba', 'asthera-day', 'suero-glamour', 'bio-top-skin-support', 'emulfresh', 'rutina-luz', 'suero-rediles'];
const mobileOrder = (p: Product, i: number) => {
  const at = mobileFirst.indexOf(p.slug);
  return at === -1 ? i : at;
};

/** Los productos sin precio ("Consultar") van al final en los dos órdenes por precio. */
const byPrice = (dir: 1 | -1) => (a: Product, b: Product) => {
  if (a.price === null) return 1;
  if (b.price === null) return -1;
  return (a.price - b.price) * dir;
};

/** Página "Tienda" (frames "Desktop — Tienda" y "Celular — Tienda"). */
export function Tienda() {
  // El filtro vive en la URL (?categoria=Sérums), así se puede compartir y sobrevive al "atrás".
  const [params, setParams] = useSearchParams();
  const raw = params.get('categoria');
  const active = isCategory(raw) ? raw : null;
  const [sort, setSort] = useState<Sort>('destacados');

  const filtered = active ? listedProducts.filter((p) => p.category === active) : listedProducts;
  const visible =
    sort === 'destacados' ? filtered : [...filtered].sort(byPrice(sort === 'menor precio' ? 1 : -1));
  const featured = !active && sort === 'destacados';
  const showNotSure = featured;

  const choose = (category: Category | null) => setParams(category ? { categoria: category } : {}, { replace: true });

  return (
    <>
      <section className="shop-hero">
        <img src={img(page.heroImg)} alt="" />
        <Rich as="h1" className="shop-hero__title" text={page.title} />
      </section>

      <section className="container shop">
        <h2 className="shop__title">tienda</h2>

        <div className="shop__bar">
          <div className="chips chips--scroll" role="group" aria-label="Filtrar por categoría">
            <button type="button" className="chip" aria-pressed={!active} onClick={() => choose(null)}>
              Todo
            </button>
            {categories.map((c) => (
              <button type="button" key={c} className="chip" aria-pressed={active === c} onClick={() => choose(c)}>
                {c}
              </button>
            ))}
          </div>

          <div className="shop__order">
            <p className="shop__count" aria-live="polite">
              {visible.length} {visible.length === 1 ? 'producto' : 'productos'}
            </p>
            <label className="shop__sort">
              <span>Ordenar:</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                {sorts.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden="true">
                <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </label>
          </div>
        </div>

        {visible.length === 0 ? (
          <p className="shop__empty">Por ahora no hay productos en esta categoría. Consultanos por WhatsApp.</p>
        ) : (
          <div className="product-grid shop__grid">
            {/* El orden lo da CSS: la tarjeta "¿No sabés qué usar?" va después del 5.º producto en escritorio y del 4.º en celular. */}
            {visible.map((p, i) => (
              <ProductCard
                key={p.slug}
                product={p}
                variant="grid"
                style={{ '--order': i * 2, '--order-m': (featured ? mobileOrder(p, i) : i) * 2 } as CSSProperties}
              />
            ))}
            {showNotSure && <NotSureCard wide />}
          </div>
        )}
      </section>
    </>
  );
}
