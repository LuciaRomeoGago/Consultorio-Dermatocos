import { useId, useState } from 'react';
import type { Faq } from '../data/types';
import './Accordion.css';

interface Props {
  items: readonly Faq[];
  /** Índice abierto, si el padre controla el estado (por ejemplo, para cambiar la foto de al lado). */
  active?: number | null;
  onChange?: (index: number | null) => void;
  className?: string;
}

/**
 * Componente "Acordeón" de Figma: título en mayúsculas, flecha a la derecha, una línea debajo de cada ítem.
 * Abrir un ítem cierra el anterior.
 */
export function Accordion({ items, active, onChange, className = '' }: Props) {
  const [internal, setInternal] = useState<number | null>(null);
  const open = active !== undefined ? active : internal;
  const baseId = useId();

  const toggle = (i: number) => {
    const next = open === i ? null : i;
    if (active === undefined) setInternal(next);
    onChange?.(next);
  };

  return (
    <div className={`accordion ${className}`.trim()}>
      {items.map(([title, body], i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <div className="accordion__item" key={title} data-open={isOpen}>
            <h3>
              <button className="accordion__trigger" aria-expanded={isOpen} aria-controls={panelId} onClick={() => toggle(i)}>
                {title}
                <svg className="accordion__icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 9.5l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </h3>
            <div id={panelId} className="accordion__panel" role="region" hidden={!isOpen}>
              <p>{body}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
