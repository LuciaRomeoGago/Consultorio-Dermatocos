import { useState } from 'react';
import { img } from '../lib/format';
import './SessionSteps.css';

interface Step {
  label: string;
  title: string;
  text: string;
  img: string;
}

const pad = (n: number) => String(n + 1).padStart(2, '0');

/**
 * "Cómo es una sesión" (Pasos interactivo en Figma): foto a la izquierda que se desliza al cambiar
 * de paso, panel con número, título y descripción, y la lista de los cuatro pasos abajo.
 */
export function SessionSteps({ steps }: { steps: readonly Step[] }) {
  const [active, setActive] = useState(0);
  const step = steps[active];

  return (
    <>
      <div className="steps">
        <div className="steps__images" aria-hidden="true">
          {steps.map((s, i) => (
            <img
              key={s.label}
              src={img(s.img)}
              alt=""
              loading="lazy"
              data-state={i === active ? 'active' : i < active ? 'before' : 'after'}
            />
          ))}
        </div>

        <div className="steps__panel">
          <div className="steps__text" key={active} aria-live="polite">
            <p className="steps__num">{pad(active)}</p>
            <h3 className="steps__title">{step.title}</h3>
            <p className="steps__desc">{step.text}</p>
          </div>

          <ol className="steps__list" aria-label="Etapas de una sesión">
            {steps.map((s, i) => (
              <li key={s.label}>
                <button className="steps__step" aria-current={i === active ? 'step' : undefined} onClick={() => setActive(i)} onMouseEnter={() => setActive(i)}>
                  {s.label}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Celular: los cuatro pasos como tarjetas que se deslizan. */}
      <ol className="scroller steps-m" aria-label="Etapas de una sesión">
        {steps.map((s, i) => (
          <li key={s.label} className="steps-m__card">
            <img src={img(s.img)} alt="" loading="lazy" />
            <p className="steps-m__label">
              <span>{pad(i)}</span> {s.label}
            </p>
            <h3 className="steps-m__title">{s.title}</h3>
            <p className="steps-m__desc">{s.text}</p>
          </li>
        ))}
    </ol>
    </>
  );
}
