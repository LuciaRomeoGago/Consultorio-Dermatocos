import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { treatmentsPage as page } from '../data/content';
import { findTreatment } from '../data/treatments';
import type { Treatment } from '../data/types';
import { img } from '../lib/format';
import { Rich } from './Rich';
import './TreatmentDetail.css';

const items = page.indexOrder.map(findTreatment).filter((t): t is Treatment => !!t);
const pad = (n: number) => String(n + 1).padStart(2, '0');

/**
 * Bloque "conocé cada tratamiento" (04 · Detalle tratamientos en Figma).
 * Lista numerada a la izquierda: siempre hay un tratamiento abierto, con su bajada y los botones.
 * A la derecha, la foto del tratamiento abierto aparece con un fundido.
 */
export function TreatmentDetail() {
  const [active, setActive] = useState(0);
  const baseId = useId();

  return (
    <section className="tdetail" id="detalle">
      <div className="tdetail__index">
        <p className="tdetail__eyebrow">Tratamientos</p>
        <Rich as="h2" className="tdetail__title" text={page.indexTitle} />

        {/* Celular: ficha con selector (Detalle de tratamientos en el frame de 390). */}
        <div className="tdetail__card">
          <label className="tdetail__select">
            <span className="sr-only">Elegí un tratamiento</span>
            <select value={active} onChange={(e) => setActive(Number(e.target.value))}>
              {items.map((t, i) => (
                <option key={t.slug} value={i}>
                  {t.name}
                </option>
              ))}
            </select>
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 9.5l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </label>
          <p className="tdetail__tagline">{items[active].tagline}</p>
          <p className="tdetail__meta">{items[active].meta}</p>
          <p className="tdetail__text">{items[active].detail}</p>
          <div className="tdetail__card-actions">
            <Link to={`/reservas?tratamiento=${items[active].slug}`} className="btn btn--primary btn--full">
              Reservar turno
            </Link>
            <Link to={`/tratamientos/${items[active].slug}`} className="btn btn--link">
              Ver tratamiento completo
            </Link>
          </div>
        </div>

        <ul className="tdetail__list">
          {items.map((t, i) => {
            const open = i === active;
            const panelId = `${baseId}-${t.slug}`;
            return (
              <li key={t.slug} className="tdetail__item" data-open={open}>
                <button
                  className="tdetail__row"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                >
                  <span className="tdetail__num">{pad(i)}</span>
                  <span className="tdetail__name">{t.name}</span>
                </button>
                <div id={panelId} className="tdetail__detail" hidden={!open}>
                  <p className="tdetail__tagline">{t.tagline}</p>
                  <p className="tdetail__meta">{t.meta}</p>
                  <div className="tdetail__actions">
                    <Link to={`/reservas?tratamiento=${t.slug}`} className="btn btn--primary">
                      Reservar turno
                    </Link>
                    <Link to={`/tratamientos/${t.slug}`} className="btn btn--link">
                      Ver tratamiento completo
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="tdetail__photos" aria-hidden="true">
        {items.map((t, i) => (
          <img key={t.slug} src={img(t.detailImg ?? t.cardImg)} alt="" data-active={i === active} loading="lazy" />
        ))}
      </div>
    </section>
  );
}
