import { useEffect, useId, useRef, type ReactNode } from 'react';

const ICON = {
  cal: 'M5 7h14v12H5zM5 11h14M9 4v4M15 4v4',
  box: 'M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8',
  img: 'M4 6h16v12H4zM4 15l5-4.5 4 3.5 2.5-2 4.5 4',
  alert: 'M12 4l9 15H3zM12 10v4M12 16.5v.1',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  x: 'M6 6l12 12M18 6L6 18',
  left: 'M15 6l-6 6 6 6',
  right: 'M9 6l6 6-6 6',
  check: 'M5 12.5l5 4.5 9-10',
  edit: 'M5 19v-3.5l10-10 3.5 3.5-10 10zM13 7.5l3.5 3.5',
  trash: 'M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12',
  search: 'M10.5 4a6.5 6.5 0 110 13 6.5 6.5 0 010-13zM15.5 15.5L20 20',
  wa: 'M5 19l1.2-3.4A7 7 0 1112 19a7 7 0 01-3.6-1.1z',
  ext: 'M14 5h5v5M19 5l-8 8M17 14v5H5V7h5',
  upload: 'M12 15V4M7 9l5-5 5 5M5 15v4h14v-4',
} as const;

export type IconName = keyof typeof ICON;

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICON[name]} />
    </svg>
  );
}

export type Tone = 'ok' | 'warn' | 'danger' | 'lila' | 'gray';

export function Badge({ tone = 'gray', dot, children }: { tone?: Tone; dot?: boolean; children: ReactNode }) {
  return (
    <span className={`adm-badge adm-badge--${tone}`}>
      {dot && <i aria-hidden="true" />}
      {children}
    </span>
  );
}

interface DialogProps {
  title: string;
  sub?: ReactNode;
  kind?: 'drawer' | 'modal';
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

/** Panel lateral (escritorio) u hoja inferior (celular). `modal` es la ventana centrada. */
export function Dialog({ title, sub, kind = 'drawer', onClose, children, footer }: DialogProps) {
  const id = useId();
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close.current();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="adm-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`adm-dialog adm-dialog--${kind}`} role="dialog" aria-modal="true" aria-labelledby={id}>
        <header className="adm-dialog__head">
          <div>
            <h2 id={id}>{title}</h2>
            {sub && <p>{sub}</p>}
          </div>
          <button type="button" className="adm-icon-btn" onClick={onClose} aria-label="Cerrar">
            <Icon name="x" size={18} />
          </button>
        </header>
        <div className="adm-dialog__body">{children}</div>
        {footer && <footer className="adm-dialog__foot">{footer}</footer>}
      </div>
    </div>
  );
}

export function Toast({ text, onDone }: { text: string; onDone: () => void }) {
  const done = useRef(onDone);
  done.current = onDone;
  useEffect(() => {
    const t = setTimeout(() => done.current(), 5000);
    return () => clearTimeout(t);
  }, [text]);
  return (
    <p className="adm-toast" role="status">
      <span className="adm-toast__ok">
        <Icon name="check" size={14} />
      </span>
      {text}
    </p>
  );
}

export function ErrorNote({ text }: { text: string | null }) {
  return text ? (
    <p className="adm-error" role="alert">
      {text}
    </p>
  ) : null;
}

/** Casilla o radio con el estilo del panel. */
export function Check({ checked, onChange, label, sub, radio, name }: { checked: boolean; onChange: (v: boolean) => void; label: string; sub?: string; radio?: boolean; name?: string }) {
  return (
    <label className="adm-check">
      <input type={radio ? 'radio' : 'checkbox'} name={name} checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>
        {label}
        {sub && <small>{sub}</small>}
      </span>
    </label>
  );
}
