import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../data/types';
import { useCart } from '../lib/cart';
import { img, priceLabel } from '../lib/format';
import './ProductCard.css';

/**
 * Componente "Card producto". Reposo: palabra grande, foto del producto y nombre con precio.
 * Al pasar el mouse aparece la foto de uso a pantalla completa y el botón "Agregar al carrito".
 * En celular el botón queda siempre visible debajo de la tarjeta.
 */
interface Props {
  product: Product;
  variant?: 'carousel' | 'grid';
  style?: CSSProperties;
}

export function ProductCard({ product, variant = 'carousel', style }: Props) {
  const { add } = useCart();
  const href = `/tienda/${product.slug}`;
  const price = priceLabel(product.price);
  const priceText = product.price === null ? price : price.replace('$', '$ ');

  return (
    <article className={`product-card product-card--${variant}`} style={style}>
      <Link to={href} className="product-card__media" aria-label={product.name}>
        <img className="product-card__hover" src={img(product.hoverImg)} alt="" loading="lazy" />
        <span className="product-card__word" aria-hidden="true">
          {product.word}
        </span>
        {product.fullBleed ? (
          <img className="product-card__bg" src={img(product.img)} alt="" loading="lazy" />
        ) : (
          <span className="product-card__photo">
            <img src={img(product.img)} alt="" loading="lazy" />
          </span>
        )}
      </Link>

      <div className="product-card__info">
        <p className="product-card__row">
          <span className="product-card__name">{product.name}</span>
          <span className="product-card__price">{priceText}</span>
        </p>
        <p className="product-card__subtitle">{product.subtitle}</p>
      </div>

      <button className="btn btn--soft product-card__add" onClick={() => add(product.slug)}>
        <span className="product-card__add-long">Agregar al carrito{product.price !== null && ` · ${price}`}</span>
        <span className="product-card__add-short">Agregar</span>
      </button>
    </article>
  );
}
