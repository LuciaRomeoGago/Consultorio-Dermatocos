import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { QtyStepper } from '../components/Blocks';
import { Button } from '../components/Button';
import { ContactFields } from '../components/ContactFields';
import { Rich } from '../components/Rich';
import { orderPage as page } from '../data/content';
import { site } from '../data/site';
import { hasBackend, rpc } from '../lib/api';
import { useCart } from '../lib/cart';
import { formatPrice, img, priceLabel } from '../lib/format';
import { emptyContact, validateContact, type ContactErrors } from '../lib/validation';
import { orderMessage, whatsappUrl } from '../lib/whatsapp';
import './Pedido.css';

type PaymentId = (typeof page.payments)[number]['id'];

/** Página "Tu pedido" (frames "Desktop — Tu pedido" y "Celular — Tu pedido"). El pedido sale por WhatsApp. */
export function Pedido() {
  const { items, subtotal, hasUnpriced, setQty, remove, clear } = useCart();
  const [contact, setContact] = useState(emptyContact);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [payment, setPayment] = useState<PaymentId>(page.payments[0].id);
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validateContact(contact);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const label = page.payments.find((p) => p.id === payment)!.label;
    if (!hasBackend) {
      const url = whatsappUrl(orderMessage(items, subtotal, contact, label));
      window.open(url, '_blank', 'noopener');
      setSentUrl(url);
      clear();
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const id = await rpc<number>('crear_reserva', {
        p_nombre: contact.name,
        p_telefono: contact.phone,
        p_email: contact.email,
        p_comentario: contact.comment || null,
        p_pago: payment,
        p_items: items.map((i) => ({ slug: i.product.slug, qty: i.qty })),
      });
      setSaved(true);
      setSentUrl(whatsappUrl(`Pedido #${id}\n\n${orderMessage(items, subtotal, contact, label)}`));
      clear();
    } catch (err) {
      setSaveError(
        err instanceof Error && err.message.includes('producto_inexistente')
          ? 'Uno de los productos ya no está en la tienda. Quitalo y probá de nuevo.'
          : 'No pudimos guardar el pedido. Probá de nuevo o escribinos por WhatsApp.',
      );
    } finally {
      setSaving(false);
    }
  };

  const head = (title = page.title, lead: string = page.lead) => (
    <header className="order__head">
      <Rich as="h1" className="order__title" text={title} />
      <p className="order__lead">{lead}</p>
    </header>
  );

  if (sentUrl) {
    return (
      <section className="container-card order order--message">
        {head(page.done.title, page.done.text)}
        <p className="order__pickup">
          {site.address}, {site.city}
          <br />
          {site.hours}
        </p>
        <div className="order__actions">
          <a className="btn btn--primary" href={sentUrl} target="_blank" rel="noreferrer">
            {saved ? 'Escribir por WhatsApp' : 'Abrir WhatsApp de nuevo'}
          </a>
          <Button to="/tienda" variant="link">
            Seguir comprando
          </Button>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="container-card order order--message">
        {head(page.title, 'Todavía no agregaste productos.')}
        <div className="order__actions">
          <Button to="/tienda">Ver productos</Button>
        </div>
      </section>
    );
  }

  return (
    <form className="container-card order" onSubmit={onSubmit} noValidate>
      {head()}

      <div className="order__main">
        <section aria-labelledby="productos">
          <h2 className="order__label" id="productos">
            Productos
          </h2>
          <ul className="order__items">
            {items.map(({ product, qty }) => (
              <li key={product.slug} className="order-item">
                <img src={img(product.img)} alt="" loading="lazy" />
                <Link to={`/tienda/${product.slug}`} className="order-item__name">
                  {product.name}
                </Link>
                <p className="order-item__desc">{product.subtitle}</p>
                <p className="order-item__stock" data-out={!product.inStock}>
                  {product.inStock ? 'Disponible' : page.outOfStock}
                </p>
                <QtyStepper value={qty} onChange={(n) => setQty(product.slug, n)} label={`Cantidad de ${product.name}`} />
                <p className="order-item__price">
                  {product.price === null ? priceLabel(null) : formatPrice(product.price * qty)}
                </p>
                <button type="button" className="order-item__remove" onClick={() => remove(product.slug)}>
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="datos" className="order__data">
          <h2 className="order__label" id="datos">
            Tus datos
          </h2>
          <ContactFields value={contact} errors={errors} onChange={setContact} />
        </section>
      </div>

      <aside className="order__summary" aria-labelledby="resumen">
        <div className="order__panel">
          <h2 className="order__label order__panel-title" id="resumen">
            Resumen
          </h2>
          <dl className="order__totals">
            <div>
              <dt>Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div>
              <dt>Retiro en el consultorio</dt>
              <dd>Sin costo</dd>
            </div>
            <div className="order__total">
              <dt>Total</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
          </dl>
          {hasUnpriced && <p className="order__hint">Los productos con precio a consultar se suman cuando te confirmemos el pedido.</p>}

          <h3 className="order__label order__small-title">Retiro en el consultorio</h3>
          <p className="order__pickup">
            {site.address}, {site.city}
            <br />
            {site.hours}
          </p>

          <fieldset className="order__payment">
            <legend className="order__label order__small-title">Forma de pago</legend>
            {page.payments.map((p) => (
              <label key={p.id} className="payment-option">
                <input type="radio" name="pago" value={p.id} checked={payment === p.id} onChange={() => setPayment(p.id)} />
                <span className="payment-option__title">{p.label}</span>
                <span className="payment-option__text">{p.text}</span>
              </label>
            ))}
          </fieldset>
        </div>

        {saveError && (
          <p className="field__error" role="alert">
            {saveError}
          </p>
        )}
        <button type="submit" className="btn btn--primary btn--full order__submit" disabled={saving}>
          {saving ? 'Reservando…' : 'Reservar pedido'}
        </button>
        <p className="order__note">{page.note}</p>
      </aside>
    </form>
  );
}
