import type { ContactErrors } from '../lib/validation';
import type { Contact } from '../lib/whatsapp';

interface Props {
  value: Contact;
  errors: ContactErrors;
  onChange: (value: Contact) => void;
}

const fields: { key: keyof Contact; label: string; type: string; placeholder: string; autoComplete: string }[] = [
  { key: 'name', label: 'Nombre y apellido', type: 'text', placeholder: 'Tu nombre', autoComplete: 'name' },
  { key: 'phone', label: 'WhatsApp', type: 'tel', placeholder: '+54 9 249 …', autoComplete: 'tel' },
  { key: 'email', label: 'Email', type: 'email', placeholder: 'tu@email.com', autoComplete: 'email' },
];

/** Campos de contacto compartidos por la reserva de turno y el pedido. */
export function ContactFields({ value, errors, onChange }: Props) {
  const set = (key: keyof Contact, v: string) => onChange({ ...value, [key]: v });

  return (
    <div className="contact-fields">
      {fields.map((f) => {
        const id = `contacto-${f.key}`;
        const error = errors[f.key];
        return (
          <div className="field" key={f.key} data-invalid={!!error}>
            <label htmlFor={id}>{f.label}</label>
            <input
              id={id}
              type={f.type}
              value={value[f.key] ?? ''}
              placeholder={f.placeholder}
              autoComplete={f.autoComplete}
              aria-invalid={!!error}
              aria-describedby={error ? `${id}-error` : undefined}
              onChange={(e) => set(f.key, e.target.value)}
            />
            {error && (
              <p className="field__error" id={`${id}-error`}>
                {error}
              </p>
            )}
          </div>
        );
      })}
      <div className="field">
        <label htmlFor="contacto-comment">Comentario (opcional)</label>
        <textarea
          id="contacto-comment"
          rows={3}
          value={value.comment ?? ''}
          placeholder="¿Algo que tengamos que saber?"
          onChange={(e) => set('comment', e.target.value)}
        />
      </div>
    </div>
  );
}
