import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Accordion } from '../components/Accordion';
import { NotSureCard } from '../components/NotSureCard';
import { PanelGallery } from '../components/PanelGallery';
import { ProductCard } from '../components/ProductCard';
import { Reviews } from '../components/Reviews';
import { TreatmentGrid } from '../components/TreatmentGrid';
import { ValuesMarquee } from '../components/ValuesMarquee';
import { approach, home } from '../data/content';
import { categories, findProduct, listedProducts } from '../data/products';
import { site } from '../data/site';
import type { Category, Product } from '../data/types';
import { useCart } from '../lib/cart';
import { formatPrice, img } from '../lib/format';
import './Home.css';

const byslug = (slugs: string[]) => slugs.map(findProduct).filter((p): p is Product => !!p);

export function Home() {
  return (
    <>
      <section className="home-hero">
        <img src={img(home.heroImg)} alt="" />
        <h1 className="sr-only">{site.name}</h1>
      </section>

      <p className="home-quote phrase">
        "Cuidamos la salud de <span className="script">tu piel</span> como nuestra{' '}
        <span className="script">máxima prioridad</span>"
      </p>

      <Salud />
      <ValuesMarquee items={site.values} />

      <section className="section home-treatments">
        <div className="container">
          <h2 className="t-section">
            tratamientos a <span className="script">tu medida</span>
          </h2>
          <Link to="/tratamientos" className="btn btn--link home-treatments__all">
            Ver todos
          </Link>
        </div>
        <div className="home-treatments__row">
          <TreatmentGrid />
        </div>
      </section>

      <Approach />
      <BestSellers />
      <Routine />
      <Reviews />
      <Instagram />
    </>
  );
}

function Salud() {
  return (
    <section className="home-salud">
      <img className="home-salud__img" src={img(home.salud.img)} alt="" fetchPriority="high" />
      <div className="home-salud__panel">
        <div className="home-salud__content">
          <h2 className="t-display">salud &amp; piel</h2>
          <p className="home-salud__text">{home.salud.text}</p>
          <div className="actions">
            <Link to="/reservas" className="btn btn--primary">
              Reservá un turno
            </Link>
            <Link to="/tratamientos" className="btn btn--link">
              Ver tratamientos
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/** "Hola, soy jazmín · Conocé mi enfoque": al abrir cada ítem cambia la foto. */
function Approach() {
  const [active, setActive] = useState<number | null>(null);
  const images = [{ key: approach.img }, ...approach.tabs.map((t) => ({ key: t.img }))];

  return (
    <div className="container-card home-block">
      <PanelGallery images={images} active={active === null ? 0 : active + 1} label="Conocé mi enfoque">
        <h2 className="t-display home-approach__title">
          {'Hola,\nsoy '}
          <span className="script">jazmín</span>
        </h2>
        <div className="home-approach__intro">
          <p className="home-approach__subtitle">conocé mi enfoque</p>
          <p className="home-approach__lead">{approach.lead}</p>
        </div>
        <Accordion
          className="home-panel-accordion"
          items={approach.tabs.map((t) => [t.label, t.text] as [string, string])}
          active={active}
          onChange={setActive}
        />
      </PanelGallery>
    </div>
  );
}

/** "Los más elegidos": chips por categoría, dos productos y la tarjeta "¿No sabés qué usar?". */
export function BestSellers() {
  const [category, setCategory] = useState<Category | null>(null);
  const products = category
    ? listedProducts.filter((p) => p.category === category).slice(0, 2)
    : byslug(home.bestSellers);

  return (
    <section className="section home-shop">
      <div className="container">
        <h2 className="t-section">los más elegidos</h2>
        <div className="home-shop__bar">
          <div className="chips chips--scroll" role="group" aria-label="Filtrar por categoría">
            <button type="button" className="chip" aria-pressed={!category} onClick={() => setCategory(null)}>
              Todo
            </button>
            {categories.map((c) => (
              <button type="button" key={c} className="chip" aria-pressed={category === c} onClick={() => setCategory(c)}>
                {c}
              </button>
            ))}
          </div>
          <Link to="/tienda" className="btn btn--link">
            Ir a la tienda
          </Link>
        </div>
      </div>

      <div className="container home-shop__grid">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
        {products.length === 0 && <p className="lead">Por ahora no hay productos en esta categoría.</p>}
        <NotSureCard />
      </div>
    </section>
  );
}

/** "Rutinas completas": rutina luz con sus tres productos; al abrir cada uno aparece su foto. */
function Routine() {
  const [active, setActive] = useState<number | null>(null);
  const { add } = useCart();
  const navigate = useNavigate();
  const routine = findProduct(home.routine.slug)!;
  const steps = home.routine.steps;

  const buy = () => {
    add(routine.slug);
    navigate('/pedido');
  };

  const images = [{ key: home.routine.img }, ...steps.map((s) => ({ key: findProduct(s.slug)!.img, bg: s.bg }))];

  return (
    <section className="section home-routine">
      <div className="container">
        <h2 className="t-section">
          rutinas <span className="script">completas</span>
        </h2>
      </div>
      <div className="container-card">
        <PanelGallery images={images} active={active === null ? 0 : active + 1} label="Rutina luz">
          <div className="home-routine__head">
            <h3 className="t-display">rutina luz</h3>
            <p className="home-routine__subtitle">{routine.subtitle}</p>
          </div>
          <p className="home-routine__text">{home.routine.text}</p>
          <div className="home-routine__buy">
            <Accordion
              className="home-panel-accordion"
              items={steps.map((s) => [findProduct(s.slug)!.name, s.text] as [string, string])}
              active={active}
              onChange={setActive}
            />
            <button className="btn btn--primary btn--full" onClick={buy}>
              Comprar la rutina · {formatPrice(routine.price ?? 0)}
            </button>
          </div>
        </PanelGallery>
      </div>
    </section>
  );
}

/** "vos + jazmín": posts de Instagram (también al pie de Conócenos). */
export function Instagram() {
  return (
    <section className="section home-ig">
      <div className="container home-ig__head">
        <h2 className="t-section">
          vos + <span className="script">jazmín</span>
        </h2>
        <a className="btn btn--secondary home-ig__follow" href={site.instagramUrl} target="_blank" rel="noreferrer">
          Seguinos en {site.instagram}
        </a>
      </div>
      <ul className="home-ig__posts">
        {home.instagram.posts.map((key) => (
          <li key={key}>
            <a href={site.instagramUrl} target="_blank" rel="noreferrer" aria-label="Ver en Instagram">
              <img src={img(key)} alt="" loading="lazy" />
            </a>
          </li>
        ))}
      </ul>
      <div className="container home-ig__follow-mobile">
        <a className="btn btn--secondary btn--full" href={site.instagramUrl} target="_blank" rel="noreferrer">
          Seguinos en {site.instagram}
        </a>
      </div>
    </section>
  );
}
