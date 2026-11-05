import { createContext, useContext, useEffect, useState, type FormEvent } from 'react';
import { Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { img } from '../lib/format';
import { Agenda } from './Agenda';
import { db, supabase } from './db';
import { ProductoForm } from './ProductoForm';
import { Productos } from './Productos';
import { Reservas } from './Reservas';
import { Stock } from './Stock';
import { ErrorNote, Icon, type IconName } from './ui';
import './admin.css';

const LOGO = '6006c70d31';
const FOTO = 'a1cee40140';

/** Para que cada pantalla avise que cambió algo y se actualicen los contadores del menú. */
const AdminContext = createContext({ refresh: () => {} });
export const useAdmin = () => useContext(AdminContext);

export default function Admin() {
  if (!supabase) {
    return <p className="adm-empty">Falta configurar Supabase: VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY (ver README).</p>;
  }
  return <Gate />;
}

function Gate() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    document.title = 'Panel · Jazmín Sarasti';
    db.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = db.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return setAllowed(null);
    db.rpc('is_admin').then(({ data }) => setAllowed(data === true));
  }, [session]);

  if (session === undefined || (session && allowed === null)) return null;
  if (!session) return <Login />;
  if (!allowed) return <Login denied />;
  return <Shell email={session.user.email ?? ''} />;
}

function Login({ denied }: { denied?: boolean }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(denied ? 'Esta cuenta no tiene acceso al panel.' : null);
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    if (denied) await db.auth.signOut();
    const { error } = await db.auth.signInWithPassword({ email: email.trim(), password });
    setSending(false);
    if (error) setError(error.message.includes('Invalid login') ? 'El correo o la contraseña no coinciden.' : `No se pudo ingresar: ${error.message}`);
  };

  return (
    <div className="adm-login">
      <div className="adm-login__photo">
        <img src={img(FOTO)} alt="" />
        <img className="adm-login__logo" src={img(LOGO)} alt="Jazmín Sarasti Dermocosmética" />
      </div>
      <form className="adm-login__form" onSubmit={onSubmit}>
        <p className="adm-eyebrow">Panel interno</p>
        <h1 className="adm-title">ingresá al panel</h1>
        <div className="field">
          <label htmlFor="adm-email">Correo</label>
          <input id="adm-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="adm-pass">Contraseña</label>
          <input id="adm-pass" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <ErrorNote text={error} />
        <button className="btn btn--primary btn--full" disabled={sending}>
          Ingresar
        </button>
      </form>
    </div>
  );
}

const items: { to: string; label: string; icon: IconName; count?: 'reservas' | 'stock' }[] = [
  { to: 'agenda', label: 'Agenda', icon: 'cal' },
  { to: 'reservas', label: 'Reservas', icon: 'box', count: 'reservas' },
  { to: 'productos', label: 'Productos', icon: 'img' },
  { to: 'stock', label: 'Stock', icon: 'alert', count: 'stock' },
];

function Shell({ email }: { email: string }) {
  const { pathname } = useLocation();
  const [tick, setTick] = useState(0);
  const [counts, setCounts] = useState({ reservas: 0, stock: 0 });

  useEffect(() => {
    Promise.all([
      db.from('reservas').select('id', { count: 'exact', head: true }).in('estado', ['nueva', 'esperando_stock']),
      db.from('v_stock').select('disponible, stock_min'),
    ]).then(([r, s]) =>
      setCounts({
        reservas: r.count ?? 0,
        stock: (s.data ?? []).filter((x: { disponible: number; stock_min: number }) => x.disponible <= x.stock_min).length,
      }),
    );
  }, [pathname, tick]);

  return (
    <AdminContext.Provider value={{ refresh: () => setTick((t) => t + 1) }}>
      <div className="adm">
        <nav className="adm-nav" aria-label="Panel">
          <img className="adm-nav__logo" src={img(LOGO)} alt="Jazmín Sarasti" />
          <ul className="adm-nav__list">
            {items.map((it) => (
              <li key={it.to}>
                <NavLink to={it.to} className="adm-nav__item">
                  <span className="adm-nav__icon">
                    <Icon name={it.icon} size={22} />
                    {it.count && counts[it.count] > 0 && <b className="adm-nav__count">{counts[it.count]}</b>}
                  </span>
                  <span className="adm-nav__label">{it.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="adm-nav__foot">
            <a href="/" target="_blank" rel="noreferrer" className="adm-nav__web">
              Ver el sitio <Icon name="ext" size={16} />
            </a>
            <p className="adm-nav__user">
              <strong>Jazmín Sarasti</strong>
              <span>{email}</span>
            </p>
            <button type="button" className="adm-nav__out" onClick={() => db.auth.signOut()}>
              Salir
            </button>
          </div>
        </nav>
        <main className="adm-main">
          <Routes>
            <Route index element={<Navigate to="agenda" replace />} />
            <Route path="agenda" element={<Agenda />} />
            <Route path="reservas" element={<Reservas />} />
            <Route path="productos" element={<Productos />} />
            <Route path="productos/nuevo" element={<ProductoForm />} />
            <Route path="productos/rutina" element={<ProductoForm rutina />} />
            <Route path="productos/:id" element={<ProductoForm />} />
            <Route path="stock" element={<Stock />} />
            <Route path="*" element={<Navigate to="agenda" replace />} />
          </Routes>
        </main>
      </div>
    </AdminContext.Provider>
  );
}
