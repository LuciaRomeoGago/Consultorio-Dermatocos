import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { nav, site } from '../data/site';
import { treatments } from '../data/treatments';
import { useCart } from '../lib/cart';
import { img } from '../lib/format';
import { whatsappUrl } from '../lib/whatsapp';
import './Layout.css';

const LOGO = '6006c70d31';
const ISOTIPO = '258e373442';

export function Layout() {
  const { pathname, hash } = useLocation();

  // Al cambiar de página se vuelve arriba, salvo que el link apunte a una sección.
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <TopBar />
      <Header />
      <main id="contenido">
        <Outlet />
      </main>
      <Footer />
      <CartBubble />
    </>
  );
}

/** Barra lavanda: tres mensajes en escritorio, uno en celular. */
function TopBar() {
  return (
    <div className="topbar">
      <ul className="topbar__list">
        {site.topBar.map((text) => (
          <li key={text}>{text}</li>
        ))}
      </ul>
    </div>
  );
}

/** Navegación flotante: en escritorio, una píldora con el logo al centro; en celular se despliega. */
function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const [left, right] = [nav.slice(0, 2), nav.slice(2)];

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className={`header${open ? ' header--open' : ''}`}>
      <div className="header__bar">
        <nav className="header__links header__links--left" aria-label="Principal">
          {left.map((item) => (
            <NavLink key={item.to} to={item.to} className="header__link">
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/" className="header__logo" aria-label={`${site.name}, inicio`}>
          <img src={img(LOGO)} alt="" width={169} height={83} />
        </Link>

        <div className="header__links header__links--right">
          {right.map((item) => (
            <NavLink key={item.to} to={item.to} className="header__link">
              {item.label}
            </NavLink>
          ))}
          <Link to="/reservas" className="btn btn--soft header__cta">
            Reservar turno
          </Link>
        </div>

        <button
          className="header__toggle"
          aria-expanded={open}
          aria-controls="menu-celular"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? 'Cerrar menú' : 'Abrir menú'}</span>
          <span className="header__burger" aria-hidden="true" />
        </button>
      </div>

      <div id="menu-celular" className="header__drawer" hidden={!open}>
        {nav.map((item) => (
          <NavLink key={item.to} to={item.to} className="header__drawer-link">
            {item.label}
          </NavLink>
        ))}
        <Link to="/reservas" className="btn btn--soft btn--full">
          Reservar turno
        </Link>
      </div>
    </header>
  );
}

/** Acceso al pedido: aparece solo cuando hay productos agregados. */
function CartBubble() {
  const { count } = useCart();
  const { pathname } = useLocation();
  if (count === 0 || pathname === '/pedido') return null;
  return (
    <Link to="/pedido" className="cart-bubble" aria-label={`Ver tu pedido, ${count} productos`}>
      Tu pedido <span>{count}</span>
    </Link>
  );
}

const info = [
  { label: 'Sobre el consultorio', to: '/conocenos' },
  { label: 'Profesionales', to: '/conocenos#profesional' },
  { label: 'Preguntas frecuentes', to: '/tratamientos#preguntas' },
  { label: 'Turnos y consultas', to: '/reservas' },
];

/** Orden de las dos columnas de tratamientos en el footer de Figma. */
const footerTreatments = [
  ['skincoaching', 'facial-anti-age', 'para-manchas', 'facial-para-acne', 'rosacea-piel-sensible'],
  ['revitalizante-antioxidante', 'higiene-facial-profunda', 'microneedling-exosomas', 'dermaplaning', 'hidralips'],
].map((slugs) => slugs.map((slug) => treatments.find((t) => t.slug === slug)!));

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <img className="footer__logo" src={img(LOGO)} alt={site.name} width={470} height={232} loading="lazy" />

        <div className="footer__col footer__col--treatments">
          <h2 className="footer__title">Tratamientos</h2>
          <div className="footer__twocol">
            {footerTreatments.map((group, i) => (
              <ul key={i}>
                {group.map((t) => (
                  <li key={t.slug}>
                    <Link to={`/tratamientos/${t.slug}`}>{t.name}</Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        <div className="footer__col">
          <h2 className="footer__title">Información</h2>
          <ul>
            {info.map((l) => (
              <li key={l.label}>
                <Link to={l.to}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h2 className="footer__title">Contacto</h2>
          <ul>
            <li>{site.address}</li>
            <li>{site.city}</li>
            <li>
              <a href={whatsappUrl()} target="_blank" rel="noreferrer">
                WhatsApp: {site.whatsapp}
              </a>
            </li>
            <li>
              <a href={site.instagramUrl} target="_blank" rel="noreferrer">
                Instagram: {site.instagram}
              </a>
            </li>
            <li>{site.hours}</li>
          </ul>
        </div>

        <div className="footer__legal">
          <p>© 2026 {site.name}. Todos los derechos reservados.</p>
          <img className="footer__isotipo" src={img(ISOTIPO)} alt="" width={92} height={92} loading="lazy" />
        </div>
      </div>
    </footer>
  );
}
