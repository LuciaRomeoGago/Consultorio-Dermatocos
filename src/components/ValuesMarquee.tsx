import './ValuesMarquee.css';

interface Props {
  items: string[];
}

/**
 * "Barra de valores": en escritorio los cuatro valores quedan quietos y repartidos a lo ancho;
 * en celular la cinta se desplaza sola. La copia que hace el loop queda oculta para lectores de pantalla.
 */
export function ValuesMarquee({ items }: Props) {
  return (
    <div className="values-bar">
      <div className="values-bar__track">
        <ul className="values-bar__list">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <ul className="values-bar__list values-bar__list--copy" aria-hidden="true">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
