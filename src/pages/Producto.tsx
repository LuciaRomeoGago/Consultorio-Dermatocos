import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { QtyStepper } from '../components/Blocks';
import { Rich } from '../components/Rich';
import { findProduct } from '../data/products';
import { findTreatment } from '../data/treatments';
import type { Product, ProductDetail } from '../data/types';
import { useCart } from '../lib/cart';
import { formatPrice, img, priceLabel } from '../lib/format';
import { BestSellers } from './Home';
import { NotFound } from './NotFound';
import './Producto.css';

const byslug = (slugs: string[]) => slugs.map(findProduct).filter((p): p is Product => !!p);
const pad = (n: number) => String(n + 1).padStart(2, '0');
const slide = (i: number, active: number) => (i === active ? 'active' : i < active ? 'before' : 'after');
/** Nombre corto para los círculos: "Emulsión", "Day", "Night". */
const shortName = (name: string) => (name.startsWith('Emulsión') ? 'Emulsión' : name.split(' ').slice(-1)[0]);

/** "Rutina luz" → "rutina" + "luz" en manuscrita, si el nombre termina con la palabra de la tarjeta. */
function ProductTitle({ name, word }: { name: string; word: string }) {
  const endsWithWord = name.toLowerCase().endsWith(` ${word.toLowerCase()}`);
  if (!endsWithWord) return <h1 className="pd-title">{name}</h1>;
  return (
    <h1 className="pd-title">
      {name.slice(0, -word.length).toLowerCase()}
      <span className="script">{word}</span>
    </h1>
  );
}

/** Ficha de producto (frames "Desktop — Producto (rutina luz)" y "Celular — Producto (rutina luz)"). */
export function Producto() {
  const { slug } = useParams();
  const product = findProduct(slug);
  if (!product) return <NotFound />;
  // `key` reinicia cantidad, galería y selecciones al pasar de un producto a otro.
  return <ProductView key={product.slug} product={product} />;
}

function ProductView({ product }: { product: Product }) {
  const detail = product.detail;
  return (
    <>
      <Buy product={product} />
      {detail && (
        <>
          <Details product={product} detail={detail} />
          <OwnGlow product={product} detail={detail} />
          <HowToUse detail={detail} />
          <AddSession product={product} detail={detail} />
        </>
      )}
      <div className="pd-more">
        <BestSellers />
      </div>
    </>
  );
}

