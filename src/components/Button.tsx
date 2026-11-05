import type { ReactNode, MouseEventHandler } from 'react';
import { Link } from 'react-router-dom';

type Variant = 'primary' | 'secondary' | 'soft' | 'link';

interface Props {
  children: ReactNode;
  variant?: Variant;
  to?: string;
  href?: string;
  onClick?: MouseEventHandler;
  full?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}

export function Button({ children, variant = 'primary', to, href, onClick, full, type = 'button', className = '' }: Props) {
  const cls = `btn btn--${variant}${full ? ' btn--full' : ''} ${className}`.trim();
  if (to) {
    return (
      <Link to={to} className={cls} onClick={onClick}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick}>
      {children}
    </button>
  );
}
