import { Button } from '../components/Button';
import { Rich } from '../components/Rich';

export function NotFound() {
  return (
    <section className="section container stack">
      <Rich as="h1" className="title" text={[['esta página ', 0], ['no existe', 1]]} />
      <p className="lead">Puede que el enlace esté mal escrito o que la página se haya movido.</p>
      <div className="actions">
        <Button to="/">Volver al inicio</Button>
        <Button to="/tratamientos" variant="link">
          Ver tratamientos
        </Button>
      </div>
    </section>
  );
}
