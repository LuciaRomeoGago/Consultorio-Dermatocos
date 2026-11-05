import { Link } from 'react-router-dom';
import { Accordion } from '../components/Accordion';
import { ProtocolCta, Quote } from '../components/Blocks';
import { ProductCard } from '../components/ProductCard';
import { Reviews } from '../components/Reviews';
import { Rich } from '../components/Rich';
import { SessionSteps } from '../components/SessionSteps';
import { TreatmentDetail } from '../components/TreatmentDetail';
import { TreatmentGrid } from '../components/TreatmentGrid';
import { ValuesMarquee } from '../components/ValuesMarquee';
import { treatmentsPage as page } from '../data/content';
import { findProduct } from '../data/products';
import { site } from '../data/site';
import type { Product } from '../data/types';
import { img } from '../lib/format';
import './Tratamientos.css';

/** Página "Tratamientos" (frames "Desktop — Tratamientos" y "Celular — Tratamientos"). */
export function Tratamientos() {
  const routine = page.homeRoutine.map(findProduct).filter((p): p is Product => !!p);

  return (
    <>
      <div className="tt-hero">
        <img src={img(page.heroImg)} alt="" />
      </div>

      <section className="tt-intro">
        <div className="tt-intro__head">
          <Rich as="h1" className="tt-intro__title" text={page.title} />
          <a href="#detalle" className="btn btn--primary tt-intro__btn">
            Explorar
          </a>
        </div>
        <div className="tt-intro__box">
          <p>{page.diagnosis}</p>
        </div>
      </section>

      <ValuesMarquee items={site.values} />

      <section className="tt-offer">
        <div className="container">
          <Rich as="h2" className="t-section" text={page.offerTitle} />
          <p className="tt-offer__text">{page.offerText}</p>
        </div>
        <div className="tt-offer__row">
          <TreatmentGrid />
        </div>
      </section>

      <TreatmentDetail />

      <Quote text={page.quote} className="tt-quote" />

      <section className="container-card tt-session" aria-label="Cómo es una sesión">
        <SessionSteps steps={page.session} />
      </section>

      <section className="container tt-routine">
        <div className="tt-routine__head">
          <h2 className="t-section">tu rutina en casa</h2>
          <Link to="/tienda" className="btn btn--link">
            Ir a la tienda
          </Link>
        </div>
        <div className="product-grid tt-routine__grid">
          {routine.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <Reviews />

      <section className="container tt-faq" id="preguntas">
        <Rich as="h2" className="tt-faq__title" text={[['preguntas\n', 0], ['frecuentes', 1]]} />
        <Accordion items={page.faq} />
      </section>

      <ProtocolCta />
    </>
  );
}
