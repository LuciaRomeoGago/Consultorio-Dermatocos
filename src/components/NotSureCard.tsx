import { Link } from 'react-router-dom';
import { shopPage } from '../data/content';
import { img } from '../lib/format';
import './NotSureCard.css';

/** Tarjeta "¿No sabés qué usar?": deriva a un turno de Skincoaching. */
export function NotSureCard({ wide = false }: { wide?: boolean }) {
  return (
    <article className={`not-sure${wide ? ' not-sure--wide' : ''}`}>
      <img src={img(shopPage.notSure.img)} alt="" loading="lazy" />
      <h3 className="not-sure__title">{shopPage.notSure.title}</h3>
      <Link to="/reservas?tratamiento=skincoaching" className="btn btn--soft not-sure__btn">
        Reservá un turno
      </Link>
    </article>
  );
}
