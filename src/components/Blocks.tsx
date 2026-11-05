import { protocol } from '../data/content';
import type { Rich as RichText } from '../data/types';
import { img } from '../lib/format';
import { Button } from './Button';
import { Rich } from './Rich';
import './Blocks.css';

/** Frase destacada a lo ancho, entre secciones. */
export function Quote({ text, className = '' }: { text: RichText; className?: string }) {
  return <Rich as="blockquote" className={`quote-block ${className}`.trim()} text={text} />;
}

/** Cierre "tu piel merece un protocolo propio" que se repite al pie de varias páginas. */
export function ProtocolCta() {
  return (
    <section className="protocol">
      <div className="protocol__body">
        <Rich as="h2" className="protocol__title" text={protocol.title} />
        <p className="protocol__text">{protocol.text}</p>
        <Button to="/reservas" variant="link" className="protocol__link">
          Reservar turno
        </Button>
        <Button to="/reservas" full className="protocol__btn">
          Reservar turno
        </Button>
      </div>
      <img className="protocol__img" src={img(protocol.img)} alt="" loading="lazy" />
    </section>
  );
}

interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
}

/** Selector de cantidad − 1 +. */
export function QtyStepper({ value, onChange, label, min = 1, max = 10 }: StepperProps) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Restar uno">
        −
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Sumar uno">
        +
      </button>
    </div>
  );
}
