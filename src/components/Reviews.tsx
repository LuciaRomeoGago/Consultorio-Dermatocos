import { useState } from 'react';
import { reviews } from '../data/content';
import { img } from '../lib/format';
import './Reviews.css';

const Title = ({ id }: { id?: string }) => (
  <h2 className="reviews__title" id={id}>
    resultados reales <span className="script">que dicen más</span>
  </h2>
);

/**
 * Sección "Testimonios". Escritorio: una tarjeta con el texto a la izquierda y la foto a la derecha,
 * con flechas y contador (1 / 3). Como en Figma, la foto nueva entra desde la izquierda pasando por
 * debajo del panel translúcido y la anterior sale por la derecha. Celular: las reseñas se deslizan como tarjetas.
 */
export function Reviews() {
  const [index, setIndex] = useState(0);
  const review = reviews[index];
  const go = (step: number) => setIndex((i) => (i + step + reviews.length) % reviews.length);

  return (
    <section className="section reviews" aria-labelledby="reviews-title">
      {/* Escritorio */}
      <div className="container-card reviews__desktop">
        <div className="reviews__card">
          <div className="reviews__images">
            {reviews.map((r, i) => (
              <img
                key={r.img}
                src={img(r.imgWide ?? r.img)}
                alt=""
                data-state={i === index ? 'active' : i < index ? 'before' : 'after'}
                loading="lazy"
              />
            ))}
          </div>
          <div className="reviews__panel">
            <Title id="reviews-title" />
            <p className="reviews__label">Lo que dicen sus pacientes</p>
            <figure className="reviews__body" key={index} aria-live="polite">
              <p className="reviews__stars" aria-label="5 de 5 estrellas">
                ★★★★★
              </p>
              <blockquote className="reviews__text">“{review.text}”</blockquote>
              <figcaption>
                <span className="reviews__name">
                  {review.name} · {review.skin}
                </span>
                <span className="reviews__treatment">Tratamiento: {review.treatment}</span>
              </figcaption>
            </figure>
            <div className="reviews__controls">
              <button onClick={() => go(-1)} aria-label="Reseña anterior">
                ←
              </button>
              <span>
                {index + 1} / {reviews.length}
              </span>
              <button onClick={() => go(1)} aria-label="Reseña siguiente">
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Celular */}
      <div className="reviews__mobile">
        <div className="container">
          <p className="reviews__label">Lo que dicen sus pacientes</p>
          <Title />
        </div>
        <ul className="scroller reviews__list">
          {reviews.map((r) => (
            <li key={r.img} className="reviews__item">
              <img src={img(r.img)} alt="" loading="lazy" />
              <p className="reviews__stars" aria-label="5 de 5 estrellas">
                ★★★★★
              </p>
              <blockquote className="reviews__text">“{r.text}”</blockquote>
              <p className="reviews__name">
                {r.name} · {r.skin}
              </p>
              <p className="reviews__treatment">Tratamiento: {r.treatment}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
