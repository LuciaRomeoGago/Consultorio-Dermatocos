import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProtocolCta } from '../components/Blocks';
import { ProductCard } from '../components/ProductCard';
import { Rich } from '../components/Rich';
import { ValuesMarquee } from '../components/ValuesMarquee';
import { aboutPage as page, approach } from '../data/content';
import { findProduct } from '../data/products';
import { site } from '../data/site';
import type { Product } from '../data/types';
import { img } from '../lib/format';
import { Instagram } from './Home';
import './Conocenos.css';

const slide = (i: number, active: number) => (i === active ? 'active' : i < active ? 'before' : 'after');

/** Página "Conócenos" (frames "Desktop — Conócenos" y "Celular — Conócenos"). */
export function Conocenos() {
  return (
    <>
      <Hello />
      <ValuesMarquee items={site.values} />
      <Note />
      <Focus />
      <p className="ab-phrase">
        <span className="ab-phrase__strong">Primero,</span> la <span className="ab-phrase__gap" aria-hidden="true" /> <span className="script">salud</span>
        <br />
        <span className="ab-phrase__strong">de tu piel.</span>
      </p>
      <Products />
      <Values />
      <Behind />
      <div className="ab-ig">
        <Instagram />
      </div>
      <ProtocolCta />
    </>
  );
}

/** 01 · Hola, soy Jazmín */
function Hello() {
  return (
    <section className="container-card ab-hello">
      <div className="ab-hello__panel">
        <p className="ab-label">Conócenos</p>
        <Rich as="h1" className="ab-hello__title" text={page.title} />
        <p className="ab-hello__lead">{page.lead}</p>
        <p className="ab-hello__text">{page.text}</p>
        <div className="ab-hello__actions">
          <Link to="/reservas" className="btn btn--primary">
            Reservá un turno
          </Link>
          <Link to="/tratamientos" className="btn btn--link">
            Ver tratamientos
          </Link>
        </div>
      </div>
      <img className="ab-hello__img" src={img(page.heroImg)} alt="Jazmín Sarasti" />
    </section>
  );
}

/** 02 · Una nota de Jazmín */
function Note() {
  return (
    <section className="container-card">
      <figure className="ab-note">
        <p className="ab-label">Una nota de Jazmín</p>
        <blockquote className="ab-note__text">{page.note}</blockquote>
        <figcaption className="ab-note__sign script">Jazmín</figcaption>
      </figure>
    </section>
  );
}

/** 03 · Mi enfoque: misión, visión y cómo trabajo, con la foto que se desliza. */
/** "Misión" → "mi" + "misión"; "Cómo trabajo" → "cómo" + "trabajo" (la segunda palabra va en manuscrita). */
function focusTitle(label: string) {
  const [first, ...rest] = label.toLowerCase().split(' ');
  return rest.length ? [first, rest.join(' ')] : ['mi', first];
}

function Focus() {
  const [active, setActive] = useState(0);
  const tab = approach.tabs[active];
  const title = focusTitle(tab.label);

  return (
    <section className="ab-focus">
      <div className="container-card ab-desktop">
        <div className="ab-slider">
          <div className="ab-slider__images" aria-hidden="true">
            {page.focusImgs.map((key, i) => (
              <img key={key} src={img(key)} alt="" loading="lazy" data-state={slide(i, active)} />
            ))}
          </div>
          <div className="ab-slider__panel ab-focus__panel">
            <p className="ab-label">Conocé mi enfoque</p>
            <div className="ab-focus__body" key={active} aria-live="polite">
              <h2 className={`ab-focus__title${tab.label.includes(' ') ? ' ab-focus__title--largo' : ''}`}>
                {title[0]}
                {'\n'}
                <span className="script">{title[1]}</span>
              </h2>
              <p className="ab-focus__text">{tab.text}</p>
            </div>
            <div className="ab-focus__tabs" role="tablist" aria-label="Mi enfoque">
              {approach.tabs.map((t, i) => (
                <button key={t.label} role="tab" aria-selected={i === active} onClick={() => setActive(i)} onMouseEnter={() => setActive(i)}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Celular: tarjetas de 300 que se deslizan. */}
      <div className="ab-mobile">
        <p className="container ab-label">Conocé mi enfoque</p>
        <ul className="scroller ab-cards ab-cards--focus">
          {approach.tabs.map((t, i) => {
            const [a, b] = focusTitle(t.label);
            return (
              <li key={t.label}>
                <img src={img(page.focusImgs[i])} alt="" loading="lazy" />
                <h3 className="ab-cards__title">
                  {a} <span className="script">{b}</span>
                </h3>
                <p>{t.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** 05 · Mis productos: "los más elegidos" en un carrusel que se desliza. */
function Products() {
  const products = page.products.map(findProduct).filter((p): p is Product => !!p);
  return (
    <section className="ab-products">
      <div className="container ab-products__head">
        <div>
          <p className="ab-label">Deslizá</p>
          <h2 className="ab-products__title">
            los más <span className="script">elegidos</span>
          </h2>
        </div>
        <Link to="/tienda" className="btn btn--link">
          Ir a la tienda
        </Link>
      </div>
      <ul className="scroller ab-products__list">
        {products.map((p) => (
          <li key={p.slug}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** 06 · Nuestros valores: al elegir un valor cambian la foto y el texto. */
function Values() {
  const [active, setActive] = useState(0);
  return (
    <section className="ab-values">
      <div className="container-card ab-desktop">
        <div className="ab-slider">
          <div className="ab-slider__images" aria-hidden="true">
            {page.values.map((v, i) => (
              <img key={v.title} src={img(v.slideImg)} alt="" loading="lazy" data-state={slide(i, active)} />
            ))}
          </div>
          <div className="ab-slider__panel ab-values__panel">
            <p className="ab-label">Nuestros valores</p>
            <div className="ab-values__words" role="group" aria-label="Nuestros valores">
              {page.values.map((v, i) => (
                <button key={v.title} aria-pressed={i === active} onClick={() => setActive(i)} onMouseEnter={() => setActive(i)}>
                  {v.title}
                </button>
              ))}
            </div>
            <p className="ab-values__text" key={active} aria-live="polite">
              {page.values[active].text}
            </p>
          </div>
        </div>
      </div>

      {/* Celular: tarjetas de 280 que se deslizan. */}
      <div className="ab-mobile">
        <p className="container ab-label">Nuestros valores</p>
        <ul className="scroller ab-cards ab-cards--values">
          {page.values.map((v) => (
            <li key={v.title}>
              <img src={img(v.img)} alt="" loading="lazy" />
              <h3 className="ab-cards__word">{v.title}</h3>
              <p>{v.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** 07 · Detrás del consultorio */
function Behind() {
  const b = page.behind;
  return (
    <section className="container-card ab-behind">
      <img className="ab-behind__img" src={img(b.img)} alt="Jazmín Sarasti en el consultorio" loading="lazy" />
      <div className="ab-behind__panel">
        <p className="ab-label">Detrás del consultorio</p>
        <Rich as="h2" className="ab-behind__name" text={b.name} />
        <p className="ab-behind__text">{b.text}</p>
        <dl className="ab-behind__facts">
          {b.facts.map(([label, value]) => (
            <div key={label}>
              <dt>{label}:</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
