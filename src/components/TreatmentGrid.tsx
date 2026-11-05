import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { bookingPage } from '../data/content';
import { treatments } from '../data/treatments';
import { img } from '../lib/format';
import './TreatmentGrid.css';

/**
 * Hilera de las 10 tarjetas de tratamiento (componente "Card tratamiento").
 * Al pasar el mouse la tarjeta sube y aparece un punto debajo del nombre.
 * En celular el carrusel sigue el orden de Figma para celular, que es el mismo de la reserva.
 */
export function TreatmentGrid() {
  return (
    <ul className="treatment-row scroller">
      {treatments.map((t) => (
        <li key={t.slug} style={{ '--order-m': bookingPage.order.indexOf(t.slug) } as CSSProperties}>
          <Link to={`/tratamientos/${t.slug}`} className="treatment-card">
            <img src={img(t.cardImg)} alt="" loading="lazy" width={206} height={258} />
            <span className="treatment-card__name">{t.name}</span>
            <span className="treatment-card__dot" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