/** 01 · Producto: miniaturas, galería y panel de compra. */
function Buy({ product }: { product: Product }) {
  const { add } = useCart();
  const navigate = useNavigate();
  const detail = product.detail;
  const included = detail ? byslug(detail.includes.map((i) => i.slug)) : [];
  const upsell = detail ? byslug(detail.upsell) : [];
  const session = detail ? findTreatment(detail.session.treatmentSlug) : undefined;

  const gallery = [product.img, ...included.map((p) => p.img)];
  const [photo, setPhoto] = useState(0);
  const [qty, setQty] = useState(1);
  const [shown, setShown] = useState<number | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [added, setAdded] = useState(false);
  const [nothingPicked, setNothingPicked] = useState(false);

  const isRoutine = included.length > 0;
  const move = (step: number) => setPhoto((photo + step + gallery.length) % gallery.length);
  const toggle = (slug: string) => {
    setNothingPicked(false);
    setPicked((list) => (list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug]));
  };

  const buy = () => {
    add(product.slug, qty);
    if (isRoutine) navigate('/pedido');
    else setAdded(true);
  };

  const addPicked = () => {
    if (picked.length === 0) {
      setNothingPicked(true);
      return;
    }
    picked.forEach((slug) => add(slug));
    setPicked([]);
    setAdded(true);
  };

  return (
    <section className="container-card pd-buy">
      {gallery.length > 1 && (
        <div className="pd-thumbs" role="group" aria-label="Fotos del producto">
          {gallery.map((key, i) => (
            <button key={key} aria-pressed={photo === i} aria-label={`Ver foto ${i + 1}`} onClick={() => setPhoto(i)}>
              <img src={img(key)} alt="" loading="lazy" data-fit={i === 0 && product.fullBleed ? undefined : 'contain'} />
            </button>
          ))}
        </div>
      )}

      <div className="pd-gallery">
        <div className="pd-gallery__frame">
          {gallery.map((key, i) => (
            <img
              key={key}
              src={img(key)}
              alt={i === 0 ? product.name : ''}
              data-state={slide(i, photo)}
              data-fit={i === 0 && product.fullBleed ? undefined : 'contain'}
            />
          ))}
        </div>
        {gallery.length > 1 && (
          <div className="pd-gallery__nav">
            <span>
              {photo + 1} / {gallery.length}
            </span>
            <span>
              <button onClick={() => move(-1)} aria-label="Foto anterior">
                ←
              </button>
              <button onClick={() => move(1)} aria-label="Foto siguiente">
                →
              </button>
            </span>
          </div>
        )}

        {/* Celular: las fotos se deslizan. */}
        <ul className="scroller pd-gallery__mobile" aria-label="Fotos del producto">
          {gallery.map((key, i) => (
            <li key={key}>
              <img src={img(key)} alt="" loading="lazy" data-fit={i === 0 && product.fullBleed ? undefined : 'contain'} />
            </li>
          ))}
        </ul>
      </div>

      <div className="pd-panel">
        <nav aria-label="Ruta" className="pd-crumbs">
          <Link to="/tienda">Tienda</Link>
          <span aria-hidden="true">/</span>
          {detail?.breadcrumb ?? product.category}
        </nav>
        <ProductTitle name={product.name} word={product.word} />
        <p className="pd-subtitle">{product.subtitle}</p>
        <p className="pd-price">
          <span>{priceLabel(product.price)}</span>
          {product.originalPrice && (
            <>
              <s>{formatPrice(product.originalPrice)}</s> <small>valor original</small>
            </>
          )}
        </p>
        {detail && <p className="pd-desc">{detail.description}</p>}

        {isRoutine && (
          <div className="pd-includes">
            <p className="pd-label">Incluye</p>
            <div className="pd-includes__pills" role="group" aria-label="Productos de la rutina">
              {included.map((p, i) => (
                <button key={p.slug} aria-pressed={shown === i} onClick={() => setShown(shown === i ? null : i)}>
                  <img src={img(p.img)} alt="" loading="lazy" />
                  {p.name}
                </button>
              ))}
            </div>
            <p className="pd-includes__hint" aria-live="polite">
              {shown === null ? 'Tocá cada producto para verlo en detalle.' : detail!.includes[shown].text}
            </p>
          </div>
        )}

        <div className="pd-actions">
          <QtyStepper value={qty} onChange={setQty} label="Cantidad" />
          <button className="btn btn--primary" onClick={buy}>
            {isRoutine ? 'Comprar la rutina' : 'Agregar al pedido'}
            {product.price !== null && ` · ${formatPrice(product.price * qty)}`}
          </button>
        </div>
        {!product.inStock && <p className="pd-note">Sin stock: lo reservamos y te avisamos cuando llegue.</p>}
        {added && (
          <p className="pd-note" role="status">
            Listo, lo sumamos a <Link to="/pedido">tu pedido</Link>.
          </p>
        )}

        {upsell.length > 0 && (
          <div className="pd-upsell">
            <p className="pd-label">Completá tu rutina</p>
            <ul>
              {upsell.map((p) => (
                <li key={p.slug}>
                  <label>
                    <img src={img(p.img)} alt="" loading="lazy" />
                    <span className="pd-upsell__text">
                      <span className="pd-upsell__name">{p.name}</span>
                      <span>{p.subtitle.toLowerCase()}</span>
                      <span className="pd-upsell__price">{priceLabel(p.price)}</span>
                    </span>
                    <input type="checkbox" checked={picked.includes(p.slug)} onChange={() => toggle(p.slug)} />
                  </label>
                </li>
              ))}
              {detail && session && (
                <li className="pd-upsell__session">
                  <img src={img(detail.session.img)} alt="" loading="lazy" />
                  <span className="pd-upsell__text">
                    <span className="pd-upsell__name">Sumá tu sesión</span>
                    <span>el tratamiento en cabina</span>
                    <span className="pd-upsell__price">{formatPrice(detail.session.price)}</span>
                  </span>
                  <Link to={`/reservas?tratamiento=${session.slug}`} className="btn btn--link">
                    Reservar
                  </Link>
                </li>
              )}
            </ul>
            <button className="btn btn--secondary btn--full" onClick={addPicked}>
              Agregar seleccionados
            </button>
            {nothingPicked && (
              <p className="pd-note" role="status">
                Marcá los productos que quieras sumar.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

type Section = { product: Product; detail: ProductDetail };

/** 02 · Detalles: frase y filas a la izquierda, foto a la derecha. */
function Details({ product, detail }: Section) {
  return (
    <section className="container-card pd-split pd-details">
      <div className="pd-details__panel">
        <p className="pd-label pd-label--lg">{product.subtitle}</p>
        <Rich as="h2" className="pd-phrase" text={detail.phrase} />
        <dl className="pd-rows">
          {detail.facts.map(([label, value]) => (
            <div key={label}>
              <dt>{label}:</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <img className="pd-split__img pd-details__img" src={img(detail.detailImg)} alt="" loading="lazy" />
    </section>
  );
}

/** 03 · Brillo propio: un producto de la rutina por vez, elegido con los círculos. */
function OwnGlow({ product, detail }: Section) {
  const items = detail.includes.map((i) => ({ ...i, product: findProduct(i.slug)! }));
  const [active, setActive] = useState(0);
  const item = items[active];
  const includedIn = `${product.name} · ${product.subtitle.toLowerCase()}`;

  return (
    <section className="pd-glow">
      <div className="container-card pd-desktop">
        <div className="pd-slider">
          <div className="pd-slider__images" aria-hidden="true">
            {items.map((it, i) => (
              <img key={it.slug} src={img(it.product.img)} alt="" loading="lazy" data-state={slide(i, active)} data-fit="contain" />
            ))}
          </div>
          <div className="pd-slider__panel">
            <Rich as="h2" className="pd-h2" text={[['brillo ', 0], ['propio.', 1]]} />
            <div className="pd-glow__body" key={active} aria-live="polite">
              <p className="pd-label pd-label--lg">{item.product.name}</p>
              <dl className="pd-glow__rows">
                <div>
                  <dt>Qué es</dt>
                  <dd>{item.text}</dd>
                </div>
                <div>
                  <dt>Cuándo</dt>
                  <dd>{item.whenLong}</dd>
                </div>
                <div>
                  <dt>Incluida en</dt>
                  <dd>{includedIn}</dd>
                </div>
              </dl>
            </div>
            <div className="pd-circles" role="group" aria-label="Productos de la rutina">
              {items.map((it, i) => (
                <button key={it.slug} aria-pressed={i === active} onClick={() => setActive(i)} onMouseEnter={() => setActive(i)}>
                  {shortName(it.product.name)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Celular */}
      <div className="pd-mobile">
        <Rich as="h2" className="container pd-h2" text={[['brillo ', 0], ['propio.', 1]]} />
        <ul className="scroller pd-cards">
          {items.map((it) => (
            <li key={it.slug}>
              <img src={img(it.product.img)} alt="" loading="lazy" />
              <h3>{it.product.name}</h3>
              <p className="pd-cards__label">Qué es</p>
              <p>{it.text}</p>
              <p className="pd-cards__label">Cuándo</p>
              <p>{it.whenLong}</p>
            </li>
          ))}
        </ul>
        <div className="container pd-glow__in">
          <p className="pd-cards__label">Incluida en</p>
          <p>{includedIn}</p>
        </div>
      </div>
    </section>
  );
}

/** 04 · Cómo usarla: pasos numerados; cambia la foto de la modelo y el producto del círculo blanco. */
function HowToUse({ detail }: { detail: ProductDetail }) {
  const steps = detail.includes.map((i) => ({ ...i, product: findProduct(i.slug)! }));
  const [active, setActive] = useState(0);
  const step = steps[active];

  return (
    <section className="pd-use">
      <div className="container-card pd-desktop">
        <div className="pd-slider">
          <div className="pd-slider__images" aria-hidden="true">
            {steps.map((s, i) => (
              <img key={s.slug} src={img(s.useImg)} alt="" loading="lazy" data-state={slide(i, active)} />
            ))}
          </div>
          <div className="pd-slider__panel">
            <Rich as="h2" className="pd-h2" text={[['cómo ', 0], ['usarla', 1]]} />
            <p className="pd-use__lead">{detail.usage}</p>
            <div className="pd-use__step" key={active} aria-live="polite">
              <div>
                <p className="pd-label pd-label--muted">{step.when}</p>
                <h3>{step.product.name}</h3>
                <p>{step.howTo}</p>
              </div>
              <span className="pd-use__product">
                <img src={img(step.product.img)} alt="" />
              </span>
            </div>
            <div className="pd-circles pd-circles--num" role="group" aria-label="Pasos">
              {steps.map((s, i) => (
                <button key={s.slug} aria-pressed={i === active} aria-label={`Paso ${i + 1}: ${s.product.name}`} onClick={() => setActive(i)} onMouseEnter={() => setActive(i)}>
                  {pad(i)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Celular */}
      <div className="pd-mobile">
        <div className="container pd-use__head">
          <Rich as="h2" className="pd-h2" text={[['cómo ', 0], ['usarla', 1]]} />
          <p className="pd-use__lead">{detail.usage}</p>
        </div>
        <ol className="scroller pd-cards">
          {steps.map((s, i) => (
            <li key={s.slug}>
              <img src={img(s.useImgMobile ?? s.useImg)} alt="" loading="lazy" />
              <p className="pd-cards__step">
                <span>{pad(i)}</span> {s.when}
              </p>
              <h3>{s.product.name}</h3>
              <p>{s.howTo}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** 05 · Sumá tu sesión: "en cabina" o "en casa". */
function AddSession({ product, detail }: Section) {
  const { add } = useCart();
  const navigate = useNavigate();
  const session = findTreatment(detail.session.treatmentSlug);
  const [where, setWhere] = useState<'cabina' | 'casa'>('cabina');

  const buy = () => {
    add(product.slug);
    navigate('/pedido');
  };

  const options = {
    cabina: {
      img: detail.session.img,
      text: `${detail.session.label} · ${formatPrice(detail.session.price)}`,
      action: (
        <Link to={`/reservas?tratamiento=${session?.slug ?? ''}`} className="btn btn--link">
          Reservar turno
        </Link>
      ),
    },
    casa: {
      img: detail.home.img,
      text: `${detail.home.text} · ${priceLabel(product.price)}`,
      action: (
        <button className="btn btn--link" onClick={buy}>
          Comprar la rutina
        </button>
      ),
    },
  };
  const keys = ['cabina', 'casa'] as const;

  return (
    <section className="pd-session">
      <div className="container-card pd-desktop">
        <div className="pd-slider">
          <div className="pd-slider__images" aria-hidden="true">
            {keys.map((k, i) => (
              <img key={k} src={img(options[k].img)} alt="" loading="lazy" data-state={slide(i, keys.indexOf(where))} />
            ))}
          </div>
          <div className="pd-slider__panel pd-session__panel">
            <p className="pd-label pd-label--lg">Sumá tu sesión</p>
            <div className="pd-session__words" role="group" aria-label="Dónde">
              {keys.map((k) => (
                <button key={k} aria-pressed={where === k} onClick={() => setWhere(k)} onMouseEnter={() => setWhere(k)}>
                  en {k}
                </button>
              ))}
            </div>
            <div className="pd-session__detail" key={where}>
              <p>{options[where].text}</p>
              {options[where].action}
            </div>
          </div>
        </div>
      </div>

      {/* Celular */}
      <div className="pd-mobile pd-session__mobile">
        <p className="pd-label">Sumá tu sesión</p>
        {keys.map((k) => (
          <div key={k} className="pd-session__block">
            <img src={img(options[k].img)} alt="" loading="lazy" />
            <h3>en {k}</h3>
            <p>{options[k].text}</p>
            {k === 'cabina' ? (
              <Link to={`/reservas?tratamiento=${session?.slug ?? ''}`} className="btn btn--link">
                Reservá tu tratamiento
              </Link>
            ) : (
              options[k].action
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
