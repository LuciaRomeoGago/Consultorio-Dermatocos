import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Accordion } from '../components/Accordion';
import { ProtocolCta } from '../components/Blocks';
import { Rich } from '../components/Rich';
import { findTreatment, treatmentCommon as common } from '../data/treatments';
import type { Treatment } from '../data/types';
import { img } from '../lib/format';
import { NotFound } from './NotFound';
import './Tratamiento.css';

/** Ids de las secciones, en el mismo orden que `treatmentCommon.index`. */
const sectionIds = ['proceso', 'duracion', 'cuidados', 'para-tu-piel', 'activos', 'preguntas'];
const pad = (n: number) => String(n + 1).padStart(2, '0');
const slide = (i: number, active: number) => (i === active ? 'active' : i < active ? 'before' : 'after');

/** Ficha de tratamiento (frames "Desktop — Tratamiento anti-age" y "Celular — Tratamiento anti-age"). */
export function Tratamiento() {
  const { slug } = useParams();
  const treatment = findTreatment(slug);
  if (!treatment) return <NotFound />;

  return (
    <>
      <Hero treatment={treatment} />

      <nav className="tr-index" aria-label="En esta página">
        <ul>
          {common.index.map((label, i) => (
            <li key={label}>
              <a href={`#${sectionIds[i]}`}>
                <span>{pad(i)}</span>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <Intro treatment={treatment} />
      <Process treatment={treatment} />
      <Duration treatment={treatment} />
      <Care treatment={treatment} />
      <Conditions treatment={treatment} />
      <Actives treatment={treatment} />
      <Quotes />

      <section className="container tr-faq" id="preguntas">
        <Rich as="h2" className="tr-faq__title" text={[['preguntas\n', 0], ['frecuentes', 1]]} />
        <Accordion items={treatment.page.faq} />
      </section>

      <ProtocolCta />
    </>
  );
}

type Props = { treatment: Treatment };

/** 01 · Hero: panel gris con los datos y la foto a la derecha. */
function Hero({ treatment }: Props) {
  const { hero } = treatment.page;
  const facts: [string, string][] = [
    ['Duración', hero.duration],
    ['Plan inicial', hero.plan],
    ['Precio', hero.price],
  ];

  return (
    <section className="container-card tr-hero">
      <div className="tr-hero__panel">
        <p className="tr-hero__crumbs">
          <Link to="/tratamientos">Tratamientos</Link>
          <span aria-hidden="true">/</span>
          {treatment.name}
        </p>
        <Rich as="h1" className="tr-hero__title" text={hero.title} />
        <p className="tr-hero__tagline">{treatment.tagline}</p>
        <p className="tr-hero__desc">{hero.desc}</p>
        <dl className="tr-hero__facts">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <div className="tr-hero__actions">
          <Link to={`/reservas?tratamiento=${treatment.slug}`} className="btn btn--primary">
            Reservar este tratamiento
          </Link>
          <a href="#proceso" className="btn btn--link">
            Ver el proceso
          </a>
        </div>
      </div>
      <img className="tr-hero__img" src={img(hero.img)} alt="" />
    </section>
  );
}

/** 02 · Foto a la izquierda y panel lila con el título abajo. */
function Intro({ treatment }: Props) {
  const { intro } = treatment.page;
  return (
    <section className="container-card tr-split tr-intro">
      <img className="tr-split__img" src={img(intro.img)} alt="" loading="lazy" />
      <div className="tr-intro__panel">
        <Rich as="h2" className="tr-title" text={intro.title} />
        <p className="tr-intro__text">{intro.text}</p>
      </div>
    </section>
  );
}

/** 03 · El proceso: número grande, paso y texto; los círculos cambian de paso y la foto entra desde la izquierda. */
function Process({ treatment }: Props) {
  const steps = treatment.page.process;
  const [active, setActive] = useState(0);
  const step = steps[active];

  return (
    <section className="tr-process" id="proceso">
      <div className="container-card tr-process__desktop">
        <div className="tr-process__card">
          <div className="tr-process__panel">
            <p className="tr-label">El proceso</p>
            <Rich as="h2" className="tr-title tr-process__title" text={common.processTitle} />
            <div className="tr-process__step" key={active} aria-live="polite">
              <p className="tr-process__num">{pad(active)}</p>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
            <div className="tr-process__dots" role="group" aria-label="Pasos de la sesión">
              {steps.map((s, i) => (
                <button key={s.title} aria-pressed={i === active} aria-label={`Paso ${i + 1}: ${s.title}`} onClick={() => setActive(i)} onMouseEnter={() => setActive(i)}>
                  {pad(i)}
                </button>
              ))}
            </div>
          </div>
          <div className="tr-process__images" aria-hidden="true">
            {steps.map((s, i) => (
              <img key={s.title} src={img(s.img)} alt="" loading="lazy" data-state={slide(i, active)} />
            ))}
          </div>
        </div>
      </div>

      {/* Celular: encabezado y pasos en tarjetas que se deslizan. */}
      <div className="tr-process__mobile">
        <div className="container">
          <p className="tr-label">El proceso</p>
          <Rich as="h2" className="tr-title tr-process__title" text={common.processTitle} />
        </div>
        <ol className="scroller tr-cards">
          {steps.map((s, i) => (
            <li key={s.title} className="tr-cards__item">
              <img src={img(s.img)} alt="" loading="lazy" />
              <p className="tr-process__num">{pad(i)}</p>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** 04 · Duración y sesiones: frase y tabla a la izquierda, foto a la derecha. */
function Duration({ treatment }: Props) {
  const { duration } = treatment.page;
  return (
    <section className="container-card tr-split tr-split--reverse tr-duration" id="duracion">
      <img className="tr-split__img" src={img(duration.img)} alt="" loading="lazy" />
      <div className="tr-duration__panel">
        <p className="tr-label">{common.durationLabel}</p>
        <Rich as="h2" className="tr-duration__phrase" text={duration.phrase} />
        <dl className="tr-duration__rows">
          {duration.rows.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** 05 · Cuidados: "pre" / "post" en manuscrita elige la lista. */
function Care({ treatment }: Props) {
  const [moment, setMoment] = useState<'pre' | 'post'>('pre');
  const list = treatment.page.care[moment];

  return (
    <section className="container-card" id="cuidados">
      <div className="tr-care">
        <div className="tr-care__picker">
          <p className="tr-label">Cuidados</p>
          <div className="tr-care__words" role="group" aria-label="Momento">
            {(['pre', 'post'] as const).map((m) => (
              <button key={m} aria-pressed={moment === m} onClick={() => setMoment(m)} onMouseEnter={() => setMoment(m)}>
                {m}
              </button>
            ))}
          </div>
          <p className="tr-care__end">la sesión</p>
        </div>
        <div className="tr-care__list" key={moment}>
          <h2 className="tr-care__title">{moment === 'pre' ? 'Antes de la sesión' : 'Después de la sesión'}</h2>
          <ol>
            {list.map((item, i) => (
              <li key={item}>
                <span>{pad(i)}</span>
                {item}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/** 06 · ¿Es para tu piel?: condiciones en dos columnas. */
function Conditions({ treatment }: Props) {
  return (
    <section className="container-card" id="para-tu-piel">
      <div className="tr-cond">
        <Rich as="h2" className="tr-title tr-cond__title" text={common.conditionsTitle} />
        <p className="tr-cond__intro">{common.conditionsIntro}</p>
        <ol className="tr-cond__list">
          {treatment.page.conditions.map((item, i) => (
            <li key={item}>
              <span>{pad(i)}</span>
              {item}
            </li>
          ))}
        </ol>
        <p className="tr-cond__outro">{common.conditionsOutro}</p>
        <Link to="/reservas?tratamiento=skincoaching" className="btn btn--link">
          Reservar skincoaching
        </Link>
      </div>
    </section>
  );
}

/** 07 · Activos clave: al elegir una palabra cambia la foto y la descripción. */
function Actives({ treatment }: Props) {
  const actives = treatment.page.actives;
  const [active, setActive] = useState(0);

  return (
    <section className="tr-actives" id="activos">
      <div className="container-card tr-actives__desktop">
        <div className="tr-actives__card">
          <div className="tr-actives__images" aria-hidden="true">
            {actives.map((a, i) => (
              <img key={a.word} src={img(a.img)} alt="" loading="lazy" data-state={slide(i, active)} />
            ))}
          </div>
          <div className="tr-actives__panel">
            <p className="tr-label">Activos clave</p>
            <div className="tr-actives__words" role="group" aria-label="Activos clave">
              {actives.map((a, i) => (
                <button key={a.word} aria-pressed={i === active} onClick={() => setActive(i)} onMouseEnter={() => setActive(i)}>
                  {a.word}
                </button>
              ))}
            </div>
            <p className="tr-actives__desc" key={active} aria-live="polite">
              {actives[active].text}
            </p>
            <p className="tr-actives__note">{common.activesNote}</p>
          </div>
        </div>
      </div>

      {/* Celular: tarjetas de 280 que se deslizan. */}
      <div className="tr-actives__mobile">
        <p className="container tr-label">Activos clave</p>
        <ul className="scroller tr-cards tr-cards--actives">
          {actives.map((a) => (
            <li key={a.word} className="tr-cards__item">
              <img src={img(a.img)} alt="" loading="lazy" />
              <h3 className="tr-actives__word">{a.word}</h3>
              <p>{a.text}</p>
            </li>
          ))}
        </ul>
        <p className="container tr-actives__note">{common.activesNote}</p>
      </div>
    </section>
  );
}

/** 08 · Testimonio: una cita grande con puntos para pasar a la siguiente. */
function Quotes() {
  const [active, setActive] = useState(0);
  const quote = common.quotes[active];

  return (
    <section className="container-card tr-quotes" aria-label="Testimonios">
      <div className="tr-quotes__card">
        <figure className="tr-quotes__desktop" key={active}>
          <Rich as="blockquote" className="tr-quotes__text" text={quote.text} />
          <figcaption>{quote.author}</figcaption>
        </figure>
        <div className="tr-quotes__dots" role="group" aria-label="Elegir testimonio">
          {common.quotes.map((q, i) => (
            <button key={q.author} aria-pressed={i === active} aria-label={`Testimonio ${i + 1}`} onClick={() => setActive(i)} />
          ))}
        </div>

        <ul className="scroller tr-quotes__mobile">
          {common.quotes.map((q) => (
            <li key={q.author}>
              <Rich as="blockquote" className="tr-quotes__text" text={q.text} />
              <p className="tr-quotes__author">{q.author}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
